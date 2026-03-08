# 📱 message-formatter-simple 重构规格

**版本**: 3.0.0  
**创建时间**: 2026-03-09 01:05  
**作者**: 智能宇宙孵化任务

---

## 🎯 重构目标

根据小主人的专属显示效果功能流程，重构 message-formatter-simple 项目，使其：

1. **支持 5 大场景自动识别**（关键词匹配）
2. **100% 兼容 display-*.md 配置**
3. **符合官方 Skill 规范**（skill.json）
4. **可一键安装启用**

---

## 📋 需求规格

### 1. 场景自动识别

基于 `memory/display-strategy.md` 定义的场景识别规则：

| 场景 | 关键词 | 风格 | 模板 |
|------|--------|------|------|
| task_list | 任务列表、待办、进行中 | 简单表格 | display-template.md |
| task_tree | 分类、项目、分组 | 树结构 | display-template.md |
| task_detail | 详情、这个任务、那个任务 | 卡片列表 | display-template.md |
| timeline | 历史、版本、迭代、时间线 | 时间轴 | display-template.md |
| dashboard | 概览、总结、统计、进度 | 仪表盘 | display-template.md |

**默认规则**：
- 无明确场景时，有进行中任务 → dashboard
- 无进行中任务 → task_list

### 2. 显示模板规范

严格遵循 `memory/display-template.md`：

- **40 列宽限制**：所有输出宽度 ≤40 字符
- **单线边框**：只用 `┌─┐│└─┘├─┤━`
- **可复制**：纯文本，无特殊格式
- **手机友好**：无需左右滑动
- **情感化**：人家、小主人等称呼

### 3. 官方 Skill 规范

符合 OpenClaw 官方 skill.json 格式：

```json
{
  "name": "message-formatter-simple",
  "version": "3.0.0",
  "description": "OpenClaw 专属消息格式化工具，根据场景自动渲染专属排版模板。",
  "author": "小屁孩 (OpenClaw Assistant)",
  "license": "MIT",
  "tags": ["formatter", "message", "template", "display", "ocw"],
  "entry": "src/index.ts",
  "commands": [
    {
      "name": "render",
      "description": "根据场景渲染消息",
      "usage": "/render --scene <场景> --data <JSON 数据>",
      "parameters": {...}
    },
    {
      "name": "auto",
      "description": "自动识别场景并渲染",
      "usage": "/auto --text <文本> --data <JSON 数据>",
      "parameters": {...}
    }
  ]
}
```

### 4. 项目结构

```
message-formatter-simple/
├── src/
│   ├── index.ts           # 主入口
│   ├── scene-detector.ts  # 场景识别引擎
│   ├── renderer.ts        # 模板渲染引擎
│   └── templates.ts       # 内置模板
├── memory/
│   ├── display-template.md    # 显示模板（引用）
│   └── display-strategy.md    # 显示策略（引用）
├── skill.json             # Skill 元数据（官方规范）
├── package.json           # NPM 配置
├── install.sh             # 一键安装脚本
├── uninstall.sh           # 一键卸载脚本
└── README.md              # 使用文档
```

---

## ✅ 验收标准

### 功能验收
- [ ] 支持 5 大场景自动识别
- [ ] 关键词匹配准确率 >95%
- [ ] 100% 兼容 display-*.md 配置
- [ ] 输出宽度 ≤40 列
- [ ] 使用单线边框字符

### 规范验收
- [ ] skill.json 符合官方规范
- [ ] 包含 commands 定义
- [ ] 包含 parameters 定义
- [ ] 包含 examples
- [ ] 包含 templates 定义

### 安装验收
- [ ] 一键安装脚本可用
- [ ] 安装后立即可用
- [ ] 无需额外配置
- [ ] 卸载干净无残留

---

## 🔧 技术决策

### 1. 场景识别算法
- **方法**：关键词匹配（简单高效）
- **优先级**：精确匹配 > 模糊匹配 > 默认规则
- **扩展性**：支持自定义关键词配置

### 2. 模板渲染引擎
- **方法**：函数式模板渲染
- **参数化**：所有文本可配置
- **可测试**：每个模板独立函数

### 3. 配置加载
- **方式**：启动时加载 display-*.md
- **缓存**：内存缓存，避免重复读取
- **热更新**：检测文件变化自动重载

### 4. 输出格式
- **默认**：纯文本（code block 包裹）
- **可选**：Markdown、Telegram 格式
- **宽度**：严格 40 列限制

---

## 📐 代码质量要求

- **文件大小**：<400 行/文件
- **函数大小**：<50 行/函数
- **嵌套深度**：<4 层
- **错误处理**：显式处理所有错误
- **输入验证**：验证所有用户输入
- **测试覆盖**：>80%（可选）

---

## 🚀 交付物

1. **重构后的源代码**（src/）
2. **官方规范 skill.json**
3. **更新后的 README.md**
4. **一键安装/卸载脚本**
5. **提交到 GitHub**

---

**最后更新**: 2026-03-09 01:05  
**状态**: 待实现
