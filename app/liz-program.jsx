import React, { useState, useEffect, useRef, useCallback } from "react";

const ACCENT = "#e8006f";
const TEAL = "#00bcd4";
const BG = "#fafafa";
const SURFACE = "#ffffff";
const BORDER = "#ebebeb";
const TEXT = "#111111";
const MUTED = "#999999";

const REST_TIMES = {
  "Barbell Back Squat":240,"Front Squat":240,"Barbell RDL":240,"Clean Pull":240,
  "Barbell Bench Press":180,"Barbell Bent Over Row":180,"Barbell Strict Press":180,
  "Bulgarian Split Squat":180,"Hip Thrust":180,"Single-arm DB Row":120,
  "DB Incline Press":120,"DB Shoulder Press":120,"Walking Lunges":120,
  "Box Jump":120,"Push Press":120,"KB Swing":90,"GHD Hip Extension":90,
  "Single-leg RDL":90,"Step-up with Knee Drive":90,"DB Pullover":60,
  "DB Lateral Raise":60,"DB Rear Delt Fly":60,"Bicep Curl":60,
  "Hammer Curl":60,"Tricep Pushdown (DB)":60,"Single-leg Calf Raise":60,
  "Dead Bug":45,"Copenhagen Plank":45
};

const FIXED_PRESETS = [60, 120, 180];

const WORKOUTS = {
  upperA:[["Barbell Bench Press","4×8"],["Single-arm DB Row","4×10 ea"],["DB Shoulder Press","3×10"],["DB Pullover","3×12"],["DB Lateral Raise","3×12"],["Bicep Curl","3×12"],["Dead Bug","3×8 ea"]],
  upperB:[["Barbell Bent Over Row","4×8"],["DB Incline Press","4×10"],["Barbell Strict Press","3×8"],["DB Rear Delt Fly","3×15"],["Hammer Curl","3×12"],["Tricep Pushdown (DB)","3×12"],["Dead Bug","3×8 ea"]],
  lowerA:[["Barbell Back Squat","4×8"],["Barbell RDL","4×8"],["Hip Thrust","4×12"],["Walking Lunges","3×12 ea"],["GHD Hip Extension","3×12"],["Copenhagen Plank","3×20s ea"]],
  lowerB:[["Bulgarian Split Squat","4×8 ea"],["Clean Pull","3×4"],["Front Squat","3×6"],["Single-leg RDL","3×10 ea"],["Step-up with Knee Drive","3×10 ea"],["Single-leg Calf Raise","3×15 ea"]],
  upperAPower:[["KB Swing","3×10"],["Push Press","3×5"],["Barbell Bench Press","4×6"],["Single-arm DB Row","4×8 ea"],["DB Shoulder Press","3×8"],["DB Pullover","3×12"],["DB Lateral Raise","3×12"],["Bicep Curl","3×12"],["Dead Bug","3×8 ea"]],
  lowerAPower:[["Clean Pull","3×4 heavy"],["Box Jump","3×5"],["Barbell Back Squat","4×5"],["Barbell RDL","3×8 heavy"],["Hip Thrust","4×10"],["Walking Lunges","3×10 ea"],["GHD Hip Extension","3×12"],["Copenhagen Plank","3×20s ea"]],
  upperALight:[["Barbell Bench Press","3×8 light"],["Single-arm DB Row","3×10 ea"],["DB Shoulder Press","2×10"],["DB Lateral Raise","2×12"],["Bicep Curl","2×12"],["Dead Bug","3×8 ea"]],
  lowerALight:[["Barbell Back Squat","3×8 light"],["Barbell RDL","3×8 light"],["Hip Thrust","3×12"],["Walking Lunges","2×10 ea"],["GHD Hip Extension","2×12"],["Copenhagen Plank","2×20s ea"]],
  lowerBLight:[["Bulgarian Split Squat","3×8 ea light"],["Front Squat","2×6 light"],["Single-leg RDL","2×10 ea"],["Step-up with Knee Drive","2×10 ea"],["Single-leg Calf Raise","2×15 ea"]],
  upperBLight:[["Barbell Bent Over Row","3×8 light"],["DB Incline Press","3×10"],["Barbell Strict Press","2×8"],["DB Rear Delt Fly","2×15"],["Hammer Curl","2×12"],["Dead Bug","3×8 ea"]],
};

const PHASES = [
  {id:"p1",label:"Phase 1 · Foundation",weeks:[0,1,2,3]},
  {id:"p2",label:"Phase 2 · Build",weeks:[4,5,6,7,8]},
  {id:"p3",label:"Phase 3 · Cirque Alta",weeks:[9,10,11]},
  {id:"p4",label:"Phase 4 · Snowbird",weeks:[12,13,14,15,16]},
];

