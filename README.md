# AI Scene Studio MVP

一句话生成交互式 3D 场景：冰山果冻、企鹅、浮冰、破冰船与海浪。

## 运行
直接打开 index.html；需要可用的 WebGL 浏览器与互联网连接，以加载 Three.js CDN。
若浏览器禁止本地 module import，使用 `python -m http.server 8000` 并访问 `http://localhost:8000`。

## 功能
- 中文描述转场景配置（**关键词规则/模板驱动，不是 LLM**）
- 基于 Three.js 的真正 3D 实时预览
- 材质配色、企鹅数量、波浪和透明度实时编辑
- 点击浮冰、崩解冰川、搅动海面、鼠标环绕及缩放
- 导出附带当前场景配置的 HTML

## 限制
- 目前不支持通用语言理解、任意场景建模；需要后端 LLM + SceneSpec 校验 + 生成器。
- 海浪是顶点位移动画，不是 CFD；冰块下落是简化动画，不是刚体碰撞。
- HTML 导出仍需要联网加载 Three.js。软件许可与外部依赖请在正式部署前确认。
- 不包含原 Iceberg Jelly 的 WebGPU 引擎，系独立生成原型。
