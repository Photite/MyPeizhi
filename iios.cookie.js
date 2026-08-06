// iios.club 登录凭证抓取脚本（Loon http-request）
// 保存 Authorization 中 Basic 后面的 token、User-Agent 与 Cloudflare Cookie。

const TOKEN_KEY = "iios.club.token";
const UA_KEY = "iios.club.ua";
const COOKIE_KEY = "iios.club.cookie";

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
  const cookieHeader = getHeader($request.headers, "cookie");
  const clearanceMatch = /(?:^|;\s*)cf_clearance=([^;]+)/i.exec(cookieHeader);
  const cookie = clearanceMatch ? "cf_clearance=" + clearanceMatch[1] : "";
  const oldToken = $persistentStore.read(TOKEN_KEY) || "";
  const oldUA = $persistentStore.read(UA_KEY) || "";
  const oldCookie = $persistentStore.read(COOKIE_KEY) || "";
  const tokenChanged = token !== oldToken;
  const uaChanged = Boolean(ua && ua !== oldUA);
  const cookieChanged = Boolean(cookie && cookie !== oldCookie);

  // 同一个页面通常会连续请求多个 /api/ 接口。凭证未变化时不重复写入和通知。
  if (!tokenChanged && !uaChanged && !cookieChanged) {
    console.log("[iios.club] 登录凭证未变化，跳过重复保存");
  } else {
    const tokenSaved = !tokenChanged || $persistentStore.write(token, TOKEN_KEY);
    const uaSaved = !uaChanged || $persistentStore.write(ua, UA_KEY);
    const cookieSaved = !cookieChanged || $persistentStore.write(cookie, COOKIE_KEY);

    if (tokenSaved && uaSaved && cookieSaved) {
      console.log("[iios.club] token、User-Agent 与 Cookie 已更新");
      const cookieStatus = cookie || oldCookie
        ? "Cloudflare Cookie 已同步"
        : "未检测到 cf_clearance；若签到 403，请刷新网站后重新抓取";
      $notification.post("iios.club", "✅ 登录凭证已更新", cookieStatus);
    } else {
      $notification.post("iios.club", "❌ 保存失败", "请检查 Loon 本地存储权限");
    }
  }
} else {
  console.log("[iios.club] 当前请求没有 Authorization: Basic 请求头");
}

$done({});
