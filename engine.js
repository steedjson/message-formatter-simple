"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateEngine = void 0;
const renderer_1 = require("./renderer");
class TemplateEngine {
    constructor(width = 39) {
        this.renderer = new renderer_1.AlignRenderer(width);
    }
    renderDashboard(data) {
        const lines = [];
        const p = Math.max(0, Math.min(100, parseInt(data.progress || '0')));
        const pFullBar = this.renderer.generateProgressBar(p, 12, '█', '▒');
        const completed = parseInt(data.completed || '0');
        const total = parseInt(data.total || '1');
        const pDonePercent = total > 0 ? (completed / total) * 100 : 0;
        const pDoneBar = this.renderer.generateProgressBar(pDonePercent, 12, '█', '▒');
        lines.push(this.renderer.renderDoubleTopBorder());
        lines.push(this.renderer.renderDoubleLine(`   📊 ${data.project_name || '任务概览'}`, 0));
        lines.push(this.renderer.renderDoubleSeparatorBorder());
        lines.push(this.renderer.renderDoubleLine(`  完成率  ${pFullBar}  ${p}%`, 0));
        lines.push(this.renderer.renderDoubleLine(`  已完成  ${pDoneBar}  ${completed}/${total}`, 0));
        lines.push(this.renderer.renderDoubleSeparatorBorder());
        lines.push(this.renderer.renderDoubleLine(`  ⏱️ ${data.time || '--'} | 📁 ${data.items || '--'} | 💰 ${data.cost || '--'}`, 0));
        lines.push(this.renderer.renderDoubleBottomBorder());
        return lines.join('\n');
    }
    renderMobileNoActive(data) {
        const lines = [];
        lines.push(this.renderer.renderTopBorder());
        lines.push(this.renderer.renderLine(`🎉 全部完成！`, 2));
        lines.push(this.renderer.renderLine(`${data.time || '--'} | 💕 ${data.mode || '--'} | 📱 ${data.device || '--'}`, 2));
        lines.push(this.renderer.renderBottomBorder());
        lines.push("");
        lines.push("✅ 无进行中任务");
        lines.push("");
        if (data.recent_tasks && Array.isArray(data.recent_tasks) && data.recent_tasks.length > 0) {
            lines.push(this.renderer.renderTopBorder());
            lines.push(this.renderer.renderLine(`📊 最近完成`, 2));
            lines.push(this.renderer.renderSeparatorBorder());
            for (const t of data.recent_tasks) {
                const leftPart = t.name;
                const rightPart = t.duration;
                const paddingLen = (this.renderer['width'] - 4) - this.renderer.getDisplayWidth(leftPart) - this.renderer.getDisplayWidth(rightPart);
                lines.push(this.renderer.renderLine(`${leftPart}${' '.repeat(Math.max(1, paddingLen))}${rightPart}`, 2));
                lines.push(this.renderer.renderLine(`${t.metrics}  |  ${t.token}`, 2));
            }
            lines.push(this.renderer.renderBottomBorder());
        }
        lines.push("");
        lines.push("🌙 小主人～人家随时待命哦");
        lines.push("");
        lines.push("💤 休息  |  💕 聊天  |  📋 计划");
        return lines.join('\n');
    }
    renderMobileActive(data) {
        const lines = [];
        lines.push(this.renderer.renderTopBorder());
        lines.push(this.renderer.renderLine(`🔄 进行中的任务 (${data.active_count || '1'})`, 2));
        lines.push(this.renderer.renderLine(`${data.time || '--'} | 💕 ${data.mode || '--'} | 📱 ${data.device || '--'}`, 2));
        lines.push(this.renderer.renderBottomBorder());
        lines.push("");
        const p = Math.max(0, Math.min(100, parseInt(data.progress || '0')));
        const pBar = this.renderer.generateProgressBar(p, 10, '█', '░');
        lines.push(this.renderer.renderTopBorder());
        lines.push(this.renderer.renderLine(`${data.task_name || '--'}`, 2));
        lines.push(this.renderer.renderSeparatorBorder());
        const timeProgStr = `⏱️ ${data.duration || '--'}  ${pBar} ${p}%`;
        lines.push(this.renderer.renderLine(timeProgStr, 2));
        lines.push(this.renderer.renderLine(`🤖 ${data.model || '--'}`, 2));
        lines.push(this.renderer.renderLine(`⏰ 预计 ${data.eta_time || '--'} 完成 (约 ${data.eta_duration || '--'})`, 2));
        lines.push(this.renderer.renderBottomBorder());
        lines.push("");
        lines.push("📋 优化进度");
        lines.push("");
        if (data.subtasks_list && Array.isArray(data.subtasks_list)) {
            for (const st of data.subtasks_list) {
                lines.push(`${st.icon || '🔸'} ${st.name} ${st.duration || ''}`);
                const stP = parseInt(st.progress || '0');
                const stBar = this.renderer.generateProgressBar(stP, 12, '█', '░');
                lines.push(`   ${stBar} ${stP}% ${st.status || ''}`);
                lines.push("");
            }
        }
        lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
        lines.push("");
        lines.push(`🌙 预计 ${data.eta_time || '--'} 完成`);
        lines.push("");
        lines.push("💤 等待  |  💕 聊天  |  📋 其他");
        return lines.join('\n');
    }
    renderTaskList(data) {
        const lines = [];
        lines.push("任务名              耗时    状态");
        lines.push("───────────────────────────────────");
        if (data.task_rows_list && Array.isArray(data.task_rows_list)) {
            for (const row of data.task_rows_list) {
                let r1 = row.name;
                let p1 = 20 - this.renderer.getDisplayWidth(r1);
                r1 += ' '.repeat(p1 > 0 ? p1 : 1);
                let r2 = row.duration;
                let p2 = 8 - this.renderer.getDisplayWidth(r2);
                r2 += ' '.repeat(p2 > 0 ? p2 : 1);
                lines.push(`${r1}${r2}${row.status}`);
            }
        }
        lines.push("───────────────────────────────────");
        lines.push(`总计：${data.total_tasks || '0'} 任务 | ${data.total_duration || '--'} | ${data.completion_rate || '0'}% 完成`);
        return lines.join('\n');
    }
    renderTaskTree(data) {
        return `📊 任务状态\n${data.tree_content || ''}`;
    }
    renderTaskDetail(data) {
        return `【${data.task_name}】\n  ⏱️ ${data.duration}\n  📊 ${data.progress_stats}\n  💰 ${data.cost}\n  ✅ ${data.status}`;
    }
    renderTaskTimeline(data) {
        return `${data.time_start}  ${data.task_name} 启动 ─────●\n                    │\n${data.time_now}  ${data.status} ────●───● ${data.next_step}`;
    }
}
exports.TemplateEngine = TemplateEngine;
