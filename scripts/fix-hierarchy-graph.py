#!/usr/bin/env python3
"""
Rewrite the hierarchy section of showcase.html to recreate the REAL React Flow graph
from the Hierarchy page with all 26 agents, proper edges, particles, MiniMap, and depth effects.
"""

import re

INPUT = '/home/z/my-project/download/showcase.html'
OUTPUT = '/home/z/my-project/download/showcase.html'

with open(INPUT, 'r', encoding='utf-8') as f:
    content = f.read()

# =====================================================
# 1. REPLACE CSS for hierarchy section
# =====================================================

old_css = """.hier-section { background: linear-gradient(180deg,var(--bg) 0%,rgba(6,182,212,0.02) 50%,var(--bg) 100%); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 6rem 0; }
.hier-container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; text-align: center; }

.demo-wrapper { position: relative; width: 100%; height: 550px; margin-top: 2rem; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); transition: border-color 0.3s; perspective: 1200px; }
.demo-wrapper:hover { border-color: rgba(6,182,212,0.3); }
#demo-canvas { position: absolute; inset: 0; width: 100%; height: 100%; cursor: grab; }
.demo-vignette { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at center,transparent 40%,rgba(5,5,5,0.7) 100%); z-index: 2; }
.demo-scanlines { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px); z-index: 3; }
.demo-depth-label { position: absolute; bottom: 12px; right: 16px; font-family: var(--mono); font-size: 0.6rem; color: rgba(6,182,212,0.3); letter-spacing: 2px; z-index: 4; pointer-events: none; }
.demo-hint { font-family: var(--mono); font-size: 0.7rem; color: var(--txt3); margin-top: 1rem; letter-spacing: 1px; }"""

