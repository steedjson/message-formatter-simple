export class AlignRenderer {
  private width: number;

  constructor(width: number = 39) {
    this.width = width;
  }

  public getDisplayWidth(str: string): number {
    let width = 0;
    const chars = [...str];
    for (const char of chars) {
      const code = char.codePointAt(0);
      if (code === 0xFE0F) continue;
      if (char.length > 1 || (code !== undefined && code > 255)) {
        width += 2;
      } else {
        width += 1;
      }
    }
    return width;
  }

  public renderLine(content: string, leftPadding: number = 2): string {
    const visibleLength = this.getDisplayWidth(content);
    const totalInnerWidth = this.width - 2; 
    let rightPadding = totalInnerWidth - leftPadding - visibleLength;
    if (rightPadding < 0) rightPadding = 0; 
    return '│' + ' '.repeat(leftPadding) + content + ' '.repeat(rightPadding) + '│';
  }

  public renderTopBorder(): string {
    return '┌' + '─'.repeat(this.width - 2) + '┐';
  }
  public renderBottomBorder(): string {
    return '└' + '─'.repeat(this.width - 2) + '┘';
  }
  public renderSeparatorBorder(): string {
    return '├' + '─'.repeat(this.width - 2) + '┤';
  }

  public renderDoubleLine(content: string, leftPadding: number = 2): string {
    const doubleWidth = 33; 
    const visibleLength = this.getDisplayWidth(content);
    const totalInnerWidth = doubleWidth - 2; 
    let rightPadding = totalInnerWidth - leftPadding - visibleLength;
    if (rightPadding < 0) rightPadding = 0; 
    return '║' + ' '.repeat(leftPadding) + content + ' '.repeat(rightPadding) + '║';
  }

  public renderDoubleTopBorder(): string {
    const doubleWidth = 33;
    return '╔' + '═'.repeat(doubleWidth - 2) + '╗';
  }
  public renderDoubleBottomBorder(): string {
    const doubleWidth = 33;
    return '╚' + '═'.repeat(doubleWidth - 2) + '╝';
  }
  public renderDoubleSeparatorBorder(): string {
    const doubleWidth = 33;
    return '╠' + '═'.repeat(doubleWidth - 2) + '╣';
  }

  public generateProgressBar(percent: number, length: number = 10, fillChar: string = '█', emptyChar: string = '░'): string {
    let p = Math.max(0, Math.min(100, percent));
    const filled = Math.round((p / 100) * length);
    const empty = length - filled;
    return fillChar.repeat(filled) + emptyChar.repeat(empty);
  }
}
