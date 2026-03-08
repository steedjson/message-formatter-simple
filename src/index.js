"use strict";
/**
 * Message Formatter Simple
 * OpenClaw 专属消息格式化工具
 *
 * 根据 display-strategy.md 定义的场景规则，
 * 自动渲染 display-template.md 中的专属模板。
 *
 * @version 3.0.0
 * @author 小屁孩 (OpenClaw Assistant)
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageFormatter = void 0;
exports.execute = execute;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const scene_detector_1 = __importDefault(require("./scene-detector"));
const renderer_1 = __importDefault(require("./renderer"));
// 配置文件路径
const MEMORY_DIR = path.join(__dirname, '../../../memory');
const DISPLAY_STRATEGY_PATH = path.join(MEMORY_DIR, 'display-strategy.md');
const DISPLAY_TEMPLATE_PATH = path.join(MEMORY_DIR, 'display-template.md');
/**
 * 消息格式化器主类
 */
class MessageFormatter {
    constructor(options = {}) {
        this.sceneDetector = new scene_detector_1.default();
        this.renderer = new renderer_1.default(options);
        this.configLoaded = false;
        // 尝试加载配置文件
        this.loadConfig();
    }
    /**
     * 加载配置文件
     */
    loadConfig() {
        try {
            if (fs.existsSync(DISPLAY_STRATEGY_PATH)) {
                fs.readFileSync(DISPLAY_STRATEGY_PATH, 'utf-8');
                this.configLoaded = true;
            }
            if (fs.existsSync(DISPLAY_TEMPLATE_PATH)) {
                fs.readFileSync(DISPLAY_TEMPLATE_PATH, 'utf-8');
            }
        }
        catch (error) {
            this.configError = `配置文件加载失败：${error instanceof Error ? error.message : '未知错误'}`;
            // 使用默认配置继续运行
            this.configLoaded = false;
        }
    }
    /**
     * 自动识别场景并渲染
     */
    auto(text, data, options) {
        const detection = this.sceneDetector.detect(text);
        // 如果有进行中任务信息，设置到检测器
        if (data.hasProgressTasks !== undefined) {
            this.sceneDetector.setHasProgressTasks(data.hasProgressTasks);
        }
        return this.render(detection.scene, data, options);
    }
    /**
     * 根据指定场景渲染
     */
    render(scene, data, options) {
        const renderer = options ? new renderer_1.default(options) : this.renderer;
        switch (scene.toLowerCase()) {
            case 'task_list':
                return renderer.renderTaskList(data.tasks || [], data.total, data.duration, data.rate);
            case 'task_tree':
                return renderer.renderTaskTree(data.categories || data);
            case 'task_detail':
                return renderer.renderTaskDetail(data);
            case 'timeline':
                return renderer.renderTimeline(data.events || []);
            case 'dashboard':
                return renderer.renderDashboard(data);
            default:
                // 未知场景，回退到任务列表
                return renderer.renderTaskList(data.tasks || [], data.total, data.duration, data.rate);
        }
    }
    /**
     * 渲染进行中任务
     */
    renderProgress(task) {
        return this.renderer.renderProgressTask(task);
    }
    /**
     * 渲染页脚
     */
    renderFooter(message, actions = []) {
        return this.renderer.renderFooter(message, actions);
    }
    /**
     * 获取支持的场景列表
     */
    getSupportedScenes() {
        return this.sceneDetector.getSupportedScenes();
    }
    /**
     * 获取场景详情
     */
    getSceneDetails(scene) {
        return this.sceneDetector.getSceneDetails(scene);
    }
    /**
     * 检测场景（不渲染）
     */
    detectScene(text) {
        return this.sceneDetector.detect(text);
    }
    /**
     * 配置状态
     */
    isConfigLoaded() {
        return this.configLoaded;
    }
    /**
     * 配置错误信息
     */
    getConfigError() {
        return this.configError;
    }
}
exports.MessageFormatter = MessageFormatter;
/**
 * CLI 执行函数
 */
