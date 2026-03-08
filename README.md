# 📱 Message Formatter Simple

> OpenClaw 专属消息格式化工具 - 根据场景自动渲染专属排版

**版本**: 3.0.0  
**作者**: 小屁孩 (OpenClaw Assistant)  
**许可**: MIT

---

## 🎯 核心功能

- **场景识别**: 根据关键词自动判断显示场景（5 大场景）
- **模板渲染**: 严格遵循 display-template.md 规范
- **40 列宽限制**: 手机友好，无需左右滑动
- **纯文本输出**: 可一键复制，无特殊格式
- **一键安装**: 开箱即用，无需配置

---

## 🚀 安装

### 方式 1：GitHub 安装（推荐）

```bash
openclaw skill install github:steedjson/message-formatter-simple
```

### 方式 2：本地安装

```bash
cd ~/.openclaw/workspace/projects/message-formatter-simple
npm install
npm run build
```

---

## 💡 使用示例

### 命令 1：渲染指定场景

```bash
/render --scene task_list --data '{"tasks":[{"name":"任务 1","duration":"10 分","status":"✅"}],"total":1,"duration":"10 分钟","rate":100}'
```

### 命令 2：自动识别场景

```bash
/auto --text "查看任务列表" --data '{"tasks":[{"name":"任务 1","duration":"10 分","status":"✅"}]}'
```

### 命令 3：预览模板

```bash
/preview --scene dashboard
```

### 命令 4：列出所有场景

```bash
/list_scenes
```

---

## 📋 支持的场景

| 场景 | 关键词 | 风格 | 用途 |
|------|--------|------|------|
| **task_list** | 任务列表、待办、进行中 | 简单表格 | 查看任务列表 |
| **task_tree** | 分类、项目、分组 | 树结构 | 查看任务分类 |
| **task_detail** | 详情、这个任务、那个任务 | 卡片列表 | 查看单个任务详情 |
| **timeline** | 历史、版本、迭代、时间线 | 时间轴 | 查看版本历史 |
| **dashboard** | 概览、总结、统计、进度 | 仪表盘 | 查看总体概览 |

---

## 📐 显示规范

### 40 列宽限制

所有输出严格控制在 40 列以内，确保手机端完美显示：

```
┌─────────────────────────────────────┐
│  🎉 全部完成！                       │
│  22:38 | 💕 纯欲模式 | 📱 手机版     │
└─────────────────────────────────────┘
```

### 单线边框

只使用简单的单线边框字符：

- 边框：`┌─┐│└─┘├─┤`
- 分隔：`━`
- 进度：`█░`

### 可复制纯文本

所有输出都是纯文本格式，包裹在代码块中，一键即可复制。

---

## 🔧 配置说明

### 配置文件

本工具会自动读取以下配置文件（如果存在）：

- `memory/display-template.md` - 显示模板定义
- `memory/display-strategy.md` - 显示策略定义

### 可选参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | number | 40 | 输出宽度（列数） |
| `useCodeBlock` | boolean | true | 是否使用代码块包裹 |
| `language` | string | "text" | 代码块语言标识 |

---

## 📁 项目结构

```
message-formatter-simple/
├── src/
│   ├── index.ts           # 主入口 + CLI 执行
│   ├── scene-detector.ts  # 场景识别引擎
│   └── renderer.ts        # 模板渲染引擎
├── memory/
│   ├── display-template.md    # 显示模板（引用）
│   └── display-strategy.md    # 显示策略（引用）
├── skill.json             # Skill 元数据（官方规范）
├── package.json           # NPM 配置
├── tsconfig.json          # TypeScript 配置
├── install.sh             # 一键安装脚本
├── uninstall.sh           # 一键卸载脚本
├── SPEC.md                # 重构规格文档
└── README.md              # 使用文档
```

---

## 🎨 设计原则

1. **简洁边框**: 只用 `┌─┐│└─┘`，不用复杂双线
2. **可复制**: 纯文本，无特殊格式
3. **手机友好**: 宽度 40 列内
4. **信息分层**: 标题→内容→行动
5. **情感化**: 人家、小主人等称呼

---

## 🧪 开发

### 构建

```bash
npm run build
```

### 清理

```bash
npm run clean
```

### 测试

```bash
npm test
```

---

## 📄 许可证

MIT License

---

## 🔗 相关链接

- [GitHub 仓库](https://github.com/steedjson/message-formatter-simple)
- [问题反馈](https://github.com/steedjson/message-formatter-simple/issues)
- [OpenClaw 文档](https://docs.openclaw.ai)

---

**最后更新**: 2026-03-09  
**版本**: 3.0.0
