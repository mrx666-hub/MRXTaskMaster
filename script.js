let tasks = [];
let currentSort = { column: 'id', order: 'asc' };

const commandInput = document.getElementById('commandInput');
const runBtn = document.getElementById('runBtn');
const terminalOutput = document.getElementById('terminalOutput');
const taskTableBody = document.getElementById('taskTableBody');
const clearStorageBtn = document.getElementById('clearStorageBtn');

function saveToLocalStorage() {
    localStorage.setItem('mrx_taskmaster_tasks', JSON.stringify(tasks));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('mrx_taskmaster_tasks');
    if (stored) {
        tasks = JSON.parse(stored);
    } else {
        tasks = [
            { id: 1, text: '学习 JavaScript 数组方法', status: 'todo', created: new Date('2025-05-10').getTime() },
            { id: 2, text: '写一个命令行解析器', status: 'done', created: new Date('2025-05-11').getTime() },
            { id: 3, text: '部署到 GitHub Pages', status: 'todo', created: new Date().getTime() }
        ];
        saveToLocalStorage();
    }
    tasks = tasks.map(t => ({ ...t, created: t.created || Date.now() }));
    saveToLocalStorage();
}

function addTerminalLine(text, isError = false) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.style.color = isError ? '#f87171' : '#cbd5e1';
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function renderTable() {
    if (!taskTableBody) return;
    const sorted = [...tasks].sort((a, b) => {
        let valA = a[currentSort.column];
        let valB = b[currentSort.column];
        if (currentSort.column === 'created') {
            valA = a.created || 0;
            valB = b.created || 0;
        }
        if (valA < valB) return currentSort.order === 'asc' ? -1 : 1;
        if (valA > valB) return currentSort.order === 'asc' ? 1 : -1;
        return 0;
    });

    if (sorted.length === 0) {
        taskTableBody.innerHTML = '<tr><td colspan="5">✨ 暂无任务，试试输入：add "学习Git"</td></tr>';
        return;
    }

    taskTableBody.innerHTML = sorted.map(task => `
        <tr data-id="${task.id}">
            <td>${task.id}</td>
            <td>${escapeHtml(task.text)}</td>
            <td><span class="status-badge ${task.status === 'done' ? 'status-done' : 'status-todo'}">${task.status === 'done' ? '✅ 已完成' : '🔄 待办'}</span></td>
            <td>${new Date(task.created).toLocaleString()}</td>
            <td>
                ${task.status === 'todo' ? `<button class="action-btn done-btn" data-id="${task.id}">✓ 完成</button>` : ''}
                <button class="action-btn delete-btn" data-id="${task.id}">🗑 删除</button>
            </td>
        </tr>
    `).join('');

    document.querySelectorAll('.done-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            markTaskDone(id);
        });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            deleteTaskById(id);
        });
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function getNextId() {
    return tasks.length === 0 ? 1 : Math.max(...tasks.map(t => t.id)) + 1;
}

function addTask(text) {
    if (!text.trim()) {
        addTerminalLine('❌ 任务内容不能为空', true);
        return false;
    }
    const newTask = {
        id: getNextId(),
        text: text.trim(),
        status: 'todo',
        created: Date.now()
    };
    tasks.push(newTask);
    saveToLocalStorage();
    renderTable();
    addTerminalLine(`✅ 已添加任务 #${newTask.id}: "${newTask.text}"`);
    return true;
}

function markTaskDone(id) {
    const task = tasks.find(t => t.id === id);
    if (task && task.status === 'todo') {
        task.status = 'done';
        saveToLocalStorage();
        renderTable();
        addTerminalLine(`🎉 任务 #${id} 已完成！`);
    } else {
        addTerminalLine(`⚠️ 任务 #${id} 不存在或已完成`, true);
    }
}

function deleteTaskById(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        const removed = tasks.splice(index, 1)[0];
        saveToLocalStorage();
        renderTable();
        addTerminalLine(`🗑 已删除任务 #${id}: "${removed.text}"`);
    } else {
        addTerminalLine(`❌ 未找到任务 #${id}`, true);
    }
}

function clearAllTasks() {
    tasks = [];
    saveToLocalStorage();
    renderTable();
    addTerminalLine('🧹 所有任务已清空');
}

function listTasksInTerminal() {
    if (tasks.length === 0) {
        addTerminalLine('📭 当前没有任何任务');
        return;
    }
    addTerminalLine(`📋 共有 ${tasks.length} 个任务：`);
    tasks.forEach(t => {
        const statusIcon = t.status === 'done' ? '✅' : '🟡';
        addTerminalLine(`  #${t.id} ${statusIcon} ${t.text} (${new Date(t.created).toLocaleDateString()})`);
    });
}

function showHelp() {
    addTerminalLine('📖 可用命令：');
    addTerminalLine('  add "任务内容"      - 添加新任务（注意用双引号包裹内容）');
    addTerminalLine('  list                - 在终端列出所有任务');
    addTerminalLine('  done <id>           - 标记任务为已完成，例：done 2');
    addTerminalLine('  delete <id>         - 删除任务，例：delete 3');
    addTerminalLine('  clear               - 清空所有任务');
    addTerminalLine('  help                - 显示本帮助');
    addTerminalLine('💡 另外：点击表格列头可排序，点击“完成/删除”按钮也可操作');
}

function executeCommand(cmdLine) {
    const trimmed = cmdLine.trim();
    if (trimmed === '') return;

    const parts = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < trimmed.length; i++) {
        const ch = trimmed[i];
        if (ch === '"') {
            inQuote = !inQuote;
        } else if (ch === ' ' && !inQuote) {
            if (current) parts.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    if (current) parts.push(current);
    
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
        case 'add':
            if (args.length === 0 || !args[0]) {
                addTerminalLine('用法：add "任务内容"', true);
            } else {
                addTask(args[0]);
            }
            break;
        case 'list':
            listTasksInTerminal();
            break;
        case 'done':
            if (args.length === 0 || isNaN(parseInt(args[0]))) {
                addTerminalLine('用法：done <任务ID>', true);
            } else {
                markTaskDone(parseInt(args[0]));
            }
            break;
        case 'delete':
            if (args.length === 0 || isNaN(parseInt(args[0]))) {
                addTerminalLine('用法：delete <任务ID>', true);
            } else {
                deleteTaskById(parseInt(args[0]));
            }
            break;
        case 'clear':
            clearAllTasks();
            break;
        case 'help':
            showHelp();
            break;
        default:
            addTerminalLine(`未知命令: ${cmd}，输入 help 查看帮助`, true);
    }
}

function setupSorting() {
    const ths = document.querySelectorAll('#taskTable th[data-sort]');
    ths.forEach(th => {
        th.addEventListener('click', () => {
            const column = th.getAttribute('data-sort');
            if (currentSort.column === column) {
                currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.order = 'asc';
            }
            renderTable();
            ths.forEach(t => t.style.opacity = '0.7');
            th.style.opacity = '1';
        });
    });
}

function init() {
    loadFromLocalStorage();
    renderTable();
    setupSorting();

    runBtn.addEventListener('click', () => {
        const cmd = commandInput.value;
        if (cmd.trim()) {
            addTerminalLine(`> ${cmd}`);
            executeCommand(cmd);
            commandInput.value = '';
        }
        commandInput.focus();
    });
    commandInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            runBtn.click();
        }
    });
    clearStorageBtn.addEventListener('click', () => {
        if (confirm('⚠️ 确定要清空所有任务吗？不可恢复！')) {
            clearAllTasks();
        }
    });
}

init();