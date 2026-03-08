"use strict";
/**
 * Message Formatter Simple
 * OpenClaw 消息格式化工具
 *
 * 零依赖，纯 JavaScript
 * 根据场景(scene)自动匹配模版
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommand = exports.listScenes = exports.listTemplates = exports.format = exports.getTemplateByScene = void 0;
const fs = require("fs");
const path = require("path");
const TEMPLATES_DIR = './templates';
// 场景映射表
const SCENE_MAP = {
    'task_list': 'task_list', // 场景 1：简单表格
    'list': 'task_list',
    'task_tree': 'task_tree', // 场景 2：树结构
    'tree': 'task_tree',
    'category': 'task_tree',
    'task_detail': 'task_complete', // 场景 3：卡片列表
    'detail': 'task_complete',
    'complete': 'task_complete',
    'timeline': 'task_progress', // 场景 4：时间轴
    'progress': 'task_progress',
    'dashboard': 'status', // 场景 5：仪表盘
    'status': 'status',
    'overview': 'status',
    'error': 'error_alert' // 错误告警
};
/**
 * 根据场景推断使用的模版
 */
function getTemplateByScene(scene) {
    const normalizedScene = scene.toLowerCase();
    return SCENE_MAP[normalizedScene] || 'status'; // 默认使用仪表盘
}
exports.getTemplateByScene = getTemplateByScene;
/**
 * 格式化消息
 */
function format(scene, variables = {}) {
    const templateName = getTemplateByScene(scene);
    const templatePath = path.join(TEMPLATES_DIR, `${templateName}.md`);
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template for scene '${scene}' (${templateName}.md) not found`);
    }
    let content = fs.readFileSync(templatePath, 'utf-8');
    
    // 如果之前带了多个平台的备份代码块，现在不需要了，我们只保留 telegram 平台的核心排版，将其作为通用展现
    // 提取 telegram 的部分，如果没有 telegram 块就用全文
    const platformRegex = new RegExp("<!-- platform:telegram -->\\n([\\s\\S]*?)\\n<!-- /platform -->");
    const match = content.match(platformRegex);
    if (match) {
        content = match[1];
    } else {
        content = content.replace(/<!-- platform:\w+ -->\n?/g, '');
        content = content.replace(/<!-- \/platform -->\n?/g, '');
    }
    
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        content = content.replace(regex, value);
    }
    return content.trim();
}
exports.format = format;
/**
 * 列出所有模版
 */
function listTemplates() {
    const files = fs.readdirSync(TEMPLATES_DIR);
    return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
}
exports.listTemplates = listTemplates;
/**
 * 获取支持的场景
 */
function listScenes() {
    return Object.keys(SCENE_MAP);
}
exports.listScenes = listScenes;
/**
 * 命令处理
 */
async function handleCommand(command, args) {
    switch (command) {
        case 'format':
            const [scene, ...vars] = args;
            const variables = Object.fromEntries(vars.map(v => {
                const idx = v.indexOf('=');
                if (idx === -1)
                    return [v, ''];
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
exports.handleCommand = handleCommand;
exports.default = { format, listTemplates, listScenes, handleCommand };
