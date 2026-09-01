import { useState, useEffect, useRef } from "react";
import { ScanFace, LockKeyhole, Landmark, CameraOff } from "lucide-react";

/* ============================================================
   Case — Consentimento e permissão de câmera em KYC
   "Explique antes de pedir" · Bilíngue PT/EN
   Estudo autoral; nenhuma interface proprietária reproduzida.
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

:root{
  --paper:#FAF8F5;
  --paper-2:#F1EEE8;
  --ink:#181A1F;
  --ink-2:#4A4E58;
  --ink-3:#8A8E99;
  --line:#E3DFD7;
  --accent:#181A1F;
  --accent-ink:#000000;
  --accent-soft:#EDECE7;
  --ok:#4A4E58;
  --ok-soft:#EDECE7;
  --warn:#181A1F;
  --warn-soft:#EDECE7;
  --phone-bg:#F5F6F8;
  --phone-ink:#101318;
  --phone-ink-2:#5A6070;
  --phone-line:#E4E7EC;
  --phone-accent:#101318;
  --radius-s:8px;
  --radius-m:12px;
  --radius-l:20px;
  --font-display:'Fraunces', Georgia, serif;
  --font-body:'Instrument Sans', 'Helvetica Neue', sans-serif;
  --font-phone:-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
}

*{box-sizing:border-box; margin:0; padding:0;}
.case-root{
  font-family:var(--font-body);
  background:var(--paper);
  color:var(--ink);
  min-height:100vh;
  -webkit-font-smoothing:antialiased;
  font-size:16px;
  line-height:1.6;
}
.case-root ::selection{background:var(--accent); color:#fff;}

/* ---------- layout ---------- */
.shell{max-width:1220px; margin:0 auto; padding:0 32px;}
.grid{
  display:grid;
  grid-template-columns:minmax(0,1fr) 420px;
  gap:72px;
  align-items:start;
}
.col-narrative{max-width:600px; padding:64px 0 120px;}
.col-device{
  position:sticky; top:0;
  height:100vh;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  gap:20px;
  padding:32px 0;
}

