/**
 * Message Formatter Simple
 * OpenClaw 消息格式化工具
 * 
 * 零依赖，仅需 Markdown + TypeScript
 * 根据场景(scene)自动匹配模版
 */

import * as fs from 'fs';
import * as path from 'path';

const TEMPLATES_DIR = './templates';

// 场景映射表
const SCENE_MAP: Record<string, string> = {
  'task_list': 'task_list',          // 场景 1：简单表格
  'list': 'task_list',
  
  'task_tree': 'task_tree',          // 场景 2：树结构
  'tree': 'task_tree',
  'category': 'task_tree',
  
  'task_detail': 'task_complete',    // 场景 3：卡片列表
  'detail': 'task_complete',
  'complete': 'task_complete',
  
  'timeline': 'task_progress',       // 场景 4：时间轴
  'progress': 'task_progress',
  
  'dashboard': 'status',             // 场景 5：仪表盘
  'status': 'status',
  'overview': 'status',
  
  'error': 'error_alert'             // 错误告警
};

/**
 * 根据场景推断使用的模版
 */
export function getTemplateByScene(scene: string): string {
  const normalizedScene = scene.toLowerCase();
  return SCENE_MAP[normalizedScene] || 'status'; // 默认使用仪表盘
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
  
  // 移除旧的平台标识符 (如果有的话)，保持向后兼容但忽略它们
  content = content.replace(/<!-- platform:\w+ -->\n?/g, '');
  content = content.replace(/<!-- \/platform -->\n?/g, '');
  
  // 如果同一个文件里有多个平台的配置（比如旧文件），我们默认只保留 telegram 平台的那一块。
  // 为了彻底摆脱平台概念，如果文件被纯粹重构过，这里就不需要管了。
  // 这里做个安全处理：如果检测到旧的文件格式包含 telegram，就提取它。
  // 由于我们决定彻底移除平台逻辑，我们可以直接清理或者期望模板已经是纯粹的文本。
  
  // 简单粗暴：如果有多个平台的代码块，由于之前我们写入的时候，我们把需要的展示逻辑留在了telegram下
  // 或者用户将要更新纯净的模板，我们直接做全局变量替换
  
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
      return format(previewScene || 'dashboard', {
        project: '预览测试',
        progress_bar_full: '████████████',
        progress: '100',
        progress_bar_done: '████████████',
        completed: '6',
        total: '6',
        time: '4h',
        items: '40+',
        cost: '¥1',
        task_name: '测试任务',
        duration: '10分钟',
        status: '已完成'
      });
    
    default:
      return `未知命令：${command}\n可用命令: format, list, preview`;
  }
}

export default { format, listTemplates, listScenes, handleCommand };
