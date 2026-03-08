"use strict";
/**
 * Scene Detector - 场景识别引擎
 *
 * 根据 display-strategy.md 定义的关键词规则，
 * 自动识别用户请求的显示场景。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneDetector = void 0;
/**
 * 场景识别规则（来自 display-strategy.md）
 */
const DEFAULT_RULES = [
    {
        scene: 'task_list',
        keywords: ['任务列表', '待办', '进行中', '查看任务'],
        style: '简单表格',
        priority: 1
    },
    {
        scene: 'task_tree',
        keywords: ['分类', '项目', '分组', '任务分类'],
        style: '树结构',
        priority: 1
    },
    {
        scene: 'task_detail',
        keywords: ['详情', '这个任务', '那个任务', '单个任务'],
        style: '卡片列表',
        priority: 1
    },
    {
        scene: 'timeline',
        keywords: ['历史', '版本', '迭代', '时间线', '时间轴'],
        style: '时间轴',
        priority: 1
    },
    {
        scene: 'dashboard',
        keywords: ['概览', '总结', '统计', '进度', '仪表盘', '总体'],
        style: '仪表盘',
        priority: 1
    }
];
class SceneDetector {
    constructor(rules = DEFAULT_RULES) {
        this.rules = rules;
        this.hasProgressTasks = false;
    }
    /**
     * 设置是否有进行中的任务（用于默认规则）
     */
    setHasProgressTasks(hasProgress) {
        this.hasProgressTasks = hasProgress;
    }
    /**
     * 检测场景
     * @param text 用户输入文本
     * @returns 检测结果
     */
    detect(text) {
        if (!text || text.trim() === '') {
            return this.getDefaultResult();
        }
        const lowerText = text.toLowerCase();
        // 精确匹配（优先级高）
        for (const rule of this.rules) {
            for (const keyword of rule.keywords) {
                if (lowerText.includes(keyword.toLowerCase())) {
                    return {
                        scene: rule.scene,
                        confidence: 1.0,
                        matchedKeyword: keyword,
                        style: rule.style
                    };
                }
            }
        }
        // 模糊匹配（简单分词）
        const words = lowerText.split(/[\s,，.。]+/);
        for (const word of words) {
            for (const rule of this.rules) {
                for (const keyword of rule.keywords) {
                    if (keyword.toLowerCase().includes(word) && word.length >= 2) {
                        return {
                            scene: rule.scene,
                            confidence: 0.7,
                            matchedKeyword: keyword,
                            style: rule.style
                        };
                    }
                }
            }
        }
        // 无匹配，使用默认规则
        return this.getDefaultResult();
    }
    /**
     * 获取默认场景
     */
    getDefaultResult() {
        // 默认规则：
        // - 有进行中任务 → dashboard
        // - 无进行中任务 → task_list
        const defaultScene = this.hasProgressTasks ? 'dashboard' : 'task_list';
        const defaultRule = this.rules.find(r => r.scene === defaultScene);
        return {
            scene: defaultScene,
            confidence: 0.5,
            style: defaultRule?.style || '简单表格'
        };
    }
    /**
     * 获取所有支持的场景
     */
    getSupportedScenes() {
        return this.rules.map(r => r.scene);
    }
    /**
     * 获取场景规则详情
     */
    getSceneDetails(scene) {
        return this.rules.find(r => r.scene === scene);
    }
}
exports.SceneDetector = SceneDetector;
exports.default = SceneDetector;