const WEEKS = [
  {label:"Wk 1",dates:"Apr 20–26",phase:"Phase 1 · Foundation",title:"Week 1 — Start",focus:"Movement quality · Run by effort · Aerobic base",days:[
    {id:"w1mon",day:"Monday",type:"lift",session:"Lower A",workout:"lowerA"},
    {id:"w1tue",day:"Tuesday",type:"lift",session:"Upper A",workout:"upperA"},
    {id:"w1wed",day:"Wednesday",type:"race",session:"🏃 Eagle Mountain Race",info:"Run by effort, not pace. Practice fueling."},
    {id:"w1thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w1fri",day:"Friday",type:"lift",session:"Upper B",workout:"upperB"},
    {id:"w1sat",day:"Saturday",type:"run",session:"Trail Run — 45 min easy",info:"Walk steep grades. Time on feet, not pace."},
    {id:"w1sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 2",dates:"Apr 27–May 3",phase:"Phase 1 · Foundation",title:"Week 2 — Build",focus:"Add weight where RPE allows",days:[
    {id:"w2mon",day:"Monday",type:"lift",session:"Lower A",workout:"lowerA"},
    {id:"w2tue",day:"Tuesday",type:"lift",session:"Upper A",workout:"upperA"},
    {id:"w2wed",day:"Wednesday",type:"race",session:"🏃 Dimple Dell Race",info:"Run by effort. Practice fueling."},
    {id:"w2thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w2fri",day:"Friday",type:"lift",session:"Upper B",workout:"upperB"},
    {id:"w2sat",day:"Saturday",type:"run",session:"Trail Run — 50 min easy",info:"Find elevation. Easy pace throughout."},
    {id:"w2sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 3",dates:"May 4–10",phase:"Phase 1 · Foundation",title:"Week 3 — Build",focus:"No race — Zone 2 run Wednesday",days:[
    {id:"w3mon",day:"Monday",type:"lift",session:"Lower A",workout:"lowerA"},
    {id:"w3tue",day:"Tuesday",type:"lift",session:"Upper A",workout:"upperA"},
    {id:"w3wed",day:"Wednesday",type:"run",session:"Run — 30–40 min Zone 2",info:"No race. Easy Zone 2. Conversational pace."},
    {id:"w3thu",day:"Thursday",type:"lift",session:"Lower B",workout:"lowerB"},
    {id:"w3fri",day:"Friday",type:"lift",session:"Upper B",workout:"upperB"},
    {id:"w3sat",day:"Saturday",type:"run",session:"Trail Run — 50 min, find hills",info:"Seek elevation. Walk steep grades."},
    {id:"w3sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 4 ↓",dates:"May 11–17",phase:"Phase 1 · Foundation",title:"Week 4 — Deload",focus:"40% less volume · Same load · Adaptation week",days:[
    {id:"w4mon",day:"Monday",type:"lift",session:"Lower A — 40% less volume",workout:"lowerA",note:"Cut sets by 40%. Keep same load."},
    {id:"w4tue",day:"Tuesday",type:"lift",session:"Upper A — 40% less volume",workout:"upperA",note:"Cut sets by 40%. Keep same load."},
    {id:"w4wed",day:"Wednesday",type:"race",session:"🏃 Soldier Hollow Race",info:"Deload week — easy effort only."},
    {id:"w4thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w4fri",day:"Friday",type:"lift",session:"Upper B — 40% less volume",workout:"upperB",note:"Cut sets by 40%. Keep same load."},
    {id:"w4sat",day:"Saturday",type:"run",session:"Easy trail — 40 min",info:"Flat-ish. Full recovery mode."},
    {id:"w4sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 5",dates:"May 18–24",phase:"Phase 2 · Build",title:"Week 5 — Load ↑",focus:"Power elements · Increase load · Start pushing",days:[
    {id:"w5mon",day:"Monday",type:"lift",session:"Lower A + Power",workout:"lowerAPower"},
    {id:"w5tue",day:"Tuesday",type:"lift",session:"Upper A + Power",workout:"upperAPower"},
    {id:"w5wed",day:"Wednesday",type:"race",session:"🏃 Heber Race",info:"Start pushing. Race the uphills hard."},
    {id:"w5thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w5fri",day:"Friday",type:"lift",session:"Upper B + Push Press",workout:"upperB",note:"Add Push Press 3×5 before the main session."},
    {id:"w5sat",day:"Saturday",type:"run",session:"Trail 55–65 min + hill surges",info:"2–3 hard uphill surges mid-run."},
    {id:"w5sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 6",dates:"May 25–31",phase:"Phase 2 · Build",title:"Week 6 — Push",focus:"No race — threshold work Wednesday",days:[
    {id:"w6mon",day:"Monday",type:"lift",session:"Lower A + Power",workout:"lowerAPower"},
    {id:"w6tue",day:"Tuesday",type:"lift",session:"Upper A — lower reps",workout:"upperAPower",note:"Drop main lifts to 4–6 reps at 75–85%."},
    {id:"w6wed",day:"Wednesday",type:"run",session:"Threshold Run — 3×8 min hard",info:"No race. 3×8 min threshold, 3 min easy between."},
    {id:"w6thu",day:"Thursday",type:"lift",session:"Lower B",workout:"lowerB"},
    {id:"w6fri",day:"Friday",type:"lift",session:"Upper B",workout:"upperB"},
    {id:"w6sat",day:"Saturday",type:"run",session:"Trail 60–65 min, elevation",info:"Seek steep terrain. Practice power hiking."},
    {id:"w6sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 7",dates:"Jun 1–7",phase:"Phase 2 · Build",title:"Week 7 — Push",focus:"Race week + heavy lifting",days:[
    {id:"w7mon",day:"Monday",type:"lift",session:"Lower A + Power",workout:"lowerAPower"},
    {id:"w7tue",day:"Tuesday",type:"lift",session:"Upper A — lower reps",workout:"upperAPower",note:"Main lifts 4–6 reps at 75–85%."},
    {id:"w7wed",day:"Wednesday",type:"race",session:"🏃 Dimple Dell Race",info:"Push it. Race uphills. Practice downhill mechanics."},
    {id:"w7thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w7fri",day:"Friday",type:"lift",session:"Upper B",workout:"upperB"},
    {id:"w7sat",day:"Saturday",type:"run",session:"Trail 60–65 min, elevation",info:"Seek steep terrain. Practice power hiking."},
    {id:"w7sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 8",dates:"Jun 8–14",phase:"Phase 2 · Build",title:"Week 8 — Peak Volume",focus:"Highest training volume · Fitness test race",days:[
    {id:"w8mon",day:"Monday",type:"lift",session:"Lower A + Power",workout:"lowerAPower",note:"Push RDL and squat loads hard."},
    {id:"w8tue",day:"Tuesday",type:"lift",session:"Upper A",workout:"upperAPower"},
    {id:"w8wed",day:"Wednesday",type:"race",session:"🏃 Deer Valley Race",info:"Full race effort. Fitness test. Note how you feel."},
    {id:"w8thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w8fri",day:"Friday",type:"lift",session:"Upper B",workout:"upperB"},
    {id:"w8sat",day:"Saturday",type:"run",session:"Trail 65–70 min + fuel at 45",info:"Practice race-day fueling. Electrolytes + snack at 45 min."},
    {id:"w8sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 9",dates:"Jun 15–21",phase:"Phase 2 · Build",title:"Week 9 — Build",focus:"No race — hill repeats Wednesday",days:[
    {id:"w9mon",day:"Monday",type:"lift",session:"Lower A + Power",workout:"lowerAPower"},
    {id:"w9tue",day:"Tuesday",type:"lift",session:"Upper A",workout:"upperAPower"},
    {id:"w9wed",day:"Wednesday",type:"run",session:"Hill Repeats — 6×90 sec",info:"6–8×90 sec hard uphill, walk back down. Easy cool-down."},
    {id:"w9thu",day:"Thursday",type:"lift",session:"Lower B",workout:"lowerB"},
    {id:"w9fri",day:"Friday",type:"lift",session:"Upper B",workout:"upperB"},
    {id:"w9sat",day:"Saturday",type:"run",session:"Trail 65–70 min + full fuel",info:"Practice exact race-day fueling. Lock it in."},
    {id:"w9sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 10",dates:"Jun 22–28",phase:"Phase 3 · Cirque Alta",title:"Week 10 — Peak",focus:"Highest intensity · Full race effort",days:[
    {id:"w10mon",day:"Monday",type:"lift",session:"Lower A — 80–90%",workout:"lowerAPower",note:"Heavy clean pulls and squats. Best effort."},
    {id:"w10tue",day:"Tuesday",type:"lift",session:"Upper A — 80–90%",workout:"upperAPower",note:"Highest intensity of the program."},
    {id:"w10wed",day:"Wednesday",type:"race",session:"🏃 Solitude Race",info:"Full race effort. Peak fitness. Note your splits."},
    {id:"w10thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w10fri",day:"Friday",type:"lift",session:"Upper B",workout:"upperB"},
    {id:"w10sat",day:"Saturday",type:"run",session:"Trail 70 min + full fuel protocol",info:"Practice exact Cirque Alta fueling."},
    {id:"w10sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 11 ↓",dates:"Jun 29–Jul 5",phase:"Phase 3 · Cirque Alta",title:"Week 11 — Taper",focus:"Keep intensity · Cut volume 30% · Sleep is training",days:[
    {id:"w11mon",day:"Monday",type:"lift",session:"Lower A — 30% less volume",workout:"lowerA",note:"Cut sets by 30%. Keep same load."},
    {id:"w11tue",day:"Tuesday",type:"lift",session:"Upper A — 30% less volume",workout:"upperA",note:"Cut sets by 30%. Keep same load."},
    {id:"w11wed",day:"Wednesday",type:"run",session:"Easy run — 25 min + strides",info:"No race. Easy jog. 4–5 uphill strides to stay sharp."},
    {id:"w11thu",day:"Thursday",type:"lift",session:"Lower B — 30% less volume",workout:"lowerB",note:"Cut sets by 30%. Keep same load."},
    {id:"w11fri",day:"Friday",type:"lift",session:"Upper B — 30% less volume",workout:"upperB",note:"Cut sets by 30%. Keep same load."},
    {id:"w11sat",day:"Saturday",type:"run",session:"Easy trail — 40 min",info:"Flat to moderate. Easy effort. Legs fresh."},
    {id:"w11sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 12 ⛰",dates:"Jul 6–12",phase:"Phase 3 · Cirque Alta",title:"Week 12 — Cirque Alta",focus:"Race week · Sleep · Nutrition locked · Legs fresh",isCirque:true,days:[
    {id:"w12mon",day:"Monday",type:"lift",session:"Lower A — light",workout:"lowerALight",note:"Light loads only. Movement, not stimulus."},
    {id:"w12tue",day:"Tuesday",type:"lift",session:"Upper A — light",workout:"upperALight",note:"Light loads only."},
    {id:"w12wed",day:"Wednesday",type:"race",session:"🏃 Alta Series — EASY only",info:"Shakeout only. Do NOT race hard. Cirque Alta is Sunday July 11."},
    {id:"w12thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w12fri",day:"Friday",type:"run",session:"20 min easy + uphill strides",info:"Easy jog. 4–5 uphill strides. Legs fresh and snappy."},
    {id:"w12sat",day:"Saturday",type:"rest",session:"Rest — prep + sleep"},
    {id:"w12sun",day:"Sunday",type:"race",session:"⛰ CIRQUE ALTA — RACE DAY",info:"Feed or pump before start. Electrolytes from mile 1. Fuel at 35–40 min.",isCirque:true},
  ]},
  {label:"Wk 13",dates:"Jul 13–19",phase:"Phase 4 · Rebuild for Snowbird",title:"Week 13 — Recover",focus:"Easy everything · You just raced Cirque Alta",days:[
    {id:"w13mon",day:"Monday",type:"lift",session:"Lower A — light",workout:"lowerALight",note:"Light loads. Movement quality only."},
    {id:"w13tue",day:"Tuesday",type:"lift",session:"Upper A — light",workout:"upperALight",note:"Light loads. Focus on how the body feels."},
    {id:"w13wed",day:"Wednesday",type:"race",session:"🏃 Snowbird Series — easy",info:"Easy effort. Active recovery. Don't race it."},
    {id:"w13thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w13fri",day:"Friday",type:"lift",session:"Upper B — light",workout:"upperBLight",note:"Light loads."},
    {id:"w13sat",day:"Saturday",type:"run",session:"Easy trail — 45 min",info:"Flat-ish. No pushing. Full recovery."},
    {id:"w13sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 14",dates:"Jul 20–26",phase:"Phase 4 · Rebuild for Snowbird",title:"Week 14 — Rebuild",focus:"Back to full load · Second peak begins",days:[
    {id:"w14mon",day:"Monday",type:"lift",session:"Lower A — back to load",workout:"lowerAPower"},
    {id:"w14tue",day:"Tuesday",type:"lift",session:"Upper A — back to load",workout:"upperAPower"},
    {id:"w14wed",day:"Wednesday",type:"run",session:"Run — 35 min Zone 2",info:"No race. Easy Zone 2. Build back aerobic base."},
    {id:"w14thu",day:"Thursday",type:"lift",session:"Lower B",workout:"lowerB"},
    {id:"w14fri",day:"Friday",type:"lift",session:"Upper B",workout:"upperB"},
    {id:"w14sat",day:"Saturday",type:"run",session:"Trail 55–65 min + elevation",info:"Seek real elevation. Moderate effort."},
    {id:"w14sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 15",dates:"Jul 27–Aug 2",phase:"Phase 4 · Rebuild for Snowbird",title:"Week 15 — Build",focus:"Full load · Race hard · Trail volume up",days:[
    {id:"w15mon",day:"Monday",type:"lift",session:"Lower A + Power",workout:"lowerAPower"},
    {id:"w15tue",day:"Tuesday",type:"lift",session:"Upper A + Power",workout:"upperAPower"},
    {id:"w15wed",day:"Wednesday",type:"race",session:"🏃 Brighton Race",info:"Push it hard. You're rebuilding fitness fast."},
    {id:"w15thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w15fri",day:"Friday",type:"lift",session:"Upper B",workout:"upperB"},
    {id:"w15sat",day:"Saturday",type:"run",session:"Trail 65–70 min + full fuel",info:"Practice exact Cirque Snowbird fueling."},
    {id:"w15sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 16",dates:"Aug 3–9",phase:"Phase 4 · Rebuild for Snowbird",title:"Week 16 — Peak",focus:"Final peak week · Go hard · Sleep well",days:[
    {id:"w16mon",day:"Monday",type:"lift",session:"Lower A — 80–90%",workout:"lowerAPower",note:"Peak intensity. Heavy clean pulls and squats."},
    {id:"w16tue",day:"Tuesday",type:"lift",session:"Upper A — 80–90%",workout:"upperAPower",note:"Highest intensity. Push hard."},
    {id:"w16wed",day:"Wednesday",type:"race",session:"🏃 Alta Series Race",info:"Full race effort. Peak fitness."},
    {id:"w16thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w16fri",day:"Friday",type:"lift",session:"Upper B",workout:"upperB"},
    {id:"w16sat",day:"Saturday",type:"run",session:"Trail 60–65 min moderate",info:"Moderate effort. Don't empty the tank."},
    {id:"w16sun",day:"Sunday",type:"rest",session:"Rest"},
  ]},
  {label:"Wk 17 ⛰",dates:"Aug 10–16",phase:"Phase 4 · Cirque Snowbird",title:"Week 17 — Cirque Snowbird",focus:"Race week · Sleep · Nutrition locked · Legs fresh",isCirque:true,days:[
    {id:"w17mon",day:"Monday",type:"lift",session:"Lower A — light",workout:"lowerALight",note:"Light loads only."},
    {id:"w17tue",day:"Tuesday",type:"lift",session:"Upper A — light",workout:"upperALight",note:"Light loads only."},
    {id:"w17wed",day:"Wednesday",type:"race",session:"🏃 Snowbird Series — EASY only",info:"Shakeout only. Cirque Snowbird is Saturday August 15."},
    {id:"w17thu",day:"Thursday",type:"rest",session:"Rest"},
    {id:"w17fri",day:"Friday",type:"run",session:"15 min easy + uphill strides",info:"Very easy. 3–4 uphill strides. Done."},
    {id:"w17sat",day:"Saturday",type:"race",session:"⛰ CIRQUE SNOWBIRD — RACE DAY",info:"Feed or pump before start. Electrolytes from mile 1. Fuel at 35–40 min.",isCirque:true},
    {id:"w17sun",day:"Sunday",type:"rest",session:"Rest — you did it 🎉"},
  ]},
];

function fmt(s){ s = Math.max(0,s); return Math.floor(s/60)+":"+(String(s%60).padStart(2,"0")); }

function buildPrevWeights(weights, allWeeks) {
  const result = {};
  allWeeks.forEach((wk, wi) => {
    wk.days.forEach(day => {
      if (!day.workout || !WORKOUTS[day.workout]) return;
      WORKOUTS[day.workout].forEach((ex, ei) => {
        const exId = `w${wi}-${day.id}-ex${ei}`;
        const exName = ex[0];
        const sets = weights[exId];
        if (!sets || typeof sets !== 'object') return;
        const hasSets = Object.values(sets).some(v => v && v.trim() !== '');
        if (!hasSets) return;
        if (!result[exName]) result[exName] = {};
        Object.keys(sets).forEach(si => {
          const val = sets[si];
          if (val && val.trim() !== '') result[exName][parseInt(si)] = val;
        });
      });
    });
  });
  return result;
}

function parseNumSets(setsStr){
  const m = setsStr.match(/^(\d+)/);
  return m ? parseInt(m[1]) : 3;
}

function launchConfetti(x, y, colors) {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const particles = [];
  for (let i = 0; i < 80; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 4 + Math.random() * 10;
    particles.push({
      x, y, vx: Math.cos(a)*sp*(Math.random()>0.5?1:-1), vy: -Math.random()*14-4,
      size: 5+Math.random()*7, color: colors[Math.floor(Math.random()*colors.length)],
      rotation: Math.random()*360, rotSpeed: (Math.random()-0.5)*12,
      opacity: 1, shape: Math.random()>0.4?"rect":"circle", gravity: 0.35+Math.random()*0.2
    });
  }
  const draw = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const alive = particles.filter(p=>p.opacity>0.05);
    if (!alive.length) { ctx.clearRect(0,0,canvas.width,canvas.height); return; }
    alive.forEach(p=>{
      p.x+=p.vx; p.vy+=p.gravity; p.y+=p.vy; p.rotation+=p.rotSpeed; p.vx*=0.99;
      if(p.y>canvas.height*0.8) p.opacity-=0.03;
      ctx.save(); ctx.globalAlpha=p.opacity; ctx.translate(p.x,p.y); ctx.rotate(p.rotation*Math.PI/180); ctx.fillStyle=p.color;
      if(p.shape==="rect"){ ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2); }
      else { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
      ctx.restore();
    });
    particles.splice(0, particles.length, ...alive);
    requestAnimationFrame(draw);
  };
  draw();
}

function RestTimer({ exName, seconds, onClose }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState(seconds);
  const intervalRef = useRef(null);
  const presets = FIXED_PRESETS;

  useEffect(() => {
    setSelected(seconds);
    setRemaining(seconds);
    setRunning(true); // auto-start when opened
  }, [seconds, exName]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current); setRunning(false);
            try { navigator.vibrate && navigator.vibrate([200,100,200,100,400]); } catch(e){}
            setTimeout(() => onClose(), 1500);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const finished = remaining === 0;

  const nudge = (delta) => {
    const next = Math.max(10, remaining + delta);
    setRemaining(next);
    setSelected(next);
  };

  const selectPreset = (p) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSelected(p);
    setRemaining(p);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 20px"}}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{background:SURFACE,borderRadius:16,padding:"24px 24px 28px",width:"100%",maxWidth:360,position:"relative",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,width:32,height:32,border:"none",background:"rgba(0,0,0,0.07)",borderRadius:"50%",cursor:"pointer",fontSize:18,color:MUTED,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600}}>×</button>
        {exName && <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:1,textTransform:"uppercase",color:ACCENT,marginBottom:4,paddingRight:40}}>{exName}</div>}
        {seconds && <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:MUTED,marginBottom:14}}>recommended: {fmt(seconds)}</div>}
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:96,textAlign:"center",lineHeight:1,letterSpacing:3,color:finished?TEAL:running?ACCENT:TEXT,marginBottom:16,transition:"color 0.3s"}}>
          {fmt(remaining)}
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16}}>
          <button onClick={()=>nudge(-10)} style={{fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:600,padding:"8px 16px",border:`1.5px solid ${BORDER}`,borderRadius:8,cursor:"pointer",color:TEXT,background:BG}}>−10s</button>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:MUTED,letterSpacing:1}}>adjust</span>
          <button onClick={()=>nudge(10)} style={{fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:600,padding:"8px 16px",border:`1.5px solid ${BORDER}`,borderRadius:8,cursor:"pointer",color:TEXT,background:BG}}>+10s</button>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16}}>
          {presets.map(p=>(
            <button key={p} onClick={()=>selectPreset(p)}
              style={{fontFamily:"'DM Mono',monospace",fontSize:13,padding:"9px 0",border:`1.5px solid ${p===selected?ACCENT:BORDER}`,borderRadius:8,cursor:"pointer",color:p===selected?ACCENT:TEXT,background:p===selected?"rgba(232,0,111,0.08)":BG,flex:1}}>
              {fmt(p)}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>{clearInterval(intervalRef.current);setRunning(false);setRemaining(selected);}}
            style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:600,padding:14,borderRadius:10,cursor:"pointer",border:`1.5px solid ${BORDER}`,background:BG,color:TEXT,width:90}}>Reset</button>
          <button onClick={()=>setRunning(r=>!r)}
            style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:600,padding:14,borderRadius:10,cursor:"pointer",border:"none",background:finished?TEAL:ACCENT,color:"white",flex:1}}>
            {finished?"Done ✓":running?"Pause":"Start"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ExerciseRow({ exId, exName, setsStr, weights, prs, prevWeights, onWeightChange, onTimerOpen }) {
  const numSets = parseNumSets(setsStr);
  const sets = weights[exId] || {};
  const allFilled = Object.keys(sets).length >= numSets && Object.values(sets).every(v=>v&&v.trim()!=="");
  const maxVal = Object.values(sets).map(v=>parseFloat(v)).filter(n=>!isNaN(n)&&n>0);
  const isPR = maxVal.length > 0 && prs[exName] && Math.max(...maxVal) >= prs[exName];
  const rs = REST_TIMES[exName] || 120;

  return (
    <div style={{padding:"14px 0",borderBottom:`1px solid ${BORDER}`}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
            <span style={{fontSize:17,fontWeight:600,color:TEXT}}>{exName}</span>
            {isPR && <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,background:ACCENT,color:"white",padding:"2px 7px",borderRadius:4}}>PR</span>}
            {allFilled && <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,background:TEAL,color:"white",padding:"2px 7px",borderRadius:4}}>✓</span>}
          </div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:MUTED,marginBottom:6}}>{setsStr}</div>
          <div onClick={()=>onTimerOpen(exName, rs)}
            style={{display:"inline-flex",alignItems:"center",gap:4,fontFamily:"'DM Mono',monospace",fontSize:13,color:TEAL,cursor:"pointer",background:"rgba(0,188,212,0.08)",border:"1px solid rgba(0,188,212,0.2)",borderRadius:4,padding:"3px 8px"}}>
            ⏱ {fmt(rs)} rest
          </div>
        </div>
        <div style={{flexShrink:0,display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
          {Array.from({length:numSets},(_,si)=>{
            const val = sets[si] || "";
            const filled = val && val.trim()!=="";
            return (
              <div key={si} style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:filled?TEAL:MUTED,minWidth:28,textAlign:"right"}}>S{si+1}</span>
                <div style={{position:"relative",display:"inline-block"}}>
                  <input type="text" inputMode="decimal" value={val}
                    placeholder={prevWeights&&prevWeights[exName]&&prevWeights[exName][si] ? prevWeights[exName][si]+" lbs" : "lbs"}
                    onChange={e=>onWeightChange(exId,exName,si,numSets,e.target.value)}
                    style={{fontFamily:"'DM Mono',monospace",fontSize:18,width:88,textAlign:"center",padding:"10px 8px",border:`1.5px solid ${filled?TEAL:BORDER}`,borderRadius:8,background:filled?"rgba(0,188,212,0.05)":BG,color:filled?TEAL:TEXT,outline:"none"}}/>
                  {!filled && prevWeights&&prevWeights[exName]&&prevWeights[exName][si] && (
                    <div style={{position:"absolute",bottom:-16,left:0,right:0,textAlign:"center",fontFamily:"'DM Mono',monospace",fontSize:10,color:MUTED,pointerEvents:"none"}}>
                      last: {prevWeights[exName][si]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayCard({ day, wkId, weights, prs, done, notes, prevWeights, onDone, onWeightChange, onNoteChange, onTimerOpen }) {
  const [open, setOpen] = useState(false);
  const isRest = day.type==="rest";
  const isLift = day.type==="lift";
  const hasWorkout = isLift && day.workout && WORKOUTS[day.workout];
  const isDone = done[`${wkId}-${day.id}`];
  const isCirque = day.isCirque;
  const noteKey = `${wkId}-${day.id}`;

  return (
    <div style={{margin:"10px 12px",background:SURFACE,border:`1px solid ${isDone?TEAL:isCirque?ACCENT:BORDER}`,borderRadius:12,overflow:"hidden",boxShadow:isDone?`0 0 0 1px ${TEAL}`:isCirque?`0 0 0 1px ${ACCENT}`:"0 1px 4px rgba(0,0,0,0.04)"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px",cursor:"pointer",background:isDone?"rgba(0,188,212,0.06)":isCirque?"rgba(232,0,111,0.04)":"transparent"}}
        onClick={e=>{ if(e.target.closest("[data-check]")) return; if(!isRest) setOpen(o=>!o); }}>
        <div data-check="1" onClick={e=>{e.stopPropagation();onDone(`${wkId}-${day.id}`);}}
          style={{width:32,height:32,border:`2px solid ${isDone?TEAL:BORDER}`,borderRadius:7,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:isDone?"white":"transparent",background:isDone?TEAL:BG,cursor:"pointer",transition:"all 0.15s"}}>✓</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:2,textTransform:"uppercase",color:MUTED,marginBottom:3}}>{day.day}</div>
          <div style={{fontSize:18,fontWeight:600,color:TEXT,opacity:isDone?0.4:1,textDecoration:isDone?"line-through":"none"}}>{day.session}</div>
        </div>
        {!isRest && <div style={{fontSize:14,color:MUTED,transition:"transform 0.2s",transform:open?"rotate(180deg)":"none"}}>▾</div>}
      </div>
      {open && !isRest && (
        <div style={{borderTop:`1px solid ${BORDER}`,padding:14}}>
          {day.note && <div style={{fontSize:15,color:MUTED,marginBottom:14,padding:"9px 11px",background:"rgba(232,0,111,0.07)",borderRadius:7,borderLeft:`2px solid ${ACCENT}`,lineHeight:1.5}}>{day.note}</div>}
          {day.info && !hasWorkout && <div style={{fontSize:15,color:TEXT,lineHeight:1.7,marginBottom:14}}>{day.info}</div>}
          {hasWorkout && WORKOUTS[day.workout].map((ex,ei)=>(
            <ExerciseRow key={ei} exId={`${wkId}-${day.id}-ex${ei}`} exName={ex[0]} setsStr={ex[1]}
              weights={weights} prs={prs} prevWeights={prevWeights}
              onWeightChange={onWeightChange} onTimerOpen={onTimerOpen}/>
          ))}
          <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${BORDER}`}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:1,textTransform:"uppercase",color:MUTED,marginBottom:6}}>Notes</div>
            <textarea value={notes[noteKey]||""} onChange={e=>onNoteChange(noteKey,e.target.value)}
              placeholder={hasWorkout?"How it felt, energy, anything...":"Pace, effort, how it felt..."} rows={2}
              style={{width:"100%",fontFamily:"'DM Sans',sans-serif",fontSize:16,padding:"10px 12px",border:`1.5px solid ${BORDER}`,borderRadius:8,background:BG,color:TEXT,outline:"none",resize:"none",boxSizing:"border-box"}}/>
          </div>
        </div>
      )}
    </div>
  );
}

function PRPanel({ prs, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [editingName, setEditingName] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [addName, setAddName] = useState("");
  const [addVal, setAddVal] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const prEntries = Object.entries(prs).filter(([,v])=>v>0).sort((a,b)=>a[0].localeCompare(b[0]));

  const startEdit = (name, val) => { setEditingName(name); setEditVal(String(val)); };
  const commitEdit = (name) => {
    const n = parseFloat(editVal);
    if (!isNaN(n) && n > 0) onUpdate(name, n);
    setEditingName(null);
  };
  const handleAdd = () => {
    const n = parseFloat(addVal);
    if (addName.trim() && !isNaN(n) && n > 0) {
      onUpdate(addName.trim(), n);
      setAddName(""); setAddVal(""); setShowAdd(false);
    }
  };

  return (
    <div style={{margin:"10px 12px",background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
      <div style={{padding:"13px 14px",display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:1.5,textTransform:"uppercase",color:MUTED,flex:1}}>Personal Records</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,background:ACCENT,color:"white",padding:"2px 8px",borderRadius:4}}>{prEntries.length} PRs</span>
        <span style={{fontSize:14,color:MUTED,transition:"transform 0.2s",transform:open?"rotate(180deg)":"none"}}>▾</span>
      </div>
      {open && (
        <div style={{borderTop:`1px solid ${BORDER}`}}>
          {prEntries.length===0 && !showAdd && (
            <div style={{padding:"18px 14px",fontSize:15,color:MUTED,fontStyle:"italic",textAlign:"center"}}>No PRs logged yet. Start lifting.</div>
          )}
          {prEntries.map(([name, val])=>(
            <div key={name} style={{display:"flex",alignItems:"center",padding:"10px 14px",borderBottom:`1px solid ${BORDER}`,gap:10}}>
              <span style={{flex:1,fontSize:15,fontWeight:500,color:TEXT}}>{name}</span>
              {editingName===name ? (
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <input type="text" inputMode="decimal" value={editVal} autoFocus
                    onChange={e=>setEditVal(e.target.value)}
                    onKeyDown={e=>{ if(e.key==="Enter") commitEdit(name); if(e.key==="Escape") setEditingName(null); }}
                    style={{fontFamily:"'DM Mono',monospace",fontSize:16,width:80,textAlign:"center",padding:"8px 6px",border:`1.5px solid ${ACCENT}`,borderRadius:8,background:BG,color:ACCENT,outline:"none"}}/>
                  <button onClick={()=>commitEdit(name)} style={{padding:"8px 12px",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,border:"none",borderRadius:8,background:TEAL,color:"white",cursor:"pointer"}}>✓</button>
                  <button onClick={()=>setEditingName(null)} style={{padding:"8px 12px",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,border:`1px solid ${BORDER}`,borderRadius:8,background:BG,color:MUTED,cursor:"pointer"}}>✕</button>
                </div>
              ) : (
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:16,color:ACCENT,fontWeight:500}}>{val} lbs</span>
                  <button onClick={()=>startEdit(name,val)} style={{padding:"6px 10px",fontFamily:"'DM Mono',monospace",fontSize:12,border:`1px solid ${BORDER}`,borderRadius:6,background:BG,color:MUTED,cursor:"pointer"}}>edit</button>
                  <button onClick={()=>onDelete(name)} style={{padding:"6px 10px",fontFamily:"'DM Mono',monospace",fontSize:12,border:`1px solid ${BORDER}`,borderRadius:6,background:BG,color:"#ff4444",cursor:"pointer"}}>×</button>
                </div>
              )}
            </div>
          ))}
          {showAdd ? (
            <div style={{padding:"12px 14px",borderBottom:`1px solid ${BORDER}`,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <input type="text" value={addName} onChange={e=>setAddName(e.target.value)} placeholder="Exercise name"
                style={{flex:2,minWidth:120,fontFamily:"'DM Sans',sans-serif",fontSize:15,padding:"9px 10px",border:`1.5px solid ${BORDER}`,borderRadius:8,background:BG,color:TEXT,outline:"none"}}/>
              <input type="text" inputMode="decimal" value={addVal} onChange={e=>setAddVal(e.target.value)} placeholder="lbs"
                onKeyDown={e=>{ if(e.key==="Enter") handleAdd(); }}
                style={{width:70,fontFamily:"'DM Mono',monospace",fontSize:15,padding:"9px 8px",border:`1.5px solid ${BORDER}`,borderRadius:8,background:BG,color:TEXT,outline:"none",textAlign:"center"}}/>
              <button onClick={handleAdd} style={{padding:"9px 14px",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,border:"none",borderRadius:8,background:TEAL,color:"white",cursor:"pointer"}}>Add</button>
              <button onClick={()=>{setShowAdd(false);setAddName("");setAddVal("");}} style={{padding:"9px 14px",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,border:`1px solid ${BORDER}`,borderRadius:8,background:BG,color:MUTED,cursor:"pointer"}}>Cancel</button>
            </div>
          ) : (
            <div style={{padding:"12px 14px"}}>
              <button onClick={()=>setShowAdd(true)} style={{width:"100%",padding:"10px",fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:1,textTransform:"uppercase",border:`1.5px dashed ${BORDER}`,borderRadius:8,background:"transparent",color:MUTED,cursor:"pointer"}}>
                + Add PR
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LogTab — daily macro + wellness logging
// ---------------------------------------------------------------------------
//
// URL DEEP LINK BRIDGE
// The daily-log Claude skill generates a URL like:
//   https://lizb-droid.github.io/personal-projects/body-optimization/app/?log=1&p=142&c=180&f=52&kcal=2180
//
// Supported params:
//   log=1   — trigger flag (required; tells app to switch to Log tab)
//   p       — protein in grams
//   c       — carbs in grams
//   f       — fat in grams
//   kcal    — calories
//   tab     — optional override: "log" | "workout" | "program"
//
// Unknown params are left empty (not zeroed) so a partial log stays honest.
// After reading, params are cleared from the URL via history.replaceState
// so the URL stays clean and Back navigation doesn't re-trigger the import.
//
// IMPORTANT: This is Option A for the cached-PWA edge case.
// If the app is already open and Safari brings the existing tab forward
// without reloading, the params won't be read on that tap. A second tap
// (which triggers a reload) will catch them. If this becomes annoying,
// Option B is to add a `visibilitychange` listener that re-reads
// window.location.search when the app comes to foreground — see comment
// in the useEffect below.

function parseUrlLogParams() {
  // Returns null if ?log=1 is not present, otherwise returns an object
  // with only the params that were actually provided (no zero-filling).
  const params = new URLSearchParams(window.location.search);
  if (params.get("log") !== "1") return null;

  const result = { log: true };
  const p = params.get("p");
  const c = params.get("c");
  const f = params.get("f");
  const kcal = params.get("kcal");
  const tab = params.get("tab");

  if (p !== null && p !== "") result.protein = p;
  if (c !== null && c !== "") result.carbs = c;
  if (f !== null && f !== "") result.fat = f;
  if (kcal !== null && kcal !== "") result.kcal = kcal;
  if (tab !== null && tab !== "") result.tab = tab;

  return result;
}

function ImportBanner({ params, onDismiss }) {
  // Shown at top of Log tab when macros were imported from Claude via URL.
  // Fields are NOT auto-saved — user must tap Save.
  const parts = [];
  if (params.protein !== undefined) parts.push(`${params.protein}P`);
  if (params.carbs   !== undefined) parts.push(`${params.carbs}C`);
  if (params.fat     !== undefined) parts.push(`${params.fat}F`);
  if (params.kcal    !== undefined) parts.push(`${params.kcal} kcal`);

  return (
    <div style={{
      margin:"12px 12px 0",
      padding:"10px 14px",
      background:"rgba(232,0,111,0.08)",
      border:`1px solid rgba(232,0,111,0.25)`,
      borderRadius:10,
      display:"flex",
      alignItems:"center",
      gap:10,
      flexWrap:"wrap",
    }}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:1,textTransform:"uppercase",color:ACCENT,marginBottom:2}}>
          Imported from Claude
        </div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:TEXT}}>
          {parts.length > 0 ? parts.join("  ·  ") : "Review fields below"}
          {" · Review and save"}
        </div>
      </div>
      <button onClick={onDismiss}
        style={{flexShrink:0,width:28,height:28,border:"none",background:"rgba(232,0,111,0.15)",borderRadius:"50%",cursor:"pointer",fontSize:16,color:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,lineHeight:1}}>
        ×
      </button>
    </div>
  );
}

function LogTab({ importedParams, onImportBannerDismiss }) {
  // Today's date as YYYY-MM-DD — used as the log entry key in localStorage
  const todayKey = new Date().toISOString().slice(0, 10);

  // Load today's existing log from localStorage on mount
  const [logEntries, setLogEntries] = useState(() => {
    try {
      const stored = localStorage.getItem("lizlog2");
      return stored ? JSON.parse(stored) : {};
    } catch(e) { return {}; }
  });

  const today = logEntries[todayKey] || {};

  // Local field state — pre-filled from URL params if present, otherwise from saved data
  const [protein, setProtein] = useState(importedParams?.protein ?? today.protein ?? "");
  const [carbs,   setCarbs]   = useState(importedParams?.carbs   ?? today.carbs   ?? "");
  const [fat,     setFat]     = useState(importedParams?.fat     ?? today.fat     ?? "");
  const [kcal,    setKcal]    = useState(importedParams?.kcal    ?? today.kcal    ?? "");
  const [sleep,   setSleep]   = useState(today.sleep   ?? "");
  const [hrv,     setHrv]     = useState(today.hrv     ?? "");
  const [weight,  setWeight]  = useState(today.weight  ?? "");
  const [energy,  setEnergy]  = useState(today.energy  ?? "");
  const [notes,   setNotes]   = useState(today.notes   ?? "");

  const [saveStatus, setSaveStatus] = useState("");
  const [showBanner, setShowBanner] = useState(!!importedParams);

  // When new importedParams arrive (e.g. user navigates to a new link),
  // update the fields and show the banner again.
  useEffect(() => {
    if (!importedParams) return;
    if (importedParams.protein !== undefined) setProtein(importedParams.protein);
    if (importedParams.carbs   !== undefined) setCarbs(importedParams.carbs);
    if (importedParams.fat     !== undefined) setFat(importedParams.fat);
    if (importedParams.kcal    !== undefined) setKcal(importedParams.kcal);
    setShowBanner(true);
  }, [importedParams]);

  const handleSave = () => {
    const entry = {
      protein, carbs, fat, kcal,
      sleep, hrv, weight, energy, notes,
      savedAt: new Date().toISOString(),
    };
    try {
      const next = { ...logEntries, [todayKey]: entry };
      localStorage.setItem("lizlog2", JSON.stringify(next));
      setLogEntries(next);
      setSaveStatus("Saved ✓");
      setShowBanner(false);      // dismiss banner on save
      onImportBannerDismiss();   // clear params from parent so banner doesn't reappear
      setTimeout(() => setSaveStatus(""), 2500);
    } catch(e) {
      setSaveStatus("Save error: " + e.message);
    }
  };

  // Reusable field row — uses inputMode="decimal" per iOS spec
  const Field = ({ label, value, onChange, placeholder, unit }) => (
    <div style={{marginBottom:14}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:MUTED,marginBottom:5}}>
        {label}{unit && <span style={{color:"rgba(153,153,153,0.6)",marginLeft:4}}>({unit})</span>}
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "—"}
        style={{
          width:"100%",
          fontFamily:"'DM Mono',monospace",
          fontSize:22,
          padding:"12px 14px",
          border:`1.5px solid ${value ? TEAL : BORDER}`,
          borderRadius:10,
          background: value ? "rgba(0,188,212,0.05)" : BG,
          color: value ? TEAL : TEXT,
          outline:"none",
          boxSizing:"border-box",
        }}
      />
    </div>
  );

  // Text area for notes
  const NotesField = ({ label, value, onChange, placeholder }) => (
    <div style={{marginBottom:14}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:MUTED,marginBottom:5}}>{label}</div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "—"}
        rows={3}
        style={{
          width:"100%",
          fontFamily:"'DM Sans',sans-serif",
          fontSize:16,
          padding:"12px 14px",
          border:`1.5px solid ${BORDER}`,
          borderRadius:10,
          background:BG,
          color:TEXT,
          outline:"none",
          resize:"none",
          boxSizing:"border-box",
        }}
      />
    </div>
  );

  return (
    <div style={{flex:1,overflowY:"auto"}}>
      <div style={{maxWidth:640,margin:"0 auto",paddingBottom:120}}>

        {/* Import banner — shown when macros came in via URL */}
        {showBanner && importedParams && (
          <ImportBanner
            params={importedParams}
            onDismiss={() => { setShowBanner(false); onImportBannerDismiss(); }}
          />
        )}

        {/* Date header */}
        <div style={{padding:"16px 16px 10px",borderBottom:`1px solid ${BORDER}`}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:2,textTransform:"uppercase",color:ACCENT,marginBottom:4}}>Daily Log</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,lineHeight:1}}>
            {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
          </div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:MUTED,marginTop:3}}>{todayKey}</div>
        </div>

        {/* Macros section */}
        <div style={{padding:"16px 16px 0"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:2,textTransform:"uppercase",color:MUTED,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${BORDER}`}}>
            Nutrition
          </div>
          <Field label="Protein" value={protein} onChange={setProtein} placeholder="0" unit="g" />
          <Field label="Carbs"   value={carbs}   onChange={setCarbs}   placeholder="0" unit="g" />
          <Field label="Fat"     value={fat}      onChange={setFat}     placeholder="0" unit="g" />
          <Field label="Calories" value={kcal}   onChange={setKcal}    placeholder="0" unit="kcal" />
        </div>

        {/* Recovery section */}
        <div style={{padding:"0 16px"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:2,textTransform:"uppercase",color:MUTED,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${BORDER}`,marginTop:8}}>
            Recovery
          </div>
          <Field label="Sleep"  value={sleep}  onChange={setSleep}  placeholder="0" unit="hrs" />
          <Field label="HRV"    value={hrv}    onChange={setHrv}    placeholder="0" unit="ms" />
          <Field label="Weight" value={weight} onChange={setWeight} placeholder="0" unit="lbs" />
          <Field label="Energy" value={energy} onChange={setEnergy} placeholder="1–10 scale" />
        </div>

        {/* Notes */}
        <div style={{padding:"0 16px"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:2,textTransform:"uppercase",color:MUTED,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${BORDER}`,marginTop:8}}>
            Notes
          </div>
          <NotesField label="Anything else" value={notes} onChange={setNotes} placeholder="How you felt, what you ate, etc." />
        </div>

        {/* Save button */}
        <div style={{padding:"0 16px 24px"}}>
          <button onClick={handleSave}
            style={{width:"100%",padding:"16px",fontFamily:"'DM Sans',sans-serif",fontSize:17,fontWeight:700,border:"none",borderRadius:12,background:ACCENT,color:"white",cursor:"pointer",letterSpacing:0.3}}>
            Save Today's Log
          </button>
          {saveStatus && (
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:saveStatus.startsWith("Save error")?"#ff4444":TEAL,marginTop:10,textAlign:"center"}}>
              {saveStatus}
            </div>
          )}
        </div>

        {/* Recent log entries — last 7 days */}
        <RecentLogs logEntries={logEntries} todayKey={todayKey} />
      </div>
    </div>
  );
}

function RecentLogs({ logEntries, todayKey }) {
  // Show the last 7 days that have entries (excluding today, already shown above)
  const entries = Object.entries(logEntries)
    .filter(([k]) => k !== todayKey)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7);

  if (entries.length === 0) return null;

  return (
    <div style={{padding:"0 16px"}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:2,textTransform:"uppercase",color:MUTED,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${BORDER}`,marginTop:8}}>
        Recent
      </div>
      {entries.map(([date, entry]) => (
        <div key={date} style={{marginBottom:12,padding:"12px 14px",background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:10}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:1,color:MUTED,marginBottom:6}}>{date}</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {entry.protein && <span style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:TEXT}}><span style={{color:MUTED}}>P </span>{entry.protein}g</span>}
            {entry.carbs   && <span style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:TEXT}}><span style={{color:MUTED}}>C </span>{entry.carbs}g</span>}
            {entry.fat     && <span style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:TEXT}}><span style={{color:MUTED}}>F </span>{entry.fat}g</span>}
            {entry.kcal    && <span style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:TEXT}}><span style={{color:MUTED}}></span>{entry.kcal} kcal</span>}
            {entry.sleep   && <span style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:TEXT}}><span style={{color:MUTED}}>sleep </span>{entry.sleep}h</span>}
            {entry.weight  && <span style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:TEXT}}><span style={{color:MUTED}}></span>{entry.weight} lbs</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main App
// ---------------------------------------------------------------------------

export default function App() {
  // ---------------------------------------------------------------------------
  // Tab state — "program" (default) or "log"
  // The ?tab= URL param can also force "workout" but right now we only
  // have "program" and "log". Extend this as new tabs are added.
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState("program");

  // ---------------------------------------------------------------------------
  // URL param reader — runs once on mount
  // Reads ?log=1&p=...&c=...&f=...&kcal=... and switches to Log tab.
  // After reading, clears params from URL so Back navigation stays clean.
  //
  // Option A: one-shot on mount. If the PWA is already open and Safari
  // foregrounds the existing tab without a reload, the user taps the URL
  // again — second tap triggers a reload and this fires correctly.
  // Option B (future): add a visibilitychange listener here to re-read
  // window.location.search when document.visibilityState === "visible".
  // ---------------------------------------------------------------------------
  const [importedParams, setImportedParams] = useState(null);

  useEffect(() => {
    const params = parseUrlLogParams();
    if (!params) return;

    // Determine which tab to open. Default to "log" when log=1 is present.
    const targetTab = params.tab === "program" ? "program" : "log";
    setActiveTab(targetTab);
    setImportedParams(params);

    // Clean the URL — remove query string so it stays tidy
    history.replaceState(null, "", window.location.pathname);
  }, []);

  const clearImportedParams = useCallback(() => setImportedParams(null), []);

  const [currentWeek, setCurrentWeek] = useState(0);
  const [weights, setWeights] = useState({});
  const [prs, setPrs] = useState({});
  const [done, setDone] = useState({});
  const [notes, setNotes] = useState({});
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerEx, setTimerEx] = useState({name:"",secs:120});
  const [saveStatus, setSaveStatus] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [exportText, setExportText] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");

  const prevWeights = React.useMemo(() => buildPrevWeights(weights, WEEKS), [weights]);
  const saveTimer = useRef(null);
  const canvasRef = useRef(null);
  const weekNavRef = useRef(null);

  useEffect(()=>{
    const get = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch(e){ return null; }};
    const d=get("lizdone2"), w=get("lizweights2"), n=get("liznotes2"), p=get("lizprs2"), wk=get("lizweek2");
    if(d) setDone(d); if(w) setWeights(w); if(n) setNotes(n); if(p) setPrs(p);
    if(wk && typeof wk.w === "number") setCurrentWeek(wk.w);
  },[]);

  const scheduleSave = useCallback((nd,nw,nn,np,nwk)=>{
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(()=>{
      try {
        localStorage.setItem("lizdone2",JSON.stringify(nd));
        localStorage.setItem("lizweights2",JSON.stringify(nw));
        localStorage.setItem("liznotes2",JSON.stringify(nn));
        localStorage.setItem("lizprs2",JSON.stringify(np));
        localStorage.setItem("lizweek2",JSON.stringify({w:nwk}));
        setSaveStatus("Saved ✓"); setTimeout(()=>setSaveStatus(""),2000);
      } catch(e){ setSaveStatus("Save error: "+e.message); }
    }, 800);
  },[]);

  const handleDone = useCallback((key)=>{
    setDone(prev=>{
      const next = {...prev,[key]:!prev[key]};
      if(next[key]) launchConfetti(window.innerWidth/2, window.innerHeight*0.3, ["#e8006f","#00bcd4","#fff","#ffeb3b"]);
      scheduleSave(next,weights,notes,prs,currentWeek);
      return next;
    });
  },[weights,notes,prs,currentWeek,scheduleSave]);

  const handleWeight = useCallback((exId,exName,setIdx,numSets,val)=>{
    setWeights(prev=>{
      const next = {...prev,[exId]:{...(prev[exId]||{}),[setIdx]:val}};
      const allVals = Object.values(next[exId]).map(v=>parseFloat(v)).filter(n=>!isNaN(n)&&n>0);
      if(allVals.length){
        const maxVal = Math.max(...allVals);
        setPrs(prevPrs=>{
          const prevBest = prevPrs[exName];
          if(!prevBest || maxVal > prevBest){
            launchConfetti(window.innerWidth*0.75, window.innerHeight*0.4, ["#e8006f","#00bcd4","#fff","#ffeb3b","#ff4081"]);
            const nextPrs = {...prevPrs,[exName]:maxVal};
            scheduleSave(done,next,notes,nextPrs,currentWeek);
            return nextPrs;
          }
          return prevPrs;
        });
      }
      scheduleSave(done,next,notes,prs,currentWeek);
      return next;
    });
  },[done,notes,prs,currentWeek,scheduleSave]);

  const handleNote = useCallback((key,val)=>{
    setNotes(prev=>{ const next={...prev,[key]:val}; scheduleSave(done,weights,next,prs,currentWeek); return next; });
  },[done,weights,prs,currentWeek,scheduleSave]);

  const handleWeekSwitch = useCallback((i)=>{
    setCurrentWeek(i); scheduleSave(done,weights,notes,prs,i);
    setTimeout(()=>{ const btn=weekNavRef.current?.children[i]; if(btn) btn.scrollIntoView({inline:"center",behavior:"smooth"}); },50);
  },[done,weights,notes,prs,scheduleSave]);

  const handlePRUpdate = useCallback((name, val) => {
    setPrs(prev => { const next = {...prev, [name]: val}; scheduleSave(done, weights, notes, next, currentWeek); return next; });
  }, [done, weights, notes, currentWeek, scheduleSave]);

  const handlePRDelete = useCallback((name) => {
    setPrs(prev => { const next = {...prev}; delete next[name]; scheduleSave(done, weights, notes, next, currentWeek); return next; });
  }, [done, weights, notes, currentWeek, scheduleSave]);

  const pct = Math.round(((currentWeek+1)/17)*100);
  const wk = WEEKS[currentWeek];
  const currentPhaseIdx = PHASES.findIndex(p=>p.weeks.includes(currentWeek));

  const handleExport = () => {
    const data = { done, weights, notes, prs, currentWeek, exportedAt: new Date().toISOString() };
    setExportText(JSON.stringify(data)); setShowExport(true);
  };

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportText)
      .then(()=>{ setImportMsg("Copied ✓"); setTimeout(()=>setImportMsg(""),2000); })
      .catch(()=>{ const ta=document.getElementById("export-textarea"); if(ta) ta.select(); });
  };

  const handleImportSubmit = () => {
    try {
      const data = JSON.parse(importText.trim());
      if(data.done) setDone(data.done); if(data.weights) setWeights(data.weights);
      if(data.notes) setNotes(data.notes); if(data.prs) setPrs(data.prs);
      if(typeof data.currentWeek==="number") setCurrentWeek(data.currentWeek);
      setImportMsg("Loaded ✓"); setShowImport(false); setImportText("");
      setTimeout(()=>setImportMsg(""),3000);
    } catch(e){ setImportMsg("Invalid data — check you pasted the full text"); setTimeout(()=>setImportMsg(""),4000); }
  };

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:BG,color:TEXT,fontFamily:"'DM Sans',sans-serif",overflow:"hidden"}}>
      <canvas id="confetti-canvas" ref={canvasRef} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999}}
        width={typeof window!=="undefined"?window.innerWidth:400} height={typeof window!=="undefined"?window.innerHeight:800}/>

      {/* ------------------------------------------------------------------ */}
      {/* App header — always visible                                          */}
      {/* ------------------------------------------------------------------ */}
      <div style={{background:"#111",color:"white",padding:"12px 16px 10px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1.5}}>Liz — Training</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:2,letterSpacing:1}}>DR. STACY SIMS · 17 WEEKS · APR 20 – AUG 15</div>
          </div>
          {saveStatus && <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:saveStatus==="Saved ✓"?"rgba(0,188,212,0.9)":"#ff6b6b",alignSelf:"center"}}>{saveStatus}</div>}
        </div>
        {/* Progress bar — only meaningful on the program tab */}
        {activeTab === "program" && <>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:5,display:"flex",justifyContent:"space-between"}}>
            <span>Week {currentWeek+1} of 17</span><span>{pct}%</span>
          </div>
          <div style={{height:3,background:"rgba(255,255,255,0.12)",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",background:ACCENT,borderRadius:2,width:`${pct}%`,transition:"width 0.4s ease"}}/>
          </div>
        </>}
        <div style={{display:"flex",gap:8,marginTop:10,alignItems:"center"}}>
          <button onClick={handleExport} style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:1,textTransform:"uppercase",padding:"8px 14px",background:ACCENT,color:"white",border:"none",borderRadius:4,cursor:"pointer",flex:1}}>↓ Export</button>
          <button onClick={()=>setShowImport(true)} style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:1,textTransform:"uppercase",padding:"8px 14px",background:"rgba(255,255,255,0.1)",color:"white",border:"1px solid rgba(255,255,255,0.2)",borderRadius:4,cursor:"pointer",flex:1}}>↑ Import</button>
          {importMsg && <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:TEAL}}>{importMsg}</span>}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tab switcher — Program / Log                                         */}
      {/* ------------------------------------------------------------------ */}
      <div style={{background:SURFACE,borderBottom:`1px solid ${BORDER}`,display:"flex",flexShrink:0}}>
        {[
          {id:"program", label:"Program"},
          {id:"log",     label:"Log" + (importedParams ? " ·" : "")},
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              fontFamily:"'DM Mono',monospace",
              fontSize:13,
              letterSpacing:1,
              textTransform:"uppercase",
              padding:"13px 20px",
              cursor:"pointer",
              flex:1,
              background:"none",
              border:"none",
              borderBottom:`2px solid ${activeTab === tab.id ? ACCENT : "transparent"}`,
              color: activeTab === tab.id ? ACCENT : MUTED,
              transition:"all 0.15s",
              minHeight:44,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Program tab — phase + week navs + workout cards                      */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "program" && <>
        <div style={{background:SURFACE,borderBottom:`1px solid ${BORDER}`,display:"flex",overflowX:"auto",flexShrink:0,padding:"8px 10px",gap:6,scrollbarWidth:"none"}}>
          {PHASES.map((p,i)=>(
            <button key={p.id} onClick={()=>handleWeekSwitch(p.weeks[0])}
              style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:1,textTransform:"uppercase",padding:"10px 14px",cursor:"pointer",whiteSpace:"nowrap",color:i===currentPhaseIdx?"white":MUTED,flexShrink:0,background:i===currentPhaseIdx?ACCENT:BG,border:`1.5px solid ${i===currentPhaseIdx?ACCENT:BORDER}`,borderRadius:3,minHeight:44,display:"flex",alignItems:"center",transition:"all 0.15s"}}>
              {p.label}
            </button>
          ))}
        </div>

        <div ref={weekNavRef} style={{background:BG,borderBottom:`1px solid ${BORDER}`,display:"flex",overflowX:"auto",flexShrink:0,scrollbarWidth:"none",padding:"0 4px"}}>
          {WEEKS.map((w,i)=>(
            <button key={i} onClick={()=>handleWeekSwitch(i)}
              style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:0.5,padding:"12px 14px",cursor:"pointer",marginBottom:-1,whiteSpace:"nowrap",color:i===currentWeek?ACCENT:MUTED,flexShrink:0,background:"none",border:"none",borderBottom:`2px solid ${i===currentWeek?ACCENT:"transparent"}`,transition:"all 0.15s"}}>
              {w.label}
            </button>
          ))}
        </div>

        <div style={{flex:1,overflowY:"auto"}}>
          <div style={{maxWidth:640,margin:"0 auto",paddingBottom:120}}>
            <div style={{padding:"16px 16px 10px",borderBottom:`1px solid ${BORDER}`}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:2,textTransform:"uppercase",color:ACCENT,marginBottom:4}}>{wk.phase}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,lineHeight:1}}>{wk.title}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:MUTED,marginTop:3}}>{wk.dates}</div>
              <div style={{fontSize:15,color:MUTED,marginTop:4,fontStyle:"italic"}}>{wk.focus}</div>
            </div>

            {wk.days.map(day=>(
              <DayCard key={day.id} day={day} wkId={`w${currentWeek}`}
                weights={weights} prs={prs} done={done} notes={notes} prevWeights={prevWeights}
                onDone={handleDone} onWeightChange={handleWeight} onNoteChange={handleNote}
                onTimerOpen={(name,secs)=>{ setTimerEx({name,secs}); setTimerOpen(true); }}/>
            ))}

            <PRPanel prs={prs} onUpdate={handlePRUpdate} onDelete={handlePRDelete} />
          </div>
        </div>
      </>}

      {/* ------------------------------------------------------------------ */}
      {/* Log tab                                                              */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "log" && (
        <LogTab
          importedParams={importedParams}
          onImportBannerDismiss={clearImportedParams}
        />
      )}

      {showExport && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:300,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:SURFACE,borderRadius:"20px 20px 0 0",padding:"20px 20px 40px",width:"100%",maxHeight:"70vh",display:"flex",flexDirection:"column"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,marginBottom:6}}>Export Data</div>
            <div style={{fontSize:14,color:MUTED,marginBottom:12,lineHeight:1.5}}>Copy this text and save it somewhere safe. Use Import to restore it next session.</div>
            <textarea id="export-textarea" readOnly value={exportText}
              style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:16,padding:10,border:`1px solid ${BORDER}`,borderRadius:8,background:BG,resize:"none",marginBottom:12,minHeight:80}}/>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowExport(false)} style={{flex:1,padding:14,fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:600,border:`1.5px solid ${BORDER}`,borderRadius:10,background:BG,cursor:"pointer"}}>Close</button>
              <button onClick={handleCopyExport} style={{flex:2,padding:14,fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:600,border:"none",borderRadius:10,background:ACCENT,color:"white",cursor:"pointer"}}>Copy to Clipboard</button>
            </div>
          </div>
        </div>
      )}

      {showImport && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:300,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:SURFACE,borderRadius:"20px 20px 0 0",padding:"20px 20px 40px",width:"100%",maxHeight:"70vh",display:"flex",flexDirection:"column"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,marginBottom:6}}>Import Data</div>
            <div style={{fontSize:14,color:MUTED,marginBottom:12,lineHeight:1.5}}>Paste your previously exported text below and tap Load.</div>
            <textarea value={importText} onChange={e=>setImportText(e.target.value)} placeholder="Paste your exported data here..."
              style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:16,padding:10,border:`1px solid ${BORDER}`,borderRadius:8,background:BG,resize:"none",marginBottom:12,minHeight:80}}/>
            {importMsg && <div style={{fontSize:13,color:ACCENT,marginBottom:8}}>{importMsg}</div>}
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{setShowImport(false);setImportText("");}} style={{flex:1,padding:14,fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:600,border:`1.5px solid ${BORDER}`,borderRadius:10,background:BG,cursor:"pointer"}}>Cancel</button>
              <button onClick={handleImportSubmit} style={{flex:2,padding:14,fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:600,border:"none",borderRadius:10,background:TEAL,color:"white",cursor:"pointer"}}>Load Data</button>
            </div>
          </div>
        </div>
      )}

      {/* Rest timer FAB — only shown on program tab */}
      {activeTab === "program" && (
        <div onClick={()=>setTimerOpen(true)}
          style={{position:"fixed",bottom:24,right:16,zIndex:100,width:64,height:64,background:"#111",borderRadius:"50%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1,color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>Rest</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:15,fontWeight:500,color:"white",lineHeight:1,marginTop:1}}>{fmt(timerEx.secs)}</div>
        </div>
      )}

      {timerOpen && <RestTimer exName={timerEx.name} seconds={timerEx.secs} onClose={()=>setTimerOpen(false)}/>}
    </div>
  );
}
