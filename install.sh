#!/bin/bash
# Message Formatter Simple v3.0.0 - OpenClaw 一键安装脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCLAW_SKILLS_DIR="$HOME/.openclaw/workspace/skills"
INSTALL_DIR="$OPENCLAW_SKILLS_DIR/message-formatter-simple"

echo "🚀 Message Formatter Simple v3.0.0 安装程序"
echo "============================================"
echo ""

# 1. 检查 OpenClaw
echo "📋 步骤 1/4: 检查 OpenClaw"
if ! command -v openclaw &> /dev/null && [ ! -d "$OPENCLAW_SKILLS_DIR" ]; then
    echo "❌ 未检测到 OpenClaw"
    echo "   请确保 OpenClaw 已安装"
    exit 1
fi
echo "✅ OpenClaw 已检测到"
echo ""

# 2. 安装依赖并编译
echo "📦 步骤 2/4: 安装依赖并编译"
cd "$SCRIPT_DIR"

if [ ! -f "package.json" ]; then
    echo "❌ package.json 不存在"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

echo "   安装 NPM 依赖..."
npm install --silent

echo "   编译 TypeScript..."
npm run build --silent

echo "✅ 编译完成"
echo ""

# 3. 创建安装目录
echo "📁 步骤 3/4: 安装到 OpenClaw"
if [ -d "$INSTALL_DIR" ]; then
    echo "⚠️  检测到已安装版本"
    echo "   正在覆盖安装..."
    rm -rf "$INSTALL_DIR"
fi

mkdir -p "$INSTALL_DIR"
cp -r "$SCRIPT_DIR"/src "$INSTALL_DIR/"
cp "$SCRIPT_DIR/skill.json" "$INSTALL_DIR/"
cp "$SCRIPT_DIR/package.json" "$INSTALL_DIR/"
cp "$SCRIPT_DIR/README.md" "$INSTALL_DIR/" 2>/dev/null || true

echo "✅ 安装目录：$INSTALL_DIR"
echo ""

# 4. 验证安装
echo "🔧 步骤 4/4: 验证安装"
if [ -f "$INSTALL_DIR/skill.json" ] && [ -f "$INSTALL_DIR/src/index.js" ]; then
    echo "✅ 文件完整性检查通过"
else
    echo "❌ 文件完整性检查失败"
    exit 1
fi

# 检查配置文件
if [ -f "$HOME/.openclaw/workspace/memory/display-template.md" ] && \
   [ -f "$HOME/.openclaw/workspace/memory/display-strategy.md" ]; then
    echo "✅ 配置文件已存在"
else
    echo "⚠️  配置文件不存在（可选）"
    echo "   工具将使用默认配置运行"
fi
echo ""

# 完成
echo "🎉 安装完成！"
echo ""
echo "📖 使用说明："
echo "  /render --scene task_list --data '{\"tasks\":[...]}'"
echo "  /auto --text \"查看任务列表\" --data '{\"tasks\":[...]}'"
echo "  /list_scenes"
echo "  /preview --scene dashboard"
echo ""
echo "📋 支持的场景："
echo "  • task_list    - 任务列表（简单表格）"
echo "  • task_tree    - 任务分类（树结构）"
echo "  • task_detail  - 任务详情（卡片列表）"
echo "  • timeline     - 版本历史（时间轴）"
echo "  • dashboard    - 总体概览（仪表盘）"
echo ""
echo "🗑️  卸载命令："
echo "  rm -rf $INSTALL_DIR"
echo ""
