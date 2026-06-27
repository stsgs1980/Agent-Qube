#!/usr/bin/env python3
"""Generate showcase.html for Agent Qube - pure ASCII, real UI recreation."""

import math

HTML = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Agent Qube -- Showcase</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --bg: #050505;
  --bg0: #000;
  --bg1: #0D0D0D;
  --bg2: #0A0A0A;
  --bg3: #111;
  --card: rgba(20,20,20,0.7);
  --card2: rgba(45,45,45,0.3);
  --border: rgba(51,51,51,0.4);
  --border2: rgba(51,51,51,0.25);
  --cyan: #06B6D4;
  --cyan4: #22D3EE;
  --cyan6: #0891B2;
  --cyan7: #0E7490;
  --purple: #8B5CF6;
  --green: #22C55E;
  --yellow: #EAB308;
  --red: #EF4444;
  --rose: #F43F5E;
  --slate: #64748B;
  --txt: #e4e4e7;
  --txt2: #B0B0B0;
  --txt3: #555;
  --radius: 10px;
  --font: 'Inter', -apple-system, sans-serif;
  --mono: 'JetBrains Mono', monospace;
}
html { scroll-behavior: smooth; }
body { font-family: var(--font); background: var(--bg); color: var(--txt); overflow-x: hidden; line-height: 1.6; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.15); border-radius: 3px; }

/* == HERO == */
.hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }
#hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.hero-content { position: relative; z-index: 1; text-align: center; padding: 2rem; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border: 1px solid var(--border); border-radius: 100px; font-size: 0.75rem; font-family: var(--mono); color: var(--cyan); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 2rem; background: rgba(6,182,212,0.05); }
.hero-badge .dot { width: 6px; height: 6px; background: var(--cyan); border-radius: 50%; animation: pulse-dot 2s ease-in-out infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1;box-shadow:0 0 4px var(--cyan)} 50%{opacity:0.3;box-shadow:none} }
.hero h1 { font-size: clamp(2.5rem,6vw,5rem); font-weight: 800; letter-spacing: -2px; line-height: 1.1; margin-bottom: 1rem; background: linear-gradient(135deg,#fff 0%,var(--cyan) 50%,var(--purple) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero h1 .blink { display: inline-block; width: 3px; height: 0.85em; background: var(--cyan); margin-left: 4px; vertical-align: text-bottom; animation: blink 1s step-end infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
.hero-sub { font-size: clamp(1rem,2vw,1.25rem); color: var(--txt3); max-width: 600px; margin: 0 auto 2.5rem; font-weight: 300; }
.hero-cta { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: var(--cyan); color: #000; font-weight: 600; font-size: 0.9rem; border: none; border-radius: 8px; cursor: pointer; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 0 20px rgba(6,182,212,0.3); }
.hero-cta:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(6,182,212,0.5); }
.scroll-hint { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 1; animation: float 3s ease-in-out infinite; color: var(--txt3); font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; font-family: var(--mono); }
@keyframes float { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-8px)} }
.scroll-hint svg { display: block; margin: 8px auto 0; }

/* == STATS == */
.stats-bar { display: grid; grid-template-columns: repeat(4,1fr); max-width: 900px; margin: -4rem auto 0; position: relative; z-index: 2; padding: 0 1rem; }
.stat-item { text-align: center; padding: 1.5rem 1rem; border: 1px solid var(--border); background: var(--bg1); }
.stat-item:first-child { border-radius: var(--radius) 0 0 var(--radius); }
.stat-item:last-child { border-radius: 0 var(--radius) var(--radius) 0; }
.stat-item:hover { border-color: rgba(6,182,212,0.3); background: rgba(15,15,15,1); }
.stat-number { font-family: var(--mono); font-size: 2rem; font-weight: 700; color: var(--cyan); line-height: 1; }
.stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--txt3); margin-top: 6px; }

/* == SECTION COMMON == */
.section { max-width: 1200px; margin: 0 auto; padding: 6rem 1.5rem; }
.section-label { font-family: var(--mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 3px; color: var(--cyan); margin-bottom: 0.75rem; }
.section-title { font-size: clamp(1.75rem,3vw,2.5rem); font-weight: 700; letter-spacing: -1px; margin-bottom: 1rem; }
.section-desc { color: var(--txt3); max-width: 600px; font-size: 1rem; line-height: 1.7; }

/* == APP FRAME (shared) == */
.app-frame { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: var(--bg0); }
.app-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: var(--bg1); border-bottom: 1px solid var(--border); position: relative; }
.app-header::before { content:''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,transparent,rgba(6,182,212,0.4),transparent); }
.app-logo { display: flex; align-items: center; gap: 8px; }
.app-logo-icon { width: 28px; height: 28px; border-radius: 6px; background: rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.25); display: flex; align-items: center; justify-content: center; color: var(--cyan); font-weight: 800; font-size: 12px; }
.app-logo-text { font-size: 12px; font-weight: 700; color: var(--cyan); }
.app-logo-text span { color: #fff; }
.app-live { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 100px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); }
.app-live .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: pulse-dot 2s ease-in-out infinite; }
.app-live span { font-size: 7px; font-weight: 700; color: var(--green); letter-spacing: 1px; }
.header-btn { padding: 3px 10px; border-radius: 5px; background: rgba(6,182,212,0.06); border: 1px solid rgba(6,182,212,0.15); color: var(--cyan); font-size: 9px; font-weight: 600; cursor: default; }

/* == DASHBOARD RECREATION == */
.dash-body { display: flex; min-height: 480px; }
.dash-sidebar { width: 200px; flex-shrink: 0; background: var(--bg1); border-right: 1px solid var(--border); padding: 12px 10px; overflow: hidden; }
.dash-sidebar-title { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--slate); padding: 0 6px; margin-bottom: 8px; }
.role-group { padding: 3px 6px; margin-bottom: 2px; border-radius: 4px; font-size: 9px; display: flex; align-items: center; gap: 6px; }
.role-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.role-name { color: var(--txt2); font-weight: 500; }
.role-count { color: var(--txt3); font-size: 8px; margin-left: auto; }
.agent-item { display: flex; align-items: center; gap: 6px; padding: 3px 6px 3px 18px; border-radius: 4px; font-size: 10px; color: var(--txt3); }
.agent-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.dash-main { flex: 1; padding: 14px; overflow: hidden; }

/* KPI strip */
.kpi-strip { display: grid; grid-template-columns: repeat(5,1fr); gap: 10px; margin-bottom: 14px; }
.kpi-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 14px; position: relative; overflow: hidden; }
.kpi-card::before { content:''; position: absolute; top: 0; left: 0; right: 0; height: 1px; }
.kpi-label { font-size: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--slate); margin-bottom: 4px; }
.kpi-value { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
.kpi-change { font-size: 8px; margin-top: 2px; }

/* Cards grid */
.dash-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 14px; }
.dash-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; position: relative; }
.dash-card-title { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--slate); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.dash-card-title svg { width: 12px; height: 12px; }

