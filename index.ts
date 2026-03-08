/**
 * Message Formatter Simple
 * OpenClaw 消息格式化工具
 * 
 * 零依赖，纯文本模版替换
 * 根据场景(scene)自动匹配模版
 */

import * as fs from 'fs';
import * as path from 'path';

const TEMPLATES_DIR = './templates';

// 场景映射表，严格遵循小主人的 display-strategy.md 和 display-template.md
const SCENE_MAP: Record<string, string> = {
  // 场景 1：查看任务列表 → 简单表格
  'list': 'task_list',
  'task_list': 'task_list',
  
  // 场景 2：查看任务分类 → 树结构
  'tree': 'task_tree',
  'task_tree': 'task_tree',
  'category': 'task_tree',
  
  // 场景 3：单个任务详情 → 卡片列表
  'detail': 'task_detail',
  'task_detail': 'task_detail',
  
  // 场景 4：连续任务/版本迭代 → 时间轴
  'timeline': 'task_timeline',
  'task_timeline': 'task_timeline',
  
  // 场景 5：总体概览 → 仪表盘
  'dashboard': 'dashboard',
  'overview': 'dashboard',

  // 手机版专属面板
  'mobile_active': 'mobile_active',     // 有进行中任务
  'mobile_no_active': 'mobile_no_active' // 无进行中任务
};

/**
 * 根据场景推断使用的模版
 */
export function getTemplateByScene(scene: string): string {
  const normalizedScene = scene.toLowerCase();
  if (SCENE_MAP[normalizedScene]) {
    return SCENE_MAP[normalizedScene];
  }
  // 默认规则：无明确场景时，默认使用简单表格（可根据情况在调用时决定）
  return 'task_list'; 
}

/**
 * 格式化消息
 */
export function format(
  scene: string,
  variables: Record<string, string> = {}
): string {
  const templateName = getTemplateByScene(scene);
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.md`);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template for scene '${scene}' (${templateName}.md) not found`);
  }
  
  let content = fs.readFileSync(templatePath, 'utf-8');
  
  // 移除可能的第一行标题注释例如 "# 场景 1：..." 
  content = content.replace(/^# .*?\n\n?/, '');
  
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    content = content.replace(regex, value);
  }
  
  return content.trim();
}

/**
 * 列出所有模版
 */
export function listTemplates(): string[] {
  const files = fs.readdirSync(TEMPLATES_DIR);
  return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
}

/**
 * 获取支持的场景
 */
export function listScenes(): string[] {
  return Object.keys(SCENE_MAP);
}

/**
 * 命令处理
 */
export async function handleCommand(command: string, args: string[]): Promise<string> {
  switch (command) {
    case 'format':
      const [scene, ...vars] = args;
      const variables = Object.fromEntries(vars.map(v => {
        const idx = v.indexOf('=');
        if (idx === -1) return [v, ''];
        return [v.substring(0, idx), v.substring(idx + 1)];
      }));
      return format(scene, variables);
    
    case 'list':
      const scenes = listScenes();
      return `支持的场景映射:\n${scenes.map(s => `  - ${s} -> ${SCENE_MAP[s]}.md`).join('\n')}`;
    
    case 'preview':
      const [previewScene] = args;
      // Provide dummy data for preview
      return format(previewScene || 'mobile_no_active', {
        time: '22:38',
        mode: '纯欲模式',
        device: '手机版',
        task_name: '💕 人格魅力 v2.2',
        duration: '18 分钟',
        key_metrics: '准确率 82.4%→86.1%',
        token_usage: 'Token 100k',
        active_count: '1',
        progress_bar: '████████░░',
        progress: '60',
        model: 'qwen3.5-plus',
        eta_time: '00:30',
        eta_duration: '2h',
        subtasks: '1️⃣ 心情识别 1.5h\n   ████████░░░░ 60% 进行中\n\n2️⃣ 测试完善 1h\n   ░░░░░░░░░░░░ 0% 等待',
        task_rows: '💕 人格魅力 v2.2    18 分   ✅\n💕 人格魅力 v2.1    25 分   ✅',
        total_tasks: '2',
        total_duration: '43 分钟',
        completion_rate: '100',
        tree_content: '├─ ✅ 已完成 (2)\n│  └─ 💕 人格魅力系列  2 任务\n└─ 🔄 进行中 (0)',
        progress_stats: '82.4%→86.1%',
        cost: 'Token 100k',
        status: '✅ 已完成',
        time_start: '20:30',
        time_now: '20:40',
        next_step: 'v2.0 启动',
        project_name: '今日任务仪表盘',
        progress_bar_full: '████████████',
        progress_bar_done: '████████████',
        completed: '6',
        total: '6',
        items: '40+'
      });
    
    default:
      return `未知命令：${command}\n可用命令: format, list, preview`;
  }
}

export default { format, listTemplates, listScenes, handleCommand };
