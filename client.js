/**
 * Open Desktop · client
 *
 * Generated from src/client by `npm run build`. Do not edit by hand.
 */
window.__ModuleLoader__.load({
  id: 'dsh-open-desktop',
  factory(require) {
    const module = { exports: {} };
    const exports = module.exports;
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key2 of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key2) && key2 !== except)
            __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

    // src/client/index.js
    var index_exports = {};
    __export(index_exports, {
      default: () => main_default
    });
    module.exports = __toCommonJS(index_exports);

    // src/client/main.js
    var import_react6 = __toESM(require("react"), 1);

    // src/client/styles.css
    var styles_default = `.od-root,.od-root *{box-sizing:border-box}
    .od-root{--od-bg:var(--dsw-alias-bg-base,#fff);--od-fg:var(--dsw-alias-label-primary,#111);--od-fg-2:var(--dsw-alias-label-secondary,#666);--od-fg-3:color-mix(in srgb,var(--od-fg) 46%,transparent);--od-line:color-mix(in srgb,var(--od-fg) 8%,transparent);--od-line-strong:color-mix(in srgb,var(--od-fg) 16%,transparent);--od-hover:var(--dsw-alias-interactive-bg-hover,rgba(17,17,17,.05));--od-surface-2:color-mix(in srgb,var(--od-fg) 5%,transparent);--od-green:#16a34a;--od-red:#dc2626;--od-amber:#d97706;--od-blue:#2563eb;--od-action-fill:#2563eb;--od-radius:8px;--od-r-control:8px;--od-r-surface:10px;--od-card-radius:12px;--od-gap:8px;--od-space-1:4px;--od-space-2:8px;--od-space-3:12px;--od-space-4:16px;--od-space-6:24px;--od-space-8:32px;--od-text-xs:11px;--od-text-sm:12px;--od-text-md:13px;--od-text-lg:14px;--od-text-metric:20px;--od-text-hero:34px;--od-shadow:none;--od-shadow-pop:0 12px 32px rgba(0,0,0,.35);position:relative;display:flex;flex-direction:column;flex:1 1 auto;min-height:0;height:100%;width:100%;overflow:hidden;background:var(--od-bg);color:var(--od-fg);font-family:inherit;font-size:14px;line-height:1.45}
    body[data-ds-dark-theme] .od-root{--od-green:#34d399;--od-red:#f87171;--od-amber:#fbbf24;--od-blue:#60a5fa;--od-action-fill:#1d4ed8;--od-shadow:none}
    .od-root.od-session-actions{flex:0 1 auto;flex-direction:row;align-items:center;flex-wrap:wrap;gap:4px;height:auto;width:auto;overflow:visible;background:transparent}
    .od-card-preview{padding:0;border:1px solid var(--od-line-strong);border-radius:var(--od-card-radius);width:560px;max-width:calc(100vw - 32px);max-height:calc(100vh - 48px);background:var(--od-bg);color:var(--od-fg);box-shadow:var(--od-shadow-pop);overflow:auto}
    .od-card-preview::backdrop{background:color-mix(in srgb,var(--od-fg) 16%,transparent)}
    .od-preview-inner{padding:16px}
    .od-preview-head{display:flex;align-items:center;gap:12px;margin-bottom:16px}
    .od-preview-content{display:flex;flex-direction:column;min-height:160px;max-height:640px;overflow:hidden}
    .od-root button{font:inherit;color:inherit}
    .od-root :focus-visible{outline:2px solid color-mix(in srgb,var(--od-blue) 55%,transparent);outline-offset:2px}
    .od-top{flex:none;display:flex;align-items:center;gap:8px;flex-wrap:nowrap;padding:16px 24px 12px}
    .od-top-main{display:flex;align-items:baseline;gap:8px;min-width:0;flex:1 1 auto}
    .od-title{margin:0;font-size:var(--od-text-lg);font-weight:600;letter-spacing:-.005em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .od-meta{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:var(--od-text-xs);color:var(--od-fg-3);white-space:nowrap}
    .od-top-right{display:flex;align-items:center;gap:2px;flex:none;margin-left:auto}
    .od-live{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:var(--od-fg-2)}
    .od-live-dot{width:6px;height:6px;border-radius:50%;background:currentColor}
    .od-live[data-mode="sse"]{color:var(--od-green)}
    .od-live[data-mode="polling"]{color:var(--od-amber)}
    .od-live[data-mode="offline"]{color:var(--od-red)}
    .od-btn{height:28px;padding:0 10px;border-radius:var(--od-r-control);border:1px solid var(--od-line);background:transparent;color:var(--od-fg);font-size:var(--od-text-md);font-weight:500;display:inline-flex;align-items:center;gap:6px;cursor:pointer;white-space:nowrap}
    .od-btn:hover:not(:disabled){background:var(--od-hover)}
    .od-btn:disabled{opacity:.45;cursor:default}
    .od-root .od-btn-primary{background:var(--od-action-fill);color:#fff;border-color:transparent}
    .od-root .od-btn-primary:hover:not(:disabled){background:var(--od-action-fill);opacity:.9}
    .od-btn-primary:hover:not(:disabled){background:var(--od-action-fill);opacity:.9}
    .od-btn-ghost{border-color:transparent;color:var(--od-fg-2)}
    .od-btn-sm{height:24px;padding:0 8px;font-size:var(--od-text-sm)}
    .od-btn-danger{color:var(--od-red)}
    .od-select{height:24px;border-radius:var(--od-r-control);border:1px solid var(--od-line);background:transparent;color:var(--od-fg);font-size:var(--od-text-sm);padding:0 6px}
    .od-banner{flex:none;padding:0 24px 10px}
    .od-error{display:flex;gap:8px;padding:8px 12px;border-radius:10px;background:color-mix(in srgb,var(--od-red) 8%,transparent);color:var(--od-red);font-size:12.5px}
    .od-error-text{flex:1 1 auto;min-width:0}
    .od-error-x{border:0;background:transparent;color:inherit;cursor:pointer}
    .od-toast{flex:none;display:flex;align-items:center;gap:8px;margin:0 24px 10px;padding:7px 12px;border-radius:12px;border:.5px solid color-mix(in srgb,var(--od-green) 30%,var(--od-line));background:color-mix(in srgb,var(--od-green) 7%,transparent);font-size:12.5px}
    .od-toast-text{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .od-body{flex:1 1 auto;min-height:0;display:flex;align-items:stretch}
    .od-main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;min-height:0}
    .od-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;padding:4px 24px 28px}
    .od-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-auto-rows:40px;gap:8px;align-content:start}
    .od-card{position:relative;display:flex;flex-direction:column;min-width:0;min-height:0;padding:16px;border-radius:var(--od-card-radius);border:1px solid var(--od-line);background:var(--od-bg);box-shadow:var(--od-shadow);overflow:visible;transition:border-color .12s ease}
    .od-card:hover{border-color:var(--od-line-strong)}
    .od-dragging{cursor:grabbing}
    .od-dragging .od-iframe{pointer-events:none}
    .od-card-grip{flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:8px;height:100%;cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none}
    .od-card-grip:active{cursor:grabbing}
    .od-card-grip:focus-visible{outline:2px solid color-mix(in srgb,var(--od-blue) 55%,transparent);outline-offset:2px;border-radius:4px}
    .od-dragging .od-card-grip{cursor:grabbing}
    .od-card[data-drag="true"]{border-color:transparent;background:transparent}
    .od-drop-slot{position:relative;border:2px dashed color-mix(in srgb,var(--od-blue) 62%,transparent);border-radius:var(--od-card-radius);background:color-mix(in srgb,var(--od-blue) 6%,transparent);display:flex;align-items:center;justify-content:center;min-width:0;min-height:0}
    .od-drop-slot-inner{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:var(--od-text-xs);color:color-mix(in srgb,var(--od-blue) 72%,var(--od-fg));background:var(--od-bg);border-radius:999px;padding:2px 8px}
    .od-drag-layer{pointer-events:none}
    .od-drag-overlay{pointer-events:none;display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid color-mix(in srgb,var(--od-blue) 55%,var(--od-line));border-radius:var(--od-card-radius);background:color-mix(in srgb,var(--od-blue) 8%,var(--od-bg));box-shadow:0 18px 48px rgba(0,0,0,.28);transform:scale(1.015);cursor:grabbing}
    .od-drag-overlay-top{display:flex;align-items:center;gap:10px;min-width:0}
    .od-drag-overlay-title{font-size:var(--od-text-md);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .od-drag-overlay-size{margin-left:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:var(--od-text-xs);color:var(--od-fg-3);white-space:nowrap}
    .od-drag-overlay-hint{margin-top:auto;font-size:var(--od-text-xs);color:var(--od-fg-2)}
    .od-card[data-state="stale"]{border-color:color-mix(in srgb,var(--od-amber) 45%,var(--od-line))}
    .od-card[data-state="broken"]{border-color:color-mix(in srgb,var(--od-red) 45%,var(--od-line))}
    .od-card-head{flex:none;display:flex;align-items:center;gap:8px;height:28px;min-width:0}
    .od-card-title{flex:1 1 auto;min-width:0;font-size:var(--od-text-md);font-weight:600;letter-spacing:0;color:var(--od-fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .od-state-dot{flex:none;width:16px;height:16px;margin-left:-4px;padding:0;border:0;background:transparent;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;cursor:pointer;color:var(--od-green);position:relative}
    .od-state-dot::after{content:'';position:absolute;inset:-3px;border-radius:999px}
    .od-state-dot:hover{background:var(--od-hover)}
    .od-state-dot::before{content:'';flex:none;width:8px;height:8px;border-radius:50%;background:currentColor;display:block;box-shadow:0 0 0 2px color-mix(in srgb,currentColor 18%,transparent);transition:box-shadow .12s ease}
    .od-state-dot:hover::before{box-shadow:0 0 0 3px color-mix(in srgb,currentColor 26%,transparent)}
    .od-state-dot[data-state="ok"]{color:var(--od-green)}
    .od-state-dot[data-state="loading"]{color:var(--od-blue)}
    .od-state-dot[data-state="stale"]{color:var(--od-amber)}
    .od-state-dot[data-state="broken"]{color:var(--od-red)}
    .od-state-dot[data-state="static"]{color:var(--od-fg-2);cursor:default}
    .od-state-dot[data-state="static"]:hover{background:transparent}
    .od-state-dot[data-state="static"]::before{background:transparent;box-shadow:inset 0 0 0 2px currentColor,0 0 0 2px color-mix(in srgb,currentColor 10%,transparent)}
    .od-badge{flex:none;font-size:var(--od-text-xs);padding:1px 6px;border-radius:999px;border:0;background:var(--od-surface-2);color:var(--od-fg-2);white-space:nowrap}
    .od-icon-btn-raised{background:var(--od-surface-2);color:var(--od-fg)}
    .od-icon-btn-raised:hover{background:color-mix(in srgb,var(--od-fg) 9%,transparent)}
    .od-icon-btn{flex:none;width:28px;height:28px;border-radius:var(--od-r-control);border:0;background:transparent;color:var(--od-fg-2);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
    .od-icon-btn:hover{background:var(--od-hover)}
    .od-menu-anchor{position:relative;flex:none;display:flex}
    .od-menu{position:absolute;top:30px;right:0;min-width:132px;padding:4px;background:var(--od-bg);border:1px solid var(--od-line);border-radius:var(--od-r-surface);box-shadow:var(--od-shadow-pop);z-index:30;display:flex;flex-direction:column}
    .od-menu-item{border:0;background:transparent;text-align:left;padding:6px 10px;border-radius:var(--od-r-control);font-size:var(--od-text-md);cursor:pointer;white-space:nowrap}
    .od-menu-item:hover{background:var(--od-hover)}
    .od-menu-item[data-danger="true"]{color:var(--od-red)}
    .od-menu-sep{height:1px;margin:4px 2px;background:var(--od-line)}
    .od-card-actions{flex:none;width:58px;display:flex;align-items:center;justify-content:flex-end;gap:2px;opacity:0;pointer-events:none;transition:opacity .12s ease}
    .od-card:hover .od-card-actions,.od-card:focus-within .od-card-actions,.od-card:has(.od-menu) .od-card-actions{opacity:1;pointer-events:auto}
    .od-dragging .od-card-actions{opacity:0;pointer-events:none}
    @media (hover:none){.od-card-actions{opacity:1;pointer-events:auto}}
    .od-card-actions .od-icon-btn{width:28px;height:28px;border-radius:var(--od-r-control)}
    .od-resize{position:absolute;right:0;bottom:0;width:24px;height:24px;cursor:nwse-resize;opacity:0;transition:opacity .12s;z-index:5}
    .od-card:hover .od-resize{opacity:.55}
    .od-resize::after{content:'';position:absolute;right:5px;bottom:5px;width:9px;height:9px;border-right:2px solid var(--od-fg-2);border-bottom:2px solid var(--od-fg-2);border-bottom-right-radius:2px}
    .od-body-slot{flex:1 1 auto;min-height:0;margin-top:12px;display:flex;flex-direction:column;overflow:hidden}
    .od-renderer{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:12px;overflow:hidden}
    .od-metric-label{font-size:var(--od-text-xs);color:var(--od-fg-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .od-metric-value{font-size:var(--od-text-hero);font-weight:600;letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .od-metric-row{display:flex;align-items:baseline;gap:8px}
    .od-delta{font-size:var(--od-text-xs);font-weight:500;font-variant-numeric:tabular-nums}
    .od-up{color:var(--od-green)}
    .od-down{color:var(--od-red)}
    .od-warn{color:var(--od-amber)}
    .od-rows{flex:1 1 auto;min-height:0}
    .od-metric-block{flex:none}
    .od-table-head,.od-table-row{display:grid;gap:2px 10px;align-items:center}
    .od-table-row{padding:3px 0;border-top:.5px solid color-mix(in srgb,var(--od-line) 60%,transparent)}
    .od-suggest{flex:none;border:.5px solid color-mix(in srgb,var(--od-amber) 45%,var(--od-line));background:color-mix(in srgb,var(--od-amber) 10%,transparent);color:var(--od-amber);border-radius:999px;font-size:10.5px;padding:1px 8px;cursor:pointer}
    .od-suggest:hover{background:color-mix(in srgb,var(--od-amber) 16%,transparent)}
    .od-row{display:flex;align-items:baseline;gap:8px;min-width:0;font-size:12.5px;text-decoration:none;color:inherit}
    a.od-row:hover .od-row-label{text-decoration:underline}
    .od-row-wrap{display:flex;flex-direction:column;gap:1px;min-width:0;text-decoration:none;color:inherit}
    .od-row-wrap:hover .od-row-label{text-decoration:underline}
    .od-row-label{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .od-row-value{flex:none;font-variant-numeric:tabular-nums}
    .od-row-sub{font-size:10.5px;color:var(--od-fg-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .od-more{border:0;background:transparent;color:var(--od-fg-2);font-size:11px;text-align:left;cursor:pointer;padding:2px 0}
    .od-aborted{font-size:10.5px;color:var(--od-fg-2);padding:2px 6px;border-radius:6px;border:.5px dashed var(--od-line);align-self:flex-start}
    .od-table{display:grid;gap:4px 10px;font-size:12px;overflow:hidden}
    .od-th{color:var(--od-fg-2);font-size:11px;font-weight:600}
    .od-td{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums}
    .od-skel{background:var(--od-hover);border-radius:6px;height:11px;animation:od-pulse 1.6s ease-in-out infinite}
    @keyframes od-pulse{0%,100%{opacity:.55}50%{opacity:.95}}
    .od-fallback{flex:none;font-size:10.5px;color:var(--od-amber);background:color-mix(in srgb,var(--od-amber) 8%,transparent);border-radius:8px;padding:3px 8px;margin-bottom:4px}
    .od-broken{display:flex;flex-direction:column;gap:8px;font-size:12.5px;color:var(--od-red)}
    .od-broken-msg{overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-word}
    .od-iframe-wrap{position:relative;flex:1 1 auto;min-height:0;display:flex}
    .od-iframe{width:100%;height:100%;border:0;background:transparent;display:block}
    .od-mask{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:12px;background:color-mix(in srgb,var(--od-bg) 88%,transparent);backdrop-filter:blur(2px);border-radius:var(--od-radius)}
    .od-mask-card{display:flex;flex-direction:column;align-items:flex-start;gap:6px;max-width:100%}
    .od-mask-title{font-size:12.5px;font-weight:600}
    .od-mask-sub{font-size:11px;color:var(--od-fg-2);line-height:1.5}
    .od-rows[data-scroll="true"]{overflow-y:auto;scrollbar-width:thin}
    .od-chat-panel{flex:none;min-width:280px;max-width:62%;display:flex;flex-direction:column;min-height:0;overflow:hidden;border-left:.5px solid var(--od-line);background:color-mix(in srgb,var(--od-fg) 1.5%,transparent)}
    .od-resizer{flex:none;width:6px;cursor:col-resize}
    .od-resizer:hover{background:var(--od-line)}
    .od-chat-head{flex:none;display:flex;align-items:center;gap:8px;padding:10px 12px 8px}
    .od-chat-title{font-size:12.5px;font-weight:600}
    .od-chat-list{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;padding:2px 12px 10px;display:flex;flex-direction:column;gap:10px}
    .od-turn{display:flex;flex-direction:column;gap:6px}
    .od-user{align-self:flex-end;max-width:92%;padding:7px 11px;border-radius:12px;background:color-mix(in srgb,var(--od-blue) 15%,transparent);font-size:12.5px;white-space:pre-wrap;overflow-wrap:anywhere}
    .od-step{display:flex;flex-direction:column;gap:6px}
    .od-assistant{max-width:96%;padding:8px 11px;border-radius:12px;background:color-mix(in srgb,var(--od-fg) 5%,transparent);font-size:12.5px;line-height:1.55;overflow-wrap:break-word}
    .od-line,.od-assistant p,.od-md-list li{overflow-wrap:anywhere}
    .od-md-table td,.od-md-table th{overflow-wrap:break-word;word-break:normal}
    .od-line{margin:0}
    .od-line-gap{height:5px}
    .od-line-li{position:relative;padding-left:12px}
    .od-line-li::before{content:'\xB7';position:absolute;left:2px;opacity:.55}
    .od-code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.92em;padding:0 4px;border-radius:4px;background:color-mix(in srgb,var(--od-fg) 8%,transparent)}
    .od-md-table-wrap{margin:6px 0;max-width:100%;overflow-x:auto}
    .od-md-table{border-collapse:collapse;font-size:11.5px;width:100%;min-width:320px}
    .od-md-table th,.od-md-table td{border:.5px solid var(--od-line);padding:4px 7px;text-align:left;vertical-align:top}
    .od-md-table th{background:color-mix(in srgb,var(--od-fg) 6%,transparent);color:var(--od-fg-2);font-weight:600;white-space:nowrap}
    .od-md-table td{color:var(--od-fg)}
    .od-md-code{margin:6px 0;padding:8px 10px;border-radius:8px;background:color-mix(in srgb,var(--od-fg) 8%,transparent);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.55;overflow-x:auto;white-space:pre}
    .od-md-heading{margin:8px 0 4px;font-weight:600;font-size:13px}
    .od-md-heading[data-level="1"]{font-size:15px}
    .od-md-heading[data-level="2"]{font-size:14px}
    .od-md-hr{border:0;border-top:.5px solid var(--od-line);margin:8px 0}
    .od-md-quote{margin:6px 0;padding:2px 0 2px 10px;border-left:2px solid var(--od-line);color:var(--od-fg-2)}
    .od-md-list{margin:4px 0;padding-left:18px;display:flex;flex-direction:column;gap:2px}
    .od-md-list li{line-height:1.5}
    .od-stream::after{content:'';display:inline-block;width:6px;height:12px;margin-left:2px;background:currentColor;opacity:.6;animation:od-caret 1s steps(2) infinite;vertical-align:-2px}
    @keyframes od-caret{0%,49%{opacity:.6}50%,100%{opacity:0}}
    .od-details{border:0;background:transparent;padding:0;display:flex;flex-direction:column;gap:4px}
    .od-details-head{display:flex;align-items:center;gap:6px;border:0;background:transparent;color:var(--od-fg-2);font:inherit;font-size:11.5px;padding:2px 0;cursor:pointer;text-align:left}
    .od-details-head:hover{color:var(--od-fg)}
    .od-details-dot{width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.7}
    .od-details-count{flex:none;white-space:nowrap}
    .od-details-dot[data-status="running"]{background:var(--od-amber)}
    .od-details-dot[data-status="error"]{background:var(--od-red)}
    .od-details-digest{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--od-fg-2);font-size:10.5px;opacity:.9}
    .od-details-head .od-hint{margin-left:auto}
    .od-details-bad{flex:none;color:var(--od-red);font-size:10.5px;font-variant-numeric:tabular-nums}
    .od-details-time{flex:none;color:var(--od-fg-2);font-size:10.5px;font-variant-numeric:tabular-nums}
    .od-details-live{padding:1px 0 2px 11px;font-size:10.5px;color:var(--od-fg-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .od-tool-list{display:flex;flex-direction:column;gap:4px}
    .od-tool-meta{flex:none;color:var(--od-fg-2);font-size:10.5px;font-variant-numeric:tabular-nums;white-space:nowrap}
    .od-tool[data-status="error"] .od-tool-name{color:var(--od-red)}
    .od-tool{display:flex;align-items:center;gap:7px;padding:4px 8px;border-radius:8px;background:color-mix(in srgb,var(--od-fg) 3%,transparent);font-size:11.5px;color:var(--od-fg-2);border:0;text-align:left;cursor:pointer}
    .od-tool::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;flex:none}
    .od-tool[data-status="ok"]::before{background:var(--od-green)}
    .od-tool[data-status="error"]::before{background:var(--od-red)}
    .od-tool[data-status="running"]::before{background:var(--od-amber)}
    .od-tool-name{flex:none;color:var(--od-fg)}
    .od-tool-detail{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .od-tool-expand{font-size:11px;color:var(--od-fg-2);padding:2px 8px;overflow-wrap:anywhere}
    .od-sysnote{display:flex;flex-direction:column;gap:5px}
    .od-chat-title{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .od-chat-head .od-live{flex:none}
    .od-sysnote-chip{align-self:flex-start;display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:999px;border:.5px solid var(--od-line);background:color-mix(in srgb,var(--od-fg) 3%,transparent);color:var(--od-fg-2);font-size:11px;cursor:pointer}
    .od-sysnote-chip:hover{color:var(--od-fg);background:var(--od-hover)}
    .od-sysnote-dot{width:5px;height:5px;border-radius:50%;background:var(--od-fg-2);opacity:.7}
    .od-sysnote-label{color:var(--od-fg)}
    .od-sysnote-count{font-variant-numeric:tabular-nums;opacity:.9}
    .od-sysnote-hint{opacity:.7}
    .od-sysnote-body{margin:0;padding:8px 10px;border-radius:8px;border:.5px dashed var(--od-line);background:color-mix(in srgb,var(--od-fg) 2.5%,transparent);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;line-height:1.55;color:var(--od-fg-2);white-space:pre-wrap;overflow-wrap:anywhere;max-height:180px;overflow-y:auto}
    .od-chat-empty{font-size:12px;color:var(--od-fg-2);line-height:1.6}
    .od-chat-empty .od-chips{margin-top:7px}
    .od-chat-empty .od-chip{font-size:10.5px;padding:2px 8px}
    .od-composer{flex:none;border-top:.5px solid var(--od-line);padding:8px 12px 12px;display:flex;flex-direction:column;gap:6px}
    .od-input{width:100%;padding:7px 9px;border-radius:var(--od-r-control);border:1px solid var(--od-line);background:var(--od-bg);color:var(--od-fg);font:inherit;font-size:var(--od-text-md);outline:none}
    .od-input:focus{border-color:var(--od-blue)}
    textarea.od-input{resize:none;line-height:1.5}
    .od-composer-row{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .od-hint{font-size:10.5px;color:var(--od-fg-2)}
    .od-overlay{position:fixed;inset:0;background:rgba(0,0,0,.42);display:flex;align-items:center;justify-content:center;z-index:60;padding:24px}
    .od-modal{width:min(560px,92vw);max-height:86vh;display:flex;flex-direction:column;background:var(--od-bg);color:var(--od-fg);border-radius:var(--od-card-radius);border:1px solid var(--od-line);overflow:hidden;box-shadow:var(--od-shadow-pop)}
    .od-modal-head{flex:none;display:flex;align-items:center;gap:8px;padding:14px 16px 10px}
    .od-modal-title{margin:0;font-size:var(--od-text-lg);font-weight:600}
    .od-modal-body{flex:1 1 auto;min-height:0;overflow-y:auto;padding:0 16px 12px;display:flex;flex-direction:column;gap:10px}
    .od-modal-foot{flex:none;display:flex;align-items:center;gap:8px;padding:10px 16px 14px;border-top:.5px solid var(--od-line)}
    .od-spacer{flex:1 1 auto}
    .od-field{display:flex;flex-direction:column;gap:4px}
    .od-field-label{font-size:11.5px;color:var(--od-fg-2)}
    .od-hint-sm{font-size:10.5px;color:var(--od-fg-2)}
    .od-sizes{display:flex;gap:6px}
    .od-size-btn{border:.5px solid var(--od-line);background:transparent;color:var(--od-fg);border-radius:9px;padding:5px 10px;font-size:11.5px;cursor:pointer;display:flex;flex-direction:column;gap:1px}
    .od-size-btn[data-on="true"]{border-color:var(--od-blue);background:color-mix(in srgb,var(--od-blue) 12%,transparent)}
    .od-size-hint{font-size:9.5px;color:var(--od-fg-2)}
    .od-tpls{display:flex;flex-wrap:wrap;gap:6px}
    .od-tpl{border:.5px solid var(--od-line);background:transparent;color:var(--od-fg);border-radius:10px;padding:7px 10px;font-size:12px;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:2px;min-width:120px}
    .od-tpl[data-on="true"]{border-color:var(--od-blue);background:color-mix(in srgb,var(--od-blue) 12%,transparent)}
    .od-tpl-desc{font-size:10.5px;color:var(--od-fg-2)}
    .od-chips{display:flex;flex-wrap:wrap;gap:6px}
    .od-newcard{display:flex;flex-direction:column;gap:10px}
    .od-scenes{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .od-scene{display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:9px 11px;border-radius:10px;border:1px solid var(--od-line);background:transparent;color:var(--od-fg);cursor:pointer;text-align:left;min-width:0}
    .od-scene:hover{background:var(--od-hover);border-color:var(--od-line-strong)}
    .od-scene[data-on="true"]{border-color:color-mix(in srgb,var(--od-blue) 55%,var(--od-line));background:color-mix(in srgb,var(--od-blue) 7%,transparent)}
    .od-scene-title{font-size:var(--od-text-md);font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .od-scene-blurb{font-size:var(--od-text-xs);color:var(--od-fg-3);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .od-schedule{display:flex;flex-direction:column;gap:6px}
    .od-schedule-row{display:flex;align-items:center;gap:8px;flex-wrap:nowrap;min-width:0}
    .od-schedule-row .od-chips{flex:1 1 auto;min-width:0}
    .od-schedule-row .od-field-label{flex:none;color:var(--od-fg-2)}
    .od-schedule-detail{display:flex;align-items:center;gap:4px;min-height:22px;flex-wrap:wrap}
    .od-time{width:88px;height:22px;padding:0 4px;font-size:var(--od-text-xs);border-radius:6px;flex:none}
    .od-more{width:110px;flex:none}
    .od-limit{color:var(--od-amber)}
    .od-chip{border:.5px solid var(--od-line);background:transparent;color:var(--od-fg-2);border-radius:999px;padding:3px 9px;font-size:11px;cursor:pointer}
    .od-chip[data-on="true"]{border-color:var(--od-blue);color:var(--od-fg);background:color-mix(in srgb,var(--od-blue) 12%,transparent)}
    .od-preview{border:.5px solid var(--od-line);border-radius:12px;padding:10px 12px;min-height:96px;display:flex;flex-direction:column;gap:6px}
    .od-preview-bad{color:var(--od-red);font-size:12px}
    .od-code-input{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;min-height:72px}
    .od-metric-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px;padding:4px 0 8px}
    .od-metric-card{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:10px;background:var(--od-hover);font-size:12px}
    .od-metric-card b{font-size:18px;font-weight:650;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
    .od-metric-value{font-size:12px;color:var(--od-fg-2);font-variant-numeric:tabular-nums}
    .od-card-chat{position:absolute;top:0;right:0;bottom:0;width:min(440px,44%);display:flex;flex-direction:column;background:var(--od-bg);border-left:.5px solid var(--od-line);box-shadow:-18px 0 44px rgba(0,0,0,.28);z-index:20}
    .od-toast-warn{border-color:color-mix(in srgb,var(--od-amber) 40%,var(--od-line));background:color-mix(in srgb,var(--od-amber) 8%,transparent)}
    .od-empty{flex:1 1 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--od-fg-2);font-size:12.5px;padding:48px 0}
    .od-boundary{padding:24px;display:flex;flex-direction:column;gap:10px;font-size:13px}
    .od-value-pill{flex:none;font-size:10.5px;font-weight:600;padding:1px 6px;border-radius:999px;background:color-mix(in srgb,var(--od-fg) 8%,transparent);color:var(--od-fg-2);font-variant-numeric:tabular-nums}


    /* ---------------- \u677F\u9762\u8BBE\u8BA1\u7CFB\u7EDF v1 ---------------- */
    .od-hero{display:flex;flex-direction:column;gap:4px;flex:none}
    .od-hero[data-tone="up"] .od-metric-value{color:var(--od-green)}
    .od-hero[data-tone="down"] .od-metric-value{color:var(--od-red)}
    .od-hero .od-metric-value{font-size:var(--od-text-hero);font-weight:600;letter-spacing:-.03em;line-height:1;color:var(--od-fg)}
    .od-hero-line{display:flex;align-items:baseline;gap:10px;min-width:0}
    .od-delta-pill{flex:none;display:inline-flex;align-items:center;font-size:var(--od-text-xs);font-weight:500;padding:2px 7px;border-radius:999px;background:var(--od-surface-2);color:var(--od-fg-2);font-variant-numeric:tabular-nums}
    .od-delta-pill[data-tone="up"]{color:var(--od-green);background:color-mix(in srgb,var(--od-green) 12%,transparent)}
    .od-delta-pill[data-tone="down"]{color:var(--od-red);background:color-mix(in srgb,var(--od-red) 12%,transparent)}
    .od-delta-pill[data-tone="warn"]{color:var(--od-amber);background:color-mix(in srgb,var(--od-amber) 12%,transparent)}
    .od-rows{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:0}
    .od-rows[data-scroll="true"]{overflow-y:auto;scrollbar-width:thin}
    .od-row-wrap,.od-row{padding:8px 6px;margin:0 -6px;border-radius:6px;min-width:0}
    .od-row-wrap{display:flex;flex-direction:column;gap:1px}
    .od-row{display:flex;align-items:center;gap:8px;font-size:var(--od-text-md);text-decoration:none;color:inherit}
    .od-row-wrap>.od-row{padding:0;margin:0;border-radius:0}
    .od-row-wrap:hover,.od-row:hover{background:var(--od-surface-2)}
    a.od-row:hover .od-row-label{text-decoration:none}
    .od-row-label{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--od-fg)}
    .od-row-value{flex:none;font-size:var(--od-text-md);font-weight:600;font-variant-numeric:tabular-nums;color:var(--od-fg)}
    .od-row-sub{font-size:var(--od-text-xs);color:var(--od-fg-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .od-rank{flex:none;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:var(--od-text-xs);font-variant-numeric:tabular-nums;color:var(--od-fg-3);min-width:18px}
    .od-note{flex:none;margin-top:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:var(--od-text-xs);color:var(--od-fg-3);letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .od-list-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding-bottom:8px;border-bottom:1px solid var(--od-line)}
    .od-list-count{font-size:var(--od-text-xs);color:var(--od-fg-3);font-variant-numeric:tabular-nums}
    .od-table-head{display:grid;gap:2px 12px;align-items:center;padding:0 0 6px}
    .od-renderer-table{gap:6px}
    .od-th{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:var(--od-text-xs);letter-spacing:.07em;text-transform:uppercase;color:var(--od-fg-3);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .od-table-row{display:grid;gap:2px 12px;align-items:center;padding:8px 0;border-top:1px solid var(--od-line)}
    .od-table-row:hover{background:var(--od-surface-2)}
    .od-td{font-size:var(--od-text-md);color:var(--od-fg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums}
    .od-td-key{font-weight:500}
    .od-td-num{text-align:right}
    .od-td.od-up{color:var(--od-green)}
    .od-td.od-down{color:var(--od-red)}
    .od-status-rows{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;overflow:hidden}
    .od-status-row{display:grid;grid-template-columns:10px minmax(0,1fr) auto;column-gap:8px;row-gap:2px;align-items:center;padding:10px 0;border-top:1px solid var(--od-line);flex:1 1 0;min-height:36px}
    .od-status-row:first-child{border-top:0}
    .od-status-dot{width:6px;height:6px;border-radius:50%;background:color-mix(in srgb,var(--od-fg) 55%,transparent);flex:none;grid-column:1;grid-row:1;align-self:center}
    .od-status-row[data-state="up"] .od-status-dot{background:var(--od-green)}
    .od-status-row[data-state="warn"] .od-status-dot{background:var(--od-amber)}
    .od-status-row[data-state="down"] .od-status-dot{background:var(--od-red)}
    .od-status-name{grid-column:2;grid-row:1;min-width:0;font-size:var(--od-text-md);color:var(--od-fg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .od-status-value{grid-column:3;grid-row:1;font-size:var(--od-text-md);font-weight:600;font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
    .od-status-sub{grid-column:2/4;grid-row:2;font-size:var(--od-text-xs);color:var(--od-fg-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .od-more{border:0;background:transparent;color:var(--od-fg-3);font-size:var(--od-text-xs);text-align:left;cursor:pointer;padding:4px 0}
    .od-more:hover{color:var(--od-fg-2)}
    .od-fallback{flex:none;font-size:var(--od-text-xs);color:var(--od-amber);background:color-mix(in srgb,var(--od-amber) 8%,transparent);border-radius:6px;padding:3px 8px}
    .od-suggest{flex:none;border:0;background:color-mix(in srgb,var(--od-amber) 10%,transparent);color:var(--od-amber);border-radius:999px;font-size:var(--od-text-xs);padding:2px 8px;cursor:pointer}
    .od-suggest:hover{background:color-mix(in srgb,var(--od-amber) 16%,transparent)}



    `;

    // src/client/dnd.js
    var import_react5 = __toESM(require("react"), 1);

    // node_modules/@dnd-kit/core/dist/core.esm.js
    var import_react3 = __toESM(require("react"));
    var import_react_dom = require("react-dom");

    // node_modules/@dnd-kit/utilities/dist/utilities.esm.js
    var import_react = require("react");
    function useCombinedRefs() {
      for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
        refs[_key] = arguments[_key];
      }
      return (0, import_react.useMemo)(
        () => (node) => {
          refs.forEach((ref) => ref(node));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        refs
      );
    }
    var canUseDOM = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
    function isWindow(element) {
      const elementString = Object.prototype.toString.call(element);
      return elementString === "[object Window]" || // In Electron context the Window object serializes to [object global]
      elementString === "[object global]";
    }
    function isNode(node) {
      return "nodeType" in node;
    }
    function getWindow(target) {
      var _target$ownerDocument, _target$ownerDocument2;
      if (!target) {
        return window;
      }
      if (isWindow(target)) {
        return target;
      }
      if (!isNode(target)) {
        return window;
      }
      return (_target$ownerDocument = (_target$ownerDocument2 = target.ownerDocument) == null ? void 0 : _target$ownerDocument2.defaultView) != null ? _target$ownerDocument : window;
    }
    function isDocument(node) {
      const {
        Document
      } = getWindow(node);
      return node instanceof Document;
    }
    function isHTMLElement(node) {
      if (isWindow(node)) {
        return false;
      }
      return node instanceof getWindow(node).HTMLElement;
    }
    function isSVGElement(node) {
      return node instanceof getWindow(node).SVGElement;
    }
    function getOwnerDocument(target) {
      if (!target) {
        return document;
      }
      if (isWindow(target)) {
        return target.document;
      }
      if (!isNode(target)) {
        return document;
      }
      if (isDocument(target)) {
        return target;
      }
      if (isHTMLElement(target) || isSVGElement(target)) {
        return target.ownerDocument;
      }
      return document;
    }
    var useIsomorphicLayoutEffect = canUseDOM ? import_react.useLayoutEffect : import_react.useEffect;
    function useEvent(handler) {
      const handlerRef = (0, import_react.useRef)(handler);
      useIsomorphicLayoutEffect(() => {
        handlerRef.current = handler;
      });
      return (0, import_react.useCallback)(function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return handlerRef.current == null ? void 0 : handlerRef.current(...args);
      }, []);
    }
    function useInterval() {
      const intervalRef = (0, import_react.useRef)(null);
      const set = (0, import_react.useCallback)((listener, duration) => {
        intervalRef.current = setInterval(listener, duration);
      }, []);
      const clear = (0, import_react.useCallback)(() => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, []);
      return [set, clear];
    }
    function useLatestValue(value, dependencies) {
      if (dependencies === void 0) {
        dependencies = [value];
      }
      const valueRef = (0, import_react.useRef)(value);
      useIsomorphicLayoutEffect(() => {
        if (valueRef.current !== value) {
          valueRef.current = value;
        }
      }, dependencies);
      return valueRef;
    }
    function useLazyMemo(callback, dependencies) {
      const valueRef = (0, import_react.useRef)();
      return (0, import_react.useMemo)(
        () => {
          const newValue = callback(valueRef.current);
          valueRef.current = newValue;
          return newValue;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...dependencies]
      );
    }
    function useNodeRef(onChange) {
      const onChangeHandler = useEvent(onChange);
      const node = (0, import_react.useRef)(null);
      const setNodeRef = (0, import_react.useCallback)(
        (element) => {
          if (element !== node.current) {
            onChangeHandler == null ? void 0 : onChangeHandler(element, node.current);
          }
          node.current = element;
        },
        //eslint-disable-next-line
        []
      );
      return [node, setNodeRef];
    }
    function usePrevious(value) {
      const ref = (0, import_react.useRef)();
      (0, import_react.useEffect)(() => {
        ref.current = value;
      }, [value]);
      return ref.current;
    }
    var ids = {};
    function useUniqueId(prefix, value) {
      return (0, import_react.useMemo)(() => {
        if (value) {
          return value;
        }
        const id = ids[prefix] == null ? 0 : ids[prefix] + 1;
        ids[prefix] = id;
        return prefix + "-" + id;
      }, [prefix, value]);
    }
    function createAdjustmentFn(modifier) {
      return function(object) {
        for (var _len = arguments.length, adjustments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          adjustments[_key - 1] = arguments[_key];
        }
        return adjustments.reduce((accumulator, adjustment) => {
          const entries = Object.entries(adjustment);
          for (const [key2, valueAdjustment] of entries) {
            const value = accumulator[key2];
            if (value != null) {
              accumulator[key2] = value + modifier * valueAdjustment;
            }
          }
          return accumulator;
        }, {
          ...object
        });
      };
    }
    var add = /* @__PURE__ */ createAdjustmentFn(1);
    var subtract = /* @__PURE__ */ createAdjustmentFn(-1);
    function hasViewportRelativeCoordinates(event) {
      return "clientX" in event && "clientY" in event;
    }
    function isKeyboardEvent(event) {
      if (!event) {
        return false;
      }
      const {
        KeyboardEvent
      } = getWindow(event.target);
      return KeyboardEvent && event instanceof KeyboardEvent;
    }
    function isTouchEvent(event) {
      if (!event) {
        return false;
      }
      const {
        TouchEvent
      } = getWindow(event.target);
      return TouchEvent && event instanceof TouchEvent;
    }
    function getEventCoordinates(event) {
      if (isTouchEvent(event)) {
        if (event.touches && event.touches.length) {
          const {
            clientX: x,
            clientY: y
          } = event.touches[0];
          return {
            x,
            y
          };
        } else if (event.changedTouches && event.changedTouches.length) {
          const {
            clientX: x,
            clientY: y
          } = event.changedTouches[0];
          return {
            x,
            y
          };
        }
      }
      if (hasViewportRelativeCoordinates(event)) {
        return {
          x: event.clientX,
          y: event.clientY
        };
      }
      return null;
    }
    var CSS = /* @__PURE__ */ Object.freeze({
      Translate: {
        toString(transform) {
          if (!transform) {
            return;
          }
          const {
            x,
            y
          } = transform;
          return "translate3d(" + (x ? Math.round(x) : 0) + "px, " + (y ? Math.round(y) : 0) + "px, 0)";
        }
      },
      Scale: {
        toString(transform) {
          if (!transform) {
            return;
          }
          const {
            scaleX,
            scaleY
          } = transform;
          return "scaleX(" + scaleX + ") scaleY(" + scaleY + ")";
        }
      },
      Transform: {
        toString(transform) {
          if (!transform) {
            return;
          }
          return [CSS.Translate.toString(transform), CSS.Scale.toString(transform)].join(" ");
        }
      },
      Transition: {
        toString(_ref) {
          let {
            property,
            duration,
            easing
          } = _ref;
          return property + " " + duration + "ms " + easing;
        }
      }
    });
    var SELECTOR = "a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]";
    function findFirstFocusableNode(element) {
      if (element.matches(SELECTOR)) {
        return element;
      }
      return element.querySelector(SELECTOR);
    }

    // node_modules/@dnd-kit/accessibility/dist/accessibility.esm.js
    var import_react2 = __toESM(require("react"));
    var hiddenStyles = {
      display: "none"
    };
    function HiddenText(_ref) {
      let {
        id,
        value
      } = _ref;
      return import_react2.default.createElement("div", {
        id,
        style: hiddenStyles
      }, value);
    }
    function LiveRegion(_ref) {
      let {
        id,
        announcement,
        ariaLiveType = "assertive"
      } = _ref;
      const visuallyHidden = {
        position: "fixed",
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        margin: -1,
        border: 0,
        padding: 0,
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        clipPath: "inset(100%)",
        whiteSpace: "nowrap"
      };
      return import_react2.default.createElement("div", {
        id,
        style: visuallyHidden,
        role: "status",
        "aria-live": ariaLiveType,
        "aria-atomic": true
      }, announcement);
    }
    function useAnnouncement() {
      const [announcement, setAnnouncement] = (0, import_react2.useState)("");
      const announce = (0, import_react2.useCallback)((value) => {
        if (value != null) {
          setAnnouncement(value);
        }
      }, []);
      return {
        announce,
        announcement
      };
    }

    // node_modules/@dnd-kit/core/dist/core.esm.js
    var DndMonitorContext = /* @__PURE__ */ (0, import_react3.createContext)(null);
    function useDndMonitor(listener) {
      const registerListener = (0, import_react3.useContext)(DndMonitorContext);
      (0, import_react3.useEffect)(() => {
        if (!registerListener) {
          throw new Error("useDndMonitor must be used within a children of <DndContext>");
        }
        const unsubscribe = registerListener(listener);
        return unsubscribe;
      }, [listener, registerListener]);
    }
    function useDndMonitorProvider() {
      const [listeners] = (0, import_react3.useState)(() => /* @__PURE__ */ new Set());
      const registerListener = (0, import_react3.useCallback)((listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      }, [listeners]);
      const dispatch = (0, import_react3.useCallback)((_ref) => {
        let {
          type,
          event
        } = _ref;
        listeners.forEach((listener) => {
          var _listener$type;
          return (_listener$type = listener[type]) == null ? void 0 : _listener$type.call(listener, event);
        });
      }, [listeners]);
      return [dispatch, registerListener];
    }
    var defaultScreenReaderInstructions = {
      draggable: "\n    To pick up a draggable item, press the space bar.\n    While dragging, use the arrow keys to move the item.\n    Press space again to drop the item in its new position, or press escape to cancel.\n  "
    };
    var defaultAnnouncements = {
      onDragStart(_ref) {
        let {
          active
        } = _ref;
        return "Picked up draggable item " + active.id + ".";
      },
      onDragOver(_ref2) {
        let {
          active,
          over
        } = _ref2;
        if (over) {
          return "Draggable item " + active.id + " was moved over droppable area " + over.id + ".";
        }
        return "Draggable item " + active.id + " is no longer over a droppable area.";
      },
      onDragEnd(_ref3) {
        let {
          active,
          over
        } = _ref3;
        if (over) {
          return "Draggable item " + active.id + " was dropped over droppable area " + over.id;
        }
        return "Draggable item " + active.id + " was dropped.";
      },
      onDragCancel(_ref4) {
        let {
          active
        } = _ref4;
        return "Dragging was cancelled. Draggable item " + active.id + " was dropped.";
      }
    };
    function Accessibility(_ref) {
      let {
        announcements = defaultAnnouncements,
        container,
        hiddenTextDescribedById,
        screenReaderInstructions = defaultScreenReaderInstructions
      } = _ref;
      const {
        announce,
        announcement
      } = useAnnouncement();
      const liveRegionId = useUniqueId("DndLiveRegion");
      const [mounted, setMounted] = (0, import_react3.useState)(false);
      (0, import_react3.useEffect)(() => {
        setMounted(true);
      }, []);
      useDndMonitor((0, import_react3.useMemo)(() => ({
        onDragStart(_ref2) {
          let {
            active
          } = _ref2;
          announce(announcements.onDragStart({
            active
          }));
        },
        onDragMove(_ref3) {
          let {
            active,
            over
          } = _ref3;
          if (announcements.onDragMove) {
            announce(announcements.onDragMove({
              active,
              over
            }));
          }
        },
        onDragOver(_ref4) {
          let {
            active,
            over
          } = _ref4;
          announce(announcements.onDragOver({
            active,
            over
          }));
        },
        onDragEnd(_ref5) {
          let {
            active,
            over
          } = _ref5;
          announce(announcements.onDragEnd({
            active,
            over
          }));
        },
        onDragCancel(_ref6) {
          let {
            active,
            over
          } = _ref6;
          announce(announcements.onDragCancel({
            active,
            over
          }));
        }
      }), [announce, announcements]));
      if (!mounted) {
        return null;
      }
      const markup = import_react3.default.createElement(import_react3.default.Fragment, null, import_react3.default.createElement(HiddenText, {
        id: hiddenTextDescribedById,
        value: screenReaderInstructions.draggable
      }), import_react3.default.createElement(LiveRegion, {
        id: liveRegionId,
        announcement
      }));
      return container ? (0, import_react_dom.createPortal)(markup, container) : markup;
    }
    var Action;
    (function(Action2) {
      Action2["DragStart"] = "dragStart";
      Action2["DragMove"] = "dragMove";
      Action2["DragEnd"] = "dragEnd";
      Action2["DragCancel"] = "dragCancel";
      Action2["DragOver"] = "dragOver";
      Action2["RegisterDroppable"] = "registerDroppable";
      Action2["SetDroppableDisabled"] = "setDroppableDisabled";
      Action2["UnregisterDroppable"] = "unregisterDroppable";
    })(Action || (Action = {}));
    function noop() {
    }
    function useSensor(sensor, options) {
      return (0, import_react3.useMemo)(
        () => ({
          sensor,
          options: options != null ? options : {}
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sensor, options]
      );
    }
    function useSensors() {
      for (var _len = arguments.length, sensors = new Array(_len), _key = 0; _key < _len; _key++) {
        sensors[_key] = arguments[_key];
      }
      return (0, import_react3.useMemo)(
        () => [...sensors].filter((sensor) => sensor != null),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...sensors]
      );
    }
    var defaultCoordinates = /* @__PURE__ */ Object.freeze({
      x: 0,
      y: 0
    });
    function distanceBetween(p1, p2) {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
    function getRelativeTransformOrigin(event, rect) {
      const eventCoordinates = getEventCoordinates(event);
      if (!eventCoordinates) {
        return "0 0";
      }
      const transformOrigin = {
        x: (eventCoordinates.x - rect.left) / rect.width * 100,
        y: (eventCoordinates.y - rect.top) / rect.height * 100
      };
      return transformOrigin.x + "% " + transformOrigin.y + "%";
    }
    function sortCollisionsAsc(_ref, _ref2) {
      let {
        data: {
          value: a
        }
      } = _ref;
      let {
        data: {
          value: b
        }
      } = _ref2;
      return a - b;
    }
    function sortCollisionsDesc(_ref3, _ref4) {
      let {
        data: {
          value: a
        }
      } = _ref3;
      let {
        data: {
          value: b
        }
      } = _ref4;
      return b - a;
    }
    function cornersOfRectangle(_ref5) {
      let {
        left,
        top,
        height,
        width
      } = _ref5;
      return [{
        x: left,
        y: top
      }, {
        x: left + width,
        y: top
      }, {
        x: left,
        y: top + height
      }, {
        x: left + width,
        y: top + height
      }];
    }
    function getFirstCollision(collisions, property) {
      if (!collisions || collisions.length === 0) {
        return null;
      }
      const [firstCollision] = collisions;
      return property ? firstCollision[property] : firstCollision;
    }
    function centerOfRectangle(rect, left, top) {
      if (left === void 0) {
        left = rect.left;
      }
      if (top === void 0) {
        top = rect.top;
      }
      return {
        x: left + rect.width * 0.5,
        y: top + rect.height * 0.5
      };
    }
    var closestCenter = (_ref) => {
      let {
        collisionRect,
        droppableRects,
        droppableContainers
      } = _ref;
      const centerRect = centerOfRectangle(collisionRect, collisionRect.left, collisionRect.top);
      const collisions = [];
      for (const droppableContainer of droppableContainers) {
        const {
          id
        } = droppableContainer;
        const rect = droppableRects.get(id);
        if (rect) {
          const distBetween = distanceBetween(centerOfRectangle(rect), centerRect);
          collisions.push({
            id,
            data: {
              droppableContainer,
              value: distBetween
            }
          });
        }
      }
      return collisions.sort(sortCollisionsAsc);
    };
    var closestCorners = (_ref) => {
      let {
        collisionRect,
        droppableRects,
        droppableContainers
      } = _ref;
      const corners = cornersOfRectangle(collisionRect);
      const collisions = [];
      for (const droppableContainer of droppableContainers) {
        const {
          id
        } = droppableContainer;
        const rect = droppableRects.get(id);
        if (rect) {
          const rectCorners = cornersOfRectangle(rect);
          const distances = corners.reduce((accumulator, corner, index) => {
            return accumulator + distanceBetween(rectCorners[index], corner);
          }, 0);
          const effectiveDistance = Number((distances / 4).toFixed(4));
          collisions.push({
            id,
            data: {
              droppableContainer,
              value: effectiveDistance
            }
          });
        }
      }
      return collisions.sort(sortCollisionsAsc);
    };
    function getIntersectionRatio(entry, target) {
      const top = Math.max(target.top, entry.top);
      const left = Math.max(target.left, entry.left);
      const right = Math.min(target.left + target.width, entry.left + entry.width);
      const bottom = Math.min(target.top + target.height, entry.top + entry.height);
      const width = right - left;
      const height = bottom - top;
      if (left < right && top < bottom) {
        const targetArea = target.width * target.height;
        const entryArea = entry.width * entry.height;
        const intersectionArea = width * height;
        const intersectionRatio = intersectionArea / (targetArea + entryArea - intersectionArea);
        return Number(intersectionRatio.toFixed(4));
      }
      return 0;
    }
    var rectIntersection = (_ref) => {
      let {
        collisionRect,
        droppableRects,
        droppableContainers
      } = _ref;
      const collisions = [];
      for (const droppableContainer of droppableContainers) {
        const {
          id
        } = droppableContainer;
        const rect = droppableRects.get(id);
        if (rect) {
          const intersectionRatio = getIntersectionRatio(rect, collisionRect);
          if (intersectionRatio > 0) {
            collisions.push({
              id,
              data: {
                droppableContainer,
                value: intersectionRatio
              }
            });
          }
        }
      }
      return collisions.sort(sortCollisionsDesc);
    };
    function adjustScale(transform, rect1, rect2) {
      return {
        ...transform,
        scaleX: rect1 && rect2 ? rect1.width / rect2.width : 1,
        scaleY: rect1 && rect2 ? rect1.height / rect2.height : 1
      };
    }
    function getRectDelta(rect1, rect2) {
      return rect1 && rect2 ? {
        x: rect1.left - rect2.left,
        y: rect1.top - rect2.top
      } : defaultCoordinates;
    }
    function createRectAdjustmentFn(modifier) {
      return function adjustClientRect(rect) {
        for (var _len = arguments.length, adjustments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          adjustments[_key - 1] = arguments[_key];
        }
        return adjustments.reduce((acc, adjustment) => ({
          ...acc,
          top: acc.top + modifier * adjustment.y,
          bottom: acc.bottom + modifier * adjustment.y,
          left: acc.left + modifier * adjustment.x,
          right: acc.right + modifier * adjustment.x
        }), {
          ...rect
        });
      };
    }
    var getAdjustedRect = /* @__PURE__ */ createRectAdjustmentFn(1);
    function parseTransform(transform) {
      if (transform.startsWith("matrix3d(")) {
        const transformArray = transform.slice(9, -1).split(/, /);
        return {
          x: +transformArray[12],
          y: +transformArray[13],
          scaleX: +transformArray[0],
          scaleY: +transformArray[5]
        };
      } else if (transform.startsWith("matrix(")) {
        const transformArray = transform.slice(7, -1).split(/, /);
        return {
          x: +transformArray[4],
          y: +transformArray[5],
          scaleX: +transformArray[0],
          scaleY: +transformArray[3]
        };
      }
      return null;
    }
    function inverseTransform(rect, transform, transformOrigin) {
      const parsedTransform = parseTransform(transform);
      if (!parsedTransform) {
        return rect;
      }
      const {
        scaleX,
        scaleY,
        x: translateX,
        y: translateY
      } = parsedTransform;
      const x = rect.left - translateX - (1 - scaleX) * parseFloat(transformOrigin);
      const y = rect.top - translateY - (1 - scaleY) * parseFloat(transformOrigin.slice(transformOrigin.indexOf(" ") + 1));
      const w = scaleX ? rect.width / scaleX : rect.width;
      const h2 = scaleY ? rect.height / scaleY : rect.height;
      return {
        width: w,
        height: h2,
        top: y,
        right: x + w,
        bottom: y + h2,
        left: x
      };
    }
    var defaultOptions = {
      ignoreTransform: false
    };
    function getClientRect(element, options) {
      if (options === void 0) {
        options = defaultOptions;
      }
      let rect = element.getBoundingClientRect();
      if (options.ignoreTransform) {
        const {
          transform,
          transformOrigin
        } = getWindow(element).getComputedStyle(element);
        if (transform) {
          rect = inverseTransform(rect, transform, transformOrigin);
        }
      }
      const {
        top,
        left,
        width,
        height,
        bottom,
        right
      } = rect;
      return {
        top,
        left,
        width,
        height,
        bottom,
        right
      };
    }
    function getTransformAgnosticClientRect(element) {
      return getClientRect(element, {
        ignoreTransform: true
      });
    }
    function getWindowClientRect(element) {
      const width = element.innerWidth;
      const height = element.innerHeight;
      return {
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        width,
        height
      };
    }
    function isFixed(node, computedStyle) {
      if (computedStyle === void 0) {
        computedStyle = getWindow(node).getComputedStyle(node);
      }
      return computedStyle.position === "fixed";
    }
    function isScrollable(element, computedStyle) {
      if (computedStyle === void 0) {
        computedStyle = getWindow(element).getComputedStyle(element);
      }
      const overflowRegex = /(auto|scroll|overlay)/;
      const properties2 = ["overflow", "overflowX", "overflowY"];
      return properties2.some((property) => {
        const value = computedStyle[property];
        return typeof value === "string" ? overflowRegex.test(value) : false;
      });
    }
    function getScrollableAncestors(element, limit) {
      const scrollParents = [];
      function findScrollableAncestors(node) {
        if (limit != null && scrollParents.length >= limit) {
          return scrollParents;
        }
        if (!node) {
          return scrollParents;
        }
        if (isDocument(node) && node.scrollingElement != null && !scrollParents.includes(node.scrollingElement)) {
          scrollParents.push(node.scrollingElement);
          return scrollParents;
        }
        if (!isHTMLElement(node) || isSVGElement(node)) {
          return scrollParents;
        }
        if (scrollParents.includes(node)) {
          return scrollParents;
        }
        const computedStyle = getWindow(element).getComputedStyle(node);
        if (node !== element) {
          if (isScrollable(node, computedStyle)) {
            scrollParents.push(node);
          }
        }
        if (isFixed(node, computedStyle)) {
          return scrollParents;
        }
        return findScrollableAncestors(node.parentNode);
      }
      if (!element) {
        return scrollParents;
      }
      return findScrollableAncestors(element);
    }
    function getFirstScrollableAncestor(node) {
      const [firstScrollableAncestor] = getScrollableAncestors(node, 1);
      return firstScrollableAncestor != null ? firstScrollableAncestor : null;
    }
    function getScrollableElement(element) {
      if (!canUseDOM || !element) {
        return null;
      }
      if (isWindow(element)) {
        return element;
      }
      if (!isNode(element)) {
        return null;
      }
      if (isDocument(element) || element === getOwnerDocument(element).scrollingElement) {
        return window;
      }
      if (isHTMLElement(element)) {
        return element;
      }
      return null;
    }
    function getScrollXCoordinate(element) {
      if (isWindow(element)) {
        return element.scrollX;
      }
      return element.scrollLeft;
    }
    function getScrollYCoordinate(element) {
      if (isWindow(element)) {
        return element.scrollY;
      }
      return element.scrollTop;
    }
    function getScrollCoordinates(element) {
      return {
        x: getScrollXCoordinate(element),
        y: getScrollYCoordinate(element)
      };
    }
    var Direction;
    (function(Direction2) {
      Direction2[Direction2["Forward"] = 1] = "Forward";
      Direction2[Direction2["Backward"] = -1] = "Backward";
    })(Direction || (Direction = {}));
    function isDocumentScrollingElement(element) {
      if (!canUseDOM || !element) {
        return false;
      }
      return element === document.scrollingElement;
    }
    function getScrollPosition(scrollingContainer) {
      const minScroll = {
        x: 0,
        y: 0
      };
      const dimensions = isDocumentScrollingElement(scrollingContainer) ? {
        height: window.innerHeight,
        width: window.innerWidth
      } : {
        height: scrollingContainer.clientHeight,
        width: scrollingContainer.clientWidth
      };
      const maxScroll = {
        x: scrollingContainer.scrollWidth - dimensions.width,
        y: scrollingContainer.scrollHeight - dimensions.height
      };
      const isTop = scrollingContainer.scrollTop <= minScroll.y;
      const isLeft = scrollingContainer.scrollLeft <= minScroll.x;
      const isBottom = scrollingContainer.scrollTop >= maxScroll.y;
      const isRight = scrollingContainer.scrollLeft >= maxScroll.x;
      return {
        isTop,
        isLeft,
        isBottom,
        isRight,
        maxScroll,
        minScroll
      };
    }
    var defaultThreshold = {
      x: 0.2,
      y: 0.2
    };
    function getScrollDirectionAndSpeed(scrollContainer, scrollContainerRect, _ref, acceleration, thresholdPercentage) {
      let {
        top,
        left,
        right,
        bottom
      } = _ref;
      if (acceleration === void 0) {
        acceleration = 10;
      }
      if (thresholdPercentage === void 0) {
        thresholdPercentage = defaultThreshold;
      }
      const {
        isTop,
        isBottom,
        isLeft,
        isRight
      } = getScrollPosition(scrollContainer);
      const direction = {
        x: 0,
        y: 0
      };
      const speed = {
        x: 0,
        y: 0
      };
      const threshold = {
        height: scrollContainerRect.height * thresholdPercentage.y,
        width: scrollContainerRect.width * thresholdPercentage.x
      };
      if (!isTop && top <= scrollContainerRect.top + threshold.height) {
        direction.y = Direction.Backward;
        speed.y = acceleration * Math.abs((scrollContainerRect.top + threshold.height - top) / threshold.height);
      } else if (!isBottom && bottom >= scrollContainerRect.bottom - threshold.height) {
        direction.y = Direction.Forward;
        speed.y = acceleration * Math.abs((scrollContainerRect.bottom - threshold.height - bottom) / threshold.height);
      }
      if (!isRight && right >= scrollContainerRect.right - threshold.width) {
        direction.x = Direction.Forward;
        speed.x = acceleration * Math.abs((scrollContainerRect.right - threshold.width - right) / threshold.width);
      } else if (!isLeft && left <= scrollContainerRect.left + threshold.width) {
        direction.x = Direction.Backward;
        speed.x = acceleration * Math.abs((scrollContainerRect.left + threshold.width - left) / threshold.width);
      }
      return {
        direction,
        speed
      };
    }
    function getScrollElementRect(element) {
      if (element === document.scrollingElement) {
        const {
          innerWidth,
          innerHeight
        } = window;
        return {
          top: 0,
          left: 0,
          right: innerWidth,
          bottom: innerHeight,
          width: innerWidth,
          height: innerHeight
        };
      }
      const {
        top,
        left,
        right,
        bottom
      } = element.getBoundingClientRect();
      return {
        top,
        left,
        right,
        bottom,
        width: element.clientWidth,
        height: element.clientHeight
      };
    }
    function getScrollOffsets(scrollableAncestors) {
      return scrollableAncestors.reduce((acc, node) => {
        return add(acc, getScrollCoordinates(node));
      }, defaultCoordinates);
    }
    function getScrollXOffset(scrollableAncestors) {
      return scrollableAncestors.reduce((acc, node) => {
        return acc + getScrollXCoordinate(node);
      }, 0);
    }
    function getScrollYOffset(scrollableAncestors) {
      return scrollableAncestors.reduce((acc, node) => {
        return acc + getScrollYCoordinate(node);
      }, 0);
    }
    function scrollIntoViewIfNeeded(element, measure) {
      if (measure === void 0) {
        measure = getClientRect;
      }
      if (!element) {
        return;
      }
      const {
        top,
        left,
        bottom,
        right
      } = measure(element);
      const firstScrollableAncestor = getFirstScrollableAncestor(element);
      if (!firstScrollableAncestor) {
        return;
      }
      if (bottom <= 0 || right <= 0 || top >= window.innerHeight || left >= window.innerWidth) {
        element.scrollIntoView({
          block: "center",
          inline: "center"
        });
      }
    }
    var properties = [["x", ["left", "right"], getScrollXOffset], ["y", ["top", "bottom"], getScrollYOffset]];
    var Rect = class {
      constructor(rect, element) {
        this.rect = void 0;
        this.width = void 0;
        this.height = void 0;
        this.top = void 0;
        this.bottom = void 0;
        this.right = void 0;
        this.left = void 0;
        const scrollableAncestors = getScrollableAncestors(element);
        const scrollOffsets = getScrollOffsets(scrollableAncestors);
        this.rect = {
          ...rect
        };
        this.width = rect.width;
        this.height = rect.height;
        for (const [axis, keys, getScrollOffset] of properties) {
          for (const key2 of keys) {
            Object.defineProperty(this, key2, {
              get: () => {
                const currentOffsets = getScrollOffset(scrollableAncestors);
                const scrollOffsetsDeltla = scrollOffsets[axis] - currentOffsets;
                return this.rect[key2] + scrollOffsetsDeltla;
              },
              enumerable: true
            });
          }
        }
        Object.defineProperty(this, "rect", {
          enumerable: false
        });
      }
    };
    var Listeners = class {
      constructor(target) {
        this.target = void 0;
        this.listeners = [];
        this.removeAll = () => {
          this.listeners.forEach((listener) => {
            var _this$target;
            return (_this$target = this.target) == null ? void 0 : _this$target.removeEventListener(...listener);
          });
        };
        this.target = target;
      }
      add(eventName, handler, options) {
        var _this$target2;
        (_this$target2 = this.target) == null ? void 0 : _this$target2.addEventListener(eventName, handler, options);
        this.listeners.push([eventName, handler, options]);
      }
    };
    function getEventListenerTarget(target) {
      const {
        EventTarget
      } = getWindow(target);
      return target instanceof EventTarget ? target : getOwnerDocument(target);
    }
    function hasExceededDistance(delta, measurement) {
      const dx = Math.abs(delta.x);
      const dy = Math.abs(delta.y);
      if (typeof measurement === "number") {
        return Math.sqrt(dx ** 2 + dy ** 2) > measurement;
      }
      if ("x" in measurement && "y" in measurement) {
        return dx > measurement.x && dy > measurement.y;
      }
      if ("x" in measurement) {
        return dx > measurement.x;
      }
      if ("y" in measurement) {
        return dy > measurement.y;
      }
      return false;
    }
    var EventName;
    (function(EventName2) {
      EventName2["Click"] = "click";
      EventName2["DragStart"] = "dragstart";
      EventName2["Keydown"] = "keydown";
      EventName2["ContextMenu"] = "contextmenu";
      EventName2["Resize"] = "resize";
      EventName2["SelectionChange"] = "selectionchange";
      EventName2["VisibilityChange"] = "visibilitychange";
    })(EventName || (EventName = {}));
    function preventDefault(event) {
      event.preventDefault();
    }
    function stopPropagation(event) {
      event.stopPropagation();
    }
    var KeyboardCode;
    (function(KeyboardCode2) {
      KeyboardCode2["Space"] = "Space";
      KeyboardCode2["Down"] = "ArrowDown";
      KeyboardCode2["Right"] = "ArrowRight";
      KeyboardCode2["Left"] = "ArrowLeft";
      KeyboardCode2["Up"] = "ArrowUp";
      KeyboardCode2["Esc"] = "Escape";
      KeyboardCode2["Enter"] = "Enter";
      KeyboardCode2["Tab"] = "Tab";
    })(KeyboardCode || (KeyboardCode = {}));
    var defaultKeyboardCodes = {
      start: [KeyboardCode.Space, KeyboardCode.Enter],
      cancel: [KeyboardCode.Esc],
      end: [KeyboardCode.Space, KeyboardCode.Enter, KeyboardCode.Tab]
    };
    var defaultKeyboardCoordinateGetter = (event, _ref) => {
      let {
        currentCoordinates
      } = _ref;
      switch (event.code) {
        case KeyboardCode.Right:
          return {
            ...currentCoordinates,
            x: currentCoordinates.x + 25
          };
        case KeyboardCode.Left:
          return {
            ...currentCoordinates,
            x: currentCoordinates.x - 25
          };
        case KeyboardCode.Down:
          return {
            ...currentCoordinates,
            y: currentCoordinates.y + 25
          };
        case KeyboardCode.Up:
          return {
            ...currentCoordinates,
            y: currentCoordinates.y - 25
          };
      }
      return void 0;
    };
    var KeyboardSensor = class {
      constructor(props) {
        this.props = void 0;
        this.autoScrollEnabled = false;
        this.referenceCoordinates = void 0;
        this.listeners = void 0;
        this.windowListeners = void 0;
        this.props = props;
        const {
          event: {
            target
          }
        } = props;
        this.props = props;
        this.listeners = new Listeners(getOwnerDocument(target));
        this.windowListeners = new Listeners(getWindow(target));
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.attach();
      }
      attach() {
        this.handleStart();
        this.windowListeners.add(EventName.Resize, this.handleCancel);
        this.windowListeners.add(EventName.VisibilityChange, this.handleCancel);
        setTimeout(() => this.listeners.add(EventName.Keydown, this.handleKeyDown));
      }
      handleStart() {
        const {
          activeNode,
          onStart
        } = this.props;
        const node = activeNode.node.current;
        if (node) {
          scrollIntoViewIfNeeded(node);
        }
        onStart(defaultCoordinates);
      }
      handleKeyDown(event) {
        if (isKeyboardEvent(event)) {
          const {
            active,
            context,
            options
          } = this.props;
          const {
            keyboardCodes = defaultKeyboardCodes,
            coordinateGetter = defaultKeyboardCoordinateGetter,
            scrollBehavior = "smooth"
          } = options;
          const {
            code
          } = event;
          if (keyboardCodes.end.includes(code)) {
            this.handleEnd(event);
            return;
          }
          if (keyboardCodes.cancel.includes(code)) {
            this.handleCancel(event);
            return;
          }
          const {
            collisionRect
          } = context.current;
          const currentCoordinates = collisionRect ? {
            x: collisionRect.left,
            y: collisionRect.top
          } : defaultCoordinates;
          if (!this.referenceCoordinates) {
            this.referenceCoordinates = currentCoordinates;
          }
          const newCoordinates = coordinateGetter(event, {
            active,
            context: context.current,
            currentCoordinates
          });
          if (newCoordinates) {
            const coordinatesDelta = subtract(newCoordinates, currentCoordinates);
            const scrollDelta = {
              x: 0,
              y: 0
            };
            const {
              scrollableAncestors
            } = context.current;
            for (const scrollContainer of scrollableAncestors) {
              const direction = event.code;
              const {
                isTop,
                isRight,
                isLeft,
                isBottom,
                maxScroll,
                minScroll
              } = getScrollPosition(scrollContainer);
              const scrollElementRect = getScrollElementRect(scrollContainer);
              const clampedCoordinates = {
                x: Math.min(direction === KeyboardCode.Right ? scrollElementRect.right - scrollElementRect.width / 2 : scrollElementRect.right, Math.max(direction === KeyboardCode.Right ? scrollElementRect.left : scrollElementRect.left + scrollElementRect.width / 2, newCoordinates.x)),
                y: Math.min(direction === KeyboardCode.Down ? scrollElementRect.bottom - scrollElementRect.height / 2 : scrollElementRect.bottom, Math.max(direction === KeyboardCode.Down ? scrollElementRect.top : scrollElementRect.top + scrollElementRect.height / 2, newCoordinates.y))
              };
              const canScrollX = direction === KeyboardCode.Right && !isRight || direction === KeyboardCode.Left && !isLeft;
              const canScrollY = direction === KeyboardCode.Down && !isBottom || direction === KeyboardCode.Up && !isTop;
              if (canScrollX && clampedCoordinates.x !== newCoordinates.x) {
                const newScrollCoordinates = scrollContainer.scrollLeft + coordinatesDelta.x;
                const canScrollToNewCoordinates = direction === KeyboardCode.Right && newScrollCoordinates <= maxScroll.x || direction === KeyboardCode.Left && newScrollCoordinates >= minScroll.x;
                if (canScrollToNewCoordinates && !coordinatesDelta.y) {
                  scrollContainer.scrollTo({
                    left: newScrollCoordinates,
                    behavior: scrollBehavior
                  });
                  return;
                }
                if (canScrollToNewCoordinates) {
                  scrollDelta.x = scrollContainer.scrollLeft - newScrollCoordinates;
                } else {
                  scrollDelta.x = direction === KeyboardCode.Right ? scrollContainer.scrollLeft - maxScroll.x : scrollContainer.scrollLeft - minScroll.x;
                }
                if (scrollDelta.x) {
                  scrollContainer.scrollBy({
                    left: -scrollDelta.x,
                    behavior: scrollBehavior
                  });
                }
                break;
              } else if (canScrollY && clampedCoordinates.y !== newCoordinates.y) {
                const newScrollCoordinates = scrollContainer.scrollTop + coordinatesDelta.y;
                const canScrollToNewCoordinates = direction === KeyboardCode.Down && newScrollCoordinates <= maxScroll.y || direction === KeyboardCode.Up && newScrollCoordinates >= minScroll.y;
                if (canScrollToNewCoordinates && !coordinatesDelta.x) {
                  scrollContainer.scrollTo({
                    top: newScrollCoordinates,
                    behavior: scrollBehavior
                  });
                  return;
                }
                if (canScrollToNewCoordinates) {
                  scrollDelta.y = scrollContainer.scrollTop - newScrollCoordinates;
                } else {
                  scrollDelta.y = direction === KeyboardCode.Down ? scrollContainer.scrollTop - maxScroll.y : scrollContainer.scrollTop - minScroll.y;
                }
                if (scrollDelta.y) {
                  scrollContainer.scrollBy({
                    top: -scrollDelta.y,
                    behavior: scrollBehavior
                  });
                }
                break;
              }
            }
            this.handleMove(event, add(subtract(newCoordinates, this.referenceCoordinates), scrollDelta));
          }
        }
      }
      handleMove(event, coordinates) {
        const {
          onMove
        } = this.props;
        event.preventDefault();
        onMove(coordinates);
      }
      handleEnd(event) {
        const {
          onEnd
        } = this.props;
        event.preventDefault();
        this.detach();
        onEnd();
      }
      handleCancel(event) {
        const {
          onCancel
        } = this.props;
        event.preventDefault();
        this.detach();
        onCancel();
      }
      detach() {
        this.listeners.removeAll();
        this.windowListeners.removeAll();
      }
    };
    KeyboardSensor.activators = [{
      eventName: "onKeyDown",
      handler: (event, _ref, _ref2) => {
        let {
          keyboardCodes = defaultKeyboardCodes,
          onActivation
        } = _ref;
        let {
          active
        } = _ref2;
        const {
          code
        } = event.nativeEvent;
        if (keyboardCodes.start.includes(code)) {
          const activator = active.activatorNode.current;
          if (activator && event.target !== activator) {
            return false;
          }
          event.preventDefault();
          onActivation == null ? void 0 : onActivation({
            event: event.nativeEvent
          });
          return true;
        }
        return false;
      }
    }];
    function isDistanceConstraint(constraint) {
      return Boolean(constraint && "distance" in constraint);
    }
    function isDelayConstraint(constraint) {
      return Boolean(constraint && "delay" in constraint);
    }
    var AbstractPointerSensor = class {
      constructor(props, events2, listenerTarget) {
        var _getEventCoordinates;
        if (listenerTarget === void 0) {
          listenerTarget = getEventListenerTarget(props.event.target);
        }
        this.props = void 0;
        this.events = void 0;
        this.autoScrollEnabled = true;
        this.document = void 0;
        this.activated = false;
        this.initialCoordinates = void 0;
        this.timeoutId = null;
        this.listeners = void 0;
        this.documentListeners = void 0;
        this.windowListeners = void 0;
        this.props = props;
        this.events = events2;
        const {
          event
        } = props;
        const {
          target
        } = event;
        this.props = props;
        this.events = events2;
        this.document = getOwnerDocument(target);
        this.documentListeners = new Listeners(this.document);
        this.listeners = new Listeners(listenerTarget);
        this.windowListeners = new Listeners(getWindow(target));
        this.initialCoordinates = (_getEventCoordinates = getEventCoordinates(event)) != null ? _getEventCoordinates : defaultCoordinates;
        this.handleStart = this.handleStart.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.removeTextSelection = this.removeTextSelection.bind(this);
        this.attach();
      }
      attach() {
        const {
          events: events2,
          props: {
            options: {
              activationConstraint,
              bypassActivationConstraint
            }
          }
        } = this;
        this.listeners.add(events2.move.name, this.handleMove, {
          passive: false
        });
        this.listeners.add(events2.end.name, this.handleEnd);
        if (events2.cancel) {
          this.listeners.add(events2.cancel.name, this.handleCancel);
        }
        this.windowListeners.add(EventName.Resize, this.handleCancel);
        this.windowListeners.add(EventName.DragStart, preventDefault);
        this.windowListeners.add(EventName.VisibilityChange, this.handleCancel);
        this.windowListeners.add(EventName.ContextMenu, preventDefault);
        this.documentListeners.add(EventName.Keydown, this.handleKeydown);
        if (activationConstraint) {
          if (bypassActivationConstraint != null && bypassActivationConstraint({
            event: this.props.event,
            activeNode: this.props.activeNode,
            options: this.props.options
          })) {
            return this.handleStart();
          }
          if (isDelayConstraint(activationConstraint)) {
            this.timeoutId = setTimeout(this.handleStart, activationConstraint.delay);
            this.handlePending(activationConstraint);
            return;
          }
          if (isDistanceConstraint(activationConstraint)) {
            this.handlePending(activationConstraint);
            return;
          }
        }
        this.handleStart();
      }
      detach() {
        this.listeners.removeAll();
        this.windowListeners.removeAll();
        setTimeout(this.documentListeners.removeAll, 50);
        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }
      }
      handlePending(constraint, offset) {
        const {
          active,
          onPending
        } = this.props;
        onPending(active, constraint, this.initialCoordinates, offset);
      }
      handleStart() {
        const {
          initialCoordinates
        } = this;
        const {
          onStart
        } = this.props;
        if (initialCoordinates) {
          this.activated = true;
          this.documentListeners.add(EventName.Click, stopPropagation, {
            capture: true
          });
          this.removeTextSelection();
          this.documentListeners.add(EventName.SelectionChange, this.removeTextSelection);
          onStart(initialCoordinates);
        }
      }
      handleMove(event) {
        var _getEventCoordinates2;
        const {
          activated,
          initialCoordinates,
          props
        } = this;
        const {
          onMove,
          options: {
            activationConstraint
          }
        } = props;
        if (!initialCoordinates) {
          return;
        }
        const coordinates = (_getEventCoordinates2 = getEventCoordinates(event)) != null ? _getEventCoordinates2 : defaultCoordinates;
        const delta = subtract(initialCoordinates, coordinates);
        if (!activated && activationConstraint) {
          if (isDistanceConstraint(activationConstraint)) {
            if (activationConstraint.tolerance != null && hasExceededDistance(delta, activationConstraint.tolerance)) {
              return this.handleCancel();
            }
            if (hasExceededDistance(delta, activationConstraint.distance)) {
              return this.handleStart();
            }
          }
          if (isDelayConstraint(activationConstraint)) {
            if (hasExceededDistance(delta, activationConstraint.tolerance)) {
              return this.handleCancel();
            }
          }
          this.handlePending(activationConstraint, delta);
          return;
        }
        if (event.cancelable) {
          event.preventDefault();
        }
        onMove(coordinates);
      }
      handleEnd() {
        const {
          onAbort,
          onEnd
        } = this.props;
        this.detach();
        if (!this.activated) {
          onAbort(this.props.active);
        }
        onEnd();
      }
      handleCancel() {
        const {
          onAbort,
          onCancel
        } = this.props;
        this.detach();
        if (!this.activated) {
          onAbort(this.props.active);
        }
        onCancel();
      }
      handleKeydown(event) {
        if (event.code === KeyboardCode.Esc) {
          this.handleCancel();
        }
      }
      removeTextSelection() {
        var _this$document$getSel;
        (_this$document$getSel = this.document.getSelection()) == null ? void 0 : _this$document$getSel.removeAllRanges();
      }
    };
    var events = {
      cancel: {
        name: "pointercancel"
      },
      move: {
        name: "pointermove"
      },
      end: {
        name: "pointerup"
      }
    };
    var PointerSensor = class extends AbstractPointerSensor {
      constructor(props) {
        const {
          event
        } = props;
        const listenerTarget = getOwnerDocument(event.target);
        super(props, events, listenerTarget);
      }
    };
    PointerSensor.activators = [{
      eventName: "onPointerDown",
      handler: (_ref, _ref2) => {
        let {
          nativeEvent: event
        } = _ref;
        let {
          onActivation
        } = _ref2;
        if (!event.isPrimary || event.button !== 0) {
          return false;
        }
        onActivation == null ? void 0 : onActivation({
          event
        });
        return true;
      }
    }];
    var events$1 = {
      move: {
        name: "mousemove"
      },
      end: {
        name: "mouseup"
      }
    };
    var MouseButton;
    (function(MouseButton2) {
      MouseButton2[MouseButton2["RightClick"] = 2] = "RightClick";
    })(MouseButton || (MouseButton = {}));
    var MouseSensor = class extends AbstractPointerSensor {
      constructor(props) {
        super(props, events$1, getOwnerDocument(props.event.target));
      }
    };
    MouseSensor.activators = [{
      eventName: "onMouseDown",
      handler: (_ref, _ref2) => {
        let {
          nativeEvent: event
        } = _ref;
        let {
          onActivation
        } = _ref2;
        if (event.button === MouseButton.RightClick) {
          return false;
        }
        onActivation == null ? void 0 : onActivation({
          event
        });
        return true;
      }
    }];
    var events$2 = {
      cancel: {
        name: "touchcancel"
      },
      move: {
        name: "touchmove"
      },
      end: {
        name: "touchend"
      }
    };
    var TouchSensor = class extends AbstractPointerSensor {
      constructor(props) {
        super(props, events$2);
      }
      static setup() {
        window.addEventListener(events$2.move.name, noop2, {
          capture: false,
          passive: false
        });
        return function teardown() {
          window.removeEventListener(events$2.move.name, noop2);
        };
        function noop2() {
        }
      }
    };
    TouchSensor.activators = [{
      eventName: "onTouchStart",
      handler: (_ref, _ref2) => {
        let {
          nativeEvent: event
        } = _ref;
        let {
          onActivation
        } = _ref2;
        const {
          touches
        } = event;
        if (touches.length > 1) {
          return false;
        }
        onActivation == null ? void 0 : onActivation({
          event
        });
        return true;
      }
    }];
    var AutoScrollActivator;
    (function(AutoScrollActivator2) {
      AutoScrollActivator2[AutoScrollActivator2["Pointer"] = 0] = "Pointer";
      AutoScrollActivator2[AutoScrollActivator2["DraggableRect"] = 1] = "DraggableRect";
    })(AutoScrollActivator || (AutoScrollActivator = {}));
    var TraversalOrder;
    (function(TraversalOrder2) {
      TraversalOrder2[TraversalOrder2["TreeOrder"] = 0] = "TreeOrder";
      TraversalOrder2[TraversalOrder2["ReversedTreeOrder"] = 1] = "ReversedTreeOrder";
    })(TraversalOrder || (TraversalOrder = {}));
    function useAutoScroller(_ref) {
      let {
        acceleration,
        activator = AutoScrollActivator.Pointer,
        canScroll,
        draggingRect,
        enabled,
        interval = 5,
        order = TraversalOrder.TreeOrder,
        pointerCoordinates,
        scrollableAncestors,
        scrollableAncestorRects,
        delta,
        threshold
      } = _ref;
      const scrollIntent = useScrollIntent({
        delta,
        disabled: !enabled
      });
      const [setAutoScrollInterval, clearAutoScrollInterval] = useInterval();
      const scrollSpeed = (0, import_react3.useRef)({
        x: 0,
        y: 0
      });
      const scrollDirection = (0, import_react3.useRef)({
        x: 0,
        y: 0
      });
      const rect = (0, import_react3.useMemo)(() => {
        switch (activator) {
          case AutoScrollActivator.Pointer:
            return pointerCoordinates ? {
              top: pointerCoordinates.y,
              bottom: pointerCoordinates.y,
              left: pointerCoordinates.x,
              right: pointerCoordinates.x
            } : null;
          case AutoScrollActivator.DraggableRect:
            return draggingRect;
        }
      }, [activator, draggingRect, pointerCoordinates]);
      const scrollContainerRef = (0, import_react3.useRef)(null);
      const autoScroll = (0, import_react3.useCallback)(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) {
          return;
        }
        const scrollLeft = scrollSpeed.current.x * scrollDirection.current.x;
        const scrollTop = scrollSpeed.current.y * scrollDirection.current.y;
        scrollContainer.scrollBy(scrollLeft, scrollTop);
      }, []);
      const sortedScrollableAncestors = (0, import_react3.useMemo)(() => order === TraversalOrder.TreeOrder ? [...scrollableAncestors].reverse() : scrollableAncestors, [order, scrollableAncestors]);
      (0, import_react3.useEffect)(
        () => {
          if (!enabled || !scrollableAncestors.length || !rect) {
            clearAutoScrollInterval();
            return;
          }
          for (const scrollContainer of sortedScrollableAncestors) {
            if ((canScroll == null ? void 0 : canScroll(scrollContainer)) === false) {
              continue;
            }
            const index = scrollableAncestors.indexOf(scrollContainer);
            const scrollContainerRect = scrollableAncestorRects[index];
            if (!scrollContainerRect) {
              continue;
            }
            const {
              direction,
              speed
            } = getScrollDirectionAndSpeed(scrollContainer, scrollContainerRect, rect, acceleration, threshold);
            for (const axis of ["x", "y"]) {
              if (!scrollIntent[axis][direction[axis]]) {
                speed[axis] = 0;
                direction[axis] = 0;
              }
            }
            if (speed.x > 0 || speed.y > 0) {
              clearAutoScrollInterval();
              scrollContainerRef.current = scrollContainer;
              setAutoScrollInterval(autoScroll, interval);
              scrollSpeed.current = speed;
              scrollDirection.current = direction;
              return;
            }
          }
          scrollSpeed.current = {
            x: 0,
            y: 0
          };
          scrollDirection.current = {
            x: 0,
            y: 0
          };
          clearAutoScrollInterval();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
          acceleration,
          autoScroll,
          canScroll,
          clearAutoScrollInterval,
          enabled,
          interval,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          JSON.stringify(rect),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          JSON.stringify(scrollIntent),
          setAutoScrollInterval,
          scrollableAncestors,
          sortedScrollableAncestors,
          scrollableAncestorRects,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          JSON.stringify(threshold)
        ]
      );
    }
    var defaultScrollIntent = {
      x: {
        [Direction.Backward]: false,
        [Direction.Forward]: false
      },
      y: {
        [Direction.Backward]: false,
        [Direction.Forward]: false
      }
    };
    function useScrollIntent(_ref2) {
      let {
        delta,
        disabled
      } = _ref2;
      const previousDelta = usePrevious(delta);
      return useLazyMemo((previousIntent) => {
        if (disabled || !previousDelta || !previousIntent) {
          return defaultScrollIntent;
        }
        const direction = {
          x: Math.sign(delta.x - previousDelta.x),
          y: Math.sign(delta.y - previousDelta.y)
        };
        return {
          x: {
            [Direction.Backward]: previousIntent.x[Direction.Backward] || direction.x === -1,
            [Direction.Forward]: previousIntent.x[Direction.Forward] || direction.x === 1
          },
          y: {
            [Direction.Backward]: previousIntent.y[Direction.Backward] || direction.y === -1,
            [Direction.Forward]: previousIntent.y[Direction.Forward] || direction.y === 1
          }
        };
      }, [disabled, delta, previousDelta]);
    }
    function useCachedNode(draggableNodes, id) {
      const draggableNode = id != null ? draggableNodes.get(id) : void 0;
      const node = draggableNode ? draggableNode.node.current : null;
      return useLazyMemo((cachedNode) => {
        var _ref;
        if (id == null) {
          return null;
        }
        return (_ref = node != null ? node : cachedNode) != null ? _ref : null;
      }, [node, id]);
    }
    function useCombineActivators(sensors, getSyntheticHandler) {
      return (0, import_react3.useMemo)(() => sensors.reduce((accumulator, sensor) => {
        const {
          sensor: Sensor
        } = sensor;
        const sensorActivators = Sensor.activators.map((activator) => ({
          eventName: activator.eventName,
          handler: getSyntheticHandler(activator.handler, sensor)
        }));
        return [...accumulator, ...sensorActivators];
      }, []), [sensors, getSyntheticHandler]);
    }
    var MeasuringStrategy;
    (function(MeasuringStrategy2) {
      MeasuringStrategy2[MeasuringStrategy2["Always"] = 0] = "Always";
      MeasuringStrategy2[MeasuringStrategy2["BeforeDragging"] = 1] = "BeforeDragging";
      MeasuringStrategy2[MeasuringStrategy2["WhileDragging"] = 2] = "WhileDragging";
    })(MeasuringStrategy || (MeasuringStrategy = {}));
    var MeasuringFrequency;
    (function(MeasuringFrequency2) {
      MeasuringFrequency2["Optimized"] = "optimized";
    })(MeasuringFrequency || (MeasuringFrequency = {}));
    var defaultValue = /* @__PURE__ */ new Map();
    function useDroppableMeasuring(containers, _ref) {
      let {
        dragging,
        dependencies,
        config
      } = _ref;
      const [queue, setQueue] = (0, import_react3.useState)(null);
      const {
        frequency,
        measure,
        strategy
      } = config;
      const containersRef = (0, import_react3.useRef)(containers);
      const disabled = isDisabled();
      const disabledRef = useLatestValue(disabled);
      const measureDroppableContainers = (0, import_react3.useCallback)(function(ids2) {
        if (ids2 === void 0) {
          ids2 = [];
        }
        if (disabledRef.current) {
          return;
        }
        setQueue((value) => {
          if (value === null) {
            return ids2;
          }
          return value.concat(ids2.filter((id) => !value.includes(id)));
        });
      }, [disabledRef]);
      const timeoutId = (0, import_react3.useRef)(null);
      const droppableRects = useLazyMemo((previousValue) => {
        if (disabled && !dragging) {
          return defaultValue;
        }
        if (!previousValue || previousValue === defaultValue || containersRef.current !== containers || queue != null) {
          const map = /* @__PURE__ */ new Map();
          for (let container of containers) {
            if (!container) {
              continue;
            }
            if (queue && queue.length > 0 && !queue.includes(container.id) && container.rect.current) {
              map.set(container.id, container.rect.current);
              continue;
            }
            const node = container.node.current;
            const rect = node ? new Rect(measure(node), node) : null;
            container.rect.current = rect;
            if (rect) {
              map.set(container.id, rect);
            }
          }
          return map;
        }
        return previousValue;
      }, [containers, queue, dragging, disabled, measure]);
      (0, import_react3.useEffect)(() => {
        containersRef.current = containers;
      }, [containers]);
      (0, import_react3.useEffect)(
        () => {
          if (disabled) {
            return;
          }
          measureDroppableContainers();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dragging, disabled]
      );
      (0, import_react3.useEffect)(
        () => {
          if (queue && queue.length > 0) {
            setQueue(null);
          }
        },
        //eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(queue)]
      );
      (0, import_react3.useEffect)(
        () => {
          if (disabled || typeof frequency !== "number" || timeoutId.current !== null) {
            return;
          }
          timeoutId.current = setTimeout(() => {
            measureDroppableContainers();
            timeoutId.current = null;
          }, frequency);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [frequency, disabled, measureDroppableContainers, ...dependencies]
      );
      return {
        droppableRects,
        measureDroppableContainers,
        measuringScheduled: queue != null
      };
      function isDisabled() {
        switch (strategy) {
          case MeasuringStrategy.Always:
            return false;
          case MeasuringStrategy.BeforeDragging:
            return dragging;
          default:
            return !dragging;
        }
      }
    }
    function useInitialValue(value, computeFn) {
      return useLazyMemo((previousValue) => {
        if (!value) {
          return null;
        }
        if (previousValue) {
          return previousValue;
        }
        return typeof computeFn === "function" ? computeFn(value) : value;
      }, [computeFn, value]);
    }
    function useInitialRect(node, measure) {
      return useInitialValue(node, measure);
    }
    function useMutationObserver(_ref) {
      let {
        callback,
        disabled
      } = _ref;
      const handleMutations = useEvent(callback);
      const mutationObserver = (0, import_react3.useMemo)(() => {
        if (disabled || typeof window === "undefined" || typeof window.MutationObserver === "undefined") {
          return void 0;
        }
        const {
          MutationObserver: MutationObserver2
        } = window;
        return new MutationObserver2(handleMutations);
      }, [handleMutations, disabled]);
      (0, import_react3.useEffect)(() => {
        return () => mutationObserver == null ? void 0 : mutationObserver.disconnect();
      }, [mutationObserver]);
      return mutationObserver;
    }
    function useResizeObserver(_ref) {
      let {
        callback,
        disabled
      } = _ref;
      const handleResize = useEvent(callback);
      const resizeObserver = (0, import_react3.useMemo)(
        () => {
          if (disabled || typeof window === "undefined" || typeof window.ResizeObserver === "undefined") {
            return void 0;
          }
          const {
            ResizeObserver: ResizeObserver2
          } = window;
          return new ResizeObserver2(handleResize);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [disabled]
      );
      (0, import_react3.useEffect)(() => {
        return () => resizeObserver == null ? void 0 : resizeObserver.disconnect();
      }, [resizeObserver]);
      return resizeObserver;
    }
    function defaultMeasure(element) {
      return new Rect(getClientRect(element), element);
    }
    function useRect(element, measure, fallbackRect) {
      if (measure === void 0) {
        measure = defaultMeasure;
      }
      const [rect, setRect] = (0, import_react3.useState)(null);
      function measureRect() {
        setRect((currentRect) => {
          if (!element) {
            return null;
          }
          if (element.isConnected === false) {
            var _ref;
            return (_ref = currentRect != null ? currentRect : fallbackRect) != null ? _ref : null;
          }
          const newRect = measure(element);
          if (JSON.stringify(currentRect) === JSON.stringify(newRect)) {
            return currentRect;
          }
          return newRect;
        });
      }
      const mutationObserver = useMutationObserver({
        callback(records) {
          if (!element) {
            return;
          }
          for (const record of records) {
            const {
              type,
              target
            } = record;
            if (type === "childList" && target instanceof HTMLElement && target.contains(element)) {
              measureRect();
              break;
            }
          }
        }
      });
      const resizeObserver = useResizeObserver({
        callback: measureRect
      });
      useIsomorphicLayoutEffect(() => {
        measureRect();
        if (element) {
          resizeObserver == null ? void 0 : resizeObserver.observe(element);
          mutationObserver == null ? void 0 : mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
          });
        } else {
          resizeObserver == null ? void 0 : resizeObserver.disconnect();
          mutationObserver == null ? void 0 : mutationObserver.disconnect();
        }
      }, [element]);
      return rect;
    }
    function useRectDelta(rect) {
      const initialRect = useInitialValue(rect);
      return getRectDelta(rect, initialRect);
    }
    var defaultValue$1 = [];
    function useScrollableAncestors(node) {
      const previousNode = (0, import_react3.useRef)(node);
      const ancestors = useLazyMemo((previousValue) => {
        if (!node) {
          return defaultValue$1;
        }
        if (previousValue && previousValue !== defaultValue$1 && node && previousNode.current && node.parentNode === previousNode.current.parentNode) {
          return previousValue;
        }
        return getScrollableAncestors(node);
      }, [node]);
      (0, import_react3.useEffect)(() => {
        previousNode.current = node;
      }, [node]);
      return ancestors;
    }
    function useScrollOffsets(elements) {
      const [scrollCoordinates, setScrollCoordinates] = (0, import_react3.useState)(null);
      const prevElements = (0, import_react3.useRef)(elements);
      const handleScroll = (0, import_react3.useCallback)((event) => {
        const scrollingElement = getScrollableElement(event.target);
        if (!scrollingElement) {
          return;
        }
        setScrollCoordinates((scrollCoordinates2) => {
          if (!scrollCoordinates2) {
            return null;
          }
          scrollCoordinates2.set(scrollingElement, getScrollCoordinates(scrollingElement));
          return new Map(scrollCoordinates2);
        });
      }, []);
      (0, import_react3.useEffect)(() => {
        const previousElements = prevElements.current;
        if (elements !== previousElements) {
          cleanup(previousElements);
          const entries = elements.map((element) => {
            const scrollableElement = getScrollableElement(element);
            if (scrollableElement) {
              scrollableElement.addEventListener("scroll", handleScroll, {
                passive: true
              });
              return [scrollableElement, getScrollCoordinates(scrollableElement)];
            }
            return null;
          }).filter((entry) => entry != null);
          setScrollCoordinates(entries.length ? new Map(entries) : null);
          prevElements.current = elements;
        }
        return () => {
          cleanup(elements);
          cleanup(previousElements);
        };
        function cleanup(elements2) {
          elements2.forEach((element) => {
            const scrollableElement = getScrollableElement(element);
            scrollableElement == null ? void 0 : scrollableElement.removeEventListener("scroll", handleScroll);
          });
        }
      }, [handleScroll, elements]);
      return (0, import_react3.useMemo)(() => {
        if (elements.length) {
          return scrollCoordinates ? Array.from(scrollCoordinates.values()).reduce((acc, coordinates) => add(acc, coordinates), defaultCoordinates) : getScrollOffsets(elements);
        }
        return defaultCoordinates;
      }, [elements, scrollCoordinates]);
    }
    function useScrollOffsetsDelta(scrollOffsets, dependencies) {
      if (dependencies === void 0) {
        dependencies = [];
      }
      const initialScrollOffsets = (0, import_react3.useRef)(null);
      (0, import_react3.useEffect)(
        () => {
          initialScrollOffsets.current = null;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        dependencies
      );
      (0, import_react3.useEffect)(() => {
        const hasScrollOffsets = scrollOffsets !== defaultCoordinates;
        if (hasScrollOffsets && !initialScrollOffsets.current) {
          initialScrollOffsets.current = scrollOffsets;
        }
        if (!hasScrollOffsets && initialScrollOffsets.current) {
          initialScrollOffsets.current = null;
        }
      }, [scrollOffsets]);
      return initialScrollOffsets.current ? subtract(scrollOffsets, initialScrollOffsets.current) : defaultCoordinates;
    }
    function useSensorSetup(sensors) {
      (0, import_react3.useEffect)(
        () => {
          if (!canUseDOM) {
            return;
          }
          const teardownFns = sensors.map((_ref) => {
            let {
              sensor
            } = _ref;
            return sensor.setup == null ? void 0 : sensor.setup();
          });
          return () => {
            for (const teardown of teardownFns) {
              teardown == null ? void 0 : teardown();
            }
          };
        },
        // TO-DO: Sensors length could theoretically change which would not be a valid dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
        sensors.map((_ref2) => {
          let {
            sensor
          } = _ref2;
          return sensor;
        })
      );
    }
    function useSyntheticListeners(listeners, id) {
      return (0, import_react3.useMemo)(() => {
        return listeners.reduce((acc, _ref) => {
          let {
            eventName,
            handler
          } = _ref;
          acc[eventName] = (event) => {
            handler(event, id);
          };
          return acc;
        }, {});
      }, [listeners, id]);
    }
    function useWindowRect(element) {
      return (0, import_react3.useMemo)(() => element ? getWindowClientRect(element) : null, [element]);
    }
    var defaultValue$2 = [];
    function useRects(elements, measure) {
      if (measure === void 0) {
        measure = getClientRect;
      }
      const [firstElement] = elements;
      const windowRect = useWindowRect(firstElement ? getWindow(firstElement) : null);
      const [rects, setRects] = (0, import_react3.useState)(defaultValue$2);
      function measureRects() {
        setRects(() => {
          if (!elements.length) {
            return defaultValue$2;
          }
          return elements.map((element) => isDocumentScrollingElement(element) ? windowRect : new Rect(measure(element), element));
        });
      }
      const resizeObserver = useResizeObserver({
        callback: measureRects
      });
      useIsomorphicLayoutEffect(() => {
        resizeObserver == null ? void 0 : resizeObserver.disconnect();
        measureRects();
        elements.forEach((element) => resizeObserver == null ? void 0 : resizeObserver.observe(element));
      }, [elements]);
      return rects;
    }
    function getMeasurableNode(node) {
      if (!node) {
        return null;
      }
      if (node.children.length > 1) {
        return node;
      }
      const firstChild = node.children[0];
      return isHTMLElement(firstChild) ? firstChild : node;
    }
    function useDragOverlayMeasuring(_ref) {
      let {
        measure
      } = _ref;
      const [rect, setRect] = (0, import_react3.useState)(null);
      const handleResize = (0, import_react3.useCallback)((entries) => {
        for (const {
          target
        } of entries) {
          if (isHTMLElement(target)) {
            setRect((rect2) => {
              const newRect = measure(target);
              return rect2 ? {
                ...rect2,
                width: newRect.width,
                height: newRect.height
              } : newRect;
            });
            break;
          }
        }
      }, [measure]);
      const resizeObserver = useResizeObserver({
        callback: handleResize
      });
      const handleNodeChange = (0, import_react3.useCallback)((element) => {
        const node = getMeasurableNode(element);
        resizeObserver == null ? void 0 : resizeObserver.disconnect();
        if (node) {
          resizeObserver == null ? void 0 : resizeObserver.observe(node);
        }
        setRect(node ? measure(node) : null);
      }, [measure, resizeObserver]);
      const [nodeRef, setRef] = useNodeRef(handleNodeChange);
      return (0, import_react3.useMemo)(() => ({
        nodeRef,
        rect,
        setRef
      }), [rect, nodeRef, setRef]);
    }
    var defaultSensors = [{
      sensor: PointerSensor,
      options: {}
    }, {
      sensor: KeyboardSensor,
      options: {}
    }];
    var defaultData = {
      current: {}
    };
    var defaultMeasuringConfiguration = {
      draggable: {
        measure: getTransformAgnosticClientRect
      },
      droppable: {
        measure: getTransformAgnosticClientRect,
        strategy: MeasuringStrategy.WhileDragging,
        frequency: MeasuringFrequency.Optimized
      },
      dragOverlay: {
        measure: getClientRect
      }
    };
    var DroppableContainersMap = class extends Map {
      get(id) {
        var _super$get;
        return id != null ? (_super$get = super.get(id)) != null ? _super$get : void 0 : void 0;
      }
      toArray() {
        return Array.from(this.values());
      }
      getEnabled() {
        return this.toArray().filter((_ref) => {
          let {
            disabled
          } = _ref;
          return !disabled;
        });
      }
      getNodeFor(id) {
        var _this$get$node$curren, _this$get;
        return (_this$get$node$curren = (_this$get = this.get(id)) == null ? void 0 : _this$get.node.current) != null ? _this$get$node$curren : void 0;
      }
    };
    var defaultPublicContext = {
      activatorEvent: null,
      active: null,
      activeNode: null,
      activeNodeRect: null,
      collisions: null,
      containerNodeRect: null,
      draggableNodes: /* @__PURE__ */ new Map(),
      droppableRects: /* @__PURE__ */ new Map(),
      droppableContainers: /* @__PURE__ */ new DroppableContainersMap(),
      over: null,
      dragOverlay: {
        nodeRef: {
          current: null
        },
        rect: null,
        setRef: noop
      },
      scrollableAncestors: [],
      scrollableAncestorRects: [],
      measuringConfiguration: defaultMeasuringConfiguration,
      measureDroppableContainers: noop,
      windowRect: null,
      measuringScheduled: false
    };
    var defaultInternalContext = {
      activatorEvent: null,
      activators: [],
      active: null,
      activeNodeRect: null,
      ariaDescribedById: {
        draggable: ""
      },
      dispatch: noop,
      draggableNodes: /* @__PURE__ */ new Map(),
      over: null,
      measureDroppableContainers: noop
    };
    var InternalContext = /* @__PURE__ */ (0, import_react3.createContext)(defaultInternalContext);
    var PublicContext = /* @__PURE__ */ (0, import_react3.createContext)(defaultPublicContext);
    function getInitialState() {
      return {
        draggable: {
          active: null,
          initialCoordinates: {
            x: 0,
            y: 0
          },
          nodes: /* @__PURE__ */ new Map(),
          translate: {
            x: 0,
            y: 0
          }
        },
        droppable: {
          containers: new DroppableContainersMap()
        }
      };
    }
    function reducer(state, action) {
      switch (action.type) {
        case Action.DragStart:
          return {
            ...state,
            draggable: {
              ...state.draggable,
              initialCoordinates: action.initialCoordinates,
              active: action.active
            }
          };
        case Action.DragMove:
          if (state.draggable.active == null) {
            return state;
          }
          return {
            ...state,
            draggable: {
              ...state.draggable,
              translate: {
                x: action.coordinates.x - state.draggable.initialCoordinates.x,
                y: action.coordinates.y - state.draggable.initialCoordinates.y
              }
            }
          };
        case Action.DragEnd:
        case Action.DragCancel:
          return {
            ...state,
            draggable: {
              ...state.draggable,
              active: null,
              initialCoordinates: {
                x: 0,
                y: 0
              },
              translate: {
                x: 0,
                y: 0
              }
            }
          };
        case Action.RegisterDroppable: {
          const {
            element
          } = action;
          const {
            id
          } = element;
          const containers = new DroppableContainersMap(state.droppable.containers);
          containers.set(id, element);
          return {
            ...state,
            droppable: {
              ...state.droppable,
              containers
            }
          };
        }
        case Action.SetDroppableDisabled: {
          const {
            id,
            key: key2,
            disabled
          } = action;
          const element = state.droppable.containers.get(id);
          if (!element || key2 !== element.key) {
            return state;
          }
          const containers = new DroppableContainersMap(state.droppable.containers);
          containers.set(id, {
            ...element,
            disabled
          });
          return {
            ...state,
            droppable: {
              ...state.droppable,
              containers
            }
          };
        }
        case Action.UnregisterDroppable: {
          const {
            id,
            key: key2
          } = action;
          const element = state.droppable.containers.get(id);
          if (!element || key2 !== element.key) {
            return state;
          }
          const containers = new DroppableContainersMap(state.droppable.containers);
          containers.delete(id);
          return {
            ...state,
            droppable: {
              ...state.droppable,
              containers
            }
          };
        }
        default: {
          return state;
        }
      }
    }
    function RestoreFocus(_ref) {
      let {
        disabled
      } = _ref;
      const {
        active,
        activatorEvent,
        draggableNodes
      } = (0, import_react3.useContext)(InternalContext);
      const previousActivatorEvent = usePrevious(activatorEvent);
      const previousActiveId = usePrevious(active == null ? void 0 : active.id);
      (0, import_react3.useEffect)(() => {
        if (disabled) {
          return;
        }
        if (!activatorEvent && previousActivatorEvent && previousActiveId != null) {
          if (!isKeyboardEvent(previousActivatorEvent)) {
            return;
          }
          if (document.activeElement === previousActivatorEvent.target) {
            return;
          }
          const draggableNode = draggableNodes.get(previousActiveId);
          if (!draggableNode) {
            return;
          }
          const {
            activatorNode,
            node
          } = draggableNode;
          if (!activatorNode.current && !node.current) {
            return;
          }
          requestAnimationFrame(() => {
            for (const element of [activatorNode.current, node.current]) {
              if (!element) {
                continue;
              }
              const focusableNode = findFirstFocusableNode(element);
              if (focusableNode) {
                focusableNode.focus();
                break;
              }
            }
          });
        }
      }, [activatorEvent, disabled, draggableNodes, previousActiveId, previousActivatorEvent]);
      return null;
    }
    function applyModifiers(modifiers, _ref) {
      let {
        transform,
        ...args
      } = _ref;
      return modifiers != null && modifiers.length ? modifiers.reduce((accumulator, modifier) => {
        return modifier({
          transform: accumulator,
          ...args
        });
      }, transform) : transform;
    }
    function useMeasuringConfiguration(config) {
      return (0, import_react3.useMemo)(
        () => ({
          draggable: {
            ...defaultMeasuringConfiguration.draggable,
            ...config == null ? void 0 : config.draggable
          },
          droppable: {
            ...defaultMeasuringConfiguration.droppable,
            ...config == null ? void 0 : config.droppable
          },
          dragOverlay: {
            ...defaultMeasuringConfiguration.dragOverlay,
            ...config == null ? void 0 : config.dragOverlay
          }
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [config == null ? void 0 : config.draggable, config == null ? void 0 : config.droppable, config == null ? void 0 : config.dragOverlay]
      );
    }
    function useLayoutShiftScrollCompensation(_ref) {
      let {
        activeNode,
        measure,
        initialRect,
        config = true
      } = _ref;
      const initialized = (0, import_react3.useRef)(false);
      const {
        x,
        y
      } = typeof config === "boolean" ? {
        x: config,
        y: config
      } : config;
      useIsomorphicLayoutEffect(() => {
        const disabled = !x && !y;
        if (disabled || !activeNode) {
          initialized.current = false;
          return;
        }
        if (initialized.current || !initialRect) {
          return;
        }
        const node = activeNode == null ? void 0 : activeNode.node.current;
        if (!node || node.isConnected === false) {
          return;
        }
        const rect = measure(node);
        const rectDelta = getRectDelta(rect, initialRect);
        if (!x) {
          rectDelta.x = 0;
        }
        if (!y) {
          rectDelta.y = 0;
        }
        initialized.current = true;
        if (Math.abs(rectDelta.x) > 0 || Math.abs(rectDelta.y) > 0) {
          const firstScrollableAncestor = getFirstScrollableAncestor(node);
          if (firstScrollableAncestor) {
            firstScrollableAncestor.scrollBy({
              top: rectDelta.y,
              left: rectDelta.x
            });
          }
        }
      }, [activeNode, x, y, initialRect, measure]);
    }
    var ActiveDraggableContext = /* @__PURE__ */ (0, import_react3.createContext)({
      ...defaultCoordinates,
      scaleX: 1,
      scaleY: 1
    });
    var Status;
    (function(Status2) {
      Status2[Status2["Uninitialized"] = 0] = "Uninitialized";
      Status2[Status2["Initializing"] = 1] = "Initializing";
      Status2[Status2["Initialized"] = 2] = "Initialized";
    })(Status || (Status = {}));
    var DndContext = /* @__PURE__ */ (0, import_react3.memo)(function DndContext2(_ref) {
      var _sensorContext$curren, _dragOverlay$nodeRef$, _dragOverlay$rect, _over$rect;
      let {
        id,
        accessibility,
        autoScroll = true,
        children,
        sensors = defaultSensors,
        collisionDetection = rectIntersection,
        measuring,
        modifiers,
        ...props
      } = _ref;
      const store = (0, import_react3.useReducer)(reducer, void 0, getInitialState);
      const [state, dispatch] = store;
      const [dispatchMonitorEvent, registerMonitorListener] = useDndMonitorProvider();
      const [status, setStatus] = (0, import_react3.useState)(Status.Uninitialized);
      const isInitialized = status === Status.Initialized;
      const {
        draggable: {
          active: activeId,
          nodes: draggableNodes,
          translate
        },
        droppable: {
          containers: droppableContainers
        }
      } = state;
      const node = activeId != null ? draggableNodes.get(activeId) : null;
      const activeRects = (0, import_react3.useRef)({
        initial: null,
        translated: null
      });
      const active = (0, import_react3.useMemo)(() => {
        var _node$data;
        return activeId != null ? {
          id: activeId,
          // It's possible for the active node to unmount while dragging
          data: (_node$data = node == null ? void 0 : node.data) != null ? _node$data : defaultData,
          rect: activeRects
        } : null;
      }, [activeId, node]);
      const activeRef = (0, import_react3.useRef)(null);
      const [activeSensor, setActiveSensor] = (0, import_react3.useState)(null);
      const [activatorEvent, setActivatorEvent] = (0, import_react3.useState)(null);
      const latestProps = useLatestValue(props, Object.values(props));
      const draggableDescribedById = useUniqueId("DndDescribedBy", id);
      const enabledDroppableContainers = (0, import_react3.useMemo)(() => droppableContainers.getEnabled(), [droppableContainers]);
      const measuringConfiguration = useMeasuringConfiguration(measuring);
      const {
        droppableRects,
        measureDroppableContainers,
        measuringScheduled
      } = useDroppableMeasuring(enabledDroppableContainers, {
        dragging: isInitialized,
        dependencies: [translate.x, translate.y],
        config: measuringConfiguration.droppable
      });
      const activeNode = useCachedNode(draggableNodes, activeId);
      const activationCoordinates = (0, import_react3.useMemo)(() => activatorEvent ? getEventCoordinates(activatorEvent) : null, [activatorEvent]);
      const autoScrollOptions = getAutoScrollerOptions();
      const initialActiveNodeRect = useInitialRect(activeNode, measuringConfiguration.draggable.measure);
      useLayoutShiftScrollCompensation({
        activeNode: activeId != null ? draggableNodes.get(activeId) : null,
        config: autoScrollOptions.layoutShiftCompensation,
        initialRect: initialActiveNodeRect,
        measure: measuringConfiguration.draggable.measure
      });
      const activeNodeRect = useRect(activeNode, measuringConfiguration.draggable.measure, initialActiveNodeRect);
      const containerNodeRect = useRect(activeNode ? activeNode.parentElement : null);
      const sensorContext = (0, import_react3.useRef)({
        activatorEvent: null,
        active: null,
        activeNode,
        collisionRect: null,
        collisions: null,
        droppableRects,
        draggableNodes,
        draggingNode: null,
        draggingNodeRect: null,
        droppableContainers,
        over: null,
        scrollableAncestors: [],
        scrollAdjustedTranslate: null
      });
      const overNode = droppableContainers.getNodeFor((_sensorContext$curren = sensorContext.current.over) == null ? void 0 : _sensorContext$curren.id);
      const dragOverlay = useDragOverlayMeasuring({
        measure: measuringConfiguration.dragOverlay.measure
      });
      const draggingNode = (_dragOverlay$nodeRef$ = dragOverlay.nodeRef.current) != null ? _dragOverlay$nodeRef$ : activeNode;
      const draggingNodeRect = isInitialized ? (_dragOverlay$rect = dragOverlay.rect) != null ? _dragOverlay$rect : activeNodeRect : null;
      const usesDragOverlay = Boolean(dragOverlay.nodeRef.current && dragOverlay.rect);
      const nodeRectDelta = useRectDelta(usesDragOverlay ? null : activeNodeRect);
      const windowRect = useWindowRect(draggingNode ? getWindow(draggingNode) : null);
      const scrollableAncestors = useScrollableAncestors(isInitialized ? overNode != null ? overNode : activeNode : null);
      const scrollableAncestorRects = useRects(scrollableAncestors);
      const modifiedTranslate = applyModifiers(modifiers, {
        transform: {
          x: translate.x - nodeRectDelta.x,
          y: translate.y - nodeRectDelta.y,
          scaleX: 1,
          scaleY: 1
        },
        activatorEvent,
        active,
        activeNodeRect,
        containerNodeRect,
        draggingNodeRect,
        over: sensorContext.current.over,
        overlayNodeRect: dragOverlay.rect,
        scrollableAncestors,
        scrollableAncestorRects,
        windowRect
      });
      const pointerCoordinates = activationCoordinates ? add(activationCoordinates, translate) : null;
      const scrollOffsets = useScrollOffsets(scrollableAncestors);
      const scrollAdjustment = useScrollOffsetsDelta(scrollOffsets);
      const activeNodeScrollDelta = useScrollOffsetsDelta(scrollOffsets, [activeNodeRect]);
      const scrollAdjustedTranslate = add(modifiedTranslate, scrollAdjustment);
      const collisionRect = draggingNodeRect ? getAdjustedRect(draggingNodeRect, modifiedTranslate) : null;
      const collisions = active && collisionRect ? collisionDetection({
        active,
        collisionRect,
        droppableRects,
        droppableContainers: enabledDroppableContainers,
        pointerCoordinates
      }) : null;
      const overId = getFirstCollision(collisions, "id");
      const [over, setOver] = (0, import_react3.useState)(null);
      const appliedTranslate = usesDragOverlay ? modifiedTranslate : add(modifiedTranslate, activeNodeScrollDelta);
      const transform = adjustScale(appliedTranslate, (_over$rect = over == null ? void 0 : over.rect) != null ? _over$rect : null, activeNodeRect);
      const activeSensorRef = (0, import_react3.useRef)(null);
      const instantiateSensor = (0, import_react3.useCallback)(
        (event, _ref2) => {
          let {
            sensor: Sensor,
            options
          } = _ref2;
          if (activeRef.current == null) {
            return;
          }
          const activeNode2 = draggableNodes.get(activeRef.current);
          if (!activeNode2) {
            return;
          }
          const activatorEvent2 = event.nativeEvent;
          const sensorInstance = new Sensor({
            active: activeRef.current,
            activeNode: activeNode2,
            event: activatorEvent2,
            options,
            // Sensors need to be instantiated with refs for arguments that change over time
            // otherwise they are frozen in time with the stale arguments
            context: sensorContext,
            onAbort(id2) {
              const draggableNode = draggableNodes.get(id2);
              if (!draggableNode) {
                return;
              }
              const {
                onDragAbort
              } = latestProps.current;
              const event2 = {
                id: id2
              };
              onDragAbort == null ? void 0 : onDragAbort(event2);
              dispatchMonitorEvent({
                type: "onDragAbort",
                event: event2
              });
            },
            onPending(id2, constraint, initialCoordinates, offset) {
              const draggableNode = draggableNodes.get(id2);
              if (!draggableNode) {
                return;
              }
              const {
                onDragPending
              } = latestProps.current;
              const event2 = {
                id: id2,
                constraint,
                initialCoordinates,
                offset
              };
              onDragPending == null ? void 0 : onDragPending(event2);
              dispatchMonitorEvent({
                type: "onDragPending",
                event: event2
              });
            },
            onStart(initialCoordinates) {
              const id2 = activeRef.current;
              if (id2 == null) {
                return;
              }
              const draggableNode = draggableNodes.get(id2);
              if (!draggableNode) {
                return;
              }
              const {
                onDragStart
              } = latestProps.current;
              const event2 = {
                activatorEvent: activatorEvent2,
                active: {
                  id: id2,
                  data: draggableNode.data,
                  rect: activeRects
                }
              };
              (0, import_react_dom.unstable_batchedUpdates)(() => {
                onDragStart == null ? void 0 : onDragStart(event2);
                setStatus(Status.Initializing);
                dispatch({
                  type: Action.DragStart,
                  initialCoordinates,
                  active: id2
                });
                dispatchMonitorEvent({
                  type: "onDragStart",
                  event: event2
                });
                setActiveSensor(activeSensorRef.current);
                setActivatorEvent(activatorEvent2);
              });
            },
            onMove(coordinates) {
              dispatch({
                type: Action.DragMove,
                coordinates
              });
            },
            onEnd: createHandler(Action.DragEnd),
            onCancel: createHandler(Action.DragCancel)
          });
          activeSensorRef.current = sensorInstance;
          function createHandler(type) {
            return async function handler() {
              const {
                active: active2,
                collisions: collisions2,
                over: over2,
                scrollAdjustedTranslate: scrollAdjustedTranslate2
              } = sensorContext.current;
              let event2 = null;
              if (active2 && scrollAdjustedTranslate2) {
                const {
                  cancelDrop
                } = latestProps.current;
                event2 = {
                  activatorEvent: activatorEvent2,
                  active: active2,
                  collisions: collisions2,
                  delta: scrollAdjustedTranslate2,
                  over: over2
                };
                if (type === Action.DragEnd && typeof cancelDrop === "function") {
                  const shouldCancel = await Promise.resolve(cancelDrop(event2));
                  if (shouldCancel) {
                    type = Action.DragCancel;
                  }
                }
              }
              activeRef.current = null;
              (0, import_react_dom.unstable_batchedUpdates)(() => {
                dispatch({
                  type
                });
                setStatus(Status.Uninitialized);
                setOver(null);
                setActiveSensor(null);
                setActivatorEvent(null);
                activeSensorRef.current = null;
                const eventName = type === Action.DragEnd ? "onDragEnd" : "onDragCancel";
                if (event2) {
                  const handler2 = latestProps.current[eventName];
                  handler2 == null ? void 0 : handler2(event2);
                  dispatchMonitorEvent({
                    type: eventName,
                    event: event2
                  });
                }
              });
            };
          }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [draggableNodes]
      );
      const bindActivatorToSensorInstantiator = (0, import_react3.useCallback)((handler, sensor) => {
        return (event, active2) => {
          const nativeEvent = event.nativeEvent;
          const activeDraggableNode = draggableNodes.get(active2);
          if (
            // Another sensor is already instantiating
            activeRef.current !== null || // No active draggable
            !activeDraggableNode || // Event has already been captured
            nativeEvent.dndKit || nativeEvent.defaultPrevented
          ) {
            return;
          }
          const activationContext = {
            active: activeDraggableNode
          };
          const shouldActivate = handler(event, sensor.options, activationContext);
          if (shouldActivate === true) {
            nativeEvent.dndKit = {
              capturedBy: sensor.sensor
            };
            activeRef.current = active2;
            instantiateSensor(event, sensor);
          }
        };
      }, [draggableNodes, instantiateSensor]);
      const activators = useCombineActivators(sensors, bindActivatorToSensorInstantiator);
      useSensorSetup(sensors);
      useIsomorphicLayoutEffect(() => {
        if (activeNodeRect && status === Status.Initializing) {
          setStatus(Status.Initialized);
        }
      }, [activeNodeRect, status]);
      (0, import_react3.useEffect)(
        () => {
          const {
            onDragMove
          } = latestProps.current;
          const {
            active: active2,
            activatorEvent: activatorEvent2,
            collisions: collisions2,
            over: over2
          } = sensorContext.current;
          if (!active2 || !activatorEvent2) {
            return;
          }
          const event = {
            active: active2,
            activatorEvent: activatorEvent2,
            collisions: collisions2,
            delta: {
              x: scrollAdjustedTranslate.x,
              y: scrollAdjustedTranslate.y
            },
            over: over2
          };
          (0, import_react_dom.unstable_batchedUpdates)(() => {
            onDragMove == null ? void 0 : onDragMove(event);
            dispatchMonitorEvent({
              type: "onDragMove",
              event
            });
          });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [scrollAdjustedTranslate.x, scrollAdjustedTranslate.y]
      );
      (0, import_react3.useEffect)(
        () => {
          const {
            active: active2,
            activatorEvent: activatorEvent2,
            collisions: collisions2,
            droppableContainers: droppableContainers2,
            scrollAdjustedTranslate: scrollAdjustedTranslate2
          } = sensorContext.current;
          if (!active2 || activeRef.current == null || !activatorEvent2 || !scrollAdjustedTranslate2) {
            return;
          }
          const {
            onDragOver
          } = latestProps.current;
          const overContainer = droppableContainers2.get(overId);
          const over2 = overContainer && overContainer.rect.current ? {
            id: overContainer.id,
            rect: overContainer.rect.current,
            data: overContainer.data,
            disabled: overContainer.disabled
          } : null;
          const event = {
            active: active2,
            activatorEvent: activatorEvent2,
            collisions: collisions2,
            delta: {
              x: scrollAdjustedTranslate2.x,
              y: scrollAdjustedTranslate2.y
            },
            over: over2
          };
          (0, import_react_dom.unstable_batchedUpdates)(() => {
            setOver(over2);
            onDragOver == null ? void 0 : onDragOver(event);
            dispatchMonitorEvent({
              type: "onDragOver",
              event
            });
          });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [overId]
      );
      useIsomorphicLayoutEffect(() => {
        sensorContext.current = {
          activatorEvent,
          active,
          activeNode,
          collisionRect,
          collisions,
          droppableRects,
          draggableNodes,
          draggingNode,
          draggingNodeRect,
          droppableContainers,
          over,
          scrollableAncestors,
          scrollAdjustedTranslate
        };
        activeRects.current = {
          initial: draggingNodeRect,
          translated: collisionRect
        };
      }, [active, activeNode, collisions, collisionRect, draggableNodes, draggingNode, draggingNodeRect, droppableRects, droppableContainers, over, scrollableAncestors, scrollAdjustedTranslate]);
      useAutoScroller({
        ...autoScrollOptions,
        delta: translate,
        draggingRect: collisionRect,
        pointerCoordinates,
        scrollableAncestors,
        scrollableAncestorRects
      });
      const publicContext = (0, import_react3.useMemo)(() => {
        const context = {
          active,
          activeNode,
          activeNodeRect,
          activatorEvent,
          collisions,
          containerNodeRect,
          dragOverlay,
          draggableNodes,
          droppableContainers,
          droppableRects,
          over,
          measureDroppableContainers,
          scrollableAncestors,
          scrollableAncestorRects,
          measuringConfiguration,
          measuringScheduled,
          windowRect
        };
        return context;
      }, [active, activeNode, activeNodeRect, activatorEvent, collisions, containerNodeRect, dragOverlay, draggableNodes, droppableContainers, droppableRects, over, measureDroppableContainers, scrollableAncestors, scrollableAncestorRects, measuringConfiguration, measuringScheduled, windowRect]);
      const internalContext = (0, import_react3.useMemo)(() => {
        const context = {
          activatorEvent,
          activators,
          active,
          activeNodeRect,
          ariaDescribedById: {
            draggable: draggableDescribedById
          },
          dispatch,
          draggableNodes,
          over,
          measureDroppableContainers
        };
        return context;
      }, [activatorEvent, activators, active, activeNodeRect, dispatch, draggableDescribedById, draggableNodes, over, measureDroppableContainers]);
      return import_react3.default.createElement(DndMonitorContext.Provider, {
        value: registerMonitorListener
      }, import_react3.default.createElement(InternalContext.Provider, {
        value: internalContext
      }, import_react3.default.createElement(PublicContext.Provider, {
        value: publicContext
      }, import_react3.default.createElement(ActiveDraggableContext.Provider, {
        value: transform
      }, children)), import_react3.default.createElement(RestoreFocus, {
        disabled: (accessibility == null ? void 0 : accessibility.restoreFocus) === false
      })), import_react3.default.createElement(Accessibility, {
        ...accessibility,
        hiddenTextDescribedById: draggableDescribedById
      }));
      function getAutoScrollerOptions() {
        const activeSensorDisablesAutoscroll = (activeSensor == null ? void 0 : activeSensor.autoScrollEnabled) === false;
        const autoScrollGloballyDisabled = typeof autoScroll === "object" ? autoScroll.enabled === false : autoScroll === false;
        const enabled = isInitialized && !activeSensorDisablesAutoscroll && !autoScrollGloballyDisabled;
        if (typeof autoScroll === "object") {
          return {
            ...autoScroll,
            enabled
          };
        }
        return {
          enabled
        };
      }
    });
    var NullContext = /* @__PURE__ */ (0, import_react3.createContext)(null);
    var defaultRole = "button";
    var ID_PREFIX = "Draggable";
    function useDraggable(_ref) {
      let {
        id,
        data,
        disabled = false,
        attributes
      } = _ref;
      const key2 = useUniqueId(ID_PREFIX);
      const {
        activators,
        activatorEvent,
        active,
        activeNodeRect,
        ariaDescribedById,
        draggableNodes,
        over
      } = (0, import_react3.useContext)(InternalContext);
      const {
        role = defaultRole,
        roleDescription = "draggable",
        tabIndex = 0
      } = attributes != null ? attributes : {};
      const isDragging = (active == null ? void 0 : active.id) === id;
      const transform = (0, import_react3.useContext)(isDragging ? ActiveDraggableContext : NullContext);
      const [node, setNodeRef] = useNodeRef();
      const [activatorNode, setActivatorNodeRef] = useNodeRef();
      const listeners = useSyntheticListeners(activators, id);
      const dataRef = useLatestValue(data);
      useIsomorphicLayoutEffect(
        () => {
          draggableNodes.set(id, {
            id,
            key: key2,
            node,
            activatorNode,
            data: dataRef
          });
          return () => {
            const node2 = draggableNodes.get(id);
            if (node2 && node2.key === key2) {
              draggableNodes.delete(id);
            }
          };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [draggableNodes, id]
      );
      const memoizedAttributes = (0, import_react3.useMemo)(() => ({
        role,
        tabIndex,
        "aria-disabled": disabled,
        "aria-pressed": isDragging && role === defaultRole ? true : void 0,
        "aria-roledescription": roleDescription,
        "aria-describedby": ariaDescribedById.draggable
      }), [disabled, role, tabIndex, isDragging, roleDescription, ariaDescribedById.draggable]);
      return {
        active,
        activatorEvent,
        activeNodeRect,
        attributes: memoizedAttributes,
        isDragging,
        listeners: disabled ? void 0 : listeners,
        node,
        over,
        setNodeRef,
        setActivatorNodeRef,
        transform
      };
    }
    function useDndContext() {
      return (0, import_react3.useContext)(PublicContext);
    }
    var ID_PREFIX$1 = "Droppable";
    var defaultResizeObserverConfig = {
      timeout: 25
    };
    function useDroppable(_ref) {
      let {
        data,
        disabled = false,
        id,
        resizeObserverConfig
      } = _ref;
      const key2 = useUniqueId(ID_PREFIX$1);
      const {
        active,
        dispatch,
        over,
        measureDroppableContainers
      } = (0, import_react3.useContext)(InternalContext);
      const previous = (0, import_react3.useRef)({
        disabled
      });
      const resizeObserverConnected = (0, import_react3.useRef)(false);
      const rect = (0, import_react3.useRef)(null);
      const callbackId = (0, import_react3.useRef)(null);
      const {
        disabled: resizeObserverDisabled,
        updateMeasurementsFor,
        timeout: resizeObserverTimeout
      } = {
        ...defaultResizeObserverConfig,
        ...resizeObserverConfig
      };
      const ids2 = useLatestValue(updateMeasurementsFor != null ? updateMeasurementsFor : id);
      const handleResize = (0, import_react3.useCallback)(
        () => {
          if (!resizeObserverConnected.current) {
            resizeObserverConnected.current = true;
            return;
          }
          if (callbackId.current != null) {
            clearTimeout(callbackId.current);
          }
          callbackId.current = setTimeout(() => {
            measureDroppableContainers(Array.isArray(ids2.current) ? ids2.current : [ids2.current]);
            callbackId.current = null;
          }, resizeObserverTimeout);
        },
        //eslint-disable-next-line react-hooks/exhaustive-deps
        [resizeObserverTimeout]
      );
      const resizeObserver = useResizeObserver({
        callback: handleResize,
        disabled: resizeObserverDisabled || !active
      });
      const handleNodeChange = (0, import_react3.useCallback)((newElement, previousElement) => {
        if (!resizeObserver) {
          return;
        }
        if (previousElement) {
          resizeObserver.unobserve(previousElement);
          resizeObserverConnected.current = false;
        }
        if (newElement) {
          resizeObserver.observe(newElement);
        }
      }, [resizeObserver]);
      const [nodeRef, setNodeRef] = useNodeRef(handleNodeChange);
      const dataRef = useLatestValue(data);
      (0, import_react3.useEffect)(() => {
        if (!resizeObserver || !nodeRef.current) {
          return;
        }
        resizeObserver.disconnect();
        resizeObserverConnected.current = false;
        resizeObserver.observe(nodeRef.current);
      }, [nodeRef, resizeObserver]);
      (0, import_react3.useEffect)(
        () => {
          dispatch({
            type: Action.RegisterDroppable,
            element: {
              id,
              key: key2,
              disabled,
              node: nodeRef,
              rect,
              data: dataRef
            }
          });
          return () => dispatch({
            type: Action.UnregisterDroppable,
            key: key2,
            id
          });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id]
      );
      (0, import_react3.useEffect)(() => {
        if (disabled !== previous.current.disabled) {
          dispatch({
            type: Action.SetDroppableDisabled,
            id,
            key: key2,
            disabled
          });
          previous.current.disabled = disabled;
        }
      }, [id, key2, disabled, dispatch]);
      return {
        active,
        rect,
        isOver: (over == null ? void 0 : over.id) === id,
        node: nodeRef,
        over,
        setNodeRef
      };
    }
    function AnimationManager(_ref) {
      let {
        animation,
        children
      } = _ref;
      const [clonedChildren, setClonedChildren] = (0, import_react3.useState)(null);
      const [element, setElement] = (0, import_react3.useState)(null);
      const previousChildren = usePrevious(children);
      if (!children && !clonedChildren && previousChildren) {
        setClonedChildren(previousChildren);
      }
      useIsomorphicLayoutEffect(() => {
        if (!element) {
          return;
        }
        const key2 = clonedChildren == null ? void 0 : clonedChildren.key;
        const id = clonedChildren == null ? void 0 : clonedChildren.props.id;
        if (key2 == null || id == null) {
          setClonedChildren(null);
          return;
        }
        Promise.resolve(animation(id, element)).then(() => {
          setClonedChildren(null);
        });
      }, [animation, clonedChildren, element]);
      return import_react3.default.createElement(import_react3.default.Fragment, null, children, clonedChildren ? (0, import_react3.cloneElement)(clonedChildren, {
        ref: setElement
      }) : null);
    }
    var defaultTransform = {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1
    };
    function NullifiedContextProvider(_ref) {
      let {
        children
      } = _ref;
      return import_react3.default.createElement(InternalContext.Provider, {
        value: defaultInternalContext
      }, import_react3.default.createElement(ActiveDraggableContext.Provider, {
        value: defaultTransform
      }, children));
    }
    var baseStyles = {
      position: "fixed",
      touchAction: "none"
    };
    var defaultTransition = (activatorEvent) => {
      const isKeyboardActivator = isKeyboardEvent(activatorEvent);
      return isKeyboardActivator ? "transform 250ms ease" : void 0;
    };
    var PositionedOverlay = /* @__PURE__ */ (0, import_react3.forwardRef)((_ref, ref) => {
      let {
        as,
        activatorEvent,
        adjustScale: adjustScale2,
        children,
        className,
        rect,
        style,
        transform,
        transition = defaultTransition
      } = _ref;
      if (!rect) {
        return null;
      }
      const scaleAdjustedTransform = adjustScale2 ? transform : {
        ...transform,
        scaleX: 1,
        scaleY: 1
      };
      const styles = {
        ...baseStyles,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        transform: CSS.Transform.toString(scaleAdjustedTransform),
        transformOrigin: adjustScale2 && activatorEvent ? getRelativeTransformOrigin(activatorEvent, rect) : void 0,
        transition: typeof transition === "function" ? transition(activatorEvent) : transition,
        ...style
      };
      return import_react3.default.createElement(as, {
        className,
        style: styles,
        ref
      }, children);
    });
    var defaultDropAnimationSideEffects = (options) => (_ref) => {
      let {
        active,
        dragOverlay
      } = _ref;
      const originalStyles = {};
      const {
        styles,
        className
      } = options;
      if (styles != null && styles.active) {
        for (const [key2, value] of Object.entries(styles.active)) {
          if (value === void 0) {
            continue;
          }
          originalStyles[key2] = active.node.style.getPropertyValue(key2);
          active.node.style.setProperty(key2, value);
        }
      }
      if (styles != null && styles.dragOverlay) {
        for (const [key2, value] of Object.entries(styles.dragOverlay)) {
          if (value === void 0) {
            continue;
          }
          dragOverlay.node.style.setProperty(key2, value);
        }
      }
      if (className != null && className.active) {
        active.node.classList.add(className.active);
      }
      if (className != null && className.dragOverlay) {
        dragOverlay.node.classList.add(className.dragOverlay);
      }
      return function cleanup() {
        for (const [key2, value] of Object.entries(originalStyles)) {
          active.node.style.setProperty(key2, value);
        }
        if (className != null && className.active) {
          active.node.classList.remove(className.active);
        }
      };
    };
    var defaultKeyframeResolver = (_ref2) => {
      let {
        transform: {
          initial,
          final
        }
      } = _ref2;
      return [{
        transform: CSS.Transform.toString(initial)
      }, {
        transform: CSS.Transform.toString(final)
      }];
    };
    var defaultDropAnimationConfiguration = {
      duration: 250,
      easing: "ease",
      keyframes: defaultKeyframeResolver,
      sideEffects: /* @__PURE__ */ defaultDropAnimationSideEffects({
        styles: {
          active: {
            opacity: "0"
          }
        }
      })
    };
    function useDropAnimation(_ref3) {
      let {
        config,
        draggableNodes,
        droppableContainers,
        measuringConfiguration
      } = _ref3;
      return useEvent((id, node) => {
        if (config === null) {
          return;
        }
        const activeDraggable = draggableNodes.get(id);
        if (!activeDraggable) {
          return;
        }
        const activeNode = activeDraggable.node.current;
        if (!activeNode) {
          return;
        }
        const measurableNode = getMeasurableNode(node);
        if (!measurableNode) {
          return;
        }
        const {
          transform
        } = getWindow(node).getComputedStyle(node);
        const parsedTransform = parseTransform(transform);
        if (!parsedTransform) {
          return;
        }
        const animation = typeof config === "function" ? config : createDefaultDropAnimation(config);
        scrollIntoViewIfNeeded(activeNode, measuringConfiguration.draggable.measure);
        return animation({
          active: {
            id,
            data: activeDraggable.data,
            node: activeNode,
            rect: measuringConfiguration.draggable.measure(activeNode)
          },
          draggableNodes,
          dragOverlay: {
            node,
            rect: measuringConfiguration.dragOverlay.measure(measurableNode)
          },
          droppableContainers,
          measuringConfiguration,
          transform: parsedTransform
        });
      });
    }
    function createDefaultDropAnimation(options) {
      const {
        duration,
        easing,
        sideEffects,
        keyframes
      } = {
        ...defaultDropAnimationConfiguration,
        ...options
      };
      return (_ref4) => {
        let {
          active,
          dragOverlay,
          transform,
          ...rest
        } = _ref4;
        if (!duration) {
          return;
        }
        const delta = {
          x: dragOverlay.rect.left - active.rect.left,
          y: dragOverlay.rect.top - active.rect.top
        };
        const scale = {
          scaleX: transform.scaleX !== 1 ? active.rect.width * transform.scaleX / dragOverlay.rect.width : 1,
          scaleY: transform.scaleY !== 1 ? active.rect.height * transform.scaleY / dragOverlay.rect.height : 1
        };
        const finalTransform = {
          x: transform.x - delta.x,
          y: transform.y - delta.y,
          ...scale
        };
        const animationKeyframes = keyframes({
          ...rest,
          active,
          dragOverlay,
          transform: {
            initial: transform,
            final: finalTransform
          }
        });
        const [firstKeyframe] = animationKeyframes;
        const lastKeyframe = animationKeyframes[animationKeyframes.length - 1];
        if (JSON.stringify(firstKeyframe) === JSON.stringify(lastKeyframe)) {
          return;
        }
        const cleanup = sideEffects == null ? void 0 : sideEffects({
          active,
          dragOverlay,
          ...rest
        });
        const animation = dragOverlay.node.animate(animationKeyframes, {
          duration,
          easing,
          fill: "forwards"
        });
        return new Promise((resolve) => {
          animation.onfinish = () => {
            cleanup == null ? void 0 : cleanup();
            resolve();
          };
        });
      };
    }
    var key = 0;
    function useKey(id) {
      return (0, import_react3.useMemo)(() => {
        if (id == null) {
          return;
        }
        key++;
        return key;
      }, [id]);
    }
    var DragOverlay = /* @__PURE__ */ import_react3.default.memo((_ref) => {
      let {
        adjustScale: adjustScale2 = false,
        children,
        dropAnimation: dropAnimationConfig,
        style,
        transition,
        modifiers,
        wrapperElement = "div",
        className,
        zIndex = 999
      } = _ref;
      const {
        activatorEvent,
        active,
        activeNodeRect,
        containerNodeRect,
        draggableNodes,
        droppableContainers,
        dragOverlay,
        over,
        measuringConfiguration,
        scrollableAncestors,
        scrollableAncestorRects,
        windowRect
      } = useDndContext();
      const transform = (0, import_react3.useContext)(ActiveDraggableContext);
      const key2 = useKey(active == null ? void 0 : active.id);
      const modifiedTransform = applyModifiers(modifiers, {
        activatorEvent,
        active,
        activeNodeRect,
        containerNodeRect,
        draggingNodeRect: dragOverlay.rect,
        over,
        overlayNodeRect: dragOverlay.rect,
        scrollableAncestors,
        scrollableAncestorRects,
        transform,
        windowRect
      });
      const initialRect = useInitialValue(activeNodeRect);
      const dropAnimation = useDropAnimation({
        config: dropAnimationConfig,
        draggableNodes,
        droppableContainers,
        measuringConfiguration
      });
      const ref = initialRect ? dragOverlay.setRef : void 0;
      return import_react3.default.createElement(NullifiedContextProvider, null, import_react3.default.createElement(AnimationManager, {
        animation: dropAnimation
      }, active && key2 ? import_react3.default.createElement(PositionedOverlay, {
        key: key2,
        id: active.id,
        ref,
        as: wrapperElement,
        activatorEvent,
        adjustScale: adjustScale2,
        className,
        transition,
        rect: initialRect,
        style: {
          zIndex,
          ...style
        },
        transform: modifiedTransform
      }, children) : null));
    });

    // node_modules/@dnd-kit/sortable/dist/sortable.esm.js
    var import_react4 = __toESM(require("react"));
    function arrayMove(array, from, to) {
      const newArray = array.slice();
      newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
      return newArray;
    }
    function getSortedRects(items, rects) {
      return items.reduce((accumulator, id, index) => {
        const rect = rects.get(id);
        if (rect) {
          accumulator[index] = rect;
        }
        return accumulator;
      }, Array(items.length));
    }
    function isValidIndex(index) {
      return index !== null && index >= 0;
    }
    function itemsEqual(a, b) {
      if (a === b) {
        return true;
      }
      if (a.length !== b.length) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
    function normalizeDisabled(disabled) {
      if (typeof disabled === "boolean") {
        return {
          draggable: disabled,
          droppable: disabled
        };
      }
      return disabled;
    }
    var rectSortingStrategy = (_ref) => {
      let {
        rects,
        activeIndex,
        overIndex,
        index
      } = _ref;
      const newRects = arrayMove(rects, overIndex, activeIndex);
      const oldRect = rects[index];
      const newRect = newRects[index];
      if (!newRect || !oldRect) {
        return null;
      }
      return {
        x: newRect.left - oldRect.left,
        y: newRect.top - oldRect.top,
        scaleX: newRect.width / oldRect.width,
        scaleY: newRect.height / oldRect.height
      };
    };
    var ID_PREFIX2 = "Sortable";
    var Context = /* @__PURE__ */ import_react4.default.createContext({
      activeIndex: -1,
      containerId: ID_PREFIX2,
      disableTransforms: false,
      items: [],
      overIndex: -1,
      useDragOverlay: false,
      sortedRects: [],
      strategy: rectSortingStrategy,
      disabled: {
        draggable: false,
        droppable: false
      }
    });
    function SortableContext(_ref) {
      let {
        children,
        id,
        items: userDefinedItems,
        strategy = rectSortingStrategy,
        disabled: disabledProp = false
      } = _ref;
      const {
        active,
        dragOverlay,
        droppableRects,
        over,
        measureDroppableContainers
      } = useDndContext();
      const containerId = useUniqueId(ID_PREFIX2, id);
      const useDragOverlay = Boolean(dragOverlay.rect !== null);
      const items = (0, import_react4.useMemo)(() => userDefinedItems.map((item) => typeof item === "object" && "id" in item ? item.id : item), [userDefinedItems]);
      const isDragging = active != null;
      const activeIndex = active ? items.indexOf(active.id) : -1;
      const overIndex = over ? items.indexOf(over.id) : -1;
      const previousItemsRef = (0, import_react4.useRef)(items);
      const itemsHaveChanged = !itemsEqual(items, previousItemsRef.current);
      const disableTransforms = overIndex !== -1 && activeIndex === -1 || itemsHaveChanged;
      const disabled = normalizeDisabled(disabledProp);
      useIsomorphicLayoutEffect(() => {
        if (itemsHaveChanged && isDragging) {
          measureDroppableContainers(items);
        }
      }, [itemsHaveChanged, items, isDragging, measureDroppableContainers]);
      (0, import_react4.useEffect)(() => {
        previousItemsRef.current = items;
      }, [items]);
      const contextValue = (0, import_react4.useMemo)(
        () => ({
          activeIndex,
          containerId,
          disabled,
          disableTransforms,
          items,
          overIndex,
          useDragOverlay,
          sortedRects: getSortedRects(items, droppableRects),
          strategy
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activeIndex, containerId, disabled.draggable, disabled.droppable, disableTransforms, items, overIndex, droppableRects, useDragOverlay, strategy]
      );
      return import_react4.default.createElement(Context.Provider, {
        value: contextValue
      }, children);
    }
    var defaultNewIndexGetter = (_ref) => {
      let {
        id,
        items,
        activeIndex,
        overIndex
      } = _ref;
      return arrayMove(items, activeIndex, overIndex).indexOf(id);
    };
    var defaultAnimateLayoutChanges = (_ref2) => {
      let {
        containerId,
        isSorting,
        wasDragging,
        index,
        items,
        newIndex,
        previousItems,
        previousContainerId,
        transition
      } = _ref2;
      if (!transition || !wasDragging) {
        return false;
      }
      if (previousItems !== items && index === newIndex) {
        return false;
      }
      if (isSorting) {
        return true;
      }
      return newIndex !== index && containerId === previousContainerId;
    };
    var defaultTransition2 = {
      duration: 200,
      easing: "ease"
    };
    var transitionProperty = "transform";
    var disabledTransition = /* @__PURE__ */ CSS.Transition.toString({
      property: transitionProperty,
      duration: 0,
      easing: "linear"
    });
    var defaultAttributes = {
      roleDescription: "sortable"
    };
    function useDerivedTransform(_ref) {
      let {
        disabled,
        index,
        node,
        rect
      } = _ref;
      const [derivedTransform, setDerivedtransform] = (0, import_react4.useState)(null);
      const previousIndex = (0, import_react4.useRef)(index);
      useIsomorphicLayoutEffect(() => {
        if (!disabled && index !== previousIndex.current && node.current) {
          const initial = rect.current;
          if (initial) {
            const current = getClientRect(node.current, {
              ignoreTransform: true
            });
            const delta = {
              x: initial.left - current.left,
              y: initial.top - current.top,
              scaleX: initial.width / current.width,
              scaleY: initial.height / current.height
            };
            if (delta.x || delta.y) {
              setDerivedtransform(delta);
            }
          }
        }
        if (index !== previousIndex.current) {
          previousIndex.current = index;
        }
      }, [disabled, index, node, rect]);
      (0, import_react4.useEffect)(() => {
        if (derivedTransform) {
          setDerivedtransform(null);
        }
      }, [derivedTransform]);
      return derivedTransform;
    }
    function useSortable(_ref) {
      let {
        animateLayoutChanges = defaultAnimateLayoutChanges,
        attributes: userDefinedAttributes,
        disabled: localDisabled,
        data: customData,
        getNewIndex = defaultNewIndexGetter,
        id,
        strategy: localStrategy,
        resizeObserverConfig,
        transition = defaultTransition2
      } = _ref;
      const {
        items,
        containerId,
        activeIndex,
        disabled: globalDisabled,
        disableTransforms,
        sortedRects,
        overIndex,
        useDragOverlay,
        strategy: globalStrategy
      } = (0, import_react4.useContext)(Context);
      const disabled = normalizeLocalDisabled(localDisabled, globalDisabled);
      const index = items.indexOf(id);
      const data = (0, import_react4.useMemo)(() => ({
        sortable: {
          containerId,
          index,
          items
        },
        ...customData
      }), [containerId, customData, index, items]);
      const itemsAfterCurrentSortable = (0, import_react4.useMemo)(() => items.slice(items.indexOf(id)), [items, id]);
      const {
        rect,
        node,
        isOver,
        setNodeRef: setDroppableNodeRef
      } = useDroppable({
        id,
        data,
        disabled: disabled.droppable,
        resizeObserverConfig: {
          updateMeasurementsFor: itemsAfterCurrentSortable,
          ...resizeObserverConfig
        }
      });
      const {
        active,
        activatorEvent,
        activeNodeRect,
        attributes,
        setNodeRef: setDraggableNodeRef,
        listeners,
        isDragging,
        over,
        setActivatorNodeRef,
        transform
      } = useDraggable({
        id,
        data,
        attributes: {
          ...defaultAttributes,
          ...userDefinedAttributes
        },
        disabled: disabled.draggable
      });
      const setNodeRef = useCombinedRefs(setDroppableNodeRef, setDraggableNodeRef);
      const isSorting = Boolean(active);
      const displaceItem = isSorting && !disableTransforms && isValidIndex(activeIndex) && isValidIndex(overIndex);
      const shouldDisplaceDragSource = !useDragOverlay && isDragging;
      const dragSourceDisplacement = shouldDisplaceDragSource && displaceItem ? transform : null;
      const strategy = localStrategy != null ? localStrategy : globalStrategy;
      const finalTransform = displaceItem ? dragSourceDisplacement != null ? dragSourceDisplacement : strategy({
        rects: sortedRects,
        activeNodeRect,
        activeIndex,
        overIndex,
        index
      }) : null;
      const newIndex = isValidIndex(activeIndex) && isValidIndex(overIndex) ? getNewIndex({
        id,
        items,
        activeIndex,
        overIndex
      }) : index;
      const activeId = active == null ? void 0 : active.id;
      const previous = (0, import_react4.useRef)({
        activeId,
        items,
        newIndex,
        containerId
      });
      const itemsHaveChanged = items !== previous.current.items;
      const shouldAnimateLayoutChanges = animateLayoutChanges({
        active,
        containerId,
        isDragging,
        isSorting,
        id,
        index,
        items,
        newIndex: previous.current.newIndex,
        previousItems: previous.current.items,
        previousContainerId: previous.current.containerId,
        transition,
        wasDragging: previous.current.activeId != null
      });
      const derivedTransform = useDerivedTransform({
        disabled: !shouldAnimateLayoutChanges,
        index,
        node,
        rect
      });
      (0, import_react4.useEffect)(() => {
        if (isSorting && previous.current.newIndex !== newIndex) {
          previous.current.newIndex = newIndex;
        }
        if (containerId !== previous.current.containerId) {
          previous.current.containerId = containerId;
        }
        if (items !== previous.current.items) {
          previous.current.items = items;
        }
      }, [isSorting, newIndex, containerId, items]);
      (0, import_react4.useEffect)(() => {
        if (activeId === previous.current.activeId) {
          return;
        }
        if (activeId != null && previous.current.activeId == null) {
          previous.current.activeId = activeId;
          return;
        }
        const timeoutId = setTimeout(() => {
          previous.current.activeId = activeId;
        }, 50);
        return () => clearTimeout(timeoutId);
      }, [activeId]);
      return {
        active,
        activeIndex,
        attributes,
        data,
        rect,
        index,
        newIndex,
        items,
        isOver,
        isSorting,
        isDragging,
        listeners,
        node,
        overIndex,
        over,
        setNodeRef,
        setActivatorNodeRef,
        setDroppableNodeRef,
        setDraggableNodeRef,
        transform: derivedTransform != null ? derivedTransform : finalTransform,
        transition: getTransition()
      };
      function getTransition() {
        if (
          // Temporarily disable transitions for a single frame to set up derived transforms
          derivedTransform || // Or to prevent items jumping to back to their "new" position when items change
          itemsHaveChanged && previous.current.newIndex === index
        ) {
          return disabledTransition;
        }
        if (shouldDisplaceDragSource && !isKeyboardEvent(activatorEvent) || !transition) {
          return void 0;
        }
        if (isSorting || shouldAnimateLayoutChanges) {
          return CSS.Transition.toString({
            ...transition,
            property: transitionProperty
          });
        }
        return void 0;
      }
    }
    function normalizeLocalDisabled(localDisabled, globalDisabled) {
      var _localDisabled$dragga, _localDisabled$droppa;
      if (typeof localDisabled === "boolean") {
        return {
          draggable: localDisabled,
          // Backwards compatibility
          droppable: false
        };
      }
      return {
        draggable: (_localDisabled$dragga = localDisabled == null ? void 0 : localDisabled.draggable) != null ? _localDisabled$dragga : globalDisabled.draggable,
        droppable: (_localDisabled$droppa = localDisabled == null ? void 0 : localDisabled.droppable) != null ? _localDisabled$droppa : globalDisabled.droppable
      };
    }
    function hasSortableData(entry) {
      if (!entry) {
        return false;
      }
      const data = entry.data.current;
      if (data && "sortable" in data && typeof data.sortable === "object" && "containerId" in data.sortable && "items" in data.sortable && "index" in data.sortable) {
        return true;
      }
      return false;
    }
    var directions = [KeyboardCode.Down, KeyboardCode.Right, KeyboardCode.Up, KeyboardCode.Left];
    var sortableKeyboardCoordinates = (event, _ref) => {
      let {
        context: {
          active,
          collisionRect,
          droppableRects,
          droppableContainers,
          over,
          scrollableAncestors
        }
      } = _ref;
      if (directions.includes(event.code)) {
        event.preventDefault();
        if (!active || !collisionRect) {
          return;
        }
        const filteredContainers = [];
        droppableContainers.getEnabled().forEach((entry) => {
          if (!entry || entry != null && entry.disabled) {
            return;
          }
          const rect = droppableRects.get(entry.id);
          if (!rect) {
            return;
          }
          switch (event.code) {
            case KeyboardCode.Down:
              if (collisionRect.top < rect.top) {
                filteredContainers.push(entry);
              }
              break;
            case KeyboardCode.Up:
              if (collisionRect.top > rect.top) {
                filteredContainers.push(entry);
              }
              break;
            case KeyboardCode.Left:
              if (collisionRect.left > rect.left) {
                filteredContainers.push(entry);
              }
              break;
            case KeyboardCode.Right:
              if (collisionRect.left < rect.left) {
                filteredContainers.push(entry);
              }
              break;
          }
        });
        const collisions = closestCorners({
          active,
          collisionRect,
          droppableRects,
          droppableContainers: filteredContainers,
          pointerCoordinates: null
        });
        let closestId = getFirstCollision(collisions, "id");
        if (closestId === (over == null ? void 0 : over.id) && collisions.length > 1) {
          closestId = collisions[1].id;
        }
        if (closestId != null) {
          const activeDroppable = droppableContainers.get(active.id);
          const newDroppable = droppableContainers.get(closestId);
          const newRect = newDroppable ? droppableRects.get(newDroppable.id) : null;
          const newNode = newDroppable == null ? void 0 : newDroppable.node.current;
          if (newNode && newRect && activeDroppable && newDroppable) {
            const newScrollAncestors = getScrollableAncestors(newNode);
            const hasDifferentScrollAncestors = newScrollAncestors.some((element, index) => scrollableAncestors[index] !== element);
            const hasSameContainer = isSameContainer(activeDroppable, newDroppable);
            const isAfterActive = isAfter(activeDroppable, newDroppable);
            const offset = hasDifferentScrollAncestors || !hasSameContainer ? {
              x: 0,
              y: 0
            } : {
              x: isAfterActive ? collisionRect.width - newRect.width : 0,
              y: isAfterActive ? collisionRect.height - newRect.height : 0
            };
            const rectCoordinates = {
              x: newRect.left,
              y: newRect.top
            };
            const newCoordinates = offset.x && offset.y ? rectCoordinates : subtract(rectCoordinates, offset);
            return newCoordinates;
          }
        }
      }
      return void 0;
    };
    function isSameContainer(a, b) {
      if (!hasSortableData(a) || !hasSortableData(b)) {
        return false;
      }
      return a.data.current.sortable.containerId === b.data.current.sortable.containerId;
    }
    function isAfter(a, b) {
      if (!hasSortableData(a) || !hasSortableData(b)) {
        return false;
      }
      if (!isSameContainer(a, b)) {
        return false;
      }
      return a.data.current.sortable.index < b.data.current.sortable.index;
    }

    // node_modules/@dnd-kit/modifiers/dist/modifiers.esm.js
    var snapCenterToCursor = (_ref) => {
      let {
        activatorEvent,
        draggingNodeRect,
        transform
      } = _ref;
      if (draggingNodeRect && activatorEvent) {
        const activatorCoordinates = getEventCoordinates(activatorEvent);
        if (!activatorCoordinates) {
          return transform;
        }
        const offsetX = activatorCoordinates.x - draggingNodeRect.left;
        const offsetY = activatorCoordinates.y - draggingNodeRect.top;
        return {
          ...transform,
          x: transform.x + offsetX - draggingNodeRect.width / 2,
          y: transform.y + offsetY - draggingNodeRect.height / 2
        };
      }
      return transform;
    };

    // src/client/dnd.js
    var supported = typeof import_react5.default.version === "string" && typeof import_react5.default.createContext === "function" && typeof import_react5.default.useReducer === "function";
    function Passthrough(props) {
      return props.children === void 0 ? null : props.children;
    }
    function inertSortable() {
      return {
        setNodeRef: function() {
        },
        setActivatorNodeRef: function() {
        },
        attributes: {},
        listeners: {},
        isDragging: false
      };
    }
    var dnd = supported ? {
      supported: true,
      DndContext,
      DragOverlay,
      SortableContext,
      useSortable,
      useSensor,
      useSensors,
      MouseSensor,
      TouchSensor,
      KeyboardSensor,
      closestCenter,
      rectSortingStrategy,
      sortableKeyboardCoordinates,
      snapCenterToCursor
    } : {
      supported: false,
      DndContext: Passthrough,
      DragOverlay: function() {
        return null;
      },
      SortableContext: Passthrough,
      useSortable: inertSortable,
      useSensor: function() {
        return null;
      },
      useSensors: function() {
        return [];
      },
      MouseSensor: null,
      TouchSensor: null,
      KeyboardSensor: null,
      closestCenter: null,
      rectSortingStrategy: void 0,
      sortableKeyboardCoordinates: null,
      snapCenterToCursor: null
    };

    // src/client/main.js
    var h = import_react6.default.createElement;
    var FLIP_MS = 220;
    var FLIP_EASING = "cubic-bezier(.2,0,0,1)";
    var CLIENT_BUILD = "b2026-11-23-dnd";
    var STREAM_URL = "/open-desktop/stream";
    var CARD_STREAM_URL = "/open-desktop/card-stream";
    var API_URL = "/open-desktop/api";
    var POLL_MS = 1e4;
    var RECONNECT_MS = 15e3;
    var GRID = { columns: 12, rowHeight: 40, gap: 8 };
    var SIZE_MIN = 3;
    var SIZE_MAX = 12;
    var SIZE_PRESETS = {
      S: { w: 3, h: 4 },
      M: { w: 6, h: 4 },
      L: { w: 12, h: 6 }
    };
    var isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
    var asArray = (value) => Array.isArray(value) ? value : [];
    var asText = (value, fallback) => typeof value === "string" ? value : typeof value === "number" ? String(value) : fallback !== void 0 ? fallback : "";
    var asNumber = (value) => typeof value === "number" && Number.isFinite(value) ? value : null;
    var clampInt = (value, lo, hi, fallback) => Number.isFinite(value) ? Math.min(hi, Math.max(lo, Math.round(value))) : fallback;
    var normalizeSize = (raw, fallback) => {
      const base = fallback || SIZE_PRESETS.M;
      if (isObject(raw)) return { w: clampInt(Number(raw.w), SIZE_MIN, SIZE_MAX, base.w), h: clampInt(Number(raw.h), SIZE_MIN, SIZE_MAX, base.h) };
      if (typeof raw === "string" && SIZE_PRESETS[raw]) return { ...SIZE_PRESETS[raw] };
      return { ...base };
    };
    var fmtAge = (ms) => {
      if (ms === null || !Number.isFinite(ms)) return "\u2014";
      const sec = Math.max(0, Math.round(ms / 1e3));
      if (sec < 60) return sec + " \u79D2\u524D";
      const min = Math.round(sec / 60);
      if (min < 60) return min + " \u5206\u949F\u524D";
      const hour = Math.round(min / 60);
      if (hour < 24) return hour + " \u5C0F\u65F6\u524D";
      return Math.round(hour / 24) + " \u5929\u524D";
    };
    var fmtEvery = (ms) => {
      if (ms === null || !Number.isFinite(ms) || ms <= 0) return "\u2014";
      const sec = Math.max(1, Math.round(ms / 1e3));
      if (sec < 60) return sec + " \u79D2";
      const min = Math.round(sec / 60);
      if (min < 60) return min + " \u5206\u949F";
      const hour = Math.round(min / 60);
      if (hour < 24) return hour + " \u5C0F\u65F6";
      return Math.round(hour / 24) + " \u5929";
    };
    var fmtClock = (ts) => {
      if (!Number.isFinite(ts)) return "";
      try {
        return new Date(ts).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
      } catch {
        return "";
      }
    };
    function normalizeView(raw) {
      if (!isObject(raw)) return { html: "", css: "", js: "", missing: true };
      return {
        html: asText(raw.html),
        css: asText(raw.css),
        js: asText(raw.js),
        missing: raw.missing === true || asText(raw.html).trim() === ""
      };
    }
    function normalizeCard(raw) {
      if (!isObject(raw) || typeof raw.id !== "string" || raw.id === "") return null;
      const refresh = isObject(raw.refresh) ? raw.refresh : {};
      return {
        id: raw.id,
        sessionId: asText(raw.sessionId, raw.id),
        title: asText(raw.title, "\u672A\u547D\u540D\u5361\u7247"),
        template: "",
        size: normalizeSize(raw.size),
        view: normalizeView(raw.view),
        order: asNumber(raw.order) ?? 0,
        createdAt: asNumber(raw.createdAt) ?? 0,
        updatedAt: asNumber(raw.updatedAt) ?? 0,
        building: raw.building === true,
        refresh,
        dailyAt: typeof refresh.dailyAt === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(refresh.dailyAt) ? refresh.dailyAt : null,
        everyMs: asNumber(refresh.everyMs) ?? (typeof refresh.dailyAt === "string" ? 864e5 : null),
        // 兼容旧渲染器组件读取的字段
        values: {},
        params: isObject(refresh.params) ? refresh.params : {},
        capabilities: [],
        overflow: null,
        viewWarnings: asArray(raw.viewWarnings).map(function(item) {
          return asText(item);
        }).filter(function(item) {
          return item !== "";
        }).slice(0, 20)
      };
    }
    function normalizeState(raw) {
      if (!isObject(raw)) return null;
      const widgets = [];
      for (const item of asArray(raw.cards)) {
        const card = normalizeCard(item);
        if (card !== null) widgets.push(card);
      }
      widgets.sort((a, b) => a.order - b.order || a.createdAt - b.createdAt);
      const templates = [];
      for (const item of asArray(raw.templates)) {
        if (!isObject(item) || typeof item.id !== "string") continue;
        templates.push({
          id: item.id,
          title: asText(item.title, item.id),
          description: asText(item.description),
          fields: asArray(item.fields),
          defaultSize: { ...SIZE_PRESETS.M },
          defaultEveryMs: asNumber(item.defaultEveryMs) ?? 6e4
        });
      }
      return {
        serverNow: asNumber(raw.serverNow) ?? Date.now(),
        revision: 0,
        widgets,
        maxBuilding: asNumber(raw.maxBuilding) ?? 8,
        data: isObject(raw.data) ? raw.data : {},
        templates,
        design: {
          css: asText(raw.design && raw.design.css),
          js: asText(raw.design && raw.design.js)
        },
        prefs: { transcriptView: "standard" },
        chat: null,
        paused: raw.paused === true,
        openAt: asNumber(raw.openAt) ?? 0,
        chatOpenCardId: asText(raw.chatOpenCardId),
        openEditId: ""
      };
    }
    async function postApi(action, payload) {
      const response = await fetch(API_URL, {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, payload: payload ?? null })
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const body = await response.json();
      if (!body.ok) {
        const failure = new Error(body.error && body.error.message || "\u8BF7\u6C42\u5931\u8D25");
        failure.code = body.error && body.error.code;
        throw failure;
      }
      return body;
    }
    function reportClientError(kind, error, info) {
      try {
        void postApi("client-log", {
          kind,
          message: String(error && error.message ? error.message : error),
          stack: String(error && error.stack ? error.stack : "").slice(0, 4e3),
          componentStack: String(info && info.componentStack ? info.componentStack : "").slice(0, 3e3),
          where: String(typeof window !== "undefined" && window.__odErrorWhere || ""),
          build: CLIENT_BUILD
        }).catch(function() {
        });
      } catch (cause) {
      }
    }
    function createDeskStore(onOpen) {
      let snapshot = { state: null, conn: "connecting", focus: null };
      const listeners = [];
      const clock = { serverNow: null, at: 0 };
      let source = null;
      let pollTimer = null;
      let reconnectTimer = null;
      let watchdog = null;
      let lastStateAt = 0;
      let lastOpenAt = 0;
      let polling = false;
      let started = false;
      function publish(patch) {
        const next = { ...snapshot, ...patch };
        if (next.state === snapshot.state && next.conn === snapshot.conn && next.focus === snapshot.focus) return;
        snapshot = next;
        for (const listener of listeners) {
          try {
            listener(snapshot);
          } catch (error) {
          }
        }
      }
      function setConn(conn) {
        if (snapshot.conn !== conn) publish({ conn });
      }
      function requestOpen() {
        try {
          onOpen();
        } catch (error) {
        }
      }
      function applyState(raw) {
        const state = normalizeState(raw);
        if (state === null) return;
        clock.serverNow = state.serverNow;
        clock.at = Date.now();
        if (Number.isFinite(state.openAt) && state.openAt > lastOpenAt) {
          lastOpenAt = state.openAt;
          if (Math.abs(Date.now() - state.openAt) < 12e4) requestOpen();
        }
        publish({ state });
      }
      function projectNow() {
        if (clock.serverNow !== null && Number.isFinite(clock.serverNow)) return clock.serverNow + (Date.now() - clock.at);
        return Date.now();
      }
      function stopStream() {
        if (source === null) return;
        try {
          source.removeEventListener("state", handleState);
          source.removeEventListener("open", handleOpen);
          source.removeEventListener("error", handleError);
          source.close();
        } catch (error) {
        }
        source = null;
      }
      function stopPolling() {
        if (pollTimer !== null) window.clearInterval(pollTimer);
        pollTimer = null;
        polling = false;
      }
      function pollOnce() {
        postApi("state", {}).then(function(value) {
          if (!started) return;
          lastStateAt = Date.now();
          applyState(value.state ?? value.value);
          setConn("polling");
        }, function() {
          if (!started) return;
          setConn("offline");
        });
      }
      function startPolling() {
        if (!started || polling) return;
        polling = true;
        setConn("polling");
        pollOnce();
        pollTimer = window.setInterval(pollOnce, POLL_MS);
      }
      function scheduleReconnect() {
        if (!started || reconnectTimer !== null) return;
        reconnectTimer = window.setTimeout(function() {
          reconnectTimer = null;
          connect();
        }, RECONNECT_MS);
      }
      function handleState(event) {
        if (!started || !event) return;
        lastStateAt = Date.now();
        try {
          applyState(JSON.parse(event.data));
        } catch (error) {
        }
      }
      function handleOpen(event) {
        if (!started) return;
        if (event && typeof event.data === "string" && event.data !== "") {
          requestOpen();
          return;
        }
        if (polling) stopPolling();
        if (reconnectTimer !== null) {
          window.clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
        setConn("sse");
      }
      function handleError() {
        if (!started) return;
        stopStream();
        startPolling();
        scheduleReconnect();
      }
      function connect() {
        if (!started) return;
        if (typeof EventSource === "undefined") {
          startPolling();
          return;
        }
        try {
          source = new EventSource(STREAM_URL);
        } catch (error) {
          startPolling();
          scheduleReconnect();
          return;
        }
        source.addEventListener("state", handleState);
        source.addEventListener("open", handleOpen);
        source.addEventListener("error", handleError);
        lastStateAt = Date.now();
      }
      function start() {
        if (started) return;
        started = true;
        connect();
        pollOnce();
        if (watchdog !== null) window.clearInterval(watchdog);
        watchdog = window.setInterval(function() {
          if (!started || snapshot.conn !== "sse") return;
          if (Date.now() - lastStateAt < 6e4) return;
          stopStream();
          startPolling();
          scheduleReconnect();
        }, 15e3);
      }
      function stop() {
        started = false;
        stopStream();
        stopPolling();
        if (watchdog !== null) window.clearInterval(watchdog);
        watchdog = null;
        if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      function request(action, payload) {
        return postApi(action, payload).then(function(body) {
          if (isObject(body.state)) applyState(body.state);
          return body.value;
        });
      }
      return {
        getSnapshot: () => snapshot,
        focusCard: (id) => publish({ focus: { id } }),
        clearFocus: () => publish({ focus: null }),
        subscribe: function(listener) {
          listeners.push(listener);
          return function() {
            const index = listeners.indexOf(listener);
            if (index >= 0) listeners.splice(index, 1);
          };
        },
        projectNow,
        request,
        requestRaw: postApi,
        start,
        stop
      };
    }
    function StyleTag() {
      return h("style", { "data-plugin": "dsh-open-desktop", dangerouslySetInnerHTML: { __html: styles_default } });
    }
    function inlineNodes(text, prefix) {
      const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\*[^*\s][^*]*\*)/g;
      const nodes = [];
      let last = 0;
      let match;
      let index = 0;
      while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) nodes.push(text.slice(last, match.index));
        const token = match[0];
        const key2 = prefix + "i" + index;
        if (token.slice(0, 2) === "**") {
          nodes.push(h("strong", { key: key2 }, token.slice(2, -2)));
        } else if (token[0] === "`") {
          nodes.push(h("code", { key: key2, className: "od-code" }, token.slice(1, -1)));
        } else if (token[0] === "[") {
          const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
          if (link !== null) nodes.push(h("a", { key: key2, href: link[2], target: "_blank", rel: "noreferrer noopener" }, link[1]));
          else nodes.push(token);
        } else {
          nodes.push(h("em", { key: key2 }, token.slice(1, -1)));
        }
        last = match.index + token.length;
        index += 1;
      }
      if (last < text.length) nodes.push(text.slice(last));
      return nodes;
    }
    var MD_TABLE_SPLIT = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/;
    var splitRow = function(line) {
      const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
      return trimmed.split("|").map(function(cell) {
        return cell.trim();
      });
    };
    function parseMarkdown(text) {
      const lines = String(text ?? "").replace(/\r\n/g, "\n").split("\n");
      const blocks = [];
      let index = 0;
      while (index < lines.length) {
        const line = lines[index];
        if (line.trim() === "") {
          index += 1;
          continue;
        }
        const fence = line.match(/^\s*```(\w*)\s*$/);
        if (fence !== null) {
          const body2 = [];
          index += 1;
          while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) {
            body2.push(lines[index]);
            index += 1;
          }
          index += 1;
          blocks.push({ type: "code", lang: fence[1] || "", text: body2.join("\n") });
          continue;
        }
        if (line.indexOf("|") >= 0 && index + 1 < lines.length && MD_TABLE_SPLIT.test(lines[index + 1])) {
          const header = splitRow(line);
          index += 2;
          const rows = [];
          while (index < lines.length && lines[index].indexOf("|") >= 0 && lines[index].trim() !== "") {
            rows.push(splitRow(lines[index]));
            index += 1;
          }
          blocks.push({ type: "table", header, rows });
          continue;
        }
        const heading = line.match(/^(#{1,6})\s+(.*)$/);
        if (heading !== null) {
          blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
          index += 1;
          continue;
        }
        if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
          blocks.push({ type: "hr" });
          index += 1;
          continue;
        }
        if (/^\s*>\s?/.test(line)) {
          const body2 = [];
          while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
            body2.push(lines[index].replace(/^\s*>\s?/, ""));
            index += 1;
          }
          blocks.push({ type: "quote", text: body2.join("\n") });
          continue;
        }
        const ordered = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
        const unordered = line.match(/^\s*[-*]\s+(.*)$/);
        if (ordered !== null || unordered !== null) {
          const items = [];
          while (index < lines.length) {
            const nextOrdered = lines[index].match(/^\s*(\d+)[.)]\s+(.*)$/);
            const nextUnordered = lines[index].match(/^\s*[-*]\s+(.*)$/);
            if (nextOrdered !== null) {
              items.push({ text: nextOrdered[2] });
              index += 1;
              continue;
            }
            if (nextUnordered !== null) {
              items.push({ text: nextUnordered[1] });
              index += 1;
              continue;
            }
            break;
          }
          blocks.push({ type: ordered !== null ? "ol" : "ul", items });
          continue;
        }
        const body = [];
        while (index < lines.length && lines[index].trim() !== "" && lines[index].indexOf("|") < 0 && !/^\s*```/.test(lines[index]) && !/^#{1,6}\s/.test(lines[index]) && !/^\s*[-*]\s+/.test(lines[index]) && !/^\s*\d+[.)]\s+/.test(lines[index]) && !/^\s*>/.test(lines[index])) {
          body.push(lines[index]);
          index += 1;
        }
        if (body.length === 0) {
          index += 1;
          continue;
        }
        blocks.push({ type: "p", text: body.join("\n") });
      }
      return blocks;
    }
    function MarkdownTable(props) {
      const header = asArray(props.header);
      const rows = asArray(props.rows);
      return h(
        "div",
        { className: "od-md-table-wrap" },
        h(
          "table",
          { className: "od-md-table" },
          h("thead", null, h("tr", null, header.map(function(cell, index) {
            return h("th", { key: "h" + index }, inlineNodes(cell, "th" + index));
          }))),
          h("tbody", null, rows.map(function(row, rowIndex) {
            return h("tr", { key: "r" + rowIndex }, asArray(row).map(function(cell, cellIndex) {
              return h("td", { key: "c" + cellIndex }, inlineNodes(cell, "td" + rowIndex + "-" + cellIndex));
            }));
          }))
        )
      );
    }
    function RichText(props) {
      const blocks = parseMarkdown(props.text);
      return h("div", null, blocks.map(function(block, index) {
        const key2 = "b" + index;
        if (block.type === "code") return h("pre", { key: key2, className: "od-md-code" }, h("code", null, block.text));
        if (block.type === "table") return h(MarkdownTable, { key: key2, header: block.header, rows: block.rows });
        if (block.type === "heading") return h("div", { key: key2, className: "od-md-heading", "data-level": block.level }, inlineNodes(block.text, key2));
        if (block.type === "hr") return h("hr", { key: key2, className: "od-md-hr" });
        if (block.type === "quote") return h("blockquote", { key: key2, className: "od-md-quote" }, inlineNodes(block.text, key2));
        if (block.type === "ul" || block.type === "ol") {
          return h(block.type === "ol" ? "ol" : "ul", { key: key2, className: "od-md-list" }, block.items.map(function(item, itemIndex) {
            return h("li", { key: "li" + itemIndex }, inlineNodes(item.text, key2 + "-" + itemIndex));
          }));
        }
        return h("p", { key: key2, className: "od-line" }, inlineNodes(block.text, key2));
      }));
    }
    function tokensFor(theme) {
      const dark = theme === "dark";
      const fallback = {
        bg: dark ? "#0b0b10" : "#ffffff",
        fg: dark ? "#f2f2f7" : "#111827",
        "fg-2": dark ? "#a1a1aa" : "#6b7280",
        "fg-3": dark ? "#71717a" : "#8a8a93",
        line: dark ? "rgba(255,255,255,.08)" : "rgba(17,17,17,.08)",
        "line-strong": dark ? "rgba(255,255,255,.16)" : "rgba(17,17,17,.16)",
        "surface-2": dark ? "rgba(255,255,255,.05)" : "rgba(17,17,17,.05)",
        green: dark ? "#34d399" : "#16a34a",
        red: dark ? "#f87171" : "#dc2626",
        amber: dark ? "#fbbf24" : "#d97706",
        blue: dark ? "#60a5fa" : "#2563eb",
        radius: "8px",
        gap: "8px",
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-6": "24px",
        "space-8": "32px",
        "text-xs": "11px",
        "text-sm": "12px",
        "text-md": "13px",
        "text-lg": "14px",
        "text-metric": "20px",
        "text-hero": "34px",
        "r-control": "8px",
        "r-surface": "10px",
        "card-radius": "12px"
      };
      if (typeof document === "undefined") return fallback;
      const root = document.querySelector(".od-root");
      if (root === null) return fallback;
      try {
        const probe = document.createElement("div");
        probe.setAttribute("aria-hidden", "true");
        probe.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;pointer-events:none;";
        root.appendChild(probe);
        const read = function(cssVar) {
          probe.style.color = "var(" + cssVar + ")";
          return getComputedStyle(probe).color;
        };
        const bgProbe = document.createElement("div");
        bgProbe.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;background:var(--od-bg);border-top:1px solid var(--od-line)";
        root.appendChild(bgProbe);
        const bgStyle = getComputedStyle(bgProbe);
        const readVar = function(name) {
          return (getComputedStyle(root).getPropertyValue(name) || "").trim();
        };
        const tokens = {
          bg: bgStyle.backgroundColor || fallback.bg,
          fg: read("--od-fg") || fallback.fg,
          "fg-2": read("--od-fg-2") || fallback["fg-2"],
          "fg-3": read("--od-fg-3") || fallback["fg-3"],
          line: bgStyle.borderTopColor || fallback.line,
          "line-strong": read("--od-line-strong") || fallback["line-strong"],
          "surface-2": read("--od-surface-2") || fallback["surface-2"],
          green: read("--od-green") || fallback.green,
          red: read("--od-red") || fallback.red,
          amber: read("--od-amber") || fallback.amber,
          blue: read("--od-blue") || fallback.blue,
          radius: readVar("--od-radius") || fallback.radius,
          gap: readVar("--od-gap") || fallback.gap,
          "space-1": readVar("--od-space-1") || fallback["space-1"],
          "space-2": readVar("--od-space-2") || fallback["space-2"],
          "space-3": readVar("--od-space-3") || fallback["space-3"],
          "space-4": readVar("--od-space-4") || fallback["space-4"],
          "space-6": readVar("--od-space-6") || fallback["space-6"],
          "space-8": readVar("--od-space-8") || fallback["space-8"],
          "text-xs": readVar("--od-text-xs") || fallback["text-xs"],
          "text-sm": readVar("--od-text-sm") || fallback["text-sm"],
          "text-md": readVar("--od-text-md") || fallback["text-md"],
          "text-lg": readVar("--od-text-lg") || fallback["text-lg"],
          "text-metric": readVar("--od-text-metric") || fallback["text-metric"],
          "text-hero": readVar("--od-text-hero") || fallback["text-hero"],
          "r-control": readVar("--od-r-control") || fallback["r-control"],
          "r-surface": readVar("--od-r-surface") || fallback["r-surface"],
          "card-radius": readVar("--od-card-radius") || fallback["card-radius"]
        };
        probe.remove();
        bgProbe.remove();
        return tokens;
      } catch (error) {
        return fallback;
      }
    }
    function buildSrcDoc(view, tokens, design) {
      const css = String(view.css ?? "");
      const html = String(view.html ?? "");
      const js = String(view.js ?? "").replace(/<\/script/gi, "<\\/script");
      const designCss = String(design && design.css ? design.css : "");
      const designJs = String(design && design.js ? design.js : "").replace(/<\/script/gi, "<\\/script");
      const rootStyle = ":root{" + Object.keys(tokens).map(function(key2) {
        return "--od-" + key2 + ":" + tokens[key2] + ";";
      }).join("") + '}html,body{margin:0;padding:0;height:100%;background:var(--od-bg);color:var(--od-fg);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;line-height:1.45;overflow:hidden;color-scheme:' + (tokens.bg === "#0b0b10" ? "dark" : "light") + "}*{box-sizing:border-box}";
      const csp = "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'";
      const runtime = `(function(){
            function applyTokens(tokens){if(!tokens)return;var root=document.documentElement;for(var key in tokens){root.style.setProperty("--od-"+key,tokens[key])}}
            window.dshWidget={data:null,tokens:{},size:{w:0,h:0},save:function(value,options){parent.postMessage({__od:true,type:"save",value:value,options:options||null},"*")},fetch:function(url,init){var id="f"+Math.random().toString(36).slice(2);return new Promise(function(resolve,reject){function onMessage(event){var message=event.data||{};if(message.__od!==true||message.type!=="fetch-result"||message.id!==id)return;window.removeEventListener("message",onMessage);if(message.ok)resolve(message.value);else reject(new Error(message.error||"fetch failed"))}window.addEventListener("message",onMessage);parent.postMessage({__od:true,type:"fetch",id:id,url:String(url),init:init||null},"*")})}};
            function report(){try{var d=document.documentElement;var b=document.body;var sh=Math.max(d?d.scrollHeight:0,b?b.scrollHeight:0);var ch=window.innerHeight||(d?d.clientHeight:0);parent.postMessage({__od:true,type:"overflow",scrollHeight:sh,clientHeight:ch},"*")}catch(error){}}
            window.addEventListener("message",function(event){var message=event.data||{};if(message.__od!==true)return;if(message.type==="hello"){parent.postMessage({__od:true,type:"ready"},"*");return}if(message.type==="tokens"){window.dshWidget.tokens=message.tokens||{};applyTokens(message.tokens);return}if(message.type==="data"){if(message.tokens)applyTokens(message.tokens);if(message.size)window.dshWidget.size=message.size;window.dshWidget.data=message.value;if(typeof window.dshWidget.onData==="function")window.dshWidget.onData(message.value);report()}});
            document.addEventListener("click",function(event){var target=event.target;var link=target&&target.closest?target.closest("a[href]"):null;if(!link)return;var href=link.getAttribute("href")||"";if(!/^https?:\\/\\//i.test(href))return;event.preventDefault();parent.postMessage({__od:true,type:"open",url:href},"*")},true);
            window.addEventListener("load",function(){report();parent.postMessage({__od:true,type:"ready"},"*")});
          })();`;
      return '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="' + csp + '"><style>' + rootStyle + designCss + css + "</style></head><body>" + html + "<script>" + runtime + "<\/script><script>" + designJs + "<\/script><script>" + js + "<\/script></body></html>";
    }
    function CardView(props) {
      const frameRef = (0, import_react6.useRef)(null);
      const widget = props.widget;
      const theme = props.theme;
      const srcDoc = import_react6.default.useMemo(function() {
        return buildSrcDoc(widget.view, tokensFor(theme), props.design);
      }, [widget.view.html, widget.view.css, widget.view.js, theme, props.design && props.design.css, props.design && props.design.js]);
      const [phase, setPhase] = (0, import_react6.useState)("loading");
      const [attempt, setAttempt] = (0, import_react6.useState)(0);
      const readyRef = (0, import_react6.useRef)(false);
      (0, import_react6.useEffect)(function() {
        readyRef.current = false;
        let tries = 0;
        const timer = window.setInterval(function() {
          if (readyRef.current || tries >= 12) {
            window.clearInterval(timer);
            return;
          }
          tries += 1;
          const frame = frameRef.current;
          if (frame === null) return;
          try {
            frame.contentWindow.postMessage({ __od: true, type: "hello" }, "*");
          } catch (error) {
          }
        }, 400);
        return function() {
          window.clearInterval(timer);
        };
      }, [widget.id, attempt, srcDoc]);
      (0, import_react6.useEffect)(function() {
        readyRef.current = false;
        setPhase("loading");
        const timer = window.setTimeout(function() {
          if (readyRef.current) return;
          setPhase("failed");
          reportClientError("view-no-ready", new Error("\u5361\u7247\u89C6\u56FE 3 \u79D2\u5185\u672A\u5C31\u7EEA"), { componentStack: "widget=" + widget.id });
        }, 3e3);
        return function() {
          window.clearTimeout(timer);
        };
      }, [widget.id, attempt, srcDoc]);
      const lastReport = (0, import_react6.useRef)("");
      const [over, setOver] = (0, import_react6.useState)(null);
      (0, import_react6.useEffect)(function() {
        function onMessage(event) {
          const frame = frameRef.current;
          if (frame === null || event.source !== frame.contentWindow) return;
          const message = event.data;
          if (!isObject(message) || message.__od !== true) return;
          if (message.type === "ready") {
            readyRef.current = true;
            setPhase("ready");
            try {
              frame.contentWindow.postMessage({
                __od: true,
                type: "data",
                value: props.dp && props.dp.value !== void 0 ? props.dp.value : null,
                tokens: tokensFor(theme),
                size: widget.size
              }, "*");
            } catch (error) {
            }
            return;
          }
          if (message.type === "overflow") {
            const scrollHeight = Number(message.scrollHeight) || 0;
            const clientHeight = Number(message.clientHeight) || 0;
            const tooBig = clientHeight > 0 && scrollHeight > clientHeight + 1;
            setOver(tooBig ? { scrollHeight, clientHeight } : null);
            const key2 = scrollHeight + ":" + clientHeight;
            if (lastReport.current === key2) return;
            lastReport.current = key2;
            props.onOverflow({ scrollHeight, clientHeight });
            return;
          }
          if (message.type === "open") {
            const url = String(message.url ?? "");
            if (/^https?:\/\//i.test(url)) window.open(url, "_blank", "noopener,noreferrer");
            return;
          }
          if (message.type === "grow") {
            if (typeof props.onGrow === "function") props.onGrow(widget);
            return;
          }
          if (message.type === "save") {
            if (typeof props.onSave === "function") props.onSave(message.value, message.options || null);
            return;
          }
          if (message.type === "fetch") {
            props.onFetch({ id: message.id, url: message.url, init: message.init }).then(function(value) {
              try {
                frame.contentWindow.postMessage({ __od: true, type: "fetch-result", id: message.id, ok: true, value }, "*");
              } catch (error) {
              }
            }, function(failure) {
              try {
                frame.contentWindow.postMessage({ __od: true, type: "fetch-result", id: message.id, ok: false, error: String(failure && failure.message ? failure.message : failure) }, "*");
              } catch (error) {
              }
            });
          }
        }
        window.addEventListener("message", onMessage);
        return function() {
          window.removeEventListener("message", onMessage);
        };
      }, [widget.id, widget.size.w, widget.size.h, theme, props.dp && props.dp.fetchedAt]);
      (0, import_react6.useEffect)(function() {
        const frame = frameRef.current;
        if (frame === null) return;
        try {
          frame.contentWindow.postMessage({
            __od: true,
            type: "data",
            value: props.dp && props.dp.value !== void 0 ? props.dp.value : null,
            tokens: tokensFor(theme),
            size: widget.size
          }, "*");
        } catch (error) {
        }
      }, [props.dp && props.dp.fetchedAt, widget.size.w, widget.size.h]);
      const suggested = over === null ? null : suggestSize(widget);
      return h(
        "div",
        { className: "od-iframe-wrap" },
        h("iframe", {
          key: "frame-" + attempt,
          ref: frameRef,
          className: "od-iframe",
          sandbox: "allow-scripts",
          srcDoc,
          title: widget.title
        }),
        phase === "failed" && h(
          "div",
          { className: "od-mask", role: "alert" },
          h(
            "div",
            { className: "od-mask-card" },
            h("div", { className: "od-mask-title" }, "\u5361\u7247\u89C6\u56FE\u6CA1\u52A0\u8F7D\u51FA\u6765"),
            h("div", { className: "od-mask-sub" }, "\u53EF\u80FD\u662F\u811A\u672C\u62A5\u9519\u6216\u52A0\u8F7D\u8D85\u65F6\u3002"),
            h("button", {
              type: "button",
              className: "od-btn od-btn-sm od-btn-primary",
              onClick: function() {
                setAttempt(function(n) {
                  return n + 1;
                });
              }
            }, "\u91CD\u8BD5")
          )
        ),
        over !== null && h(
          "div",
          { className: "od-mask", role: "status" },
          h(
            "div",
            { className: "od-mask-card" },
            h("div", { className: "od-mask-title" }, "\u5185\u5BB9\u653E\u4E0D\u4E0B"),
            h("div", { className: "od-mask-sub" }, "\u8FD9\u4E2A\u6E32\u67D3\u5668\u6BD4\u5F53\u524D\u5361\u7247\u5927\uFF0C\u88AB\u88C1\u5207\u7684\u90E8\u5206\u5148\u85CF\u8D77\u6765\u4E86\u3002"),
            suggested !== null && h("button", {
              type: "button",
              className: "od-btn od-btn-sm od-btn-primary",
              onClick: function() {
                if (typeof props.onGrow === "function") props.onGrow(widget);
              }
            }, "\u653E\u5927\u5230 " + suggested.w + "\xD7" + suggested.h)
          )
        )
      );
    }
    function suggestSize(widget) {
      const overflow = isObject(widget.overflow) ? widget.overflow : {};
      const scrollHeight = asNumber(overflow.scrollHeight) ?? 0;
      const clientHeight = asNumber(overflow.clientHeight) ?? 0;
      const extra = Math.max(0, scrollHeight - clientHeight);
      const rows = Math.ceil(extra / 48);
      return {
        w: widget.size.w,
        h: clampInt(widget.size.h + rows, SIZE_MIN, SIZE_MAX, widget.size.h)
      };
    }
    function hasRefreshSpec(widget) {
      const spec = isObject(widget?.refresh) ? widget.refresh : {};
      return ["template", "command", "file", "url"].some(function(key2) {
        return typeof spec[key2] === "string" && spec[key2].trim() !== "";
      });
    }
    function cardState(dp, now, hasRefresh) {
      if (hasRefresh === false) return "static";
      if (!isObject(dp)) return "loading";
      const fetchedAt = asNumber(dp.fetchedAt);
      const error = isObject(dp.error) ? dp.error : null;
      if (error !== null && dp.value === null) return "broken";
      if (fetchedAt !== null && Number.isFinite(dp.ttl) && now - fetchedAt > dp.ttl) return "stale";
      return "ok";
    }
    function LoadingView() {
      return h(
        "div",
        { className: "od-renderer" },
        h("div", { className: "od-skel", style: { width: "45%", height: 10 } }),
        h("div", { className: "od-skel", style: { width: "70%", height: 26, marginTop: 6 } }),
        h("div", { className: "od-skel", style: { width: "88%", marginTop: 8 } })
      );
    }
    function BrokenView(props) {
      const error = props.dp && isObject(props.dp.error) ? props.dp.error : {};
      return h(
        "div",
        { className: "od-renderer od-broken" },
        h("div", { className: "od-broken-msg" }, asText(error.message, "\u53D6\u6570\u5931\u8D25")),
        props.lastOkAt !== null && h("div", { className: "od-hint" }, "\u4E0A\u6B21\u6210\u529F " + fmtClock(props.lastOkAt)),
        h("button", { type: "button", className: "od-btn od-btn-sm", disabled: props.busy, onClick: props.onRetry }, "\u91CD\u8BD5")
      );
    }
    function CardMenu(props) {
      const [open, setOpen] = (0, import_react6.useState)(false);
      const anchorRef = (0, import_react6.useRef)(null);
      (0, import_react6.useEffect)(function() {
        if (!open) return;
        function onDown(event) {
          if (anchorRef.current && !anchorRef.current.contains(event.target)) setOpen(false);
        }
        document.addEventListener("mousedown", onDown);
        return function() {
          document.removeEventListener("mousedown", onDown);
        };
      }, [open]);
      function choose(handler) {
        setOpen(false);
        handler();
      }
      return h(
        "div",
        { className: "od-menu-anchor", ref: anchorRef },
        h("button", { type: "button", className: "od-icon-btn", "aria-label": "\u5361\u7247\u83DC\u5355", onClick: function() {
          setOpen(!open);
        } }, "\u22EF"),
        open && h(
          "div",
          { className: "od-menu", role: "menu" },
          h("button", { type: "button", className: "od-menu-item", onClick: function() {
            choose(props.onEdit);
          } }, "\u5C5E\u6027\u2026"),
          h("button", { type: "button", className: "od-menu-item", disabled: props.busy, onClick: function() {
            choose(props.onRefresh);
          } }, "\u7ACB\u5373\u5237\u65B0"),
          h("div", { className: "od-menu-sep" }),
          h("button", { type: "button", className: "od-menu-item", "data-danger": "true", onClick: function() {
            choose(props.onRemove);
          } }, "\u5220\u9664")
        )
      );
    }
    var CardBoundary = class extends import_react6.default.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }
      static getDerivedStateFromError(error) {
        return { error };
      }
      componentDidCatch(error, info) {
        reportClientError("card-crash", error, info);
      }
      render() {
        if (this.state.error !== null) {
          return h(
            "section",
            { className: "od-card", style: this.props.style },
            h("div", { className: "od-card-head" }, h("span", { className: "od-card-title" }, this.props.title)),
            h(
              "div",
              { className: "od-renderer od-broken" },
              h("div", { className: "od-broken-msg" }, "\u8FD9\u5F20\u5361\u6E32\u67D3\u5931\u8D25\uFF1A" + String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error))
            )
          );
        }
        return this.props.children;
      }
    };
    function MissingView(props) {
      return h(
        "div",
        { className: "od-renderer od-broken" },
        h("div", { className: "od-broken-msg" }, "\u8FD9\u5F20\u5361\u7247\u7684 view/ \u91CC\u8FD8\u6CA1\u6709\u524D\u7AEF\u4EE3\u7801\u3002"),
        h("div", { className: "od-hint" }, "\u6253\u5F00\u5361\u7247\u4F1A\u8BDD\uFF0C\u8BA9 Agent \u751F\u6210\u6216\u4FEE\u590D view/index.html\u3002")
      );
    }
    function CardContent(props) {
      const widget = props.widget;
      const dp = props.dp;
      const state = widget.building === true ? "loading" : cardState(dp, props.now, hasRefreshSpec(widget));
      if (widget.building === true) return h(
        "div",
        { className: "od-renderer" },
        h("div", { className: "od-metric-label" }, "\u5361\u7247\u6B63\u5728\u6784\u5EFA\u2026"),
        h("div", { className: "od-skel", style: { width: "60%", height: 22, marginTop: 8 } }),
        h("div", { className: "od-skel", style: { width: "90%", marginTop: 10 } }),
        h("div", { className: "od-skel", style: { width: "75%", marginTop: 8 } })
      );
      if (state === "loading") return h(LoadingView, null);
      if (state === "broken") return h(BrokenView, { dp, lastOkAt: props.lastOkAt, busy: props.busy, onRetry: function() {
        props.onRefresh(widget.id);
      } });
      if (widget.view.html.trim() === "") return h(MissingView, { widget });
      return h(CardView, {
        widget,
        dp,
        theme: props.theme,
        design: props.design,
        onOverflow: function(report) {
          props.onOverflow?.(widget.id, report);
        },
        onFetch: function(request) {
          return props.onFetch(widget.id, request);
        },
        onGrow: function(item) {
          props.onGrow?.(item);
        },
        onSave: function(value, options) {
          props.onSave?.(widget.id, value, options);
        }
      });
    }
    function WidgetCard(props) {
      const widget = props.widget;
      const dp = props.dp;
      const state = widget.building === true ? "loading" : cardState(dp, props.now, hasRefreshSpec(widget));
      const fetchedAt = isObject(dp) ? asNumber(dp.fetchedAt) : null;
      const age = fetchedAt !== null && fetchedAt > 0 ? props.now - fetchedAt : null;
      const everyMs = widget.everyMs;
      const dotParts = [widget.building === true ? "\u6784\u5EFA\u4E2D\u2026" : state === "static" ? "\u9759\u6001\u5361\u7247" : state === "loading" ? "\u53D6\u6570\u4E2D\u2026" : state === "broken" ? "\u53D6\u6570\u5931\u8D25" : state === "stale" ? "\u6570\u636E\u9648\u65E7" : "\u6570\u636E\u6B63\u5E38"];
      if (state === "static") {
        dotParts.push("\u4E0D\u81EA\u52A8\u5237\u65B0");
      } else {
        if (state === "ok" && fetchedAt !== null && fetchedAt > 0) dotParts.push(fmtAge(age) + "\u66F4\u65B0");
        else if ((state === "stale" || state === "broken") && fetchedAt !== null && fetchedAt > 0) dotParts.push("\u6700\u8FD1\u6210\u529F " + fmtAge(age));
        if (widget.dailyAt !== null) dotParts.push("\u6BCF\u5929 " + widget.dailyAt + " \u66F4\u65B0");
        else if (everyMs !== null) {
          const every2 = fmtEvery(everyMs);
          dotParts.push(every2 === "1 \u5929" ? "\u6BCF\u5929\u66F4\u65B0" : every2 === "1 \u5C0F\u65F6" ? "\u6BCF\u5C0F\u65F6\u66F4\u65B0" : "\u6BCF " + every2 + "\u66F4\u65B0");
        }
      }
      const dotTitle = dotParts.join(" \xB7 ");
      const [dragging, setDragging] = (0, import_react6.useState)(null);
      const resizeRef = (0, import_react6.useRef)(null);
      function computeResize(event, state2) {
        const cellW = props.cellWidth > 0 ? props.cellWidth : 64;
        return {
          w: clampInt(state2.startW + Math.round((event.clientX - state2.startX) / cellW), SIZE_MIN, SIZE_MAX, state2.startW),
          h: clampInt(state2.startH + Math.round((event.clientY - state2.startY) / GRID.rowHeight), SIZE_MIN, SIZE_MAX, state2.startH)
        };
      }
      function onResizeDown(event) {
        if (event.button !== void 0 && event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        const handle = event.currentTarget;
        try {
          handle.setPointerCapture(event.pointerId);
        } catch (error) {
        }
        resizeRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          startW: widget.size.w,
          startH: widget.size.h
        };
        setDragging({ w: widget.size.w, h: widget.size.h });
      }
      function onResizeMove(event) {
        const state2 = resizeRef.current;
        if (state2 === null || state2.pointerId !== event.pointerId) return;
        setDragging(computeResize(event, state2));
      }
      function finishResize(event) {
        const state2 = resizeRef.current;
        if (state2 === null || event !== void 0 && state2.pointerId !== event.pointerId) return;
        resizeRef.current = null;
        const next = event === void 0 ? { w: state2.startW, h: state2.startH } : computeResize(event, state2);
        setDragging(null);
        if (next.w !== state2.startW || next.h !== state2.startH) props.onResize(widget.id, next);
      }
      function onResizeUp(event) {
        finishResize(event);
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch (error) {
        }
      }
      function onResizeCancel() {
        finishResize(void 0);
      }
      (0, import_react6.useEffect)(function() {
        function clear() {
          if (resizeRef.current !== null) finishResize(void 0);
        }
        window.addEventListener("blur", clear);
        return function() {
          window.removeEventListener("blur", clear);
        };
      }, []);
      const size = dragging !== null ? dragging : widget.size;
      const span = props.spanOf(size);
      const content = h(CardContent, { ...props, size });
      const sortable = dnd.useSortable({ id: widget.id });
      const cardStyle = props.dragStyle !== null && props.dragStyle !== void 0 ? props.dragStyle : { gridColumn: "span " + span.w, gridRow: "span " + size.h };
      return h(
        CardBoundary,
        { style: cardStyle, title: widget.title },
        h(
          "section",
          {
            className: "od-card" + (props.dropTarget ? " od-drop-target" : ""),
            style: cardStyle,
            ref: sortable.setNodeRef,
            "data-state": state,
            "data-widget-id": widget.id,
            tabIndex: -1,
            "data-drag": props.dragging ? "true" : "false",
            "aria-label": widget.title
          },
          h(
            "div",
            { className: "od-card-head" },
            state === "static" ? h("span", {
              className: "od-state-dot",
              "data-state": state,
              title: dotTitle,
              "aria-label": dotTitle
            }) : h("button", {
              type: "button",
              className: "od-state-dot",
              "data-state": state,
              title: dotTitle,
              "aria-label": dotTitle + "\uFF08\u70B9\u51FB\u5237\u65B0\uFF09",
              onClick: function() {
                props.onRefresh(widget.id);
              }
            }),
            h(
              "div",
              {
                className: "od-card-grip",
                ref: sortable.setActivatorNodeRef,
                title: "\u6309\u4F4F\u62D6\u52A8\u6392\u5E8F",
                ...sortable.attributes,
                ...sortable.listeners
              },
              h("span", { className: "od-card-title", title: widget.title }, widget.title),
              widget.building === true && h("span", { className: "od-badge" }, "\u6784\u5EFA\u4E2D"),
              widget.viewWarnings.length > 0 && h("span", {
                className: "od-badge",
                title: widget.viewWarnings.join("\uFF1B")
              }, "\u98CE\u683C\u504F\u5DEE")
            ),
            widget.overflow !== null && widget.overflow !== void 0 && h("button", {
              type: "button",
              className: "od-suggest",
              title: "\u5185\u5BB9\u653E\u4E0D\u4E0B \xB7 \u5EFA\u8BAE " + suggestSize(widget).w + "\xD7" + suggestSize(widget).h + "\uFF0C\u70B9\u51FB\u653E\u5927",
              onClick: function() {
                props.onGrow(widget);
              }
            }, "\u653E\u4E0D\u4E0B"),
            h(
              "div",
              { className: "od-card-actions" },
              h(
                "button",
                {
                  type: "button",
                  className: "od-icon-btn",
                  title: "\u4FEE\u6539\u8FD9\u5F20\u5361",
                  "aria-label": "\u4FEE\u6539\u8FD9\u5F20\u5361",
                  onClick: function() {
                    props.onModify(widget);
                  }
                },
                h(
                  "svg",
                  {
                    width: 15,
                    height: 15,
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: 1.7,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    "aria-hidden": "true"
                  },
                  h("path", { d: "M12 20h9" }),
                  h("path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" })
                )
              ),
              h(CardMenu, {
                busy: props.busy,
                onEdit: function() {
                  props.onEdit(widget);
                },
                onRefresh: function() {
                  props.onRefresh(widget.id);
                },
                onRemove: function() {
                  props.onRemove(widget);
                }
              })
            )
          ),
          h("div", { className: "od-body-slot" }, content),
          h("div", {
            className: "od-resize",
            title: "\u62D6\u52A8\u8C03\u6574\u5C3A\u5BF8",
            onPointerDown: onResizeDown,
            onPointerMove: onResizeMove,
            onPointerUp: onResizeUp,
            onPointerCancel: onResizeCancel
          })
        )
      );
    }
    function WidgetGrid(props) {
      const ref = (0, import_react6.useRef)(null);
      const [layout, setLayout] = (0, import_react6.useState)({ cols: 12, width: 0 });
      (0, import_react6.useEffect)(function() {
        const element = ref.current;
        if (element === null) return;
        const measure = function() {
          const width = element.getBoundingClientRect().width;
          const cols2 = width < 560 ? 6 : width < 840 ? 8 : 12;
          setLayout({ cols: cols2, width });
        };
        measure();
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return function() {
          observer.disconnect();
        };
      }, []);
      const cols = layout.cols;
      const cellWidth = cols > 0 ? (layout.width - GRID.gap * (cols - 1)) / cols : 64;
      const spanOf = function(size) {
        if (cols >= GRID.columns) return { w: size.w, h: size.h };
        return { w: Math.max(2, Math.round(size.w * cols / GRID.columns)), h: size.h };
      };
      const widgets = props.widgets;
      const ids2 = widgets.map(function(widget) {
        return widget.id;
      });
      const idsKey = ids2.join("\0");
      const [drag, setDrag] = (0, import_react6.useState)(null);
      const dragRef = (0, import_react6.useRef)(null);
      const [slot, setSlot] = (0, import_react6.useState)(0);
      const slotRef = (0, import_react6.useRef)(0);
      const [pending, setPending] = (0, import_react6.useState)(null);
      const flipAnims = (0, import_react6.useRef)(/* @__PURE__ */ new WeakMap());
      function setSlotIndex(next) {
        if (slotRef.current === next) return;
        slotRef.current = next;
        setSlot(next);
      }
      (0, import_react6.useEffect)(function() {
        if (pending === null) return;
        const same = pending.join("\0") === idsKey;
        if (same) setPending(null);
      }, [idsKey, pending === null]);
      function stopDragging() {
        dragRef.current = null;
        setDrag(null);
        const root = ref.current !== null ? ref.current.closest(".od-root") : null;
        if (root !== null) root.classList.remove("od-dragging");
        document.body.style.userSelect = "";
      }
      function nodeOf(id) {
        const grid2 = ref.current;
        if (grid2 === null || typeof grid2.querySelectorAll !== "function") return null;
        return Array.from(grid2.querySelectorAll("[data-widget-id]")).find(function(node) {
          return node.getAttribute("data-widget-id") === id;
        }) ?? null;
      }
      function computeSlot(x, y, activeId) {
        const activeIndex = ids2.indexOf(activeId);
        const othersIds = ids2.filter(function(id) {
          return id !== activeId;
        });
        const hit = typeof document.elementFromPoint === "function" ? document.elementFromPoint(x, y) : null;
        const card = hit !== null && hit !== void 0 && typeof hit.closest === "function" ? hit.closest("[data-widget-id]") : null;
        const targetId = card === null ? null : card.getAttribute("data-widget-id");
        if (targetId !== null && targetId !== activeId) {
          const base = othersIds.indexOf(targetId);
          if (base >= 0) return base + (ids2.indexOf(targetId) > activeIndex ? 1 : 0);
        }
        const grid2 = ref.current;
        if (grid2 === null || typeof grid2.querySelectorAll !== "function") return slotRef.current;
        const nodes = Array.from(grid2.querySelectorAll("[data-widget-id]")).filter(function(node) {
          return node.getAttribute("data-widget-id") !== activeId;
        });
        let count = 0;
        for (const node of nodes) {
          const box = node.getBoundingClientRect();
          const sameRow = y >= box.top - 2 && y <= box.bottom + 2;
          const past = sameRow ? x > box.left + box.width / 2 : y > box.top + box.height / 2;
          if (past) count += 1;
        }
        return count;
      }
      function pointerOf(event) {
        const activator = event.activatorEvent;
        if (!activator) return null;
        let x = typeof activator.clientX === "number" ? activator.clientX : null;
        let y = typeof activator.clientY === "number" ? activator.clientY : null;
        if (x === null && activator.touches && activator.touches[0]) {
          x = activator.touches[0].clientX;
          y = activator.touches[0].clientY;
        }
        const delta = event.delta ?? { x: 0, y: 0 };
        if (x !== null && y !== null) return { x: x + delta.x, y: y + delta.y };
        const translated = event.active && event.active.rect && event.active.rect.current ? event.active.rect.current.translated : null;
        if (translated) return { x: translated.left + translated.width / 2, y: translated.top + translated.height / 2 };
        return null;
      }
      function onDragStart(event) {
        const id = String(event.active.id);
        const node = nodeOf(id);
        const box = node === null ? null : node.getBoundingClientRect();
        const index = ids2.indexOf(id);
        const next = {
          id,
          index,
          rect: box === null ? null : { left: box.left, top: box.top, width: box.width, height: box.height }
        };
        dragRef.current = next;
        setDrag(next);
        setSlotIndex(index);
        const root = ref.current !== null ? ref.current.closest(".od-root") : null;
        if (root !== null) root.classList.add("od-dragging");
        document.body.style.userSelect = "none";
      }
      function onDragMove(event) {
        const state = dragRef.current;
        if (state === null) return;
        const pointer = pointerOf(event);
        if (pointer !== null) {
          setSlotIndex(computeSlot(pointer.x, pointer.y, state.id));
          return;
        }
        if (event.over === null || event.over === void 0) return;
        const overId = String(event.over.id);
        if (overId === state.id) return;
        const index = ids2.filter(function(id) {
          return id !== state.id;
        }).indexOf(overId);
        if (index >= 0) setSlotIndex(index);
      }
      function onDragEnd() {
        const state = dragRef.current;
        const index = slotRef.current;
        stopDragging();
        if (state === null) return;
        if (index === state.index) return;
        const others2 = widgets.filter(function(widget) {
          return widget.id !== state.id;
        }).map(function(widget) {
          return widget.id;
        });
        others2.splice(Math.max(0, Math.min(others2.length, index)), 0, state.id);
        setPending(others2);
        let pendingRequest = null;
        try {
          pendingRequest = props.onMove(state.id, index);
        } catch (error) {
          setPending(null);
          return;
        }
        if (pendingRequest && typeof pendingRequest.catch === "function") {
          pendingRequest.catch(function() {
            setPending(null);
          });
        }
        window.setTimeout(function() {
          setPending(null);
        }, 6e3);
      }
      function onDragCancel() {
        stopDragging();
      }
      (0, import_react6.useLayoutEffect)(function() {
        const grid2 = ref.current;
        if (grid2 === null || typeof grid2.querySelectorAll !== "function") return;
        const nodes = Array.from(grid2.querySelectorAll("[data-widget-id]"));
        const activeId = dragRef.current === null ? null : dragRef.current.id;
        const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const visual = nodes.map(function(node) {
          return node.getBoundingClientRect();
        });
        for (const node of nodes) {
          const running = flipAnims.current.get(node);
          if (running !== void 0) running.cancel();
        }
        if (reduce) return;
        for (let index = 0; index < nodes.length; index += 1) {
          const node = nodes[index];
          if (node.getAttribute("data-widget-id") === activeId) continue;
          const after = node.getBoundingClientRect();
          const dx = visual[index].left - after.left;
          const dy = visual[index].top - after.top;
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
          if (typeof node.animate !== "function") continue;
          flipAnims.current.set(node, node.animate(
            [{ transform: "translate3d(" + dx + "px," + dy + "px,0)" }, { transform: "none" }],
            { duration: FLIP_MS, easing: FLIP_EASING }
          ));
        }
      });
      const sensors = dnd.useSensors(
        dnd.useSensor(dnd.MouseSensor, { activationConstraint: { distance: 6 } }),
        dnd.useSensor(dnd.TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
        dnd.useSensor(dnd.KeyboardSensor, { coordinateGetter: dnd.sortableKeyboardCoordinates })
      );
      const byId = new Map(widgets.map(function(widget) {
        return [widget.id, widget];
      }));
      const display = pending === null ? widgets : pending.map(function(id) {
        return byId.get(id);
      }).filter(Boolean);
      const activeWidget = drag === null ? null : byId.get(drag.id) ?? null;
      const activeSpan = activeWidget === null ? null : spanOf(activeWidget.size);
      const overlayStyle = activeWidget === null || activeSpan === null ? null : {
        width: Math.min(320, activeSpan.w * cellWidth + (activeSpan.w - 1) * GRID.gap) + "px"
      };
      const others = drag === null ? display : display.filter(function(widget) {
        return widget.id !== drag.id;
      });
      const slotIndex = Math.max(0, Math.min(others.length, slot));
      const dragStyle = drag === null || drag.rect === null ? null : {
        position: "fixed",
        left: drag.rect.left + "px",
        top: drag.rect.top + "px",
        width: drag.rect.width + "px",
        height: drag.rect.height + "px",
        margin: "0",
        zIndex: 0,
        visibility: "hidden",
        pointerEvents: "none"
      };
      function renderCard(widget, fixed) {
        const report = props.overflowMap ? props.overflowMap[widget.id] : null;
        const merged = report && report.scrollHeight > report.clientHeight ? Object.assign({}, widget, { overflow: report }) : widget;
        return h(WidgetCard, {
          key: widget.id,
          widget: merged,
          dp: props.data[widget.id],
          now: props.now,
          theme: props.theme,
          design: props.design,
          busy: props.busy,
          cellWidth,
          spanOf,
          onEdit: props.onEdit,
          onModify: props.onModify,
          onRefresh: props.onRefresh,
          onRemove: props.onRemove,
          onResize: props.onResize,
          onGrow: props.onGrow,
          onOverflow: props.onOverflow,
          onFetch: props.onFetch,
          onSave: props.onSave,
          dragging: drag !== null && drag.id === widget.id,
          dragStyle: fixed ? dragStyle : null
        });
      }
      const children = [];
      others.slice(0, slotIndex).forEach(function(widget) {
        children.push(renderCard(widget, false));
      });
      if (drag !== null && activeSpan !== null) {
        children.push(h(
          "div",
          {
            key: "__od-slot",
            className: "od-drop-slot",
            style: { gridColumn: "span " + activeSpan.w, gridRow: "span " + activeSpan.h },
            "aria-hidden": "true"
          },
          h("div", { className: "od-drop-slot-inner" }, activeSpan.w + "\xD7" + activeSpan.h)
        ));
      }
      others.slice(slotIndex).forEach(function(widget) {
        children.push(renderCard(widget, false));
      });
      if (activeWidget !== null) children.push(renderCard(activeWidget, true));
      const grid = h(
        "div",
        { className: "od-grid", ref },
        h(dnd.SortableContext, { items: ids2, strategy: dnd.rectSortingStrategy }, children)
      );
      if (!dnd.supported) return grid;
      return h(
        dnd.DndContext,
        {
          sensors,
          collisionDetection: dnd.closestCenter,
          onDragStart,
          onDragMove,
          onDragEnd,
          onDragCancel,
          accessibility: {
            screenReaderInstructions: {
              draggable: "\u6309\u7A7A\u683C\u952E\u62FF\u8D77\u5361\u7247\uFF0C\u7528\u65B9\u5411\u952E\u79FB\u52A8\uFF0C\u518D\u6309\u7A7A\u683C\u952E\u653E\u4E0B\uFF1B\u6309 Escape \u53D6\u6D88\u3002"
            }
          }
        },
        grid,
        activeWidget === null ? null : h(
          dnd.DragOverlay,
          {
            modifiers: [dnd.snapCenterToCursor],
            dropAnimation: null,
            className: "od-drag-layer",
            style: { pointerEvents: "none" }
          },
          h(
            "div",
            { className: "od-drag-overlay", style: overlayStyle },
            h(
              "div",
              { className: "od-drag-overlay-top" },
              h("span", { className: "od-drag-overlay-title" }, activeWidget.title),
              h("span", { className: "od-drag-overlay-size" }, activeWidget.size.w + "\xD7" + activeWidget.size.h)
            ),
            h("div", { className: "od-drag-overlay-hint" }, "\u677E\u5F00\u653E\u5230\u8FD9\u91CC")
          )
        )
      );
    }
    var SYSTEM_PROMPT_MARK = "\u3010\u5361\u7247\u4EFB\u52A1\u3011";
    var USER_ASK_MARK = "\u7528\u6237\u9700\u6C42\uFF1A";
    var TOOL_GROUP_LIMIT = 6;
    function splitPrompt(text) {
      const raw = asText(text);
      if (!raw.startsWith(SYSTEM_PROMPT_MARK)) return { system: "", ask: raw };
      const at = raw.indexOf(USER_ASK_MARK);
      if (at < 0) return { system: raw, ask: "" };
      return {
        system: raw.slice(0, at + USER_ASK_MARK.length).trim(),
        ask: raw.slice(at + USER_ASK_MARK.length).trim()
      };
    }
    function fmtDuration(ms) {
      if (!Number.isFinite(ms) || ms < 0) return "";
      if (ms < 1e3) return Math.round(ms) + "ms";
      if (ms < 6e4) return (ms / 1e3).toFixed(ms < 1e4 ? 1 : 0) + "s";
      return Math.round(ms / 6e4) + "m";
    }
    function groupTools(tools) {
      const groups = [];
      const index = /* @__PURE__ */ new Map();
      for (const tool of asArray(tools)) {
        const verb = asText(tool.verb, "\u64CD\u4F5C") || "\u64CD\u4F5C";
        const detail = asText(tool.argsSummary);
        const key2 = verb + "\0" + detail;
        let group = index.get(key2);
        if (group === void 0) {
          group = { key: key2, verb, detail, count: 0, status: "ok", result: "", durationMs: 0 };
          index.set(key2, group);
          groups.push(group);
        }
        group.count += 1;
        if (tool.status === "error") group.status = "error";
        else if (tool.status === "running" && group.status !== "error") group.status = "running";
        if (group.result === "" && asText(tool.resultSummary) !== "") group.result = asText(tool.resultSummary);
        if (Number.isFinite(tool.durationMs)) group.durationMs += tool.durationMs;
      }
      return groups;
    }
    function groupDigest(groups) {
      const counts = /* @__PURE__ */ new Map();
      for (const group of groups) counts.set(group.verb, (counts.get(group.verb) ?? 0) + group.count);
      return [...counts.entries()].map(function(entry) {
        return entry[0] + " \xD7" + entry[1];
      });
    }
    function SystemNote(props) {
      const [open, setOpen] = (0, import_react6.useState)(false);
      const count = props.count;
      return h(
        "div",
        { className: "od-sysnote" },
        h(
          "button",
          {
            type: "button",
            className: "od-sysnote-chip",
            "aria-expanded": open,
            title: "\u8FD9\u5F20\u5361\u7684\u7CFB\u7EDF\u6307\u4EE4\uFF0C\u9ED8\u8BA4\u6536\u8D77",
            onClick: function() {
              setOpen(!open);
            }
          },
          h("span", { className: "od-sysnote-dot" }),
          h("span", { className: "od-sysnote-label" }, "\u5361\u7247\u4EFB\u52A1"),
          count > 0 && h("span", { className: "od-sysnote-count" }, count + " \u4E2A\u52A8\u4F5C"),
          h("span", { className: "od-sysnote-hint" }, open ? "\u6536\u8D77\u6307\u4EE4" : "\u67E5\u770B\u6307\u4EE4")
        ),
        asText(props.ask) !== "" && h("div", { className: "od-user" }, asText(props.ask)),
        open && h("pre", { className: "od-sysnote-body" }, asText(props.text))
      );
    }
    function ToolGroupRow(props) {
      const [open, setOpen] = (0, import_react6.useState)(false);
      const group = props.group;
      const meta = [];
      if (group.count > 1) meta.push("\xD7" + group.count);
      const duration = fmtDuration(group.durationMs);
      if (duration !== "") meta.push(duration);
      return h(
        "div",
        null,
        h(
          "button",
          {
            type: "button",
            className: "od-tool",
            "data-status": group.status,
            title: group.detail || group.result || group.verb,
            onClick: function() {
              setOpen(!open);
            }
          },
          h("span", { className: "od-tool-name" }, group.verb),
          h("span", { className: "od-tool-detail" }, group.detail || (group.status === "running" ? "\u8FDB\u884C\u4E2D\u2026" : "")),
          meta.length > 0 && h("span", { className: "od-tool-meta" }, meta.join(" \xB7 "))
        ),
        open && group.result !== "" && h("div", { className: "od-tool-expand" }, group.result)
      );
    }
    function WorkDetails(props) {
      const mode = props.mode;
      const tools = asArray(props.tools);
      const running = props.ended === null || props.ended === void 0;
      const [open, setOpen] = (0, import_react6.useState)(mode === "detailed");
      const [showAll, setShowAll] = (0, import_react6.useState)(false);
      (0, import_react6.useEffect)(function() {
        if (mode === "detailed" && !running) setOpen(true);
      }, [running, mode]);
      if (tools.length === 0) return null;
      if (mode === "compact" && !running) return null;
      const groups = groupTools(tools);
      const digest = groupDigest(groups);
      const errors = groups.reduce(function(sum, group) {
        return sum + (group.status === "error" ? group.count : 0);
      }, 0);
      const state = errors > 0 ? "error" : running ? "running" : "ok";
      const visible = showAll ? groups : groups.slice(0, TOOL_GROUP_LIMIT);
      const last = tools[tools.length - 1];
      const duration = fmtDuration(props.durationMs);
      return h(
        "div",
        { className: "od-details" },
        h(
          "button",
          {
            type: "button",
            className: "od-details-head",
            "aria-expanded": open,
            onClick: function() {
              setOpen(!open);
            }
          },
          h("span", { className: "od-details-dot", "data-status": state }),
          h("span", { className: "od-details-count" }, (mode === "compact" ? "\u5904\u7406\u4E2D \xB7 " : "\u5DE5\u4F5C\u8BE6\u60C5 \xB7 ") + tools.length + " \u4E2A\u52A8\u4F5C"),
          digest.length > 0 && h("span", { className: "od-details-digest" }, digest.join(" \xB7 ")),
          errors > 0 && h("span", { className: "od-details-bad" }, errors + " \u4E2A\u5931\u8D25"),
          duration !== "" && h("span", { className: "od-details-time" }, duration),
          h("span", { className: "od-hint" }, open ? "\u6536\u8D77" : "\u5C55\u5F00")
        ),
        !open && running && last !== void 0 && h(
          "div",
          { className: "od-details-live" },
          "\u6B63\u5728 " + asText(last.verb, "\u6267\u884C") + (asText(last.argsSummary) !== "" ? " \xB7 " + asText(last.argsSummary) : "") + "\u2026"
        ),
        open && h(
          "div",
          { className: "od-tool-list" },
          visible.map(function(group) {
            return h(ToolGroupRow, { key: group.key, group });
          }),
          groups.length > visible.length && h("button", {
            type: "button",
            className: "od-more",
            onClick: function() {
              setShowAll(true);
            }
          }, "\u8FD8\u6709 " + (groups.length - visible.length) + " \u7C7B\u52A8\u4F5C")
        )
      );
    }
    function TurnBlock(props) {
      const turn = props.turn;
      const mode = props.mode;
      const stream = props.stream;
      const steps = asArray(turn.steps);
      const allTools = [];
      for (const step of steps) {
        for (const tool of asArray(step.tools)) allTools.push(tool);
      }
      const prompt = splitPrompt(turn.user && turn.user.text);
      const liveText = stream !== null ? asText(stream.text) : "";
      const liveStep = stream !== null && asNumber(stream.step) !== null && asNumber(stream.step) > 0 ? asNumber(stream.step) : null;
      let livePlaced = false;
      return h(
        "div",
        { className: "od-turn" },
        prompt.system !== "" ? h(SystemNote, { text: prompt.system, ask: prompt.ask, count: allTools.length }) : prompt.ask !== "" && h("div", { className: "od-user" }, prompt.ask),
        steps.map(function(step, index) {
          const stepText = asText(step.assistant.text);
          const matches = liveStep === null ? index === steps.length - 1 : step.step === liveStep;
          const streamHere = liveText !== "" && matches;
          if (streamHere) livePlaced = true;
          const showHere = streamHere && !stepText.endsWith(liveText);
          if (stepText === "" && !showHere) return null;
          return h(
            "div",
            { key: "step" + step.step, className: "od-step" },
            stepText !== "" && h("div", { className: "od-assistant" }, h(RichText, { text: stepText })),
            showHere && h("div", { className: "od-assistant" }, h("span", { className: "od-stream" }, liveText))
          );
        }),
        !livePlaced && liveText !== "" && h("div", { className: "od-assistant" }, h("span", { className: "od-stream" }, liveText)),
        h(WorkDetails, { mode, tools: allTools, ended: turn.ended, durationMs: turn.durationMs }),
        turn.ended === "aborted" && h("div", { className: "od-aborted" }, "\u5DF2\u4E2D\u6B62")
      );
    }
    function SizePicker(props) {
      const size = props.size;
      return h(
        "div",
        { className: "od-field" },
        h("span", { className: "od-field-label" }, "\u5C3A\u5BF8\uFF0812 \u5217\u7F51\u683C\uFF09"),
        h(
          "div",
          { className: "od-sizes" },
          Object.keys(SIZE_PRESETS).map(function(key2) {
            const preset = SIZE_PRESETS[key2];
            const on = preset.w === size.w && preset.h === size.h;
            return h(
              "button",
              {
                key: key2,
                type: "button",
                className: "od-size-btn",
                "data-on": on ? "true" : "false",
                disabled: props.busy,
                onClick: function() {
                  props.onChange({ ...preset });
                }
              },
              h("span", null, key2 + "\uFF08" + preset.w + "\xD7" + preset.h + "\uFF09")
            );
          }),
          h(
            "label",
            { className: "od-size-btn", style: { flexDirection: "row", alignItems: "center", gap: "4px" } },
            "W",
            h("input", {
              className: "od-input",
              type: "number",
              min: SIZE_MIN,
              max: SIZE_MAX,
              value: size.w,
              style: { width: "52px", padding: "2px 6px" },
              disabled: props.busy,
              onChange: function(event) {
                props.onChange({ w: clampInt(Number(event.target.value), SIZE_MIN, SIZE_MAX, size.w), h: size.h });
              }
            })
          ),
          h(
            "label",
            { className: "od-size-btn", style: { flexDirection: "row", alignItems: "center", gap: "4px" } },
            "H",
            h("input", {
              className: "od-input",
              type: "number",
              min: SIZE_MIN,
              max: SIZE_MAX,
              value: size.h,
              style: { width: "52px", padding: "2px 6px" },
              disabled: props.busy,
              onChange: function(event) {
                props.onChange({ w: size.w, h: clampInt(Number(event.target.value), SIZE_MIN, SIZE_MAX, size.h) });
              }
            })
          )
        )
      );
    }
    function Modal(props) {
      (0, import_react6.useEffect)(function() {
        function onKey(event) {
          if (event.key === "Escape") props.onClose();
        }
        document.addEventListener("keydown", onKey);
        return function() {
          document.removeEventListener("keydown", onKey);
        };
      }, [props.onClose]);
      return h(
        "div",
        { className: "od-overlay", onMouseDown: function(event) {
          if (event.target === event.currentTarget) props.onClose();
        } },
        h(
          "div",
          { className: "od-modal", role: "dialog", "aria-modal": "true" },
          h(
            "div",
            { className: "od-modal-head" },
            h("h2", { className: "od-modal-title" }, props.title),
            h("span", { className: "od-spacer" }),
            h("button", { type: "button", className: "od-icon-btn", "aria-label": "\u5173\u95ED", onClick: props.onClose }, "\u2715")
          ),
          h("div", { className: "od-modal-body" }, props.children),
          props.footer && h("div", { className: "od-modal-foot" }, props.footer)
        )
      );
    }
    function ConfirmModal(props) {
      return h(Modal, { title: props.title, onClose: props.onClose, footer: [
        h("span", { key: "sp", className: "od-spacer" }),
        h("button", { key: "c", type: "button", className: "od-btn od-btn-ghost", onClick: props.onClose }, "\u53D6\u6D88"),
        h("button", { key: "ok", type: "button", className: "od-btn od-btn-primary", onClick: props.onConfirm }, "\u786E\u5B9A")
      ] }, h("div", { className: "od-hint", style: { fontSize: "12.5px" } }, props.message));
    }
    function TopBar(props) {
      return h(
        "header",
        { className: "od-top" },
        h(
          "div",
          { className: "od-top-main" },
          h("h1", { className: "od-title", title: props.name + " \xB7 " + CLIENT_BUILD }, props.name),
          h("span", { className: "od-meta" }, props.count === null ? "\u52A0\u8F7D\u4E2D\u2026" : props.count + " \u5F20\u5361\u7247")
        ),
        h(
          "div",
          { className: "od-top-right" },
          h(
            "button",
            {
              type: "button",
              className: "od-icon-btn",
              title: props.paused ? "\u6062\u590D\u5237\u65B0" : "\u6682\u505C\u5237\u65B0",
              "aria-label": props.paused ? "\u6062\u590D\u5237\u65B0" : "\u6682\u505C\u5237\u65B0",
              disabled: props.busy,
              onClick: props.onTogglePause
            },
            props.paused ? h("svg", { width: 15, height: 15, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, h("path", { d: "M8 5v14l11-7z" })) : h(
              "svg",
              { width: 15, height: 15, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" },
              h("rect", { x: 7, y: 5, width: 3.5, height: 14, rx: 1 }),
              h("rect", { x: 13.5, y: 5, width: 3.5, height: 14, rx: 1 })
            )
          ),
          h(
            "button",
            {
              type: "button",
              className: "od-icon-btn",
              title: "\u5237\u65B0\u5168\u90E8",
              "aria-label": "\u5237\u65B0\u5168\u90E8",
              disabled: props.busy || props.count === null,
              onClick: props.onRefresh
            },
            h(
              "svg",
              {
                width: 15,
                height: 15,
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: 1.7,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                "aria-hidden": "true"
              },
              h("path", { d: "M21 12a9 9 0 1 1-2.64-6.36" }),
              h("path", { d: "M21 3v6h-6" })
            )
          ),
          h(
            "button",
            {
              type: "button",
              className: "od-icon-btn od-icon-btn-raised",
              title: "\u65B0\u5EFA\u5361\u7247",
              "aria-label": "\u65B0\u5EFA\u5361\u7247",
              onClick: props.onAdd
            },
            h("svg", {
              width: 15,
              height: 15,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 1.9,
              strokeLinecap: "round",
              "aria-hidden": "true"
            }, h("path", { d: "M12 5v14M5 12h14" }))
          )
        )
      );
    }
    var every = (ms) => ({ kind: "every", ms });
    var daily = (at) => ({ kind: "daily", at });
    var SCENE_CATEGORIES = [
      { id: "today", title: "\u4ECA\u5929", blurb: "\u51FA\u95E8\u524D\u5148\u770B\u4E00\u773C" },
      { id: "work", title: "\u5DE5\u4F5C", blurb: "\u6D3B\u513F\u5E72\u5230\u54EA\u4E86" },
      { id: "money", title: "\u94B1", blurb: "\u6C47\u7387\u3001\u884C\u60C5\u3001\u4F59\u989D" },
      { id: "info", title: "\u4FE1\u606F", blurb: "\u5916\u9762\u53D1\u751F\u4E86\u4EC0\u4E48" },
      { id: "life", title: "\u751F\u6D3B", blurb: "\u5BB6\u91CC\u90A3\u4E9B\u5C0F\u4E8B" },
      { id: "assets", title: "\u6570\u5B57\u8D44\u4EA7", blurb: "\u522B\u7B49\u8FC7\u671F\u624D\u53D1\u73B0" }
    ];
    var SCENES = [
      // 今天
      {
        id: "weather",
        category: "today",
        title: "\u5929\u6C14 \xB7 \u4ECA\u5929\u7A7F\u4EC0\u4E48",
        size: { w: 4, h: 7 },
        schedule: every(36e5),
        blurb: "\u964D\u6C34\u3001\u4F53\u611F\u3001\u7D2B\u5916\u7EBF\uFF0C\u987A\u624B\u544A\u8BC9\u4F60\u5E26\u4E0D\u5E26\u4F1E",
        prompt: "\u505A\u4E00\u4E2A\u5929\u6C14\u5361\u7247\uFF1A\u9ED8\u8BA4\u4E0A\u6D77\uFF08\u628A\u4E0A\u6D77\u6362\u6210\u4F60\u7684\u57CE\u5E02\uFF09\u3002\u663E\u793A\u5F53\u524D\u6E29\u5EA6\u3001\u4F53\u611F\u6E29\u5EA6\u3001\u5929\u6C14\u72B6\u51B5\u3001\u4ECA\u5929\u6700\u9AD8\u6700\u4F4E\u548C\u672A\u6765\u4E09\u5929\u9884\u62A5\uFF0C\u518D\u7ED9\u4E00\u53E5\u300C\u4ECA\u5929\u8981\u4E0D\u8981\u5E26\u4F1E\u300D\u7684\u5224\u65AD\uFF08\u964D\u6C34\u6982\u7387\u8FBE\u5230 40% \u5C31\u63D0\u9192\u5E26\u4F1E\uFF09\u3002\u7528 Open-Meteo \u7684\u514D\u8D39\u63A5\u53E3\uFF0C\u4E0D\u9700\u8981 API key\u3002\u53D6\u6570\u5931\u8D25\u65F6\u663E\u793A\u4E0A\u6B21\u6210\u529F\u7684\u6570\u636E\u5E76\u6807\u6CE8\u6570\u636E\u9648\u65E7\u3002"
      },
      {
        id: "air",
        category: "today",
        title: "\u7A7A\u6C14\u8D28\u91CF",
        size: { w: 4, h: 6 },
        schedule: every(36e5),
        blurb: "AQI\u3001PM2.5\uFF0C\u8D85\u8FC7 100 \u5C31\u6807\u9EC4",
        prompt: "\u505A\u4E00\u4E2A\u7A7A\u6C14\u8D28\u91CF\u5361\u7247\uFF1A\u9ED8\u8BA4\u4E0A\u6D77\u3002\u663E\u793A\u5B9E\u65F6 AQI\u3001PM2.5\u3001PM10 \u548C\u4ECA\u5929\u7684\u7A7A\u6C14\u8D28\u91CF\u7B49\u7EA7\uFF1BAQI \u8D85\u8FC7 100 \u6807\u9EC4\uFF0C\u8D85\u8FC7 150 \u6807\u7EA2\u3002\u7528 Open-Meteo \u7684 air-quality-api.open-meteo.com \u514D\u8D39\u63A5\u53E3\uFF0C\u4E0D\u9700\u8981 key\u3002"
      },
      {
        id: "sun",
        category: "today",
        title: "\u65E5\u51FA\u65E5\u843D",
        size: { w: 4, h: 5 },
        schedule: every(216e5),
        blurb: "\u4ECA\u5929\u51E0\u70B9\u5929\u4EAE\u3001\u51E0\u70B9\u5929\u9ED1",
        prompt: "\u505A\u4E00\u4E2A\u65E5\u51FA\u65E5\u843D\u5361\u7247\uFF1A\u9ED8\u8BA4\u4E0A\u6D77\u3002\u663E\u793A\u4ECA\u5929\u7684\u65E5\u51FA\u3001\u65E5\u843D\u3001\u767D\u663C\u65F6\u957F\uFF0C\u4EE5\u53CA\u300C\u79BB\u65E5\u843D\u8FD8\u6709\u591A\u4E45\u300D\u3002\u7528 sunrise-sunset.org \u7684\u514D\u8D39 JSON \u63A5\u53E3\uFF0C\u6216\u8005\u7528\u672C\u5730\u7ECF\u7EAC\u5EA6\u76F4\u63A5\u7B97\uFF0C\u4E0D\u9700\u8981 key\u3002"
      },
      {
        id: "umbrella",
        category: "today",
        title: "\u672A\u6765 7 \u5929\u5E26\u4F1E",
        size: { w: 5, h: 6 },
        schedule: every(36e5),
        blurb: "\u54EA\u51E0\u5929\u8981\u5E26\u4F1E\uFF0C\u4E00\u773C\u626B\u5B8C",
        prompt: "\u505A\u4E00\u4E2A\u300C\u672A\u6765 7 \u5929\u5E26\u4F1E\u65E5\u5386\u300D\u5361\u7247\uFF1A\u9ED8\u8BA4\u4E0A\u6D77\u3002\u5217\u51FA\u672A\u6765 7 \u5929\u6BCF\u5929\u7684\u6700\u9AD8\u6E29\u3001\u6700\u4F4E\u6E29\u548C\u964D\u6C34\u6982\u7387\uFF0C\u964D\u6C34\u6982\u7387\u8FBE\u5230 40% \u7684\u90A3\u5929\u6807\u51FA\u6765\u5E76\u5199\u300C\u5E26\u4F1E\u300D\u3002\u7528 Open-Meteo \u514D\u8D39\u63A5\u53E3\u3002\u6574\u5F20\u5361\u8981\u80FD\u4E00\u773C\u626B\u5B8C\uFF0C\u4E0D\u8981\u505A\u6210\u5BC6\u96C6\u8868\u683C\u3002"
      },
      {
        id: "clock",
        category: "today",
        title: "\u4E16\u754C\u65F6\u949F",
        size: { w: 6, h: 5 },
        schedule: every(6e4),
        blurb: "\u4E0A\u6D77\u3001\u4E1C\u4EAC\u3001\u7EBD\u7EA6\u3001\u4F26\u6566\uFF0C\u8C01\u5728\u767D\u5929",
        prompt: "\u505A\u4E00\u4E2A\u4E16\u754C\u65F6\u949F\u5361\u7247\uFF1A\u663E\u793A\u4E0A\u6D77\u3001\u4E1C\u4EAC\u3001\u7EBD\u7EA6\u3001\u4F26\u6566\u7684\u5F53\u524D\u65F6\u95F4\u548C\u65E5\u671F\uFF0C\u5E76\u6807\u51FA\u54EA\u4E9B\u57CE\u5E02\u662F\u767D\u5929\u3001\u54EA\u4E9B\u662F\u591C\u665A\u3002\u7EAF\u672C\u5730\u8BA1\u7B97\uFF0C\u4E0D\u9700\u8981\u7F51\u7EDC\u3002\u9ED8\u8BA4\u8FD9\u56DB\u4E2A\u57CE\u5E02\uFF0C\u7528\u6237\u53EF\u4EE5\u5728 prompt \u91CC\u6539\u3002"
      },
      // 工作
      {
        id: "health",
        category: "work",
        title: "\u670D\u52A1\u5065\u5EB7",
        size: { w: 5, h: 6 },
        schedule: every(3e4),
        blurb: "\u54EA\u4E9B\u5730\u5740\u6302\u4E86\u3001\u6162\u5728\u54EA",
        prompt: "\u505A\u4E00\u4E2A\u670D\u52A1\u5065\u5EB7\u5361\u7247\uFF1A\u9ED8\u8BA4\u68C0\u67E5 https://example.com \u548C http://127.0.0.1:5434\uFF08\u628A\u5730\u5740\u6362\u6210\u4F60\u81EA\u5DF1\u7684\uFF09\u3002\u663E\u793A\u6BCF\u4E2A\u5730\u5740\u662F\u5426\u53EF\u8BBF\u95EE\u3001HTTP \u72B6\u6001\u7801\u3001\u54CD\u5E94\u8017\u65F6\uFF1B\u67D0\u4E2A\u5730\u5740\u8FDE\u4E0D\u4E0A\u53EA\u628A\u90A3\u4E00\u884C\u6807\u7EA2\uFF0C\u5176\u5B83\u884C\u7167\u5E38\u663E\u793A\uFF0C\u4E0D\u8981\u6574\u5F20\u5361\u62A5\u9519\u3002\u7528\u547D\u4EE4\u884C curl\uFF0C\u5355\u4E2A\u8BF7\u6C42\u8D85\u65F6 5 \u79D2\u3002"
      },
      {
        id: "system",
        category: "work",
        title: "\u672C\u673A\u8D44\u6E90",
        size: { w: 4, h: 7 },
        schedule: every(3e4),
        blurb: "CPU\u3001\u5185\u5B58\u3001\u78C1\u76D8\u3001\u7535\u6C60",
        prompt: "\u505A\u4E00\u4E2A\u672C\u673A\u72B6\u6001\u5361\u7247\uFF08macOS\uFF09\uFF1ACPU \u5360\u7528\u3001\u5185\u5B58\u4F7F\u7528\u3001\u78C1\u76D8\u5269\u4F59\u3001\u7535\u6C60\u7535\u91CF\u548C\u662F\u5426\u5728\u5145\u7535\u3002\u7528 vm_stat\u3001df\u3001pmset \u8FD9\u4E9B\u672C\u673A\u547D\u4EE4\uFF0C\u4E0D\u9700\u8981\u4EFB\u4F55\u5916\u90E8\u63A5\u53E3\u3002\u78C1\u76D8\u5269\u4F59\u4F4E\u4E8E 10% \u6216\u7535\u91CF\u4F4E\u4E8E 20% \u65F6\u6807\u7EA2\u3002"
      },
      {
        id: "docker",
        category: "work",
        title: "Docker \u5BB9\u5668",
        size: { w: 5, h: 7 },
        schedule: every(3e4),
        blurb: "\u54EA\u4E9B\u5BB9\u5668\u5728\u8DD1\u3001\u5065\u5EB7\u4E0D\u5065\u5EB7",
        prompt: "\u505A\u4E00\u4E2A Docker \u5361\u7247\uFF1A\u663E\u793A\u672C\u673A\u6B63\u5728\u8FD0\u884C\u7684\u5BB9\u5668\u540D\u79F0\u3001\u955C\u50CF\u3001\u72B6\u6001\u3001\u7AEF\u53E3\u6620\u5C04\u548C\u5DF2\u8FD0\u884C\u65F6\u957F\u3002\u7528 docker ps\u3002\u6709\u5BB9\u5668\u9000\u51FA\u6216 unhealthy \u65F6\u6807\u7EA2\u3002\u5982\u679C Docker \u6CA1\u5728\u8FD0\u884C\uFF0C\u660E\u786E\u5199\u300CDocker \u672A\u8FD0\u884C\u300D\uFF0C\u4E0D\u8981\u6574\u5361\u62A5\u9519\u3002"
      },
      {
        id: "ports",
        category: "work",
        title: "\u7AEF\u53E3 \xB7 \u670D\u52A1\u5730\u56FE",
        size: { w: 5, h: 7 },
        schedule: every(3e4),
        blurb: "5000 \u88AB\u8C01\u5360\u4E86\uFF0C\u4E00\u773C\u770B\u5230",
        prompt: "\u505A\u4E00\u4E2A\u672C\u673A\u7AEF\u53E3\u5730\u56FE\uFF1A\u5217\u51FA\u6B63\u5728\u76D1\u542C\u7684 TCP \u7AEF\u53E3\u3001\u5BF9\u5E94\u8FDB\u7A0B\u548C\u7AEF\u53E3\u53F7\uFF1B\u8FC7\u6EE4\u6389 rapportd\u3001ControlCenter \u8FD9\u7C7B\u7CFB\u7EDF\u8FDB\u7A0B\uFF0C\u53EA\u4FDD\u7559\u5F00\u53D1\u76F8\u5173\u7684\u670D\u52A1\u3002\u7528 lsof -iTCP -sTCP:LISTEN\u3002\u5982\u679C\u67D0\u4E2A\u7AEF\u53E3\u662F Docker \u6620\u5C04\uFF0C\u6807\u51FA\u6765\u3002"
      },
      {
        id: "git",
        category: "work",
        title: "Git \u672A\u63D0\u4EA4 / \u672A\u63A8\u9001",
        size: { w: 5, h: 7 },
        schedule: every(3e5),
        blurb: "\u6211\u5230\u5E95\u5FD8\u4E86 push \u4EC0\u4E48",
        prompt: "\u505A\u4E00\u4E2A Git \u5F85\u529E\u5361\u7247\uFF1A\u626B\u63CF ~/Code \u4E0B\u7684\u4ED3\u5E93\uFF08\u628A\u8DEF\u5F84\u6362\u6210\u4F60\u7684\uFF09\uFF0C\u5217\u51FA\u6BCF\u4E2A\u4ED3\u5E93\u7684\u672A\u63D0\u4EA4\u6587\u4EF6\u6570\u3001\u672A\u63A8\u9001\u7684\u63D0\u4EA4\u6570\u3001\u5F53\u524D\u5206\u652F\u3002\u53EA\u663E\u793A\u6709\u672A\u63D0\u4EA4\u6216\u672A\u63A8\u9001\u7684\u4ED3\u5E93\uFF0C\u5168\u90E8\u5E72\u51C0\u65F6\u663E\u793A\u300C\u90FD\u5E72\u51C0\u4E86\u300D\u3002\u7528\u672C\u673A git \u547D\u4EE4\uFF0C\u4E0D\u8981\u8054\u7F51\u3002"
      },
      {
        id: "todo",
        category: "work",
        title: "\u5F85\u529E\u6E05\u5355",
        size: { w: 5, h: 6 },
        schedule: every(3e5),
        blurb: "\u50CF iOS \u63D0\u9192\u4E8B\u9879\u4E00\u6837\u52FE\u9009\u3001\u589E\u5220\u6539",
        prompt: '\u505A\u4E00\u4E2A\u5F85\u529E\u6E05\u5355\u5361\u7247\uFF0C\u50CF iOS \u63D0\u9192\u4E8B\u9879\uFF1A\u5706\u5F62\u52FE\u9009\u6846\u3001\u5B8C\u6210\u5212\u7EBF\u3001\u53D1\u4E1D\u7EBF\u5206\u884C\u3001\u5E95\u90E8\u8F93\u5165\u6846\u3002\u6570\u636E\u5B58\u5728 data/state.json\uFF0C\u7ED3\u6784\u4E3A {"items":[{"id":1,"text":"...","done":false,"tag":"\u4ECA\u5929"}]}\uFF1B\u9996\u6B21\u521B\u5EFA\u65F6\u5199\u5165\u7A7A\u5217\u8868\u3002\u7528 window.dshWidget.data \u8BFB\u53D6\uFF0C\u65B0\u589E/\u52FE\u9009/\u5220\u9664/\u53CC\u51FB\u7F16\u8F91\u540E\u8C03\u7528 window.dshWidget.save({items})\u3002\u4E0D\u8981\u7528 localStorage\uFF08\u6C99\u7BB1\u4E0D\u5141\u8BB8\uFF09\u3002\u8C03 card_set_refresh \u65F6\u4F20 file="data/state.json"\u3001everyMs=300000\u3002'
      },
      // 钱
      {
        id: "fx",
        category: "money",
        title: "\u7F8E\u5143\u6C47\u7387",
        size: { w: 4, h: 6 },
        schedule: every(3e5),
        blurb: "USD \u5151\u4EBA\u6C11\u5E01\u3001\u6B27\u5143\u3001\u65E5\u5143",
        prompt: "\u505A\u4E00\u4E2A\u6C47\u7387\u5361\u7247\uFF1A\u663E\u793A USD \u5151 CNY\u3001EUR\u3001JPY \u7684\u5F53\u524D\u6C47\u7387\u548C\u4ECA\u65E5\u6DA8\u8DCC\u3002\u4F18\u5148\u7528 frankfurter.dev \u7684\u514D\u8D39\u63A5\u53E3\uFF0C\u4E0D\u9700\u8981 key\uFF1B\u5931\u8D25\u65F6\u7528\u4E0A\u6B21\u6210\u529F\u7684\u7F13\u5B58\u5E76\u6807\u6CE8\u6570\u636E\u9648\u65E7\u3002\u6DA8\u7EFF\u8DCC\u7EA2\u3002"
      },
      {
        id: "stocks",
        category: "money",
        title: "\u81EA\u9009\u80A1",
        size: { w: 4, h: 7 },
        schedule: every(3e5),
        blurb: "\u6E2F\u80A1\u3001\u7F8E\u80A1\uFF0C\u4E00\u5C4F\u770B\u5B8C",
        prompt: "\u505A\u4E00\u4E2A\u81EA\u9009\u80A1\u5361\u7247\uFF1A\u9ED8\u8BA4\u5173\u6CE8\u817E\u8BAF 00700\u3001\u6CE1\u6CE1\u739B\u7279 09992\u3001\u82F1\u4F1F\u8FBE NVDA\uFF08\u628A\u4EE3\u7801\u6362\u6210\u4F60\u7684\uFF09\u3002\u663E\u793A\u73B0\u4EF7\u3001\u6DA8\u8DCC\u5E45\u3001\u4ECA\u5F00\u3001\u6628\u6536\u3002\u7528\u817E\u8BAF\u884C\u60C5\u63A5\u53E3 qt.gtimg.cn\uFF0C\u4E0D\u9700\u8981 key\uFF0C\u8BF7\u6C42\u65F6\u5E26 Referer: https://gu.qq.com/\u3002\u6DA8\u7EFF\u8DCC\u7EA2\uFF0C\u5931\u8D25\u65F6\u663E\u793A\u7F13\u5B58\u5E76\u6807\u6CE8\u9648\u65E7\u3002"
      },
      {
        id: "indices",
        category: "money",
        title: "\u5168\u7403\u6307\u6570",
        size: { w: 4, h: 6 },
        schedule: every(3e5),
        blurb: "\u9053\u6307\u3001\u7EB3\u6307\u3001\u6807\u666E\u3001\u4E0A\u8BC1",
        prompt: "\u505A\u4E00\u4E2A\u5168\u7403\u6307\u6570\u5361\u7247\uFF1A\u663E\u793A\u9053\u743C\u65AF\u3001\u7EB3\u65AF\u8FBE\u514B\u3001\u6807\u666E 500 \u548C\u4E0A\u8BC1\u6307\u6570\u7684\u70B9\u4F4D\u4E0E\u6DA8\u8DCC\u5E45\u3002\u7528\u817E\u8BAF\u884C\u60C5\u63A5\u53E3 qt.gtimg.cn\uFF0C\u4EE3\u7801 usDJI\u3001usIXIC\u3001usINX\u3001s_sh000001\uFF0C\u4E0D\u9700\u8981 key\u3002\u6DA8\u7EFF\u8DCC\u7EA2\u3002"
      },
      {
        id: "gold",
        category: "money",
        title: "\u9EC4\u91D1 \xB7 \u767D\u94F6",
        size: { w: 4, h: 6 },
        schedule: every(3e5),
        blurb: "\u73B0\u8D27\u91D1\u4EF7\uFF0C\u987A\u624B\u6362\u7B97\u6210\u4E00\u514B",
        prompt: "\u505A\u4E00\u4E2A\u9EC4\u91D1\u767D\u94F6\u5361\u7247\uFF1A\u663E\u793A\u73B0\u8D27\u9EC4\u91D1\u548C\u73B0\u8D27\u767D\u94F6\u7684\u7F8E\u5143\u4EF7\u683C\u4E0E\u4ECA\u65E5\u6DA8\u8DCC\u5E45\u3002\u7528\u817E\u8BAF\u884C\u60C5\u63A5\u53E3 qt.gtimg.cn \u7684 hf_XAU \u548C hf_XAG\uFF0C\u4E0D\u9700\u8981 key\u3002\u518D\u6309\u5F53\u524D USD/CNY \u6C47\u7387\u6362\u7B97\u4E00\u514B\u9EC4\u91D1\u5927\u7EA6\u591A\u5C11\u4EBA\u6C11\u5E01\u3002"
      },
      {
        id: "wallet",
        category: "money",
        title: "\u94FE\u4E0A\u94B1\u5305",
        size: { w: 4, h: 6 },
        schedule: every(6e4),
        blurb: "ETH \u4F59\u989D\u548C\u5F53\u524D\u533A\u5757",
        prompt: "\u505A\u4E00\u4E2A\u94FE\u4E0A\u94B1\u5305\u5361\u7247\uFF1A\u9ED8\u8BA4\u663E\u793A vitalik.eth \u7684 ETH \u4F59\u989D\uFF08\u628A\u5730\u5740\u6362\u6210\u4F60\u7684\uFF09\u3002\u7528\u516C\u5171 Ethereum RPC https://ethereum-rpc.publicnode.com \u7684 eth_getBalance \u548C eth_blockNumber\uFF0C\u4E0D\u9700\u8981 key\u3002\u663E\u793A ETH \u6570\u91CF\u548C\u5F53\u524D\u533A\u5757\u9AD8\u5EA6\u3002"
      },
      // 信息
      {
        id: "hn",
        category: "info",
        title: "Hacker News",
        size: { w: 5, h: 8 },
        schedule: every(6e5),
        blurb: "\u9996\u9875\u524D 10 \u6761\uFF0C\u6807\u9898\u3001\u5206\u6570\u3001\u8BC4\u8BBA",
        prompt: "\u505A\u4E00\u4E2A Hacker News \u5361\u7247\uFF1A\u663E\u793A\u9996\u9875\u524D 10 \u6761\uFF0C\u6BCF\u6761\u663E\u793A\u6807\u9898\u3001\u5206\u6570\u3001\u8BC4\u8BBA\u6570\u548C\u53D1\u5E03\u65F6\u95F4\uFF0C\u70B9\u6807\u9898\u6253\u5F00\u539F\u6587\u3002\u7528 Firebase \u7684\u516C\u5F00\u63A5\u53E3 https://hacker-news.firebaseio.com/v0/topstories.json \u52A0 item \u63A5\u53E3\uFF0C\u4E0D\u9700\u8981 key\u3002"
      },
      {
        id: "arxiv",
        category: "info",
        title: "arXiv \u65B0\u8BBA\u6587",
        size: { w: 5, h: 8 },
        schedule: daily("10:00"),
        blurb: "cs.AI \u4ECA\u5929\u65B0\u63D0\u4EA4\u7684\u8BBA\u6587",
        prompt: "\u505A\u4E00\u4E2A arXiv \u65B0\u8BBA\u6587\u5361\u7247\uFF1A\u663E\u793A cs.AI \u5206\u7C7B\u4ECA\u5929\u65B0\u63D0\u4EA4\u7684\u8BBA\u6587\uFF0C\u6309\u63D0\u4EA4\u65F6\u95F4\u5012\u5E8F\u53D6\u524D 10 \u6761\uFF0C\u663E\u793A\u6807\u9898\u3001\u7B2C\u4E00\u4F5C\u8005\u548C\u94FE\u63A5\u3002\u7528 export.arxiv.org \u7684 Atom \u63A5\u53E3\uFF0C\u4E0D\u9700\u8981 key\u3002\u6CA1\u6709\u65B0\u8BBA\u6587\u65F6\u663E\u793A\u300C\u4ECA\u5929\u8FD8\u6CA1\u6709\u65B0\u8BBA\u6587\u300D\u3002"
      },
      {
        id: "rss",
        category: "info",
        title: "\u8BA2\u9605\u66F4\u65B0",
        size: { w: 5, h: 8 },
        schedule: every(18e5),
        blurb: "\u5C11\u6570\u6D3E\u3001GitHub Blog\u3001HN \u7684\u6700\u65B0\u6587\u7AE0",
        prompt: "\u505A\u4E00\u4E2A\u8BA2\u9605\u66F4\u65B0\u5361\u7247\uFF1A\u6293\u53D6\u8FD9\u51E0\u4E2A RSS \u6E90\uFF0C\u628A\u6700\u65B0 8 \u6761\u6309\u65F6\u95F4\u5012\u5E8F\u663E\u793A\u6807\u9898\u3001\u6765\u6E90\u548C\u591A\u4E45\u524D\u53D1\u5E03\uFF1Ahttps://sspai.com/feed\u3001https://github.blog/feed/\u3001https://hnrss.org/frontpage\uFF08\u53EF\u4EE5\u6362\u6210\u4F60\u81EA\u5DF1\u7684\u6E90\uFF09\u3002\u70B9\u6807\u9898\u6253\u5F00\u539F\u6587\u3002"
      },
      {
        id: "trending",
        category: "info",
        title: "GitHub \u4ECA\u65E5\u70ED\u95E8",
        size: { w: 5, h: 8 },
        schedule: every(36e5),
        blurb: "\u6700\u8FD1 7 \u5929\u65B0\u5EFA\u3001star \u6700\u591A\u7684\u4ED3\u5E93",
        prompt: "\u505A\u4E00\u4E2A GitHub \u4ECA\u65E5\u70ED\u95E8\u5361\u7247\uFF1A\u7528 GitHub Search API \u627E\u6700\u8FD1 7 \u5929\u521B\u5EFA\u3001star \u6700\u591A\u7684 8 \u4E2A\u4ED3\u5E93\uFF0C\u663E\u793A\u4ED3\u5E93\u540D\u3001\u63CF\u8FF0\u3001\u8BED\u8A00\u548C star \u6570\u3002\u63A5\u53E3\u662F https://api.github.com/search/repositories?q=created:>YYYY-MM-DD&sort=stars&order=desc\uFF0C\u4E0D\u9700\u8981 key\uFF08\u6709\u901F\u7387\u9650\u5236\uFF0C\u5931\u8D25\u5C31\u663E\u793A\u7F13\u5B58\uFF09\u3002"
      },
      {
        id: "lobsters",
        category: "info",
        title: "Lobsters \u70ED\u5E16",
        size: { w: 5, h: 8 },
        schedule: every(18e5),
        blurb: "\u6280\u672F\u5708\u4ECA\u5929\u5728\u8BA8\u8BBA\u4EC0\u4E48",
        prompt: "\u505A\u4E00\u4E2A Lobsters \u70ED\u5E16\u5361\u7247\uFF1A\u663E\u793A https://lobste.rs/hottest.json \u7684\u524D 10 \u6761\uFF0C\u6807\u9898\u3001\u5206\u6570\u3001\u8BC4\u8BBA\u6570\u548C\u6807\u7B7E\uFF0C\u70B9\u6807\u9898\u6253\u5F00\u539F\u6587\u3002\u4E0D\u9700\u8981 key\u3002"
      },
      // 生活
      {
        id: "trash",
        category: "life",
        title: "\u5012\u5783\u573E\u65E5",
        size: { w: 4, h: 5 },
        schedule: daily("10:00"),
        blurb: "\u4ECA\u5929\u8BE5\u6254\u54EA\u79CD\u5783\u573E\uFF0C\u8FD8\u6709\u591A\u4E45",
        prompt: "\u505A\u4E00\u4E2A\u5012\u5783\u573E\u65E5\u5361\u7247\uFF1A\u9ED8\u8BA4\u300C\u5468\u4E00\u548C\u5468\u56DB\u665A\u4E0A 8 \u70B9\u524D\u6254\u5783\u573E\u300D\uFF08\u6539\u6210\u4F60\u6240\u5728\u57CE\u5E02\u7684\u89C4\u5219\uFF09\u3002\u663E\u793A\u4ECA\u5929\u8BE5\u6254\u54EA\u79CD\u5783\u573E\u3001\u4E0B\u4E00\u6B21\u662F\u4EC0\u4E48\u65F6\u5019\u3001\u8FD8\u6709\u591A\u4E45\u3002\u7EAF\u672C\u5730\u8BA1\u7B97\uFF0C\u4E0D\u9700\u8981\u7F51\u7EDC\u3002"
      },
      {
        id: "plants",
        category: "life",
        title: "\u690D\u7269\u6D47\u6C34",
        size: { w: 4, h: 6 },
        schedule: daily("10:00"),
        blurb: "\u54EA\u76C6\u8BE5\u6D47\u6C34\u4E86\uFF0C\u54EA\u76C6\u5DF2\u7ECF\u665A\u4E86",
        prompt: "\u505A\u4E00\u4E2A\u690D\u7269\u6D47\u6C34\u5361\u7247\uFF1A\u5728 data/plants.json \u91CC\u7EF4\u62A4\u51E0\u76C6\u690D\u7269\u7684\u540D\u5B57\u548C\u4E0A\u6B21\u6D47\u6C34\u65E5\u671F\uFF08\u9ED8\u8BA4\u7EFF\u841D\u3001\u9F9F\u80CC\u7AF9\u3001\u591A\u8089\uFF09\uFF0C\u663E\u793A\u6BCF\u76C6\u300C\u8FD8\u6709\u51E0\u5929\u8BE5\u6D47\u6C34 / \u5DF2\u7ECF\u665A\u4E86\u51E0\u5929\u300D\uFF0C\u8BE5\u6D47\u6C34\u7684\u6807\u9EC4\u3002\u7EAF\u672C\u5730\uFF0C\u4E0D\u9700\u8981\u7F51\u7EDC\u3002\u7528\u6237\u8BF4\u300C\u6211\u4ECA\u5929\u6D47\u8FC7\u6C34\u4E86\u300D\u65F6\uFF0C\u66F4\u65B0\u5BF9\u5E94\u65E5\u671F\u3002"
      },
      {
        id: "travel",
        category: "life",
        title: "\u65C5\u884C\u5012\u8BA1\u65F6",
        size: { w: 4, h: 5 },
        schedule: daily("10:00"),
        blurb: "\u79BB\u51FA\u53D1\u8FD8\u6709\u51E0\u5929\uFF0C\u5F53\u5730\u73B0\u5728\u51E0\u70B9",
        prompt: "\u505A\u4E00\u4E2A\u65C5\u884C\u5012\u8BA1\u65F6\u5361\u7247\uFF1A\u9ED8\u8BA4\u300C\u4E1C\u4EAC \xB7 2027-04-01\u300D\uFF08\u6539\u6210\u4F60\u7684\u76EE\u7684\u5730\u548C\u65E5\u671F\uFF09\u3002\u663E\u793A\u8FD8\u6709\u591A\u5C11\u5929\u3001\u5F53\u5730\u73B0\u5728\u51E0\u70B9\u3001\u5F53\u5730\u65F6\u95F4\u4E0E\u4F60\u7684\u65F6\u5DEE\u3002\u7EAF\u672C\u5730\u8BA1\u7B97\uFF0C\u4E0D\u9700\u8981\u7F51\u7EDC\u3002"
      },
      {
        id: "nba",
        category: "life",
        title: "NBA \u6BD4\u5206",
        size: { w: 5, h: 6 },
        schedule: every(3e5),
        blurb: "\u4ECA\u5929\u7684\u6BD4\u8D5B\u3001\u6BD4\u5206\u548C\u72B6\u6001",
        prompt: "\u505A\u4E00\u4E2A NBA \u6BD4\u5206\u5361\u7247\uFF1A\u7528 ESPN \u7684\u516C\u5F00\u63A5\u53E3 https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard \u663E\u793A\u4ECA\u5929\u7684\u6BD4\u8D5B\u3001\u6BD4\u5206\u548C\u72B6\u6001\uFF08\u672A\u5F00\u59CB / \u8FDB\u884C\u4E2D / \u5DF2\u7ED3\u675F\uFF09\u3002\u6CA1\u6709\u6BD4\u8D5B\u65F6\u663E\u793A\u300C\u4ECA\u5929\u6CA1\u6709\u6BD4\u8D5B\u300D\u3002\u4E0D\u9700\u8981 key\u3002"
      },
      {
        id: "moon",
        category: "life",
        title: "\u6708\u76F8",
        size: { w: 4, h: 5 },
        schedule: daily("10:00"),
        blurb: "\u4ECA\u665A\u6708\u4EAE\u5706\u4E0D\u5706",
        prompt: "\u505A\u4E00\u4E2A\u6708\u76F8\u5361\u7247\uFF1A\u663E\u793A\u4ECA\u5929\u7684\u6708\u76F8\uFF08\u65B0\u6708 / \u4E0A\u5F26 / \u6EE1\u6708 / \u4E0B\u5F26\u53CA\u767E\u5206\u6BD4\uFF09\u3001\u6708\u51FA\u6708\u843D\u65F6\u95F4\uFF0C\u4EE5\u53CA\u8DDD\u79BB\u4E0B\u4E00\u6B21\u6EE1\u6708\u8FD8\u6709\u51E0\u5929\u3002\u7EAF\u672C\u5730\u8BA1\u7B97\uFF0C\u4E0D\u9700\u8981\u7F51\u7EDC\u3002"
      },
      // 数字资产
      {
        id: "domain",
        category: "assets",
        title: "\u57DF\u540D \xB7 \u8BC1\u4E66\u5230\u671F",
        size: { w: 5, h: 7 },
        schedule: daily("10:00"),
        blurb: "\u6CE8\u518C\u5230\u671F\u3001\u8BC1\u4E66\u5230\u671F\u3001DNS \u6307\u5411",
        prompt: "\u505A\u4E00\u4E2A\u57DF\u540D\u8D44\u4EA7\u53F0\u8D26\uFF1A\u9ED8\u8BA4 berryon.ai\uFF08\u6539\u6210\u4F60\u7684\u57DF\u540D\uFF0C\u53EF\u4EE5\u5199\u591A\u4E2A\uFF09\u3002\u7528 RDAP\uFF08https://rdap.org/domain/\u57DF\u540D\uFF09\u67E5\u6CE8\u518C\u5230\u671F\u65E5\uFF0C\u7528 openssl s_client \u67E5 TLS \u8BC1\u4E66\u5230\u671F\u65E5\uFF0C\u7528 dig \u67E5 A \u8BB0\u5F55\u3002\u663E\u793A\u6BCF\u4E2A\u57DF\u540D\u7684\u6CE8\u518C\u5230\u671F\u3001\u8BC1\u4E66\u5230\u671F\u3001DNS \u6307\u5411\uFF1B\u5269\u4F59\u5C11\u4E8E 30 \u5929\u6807\u9EC4\uFF0C\u5C11\u4E8E 7 \u5929\u6807\u7EA2\u3002"
      },
      {
        id: "dns",
        category: "assets",
        title: "DNS \u53D8\u66F4\u76D1\u63A7",
        size: { w: 4, h: 6 },
        schedule: every(36e5),
        blurb: "\u89E3\u6790\u7ED3\u679C\u88AB\u6539\u4E86\u4F1A\u544A\u8BC9\u4F60",
        prompt: "\u505A\u4E00\u4E2A DNS \u53D8\u66F4\u76D1\u63A7\u5361\u7247\uFF1A\u9ED8\u8BA4\u76D1\u63A7 berryon.ai \u7684 A \u8BB0\u5F55\uFF08\u6539\u6210\u4F60\u7684\u57DF\u540D\uFF09\u3002\u7B2C\u4E00\u6B21\u8FD0\u884C\u628A\u5F53\u524D\u89E3\u6790\u7ED3\u679C\u5B58\u5230 data/baseline.json\uFF0C\u4E4B\u540E\u6BCF\u6B21\u5BF9\u6BD4\uFF1B\u5982\u679C\u89E3\u6790\u7ED3\u679C\u53D8\u4E86\uFF0C\u6807\u7EA2\u5E76\u663E\u793A\u65B0\u65E7\u503C\u3002\u7528 dig\uFF0C\u4E0D\u9700\u8981 key\u3002"
      },
      {
        id: "status",
        category: "assets",
        title: "\u670D\u52A1\u5546\u72B6\u6001",
        size: { w: 5, h: 6 },
        schedule: every(3e5),
        blurb: "GitHub\u3001Cloudflare\u3001OpenAI \u6302\u4E86\u5417",
        prompt: "\u505A\u4E00\u4E2A\u670D\u52A1\u5546\u72B6\u6001\u5361\u7247\uFF1A\u663E\u793A GitHub\u3001Cloudflare\u3001OpenAI \u7684\u5F53\u524D\u670D\u52A1\u72B6\u6001\u3002\u7528\u5404\u5BB6 statuspage \u7684\u516C\u5F00 JSON\uFF0C\u4F8B\u5982 https://www.githubstatus.com/api/v2/status.json\u3001https://www.cloudflarestatus.com/api/v2/status.json\u3001https://status.openai.com/api/v2/status.json\u3002\u6B63\u5E38\u663E\u793A\u7EFF\u8272\u300C\u6B63\u5E38\u300D\uFF0C\u5F02\u5E38\u663E\u793A\u9EC4\u8272\u6216\u7EA2\u8272\u548C\u8BF4\u660E\u3002\u4E0D\u9700\u8981 key\u3002"
      },
      {
        id: "secrets",
        category: "assets",
        title: "\u654F\u611F\u6587\u4EF6\u68C0\u67E5",
        size: { w: 5, h: 7 },
        schedule: daily("10:00"),
        blurb: "\u6709\u6CA1\u6709\u628A .env \u63D0\u4EA4\u8FDB git",
        prompt: "\u505A\u4E00\u4E2A\u654F\u611F\u6587\u4EF6\u68C0\u67E5\u5361\u7247\uFF1A\u626B\u63CF ~/Code \u4E0B\u7684 git \u4ED3\u5E93\uFF08\u6539\u6210\u4F60\u7684\u8DEF\u5F84\uFF09\uFF0C\u5217\u51FA\u88AB git \u8DDF\u8E2A\u7684 .env\u3001id_rsa\u3001*.pem\u3001*.key \u7B49\u654F\u611F\u6587\u4EF6\u3002\u7528 git ls-files\uFF0C\u7EAF\u672C\u5730\u3002\u53D1\u73B0\u4E00\u4E2A\u5C31\u6807\u7EA2\uFF0C\u5E76\u663E\u793A\u4ED3\u5E93\u540D\u548C\u6587\u4EF6\u8DEF\u5F84\uFF1B\u5168\u90E8\u5E72\u51C0\u65F6\u663E\u793A\u300C\u6CA1\u6709\u53D1\u73B0\u300D\u3002\u4E0D\u8981\u8BFB\u53D6\u6587\u4EF6\u5185\u5BB9\uFF0C\u53EA\u770B\u6587\u4EF6\u540D\u3002"
      },
      {
        id: "reposize",
        category: "assets",
        title: "\u4ED3\u5E93\u4F53\u79EF",
        size: { w: 5, h: 7 },
        schedule: daily("10:00"),
        blurb: "\u54EA\u4E2A\u4ED3\u5E93\u6084\u6084\u5360\u4E86\u4E00\u4E2A G",
        prompt: "\u505A\u4E00\u4E2A\u4ED3\u5E93\u4F53\u79EF\u5361\u7247\uFF1A\u626B\u63CF ~/Code \u4E0B\u7684 git \u4ED3\u5E93\uFF08\u6539\u6210\u4F60\u7684\u8DEF\u5F84\uFF09\uFF0C\u663E\u793A\u6BCF\u4E2A\u4ED3\u5E93\u7684 .git \u4F53\u79EF\u548C\u6700\u5927\u7684 3 \u4E2A\u76EE\u5F55\uFF0C\u6309\u4F53\u79EF\u5012\u5E8F\u3002\u7528 du \u548C git count-objects -vH\uFF0C\u7EAF\u672C\u5730\u3002\u603B\u4F53\u79EF\u8D85\u8FC7 1GB \u7684\u6807\u9EC4\u3002"
      }
    ];
    var DEFAULT_SCHEDULE = daily("10:00");
    var QUICK_SCHEDULES = [
      { key: "30s", label: "30 \u79D2", schedule: every(3e4) },
      { key: "5m", label: "5 \u5206\u949F", schedule: every(3e5) },
      { key: "1h", label: "1 \u5C0F\u65F6", schedule: every(36e5) },
      { key: "daily", label: "\u6BCF\u5929", schedule: daily("10:00") }
    ];
    var MORE_SCHEDULES = [
      { key: "1m", label: "1 \u5206\u949F", schedule: every(6e4) },
      { key: "2m", label: "2 \u5206\u949F", schedule: every(12e4) },
      { key: "10m", label: "10 \u5206\u949F", schedule: every(6e5) },
      { key: "15m", label: "15 \u5206\u949F", schedule: every(9e5) },
      { key: "30m", label: "30 \u5206\u949F", schedule: every(18e5) },
      { key: "2h", label: "2 \u5C0F\u65F6", schedule: every(72e5) },
      { key: "6h", label: "6 \u5C0F\u65F6", schedule: every(216e5) },
      { key: "12h", label: "12 \u5C0F\u65F6", schedule: every(432e5) },
      { key: "3d", label: "\u6BCF 3 \u5929", schedule: every(2592e5) },
      { key: "7d", label: "\u6BCF\u5468", schedule: every(6048e5) },
      { key: "none", label: "\u4E0D\u81EA\u52A8\u66F4\u65B0", schedule: { kind: "none" } }
    ];
    var scheduleKey = function(schedule) {
      if (schedule.kind === "none") return "none";
      if (schedule.kind === "daily") return "daily";
      const found = QUICK_SCHEDULES.concat(MORE_SCHEDULES).find(function(item) {
        return item.schedule.kind === "every" && item.schedule.ms === schedule.ms;
      });
      return found ? found.key : "";
    };
    var scheduleLabel = function(schedule) {
      if (schedule.kind === "none") return "\u4E0D\u81EA\u52A8\u66F4\u65B0";
      if (schedule.kind === "daily") return "\u6BCF\u5929 " + schedule.at + " \u66F4\u65B0\u4E00\u6B21";
      return "\u6BCF " + fmtEvery(schedule.ms) + "\u66F4\u65B0\u4E00\u6B21";
    };
    var refreshHasSource = function(refresh) {
      return isObject(refresh) && Boolean(refresh.template || refresh.command || refresh.file || refresh.url);
    };
    var scheduleOfRefresh = function(refresh) {
      if (!isObject(refresh)) return { kind: "none" };
      if (typeof refresh.dailyAt === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(refresh.dailyAt)) return daily(refresh.dailyAt);
      const ms = asNumber(refresh.everyMs);
      return ms !== null && ms >= 5e3 ? every(ms) : { kind: "none" };
    };
    var refreshOfSchedule = function(refresh, schedule) {
      const next = Object.assign({}, isObject(refresh) ? refresh : {});
      delete next.everyMs;
      delete next.dailyAt;
      if (schedule.kind === "every") next.everyMs = schedule.ms;
      if (schedule.kind === "daily") next.dailyAt = schedule.at;
      return next;
    };
    function renderScheduleField(props) {
      const schedule = props.schedule;
      const options = props.allowNone === false ? MORE_SCHEDULES.filter(function(item) {
        return item.key !== "none";
      }) : MORE_SCHEDULES;
      const key2 = scheduleKey(schedule);
      const moreKey = options.some(function(item) {
        return item.key === key2;
      }) ? key2 : "";
      const detail = props.hint !== void 0 ? props.hint : schedule.kind === "daily" ? [
        h("span", { key: "p" }, "\u6BCF\u5929 "),
        h("select", {
          key: "t",
          className: "od-input od-time",
          value: schedule.at,
          "aria-label": "\u6BCF\u5929\u51E0\u70B9\u66F4\u65B0",
          disabled: props.busy === true,
          onChange: function(event) {
            props.onChange(daily(event.target.value || "10:00"));
          }
        }, Array.from({ length: 24 }, function(_, hour) {
          const value = String(hour).padStart(2, "0") + ":00";
          return h("option", { key: value, value }, value);
        })),
        h("span", { key: "s" }, " \u66F4\u65B0\u4E00\u6B21")
      ] : scheduleLabel(schedule);
      return h(
        "div",
        { className: "od-schedule" },
        h(
          "div",
          { className: "od-schedule-row" },
          h("span", { className: "od-field-label" }, props.label ?? "\u66F4\u65B0\u9891\u7387"),
          h("div", { className: "od-chips" }, QUICK_SCHEDULES.map(function(item) {
            const on = item.schedule.kind === "daily" ? schedule.kind === "daily" : schedule.kind === "every" && schedule.ms === item.schedule.ms;
            return h("button", {
              key: item.key,
              type: "button",
              className: "od-chip",
              "data-on": on ? "true" : "false",
              "aria-pressed": on ? "true" : "false",
              disabled: props.busy === true,
              onClick: function() {
                props.onChange(item.schedule.kind === "daily" ? daily(schedule.kind === "daily" ? schedule.at : "10:00") : item.schedule);
              }
            }, item.label);
          })),
          h(
            "select",
            {
              className: "od-input od-more",
              value: moreKey,
              "aria-label": "\u66F4\u591A\u66F4\u65B0\u9891\u7387",
              disabled: props.busy === true,
              onChange: function(event) {
                const item = options.find(function(entry) {
                  return entry.key === event.target.value;
                });
                if (item) props.onChange(item.schedule);
              }
            },
            h("option", { value: "" }, "\u66F4\u591A\u2026"),
            options.map(function(item) {
              return h("option", { key: item.key, value: item.key }, item.label);
            })
          )
        ),
        h("div", { className: "od-schedule-detail od-hint-sm" }, detail)
      );
    }
    var composePrompt = function(text, schedule) {
      const head = text.trim();
      if (schedule.kind === "none") return head + "\n\n\u8FD9\u5F20\u5361\u7247\u662F\u9759\u6001\u5361\u7247\uFF1A\u4E0D\u9700\u8981\u81EA\u52A8\u66F4\u65B0\uFF0C\u4E0D\u8981\u8C03\u7528 card_set_refresh\u3002";
      if (schedule.kind === "daily") return head + "\n\n\u66F4\u65B0\u95F4\u9694\uFF1A\u6BCF\u5929 " + schedule.at + '\u3002\u8C03\u7528 card_set_refresh \u65F6\u540C\u65F6\u4F20 dailyAt="' + schedule.at + '" \u548C everyMs=86400000\uFF0C\u4E0D\u8981\u7701\u7565\u3002';
      return head + "\n\n\u66F4\u65B0\u95F4\u9694\uFF1A\u6BCF " + fmtEvery(schedule.ms) + "\u3002\u8C03\u7528 card_set_refresh \u65F6\u4F20 everyMs=" + schedule.ms + "\uFF0C\u4E0D\u8981\u7701\u7565\u3002";
    };
    function NewCardDialog(props) {
      const [text, setText] = (0, import_react6.useState)("");
      const [categoryId, setCategoryId] = (0, import_react6.useState)(SCENE_CATEGORIES[0].id);
      const [sceneId, setSceneId] = (0, import_react6.useState)("");
      const [schedule, setSchedule] = (0, import_react6.useState)(DEFAULT_SCHEDULE);
      const scenes = SCENES.filter(function(scene) {
        return scene.category === categoryId;
      });
      const chooseScene = function(scene) {
        setSceneId(scene.id);
        setText(scene.prompt);
        setSchedule(scene.schedule);
      };
      const atLimit = props.buildingCount >= props.maxBuilding;
      return h(Modal, {
        title: "\u65B0\u5EFA\u5361\u7247",
        onClose: props.onClose,
        footer: [
          h("button", { key: "c", type: "button", className: "od-btn od-btn-ghost", onClick: props.onClose }, "\u53D6\u6D88"),
          h("button", {
            key: "ok",
            type: "button",
            className: "od-btn od-btn-primary",
            disabled: props.busy || text.trim() === "",
            onClick: function() {
              if (atLimit) {
                props.onLimit();
                return;
              }
              const scene = SCENES.find(function(item) {
                return item.id === sceneId;
              });
              props.onCreate(composePrompt(text, schedule), scene ? scene.title : "", scene ? scene.size : void 0);
            }
          }, props.busy ? "\u521B\u5EFA\u4E2D\u2026" : "\u521B\u5EFA")
        ]
      }, h(
        "div",
        { className: "od-newcard" },
        h(
          "div",
          { className: "od-hint", style: { fontSize: "12.5px" } },
          "\u6311\u4E00\u4E2A\u573A\u666F\u70B9\u4E00\u4E0B\uFF0C\u4F1A\u586B\u5230\u4E0B\u9762\uFF1B\u60F3\u6539\u5C31\u76F4\u63A5\u6539\u3002"
        ),
        h("div", { className: "od-chips", role: "tablist", "aria-label": "\u5206\u7C7B" }, SCENE_CATEGORIES.map(function(cat) {
          return h("button", {
            key: cat.id,
            type: "button",
            role: "tab",
            className: "od-chip",
            "data-on": categoryId === cat.id ? "true" : "false",
            "aria-selected": categoryId === cat.id ? "true" : "false",
            title: cat.blurb,
            onClick: function() {
              setCategoryId(cat.id);
            }
          }, cat.title);
        })),
        h("div", { className: "od-scenes" }, scenes.map(function(scene) {
          return h(
            "button",
            {
              key: scene.id,
              type: "button",
              className: "od-scene",
              "data-on": sceneId === scene.id ? "true" : "false",
              "aria-pressed": sceneId === scene.id ? "true" : "false",
              onClick: function() {
                chooseScene(scene);
              }
            },
            h("span", { className: "od-scene-title" }, scene.title),
            h("span", { className: "od-scene-blurb" }, scene.blurb)
          );
        })),
        h("textarea", {
          className: "od-input",
          rows: 4,
          value: text,
          placeholder: "\u4E5F\u53EF\u4EE5\u76F4\u63A5\u7528\u81EA\u5DF1\u7684\u8BDD\u63CF\u8FF0\uFF0C\u4F8B\u5982\uFF1A\u770B\u6211\u7684\u81EA\u9009\u80A1\uFF0C\u5217\u8868 + \u8FD1 7 \u65E5\u8D70\u52BF",
          onChange: function(event) {
            setText(event.target.value);
          }
        }),
        renderScheduleField({ schedule, busy: props.busy, onChange: setSchedule }),
        atLimit && h(
          "div",
          { className: "od-hint-sm od-limit" },
          "\u73B0\u5728\u6709 " + props.buildingCount + " \u5F20\u5728\u751F\u6210\uFF0C\u7B49\u4E00\u5F20\u5B8C\u6210\u518D\u7EE7\u7EED\u3002"
        ),
        props.error !== "" && h("div", { className: "od-error" }, h("span", { className: "od-error-text" }, props.error))
      ));
    }
    function EditCardDialog(props) {
      const card = props.card;
      const [title, setTitle] = (0, import_react6.useState)(card.title);
      const [size, setSize] = (0, import_react6.useState)({ ...card.size });
      const hasSource = refreshHasSource(card.refresh);
      const [schedule, setSchedule] = (0, import_react6.useState)(scheduleOfRefresh(card.refresh));
      return h(Modal, {
        title: "\u7F16\u8F91\u300C" + card.title + "\u300D",
        onClose: props.onClose,
        footer: [
          h("button", { key: "c", type: "button", className: "od-btn od-btn-ghost", onClick: props.onClose }, "\u53D6\u6D88"),
          h("button", {
            key: "ok",
            type: "button",
            className: "od-btn od-btn-primary",
            disabled: props.busy,
            onClick: function() {
              const fields = { title: title.trim(), size };
              if (hasSource) fields.refresh = refreshOfSchedule(card.refresh, schedule);
              props.onSave(fields);
            }
          }, "\u4FDD\u5B58")
        ]
      }, h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "10px" } },
        h(
          "label",
          { className: "od-field" },
          h("span", { className: "od-field-label" }, "\u6807\u9898"),
          h("input", { className: "od-input", value: title, onChange: function(event) {
            setTitle(event.target.value);
          } })
        ),
        h(SizePicker, { size, busy: props.busy, onChange: function(next) {
          setSize(next);
        } }),
        renderScheduleField({
          schedule,
          busy: props.busy,
          allowNone: false,
          onChange: function(next) {
            setSchedule(next);
          },
          hint: hasSource ? void 0 : "\u8FD9\u5F20\u5361\u6CA1\u6709\u53D6\u6570\u6765\u6E90\uFF08\u9759\u6001\u5361\uFF09\uFF0C\u66F4\u65B0\u9891\u7387\u6682\u4E0D\u751F\u6548\u3002"
        }),
        h("span", { className: "od-hint-sm" }, "\u5361\u7247\u5185\u5BB9\u7531 view/ \u91CC\u7684\u524D\u7AEF\u4EE3\u7801\u6E32\u67D3\uFF1B\u8FD9\u91CC\u6539\u6807\u9898\u3001\u5C3A\u5BF8\u548C\u66F4\u65B0\u9891\u7387\u3002"),
        props.error !== "" && h("div", { className: "od-error" }, h("span", { className: "od-error-text" }, props.error))
      ));
    }
    function CardChatPanel(props) {
      const cardId = props.cardId;
      const [turns, setTurns] = (0, import_react6.useState)([]);
      const [busy, setBusy] = (0, import_react6.useState)(false);
      const [draft, setDraft] = (0, import_react6.useState)("");
      const [error, setError] = (0, import_react6.useState)("");
      const [live, setLive] = (0, import_react6.useState)(null);
      const [conn, setConn] = (0, import_react6.useState)("offline");
      const [refresh, setRefresh] = (0, import_react6.useState)(0);
      const listRef = (0, import_react6.useRef)(null);
      const stickRef = (0, import_react6.useRef)(true);
      (0, import_react6.useEffect)(function() {
        let alive = true;
        let timer = null;
        function load() {
          props.store.requestRaw("card-turns", { id: cardId }).then(function(body) {
            if (!alive) return;
            const value = isObject(body.value) ? body.value : {};
            setTurns(asArray(value.turns));
            setBusy(value.busy === true);
            if (value.busy !== true) setLive(null);
            setError("");
            timer = window.setTimeout(load, value.busy === true ? 1500 : 4e3);
          }, function(failure) {
            if (!alive) return;
            const message = String(failure && failure.message ? failure.message : failure);
            setError(/会话服务|没有会话/.test(message) ? "\u8FD9\u5F20\u5361\u6682\u65F6\u6CA1\u6709\u6D3B\u7740\u7684\u4F1A\u8BDD\u3002\u76F4\u63A5\u53D1\u4E00\u6761\u6D88\u606F\u4F1A\u81EA\u52A8\u65B0\u5EFA\u4E00\u4E2A\u3002" : "\u8BFB\u53D6\u4F1A\u8BDD\u5931\u8D25\uFF1A" + message);
            timer = window.setTimeout(load, 4e3);
          });
        }
        load();
        return function() {
          alive = false;
          if (timer !== null) window.clearTimeout(timer);
        };
      }, [cardId, refresh]);
      (0, import_react6.useEffect)(function() {
        if (typeof EventSource === "undefined") return void 0;
        let alive = true;
        let source = null;
        let retry = null;
        let disabled = false;
        let failures = 0;
        function connect() {
          if (!alive) return;
          try {
            source = new EventSource(CARD_STREAM_URL + "?id=" + encodeURIComponent(cardId));
          } catch (cause) {
            source = null;
            return;
          }
          source.addEventListener("ready", function() {
            if (!alive) return;
            failures = 0;
            setConn("sse");
          });
          source.addEventListener("live", function(event) {
            if (!alive) return;
            try {
              const data = JSON.parse(event.data);
              const text = asText(data && data.text);
              if (text === "") {
                setLive(null);
              } else {
                setLive({
                  turn: asNumber(data && data.turn) ?? 0,
                  step: asNumber(data && data.step) ?? 0,
                  text
                });
              }
            } catch (cause) {
            }
          });
          source.addEventListener("disabled", function() {
            if (!alive) return;
            disabled = true;
            setConn("polling");
            try {
              source.close();
            } catch (cause) {
            }
            source = null;
          });
          source.addEventListener("error", function() {
            if (!alive || disabled) return;
            setConn("offline");
            try {
              source.close();
            } catch (cause) {
            }
            source = null;
            failures += 1;
            if (failures >= 2) {
              disabled = true;
              setConn("polling");
              return;
            }
            if (retry === null) retry = window.setTimeout(function() {
              retry = null;
              connect();
            }, 5e3);
          });
        }
        connect();
        return function() {
          alive = false;
          if (retry !== null) window.clearTimeout(retry);
          if (source !== null) {
            try {
              source.close();
            } catch (cause) {
            }
          }
        };
      }, [cardId]);
      (0, import_react6.useEffect)(function() {
        const element = listRef.current;
        if (element === null || !stickRef.current) return;
        element.scrollTop = element.scrollHeight;
      }, [turns.length, busy, live]);
      function onScroll() {
        const element = listRef.current;
        if (element === null) return;
        stickRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 48;
      }
      function send() {
        const text = draft.trim();
        if (text === "" || busy) return;
        setDraft("");
        setLive(null);
        setBusy(true);
        stickRef.current = true;
        props.store.requestRaw("card-prompt", { id: cardId, text }).then(function() {
          setRefresh(function(n) {
            return n + 1;
          });
        }, function(failure) {
          setBusy(false);
          setError(String(failure && failure.message ? failure.message : failure));
        });
      }
      function stop() {
        props.store.requestRaw("card-cancel", { id: cardId }).then(function() {
          setBusy(false);
          setLive(null);
        }, function(failure) {
          setError(String(failure && failure.message ? failure.message : failure));
        });
      }
      const suggestions = [
        { label: "\u6539\u6807\u9898", fill: "\u6807\u9898\u6539\u6210 " },
        { label: "\u6539\u5C3A\u5BF8", fill: "\u5C3A\u5BF8\u6539\u6210 8\xD79" },
        { label: "\u91CD\u65B0\u53D6\u6570", fill: "\u6570\u636E\u91CD\u65B0\u53D6\u4E00\u6B21" }
      ];
      return h(
        "aside",
        { className: "od-card-chat" },
        h(
          "header",
          { className: "od-chat-head" },
          h("span", { className: "od-chat-title" }, "\u548C\u300C" + asText(props.title, "\u5361\u7247") + "\u300D\u5BF9\u8BDD"),
          h(
            "span",
            {
              className: "od-live",
              "data-mode": conn === "sse" ? "sse" : "polling",
              title: conn === "sse" ? "\u9010\u5B57\u6D41\u5DF2\u8FDE\u63A5" : "\u9010\u5B57\u6D41\u672A\u8FDE\u63A5\uFF0C\u4ECD\u5728\u8F6E\u8BE2"
            },
            h("span", { className: "od-live-dot" }),
            conn === "sse" ? "\u5B9E\u65F6" : "\u8F6E\u8BE2"
          ),
          h("span", { className: "od-spacer" }),
          h("button", { type: "button", className: "od-icon-btn", "aria-label": "\u5173\u95ED\u5BF9\u8BDD", onClick: props.onClose }, "\xD7")
        ),
        error !== "" && h("div", { className: "od-banner" }, h("div", { className: "od-error" }, h("span", { className: "od-error-text" }, error))),
        h(
          "div",
          { className: "od-chat-list", ref: listRef, onScroll },
          turns.length === 0 && h(
            "div",
            { className: "od-chat-empty" },
            h("div", null, "\u8FD9\u5F20\u5361\u81EA\u5DF1\u7684\u4F1A\u8BDD\u8FD8\u7A7A\u7740\u3002\u8BF4\u4E00\u53E5\u8BDD\u6539\u5B83\u3002"),
            h("div", { className: "od-chips" }, suggestions.map(function(item) {
              return h("button", {
                key: item.label,
                type: "button",
                className: "od-chip",
                onClick: function() {
                  setDraft(item.fill);
                }
              }, item.label);
            }))
          ),
          turns.map(function(turn, index) {
            const isLast = index === turns.length - 1;
            const stream = isLast && live !== null && asText(live.text) !== "" ? live : null;
            return h(TurnBlock, { key: "turn" + turn.turn, turn, mode: "standard", stream });
          }),
          busy && (live === null || asText(live.text) === "") && h("div", { className: "od-hint" }, "\u5361\u7247 Agent \u6B63\u5728\u5904\u7406\u2026")
        ),
        h(
          "div",
          { className: "od-composer" },
          h("textarea", {
            className: "od-input",
            rows: 2,
            value: draft,
            placeholder: "\u548C\u8FD9\u5F20\u5361\u8BF4\u4E00\u53E5\u8BDD\u2026",
            onChange: function(event) {
              setDraft(event.target.value);
            },
            onKeyDown: function(event) {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }
          }),
          h(
            "div",
            { className: "od-composer-row" },
            h("span", { className: "od-hint" }, busy ? "\u6B63\u5728\u6539\u8FD9\u5F20\u5361\u2026" : "\u5BF9\u8BDD\u5373\u4FEE\u6539\uFF1B\u4EA7\u51FA\u4F1A\u5199\u56DE\u5361\u7247"),
            busy ? h("button", { type: "button", className: "od-btn od-btn-sm od-btn-danger", onClick: stop }, "\u505C\u6B62") : h("button", {
              type: "button",
              className: "od-btn od-btn-sm od-btn-primary",
              disabled: draft.trim() === "",
              onClick: send
            }, "\u53D1\u9001")
          )
        )
      );
    }
    function useCardTheme() {
      const read = () => document.body?.dataset.dsDarkTheme !== void 0 ? "dark" : "light";
      const [theme, setTheme] = (0, import_react6.useState)(read);
      (0, import_react6.useEffect)(function() {
        if (typeof MutationObserver === "undefined" || !document.body) return;
        const observer = new MutationObserver(() => setTheme(read()));
        observer.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
        return () => observer.disconnect();
      }, []);
      return theme;
    }
    function CardPreview(props) {
      const ref = (0, import_react6.useRef)(null);
      const theme = useCardTheme();
      const [, setTick] = (0, import_react6.useState)(0);
      const [error, setError] = (0, import_react6.useState)("");
      const design = props.store.getSnapshot().state?.design;
      (0, import_react6.useEffect)(function() {
        const dialog = ref.current;
        dialog.showModal();
        const timer = window.setInterval(() => setTick((n) => n + 1), 1e3);
        return function() {
          window.clearInterval(timer);
          dialog.close();
        };
      }, []);
      return h("dialog", {
        ref,
        className: "od-card-preview",
        "aria-label": props.widget.title + " \xB7 \u5361\u7247\u9884\u89C8",
        onCancel: function(event) {
          event.preventDefault();
          props.onClose();
        },
        onClick: function(event) {
          if (event.target === event.currentTarget) props.onClose();
        }
      }, h(
        "div",
        { className: "od-preview-inner" },
        h(
          "div",
          { className: "od-preview-head" },
          h("span", { className: "od-card-title" }, props.widget.title),
          h("button", { type: "button", className: "od-btn od-btn-sm", autoFocus: true, onClick: props.onClose }, "\u5173\u95ED\u9884\u89C8")
        ),
        error && h("div", { className: "od-error", role: "alert" }, error),
        h(
          CardBoundary,
          { key: props.widget.id, title: props.widget.title },
          h(
            "div",
            { className: "od-preview-content", style: { height: Math.max(160, props.widget.size.h * (GRID.rowHeight + GRID.gap) - 60) } },
            h(CardContent, {
              widget: props.widget,
              dp: props.dp,
              theme,
              design,
              now: props.store.projectNow(),
              onRefresh: function(id) {
                setError("");
                props.store.request("card-refresh", { id }).catch((cause) => setError(String(cause.message || cause)));
              },
              onFetch: (id, request) => props.store.request("renderer-fetch", { id, url: request.url })
            })
          )
        )
      ));
    }
    function NativeCardActions(props) {
      const [snapshot, setSnapshot] = (0, import_react6.useState)(props.store.getSnapshot());
      const [previewId, setPreviewId] = (0, import_react6.useState)(null);
      (0, import_react6.useEffect)(function() {
        setSnapshot(props.store.getSnapshot());
        return props.store.subscribe(setSnapshot);
      }, [props.store]);
      const widget = snapshot.state?.widgets.find((item) => item.sessionId === props.sessionId);
      if (!widget) return null;
      return h(
        "div",
        { className: "od-root od-session-actions" },
        h(StyleTag, null),
        h("button", { type: "button", className: "od-btn od-btn-ghost od-btn-sm", "aria-haspopup": "dialog", onClick: () => setPreviewId(widget.id) }, "\u9884\u89C8\u8FD9\u5F20\u5361\u7247"),
        h("button", { type: "button", className: "od-btn od-btn-ghost od-btn-sm", onClick: function() {
          setPreviewId(null);
          props.onReturn(widget.id);
        } }, "\u8FD4\u56DE\u677F\u9762"),
        previewId === widget.id && h(CardPreview, { key: widget.id, widget, dp: snapshot.state.data[widget.id], store: props.store, onClose: () => setPreviewId(null) })
      );
    }
    function Board(props) {
      const store = props.store;
      const [snapshot, setSnapshot] = (0, import_react6.useState)(store.getSnapshot());
      const [tick, setTick] = (0, import_react6.useState)(0);
      const [banner, setBanner] = (0, import_react6.useState)("");
      const [notice, setNotice] = (0, import_react6.useState)(null);
      const [overflowMap, setOverflowMap] = (0, import_react6.useState)({});
      const [newDialog, setNewDialog] = (0, import_react6.useState)(null);
      const [editDialog, setEditDialog] = (0, import_react6.useState)(null);
      const [removeDialog, setRemoveDialog] = (0, import_react6.useState)(null);
      const [activeCardId, setActiveCardId] = (0, import_react6.useState)(null);
      const theme = useCardTheme();
      const boardRef = (0, import_react6.useRef)(null);
      (0, import_react6.useEffect)(function() {
        setSnapshot(store.getSnapshot());
        return store.subscribe(setSnapshot);
      }, [store]);
      (0, import_react6.useEffect)(function() {
        const timer = window.setInterval(function() {
          setTick(function(n) {
            return n + 1;
          });
        }, 1e3);
        return function() {
          window.clearInterval(timer);
        };
      }, []);
      (0, import_react6.useEffect)(function() {
        if (!snapshot.focus || !snapshot.state) return;
        const frame = window.requestAnimationFrame(function() {
          const card = Array.from(boardRef.current?.querySelectorAll("[data-widget-id]") || []).find((element) => element.dataset.widgetId === snapshot.focus.id);
          if (!card) return;
          const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
          card.scrollIntoView({ block: "center", behavior: reduced ? "instant" : "smooth" });
          card.focus({ preventScroll: true });
          card.animate?.([
            { outline: "2px solid var(--od-blue)", outlineOffset: "3px" },
            { outline: "2px solid transparent", outlineOffset: "3px" }
          ], { duration: reduced ? 0 : 1800 });
          store.clearFocus();
          setActiveCardId(null);
        });
        return () => window.cancelAnimationFrame(frame);
      }, [snapshot.focus, snapshot.state?.widgets.length]);
      const state = snapshot.state;
      const now = store.projectNow();
      const widgets = state !== null ? state.widgets : [];
      const paused = state !== null && state.paused === true;
      const maxBuilding = state !== null ? state.maxBuilding : 8;
      const buildingCount = widgets.filter(function(widget) {
        return widget.building === true;
      }).length;
      function run(action, payload) {
        setBanner("");
        return store.request(action, payload).then(function(value) {
          return value;
        }, function(error) {
          setBanner(String(error && error.message ? error.message : error));
          throw error;
        });
      }
      function say(message) {
        setNotice({ message, until: Date.now() + 5e3 });
      }
      function createCard(text, title, size) {
        if (buildingCount >= maxBuilding) {
          say("\u540C\u65F6\u6700\u591A\u751F\u6210 " + maxBuilding + " \u5F20\u5361\u7247\uFF0C\u7B49\u4E00\u5F20\u5B8C\u6210\u518D\u7EE7\u7EED\u3002");
          return;
        }
        setNewDialog({ open: true, busy: true, error: "" });
        const payload = { text };
        if (typeof title === "string" && title !== "") payload.title = title;
        if (size !== void 0 && size !== null) payload.size = size;
        run("card-create", payload).then(function() {
          setNewDialog(null);
        }, function(error) {
          setNewDialog({ open: true, busy: false, error: String(error && error.message ? error.message : error) });
        });
      }
      function saveCard(id, fields) {
        setEditDialog({ id, busy: true, error: "" });
        const payload = { id, title: fields.title, size: fields.size };
        if (fields.refresh !== void 0) payload.refresh = fields.refresh;
        run("card-update", payload).then(function() {
          setEditDialog(null);
        }, function(error) {
          setEditDialog({ id, busy: false, error: String(error && error.message ? error.message : error) });
        });
      }
      function removeCard(id) {
        setRemoveDialog({ id, busy: true });
        run("card-remove", { id }).then(function() {
          setRemoveDialog(null);
        }, function(error) {
          setRemoveDialog({ id, busy: false });
          setBanner(String(error && error.message ? error.message : error));
        });
      }
      function moveWidget(id, before) {
        const others = widgets.filter(function(widget) {
          return widget.id !== id;
        }).map(function(widget) {
          return widget.id;
        });
        const index = Math.max(0, Math.min(others.length, Math.round(before)));
        others.splice(index, 0, id);
        const pending = run("card-reorder", { ids: others });
        pending.catch(function() {
        });
        return pending;
      }
      function resizeWidget(id, size) {
        run("card-update", { id, size }).catch(function() {
        });
      }
      function growWidget(widget) {
        if (widget === null) return;
        const height = Math.min(SIZE_MAX, Math.max(widget.size.h, (widget.size.h || 4) + 2));
        resizeWidget(widget.id, { w: widget.size.w, h: height });
      }
      function modifyCard(widget) {
        if (widget === null || widget === void 0) return;
        const open = props.openSession;
        if (typeof open === "function") {
          try {
            const result = open(widget.id);
            if (result !== null && result !== void 0 && typeof result.then === "function") {
              result.catch(function() {
                setActiveCardId(widget.id);
              });
            }
            return;
          } catch (error) {
          }
        }
        setActiveCardId(widget.id);
      }
      const lastOpenAtRef = (0, import_react6.useRef)(null);
      (0, import_react6.useEffect)(function() {
        if (state === null) return;
        if (lastOpenAtRef.current === null) {
          lastOpenAtRef.current = state.openAt;
          return;
        }
        if (state.openAt > lastOpenAtRef.current) {
          lastOpenAtRef.current = state.openAt;
          const wanted = asText(state.chatOpenCardId);
          const widget = wanted === "" ? null : state.widgets.find(function(item) {
            return item.id === wanted;
          });
          if (widget !== null && widget !== void 0) modifyCard(widget);
        }
      }, [state === null ? 0 : state.openAt]);
      const activeCard = state !== null && activeCardId !== null ? state.widgets.find(function(widget) {
        return widget.id === activeCardId;
      }) : null;
      const editingCard = editDialog !== null ? widgets.find(function(widget) {
        return widget.id === editDialog.id;
      }) : null;
      return h(
        "div",
        { className: "od-root", ref: boardRef },
        h(StyleTag, null),
        h(TopBar, {
          name: "\u5C0F\u7EC4\u4EF6",
          count: state !== null ? widgets.length : null,
          conn: snapshot.conn,
          busy: false,
          paused,
          onAdd: function() {
            setNewDialog({ open: true, busy: false, error: "" });
          },
          onRefresh: function() {
            run("card-refresh", {}).catch(function() {
            });
          },
          onTogglePause: function() {
            run("pause", { paused: !paused }).catch(function() {
            });
          }
        }),
        banner !== "" && h(
          "div",
          { className: "od-banner" },
          h(
            "div",
            { className: "od-error" },
            h("span", { className: "od-error-text" }, banner),
            h("button", { type: "button", className: "od-error-x", onClick: function() {
              setBanner("");
            } }, "\u2715")
          )
        ),
        paused && h(
          "div",
          { className: "od-banner" },
          h(
            "div",
            { className: "od-toast od-toast-warn" },
            h("span", { className: "od-toast-text" }, "\u5DF2\u6682\u505C\u6240\u6709\u5237\u65B0"),
            h("button", { type: "button", className: "od-btn od-btn-sm", onClick: function() {
              run("pause", { paused: false }).catch(function() {
              });
            } }, "\u6062\u590D")
          )
        ),
        notice !== null && Date.now() < notice.until && h(
          "div",
          { className: "od-banner" },
          h(
            "div",
            { className: "od-toast od-toast-warn" },
            h("span", { className: "od-toast-text" }, notice.message),
            h("button", { type: "button", className: "od-error-x", onClick: function() {
              setNotice(null);
            } }, "\u2715")
          )
        ),
        h(
          "div",
          { className: "od-scroll" },
          widgets.length === 0 ? h(
            "div",
            { className: "od-empty" },
            h("div", null, "\u8FD8\u6CA1\u6709\u5361\u7247\u3002"),
            h("button", { type: "button", className: "od-btn od-btn-primary", onClick: function() {
              setNewDialog({ open: true, busy: false, error: "" });
            } }, "\uFF0B \u7528\u4E00\u53E5\u8BDD\u65B0\u5EFA"),
            h("div", { className: "od-hint" }, "\u65B0\u5EFA\u540E Agent \u4F1A\u5728\u8FD9\u5F20\u5361\u81EA\u5DF1\u7684\u4F1A\u8BDD\u91CC\u628A\u5B83\u505A\u51FA\u6765\u3002")
          ) : h(WidgetGrid, {
            widgets,
            data: state.data,
            now,
            theme,
            design: state.design,
            busy: false,
            overflowMap,
            onEdit: function(widget) {
              setEditDialog({ id: widget.id, busy: false, error: "" });
            },
            onModify: function(widget) {
              modifyCard(widget);
            },
            onRefresh: function(id) {
              run("card-refresh", { id }).catch(function() {
              });
            },
            onRemove: function(widget) {
              setRemoveDialog({ id: widget.id, busy: false });
            },
            onResize: resizeWidget,
            onGrow: growWidget,
            onOverflow: function(id, report) {
              setOverflowMap(function(previous) {
                const current = previous[id];
                if (report && report.scrollHeight > report.clientHeight) {
                  if (current && current.scrollHeight === report.scrollHeight && current.clientHeight === report.clientHeight) return previous;
                  const next2 = Object.assign({}, previous);
                  next2[id] = { scrollHeight: report.scrollHeight, clientHeight: report.clientHeight };
                  return next2;
                }
                if (current === void 0) return previous;
                const next = Object.assign({}, previous);
                delete next[id];
                return next;
              });
            },
            onFetch: function(id, request) {
              return store.requestRaw("renderer-fetch", { id, url: request.url }).then(function(body) {
                return body.value;
              });
            },
            onMove: moveWidget,
            onSave: function(id, value, options) {
              run("card-data", {
                id,
                value,
                refetch: !!(options && options.refresh === true)
              }).catch(function() {
              });
            }
          })
        ),
        activeCard && h(CardChatPanel, {
          key: activeCard.id,
          store,
          cardId: activeCard.id,
          title: activeCard.title,
          onClose: function() {
            setActiveCardId(null);
            run("card-chat-close", {}).catch(function() {
            });
          }
        }),
        newDialog !== null && newDialog.open && h(NewCardDialog, {
          busy: newDialog.busy,
          error: asText(newDialog.error),
          buildingCount,
          maxBuilding,
          onLimit: function() {
            say("\u540C\u65F6\u6700\u591A\u751F\u6210 " + maxBuilding + " \u5F20\u5361\u7247\uFF0C\u7B49\u4E00\u5F20\u5B8C\u6210\u518D\u7EE7\u7EED\u3002");
          },
          onClose: function() {
            setNewDialog(null);
          },
          onCreate: createCard
        }),
        editDialog !== null && editingCard !== null && h(EditCardDialog, {
          card: editingCard,
          busy: editDialog.busy,
          error: asText(editDialog.error),
          onClose: function() {
            setEditDialog(null);
          },
          onSave: function(fields) {
            saveCard(editingCard.id, fields);
          }
        }),
        removeDialog !== null && h(ConfirmModal, {
          title: "\u5220\u9664\u8FD9\u5F20\u5361\u7247\uFF1F",
          message: "\u5361\u7247\u4F1A\u8FDB\u5165\u56DE\u6536\u7AD9\uFF087 \u5929\uFF09\uFF0C\u5BF9\u5E94\u7684\u4F1A\u8BDD\u4E5F\u4F1A\u88AB\u79FB\u9664\u3002",
          onClose: function() {
            setRemoveDialog(null);
          },
          onConfirm: function() {
            removeCard(removeDialog.id);
          }
        })
      );
    }
    var PanelBoundary = class extends import_react6.default.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }
      static getDerivedStateFromError(error) {
        return { error };
      }
      componentDidCatch(error, info) {
        reportClientError("panel-crash", error, info);
      }
      render() {
        if (this.state.error !== null) {
          return h(
            "div",
            { className: "od-root" },
            h(StyleTag, null),
            h(
              "div",
              { className: "od-boundary" },
              h("div", { style: { fontWeight: 600 } }, "\u8FD9\u5757\u677F\u9762\u51FA\u4E86\u70B9\u95EE\u9898"),
              h("div", { className: "od-hint", style: { wordBreak: "break-word" } }, String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error)),
              h("button", { type: "button", className: "od-btn od-btn-primary od-btn-sm", onClick: function() {
                window.location.reload();
              } }, "\u91CD\u65B0\u52A0\u8F7D")
            )
          );
        }
        return this.props.children;
      }
    };
    function PanelIcon(props) {
      const size = props.size || 20;
      return h(
        "svg",
        { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": true, style: { display: "block" } },
        h("rect", { x: 2, y: 2, width: 9, height: 9, rx: 2.5, fill: "currentColor", opacity: 0.9 }),
        h("rect", { x: 13, y: 2, width: 9, height: 5, rx: 2, fill: "currentColor", opacity: 0.65 }),
        h("rect", { x: 13, y: 9, width: 9, height: 13, rx: 2.5, fill: "currentColor", opacity: 0.9 }),
        h("rect", { x: 2, y: 13, width: 9, height: 9, rx: 2.5, fill: "currentColor", opacity: 0.65 })
      );
    }
    var main_default = {
      inject: ["slots", "layout"],
      apply(ctx) {
        const store = createDeskStore(function openBoard() {
          try {
            ctx.layout.selectPanel("open-desktop");
          } catch (error) {
          }
        });
        let cardSessionRef = null;
        let navigation = 0;
        let disposed = false;
        const pendingReferences = /* @__PURE__ */ new Set();
        function release(owned) {
          if (!owned || owned.released) return;
          owned.released = true;
          try {
            owned.reference.release();
          } catch (error) {
            reportClientError("card-session-release", error, null);
          }
        }
        function cancelPendingNavigation() {
          navigation += 1;
          for (const owned of pendingReferences) release(owned);
          pendingReferences.clear();
        }
        async function openCardSession(cardId) {
          cancelPendingNavigation();
          const ticket = navigation;
          const navigationSignal = ctx.layout.beginNavigation?.();
          const onNavigationAbort = function() {
            if (ticket === navigation) cancelPendingNavigation();
          };
          navigationSignal?.addEventListener("abort", onNavigationAbort, { once: true });
          let owned;
          try {
            const sessions = ctx.get?.("sessions");
            const workspace = ctx.get?.("uiWorkspace") ?? ctx.uiWorkspace;
            if (typeof sessions?.retain !== "function") throw new Error("\u5BA2\u6237\u7AEF\u4F1A\u8BDD\u670D\u52A1\u4E0D\u53EF\u7528");
            if (typeof workspace?.openSession !== "function") throw new Error("\u539F\u751F\u5DE5\u4F5C\u533A\u4E0D\u53EF\u7528");
            const prepared = await store.request("card-session", { id: cardId });
            if (disposed || ticket !== navigation) return;
            const sessionId = prepared.sessionId;
            if (!sessionId) throw new Error("\u5361\u7247\u4F1A\u8BDD\u51C6\u5907\u5931\u8D25");
            if (cardSessionRef?.sessionId === sessionId) {
              navigationSignal?.removeEventListener("abort", onNavigationAbort);
              await workspace.openSession(sessionId);
              return;
            }
            owned = { sessionId, reference: sessions.retain(sessionId, { source: "open-desktop-card" }), released: false };
            pendingReferences.add(owned);
            await owned.reference.ready;
            if (disposed || ticket !== navigation) return;
            navigationSignal?.removeEventListener("abort", onNavigationAbort);
            await workspace.openSession(sessionId);
            if (disposed || ticket !== navigation) return;
            release(cardSessionRef);
            cardSessionRef = owned;
          } catch (error) {
            if (disposed || ticket !== navigation) return;
            reportClientError("card-open-session", error, null);
            throw error;
          } finally {
            navigationSignal?.removeEventListener("abort", onNavigationAbort);
            pendingReferences.delete(owned);
            if (owned !== cardSessionRef) release(owned);
          }
        }
        ctx.effect(function() {
          return function() {
            disposed = true;
            cancelPendingNavigation();
            release(cardSessionRef);
            cardSessionRef = null;
          };
        }, "open-desktop: card session reference");
        ctx.effect(function() {
          store.start();
          return function() {
            store.stop();
          };
        }, "open-desktop: stream");
        ctx.effect(function() {
          function onError(event) {
            try {
              window.__odErrorWhere = (event && event.filename ? event.filename : "") + ":" + String(event && event.lineno || 0);
            } catch (error) {
            }
            reportClientError("window-error", event && event.error ? event.error : new Error(String(event && event.message)), null);
          }
          function onRejection(event) {
            reportClientError("unhandled-rejection", event && event.reason ? event.reason : new Error("unhandled rejection"), null);
          }
          window.addEventListener("error", onError);
          window.addEventListener("unhandledrejection", onRejection);
          return function() {
            window.removeEventListener("error", onError);
            window.removeEventListener("unhandledrejection", onRejection);
          };
        }, "open-desktop: error reporting");
        ctx.slots.inject("sidebar.panellist", function() {
          return ctx.slots.register({
            name: "sidebar.panellist",
            id: "open-desktop",
            order: 20,
            label: function() {
              return "\u5C0F\u7EC4\u4EF6";
            }
          }, PanelIcon);
        });
        ctx.slots.inject("conversation.session.header.actions", function() {
          return ctx.slots.register({ name: "conversation.session.header.actions", id: "open-desktop-card", order: 20 }, function CardSessionHeader(props) {
            return h(NativeCardActions, {
              sessionId: props.sessionId,
              store,
              onReturn: function(cardId) {
                cancelPendingNavigation();
                store.focusCard(cardId);
                ctx.layout.selectPanel("open-desktop");
              }
            });
          });
        });
        ctx.slots.inject("main", function() {
          return ctx.slots.register({ name: "main", key: "open-desktop" }, function OpenDesktopPanel() {
            return h(PanelBoundary, null, h(Board, {
              store,
              openSession: openCardSession
            }));
          });
        });
      }
    };
    return module.exports.default ?? module.exports;
  },
});