new_css = """.hier-section { background: linear-gradient(180deg,var(--bg) 0%,rgba(6,182,212,0.02) 50%,var(--bg) 100%); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 5rem 0 6rem; }
.hier-container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; text-align: center; }

.demo-wrapper { position: relative; width: 100%; height: 680px; margin-top: 2rem; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); transition: border-color 0.3s; perspective: 1200px; display: flex; flex-direction: column; background: #000; }
.demo-wrapper:hover { border-color: rgba(6,182,212,0.3); }

/* Hierarchy App Chrome */
.hier-app-header { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; height: 40px; background: #0A0A0A; border-bottom: 1px solid rgba(51,51,51,0.5); flex-shrink: 0; z-index: 5; }
.hier-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #64748B; }
.hier-breadcrumb .active { color: #fff; font-weight: 600; }
.hier-breadcrumb .sep { color: #555; font-size: 9px; }
.hier-header-right { display: flex; align-items: center; gap: 6px; }
.hier-live { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 10px; background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.15); font-size: 7px; font-weight: 700; color: #22C55E; letter-spacing: 1px; }
.hier-live .dot { width: 4px; height: 4px; border-radius: 50%; background: #22C55E; animation: pulse-dot 2s ease-in-out infinite; }
.hier-hdr-btn { padding: 3px 8px; border-radius: 4px; background: #1A1A1A; border: 1px solid rgba(51,51,51,0.4); color: #64748B; font-size: 8px; font-weight: 600; display: flex; align-items: center; gap: 3px; }
.hier-hdr-btn.accent { background: rgba(6,182,212,0.06); border-color: rgba(6,182,212,0.15); color: #06B6D4; }

.hier-app-controls { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; height: 30px; background: #0A0A0A; border-bottom: 1px solid rgba(51,51,51,0.25); flex-shrink: 0; z-index: 5; gap: 6px; flex-wrap: nowrap; overflow-x: auto; }
.hier-ctrl-left { display: flex; align-items: center; gap: 3px; }
.hier-ctrl-right { display: flex; align-items: center; gap: 2px; }
.hier-vm-btn { padding: 2px 6px; border-radius: 3px; font-size: 7px; font-weight: 600; background: rgba(6,182,212,0.06); border: 1px solid rgba(6,182,212,0.15); color: #06B6D4; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 2px; }
.hier-vm-btn.off { background: transparent; border-color: transparent; color: #555; }
.hier-ctrl-sep { width: 1px; height: 12px; background: rgba(51,51,51,0.25); margin: 0 2px; flex-shrink: 0; }
.hier-ctrl-search { display: flex; align-items: center; gap: 4px; background: #111; border: 1px solid rgba(51,51,51,0.25); border-radius: 4px; padding: 2px 6px; font-size: 8px; color: #555; min-width: 80px; }
.hier-edge-tag { padding: 1px 4px; border-radius: 2px; font-size: 6px; font-weight: 600; opacity: 1; }
.hier-edge-tag.dim { opacity: 0.3; }
.hier-zoom-btn { padding: 2px 4px; border-radius: 3px; background: rgba(13,13,13,0.95); border: 1px solid rgba(51,51,51,0.3); color: #ccc; font-size: 8px; display: flex; align-items: center; }
.hier-fit-btn { padding: 2px 6px; border-radius: 3px; background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3); color: #06B6D4; font-size: 7px; font-weight: 600; text-transform: uppercase; display: flex; align-items: center; gap: 2px; }

.hier-app-body { display: flex; flex: 1; min-height: 0; overflow: hidden; }

/* Sidebar */
.hier-sidebar { width: 170px; flex-shrink: 0; background: #0A0A0A; border-right: 1px solid rgba(51,51,51,0.25); overflow: hidden; display: flex; flex-direction: column; font-size: 9px; z-index: 5; }
.hier-sb-section { padding: 8px 8px; border-bottom: 1px solid rgba(51,51,51,0.2); flex-shrink: 0; }
.hier-sb-title { font-size: 7px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 5px; }
.hier-role-row { display: flex; align-items: center; gap: 6px; padding: 2px 5px; border-radius: 3px; margin-bottom: 1px; }
.hier-role-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.hier-role-name { color: #B0B0B0; font-weight: 500; flex: 1; font-size: 8px; }
.hier-role-cnt { font-size: 7px; font-weight: 700; color: #555; background: rgba(51,51,51,0.2); padding: 0 3px; border-radius: 2px; }
.hier-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
.hier-stat-cell { text-align: center; padding: 4px 2px; background: rgba(20,20,20,0.5); border-radius: 4px; }
.hier-stat-val { font-family: var(--mono); font-size: 14px; font-weight: 700; line-height: 1; }
.hier-stat-lbl { font-size: 6px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
.hier-agent-list { padding: 8px; flex: 1; min-height: 0; overflow: hidden; }
.hier-agent-item { display: flex; align-items: center; gap: 5px; padding: 2px 4px; border-radius: 3px; font-size: 8px; color: #B0B0B0; margin-bottom: 1px; }
.hier-agent-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }

/* Canvas area */
.hier-canvas-area { flex: 1; position: relative; overflow: hidden; }
#demo-canvas { position: absolute; inset: 0; width: 100%; height: 100%; cursor: grab; }

/* MiniMap overlay */
.hier-minimap { position: absolute; bottom: 10px; right: 10px; width: 160px; background: rgba(10,10,10,0.92); border: 1px solid rgba(51,51,51,0.5); border-radius: 8px; padding: 6px; z-index: 6; pointer-events: none; backdrop-filter: blur(8px); }
.hier-minimap-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.hier-minimap-title span { font-size: 7px; color: #555; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
.hier-minimap-svg { width: 100%; border-radius: 4px; }

/* KPI Strip */
.hier-kpi { display: flex; align-items: center; gap: 16px; padding: 0 16px; height: 28px; background: #0A0A0A; border-top: 1px solid rgba(51,51,51,0.25); flex-shrink: 0; z-index: 5; }
.hier-kpi-item { display: flex; align-items: center; gap: 5px; }
.hier-kpi-dot { width: 5px; height: 5px; border-radius: 50%; }
.hier-kpi-val { font-size: 10px; font-weight: 800; }
.hier-kpi-lbl { font-size: 7px; color: #555; }

/* Depth overlays */
.demo-vignette { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at center,transparent 50%,rgba(5,5,5,0.6) 100%); z-index: 10; }
.demo-scanlines { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.02) 2px,rgba(0,0,0,0.02) 4px); z-index: 11; }
.demo-depth-label { position: absolute; bottom: 8px; left: 190px; font-family: var(--mono); font-size: 0.55rem; color: rgba(6,182,212,0.25); letter-spacing: 2px; z-index: 12; pointer-events: none; }
.demo-hint { font-family: var(--mono); font-size: 0.65rem; color: var(--txt3); margin-top: 1rem; letter-spacing: 1px; }"""

content = content.replace(old_css, new_css)

# =====================================================
# 2. REPLACE HTML hierarchy section
# =====================================================

old_html = """<!-- ===== HIERARCHY ===== -->
<section class="hier-section" id="hierarchy">
  <div class="hier-container">
    <div class="reveal">
      <div class="section-label">// 02</div>
      <h2 class="section-title">Agent Hierarchy</h2>
      <p class="section-desc" style="margin:0 auto">Interactive graph visualization of your agent topology. 4 depth layers create a pseudo-3D effect -- hover nodes, drag to reposition, move mouse for parallax.</p>
    </div>
    <div class="demo-wrapper reveal reveal-d1">
      <canvas id="demo-canvas"></canvas>
      <div class="demo-vignette"></div>
      <div class="demo-scanlines"></div>
      <div class="demo-depth-label">DEPTH LAYERS: 4</div>
    </div>
    <div class="demo-hint reveal reveal-d2">HOVER NODES &middot; DRAG TO REPOSITION &middot; DOUBLE-CLICK TO RESET &middot; MOUSE = PARALLAX</div>
  </div>
</section>"""

