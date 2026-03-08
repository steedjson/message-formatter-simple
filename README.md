# Message Formatter Simple

OpenClaw 消息格式化工具 - 零依赖，开箱即用

## 🚀 安装

```bash
# 复制到 skills 目录
cp -r message-formatter-simple ~/.openclaw/workspace/skills/message-formatter
```

## 💡 使用

```bash
# 格式化消息
openclaw message-formatter format task_complete telegram task_name="测试" status="已完成"

# 列出模版
openclaw message-formatter list
```

## 📦 支持模版

- `task_complete` - 任务完成通知
- `task_progress` - 任务进度更新
- `error_alert` - 错误告警
- `status` - 状态通知

## 🌐 支持平台

- `telegram` - Telegram（默认）
- `wechat` - 微信
- `discord` - Discord
- `text` - 纯文本

## ✅ 特点

- ✅ 零依赖 - 无需 npm/pip
- ✅ 纯配置 - Markdown + TypeScript
- ✅ 开箱即用 - 放入 skills 即可用
- ✅ 易扩展 - 添加 MD 文件即可新模版
