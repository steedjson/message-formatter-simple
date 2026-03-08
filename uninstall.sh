#!/bin/bash
# Message Formatter Simple - OpenClaw 一键卸载脚本

set -e

INSTALL_DIR="$HOME/.openclaw/workspace/skills/message-formatter"

echo "🗑️  Message Formatter Simple 卸载程序"
echo "====================================="
echo ""

# 确认卸载
read -p "确定要卸载 Message Formatter 吗？[y/N] " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消卸载"
    exit 1
fi

# 检查是否已安装
if [ ! -d "$INSTALL_DIR" ]; then
    echo "⚠️  Message Formatter 未安装"
    exit 0
fi

# 卸载
echo "📁 正在卸载..."
rm -rf "$INSTALL_DIR"
echo "✅ 卸载完成"
echo ""
echo "📖 重新安装："
echo "  cd message-formatter-simple"
echo "  ./install.sh"
echo ""
