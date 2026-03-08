/**
 * Message Formatter Simple
 * OpenClaw 专属消息格式化工具
 * 
 * 根据 display-strategy.md 定义的场景规则，
 * 自动渲染 display-template.md 中的专属模板。
 */

import * as fs from 'fs';
import * as path from 'path';

const DISPLAY_STRATEGY_PATH = path.join(__dirname, '../../../memory/display-strategy.md');
const DISPLAY_TEMPLATE_PATH = path.join(__dirname, '../../../memory/display-template.md');

export interface RenderContext {
  scene: string;
  data: Record<string, any>;
}

export class MessageFormatter {
  private strategy: string;
  private template: string;

  constructor() {
    this.strategy = fs.readFileSync(DISPLAY_STRATEGY_PATH, 'utf-8');
    this.template = fs.readFileSync(DISPLAY_TEMPLATE_PATH, 'utf-8');
  }

  public render(scene: string, data: Record<string, any>): string {
    // 根据场景选择模板逻辑
    // 目前直接返回格式化后的文本
    return this.formatByScene(scene, data);
  }

  private formatByScene(scene: string, data: Record<string, any>): string {
    // 简化实现：根据场景类型返回对应格式
    switch (scene.toLowerCase()) {
      case 'task_list':
        return this.renderTaskList(data);
      case 'task_tree':
        return this.renderTaskTree(data);
      case 'task_detail':
        return this.renderTaskDetail(data);
      case 'timeline':
        return this.renderTimeline(data);
      case 'dashboard':
        return this.renderDashboard(data);
      default:
        return this.renderTaskList(data);
    }
  }

  private renderTaskList(data: any): string {
    const lines: string[] = [];
    lines.push('任务名              耗时    状态');
    lines.push('───────────────────────────────────');
    if (data.tasks && Array.isArray(data.tasks)) {
      for (const t of data.tasks) {
        lines.push(`${t.name.padEnd(18)}  ${t.duration.padEnd(6)}  ${t.status}`);
      }
    }
    lines.push('───────────────────────────────────');
    lines.push(`总计：${data.total || 0} 任务 | ${data.duration || '--'} | ${data.rate || '0'}% 完成`);
    return '```text\n' + lines.join('\n') + '\n```';
  }

  private renderTaskTree(data: any): string {
    return '```text\n📊 任务状态\n' + (data.tree || '') + '\n```';
  }

  private renderTaskDetail(data: any): string {
    return '```text\n【' + (data.name || '任务') + '】\n  ⏱️ ' + (data.duration || '--') + '\n  📊 ' + (data.stats || '--') + '\n  ✅ ' + (data.status || '--') + '\n```';
  }

  private renderTimeline(data: any): string {
    return '```text\n' + (data.timeline || '') + '\n```';
  }

  private renderDashboard(data: any): string {
    const lines: string[] = [];
    lines.push('╔═══════════════════════════════╗');
    lines.push('║   📊 ' + (data.title || '任务仪表盘').padEnd(24) + '║');
    lines.push('╠═══════════════════════════════╣');
    lines.push('║  完成率  ' + (data.progress || '0%').padEnd(24) + '║');
    lines.push('║  已完成  ' + (data.completed || '0/0').padEnd(24) + '║');
    lines.push('╠═══════════════════════════════╣');
    lines.push('║  ⏱️ ' + (data.time || '--').padEnd(28) + '║');
    lines.push('╚═══════════════════════════════╝');
    return '```text\n' + lines.join('\n') + '\n```';
  }
}

export async function execute(command: string, args: string[]): Promise<string> {
  const formatter = new MessageFormatter();
  
  if (command === 'render') {
    const scene = args[0] || 'task_list';
    const data = JSON.parse(args.slice(1).join(' ') || '{}');
    return formatter.render(scene, data);
  }
  
  return 'Message Formatter Simple - 使用 render <场景> <数据> 来渲染消息';
}

export default { MessageFormatter, execute };
