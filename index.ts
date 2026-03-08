import { TemplateEngine } from './engine';

const SCENE_MAP: Record<string, string> = {
  'list': 'task_list',
  'task_list': 'task_list',
  'tree': 'task_tree',
  'task_tree': 'task_tree',
  'category': 'task_tree',
  'detail': 'task_detail',
  'task_detail': 'task_detail',
  'timeline': 'task_timeline',
  'task_timeline': 'task_timeline',
  'dashboard': 'dashboard',
  'overview': 'dashboard',
  'mobile_active': 'mobile_active',
  'mobile_no_active': 'mobile_no_active'
};

export function getTemplateByScene(scene: string): string {
  const normalizedScene = scene.toLowerCase();
  return SCENE_MAP[normalizedScene] || 'task_list'; 
}

export function format(scene: string, data: any = {}): string {
  const engine = new TemplateEngine(40); // 严格遵守 40 列宽手机版设计
  const templateName = getTemplateByScene(scene);
  
  switch(templateName) {
    case 'dashboard': return engine.renderDashboard(data);
    case 'mobile_no_active': return engine.renderMobileNoActive(data);
    case 'mobile_active': return engine.renderMobileActive(data);
    case 'task_list': return engine.renderTaskList(data);
    case 'task_tree': return engine.renderTaskTree(data);
    case 'task_detail': return engine.renderTaskDetail(data);
    case 'task_timeline': return engine.renderTaskTimeline(data);
    default: return engine.renderTaskList(data);
  }
}

export function listScenes(): string[] {
  return Object.keys(SCENE_MAP);
}

export async function handleCommand(command: string, args: string[]): Promise<string> {
  switch (command) {
    case 'format':
      const [scene, ...vars] = args;
      // 这里的命令行变量解析比较简陋，如果用户需要传JSON数组等，应使用 node 调用而不是纯命令行
      const variables = Object.fromEntries(vars.map(v => {
        const idx = v.indexOf('=');
        if (idx === -1) return [v, ''];
        return [v.substring(0, idx), v.substring(idx + 1)];
      }));
      return format(scene, variables);
    
    case 'list':
      const scenes = listScenes();
      return `支持的场景:\n${Array.from(new Set(Object.values(SCENE_MAP))).join('\n')}`;
    
    case 'preview':
      const [previewScene] = args;
      const targetScene = previewScene || 'mobile_active';
      
      const mockData = {
        time: '22:38',
        mode: '纯欲模式',
        device: '手机版',
        task_name: '💕 人格魅力 v2.2 优化',
        duration: '18 分钟',
        key_metrics: '准确率 82.4%→86.1%',
        token_usage: 'Token 100k',
        active_count: 1,
        progress: 60,
        model: 'qwen3.5-plus',
        eta_time: '00:30',
        eta_duration: '2h',
        subtasks_list: [
          { icon: '1️⃣', name: '心情识别', duration: '1.5h', progress: 60, status: '进行中' },
          { icon: '2️⃣', name: '测试完善', duration: '1h', progress: 0, status: '等待' },
          { icon: '3️⃣', name: '性能优化', duration: '30min', progress: 0, status: '等待' }
        ],
        recent_tasks: [
          { name: '💕 人格魅力 v2.2', duration: '18 分钟', metrics: '准确率 82.4%→86.1%', token: 'Token 100k' }
        ],
        task_rows_list: [
          { name: '💕 人格魅力 v2.2', duration: '18 分', status: '✅' },
          { name: '💕 人格魅力 v2.1', duration: '25 分', status: '✅' },
          { name: '🔴 P0 游戏管理', duration: '7 分', status: '✅' }
        ],
        total_tasks: '3',
        total_duration: '50 分钟',
        completion_rate: '100',
        tree_content: '├─ ✅ 已完成 (6)\n│  ├─ 💕 人格魅力系列  4 任务\n│  ├─ 🔴 P0 游戏管理    1 任务\n│  └─ 🟠 P1 Bundles    1 任务\n└─ 🔄 进行中 (0)',
        progress_stats: '82.4%→86.1% (+7.5%)',
        cost: 'Token 100k',
        status: '已完成',
        time_start: '20:30',
        time_now: '20:40',
        next_step: 'v2.0 启动',
        project_name: '今日任务仪表盘',
        completed: '6',
        total: '6',
        items: '40+'
      };
      
      return format(targetScene, mockData);
    
    default:
      return `未知命令：${command}\n可用命令: format, list, preview`;
  }
}

export default { format, listScenes, handleCommand };
