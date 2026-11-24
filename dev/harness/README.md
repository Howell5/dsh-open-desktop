# 拖拽验证台

不需要启动 DSH：这里用假数据把板面挂进普通浏览器，专门验证拖动交互。

```bash
cd plugin
npm run harness          # 生成 dev/harness/bundle.js
# 任选一个静态服务器，例如从仓库根目录：
python3 -m http.server 4177
# 打开 http://127.0.0.1:4177/plugin/dev/harness/index.html
```

夹具里有 6 张不同尺寸的卡片（6×4、4×3、12×3），拖动卡片标题即可排序。
假 EventSource / fetch 会模拟 `card-reorder` 回推，用来检验乐观顺序与服务端确认。

`bundle.js` 是生成物，不提交。
