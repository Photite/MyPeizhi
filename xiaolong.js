/**
 * 骁友会（骁龙）自动签到 for Loon
 * Version: 2026.09.03.1
 *
 * HTTP request mode: capture userId/sessionKey from the mini program.
 * Scheduled mode: query today's state, then check in when necessary.
 */

const NAME = "骁友会签到";
const VERSION = "2026.09.03.1";
const STORE_KEY = "xiaolong.qualcomm.auth.v1";

let finished = false;

function log(message) {
  console.log(`[${NAME}] ${message}`);
}

function notify(subtitle, body = "") {
  $notification.post(NAME, subtitle, body);
}

function finish() {
  if (finished) return;
  finished = true;
  if (typeof $request !== "undefined") $done({});
  else $done();
}

function headerValue(headers, wanted) {
  const target = wanted.toLowerCase();
  const key = Object.keys(headers || {}).find(item => item.toLowerCase() === target);
  return key ? String(headers[key] || "") : "";
}

function queryValue(url, wanted) {
  const escaped = wanted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(url || "").match(new RegExp(`[?&]${escaped}=([^&#]*)`, "i"));
  if (!match) return "";
  try {
    return decodeURIComponent(match[1].replace(/\+/g, " "));
  } catch (_) {
    return match[1];
  }
}

function parseJSON(text) {
  try {
    return JSON.parse(text || "{}");
  } catch (_) {
    throw new Error(`返回内容不是 JSON（${String(text || "").length} bytes）`);
  }
}

function isApiSuccess(payload) {
  return Number(payload && payload.code) === 200;
}

function isSigned(value) {
  return value === true || value === 1 || value === "1";
}

function loadAuth() {
  const raw = $persistentStore.read(STORE_KEY);
  if (!raw) return null;
  try {
    const auth = JSON.parse(raw);
    return auth && auth.userId && auth.sessionKey ? auth : null;
  } catch (_) {
    return null;
  }
}

function captureAuth() {
  const headers = $request.headers || {};
  const userId = headerValue(headers, "userId") || queryValue($request.url, "userId");
  const sessionKey = headerValue(headers, "sessionKey");

  if (!userId || !sessionKey) {
    log(`未捕获：userId=${userId ? "有" : "无"} sessionKey=${sessionKey ? "有" : "无"}`);
    return;
  }

  const previous = loadAuth();
  const auth = {
    userId,
    sessionKey,
    referer: headerValue(headers, "Referer"),
    userAgent: headerValue(headers, "User-Agent"),
    capturedAt: new Date().toISOString(),
  };
  const changed = !previous || previous.userId !== userId || previous.sessionKey !== sessionKey;
  const saved = $persistentStore.write(JSON.stringify(auth), STORE_KEY);

  log(`凭据捕获：userId=有 sessionKey=有 changed=${changed} saved=${saved}`);
  if (saved && changed) notify("凭据获取成功", "可以在脚本页面手动运行一次测试签到");
  if (!saved) notify("凭据保存失败", "请检查 Loon 持久化存储后重试");
}

function httpGet(url, headers) {
  return new Promise((resolve, reject) => {
    $httpClient.get({ url, headers }, (error, response, body) => {
      if (error) return reject(new Error(String(error)));
      const status = Number(response && (response.status || response.statusCode) || 0);
      if (status < 200 || status >= 300) return reject(new Error(`HTTP ${status || "未知"}`));
      try {
        resolve(parseJSON(body));
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

function requestHeaders(auth) {
  const headers = {
    userId: String(auth.userId),
    sessionKey: String(auth.sessionKey),
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  };
  if (auth.referer) headers.Referer = auth.referer;
  if (auth.userAgent) headers["User-Agent"] = auth.userAgent;
  return headers;
}

function authError(payload) {
  const message = String(payload && (payload.message || payload.msg) || "接口返回失败");
  return /登录|失效|过期|授权|session|token/i.test(message);
}

async function runCheckIn() {
  log(`开始，版本 ${VERSION}`);
  const auth = loadAuth();
  if (!auth) {
    notify("缺少登录凭据", "请开启 MITM，打开微信里的骁友会小程序并进入任务中心");
    return;
  }

  const base = "https://qualcomm.boysup.cn/qualcomm-app/api/user";
  const suffix = `?userId=${encodeURIComponent(auth.userId)}`;
  const headers = requestHeaders(auth);
  const state = await httpGet(`${base}/signList${suffix}`, headers);

  if (!isApiSuccess(state)) {
    const message = String(state.message || state.msg || `code=${state.code}`);
    if (authError(state)) notify("凭据可能已失效", `${message}；请重新打开小程序获取凭据`);
    else notify("查询签到状态失败", message);
    return;
  }

  const stateData = state.data || {};
  if (isSigned(stateData.isSignToday)) {
    const continuity = stateData.signContinuityMonth;
    notify("今日已签到", continuity == null ? "无需重复签到" : `本月连续签到 ${continuity} 天`);
    return;
  }

  const result = await httpGet(`${base}/signIn${suffix}`, headers);
  if (!isApiSuccess(result)) {
    const message = String(result.message || result.msg || `code=${result.code}`);
    if (authError(result)) notify("签到凭据已失效", `${message}；请重新打开小程序获取凭据`);
    else notify("签到失败", message);
    return;
  }

  const data = result.data || {};
  if (!isSigned(data.state)) {
    notify("签到结果待确认", String(result.message || "接口未返回成功状态"));
    return;
  }

  const reward = data.coreCoin;
  notify("签到成功", reward == null ? "已完成今日签到" : `获得 ${reward} 骁龙币`);
}

(async () => {
  if (typeof $request !== "undefined") captureAuth();
  else await runCheckIn();
})()
  .catch(error => {
    log(`异常：${error && error.message ? error.message : error}`);
    notify("运行异常", `${error && error.message ? error.message : error}\n请重新打开小程序获取凭据后再试`);
  })
  .finally(finish);