/* Donut chart */
.donut-wrap { display: flex; align-items: center; gap: 14px; }
.donut-center { position: absolute; text-align: center; }
.donut-center .val { font-size: 20px; font-weight: 800; color: #fff; }
.donut-center .lbl { font-size: 8px; color: var(--slate); }
.donut-legend { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; }
.legend-item { display: flex; align-items: center; gap: 5px; font-size: 9px; }
.legend-dot { width: 6px; height: 6px; border-radius: 50%; }
.legend-label { color: var(--txt2); }
.legend-count { font-weight: 700; margin-left: auto; }

/* Health bars */
.health-bar-wrap { margin-bottom: 10px; }
.health-bar-header { display: flex; justify-content: space-between; font-size: 9px; margin-bottom: 4px; }
.health-bar-label { color: var(--txt2); }
.health-bar-val { font-weight: 700; }
.health-bar-track { height: 18px; background: rgba(255,255,255,0.04); border-radius: 3px; overflow: hidden; }
.health-bar-fill { height: 100%; border-radius: 3px; transition: width 1.5s ease; }

/* Performer bar */
.perf-row { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.perf-rank { width: 40px; text-align: right; font-size: 8px; color: var(--txt3); }
.perf-name { width: 70px; text-align: right; font-size: 9px; font-weight: 600; }
.perf-bar { flex: 1; height: 20px; background: rgba(255,255,255,0.03); border-radius: 2px; overflow: hidden; }
.perf-bar-fill { height: 100%; border-radius: 2px; }
.perf-score { width: 28px; text-align: right; font-size: 9px; font-weight: 800; }

/* Bottom grid */
.dash-grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 10px; }

/* Chart area */
.chart-area { width: 100%; height: 120px; position: relative; margin-top: 8px; }
.chart-area svg { width: 100%; height: 100%; }

/* Timeline */
.timeline-item { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
.timeline-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
.timeline-content { flex: 1; }
.timeline-time { font-size: 8px; color: var(--txt3); font-family: var(--mono); }
.timeline-agent { font-size: 9px; font-weight: 600; }
.timeline-desc { font-size: 9px; color: var(--slate); }

/* == HIERARCHY SECTION == */
.hier-section { background: linear-gradient(180deg,var(--bg) 0%,rgba(6,182,212,0.02) 50%,var(--bg) 100%); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 6rem 0; }
.hier-container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; text-align: center; }

.demo-wrapper { position: relative; width: 100%; height: 550px; margin-top: 2rem; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); transition: border-color 0.3s; perspective: 1200px; }
.demo-wrapper:hover { border-color: rgba(6,182,212,0.3); }
#demo-canvas { position: absolute; inset: 0; width: 100%; height: 100%; cursor: grab; }
.demo-vignette { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at center,transparent 40%,rgba(5,5,5,0.7) 100%); z-index: 2; }
.demo-scanlines { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px); z-index: 3; }
.demo-depth-label { position: absolute; bottom: 12px; right: 16px; font-family: var(--mono); font-size: 0.6rem; color: rgba(6,182,212,0.3); letter-spacing: 2px; z-index: 4; pointer-events: none; }
.demo-hint { font-family: var(--mono); font-size: 0.7rem; color: var(--txt3); margin-top: 1rem; letter-spacing: 1px; }