new_html = """<!-- ===== HIERARCHY ===== -->
<section class="hier-section" id="hierarchy">
  <div class="hier-container">
    <div class="reveal">
      <div class="section-label">// 02</div>
      <h2 class="section-title">Agent Hierarchy</h2>
      <p class="section-desc" style="margin:0 auto">Full React Flow graph with 26 agents across 5 hierarchy levels. Interactive nodes, animated edge particles, MiniMap, and multi-layer parallax depth.</p>
    </div>
    <div class="demo-wrapper reveal reveal-d1">
      <!-- App Header -->
      <div class="hier-app-header">
        <div class="hier-breadcrumb">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:22px;height:22px;border-radius:5px;background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.2);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#06B6D4">Q</div>
            <span style="font-size:10px;font-weight:700;color:#06B6D4">Agent</span><span style="font-size:10px;font-weight:700;color:#fff">Qube</span>
          </div>
          <span style="color:#475569;font-size:9px;margin:0 4px">|</span>
          <span>Dashboard</span>
          <span class="sep">&#9654;</span>
          <span class="active">Hierarchy</span>
        </div>
        <div class="hier-header-right">
          <div class="hier-live"><span class="dot"></span>LIVE</div>
          <div class="hier-hdr-btn">&#8635; Refresh</div>
          <div class="hier-hdr-btn accent">+ Add Agent</div>
        </div>
      </div>
      <!-- Controls Bar -->
      <div class="hier-app-controls">
        <div class="hier-ctrl-left">
          <div class="hier-vm-btn">&#9638; Hierarchy</div>
          <div class="hier-vm-btn off">&#9711; Radial</div>
          <div class="hier-vm-btn off">&#9638; Grid</div>
          <div class="hier-ctrl-sep"></div>
          <div class="hier-vm-btn off">&#9776; Layers</div>
          <div class="hier-vm-btn off">&#8597; Layout</div>
          <div class="hier-ctrl-sep"></div>
          <div class="hier-ctrl-search">&#128269; Search agents...</div>
          <div class="hier-ctrl-sep"></div>
          <span class="hier-edge-tag" style="color:#22D3EE;background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.15)">CMD</span>
          <span class="hier-edge-tag" style="color:#64748B;background:rgba(100,116,139,0.08);border:1px solid rgba(100,116,139,0.15)">Sync</span>
          <span class="hier-edge-tag" style="color:#0891B2;background:rgba(8,145,178,0.08);border:1px solid rgba(8,145,178,0.15)">Twin</span>
          <span class="hier-edge-tag dim" style="color:#0891B2;background:rgba(8,145,178,0.04);border:1px solid transparent">Delegate</span>
          <span class="hier-edge-tag dim" style="color:#475569;background:rgba(71,85,105,0.04);border:1px solid transparent">Supervise</span>
          <span class="hier-edge-tag dim" style="color:#0E7490;background:rgba(14,116,144,0.04);border:1px solid transparent">Broadcast</span>
        </div>
        <div class="hier-ctrl-right">
          <div class="hier-zoom-btn">+</div>
          <div class="hier-zoom-btn">-</div>
          <div class="hier-ctrl-sep"></div>
          <div class="hier-fit-btn">&#9635; Fit</div>
        </div>
      </div>
      <!-- Body: Sidebar + Canvas -->
      <div class="hier-app-body">
        <div class="hier-sidebar">
          <div class="hier-sb-section">
            <div class="hier-sb-title">Role Groups</div>
            <div class="hier-role-row" style="background:rgba(103,232,249,0.06)"><div class="hier-role-dot" style="background:#67E8F9"></div><span class="hier-role-name" style="color:#fff">Strategy</span><span class="hier-role-cnt">3</span></div>
            <div class="hier-role-row"><div class="hier-role-dot" style="background:#22D3EE"></div><span class="hier-role-name">Tactics</span><span class="hier-role-cnt">3</span></div>
            <div class="hier-role-row"><div class="hier-role-dot" style="background:#06B6D4"></div><span class="hier-role-name">Control</span><span class="hier-role-cnt">3</span></div>
            <div class="hier-role-row"><div class="hier-role-dot" style="background:#0891B2"></div><span class="hier-role-name">Execution</span><span class="hier-role-cnt">5</span></div>
            <div class="hier-role-row"><div class="hier-role-dot" style="background:#0E7490"></div><span class="hier-role-name">Memory</span><span class="hier-role-cnt">3</span></div>
            <div class="hier-role-row"><div class="hier-role-dot" style="background:#155E75"></div><span class="hier-role-name">Monitoring</span><span class="hier-role-cnt">3</span></div>
            <div class="hier-role-row"><div class="hier-role-dot" style="background:#164E63"></div><span class="hier-role-name">Communication</span><span class="hier-role-cnt">3</span></div>
            <div class="hier-role-row"><div class="hier-role-dot" style="background:#0C4A6E"></div><span class="hier-role-name">Learning</span><span class="hier-role-cnt">3</span></div>
          </div>
          <div class="hier-sb-section">
            <div class="hier-sb-title">System Status</div>
            <div class="hier-stats-grid">
              <div class="hier-stat-cell"><div class="hier-stat-val" style="color:#fff">26</div><div class="hier-stat-lbl">Total</div></div>
              <div class="hier-stat-cell"><div class="hier-stat-val" style="color:#22D3EE">20</div><div class="hier-stat-lbl">Active</div></div>
              <div class="hier-stat-cell"><div class="hier-stat-val" style="color:#64748B">3</div><div class="hier-stat-lbl">Idle</div></div>
              <div class="hier-stat-cell"><div class="hier-stat-val" style="color:#EF4444">0</div><div class="hier-stat-lbl">Error</div></div>
            </div>
          </div>
          <div class="hier-agent-list">
            <div class="hier-sb-title">Agents</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Architect</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Analyst</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Visionary</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Coordinator</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Planner</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#64748B"></div>Communicator</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Inspector</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Evaluator</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Guard</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Executor-A</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Executor-B</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#64748B"></div>Debugger</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Tester</div>
            <div class="hier-agent-item"><div class="hier-agent-dot" style="background:#22D3EE"></div>Coder</div>
          </div>
        </div>
        <div class="hier-canvas-area">
          <canvas id="demo-canvas"></canvas>
        </div>
      </div>
      <!-- KPI Strip -->
      <div class="hier-kpi">
        <div class="hier-kpi-item"><div class="hier-kpi-dot" style="background:#fff"></div><span class="hier-kpi-val" style="color:#fff">26</span><span class="hier-kpi-lbl">Total</span></div>
        <div class="hier-kpi-item"><div class="hier-kpi-dot" style="background:#22D3EE"></div><span class="hier-kpi-val" style="color:#22D3EE">20</span><span class="hier-kpi-lbl">Active</span></div>
        <div class="hier-kpi-item"><div class="hier-kpi-dot" style="background:#64748B"></div><span class="hier-kpi-val" style="color:#64748B">3</span><span class="hier-kpi-lbl">Idle</span></div>
        <div class="hier-kpi-item"><div class="hier-kpi-dot" style="background:#F59E0B"></div><span class="hier-kpi-val" style="color:#F59E0B">1</span><span class="hier-kpi-lbl">Paused</span></div>
        <div class="hier-kpi-item"><div class="hier-kpi-dot" style="background:#EF4444"></div><span class="hier-kpi-val" style="color:#EF4444">0</span><span class="hier-kpi-lbl">Error</span></div>
        <div class="hier-kpi-item"><div class="hier-kpi-dot" style="background:#8B5CF6"></div><span class="hier-kpi-val" style="color:#8B5CF6">1</span><span class="hier-kpi-lbl">Standby</span></div>
      </div>
      <!-- Depth overlays -->
      <div class="demo-vignette"></div>
      <div class="demo-scanlines"></div>
      <div class="demo-depth-label">DEPTH LAYERS: 4</div>
    </div>
    <div class="demo-hint reveal reveal-d2">HOVER NODES &middot; DRAG TO REPOSITION &middot; DOUBLE-CLICK TO RESET &middot; MOUSE = PARALLAX</div>
  </div>
</section>"""

