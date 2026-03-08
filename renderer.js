"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlignRenderer = void 0;
class AlignRenderer {
    constructor(width = 39) {
        this.width = width;
    }
    getDisplayWidth(str) {
        let width = 0;
        const chars = [...str];
        for (const char of chars) {
            const code = char.codePointAt(0);
            if (code === 0xFE0F)
                continue;
            if (char.length > 1 || (code !== undefined && code > 255)) {
                width += 2;
            }
            else {
                width += 1;
            }
        }
        return width;
    }
    renderLine(content, leftPadding = 2) {
        const visibleLength = this.getDisplayWidth(content);
        const totalInnerWidth = this.width - 2;
        let rightPadding = totalInnerWidth - leftPadding - visibleLength;
        if (rightPadding < 0)
            rightPadding = 0;
        return '│' + ' '.repeat(leftPadding) + content + ' '.repeat(rightPadding) + '│';
    }
    renderTopBorder() {
        return '┌' + '─'.repeat(this.width - 2) + '┐';
    }
    renderBottomBorder() {
        return '└' + '─'.repeat(this.width - 2) + '┘';
    }
    renderSeparatorBorder() {
        return '├' + '─'.repeat(this.width - 2) + '┤';
    }
    renderDoubleLine(content, leftPadding = 2) {
        const doubleWidth = 33;
        const visibleLength = this.getDisplayWidth(content);
        const totalInnerWidth = doubleWidth - 2;
        let rightPadding = totalInnerWidth - leftPadding - visibleLength;
        if (rightPadding < 0)
            rightPadding = 0;
        return '║' + ' '.repeat(leftPadding) + content + ' '.repeat(rightPadding) + '║';
    }
    renderDoubleTopBorder() {
        const doubleWidth = 33;
        return '╔' + '═'.repeat(doubleWidth - 2) + '╗';
    }
    renderDoubleBottomBorder() {
        const doubleWidth = 33;
        return '╚' + '═'.repeat(doubleWidth - 2) + '╝';
    }
    renderDoubleSeparatorBorder() {
        const doubleWidth = 33;
        return '╠' + '═'.repeat(doubleWidth - 2) + '╣';
    }
    generateProgressBar(percent, length = 10, fillChar = '█', emptyChar = '░') {
        let p = Math.max(0, Math.min(100, percent));
        const filled = Math.round((p / 100) * length);
        const empty = length - filled;
        return fillChar.repeat(filled) + emptyChar.repeat(empty);
    }
}
exports.AlignRenderer = AlignRenderer;