/* == WORKFLOWS RECREATION == */
.wf-body { display: flex; min-height: 400px; }
.wf-sidebar { width: 200px; flex-shrink: 0; background: var(--bg1); border-right: 1px solid var(--border); padding: 12px 10px; overflow: hidden; }
.wf-stat-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 9px; }
.wf-stat-label { color: var(--slate); }
.wf-stat-val { font-weight: 700; }
.wf-filter-btn { width: 100%; display: flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 4px; font-size: 9px; color: var(--txt3); margin-bottom: 2px; }
.wf-filter-btn.active { background: rgba(6,182,212,0.1); color: var(--cyan); }
.wf-main { flex: 1; padding: 14px; overflow: hidden; }
.wf-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.wf-card { background: var(--card2); border: 1px solid rgba(51,51,51,0.5); border-radius: 12px; padding: 14px; transition: border-color 0.3s, box-shadow 0.3s; }
.wf-card:hover { border-color: rgba(6,182,212,0.3); box-shadow: 0 0 20px rgba(6,182,212,0.08); }
.wf-card-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px; }
.wf-card-name { font-size: 11px; font-weight: 600; color: #fff; }
.wf-card-desc { font-size: 9px; color: var(--slate); margin-bottom: 8px; line-height: 1.4; }
.wf-status { font-size: 7px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 2px 6px; border-radius: 3px; }
.wf-status.active { background: rgba(6,182,212,0.15); color: var(--cyan); }
.wf-status.draft { background: rgba(100,116,139,0.15); color: var(--slate); }
.wf-status.paused { background: rgba(234,179,8,0.15); color: var(--yellow); }
.wf-card-stats { display: flex; gap: 10px; margin-bottom: 8px; }
.wf-card-stat { font-size: 8px; color: var(--slate); display: flex; align-items: center; gap: 3px; }
.wf-pipeline { display: flex; align-items: center; gap: 0; margin-bottom: 8px; }
.wf-pipeline-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.wf-pipeline-line { width: 12px; height: 1px; background: rgba(255,255,255,0.1); flex-shrink: 0; }
.wf-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.wf-tag { font-size: 7px; padding: 1px 5px; border-radius: 3px; background: rgba(6,182,212,0.08); color: var(--cyan6); border: 1px solid rgba(6,182,212,0.1); }

/* == TECH STACK == */
.tech-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(140px,1fr)); gap: 1rem; margin-top: 2.5rem; }
.tech-card { padding: 1.25rem; border: 1px solid var(--border); border-radius: 10px; background: var(--bg1); text-align: center; transition: all 0.3s ease; cursor: default; }
.tech-card:hover { border-color: rgba(6,182,212,0.3); transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
.tech-card .icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
.tech-card .name { font-family: var(--mono); font-size: 0.75rem; font-weight: 600; color: var(--txt); }
.tech-card .kind { font-size: 0.65rem; color: var(--txt3); margin-top: 2px; }

/* == FOOTER == */
.footer { text-align: center; padding: 3rem 1.5rem; border-top: 1px solid var(--border); font-size: 0.75rem; color: var(--txt3); font-family: var(--mono); }

/* == SCROLL REVEAL == */
.reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-d1 { transition-delay: 0.15s; }
.reveal-d2 { transition-delay: 0.3s; }

/* == RESPONSIVE == */
@media (max-width: 768px) {
  .stats-bar { grid-template-columns: repeat(2,1fr); margin-top: -2rem; }
  .dash-sidebar, .wf-sidebar { display: none; }
  .kpi-strip { grid-template-columns: repeat(3,1fr); }
  .dash-grid { grid-template-columns: 1fr; }
  .dash-grid-2 { grid-template-columns: 1fr; }
  .wf-grid { grid-template-columns: 1fr; }
  .demo-wrapper { height: 350px; }
}
</style>
</head>
<body>

<!-- ===== HERO ===== -->
<section class="hero">
  <canvas id="hero-canvas"></canvas>
  <div class="hero-content">
    <div class="hero-badge"><span class="dot"></span> System Online</div>
    <h1>Agent Qube<span class="blink"></span></h1>
    <p class="hero-sub">Unified platform for managing AI agent hierarchies, orchestrating workflows, and engineering prompts -- in real time.</p>
    <a href="#dashboard" class="hero-cta">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
      Explore the System
    </a>
  </div>
  <div class="scroll-hint">Scroll<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg></div>
</section>

<!-- ===== STATS ===== -->
<div class="stats-bar reveal">
  <div class="stat-item"><div class="stat-number" data-target="26">0</div><div class="stat-label">Total Agents</div></div>
  <div class="stat-item"><div class="stat-number" data-target="16">0</div><div class="stat-label">Active Now</div></div>
  <div class="stat-item"><div class="stat-number" data-target="5">0</div><div class="stat-label">Workflows</div></div>
  <div class="stat-item"><div class="stat-number" data-target="8">0</div><div class="stat-label">Role Groups</div></div>
</div>

<!-- ===== DASHBOARD ===== -->
<section class="section" id="dashboard">
  <div class="reveal">
    <div class="section-label">// 01</div>
    <h2 class="section-title">Dashboard</h2>
    <p class="section-desc">Central command view -- monitor agent health, track execution metrics, and manage the entire fleet from a single pane of glass.</p>
  </div>
  <div class="app-frame reveal reveal-d1" style="margin-top:2rem">
    <!-- Header -->
    <div class="app-header">
      <div class="app-logo">
        <div class="app-logo-icon">Q</div>
        <div class="app-logo-text">Agent <span>Qube</span></div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="app-live"><div class="dot"></div><span>LIVE</span></div>
        <div class="header-btn">Hierarchy</div>
        <div class="header-btn" style="background:rgba(8,145,178,0.12);border-color:rgba(8,145,178,0.3);color:#0891B2">Workflows</div>
      </div>
    </div>
    <!-- Body -->
    <div class="dash-body">
      <!-- Sidebar -->
      <div class="dash-sidebar">
        <div class="dash-sidebar-title">AGENT NAVIGATION</div>
        <!-- Strategy -->
        <div class="role-group" style="background:rgba(103,232,249,0.07)">
          <div class="role-dot" style="background:#67E8F9"></div>
          <span class="role-name" style="color:#67E8F9">Strategy</span>
          <span class="role-count">3</span>
        </div>
        <div class="agent-item"><div class="agent-dot" style="background:#22D3EE;box-shadow:0 0 4px #22D3EE"></div>Architect</div>
        <div class="agent-item"><div class="agent-dot" style="background:#22D3EE;box-shadow:0 0 4px #22D3EE"></div>Analyst</div>
        <div class="agent-item"><div class="agent-dot" style="background:#22D3EE;box-shadow:0 0 4px #22D3EE"></div>Visionary</div>
        <!-- Tactics -->
        <div class="role-group" style="background:rgba(34,211,238,0.07);margin-top:6px">
          <div class="role-dot" style="background:#22D3EE"></div>
          <span class="role-name" style="color:#22D3EE">Tactics</span>
          <span class="role-count">3</span>
        </div>
        <div class="agent-item"><div class="agent-dot" style="background:#22D3EE;box-shadow:0 0 4px #22D3EE"></div>Coordinator</div>
        <div class="agent-item"><div class="agent-dot" style="background:#64748B"></div>Planner</div>
        <div class="agent-item"><div class="agent-dot" style="background:#22D3EE;box-shadow:0 0 4px #22D3EE"></div>Communicator</div>
        <!-- Control -->
        <div class="role-group" style="background:rgba(6,182,212,0.07);margin-top:6px">
          <div class="role-dot" style="background:#06B6D4"></div>
          <span class="role-name" style="color:#06B6D4">Control</span>
          <span class="role-count">3</span>
        </div>
        <div class="agent-item"><div class="agent-dot" style="background:#22D3EE;box-shadow:0 0 4px #22D3EE"></div>Inspector</div>
        <div class="agent-item"><div class="agent-dot" style="background:#22D3EE;box-shadow:0 0 4px #22D3EE"></div>Evaluator</div>
        <div class="agent-item"><div class="agent-dot" style="background:#EAB308"></div>Guard</div>
        <!-- Execution -->
        <div class="role-group" style="background:rgba(6,182,212,0.07);margin-top:6px">
          <div class="role-dot" style="background:#06B6D4"></div>
          <span class="role-name" style="color:#06B6D4">Execution</span>
          <span class="role-count">5</span>
        </div>
        <div class="agent-item"><div class="agent-dot" style="background:#22D3EE;box-shadow:0 0 4px #22D3EE"></div>Executor-A</div>
        <div class="agent-item"><div class="agent-dot" style="background:#22D3EE;box-shadow:0 0 4px #22D3EE"></div>Executor-B</div>
        <!-- more groups abbreviated -->
        <div style="margin-top:6px;padding:4px 6px;font-size:8px;color:var(--txt3)">+ 4 more groups...</div>
      </div>
      <!-- Main -->
      <div class="dash-main">
        <!-- KPI Strip -->
        <div class="kpi-strip">
          <div class="kpi-card" style="--c:#06B6D4"><div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,0.4),transparent)"></div><div class="kpi-label">Total Agents</div><div class="kpi-value" style="color:var(--c)">26</div><div class="kpi-change" style="color:var(--c)">+2 this week</div></div>
          <div class="kpi-card" style="--c:#22D3EE"><div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(34,211,238,0.4),transparent)"></div><div class="kpi-label">Active Now</div><div class="kpi-value" style="color:var(--c)">16</div><div class="kpi-change" style="color:var(--slate)">4 idle / 1 paused</div></div>
          <div class="kpi-card" style="--c:#0891B2"><div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(8,145,178,0.4),transparent)"></div><div class="kpi-label">Tasks Running</div><div class="kpi-value" style="color:var(--c)">12</div><div class="kpi-change" style="color:var(--slate)">187 completed</div></div>
          <div class="kpi-card" style="--c:#22D3EE"><div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(34,211,238,0.4),transparent)"></div><div class="kpi-label">Success Rate</div><div class="kpi-value" style="color:var(--c)">94.7%</div><div class="kpi-change" style="color:#22C55E">+0.3%</div></div>
          <div class="kpi-card" style="--c:#B0B0B0"><div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(176,176,176,0.2),transparent)"></div><div class="kpi-label">Avg Response</div><div class="kpi-value" style="color:var(--c)">1.2s</div><div class="kpi-change" style="color:#22C55E">-0.3s</div></div>
        </div>
        <!-- Row 1: 3 cards -->
        <div class="dash-grid">
          <!-- Status Distribution -->
          <div class="dash-card">
            <div class="dash-card-title"><svg viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-8"/></svg> STATUS DISTRIBUTION</div>
            <div class="donut-wrap">
              <svg width="120" height="120" viewBox="0 0 120 120" style="flex-shrink:0">
                <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="12"/>
                <!-- Active 21/26 = 80.8% -->
                <circle cx="60" cy="60" r="40" fill="none" stroke="#22D3EE" stroke-width="12" stroke-dasharray="203 50.3" stroke-dashoffset="0" transform="rotate(-90 60 60)" stroke-linecap="round"/>
                <!-- Idle 3/26 = 11.5% -->
                <circle cx="60" cy="60" r="40" fill="none" stroke="#64748B" stroke-width="12" stroke-dasharray="28.9 224.4" stroke-dashoffset="-203" transform="rotate(-90 60 60)" stroke-linecap="round"/>
                <!-- Paused 1 -->
                <circle cx="60" cy="60" r="40" fill="none" stroke="#EAB308" stroke-width="12" stroke-dasharray="9.6 243.7" stroke-dashoffset="-231.9" transform="rotate(-90 60 60)" stroke-linecap="round"/>
                <!-- Standby 1 -->
                <circle cx="60" cy="60" r="40" fill="none" stroke="#8B5CF6" stroke-width="12" stroke-dasharray="9.6 243.7" stroke-dashoffset="-241.5" transform="rotate(-90 60 60)" stroke-linecap="round"/>
                <text x="60" y="57" text-anchor="middle" fill="#fff" font-size="20" font-weight="800">26</text>
                <text x="60" y="70" text-anchor="middle" fill="#64748B" font-size="8" font-weight="600">AGENTS</text>
              </svg>
              <div class="donut-legend">
                <div class="legend-item"><div class="legend-dot" style="background:#22D3EE"></div><span class="legend-label">Active</span><span class="legend-count" style="color:#22D3EE">21</span></div>
                <div class="legend-item"><div class="legend-dot" style="background:#64748B"></div><span class="legend-label">Idle</span><span class="legend-count" style="color:#64748B">3</span></div>
                <div class="legend-item"><div class="legend-dot" style="background:#EAB308"></div><span class="legend-label">Paused</span><span class="legend-count" style="color:#EAB308">1</span></div>
                <div class="legend-item"><div class="legend-dot" style="background:#8B5CF6"></div><span class="legend-label">Standby</span><span class="legend-count" style="color:#8B5CF6">1</span></div>
              </div>
            </div>
          </div>
          <!-- Top Performers -->
          <div class="dash-card">
            <div class="dash-card-title"><svg viewBox="0 0 24 24" fill="none" stroke="#0891B2" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> TOP PERFORMERS</div>
            <div class="perf-row"><span class="perf-rank">#1</span><span class="perf-name" style="color:#67E8F9">Architect</span><div class="perf-bar"><div class="perf-bar-fill" style="width:96%;background:linear-gradient(90deg,rgba(103,232,249,0.3),#67E8F9)"></div></div><span class="perf-score" style="color:#67E8F9">96</span></div>
            <div class="perf-row"><span class="perf-rank">#2</span><span class="perf-name" style="color:#22D3EE">Coordinator</span><div class="perf-bar"><div class="perf-bar-fill" style="width:94%;background:linear-gradient(90deg,rgba(34,211,238,0.3),#22D3EE)"></div></div><span class="perf-score" style="color:#22D3EE">94</span></div>
            <div class="perf-row"><span class="perf-rank">#3</span><span class="perf-name" style="color:#06B6D4">Inspector</span><div class="perf-bar"><div class="perf-bar-fill" style="width:91%;background:linear-gradient(90deg,rgba(6,182,212,0.3),#06B6D4)"></div></div><span class="perf-score" style="color:#06B6D4">91</span></div>
            <div class="perf-row"><span class="perf-rank">#4</span><span class="perf-name" style="color:#06B6D4">Coder</span><div class="perf-bar"><div class="perf-bar-fill" style="width:89%;background:linear-gradient(90deg,rgba(6,182,212,0.3),#06B6D4)"></div></div><span class="perf-score" style="color:#06B6D4">89</span></div>
            <div class="perf-row"><span class="perf-rank">#5</span><span class="perf-name" style="color:#0891B2">RAG-Spec.</span><div class="perf-bar"><div class="perf-bar-fill" style="width:87%;background:linear-gradient(90deg,rgba(8,145,178,0.3),#0891B2)"></div></div><span class="perf-score" style="color:#0891B2">87</span></div>
          </div>
          <!-- System Health -->
          <div class="dash-card">
            <div class="dash-card-title"><svg viewBox="0 0 24 24" fill="none" stroke="#0891B2" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> SYSTEM HEALTH</div>
            <div class="health-bar-wrap"><div class="health-bar-header"><span class="health-bar-label">CPU</span><span class="health-bar-val" style="color:#06B6D4">34%</span></div><div class="health-bar-track"><div class="health-bar-fill" style="width:34%;background:linear-gradient(90deg,rgba(6,182,212,0.4),#06B6D4)"></div></div></div>
            <div class="health-bar-wrap"><div class="health-bar-header"><span class="health-bar-label">Memory</span><span class="health-bar-val" style="color:#0891B2">67%</span></div><div class="health-bar-track"><div class="health-bar-fill" style="width:67%;background:linear-gradient(90deg,rgba(8,145,178,0.4),#0891B2)"></div></div></div>
            <div class="health-bar-wrap"><div class="health-bar-header"><span class="health-bar-label">Network</span><span class="health-bar-val" style="color:#0E7490">23%</span></div><div class="health-bar-track"><div class="health-bar-fill" style="width:23%;background:linear-gradient(90deg,rgba(14,116,144,0.4),#0E7490)"></div></div></div>
            <div style="border-top:1px solid rgba(51,51,51,0.3);margin-top:10px;padding-top:10px;display:flex;gap:6px;flex-wrap:wrap">
              <div style="padding:4px 8px;border-radius:6px;background:var(--bg3);border:1px solid var(--border2);font-size:8px"><span style="color:#22D3EE">Uptime</span> <span style="color:var(--txt2);font-weight:700">99.7%</span></div>
              <div style="padding:4px 8px;border-radius:6px;background:var(--bg3);border:1px solid var(--border2);font-size:8px"><span style="color:#06B6D4">Conns</span> <span style="color:var(--txt2);font-weight:700">55</span></div>
              <div style="padding:4px 8px;border-radius:6px;background:var(--bg3);border:1px solid var(--border2);font-size:8px"><span style="color:#22D3EE">Errors</span> <span style="color:var(--txt2);font-weight:700">0.3%</span></div>
            </div>
          </div>
        </div>
        <!-- Row 2: Chart + Timeline -->
        <div class="dash-grid-2">
          <div class="dash-card">
            <div class="dash-card-title"><svg viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> NETWORK ACTIVITY</div>
            <div class="chart-area">
              <svg viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(6,182,212,0.2)"/><stop offset="100%" stop-color="rgba(6,182,212,0.01)"/></linearGradient></defs>
                <!-- grid lines -->
                <line x1="0" y1="30" x2="500" y2="30" stroke="#333" stroke-width="0.5" opacity="0.25"/>
                <line x1="0" y1="60" x2="500" y2="60" stroke="#333" stroke-width="0.5" opacity="0.25"/>
                <line x1="0" y1="90" x2="500" y2="90" stroke="#333" stroke-width="0.5" opacity="0.25"/>
                <!-- area fill -->
                <path d="M0,80 L42,70 L83,75 L125,50 L167,55 L208,30 L250,45 L292,35 L333,40 L375,20 L417,25 L458,15 L500,30 L500,120 L0,120Z" fill="url(#cg)"/>
                <!-- line -->
                <path d="M0,80 L42,70 L83,75 L125,50 L167,55 L208,30 L250,45 L292,35 L333,40 L375,20 L417,25 L458,15 L500,30" fill="none" stroke="#06B6D4" stroke-width="1.5"/>
                <!-- peak dots -->
                <circle cx="375" cy="20" r="3" fill="#06B6D4" opacity="0.8"/>
                <circle cx="458" cy="15" r="3" fill="#06B6D4" opacity="0.8"/>
              </svg>
            </div>
            <div style="display:flex;gap:8px;margin-top:8px">
              <div style="flex:1;padding:4px 8px;border-radius:6px;background:var(--bg3);border:1px solid var(--border2)"><div style="font-size:7px;color:var(--slate)">PEAK</div><div style="font-size:9px;font-weight:700;color:#06B6D4">847 req/s</div></div>
              <div style="flex:1;padding:4px 8px;border-radius:6px;background:var(--bg3);border:1px solid var(--border2)"><div style="font-size:7px;color:var(--slate)">AVG</div><div style="font-size:9px;font-weight:700;color:#06B6D4">423 req/s</div></div>
              <div style="flex:1;padding:4px 8px;border-radius:6px;background:var(--bg3);border:1px solid var(--border2)"><div style="font-size:7px;color:var(--slate)">CURRENT</div><div style="font-size:9px;font-weight:700;color:#22D3EE">612 req/s</div></div>
            </div>
          </div>
          <div class="dash-card">
            <div class="dash-card-title"><svg viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> RECENT ACTIVITY</div>
            <div class="timeline-item"><div class="timeline-dot" style="background:#67E8F9;box-shadow:0 0 6px rgba(103,232,249,0.3)"></div><div class="timeline-content"><div class="timeline-time">2s ago</div><div class="timeline-agent" style="color:#67E8F9">Gateway</div><div class="timeline-desc">routed task to Executor-A</div></div></div>
            <div class="timeline-item"><div class="timeline-dot" style="background:#06B6D4;box-shadow:0 0 6px rgba(6,182,212,0.3)"></div><div class="timeline-content"><div class="timeline-time">5s ago</div><div class="timeline-agent" style="color:#06B6D4">Inspector</div><div class="timeline-desc">completed quality check</div></div></div>
            <div class="timeline-item"><div class="timeline-dot" style="background:#22D3EE;box-shadow:0 0 6px rgba(34,211,238,0.3)"></div><div class="timeline-content"><div class="timeline-time">12s ago</div><div class="timeline-agent" style="color:#22D3EE">Architect</div><div class="timeline-desc">generated new plan</div></div></div>
            <div class="timeline-item"><div class="timeline-dot" style="background:#0891B2;box-shadow:0 0 6px rgba(8,145,178,0.3)"></div><div class="timeline-content"><div class="timeline-time">18s ago</div><div class="timeline-agent" style="color:#0891B2">Observer</div><div class="timeline-desc">detected latency spike</div></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ===== HIERARCHY ===== -->
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
</section>

