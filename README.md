# iios.club

iios.club 每日签到，使用网站前端原版 WASM 动态生成加密 body、`X-Timestamp` 与 `X-Signature`。

## 文件

- `iios.cookie.js`：登录 token / User-Agent 抓取脚本（HTTP Request）。
- `iios.js`：签到主脚本（Cron）。
- `iios.plugin.template`：Loon 插件模板。

脚本不会内置 HAR 中的账号信息。登录 token 只保存在 Loon 的 `$persistentStore`。

## 使用步骤

1. 将整个 `app/iios/` 目录上传到自己的 GitHub 仓库。
2. 把 `iios.plugin.template` 中两处 `__RAW_BASE__` 替换为自己的 Raw 目录地址。
3. 将文件重命名为 `iios.plugin`，用 Raw 链接导入 Loon。
4. 确认 Loon MITM 证书已安装并信任。
5. 使用 Safari 登录 `https://www.iios.club/`，进入任意会加载账号信息的页面。
6. 收到“✅ 登录凭证获取成功”通知后，手动运行一次 `iios签到` 检查结果。

Raw 目录地址格式：

```text
https://raw.githubusercontent.com/你的用户名/你的仓库/main/app/iios
```

插件 Raw 地址格式：

```text
https://raw.githubusercontent.com/你的用户名/你的仓库/main/app/iios/iios.plugin
```

## Loon 手动配置

不使用插件时也可以分别添加：

```ini
[MITM]
hostname = www.iios.club

[Script]
http-request ^https:\/\/www\.iios\.club\/api\/ tag=iios凭证, script-path=https://raw.githubusercontent.com/你的用户名/你的仓库/main/app/iios/iios.cookie.js, requires-body=false, timeout=10, enable=true
cron "10 8 * * *" script-path=https://raw.githubusercontent.com/你的用户名/你的仓库/main/app/iios/iios.js, tag=iios签到, timeout=60, enable=true
```

## 注意事项

- 当前实现面向 Loon，因为使用了 `$httpClient`、`$persistentStore` 与 `$notification`。
- Loon 脚本引擎必须支持 `WebAssembly.instantiate`；主脚本会主动检测。
- 主脚本会以二进制模式从 iios.club 下载当前已确认的 WASM 文件。
- 网站更新带哈希的 WASM 文件名后，需要同步更新 `iios.js` 顶部的 `wasmUrl`。
- 响应正文也是加密数据。为兼容不同 Loon 构建，默认只依据 HTTP 状态通知服务器是否接受请求。
- 仅用于自己的账号。
