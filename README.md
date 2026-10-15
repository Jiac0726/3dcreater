# AI Scene Studio / 3dcreater

当前开发版：**v0.2-alpha**。以自然语言描述交互式 3D 场景，生成 SceneSpec，然后用 Three.js 场景引擎预览。

## 运行

```sh
git clone https://github.com/Jiac0726/3dcreater.git
cd 3dcreater
python -m http.server 8000
```

打开 http://localhost:8000 。需要互联网下载 Three.js CDN。**不要直接双击源项目 index.html**，因为它包含本地 ESM 导入。

## 支持的场景
- 极地冰山果冻：企鹅、浮冰、水面、船只。
- 微缩火山岛：火山、树、船、动物、水面。
- 果冻实验室：果冻、液压装置。

## 能力与限制

- 中文关键词规则转换成 `SceneSpec`；当前**没有调用 LLM API，也不能保证理解任意描述**。
- 支持预览、部分参数控制、文字编辑企鹅数量及颜色、JSON 导出。
- HTML 导出尝试内嵌 SceneSpec 模块，但依然依赖 CDN 的 Three.js；尚未做浏览器端导出验收。
- 物理效果为简化动画，不是 WebGPU 流体模拟或 XPBD。
- v1.0 九项强制验收见 [docs/ACCEPTANCE_V1.md](docs/ACCEPTANCE_V1.md)，尚未全部完成。

## 开发检查

```sh
node --test tests/scene-spec.test.mjs
```

已在开发环境执行 SceneSpec 三场景与修改逻辑的独立冒烟检查；浏览器 GPU 渲染测试尚未执行。正式发布前必须完成 AC-01 至 AC-09 的全部验证。

## 结构

- `index.html` 浏览器编辑器、交互式预览。
- `src/scene-spec.mjs` 场景协议与规则规划器、修改和校验。
- `tests/scene-spec.test.mjs` Node 内置测试。
- `docs/ACCEPTANCE_V1.md` v1.0 发布门禁。