<!-- ===== WORKFLOWS ===== -->
<section class="section" id="workflows">
  <div class="reveal">
    <div class="section-label">// 03</div>
    <h2 class="section-title">Workflow Engine</h2>
    <p class="section-desc">Design, execute, and analyze multi-step agent workflows with visual pipeline editor and LLM-based evaluation.</p>
  </div>
  <div class="app-frame reveal reveal-d1" style="margin-top:2rem">
    <div class="app-header">
      <div class="app-logo">
        <div class="app-logo-icon">Q</div>
        <div class="app-logo-text">Agent <span>Qube</span></div>
        <span style="color:#475569;font-size:9px;margin:0 4px">|</span>
        <span style="color:#fff;font-size:10px;font-weight:500">Workflow Pipeline</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="header-btn" style="background:rgba(255,255,255,0.05);border-color:var(--border);color:var(--slate)">Hierarchy</div>
      </div>
    </div>
    <div class="wf-body">
      <div class="wf-sidebar">
        <div style="font-size:9px;font-weight:600;color:#fff;margin-bottom:8px;display:flex;align-items:center;gap:6px">Pipeline Stats</div>
        <div class="wf-stat-row"><span class="wf-stat-label">Total Workflows</span><span class="wf-stat-val" style="color:#06B6D4">5</span></div>
        <div class="wf-stat-row"><span class="wf-stat-label">Active</span><span class="wf-stat-val" style="color:#22C55E">3</span></div>
        <div class="wf-stat-row"><span class="wf-stat-label">Draft</span><span class="wf-stat-val" style="color:var(--slate)">1</span></div>
        <div class="wf-stat-row"><span class="wf-stat-label">Total Steps</span><span class="wf-stat-val" style="color:#0891B2">18</span></div>
        <div class="wf-stat-row"><span class="wf-stat-label">Executions</span><span class="wf-stat-val" style="color:#0E7490">142</span></div>
        <div class="wf-stat-row"><span class="wf-stat-label">Success Rate</span><span class="wf-stat-val" style="color:#22C55E">91.5%</span></div>
        <div style="border-top:1px solid var(--border2);margin:10px 0"></div>
        <div style="font-size:8px;font-weight:600;color:var(--slate);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px">Filter by Status</div>
        <div class="wf-filter-btn active"><div style="width:6px;height:6px;border-radius:50%;background:var(--cyan)"></div>All Statuses</div>
        <div class="wf-filter-btn"><div style="width:6px;height:6px;border-radius:50%;background:var(--slate)"></div>Draft <span style="margin-left:auto;color:var(--txt3)">1</span></div>
        <div class="wf-filter-btn"><div style="width:6px;height:6px;border-radius:50%;background:var(--cyan)"></div>Active <span style="margin-left:auto;color:var(--txt3)">3</span></div>
        <div class="wf-filter-btn"><div style="width:6px;height:6px;border-radius:50%;background:var(--yellow)"></div>Paused <span style="margin-left:auto;color:var(--txt3)">1</span></div>
        <div style="border-top:1px solid var(--border2);margin:10px 0"></div>
        <div style="font-size:8px;font-weight:600;color:var(--slate);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px">Filter by Trigger</div>
        <div class="wf-filter-btn active">All Types</div>
        <div class="wf-filter-btn">Manual <span style="margin-left:auto;color:var(--txt3)">2</span></div>
        <div class="wf-filter-btn">Event <span style="margin-left:auto;color:var(--txt3)">1</span></div>
        <div class="wf-filter-btn">Schedule <span style="margin-left:auto;color:var(--txt3)">1</span></div>
        <div class="wf-filter-btn">Agent <span style="margin-left:auto;color:var(--txt3)">1</span></div>
      </div>
      <div class="wf-main">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:4px;height:16px;border-radius:2px;background:var(--cyan)"></div>
            <span style="font-size:14px;font-weight:600;color:#fff">Workflows</span>
            <span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(6,182,212,0.12);color:var(--cyan);font-weight:500">5</span>
          </div>
          <div style="padding:6px 12px;border-radius:6px;background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.3);color:var(--cyan);font-size:10px;font-weight:700;cursor:default">+ New Workflow</div>
        </div>
        <div class="wf-grid">
          <!-- WF Card 1 -->
          <div class="wf-card">
            <div class="wf-card-header"><span class="wf-card-name">Agent Research Pipeline</span><span class="wf-status active">ACTIVE</span></div>
            <div class="wf-card-desc">Multi-step research workflow with fact-checking and synthesis. Orchestrates 3 agents.</div>
            <div class="wf-card-stats"><span class="wf-card-stat" style="color:#0891B2">Manual</span><span class="wf-card-stat">6 steps</span><span class="wf-card-stat" style="color:#22C55E">94.2%</span><span class="wf-card-stat">38 runs</span></div>
            <div class="wf-pipeline">
              <div class="wf-pipeline-dot" style="background:#06B6D4"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#EAB308"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#22D3EE"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#06B6D4"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#0891B2"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#0E7490"></div>
            </div>
            <div class="wf-tags"><span class="wf-tag">research</span><span class="wf-tag">multi-agent</span><span class="wf-tag">fact-check</span></div>
          </div>
          <!-- WF Card 2 -->
          <div class="wf-card">
            <div class="wf-card-header"><span class="wf-card-name">Code Review Workflow</span><span class="wf-status active">ACTIVE</span></div>
            <div class="wf-card-desc">Automated code review with quality scoring and improvement suggestions via LLM eval.</div>
            <div class="wf-card-stats"><span class="wf-card-stat" style="color:#0891B2">Event</span><span class="wf-card-stat">4 steps</span><span class="wf-card-stat" style="color:#22C55E">89.7%</span><span class="wf-card-stat">56 runs</span></div>
            <div class="wf-pipeline">
              <div class="wf-pipeline-dot" style="background:#06B6D4"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#EAB308"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#22D3EE"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#0891B2"></div>
            </div>
            <div class="wf-tags"><span class="wf-tag">review</span><span class="wf-tag">quality</span></div>
          </div>
          <!-- WF Card 3 -->
          <div class="wf-card">
            <div class="wf-card-header"><span class="wf-card-name">Content Generation</span><span class="wf-status active">ACTIVE</span></div>
            <div class="wf-card-desc">Generates blog posts and documentation with style consistency checks.</div>
            <div class="wf-card-stats"><span class="wf-card-stat" style="color:#0891B2">Schedule</span><span class="wf-card-stat">5 steps</span><span class="wf-card-stat" style="color:#22C55E">92.1%</span><span class="wf-card-stat">28 runs</span></div>
            <div class="wf-pipeline">
              <div class="wf-pipeline-dot" style="background:#06B6D4"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#22D3EE"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#EAB308"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#06B6D4"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#0E7490"></div>
            </div>
            <div class="wf-tags"><span class="wf-tag">content</span><span class="wf-tag">generation</span></div>
          </div>
          <!-- WF Card 4 -->
          <div class="wf-card">
            <div class="wf-card-header"><span class="wf-card-name">Data Analysis Pipeline</span><span class="wf-status paused">PAUSED</span></div>
            <div class="wf-card-desc">Processes CSV datasets with statistical analysis and visualization generation.</div>
            <div class="wf-card-stats"><span class="wf-card-stat" style="color:#0891B2">Agent</span><span class="wf-card-stat">3 steps</span><span class="wf-card-stat" style="color:#EAB308">87.3%</span><span class="wf-card-stat">12 runs</span></div>
            <div class="wf-pipeline">
              <div class="wf-pipeline-dot" style="background:#0891B2"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#06B6D4"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:#0E7490"></div>
            </div>
            <div class="wf-tags"><span class="wf-tag">data</span><span class="wf-tag">analysis</span></div>
          </div>
          <!-- WF Card 5 -->
          <div class="wf-card">
            <div class="wf-card-header"><span class="wf-card-name">Incident Response</span><span class="wf-status draft">DRAFT</span></div>
            <div class="wf-card-desc">Automated incident triage and resolution workflow with escalation logic.</div>
            <div class="wf-card-stats"><span class="wf-card-stat" style="color:#0891B2">Manual</span><span class="wf-card-stat">7 steps</span><span class="wf-card-stat" style="color:var(--slate)">N/A</span><span class="wf-card-stat">0 runs</span></div>
            <div class="wf-pipeline">
              <div class="wf-pipeline-dot" style="background:var(--slate)"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:var(--slate)"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:var(--slate)"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:var(--slate)"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:var(--slate)"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:var(--slate)"></div><div class="wf-pipeline-line"></div>
              <div class="wf-pipeline-dot" style="background:var(--slate)"></div>
            </div>
            <div class="wf-tags"><span class="wf-tag">incident</span><span class="wf-tag">escalation</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ===== TECH STACK ===== -->
