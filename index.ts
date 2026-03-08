/**
 * Message Formatter Simple
 * OpenClaw 消息格式化工具
 * 
 * 零依赖，仅需 Markdown + TypeScript
 */

import * as fs from 'fs';
import * as path from 'path';

const TEMPLATES_DIR = './templates';
const DEFAULT_PLATFORM = 'telegram';

export function format(
  template: string,
  platform: string = DEFAULT_PLATFORM,
  variables: Record<string, string> = {}
): string {
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

export function listTemplates(): string[] {
  const files = fs.readdirSync(TEMPLATES_DIR);
  return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
}

export async function handleCommand(command: string, args: string[]): Promise<string> {
  switch (command) {
    case 'format':
      const [template, platform, ...vars] = args;
      const variables = Object.fromEntries(vars.map(v => v.split('=')));
      return format(template, platform, variables);
    case 'list':
      const templates = listTemplates();
      return `可用模版:\n${templates.map(t => `  - ${t}`).join('\n')}`;
    default:
      return `未知命令：${command}`;
  }
}

export default { format, listTemplates, handleCommand };
