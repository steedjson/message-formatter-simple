"use strict";
/**
 * Message Formatter Simple
 * OpenClaw 专属消息格式化工具
 *
 * 根据 display-strategy.md 定义的场景规则，
 * 自动渲染 display-template.md 中的专属模板。
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageFormatter = void 0;
exports.execute = execute;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const DISPLAY_STRATEGY_PATH = path.join(__dirname, '../../../memory/display-strategy.md');
const DISPLAY_TEMPLATE_PATH = path.join(__dirname, '../../../memory/display-template.md');
class MessageFormatter {
    constructor() {
        this.strategy = fs.readFileSync(DISPLAY_STRATEGY_PATH, 'utf-8');
        this.template = fs.readFileSync(DISPLAY_TEMPLATE_PATH, 'utf-8');
    }
    render(scene, data) {
        // 根据场景选择模板逻辑
        // 目前直接返回格式化后的文本
        return this.formatByScene(scene, data);
    }
    formatByScene(scene, data) {
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
    renderTaskList(data) {
        const lines = [];
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
    renderTaskTree(data) {
        return '```text\n📊 任务状态\n' + (data.tree || '') + '\n```';
    }
    renderTaskDetail(data) {
        return '```text\n【' + (data.name || '任务') + '】\n  ⏱️ ' + (data.duration || '--') + '\n  📊 ' + (data.stats || '--') + '\n  ✅ ' + (data.status || '--') + '\n```';
    }
    renderTimeline(data) {
        return '```text\n' + (data.timeline || '') + '\n```';
    }
    renderDashboard(data) {
        const lines = [];
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
exports.MessageFormatter = MessageFormatter;
function execute(command, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const formatter = new MessageFormatter();
        if (command === 'render') {
            const scene = args[0] || 'task_list';
            const data = JSON.parse(args.slice(1).join(' ') || '{}');
            return formatter.render(scene, data);
        }
        return 'Message Formatter Simple - 使用 render <场景> <数据> 来渲染消息';
    });
}
exports.default = { MessageFormatter, execute };