<section class="section" id="tech">
  <div class="reveal" style="text-align:center">
    <div class="section-label">// Built With</div>
    <h2 class="section-title">Tech Stack</h2>
  </div>
  <div class="tech-grid reveal reveal-d1">
    <div class="tech-card"><div class="icon">&#9883;</div><div class="name">Next.js 16</div><div class="kind">Framework</div></div>
    <div class="tech-card"><div class="icon">&#9881;</div><div class="name">TypeScript</div><div class="kind">Language</div></div>
    <div class="tech-card"><div class="icon">&#9670;</div><div class="name">Tailwind 4</div><div class="kind">Styling</div></div>
    <div class="tech-card"><div class="icon">&#8644;</div><div class="name">React Flow</div><div class="kind">Graph Viz</div></div>
    <div class="tech-card"><div class="icon">&#9729;</div><div class="name">Prisma</div><div class="kind">ORM</div></div>
    <div class="tech-card"><div class="icon">&#9889;</div><div class="name">WebSocket</div><div class="kind">Real-time</div></div>
    <div class="tech-card"><div class="icon">&#10070;</div><div class="name">shadcn/ui</div><div class="kind">Components</div></div>
    <div class="tech-card"><div class="icon">&#9635;</div><div class="name">Bun</div><div class="kind">Runtime</div></div>
  </div>
