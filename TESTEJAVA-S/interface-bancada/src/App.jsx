import { useState, useEffect, useRef } from "react";

const generateThrust = () => {
  const pts = [];
  for (let i = 0; i <= 300; i++) {
    const t = i / 100;
    let v = 0;
    if (t < 0.1) v = t * 1800;
    else if (t < 0.3) v = 180 + Math.sin((t - 0.1) * 8) * 12 + Math.random() * 6;
    else if (t < 1.8) v = 175 + Math.sin(t * 4.2) * 9 + Math.cos(t * 7.1) * 5 + Math.random() * 8;
    else if (t < 2.1) v = 175 * Math.pow(1 - (t - 1.8) / 0.3, 0.7);
    else v = 0;
    pts.push({ t: parseFloat(t.toFixed(2)), v: Math.max(0, parseFloat(v.toFixed(1))) });
  }
  return pts;
};

const generatePressure = () => {
  const pts = [];
  for (let i = 0; i <= 300; i++) {
    const t = i / 100;
    let v = 0;
    if (t < 0.08) v = t * 1500;
    else if (t < 0.25) v = 120 + Math.sin((t - 0.08) * 9) * 8 + Math.random() * 4;
    else if (t < 1.8) v = 118 + Math.sin(t * 3.9) * 6 + Math.cos(t * 8.3) * 3 + Math.random() * 5;
    else if (t < 2.1) v = 118 * Math.pow(1 - (t - 1.8) / 0.3, 0.8);
    else v = 0;
    pts.push({ t: parseFloat(t.toFixed(2)), v: Math.max(0, parseFloat(v.toFixed(1))) });
  }
  return pts;
};

const thrustData = generateThrust();
const pressureData = generatePressure();

