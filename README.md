# Paperclip 微信小程序 · Loon 独立插件

本目录依据 `miniprogram/README.md` 当前标记为“✅ 维护中”的项目生成，共 11 个独立 `.lpx`。每个插件均直接引用上游脚本，脚本更新后无需重新打包插件。

| 文件 | 项目 | 默认执行时间 |
|---|---|---:|
| `ppmt.lpx` | 泡泡玛特 | 09:00 |
| `tuhu.lpx` | 途虎养车 | 07:17 |
| `haidilao.lpx` | 海底捞 | 07:23 |
| `huisheng.lpx` | 惠省红包墙 | 00:05 |
| `miniso.lpx` | 名创优品 | 07:37 |
| `longde.lpx` | 龙德广场 | 08:05 |
| `lhtj.lpx` | 龙湖天街 | 09:00 |
| `songshan.lpx` | 松山棉店 | 08:20 |
| `wedome.lpx` | 味多美 | 08:10 |
| `bhg.lpx` | 北京华联 | 08:08 |
| `linli.lpx` | 林里 | 10:00 |

## 使用

1. 只导入需要的 `.lpx` 并启用。
2. 确认 Loon 的 MITM 证书已安装并信任。
3. 进入对应微信小程序及其签到、会员或活动页面，收到 Cookie 获取成功通知后即可。
4. 插件会按表中时间每日执行，也可在 Loon 中手动运行对应脚本。

## 注意

- 龙德广场与北京华联使用同一会员体系，请二选一启用，避免重复执行。
- `.lpx` 是 Loon 当前插件后缀；其内容格式与旧 `.plugin` 相同。
- Cookie 保存在 Loon 持久化存储中，请勿公开日志、备份或抓包内容。
- 本目录没有包含上游标记为“已归档”的脚本。

上游清单：https://github.com/MaYIHEI/paperclip/blob/main/miniprogram/README.md
