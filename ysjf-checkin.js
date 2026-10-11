/* 影视飓风Club / Loon / 2026-10-12
 * Credentials are captured from successful responses and stored only in Loon.
 * Single account: the last successfully captured account replaces the previous one.
 * No dependencies. No credentials embedded. No automatic login or reward claims.
 */
(function () {
  "use strict";
  var NAME = "影视飓风签到";
  var KEY = "ysjf.checkin.account.v1";
  var LOCK = "ysjf.checkin.lock.v1";
  var SHOP = "149536603";
  var APP = "wx92782ef90ebc836d";
  var BASE = "https://h5.youzan.com/wscump/checkin/";
  var PATHS = ["check-in-info.json", "get_activity_by_yzuid_v2.json", "checkinV2.json"];
  var intercepted = typeof $request !== "undefined";
  var lockId = null;
  var completed = false;

  function notice(title, message) {
    console.log(NAME + "：" + title + "；" + message);
    $notification.post(NAME, title, message);
  }
  function finish() {
    if (completed) return;
    completed = true;
    if (lockId && $persistentStore.read(LOCK) === lockId) {
      $persistentStore.write(undefined, LOCK);
    }
    if (intercepted) $done({});
    else $done();
  }
  function parse(text) {
    try { return JSON.parse(text || "null"); } catch (_) { return null; }
  }
  function query(url) {
    var out = Object.create(null);
    (url.split("?")[1] || "").split("#")[0].split("&").forEach(function (part) {
      if (!part) return;
      var pos = part.indexOf("=");
      var k = pos < 0 ? part : part.slice(0, pos);
      var v = pos < 0 ? "" : part.slice(pos + 1);
      out[decodeURIComponent(k.replace(/\+/g, " "))] = decodeURIComponent(v.replace(/\+/g, " "));
    });
    return out;
  }
  function headers(source) {
    var allowed = ["content-type", "extra-data", "user-agent", "referer", "cookie", "authorization"];
    var out = {};
    Object.keys(source || {}).forEach(function (name) {
      var key = name.toLowerCase();
      if (allowed.indexOf(key) >= 0 && typeof source[name] === "string") out[key] = source[name];
    });
    out["content-type"] = "application/json";
    return out;
  }
  function capture() {
    if (typeof $response === "undefined" || $request.method !== "GET") return;
    var url = $request.url || "";
    if (url.indexOf(BASE) !== 0) return;
    var path = url.slice(BASE.length).split("?")[0];
    if (PATHS.indexOf(path) < 0) return;
    var q = query(url);
    if (q.kdt_id !== SHOP || q.app_id !== APP || !q.access_token) return;
    var status = Number($response.status || $response.statusCode);
    var result = parse($response.body);
    if (status !== 200 || !result || result.code !== 0 || !result.data) return;
    if (path === "check-in-info.json" && String(result.data.activityOwnerKdtId) !== SHOP) return;
    var previous = parse($persistentStore.read(KEY));
    var account = {
      shop: SHOP, app: APP, token: q.access_token,
      headers: headers($request.headers), capturedAt: new Date().toISOString()
    };
    if (!$persistentStore.write(JSON.stringify(account), KEY)) {
      notice("凭证保存失败", "请检查 Loon 本地存储后重新打开签到页。");
      return;
    }
    if (!previous || previous.token !== account.token) {
      notice("凭证已保存", "可手动运行签到任务检查；登录失效后重新打开小程序签到页即可更新。");
    }
  }
  function call(account, path, params) {
    var values = Object.assign({}, params || {}, {
      app_id: APP, kdt_id: SHOP, access_token: account.token
    });
    var url = BASE + path + "?" + Object.keys(values).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(String(values[k]));
    }).join("&");
    return new Promise(function (resolve, reject) {
      $httpClient.get({
        url: url, headers: headers(account.headers), timeout: 10000,
        "auto-redirect": false, "auto-cookie": false
      }, function (error, response, body) {
        // Never log raw errors, request URLs, headers, or bodies: these may contain secrets.
        if (error) { reject(new Error("网络请求失败或超时")); return; }
        var status = Number(response && (response.status || response.statusCode));
        if (status === 401 || status === 403) {
          reject(new Error("登录失效或请求被拒绝，请重新打开小程序签到页更新凭证")); return;
        }
        if (status !== 200) {
          reject(new Error("HTTP 状态异常（" + (isFinite(status) ? status : "未知") + "）")); return;
        }
        var result = parse(body);
        if (!result || typeof result !== "object") {
          reject(new Error("响应不是有效 JSON，可能需要重新登录或处理验证")); return;
        }
        if (result.code !== 0) {
          var code = /^-?\d+$/.test(String(result.code)) ? String(result.code) : "未知";
          reject(new Error("业务接口返回错误（code=" + code + "），请打开小程序检查登录或验证提示")); return;
        }
        if (!result.data || typeof result.data !== "object") {
          reject(new Error("接口缺少 data，无法确认结果")); return;
        }
        resolve(result.data);
      });
    });
  }
  function days(state) {
    return Number.isInteger(state.continuesDay) && state.continuesDay >= 0
      ? "连续签到 " + state.continuesDay + " 天。" : "";
  }
  async function run() {
    var account = parse($persistentStore.read(KEY));
    if (!account || account.shop !== SHOP || account.app !== APP || !account.token) {
      notice("尚未获取凭证", "启用插件及 HTTPS 解密后，打开影视飓风Club小程序的签到页。");
      return;
    }
    var now = Date.now();
    var held = parse($persistentStore.read(LOCK));
    if (held && typeof held.until === "number" && held.until > now && held.until - now <= 90000) {
      console.log(NAME + "：另一个签到任务正在执行，本次跳过。");
      return;
    }
    lockId = JSON.stringify({until: now + 90000, id: String(now) + Math.random()});
    if (!$persistentStore.write(lockId, LOCK)) {
      lockId = null;
      notice("无法启动", "本地存储不可用，请检查 Loon 后重试。");
      return;
    }
    // Discover the current activity instead of permanently hard-coding the HAR's activity ID.
    var info = await call(account, "check-in-info.json");
    if (String(info.activityOwnerKdtId) !== SHOP || !/^\d+$/.test(String(info.checkInId)) || Number(info.checkInId) <= 0) {
      notice("活动信息异常", "未找到属于影视飓风Club的有效签到活动，请打开小程序确认。");
      return;
    }
    var params = {checkinId: info.checkInId};
    var state = await call(account, "get_activity_by_yzuid_v2.json", params);
    if (state.isCheckin === true) {
      notice("今日已签到", days(state) + "本次无需重复签到。");
      return;
    }
    if (state.isOpen !== true || state.isCheckin !== false) {
      notice("未执行签到", "活动未开放或签到状态无法确认，请打开小程序检查。");
      return;
    }
    var result = null;
    var submittedError = "";
    try {
      result = await call(account, "checkinV2.json", params);
    } catch (error) {
      submittedError = error.message;
    }
    // Never resend the mutation after a timeout. A read-only query checks whether it succeeded.
    var after = null;
    try { after = await call(account, "get_activity_by_yzuid_v2.json", params); } catch (_) {}
    if (after && after.isCheckin === true) {
      var credits = [];
      if (result && result.success === true && Array.isArray(result.list)) {
        result.list.forEach(function (reward) {
          var title = reward && reward.infos && reward.infos.title;
          // Only show known numeric credit labels, not arbitrary server text.
          if (reward.isSuccess === true && typeof title === "string" && /^\d+积分$/.test(title)) credits.push(title);
        });
      }
      notice("签到已确认", days(after) + (credits.length ? "奖励：" + credits.join("、") + "。" : "服务器已确认今日签到。"));
    } else if (result && result.success === true) {
      notice("接口返回签到成功", "后续状态尚未确认，请打开小程序核对；本次不重复提交。");
    } else {
      notice("签到结果未确认", (submittedError ? submittedError + "。" : "未取得明确的签到成功结果。") + "请打开小程序核对，本次不重复提交。");
    }
  }
  (async function () {
    try {
      if (intercepted) capture();
      else await run();
    } catch (error) {
      // Only deliberately constructed errors from call() are printed in scheduled mode.
      if (intercepted) notice("凭证捕获异常", "请重新打开签到页；原请求与响应保持不变。");
      else notice("任务未完成", error instanceof Error && /^(网络请求|登录失效|HTTP 状态|响应不是|业务接口|接口缺少)/.test(error.message)
        ? error.message : "执行异常，请重新获取凭证并检查脚本配置。");
    } finally { finish(); }
  })();
})();
