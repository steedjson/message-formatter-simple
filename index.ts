/**
 * Message Formatter Simple
 * OpenClaw 消息格式化工具
 * 
 * 零依赖，仅需 Markdown + TypeScript
 * 支持自动检测平台和设备
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const TEMPLATES_DIR = './templates';
const DEFAULT_PLATFORM = 'auto';

// 支持的平台
const SUPPORTED_PLATFORMS = [
  'telegram',
  'wechat',
  'dingtalk',
  'feishu',
  'slack',
  'discord',
  'text'
];

/**
 * 自动检测平台
 */
export function detectPlatform(): string {
  const env = process.env;
  
  // 飞书
  if (env.FEISHU_WEBHOOK || env.FEISHU_APP_ID) return 'feishu';
  
  // 钉钉
  if (env.DINGTALK_WEBHOOK || env.DINGTALK_AGENT_ID) return 'dingtalk';
  
  // Slack
  if (env.SLACK_WEBHOOK_URL || env.SLACK_BOT_TOKEN) return 'slack';
  
  // Discord
  if (env.DISCORD_WEBHOOK_URL || env.DISCORD_BOT_TOKEN) return 'discord';
  
  // 默认 telegram
  return 'telegram';
}

/**
 * 自动检测设备类型
 */
export function detectDevice(): 'desktop' | 'mobile' {
  const platform = os.platform();
  
  if (['win32', 'darwin', 'linux'].includes(platform)) {
    return 'desktop';
  }
  
  if (['android', 'ios'].includes(platform)) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * 格式化消息
 */
export function format(
  template: string,
  platform: string = DEFAULT_PLATFORM,
  variables: Record<string, string> = {}
): string {
  // 自动检测平台
  if (platform === 'auto') {
    platform = detectPlatform();
  }
  
  const templatePath = path.join(TEMPLATES_DIR, `${template}.md`);
  let content = fs.readFileSync(templatePath, 'utf-8');
  
  const platformRegex = new RegExp(
    `<!-- platform:${platform} -->\\n([\\s\\S]*?)\\n<!-- /platform -->`,
    'g'
  );
  const platformMatch = content.match(platformRegex);
  
  if (platformMatch) {
    content = platformMatch[0]
      .replace(/<!-- platform:\w+ -->/g, '')
      .replace(/<!-- \/platform -->/g, '');
  }
  
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    content = content.replace(regex, value);
  }
  
  return content;
}

/**
 * 列出所有模版
 */
export function listTemplates(): string[] {
  const files = fs.readdirSync(TEMPLATES_DIR);
  return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
}

/**
 * 检测平台和设备
 */
export function detect(): {
  platform: string;
  device: string;
  env: Record<string, boolean>;
} {
  return {
    platform: detectPlatform(),
    device: detectDevice(),
    env: {
      FEISHU: !!(process.env.FEISHU_WEBHOOK || process.env.FEISHU_APP_ID),
      DINGTALK: !!(process.env.DINGTALK_WEBHOOK || process.env.DINGTALK_AGENT_ID),
      SLACK: !!(process.env.SLACK_WEBHOOK_URL || process.env.SLACK_BOT_TOKEN),
      DISCORD: !!(process.env.DISCORD_WEBHOOK_URL || process.env.DISCORD_BOT_TOKEN)
    }
  };
}

/**
 * 命令处理
 */
export async function handleCommand(command: string, args: string[]): Promise<string> {
  switch (command) {
    case 'format':
      const [template, platform, ...vars] = args;
      const variables = Object.fromEntries(vars.map(v => v.split('=')));
      return format(template, platform, variables);
    
    case 'list':
      const templates = listTemplates();
      return `可用模版:\n${templates.map(t => `  - ${t}`).join('\n')}`;
    
    case 'preview':
      const [template] = args;
      return format(template, 'text', {
        task_name: '测试任务',
        status: '已完成',
        completed_at: new Date().toISOString(),
        duration: '2 小时',
        assignee: '测试员'
      });
    
    case 'detect':
      const info = detect();
      return `平台检测:\n  平台：${info.platform}\n  设备：${info.device}\n  环境变量:\n    FEISHU: ${info.env.FEISHU}\n    DINGTALK: ${info.env.DINGTALK}\n    SLACK: ${info.env.SLACK}\n    DISCORD: ${info.env.DISCORD}`;
    
    default:
      return `未知命令：${command}`;
  }
}

export default { format, listTemplates, handleCommand, detect };
