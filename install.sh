#!/bin/bash
# Message Formatter Simple - OpenClaw 一键安装脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCLAW_SKILLS_DIR="$HOME/.openclaw/workspace/skills"
INSTALL_DIR="$OPENCLAW_SKILLS_DIR/message-formatter"

echo "🚀 Message Formatter Simple 安装程序"
echo "====================================="
echo ""

# 1. 检查 OpenClaw
echo "📋 步骤 1/3: 检查 OpenClaw"
if ! command -v openclaw &> /dev/null && [ ! -d "$OPENCLAW_SKILLS_DIR" ]; then
    echo "❌ 未检测到 OpenClaw"
    echo "   请确保 OpenClaw 已安装"
    exit 1
fi
echo "✅ OpenClaw 已检测到"
echo ""

# 2. 创建安装目录
echo "📁 步骤 2/3: 安装到 OpenClaw"
if [ -d "$INSTALL_DIR" ]; then
    echo "⚠️  检测到已安装版本"
    read -p "是否覆盖安装？[y/N] " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 取消安装"
        exit 1
    fi
    rm -rf "$INSTALL_DIR"
fi

mkdir -p "$INSTALL_DIR"
cp -r "$SCRIPT_DIR"/* "$INSTALL_DIR/"
echo "✅ 安装目录：$INSTALL_DIR"
echo ""

# 3. 验证安装
echo "🔧 步骤 3/3: 验证安装"
if [ -f "$INSTALL_DIR/skill.json" ] && [ -f "$INSTALL_DIR/index.ts" ]; then
    echo "✅ 文件完整性检查通过"
else
    echo "❌ 文件完整性检查失败"
    exit 1
fi

# 检查模版
TEMPLATE_COUNT=$(ls -1 "$INSTALL_DIR/templates/"*.md 2>/dev/null | wc -l)
if [ "$TEMPLATE_COUNT" -eq 4 ]; then
    echo "✅ 模版检查通过（4 个模版）"
else
    echo "⚠️  模版数量：$TEMPLATE_COUNT/4"
fi
echo ""

# 完成
echo "🎉 安装完成！"
echo ""
echo "📖 使用说明："
echo "  openclaw message-formatter format task_complete telegram task_name=测试"
echo "  openclaw message-formatter list"
echo ""
echo "🗑️  卸载命令："
echo "  rm -rf $INSTALL_DIR"
echo ""
