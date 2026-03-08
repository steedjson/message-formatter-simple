export class AlignRenderer {
  private width: number;

  constructor(width: number = 40) {
    this.width = width;
  }

  /**
   * 计算字符串的显示宽度。中文和全角字符算2，ASCII算1。
   * 这里用简单的正则近似处理，可以后续用wcwidth替换。
   */
  public getDisplayWidth(str: string): number {
    let width = 0;
    // 粗略的正则: 匹配双字节字符(中日韩、emoji等)
    // 更好的做法是依赖 string-width 库，但为了零依赖我们手写近似逻辑
    for (const char of str) {
      // 简单判断: 码点 > 255 的算2个宽度
      if (char.codePointAt(0)! > 255) {
        width += 2;
      } else {
        width += 1;
      }
    }
    // 特殊修正：emoji 有些是由多个码点组成的，如果需要完美，要引入库。
    return width;
  }

  /**
   * 渲染固定宽度的行，用空格填充右边
   */
  public renderLine(content: string, leftPadding: number = 2): string {
    const visibleLength = this.getDisplayWidth(content);
    // 左右边框各占 1 个宽度
    const totalInnerWidth = this.width - 2; 
    let rightPadding = totalInnerWidth - leftPadding - visibleLength;
    
    if (rightPadding < 0) rightPadding = 0; // 溢出保护
    
    return '│' + ' '.repeat(leftPadding) + content + ' '.repeat(rightPadding) + '│';
  }

  /**
   * 生成长度固定的进度条
   */
  public generateProgressBar(percent: number, length: number = 10): string {
    let p = Math.max(0, Math.min(100, percent));
    const filled = Math.round((p / 100) * length);
    const empty = length - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}
