# Message Formatter Simple

OpenClaw 消息格式化工具 - 零依赖，开箱即用

## 🚀 安装

### 方式 1: 一键安装（推荐）

```bash
cd message-formatter-simple
./install.sh
```

### 方式 2: 手动安装

```bash
cp -r message-formatter-simple ~/.openclaw/workspace/skills/message-formatter
```

### 方式 3: OpenClaw 命令

```bash
openclaw skill install github:steedjson/message-formatter-simple
```

## 💡 使用

### OpenClaw 命令

```bash
# 格式化消息
openclaw message-formatter format task_complete telegram task_name="测试" status="已完成"

# 列出模版
openclaw message-formatter list

# 预览模版
openclaw message-formatter preview task_complete
```

### 代码调用

```typescript
import { format, listTemplates } from './index.ts';

// 格式化消息
const message = format('task_complete', 'telegram', {
  task_name: '测试任务',
  status: '已完成'
});

// 列出模版
const templates = listTemplates();
```

## 📦 支持模版

- `task_complete` - 任务完成通知
- `task_progress` - 任务进度更新
- `error_alert` - 错误告警
- `status` - 状态通知

## 🌐 支持平台

- `auto` - 自动检测（默认）
- `telegram` - Telegram
- `wechat` - 微信
- `dingtalk` - 钉钉
- `feishu` - 飞书
- `slack` - Slack
- `discord` - Discord
- `text` - 纯文本

### 自动检测

支持通过环境变量自动检测平台：

```bash
# 飞书
export FEISHU_WEBHOOK=xxx

# 钉钉
export DINGTALK_WEBHOOK=xxx

# Slack
export SLACK_WEBHOOK_URL=xxx

# Discord
export DISCORD_WEBHOOK_URL=xxx
```

运行 `openclaw message-formatter detect` 查看当前检测到的平台。

## ✅ 特点

- ✅ 零依赖 - 无需 npm/pip
- ✅ 纯配置 - Markdown + TypeScript
- ✅ 开箱即用 - 放入 skills 即可用
- ✅ 易扩展 - 添加 MD 文件即可新模版
