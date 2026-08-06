// iios.club 登录凭证抓取脚本（Loon http-request）
// 仅保存 Authorization 中 Basic 后面的 token 与对应 User-Agent。

const TOKEN_KEY = "iios.club.token";
const UA_KEY = "iios.club.ua";

function getHeader(headers, name) {
  const wanted = name.toLowerCase();
  for (const key of Object.keys(headers || {})) {
    if (key.toLowerCase() === wanted) return headers[key];
  }
  return "";
}

const authorization = getHeader($request.headers, "authorization");
const match = /^Basic\s+(.+)$/i.exec(authorization);

if (match) {
  const token = match[1];
  const ua = getHeader($request.headers, "user-agent");
  const oldToken = $persistentStore.read(TOKEN_KEY) || "";
  const oldUA = $persistentStore.read(UA_KEY) || "";
  const tokenChanged = token !== oldToken;
  const uaChanged = Boolean(ua && ua !== oldUA);

  // 同一个页面通常会连续请求多个 /api/ 接口。凭证未变化时不重复写入和通知。
  if (!tokenChanged && !uaChanged) {
    console.log("[iios.club] 登录凭证未变化，跳过重复保存");
  } else {
    const tokenSaved = !tokenChanged || $persistentStore.write(token, TOKEN_KEY);
    const uaSaved = !uaChanged || $persistentStore.write(ua, UA_KEY);

    if (tokenSaved && uaSaved) {
      console.log("[iios.club] token 与 User-Agent 已更新");
      $notification.post("iios.club", "✅ 登录凭证已更新", "现在可以运行定时签到脚本");
    } else {
      $notification.post("iios.club", "❌ 保存失败", "请检查 Loon 本地存储权限");
    }
  }
} else {
  console.log("[iios.club] 当前请求没有 Authorization: Basic 请求头");
}

$done({});
