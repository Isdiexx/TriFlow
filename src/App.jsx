import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Capacitor } from "@capacitor/core";
import { SPACING, BORDER_RADIUS, TYPOGRAPHY, FONTS, SHADOWS, TRANSITIONS, inputStyle, buttonStyle, cardStyle } from "./designSystem.js";
import TFIcon from "./TFIcons.jsx";
import LandingPage from "./LandingPage.jsx";

const API_BASE = Capacitor.isNativePlatform() ? "https://triflow.cl" : "";

const supabase = createClient("https://uiktwbtwzotqduzwtjcb.supabase.co","sb_publishable_ONXQyJvXKUIUqppaWnZG4w_epX1u7ml",{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"implicit"}});

const LIGHT={bg:"#F7F5F0",surface:"#FDFCFA",card:"#FFFFFF",border:"#EAE4D8",border2:"#D8D0C0",sage:"#7C9E87",sageL:"#A8C4AF",sageD:"#5A7D65",sand:"#C4A882",clay:"#C4856A",sky:"#7EA8C4",violet:"#9B8EC4",violetL:"#C4B8E8",violetD:"#7060A8",charcoal:"#2C2C2C",textMid:"#6B6458",textSub:"#9C9284",muted:"#B8B0A0",scrollbar:"#C8C0B0"};
const DARK={bg:"#161C18",surface:"#1C2420",card:"#212B25",border:"#2A3830",border2:"#354540",sage:"#7EC494",sageL:"#5A9970",sageD:"#A8D4B4",sand:"#D4B48C",clay:"#D4956A",sky:"#8AB8D4",violet:"#B4A8D8",violetL:"#7868A8",violetD:"#CEC4EC",charcoal:"#EAE6DE",textMid:"#A8A090",textSub:"#6E6860",muted:"#4A4840",scrollbar:"#2A3830"};

const localDate=(d=new Date())=>{const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return`${y}-${m}-${day}`;};
const TABS=[{id:"inicio",label:"Inicio"},{id:"habito",label:"Hábito"},{id:"despensa",label:"Despensa"},{id:"entrena",label:"Entrena"},{id:"asistente",label:"IA"},{id:"perfil",label:"Perfil"}];
const DIAS=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const DIAS_C=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const PAISES=[{n:"Chile",f:"🇨🇱"},{n:"Argentina",f:"🇦🇷"},{n:"Perú",f:"🇵🇪"},{n:"Colombia",f:"🇨🇴"},{n:"Venezuela",f:"🇻🇪"},{n:"Ecuador",f:"🇪🇨"},{n:"Uruguay",f:"🇺🇾"},{n:"Paraguay",f:"🇵🇾"},{n:"Bolivia",f:"🇧🇴"},{n:"México",f:"🇲🇽"},{n:"España",f:"🇪🇸"},{n:"Costa Rica",f:"🇨🇷"},{n:"Panamá",f:"🇵🇦"},{n:"Guatemala",f:"🇬🇹"},{n:"Honduras",f:"🇭🇳"},{n:"El Salvador",f:"🇸🇻"},{n:"Nicaragua",f:"🇳🇮"},{n:"República Dominicana",f:"🇩🇴"},{n:"Cuba",f:"🇨🇺"},{n:"Puerto Rico",f:"🇵🇷"},{n:"Otro",f:"🌎"}];

// ── Rate limiter: máx 10 requests/minuto para IA ──
const rateLimiter={timestamps:[],check(){const now=Date.now();this.timestamps=this.timestamps.filter(t=>now-t<60000);if(this.timestamps.length>=10)return false;this.timestamps.push(now);return true;},remaining(){const now=Date.now();this.timestamps=this.timestamps.filter(t=>now-t<60000);return 10-this.timestamps.length;}};

// ── Validación y sanitización de inputs ──
const sanitize=(str,maxLen=200)=>{if(typeof str!=="string")return"";return str.replace(/[<>]/g,"").trim().slice(0,maxLen);};
const isValidNumber=(v,min=0,max=999)=>{const n=parseFloat(v);return!isNaN(n)&&n>=min&&n<=max;};
const isValidEmail=(e)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const makeCSS=(dark)=>`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:${dark?DARK.scrollbar:LIGHT.scrollbar};border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes modeIn{from{opacity:0;transform:scale(.98)}to{opacity:1;transform:scale(1)}}
  .fade-up{animation:fadeUp .45s ease both}.fade-in{animation:fadeIn .35s ease both}.mode-in{animation:modeIn .3s ease both}
  /* Button states */
  button{transition:all .25s cubic-bezier(.4,0,.2,1)}
  button:hover:not(:disabled){filter:brightness(1.08);box-shadow:0 2px 8px rgba(0,0,0,.08)}
  button:active:not(:disabled){transform:scale(.97);box-shadow:none}
  button:disabled{opacity:.55;cursor:not-allowed;filter:grayscale(.3)}
  /* Input states */
  input,textarea,select{transition:all .25s cubic-bezier(.4,0,.2,1)}
  input:focus,textarea:focus,select:focus{border-color:${dark?DARK.sage:LIGHT.sage} !important;box-shadow:0 0 0 3px ${dark?DARK.sage:LIGHT.sage}22}
  input:disabled,textarea:disabled{opacity:.5;cursor:not-allowed;background:${dark?DARK.muted+'44':LIGHT.muted+'44'}}
  /* Card hover states */
  .card-clickable{cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1)}
  .card-clickable:hover{box-shadow:0 4px 16px rgba(0,0,0,.08);transform:translateY(-1px)}
  /* Smooth scrollbar */
  html{scroll-behavior:smooth}
`;

const Chip=({children,color,T})=>{const c=color||T.sage;return<span style={{display:"inline-flex",alignItems:"center",padding:"4px 12px",borderRadius:99,fontSize:12,fontWeight:500,background:c+"22",color:c,fontFamily:"'DM Sans',sans-serif"}}>{children}</span>;};

function ProgressRing({value,max,size=72,stroke=6,color}){
  const r=(size-stroke*2)/2,circ=2*Math.PI*r,pct=Math.min(1,Math.max(0,value/(max||1)));
  return(<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color+"30"} strokeWidth={stroke}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round" style={{transition:"stroke-dashoffset .8s ease"}}/>
  </svg>);
}