</section>

<!-- ===== FOOTER ===== -->
<footer class="footer">
  Agent Qube &bull; Built with Next.js, React Flow &amp; AI &bull; 2025
</footer>

<script>
// =============================================
// 1. PARTICLE FIELD (Hero Canvas)
// =============================================
(function() {
  var canvas = document.getElementById('hero-canvas');
  var ctx = canvas.getContext('2d');
  var W, H, particles = [], mouse = { x: -1000, y: -1000 };
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  for (var i = 0; i < 80; i++) {
    particles.push({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, r: Math.random()*1.5+0.5, a: Math.random()*0.5+0.2 });
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    for (var i = 0; i < particles.length; i++) {
      for (var j = i+1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) { ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.strokeStyle = 'rgba(6,182,212,'+(0.08*(1-dist/150))+')'; ctx.lineWidth = 0.5; ctx.stroke(); }
      }
    }
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      var dx2 = p.x - mouse.x, dy2 = p.y - mouse.y, md = Math.sqrt(dx2*dx2+dy2*dy2);
      if (md < 120 && md > 0) { p.vx += (dx2/md)*0.02; p.vy += (dy2/md)*0.02; }
      p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.vy *= 0.99;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = 'rgba(6,182,212,'+p.a+')'; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// =============================================
// 2. ANIMATED COUNTERS
// =============================================
(function() {
  var counters = document.querySelectorAll('.stat-number[data-target]');
  var started = false;
  function animate() {
    if (started) return;
    var rect = document.querySelector('.stats-bar').getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      started = true;
      counters.forEach(function(el) {
        var target = +el.dataset.target, dur = 1500, start = performance.now();
        function tick(now) {
          var t = Math.min((now-start)/dur, 1), ease = 1 - Math.pow(1-t, 3);
          el.textContent = Math.round(target * ease);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }
  }
  window.addEventListener('scroll', animate);
  animate();
})();

// =============================================
// 3. SCROLL REVEAL
// =============================================
(function() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
})();

// =============================================
// 4. INTERACTIVE HIERARCHY with 4 DEPTH LAYERS
// =============================================
(function() {
  var canvas = document.getElementById('demo-canvas');
  var ctx = canvas.getContext('2d');
  var W, H, dpr;
  var mouseCanvas = { x: 0, y: 0 }; // mouse relative to canvas center, normalized -1..1

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = canvas.offsetWidth; H = canvas.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', function() { resize(); initPositions(); });

  // Track mouse for parallax
  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    mouseCanvas.x = (mx / W - 0.5) * 2;  // -1 to 1
    mouseCanvas.y = (my / H - 0.5) * 2;
    if (dragNode) { dragNode.x = mx - dragOffset.x; dragNode.y = my - dragOffset.y; }
    else { hoveredNode = getNode(mx, my); canvas.style.cursor = hoveredNode ? 'pointer' : 'grab'; }
  });
  canvas.addEventListener('mouseleave', function() { mouseCanvas.x = 0; mouseCanvas.y = 0; dragNode = null; hoveredNode = null; });
  canvas.addEventListener('mousedown', function(e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    var n = getNode(mx, my);
    if (n) { dragNode = n; dragOffset = { x: mx-n.x, y: my-n.y }; canvas.style.cursor = 'grabbing'; }
  });
  canvas.addEventListener('mouseup', function() { dragNode = null; });
  canvas.addEventListener('dblclick', function() { initPositions(); });
  // Touch
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); var t=e.touches[0]; var r=canvas.getBoundingClientRect(); var n=getNode(t.clientX-r.left,t.clientY-r.top); if(n){dragNode=n;dragOffset={x:t.clientX-r.left-n.x,y:t.clientY-r.top-n.y};} }, {passive:false});
  canvas.addEventListener('touchmove', function(e) { e.preventDefault(); if(!dragNode)return; var t=e.touches[0]; var r=canvas.getBoundingClientRect(); dragNode.x=t.clientX-r.left-dragOffset.x; dragNode.y=t.clientY-r.top-dragOffset.y; }, {passive:false});
  canvas.addEventListener('touchend', function() { dragNode = null; });

  // -- LAYER 0: Background stars --
  var stars = [];
  for (var i = 0; i < 120; i++) {
    stars.push({ x: Math.random(), y: Math.random(), r: Math.random()*1.2+0.3, a: Math.random()*0.4+0.1, speed: Math.random()*0.3+0.1 });
  }

  // -- LAYER 1: Grid --
  var gridSpacing = 60;
  var gridAlpha = 0.04;

  // -- LAYER 2+3: Nodes & Edges --
  var roles = { orchestrator: '#06B6D4', manager: '#8B5CF6', worker: '#22D3EE' };
  function hexRGBA(hex, a) {
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return 'rgba('+r+','+g+','+b+','+a+')';
  }

  var nodes = [
    { id:'orch', label:'Orchestrator', role:'orchestrator', x:0, y:0, r:28, depth:3 },
    { id:'m1', label:'Router', role:'manager', x:0, y:0, r:22, depth:3 },
    { id:'m2', label:'Evaluator', role:'manager', x:0, y:0, r:22, depth:3 },
    { id:'w1', label:'Researcher', role:'worker', x:0, y:0, r:18, depth:3 },
    { id:'w2', label:'Coder', role:'worker', x:0, y:0, r:18, depth:3 },
    { id:'w3', label:'Reviewer', role:'worker', x:0, y:0, r:18, depth:3 },
    { id:'w4', label:'Analyst', role:'worker', x:0, y:0, r:18, depth:3 },
  ];
  var edges = [
    { from:'orch', to:'m1' }, { from:'orch', to:'m2' },
    { from:'m1', to:'w1' }, { from:'m1', to:'w2' },
    { from:'m2', to:'w3' }, { from:'m2', to:'w4' },
  ];
  var edgeParticles = edges.map(function() { return { t: Math.random() }; });
  var nodeMap = {};
  nodes.forEach(function(n) { nodeMap[n.id] = n; });

  function initPositions() {
    var cx = W/2, cy = 70;
    nodeMap.orch.x = cx; nodeMap.orch.y = cy;
    nodeMap.m1.x = cx-150; nodeMap.m1.y = cy+130;
    nodeMap.m2.x = cx+150; nodeMap.m2.y = cy+130;
    nodeMap.w1.x = cx-230; nodeMap.w1.y = cy+260;
    nodeMap.w2.x = cx-80; nodeMap.w2.y = cy+260;
    nodeMap.w3.x = cx+80; nodeMap.w3.y = cy+260;
    nodeMap.w4.x = cx+230; nodeMap.w4.y = cy+260;
  }
  initPositions();

  var hoveredNode = null, dragNode = null, dragOffset = { x:0, y:0 };

  function getNode(mx, my) {
    for (var i = nodes.length-1; i >= 0; i--) {
      var n = nodes[i], dx = mx-n.x, dy = my-n.y;
      if (dx*dx+dy*dy < (n.r+8)*(n.r+8)) return n;
    }
    return null;
  }

  // Parallax offset per layer
  function px(layer) {
    var factors = { 0: 3, 1: 8, 2: 14, 3: 22 };
    return { x: mouseCanvas.x * (factors[layer] || 0), y: mouseCanvas.y * (factors[layer] || 0) };
  }

  var time = 0;

  function render() {
    time += 0.016;
    ctx.clearRect(0,0,W,H);

    // -- LAYER 0: Stars (deepest, slowest parallax) --
    var p0 = px(0);
    ctx.save();
    ctx.translate(p0.x, p0.y);
    for (var si = 0; si < stars.length; si++) {
      var s = stars[si];
      var twinkle = 0.5 + 0.5 * Math.sin(time * s.speed * 3 + si);
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(6,182,212,' + (s.a * twinkle) + ')';
      ctx.fill();
    }
    ctx.restore();

    // -- LAYER 1: Perspective grid --
    var p1 = px(1);
    ctx.save();
    ctx.translate(p1.x, p1.y);
    ctx.strokeStyle = 'rgba(6,182,212,' + gridAlpha + ')';
    ctx.lineWidth = 0.5;
    // horizontal lines with perspective fade
    for (var gy = 0; gy < H; gy += gridSpacing) {
      var fade = 1 - Math.abs(gy - H*0.5) / (H*0.5);
      ctx.globalAlpha = fade * 0.6;
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }
    // vertical lines
    for (var gx = 0; gx < W; gx += gridSpacing) {
      var fade2 = 1 - Math.abs(gx - W*0.5) / (W*0.5);
      ctx.globalAlpha = fade2 * 0.6;
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // -- LAYER 2: Edges with parallax --
    var p2 = px(2);
    var connected = new Set();
    if (hoveredNode) {
      connected.add(hoveredNode.id);
      edges.forEach(function(e) { if (e.from === hoveredNode.id) connected.add(e.to); if (e.to === hoveredNode.id) connected.add(e.from); });
    }

    ctx.save();
    ctx.translate(p2.x, p2.y);
    edges.forEach(function(e, idx) {
      var from = nodeMap[e.from], to = nodeMap[e.to];
      var alpha = hoveredNode ? (e.from === hoveredNode.id || e.to === hoveredNode.id ? 1 : 0.12) : 0.5;
      var cpY = (from.y + to.y) / 2;
      // glow line
      ctx.beginPath();
      ctx.moveTo(from.x, from.y + from.r);
      ctx.bezierCurveTo(from.x, cpY, to.x, cpY, to.x, to.y - to.r);
      ctx.strokeStyle = 'rgba(6,182,212,' + (0.06 * alpha) + ')';
      ctx.lineWidth = 6;
      ctx.stroke();
      // main line
      ctx.beginPath();
      ctx.moveTo(from.x, from.y + from.r);
      ctx.bezierCurveTo(from.x, cpY, to.x, cpY, to.x, to.y - to.r);
      ctx.strokeStyle = 'rgba(6,182,212,' + (0.25 * alpha) + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // animated particle
      var ep = edgeParticles[idx];
      ep.t += 0.005;
      if (ep.t > 1) ep.t = 0;
      var t = ep.t, mt = 1 - t;
      var epx = mt*mt*mt*from.x + 3*mt*mt*t*from.x + 3*mt*t*t*to.x + t*t*t*to.x;
      var epy = mt*mt*mt*(from.y+from.r) + 3*mt*mt*t*cpY + 3*mt*t*t*cpY + t*t*t*(to.y-to.r);
      // particle glow
      ctx.beginPath(); ctx.arc(epx, epy, 6, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(6,182,212,' + (0.15 * alpha) + ')'; ctx.fill();
      // particle core
      ctx.beginPath(); ctx.arc(epx, epy, 2.5, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(6,182,212,' + (0.8 * alpha) + ')'; ctx.fill();
    });
    ctx.restore();

    // -- LAYER 3: Nodes (foreground, fastest parallax) --
    var p3 = px(3);
    ctx.save();
    ctx.translate(p3.x, p3.y);
    nodes.forEach(function(n) {
      var alpha = hoveredNode ? (connected.has(n.id) ? 1 : 0.12) : 0.9;
      // outer glow
      var grad = ctx.createRadialGradient(n.x, n.y, n.r*0.5, n.x, n.y, n.r*3);
      grad.addColorStop(0, hexRGBA(roles[n.role], 0.08 * alpha));
      grad.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(n.x - n.r*3, n.y - n.r*3, n.r*6, n.r*6);
      // ring pulse (for hovered node)
      if (hoveredNode === n) {
        var pulse = 0.5 + 0.5 * Math.sin(time * 4);
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 8 + pulse*4, 0, Math.PI*2);
        ctx.strokeStyle = hexRGBA(roles[n.role], 0.2 * pulse);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      // circle bg
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(10,10,10,' + alpha + ')';
      ctx.fill();
      ctx.strokeStyle = hexRGBA(roles[n.role], alpha * 0.8);
      ctx.lineWidth = 2;
      ctx.stroke();
      // role label inside
      ctx.font = '500 ' + (n.role === 'orchestrator' ? 8 : 7) + 'px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = hexRGBA(roles[n.role], 0.7 * alpha);
      ctx.fillText(n.role.toUpperCase(), n.x, n.y + 3);
      // name below
      ctx.font = (n.role === 'orchestrator' ? '600 11' : '500 10') + 'px Inter, sans-serif';
      ctx.fillStyle = 'rgba(228,228,231,' + alpha + ')';
      ctx.fillText(n.label, n.x, n.y + n.r + 16);
    });
    ctx.restore();

    requestAnimationFrame(render);
  }
  render();
})();
</script>
</body>
</html>"""

# Write output
with open('/home/z/my-project/download/showcase.html', 'w') as f:
    f.write(HTML)

# Verify no non-ASCII
data = open('/home/z/my-project/download/showcase.html', 'r').read()
non_ascii = [c for c in data if ord(c) > 127]
print(f'File size: {len(data)} bytes, {data.count(chr(10))} lines')
print(f'Non-ASCII chars: {len(non_ascii)}')
if non_ascii:
    for i, c in enumerate(non_ascii[:5]):
        idx = data.index(c)
        line = data[:idx].count('\n') + 1
        print(f'  Line {line}: U+{ord(c):04X}')