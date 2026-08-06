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
  const tokenSaved = $persistentStore.write(match[1], TOKEN_KEY);
  const ua = getHeader($request.headers, "user-agent");
  const uaSaved = !ua || $persistentStore.write(ua, UA_KEY);

  if (tokenSaved && uaSaved) {
    console.log("[iios.club] token 与 User-Agent 获取成功");
    $notification.post("iios.club", "✅ 登录凭证获取成功", "现在可以运行定时签到脚本");
  } else {
    $notification.post("iios.club", "❌ 保存失败", "请检查 Loon 本地存储权限");
  }
} else {
  console.log("[iios.club] 当前请求没有 Authorization: Basic 请求头");
}

$done({});