const Avatar=({name,size=40,T})=><div style={{width:size,height:size,borderRadius:99,background:`linear-gradient(135deg,${T.sage},${T.sageD})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:size*.36,fontWeight:600,fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>{(name||"U").split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase()}</div>;

function ThemeToggle({dark,toggle,T}){
  return(<button onClick={toggle} style={{width:52,height:28,borderRadius:99,border:"none",cursor:"pointer",background:dark?T.sage:T.border2,padding:3,display:"flex",alignItems:"center",justifyContent:dark?"flex-end":"flex-start",transition:"all .35s"}}>
    <div style={{width:22,height:22,borderRadius:99,background:dark?"#1a2e1a":T.surface,boxShadow:"0 1px 4px rgba(0,0,0,.15)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .35s"}}><TFIcon name={dark?"moon":"sun"} size={13} color={dark?"#fff":T.sand}/></div>
  </button>);
}

function TriFlowLogo({T,size=22}){
  const s=size+6;
  return(
    <div style={{display:"flex",alignItems:"center",gap:9}}>
      <svg width={s} height={s} viewBox="0 0 32 32" style={{flexShrink:0}}>
        <rect x="2" y="5" width="8.5" height="6" rx="2.2" fill={T.sageL}/>
        <rect x="11.75" y="5" width="8.5" height="6" rx="2.2" fill={T.sage}/>
        <rect x="21.5" y="5" width="8.5" height="6" rx="2.2" fill={T.sageD}/>
        <rect x="12.75" y="12" width="6.5" height="16" rx="2.2" fill={T.sageD}/>
      </svg>
      <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:size,fontWeight:500,color:T.charcoal,letterSpacing:"-0.035em"}}>TriFlow</span>
    </div>
  );
}

function WeightSparkline({data,color,width=120,height=40}){
  if(!data||data.length<2)return null;
  const vals=data.map(d=>parseFloat(d.peso)).filter(v=>!isNaN(v));
  if(vals.length<2)return null;
  const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const pad=4,w=width-pad*2,h=height-pad*2;
  const pts=vals.map((v,i)=>[pad+i*(w/(vals.length-1)),pad+h-(((v-mn)/rng)*h)]);
  const path="M"+pts.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join("L");
  const area=path+`L${pts[pts.length-1][0].toFixed(1)},${height}L${pts[0][0].toFixed(1)},${height}Z`;
  return(
    <svg width={width} height={height} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#wg)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={color}/>
    </svg>
  );
}

function WeightChart({data,meta,T,width=320,height=200}){
  if(!data||data.length<2)return null;
  const entries=data.map(d=>({peso:parseFloat(d.peso),fecha:d.fecha||d.created_at?.split("T")[0]||""})).filter(d=>!isNaN(d.peso));
  if(entries.length<2)return null;
  const vals=entries.map(d=>d.peso);
  const metaVal=parseFloat(meta)||0;
  const allVals=metaVal>0?[...vals,metaVal]:vals;
  const mn=Math.min(...allVals)-0.5,mx=Math.max(...allVals)+0.5,rng=mx-mn||1;
  const padL=44,padR=12,padT=16,padB=36;
  const cw=width-padL-padR,ch=height-padT-padB;
  const toX=(i)=>padL+i*(cw/Math.max(1,entries.length-1));
  const toY=(v)=>padT+ch-((v-mn)/rng)*ch;
  const pts=entries.map((d,i)=>[toX(i),toY(d.peso)]);
  const path="M"+pts.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join("L");
  const area=path+`L${pts[pts.length-1][0].toFixed(1)},${padT+ch}L${pts[0][0].toFixed(1)},${padT+ch}Z`;
  // Y axis labels (4-5 ticks)
  const nTicks=4;
  const tickStep=rng/nTicks;
  const yTicks=Array.from({length:nTicks+1},(_,i)=>mn+i*tickStep);
  // X axis labels (show ~5 dates)
  const xStep=Math.max(1,Math.floor(entries.length/5));
  const formatDate=(d)=>{if(!d)return"";const p=d.split("-");return p.length>=3?`${p[2]}/${p[1]}`:"";};
  // meta line Y
  const metaY=metaVal>0?toY(metaVal):null;
  // trend line (linear regression)
  const n=vals.length,sx=vals.reduce((_,__,i)=>_+i,0),sy=vals.reduce((a,v)=>a+v,0);
  const sxy=vals.reduce((a,v,i)=>a+i*v,0),sx2=vals.reduce((a,_,i)=>a+i*i,0);
  const slope=(n*sxy-sx*sy)/(n*sx2-sx*sx||1),intercept=(sy-slope*sx)/n;
  const trendY0=toY(intercept),trendY1=toY(slope*(n-1)+intercept);

  return(
    <svg width={width} height={height} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id="wcg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.sage} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={T.sage} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {yTicks.map((v,i)=>(
        <g key={i}>
          <line x1={padL} x2={width-padR} y1={toY(v)} y2={toY(v)} stroke={T.border} strokeWidth="0.8" strokeDasharray={i===0||i===nTicks?"":"3,3"}/>
          <text x={padL-6} y={toY(v)+4} textAnchor="end" fontSize="10" fill={T.textSub} fontFamily="'JetBrains Mono',monospace">{v.toFixed(1)}</text>
        </g>
      ))}
      {/* X axis dates */}
      {entries.map((d,i)=>i%xStep===0||i===entries.length-1?(
        <text key={i} x={toX(i)} y={height-6} textAnchor="middle" fontSize="10" fill={T.textSub} fontFamily="'JetBrains Mono',monospace">{formatDate(d.fecha)}</text>
      ):null)}
      {/* Meta line */}
      {metaY!==null&&metaY>=padT&&metaY<=padT+ch&&(
        <g>
          <line x1={padL} x2={width-padR} y1={metaY} y2={metaY} stroke={T.sage} strokeWidth="1.2" strokeDasharray="6,4" opacity="0.7"/>
          <text x={width-padR+2} y={metaY+3} fontSize="9" fill={T.sage} fontFamily="'JetBrains Mono',monospace" fontWeight="600">META</text>
        </g>
      )}
      {/* Trend line */}
      <line x1={pts[0][0]} y1={trendY0} x2={pts[pts.length-1][0]} y2={trendY1} stroke={T.violet} strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>
      {/* Area fill */}
      <path d={area} fill="url(#wcg)"/>
      {/* Main line */}
      <path d={path} fill="none" stroke={T.sage} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Data points */}
      {pts.map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r={i===pts.length-1?5:3} fill={i===pts.length-1?T.sage:T.card} stroke={T.sage} strokeWidth={i===pts.length-1?0:1.5}/>
          {i===pts.length-1&&<text x={x} y={y-10} textAnchor="middle" fontSize="11" fontWeight="600" fill={T.sage} fontFamily="'Space Grotesk',sans-serif">{entries[i].peso.toFixed(1)}</text>}
        </g>
      ))}
    </svg>
  );
}

export default function App(){
  const[dark,setDark]=useState(()=>{try{return localStorage.getItem("triflow_dark")==="1";}catch{return false;}});
  const[user,setUser]=useState(null);const[profile,setProfile]=useState(null);
  const[screen,setScreen]=useState(window.location.search.includes("dev")?"app":"loading");
  const[showLanding,setShowLanding]=useState(!window.location.search.includes("dev")&&!window.location.search.includes("start")&&!window.location.hash.includes("access_token")&&!window.location.hash.includes("refresh_token"));
  const[tab,setTab]=useState("inicio");
  const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[loading,setLoading]=useState(false);const[error,setError]=useState("");
  const[modo,setModo]=useState("welcome");const[showPass,setShowPass]=useState(false);const[rememberMe,setRememberMe]=useState(false);const[onboardingSlide,setOnboardingSlide]=useState(0);
  const[ob,setOb]=useState({nombre:"",apellido:"",peso_actual:"",peso_meta:"",objetivo:"bajar_peso",restricciones:[],pais:"Chile",dias_entrenamiento:3});
  const[agua,setAgua]=useState(0);const[stock,setStock]=useState([]);const[menu,setMenu]=useState([]);const[sesiones,setSesiones]=useState([]);const[listaCompra,setListaCompra]=useState([]);
  const[historialPeso,setHistorialPeso]=useState([]);const[showPesoInput,setShowPesoInput]=useState(false);const[nuevoPesoVal,setNuevoPesoVal]=useState("");const[showPesoDetalle,setShowPesoDetalle]=useState(false);const[pesoRango,setPesoRango]=useState("all");const[showPesoPage,setShowPesoPage]=useState(false);
  const[nuevoProducto,setNuevoProducto]=useState({nombre:"",cantidad:"",unidad:"g"});const[mostrarForm,setMostrarForm]=useState(false);const[reponerItem,setReponerItem]=useState(null);const[reponerCant,setReponerCant]=useState("");
  const[diaMenu,setDiaMenu]=useState(()=>{const d=new Date().getDay();return d===0?6:d-1;});const[despensaTab,setDespensaTab]=useState("stock");const[semanaActiva,setSemanaActiva]=useState(1);
  const[boletaImg,setBoletaImg]=useState(null);const[boletaProducts,setBoletaProducts]=useState([]);const[boletaLoading,setBoletaLoading]=useState(false);const[boletaError,setBoletaError]=useState("");
  const[msgs,setMsgs]=useState([]);const[chatInput,setChatInput]=useState("");const[chatLoading,setChatLoading]=useState(false);
  const[menuLoading,setMenuLoading]=useState(false);const[menuError,setMenuError]=useState("");
  const[entrenamientoLoading,setEntrenamientoLoading]=useState(false);const[entrenamientoError,setEntrenamientoError]=useState("");
  const[sesionAbierta,setSesionAbierta]=useState(null);const[logsActuales,setLogsActuales]=useState({});
  const[accionSugerida,setAccionSugerida]=useState(null);const[showWarningEntrenamiento,setShowWarningEntrenamiento]=useState(false);const[showObjetivoModal,setShowObjetivoModal]=useState(false);
  const[habitos,setHabitos]=useState([]);const[habitosDiarios,setHabitosDiarios]=useState([]);const[showNuevoHabito,setShowNuevoHabito]=useState(false);const[nuevoHabitoForm,setNuevoHabitoForm]=useState({nombre:"",emoji:"",descripcion:""});
  const[showReporteS,setShowReporteS]=useState(false);const[showRestriccionesModal,setShowRestriccionesModal]=useState(false);const[showEntrenamientoModal,setShowEntrenamientoModal]=useState(false);const[showNotificacionesModal,setShowNotificacionesModal]=useState(false);const[showPrivacidadModal,setShowPrivacidadModal]=useState(false);const[notifConfig,setNotifConfig]=useState(()=>{try{return JSON.parse(localStorage.getItem("triflow_notif")||"null")||{habitos:true,agua:true,entrenamiento:true,menu:false,peso:true};}catch{return{habitos:true,agua:true,entrenamiento:true,menu:false,peso:true};}});const[privConfig,setPrivConfig]=useState(()=>{try{return JSON.parse(localStorage.getItem("triflow_priv")||"null")||{compartirProgreso:false,datosAnonimos:true,historialVisible:true};}catch{return{compartirProgreso:false,datosAnonimos:true,historialVisible:true};}});
  const[menuTracking,setMenuTracking]=useState([]);const[comentarioAbierto,setComentarioAbierto]=useState(null);const[comentarioTemp,setComentarioTemp]=useState("");
  const chatBottom=useRef(null);const boletaInputRef=useRef(null);
  const T=dark?DARK:LIGHT;
  const toggleTheme=()=>setDark(d=>{const next=!d;try{localStorage.setItem("triflow_dark",next?"1":"0");}catch{}return next;});

  useEffect(()=>{
    const saved=localStorage.getItem("triflow_email");if(saved)setEmail(saved);
    if(window.location.search.includes("dev")){const devUser={id:"dev-user-123",email:"dev@test.com"};setUser(devUser);loadAll(devUser.id);return;}

    let mounted=true;
    let loadStarted=false;

    // Inicia carga con un usuario ya autenticado. El flag loadStarted
    // evita que getSession y onAuthStateChange corran loadAll en paralelo.
    const iniciarCarga=async(sessionUser)=>{
      if(loadStarted)return;
      loadStarted=true;
      try{
        setUser(sessionUser);
        await loadAll(sessionUser.id);
        if(window.location.hash.includes("access_token")){
          window.history.replaceState(null,"",window.location.pathname+window.location.search);
        }
      }catch(e){
        console.error("iniciarCarga error:",e);
        if(mounted){setUser(null);setProfile(null);setScreen("auth");}
      }
    };

    // ── Carga inicial: getSession() es inmediato y confiable.
    // No depende de timing de eventos — resuelve directamente desde
    // localStorage/storage del cliente sin condición de carrera.
    supabase.auth.getSession()
      .then(({data:{session}})=>{
        if(!mounted)return;
        if(session?.user){setShowLanding(false);iniciarCarga(session.user);}
        else setScreen("auth");
      })
      .catch(()=>{if(mounted)setScreen("auth");});

    // ── Cambios posteriores: solo login explícito y logout.
    // Ignoramos INITIAL_SESSION y TOKEN_REFRESHED (ya manejados arriba).
    const{data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      if(!mounted)return;
      console.log("Auth event:",event);
      if(event==="SIGNED_OUT"){
        loadStarted=false;
        setUser(null);setProfile(null);setScreen("auth");
      }else if(event==="SIGNED_IN"&&session?.user&&!loadStarted){
        iniciarCarga(session.user);
      }
    });

    return()=>{mounted=false;subscription?.unsubscribe();};
  },[]);
  useEffect(()=>{chatBottom.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const scanBoleta=async(file)=>{if(!file||boletaLoading)return;setBoletaLoading(true);setBoletaError("");setBoletaProducts([]);try{const reader=new FileReader();const b64=await new Promise((ok,fail)=>{reader.onload=()=>ok(reader.result.split(",")[1]);reader.onerror=fail;reader.readAsDataURL(file);});setBoletaImg(URL.createObjectURL(file));const res=await fetch(`${API_BASE}/api/scan-boleta`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:b64,pais:profile?.pais||"Chile"})});const data=await res.json();if(!res.ok)throw new Error(data?.error||"Error al analizar");if(!Array.isArray(data.productos)||!data.productos.length)throw new Error("No se encontraron productos");setBoletaProducts(data.productos.map(p=>({...p,checked:true})));}catch(e){console.error("scanBoleta error:",e);setBoletaError(e.message||"Error procesando la boleta");}setBoletaLoading(false);};
  const confirmarBoleta=async()=>{const items=boletaProducts.filter(p=>p.checked);if(!items.length)return;const norm=s=>(s||'').toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim();for(const item of items){const cant=parseFloat(item.cantidad)||1;const unidad=item.unidad||"un";const existente=stock.find(s=>norm(s.nombre)===norm(item.nombre));if(existente){const newCant=Math.round((existente.cantidad+cant)*100)/100;const{error}=await supabase.from("stock").update({cantidad:newCant}).eq("id",existente.id);if(!error)setStock(p=>p.map(s=>s.id===existente.id?{...s,cantidad:newCant}:s));}else{const{data}=await supabase.from("stock").insert({user_id:user.id,nombre:item.nombre,cantidad:cant,unidad}).select().single();if(data)setStock(p=>[...p,data]);}}setBoletaProducts([]);setBoletaImg(null);setDespensaTab("stock");};

  const loadAll=async(uid)=>{
    try{
      let p=null;
      if(window.location.search.includes("dev")){p={id:uid,nombre:"Diego",apellido:"Test",peso_actual:85,peso_meta:75,objetivo:"bajar_peso",restricciones:["Sin lactosa"]};setProfile(p);setUser({id:uid,email:"test@triflow.com"});}
      else{const{data:prof,error:e1}=await supabase.from("profiles").select("*").eq("id",uid).maybeSingle();if(e1&&e1.code!=="PGRST116"){console.error("Profile load error:",e1);throw e1;}p=prof;if(!p?.nombre){setScreen("onboarding");return;}setProfile(p);}
      const{data:a}=await supabase.from("agua_diaria").select("*").eq("user_id",uid).eq("fecha",localDate()).maybeSingle();setAgua(a?.vasos||0);
      const{data:s}=await supabase.from("stock").select("*").eq("user_id",uid).order("created_at");setStock(s||[]);
      const{data:m}=await supabase.from("menu_semanal").select("*").eq("user_id",uid).order("created_at");setMenu(m||[]);
      const{data:se}=await supabase.from("sesiones").select("*").eq("user_id",uid).order("created_at");setSesiones(se||[]);
      const{data:hp}=await supabase.from("progreso_peso").select("peso,fecha,created_at").eq("user_id",uid).order("created_at",{ascending:true}).limit(60);setHistorialPeso(hp||[]);
      const{data:hab}=await supabase.from("habitos").select("*").eq("user_id",uid).order("created_at");setHabitos(hab||[]);
      const hoy=localDate();const{data:habDia}=await supabase.from("habito_diario").select("*").eq("user_id",uid).gte("fecha",new Date(new Date().setDate(new Date().getDate()-6)).toLocaleDateString("en-CA"));setHabitosDiarios(habDia||[]);
      try{const{data:mt}=await supabase.from("menu_diario").select("*").eq("user_id",uid).order("created_at");setMenuTracking(mt||[]);}catch(e){console.warn("menu_diario table may not exist yet:",e.message);setMenuTracking([]);}
      setMsgs([{role:"assistant",text:`Hola, ${p.nombre}! 🌱\n\nSoy tu asistente de TriFlow. Conozco tu perfil:\n\n**Objetivo:** ${p.objetivo?.replace(/_/g," ")}\n**Peso actual:** ${p.peso_actual} kg → Meta: ${p.peso_meta} kg\n**Restricciones:** ${p.restricciones?.length?p.restricciones.join(", "):"Ninguna"}\n\n¿En qué te ayudo hoy?`}]);
      setScreen("app");
    }catch(e){
      console.error("LoadAll error:",e);
      setUser(null);setProfile(null);setScreen("auth");
    }
  };
  const handleAuth=async()=>{setLoading(true);setError("");try{if(rememberMe)localStorage.setItem("triflow_email",email);else localStorage.removeItem("triflow_email");if(modo==="registro"){const{error:e}=await supabase.auth.signUp({email,password:pass});if(e)throw e;setError("Revisa tu email para confirmar tu cuenta");}else{const{error:e}=await supabase.auth.signInWithPassword({email,password:pass});if(e)throw e;}}catch(e){setError(e.message);}setLoading(false);};
  const loginGoogle=async()=>{setLoading(true);setError("");try{const{error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});if(error)throw error;}catch(e){setError(e.message);}setLoading(false);};
  const loginGitHub=async()=>{setLoading(true);setError("");try{const{error}=await supabase.auth.signInWithOAuth({provider:"github",options:{redirectTo:window.location.origin}});if(error)throw error;}catch(e){setError(e.message);}setLoading(false);};
  useEffect(()=>{const h=(e)=>{if(e.persisted)setLoading(false);};window.addEventListener("pageshow",h);return()=>window.removeEventListener("pageshow",h);},[]);
  const saveProfile=async()=>{setLoading(true);try{const nombre=sanitize(ob.nombre,50);const apellido=sanitize(ob.apellido,50);if(!nombre||!isValidNumber(ob.peso_actual,20,400)||!isValidNumber(ob.peso_meta,20,400)){setError("Revisa los campos: nombre y pesos son obligatorios");setLoading(false);return;}const payload={id:user.id,email:user.email,nombre,apellido,peso_actual:parseFloat(ob.peso_actual),peso_meta:parseFloat(ob.peso_meta),objetivo:ob.objetivo,restricciones:ob.restricciones,pais:ob.pais,dias_entrenamiento:ob.dias_entrenamiento};let{error:e}=await supabase.from("profiles").upsert(payload);if(e&&/pais/i.test(e.message||"")){console.warn("Columna pais no existe aún en DB, reintentando sin ella");const{pais,...payloadSinPais}=payload;const r=await supabase.from("profiles").upsert(payloadSinPais);e=r.error;}if(e)throw e;await supabase.from("progreso_peso").insert({user_id:user.id,peso:parseFloat(ob.peso_actual)});await loadAll(user.id);}catch(e){console.error("saveProfile error:",e);setError(e.message||"Error al guardar perfil");}setLoading(false);};
  const logout=async()=>{await supabase.auth.signOut();};
  const updateAgua=async(v)=>{setAgua(v);await supabase.from("agua_diaria").upsert({user_id:user.id,fecha:localDate(),vasos:v},{onConflict:"user_id,fecha"});};
  const registrarPeso=async()=>{
    const p=parseFloat(nuevoPesoVal);
    if(!p||p<20||p>400)return;
    const hoy=localDate();
    try{
      const existeHoy=historialPeso.find(h=>(h.fecha||"").slice(0,10)===hoy);
      if(existeHoy){
        await supabase.from("progreso_peso").update({peso:p}).eq("id",existeHoy.id);
        setHistorialPeso(prev=>prev.map(h=>h.id===existeHoy.id?{...h,peso:p}:h));
      }else{
        const{data:row}=await supabase.from("progreso_peso").insert({user_id:user.id,peso:p,fecha:hoy}).select().single();
        if(row)setHistorialPeso(prev=>[...prev,row]);
      }
      setProfile(pr=>({...pr,peso_actual:p}));
      await supabase.from("profiles").update({peso_actual:p}).eq("id",user.id);
    }catch(e){console.error("registrarPeso error:",e);}
    setNuevoPesoVal("");setShowPesoInput(false);
  };
  const agregarProducto=async()=>{const nombre=sanitize(nuevoProducto.nombre,100);if(!nombre)return;const cant=parseFloat(nuevoProducto.cantidad)||0;if(!isValidNumber(cant,0,99999))return;const unidad=sanitize(nuevoProducto.unidad,10)||"g";const norm=s=>(s||'').toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim();const existente=stock.find(s=>norm(s.nombre)===norm(nombre));if(existente){const newCant=Math.round((existente.cantidad+cant)*100)/100;const{error}=await supabase.from("stock").update({cantidad:newCant}).eq("id",existente.id);if(!error){setStock(p=>p.map(s=>s.id===existente.id?{...s,cantidad:newCant}:s));setNuevoProducto({nombre:"",cantidad:"",unidad:"g"});setMostrarForm(false);}return;}const{data}=await supabase.from("stock").insert({user_id:user.id,nombre,cantidad:cant,unidad}).select().single();if(data){setStock(p=>[...p,data]);setNuevoProducto({nombre:"",cantidad:"",unidad:"g"});setMostrarForm(false);}};
  const eliminarProducto=async(id)=>{await supabase.from("stock").delete().eq("id",id);setStock(p=>p.filter(s=>s.id!==id));};
  const reponerStock=async(item)=>{const cant=parseFloat(reponerCant);if(!cant||cant<=0)return;const newCant=item.cantidad+cant;const{error}=await supabase.from("stock").update({cantidad:Math.round(newCant*100)/100}).eq("id",item.id);if(!error){setStock(p=>p.map(s=>s.id===item.id?{...s,cantidad:Math.round(newCant*100)/100}:s));setReponerItem(null);setReponerCant("");}};
  const toggleSesion=async(id,completada)=>{await supabase.from("sesiones").update({completada:!completada}).eq("id",id);setSesiones(p=>p.map(s=>s.id===id?{...s,completada:!completada}:s));};
  const crearHabito=async()=>{
    const nombre=sanitize(nuevoHabitoForm.nombre,80);if(!nombre)return;
    const{data:h}=await supabase.from("habitos").insert({user_id:user.id,nombre,emoji:sanitize(nuevoHabitoForm.emoji,4),descripcion:sanitize(nuevoHabitoForm.descripcion,200)}).select().single();
    if(h){setHabitos(p=>[...p,h]);setNuevoHabitoForm({nombre:"",emoji:"",descripcion:""});setShowNuevoHabito(false);}
  };
  const completarHabitoDia=async(habitoId)=>{
    const hoy=localDate();
    const existe=habitosDiarios.find(h=>h.habito_id===habitoId&&h.fecha===hoy);
    if(existe){
      await supabase.from("habito_diario").delete().eq("id",existe.id);
      setHabitosDiarios(p=>p.filter(h=>h.id!==existe.id));
    }else{
      const{data:hd}=await supabase.from("habito_diario").insert({user_id:user.id,habito_id:habitoId,fecha:hoy,completada:true}).select().single();
      if(hd)setHabitosDiarios(p=>[...p,hd]);
    }
  };
  const eliminarHabito=async(id)=>{
    await supabase.from("habitos").delete().eq("id",id);
    await supabase.from("habito_diario").delete().eq("habito_id",id);
    setHabitos(p=>p.filter(h=>h.id!==id));
    setHabitosDiarios(p=>p.filter(hd=>hd.habito_id!==id));
  };
  const parsarEjercicios=(desc)=>{
    if(!desc)return[];
    return desc.split(",").map(e=>e.trim()).filter(Boolean).map(e=>{
      const mSets=e.match(/^(.*?)\s+(\d+)[xX×](\d+)(s)?$/i);
      const mMin=e.match(/^(.*?)\s+(\d+)\s*min$/i);
      if(mSets)return{nombre:mSets[1].trim(),series:parseInt(mSets[2]),reps:parseInt(mSets[3]),unidad:mSets[4]?"s":"reps"};
      if(mMin)return{nombre:mMin[1].trim(),series:1,reps:parseInt(mMin[2]),unidad:"min"};
      return{nombre:e,series:3,reps:10,unidad:"reps"};
    });
  };
  const abrirSesion=(sesionId)=>{
    const s=sesiones.find(x=>x.id===sesionId);if(!s)return;
    const ejercicios=parsarEjercicios(s.descripcion);
    const logsDB=s.logs||{};
    const initLogs={};
    ejercicios.forEach(ej=>{
      const prev=logsDB[ej.nombre]||[];
      initLogs[ej.nombre]=Array.from({length:ej.series},(_,i)=>({reps:prev[i]?.reps||"",peso:prev[i]?.peso||"",done:prev[i]?.done||false}));
    });
    setLogsActuales(p=>({...p,[sesionId]:initLogs}));
    setSesionAbierta(sesionId);
  };
  const updateLog=(sesionId,ejercicio,setIdx,field,value)=>{
    setLogsActuales(p=>({...p,[sesionId]:{...p[sesionId],[ejercicio]:p[sesionId][ejercicio].map((s,i)=>i===setIdx?{...s,[field]:value}:s)}}));
  };
  const toggleSetDone=async(sesionId,ejercicio,setIdx)=>{
    let savedLogs=null;
    setLogsActuales(p=>{
      const ejLogs=(p[sesionId]||{})[ejercicio]||[];
      const newEjLogs=ejLogs.map((s,i)=>i===setIdx?{...s,done:!s.done}:s);
      const newSesionLogs={...(p[sesionId]||{}),[ejercicio]:newEjLogs};
      savedLogs=newSesionLogs;
      return{...p,[sesionId]:newSesionLogs};
    });
    setTimeout(async()=>{
      if(savedLogs)await supabase.from("sesiones").update({logs:savedLogs}).eq("id",sesionId);
    },300);
  };
  const finalizarSesion=async(sesionId)=>{
    const logs=logsActuales[sesionId]||{};
    const{error}=await supabase.from("sesiones").update({completada:true,logs}).eq("id",sesionId);
    if(!error){setSesiones(p=>p.map(s=>s.id===sesionId?{...s,completada:true,logs}:s));setSesionAbierta(null);}
  };
  const generarMenu=async()=>{if(menuLoading)return false;setMenuLoading(true);setMenuError("");let _ok=false;try{const res=await fetch(`${API_BASE}/api/generate-menu`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile,stock})});const data=await res.json();if(!res.ok)throw new Error(data?.error||`Error ${res.status}`);if(!Array.isArray(data.menu)||!data.menu.length)throw new Error("Menú vacío");await supabase.from("menu_semanal").delete().eq("user_id",user.id);const rows=data.menu.map(m=>({user_id:user.id,dia:m.dia,desayuno:m.desayuno||"",almuerzo:m.almuerzo||"",snack:m.snack||"",cena:m.cena||"",consumo:m.consumo||{}}));const{data:inserted,error}=await supabase.from("menu_semanal").insert(rows).select();if(error)throw error;setMenu(inserted||rows);setListaCompra(Array.isArray(data.lista_compra)?data.lista_compra:[]);_ok=true;}catch(e){console.error("generarMenu error:",e);setMenuError(e.message||"Error generando menú");}setMenuLoading(false);return _ok;};
  const generarEntrenamiento=async()=>{if(entrenamientoLoading)return false;setEntrenamientoLoading(true);setEntrenamientoError("");let _ok=false;try{const res=await fetch(`${API_BASE}/api/generate-training`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile})});const data=await res.json();if(!res.ok)throw new Error(data?.error||`Error ${res.status}`);if(!Array.isArray(data.sesiones)||!data.sesiones.length)throw new Error("Sin sesiones generadas");await supabase.from("sesiones").delete().eq("user_id",user.id);const rows=data.sesiones.map(s=>({user_id:user.id,dia:s.dia,grupo:`Sem ${s.semana||1} · ${s.grupo}`,descripcion:s.descripcion||"",completada:false,logs:{}}));const{data:inserted,error}=await supabase.from("sesiones").insert(rows).select();if(error)throw error;setSesiones(inserted||rows);_ok=true;}catch(e){console.error("generarEntrenamiento error:",e);setEntrenamientoError(e.message||"Error generando plan");}setEntrenamientoLoading(false);return _ok;};
  const ejecutarAccionAsistente=async(tipo,datos)=>{
    setAccionSugerida(null);
    let ok=false;
    if(tipo==="menu"){ok=await generarMenu();}
    else if(tipo==="entrenamiento"){ok=await generarEntrenamiento();}
    else if(tipo==="despensa"&&datos?.items?.length){
      try{const rows=datos.items.map(i=>({user_id:user.id,nombre:i.nombre,cantidad:parseFloat(i.cantidad)||0,unidad:i.unidad||"g"}));const{data:ins,error}=await supabase.from("stock").insert(rows).select();if(error)throw error;setStock(p=>[...p,...(ins||rows)]);ok=true;}catch(e){ok=false;}
    }
    if(ok){
      if(tipo==="menu")setTab("habito");
      if(tipo==="entrenamiento")setTab("entrena");
      const textos={menu:"✓ ¡Menú semanal guardado! Te llevé directo a la pestaña **Hábito** 🥗",entrenamiento:"✓ ¡Plan de entrenamiento guardado! Puedes verlo en la pestaña **Entrena** 💪",despensa:`✓ ${datos?.items?.length||0} producto(s) agregado(s) a tu despensa 📦`};
      setMsgs(p=>[...p,{role:"assistant",text:textos[tipo]||"✓ ¡Listo!"}]);
    }else{
      setMsgs(p=>[...p,{role:"assistant",text:"Hubo un error al guardar. Intenta de nuevo o ve directamente a la pestaña correspondiente."}]);
    }
  };
  const agregarSugerencia=async(item,idx)=>{const cant=parseFloat(item.cantidad)||0;const unidad=item.unidad||"g";const norm=s=>(s||'').toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim();const existente=stock.find(s=>norm(s.nombre)===norm(item.nombre));if(existente){const newCant=Math.round((existente.cantidad+cant)*100)/100;const{error}=await supabase.from("stock").update({cantidad:newCant}).eq("id",existente.id);if(!error){setStock(p=>p.map(s=>s.id===existente.id?{...s,cantidad:newCant}:s));setListaCompra(p=>p.filter((_,i)=>i!==idx));}return;}const payload={user_id:user.id,nombre:item.nombre,cantidad:cant,unidad};const{data,error}=await supabase.from("stock").insert(payload).select().single();if(error){setMenuError(error.message);return;}setStock(p=>[...p,data]);setListaCompra(p=>p.filter((_,i)=>i!==idx));};
  const toggleComidaCompleta=async(fecha,comida)=>{
    try{
      const existing=menuTracking.find(t=>t.fecha===fecha&&t.comida===comida);
      const wasComplete=existing?.completada||false;
      const newVal=!wasComplete;
      if(existing){
        const{error}=await supabase.from("menu_diario").update({completada:newVal}).eq("id",existing.id);
        if(error)throw error;
        setMenuTracking(p=>p.map(t=>t.id===existing.id?{...t,completada:newVal}:t));
      }else{
        const{data,error}=await supabase.from("menu_diario").insert({user_id:user.id,fecha,comida,completada:true,comentario:""}).select().single();
        if(error)throw error;
        if(data)setMenuTracking(p=>[...p,data]);
      }
      // Auto-descuento de despensa según consumo del menú
      const fechaObj=new Date(fecha+'T12:00:00');
      const diaSemIdx=fechaObj.getDay()===0?6:fechaObj.getDay()-1;
      const menuDia=menu.find(m=>m.dia===DIAS[diaSemIdx]);
      const items=menuDia?.consumo?.[comida];
      if(Array.isArray(items)&&items.length>0){
        const norm=s=>(s||'').toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim();
        const aBase=(c,u)=>{const ul=(u||'').toLowerCase();if(ul==='kg')return[c*1000,'g'];if(ul==='l')return[c*1000,'ml'];return[c,ul];};
        const updates=[];
        for(const item of items){
          const ni=norm(item.nombre);
          const si=stock.find(s=>norm(s.nombre)===ni)||stock.find(s=>norm(s.nombre).includes(ni)||ni.includes(norm(s.nombre)));
          if(!si)continue;
          const[cantI,uI]=aBase(item.cantidad||0,item.unidad);
          const[cantS,uS]=aBase(si.cantidad,si.unidad);
          const esUnidad=si.unidad==='unidad'||si.unidad==='un';
          if(uI!==uS&&!esUnidad)continue;
          let newCant;
          if(esUnidad){
            newCant=newVal?Math.max(0,si.cantidad-(item.cantidad||0)):si.cantidad+(item.cantidad||0);
          }else{
            const newBase=newVal?Math.max(0,cantS-cantI):cantS+cantI;
            newCant=si.unidad==='kg'?newBase/1000:si.unidad==='l'?newBase/1000:newBase;
          }
          newCant=Math.round(newCant*100)/100;
          updates.push({id:si.id,cantidad:newCant});
        }
        if(updates.length>0){
          for(const u of updates)await supabase.from("stock").update({cantidad:u.cantidad}).eq("id",u.id);
          setStock(p=>p.map(s=>{const u=updates.find(up=>up.id===s.id);return u?{...s,cantidad:u.cantidad}:s;}));
        }
      }
    }catch(e){console.error("toggleComidaCompleta error:",e);}
  };
  const guardarComentarioComida=async(fecha,comida,comentario)=>{
    try{
      const existing=menuTracking.find(t=>t.fecha===fecha&&t.comida===comida);
      if(existing){
        const{error}=await supabase.from("menu_diario").update({comentario}).eq("id",existing.id);
        if(error)throw error;
        setMenuTracking(p=>p.map(t=>t.id===existing.id?{...t,comentario}:t));
      }else{
        const{data,error}=await supabase.from("menu_diario").insert({user_id:user.id,fecha,comida,completada:false,comentario}).select().single();
        if(error)throw error;
        if(data)setMenuTracking(p=>[...p,data]);
      }
    }catch(e){console.error("guardarComentarioComida error:",e);}
    setComentarioAbierto(null);setComentarioTemp("");
  };
  const sendChat=async()=>{if(!chatInput.trim()||chatLoading)return;if(!rateLimiter.check()){setMsgs(p=>[...p,{role:"assistant",text:"Espera un momento antes de volver a preguntar. Tienes un límite de 10 mensajes por minuto."}]);return;}const txt=sanitize(chatInput.trim(),1000);setChatInput("");setMsgs(p=>[...p,{role:"user",text:txt}]);setChatLoading(true);try{const stockInfo=stock.map(s=>`${s.nombre}: ${s.cantidad}${s.unidad}`).join(", ");const paisU=profile?.pais||"Chile";const system=`Eres el asistente personal de TriFlow para ${profile?.nombre} ${profile?.apellido}.\nPerfil: ${paisU} 🌎 · objetivo ${profile?.objetivo?.replace(/_/g," ")}, peso actual ${profile?.peso_actual}kg, meta ${profile?.peso_meta}kg, restricciones: ${profile?.restricciones?.join(", ")||"ninguna"}.\nDespensa actual: ${stockInfo||"vacía"}.\n\nIMPORTANTE: Adapta tu lenguaje, modismos y nombres de comidas al país del usuario (${paisU}). Por ejemplo:\n- Chile: papa, palta, poroto, choclo, once, marraqueta, cazuela, charquicán\n- Argentina: papa, palta, mate, milanesa, asado, merienda, facturas\n- Perú: papa, palta, ceviche, ají de gallina, lomo saltado, lonche\n- Colombia: papa, aguacate, arepa, frijoles, ajiaco, sancocho, algo\n- Venezuela: aguacate, arepa, caraota, pabellón, cachapa\n- México: jitomate, aguacate, frijol, tortilla, chilaquiles, tacos\n- España: patata, aguacate, judía, garbanzo, tortilla, paella\nUsa modismos naturales del país sin caer en estereotipo. Responde en español, cálido y conciso (máx 200 palabras).\n\nACCIONES DISPONIBLES — usa estos marcadores SOLO cuando el usuario pide EXPLÍCITAMENTE crear o guardar contenido en la app (NO si solo conversas, consultas o das consejos):\n- Si pide crear un MENÚ SEMANAL completo para 7 días: escribe exactamente [ACCION:menu] al final de tu respuesta.\n- Si pide crear un PLAN DE ENTRENAMIENTO o mesociclo: escribe exactamente [ACCION:entrenamiento] al final.\n- Si pide agregar productos específicos a su DESPENSA: escribe [ACCION:despensa]{"items":[{"nombre":"Nombre","cantidad":N,"unidad":"g"}]}[/ACCION] al final con los items exactos (unidades válidas: g, kg, ml, l, unidad).\nIMPORTANTE: NO incluyas marcadores si el usuario solo pregunta sobre nutrición, ejercicio, recetas o pide consejos en general.`;const msgHistory=msgs.slice(1).map(m=>({role:m.role,content:m.text.replace(/\*\*/g,"")}));const res=await fetch(`${API_BASE}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1000,system,messages:[...msgHistory,{role:"user",content:txt}]})});const data=await res.json();if(!res.ok)throw new Error(data?.error||`Error ${res.status}`);const responseText=data?.content?.[0]?.text;if(!responseText)throw new Error("Respuesta vacía del servidor");let cleanText=responseText;let nuevoAccion=null;const simpleM=cleanText.match(/\[ACCION:(menu|entrenamiento)\]/i);if(simpleM){nuevoAccion={tipo:simpleM[1].toLowerCase(),datos:null};cleanText=cleanText.replace(/\[ACCION:(menu|entrenamiento)\]/gi,"").trim();}const despensaM=cleanText.match(/\[ACCION:despensa\]([\s\S]*?)\[\/ACCION\]/i);if(despensaM){try{const datosDespensa=JSON.parse(despensaM[1]);nuevoAccion={tipo:"despensa",datos:datosDespensa};cleanText=cleanText.replace(/\[ACCION:despensa\][\s\S]*?\[\/ACCION\]/gi,"").trim();}catch(_){}}setMsgs(p=>[...p,{role:"assistant",text:cleanText}]);if(nuevoAccion)setAccionSugerida(nuevoAccion);}catch(e){console.error("Chat error:",e);setMsgs(p=>[...p,{role:"assistant",text:`Error: ${e.message||"No se pudo obtener respuesta"}. Intenta de nuevo.`}]);}setChatLoading(false);};

  const inp=(x={})=>({...inputStyle(T,'default'),marginBottom:SPACING.md,...x});
  const btn=(bg,x={})=>({width:"100%",padding:SPACING.lg,borderRadius:BORDER_RADIUS.full,background:bg,border:"none",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:TRANSITIONS.fast,...x});

  const hoyIdx=new Date().getDay()===0?6:new Date().getDay()-1;
  const menuHoy=menu.find(m=>m.dia===DIAS[hoyIdx])||null;
  const stockCritico=stock.filter(s=>s.cantidad<=(s.minimo||0));
  const listaCompraCompleta=(()=>{const norm=s=>(s||'').toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim();const nombres=new Set(listaCompra.map(i=>norm(i.nombre)));const fromStock=stockCritico.filter(s=>!nombres.has(norm(s.nombre))).map(s=>({nombre:s.nombre,cantidad:s.unidad==='un'||s.unidad==='unidad'?1:s.unidad==='kg'?1:s.unidad==='L'||s.unidad==='l'?1:500,unidad:s.unidad||'g',motivo:'Stock agotado',stockId:s.id}));return[...listaCompra,...fromStock];})();
  const sesPorSemana=(n)=>sesiones.filter(s=>s.grupo?.startsWith(`Sem ${n}`));
  const onboardingSlides=[{emoji:"🌱",title:"Organiza tu cambio",desc:"Perfil personalizado según tus objetivos y restricciones"},{emoji:"🥗",title:"Tu alimentación, ordenada",desc:"Menú semanal generado con IA basado en tu despensa"},{emoji:"✦",title:"Con un profesional real",desc:"Tu asistente IA entrena contigo y adapta planes"}];

  /* ── LANDING PAGE (Sin usuario, primera visita) ────────── */
  if(showLanding && !user) {
    if(Capacitor.isNativePlatform()){setShowLanding(false);setScreen("auth");}
    else{window.location.replace("/landing/");return null;}
  }

  /* ── LOADING ──────────────────────────────────────────── */
  if(screen==="loading")return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20,fontFamily:"'DM Sans',sans-serif",transition:"background .4s"}}>
      <style>{makeCSS(dark)}</style>
      <TriFlowLogo T={T} size={34}/>
      <div style={{fontSize:28,animation:"pulse 1.4s ease infinite",opacity:.6}}>
        <svg width="28" height="28" viewBox="0 0 32 32"><rect x="11.75" y="2" width="8.5" height="6" rx="2.2" fill={T.sage} opacity=".4"/><rect x="11.75" y="10" width="8.5" height="6" rx="2.2" fill={T.sage} opacity=".6"/><rect x="11.75" y="18" width="8.5" height="6" rx="2.2" fill={T.sage} opacity=".8"/><rect x="11.75" y="26" width="8.5" height="6" rx="2.2" fill={T.sage}/></svg>
      </div>
      <div style={{fontSize:14,color:T.textSub}}>Cargando tu espacio...</div>
    </div>
  );

  /* ── AUTH ─────────────────────────────────────────────── */
  if(screen==="auth"){
    const wrap=(children)=>(<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,transition:"background .4s",fontFamily:"'DM Sans',sans-serif"}}><style>{makeCSS(dark)}</style>{children}</div>);
    const card={width:"100%",maxWidth:400,background:T.surface,borderRadius:22,padding:"40px 28px",border:`1px solid ${T.border}`,position:"relative"};
    if(modo==="welcome")return wrap(
      <div style={card} className="fade-up">
        <div style={{textAlign:"center"}}>
          <div style={{marginBottom:4,display:"flex",justifyContent:"center"}}><TriFlowLogo T={T} size={30}/></div>
          <div style={{height:24}}/>

          <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,color:T.charcoal,letterSpacing:"-0.03em",marginBottom:4}}>Bienvenido a TriFlow.<br/><span style={{color:T.sage,fontStyle:"italic",fontWeight:400}}>Tu camino empieza aqui.</span></div>
          <div style={{fontSize:14,color:T.textSub,marginBottom:24,marginTop:8}}>Elige cómo deseas continuar</div>

          {/* OAuth Buttons */}
          <button onClick={loginGoogle} disabled={loading} style={{width:"100%",padding:"13px",borderRadius:12,border:`1.5px solid ${T.border}`,background:T.surface,color:T.charcoal,cursor:loading?"default":"pointer",fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:10,transition:"all .2s",marginBottom:10}}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continuar con Google
          </button>
          <button onClick={loginGitHub} disabled={loading} style={{width:"100%",padding:"13px",borderRadius:12,border:`1.5px solid ${T.border}`,background:T.surface,color:T.charcoal,cursor:loading?"default":"pointer",fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:10,transition:"all .2s",marginBottom:16}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={T.charcoal}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            Continuar con GitHub
          </button>

          {/* Separator */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{flex:1,height:"1px",background:T.border}}/>
            <div style={{fontSize:11,color:T.textSub,fontFamily:"'JetBrains Mono',monospace"}}>O CON EMAIL</div>
            <div style={{flex:1,height:"1px",background:T.border}}/>
          </div>

          <button onClick={()=>{setModo("login");setError("");}} style={btn(T.sage,{marginBottom:12})}>Iniciar sesión con email</button>
          <button onClick={()=>{setModo("intro");setOnboardingSlide(0);setError("");}} style={btn(T.border2,{color:T.charcoal})}>Crear nueva cuenta</button>
        </div>
        <div style={{position:"absolute",top:20,right:20}}><ThemeToggle dark={dark} toggle={toggleTheme} T={T}/></div>
      </div>
    );
    if(modo==="intro"){const s=onboardingSlides[onboardingSlide];return wrap(
      <div style={card} className="fade-up">
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:32,marginBottom:14,lineHeight:1}}>{s.emoji}</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:23,fontWeight:600,color:T.charcoal,marginBottom:8}}>{s.title}</div>
          <div style={{fontSize:14,color:T.textSub,lineHeight:1.65}}>{s.desc}</div>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:24,justifyContent:"center"}}>
          {onboardingSlides.map((_,i)=><div key={i} style={{width:i===onboardingSlide?24:8,height:8,borderRadius:99,background:i===onboardingSlide?T.sage:T.border,transition:"all .3s"}}/>)}
        </div>
        <div style={{display:"flex",gap:10}}>
          {onboardingSlide>0&&<button onClick={()=>setOnboardingSlide(onboardingSlide-1)} style={btn(T.muted)}>← Atrás</button>}
          {onboardingSlide<onboardingSlides.length-1?<button onClick={()=>setOnboardingSlide(onboardingSlide+1)} style={btn(T.sage)}>Siguiente →</button>:<button onClick={()=>{setModo("registro");setError("");}} style={btn(T.sage)}>Crear cuenta →</button>}
        </div>
      </div>
    );}
    return wrap(
      <div style={card} className="fade-up">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <TriFlowLogo T={T} size={22}/>
          <ThemeToggle dark={dark} toggle={toggleTheme} T={T}/>
        </div>
        {modo==="login"&&<div style={{marginBottom:20}}><div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,color:T.charcoal,letterSpacing:"-0.03em"}}>Bienvenido de vuelta.<br/><span style={{color:T.sage,fontStyle:"italic",fontWeight:400}}>Tu progreso te espera.</span></div></div>}
        {modo==="registro"&&<div style={{marginBottom:20}}><div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,color:T.charcoal,letterSpacing:"-0.03em",marginBottom:6}}>Crear tu cuenta</div><button onClick={()=>{setModo("welcome");setError("");}} style={{background:"none",border:"none",color:T.textSub,cursor:"pointer",fontSize:14,fontFamily:FONTS.body,textDecoration:"underline"}}>← Atrás</button></div>}
        {error&&<div style={{background:T.clay+"22",border:`1px solid ${T.clay}`,borderRadius:12,padding:"12px",marginBottom:16,fontSize:14,color:T.clay}}>{error}</div>}
        <input type="email" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={inp()}/>
        <div style={{position:"relative",marginBottom:20}}><input type={showPass?"text":"password"} placeholder="Contraseña" value={pass} onChange={e=>setPass(e.target.value)} style={inp({marginBottom:0,paddingRight:40})}/><button onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:12,top:12,background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.textSub}}>{showPass?"👁️":"👁️‍🗨️"}</button></div>
        {modo==="login"&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20,fontSize:14}}><input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} style={{cursor:"pointer"}}/><label style={{cursor:"pointer",color:T.textMid}}>Recordar usuario</label></div>}
        <button onClick={handleAuth} disabled={loading||!email||!pass} style={btn(email&&pass&&!loading?T.sage:T.muted)}>{loading?"Cargando...":modo==="login"?"Iniciar sesión":"Crear cuenta"}</button>
        {modo==="registro"&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:14,justifyContent:"center"}}><TFIcon name="lock" size={12} color={T.textSub}/><span style={{fontSize:11,color:T.textSub,fontFamily:FONTS.mono}}>Tu data nunca se vende ni se comparte.</span></div>}

        {/* OAuth Buttons */}
        {modo==="login"&&(
          <div style={{marginTop:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{flex:1,height:"1px",background:T.border}}/>
              <div style={{fontSize:12,color:T.textSub,fontFamily:"'JetBrains Mono',monospace"}}>O CONTINÚA CON</div>
              <div style={{flex:1,height:"1px",background:T.border}}/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={loginGoogle} disabled={loading} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${T.border}`,background:T.surface,color:T.charcoal,cursor:loading?"default":"pointer",fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s",opacity:loading?0.6:1}}>
                <span style={{fontSize:16}}>🔵</span> Google
              </button>
              <button onClick={loginGitHub} disabled={loading} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${T.border}`,background:T.surface,color:T.charcoal,cursor:loading?"default":"pointer",fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s",opacity:loading?0.6:1}}>
                <span style={{fontSize:16}}>⚫</span> GitHub
              </button>
            </div>
          </div>
        )}

        {modo==="login"&&<button onClick={()=>{setModo("welcome");setError("");}} style={{width:"100%",marginTop:20,padding:10,borderRadius:99,background:"transparent",border:`1px solid ${T.border}`,color:T.charcoal,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:14}}>¿No tienes cuenta? Regístrate</button>}
      </div>
    );
  }

  /* ── ONBOARDING ───────────────────────────────────────── */
  if(screen==="onboarding")return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,transition:"background .4s",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{makeCSS(dark)}</style>
      <div style={{width:"100%",maxWidth:440,background:T.surface,borderRadius:16,padding:"40px 28px",border:`1px solid ${T.border}`}} className="fade-up">
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal,marginBottom:4}}>Cuéntanos sobre ti</div>
        <div style={{fontSize:14,color:T.textSub,marginBottom:24}}>Para personalizar tu experiencia en TriFlow</div>
        {error&&<div style={{background:T.clay+"22",border:`1px solid ${T.clay}`,borderRadius:12,padding:"12px",marginBottom:16,fontSize:14,color:T.clay}}>{error}</div>}
        <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:8}}>PAÍS · Para personalizar tu menú con comida local</div>
        <select value={ob.pais} onChange={e=>setOb({...ob,pais:e.target.value})} style={{...inp(),appearance:"none",backgroundImage:`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='${encodeURIComponent(T.textMid)}' d='M6 8L0 0h12z'/></svg>")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",paddingRight:"36px",cursor:"pointer"}}>
          {PAISES.map(p=>(<option key={p.n} value={p.n}>{p.f}  {p.n}</option>))}
        </select>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <input placeholder="Nombre" value={ob.nombre} onChange={e=>setOb({...ob,nombre:e.target.value})} style={inp()}/>
          <input placeholder="Apellido" value={ob.apellido} onChange={e=>setOb({...ob,apellido:e.target.value})} style={inp()}/>
          <input type="number" placeholder="Peso actual kg" value={ob.peso_actual} onChange={e=>setOb({...ob,peso_actual:e.target.value})} style={inp()}/>
          <input type="number" placeholder="Peso meta kg" value={ob.peso_meta} onChange={e=>setOb({...ob,peso_meta:e.target.value})} style={inp()}/>
        </div>
        <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:10,marginTop:4}}>OBJETIVO</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {[["bajar_peso","Bajar de peso","↓"],["ganar_musculo","Ganar músculo","↑"],["rendimiento","Mejorar rendimiento","⚡"]].map(([v,l,i])=>(
            <button key={v} onClick={()=>setOb({...ob,objetivo:v})} style={{padding:"11px 16px",borderRadius:12,border:`1.5px solid ${ob.objetivo===v?T.sage:T.border}`,background:ob.objetivo===v?T.sage+"18":"transparent",cursor:"pointer",textAlign:"left",display:"flex",gap:10,alignItems:"center",fontFamily:"'DM Sans',sans-serif"}}>
              <span>{i}</span><span style={{fontSize:14,color:ob.objetivo===v?T.sageD:T.charcoal,fontWeight:ob.objetivo===v?600:400}}>{l}</span>
            </button>
          ))}
        </div>
        <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:8}}>RESTRICCIONES (opcional)</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
          {["Sin lactosa","Sin gluten","Vegano","Vegetariano"].map(r=>{const s=ob.restricciones.includes(r);return<button key={r} onClick={()=>setOb({...ob,restricciones:s?ob.restricciones.filter(x=>x!==r):[...ob.restricciones,r]})} style={{padding:"7px 14px",borderRadius:99,border:`1.5px solid ${s?T.sand:T.border}`,background:s?T.sand+"22":"transparent",color:s?T.sand:T.textMid,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>{r}</button>;})}
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:10}}>DÍAS DE ENTRENAMIENTO POR SEMANA</div>
          <div style={{display:"flex",gap:8}}>
            {[2,3,4,5,6].map(d=>{const a=(ob.dias_entrenamiento||3)===d;return(
              <button key={d} onClick={()=>setOb({...ob,dias_entrenamiento:d})} style={{flex:1,padding:"12px 0",borderRadius:12,border:`2px solid ${a?T.violet:T.border}`,background:a?T.violet+"18":"transparent",color:a?T.violet:T.textMid,fontWeight:a?700:400,cursor:"pointer",fontSize:20,transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>{d}</button>
            );})}
          </div>
          <div style={{fontSize:11,color:T.textSub,marginTop:6,textAlign:"center"}}>días por semana</div>
        </div>
        <button onClick={saveProfile} disabled={loading||!ob.nombre||!ob.peso_actual} style={btn(ob.nombre&&ob.peso_actual&&!loading?T.sage:T.muted)}>{loading?"Guardando...":"Comenzar mi cambio →"}</button>
      </div>
    </div>
  );

  /* ── APP SHELL ────────────────────────────────────────── */
  const hora=new Date().getHours();
  const saludo=hora<12?"Buenos días":hora<19?"Buenas tardes":"Buenas noches";

  return(
    <div style={{width:"100%",minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",fontFamily:"'DM Sans',sans-serif",transition:"background .4s"}}>
      <style>{makeCSS(dark)}</style>

      {/* Main content scroll area */}
      <div style={{flex:1,overflowY:"auto",background:T.bg,transition:"background .4s",paddingBottom:80}}>

          {/* ═══ INICIO ═══ */}
          {tab==="inicio"&&(
            <div style={{paddingBottom:16}} className="mode-in">
              {/* Header */}
              <div style={{padding:"8px 22px 14px",background:T.bg,flexShrink:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:12}}>
                  <div>
                    <div style={{fontFamily:FONTS.display,fontSize:28,fontWeight:600,color:T.charcoal,letterSpacing:"-0.03em",lineHeight:1.05}}>
                      {saludo}, {profile?.nombre}.<br/><span style={{color:T.sage,fontStyle:"italic"}}>{hora<12?"¿Lista para hoy?":"¿Listo para hoy?"}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <ThemeToggle dark={dark} toggle={toggleTheme} T={T}/>
                    <div onClick={()=>setTab("perfil")} style={{cursor:"pointer"}}><Avatar name={`${profile?.nombre||"U"} ${profile?.apellido||""}`} size={42} T={T}/></div>
                  </div>
                </div>
              </div>
              {/* Daily rings card — matches TFInicioA design */}
              {(()=>{
                const hoy3=localDate();
                const completadasHoy3=habitosDiarios.filter(h=>h.fecha===hoy3).length;
                const totalHab3=habitos.length||8;
                const pctHoy=totalHab3>0?Math.round((completadasHoy3/totalHab3)*100):0;
                let racha3=0;const hoyD3=new Date();
                for(let i=0;i<60;i++){const d=new Date(hoyD3);d.setDate(hoyD3.getDate()-i);const f=d.toLocaleDateString("en-CA");if(habitosDiarios.some(h=>h.fecha===f))racha3++;else if(i>0)break;}
                const pa3=profile?.peso_actual||"—";
                return(
                  <div style={{padding:"0 22px 18px"}}>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:18}}>
                      <div style={{display:"flex",gap:18,alignItems:"center"}}>
                        <div style={{position:"relative",width:84,height:84,flexShrink:0}}>
                          <ProgressRing value={completadasHoy3} max={totalHab3} size={84} stroke={8} color={T.sage}/>
                          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONTS.display,fontSize:18,fontWeight:600,color:T.charcoal}}>{pctHoy}%</div>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,color:T.textSub,fontFamily:FONTS.mono,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Día de hoy · {new Date().getDate()} {new Date().toLocaleDateString('es-CL',{month:'short'})}</div>
                          <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,letterSpacing:"-0.025em",lineHeight:1.1,color:T.charcoal}}>{completadasHoy3} de {totalHab3} hábitos</div>
                          <div style={{fontSize:13,color:T.textMid,marginTop:4}}>Te faltan {totalHab3-completadasHoy3}. Tu mejor racha: {racha3} días.</div>
                        </div>
                      </div>
                      {/* 4 mini stat grid */}
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:8,marginTop:16}}>
                        {[
                          ["water","Agua",`${agua}/${8}`,T.sky,agua/8],
                          ["weight","Peso",pa3+"",T.sage,0.9],
                          ["flame","Cal","—",T.clay,0.55],
                          ["dumbbell","Sesiones",String(sesiones.filter(s=>s.completada).length),T.violet,sesiones.length>0?sesiones.filter(s=>s.completada).length/sesiones.length:0]
                        ].map(([ic,l,v,c,p])=>(
                          <div key={l} style={{background:c+"14",border:`1px solid ${c}22`,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                            <div style={{color:c,display:"flex",justifyContent:"center",marginBottom:4}}><TFIcon name={ic} size={16} color={c}/></div>
                            <div style={{fontFamily:FONTS.display,fontSize:15,fontWeight:600,color:T.charcoal,lineHeight:1,letterSpacing:"-0.02em"}}>{v}</div>
                            <div style={{fontSize:10,color:T.textSub,marginTop:3}}>{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ───── HÁBITOS ───── */}
              {habitos.length===0&&(
                <div style={{padding:"0 22px 18px"}}>
                  <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase",marginBottom:8}}>Tus hábitos</div>
                  <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,padding:"24px 20px",textAlign:"center"}}>
                    <div style={{fontFamily:FONTS.display,fontSize:20,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal,marginBottom:8}}>Construye tu rutina</div>
                    <div style={{fontSize:13,color:T.textSub,lineHeight:1.6,marginBottom:16}}>Agrega hábitos diarios que quieras mantener.</div>
                    <button onClick={()=>setShowNuevoHabito(true)} style={{width:"100%",padding:"14px",borderRadius:99,border:"none",background:T.sage,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
                      <TFIcon name="plus" size={16} color="#fff"/> Crear mi primer hábito
                    </button>
                  </div>
                </div>
              )}
              {habitos.length>0&&(()=>{
                const hoy=localDate();
                const hoyIdx=new Date().getDay();
                const hace7=new Date(new Date().setDate(new Date().getDate()-6)).toLocaleDateString("en-CA");
                // Completadas hoy
                const completadasHoy=habitosDiarios.filter(h=>h.fecha===hoy).length;
                // Semana actual (últimos 7 días)
                const completadasSem=habitosDiarios.filter(h=>h.fecha>=hace7).reduce((a,v)=>{const k=v.fecha;return{...a,[k]:(a[k]||0)+1};},{});
                const hoyDate2=new Date();const hoyDay2=hoyDate2.getDay();const mondayOff=hoyDay2===0?-6:1-hoyDay2;const lunesDate=new Date(hoyDate2);lunesDate.setDate(hoyDate2.getDate()+mondayOff);
                const diasSem=Array.from({length:7},(_,i)=>{const d=new Date(lunesDate);d.setDate(lunesDate.getDate()+i);const f=d.toLocaleDateString("en-CA");return{fecha:f,completadas:completadasSem[f]||0,esHoy:f===hoy};});
                // Semana anterior
                const hace14=new Date(new Date().setDate(new Date().getDate()-13)).toLocaleDateString("en-CA");
                const completadasSemAnt=habitosDiarios.filter(h=>h.fecha>=hace14&&h.fecha<hace7).reduce((a,v)=>{const k=v.fecha;return{...a,[k]:(a[k]||0)+1};},{});
                const totalAnt=Object.values(completadasSemAnt).reduce((a,v)=>a+v,0);
                const diff=Object.values(completadasSem).reduce((a,v)=>a+v,0)-totalAnt;
                // Insights motivacionales
                const insights=["Día perfecto. Tu cuerpo lo recordará — son las pequeñas victorias las que cambian todo.","Consistencia es la clave. Cada día te acerca más a tu meta.","Momentum. Mantén el ritmo y los cambios llegarán solos.","Cada hábito pequeño es un paso gigante hacia quien quieres ser.","Tu esfuerzo de hoy es tu éxito de mañana."];
                const dayOfYear=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/(864e5));
                const insight=insights[dayOfYear%insights.length];
                return(
                  <div style={{padding:"0 22px 18px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
                      <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase"}}>Tus hábitos</div>
                      <span onClick={()=>setShowNuevoHabito(true)} style={{fontSize:12,color:T.sage,fontWeight:500,cursor:"pointer"}}>+ Nuevo</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {habitos.map(h=>{
                        const completado=habitosDiarios.some(hd=>hd.habito_id===h.id&&hd.fecha===hoy);
                        const hColor=h.emoji==="💧"?T.sky:h.emoji==="🏋️"?T.violet:h.emoji==="🥗"?T.sage:h.emoji==="😴"?T.sand:h.emoji==="🔥"?T.clay:T.sage;
                        const hIcon=h.emoji==="💧"?"water":h.emoji==="🏋️"?"dumbbell":h.emoji==="🥗"?"leaf":h.emoji==="😴"?"moon":h.emoji==="📖"?"chat":h.emoji==="🔥"?"flame":"sparkles";
                        // Count streak for this habit
                        let hStreak=0;const hoyD4=new Date();
                        for(let i=0;i<60;i++){const d=new Date(hoyD4);d.setDate(hoyD4.getDate()-i);const f=d.toLocaleDateString("en-CA");if(habitosDiarios.some(hd=>hd.habito_id===h.id&&hd.fecha===f))hStreak++;else if(i>0)break;}
                        return(
                          <div key={h.id} onClick={()=>completarHabitoDia(h.id)} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"12px 14px",cursor:"pointer",transition:"all .25s"}}>
                            <div style={{display:"flex",alignItems:"center",gap:12}}>
                              <div style={{width:28,height:28,borderRadius:8,background:completado?hColor:"transparent",border:`2px solid ${hColor}`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0,transition:"all .2s"}}>
                                {completado&&<TFIcon name="check" size={16} color="#fff"/>}
                              </div>
                              <div style={{flex:1}}>
                                <div style={{fontSize:14,fontWeight:500,color:T.charcoal,textDecoration:completado?"line-through":"none",opacity:completado?0.65:1}}>{h.nombre}</div>
                                {hStreak>0&&<div style={{fontSize:11,color:hColor,fontWeight:500,marginTop:2,display:"flex",alignItems:"center",gap:4}}><TFIcon name="flame" size={11} color={hColor}/> {hStreak} días</div>}
                              </div>
                              <div style={{color:hColor}}><TFIcon name={hIcon} size={18} color={hColor}/></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Racha + progreso semanal compacto */}
                    <div style={{height:10}}/>
                    {(()=>{
                      const totalSem=Object.values(completadasSem).reduce((a,v)=>a+v,0);
                      const maxPosible=habitos.length*7;
                      const pctSem=maxPosible>0?Math.round((totalSem/maxPosible)*100):0;
                      // Calcular racha de días consecutivos
                      let racha=0;const hoyD=new Date();
                      for(let i=0;i<30;i++){const d=new Date(hoyD);d.setDate(hoyD.getDate()-i);const f=d.toLocaleDateString("en-CA");const tieneAlgo=habitosDiarios.some(h=>h.fecha===f);if(tieneAlgo)racha++;else if(i>0)break;}
                      return(
                        <div style={{display:"flex",gap:10}}>
                          {/* Racha */}
                          <div style={{flex:1,background:racha>=3?T.sage+"14":T.card,borderRadius:14,padding:"14px",border:`1px solid ${racha>=3?T.sage+"33":T.border}`,display:"flex",alignItems:"center",gap:12}}>
                            <div style={{width:36,height:36,borderRadius:10,background:racha>=7?T.clay+"22":racha>=3?T.sage+"22":T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><TFIcon name={racha>=7?"flame":racha>=3?"sparkles":"target"} size={20} color={racha>=7?T.clay:racha>=3?T.sage:T.textSub}/></div>
                            <div>
                              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:700,letterSpacing:"-0.03em",color:racha>=3?T.sage:T.charcoal,lineHeight:1}}>{racha}</div>
                              <div style={{fontSize:11,color:T.textSub,marginTop:2}}>{racha===1?"día de racha":"días de racha"}</div>
                            </div>
                          </div>
                          {/* Semana */}
                          <div style={{flex:1,background:T.card,borderRadius:14,padding:"14px",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12}}>
                            <div style={{position:"relative",width:44,height:44,flexShrink:0}}>
                              <svg width={44} height={44} style={{transform:"rotate(-90deg)"}}>
                                <circle cx={22} cy={22} r={18} fill="none" stroke={T.border} strokeWidth={4}/>
                                <circle cx={22} cy={22} r={18} fill="none" stroke={T.sage} strokeWidth={4} strokeDasharray={113} strokeDashoffset={113*(1-pctSem/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset .8s ease"}}/>
                              </svg>
                              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.sage}}>{pctSem}%</div>
                            </div>
                            <div>
                              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:600,color:T.charcoal,lineHeight:1}}>{totalSem}<span style={{fontSize:12,color:T.textSub,fontWeight:400}}>/{maxPosible}</span></div>
                              <div style={{fontSize:11,color:diff>0?T.sage:diff<0?T.clay:T.textSub,marginTop:2,fontWeight:500}}>{diff>0?"↑ +"+diff:diff<0?"↓ "+diff:"= 0"} vs ant.</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}

              {/* AI Insight card — matches TFInicioA design */}
              <div style={{padding:"0 22px 22px"}}>
                <div style={{background:T.violet+"10",border:`1px solid ${T.violet}33`,borderRadius:18,padding:16}}>
                  <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:32,height:32,borderRadius:99,background:T.violet+"22",color:T.violet,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <TFIcon name="sparkles" size={18} color={T.violet}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,color:T.violet,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>Insight de TriFlow</div>
                      <div style={{fontSize:14,color:T.charcoal,lineHeight:1.45}}>
                        {(()=>{
                          const insights2=["Llevas 3 días sin meditar. Tu sueño bajó un 12%. ¿Probamos 5 min antes de dormir?","Tu consumo de agua ha mejorado esta semana. ¡Sigue así!","Basado en tu despensa, puedo sugerirte un menú rico en proteínas para hoy.","Has completado el 80% de tus hábitos esta semana. ¡Estás en racha!","Tu progreso de peso va bien encaminado. A este ritmo, alcanzarás tu meta."];
                          const dayOfYear2=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/(864e5));
                          return insights2[dayOfYear2%insights2.length];
                        })()}
                      </div>
                      <div style={{marginTop:10,display:"flex",gap:8}}>
                        <button onClick={()=>setTab("asistente")} style={{padding:"8px 14px",borderRadius:99,background:T.sage+"1F",color:T.sage,border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Ver más</button>
                        <button style={{padding:"8px 14px",borderRadius:99,background:"transparent",color:T.sage,border:"none",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Ahora no</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
                {/* Historial de peso */}
                {(()=>{
                  const pa=parseFloat(profile?.peso_actual||0),pm=parseFloat(profile?.peso_meta||0);
                  const diff=pa-pm;
                  const bajando=pa>=pm;
                  const ultimos=historialPeso.slice(-14);
                  const tendencia=ultimos.length>=2?parseFloat(ultimos[ultimos.length-1].peso)-parseFloat(ultimos[0].peso):0;
                  const semanas=ultimos.length>=2?Math.max(1,(new Date(ultimos[ultimos.length-1].created_at)-new Date(ultimos[0].created_at))/(7*24*3600*1000)):1;
                  const velSemanal=tendencia/semanas;
                  const semanasAlObjetivo=velSemanal!==0&&Math.sign(velSemanal)===Math.sign(pm-pa)&&Math.abs(diff/velSemanal)<=52?Math.abs(diff/velSemanal):null;
                  const pesoInicial=historialPeso.length>0?parseFloat(historialPeso[0].peso):pa;
                  const totalRange=Math.abs(pesoInicial-pm);
                  const recorrido=Math.abs(pa-pesoInicial);
                  const progPct=totalRange>0?Math.max(5,Math.min(100,(recorrido/totalRange)*100)):5;
                  // Filtered data for chart
                  const now=new Date();
                  const filteredData=pesoRango==="all"?historialPeso:historialPeso.filter(d=>{const dd=new Date(d.created_at||d.fecha);const diff2=now-dd;return pesoRango==="7d"?diff2<=7*864e5:pesoRango==="30d"?diff2<=30*864e5:diff2<=90*864e5;});
                  // Weekly averages
                  const weekAvgs=(()=>{if(historialPeso.length<2)return[];const weeks={};historialPeso.forEach(d=>{const dt=new Date(d.created_at||d.fecha);const wk=`${dt.getFullYear()}-W${Math.ceil(((dt-new Date(dt.getFullYear(),0,1))/864e5+1)/7)}`;if(!weeks[wk])weeks[wk]={sum:0,n:0,date:d.fecha||d.created_at?.split("T")[0]};weeks[wk].sum+=parseFloat(d.peso);weeks[wk].n++;});return Object.values(weeks).map(w=>({peso:(w.sum/w.n).toFixed(1),fecha:w.date}));})();
                  // Min/max/total change
                  const allPesos=historialPeso.map(d=>parseFloat(d.peso)).filter(v=>!isNaN(v));
                  const pesoMin=allPesos.length?Math.min(...allPesos):0;
                  const pesoMax=allPesos.length?Math.max(...allPesos):0;
                  const cambioTotal=allPesos.length>=2?allPesos[allPesos.length-1]-allPesos[0]:0;
                  return(
                    <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,transition:"all .4s"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div>
                          <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>PESO ACTUAL</div>
                          <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:32,fontWeight:600,letterSpacing:"-0.035em",color:T.charcoal,lineHeight:1}}>{pa.toFixed(1)}</div>
                            <div style={{fontSize:14,color:T.textSub}}>kg</div>
                            {ultimos.length>=2&&(<div style={{fontSize:12,fontWeight:600,color:tendencia<0?T.sage:tendencia>0?T.clay:T.textSub,marginLeft:4}}>{tendencia<0?"↓":"↑"}{Math.abs(tendencia).toFixed(1)} kg</div>)}
                          </div>
                          <div style={{fontSize:11,color:T.textSub,marginTop:1}}>meta {pm} kg · faltan {Math.abs(diff).toFixed(1)} kg</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                          {!showPesoDetalle&&<WeightSparkline data={ultimos} color={bajando?T.sage:T.sky} width={90} height={36}/>}
                          <div style={{display:"flex",gap:6}}>
                            {!showPesoInput&&(
                              <button onClick={()=>{setShowPesoInput(true);setNuevoPesoVal(pa.toFixed(1));}} style={{padding:"4px 10px",borderRadius:99,border:`1.5px solid ${T.sage}`,background:"transparent",fontSize:11,color:T.sageD,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>+ Registrar</button>
                            )}
                            <button onClick={()=>setShowPesoDetalle(!showPesoDetalle)} style={{padding:"4px 10px",borderRadius:99,border:`1.5px solid ${T.border}`,background:showPesoDetalle?T.sage+"18":"transparent",fontSize:11,color:showPesoDetalle?T.sage:T.textMid,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{showPesoDetalle?"Cerrar":"Ver gráfico"}</button>
                          </div>
                        </div>
                      </div>
                      {showPesoInput&&(
                        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                          <input type="number" step="0.1" value={nuevoPesoVal} onChange={e=>setNuevoPesoVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&registrarPeso()} placeholder="kg" style={{flex:1,padding:"8px 12px",borderRadius:12,border:`1.5px solid ${T.sage}`,background:T.surface,fontSize:14,color:T.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif"}} autoFocus/>
                          <button onClick={registrarPeso} style={{padding:"8px 16px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>Guardar</button>
                          <button onClick={()=>setShowPesoInput(false)} style={{padding:"8px",borderRadius:99,background:T.border,border:"none",color:T.textMid,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>✕</button>
                        </div>
                      )}
                      {/* Progress bar */}
                      <div style={{background:T.border,borderRadius:99,height:5,overflow:"hidden",marginBottom:4}}>
                        <div style={{width:progPct+"%",height:"100%",background:`linear-gradient(90deg,${T.sage},${T.sageL})`,borderRadius:99,transition:"width .8s ease"}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:showPesoDetalle?12:0}}>
                        <div style={{fontSize:11,color:T.textSub}}>{historialPeso.length} registros</div>
                        {semanasAlObjetivo&&<div style={{fontSize:11,color:T.textSub}}>~{Math.ceil(semanasAlObjetivo)} sem al objetivo</div>}
                        {velSemanal!==0&&ultimos.length>=2&&<div style={{fontSize:11,color:T.textSub}}>{velSemanal<0?"":"+"}{velSemanal.toFixed(2)} kg/sem</div>}
                      </div>
                      {/* ── Expanded chart view ── */}
                      {showPesoDetalle&&(
                        <div className="fade-in">
                          {/* Range selector */}
                          <div style={{display:"flex",gap:6,marginBottom:12}}>
                            {[["7d","7 días"],["30d","30 días"],["90d","90 días"],["all","Todo"]].map(([v,l])=>(
                              <button key={v} onClick={()=>setPesoRango(v)} style={{flex:1,padding:"6px 0",borderRadius:99,fontSize:11,fontWeight:pesoRango===v?600:400,border:`1.5px solid ${pesoRango===v?T.sage:T.border}`,background:pesoRango===v?T.sage+"18":"transparent",color:pesoRango===v?T.sage:T.textMid,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s"}}>{l}</button>
                            ))}
                          </div>
                          {/* SVG Chart */}
                          {filteredData.length>=2?(
                            <div style={{width:"100%",overflowX:"auto",marginBottom:12}}>
                              <WeightChart data={filteredData} meta={pm} T={T} width={Math.max(320,filteredData.length*24)} height={180}/>
                            </div>
                          ):(
                            <div style={{textAlign:"center",padding:"20px 0",color:T.textSub,fontSize:13}}>No hay suficientes datos en este rango</div>
                          )}
                          {/* Stats grid */}
                          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                            {[["CAMBIO",`${cambioTotal>=0?"+":""}${cambioTotal.toFixed(1)} kg`,cambioTotal<0?T.sage:T.clay],["MÍNIMO",`${pesoMin.toFixed(1)} kg`,T.sky],["MÁXIMO",`${pesoMax.toFixed(1)} kg`,T.sand]].map(([k,v,c])=>(
                              <div key={k} style={{background:T.bg,borderRadius:12,padding:"10px 8px",textAlign:"center",transition:"background .4s"}}>
                                <div style={{fontSize:10,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>{k}</div>
                                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:600,letterSpacing:"-0.02em",color:c}}>{v}</div>
                              </div>
                            ))}
                          </div>
                          {/* Legend */}
                          <div style={{display:"flex",gap:14,justifyContent:"center",fontSize:10,color:T.textSub}}>
                            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:2,background:T.sage,borderRadius:2}}/> Peso</div>
                            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:2,background:T.sage,borderRadius:2,opacity:.4,borderTop:"1px dashed "+T.sage}}/> Meta</div>
                            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:2,background:T.violet,borderRadius:2,opacity:.5}}/> Tendencia</div>
                          </div>
                          {/* Weekly averages */}
                          {weekAvgs.length>1&&(
                            <div style={{marginTop:12}}>
                              <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:8}}>PROMEDIO SEMANAL</div>
                              <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
                                {weekAvgs.slice(-8).map((w,i)=>(
                                  <div key={i} style={{minWidth:56,background:T.bg,borderRadius:10,padding:"8px 6px",textAlign:"center",flexShrink:0}}>
                                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600,color:T.charcoal}}>{w.peso}</div>
                                    <div style={{fontSize:9,color:T.textSub,marginTop:2,fontFamily:"'JetBrains Mono',monospace"}}>{w.fecha?.split("-").slice(1).reverse().join("/")}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* REPORTE SEMANAL */}
              {(()=>{
                const hoy=new Date();
                const domActual=hoy.getDay();
                const lunesSemana=new Date(hoy);
                lunesSemana.setDate(hoy.getDate()-(domActual===0?6:domActual-1));
                const domingoSemana=new Date(lunesSemana);
                domingoSemana.setDate(lunesSemana.getDate()+6);
                const fechaLunes=lunesSemana.toLocaleDateString("es-CL",{day:"numeric",month:"short"});
                const fechaDomingo=domingoSemana.toLocaleDateString("es-CL",{day:"numeric",month:"short"});
                // Sessions this week
                const sesionesSem=sesiones.filter(s=>s.completada).length;
                const totalSesiones=sesiones.length||1;
                const sesionesAdhering=sesionesSem/totalSesiones;
                // Menu adherence (days with menu in this week)
                const diasConMenu=DIAS.filter(d=>menu.some(m=>m.dia===d)).length;
                const menuAdherence=diasConMenu/7;
                // Water this week (assuming agua is today's, estimate weekly)
                const waterWeekly=agua*7/8;
                // Habits completed this week
                const habitosSemana=habitosDiarios.filter(hd=>{
                  const fecha=new Date(hd.fecha);
                  return fecha>=lunesSemana&&fecha<=domingoSemana;
                }).length;
                const totalHabitosWeek=habitos.length*7;
                const habitosAdherence=totalHabitosWeek>0?habitosSemana/totalHabitosWeek:0;
                // Weight change this week
                const pesoAhora=parseFloat(profile?.peso_actual||0);
                const pesoInicio=historialPeso.find(p=>{
                  const d=new Date(p.created_at||p.fecha);
                  return d>=lunesSemana&&d<=domingoSemana;
                })||historialPeso[0];
                const pesoChange=(pesoAhora-parseFloat(pesoInicio?.peso||pesoAhora)).toFixed(1);
                // Overall adherence calculation
                const adherenciaGeneral=Math.round(((sesionesAdhering*0.3)+(menuAdherence*0.3)+(habitosAdherence*0.2)+(Math.min(agua/8,1)*0.2))*100);
                return(
                  <div style={{background:T.surface,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                      <div>
                        <div style={{fontSize:11,color:T.sage,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>RESUMEN SEMANAL</div>
                        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal}}>Tu semana en números</div>
                        <div style={{fontSize:11,color:T.textSub,marginTop:2}}>{fechaLunes} a {fechaDomingo}</div>
                      </div>
                      <button onClick={()=>setShowReporteS(!showReporteS)} style={{padding:"8px 14px",borderRadius:99,border:`1.5px solid ${T.border}`,background:showReporteS?T.sage+"18":"transparent",color:showReporteS?T.sage:T.textMid,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"all .2s"}}>{showReporteS?"Cerrar":"Ver detalle"}</button>
                    </div>
                    {/* Metrics grid */}
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:10}}>
                      {[
                        {label:"Sesiones",value:sesionesSem,total:`/${totalSesiones}`,icon:"dumbbell",color:T.sage},
                        {label:"Agua",value:Math.round(waterWeekly),total:"/56 vasos",icon:"water",color:T.sky},
                        {label:"Menús",value:diasConMenu,total:"/7 días",icon:"leaf",color:T.sand},
                        {label:"Hábitos",value:habitosSemana,total:`/${totalHabitosWeek}`,icon:"sparkles",color:T.violet},
                      ].map((m,i)=>(
                        <div key={i} style={{background:T.card,borderRadius:12,padding:"11px 12px",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:32,height:32,borderRadius:8,background:m.color+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><TFIcon name={m.icon} size={17} color={m.color}/></div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:10,color:T.textSub,letterSpacing:"0.03em",fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>{m.label}</div>
                            <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:600,color:m.color}}>{m.value}</div>
                              <div style={{fontSize:10,color:T.textSub}}>{m.total}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Weight change badge */}
                    <div style={{background:pesoChange<0?T.sage+"18":T.clay+"18",borderRadius:12,padding:"11px 12px",border:`1px solid ${pesoChange<0?T.sage+"44":T.clay+"44"}`,display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <div style={{width:32,height:32,borderRadius:8,background:(pesoChange<0?T.sage:T.clay)+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><TFIcon name="weight" size={17} color={pesoChange<0?T.sage:T.clay}/></div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,color:T.textSub,letterSpacing:"0.03em",fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>PESO</div>
                        <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:600,color:pesoChange<0?T.sage:T.clay}}>{pesoChange<0?"−":"+"}  {Math.abs(pesoChange)} kg</div>
                          <div style={{fontSize:10,color:T.textSub}}>esta semana</div>
                        </div>
                      </div>
                    </div>
                    {/* Adherence bar */}
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,color:T.textSub,letterSpacing:"0.03em",fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>ADHERENCIA GENERAL</div>
                        <div style={{background:T.border,borderRadius:99,height:6,overflow:"hidden"}}>
                          <div style={{width:adherenciaGeneral+"%",height:"100%",background:`linear-gradient(90deg,${T.sage},${T.sageL})`,borderRadius:99,transition:"width .6s ease"}}/>
                        </div>
                      </div>
                      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:600,color:T.sage,minWidth:40,textAlign:"right"}}>{adherenciaGeneral}%</div>
                    </div>
                    {/* Expanded view */}
                    {showReporteS&&(
                      <div className="fade-in" style={{background:T.bg,borderRadius:12,padding:"12px",marginTop:12,display:"flex",flexDirection:"column",gap:10}}>
                        <div>
                          <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>DESGLOSE DETALLADO</div>
                          <div style={{display:"flex",flexDirection:"column",gap:6}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                              <div style={{fontSize:13,color:T.charcoal}}>Sesiones entrenamiento</div>
                              <div style={{fontSize:13,fontWeight:600,color:T.sage}}>{sesionesSem}/{totalSesiones} ({Math.round(sesionesAdhering*100)}%)</div>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                              <div style={{fontSize:13,color:T.charcoal}}>Menús planeados</div>
                              <div style={{fontSize:13,fontWeight:600,color:T.sand}}>{diasConMenu}/7 ({Math.round(menuAdherence*100)}%)</div>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                              <div style={{fontSize:13,color:T.charcoal}}>Vasos de agua</div>
                              <div style={{fontSize:13,fontWeight:600,color:T.sky}}>{Math.round(waterWeekly)}/56</div>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}>
                              <div style={{fontSize:13,color:T.charcoal}}>Hábitos completados</div>
                              <div style={{fontSize:13,fontWeight:600,color:T.violet}}>{habitosSemana}/{totalHabitosWeek}</div>
                            </div>
                          </div>
                        </div>
                        {adherenciaGeneral>=80&&(
                          <div style={{background:T.sage+"22",borderRadius:10,padding:"10px 12px",border:`1px solid ${T.sage}44`}}>
                            <div style={{fontSize:12,color:T.sage,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><TFIcon name="sparkles" size={14} color={T.sage}/>¡Excelente semana!</div>
                            <div style={{fontSize:11,color:T.sageD,marginTop:2}}>Tu consistencia está en el camino correcto. Mantén el ritmo.</div>
                          </div>
                        )}
                        {adherenciaGeneral>=50&&adherenciaGeneral<80&&(
                          <div style={{background:T.sand+"22",borderRadius:10,padding:"10px 12px",border:`1px solid ${T.sand}44`}}>
                            <div style={{fontSize:12,color:T.sand,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><TFIcon name="dumbbell" size={14} color={T.sand}/>Buen desempeño</div>
                            <div style={{fontSize:11,color:T.sand,marginTop:2}}>Puedes mejorar un poco más. Enfócate en lo que se te hace difícil.</div>
                          </div>
                        )}
                        {adherenciaGeneral<50&&(
                          <div style={{background:T.clay+"22",borderRadius:10,padding:"10px 12px",border:`1px solid ${T.clay}44`}}>
                            <div style={{fontSize:12,color:T.clay,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><TFIcon name="target" size={14} color={T.clay}/>Oportunidad de mejora</div>
                            <div style={{fontSize:11,color:T.clay,marginTop:2}}>Pequeños pasos consistentes te llevarán a donde quieres estar.</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Agua hoy */}
                <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,transition:"all .4s",display:"flex",alignItems:"center",gap:16}}>
                  <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <ProgressRing value={agua} max={8} size={64} stroke={6} color={T.sky}/>
                    <div style={{position:"absolute",fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:600,letterSpacing:"-0.02em",color:T.sky}}>{agua}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>AGUA HOY</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {Array.from({length:8}).map((_,i)=>(
                        <button key={i} onClick={()=>updateAgua(Math.min(8,i+1))} style={{width:18,height:18,borderRadius:99,background:i<agua?T.sky:T.border,border:"none",cursor:"pointer",transition:"background .2s",padding:0}}/>
                      ))}
                    </div>
                    <div style={{fontSize:11,color:T.textSub,marginTop:5}}>{agua}/8 vasos · {agua>=8?"¡Meta cumplida!":agua>=5?"Casi llegamos":"Sigue hidratándote"}</div>
                  </div>
                </div>

                {/* Menú hoy */}
                {menuHoy?(()=>{
                  const hoyFecha=localDate();
                  const comidasHoyKeys=["desayuno","almuerzo","snack","cena"].filter(k=>menuHoy[k]);
                  const comidasHoyDone=comidasHoyKeys.filter(k=>{const t=menuTracking.find(tr=>tr.fecha===hoyFecha&&tr.comida===k);return t?.completada;}).length;
                  return(
                  <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,transition:"all .4s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace"}}>MENÚ DE HOY</div>
                        {comidasHoyKeys.length>0&&<span style={{fontSize:11,color:comidasHoyDone===comidasHoyKeys.length?T.sage:T.textSub,fontWeight:600}}>{comidasHoyDone}/{comidasHoyKeys.length}</span>}
                      </div>
                      <button onClick={()=>setTab("habito")} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:T.sage,fontFamily:"'DM Sans',sans-serif"}}>Ver todo →</button>
                    </div>
                    {[["sun",menuHoy.desayuno,"desayuno"],["leaf",menuHoy.almuerzo,"almuerzo"],["apple",menuHoy.snack,"snack"],["moon",menuHoy.cena,"cena"]].filter(([,v])=>v).map(([iconName,texto,comidaKey],i,arr)=>{
                      const done=menuTracking.find(tr=>tr.fecha===hoyFecha&&tr.comida===comidaKey)?.completada;
                      return(
                      <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"7px 0",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",opacity:done?.6:1}}>
                        <div style={{width:28,height:28,borderRadius:7,background:T.sage+"14",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><TFIcon name={iconName} size={15} color={T.sage}/></div>
                        <div style={{fontSize:14,color:done?T.textMid:T.charcoal,flex:1,lineHeight:1.35,textDecoration:done?"line-through":"none"}}>{texto}</div>
                        {done&&<TFIcon name="check" size={14} color={T.sage}/>}
                      </div>
                    );})}
                  </div>
                );})():(
                  <div style={{background:T.sage+"14",borderRadius:16,padding:"16px 18px",border:`1px solid ${T.sage}22`,textAlign:"center"}}>
                    <div style={{fontSize:14,color:T.sageD,marginBottom:8}}>No hay menú generado aún</div>
                    <button onClick={()=>setTab("habito")} style={{padding:"8px 18px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6,margin:"0 auto"}}><TFIcon name="sparkles" size={14} color="#fff"/>Generar menú</button>
                  </div>
                )}

                {/* Alerta despensa */}
                {stockCritico.length>0&&(
                  <div style={{background:dark?T.clay+"18":`linear-gradient(135deg,${T.sand}18,${T.clay}10)`,borderRadius:16,padding:"16px",border:`1px solid ${T.clay}33`,transition:"all .4s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{fontSize:11,color:T.sand,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",fontWeight:600,display:"flex",alignItems:"center",gap:5}}><TFIcon name="bell" size={13} color={T.sand}/>DESPENSA</div>
                      <button onClick={()=>{setTab("despensa");setDespensaTab("compras");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.clay,fontFamily:"'DM Sans',sans-serif"}}>Ver lista →</button>
                    </div>
                    <div style={{fontSize:14,color:T.charcoal,marginBottom:8}}>Faltan <strong>{stockCritico.length} productos</strong> para tu menú.</div>
                    <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{stockCritico.slice(0,3).map(p=><Chip key={p.id} color={T.clay} T={T}>{p.nombre}</Chip>)}</div>
                  </div>
                )}

                {/* Motivación */}
                <div style={{background:dark?T.sage+"18":`linear-gradient(135deg,${T.sage}20,${T.sage}08)`,borderRadius:16,padding:"16px 18px",border:`1px solid ${T.sage}33`,transition:"all .4s"}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontStyle:"italic",color:T.sageD,marginBottom:6}}>"La constancia es el hábito más valioso."</div>
                  <div style={{fontSize:14,color:T.textMid,lineHeight:1.65,marginBottom:10}}>
                    <strong style={{color:T.charcoal}}>{sesiones.filter(s=>s.completada).length}/{sesiones.length}</strong> sesiones completadas · <strong style={{color:T.charcoal}}><TFIcon name="water" size={13} color={T.sky} style={{verticalAlign:"text-bottom"}}/> {agua}/8</strong> vasos hoy
                  </div>
                  <button onClick={()=>setTab("asistente")} style={{background:"none",border:`1.5px solid ${T.sage}`,borderRadius:99,padding:"8px 16px",cursor:"pointer",fontSize:14,color:T.sageD,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>Hablar con mi asistente →</button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ EL HÁBITO ═══ */}
          {tab==="habito"&&(
            <div style={{paddingBottom:16}}>
              {/* Header — matches TFHabito design */}
              <div style={{padding:"8px 22px 14px",background:T.bg,flexShrink:0}}>
                <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.12em",color:T.sage,marginBottom:6}}>
                  Semana {Math.ceil((new Date().getDate())/7)}
                </div>
                <div style={{fontFamily:FONTS.display,fontSize:28,fontWeight:600,color:T.charcoal,letterSpacing:"-0.03em",lineHeight:1.05}}>Hábito</div>
              </div>
              {/* Week strip calendar */}
              <div style={{padding:"0 22px 18px"}}>
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:14}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    {["L","M","X","J","V","S","D"].map((d,i)=>{
                      const isToday=i===hoyIdx;
                      const dayNum=(()=>{const hoy=new Date();const diff=i-hoyIdx;const dt=new Date(hoy);dt.setDate(hoy.getDate()+diff);return dt.getDate();})();
                      const hasDone=i<=hoyIdx;// simplification
                      return(
                        <div key={d} onClick={()=>setDiaMenu(i)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}}>
                          <span style={{fontSize:11,color:T.textSub,fontFamily:FONTS.mono}}>{d}</span>
                          <div style={{width:32,height:32,borderRadius:10,background:i<hoyIdx&&hasDone?T.sage:i===hoyIdx?T.sage+"44":"transparent",border:`1.5px solid ${isToday?T.charcoal:i<hoyIdx?'transparent':T.border}`,color:i<hoyIdx?"#fff":T.charcoal,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,fontFamily:FONTS.display}}>{dayNum}</div>
                          <div style={{width:4,height:4,borderRadius:99,background:i<hoyIdx?T.sage:i===hoyIdx?T.sand:T.border}}/>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Day selector pills for menu */}
              {menu.length>0&&(
                <div style={{padding:"0 22px 14px",display:"flex",gap:5,overflowX:"auto"}}>
                  {DIAS.map((d,i)=>{
                    const tieneMenu=menu.some(m=>m.dia===d);
                    return(<button key={i} onClick={()=>setDiaMenu(i)} style={{padding:"7px 11px",borderRadius:99,fontSize:12,fontWeight:500,whiteSpace:"nowrap",background:diaMenu===i?T.sage:"transparent",color:diaMenu===i?"#fff":tieneMenu?T.textMid:T.muted,border:diaMenu===i?"none":`1px solid ${T.border}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s",flexShrink:0}}>
                      {d.slice(0,3)}{i===hoyIdx?" ·":""}
                    </button>);
                  })}
                  {menu.length>0&&<button onClick={generarMenu} disabled={menuLoading} style={{padding:"7px 11px",borderRadius:99,background:"transparent",border:`1px solid ${T.border}`,color:T.sage,fontSize:12,fontWeight:500,cursor:menuLoading?"default":"pointer",fontFamily:"'DM Sans',sans-serif",display:"inline-flex",alignItems:"center",gap:4,whiteSpace:"nowrap",flexShrink:0}}><TFIcon name="refresh" size={12} color={T.sage}/> {menuLoading?"...":"Regenerar"}</button>}
                </div>
              )}
              <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:11}} className="fade-in">
                {menuError&&<div style={{background:T.clay+"22",border:`1px solid ${T.clay}`,borderRadius:12,padding:"12px",fontSize:12,color:T.clay}}>{menuError}</div>}
                {menu.length===0?(
                  <div style={{background:T.card,borderRadius:16,padding:"32px 24px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                    <div style={{fontSize:32,marginBottom:14}}>🥗</div>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,letterSpacing:"-0.02em",color:T.charcoal,marginBottom:8}}>Sin menú aún</div>
                    <div style={{fontSize:14,color:T.textMid,marginBottom:18,lineHeight:1.6}}>Genera tu menú personalizado según tu objetivo, restricciones y despensa.</div>
                    <button onClick={generarMenu} disabled={menuLoading} style={{padding:"12px 24px",borderRadius:99,background:menuLoading?T.muted:T.sage,border:"none",color:"#fff",fontSize:14,cursor:menuLoading?"default":"pointer",fontFamily:"'DM Sans',sans-serif"}}>{menuLoading?"Generando menú...":"Generar menú semanal ✦"}</button>
                  </div>
                ):(()=>{
                  const md=menu.find(m=>m.dia===DIAS[diaMenu])||null;
                  const hoyDate=new Date();const diffDia=diaMenu-hoyIdx;const fechaDia=(()=>{const d=new Date(hoyDate);d.setDate(hoyDate.getDate()+diffDia);return d.toLocaleDateString("en-CA");})();
                  const comidasCompletadas=[["🌅","DESAYUNO","desayuno"],["☀️","ALMUERZO","almuerzo"],["🍎","ONCE","snack"],["🌙","CENA","cena"]].filter(([,,key])=>md?.[key]).filter(([,,key])=>{const t=menuTracking.find(tr=>tr.fecha===fechaDia&&tr.comida===key);return t?.completada;}).length;
                  const comidasTotal=[["🌅","DESAYUNO","desayuno"],["☀️","ALMUERZO","almuerzo"],["🍎","ONCE","snack"],["🌙","CENA","cena"]].filter(([,,key])=>md?.[key]).length;
                  return md?(<>
                    {comidasTotal>0&&(
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:comidasCompletadas===comidasTotal&&comidasTotal>0?T.sage+"18":T.card,borderRadius:12,border:`1px solid ${comidasCompletadas===comidasTotal&&comidasTotal>0?T.sage+"44":T.border}`,marginBottom:2}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:12}}>{comidasCompletadas===comidasTotal?"✅":"🍽️"}</span>
                          <span style={{fontSize:12,color:comidasCompletadas===comidasTotal?T.sage:T.textMid,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
                            {comidasCompletadas===comidasTotal&&comidasTotal>0?"¡Día completado!":` ${comidasCompletadas} de ${comidasTotal} comidas`}
                          </span>
                        </div>
                        <div style={{display:"flex",gap:4}}>
                          {Array.from({length:comidasTotal},(_,i)=>(
                            <div key={i} style={{width:8,height:8,borderRadius:99,background:i<comidasCompletadas?T.sage:T.border,transition:"all .3s"}}/>
                          ))}
                        </div>
                      </div>
                    )}
                    {[["leaf","DESAYUNO","desayuno","sage"],["flame","ALMUERZO","almuerzo","sand"],["apple","ONCE","snack","clay"],["moon","CENA","cena","sky"]].map(([icon,label,key,c])=>{
                      if(!md[key])return null;
                      const tracking=menuTracking.find(t=>t.fecha===fechaDia&&t.comida===key);
                      const completada=tracking?.completada||false;
                      const comentario=tracking?.comentario||"";
                      const commentKey=`${fechaDia}-${key}`;
                      const isCommentOpen=comentarioAbierto===commentKey;
                      return(
                      <div key={key} style={{background:T.card,borderRadius:18,padding:14,border:`1px solid ${T.border}`,marginBottom:10,transition:"all .4s"}}>
                        <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                          <div style={{width:44,height:44,borderRadius:12,background:T[c]+"22",color:T[c],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                            <TFIcon name={icon} size={20} color={T[c]}/>
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                              <span style={{fontSize:11,color:T[c],fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</span>
                              {completada&&<span style={{fontSize:10,color:T.sage,fontWeight:600}}>✓ Listo</span>}
                            </div>
                            <div style={{fontSize:14,fontWeight:500,color:T.charcoal,marginTop:4,lineHeight:1.3,textDecoration:completada?"line-through":"none",opacity:completada?0.6:1}}>{md[key]}</div>
                          </div>
                          <button onClick={()=>toggleComidaCompleta(fechaDia,key)} style={{width:24,height:24,borderRadius:6,background:completada?T.sage:"transparent",border:`1.5px solid ${completada?T.sage:T.border2}`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",transition:"all .25s"}}>
                            {completada&&<TFIcon name="check" size={14} color="#fff"/>}
                          </button>
                        </div>
                        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,color:completada?T.textMid:T.charcoal,lineHeight:1.4,textDecoration:completada?"line-through":"none",opacity:completada?.7:1,transition:"all .3s"}}>{md[key]}</div>
                        {comentario&&!isCommentOpen&&(
                          <div onClick={()=>{setComentarioAbierto(commentKey);setComentarioTemp(comentario);}} style={{marginTop:10,padding:"8px 12px",background:T.sand+"14",borderRadius:10,border:`1px solid ${T.sand}33`,cursor:"pointer"}}>
                            <div style={{fontSize:10,color:T.sand,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.04em",marginBottom:3}}>📝 NOTA</div>
                            <div style={{fontSize:13,color:T.textMid,lineHeight:1.4}}>{comentario}</div>
                          </div>
                        )}
                        {isCommentOpen?(
                          <div style={{marginTop:10}}>
                            <textarea value={comentarioTemp} onChange={e=>setComentarioTemp(e.target.value)} placeholder="Ej: Cambié el pollo por atún porque no tenía..." rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${T.sage}44`,background:T.surface,fontSize:13,color:T.charcoal,fontFamily:"'DM Sans',sans-serif",resize:"vertical",outline:"none",lineHeight:1.4}}/>
                            <div style={{display:"flex",gap:8,marginTop:8}}>
                              <button onClick={()=>guardarComentarioComida(fechaDia,key,comentarioTemp)} style={{flex:1,padding:"8px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Guardar nota</button>
                              <button onClick={()=>{setComentarioAbierto(null);setComentarioTemp("");}} style={{padding:"8px 14px",borderRadius:99,background:T.border,border:"none",color:T.textMid,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Cancelar</button>
                            </div>
                          </div>
                        ):(
                          <button onClick={()=>{setComentarioAbierto(commentKey);setComentarioTemp(comentario);}} style={{marginTop:10,background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,padding:0}}>
                            <span style={{fontSize:12,color:T.textSub}}>{comentario?"✏️ Editar nota":"💬 Agregar nota"}</span>
                          </button>
                        )}
                      </div>
                    );})}
                  </>):null;
                })()}
                {listaCompraCompleta.length>0&&(
                  <div style={{background:T.sand+"14",border:`1px solid ${T.sand}44`,borderRadius:16,padding:"16px",marginTop:4}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <div style={{fontSize:14,fontWeight:600,color:T.sand}}>🛒 Productos faltantes</div>
                      <button onClick={()=>{setTab("despensa");setDespensaTab("compras");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:T.sage,fontFamily:"'DM Sans',sans-serif"}}>Ver todo →</button>
                    </div>
                    <div style={{fontSize:11,color:T.textSub,marginBottom:10}}>Para tu menú y despensa</div>
                    {listaCompraCompleta.slice(0,4).map((item,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:i>0?`1px solid ${T.border}`:"none",gap:10}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>{item.nombre} <span style={{color:T.textSub,fontWeight:400}}>· {item.cantidad} {item.unidad}</span></div>
                          {item.motivo&&<div style={{fontSize:11,color:item.stockId?T.clay:T.textSub,marginTop:2}}>{item.motivo}</div>}
                        </div>
                        {item.stockId?(
                          <button onClick={()=>{setTab("despensa");setDespensaTab("stock");setTimeout(()=>{setReponerItem(item.stockId);setReponerCant("");},100);}} style={{padding:"6px 12px",borderRadius:99,background:T.clay,border:"none",color:"#fff",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>↻ Reponer</button>
                        ):(
                          <button onClick={()=>agregarSugerencia(item,i)} style={{padding:"6px 12px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>+ Agregar</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ LA DESPENSA ═══ */}
          {tab==="despensa"&&(
            <div style={{paddingBottom:16}}>
              {/* Header — matches TFDespensa design */}
              <div style={{padding:"8px 22px 14px",background:T.bg,flexShrink:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                  <div style={{fontFamily:FONTS.display,fontSize:28,fontWeight:600,color:T.charcoal,letterSpacing:"-0.03em",lineHeight:1.05}}>Despensa</div>
                  <button onClick={()=>{setDespensaTab("scan");}} style={{width:38,height:38,borderRadius:99,background:T.sage,color:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><TFIcon name="scan" size={18} color="#fff"/></button>
                </div>
              </div>
              {/* Pill sub-tabs — matches design */}
              <div style={{padding:"0 22px 14px",display:"flex",gap:6}}>
                {[["stock","En stock",String(stock.length)],["compras","Lista",String(listaCompraCompleta.length)],["scan","Escanear",""]].map(([id,l,c])=>{
                  const a=despensaTab===id;
                  return(
                    <div key={id} onClick={()=>setDespensaTab(id)} style={{padding:"8px 14px",borderRadius:99,background:a?T.charcoal:T.surface,color:a?T.bg:T.textMid,border:`1px solid ${a?T.charcoal:T.border}`,fontSize:13,fontWeight:500,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
                      {l}{c&&<span style={{fontSize:11,opacity:0.6}}>{c}</span>}
                    </div>
                  );
                })}
              </div>

              {despensaTab==="stock"&&(
                <div style={{padding:"0 22px 22px"}} className="fade-in">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase"}}>Productos · {stock.length}</div>
                    <button onClick={()=>setMostrarForm(!mostrarForm)} style={{padding:"6px 14px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"inline-flex",alignItems:"center",gap:4}}><TFIcon name="plus" size={12} color="#fff"/> Agregar</button>
                  </div>
                  {mostrarForm&&(
                    <div style={{background:T.card,borderRadius:16,padding:16,border:`1px solid ${T.border}`}}>
                      <input placeholder="Nombre del producto" value={nuevoProducto.nombre} onChange={e=>setNuevoProducto({...nuevoProducto,nombre:e.target.value})} style={inp()}/>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        <input type="number" placeholder="Cantidad" value={nuevoProducto.cantidad} onChange={e=>setNuevoProducto({...nuevoProducto,cantidad:e.target.value})} style={inp()}/>
                        <select value={nuevoProducto.unidad} onChange={e=>setNuevoProducto({...nuevoProducto,unidad:e.target.value})} style={{...inp(),marginBottom:12}}><option value="g">gramos</option><option value="kg">kg</option><option value="ml">ml</option><option value="L">litros</option><option value="un">unidades</option></select>
                      </div>
                      <button onClick={agregarProducto} style={btn(T.sage,{padding:"10px"})}>Guardar producto</button>
                    </div>
                  )}
                  {stock.length===0?(
                    <div style={{background:T.card,borderRadius:18,padding:28,border:`1px solid ${T.border}`,textAlign:"center"}}>
                      <TFIcon name="despensa" size={40} color={T.textSub}/>
                      <div style={{fontFamily:FONTS.display,fontSize:20,letterSpacing:"-0.02em",color:T.charcoal,marginBottom:6,marginTop:12}}>Despensa vacía</div>
                      <div style={{fontSize:14,color:T.textMid,lineHeight:1.5}}>Agrega tus productos para hacer seguimiento.</div>
                    </div>
                  ):stock.map(s=>{
                    const lowStock=s.cantidad<=(s.minimo||0);
                    const iconColor=lowStock?"clay":"sage";
                    return(
                    <div key={s.id}>
                      <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
                        <div style={{width:36,height:36,borderRadius:10,background:T[iconColor]+"22",color:T[iconColor],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <TFIcon name="apple" size={18}/>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:14,fontWeight:500,color:T.charcoal}}>{s.nombre}</div>
                          <div style={{fontSize:11,color:T.textSub,marginTop:2}}>{s.cantidad} {s.unidad}</div>
                        </div>
                        {lowStock?(
                          <button onClick={()=>{setReponerItem(reponerItem===s.id?null:s.id);setReponerCant("");}} style={{padding:"4px 10px",borderRadius:99,background:T.clay+"22",color:T.clay,fontSize:11,fontWeight:600,border:"none",cursor:"pointer",fontFamily:FONTS.body}}>Reponer</button>
                        ):(
                          <div style={{padding:"4px 10px",borderRadius:99,border:`1px solid ${T.border}`,color:T.textMid,fontSize:11}}>{s.unidad}</div>
                        )}
                        <button onClick={()=>eliminarProducto(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,padding:0,display:"flex"}}><TFIcon name="close" size={14}/></button>
                      </div>
                      {reponerItem===s.id&&(
                        <div style={{display:"flex",gap:8,padding:"8px 0 4px",marginLeft:48}}>
                          <input type="number" placeholder="Cantidad" value={reponerCant} onChange={e=>setReponerCant(e.target.value)} style={{flex:1,padding:"8px 12px",borderRadius:12,border:`1.5px solid ${T.border}`,background:T.surface,fontSize:13,color:T.charcoal,outline:"none",fontFamily:FONTS.body}} autoFocus/>
                          <button onClick={()=>reponerStock(s)} style={{padding:"8px 16px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:FONTS.body,fontWeight:500}}>Agregar</button>
                        </div>
                      )}
                    </div>
                  );})}
                </div>
              )}

              {despensaTab==="compras"&&(
                <div style={{padding:"0 22px 22px"}} className="fade-in">
                  {listaCompraCompleta.length===0?(
                    <div style={{background:T.card,borderRadius:18,padding:28,border:`1px solid ${T.border}`,textAlign:"center"}}>
                      <TFIcon name="cart" size={40} color={T.textSub}/>
                      <div style={{fontFamily:FONTS.display,fontSize:20,letterSpacing:"-0.02em",color:T.charcoal,marginBottom:6,marginTop:12}}>Sin lista de compras</div>
                      <div style={{fontSize:14,color:T.textMid,lineHeight:1.6}}>Genera tu menú para obtener sugerencias de compra.</div>
                    </div>
                  ):(<>
                    {/* Summary card */}
                    <div style={{background:T.sage+"10",border:`1px solid ${T.sage}33`,borderRadius:18,padding:14,marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:13,color:T.textMid}}>Tu próxima compra</div>
                          <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,color:T.charcoal,letterSpacing:"-0.02em"}}>{listaCompraCompleta.length} productos</div>
                        </div>
                      </div>
                    </div>
                    <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase",marginBottom:8}}>Generada para tu menú</div>
                    {listaCompraCompleta.map((item,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:`1px solid ${T.border}`}}>
                        <div onClick={()=>{if(!item.stockId)agregarSugerencia(item,i);}} style={{width:22,height:22,borderRadius:6,background:item.added?T.sage:"transparent",border:`1.5px solid ${item.added?T.sage:T.border2}`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                          {item.added&&<TFIcon name="check" size={12} color="#fff"/>}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:14,color:T.charcoal,textDecoration:item.added?"line-through":"none",opacity:item.added?.5:1}}>{item.nombre}</div>
                          <div style={{fontSize:11,color:T.textSub,marginTop:1}}>{item.cantidad} {item.unidad}{item.motivo?` · ${item.motivo}`:""}</div>
                        </div>
                        {item.stockId?(
                          <button onClick={()=>{setTab("despensa");setDespensaTab("stock");setTimeout(()=>{setReponerItem(item.stockId);setReponerCant("");},100);}} style={{padding:"4px 10px",borderRadius:99,background:T.clay+"22",color:T.clay,fontSize:11,fontWeight:600,border:"none",cursor:"pointer",fontFamily:FONTS.body}}>Reponer</button>
                        ):(
                          <button onClick={()=>agregarSugerencia(item,i)} style={{padding:"4px 10px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:FONTS.body}}>+ Agregar</button>
                        )}
                      </div>
                    ))}
                  </>)}
                </div>
              )}

              {despensaTab==="scan"&&(
                <div style={{padding:"0 22px 22px"}} className="fade-in">
                  {!boletaProducts.length&&!boletaLoading?(
                    <div>
                      {/* Gradient scan card — matches TFSheetAddProducto */}
                      <input ref={boletaInputRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{if(e.target.files?.[0])scanBoleta(e.target.files[0]);}}/>
                      <div onClick={()=>boletaInputRef.current?.click()} style={{background:`linear-gradient(135deg,${T.sage},${T.sageD})`,borderRadius:16,padding:18,color:"#fff",marginBottom:16,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
                        <div style={{width:48,height:48,borderRadius:12,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <TFIcon name="scan" size={22} color="#fff"/>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontFamily:FONTS.display,fontSize:17,fontWeight:600,letterSpacing:"-0.02em"}}>Escanear boleta</div>
                          <div style={{fontSize:12,opacity:0.85,marginTop:2}}>La IA detecta productos y cantidades.</div>
                        </div>
                        <TFIcon name="chevron" size={18} color="#fff"/>
                      </div>
                      {/* Photo + Manual options */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
                        <div onClick={()=>boletaInputRef.current?.click()} style={{padding:14,borderRadius:16,border:`1.5px solid ${T.border}`,cursor:"pointer",background:T.surface}}>
                          <div style={{width:36,height:36,borderRadius:10,background:T.bg,color:T.charcoal,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
                            <TFIcon name="camera" size={18}/>
                          </div>
                          <div style={{fontSize:14,fontWeight:600,color:T.charcoal}}>Foto</div>
                          <div style={{fontSize:11,color:T.textSub,marginTop:2}}>Reconocer</div>
                        </div>
                        <div onClick={()=>{setDespensaTab("stock");setMostrarForm(true);}} style={{padding:14,borderRadius:16,border:`1.5px solid ${T.border}`,cursor:"pointer",background:T.surface}}>
                          <div style={{width:36,height:36,borderRadius:10,background:T.bg,color:T.charcoal,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
                            <TFIcon name="edit" size={18}/>
                          </div>
                          <div style={{fontSize:14,fontWeight:600,color:T.charcoal}}>Manual</div>
                          <div style={{fontSize:11,color:T.textSub,marginTop:2}}>Escribir</div>
                        </div>
                      </div>
                      {boletaError&&<div style={{fontSize:13,color:T.clay,padding:"8px 14px",background:T.clay+"14",borderRadius:12}}>{boletaError}</div>}
                    </div>
                  ):boletaLoading?(
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:16,padding:"40px 0"}}>
                      {boletaImg&&<img src={boletaImg} alt="Boleta" style={{width:"100%",maxWidth:200,borderRadius:12,opacity:0.7}}/>}
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:16,height:16,border:`2px solid ${T.sage}`,borderTopColor:"transparent",borderRadius:99,animation:"spin .8s linear infinite"}}/>
                        <span style={{fontSize:14,color:T.textMid}}>Analizando boleta...</span>
                      </div>
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                  ):(
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                        <div style={{fontFamily:FONTS.display,fontSize:18,fontWeight:600,color:T.charcoal}}>{boletaProducts.length} productos encontrados</div>
                        <button onClick={()=>{setBoletaProducts([]);setBoletaImg(null);setBoletaError("");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:T.textSub,fontFamily:FONTS.body}}>✕ Limpiar</button>
                      </div>
                      <div style={{fontSize:12,color:T.textSub,marginBottom:12}}>Desmarca los que no quieras agregar</div>
                      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                        {boletaProducts.map((p,i)=>(
                          <div key={i} style={{background:T.card,borderRadius:12,padding:"12px 14px",border:`1px solid ${p.checked?T.sage+"44":T.border}`,display:"flex",alignItems:"center",gap:10,opacity:p.checked?1:0.5,transition:"all .2s",cursor:"pointer"}} onClick={()=>setBoletaProducts(prev=>prev.map((x,j)=>j===i?{...x,checked:!x.checked}:x))}>
                            <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${p.checked?T.sage:T.muted}`,background:p.checked?T.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              {p.checked&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}
                            </div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>{p.nombre}</div>
                              <div style={{fontSize:11,color:T.textSub,marginTop:1}}>{p.cantidad} {p.unidad}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>{setBoletaProducts([]);setBoletaImg(null);}} style={btn(T.muted,{flex:1})}>Cancelar</button>
                        <button onClick={confirmarBoleta} style={btn(T.sage,{flex:1})}>Agregar {boletaProducts.filter(p=>p.checked).length} productos</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ═══ LA TRANSFORMACIÓN ═══ */}
          {tab==="entrena"&&(
            <div style={{paddingBottom:16}}>
              {sesionAbierta?(()=>{
                /* ═══ VISTA DETALLADA DE SESIÓN (HARBIZ-STYLE) ═══ */
                const s=sesiones.find(x=>x.id===sesionAbierta);
                if(!s)return <div style={{padding:20,textAlign:"center"}}><div style={{fontSize:14,color:T.textSub,marginBottom:12}}>Sesión no encontrada</div><button onClick={()=>setSesionAbierta(null)} style={{padding:"10px 20px",borderRadius:99,background:T.violet,border:"none",color:"#fff",fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Volver</button></div>;
                const ejercicios=parsarEjercicios(s.descripcion);
                const semNum=parseInt((s.grupo||"").match(/\d+/)?.[0]||"1");
                const grupoNombre=(s.grupo||"").replace(/^Sem \d+ · /,"");
                const faseNombre=["Activación","Volumen","Intensidad","Descarga"][semNum-1]||"";
                const logs=logsActuales[s.id]||{};
                const totalSeries=ejercicios.reduce((acc,ej)=>acc+ej.series,0);
                const seriesHechas=Object.values(logs).flatMap(x=>x).filter(x=>x.done).length;
                return(<>
                  {/* Header sesión — gradient style matching TFEntrenaA */}
                  <div style={{position:"sticky",top:0,zIndex:10}}>
                    <div style={{padding:"10px 22px",background:T.bg,display:"flex",alignItems:"center"}}>
                      <button onClick={()=>setSesionAbierta(null)} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",color:T.textMid,fontSize:13,cursor:"pointer",fontFamily:FONTS.body,fontWeight:500,padding:0}}>
                        <TFIcon name="arrowL" size={16}/> Volver
                      </button>
                    </div>
                    <div style={{background:`linear-gradient(135deg,${T.violet},${T.violetD||T.violet})`,padding:"16px 22px",color:"#fff"}}>
                      <div style={{fontFamily:FONTS.mono,fontSize:11,letterSpacing:"0.1em",opacity:0.8,marginBottom:4}}>SEMANA {semNum} · {faseNombre.toUpperCase()}</div>
                      <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,letterSpacing:"-0.02em"}}>{s.dia}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:8}}>
                        <div style={{fontSize:13,opacity:0.85}}>{grupoNombre}</div>
                        {totalSeries>0&&<div style={{textAlign:"right"}}>
                          <div style={{fontFamily:FONTS.display,fontSize:24,fontWeight:600,letterSpacing:"-0.025em"}}>{seriesHechas}/{totalSeries}</div>
                          <div style={{fontSize:11,opacity:0.7}}>series</div>
                        </div>}
                      </div>
                      {totalSeries>0&&<div style={{marginTop:10,background:"rgba(255,255,255,0.2)",borderRadius:99,height:4,overflow:"hidden"}}>
                        <div style={{width:`${(seriesHechas/totalSeries)*100}%`,height:"100%",background:"#fff",borderRadius:99,transition:"width .4s ease"}}/>
                      </div>}
                    </div>
                  </div>
                  {/* Ejercicios */}
                  <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:12}} className="fade-in">
                    {ejercicios.length===0?(
                      <div style={{background:T.card,borderRadius:18,padding:"28px 20px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                        <TFIcon name="refresh" size={32} color={T.textSub}/>
                        <div style={{fontSize:14,color:T.charcoal,marginBottom:6,fontWeight:500,marginTop:8}}>Sin ejercicios detallados</div>
                        <div style={{fontSize:12,color:T.textSub,marginBottom:16,lineHeight:1.6}}>Regenera el mesociclo para obtener ejercicios.</div>
                        <button onClick={()=>{setSesionAbierta(null);generarEntrenamiento();}} style={{width:"100%",padding:"12px",borderRadius:99,background:T.violet,border:"none",color:"#fff",fontSize:14,cursor:"pointer",fontFamily:FONTS.body,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><TFIcon name="refresh" size={14} color="#fff"/> Regenerar</button>
                      </div>
                    ):ejercicios.map((ej,ejIdx)=>{
                      const ejLogs=logs[ej.nombre]||Array.from({length:ej.series},()=>({reps:"",peso:"",done:false}));
                      const allDone=ejLogs.every(s=>s.done);
                      const someReps=ej.unidad==="reps";
                      return(
                        <div key={ejIdx} style={{background:T.card,borderRadius:16,padding:"16px",border:`1.5px solid ${allDone?T.violet+"55":T.border}`,transition:"all .3s",overflow:"hidden",position:"relative"}}>
                          {allDone&&<div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:T.violet}}/>}
                          {/* Cabecera ejercicio */}
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                            <div style={{paddingLeft:allDone?8:0,transition:"padding .3s"}}>
                              <div style={{fontSize:14,fontWeight:600,color:allDone?T.textSub:T.charcoal,transition:"color .3s"}}>{ej.nombre}</div>
                              <div style={{fontSize:11,color:T.violet,marginTop:2,fontWeight:500}}>
                                {ej.series} {ej.series===1?"serie":"series"} × {ej.reps}{ej.unidad==="reps"?" reps":ej.unidad==="s"?" seg":" min"}
                              </div>
                            </div>
                            {allDone&&<div style={{width:28,height:28,borderRadius:99,background:T.violet,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><TFIcon name="check" size={14} color="#fff"/></div>}
                          </div>
                          {/* Headers columnas */}
                          <div style={{display:"grid",gridTemplateColumns:"32px 1fr 1fr 36px",gap:6,marginBottom:5,paddingLeft:allDone?8:0}}>
                            {["#",someReps?"Reps":"Seg","Peso kg",""].map((h,i)=>(
                              <div key={i} style={{fontSize:11,color:T.textSub,textAlign:"center",letterSpacing:"0.05em",fontWeight:500}}>{h}</div>
                            ))}
                          </div>
                          {/* Filas de series */}
                          {Array.from({length:ej.series}).map((_,setIdx)=>{
                            const setLog=ejLogs[setIdx]||{reps:"",peso:"",done:false};
                            const inputStyle={padding:"8px 6px",borderRadius:12,border:`1.5px solid ${setLog.done?T.violet+"66":T.border}`,background:setLog.done?T.violet+"0d":T.surface,fontSize:14,color:setLog.done?T.textSub:T.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif",textAlign:"center",width:"100%",transition:"all .2s"};
                            return(
                              <div key={setIdx} style={{display:"grid",gridTemplateColumns:"32px 1fr 1fr 36px",gap:6,marginBottom:6,alignItems:"center",paddingLeft:allDone?8:0,transition:"padding .3s"}}>
                                <div style={{fontSize:12,fontWeight:700,color:setLog.done?T.violet:T.muted,textAlign:"center"}}>{setIdx+1}</div>
                                <input type="number" inputMode="decimal" value={setLog.reps} onChange={e=>updateLog(s.id,ej.nombre,setIdx,"reps",e.target.value)} placeholder={String(ej.reps)} style={inputStyle}/>
                                <input type="number" inputMode="decimal" step="0.5" value={setLog.peso} onChange={e=>updateLog(s.id,ej.nombre,setIdx,"peso",e.target.value)} placeholder="—" style={inputStyle}/>
                                <button onClick={()=>toggleSetDone(s.id,ej.nombre,setIdx)} style={{width:36,height:36,borderRadius:99,background:setLog.done?T.violet:T.border,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .25s",flexShrink:0}}><TFIcon name="check" size={14} color={setLog.done?"#fff":T.muted}/></button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                    {/* RPE - Esfuerzo percibido */}
                    {(()=>{
                      const rpeVal=s.rpe||0;
                      const rpeLabels=["","Muy fácil","Fácil","Moderado","Algo duro","Duro","Muy duro","Intenso","Máximo esfuerzo","Al límite","Fallo total"];
                      const rpeColors=["",T.sage,T.sage,T.sage,T.sageD,T.sand,T.sand,T.clay,T.clay,"#D44","#C22"];
                      const rpeEmojis=["","😌","🙂","💪","😤","🔥","🔥","💀","💀","⚠️","☠️"];
                      return(
                        <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,transition:"all .4s"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                            <div>
                              <div style={{fontSize:11,color:T.violet,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>ESFUERZO PERCIBIDO</div>
                              <div style={{fontSize:13,color:T.textSub}}>¿Qué tan dura fue esta sesión?</div>
                            </div>
                            {rpeVal>0&&<div style={{display:"flex",alignItems:"center",gap:6}}>
                              <span style={{fontSize:20}}>{rpeEmojis[rpeVal]}</span>
                              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:700,color:rpeColors[rpeVal]}}>{rpeVal}</div>
                            </div>}
                          </div>
                          {rpeVal>0&&<div style={{fontSize:13,fontWeight:600,color:rpeColors[rpeVal],marginBottom:10,textAlign:"center"}}>{rpeLabels[rpeVal]}</div>}
                          {/* Slider */}
                          <div style={{position:"relative",padding:"8px 0"}}>
                            <input type="range" min="1" max="10" step="1" value={rpeVal||5} onChange={(e)=>{const v=parseInt(e.target.value);setSesiones(p=>p.map(x=>x.id===s.id?{...x,rpe:v}:x));}} onMouseUp={async(e)=>{const v=parseInt(e.target.value);await supabase.from("sesiones").update({rpe:v}).eq("id",s.id);}} onTouchEnd={async(e)=>{const v=parseInt(e.target.value);await supabase.from("sesiones").update({rpe:v}).eq("id",s.id);}} style={{width:"100%",height:6,borderRadius:99,appearance:"none",WebkitAppearance:"none",background:`linear-gradient(90deg, ${T.sage} 0%, ${T.sand} 50%, ${T.clay} 100%)`,outline:"none",cursor:"pointer"}}/>
                            <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:99px;background:${T.surface};border:3px solid ${rpeColors[rpeVal]||T.violet};box-shadow:0 2px 8px rgba(0,0,0,0.15);cursor:pointer;transition:border-color .2s}input[type=range]::-moz-range-thumb{width:28px;height:28px;border-radius:99px;background:${T.surface};border:3px solid ${rpeColors[rpeVal]||T.violet};box-shadow:0 2px 8px rgba(0,0,0,0.15);cursor:pointer}`}</style>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.textSub,marginTop:2}}>
                            <span>Mínimo</span>
                            <span>Máximo</span>
                          </div>
                        </div>
                      );
                    })()}
                    {/* Finalizar sesión */}
                    <button onClick={()=>finalizarSesion(sesionAbierta)} style={{width:"100%",padding:"16px",borderRadius:99,background:s.completada?T.muted:seriesHechas===totalSeries&&totalSeries>0?T.sage:T.violet,border:"none",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:FONTS.body,marginTop:4,transition:"background .4s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                      {s.completada?<><TFIcon name="check" size={16} color="#fff"/> Sesión completada</>:seriesHechas===totalSeries&&totalSeries>0?<><TFIcon name="check" size={16} color="#fff"/> ¡Todas las series! Finalizar</>:<><TFIcon name="flame" size={16} color="#fff"/> Finalizar sesión</>}
                    </button>
                  </div>
                </>);
              })():(
                /* ═══ VISTA LISTA DE SESIONES — matches TFEntrenaA design ═══ */
                <>
                  {/* Header */}
                  <div style={{padding:"8px 22px 14px",background:T.bg,flexShrink:0}}>
                    <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.12em",color:T.sage,marginBottom:6}}>
                      Mesociclo · Semana {semanaActiva} de 4
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                      <div style={{fontFamily:FONTS.display,fontSize:28,fontWeight:600,color:T.charcoal,letterSpacing:"-0.03em",lineHeight:1.05}}>Entrena</div>
                      <div onClick={()=>setTab("perfil")} style={{cursor:"pointer"}}><Avatar name={`${profile?.nombre||"U"} ${profile?.apellido||""}`} size={36} T={T}/></div>
                    </div>
                  </div>
                  {/* Mesocycle hero card */}
                  {sesiones.length>0&&(
                    <div style={{padding:"0 22px 18px"}}>
                      <div style={{background:T.violet+"10",border:`1px solid ${T.violet}33`,borderRadius:18,padding:18}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                          <div>
                            <div style={{fontSize:11,color:T.violet,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>{profile?.objetivo==="ganar_musculo"?"HIPERTROFIA":"FUERZA"}</div>
                            <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,color:T.charcoal,letterSpacing:"-0.02em",marginTop:2}}>Mesociclo de {profile?.objetivo==="ganar_musculo"?"hipertrofia":"fuerza"}</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontFamily:FONTS.display,fontSize:28,fontWeight:600,color:T.violet,letterSpacing:"-0.03em",lineHeight:1}}>{sesiones.length?Math.round((sesiones.filter(s=>s.completada).length/sesiones.length)*100):0}%</div>
                            <div style={{fontSize:11,color:T.textSub,marginTop:2}}>de progreso</div>
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:6}}>
                          {[1,2,3,4].map(i=>(
                            <div key={i} onClick={()=>setSemanaActiva(i)} style={{height:32,borderRadius:8,background:i<semanaActiva?T.violet:i===semanaActiva?T.violet+"44":T.surface,border:`1px solid ${i===semanaActiva?T.violet:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:i<semanaActiva?"#fff":T.textMid,fontFamily:FONTS.mono,cursor:"pointer"}}>S{i}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:12}} className="mode-in">
                    {entrenamientoError&&<div style={{fontSize:12,color:T.clay,background:T.clay+"18",padding:12,borderRadius:12}}>{entrenamientoError}</div>}
                    {sesiones.length===0?(
                      <div style={{background:T.card,borderRadius:18,padding:"32px 24px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                        <div style={{width:56,height:56,borderRadius:99,background:T.violet+"18",color:T.violet,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><TFIcon name="dumbbell" size={28}/></div>
                        <div style={{fontFamily:FONTS.display,fontSize:20,letterSpacing:"-0.02em",color:T.charcoal,marginBottom:8}}>Sin plan aún</div>
                        <div style={{fontSize:14,color:T.textMid,marginBottom:18,lineHeight:1.6}}>Genera tu primer mesociclo personalizado de 4 semanas.</div>
                        <button onClick={generarEntrenamiento} disabled={entrenamientoLoading} style={{width:"100%",padding:"14px",borderRadius:99,background:entrenamientoLoading?T.muted:T.violet,border:"none",color:"#fff",fontSize:15,cursor:entrenamientoLoading?"default":"pointer",fontFamily:FONTS.body,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><TFIcon name="sparkles" size={16} color="#fff"/>{entrenamientoLoading?"Generando...":"Generar Mesociclo"}</button>
                      </div>
                    ):(<>
                      {/* Selector semanas */}
                      <div style={{display:"flex",gap:8}}>
                        {[1,2,3,4].map(n=>{
                          const ss=sesPorSemana(n);const completa=ss.length>0&&ss.every(s=>s.completada);
                          return(<button key={n} onClick={()=>setSemanaActiva(n)} style={{flex:1,padding:"10px 6px",borderRadius:12,border:`1.5px solid ${semanaActiva===n?T.violet:T.border}`,background:semanaActiva===n?T.violet+"22":"transparent",color:semanaActiva===n?T.violet:T.textMid,fontSize:12,fontWeight:semanaActiva===n?600:400,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s",textAlign:"center"}}>
                            Sem {n}{completa&&<div style={{fontSize:11,color:T.sage,marginTop:1}}>✓</div>}
                          </button>);
                        })}
                      </div>
                      {/* Info fase semana */}
                      <div style={{background:T.violet+"14",borderRadius:16,padding:"12px 16px",border:`1px solid ${T.violet}22`}}>
                        <div style={{fontSize:11,color:T.violet,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>SEMANA {semanaActiva}</div>
                        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,color:T.charcoal}}>Semana de {["Activación","Volumen","Intensidad","Descarga"][semanaActiva-1]}</div>
                      </div>
                      {/* Cards de sesiones — matches TFEntrenaA exercise list */}
                      {sesPorSemana(semanaActiva).length>0?sesPorSemana(semanaActiva).map((s,sIdx)=>{
                        const ejercicios=parsarEjercicios(s.descripcion);
                        const sLogs=s.logs||{};
                        const totalSer=ejercicios.reduce((acc,ej)=>acc+ej.series,0);
                        const hechas=Object.values(sLogs).flatMap(x=>x).filter(x=>x.done).length;
                        const isActive=!s.completada&&sIdx===sesPorSemana(semanaActiva).findIndex(x=>!x.completada);
                        return(
                          <div key={s.id} style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden",transition:"all .25s"}}>
                            <div onClick={()=>abrirSesion(s.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",cursor:"pointer"}}>
                              <div style={{width:22,height:22,borderRadius:99,background:s.completada?T.sage:"transparent",border:`1.5px solid ${s.completada?T.sage:isActive?T.violet:T.border2}`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                {s.completada&&<TFIcon name="check" size={12} color="#fff"/>}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:14,fontWeight:isActive?600:500,color:s.completada?T.textSub:T.charcoal,textDecoration:s.completada?"line-through":"none"}}>{s.dia}</div>
                                <div style={{fontSize:11,color:T.textSub,marginTop:2,fontFamily:FONTS.mono}}>
                                  {(s.grupo||"").replace(/^Sem \d+ · /,"")}
                                  {ejercicios.length>0&&` · ${ejercicios.length} ej`}
                                  {totalSer>0&&hechas>0&&!s.completada&&` · ${hechas}/${totalSer}`}
                                </div>
                              </div>
                              {isActive&&<span style={{fontSize:11,color:T.violet,fontWeight:600,padding:"3px 8px",background:T.violet+"22",borderRadius:99}}>IR</span>}
                              {s.completada&&s.rpe>0&&<span style={{fontSize:11,color:s.rpe>=7?T.clay:T.sage,fontWeight:600}}>RPE {s.rpe}</span>}
                            </div>
                            {totalSer>0&&hechas>0&&!s.completada&&(
                              <div style={{height:3,background:T.border}}>
                                <div style={{width:`${(hechas/totalSer)*100}%`,height:"100%",background:T.violet,transition:"width .4s ease"}}/>
                              </div>
                            )}
                          </div>
                        );
                      }):(
                        <div style={{background:T.card,borderRadius:18,padding:"24px 20px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                          <TFIcon name="lock" size={28} color={T.textSub}/>
                          <div style={{fontFamily:FONTS.display,fontSize:14,fontWeight:500,color:T.charcoal,marginBottom:4,marginTop:8}}>Sin sesiones en esta semana</div>
                          <div style={{fontSize:12,color:T.textSub,lineHeight:1.6}}>Regenera el mesociclo para obtener sesiones.</div>
                        </div>
                      )}
                      {/* Regenerar — matches design button style */}
                      <button onClick={generarEntrenamiento} disabled={entrenamientoLoading} style={{width:"100%",padding:"14px",borderRadius:99,border:`1.5px solid ${T.violet}`,background:"transparent",color:T.violet,fontFamily:FONTS.body,fontSize:14,fontWeight:500,cursor:entrenamientoLoading?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
                        <TFIcon name="refresh" size={14}/>{entrenamientoLoading?"Regenerando...":"Regenerar mesociclo con IA"}
                      </button>
                    </>)}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══ ASISTENTE ═══ */}
          {tab==="asistente"&&(
            <div style={{display:"flex",flexDirection:"column",height:"calc(100dvh - 104px)"}}>
              <div style={{padding:"12px 22px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0,transition:"all .4s"}}>
                <div style={{width:40,height:40,borderRadius:99,background:`linear-gradient(135deg,${T.sage},${T.violet})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><TFIcon name="sparkles" size={20} color="#fff"/></div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:FONTS.display,fontSize:17,fontWeight:600,letterSpacing:"-0.02em",color:T.charcoal}}>Asistente TriFlow</div>
                  <div style={{fontSize:11,color:T.sage,display:"flex",alignItems:"center",gap:4}}>
                    <div style={{width:6,height:6,borderRadius:99,background:T.sage}}/>
                    En línea · sabe todo de ti
                  </div>
                </div>
                <button onClick={()=>{setMsgs([msgs[0]]);setAccionSugerida(null);}} style={{width:36,height:36,borderRadius:99,background:"transparent",border:`1px solid ${T.border}`,color:T.charcoal,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><TFIcon name="refresh" size={16}/></button>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"16px 22px",display:"flex",flexDirection:"column",gap:14,background:T.bg}}>
                {msgs.map((m,i)=>(
                  <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"82%"}}>
                    <div style={{background:m.role==="user"?T.sage:T.surface,border:m.role==="user"?"none":`1px solid ${T.border}`,borderRadius:m.role==="user"?"18px 18px 4px 18px":"4px 18px 18px 18px",padding:"12px 14px"}}>
                      <div style={{fontSize:14,color:m.role==="user"?"#fff":T.charcoal,lineHeight:1.5}}>
                        {m.text.split("\n").map((line,j,arr)=><span key={j}>{line.split(/(\*\*[^*]+\*\*)/).map((p,k)=>p.startsWith("**")?<strong key={k}>{p.slice(2,-2)}</strong>:p)}{j<arr.length-1&&<br/>}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
                {chatLoading&&(
                  <div style={{alignSelf:"flex-start"}}>
                    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:"4px 18px 18px 18px",padding:"14px 16px",display:"flex",gap:4}}>
                      {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:99,background:T.textSub,animation:`pulse 1.4s ${i*.2}s infinite`}}/>)}
                    </div>
                  </div>
                )}
                <div ref={chatBottom}/>
              </div>
              {/* ── Acción sugerida (sticky sobre el input) ── */}
              {accionSugerida&&!chatLoading&&(
                <div style={{margin:"0 10px 6px",background:T.violetL+"33",border:`1.5px solid ${T.violet}`,borderRadius:16,padding:"11px 13px",display:"flex",alignItems:"center",gap:10,animation:"fadeUp .3s ease",flexShrink:0}}>
                  <div style={{width:32,height:32,borderRadius:99,background:T.violet,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>✦</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:T.charcoal,marginBottom:1}}>
                      {accionSugerida.tipo==="menu"?"Generar y guardar menú semanal":accionSugerida.tipo==="entrenamiento"?"Generar y guardar plan de entrenamiento":"Agregar productos a la despensa"}
                    </div>
                    <div style={{fontSize:11,color:T.textSub}}>
                      {accionSugerida.tipo==="menu"?"→ Pestaña Hábito":accionSugerida.tipo==="entrenamiento"?"→ Pestaña Entrena":"→ Despensa"}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button onClick={()=>setAccionSugerida(null)} style={{padding:"6px 10px",borderRadius:99,border:`1px solid ${T.border}`,background:"transparent",color:T.textMid,cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>✕</button>
                    <button
                      disabled={menuLoading||entrenamientoLoading}
                      onClick={()=>{
                        if(accionSugerida.tipo==="entrenamiento"&&sesiones.filter(s=>!s.completada).length>0){setShowWarningEntrenamiento(true);}
                        else{ejecutarAccionAsistente(accionSugerida.tipo,accionSugerida.datos);}
                      }}
                      style={{padding:"6px 12px",borderRadius:99,background:menuLoading||entrenamientoLoading?T.muted:T.violet,border:"none",color:"#fff",cursor:menuLoading||entrenamientoLoading?"default":"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",transition:"background .2s"}}
                    >
                      {menuLoading||entrenamientoLoading?"Generando...":"Guardar →"}
                    </button>
                  </div>
                </div>
              )}
              <div style={{padding:"8px 22px",display:"flex",gap:6,flexWrap:"wrap",background:T.surface,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
                {["¿Qué cocino hoy?","Genera mi menú","Plan de entrenamiento","¿Cómo voy?"].map(s=>(
                  <button key={s} onClick={()=>setChatInput(s)} style={{padding:"8px 14px",borderRadius:99,background:"transparent",border:`1.5px solid ${T.sage}55`,color:T.sage,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s"}}>{s}</button>
                ))}
              </div>
              {/* Composer */}
              <div style={{padding:"12px 22px 14px",borderTop:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,background:T.surface,border:`1px solid ${T.border}`,borderRadius:99,padding:"8px 8px 8px 16px"}}>
                  <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Pregúntame algo..." style={{flex:1,border:"none",background:"transparent",outline:"none",color:T.charcoal,fontSize:14,fontFamily:FONTS.body}}/>
                  <button onClick={sendChat} disabled={chatLoading} style={{width:32,height:32,borderRadius:99,background:chatLoading?T.muted:T.sage,color:"#fff",border:"none",cursor:chatLoading?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .2s"}}><TFIcon name="send" size={14} color="#fff"/></button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ PERFIL ═══ */}
          {tab==="perfil"&&(
            <div style={{paddingBottom:16}}>
              {/* Profile hero — matches TFPerfil design */}
              <div style={{padding:"22px 22px 28px",textAlign:"center"}}>
                <div style={{width:96,height:96,borderRadius:99,margin:"0 auto",background:`linear-gradient(135deg,${T.sage},${T.violet})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONTS.display,fontSize:36,fontWeight:600,letterSpacing:"-0.03em",marginBottom:14}}>
                  {(profile?.nombre||"U")[0]}{(profile?.apellido||"")[0]}
                </div>
                <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal}}>
                  {profile?.nombre} {profile?.apellido}
                </div>
                <div style={{fontSize:13,color:T.textMid,marginTop:4}}>{user?.email}</div>
                {/* 3 stat row */}
                <div style={{display:"flex",justifyContent:"center",gap:18,marginTop:18}}>
                  {(()=>{
                    let racha=0;const hoyD=new Date();const hoy2=localDate();
                    for(let i=0;i<60;i++){const d=new Date(hoyD);d.setDate(hoyD.getDate()-i);const f=d.toLocaleDateString("en-CA");if(habitosDiarios.some(h=>h.fecha===f))racha++;else if(i>0)break;}
                    const cambio=historialPeso.length>=2?(parseFloat(historialPeso[historialPeso.length-1].peso)-parseFloat(historialPeso[0].peso)).toFixed(1):"0";
                    const totalHab=habitosDiarios.length;
                    return[
                      [String(racha),"Días seguidos","sage"],
                      [`${parseFloat(cambio)>=0?"+":""}${cambio}kg`,"Progreso","clay"],
                      [String(totalHab),"Hábitos","violet"]
                    ].map(([v,l,c])=>(
                      <div key={l} style={{textAlign:"center"}}>
                        <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,color:T[c],letterSpacing:"-0.02em"}}>{v}</div>
                        <div style={{fontSize:11,color:T.textSub,marginTop:2}}>{l}</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              <div style={{padding:"0 22px 18px"}}>
                {/* Cuenta section — icon row list */}
                <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase",marginBottom:8}}>Cuenta</div>
                {[
                  {ic:"target",t:"Mis objetivos",d:(profile?.objetivo?.replace(/_/g," ")||"—")+" · "+(profile?.peso_meta||"—")+" kg",c:"sage",action:()=>setShowObjetivoModal(true)},
                  {ic:"leaf",t:"Restricciones",d:profile?.restricciones?.length?profile.restricciones.join(", "):"Ninguna",c:"clay",action:()=>setShowRestriccionesModal(true)},
                  {ic:"dumbbell",t:"Entrenamiento",d:`${profile?.dias_entrenamiento||3} días · ${profile?.objetivo==="ganar_musculo"?"Hipertrofia":profile?.objetivo==="rendimiento"?"Rendimiento":"Fuerza"}`,c:"violet",action:()=>setShowEntrenamientoModal(true)},
                  {ic:"weight",t:"Historial de peso",d:"Ver tendencia",c:"sky",action:()=>setShowPesoPage(true)},
                ].map(row=>(
                  <div key={row.t} onClick={row.action} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${T.border}`,cursor:row.action?"pointer":"default"}}>
                    <div style={{width:38,height:38,borderRadius:10,background:T[row.c]+"22",color:T[row.c],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <TFIcon name={row.ic} size={18}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500,color:T.charcoal}}>{row.t}</div>
                      <div style={{fontSize:12,color:T.textSub,marginTop:1}}>{row.d}</div>
                    </div>
                    <TFIcon name="chevron" size={16} color={T.textSub}/>
                  </div>
                ))}

                {/* Preferencias section */}
                <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase",marginTop:22,marginBottom:8}}>Preferencias</div>
                {/* Notifications row */}
                <div onClick={()=>setShowNotificacionesModal(true)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
                  <div style={{width:38,height:38,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`,color:T.charcoal,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <TFIcon name="bell" size={18}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:500,color:T.charcoal}}>Notificaciones</div>
                    <div style={{fontSize:12,color:T.textSub,marginTop:1}}>{Object.values(notifConfig).filter(Boolean).length} activas</div>
                  </div>
                  <TFIcon name="chevron" size={16} color={T.textSub}/>
                </div>
                {/* Appearance row */}
                <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{width:38,height:38,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`,color:T.charcoal,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <TFIcon name={dark?"moon":"sun"} size={18}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:500,color:T.charcoal}}>Apariencia</div>
                    <div style={{fontSize:12,color:T.textSub,marginTop:1}}>{dark?"Oscuro":"Claro"}</div>
                  </div>
                  <ThemeToggle dark={dark} toggle={toggleTheme} T={T}/>
                </div>
                {/* Privacy row */}
                <div onClick={()=>setShowPrivacidadModal(true)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
                  <div style={{width:38,height:38,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`,color:T.charcoal,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <TFIcon name="lock" size={18}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:500,color:T.charcoal}}>Privacidad</div>
                    <div style={{fontSize:12,color:T.textSub,marginTop:1}}>Gestionar datos</div>
                  </div>
                  <TFIcon name="chevron" size={16} color={T.textSub}/>
                </div>

                {/* País selector (functional) */}
                <div style={{marginTop:18}}>
                  <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
                    <div style={{width:38,height:38,borderRadius:10,background:T.sage+"22",color:T.sage,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <TFIcon name="leaf" size={18}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500,color:T.charcoal}}>País</div>
                      <div style={{fontSize:12,color:T.textSub,marginTop:1}}>Menús con comida local</div>
                    </div>
                    <select value={profile?.pais||"Chile"} onChange={async e=>{const np=e.target.value;setProfile(p=>({...p,pais:np}));await supabase.from("profiles").update({pais:np}).eq("id",user.id);}} style={{padding:"7px 10px",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.surface,fontSize:13,color:T.charcoal,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",outline:"none"}}>
                      {PAISES.map(p=>(<option key={p.n} value={p.n}>{p.f}  {p.n}</option>))}
                    </select>
                  </div>
                </div>
                {/* Logout */}
                <div style={{marginTop:22,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:12,cursor:"pointer"}} onClick={logout}>
                  <TFIcon name="logout" size={16} color={T.clay}/>
                  <span style={{color:T.clay,fontSize:13,fontWeight:500}}>Cerrar sesión</span>
                </div>
              </div>
            </div>
          )}

      </div>

      {/* NavBar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,height:76,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",paddingBottom:22,paddingTop:8,transition:"background .4s,border-color .4s",zIndex:1000,backdropFilter:"blur(20px)"}}>
        {TABS.map(t=>{const a=tab===t.id;return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,border:"none",background:"transparent",cursor:"pointer",padding:0,color:a?T.sage:T.muted,transition:"all .2s"}}>
            <TFIcon name={t.id} size={22} color={a?T.sage:T.muted}/>
            <span style={{fontSize:10.5,fontWeight:a?600:500,fontFamily:FONTS.body,letterSpacing:a?0:"0.01em",transition:"color .2s"}}>{t.label}</span>
            <span style={{width:4,height:4,borderRadius:99,background:a?T.sage:"transparent",transition:"all .2s"}}/>
          </button>
        );})}
      </div>
      {/* ═══ PESO SUB-PAGE — matches TFPeso design ═══ */}
      {showPesoPage&&(()=>{
        const sortedPeso=[...historialPeso].sort((a,b)=>new Date(a.fecha)-new Date(b.fecha));
        const pesoActual=sortedPeso.length>0?parseFloat(sortedPeso[sortedPeso.length-1].peso):parseFloat(profile?.peso_actual||70);
        const pesoMeta=parseFloat(profile?.peso_meta||66);
        const cambioTotal=sortedPeso.length>=2?pesoActual-parseFloat(sortedPeso[0].peso):0;
        const faltante=Math.abs(pesoActual-pesoMeta).toFixed(1);
        // Chart data — last 12 entries or all
        const chartData=sortedPeso.slice(-12).map(p=>parseFloat(p.peso));
        const chartW=340,chartH=160;
        let chartPath="",chartPts=[],goalY=0;
        if(chartData.length>=2){
          const mn=Math.min(...chartData,pesoMeta)-1,mx=Math.max(...chartData)+1,rng=mx-mn;
          const stepX=chartW/(chartData.length-1);
          chartPts=chartData.map((v,i)=>[i*stepX,chartH-((v-mn)/rng)*chartH]);
          chartPath=chartPts.map((p,i)=>(i?"L":"M")+p[0]+" "+p[1]).join(" ");
          goalY=chartH-((pesoMeta-mn)/rng)*chartH;
        }
        // Recent records
        const recientes=sortedPeso.slice(-5).reverse();
        return(
          <div style={{position:"fixed",inset:0,background:T.bg,zIndex:9999,overflowY:"auto",animation:"modeIn .25s ease"}}>
            <div style={{padding:"12px 22px 18px"}}>
              <div onClick={()=>setShowPesoPage(false)} style={{display:"flex",alignItems:"center",gap:6,color:T.textMid,fontSize:13,marginBottom:14,cursor:"pointer"}}>
                <TFIcon name="arrowL" size={16}/> Perfil
              </div>
              <div style={{fontFamily:FONTS.mono,fontSize:10,color:T.sage,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>
                {sortedPeso.length>0?`Últimos ${Math.min(sortedPeso.length,12)} registros`:"Sin registros"}
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:10}}>
                <span style={{fontFamily:FONTS.display,fontSize:52,fontWeight:600,letterSpacing:"-0.04em",lineHeight:1,color:T.charcoal}}>{pesoActual.toFixed(1)}</span>
                <span style={{fontSize:14,color:T.textMid}}>kg</span>
                {cambioTotal!==0&&<div style={{marginLeft:"auto",padding:"4px 10px",background:(cambioTotal<0?T.sage:T.clay)+"22",color:cambioTotal<0?T.sage:T.clay,borderRadius:99,fontSize:12,fontWeight:600}}>{cambioTotal<0?"":"+"}{cambioTotal.toFixed(1)}kg</div>}
              </div>
              <div style={{fontSize:13,color:T.textMid,marginTop:6}}>Te faltan <b style={{color:T.charcoal}}>{faltante} kg</b> para tu meta de <b style={{color:T.charcoal}}>{pesoMeta} kg</b>.</div>
            </div>
            {/* Chart */}
            {chartData.length>=2&&(
              <div style={{padding:"0 22px 22px"}}>
                <div style={{background:T.card,borderRadius:18,padding:14,border:`1px solid ${T.border}`}}>
                  <svg viewBox={`-20 -20 ${chartW+40} ${chartH+50}`} width="100%" height={chartH+40} style={{display:"block"}}>
                    <line x1="0" x2={chartW} y1={goalY} y2={goalY} stroke={T.sage} strokeWidth="1" strokeDasharray="4 4" opacity="0.5"/>
                    <text x={chartW} y={goalY-6} textAnchor="end" fontSize="10" fontFamily={FONTS.mono} fill={T.sage}>META {pesoMeta}kg</text>
                    <path d={`${chartPath} L${chartW} ${chartH} L0 ${chartH} Z`} fill={T.sage} opacity="0.12"/>
                    <path d={chartPath} fill="none" stroke={T.sage} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    {chartPts.map((p,i)=>(
                      <circle key={i} cx={p[0]} cy={p[1]} r={i===chartPts.length-1?5:2.5} fill={i===chartPts.length-1?T.sage:T.card} stroke={T.sage} strokeWidth="2"/>
                    ))}
                  </svg>
                </div>
              </div>
            )}
            {/* Registros recientes */}
            <div style={{padding:"0 22px 22px"}}>
              <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase",marginBottom:8}}>Registros recientes</div>
              {recientes.map((r,i)=>{
                const dt=i<recientes.length-1?(parseFloat(r.peso)-parseFloat(recientes[i+1].peso)).toFixed(1):0;
                const dtNum=parseFloat(dt);
                return(
                  <div key={r.id||i} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:`1px solid ${T.border}`}}>
                    <span style={{fontFamily:FONTS.mono,fontSize:11,color:T.textSub,width:60}}>{new Date(r.fecha).toLocaleDateString("es-CL",{day:"numeric",month:"short"})}</span>
                    <span style={{fontFamily:FONTS.display,fontSize:18,fontWeight:600,color:T.charcoal,letterSpacing:"-0.02em",flex:1}}>{parseFloat(r.peso).toFixed(1)} <span style={{fontSize:11,color:T.textSub,fontWeight:400}}>kg</span></span>
                    {dtNum!==0&&<span style={{fontSize:12,color:dtNum<0?T.sage:T.clay,fontWeight:600}}>{dtNum>0?"+":""}{dt}</span>}
                  </div>
                );
              })}
              {/* Register weight button */}
              <button onClick={()=>{setShowPesoPage(false);setShowPesoInput(true);setNuevoPesoVal(pesoActual.toFixed(1));}} style={{width:"100%",marginTop:18,padding:"14px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:FONTS.body,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <TFIcon name="plus" size={16} color="#fff"/> Registrar peso de hoy
              </button>
            </div>
          </div>
        );
      })()}
      {showWarningEntrenamiento&&(
        <div onClick={()=>setShowWarningEntrenamiento(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,23,0.36)",zIndex:9999,display:"flex",alignItems:"flex-end",backdropFilter:"blur(3px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:"24px 24px 0 0",boxShadow:"0 -20px 60px rgba(0,0,0,0.18)",padding:"16px 22px 28px",width:"100%",animation:"slideUp .3s ease"}}>
            <div style={{width:40,height:4,background:T.border,borderRadius:99,margin:"0 auto 16px"}}/>
            <div style={{textAlign:"center",marginBottom:18}}>
              <div style={{width:48,height:48,borderRadius:99,background:T.clay+"18",color:T.clay,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><TFIcon name="flame" size={24}/></div>
              <div style={{fontFamily:FONTS.display,fontSize:20,fontWeight:600,letterSpacing:"-0.02em",color:T.charcoal,marginBottom:10}}>¿Reemplazar plan actual?</div>
              <div style={{fontSize:14,color:T.textMid,lineHeight:1.7}}>
                Tienes <strong style={{color:T.clay}}>{sesiones.filter(s=>!s.completada).length} sesiones</strong> pendientes. Al generar un nuevo mesociclo, el progreso se perderá.
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{setShowWarningEntrenamiento(false);setAccionSugerida(null);}} style={{flex:1,padding:"14px",borderRadius:99,background:T.border,border:"none",color:T.charcoal,cursor:"pointer",fontSize:14,fontWeight:500,fontFamily:FONTS.body}}>Cancelar</button>
              <button onClick={()=>{setShowWarningEntrenamiento(false);ejecutarAccionAsistente("entrenamiento",null);}} style={{flex:1,padding:"14px",borderRadius:99,background:T.clay,border:"none",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:FONTS.body}}>Sí, reemplazar</button>
            </div>
          </div>
        </div>
      )}
      {showObjetivoModal&&(
        <div onClick={()=>setShowObjetivoModal(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,23,0.36)",zIndex:9999,display:"flex",alignItems:"flex-end",backdropFilter:"blur(3px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:"24px 24px 0 0",boxShadow:"0 -20px 60px rgba(0,0,0,0.18)",padding:"16px 22px 28px",width:"100%",animation:"slideUp .3s ease"}}>
            <div style={{width:40,height:4,background:T.border,borderRadius:99,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal}}>Cambiar objetivo</div>
              <button onClick={()=>setShowObjetivoModal(false)} style={{width:32,height:32,borderRadius:99,background:T.surface,border:`1px solid ${T.border}`,color:T.charcoal,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><TFIcon name="close" size={14}/></button>
            </div>
            <div style={{fontSize:13,color:T.textSub,marginBottom:20,lineHeight:1.6}}>Adaptaremos los planes a tu meta.</div>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:18}}>
              {[["bajar_peso","Bajar de peso","Déficit suave, comida saciante.","weight",T.sage],["ganar_musculo","Ganar músculo","Superávit calórico + entrenamiento.","dumbbell",T.violet],["rendimiento","Mejorar rendimiento","Nutrición + recuperación.","flame",T.clay]].map(([v,l,desc,ic,c])=>{
                const active=profile?.objetivo===v;
                return(
                  <div key={v} onClick={async()=>{
                    if(active){setShowObjetivoModal(false);return;}
                    setProfile(p=>({...p,objetivo:v}));
                    await supabase.from("profiles").update({objetivo:v}).eq("id",user.id);
                    setShowObjetivoModal(false);
                  }} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 16px",borderRadius:16,border:`1.5px solid ${active?c:T.border}`,background:active?c+"12":T.card,cursor:"pointer",transition:"all .2s"}}>
                    <div style={{width:38,height:38,borderRadius:12,background:c+"22",color:c,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <TFIcon name={ic} size={20}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:600,color:T.charcoal}}>{l}</div>
                      <div style={{fontSize:12,color:T.textMid,marginTop:2}}>{desc}</div>
                    </div>
                    {active&&<TFIcon name="check" size={18} color={c}/>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {showNuevoHabito&&(
        <div onClick={()=>setShowNuevoHabito(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,23,0.36)",zIndex:9999,display:"flex",alignItems:"flex-end",backdropFilter:"blur(3px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:"24px 24px 0 0",boxShadow:"0 -20px 60px rgba(0,0,0,0.18)",padding:"16px 22px 28px",width:"100%",maxHeight:"85vh",overflowY:"auto",animation:"slideUp .3s ease"}}>
            <div style={{width:40,height:4,background:T.border,borderRadius:99,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal}}>Nuevo hábito</div>
              <button onClick={()=>setShowNuevoHabito(false)} style={{width:32,height:32,borderRadius:99,background:T.surface,border:`1px solid ${T.border}`,color:T.charcoal,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><TFIcon name="close" size={14}/></button>
            </div>
            {/* Input */}
            <div style={{marginBottom:18}}>
              <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase",marginBottom:6}}>¿Qué quieres construir?</div>
              <div style={{padding:"12px 14px",borderRadius:12,border:`1.5px solid ${nuevoHabitoForm.nombre?T.sage:T.border}`,background:nuevoHabitoForm.nombre?T.sage+"08":"transparent",display:"flex",alignItems:"center",gap:10,transition:"all .2s"}}>
                <TFIcon name="sparkles" size={16} color={T.sage}/>
                <input type="text" value={nuevoHabitoForm.nombre} onChange={e=>setNuevoHabitoForm({...nuevoHabitoForm,nombre:e.target.value})} placeholder="ej: Meditar 10 min al despertar" style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:15,color:T.charcoal,fontFamily:FONTS.body}} autoFocus/>
              </div>
            </div>
            {/* Sugerencias populares */}
            <div style={{marginBottom:18}}>
              <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase",marginBottom:6}}>O elige uno popular</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:8}}>
                {[{ic:"water",name:"Beber agua",c:"sky"},{ic:"flame",name:"Ejercicio diario",c:"clay"},{ic:"leaf",name:"Comer verde",c:"sage"},{ic:"sparkles",name:"Meditar",c:"violet"},{ic:"moon",name:"Dormir 8h",c:"violet"},{ic:"chat",name:"Lectura",c:"sand"},{ic:"dumbbell",name:"Pasos diarios",c:"sage"},{ic:"apple",name:"Sin azúcar",c:"clay"}].map(h=>(
                  <div key={h.name} onClick={()=>setNuevoHabitoForm({...nuevoHabitoForm,nombre:h.name,emoji:h.ic})} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,background:T.surface,border:`1px solid ${nuevoHabitoForm.nombre===h.name?T[h.c]:T.border}`,cursor:"pointer",transition:"all .2s"}}>
                    <div style={{width:28,height:28,borderRadius:8,background:T[h.c]+"22",color:T[h.c],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <TFIcon name={h.ic} size={14}/>
                    </div>
                    <span style={{fontSize:13,color:T.charcoal}}>{h.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Frecuencia */}
            <div style={{marginBottom:18}}>
              <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase",marginBottom:6}}>Frecuencia</div>
              <div style={{display:"flex",gap:6}}>
                {["L","M","X","J","V","S","D"].map((d,i)=>{
                  const a=i<5;
                  return(
                    <div key={d} style={{flex:1,height:40,borderRadius:10,background:a?T.charcoal:"transparent",border:`1.5px solid ${a?T.charcoal:T.border}`,color:a?T.bg:T.textMid,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,fontFamily:FONTS.mono,cursor:"pointer"}}>{d}</div>
                  );
                })}
              </div>
            </div>
            {/* Descripción */}
            <div style={{marginBottom:18}}>
              <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase",marginBottom:6}}>Descripción (opcional)</div>
              <textarea placeholder="ej: 30 minutos, intensidad moderada..." value={nuevoHabitoForm.descripcion} onChange={e=>setNuevoHabitoForm({...nuevoHabitoForm,descripcion:e.target.value})} style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1.5px solid ${T.border}`,background:T.surface,fontSize:14,color:T.charcoal,outline:"none",fontFamily:FONTS.body,resize:"none",height:56}}/>
            </div>
            <button onClick={crearHabito} disabled={!nuevoHabitoForm.nombre} style={{width:"100%",padding:"14px",borderRadius:99,background:nuevoHabitoForm.nombre?T.sage:T.muted,border:"none",color:"#fff",cursor:nuevoHabitoForm.nombre?"pointer":"not-allowed",fontSize:15,fontWeight:600,fontFamily:FONTS.body}}>Crear hábito</button>
          </div>
          <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        </div>
      )}

      {/* ═══ RESTRICCIONES MODAL ═══ */}
      {showRestriccionesModal&&(
        <div onClick={()=>setShowRestriccionesModal(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,23,0.36)",zIndex:9999,display:"flex",alignItems:"flex-end",backdropFilter:"blur(3px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:"24px 24px 0 0",boxShadow:"0 -20px 60px rgba(0,0,0,0.18)",padding:"16px 22px 28px",width:"100%",maxHeight:"85vh",overflowY:"auto",animation:"slideUp .3s ease"}}>
            <div style={{width:40,height:4,background:T.border,borderRadius:99,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal}}>Restricciones</div>
              <button onClick={()=>setShowRestriccionesModal(false)} style={{width:32,height:32,borderRadius:99,background:T.surface,border:`1px solid ${T.border}`,color:T.charcoal,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><TFIcon name="close" size={14}/></button>
            </div>
            <div style={{fontSize:13,color:T.textSub,marginBottom:20,lineHeight:1.6}}>Selecciona restricciones alimentarias. Se considerarán al generar tus menús.</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {[
                {id:"vegetariano",label:"Vegetariano",desc:"Sin carne ni pescado",ic:"leaf",c:"sage"},
                {id:"vegano",label:"Vegano",desc:"Sin productos de origen animal",ic:"leaf",c:"sage"},
                {id:"sin_gluten",label:"Sin gluten",desc:"Apto para celíacos",ic:"apple",c:"sand"},
                {id:"sin_lactosa",label:"Sin lactosa",desc:"Sin leche ni derivados",ic:"water",c:"sky"},
                {id:"sin_frutos_secos",label:"Sin frutos secos",desc:"Libre de alérgenos comunes",ic:"bell",c:"clay"},
                {id:"keto",label:"Keto",desc:"Bajo en carbohidratos, alto en grasas",ic:"flame",c:"violet"},
                {id:"sin_azucar",label:"Sin azúcar añadida",desc:"Evitar azúcares refinados",ic:"target",c:"clay"},
                {id:"halal",label:"Halal",desc:"Según normas islámicas",ic:"sparkles",c:"sage"},
              ].map(r=>{
                const active=(profile?.restricciones||[]).includes(r.id);
                return(
                  <div key={r.id} onClick={async()=>{
                    const cur=profile?.restricciones||[];
                    const next=active?cur.filter(x=>x!==r.id):[...cur,r.id];
                    setProfile(p=>({...p,restricciones:next}));
                    await supabase.from("profiles").update({restricciones:next}).eq("id",user.id);
                  }} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",borderRadius:14,border:`1.5px solid ${active?T[r.c]:T.border}`,background:active?T[r.c]+"10":T.surface,cursor:"pointer",transition:"all .2s"}}>
                    <div style={{width:34,height:34,borderRadius:10,background:T[r.c]+"22",color:T[r.c],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <TFIcon name={r.ic} size={17}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500,color:T.charcoal}}>{r.label}</div>
                      <div style={{fontSize:11,color:T.textSub,marginTop:1}}>{r.desc}</div>
                    </div>
                    <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${active?T[r.c]:T.border}`,background:active?T[r.c]:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",flexShrink:0}}>
                      {active&&<TFIcon name="check" size={13} color="#fff"/>}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={()=>setShowRestriccionesModal(false)} style={{width:"100%",padding:"14px",borderRadius:99,background:T.sage,border:"none",color:"#fff",cursor:"pointer",fontSize:15,fontWeight:600,fontFamily:FONTS.body}}>Guardar</button>
          </div>
        </div>
      )}

      {/* ═══ ENTRENAMIENTO MODAL ═══ */}
      {showEntrenamientoModal&&(
        <div onClick={()=>setShowEntrenamientoModal(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,23,0.36)",zIndex:9999,display:"flex",alignItems:"flex-end",backdropFilter:"blur(3px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:"24px 24px 0 0",boxShadow:"0 -20px 60px rgba(0,0,0,0.18)",padding:"16px 22px 28px",width:"100%",animation:"slideUp .3s ease"}}>
            <div style={{width:40,height:4,background:T.border,borderRadius:99,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal}}>Entrenamiento</div>
              <button onClick={()=>setShowEntrenamientoModal(false)} style={{width:32,height:32,borderRadius:99,background:T.surface,border:`1px solid ${T.border}`,color:T.charcoal,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><TFIcon name="close" size={14}/></button>
            </div>
            <div style={{fontSize:13,color:T.textSub,marginBottom:20,lineHeight:1.6}}>Configura tu plan. Se reflejará en los mesociclos generados.</div>
            {/* Días por semana */}
            <div style={{marginBottom:22}}>
              <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase",marginBottom:10}}>Días por semana</div>
              <div style={{display:"flex",gap:6}}>
                {[2,3,4,5,6].map(d=>{const a=(profile?.dias_entrenamiento||3)===d;return(
                  <button key={d} onClick={async()=>{setProfile(p=>({...p,dias_entrenamiento:d}));await supabase.from("profiles").update({dias_entrenamiento:d}).eq("id",user.id);}} style={{flex:1,padding:"12px 0",borderRadius:12,border:`2px solid ${a?T.violet:T.border}`,background:a?T.violet+"18":"transparent",color:a?T.violet:T.textMid,fontWeight:a?700:400,cursor:"pointer",fontSize:18,transition:"all .2s",fontFamily:FONTS.display}}>{d}</button>
                );})}
              </div>
            </div>
            {/* Enfoque */}
            <div style={{marginBottom:22}}>
              <div style={{fontFamily:FONTS.mono,fontSize:10,fontWeight:500,letterSpacing:"0.14em",color:T.textSub,textTransform:"uppercase",marginBottom:10}}>Enfoque</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  ["fuerza","Fuerza","Compuestos pesados, baja rep.","dumbbell",T.violet],
                  ["hipertrofia","Hipertrofia","Volumen moderado, aislamiento.","flame",T.clay],
                  ["funcional","Funcional","Movimientos completos, cardio.","target",T.sage],
                  ["mixto","Mixto","Combinación equilibrada.","sparkles",T.sky],
                ].map(([v,l,desc,ic,c])=>{
                  const cur=profile?.enfoque_entrenamiento||"fuerza";
                  const active=cur===v;
                  return(
                    <div key={v} onClick={async()=>{
                      setProfile(p=>({...p,enfoque_entrenamiento:v}));
                      await supabase.from("profiles").update({enfoque_entrenamiento:v}).eq("id",user.id);
                    }} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",borderRadius:14,border:`1.5px solid ${active?c:T.border}`,background:active?c+"10":T.surface,cursor:"pointer",transition:"all .2s"}}>
                      <div style={{width:34,height:34,borderRadius:10,background:c+"22",color:c,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <TFIcon name={ic} size={17}/>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:500,color:T.charcoal}}>{l}</div>
                        <div style={{fontSize:11,color:T.textSub,marginTop:1}}>{desc}</div>
                      </div>
                      {active&&<TFIcon name="check" size={18} color={c}/>}
                    </div>
                  );
                })}
              </div>
            </div>
            <button onClick={()=>setShowEntrenamientoModal(false)} style={{width:"100%",padding:"14px",borderRadius:99,background:T.violet,border:"none",color:"#fff",cursor:"pointer",fontSize:15,fontWeight:600,fontFamily:FONTS.body}}>Listo</button>
          </div>
        </div>
      )}

      {/* ═══ NOTIFICACIONES MODAL ═══ */}
      {showNotificacionesModal&&(
        <div onClick={()=>setShowNotificacionesModal(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,23,0.36)",zIndex:9999,display:"flex",alignItems:"flex-end",backdropFilter:"blur(3px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:"24px 24px 0 0",boxShadow:"0 -20px 60px rgba(0,0,0,0.18)",padding:"16px 22px 28px",width:"100%",animation:"slideUp .3s ease"}}>
            <div style={{width:40,height:4,background:T.border,borderRadius:99,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal}}>Notificaciones</div>
              <button onClick={()=>setShowNotificacionesModal(false)} style={{width:32,height:32,borderRadius:99,background:T.surface,border:`1px solid ${T.border}`,color:T.charcoal,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><TFIcon name="close" size={14}/></button>
            </div>
            <div style={{fontSize:13,color:T.textSub,marginBottom:20,lineHeight:1.6}}>Elige qué recordatorios quieres recibir.</div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:20}}>
              {[
                {key:"habitos",label:"Hábitos diarios",desc:"Recordatorio matutino para completar hábitos",ic:"check",c:T.sage},
                {key:"agua",label:"Hidratación",desc:"Cada 2 horas durante el día",ic:"water",c:T.sky},
                {key:"entrenamiento",label:"Sesión de entrenamiento",desc:"Aviso 30 min antes del horario",ic:"dumbbell",c:T.violet},
                {key:"menu",label:"Menú del día",desc:"Resumen de comidas por la mañana",ic:"leaf",c:T.sand},
                {key:"peso",label:"Registro de peso",desc:"Recordatorio semanal para pesarte",ic:"weight",c:T.clay},
              ].map(n=>(
                <div key={n.key} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{width:34,height:34,borderRadius:10,background:n.c+"22",color:n.c,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <TFIcon name={n.ic} size={17}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:500,color:T.charcoal}}>{n.label}</div>
                    <div style={{fontSize:11,color:T.textSub,marginTop:1}}>{n.desc}</div>
                  </div>
                  <button onClick={()=>{const next={...notifConfig,[n.key]:!notifConfig[n.key]};setNotifConfig(next);try{localStorage.setItem("triflow_notif",JSON.stringify(next));}catch{}}} style={{width:44,height:26,borderRadius:99,border:"none",cursor:"pointer",background:notifConfig[n.key]?T.sage:T.border,padding:3,display:"flex",alignItems:"center",justifyContent:notifConfig[n.key]?"flex-end":"flex-start",transition:"all .3s"}}>
                    <div style={{width:20,height:20,borderRadius:99,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,.15)",transition:"all .3s"}}/>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={()=>setShowNotificacionesModal(false)} style={{width:"100%",padding:"14px",borderRadius:99,background:T.sage,border:"none",color:"#fff",cursor:"pointer",fontSize:15,fontWeight:600,fontFamily:FONTS.body}}>Guardar</button>
          </div>
        </div>
      )}

      {/* ═══ PRIVACIDAD MODAL ═══ */}
      {showPrivacidadModal&&(
        <div onClick={()=>setShowPrivacidadModal(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,23,0.36)",zIndex:9999,display:"flex",alignItems:"flex-end",backdropFilter:"blur(3px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:"24px 24px 0 0",boxShadow:"0 -20px 60px rgba(0,0,0,0.18)",padding:"16px 22px 28px",width:"100%",animation:"slideUp .3s ease"}}>
            <div style={{width:40,height:4,background:T.border,borderRadius:99,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontFamily:FONTS.display,fontSize:22,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal}}>Privacidad</div>
              <button onClick={()=>setShowPrivacidadModal(false)} style={{width:32,height:32,borderRadius:99,background:T.surface,border:`1px solid ${T.border}`,color:T.charcoal,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><TFIcon name="close" size={14}/></button>
            </div>
            <div style={{fontSize:13,color:T.textSub,marginBottom:20,lineHeight:1.6}}>Controla cómo se usan tus datos.</div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:20}}>
              {[
                {key:"compartirProgreso",label:"Compartir progreso",desc:"Permite que tu nutricionista vea tu avance",ic:"send",c:T.sage},
                {key:"datosAnonimos",label:"Datos anónimos",desc:"Ayuda a mejorar TriFlow con datos sin identificar",ic:"target",c:T.violet},
                {key:"historialVisible",label:"Historial visible",desc:"Muestra tu historial completo en el perfil",ic:"clock",c:T.sky},
              ].map(p=>(
                <div key={p.key} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{width:34,height:34,borderRadius:10,background:p.c+"22",color:p.c,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <TFIcon name={p.ic} size={17}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:500,color:T.charcoal}}>{p.label}</div>
                    <div style={{fontSize:11,color:T.textSub,marginTop:1}}>{p.desc}</div>
                  </div>
                  <button onClick={()=>{const next={...privConfig,[p.key]:!privConfig[p.key]};setPrivConfig(next);try{localStorage.setItem("triflow_priv",JSON.stringify(next));}catch{}}} style={{width:44,height:26,borderRadius:99,border:"none",cursor:"pointer",background:privConfig[p.key]?T.sage:T.border,padding:3,display:"flex",alignItems:"center",justifyContent:privConfig[p.key]?"flex-end":"flex-start",transition:"all .3s"}}>
                    <div style={{width:20,height:20,borderRadius:99,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,.15)",transition:"all .3s"}}/>
                  </button>
                </div>
              ))}
            </div>
            <div style={{background:T.sage+"12",borderRadius:12,padding:"12px 14px",marginBottom:18,display:"flex",alignItems:"flex-start",gap:10}}>
              <TFIcon name="lock" size={15} color={T.sage} style={{marginTop:1,flexShrink:0}}/>
              <div style={{fontSize:12,color:T.textMid,lineHeight:1.5}}>Tu data nunca se vende ni se comparte con terceros. Cifrada de extremo a extremo.</div>
            </div>
            <button onClick={()=>setShowPrivacidadModal(false)} style={{width:"100%",padding:"14px",borderRadius:99,background:T.sage,border:"none",color:"#fff",cursor:"pointer",fontSize:15,fontWeight:600,fontFamily:FONTS.body}}>Guardar</button>
          </div>
        </div>
      )}
    </div>
  );
}
