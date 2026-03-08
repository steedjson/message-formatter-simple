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

import * as fs from 'fs';
import * as path from 'path';
import SceneDetector, { DetectionResult } from './scene-detector';
import TemplateRenderer, { TaskInfo, RenderOptions } from './renderer';

// 配置文件路径
const MEMORY_DIR = path.join(__dirname, '../../../memory');
const DISPLAY_STRATEGY_PATH = path.join(MEMORY_DIR, 'display-strategy.md');
const DISPLAY_TEMPLATE_PATH = path.join(MEMORY_DIR, 'display-template.md');

/**
 * 渲染上下文
 */
export interface RenderContext {
  scene?: string;
  text?: string;
  data: Record<string, any>;
  options?: RenderOptions;
}

/**
 * 消息格式化器主类
 */
export class MessageFormatter {
  private sceneDetector: SceneDetector;
  private renderer: TemplateRenderer;
  private configLoaded: boolean;
  private configError?: string;

  constructor(options: RenderOptions = {}) {
    this.sceneDetector = new SceneDetector();
    this.renderer = new TemplateRenderer(options);
    this.configLoaded = false;
    
    // 尝试加载配置文件
    this.loadConfig();
  }

  /**
   * 加载配置文件
   */
  private loadConfig(): void {
    try {
      if (fs.existsSync(DISPLAY_STRATEGY_PATH)) {
        fs.readFileSync(DISPLAY_STRATEGY_PATH, 'utf-8');
        this.configLoaded = true;
      }
      if (fs.existsSync(DISPLAY_TEMPLATE_PATH)) {
        fs.readFileSync(DISPLAY_TEMPLATE_PATH, 'utf-8');
      }
    } catch (error) {
      this.configError = `配置文件加载失败：${error instanceof Error ? error.message : '未知错误'}`;
      // 使用默认配置继续运行
      this.configLoaded = false;
    }
  }

  /**
   * 自动识别场景并渲染
   */
  public auto(text: string, data: Record<string, any>, options?: RenderOptions): string {
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
  public render(scene: string, data: Record<string, any>, options?: RenderOptions): string {
    const renderer = options ? new TemplateRenderer(options) : this.renderer;
    
    switch (scene.toLowerCase()) {
      case 'task_list':
        return renderer.renderTaskList(
          data.tasks || [],
          data.total,
          data.duration,
          data.rate
        );
      
      case 'task_tree':
        return renderer.renderTaskTree(data.categories || data);
      
      case 'task_detail':
        return renderer.renderTaskDetail(data as any);
      
      case 'timeline':
        return renderer.renderTimeline(data.events || []);
      
      case 'dashboard':
        return renderer.renderDashboard(data as any);
      
      default:
        // 未知场景，回退到任务列表
        return renderer.renderTaskList(
          data.tasks || [],
          data.total,
          data.duration,
          data.rate
        );
    }
  }

  /**
   * 渲染进行中任务
   */
  public renderProgress(task: {
    name: string;
    duration: string;
    progress: number;
    model?: string;
    eta?: string;
  }): string {
    return this.renderer.renderProgressTask(task);
  }

  /**
   * 渲染页脚
   */
  public renderFooter(message: string, actions: string[] = []): string {
    return this.renderer.renderFooter(message, actions);
  }

  /**
   * 获取支持的场景列表
   */
  public getSupportedScenes(): string[] {
    return this.sceneDetector.getSupportedScenes();
  }

  /**
   * 获取场景详情
   */
  public getSceneDetails(scene: string) {
    return this.sceneDetector.getSceneDetails(scene);
  }

  /**
   * 检测场景（不渲染）
   */
  public detectScene(text: string): DetectionResult {
    return this.sceneDetector.detect(text);
  }

  /**
   * 配置状态
   */
  public isConfigLoaded(): boolean {
    return this.configLoaded;
  }

  /**
   * 配置错误信息
   */
  public getConfigError(): string | undefined {
    return this.configError;
  }
}

/**
 * CLI 执行函数
 */
export async function execute(command: string, args: string[]): Promise<string> {
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
        const sampleData: Record<string, any> = {
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
  } catch (error) {
    return `❌ 执行失败：${error instanceof Error ? error.message : '未知错误'}`;
  }
}

export default { MessageFormatter, execute };
