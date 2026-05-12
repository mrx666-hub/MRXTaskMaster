# MRXTaskMaster
全功能命令行任务管理器（TaskMaster）：原生 JS 实现完整 MVC 结构，支持动态表格排序、localStorage 存储、命令式交互。代码结构清晰，可直接部署为 PWA。  
# 📟 MRXTaskMaster
一款纯原生 JavaScript 构建的“命令行 + 表格”双模任务管理器
🚀 概述
MRXTaskMaster 是一个无需任何后端、无需任何前端框架的单页 Web 应用。它同时提供：
模拟终端界面：支持 `add`、`list`、`done`、`delete`、`clear`、`help` 等命令。
动态表格视图：点击列头即可排序（ID / 内容 / 状态 / 创建时间），并支持行内操作（完成 / 删除）。
数据持久化：基于浏览器 `localStorage`，刷新页面或关闭浏览器后数据不丢失。
🎯 核心功能
| 模块         | 功能说明                                                                 |
| 命令行   | 支持引号包裹的任务内容，命令历史输出，实时反馈。                                 |
| 表格排序 | 点击任意列标题可升序/降序切换，排序状态采用稳定排序算法。                         |
| 任务状态 | 待办（🟡）与已完成（✅）状态通过彩色徽章区分。                                  |
| 数据存储 | 所有任务自动存入 `localStorage`，刷新页面后自动恢复。                            |
| 响应式   | 完美适配手机、平板、桌面，表格可横向滚动。                                       |
🧪 快速体验
在线演示（无需安装）
👉 [https://mrx666-hub.github.io/MRXTaskMaster/](https://mrx666-hub.github.io/MRXTaskMaster/)
本地运行
bash
克隆仓库
git clone https://github.com/mrx666-hub/MRXTaskMaster.git
cd MRXTaskMaster
直接用浏览器打开 index.html 即可
📖 命令行参考手册
命令	                    说明	                                                       示例
help	                显示帮助信息	                                                     help
add        "任务描述"	添加新任务（必须使用双引号包裹描述）           	            add "复习 Git 命令"
list	      在终端输出所有任务的简要列表                                                 list
done        <任务ID>	将指定 ID 的任务标记为“已完成”	                                   done 2
delete      <任务ID>	永久删除指定 ID 的任务	                                          delete 3
clear	      清空所有任务（不可恢复，会有二次确认）	clear
除了命令行，你也可以直接点击表格中的 ✓ 完成 或 🗑 删除 按钮进行操作。
点击表格列头可以升序/降序排列任务。

🧱 项目结构
text
MRXTaskMaster/
├── index.html         # 主页面结构
├── style.css          # 完全自定义的 CSS（暗色主题 + 动画）
├── script.js          # 纯原生 JS 逻辑
└── README.md          # 项目文档
⚙️ 技术架构深度剖析
层级	        技术实现
数据层       	tasks 数组 + localStorage 封装
命令解析	      手动实现带引号参数的解析器，支持命令分发
渲染排序	      currentSort 状态 + Array.sort() + 动态 innerHTML + 事件委托
样式系统	      CSS Grid + Flex + 毛玻璃效果 + 移动优先响应式
📦 部署指南
本项目已通过 GitHub Pages 部署：

进入仓库 Settings → Pages

选择分支 main 和目录 / (root)

保存，等待 1 分钟即可通过 https://mrx666-hub.github.io/MRXTaskMaster/ 访问

📄 许可证
MIT © 2025 mrx666-hub

📬 联系作者
GitHub: @mrx666-hub