content = content.replace(old_html, new_html)

# =====================================================
# 3. REPLACE JS Section 4 - Complete hierarchy graph
# =====================================================

# Find the old JS section 4 and replace it
old_js_start = "// =============================================\n// 4. INTERACTIVE HIERARCHY with 4 DEPTH LAYERS\n// ============================================="
old_js_end = "})();"

idx_start = content.find(old_js_start)
idx_end = content.rfind(old_js_end)

if idx_start == -1 or idx_end == -1:
    raise Exception("Could not find JS section 4 boundaries")

# Replace from start of section 4 to end of file (before </script>)
new_js = """// =============================================
// 4. INTERACTIVE HIERARCHY - Full React Flow Graph (26 agents)
// =============================================
(function() {
  var canvas = document.getElementById('demo-canvas');
  var ctx = canvas.getContext('2d');
  var W, H, dpr;
  var mouseCanvas = { x: 0, y: 0 };

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = canvas.offsetWidth; H = canvas.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', function() { resize(); computeLayout(); });

  // -- Color helpers --
  function hexRGBA(hex, a) {
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return 'rgba('+r+','+g+','+b+','+a+')';
  }

  // -- Role config (matching real app) --
  var ROLE = {
    Strategy:      { color: '#67E8F9', rgb: '103,232,249', level: 0 },
    Tactics:       { color: '#22D3EE', rgb: '34,211,238',  level: 1 },
    Control:       { color: '#06B6D4', rgb: '6,182,212',   level: 2 },
    Execution:     { color: '#0891B2', rgb: '8,145,178',   level: 3 },
    Memory:        { color: '#0E7490', rgb: '14,116,144',  level: 4 },
    Monitoring:    { color: '#155E75', rgb: '21,94,117',   level: 4 },
    Communication: { color: '#164E63', rgb: '22,78,99',    level: 4 },
    Learning:      { color: '#0C4A6E', rgb: '12,74,110',   level: 4 }
  };
  var STATUS_COL = { active: '#22D3EE', idle: '#6B7280', error: '#EF4444', offline: '#4B5563', paused: '#F59E0B', standby: '#8B5CF6' };
  var EDGE_CFG = {
    command:   { color: '#22D3EE', dash: '' },
    sync:      { color: '#64748B', dash: '5 5' },
    twin:      { color: '#0891B2', dash: '8 4' }
  };

  // -- All 26 agents (real seed data) --
  var agents = [
    { id:'a0',  name:'Architect',        role:'Strategy',      status:'active',  formula:'ToT' },
    { id:'a1',  name:'Analyst',          role:'Strategy',      status:'active',  formula:'CoVe' },
    { id:'a2',  name:'Visionary',        role:'Strategy',      status:'active',  formula:'GoT' },
    { id:'a3',  name:'Coordinator',      role:'Tactics',       status:'active',  formula:'ReWOO' },
    { id:'a4',  name:'Planner',          role:'Tactics',       status:'active',  formula:'ReAct' },
    { id:'a5',  name:'Communicator',     role:'Tactics',       status:'idle',    formula:'SelfCons.' },
    { id:'a6',  name:'Inspector',        role:'Control',       status:'active',  formula:'Reflexion' },
    { id:'a7',  name:'Evaluator',        role:'Control',       status:'active',  formula:'CoVe' },
    { id:'a8',  name:'Guard',            role:'Control',       status:'active',  formula:'ReAct' },
    { id:'a9',  name:'Executor-A',       role:'Execution',     status:'active',  formula:'ReAct' },
    { id:'a10', name:'Executor-B',       role:'Execution',     status:'active',  formula:'MoA' },
    { id:'a11', name:'Debugger',         role:'Execution',     status:'idle',    formula:'SelfRef.' },
    { id:'a12', name:'Tester',           role:'Execution',     status:'active',  formula:'PoT' },
    { id:'a13', name:'Coder',            role:'Execution',     status:'active',  formula:'PoT' },
    { id:'a14', name:'Archivist',        role:'Memory',        status:'active',  formula:'CoT' },
    { id:'a15', name:'RAG-Specialist',   role:'Memory',        status:'active',  formula:'AoT' },
    { id:'a16', name:'Context-Manager',  role:'Memory',        status:'standby', formula:'SoT' },
    { id:'a17', name:'Observer',         role:'Monitoring',    status:'active',  formula:'CoT' },
    { id:'a18', name:'Alert-Operator',   role:'Monitoring',    status:'paused',  formula:'LATS' },
    { id:'a19', name:'Diagnostician',    role:'Monitoring',    status:'active',  formula:'GoT' },
    { id:'a20', name:'Gateway',          role:'Communication', status:'active',  formula:'PromptCh.' },
    { id:'a21', name:'Protocolist',      role:'Communication', status:'active',  formula:'StepBack' },
    { id:'a22', name:'Dispatcher',       role:'Communication', status:'active',  formula:'PlanSolve' },
    { id:'a23', name:'Trainer',          role:'Learning',      status:'active',  formula:'DSPy' },
    { id:'a24', name:'Adapter',          role:'Learning',      status:'active',  formula:'MetaCoT' },
    { id:'a25', name:'Scorer',           role:'Learning',      status:'idle',    formula:'Least2Most' }
  ];

  // -- Edges (command=parent->child, sync=siblings, twin) --
  var edges = [
    // Command edges (parent -> child within group)
    { from:'a0',  to:'a1',  type:'command' },  // Architect -> Analyst
    { from:'a0',  to:'a2',  type:'command' },  // Architect -> Visionary
    { from:'a3',  to:'a4',  type:'command' },  // Coordinator -> Planner
    { from:'a3',  to:'a5',  type:'command' },  // Coordinator -> Communicator
    { from:'a6',  to:'a7',  type:'command' },  // Inspector -> Evaluator
    { from:'a6',  to:'a8',  type:'command' },  // Inspector -> Guard
    { from:'a9',  to:'a12', type:'command' },  // Executor-A -> Tester
    { from:'a9',  to:'a13', type:'command' },  // Executor-A -> Coder
    { from:'a14', to:'a15', type:'command' },  // Archivist -> RAG-Specialist
    { from:'a14', to:'a16', type:'command' },  // Archivist -> Context-Manager
    { from:'a17', to:'a18', type:'command' },  // Observer -> Alert-Operator
    { from:'a17', to:'a19', type:'command' },  // Observer -> Diagnostician
    { from:'a20', to:'a21', type:'command' },  // Gateway -> Protocolist
    { from:'a20', to:'a22', type:'command' },  // Gateway -> Dispatcher
    { from:'a23', to:'a24', type:'command' },  // Trainer -> Adapter
    { from:'a23', to:'a25', type:'command' },  // Trainer -> Scorer
    // Sync edges (siblings with same parent)
    { from:'a1',  to:'a2',  type:'sync' },
    { from:'a4',  to:'a5',  type:'sync' },
    { from:'a7',  to:'a8',  type:'sync' },
    { from:'a12', to:'a13', type:'sync' },
    { from:'a15', to:'a16', type:'sync' },
    { from:'a18', to:'a19', type:'sync' },
    { from:'a21', to:'a22', type:'sync' },
    { from:'a24', to:'a25', type:'sync' },
    // Twin edges
    { from:'a9',  to:'a10', type:'twin' }
  ];

  // Add animated particles to edges
  edges.forEach(function(e) {
    e.particles = [
      { t: Math.random(), sizeMul: 1 },
      { t: (Math.random() + 0.33) % 1, sizeMul: 0.85 },
      { t: (Math.random() + 0.66) % 1, sizeMul: 0.7 }
    ];
  });

  var nodeMap = {};
  agents.forEach(function(a) { nodeMap[a.id] = a; });

  // -- Layout computation (dagre-like TB by role level) --
  var nodePositions = {}; // { id: { x, y } }

  function computeLayout() {
    var layers = { 0:[], 1:[], 2:[], 3:[], 4:[] };
    agents.forEach(function(a) {
      var cfg = ROLE[a.role];
      var level = cfg ? cfg.level : 4;
      layers[level].push(a);
    });
    var padX = 50, padTop = 35, rowH = (H - padTop * 2) / 5;
    for (var lv = 0; lv <= 4; lv++) {
      var arr = layers[lv];
      if (!arr.length) continue;
      var totalW = arr.length * 80;
      var gap = Math.min(30, (W - totalW) / Math.max(arr.length - 1, 1));
      var span = totalW + (arr.length - 1) * gap;
      var startX = (W - span) / 2;
      for (var i = 0; i < arr.length; i++) {
        nodePositions[arr[i].id] = { x: startX + i * (80 + gap) + 40, y: padTop + lv * rowH + rowH / 2 };
      }
    }
  }
  computeLayout();

  // -- Interaction --
  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    mouseCanvas.x = (mx / W - 0.5) * 2;
    mouseCanvas.y = (my / H - 0.5) * 2;
    if (dragNode) {
      var p = nodePositions[dragNode];
      if (p) { p.x = mx - dragOffset.x; p.y = my - dragOffset.y; }
    } else {
      hoveredNode = null;
      for (var i = agents.length - 1; i >= 0; i--) {
        var a = agents[i], pos = nodePositions[a.id];
        if (!pos) continue;
        var dx = mx - pos.x, dy = my - pos.y;
        if (dx*dx + dy*dy < 18*18) { hoveredNode = a.id; break; }
      }
      canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    }
  });
  canvas.addEventListener('mouseleave', function() { mouseCanvas.x = 0; mouseCanvas.y = 0; dragNode = null; hoveredNode = null; });
  canvas.addEventListener('mousedown', function(e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    if (hoveredNode) {
      dragNode = hoveredNode;
      var p = nodePositions[dragNode];
      dragOffset = { x: mx - p.x, y: my - p.y };
      canvas.style.cursor = 'grabbing';
    }
  });
  canvas.addEventListener('mouseup', function() { dragNode = null; });
  canvas.addEventListener('dblclick', function() { computeLayout(); });

  var hoveredNode = null, dragNode = null, dragOffset = { x: 0, y: 0 };

  // -- Parallax per layer --
  function px(layer) {
    var factors = { 0: 2, 1: 5, 2: 10, 3: 18 };
    return { x: mouseCanvas.x * (factors[layer] || 0), y: mouseCanvas.y * (factors[layer] || 0) };
  }

  // -- Background stars --
  var stars = [];
  for (var i = 0; i < 80; i++) {
    stars.push({ x: Math.random(), y: Math.random(), r: Math.random()*0.8+0.2, a: Math.random()*0.3+0.05, speed: Math.random()*0.4+0.1 });
  }

  var time = 0;

  function render() {
    time += 0.016;
    ctx.clearRect(0, 0, W, H);

    // -- LAYER 0: Stars --
    var p0 = px(0);
    ctx.save(); ctx.translate(p0.x, p0.y);
    for (var si = 0; si < stars.length; si++) {
      var s = stars[si];
      var twinkle = 0.5 + 0.5 * Math.sin(time * s.speed * 3 + si);
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6,182,212,' + (s.a * twinkle) + ')';
      ctx.fill();
    }
    ctx.restore();

    // -- LAYER 1: Dot grid (React Flow style) --
    var p1 = px(1);
    ctx.save(); ctx.translate(p1.x, p1.y);
    var dotGap = 40;
    for (var gy = 0; gy < H; gy += dotGap) {
      for (var gx = 0; gx < W; gx += dotGap) {
        ctx.beginPath();
        ctx.arc(gx, gy, 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(51,51,51,0.3)';
        ctx.fill();
      }
    }
    ctx.restore();

    // -- Compute connected set for hover --
    var connected = {};
    if (hoveredNode) {
      connected[hoveredNode] = true;
      edges.forEach(function(e) {
        if (e.from === hoveredNode) connected[e.to] = true;
        if (e.to === hoveredNode) connected[e.from] = true;
      });
    }

    // -- LAYER 2: Edges --
    var p2 = px(2);
    ctx.save(); ctx.translate(p2.x, p2.y);
    edges.forEach(function(e) {
      var fromPos = nodePositions[e.from], toPos = nodePositions[e.to];
      if (!fromPos || !toPos) return;
      var eCfg = EDGE_CFG[e.type];
      var alpha = hoveredNode ? (connected[e.from] && connected[e.to] ? 0.7 : 0.06) : 0.3;
      var lw = hoveredNode ? (connected[e.from] && connected[e.to] ? 1.2 : 0.3) : 0.6;

      // Smooth-step path (like React Flow)
      var midY = (fromPos.y + toPos.y) / 2;
      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y + 14);
      ctx.bezierCurveTo(fromPos.x, midY, toPos.x, midY, toPos.x, toPos.y - 14);
      ctx.strokeStyle = hexRGBA(eCfg.color, alpha);
      ctx.lineWidth = lw;
      if (eCfg.dash) ctx.setLineDash(eCfg.dash.split(' ').map(Number));
      else ctx.setLineDash([]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glow line
      if (hoveredNode && connected[e.from] && connected[e.to]) {
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y + 14);
        ctx.bezierCurveTo(fromPos.x, midY, toPos.x, midY, toPos.x, toPos.y - 14);
        ctx.strokeStyle = hexRGBA(eCfg.color, 0.08);
        ctx.lineWidth = 5;
        ctx.stroke();
      }

      // Animated particles along edge
      if (alpha > 0.1) {
        e.particles.forEach(function(p) {
          var dur = e.type === 'sync' ? 5 : e.type === 'twin' ? 4 : 3;
          p.t += 0.016 / dur;
          if (p.t > 1) p.t -= 1;
          var t = p.t, mt = 1 - t;
          var px2 = mt*mt*mt*fromPos.x + 3*mt*mt*t*fromPos.x + 3*mt*t*t*toPos.x + t*t*t*toPos.x;
          var py2 = mt*mt*mt*(fromPos.y+14) + 3*mt*mt*t*midY + 3*mt*t*t*midY + t*t*t*(toPos.y-14);
          var pAlpha = alpha * (0.4 + 0.3 * Math.sin(time * 4));
          // Trail
          ctx.beginPath(); ctx.arc(px2, py2, 4 * p.sizeMul, 0, Math.PI * 2);
          ctx.fillStyle = hexRGBA(eCfg.color, pAlpha * 0.15);
          ctx.fill();
          // Core
          ctx.beginPath(); ctx.arc(px2, py2, 1.5 * p.sizeMul, 0, Math.PI * 2);
          ctx.fillStyle = hexRGBA(eCfg.color, pAlpha);
          ctx.fill();
        });
      }
    });
    ctx.restore();

    // -- LAYER 3: Nodes --
    var p3 = px(3);
    ctx.save(); ctx.translate(p3.x, p3.y);
    agents.forEach(function(a) {
      var pos = nodePositions[a.id];
      if (!pos) return;
      var cfg = ROLE[a.role];
      var statusCol = STATUS_COL[a.status] || STATUS_COL.offline;
      var alpha = hoveredNode ? (connected[a.id] ? 1 : 0.1) : 0.9;
      var isHovered = hoveredNode === a.id;
      var orbR = 13;

      // Outer glow
      var grad = ctx.createRadialGradient(pos.x, pos.y, orbR * 0.5, pos.x, pos.y, orbR * 2.5);
      grad.addColorStop(0, hexRGBA(cfg.color, 0.08 * alpha));
      grad.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(pos.x - orbR * 3, pos.y - orbR * 3, orbR * 6, orbR * 6);

      // Pulse ring for hovered
      if (isHovered) {
        var pulse = 0.5 + 0.5 * Math.sin(time * 5);
        ctx.beginPath(); ctx.arc(pos.x, pos.y, orbR + 5 + pulse * 3, 0, Math.PI * 2);
        ctx.strokeStyle = hexRGBA(cfg.color, 0.25 * pulse);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Outer ring (breathing)
      var breathR = orbR + 2 + 0.5 * Math.sin(time * 1.5 + a.id.charCodeAt(1) * 0.3);
      ctx.beginPath(); ctx.arc(pos.x, pos.y, breathR, 0, Math.PI * 2);
      ctx.fillStyle = hexRGBA(cfg.color, 0.1 * alpha);
      ctx.fill();
      ctx.strokeStyle = hexRGBA(cfg.color, 0.15 * alpha);
      ctx.lineWidth = 0.3;
      ctx.stroke();

      // Inner orb
      ctx.beginPath(); ctx.arc(pos.x, pos.y, orbR, 0, Math.PI * 2);
      ctx.fillStyle = hexRGBA(cfg.color, 0.06 * alpha);
      ctx.fill();
      ctx.strokeStyle = hexRGBA(cfg.color, 0.7 * alpha);
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Avatar icon placeholder (small letter)
      ctx.font = '600 7px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = hexRGBA(cfg.color, 0.7 * alpha);
      ctx.fillText(a.name.charAt(0), pos.x, pos.y);

      // Formula badge (top)
      ctx.font = '700 5.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      var badgeW = ctx.measureText(a.formula).width + 6;
      var badgeX = pos.x - badgeW / 2, badgeY = pos.y - orbR - 8;
      ctx.fillStyle = hexRGBA(cfg.color, 0.12 * alpha);
      ctx.strokeStyle = hexRGBA(cfg.color, 0.25 * alpha);
      ctx.lineWidth = 0.3;
      roundRect(ctx, badgeX, badgeY, badgeW, 10, 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = hexRGBA(cfg.color, 0.7 * alpha);
      ctx.fillText(a.formula, pos.x, badgeY + 7);

      // Status dot (top-right)
      var statusPulse = a.status === 'active' ? (0.6 + 0.4 * Math.sin(time * 2.5 + a.id.charCodeAt(1))) : 0.7;
      ctx.beginPath(); ctx.arc(pos.x + orbR - 2, pos.y - orbR + 2, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = hexRGBA(statusCol, statusPulse * alpha);
      ctx.fill();
      // Status glow
      if (a.status === 'active') {
        ctx.beginPath(); ctx.arc(pos.x + orbR - 2, pos.y - orbR + 2, 5, 0, Math.PI * 2);
        ctx.fillStyle = hexRGBA(statusCol, 0.12 * alpha);
        ctx.fill();
      }

      // Name label (bottom)
      ctx.font = '600 7.5px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = hexRGBA('#FFFFFF', 0.85 * alpha);
      ctx.fillText(a.name, pos.x, pos.y + orbR + 12);
      // Role group (dimmer, below name)
      ctx.font = '400 5.5px Inter, sans-serif';
      ctx.fillStyle = hexRGBA('#B0B0B0', 0.4 * alpha);
      ctx.fillText(a.role, pos.x, pos.y + orbR + 20);
    });
    ctx.restore();

    // -- MiniMap (drawn directly on canvas in bottom-right) --
    var mmW = 140, mmH = 100;
    var mmX = W - mmW - 12, mmY = H - mmH - 12;
    // Background
    ctx.fillStyle = 'rgba(10,10,10,0.88)';
    ctx.strokeStyle = 'rgba(51,51,51,0.5)';
    ctx.lineWidth = 1;
    roundRect(ctx, mmX, mmY, mmW, mmH, 6);
    ctx.fill(); ctx.stroke();
    // Scale
    var mmScale = Math.min((mmW - 16) / W, (mmH - 24) / H);
    var mmOx = mmX + (mmW - W * mmScale) / 2;
    var mmOy = mmY + 14 + (mmH - 14 - H * mmScale) / 2;
    // Title
    ctx.font = '600 6px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(85,85,85,1)';
    ctx.fillText('OVERVIEW', mmX + 6, mmY + 9);
    ctx.textAlign = 'right';
    ctx.fillText('100%', mmX + mmW - 6, mmY + 9);
    // Edges on minimap
    edges.forEach(function(e) {
      var fp = nodePositions[e.from], tp = nodePositions[e.to];
      if (!fp || !tp) return;
      var eCfg = EDGE_CFG[e.type];
      ctx.beginPath();
      ctx.moveTo(mmOx + fp.x * mmScale, mmOy + fp.y * mmScale);
      ctx.lineTo(mmOx + tp.x * mmScale, mmOy + tp.y * mmScale);
      ctx.strokeStyle = hexRGBA(eCfg.color, 0.2);
      ctx.lineWidth = 0.2;
      ctx.stroke();
    });
    // Nodes on minimap
    agents.forEach(function(a) {
      var pos = nodePositions[a.id];
      if (!pos) return;
      var cfg = ROLE[a.role];
      ctx.beginPath();
      ctx.arc(mmOx + pos.x * mmScale, mmOy + pos.y * mmScale, hoveredNode === a.id ? 2.5 : 1.2, 0, Math.PI * 2);
      ctx.fillStyle = hoveredNode === a.id ? '#FFFFFF' : hexRGBA(cfg.color, 0.8);
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  // Rounded rect helper
  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  }

  render();
})();"""

content = content[:idx_start] + new_js + content[idx_end + len(old_js_end):]

with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! Hierarchy graph rewritten with 26 agents, proper edges, particles, MiniMap, and depth layers.")