async function execute(command, args) {
    const formatter = new MessageFormatter();
    try {
        switch (command) {
            case 'render': {
                // /render --scene <场景> --data <JSON>
                const sceneIdx = args.indexOf('--scene');
                const dataIdx = args.indexOf('--data');
                const widthIdx = args.indexOf('--width');
                if (sceneIdx === -1 || dataIdx === -1) {
                    return '❌ 用法：/render --scene <场景> --data <JSON 数据>\n\n支持的场景：' +
                        formatter.getSupportedScenes().join(', ');
                }
                const scene = args[sceneIdx + 1];
                const data = JSON.parse(args[dataIdx + 1]);
                const width = widthIdx !== -1 ? parseInt(args[widthIdx + 1]) : undefined;
                return formatter.render(scene, data, width ? { width } : undefined);
            }
            case 'auto': {
                // /auto --text <文本> --data <JSON>
                const textIdx = args.indexOf('--text');
                const dataIdx = args.indexOf('--data');
                const widthIdx = args.indexOf('--width');
                if (dataIdx === -1) {
                    return '❌ 用法：/auto --text <文本> --data <JSON 数据>';
                }
                const text = textIdx !== -1 ? args[textIdx + 1] : '';
                const data = JSON.parse(args[dataIdx + 1]);
                const width = widthIdx !== -1 ? parseInt(args[widthIdx + 1]) : undefined;
                return formatter.auto(text, data, width ? { width } : undefined);
            }
            case 'list_scenes': {
                const scenes = formatter.getSupportedScenes();
                const lines = ['📊 支持的场景:\n'];
                scenes.forEach(scene => {
                    const details = formatter.getSceneDetails(scene);
                    if (details) {
                        lines.push(`• ${scene}: ${details.style}`);
                        lines.push(`  关键词：${details.keywords.join(', ')}`);
                    }
                });
                return lines.join('\n');
            }
            case 'preview': {
                const sceneIdx = args.indexOf('--scene');
                if (sceneIdx === -1) {
                    return '❌ 用法：/preview --scene <场景>';
                }
                const scene = args[sceneIdx + 1];
                // 示例数据
                const sampleData = {
                    task_list: {
                        tasks: [
                            { name: '人格魅力 v2.2', duration: '18 分', status: '✅' },
                            { name: 'P0 游戏管理', duration: '7 分', status: '✅' }
                        ],
                        total: 2,
                        duration: '25 分钟',
                        rate: 100
                    },
                    task_tree: {
                        '✅ 已完成': {
                            '💕 人格魅力系列': '4 任务',
                            '🔴 P0 游戏管理': '1 任务'
                        },
                        '🔄 进行中': '0'
                    },
                    task_detail: {
                        name: '💕 人格魅力 v2.2',
                        duration: '18 分钟',
                        stats: '82.4%→86.1% (+7.5%)',
                        status: '已完成'
                    },
                    timeline: {
                        events: [
                            { time: '20:30', version: 'v1.0', event: '启动' },
                            { time: '20:40', version: 'v1.0', event: '完成' },
                            { time: '21:05', version: 'v2.0', event: '完成' }
                        ]
                    },
                    dashboard: {
                        title: '今日任务仪表盘',
                        progress: '100%',
                        completed: '6/6',
                        time: '4h',
                        count: '40+',
                        progressPercent: 100
                    }
                };
                if (!sampleData[scene]) {
                    return `❌ 未知场景：${scene}\n\n支持的场景：${formatter.getSupportedScenes().join(', ')}`;
                }
                return formatter.render(scene, sampleData[scene]);
            }
            default:
                return 'Message Formatter Simple v3.0.0\n\n' +
                    '用法:\n' +
                    '  /render --scene <场景> --data <JSON>  渲染指定场景\n' +
                    '  /auto --text <文本> --data <JSON>     自动识别场景\n' +
                    '  /list_scenes                          列出所有场景\n' +
                    '  /preview --scene <场景>               预览模板示例\n\n' +
                    '支持的场景：' + formatter.getSupportedScenes().join(', ');
        }
    }
    catch (error) {
        return `❌ 执行失败：${error instanceof Error ? error.message : '未知错误'}`;
    }
}
exports.default = { MessageFormatter, execute };