/* ---------- header ---------- */
.masthead{
  border-bottom:1px solid var(--line);
  padding:16px 0;
  display:flex; align-items:center; justify-content:space-between;
  gap:16px; flex-wrap:wrap;
}
.masthead .brand{
  font-family:var(--font-display);
  font-weight:600; font-size:17px; letter-spacing:-0.01em;
}
.masthead .right{display:flex; align-items:center; gap:16px; flex-wrap:wrap;}
.masthead .meta{
  font-size:12.5px; color:var(--ink-3);
  letter-spacing:0.06em; text-transform:uppercase; font-weight:500;
}
.lang-switch{
  display:flex; gap:2px; background:var(--paper-2);
  border:1px solid var(--line); border-radius:99px; padding:3px;
}
.lang-switch button{
  font-family:var(--font-body);
  font-size:12px; font-weight:700; letter-spacing:0.06em;
  padding:5px 13px; border:none; border-radius:99px;
  background:transparent; color:var(--ink-3); cursor:pointer;
  transition:background .15s ease, color .15s ease;
}
.lang-switch button:hover{color:var(--ink);}
.lang-switch button.active{background:var(--ink); color:#fff;}
.lang-switch button.active:hover{color:#fff;}
.lang-switch button:focus-visible{outline:2px solid var(--accent); outline-offset:2px;}

/* ---------- hero ---------- */
.kicker{
  font-size:12.5px; font-weight:600; letter-spacing:0.14em;
  text-transform:uppercase; color:var(--accent-ink);
  display:flex; align-items:center; gap:10px;
}
.kicker::before{content:""; width:24px; height:1.5px; background:var(--accent); display:inline-block;}
h1.hero{
  font-family:var(--font-display);
  font-weight:500; font-size:clamp(34px, 4.4vw, 52px);
  line-height:1.08; letter-spacing:-0.02em;
  margin:20px 0 24px;
}
h1.hero em{font-style:italic; font-weight:400;}
.lede{
  font-size:18.5px; line-height:1.65; color:var(--ink-2);
  max-width:56ch;
}
.hero-tags{display:flex; flex-wrap:wrap; gap:8px; margin-top:28px;}
.tag{
  font-size:12px; font-weight:600; letter-spacing:0.04em;
  padding:5px 11px; border:1px solid var(--line);
  border-radius:99px; color:var(--ink-2); background:#fff;
}
.disclaimer{
  margin-top:32px;
  padding:14px 18px;
  background:var(--paper-2);
  border-left:2px solid var(--ink-3);
  border-radius:0 var(--radius-s) var(--radius-s) 0;
  font-size:13.5px; color:var(--ink-2); line-height:1.55;
}

/* ---------- sections ---------- */
.section{margin-top:72px;}
.sec-label{
  display:flex; align-items:baseline; gap:14px;
  font-size:12.5px; font-weight:600; letter-spacing:0.12em;
  text-transform:uppercase; color:var(--ink-3);
  margin-bottom:16px;
}
.sec-label .num{
  font-family:var(--font-display); font-size:13px;
  color:var(--accent-ink); letter-spacing:0;
}
h2.sec-title{
  font-family:var(--font-display);
  font-weight:500; font-size:clamp(24px, 2.6vw, 30px);
  line-height:1.2; letter-spacing:-0.015em;
  margin-bottom:18px;
}
.section p{color:var(--ink-2); margin-bottom:16px; max-width:60ch;}
.section p strong{color:var(--ink); font-weight:600;}
.section p:last-child{margin-bottom:0;}

/* ---------- pull quote ---------- */
.principle{
  margin:80px 0;
  padding:48px 0;
  border-top:1px solid var(--ink);
  border-bottom:1px solid var(--ink);
  text-align:left;
}
.principle .small{
  font-size:12.5px; font-weight:600; letter-spacing:0.14em;
  text-transform:uppercase; color:var(--ink-3); margin-bottom:16px;
}
.principle .quote{
  font-family:var(--font-display);
  font-size:clamp(30px, 4vw, 44px);
  font-weight:500; font-style:italic;
  line-height:1.15; letter-spacing:-0.02em;
}
.principle .quote span{color:var(--accent-ink);}

/* ---------- callouts ---------- */
.callout{
  border:1px solid var(--line);
  border-radius:var(--radius-m);
  padding:22px 24px;
  background:#fff;
  margin:24px 0;
}
.callout .co-label{
  font-size:11.5px; font-weight:700; letter-spacing:0.12em;
  text-transform:uppercase; margin-bottom:10px;
}
.callout.hyp .co-label{color:var(--accent-ink);}
.callout.risk .co-label{color:var(--warn);}
.callout p{font-size:15.5px; margin-bottom:0; color:var(--ink);}

/* ---------- decisões ---------- */
.decisions{display:flex; flex-direction:column; margin-top:8px;}
.decision{
  display:grid; grid-template-columns:30px 1fr; gap:16px;
  padding:20px 0; border-top:1px solid var(--line);
}
.decision:last-child{border-bottom:1px solid var(--line);}
.decision .d-num{
  font-family:var(--font-display); font-size:15px;
  color:var(--ink-3); padding-top:2px;
}
.decision h3{
  font-size:16px; font-weight:600; margin-bottom:6px; letter-spacing:-0.005em;
}
.decision p{font-size:15px; margin-bottom:0;}

/* ---------- before/after ---------- */
.ba{
  display:grid; grid-template-columns:1fr 1fr; gap:1px;
  background:var(--line); border:1px solid var(--line);
  border-radius:var(--radius-m); overflow:hidden; margin-top:24px;
}
.ba-cell{background:#fff; padding:20px 22px;}
.ba-cell.after{background:var(--accent-soft);}
.ba-cell .ba-tag{
  font-size:11.5px; font-weight:700; letter-spacing:0.1em;
  text-transform:uppercase; margin-bottom:12px;
}
.ba-cell.before .ba-tag{color:var(--warn);}
.ba-cell.after .ba-tag{color:var(--accent-ink);}
.ba-cell ol{list-style:none; display:flex; flex-direction:column; gap:8px;}
.ba-cell li{
  font-size:13.5px; line-height:1.45; color:var(--ink-2);
  display:flex; gap:9px; align-items:flex-start;
}
.ba-cell li::before{
  content:"→"; color:var(--ink-3); flex-shrink:0; font-size:12px; padding-top:1px;
}
.ba-cell li.hl{color:var(--ink); font-weight:600;}
.ba-cell.after li.hl::before{color:var(--accent);}
.ba-cell li.bad{color:var(--warn); font-weight:600;}
.ba-cell li.bad::before{color:var(--warn);}

/* ---------- resultados / gráficos ---------- */
.charts{
  display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:10px;
  border:1px solid var(--line); background:#fff; border-radius:var(--radius-m);
  padding:30px 22px; margin:24px 0 8px;
}
.donut-card{display:flex; flex-direction:column; align-items:center; gap:10px;}
.donut{position:relative; width:150px; height:150px;}
.donut svg{transform:rotate(-90deg); display:block;}
.donut circle{fill:none; stroke-width:14;}
.donut .track{stroke:var(--paper-2);}
.donut .arc{stroke-linecap:round; transition:stroke-dashoffset 1.4s cubic-bezier(.25,.8,.25,1);}
.donut .center{position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1px;}
.donut .center b{font-family:var(--font-display); font-size:31px; font-weight:600; letter-spacing:-0.02em; line-height:1;}
.donut .center span{font-size:10.5px; color:var(--ink-3); letter-spacing:0.04em; text-transform:uppercase; font-weight:600;}
.donut-lbl{font-size:13.5px; font-weight:600; text-align:center;}
.delta{display:flex; flex-direction:column; align-items:center; gap:5px; text-align:center; padding:0 6px;}
.delta b{
  font-family:var(--font-display); font-size:24px; font-weight:600;
  color:var(--ok); background:var(--ok-soft); border-radius:99px; padding:6px 14px;
}
.delta span{font-size:11.5px; color:var(--ink-3); max-width:120px; line-height:1.4;}
.fig-note{font-size:12.5px; color:var(--ink-3); line-height:1.5;}
.sim{
  border:1px solid var(--line); border-left:3px solid var(--accent);
  background:#fff; border-radius:0 var(--radius-m) var(--radius-m) 0;
  padding:24px; margin-top:28px;
}
.sim-tag{
  font-size:10.5px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
  color:var(--warn); background:var(--warn-soft);
  display:inline-block; padding:4px 11px; border-radius:99px; margin-bottom:14px;
}
.sim > p{font-size:15px;}
.sim-grid{
  display:grid; grid-template-columns:1fr 1fr; gap:1px;
  background:var(--line); border:1px solid var(--line);
  border-radius:var(--radius-s); overflow:hidden; margin-top:18px;
}
.sim-cell{background:#fff; padding:18px 20px;}
.sim-cell b{display:block; font-family:var(--font-display); font-size:27px; font-weight:600; letter-spacing:-0.02em; font-variant-numeric:tabular-nums;}
.sim-cell span{font-size:12.5px; color:var(--ink-2); line-height:1.45; display:block; margin-top:5px;}
.sim-cell.hl{grid-column:1/-1; background:var(--accent-soft);}
.sim-cell.hl b{color:var(--accent-ink); font-size:31px;}

/* ---------- referências ---------- */
.refs{border-top:1px solid var(--line); margin-top:24px; padding-top:18px; display:flex; flex-direction:column; gap:13px;}
.refs-title{font-size:11.5px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink-3);}
.ref{display:grid; grid-template-columns:92px 1fr; gap:14px; font-size:13.5px; line-height:1.55; color:var(--ink-2);}
.ref .ref-src{font-weight:700; color:var(--ink); font-size:12px; line-height:1.4; padding-top:2px; letter-spacing:0.02em;}
.ref i{font-style:italic;}

/* ---------- métricas ---------- */
.metrics{display:flex; flex-direction:column; margin-top:8px;}
.metric{
  display:grid; grid-template-columns:1fr auto; gap:20px;
  align-items:baseline;
  padding:16px 0; border-top:1px solid var(--line);
}
.metric:last-child{border-bottom:1px solid var(--line);}
.metric .m-name{font-size:15.5px; font-weight:600;}
.metric .m-desc{font-size:13.5px; color:var(--ink-3); margin-top:3px;}
.metric .m-kind{
  font-size:11px; font-weight:700; letter-spacing:0.08em;
  text-transform:uppercase; color:var(--accent-ink);
  background:var(--accent-soft); border-radius:99px; padding:4px 10px;
  white-space:nowrap;
}

/* ---------- footer ---------- */
.case-footer{
  margin-top:96px; border-top:1px solid var(--line);
  padding:28px 0 8px;
  display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap;
  font-size:13px; color:var(--ink-3);
}

/* ============================================================
   DEVICE COLUMN
   ============================================================ */
.mode-caption{
  font-size:12.5px; color:var(--ink-3); text-align:center;
  max-width:340px; line-height:1.5;
}
.reset-btn{
  font-family:var(--font-body);
  font-size:12.5px; font-weight:600; color:var(--ink-3);
  background:none; border:none; cursor:pointer;
  text-decoration:underline; text-underline-offset:3px;
  transition:color .15s;
}
.reset-btn:hover{color:var(--ink);}
.reset-btn:focus-visible{outline:2px solid var(--accent); outline-offset:2px; border-radius:4px;}

/* ---------- phone shell ---------- */
.phone{
  width:320px; height:660px;
  background:#0B0C0F;
  border-radius:52px;
  padding:10px;
  box-shadow:
    0 0 0 1.5px #24262B,
    0 24px 60px -18px rgba(20,22,30,.35),
    0 6px 18px -8px rgba(20,22,30,.25);
  position:relative;
  flex-shrink:0;
}
.phone-screen{
  width:100%; height:100%;
  background:var(--phone-bg);
  border-radius:42px;
  overflow:hidden;
  position:relative;
  font-family:var(--font-phone);
  color:var(--phone-ink);
  display:flex; flex-direction:column;
}
.island{
  position:absolute; top:12px; left:50%; transform:translateX(-50%);
  width:96px; height:28px; background:#0B0C0F; border-radius:99px; z-index:40;
}
.statusbar{
  height:52px; flex-shrink:0;
  display:flex; align-items:flex-end; justify-content:space-between;
  padding:0 26px 6px;
  font-size:13.5px; font-weight:600;
}
.statusbar .icons{display:flex; gap:5px; align-items:center;}
.sb-ico{display:inline-block;}

/* screen body */
.scr{
  flex:1; display:flex; flex-direction:column;
  padding:8px 22px 20px;
  animation:scrIn .32s cubic-bezier(.2,.7,.2,1);
  overflow:hidden;
}
@keyframes scrIn{
  from{opacity:0; transform:translateX(14px);}
  to{opacity:1; transform:translateX(0);}
}
.scr-nav{
  height:36px; display:flex; align-items:center; gap:8px;
  margin-bottom:4px;
}
.scr-back{
  background:none; border:none; cursor:pointer;
  color:var(--phone-accent); font-size:15px; font-weight:400;
  display:flex; align-items:center; gap:2px; padding:4px 4px 4px 0;
  font-family:var(--font-phone);
}
.scr-back:focus-visible{outline:2px solid var(--phone-accent); outline-offset:2px; border-radius:6px;}
.scr h4{
  font-size:21px; font-weight:700; letter-spacing:-0.01em;
  line-height:1.25; margin-bottom:8px;
}
.scr .sub{font-size:14px; line-height:1.5; color:var(--phone-ink-2); margin-bottom:16px;}
.scr .spacer{flex:1;}
.p-btn{
  width:100%; height:50px;
  border:none; border-radius:14px;
  background:var(--phone-accent); color:#fff;
  font-family:var(--font-phone);
  font-size:16px; font-weight:600; cursor:pointer;
  transition:transform .12s ease, filter .15s ease;
}
.p-btn:hover{filter:brightness(1.06);}
.p-btn:active{transform:scale(.985);}
.p-btn:focus-visible{outline:3px solid rgba(16,19,24,.28); outline-offset:2px;}

/* step dots */
.dots{display:flex; gap:5px; margin:2px 0 14px;}
.dots i{width:20px; height:3px; border-radius:2px; background:var(--phone-line);}
.dots i.on{background:var(--phone-accent);}

/* home checklist */
.check-card{
  background:#fff; border:1px solid var(--phone-line);
  border-radius:16px; overflow:hidden; margin-bottom:14px;
}
.check-row{
  display:flex; align-items:center; gap:12px;
  padding:14px 16px;
  border-bottom:1px solid var(--phone-line);
  font-size:14.5px; font-weight:500;
}
.check-row:last-child{border-bottom:none;}
.check-row .st{
  width:26px; height:26px; border-radius:99px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:13px;
}
.check-row.done .st{background:var(--ok-soft); color:var(--ok);}
.check-row.pending .st{background:var(--accent-soft); color:var(--phone-accent);}
.check-row.pending{color:var(--phone-ink);}
.check-row .lbl{flex:1;}
.check-row .hint{font-size:12px; color:var(--phone-ink-2); font-weight:400;}

/* explain screen */
.info-item{
  display:flex; gap:12px; padding:12px 0; align-items:flex-start;
}
.info-item .ic{
  width:36px; height:36px; border-radius:11px; flex-shrink:0;
  background:var(--accent-soft); color:var(--phone-accent);
  display:flex; align-items:center; justify-content:center;
}
.info-item .ic svg{width:18px; height:18px;}
.info-item b{font-size:14px; display:block; margin-bottom:2px;}
.info-item span{font-size:13px; color:var(--phone-ink-2); line-height:1.45; display:block;}

/* ---------- tutorial ---------- */
.tut{
  background:#fff; border:1px solid var(--phone-line);
  border-radius:18px; padding:16px 14px 12px;
  display:flex; flex-direction:column; align-items:center;
  margin-bottom:12px;
}
.tut-device{
  width:186px; height:248px;
  border:3px solid #2A2D33; border-radius:28px;
  background:#F2F3F5; position:relative; overflow:hidden;
}
.tut-notch{
  position:absolute; top:7px; left:50%; transform:translateX(-50%);
  width:48px; height:10px; background:#2A2D33; border-radius:99px;
}
.tut-lines{position:absolute; top:34px; left:18px; right:18px;}
.tut-lines i{display:block; height:8px; border-radius:4px; background:#E0E2E6; margin-bottom:8px;}
.tut-lines i:nth-child(2){width:70%;}
.tut-dialog{
  position:absolute; left:14px; right:14px; bottom:58px;
  background:#fff; border-radius:14px;
  box-shadow:0 8px 24px rgba(16,19,24,.16);
  padding:12px 10px 0;
  animation:dlgIn 3.6s ease-in-out infinite;
}
@keyframes dlgIn{
  0%{opacity:0; transform:translateY(8px) scale(.96);}
  12%,88%{opacity:1; transform:translateY(0) scale(1);}
  100%{opacity:0; transform:translateY(0) scale(1);}
}
.tut-dialog .dl-t{height:6px; width:78%; margin:0 auto 5px; background:#D8DADF; border-radius:3px;}
.tut-dialog .dl-b{height:5px; width:58%; margin:0 auto 11px; background:#E7E9ED; border-radius:3px;}
.tut-dialog .dl-actions{
  display:flex; border-top:1px solid #EDEEF1;
}
.tut-dialog .dl-actions span{
  flex:1; text-align:center; padding:8px 4px;
  font-size:9.5px; font-weight:500; color:#9AA0AB;
  white-space:nowrap;
}
.tut-dialog .dl-actions span.allow{
  font-weight:700; color:var(--phone-ink);
  border-left:1px solid #EDEEF1;
  position:relative;
}
.tut-tap{
  position:absolute; right:36px; bottom:66px;
  width:30px; height:30px; border-radius:99px;
  background:rgba(16,19,24,.14);
  border:1.5px solid rgba(16,19,24,.42);
  animation:tap 3.6s ease-in-out infinite;
  pointer-events:none;
}
@keyframes tap{
  0%,34%{opacity:0; transform:scale(.4);}
  44%{opacity:1; transform:scale(.75);}
  52%{opacity:1; transform:scale(1.05);}
  58%{opacity:.9; transform:scale(.9);}
  70%,100%{opacity:0; transform:scale(1.5);}
}
.tut-caption{
  margin-top:12px; font-size:13px; color:var(--phone-ink-2);
  text-align:center; line-height:1.45; max-width:230px;
}
.tut-caption b{color:var(--phone-ink);}
.privacy-note{
  display:flex; gap:8px; align-items:center; justify-content:center;
  font-size:12px; color:var(--phone-ink-2); line-height:1.4;
  padding:8px 12px; background:var(--ok-soft);
  border-radius:10px; margin-bottom:12px;
}
.privacy-note .lock{color:var(--ok); display:flex;}
.privacy-note .lock svg{width:14px; height:14px;}

/* ---------- iOS permission prompt ---------- */
.prompt-dim{
  position:absolute; inset:0; z-index:50;
  background:rgba(12,14,20,.42);
  display:flex; align-items:center; justify-content:center;
  animation:dimIn .25s ease;
  border-radius:42px;
}
@keyframes dimIn{from{opacity:0;} to{opacity:1;}}
.ios-alert{
  width:216px; background:rgba(247,247,249,.97);
  backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
  border-radius:14px; overflow:hidden;
  box-shadow:0 18px 50px rgba(10,12,18,.3);
  animation:alertIn .28s cubic-bezier(.2,.9,.3,1.2);
  text-align:center;
}
@keyframes alertIn{
  from{opacity:0; transform:scale(1.12);}
  to{opacity:1; transform:scale(1);}
}
.ios-alert .a-body{padding:16px 15px 13px;}
.ios-alert .a-title{font-size:13.5px; font-weight:600; line-height:1.3; letter-spacing:-0.01em; margin-bottom:3px;}
.ios-alert .a-msg{font-size:11.5px; color:var(--phone-ink-2); line-height:1.35;}
.ios-alert .a-actions{display:flex; border-top:0.5px solid rgba(60,60,67,.29);}
.ios-alert .a-actions button{
  flex:1; padding:11px 0; background:none; border:none; cursor:pointer;
  font-family:var(--font-phone); font-size:14.5px; letter-spacing:-0.01em; color:var(--phone-ink);
}
.ios-alert .a-actions button.bold{font-weight:600; border-left:0.5px solid rgba(60,60,67,.29);}
.ios-alert .a-actions button:active{background:rgba(0,0,0,.05);}
.ios-alert .a-actions button:focus-visible{outline:2px solid var(--phone-accent); outline-offset:-2px;}

/* ---------- liveness ---------- */
.live-wrap{flex:1; display:flex; flex-direction:column; align-items:center; padding-top:8px;}
.oval{
  width:196px; height:252px; border-radius:50%/50%;
  background:linear-gradient(180deg,#20242C,#31363F);
  position:relative; overflow:hidden;
  outline:3px solid #fff;
  box-shadow:0 0 0 5px var(--phone-accent);
  margin:14px 0 20px;
}
.oval .face{
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
}
.oval .face svg{width:120px; height:150px; opacity:.9;}
.oval .scanline{
  position:absolute; left:8%; right:8%; height:2.5px;
  background:linear-gradient(90deg,transparent, rgba(255,255,255,.9), transparent);
  animation:scan 2.4s ease-in-out infinite;
  filter:drop-shadow(0 0 6px rgba(255,255,255,.55));
}
@keyframes scan{
  0%{top:12%;} 50%{top:84%;} 100%{top:12%;}
}
.live-status{
  font-size:14.5px; font-weight:600; color:var(--phone-ink);
  min-height:22px; text-align:center;
}
.live-hint{font-size:12.5px; color:var(--phone-ink-2); margin-top:4px; text-align:center;}

/* processing */
.proc-wrap{flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; padding-bottom:40px;}
.spinner{
  width:44px; height:44px; border-radius:99px;
  border:3.5px solid var(--phone-line);
  border-top-color:var(--phone-accent);
  animation:spin .9s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg);}}

/* success */
.success-wrap{flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding-bottom:8px;}
.success-badge{
  width:76px; height:76px; border-radius:99px;
  background:var(--ok-soft); color:var(--ok);
  display:flex; align-items:center; justify-content:center;
  margin-bottom:20px;
  animation:pop .45s cubic-bezier(.2,.9,.3,1.4);
}
@keyframes pop{from{transform:scale(.4); opacity:0;} to{transform:scale(1); opacity:1;}}
.success-badge svg{width:34px; height:34px;}

/* denied */
.denied-badge{
  width:64px; height:64px; border-radius:99px;
  background:var(--warn-soft); color:var(--warn);
  display:flex; align-items:center; justify-content:center;
  margin:8px auto 18px;
}
.denied-badge svg{width:26px; height:26px;}
.denied-steps{
  background:#fff; border:1px solid var(--phone-line); border-radius:14px;
  padding:4px 16px; margin-bottom:16px;
}
.denied-steps .ds{
  display:flex; gap:10px; padding:11px 0;
  border-bottom:1px solid var(--phone-line);
  font-size:13px; line-height:1.45; color:var(--phone-ink-2);
}
.denied-steps .ds:last-child{border-bottom:none;}
.denied-steps .ds b{color:var(--phone-ink); font-weight:600;}
.denied-steps .ds .n{
  width:20px; height:20px; flex-shrink:0; border-radius:99px;
  background:var(--phone-bg); border:1px solid var(--phone-line);
  font-size:11px; font-weight:700; color:var(--phone-ink);
  display:flex; align-items:center; justify-content:center; margin-top:1px;
}

/* ---------- responsive ---------- */
@media (max-width:1020px){
  .grid{grid-template-columns:1fr; gap:0;}
  .col-device{
    position:relative; height:auto; top:auto;
    order:-1; padding:40px 0 8px;
  }
  .col-narrative{padding-top:24px; max-width:640px;}
}
@media (max-width:560px){
  .shell{padding:0 20px;}
  .charts{grid-template-columns:1fr; gap:22px;}
  .delta{flex-direction:row; justify-content:center;}
  .delta span{max-width:none;}
  .sim-grid{grid-template-columns:1fr;}
  .ref{grid-template-columns:1fr; gap:3px;}
  .phone{transform:scale(.92); transform-origin:top center; margin-bottom:-46px;}
  .ba{grid-template-columns:1fr;}
  .principle{margin:56px 0; padding:36px 0;}
}
@media (prefers-reduced-motion:reduce){
  .scr,.ios-alert,.prompt-dim,.success-badge{animation:none;}
  .donut .arc{transition:none;}
  .tut-dialog{animation:none; opacity:1;}
  .tut-tap{animation:tapStill 2.4s ease-in-out infinite;}
  @keyframes tapStill{0%,100%{opacity:.35;} 50%{opacity:.9;}}
  .scanline{animation-duration:4.8s;}
}
`;

/* ============================================================
   Conteúdo bilíngue
   ============================================================ */
const COPY = {
  pt: {
    locale: "pt-BR",
    meta: "Estudo de caso · KYC & Compliance UX · 2026",
    kicker: "Onboarding financeiro regulado",
    heroTitle: (<>Consentimento de câmera em KYC: <em>explicar antes de pedir</em></>),
    lede: "Redesenho conceitual de uma etapa de compliance de alta fricção: o momento em que o usuário concede acesso à câmera para a prova de vida. Dois toques que, mal preparados, podem encerrar a jornada — e que, bem preparados, reduziram a recusa em ~58% em um projeto real.",
    tags: ["KYC / Liveness", "Permission UX", "Progressive disclosure", "Prevenção de erro", "React · Protótipo navegável"],
    disclaimer: "Estudo autoral. A tese central foi aplicada em um projeto real para um cliente do setor financeiro, cuja identidade, interfaces e dados são preservados por confidencialidade. Todas as telas aqui são uma reconstrução conceitual; o único dado compartilhado do estudo original é a proporção aproximada do ganho (~58% de recusa), e todos os demais números são simulações ilustrativas.",

    s1label: "Contexto",
    s1title: "Uma etapa obrigatória no pior momento possível",
    s1p1: (<>Em onboarding financeiro regulado, a prova de vida (liveness) é uma exigência de compliance: a instituição precisa confirmar que quem abre a conta é uma pessoa real, presente, e titular do documento enviado. Para o negócio, é inegociável. Para o usuário, é a etapa mais invasiva da jornada — envolve a câmera, o próprio rosto e um pedido de permissão do sistema operacional.</>),
    s1p2: (<>O prompt nativo de permissão tem duas características que o tornam crítico: <strong>a interface não controla quando nem como ele aparece depois de negado</strong>, e em vários contextos (especialmente fluxos web em navegadores móveis) uma recusa não pode ser simplesmente “pedida de novo”. A recuperação exige que o usuário navegue por ajustes do sistema — um caminho que a maioria não conhece.</>),

    s2label: "Ponto de fricção",
    s2title: "Dois toques que decidem a jornada",
    s2p1: (<>Sem preparação, o prompt de câmera aparece como uma interrupção: um diálogo do sistema, com linguagem do sistema, em cima de uma tarefa que o usuário ainda não entendeu completamente. Nesse instante, ele precisa responder três perguntas ao mesmo tempo: <strong>por que a câmera?</strong>, <strong>o que acontece com a imagem?</strong> e <strong>o que devo tocar?</strong></>),
    s2p2: (<>Quando essas respostas não existem, a recusa vira a escolha “segura” — um reflexo de autoproteção, não uma decisão informada. E aqui o custo é assimétrico: permitir custa um toque; negar pode custar a conta.</>),
    riskLabel: "Risco da recusa",
    riskP: "Negada a permissão no prompt nativo, a jornada perde a capacidade de solicitá-la novamente de forma simples. O usuário cai em um beco: a etapa é obrigatória, mas o caminho de recuperação passa por ajustes do sistema que ele raramente domina. Resultado provável: abandono silencioso.",

    s3label: "Comportamento do usuário",
    s3title: "O usuário não lê — e a surpresa gera defesa",
    s3p1: (<>O padrão é conhecido de quem acompanha funis de onboarding: o pop-up aparece “do nada” e o dedo vai para <strong>“Não Permitir” antes de a leitura acontecer</strong>. Não é irracionalidade. Desde 1997 a pesquisa do Nielsen Norman Group mostra que pessoas raramente leem interfaces palavra por palavra: no estudo original, 79% dos usuários escaneavam qualquer página nova e apenas 16% liam integralmente — um achado que o próprio grupo reconfirma há mais de duas décadas.</>),
    s3p2: (<>O NN/g também distingue dois tipos de pedido de permissão: os vinculados a uma ação do usuário (em contexto) e os <strong>iniciados pelo sistema</strong>, que aparecem em momentos programados. Os segundos exigem explicação adicional e têm maior probabilidade de recusa, justamente porque o usuário não consegue conectar o pedido à sua intenção. Um prompt de câmera disparado no meio de um cadastro bancário é o caso extremo dessa categoria: recurso sensível, zero contexto, decisão binária — em um setor onde o usuário está condicionado a suspeitar de qualquer coisa que pareça golpe.</>),
    s3p3: (<>A conclusão de design é direta: se o usuário não lê, <strong>a instrução não pode depender de leitura</strong>. E se a recusa nasce da falta de contexto, o contexto precisa chegar antes do pedido.</>),
    refsTitle: "Fundamentação",
    ref1: (<><i>3 Design Considerations for Effective Mobile-App Permission Requests</i> — pedidos iniciados pelo sistema, sem vínculo com uma ação do usuário, pedem contexto adicional e são mais propensos à recusa; a recomendação é solicitar a permissão no momento em que o recurso é necessário.</>),
    ref2: (<><i>How Users Read on the Web</i> (1997) e <i>How People Read Online</i> (2020) — usuários escaneiam em vez de ler; no estudo original, 79% escaneavam páginas novas e só 16% liam palavra por palavra.</>),

    s4label: "Hipótese",
    s4title: "Preparar a decisão, não apenas pedi-la",
    hypLabel: "Hipótese de design",
    hypP: (<>Se o fluxo antecipar o que vai acontecer, explicar por que a câmera é necessária e mostrar visualmente qual ação executar <em>antes</em> de disparar o prompt nativo, então erros, recusas e abandono nessa etapa devem diminuir — porque a decisão deixa de ser uma surpresa e passa a ser a confirmação de algo já compreendido.</>),
    s4p1: (<>A hipótese não tenta esconder a fricção nem “convencer” o usuário. Ela reorganiza a informação para que o consentimento seja informado, específico e reversível — o que, além de melhor UX, é o espírito do consentimento em contextos regulados.</>),
    s4p2: (<>E ela parte da premissa comportamental da seção anterior: se o usuário não lê, <strong>a instrução precisa ensinar sem depender de leitura</strong>. Por isso o centro da intervenção é uma animação de ~3 segundos mostrando o gesto — ensinar mostrando, não descrevendo.</>),

    prSmall: "Princípio central",
    prQuote: (<>“Explique <span>antes</span> de pedir.”</>),

    s5label: "Decisão de design",
    s5title: "Uma tela de preparação entre a intenção e o prompt",
    s5p1: (<>A intervenção é deliberadamente pequena: <strong>uma única tela</strong>, inserida imediatamente antes do prompt nativo, com três elementos — um título que nomeia a ação exata (“toque em Permitir”), uma animação curta demonstrando o diálogo do sistema e o toque no botão correto, e uma nota de privacidade que delimita o uso da câmera. Você pode experimentá-la no protótipo ao lado.</>),
    decisions: [
      { n: "a", t: "Progressive disclosure", p: "A informação chega em camadas: primeiro o porquê da etapa (tela de contexto), depois o como da permissão (tutorial), e só então o prompt. Cada tela responde uma pergunta e prepara a seguinte — nada é despejado de uma vez." },
      { n: "b", t: "Redução de surpresa no permission prompt", p: "O tutorial mostra uma réplica genérica do diálogo do sistema. Quando o prompt real aparece, o usuário o reconhece: já viu aquele formato, já sabe qual botão tocar. O momento de maior risco vira o mais previsível da jornada." },
      { n: "c", t: "Construção de confiança", p: "A microcopy delimita escopo e reversibilidade: câmera usada somente para a prova de vida, agora, com acesso revogável nos ajustes. Especificidade é o que diferencia um pedido legítimo de um pedido suspeito." },
      { n: "d", t: "Prevenção de erro em vez de correção", p: "Como a recusa é cara de reverter, o desenho prioriza evitá-la (Nielsen: error prevention). Ainda assim, o estado de recusa existe e é tratado: explica a consequência, oferece um novo caminho e, em último caso, orienta pelos ajustes do sistema." },
      { n: "e", t: "Animação como instrução, não decoração", p: "O GIF/animação existe para transferir um modelo mental em ~3 segundos: “vai aparecer isto; toque aqui”. É instrução visual de menor custo cognitivo que qualquer parágrafo — e é o coração da intervenção." },
      { n: "f", t: "CTA sempre visível, sem scroll", p: "Nenhuma tela do fluxo exige rolagem para alcançar o botão primário. Em telas densas de texto, o CTA oculto abaixo da dobra é uma causa recorrente de drop — por isso o conteúdo é enxuto, apoiado em ícones, e o botão vive fixo na base." },
    ],

    s6label: "Antes / Depois",
    s6title: "O mesmo prompt, duas experiências",
    s6p1: (<>A diferença entre os dois cenários não está no prompt — que é idêntico e fora do controle da interface — mas em tudo o que acontece antes dele. O protótipo ao lado percorre o fluxo proposto.</>),
    baBeforeTag: "Sem preparação",
    baBefore: [
      { t: "Usuário toca em “Iniciar prova de vida”" },
      { t: "Prompt do sistema aparece sem contexto", c: "bad" },
      { t: "Decisão sob incerteza: “por que a câmera?”" },
      { t: "Recusa como reflexo de proteção" },
      { t: "Recuperação difícil · risco de abandono", c: "bad" },
    ],
    baAfterTag: "Fluxo proposto",
    baAfter: [
      { t: "Contexto: o que é a prova de vida e por quê" },
      { t: "Tutorial visual: “toque em Permitir”", c: "hl" },
      { t: "Nota de privacidade: escopo e reversibilidade" },
      { t: "Prompt aparece como esperado, não como surpresa", c: "hl" },
      { t: "Consentimento informado · liveness concluída" },
    ],

    s7label: "Sinal observado",
    s7title: "~58% menos recusas no prompt de câmera",
    s7p1: (<>A direção partiu de uma observação que carrego de anos em jornadas de grandes instituições financeiras: o usuário não lê — então o fluxo precisa ensinar. A tese foi aplicada em um projeto real, para um cliente de grande porte do setor financeiro. Por confidencialidade, identidade e dados brutos são preservados; o que pode ser compartilhado é a proporção do ganho: em teste A/B, a variante com a tela de preparação <strong>reduziu a recusa da permissão de câmera em ~58%</strong>. Os percentuais absolutos abaixo são ilustrativos, parametrizados para preservar essa proporção.</>),
    donutBefore: "Sem preparação",
    donutAfter: "Com tutorial",
    donutSub: "recusa",
    deltaB: "~58%",
    deltaSpan: "queda relativa aproximada na recusa — sinal observado no projeto original",
    figNote: "Proporção aproximada (~58%) do sinal observado no projeto original; percentuais absolutos (19% → 8%) e demais valores desta seção são ilustrativos.",
    simTag: "Simulação ilustrativa · valores fictícios",
    simP: (<>Para dimensionar o que essa proporção significa em escala, considere um banco de varejo com <strong>1,2 milhão de verificações de identidade por mês</strong> e o cenário ilustrativo de 19% → 8% de recusa:</>),
    simBad: "jornadas travadas por mês no cenário sem preparação (19% de recusa)",
    simMid: "jornadas travadas com a tela de preparação (8% de recusa)",
    simHl: "verificações concluídas a mais por mês: clientes que chegam ao fim do onboarding em vez de abandonar em silêncio",

    s8label: "Medição",
    s8title: "O que deveria ser monitorado",
    s8p1: (<>Os dados brutos do projeto original são confidenciais — por isso este estudo trata medição como método, não como troféu. Para replicar a tese em um novo contexto, esta é a instrumentação que eu definiria, idealmente em um teste A/B com e sem a tela de preparação:</>),
    metrics: [
      { name: "Taxa de concessão da permissão", desc: "% de usuários que tocam “Permitir” no prompt nativo", kind: "Métrica primária" },
      { name: "Abandono no entorno do prompt", desc: "Saídas imediatamente antes e imediatamente depois do prompt", kind: "Métrica primária" },
      { name: "Conclusão da etapa de liveness", desc: "% que finaliza a captura com sucesso, do início da etapa ao fim", kind: "Métrica primária" },
      { name: "Tentativas de recuperação", desc: "Retorno e nova concessão após uma recusa", kind: "Secundária" },
      { name: "Tempo até concluir a verificação", desc: "A tela extra adiciona segundos; a hipótese é que reduz o tempo total ao evitar retrabalho", kind: "Guardrail" },
    ],
    s8p2: (<><strong>Sinal esperado em novas aplicações</strong>: maior concessão e menor abandono no grupo com preparação — na direção do observado na seção anterior — com aumento marginal e aceitável no tempo da etapa. Se o guardrail de tempo degradar sem ganho de concessão, a tela deve ser encurtada ou repensada.</>),

    s9label: "Síntese",
    s9title: "Compliance não precisa ser hostil",
    s9p1: (<>A etapa de liveness é o ponto em que os interesses do negócio (regulação, prevenção a fraude) e os do usuário (privacidade, controle) mais se tensionam. A resposta de design não é reduzir a exigência, mas <strong>reduzir a incerteza</strong>: dizer o que vai acontecer, por quê, e o que fazer — um passo antes de cada decisão.</>),
    s9p2: (<>É uma intervenção de uma tela, sem dependência de backend, de baixo custo de implementação e de teste. Exatamente o tipo de aposta que um time de produto consegue validar rápido — e o tipo de detalhe que separa um fluxo de compliance tolerável de um que quebra a jornada em silêncio.</>),
    s9p3: (<>A clareza que fica é quase banal de tão simples: <strong>ensinar antes de pedir</strong>. Quando o fluxo mostra o que vai acontecer e qual gesto executar, o consentimento deixa de ser um susto e vira a confirmação de algo já compreendido — em qualquer jornada regulada, não só nesta.</>),

    footerL: "Estudo autoral · Escrito e prototipado em React",
    footerR: "Gabriel Moreira · @gabrieltechdesign",
    deviceAria: "Protótipo interativo",
    deviceCaption: "Protótipo navegável do fluxo proposto. Avance pelos CTAs — e experimente negar a permissão para ver a recuperação.",
    resetLabel: "Reiniciar protótipo",

    phone: {
      stepAria: (s, t) => `Etapa ${s} de ${t}`,
      back: "‹ Voltar",
      homeTitle: "Verificação de identidade",
      homeSub: "Última etapa para concluir sua conta. Leva cerca de 2 minutos.",
      homeItems: ["Dados pessoais", "Documento de identidade", "Prova de vida"],
      done: "Concluído",
      pending: "Pendente",
      cta: "Avançar",
      exTitle: "Vamos confirmar que é você",
      exSub: "Uma selfie rápida protege sua conta contra fraudes.",
      exItems: [
        { t: "Selfie automática", d: "Centralize o rosto; a captura é automática." },
        { t: "Uso restrito", d: "Câmera usada apenas nesta verificação." },
        { t: "Exigência legal", d: "Bancos precisam confirmar o titular da conta." },
      ],
      prTitle: "Toque em “Permitir”",
      tutAria: "Demonstração animada: ao aparecer a solicitação do sistema, toque no botão Permitir",
      tutDeny: "Não Permitir",
      tutAllow: "Permitir",
      tutCaption: (<>O navegador vai pedir acesso à câmera. Toque em <b>Permitir</b>.</>),
      privacy: (<>Câmera usada <b>só nesta verificação</b>.</>),
      alertAria: "Solicitação de acesso à câmera",
      alertTitle: "“exemplo.com.br” Deseja Acessar a Câmera",
      alertMsg: "A câmera será usada para a prova de vida.",
      alertDeny: "Não Permitir",
      alertAllow: "Permitir",
      denTitle: "Câmera não habilitada",
      denSub: "Sem ela não dá para concluir a prova de vida. Para resolver:",
      denSteps: [
        (<>Toque em <b>Avançar</b> abaixo.</>),
        (<>Quando a solicitação aparecer, toque em <b>Permitir</b>.</>),
        (<>Se a solicitação não aparecer, habilite a câmera em <b>Ajustes › Navegador › Câmera</b>.</>),
      ],
      liveTitle: "Enquadre seu rosto",
      liveAria: "Visualização da câmera com moldura oval para enquadrar o rosto",
      liveMsgs: ["Centralize o rosto no oval", "Mantenha o rosto parado…", "Capturando…"],
      liveHint: "Procure um lugar iluminado e evite acessórios",
      procTitle: "Verificando…",
      procSub: "Isso leva alguns segundos.",
      okTitle: "Identidade verificada",
      okSub: "Sua prova de vida foi concluída. Você já pode continuar usando sua conta.",
      okCta: "Concluir",
    },
  },

  en: {
    locale: "en-US",
    meta: "Case study · KYC & Compliance UX · 2026",
    kicker: "Regulated financial onboarding",
    heroTitle: (<>Camera consent in KYC: <em>explain before you ask</em></>),
    lede: "A conceptual redesign of a high-friction compliance step: the moment users grant camera access for the liveness check. Two taps that, poorly prepared, can end the journey — and that, well prepared, cut denial by ~58% in a real project.",
    tags: ["KYC / Liveness", "Permission UX", "Progressive disclosure", "Error prevention", "React · Working prototype"],
    disclaimer: "Independent study. The core thesis was applied in a real project for a financial-sector client whose identity, interfaces, and data remain confidential. All screens here are a conceptual reconstruction; the only figure shared from the original study is the approximate relative gain (~58% denial), and every other number is an illustrative simulation.",

    s1label: "Context",
    s1title: "A mandatory step at the worst possible moment",
    s1p1: (<>In regulated financial onboarding, the liveness check is a compliance requirement: the institution must confirm that the person opening the account is real, present, and the holder of the submitted document. For the business, it's non-negotiable. For the user, it's the most invasive step of the journey — it involves the camera, their own face, and an operating-system permission request.</>),
    s1p2: (<>The native permission prompt has two traits that make it critical: <strong>the interface controls neither when nor how it reappears after a denial</strong>, and in many contexts (especially web flows in mobile browsers) a denial can't simply be “asked again.” Recovery requires the user to dig through system settings — a path most people don't know.</>),

    s2label: "Friction point",
    s2title: "Two taps that decide the journey",
    s2p1: (<>Without preparation, the camera prompt lands as an interruption: a system dialog, in system language, on top of a task the user hasn't fully understood yet. In that instant they must answer three questions at once: <strong>why the camera?</strong>, <strong>what happens to the image?</strong>, and <strong>what should I tap?</strong></>),
    s2p2: (<>When those answers don't exist, denial becomes the “safe” choice — a self-protection reflex, not an informed decision. And the cost is asymmetric: allowing costs one tap; denying can cost the account.</>),
    riskLabel: "The cost of denial",
    riskP: "Once permission is denied at the native prompt, the journey loses the ability to request it again in a simple way. The user hits a dead end: the step is mandatory, but recovery runs through system settings they rarely master. The likely outcome: silent abandonment.",

    s3label: "User behavior",
    s3title: "Users don't read — and surprise triggers defense",
    s3p1: (<>Anyone who watches onboarding funnels knows the pattern: the pop-up appears “out of nowhere” and the finger moves to <strong>“Don't Allow” before any reading happens</strong>. It isn't irrationality. Since 1997, Nielsen Norman Group research has shown that people rarely read interfaces word by word: in the original study, 79% of users scanned any new page and only 16% read it in full — a finding the group has reconfirmed for over two decades.</>),
    s3p2: (<>NN/g also distinguishes two kinds of permission requests: those tied to a user action (in context) and those <strong>initiated by the system</strong> at programmed moments. The latter demand extra explanation and are more likely to be denied, precisely because users can't connect the request to their own intent. A camera prompt fired in the middle of a banking sign-up is the extreme case of that category: sensitive resource, zero context, binary decision — in an industry where users are conditioned to suspect anything that smells like a scam.</>),
    s3p3: (<>The design conclusion is direct: if users don't read, <strong>the instruction can't depend on reading</strong>. And if denial is born from missing context, the context has to arrive before the request.</>),
    refsTitle: "Grounding",
    ref1: (<><i>3 Design Considerations for Effective Mobile-App Permission Requests</i> — system-initiated requests, detached from a user action, need extra context and are more prone to denial; the recommendation is to request permission at the moment the feature is needed.</>),
    ref2: (<><i>How Users Read on the Web</i> (1997) and <i>How People Read Online</i> (2020) — users scan rather than read; in the original study, 79% scanned new pages and only 16% read word by word.</>),

    s4label: "Hypothesis",
    s4title: "Prepare the decision, don't just request it",
    hypLabel: "Design hypothesis",
    hypP: (<>If the flow anticipates what will happen, explains why the camera is needed, and visually shows which action to take <em>before</em> firing the native prompt, then errors, denials, and abandonment at this step should drop — because the decision stops being a surprise and becomes the confirmation of something already understood.</>),
    s4p1: (<>The hypothesis doesn't try to hide the friction or “talk the user into it.” It reorganizes information so consent is informed, specific, and reversible — which, beyond better UX, is the spirit of consent in regulated contexts.</>),
    s4p2: (<>And it starts from the behavioral premise of the previous section: if users don't read, <strong>the instruction must teach without depending on reading</strong>. That's why the core of the intervention is a ~3-second animation showing the gesture — teaching by showing, not describing.</>),

    prSmall: "Core principle",
    prQuote: (<>“Explain <span>before</span> you ask.”</>),

    s5label: "Design decision",
    s5title: "One preparation screen between intent and prompt",
    s5p1: (<>The intervention is deliberately small: <strong>a single screen</strong>, placed immediately before the native prompt, with three elements — a title naming the exact action (“tap Allow”), a short animation demonstrating the system dialog and the correct button, and a privacy note scoping the camera's use. You can try it in the prototype alongside.</>),
    decisions: [
      { n: "a", t: "Progressive disclosure", p: "Information arrives in layers: first the why of the step (context screen), then the how of the permission (tutorial), and only then the prompt. Each screen answers one question and sets up the next — nothing is dumped at once." },
      { n: "b", t: "Removing surprise from the permission prompt", p: "The tutorial shows a generic replica of the system dialog. When the real prompt appears, the user recognizes it: they've seen that shape, they know which button to tap. The riskiest moment becomes the most predictable one." },
      { n: "c", t: "Building trust", p: "The microcopy scopes usage and reversibility: camera used only for the liveness check, now, with access revocable in settings. Specificity is what separates a legitimate request from a suspicious one." },
      { n: "d", t: "Error prevention over error correction", p: "Because denial is expensive to reverse, the design prioritizes preventing it (Nielsen: error prevention). The denial state still exists and is handled: it explains the consequence, offers a way back, and, as a last resort, points to system settings." },
      { n: "e", t: "Animation as instruction, not decoration", p: "The GIF/animation exists to transfer a mental model in ~3 seconds: “this will appear; tap here.” It's visual instruction at a lower cognitive cost than any paragraph — and it's the heart of the intervention." },
      { n: "f", t: "CTA always visible, no scrolling", p: "No screen in the flow requires scrolling to reach the primary button. On text-heavy screens, a CTA hidden below the fold is a recurring cause of drop-off — so content stays lean, icon-supported, and the button lives fixed at the base." },
    ],

    s6label: "Before / After",
    s6title: "Same prompt, two experiences",
    s6p1: (<>The difference between the two scenarios isn't the prompt — which is identical and outside the interface's control — but everything that happens before it. The prototype alongside walks through the proposed flow.</>),
    baBeforeTag: "No preparation",
    baBefore: [
      { t: "User taps “Start liveness check”" },
      { t: "System prompt appears with no context", c: "bad" },
      { t: "Decision under uncertainty: “why the camera?”" },
      { t: "Denial as a protection reflex" },
      { t: "Hard recovery · abandonment risk", c: "bad" },
    ],
    baAfterTag: "Proposed flow",
    baAfter: [
      { t: "Context: what the liveness check is and why" },
      { t: "Visual tutorial: “tap Allow”", c: "hl" },
      { t: "Privacy note: scope and reversibility" },
      { t: "Prompt arrives expected, not as a surprise", c: "hl" },
      { t: "Informed consent · liveness completed" },
    ],

    s7label: "Observed signal",
    s7title: "~58% fewer camera-permission denials",
    s7p1: (<>The direction came from an observation I carry from years inside journeys at large financial institutions: users don't read — so the flow has to teach. The thesis was applied in a real project for a large financial-sector client. For confidentiality, identity and raw data are withheld; what can be shared is the relative gain: in an A/B test, the variant with the preparation screen <strong>cut camera-permission denial by ~58%</strong>. The absolute percentages below are illustrative, parametrized to preserve that ratio.</>),
    donutBefore: "No preparation",
    donutAfter: "With tutorial",
    donutSub: "denial",
    deltaB: "~58%",
    deltaSpan: "approximate relative drop in denial — signal observed in the original project",
    figNote: "Approximate ratio (~58%) of the signal observed in the original project; absolute percentages (19% → 8%) and every other value in this section are illustrative.",
    simTag: "Illustrative simulation · fictional values",
    simP: (<>To size what that ratio means at scale, consider a retail bank running <strong>1.2 million identity verifications per month</strong> under the illustrative 19% → 8% denial scenario:</>),
    simBad: "journeys blocked per month in the no-preparation scenario (19% denial)",
    simMid: "journeys blocked with the preparation screen (8% denial)",
    simHl: "additional verifications completed per month: customers who finish onboarding instead of silently abandoning it",

    s8label: "Measurement",
    s8title: "What should be monitored",
    s8p1: (<>The original project's raw data is confidential — which is why this study treats measurement as a method, not a trophy. To replicate the thesis in a new context, this is the instrumentation I would define, ideally in an A/B test with and without the preparation screen:</>),
    metrics: [
      { name: "Permission grant rate", desc: "% of users who tap “Allow” on the native prompt", kind: "Primary metric" },
      { name: "Abandonment around the prompt", desc: "Exits immediately before and immediately after the prompt", kind: "Primary metric" },
      { name: "Liveness step completion", desc: "% who finish the capture successfully, start to end of the step", kind: "Primary metric" },
      { name: "Recovery attempts", desc: "Returns and new grants after a denial", kind: "Secondary" },
      { name: "Time to complete verification", desc: "The extra screen adds seconds; the hypothesis is it lowers total time by avoiding rework", kind: "Guardrail" },
    ],
    s8p2: (<><strong>Expected signal in new applications</strong>: higher grant rate and lower abandonment in the prepared group — in the direction observed in the previous section — with a marginal, acceptable increase in step time. If the time guardrail degrades without a grant-rate gain, the screen should be shortened or rethought.</>),

    s9label: "Takeaways",
    s9title: "Compliance doesn't have to be hostile",
    s9p1: (<>The liveness step is where business interests (regulation, fraud prevention) and user interests (privacy, control) pull hardest against each other. The design answer isn't to lower the requirement but to <strong>lower the uncertainty</strong>: say what will happen, why, and what to do — one step before each decision.</>),
    s9p2: (<>It's a one-screen intervention, backend-free, cheap to build and cheap to test. Exactly the kind of bet a product team can validate fast — and the kind of detail that separates a tolerable compliance flow from one that silently breaks the journey.</>),
    s9p3: (<>The lasting clarity is almost embarrassingly simple: <strong>teach before you ask</strong>. When the flow shows what will happen and which gesture to perform, consent stops being a scare and becomes the confirmation of something already understood — in any regulated journey, not just this one.</>),

    footerL: "Independent study · Written and prototyped in React",
    footerR: "Gabriel Moreira · @gabrieltechdesign",
    deviceAria: "Interactive prototype",
    deviceCaption: "Working prototype of the proposed flow. Move through the CTAs — and try denying the permission to see the recovery path.",
    resetLabel: "Restart prototype",

    phone: {
      stepAria: (s, t) => `Step ${s} of ${t}`,
      back: "‹ Back",
      homeTitle: "Identity verification",
      homeSub: "Last step to finish your account. Takes about 2 minutes.",
      homeItems: ["Personal details", "ID document", "Liveness check"],
      done: "Done",
      pending: "Pending",
      cta: "Continue",
      exTitle: "Let's confirm it's you",
      exSub: "A quick selfie protects your account from fraud.",
      exItems: [
        { t: "Automatic selfie", d: "Center your face; capture is automatic." },
        { t: "Limited use", d: "Camera used for this verification only." },
        { t: "Legal requirement", d: "Banks must confirm the account holder." },
      ],
      prTitle: "Tap “Allow”",
      tutAria: "Animated demo: when the system request appears, tap the Allow button",
      tutDeny: "Don't Allow",
      tutAllow: "Allow",
      tutCaption: (<>Your browser will ask for camera access. Tap <b>Allow</b>.</>),
      privacy: (<>Camera used <b>for this verification only</b>.</>),
      alertAria: "Camera access request",
      alertTitle: "“example.com” Would Like to Access the Camera",
      alertMsg: "The camera will be used for the liveness check.",
      alertDeny: "Don't Allow",
      alertAllow: "Allow",
      denTitle: "Camera not enabled",
      denSub: "We can't complete the liveness check without it. To fix it:",
      denSteps: [
        (<>Tap <b>Continue</b> below.</>),
        (<>When the request appears, tap <b>Allow</b>.</>),
        (<>If it doesn't appear, enable the camera in <b>Settings › Browser › Camera</b>.</>),
      ],
      liveTitle: "Frame your face",
      liveAria: "Camera view with an oval frame to position your face",
      liveMsgs: ["Center your face in the oval", "Hold still…", "Capturing…"],
      liveHint: "Find a well-lit spot and remove accessories",
      procTitle: "Verifying…",
      procSub: "This takes a few seconds.",
      okTitle: "Identity verified",
      okSub: "Your liveness check is complete. You can keep using your account.",
      okCta: "Finish",
    },
  },
};

/* ============================================================
   Ícones (inline SVG)
   ============================================================ */
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M4 12.5l5 5L20 6.5"/></svg>
);
const IconCheckBig = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>
);
const FaceSilhouette = () => (
  <svg viewBox="0 0 120 150" fill="none" aria-hidden="true">
    <ellipse cx="60" cy="58" rx="34" ry="40" fill="#AEB4C0"/>
    <path d="M14 150c4-34 24-48 46-48s42 14 46 48" fill="#AEB4C0"/>
  </svg>
);

/* ============================================================
   Animações de dados (scroll-triggered)
   ============================================================ */
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function CountUp({ to, started, duration = 1400, suffix = "", locale = "pt-BR" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    const reduce = typeof window !== "undefined" &&
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setVal(to); return; }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, to, duration]);
  return <>{new Intl.NumberFormat(locale).format(val)}{suffix}</>;
}

function Donut({ pct, color, label, sub, started, delay = 0, locale }) {
  const R = 56;
  const C = 2 * Math.PI * R;
  const offset = started ? C * (1 - pct / 100) : C;
  return (
    <div className="donut-card">
      <div className="donut" role="img" aria-label={`${label}: ${pct}% ${sub}`}>
        <svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
          <circle className="track" cx="75" cy="75" r={R} />
          <circle
            className="arc" cx="75" cy="75" r={R} stroke={color}
            strokeDasharray={C} strokeDashoffset={offset}
            style={{ transitionDelay: `${delay}ms` }}
          />
        </svg>
        <div className="center">
          <b><CountUp to={pct} started={started} duration={1300} suffix="%" locale={locale} /></b>
          <span>{sub}</span>
        </div>
      </div>
      <p className="donut-lbl">{label}</p>
    </div>
  );
}

/* ============================================================
   Telas do protótipo
   ============================================================ */
function StatusBar() {
  return (
    <div className="statusbar" aria-hidden="true">
      <span>9:41</span>
      <span className="icons">
        <svg className="sb-ico" width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.8"/><rect x="4.5" y="5" width="3" height="6" rx="0.8"/><rect x="9" y="2.5" width="3" height="8.5" rx="0.8"/><rect x="13.5" y="0" width="3" height="11" rx="0.8"/></svg>
        <svg className="sb-ico" width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 9.2a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8zM7.5 5.6c1.6 0 3 .6 4.1 1.7l-1.3 1.3a4.1 4.1 0 00-5.6 0L3.4 7.3A5.9 5.9 0 017.5 5.6zM7.5 2c2.6 0 4.9 1 6.7 2.7l-1.3 1.3A7.6 7.6 0 007.5 3.9c-2 0-3.9.8-5.4 2.1L.8 4.7A9.4 9.4 0 017.5 2z" transform="translate(0,-1.5)"/></svg>
        <svg className="sb-ico" width="23" height="11" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="15" height="8" rx="1.6" fill="currentColor"/><path d="M22.5 4v4c1-.3 1.6-1 1.6-2s-.6-1.7-1.6-2z" fill="currentColor" opacity="0.4"/></svg>
      </span>
    </div>
  );
}

function Dots({ step, total = 4, label }) {
  return (
    <div className="dots" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label={label}>
      {Array.from({ length: total }).map((_, i) => <i key={i} className={i < step ? "on" : ""} />)}
    </div>
  );
}

function ScreenHome({ p, onStart }) {
  return (
    <div className="scr" key="home">
      <div className="scr-nav" />
      <h4>{p.homeTitle}</h4>
      <p className="sub">{p.homeSub}</p>
      <div className="check-card">
        <div className="check-row done">
          <span className="st"><IconCheck /></span>
          <span className="lbl">{p.homeItems[0]}</span>
          <span className="hint">{p.done}</span>
        </div>
        <div className="check-row done">
          <span className="st"><IconCheck /></span>
          <span className="lbl">{p.homeItems[1]}</span>
          <span className="hint">{p.done}</span>
        </div>
        <div className="check-row pending">
          <span className="st">●</span>
          <span className="lbl">{p.homeItems[2]}</span>
          <span className="hint">{p.pending}</span>
        </div>
      </div>
      <div className="spacer" />
      <button className="p-btn" onClick={onStart}>{p.cta}</button>
    </div>
  );
}

function ScreenExplain({ p, onNext, onBack }) {
  const icons = [ScanFace, LockKeyhole, Landmark];
  return (
    <div className="scr" key="explain">
      <div className="scr-nav">
        <button className="scr-back" onClick={onBack}>{p.back}</button>
      </div>
      <Dots step={1} label={p.stepAria(1, 4)} />
      <h4>{p.exTitle}</h4>
      <p className="sub">{p.exSub}</p>
      {p.exItems.map((item, i) => {
        const Ic = icons[i];
        return (
          <div className="info-item" key={i}>
            <span className="ic" aria-hidden="true"><Ic strokeWidth={1.8} /></span>
            <div><b>{item.t}</b><span>{item.d}</span></div>
          </div>
        );
      })}
      <div className="spacer" />
      <button className="p-btn" onClick={onNext}>{p.cta}</button>
    </div>
  );
}

function ScreenPrepare({ p, onNext, onBack }) {
  return (
    <div className="scr" key="prepare">
      <div className="scr-nav">
        <button className="scr-back" onClick={onBack}>{p.back}</button>
      </div>
      <Dots step={2} label={p.stepAria(2, 4)} />
      <h4>{p.prTitle}</h4>
      <div className="tut" aria-label={p.tutAria}>
        <div className="tut-device" aria-hidden="true">
          <div className="tut-notch" />
          <div className="tut-lines"><i /><i /></div>
          <div className="tut-dialog">
            <div className="dl-t" /><div className="dl-b" />
            <div className="dl-actions">
              <span>{p.tutDeny}</span>
              <span className="allow">{p.tutAllow}</span>
            </div>
          </div>
          <div className="tut-tap" />
        </div>
        <p className="tut-caption">{p.tutCaption}</p>
      </div>
      <div className="privacy-note">
        <span className="lock" aria-hidden="true"><LockKeyhole strokeWidth={2} /></span>
        <span>{p.privacy}</span>
      </div>
      <div className="spacer" />
      <button className="p-btn" onClick={onNext}>{p.cta}</button>
    </div>
  );
}

function ScreenDenied({ p, onRetry }) {
  return (
    <div className="scr" key="denied">
      <div className="scr-nav" />
      <div className="denied-badge" aria-hidden="true"><CameraOff strokeWidth={1.8} /></div>
      <h4 style={{ textAlign: "center" }}>{p.denTitle}</h4>
      <p className="sub" style={{ textAlign: "center" }}>{p.denSub}</p>
      <div className="denied-steps">
        {p.denSteps.map((step, i) => (
          <div className="ds" key={i}><span className="n">{i + 1}</span><span>{step}</span></div>
        ))}
      </div>
      <div className="spacer" />
      <button className="p-btn" onClick={onRetry}>{p.cta}</button>
    </div>
  );
}

function ScreenLiveness({ p }) {
  const [msg, setMsg] = useState(p.liveMsgs[0]);
  useEffect(() => {
    setMsg(p.liveMsgs[0]);
    const t1 = setTimeout(() => setMsg(p.liveMsgs[1]), 1400);
    const t2 = setTimeout(() => setMsg(p.liveMsgs[2]), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [p]);
  return (
    <div className="scr" key="liveness">
      <div className="scr-nav" />
      <div className="live-wrap">
        <h4>{p.liveTitle}</h4>
        <div className="oval" role="img" aria-label={p.liveAria}>
          <div className="face"><FaceSilhouette /></div>
          <div className="scanline" />
        </div>
        <p className="live-status" aria-live="polite">{msg}</p>
        <p className="live-hint">{p.liveHint}</p>
      </div>
    </div>
  );
}

function ScreenProcessing({ p }) {
  return (
    <div className="scr" key="processing">
      <div className="proc-wrap">
        <div className="spinner" role="status" aria-label={p.procTitle} />
        <div style={{ textAlign: "center" }}>
          <h4 style={{ marginBottom: 4 }}>{p.procTitle}</h4>
          <p className="sub" style={{ marginBottom: 0 }}>{p.procSub}</p>
        </div>
      </div>
    </div>
  );
}

function ScreenSuccess({ p, onFinish }) {
  return (
    <div className="scr" key="success">
      <div className="success-wrap">
        <div className="success-badge"><IconCheckBig /></div>
        <h4>{p.okTitle}</h4>
        <p className="sub">{p.okSub}</p>
      </div>
      <button className="p-btn" onClick={onFinish}>{p.okCta}</button>
    </div>
  );
}

/* ============================================================
   Phone — máquina de estados
   ============================================================ */
function Phone({ p, resetKey, ariaLabel }) {
  const [screen, setScreen] = useState("home");
  const [prompt, setPrompt] = useState(false);

  useEffect(() => {
    setScreen("home");
    setPrompt(false);
  }, [resetKey]);

  useEffect(() => {
    if (screen === "liveness") {
      const t = setTimeout(() => setScreen("processing"), 3400);
      return () => clearTimeout(t);
    }
    if (screen === "processing") {
      const t = setTimeout(() => setScreen("success"), 2200);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const openPrompt = () => setPrompt(true);
  const handleAllow = () => { setPrompt(false); setScreen("liveness"); };
  const handleDeny = () => { setPrompt(false); setScreen("denied"); };

  return (
    <div className="phone" aria-label={ariaLabel}>
      <div className="phone-screen">
        <div className="island" aria-hidden="true" />
        <StatusBar />

        {screen === "home" && <ScreenHome p={p} onStart={() => setScreen("explain")} />}
        {screen === "explain" && (
          <ScreenExplain p={p} onNext={() => setScreen("prepare")} onBack={() => setScreen("home")} />
        )}
        {screen === "prepare" && (
          <ScreenPrepare p={p} onNext={openPrompt} onBack={() => setScreen("explain")} />
        )}
        {screen === "denied" && <ScreenDenied p={p} onRetry={openPrompt} />}
        {screen === "liveness" && <ScreenLiveness p={p} />}
        {screen === "processing" && <ScreenProcessing p={p} />}
        {screen === "success" && <ScreenSuccess p={p} onFinish={() => setScreen("home")} />}

        {prompt && (
          <div className="prompt-dim">
            <div className="ios-alert" role="alertdialog" aria-label={p.alertAria}>
              <div className="a-body">
                <p className="a-title">{p.alertTitle}</p>
                <p className="a-msg">{p.alertMsg}</p>
              </div>
              <div className="a-actions">
                <button onClick={handleDeny}>{p.alertDeny}</button>
                <button className="bold" onClick={handleAllow}>{p.alertAllow}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Página do case
   ============================================================ */
export default function CaseConsentimentoKYC() {
  const [lang, setLang] = useState("pt");
  const [resetKey, setResetKey] = useState(0);
  const [resultsRef, resultsIn] = useInView(0.25);
  const c = COPY[lang];

  return (
    <div className="case-root" lang={lang === "pt" ? "pt-BR" : "en"}>
      <style>{CSS}</style>

      <div className="shell">
        <header className="masthead">
          <span className="brand">Gabriel Moreira — Product Design</span>
          <span className="right">
            <span className="meta">{c.meta}</span>
            <span className="lang-switch" role="group" aria-label="Language">
              <button className={lang === "pt" ? "active" : ""} onClick={() => setLang("pt")} aria-pressed={lang === "pt"}>PT</button>
              <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
            </span>
          </span>
        </header>

        <div className="grid">
          {/* ============ NARRATIVA ============ */}
          <main className="col-narrative">
            <p className="kicker">{c.kicker}</p>
            <h1 className="hero">{c.heroTitle}</h1>
            <p className="lede">{c.lede}</p>
            <div className="hero-tags">
              {c.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
            </div>
            <p className="disclaimer">{c.disclaimer}</p>

            {/* 01 */}
            <section className="section">
              <div className="sec-label"><span className="num">01</span> {c.s1label}</div>
              <h2 className="sec-title">{c.s1title}</h2>
              <p>{c.s1p1}</p>
              <p>{c.s1p2}</p>
            </section>

            {/* 02 */}
            <section className="section">
              <div className="sec-label"><span className="num">02</span> {c.s2label}</div>
              <h2 className="sec-title">{c.s2title}</h2>
              <p>{c.s2p1}</p>
              <p>{c.s2p2}</p>
              <div className="callout risk">
                <p className="co-label">{c.riskLabel}</p>
                <p>{c.riskP}</p>
              </div>
            </section>

            {/* 03 */}
            <section className="section">
              <div className="sec-label"><span className="num">03</span> {c.s3label}</div>
              <h2 className="sec-title">{c.s3title}</h2>
              <p>{c.s3p1}</p>
              <p>{c.s3p2}</p>
              <p>{c.s3p3}</p>
              <div className="refs">
                <p className="refs-title">{c.refsTitle}</p>
                <div className="ref">
                  <span className="ref-src">Nielsen Norman Group</span>
                  <span>{c.ref1}</span>
                </div>
                <div className="ref">
                  <span className="ref-src">Nielsen Norman Group</span>
                  <span>{c.ref2}</span>
                </div>
              </div>
            </section>

            {/* 04 */}
            <section className="section">
              <div className="sec-label"><span className="num">04</span> {c.s4label}</div>
              <h2 className="sec-title">{c.s4title}</h2>
              <div className="callout hyp">
                <p className="co-label">{c.hypLabel}</p>
                <p>{c.hypP}</p>
              </div>
              <p>{c.s4p1}</p>
              <p>{c.s4p2}</p>
            </section>

            {/* Princípio */}
            <div className="principle">
              <p className="small">{c.prSmall}</p>
              <p className="quote">{c.prQuote}</p>
            </div>

            {/* 05 */}
            <section className="section">
              <div className="sec-label"><span className="num">05</span> {c.s5label}</div>
              <h2 className="sec-title">{c.s5title}</h2>
              <p>{c.s5p1}</p>
              <div className="decisions">
                {c.decisions.map((d) => (
                  <div className="decision" key={d.n}>
                    <span className="d-num">{d.n}</span>
                    <div>
                      <h3>{d.t}</h3>
                      <p>{d.p}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 06 */}
            <section className="section">
              <div className="sec-label"><span className="num">06</span> {c.s6label}</div>
              <h2 className="sec-title">{c.s6title}</h2>
              <p>{c.s6p1}</p>
              <div className="ba">
                <div className="ba-cell before">
                  <p className="ba-tag">{c.baBeforeTag}</p>
                  <ol>
                    {c.baBefore.map((li, i) => <li key={i} className={li.c || ""}>{li.t}</li>)}
                  </ol>
                </div>
                <div className="ba-cell after">
                  <p className="ba-tag">{c.baAfterTag}</p>
                  <ol>
                    {c.baAfter.map((li, i) => <li key={i} className={li.c || ""}>{li.t}</li>)}
                  </ol>
                </div>
              </div>
            </section>

            {/* 07 Sinal observado */}
            <section className="section" ref={resultsRef}>
              <div className="sec-label"><span className="num">07</span> {c.s7label}</div>
              <h2 className="sec-title">{c.s7title}</h2>
              <p>{c.s7p1}</p>
              <div className="charts">
                <Donut pct={19} color="#181A1F" label={c.donutBefore} sub={c.donutSub} started={resultsIn} locale={c.locale} />
                <div className="delta">
                  <b>{c.deltaB}</b>
                  <span>{c.deltaSpan}</span>
                </div>
                <Donut pct={8} color="#8A8E99" label={c.donutAfter} sub={c.donutSub} started={resultsIn} delay={350} locale={c.locale} />
              </div>
              <p className="fig-note">{c.figNote}</p>
              <div className="sim">
                <p className="sim-tag">{c.simTag}</p>
                <p>{c.simP}</p>
                <div className="sim-grid">
                  <div className="sim-cell bad">
                    <b><CountUp to={228000} started={resultsIn} locale={c.locale} /></b>
                    <span>{c.simBad}</span>
                  </div>
                  <div className="sim-cell">
                    <b><CountUp to={96000} started={resultsIn} locale={c.locale} /></b>
                    <span>{c.simMid}</span>
                  </div>
                  <div className="sim-cell hl">
                    <b>+<CountUp to={132000} started={resultsIn} duration={1800} locale={c.locale} /></b>
                    <span>{c.simHl}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 08 Medição */}
            <section className="section">
              <div className="sec-label"><span className="num">08</span> {c.s8label}</div>
              <h2 className="sec-title">{c.s8title}</h2>
              <p>{c.s8p1}</p>
              <div className="metrics">
                {c.metrics.map((m) => (
                  <div className="metric" key={m.name}>
                    <div>
                      <p className="m-name">{m.name}</p>
                      <p className="m-desc">{m.desc}</p>
                    </div>
                    <span className="m-kind">{m.kind}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 18 }}>{c.s8p2}</p>
            </section>

            {/* 09 Síntese */}
            <section className="section">
              <div className="sec-label"><span className="num">09</span> {c.s9label}</div>
              <h2 className="sec-title">{c.s9title}</h2>
              <p>{c.s9p1}</p>
              <p>{c.s9p2}</p>
              <p>{c.s9p3}</p>
            </section>

            <footer className="case-footer">
              <span>{c.footerL}</span>
              <span>{c.footerR}</span>
            </footer>
          </main>

          {/* ============ DEVICE ============ */}
          <aside className="col-device" aria-label={c.deviceAria}>
            <Phone p={c.phone} resetKey={`${lang}-${resetKey}`} ariaLabel={c.deviceAria} />
            <p className="mode-caption">{c.deviceCaption}</p>
            <button className="reset-btn" onClick={() => setResetKey((k) => k + 1)}>
              {c.resetLabel}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
