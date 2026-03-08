/**
 * Template Renderer - 模板渲染引擎
 * 
 * 严格遵循 display-template.md 定义的模板规范：
 * - 40 列宽限制
 * - 单线边框（┌─┐│└─┘├─┤━）
 * - 可复制纯文本
 * - 手机友好
 */

export interface TaskInfo {
  name: string;
  duration: string;
  status: string;
  progress?: number;
  model?: string;
  eta?: string;
}

export interface RenderOptions {
  width?: number;
  useCodeBlock?: boolean;
  language?: string;
  timestamp?: string;
  mode?: string;
  platform?: string;
}

const DEFAULT_WIDTH = 38; // 预留 2 列边框
const BORDER = {
  top: '┌',
  topMid: '─',
  topRight: '┐',
  left: '│',
  right: '│',
  bottom: '└',
  bottomMid: '─',
  bottomRight: '┘',
  midLeft: '├',
  midRight: '┤',
  mid: '─',
  separator: '━'
};

export class TemplateRenderer {
  private width: number;
  private useCodeBlock: boolean;
  private language: string;

  constructor(options: RenderOptions = {}) {
    this.width = options.width || DEFAULT_WIDTH;
    this.useCodeBlock = options.useCodeBlock !== false;
    this.language = options.language || 'text';
  }

  /**
   * 渲染任务列表（简单表格风格）
   */
  renderTaskList(tasks: TaskInfo[], total?: number, duration?: string, rate?: number): string {
    const lines: string[] = [];
    
    // 标题行
    lines.push('任务名              耗时    状态');
    lines.push(this.makeSeparator());
    
    // 任务行
    if (tasks && tasks.length > 0) {
      for (const task of tasks) {
        const name = this.pad(task.name, 18);
        const dur = this.pad(task.duration, 6);
        lines.push(`${name}  ${dur}  ${task.status}`);
      }
    }
    
    lines.push(this.makeSeparator());
    
    // 总计行
    const totalStr = total !== undefined ? `${total} 任务` : '--';
    const durStr = duration || '--';
    const rateStr = rate !== undefined ? `${rate}% 完成` : '--';
    lines.push(`总计：${totalStr} | ${durStr} | ${rateStr}`);
    
    return this.wrap(lines.join('\n'));
  }

  /**
   * 渲染任务树（树结构风格）
   */
  renderTaskTree(categories: Record<string, any>): string {
    const lines: string[] = [];
    lines.push('📊 任务状态');
    
    const renderTree = (obj: any, prefix: string = '', isLast: boolean = true) => {
      const connector = isLast ? '└─' : '├─';
      const childPrefix = prefix + (isLast ? '  ' : '│ ');
      
      if (typeof obj === 'object' && obj !== null) {
        const entries = Object.entries(obj);
        entries.forEach(([key, value], index) => {
          const isLastChild = index === entries.length - 1;
          if (typeof value === 'number' || typeof value === 'string') {
            lines.push(`${prefix}${connector} ${key}  ${value}`);
          } else if (typeof value === 'object') {
            lines.push(`${prefix}${connector} ${key}`);
            renderTree(value, childPrefix, isLastChild);
          }
        });
      }
    };
    
    renderTree(categories);
    
    return this.wrap(lines.join('\n'));
  }

  /**
   * 渲染任务详情（卡片列表风格）
   */
  renderTaskDetail(task: {
    name: string;
    duration?: string;
    stats?: string;
    status?: string;
    progress?: number;
    model?: string;
    eta?: string;
  }): string {
    const lines: string[] = [];
    
    lines.push(`【${task.name}】`);
    if (task.duration) lines.push(`  ⏱️ ${task.duration}`);
    if (task.stats) lines.push(`  📊 ${task.stats}`);
    if (task.model) lines.push(`  🤖 ${task.model}`);
    if (task.eta) lines.push(`  ⏰ ${task.eta}`);
    if (task.progress !== undefined) {
      const bar = this.makeProgressBar(task.progress);
      lines.push(`  ${bar} ${task.progress}%`);
    }
    if (task.status) lines.push(`  ✅ ${task.status}`);
    
    return this.wrap(lines.join('\n'));
  }