function MiniChart({ data, color, yLabel, maxY, height = 160 }) {
  const W = 1100, H = height;
  const pad = { t: 12, r: 16, b: 32, l: 52 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  const xs = data.map(d => pad.l + (d.t / 3) * iW);
  const ys = data.map(d => pad.t + iH - (d.v / maxY) * iH);
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"}${xs[i]},${ys[i]}`).join(" ");
  const fill = path + ` L${xs[xs.length-1]},${pad.t+iH} L${xs[0]},${pad.t+iH} Z`;
  const yTicks = [0,0.25,0.5,0.75,1].map(f => ({ v: Math.round(f*maxY), y: pad.t+iH-f*iH }));
  const xTicks = [0,0.5,1,1.5,2,2.5,3].map(v => ({ v, x: pad.l+(v/3)*iW }));
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block" }}>
      {yTicks.map(t => (
        <g key={t.v}>
          <line x1={pad.l} x2={pad.l+iW} y1={t.y} y2={t.y} stroke="#2a2f3a" strokeWidth="1"/>
          <text x={pad.l-8} y={t.y+4} textAnchor="end" fill="#5a6275" fontSize="11" fontFamily="'JetBrains Mono',monospace">{t.v}</text>
        </g>
      ))}
      {xTicks.map(t => (
        <g key={t.v}>
          <line x1={t.x} x2={t.x} y1={pad.t} y2={pad.t+iH} stroke="#1e2330" strokeWidth="1"/>
          <text x={t.x} y={pad.t+iH+20} textAnchor="middle" fill="#5a6275" fontSize="11" fontFamily="'JetBrains Mono',monospace">{t.v}s</text>
        </g>
      ))}
      <defs>
        <linearGradient id={`g${yLabel}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#g${yLabel})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      <text x={14} y={pad.t+iH/2} textAnchor="middle" fill="#5a6275" fontSize="11" fontFamily="'JetBrains Mono',monospace"
        transform={`rotate(-90,14,${pad.t+iH/2})`}>{yLabel}</text>
    </svg>
  );
}

function ThrustChart({ data, color, progress }) {
  const W = 1100, H = 380;
  const pad = { t: 20, r: 20, b: 44, l: 60 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  const visData = data.slice(0, Math.max(2, Math.floor(progress * data.length)));
  const xs = visData.map(d => pad.l + (d.t/3)*iW);
  const ys = visData.map(d => pad.t + iH - (d.v/210)*iH);
  const path = visData.map((d,i) => `${i===0?"M":"L"}${xs[i]},${ys[i]}`).join(" ");
  const fill = path + ` L${xs[xs.length-1]},${pad.t+iH} L${xs[0]},${pad.t+iH} Z`;
  const yTicks = [0,50,100,150,200].map(v => ({ v, y: pad.t+iH-(v/210)*iH }));
  const xTicks = [0,0.5,1,1.5,2,2.5,3].map(v => ({ v, x: pad.l+(v/3)*iW }));
  const last = visData[visData.length-1];
  const lx = pad.l+(last.t/3)*iW, ly = pad.t+iH-(last.v/210)*iH;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block" }}>
      {yTicks.map(t => (
        <g key={t.v}>
          <line x1={pad.l} x2={pad.l+iW} y1={t.y} y2={t.y} stroke="#252b3a" strokeWidth={t.v===0?1.5:1}/>
          <text x={pad.l-10} y={t.y+4} textAnchor="end" fill="#4a5268" fontSize="12" fontFamily="'JetBrains Mono',monospace">{t.v}</text>
        </g>
      ))}
      {xTicks.map(t => (
        <g key={t.v}>
          <line x1={t.x} x2={t.x} y1={pad.t} y2={pad.t+iH} stroke="#1c2130" strokeWidth="1"/>
          <text x={t.x} y={pad.t+iH+26} textAnchor="middle" fill="#4a5268" fontSize="12" fontFamily="'JetBrains Mono',monospace">{t.v}s</text>
        </g>
      ))}
      <defs>
        <linearGradient id="thrustGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#thrustGrad)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
      {progress > 0 && progress < 1 && last.v > 2 && (
        <>
          <circle cx={lx} cy={ly} r="5" fill={color} opacity="0.9"/>
          <circle cx={lx} cy={ly} r="10" fill={color} opacity="0.15"/>
        </>
      )}
      <text x={16} y={pad.t+iH/2} textAnchor="middle" fill="#4a5268" fontSize="12" fontFamily="'JetBrains Mono',monospace"
        transform={`rotate(-90,16,${pad.t+iH/2})`}>Força (N)</text>
      <text x={pad.l+iW/2} y={H-6} textAnchor="middle" fill="#4a5268" fontSize="12" fontFamily="'JetBrains Mono',monospace">Tempo (s)</text>
    </svg>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background:"#0d1420", border:"1px solid #1a2535", borderRadius:7, padding:"14px 16px" }}>
      <div style={{ fontSize:10, letterSpacing:"0.22em", color:"#3a5060", fontWeight:600, marginBottom:12, paddingBottom:8, borderBottom:"1px solid #141e2a" }}>{title}</div>
      {children}
    </div>
  );
}

function DataField({ label, value, unit, highlight }) {
  return (
    <div style={{ background:highlight?"#080f1a":"#080d14", border:`1px solid ${highlight?"#1a3a5a":"#141e2a"}`, borderRadius:5, padding:"8px 10px" }}>
      <div style={{ fontSize:10, color:"#3a4a60", letterSpacing:"0.06em", marginBottom:4 }}>{label}</div>
      <div style={{ color:highlight?"#7ab8e8":"#5a7a9a", fontSize:highlight?20:16, fontWeight:highlight?700:500, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:9, color:"#2a3a50", marginTop:3 }}>{unit}</div>
    </div>
  );
}

function Btn({ children, onClick, disabled, color, hcolor, style={} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: disabled?"#0d1117": hov?color+"cc":color,
        border:`1px solid ${disabled?"#1a2030":hov?hcolor:hcolor+"44"}`,
        color: disabled?"#2a3245": hov?"#fff":hcolor,
        borderRadius:5, cursor:disabled?"not-allowed":"pointer",
        fontFamily:"inherit", fontWeight:600, letterSpacing:"0.08em",
        transition:"all 0.15s", ...style,
      }}>{children}</button>
  );
}

export default function App() {
  const [status, setStatus] = useState("disconnected");
  const [running, setRunning] = useState(false);
  const [unit, setUnit] = useState("N");
  const [port, setPort] = useState("COM3");
  const [progress, setProgress] = useState(0);
  const [vals, setVals] = useState({ current:0, max:0, avg:0, impulse:0, pCur:0, pMax:0 });
  const animRef = useRef(null);
  const startRef = useRef(null);

  const connect = () => setStatus(s => s==="connected"?"disconnected":"connected");

  const startAcq = () => {
    if (status !== "connected") return;
    setRunning(true); setProgress(0);
    setVals({ current:0, max:0, avg:0, impulse:0, pCur:0, pMax:0 });
    startRef.current = performance.now();
    const dur = 3200;
    const tick = (now) => {
      const p = Math.min((now - startRef.current) / dur, 1);
      setProgress(p);
      const idx = Math.floor(p*(thrustData.length-1));
      const cur = thrustData[idx].v;
      const pidx = Math.floor(p*(pressureData.length-1));
      const pc = pressureData[pidx].v;
      setVals(v => ({
        current: cur, max: Math.max(v.max, cur),
        avg: thrustData.slice(0,idx+1).reduce((a,b)=>a+b.v,0)/(idx+1),
        impulse: thrustData.slice(0,idx+1).reduce((a,b)=>a+b.v*0.01,0),
        pCur: pc, pMax: Math.max(v.pMax, pc),
      }));
      if (p < 1) animRef.current = requestAnimationFrame(tick);
      else setRunning(false);
    };
    animRef.current = requestAnimationFrame(tick);
  };

  const stop = () => { if(animRef.current) cancelAnimationFrame(animRef.current); setRunning(false); };
  const clear = () => { stop(); setProgress(0); setVals({current:0,max:0,avg:0,impulse:0,pCur:0,pMax:0}); };

  const unitFactor = unit==="kgf"?0.101972:unit==="gf"?101.972:1;
  const fmt = (v,d=1) => (v*unitFactor).toFixed(d);

  const statusCfg = {
    connected:    { color:"#22c55e", bg:"#0f2a1a", border:"#22c55e33", text:"CONECTADO" },
    disconnected: { color:"#ef4444", bg:"#2a0f0f", border:"#ef444433", text:"DESCONECTADO" },
    waiting:      { color:"#f59e0b", bg:"#2a1f0a", border:"#f59e0b33", text:"AGUARDANDO" },
  };
  const sc = statusCfg[status];

  return (
    <div style={{
      fontFamily:"'JetBrains Mono','Courier New',monospace",
      background:"#0d1117",
      width:1920, height:1080,
      color:"#c9d1e0",
      display:"flex", flexDirection:"column",
      fontSize:13, overflow:"hidden",
      transformOrigin:"top left",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>

      {/* Menubar */}
      <div style={{ background:"#0a0e15", borderBottom:"1px solid #1a2030", padding:"0 28px", display:"flex", alignItems:"center", gap:2, height:40, flexShrink:0 }}>
        {["Arquivo","Configurações","Ajuda"].map(m=>(
          <button key={m} style={{ background:"none", border:"none", color:"#7a8499", padding:"0 16px", height:40, cursor:"pointer", fontSize:12, letterSpacing:"0.03em" }}
            onMouseEnter={e=>e.target.style.color="#c9d1e0"} onMouseLeave={e=>e.target.style.color="#7a8499"}>{m}</button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:running?"#22c55e":"#2a3040" }}/>
          <span style={{ color:"#3a4255", fontSize:11 }}>v2.4.1</span>
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign:"center", padding:"16px 28px 12px", borderBottom:"1px solid #141924", flexShrink:0 }}>
        <div style={{ fontSize:11, letterSpacing:"0.35em", color:"#3a4a6a", textTransform:"uppercase", marginBottom:4 }}>Sistema de Instrumentação</div>
        <div style={{ fontSize:18, fontWeight:600, letterSpacing:"0.14em", color:"#8ab4d4", textTransform:"uppercase" }}>
          Aquisição de Dados — Bancada de Teste Estático
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display:"flex", flex:1, padding:"16px 20px", gap:16, minHeight:0 }}>

        {/* LEFT PANEL */}
        <div style={{ width:300, flexShrink:0, display:"flex", flexDirection:"column", gap:12 }}>

          {/* CONEXÃO */}
          <Section title="CONEXÃO">
            <label style={{ color:"#5a6275", fontSize:10, letterSpacing:"0.08em", display:"block", marginBottom:5 }}>PORTA SERIAL</label>
            <select value={port} onChange={e=>setPort(e.target.value)} style={{
              width:"100%", background:"#0d1117", border:"1px solid #2a3345", color:"#8ab4d4",
              padding:"7px 10px", borderRadius:5, fontSize:12, fontFamily:"inherit", marginBottom:12,
            }}>
              {["COM1","COM2","COM3","COM4","/dev/ttyUSB0","/dev/ttyUSB1"].map(p=><option key={p}>{p}</option>)}
            </select>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 12px", background:sc.bg, border:`1px solid ${sc.border}`, borderRadius:5 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:sc.color, boxShadow:`0 0 7px ${sc.color}` }}/>
                <span style={{ color:sc.color, fontSize:11, fontWeight:600, letterSpacing:"0.1em" }}>{sc.text}</span>
              </div>
              <button onClick={connect} style={{
                background:status==="connected"?"#1a0f0f":"#0f1a2a",
                border:`1px solid ${status==="connected"?"#ef444444":"#3a6a9a44"}`,
                color:status==="connected"?"#ef4444":"#5a9acc",
                padding:"5px 12px", borderRadius:5, cursor:"pointer", fontSize:11, fontFamily:"inherit",
              }}>{status==="connected"?"Desconectar":"Conectar"}</button>
            </div>
          </Section>

          {/* CONTROLE */}
          <Section title="CONTROLE">
            <div style={{ display:"flex", gap:10, marginBottom:10 }}>
              <Btn onClick={startAcq} disabled={running||status!=="connected"}
                color="#1a5c3a" hcolor="#22c55e" style={{ flex:1, padding:"12px 0", fontSize:13, fontWeight:700 }}>
                ▶ INICIAR
              </Btn>
              <Btn onClick={stop} disabled={!running} color="#5c1a1a" hcolor="#ef4444" style={{ flex:1, padding:"12px 0", fontSize:13, fontWeight:700 }}>
                ■ PARAR
              </Btn>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {["Calibrar","Tarar","Limpar"].map(l=>(
                <Btn key={l} onClick={l==="Limpar"?clear:undefined} color="#1a2035" hcolor="#8ab4d4"
                  style={{ flex:1, padding:"8px 0", fontSize:11 }}>{l}</Btn>
              ))}
            </div>
          </Section>

          {/* UNIDADE DE FORÇA */}
          <Section title="UNIDADE DE FORÇA">
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {["N","kgf","gf"].map(u=>(
                <label key={u} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                  <div onClick={()=>setUnit(u)} style={{
                    width:16, height:16, borderRadius:"50%",
                    border:`2px solid ${unit===u?"#5a9acc":"#2a3345"}`,
                    background:unit===u?"#5a9acc22":"transparent",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  }}>
                    {unit===u && <div style={{ width:7, height:7, borderRadius:"50%", background:"#5a9acc" }}/>}
                  </div>
                  <span onClick={()=>setUnit(u)} style={{ color:unit===u?"#8ab4d4":"#5a6275", fontSize:13, letterSpacing:"0.05em" }}>{u}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* MONITORAMENTO */}
          <Section title="MONITORAMENTO">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <DataField label="Empuxo Atual"   value={fmt(vals.current)} unit={unit}               highlight/>
              <DataField label="Pressão Atual"  value={vals.pCur.toFixed(1)} unit="PSI"             highlight/>
              <DataField label="Emp. Máximo"    value={fmt(vals.max)}     unit={unit}/>
              <DataField label="Press. Máxima"  value={vals.pMax.toFixed(1)} unit="PSI"/>
              <DataField label="Emp. Médio"     value={fmt(vals.avg)}     unit={unit}/>
              <DataField label="Impulso Total"  value={(vals.impulse*unitFactor).toFixed(2)} unit={unit==="N"?"N·s":unit+"·s"}/>
            </div>
          </Section>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:12, minWidth:0 }}>

          {/* THRUST CHART */}
          <div style={{ flex:1, background:"#0d1420", border:"1px solid #1a2535", borderRadius:7, padding:"16px 18px", display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10, flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:4, height:20, background:"#5a9acc", borderRadius:2 }}/>
                <span style={{ color:"#8ab4d4", fontSize:13, fontWeight:600, letterSpacing:"0.15em" }}>CURVA DE EMPUXO</span>
              </div>
              <div style={{ display:"flex", gap:16, fontSize:11, color:"#3a4255" }}>
                <span>Amostras: {Math.floor(progress*thrustData.length)}</span>
                <span>Fs: 100 Hz</span>
                {running && <span style={{ color:"#22c55e" }}>● REC</span>}
              </div>
            </div>
            <div style={{ flex:1 }}>
              <ThrustChart data={thrustData} color="#5a9acc" progress={progress}/>
            </div>
          </div>

          {/* PRESSURE CHART */}
          <div style={{ height:230, background:"#0d1420", border:"1px solid #1a2535", borderRadius:7, padding:"12px 18px", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <div style={{ width:4, height:18, background:"#d4845a", borderRadius:2 }}/>
              <span style={{ color:"#c9a07a", fontSize:13, fontWeight:600, letterSpacing:"0.15em" }}>PRESSÃO DE CÂMARA</span>
              <span style={{ marginLeft:"auto", color:"#3a4255", fontSize:11 }}>Eixo Y: PSI</span>
            </div>
            <MiniChart
              data={pressureData.slice(0, Math.max(2, Math.floor(progress*pressureData.length)))}
              color="#d4845a" yLabel="PSI" maxY={140} height={168}
            />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ background:"#070b10", borderTop:"1px solid #141924", padding:"5px 28px", display:"flex", gap:24, fontSize:11, color:"#3a4255", flexShrink:0 }}>
        <span>Porta: <span style={{ color:"#5a6275" }}>{port}</span></span>
        <span>Taxa: <span style={{ color:"#5a6275" }}>100 sps</span></span>
        <span>Resolução: <span style={{ color:"#5a6275" }}>16-bit</span></span>
        <span>Filtro: <span style={{ color:"#5a6275" }}>Butterworth 4ª ordem</span></span>
        <span style={{ marginLeft:"auto" }}>
          {running
            ? <span style={{ color:"#22c55e" }}>● Aquisição em andamento — {(progress*3).toFixed(2)}s</span>
            : progress>0
              ? <span style={{ color:"#5a9acc" }}>Ensaio concluído — {(vals.impulse*unitFactor).toFixed(2)} {unit}·s</span>
              : <span>Aguardando início de ensaio</span>}
        </span>
      </div>

      <style>{`* { box-sizing:border-box; } select option { background:#0d1117; } @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}