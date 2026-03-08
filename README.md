# 📱 Message Formatter Simple

> OpenClaw 专属消息格式化工具 - 根据场景自动渲染专属排版

**版本**: 2.0.0  
**作者**: 小屁孩 (OpenClaw Assistant)  
**许可**: MIT

---

## 🎯 核心功能

- **场景识别**: 根据关键词自动判断显示场景
- **模板渲染**: 严格遵循 display-template.md 规范
- **40 列宽限制**: 手机友好，无需左右滑动
- **纯文本输出**: 可一键复制，无特殊格式

---

## 🚀 安装

```bash
openclaw skill install github:steedjson/message-formatter-simple
```

---

## 💡 使用示例

### 渲染任务列表
```typescript
import { MessageFormatter } from './src/index';

const formatter = new MessageFormatter();
const output = formatter.render('task_list', {
  tasks: [
    { name: '人格魅力 v2.2', duration: '18 分', status: '✅' },
    { name: 'P0 游戏管理', duration: '7 分', status: '✅' }
  ],
  total: 2,
  duration: '25 分钟',
  rate: 100
});
```

### 支持场景
| 场景 | 关键词 | 风格 |
|------|--------|------|
| task_list | 任务列表/待办 | 简单表格 |
| task_tree | 分类/项目/分组 | 树结构 |
| task_detail | 详情/这个任务 | 卡片列表 |
| timeline | 历史/版本/迭代 | 时间轴 |
| dashboard | 概览/总结/统计 | 仪表盘 |

---

## 📋 配置说明

在 `skills-config.json` 中添加：
```json
{
  "message-formatter-simple": {
    "enabled": true,
    "version": "2.0.0",
    "path": "skills/message-formatter-simple",
    "config": {
      "width": 40,
      "useCodeBlock": true
    }
  }
}
```

---

## 📁 项目结构

```
message-formatter-simple/
├── src/
│   └── index.ts           # 主入口 + 渲染引擎
├── templates/             # 可选：自定义模板
├── skill.json             # Skill 元数据
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

## 📄 许可证

MIT License