  /**
   * 渲染时间轴（版本历史风格）
   */
  renderTimeline(events: Array<{
    time: string;
    version: string;
    event: string;
  }>): string {
    const lines: string[] = [];
    
    for (let i = 0; i < events.length; i++) {
      const evt = events[i];
      const isLast = i === events.length - 1;
      
      if (i === 0) {
        lines.push(`${evt.time}  ${evt.version} ${evt.event} ─────●`);
        lines.push('                    │');
      } else if (isLast) {
        lines.push(`${evt.time}  ${evt.version} ${evt.event} ────●`);
      } else {
        lines.push(`${evt.time}  ${evt.version} ${evt.event} ────●───● ${events[i + 1].version} 启动`);
        lines.push('                    │');
      }
    }
    
    return this.wrap(lines.join('\n'));
  }

  /**
   * 渲染仪表盘（总体概览风格）
   */
  renderDashboard(config: {
    title: string;
    progress?: string;
    completed?: string;
    time?: string;
    count?: string;
    progressPercent?: number;
  }): string {
    const innerWidth = this.width - 4; // 减去边框
    const lines: string[] = [];
    
    // 外框
    lines.push(this.makeBoxTop());
    lines.push(this.makeBoxLine(`📊 ${config.title}`, innerWidth));
    lines.push(this.makeBoxSeparator());
    
    if (config.progressPercent !== undefined) {
      const bar = this.makeProgressBar(config.progressPercent, innerWidth - 10);
      lines.push(this.makeBoxLine(`完成率  ${bar}  ${config.progress || ''}`, innerWidth));
    } else if (config.progress) {
      lines.push(this.makeBoxLine(`完成率  ${config.progress}`.padEnd(innerWidth), innerWidth));
    }
    
    if (config.completed) {
      lines.push(this.makeBoxLine(`已完成  ${config.completed}`.padEnd(innerWidth), innerWidth));
    }
    
    lines.push(this.makeBoxSeparator());
    
    const footer: string[] = [];
    if (config.time) footer.push(`⏱️ ${config.time}`);
    if (config.count) footer.push(`📁 ${config.count}`);
    if (footer.length > 0) {
      lines.push(this.makeBoxLine(`  ${footer.join('  |  ')}`, innerWidth));
    }
    
    lines.push(this.makeBoxBottom());
    
    return this.wrap(lines.join('\n'));
  }

  /**
   * 渲染进行中任务卡片
   */
  renderProgressTask(task: {
    name: string;
    duration: string;
    progress: number;
    model?: string;
    eta?: string;
  }): string {
    const lines: string[] = [];
    
    lines.push(this.makeBoxTop());
    lines.push(this.makeBoxLine(`🔄 ${task.name}`, this.width - 4));
    lines.push(this.makeBoxSeparator());
    lines.push(this.makeBoxLine(`⏱️ ${task.duration}  ${this.makeProgressBar(task.progress)} ${task.progress}%`, this.width - 4));
    if (task.model) {
      lines.push(this.makeBoxLine(`🤖 ${task.model}`, this.width - 4));
    }
    if (task.eta) {
      lines.push(this.makeBoxLine(`⏰ 预计 ${task.eta}`, this.width - 4));
    }
    lines.push(this.makeBoxBottom());
    
    return this.wrap(lines.join('\n'));
  }

  /**
   * 渲染页脚
   */
  renderFooter(message: string, actions: string[] = []): string {
    const lines: string[] = [];
    lines.push('');
    lines.push(message);
    if (actions.length > 0) {
      lines.push('');
      lines.push(actions.join('  |  '));
    }
    return lines.join('\n');
  }

  // ========== 辅助方法 ==========

  private makeSeparator(): string {
    return BORDER.separator.repeat(this.width);
  }

  private makeBoxTop(): string {
    return BORDER.top + BORDER.topMid.repeat(this.width - 2) + BORDER.topRight;
  }

  private makeBoxBottom(): string {
    return BORDER.bottom + BORDER.bottomMid.repeat(this.width - 2) + BORDER.bottomRight;
  }

  private makeBoxSeparator(): string {
    return BORDER.midLeft + BORDER.mid.repeat(this.width - 2) + BORDER.midRight;
  }

  private makeBoxLine(content: string, innerWidth: number): string {
    const padded = content.length > innerWidth 
      ? content.slice(0, innerWidth) 
      : content + ' '.repeat(innerWidth - content.length);
    return BORDER.left + padded + BORDER.right;
  }

  private makeProgressBar(percent: number, width: number = 12): string {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  private pad(str: string, length: number): string {
    return str.length >= length ? str : str + ' '.repeat(length - str.length);
  }

  private wrap(content: string): string {
    if (this.useCodeBlock) {
      return `\`\`\`${this.language}\n${content}\n\`\`\``;
    }
    return content;
  }
}

export default TemplateRenderer;
