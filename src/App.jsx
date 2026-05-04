import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Html5QrcodeScanner } from "html5-qrcode";
import { SPACING, BORDER_RADIUS, TYPOGRAPHY, FONTS, SHADOWS, TRANSITIONS, inputStyle, buttonStyle, cardStyle } from "./designSystem.js";
import LandingPage from "./LandingPage.jsx";

const supabase = createClient("https://uiktwbtwzotqduzwtjcb.supabase.co","sb_publishable_ONXQyJvXKUIUqppaWnZG4w_epX1u7ml",{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"implicit"}});

const LIGHT={bg:"#F7F5F0",surface:"#FDFCFA",card:"#FFFFFF",border:"#EAE4D8",border2:"#D8D0C0",sage:"#7C9E87",sageL:"#A8C4AF",sageD:"#5A7D65",sand:"#C4A882",clay:"#C4856A",sky:"#7EA8C4",violet:"#9B8EC4",violetL:"#C4B8E8",violetD:"#7060A8",charcoal:"#2C2C2C",textMid:"#6B6458",textSub:"#9C9284",muted:"#B8B0A0",scrollbar:"#C8C0B0"};
const DARK={bg:"#161C18",surface:"#1C2420",card:"#212B25",border:"#2A3830",border2:"#354540",sage:"#7EC494",sageL:"#5A9970",sageD:"#A8D4B4",sand:"#D4B48C",clay:"#D4956A",sky:"#8AB8D4",violet:"#B4A8D8",violetL:"#7868A8",violetD:"#CEC4EC",charcoal:"#EAE6DE",textMid:"#A8A090",textSub:"#6E6860",muted:"#4A4840",scrollbar:"#2A3830"};

const TABS=[{id:"inicio",label:"Inicio",icon:"◈"},{id:"habito",label:"Hábito",icon:"▦"},{id:"despensa",label:"Despensa",icon:"⬡"},{id:"entrena",label:"Entrena",icon:"◉"},{id:"asistente",label:"Asistente",icon:"✦"},{id:"perfil",label:"Perfil",icon:"◎"}];
const DIAS=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const DIAS_C=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const PAISES=[{n:"Chile",f:"🇨🇱"},{n:"Argentina",f:"🇦🇷"},{n:"Perú",f:"🇵🇪"},{n:"Colombia",f:"🇨🇴"},{n:"Venezuela",f:"🇻🇪"},{n:"Ecuador",f:"🇪🇨"},{n:"Uruguay",f:"🇺🇾"},{n:"Paraguay",f:"🇵🇾"},{n:"Bolivia",f:"🇧🇴"},{n:"México",f:"🇲🇽"},{n:"España",f:"🇪🇸"},{n:"Costa Rica",f:"🇨🇷"},{n:"Panamá",f:"🇵🇦"},{n:"Guatemala",f:"🇬🇹"},{n:"Honduras",f:"🇭🇳"},{n:"El Salvador",f:"🇸🇻"},{n:"Nicaragua",f:"🇳🇮"},{n:"República Dominicana",f:"🇩🇴"},{n:"Cuba",f:"🇨🇺"},{n:"Puerto Rico",f:"🇵🇷"},{n:"Otro",f:"🌎"}];

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
    <div style={{width:22,height:22,borderRadius:99,background:dark?"#fff":T.surface,boxShadow:"0 1px 4px rgba(0,0,0,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,transition:"all .35s"}}>{dark?"🌙":"☀️"}</div>
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

export default function App(){
  const[dark,setDark]=useState(false);
  const[user,setUser]=useState(null);const[profile,setProfile]=useState(null);
  const[screen,setScreen]=useState(window.location.search.includes("dev")?"app":"loading");
  const[showLanding,setShowLanding]=useState(!window.location.search.includes("dev")&&!window.location.search.includes("start"));
  const[tab,setTab]=useState("inicio");
  const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[loading,setLoading]=useState(false);const[error,setError]=useState("");
  const[modo,setModo]=useState("welcome");const[showPass,setShowPass]=useState(false);const[rememberMe,setRememberMe]=useState(false);const[onboardingSlide,setOnboardingSlide]=useState(0);
  const[ob,setOb]=useState({nombre:"",apellido:"",peso_actual:"",peso_meta:"",objetivo:"bajar_peso",restricciones:[],pais:"Chile",dias_entrenamiento:3});
  const[agua,setAgua]=useState(0);const[stock,setStock]=useState([]);const[menu,setMenu]=useState([]);const[sesiones,setSesiones]=useState([]);const[listaCompra,setListaCompra]=useState([]);
  const[historialPeso,setHistorialPeso]=useState([]);const[showPesoInput,setShowPesoInput]=useState(false);const[nuevoPesoVal,setNuevoPesoVal]=useState("");
  const[nuevoProducto,setNuevoProducto]=useState({nombre:"",cantidad:"",unidad:"g"});const[mostrarForm,setMostrarForm]=useState(false);
  const[diaMenu,setDiaMenu]=useState(0);const[despensaTab,setDespensaTab]=useState("stock");const[semanaActiva,setSemanaActiva]=useState(1);
  const[showScanner,setShowScanner]=useState(false);const[scannedCode,setScannedCode]=useState("");const[scannedProduct,setScannedProduct]=useState(null);const[scanLoading,setScanLoading]=useState(false);
  const[msgs,setMsgs]=useState([]);const[chatInput,setChatInput]=useState("");const[chatLoading,setChatLoading]=useState(false);
  const[menuLoading,setMenuLoading]=useState(false);const[menuError,setMenuError]=useState("");
  const[entrenamientoLoading,setEntrenamientoLoading]=useState(false);const[entrenamientoError,setEntrenamientoError]=useState("");
  const[sesionAbierta,setSesionAbierta]=useState(null);const[logsActuales,setLogsActuales]=useState({});
  const[accionSugerida,setAccionSugerida]=useState(null);const[showWarningEntrenamiento,setShowWarningEntrenamiento]=useState(false);
  const chatBottom=useRef(null);const scannerRef=useRef(null);
  const T=dark?DARK:LIGHT;
  const toggleTheme=()=>setDark(d=>!d);

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
  useEffect(()=>{
    if(showScanner&&!scannedProduct){
      try{const scanner=new Html5QrcodeScanner("reader",{fps:10,qrbox:{width:250,height:250},videoConstraints:{facingMode:{exact:"environment"}},showTorchButtonIfSupported:false});scannerRef.current=scanner;scanner.render((r)=>{handleScanSuccess(r);scanner.clear()},()=>{});}
      catch(e){console.error("Scanner error:",e);}
    }
    return()=>{if(scannerRef.current){try{scannerRef.current.clear();}catch(e){}}};
  },[showScanner,scannedProduct]);

  const loadAll=async(uid)=>{
    try{
      let p=null;
      if(window.location.search.includes("dev")){p={id:uid,nombre:"Diego",apellido:"Test",peso_actual:85,peso_meta:75,objetivo:"bajar_peso",restricciones:["Sin lactosa"]};setProfile(p);setUser({id:uid,email:"test@triflow.com"});}
      else{const{data:prof,error:e1}=await supabase.from("profiles").select("*").eq("id",uid).maybeSingle();if(e1&&e1.code!=="PGRST116"){console.error("Profile load error:",e1);throw e1;}p=prof;if(!p?.nombre){setScreen("onboarding");return;}setProfile(p);}
      const{data:a}=await supabase.from("agua_diaria").select("*").eq("user_id",uid).eq("fecha",new Date().toISOString().split("T")[0]).maybeSingle();setAgua(a?.vasos||0);
      const{data:s}=await supabase.from("stock").select("*").eq("user_id",uid).order("created_at");setStock(s||[]);
      const{data:m}=await supabase.from("menu_semanal").select("*").eq("user_id",uid).order("created_at");setMenu(m||[]);
      const{data:se}=await supabase.from("sesiones").select("*").eq("user_id",uid).order("created_at");setSesiones(se||[]);
      const{data:hp}=await supabase.from("progreso_peso").select("peso,fecha,created_at").eq("user_id",uid).order("created_at",{ascending:true}).limit(60);setHistorialPeso(hp||[]);
      setMsgs([{role:"assistant",text:`Hola, ${p.nombre}! 🌱\n\nSoy tu asistente de TriFlow. Conozco tu perfil:\n\n**Objetivo:** ${p.objetivo?.replace(/_/g," ")}\n**Peso actual:** ${p.peso_actual} kg → Meta: ${p.peso_meta} kg\n**Restricciones:** ${p.restricciones?.length?p.restricciones.join(", "):"Ninguna"}\n\n¿En qué te ayudo hoy?`}]);
      setScreen("app");
    }catch(e){
      console.error("LoadAll error:",e);
      setUser(null);setProfile(null);setScreen("auth");
    }
  };
  const handleAuth=async()=>{setLoading(true);setError("");try{if(rememberMe)localStorage.setItem("triflow_email",email);else localStorage.removeItem("triflow_email");if(modo==="registro"){const{error:e}=await supabase.auth.signUp({email,password:pass});if(e)throw e;setError("Revisa tu email para confirmar tu cuenta");}else{const{error:e}=await supabase.auth.signInWithPassword({email,password:pass});if(e)throw e;}}catch(e){setError(e.message);}setLoading(false);};
  const saveProfile=async()=>{setLoading(true);try{const payload={id:user.id,email:user.email,...ob,peso_actual:parseFloat(ob.peso_actual),peso_meta:parseFloat(ob.peso_meta)};let{error:e}=await supabase.from("profiles").upsert(payload);if(e&&/pais/i.test(e.message||"")){console.warn("Columna pais no existe aún en DB, reintentando sin ella");const{pais,...payloadSinPais}=payload;const r=await supabase.from("profiles").upsert(payloadSinPais);e=r.error;}if(e)throw e;await supabase.from("progreso_peso").insert({user_id:user.id,peso:parseFloat(ob.peso_actual)});await loadAll(user.id);}catch(e){console.error("saveProfile error:",e);setError(e.message||"Error al guardar perfil");}setLoading(false);};
  const logout=async()=>{await supabase.auth.signOut();};
  const updateAgua=async(v)=>{setAgua(v);await supabase.from("agua_diaria").upsert({user_id:user.id,fecha:new Date().toISOString().split("T")[0],vasos:v},{onConflict:"user_id,fecha"});};
  const registrarPeso=async()=>{
    const p=parseFloat(nuevoPesoVal);
    if(!p||p<20||p>400)return;
    const hoy=new Date().toISOString().split("T")[0];
    const{data:row}=await supabase.from("progreso_peso").insert({user_id:user.id,peso:p,fecha:hoy}).select().single();
    if(row){setHistorialPeso(prev=>[...prev,row]);setProfile(pr=>({...pr,peso_actual:p}));await supabase.from("profiles").update({peso_actual:p}).eq("id",user.id);}
    setNuevoPesoVal("");setShowPesoInput(false);
  };
  const agregarProducto=async()=>{if(!nuevoProducto.nombre)return;const{data}=await supabase.from("stock").insert({user_id:user.id,...nuevoProducto,cantidad:parseFloat(nuevoProducto.cantidad)||0}).select().single();if(data){setStock(p=>[...p,data]);setNuevoProducto({nombre:"",cantidad:"",unidad:"g"});setMostrarForm(false);}};
  const eliminarProducto=async(id)=>{await supabase.from("stock").delete().eq("id",id);setStock(p=>p.filter(s=>s.id!==id));};
  const toggleSesion=async(id,completada)=>{await supabase.from("sesiones").update({completada:!completada}).eq("id",id);setSesiones(p=>p.map(s=>s.id===id?{...s,completada:!completada}:s));};
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
    const updated={};
    setLogsActuales(p=>{
      const ejLogs=(p[sesionId]||{})[ejercicio]||[];
      const newEjLogs=ejLogs.map((s,i)=>i===setIdx?{...s,done:!s.done}:s);
      const newSesionLogs={...(p[sesionId]||{}),[ejercicio]:newEjLogs};
      Object.assign(updated,newSesionLogs);
      return{...p,[sesionId]:newSesionLogs};
    });
    setTimeout(async()=>{
      const currentLogs=logsActuales[sesionId]||{};
      const ejLogs=(currentLogs[ejercicio]||[]).map((s,i)=>i===setIdx?{...s,done:!s.done}:s);
      const newLogs={...currentLogs,[ejercicio]:ejLogs};
      await supabase.from("sesiones").update({logs:newLogs}).eq("id",sesionId);
    },300);
  };
  const finalizarSesion=async(sesionId)=>{
    const logs=logsActuales[sesionId]||{};
    const{error}=await supabase.from("sesiones").update({completada:true,logs}).eq("id",sesionId);
    if(!error){setSesiones(p=>p.map(s=>s.id===sesionId?{...s,completada:true,logs}:s));setSesionAbierta(null);}
  };
  const generarMenu=async()=>{if(menuLoading)return false;setMenuLoading(true);setMenuError("");let _ok=false;try{const res=await fetch("/api/generate-menu",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile,stock})});const data=await res.json();if(!res.ok)throw new Error(data?.error||`Error ${res.status}`);if(!Array.isArray(data.menu)||!data.menu.length)throw new Error("Menú vacío");await supabase.from("menu_semanal").delete().eq("user_id",user.id);const rows=data.menu.map(m=>({user_id:user.id,dia:m.dia,desayuno:m.desayuno||"",almuerzo:m.almuerzo||"",snack:m.snack||"",cena:m.cena||""}));const{data:inserted,error}=await supabase.from("menu_semanal").insert(rows).select();if(error)throw error;setMenu(inserted||rows);setListaCompra(Array.isArray(data.lista_compra)?data.lista_compra:[]);_ok=true;}catch(e){console.error("generarMenu error:",e);setMenuError(e.message||"Error generando menú");}setMenuLoading(false);return _ok;};
  const generarEntrenamiento=async()=>{if(entrenamientoLoading)return false;setEntrenamientoLoading(true);setEntrenamientoError("");let _ok=false;try{const res=await fetch("/api/generate-training",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile})});const data=await res.json();if(!res.ok)throw new Error(data?.error||`Error ${res.status}`);if(!Array.isArray(data.sesiones)||!data.sesiones.length)throw new Error("Sin sesiones generadas");await supabase.from("sesiones").delete().eq("user_id",user.id);const rows=data.sesiones.map(s=>({user_id:user.id,dia:s.dia,grupo:`Sem ${s.semana||1} · ${s.grupo}`,descripcion:s.descripcion||"",completada:false,logs:{}}));const{data:inserted,error}=await supabase.from("sesiones").insert(rows).select();if(error)throw error;setSesiones(inserted||rows);_ok=true;}catch(e){console.error("generarEntrenamiento error:",e);setEntrenamientoError(e.message||"Error generando plan");}setEntrenamientoLoading(false);return _ok;};
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
  const agregarSugerencia=async(item,idx)=>{const payload={user_id:user.id,nombre:item.nombre,cantidad:parseFloat(item.cantidad)||0,unidad:item.unidad||"g"};const{data,error}=await supabase.from("stock").insert(payload).select().single();if(error){setMenuError(error.message);return;}setStock(p=>[...p,data]);setListaCompra(p=>p.filter((_,i)=>i!==idx));};
  const lookupProductByBarcode=async(barcode)=>{try{const res=await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);if(!res.ok)return null;const data=await res.json();if(!data.product)return null;return{nombre:data.product.product_name||barcode,imagen:data.product.image_front_url||null,marca:data.product.brands||"",energia:data.product.nutriments?.energy_kcal_100g||null,proteinas:data.product.nutriments?.proteins_100g||null,grasas:data.product.nutriments?.fat_100g||null,carbohidratos:data.product.nutriments?.carbohydrates_100g||null};}catch(e){console.error("Open Food Facts error:",e);return null;}};
  const handleScanSuccess=async(decodedText)=>{setScannedCode(decodedText);setScanLoading(true);const product=await lookupProductByBarcode(decodedText);setScannedProduct(product||{nombre:decodedText,cantidad:"1",unidad:"un",imagen:null});setScanLoading(false);};
  const confirmarProductoEscaneado=async()=>{if(!scannedProduct?.nombre)return;const payload={user_id:user.id,nombre:scannedProduct.nombre,cantidad:parseFloat(scannedProduct.cantidad)||1,unidad:scannedProduct.unidad||"un"};const{data}=await supabase.from("stock").insert(payload).select().single();if(data){setStock(p=>[...p,data]);setShowScanner(false);setScannedCode("");setScannedProduct(null);}};
  const sendChat=async()=>{if(!chatInput.trim()||chatLoading)return;const txt=chatInput.trim();setChatInput("");setMsgs(p=>[...p,{role:"user",text:txt}]);setChatLoading(true);try{const stockInfo=stock.map(s=>`${s.nombre}: ${s.cantidad}${s.unidad}`).join(", ");const paisU=profile?.pais||"Chile";const system=`Eres el asistente personal de TriFlow para ${profile?.nombre} ${profile?.apellido}.\nPerfil: ${paisU} 🌎 · objetivo ${profile?.objetivo?.replace(/_/g," ")}, peso actual ${profile?.peso_actual}kg, meta ${profile?.peso_meta}kg, restricciones: ${profile?.restricciones?.join(", ")||"ninguna"}.\nDespensa actual: ${stockInfo||"vacía"}.\n\nIMPORTANTE: Adapta tu lenguaje, modismos y nombres de comidas al país del usuario (${paisU}). Por ejemplo:\n- Chile: papa, palta, poroto, choclo, once, marraqueta, cazuela, charquicán\n- Argentina: papa, palta, mate, milanesa, asado, merienda, facturas\n- Perú: papa, palta, ceviche, ají de gallina, lomo saltado, lonche\n- Colombia: papa, aguacate, arepa, frijoles, ajiaco, sancocho, algo\n- Venezuela: aguacate, arepa, caraota, pabellón, cachapa\n- México: jitomate, aguacate, frijol, tortilla, chilaquiles, tacos\n- España: patata, aguacate, judía, garbanzo, tortilla, paella\nUsa modismos naturales del país sin caer en estereotipo. Responde en español, cálido y conciso (máx 200 palabras).\n\nACCIONES DISPONIBLES — usa estos marcadores SOLO cuando el usuario pide EXPLÍCITAMENTE crear o guardar contenido en la app (NO si solo conversas, consultas o das consejos):\n- Si pide crear un MENÚ SEMANAL completo para 7 días: escribe exactamente [ACCION:menu] al final de tu respuesta.\n- Si pide crear un PLAN DE ENTRENAMIENTO o mesociclo: escribe exactamente [ACCION:entrenamiento] al final.\n- Si pide agregar productos específicos a su DESPENSA: escribe [ACCION:despensa]{"items":[{"nombre":"Nombre","cantidad":N,"unidad":"g"}]}[/ACCION] al final con los items exactos (unidades válidas: g, kg, ml, l, unidad).\nIMPORTANTE: NO incluyas marcadores si el usuario solo pregunta sobre nutrición, ejercicio, recetas o pide consejos en general.`;const msgHistory=msgs.slice(1).map(m=>({role:m.role,content:m.text.replace(/\*\*/g,"")}));const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1000,system,messages:[...msgHistory,{role:"user",content:txt}]})});const data=await res.json();if(!res.ok)throw new Error(data?.error||`Error ${res.status}`);const responseText=data?.content?.[0]?.text;if(!responseText)throw new Error("Respuesta vacía del servidor");let cleanText=responseText;let nuevoAccion=null;const simpleM=cleanText.match(/\[ACCION:(menu|entrenamiento)\]/i);if(simpleM){nuevoAccion={tipo:simpleM[1].toLowerCase(),datos:null};cleanText=cleanText.replace(/\[ACCION:(menu|entrenamiento)\]/gi,"").trim();}const despensaM=cleanText.match(/\[ACCION:despensa\]([\s\S]*?)\[\/ACCION\]/i);if(despensaM){try{const datosDespensa=JSON.parse(despensaM[1]);nuevoAccion={tipo:"despensa",datos:datosDespensa};cleanText=cleanText.replace(/\[ACCION:despensa\][\s\S]*?\[\/ACCION\]/gi,"").trim();}catch(_){}}setMsgs(p=>[...p,{role:"assistant",text:cleanText}]);if(nuevoAccion)setAccionSugerida(nuevoAccion);}catch(e){console.error("Chat error:",e);setMsgs(p=>[...p,{role:"assistant",text:`Error: ${e.message||"No se pudo obtener respuesta"}. Intenta de nuevo.`}]);}setChatLoading(false);};

  const inp=(x={})=>({...inputStyle(T,'default'),marginBottom:SPACING.md,...x});
  const btn=(bg,x={})=>({width:"100%",padding:SPACING.lg,borderRadius:BORDER_RADIUS.full,background:bg,border:"none",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:TRANSITIONS.fast,...x});

  const hoyIdx=new Date().getDay()===0?6:new Date().getDay()-1;
  const menuHoy=menu.find(m=>m.dia===DIAS[hoyIdx])||menu[0];
  const stockCritico=stock.filter(s=>s.cantidad<=(s.minimo||0));
  const sesPorSemana=(n)=>sesiones.filter(s=>s.grupo?.startsWith(`Sem ${n}`));
  const onboardingSlides=[{emoji:"🌱",title:"Organiza tu cambio",desc:"Perfil personalizado según tus objetivos y restricciones"},{emoji:"🥗",title:"Tu alimentación, ordenada",desc:"Menú semanal generado con IA basado en tu despensa"},{emoji:"✦",title:"Con un profesional real",desc:"Tu asistente IA entrena contigo y adapta planes"}];

  /* ── LANDING PAGE (Sin usuario, primera visita) ────────── */
  if(showLanding && !user) {
    window.location.replace("/landing/");
    return null;
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
    const card={width:"100%",maxWidth:400,background:T.surface,borderRadius:16,padding:"40px 28px",border:`1px solid ${T.border}`,position:"relative"};
    if(modo==="welcome")return wrap(
      <div style={card} className="fade-up">
        <div style={{textAlign:"center"}}>
          <div style={{marginBottom:4,display:"flex",justifyContent:"center"}}><TriFlowLogo T={T} size={30}/></div>
          <div style={{height:24}}/>

          <div style={{fontSize:20,fontWeight:600,color:T.charcoal,marginBottom:8}}>¿Ya tienes cuenta?</div>
          <div style={{fontSize:14,color:T.textSub,marginBottom:32}}>Elige cómo deseas continuar</div>
          <button onClick={()=>{setModo("login");setError("");}} style={btn(T.sage,{marginBottom:12})}>Iniciar sesión</button>
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
        {modo==="registro"&&<div style={{marginBottom:20}}><div style={{fontSize:20,fontWeight:600,color:T.charcoal,marginBottom:6}}>Crear tu cuenta</div><button onClick={()=>{setModo("welcome");setError("");}} style={{background:"none",border:"none",color:T.textSub,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",textDecoration:"underline"}}>← Atrás</button></div>}
        {error&&<div style={{background:T.clay+"22",border:`1px solid ${T.clay}`,borderRadius:12,padding:"12px",marginBottom:16,fontSize:14,color:T.clay}}>{error}</div>}
        <input type="email" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={inp()}/>
        <div style={{position:"relative",marginBottom:20}}><input type={showPass?"text":"password"} placeholder="Contraseña" value={pass} onChange={e=>setPass(e.target.value)} style={inp({marginBottom:0,paddingRight:40})}/><button onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:12,top:12,background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.textSub}}>{showPass?"👁️":"👁️‍🗨️"}</button></div>
        {modo==="login"&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20,fontSize:14}}><input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} style={{cursor:"pointer"}}/><label style={{cursor:"pointer",color:T.textMid}}>Recordar usuario</label></div>}
        <button onClick={handleAuth} disabled={loading||!email||!pass} style={btn(email&&pass&&!loading?T.sage:T.muted)}>{loading?"Cargando...":modo==="login"?"Iniciar sesión":"Crear cuenta"}</button>
        {modo==="login"&&<button onClick={()=>{setModo("welcome");setError("");}} style={{width:"100%",marginTop:12,padding:10,borderRadius:99,background:"transparent",border:`1px solid ${T.border}`,color:T.charcoal,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:14}}>¿No tienes cuenta? Regístrate</button>}
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
      <div style={{flex:1,overflowY:"auto",background:T.bg,transition:"background .4s",paddingBottom:60}}>

          {/* ═══ INICIO ═══ */}
          {tab==="inicio"&&(
            <div style={{paddingBottom:16}} className="mode-in">
              {/* Header */}
              <div style={{padding:"18px 20px 12px",background:T.surface,borderBottom:`1px solid ${T.border}`,transition:"all .4s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,color:T.textSub}}>{saludo}</div>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal,marginTop:2}}>{profile?.nombre} <span style={{color:T.sage,opacity:.6}}>✦</span></div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <ThemeToggle dark={dark} toggle={toggleTheme} T={T}/>
                    <div onClick={()=>setTab("perfil")} style={{cursor:"pointer"}}><Avatar name={`${profile?.nombre||"U"} ${profile?.apellido||""}`} size={40} T={T}/></div>
                  </div>
                </div>
                {/* Day tracker */}
                <div style={{display:"flex",gap:5,marginTop:12}}>
                  {DIAS_C.map((d,i)=>{
                    const tieneMenu=menu.some(m=>m.dia===DIAS[i]);
                    const esHoy=i===hoyIdx;
                    return(<div key={i} style={{flex:1,textAlign:"center"}}>
                      <div style={{width:"100%",height:4,borderRadius:99,background:tieneMenu?T.sage:esHoy?T.sageL:T.border,marginBottom:4,transition:"background .3s"}}/>
                      <div style={{fontSize:11,color:esHoy?T.sage:T.textSub,fontWeight:esHoy?600:400}}>{d}</div>
                    </div>);
                  })}
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
                  const semanasAlObjetivo=velSemanal!==0&&Math.sign(velSemanal)===Math.sign(pm-pa)?Math.abs(diff/velSemanal):null;
                  const progPct=Math.max(5,Math.min(100,100-(diff/(pa||1)*100)));
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
                          <WeightSparkline data={ultimos} color={bajando?T.sage:T.sky} width={90} height={36}/>
                          {!showPesoInput&&(
                            <button onClick={()=>{setShowPesoInput(true);setNuevoPesoVal(pa.toFixed(1));}} style={{padding:"4px 10px",borderRadius:99,border:`1.5px solid ${T.sage}`,background:"transparent",fontSize:11,color:T.sageD,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>+ Registrar</button>
                          )}
                        </div>
                      </div>
                      {showPesoInput&&(
                        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                          <input type="number" step="0.1" value={nuevoPesoVal} onChange={e=>setNuevoPesoVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&registrarPeso()} placeholder="kg" style={{flex:1,padding:"8px 12px",borderRadius:12,border:`1.5px solid ${T.sage}`,background:T.surface,fontSize:14,color:T.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif"}} autoFocus/>
                          <button onClick={registrarPeso} style={{padding:"8px 16px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>Guardar</button>
                          <button onClick={()=>setShowPesoInput(false)} style={{padding:"8px",borderRadius:99,background:T.border,border:"none",color:T.textMid,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>✕</button>
                        </div>
                      )}
                      <div style={{background:T.border,borderRadius:99,height:5,overflow:"hidden",marginBottom:4}}>
                        <div style={{width:progPct+"%",height:"100%",background:`linear-gradient(90deg,${T.sage},${T.sageL})`,borderRadius:99,transition:"width .8s ease"}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div style={{fontSize:11,color:T.textSub}}>{historialPeso.length} registros</div>
                        {semanasAlObjetivo&&<div style={{fontSize:11,color:T.textSub}}>~{Math.ceil(semanasAlObjetivo)} sem al objetivo</div>}
                        {velSemanal!==0&&ultimos.length>=2&&<div style={{fontSize:11,color:T.textSub}}>{velSemanal<0?"":"+"}{velSemanal.toFixed(2)} kg/sem</div>}
                      </div>
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
                    <div style={{fontSize:11,color:T.textSub,marginTop:5}}>{agua}/8 vasos · {agua>=8?"¡Meta cumplida! 🎉":agua>=5?"Casi llegamos":"Sigue hidratándote"}</div>
                  </div>
                </div>

                {/* Menú hoy */}
                {menuHoy?(
                  <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,transition:"all .4s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace"}}>MENÚ DE HOY</div>
                      <button onClick={()=>setTab("habito")} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:T.sage,fontFamily:"'DM Sans',sans-serif"}}>Ver todo →</button>
                    </div>
                    {[["🌅",menuHoy.desayuno],["☀️",menuHoy.almuerzo],["🍎",menuHoy.snack],["🌙",menuHoy.cena]].filter(([,v])=>v).map(([emoji,texto],i,arr)=>(
                      <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"7px 0",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none"}}>
                        <span style={{fontSize:14,marginTop:1}}>{emoji}</span>
                        <div style={{fontSize:14,color:T.charcoal,flex:1,lineHeight:1.35}}>{texto}</div>
                      </div>
                    ))}
                  </div>
                ):(
                  <div style={{background:T.sage+"14",borderRadius:16,padding:"16px 18px",border:`1px solid ${T.sage}22`,textAlign:"center"}}>
                    <div style={{fontSize:14,color:T.sageD,marginBottom:8}}>No hay menú generado aún</div>
                    <button onClick={()=>setTab("habito")} style={{padding:"8px 18px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Generar menú ✦</button>
                  </div>
                )}

                {/* Alerta despensa */}
                {stockCritico.length>0&&(
                  <div style={{background:dark?T.clay+"18":`linear-gradient(135deg,${T.sand}18,${T.clay}10)`,borderRadius:16,padding:"16px",border:`1px solid ${T.clay}33`,transition:"all .4s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{fontSize:11,color:T.sand,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>⚠ DESPENSA</div>
                      <button onClick={()=>setTab("despensa")} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.clay,fontFamily:"'DM Sans',sans-serif"}}>Ver lista →</button>
                    </div>
                    <div style={{fontSize:14,color:T.charcoal,marginBottom:8}}>Faltan <strong>{stockCritico.length} productos</strong> para tu menú.</div>
                    <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{stockCritico.slice(0,3).map(p=><Chip key={p.id} color={T.clay} T={T}>{p.nombre}</Chip>)}</div>
                  </div>
                )}

                {/* Motivación */}
                <div style={{background:dark?T.sage+"18":`linear-gradient(135deg,${T.sage}20,${T.sage}08)`,borderRadius:16,padding:"16px 18px",border:`1px solid ${T.sage}33`,transition:"all .4s"}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontStyle:"italic",color:T.sageD,marginBottom:6}}>"La constancia es el hábito más valioso."</div>
                  <div style={{fontSize:14,color:T.textMid,lineHeight:1.65,marginBottom:10}}>
                    <strong style={{color:T.charcoal}}>{sesiones.filter(s=>s.completada).length}/{sesiones.length}</strong> sesiones completadas · <strong style={{color:T.charcoal}}>💧 {agua}/8</strong> vasos hoy
                  </div>
                  <button onClick={()=>setTab("asistente")} style={{background:"none",border:`1.5px solid ${T.sage}`,borderRadius:99,padding:"8px 16px",cursor:"pointer",fontSize:14,color:T.sageD,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>Hablar con mi asistente →</button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ EL HÁBITO ═══ */}
          {tab==="habito"&&(
            <div style={{paddingBottom:16}}>
              <div style={{padding:"18px 20px 0",background:T.surface,borderBottom:`1px solid ${T.border}`,transition:"all .4s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal}}>El Hábito</div>
                    <div style={{fontSize:14,color:T.textSub,marginTop:2}}>Tu menú semanal personalizado</div>
                  </div>
                  {menu.length>0&&<button onClick={generarMenu} disabled={menuLoading} style={{padding:"8px 14px",borderRadius:99,background:menuLoading?T.muted:T.sage,border:"none",color:"#fff",fontSize:11,cursor:menuLoading?"default":"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",marginTop:4}}>{menuLoading?"Generando...":"↻ Regenerar"}</button>}
                </div>
                {menu.length>0&&(
                  <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:0}}>
                    {DIAS.map((d,i)=>{
                      const tieneMenu=menu.some(m=>m.dia===d);
                      return(<button key={i} onClick={()=>setDiaMenu(i)} style={{padding:"7px 11px",borderRadius:99,fontSize:12,fontWeight:500,whiteSpace:"nowrap",background:diaMenu===i?T.sage:"transparent",color:diaMenu===i?"#fff":tieneMenu?T.textMid:T.muted,border:diaMenu===i?"none":`1px solid ${T.border}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s",marginBottom:12,flexShrink:0}}>
                        {d.slice(0,3)}{i===hoyIdx?" ·":""}
                      </button>);
                    })}
                  </div>
                )}
              </div>
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
                  const md=menu.find(m=>m.dia===DIAS[diaMenu])||menu[Math.min(diaMenu,menu.length-1)];
                  return md?(<>
                    {[["🌅","DESAYUNO","desayuno"],["☀️","ALMUERZO","almuerzo"],["🍎","ONCE","snack"],["🌙","CENA","cena"]].map(([emoji,label,key])=>md[key]&&(
                      <div key={key} style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,transition:"all .4s"}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                          <span style={{fontSize:14}}>{emoji}</span>
                          <span style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace"}}>{label}</span>
                        </div>
                        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,color:T.charcoal,lineHeight:1.4}}>{md[key]}</div>
                      </div>
                    ))}
                  </>):null;
                })()}
                {listaCompra.length>0&&(
                  <div style={{background:T.sand+"14",border:`1px solid ${T.sand}44`,borderRadius:16,padding:"16px",marginTop:4}}>
                    <div style={{fontSize:14,fontWeight:600,color:T.sand,marginBottom:4}}>🛒 Sugerencias para tu despensa</div>
                    <div style={{fontSize:11,color:T.textSub,marginBottom:10}}>Productos faltantes para este menú</div>
                    {listaCompra.map((item,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:i>0?`1px solid ${T.border}`:"none",gap:10}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>{item.nombre} <span style={{color:T.textSub,fontWeight:400}}>· {item.cantidad}{item.unidad}</span></div>
                          {item.motivo&&<div style={{fontSize:11,color:T.textSub,marginTop:2}}>{item.motivo}</div>}
                        </div>
                        <button onClick={()=>agregarSugerencia(item,i)} style={{padding:"6px 12px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>+ Agregar</button>
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
              <div style={{padding:"18px 20px 0",background:T.surface,borderBottom:`1px solid ${T.border}`,transition:"all .4s"}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal,marginBottom:12}}>La Despensa</div>
                <div style={{display:"flex"}}>
                  {[["stock","Mi stock"],["compras","Lista compras"],["scan","Escanear"]].map(([id,label])=>(
                    <button key={id} onClick={()=>setDespensaTab(id)} style={{padding:"9px 14px",fontSize:14,fontWeight:500,borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:`2px solid ${despensaTab===id?T.sage:"transparent"}`,color:despensaTab===id?T.sage:T.textMid,background:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s",marginBottom:0}}>{label}</button>
                  ))}
                </div>
              </div>

              {despensaTab==="stock"&&(
                <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:9}} className="fade-in">
                  <button onClick={()=>setMostrarForm(!mostrarForm)} style={{padding:"9px 16px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",alignSelf:"flex-start"}}>+ Agregar producto</button>
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
                    <div style={{background:T.card,borderRadius:16,padding:24,border:`1px solid ${T.border}`,textAlign:"center"}}>
                      <div style={{fontSize:32,marginBottom:12}}>📦</div>
                      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,letterSpacing:"-0.02em",color:T.charcoal,marginBottom:6}}>Despensa vacía</div>
                      <div style={{fontSize:14,color:T.textMid}}>Agrega tus productos para hacer seguimiento.</div>
                    </div>
                  ):stock.map(s=>(
                    <div key={s.id} style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${s.cantidad<=(s.minimo||0)?T.clay+"33":T.border}`,display:"flex",alignItems:"center",gap:12,transition:"all .4s"}}>
                      <div style={{width:9,height:9,borderRadius:99,background:s.cantidad<=(s.minimo||0)?T.clay:T.sage,flexShrink:0}}/>
                      <div style={{flex:1}}><div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>{s.nombre}</div><div style={{fontSize:11,color:T.textSub,marginTop:1}}>{s.cantidad} {s.unidad}</div></div>
                      {s.cantidad<=(s.minimo||0)&&<Chip color={T.clay} T={T}>Reponer</Chip>}
                      <button onClick={()=>eliminarProducto(s.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:T.muted,padding:0,lineHeight:1}}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {despensaTab==="compras"&&(
                <div style={{padding:"16px"}} className="fade-in">
                  {listaCompra.length===0?(
                    <div style={{background:T.card,borderRadius:16,padding:28,border:`1px solid ${T.border}`,textAlign:"center"}}>
                      <div style={{fontSize:32,marginBottom:12}}>🛒</div>
                      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,letterSpacing:"-0.02em",color:T.charcoal,marginBottom:6}}>Sin lista de compras</div>
                      <div style={{fontSize:14,color:T.textMid,lineHeight:1.6}}>Genera tu menú para obtener sugerencias de compra.</div>
                    </div>
                  ):(<>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,letterSpacing:"-0.02em",color:T.charcoal,marginBottom:4}}>{listaCompra.length} productos por comprar</div>
                    <div style={{fontSize:14,color:T.textSub,marginBottom:14}}>Basado en tu menú semanal</div>
                    <div style={{display:"flex",flexDirection:"column",gap:9}}>
                      {listaCompra.map((item,i)=>(
                        <div key={i} style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.clay}33`,display:"flex",alignItems:"center",gap:12}}>
                          <div style={{flex:1}}><div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>{item.nombre} <span style={{color:T.textSub,fontWeight:400}}>· {item.cantidad}{item.unidad}</span></div>{item.motivo&&<div style={{fontSize:11,color:T.textSub,marginTop:2}}>{item.motivo}</div>}</div>
                          <button onClick={()=>agregarSugerencia(item,i)} style={{padding:"7px 13px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>+ Agregar</button>
                        </div>
                      ))}
                    </div>
                  </>)}
                </div>
              )}

              {despensaTab==="scan"&&(
                <div style={{padding:"36px 20px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:16}} className="fade-in">
                  <div style={{width:100,height:100,borderRadius:99,background:T.sage+"18",border:`2px dashed ${T.sage}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>⬡</div>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:19,color:T.charcoal}}>Escanea un producto</div>
                  <div style={{fontSize:14,color:T.textMid,lineHeight:1.7,maxWidth:260}}>Apunta al código de barras para registrar el producto con sus datos nutricionales.</div>
                  <button onClick={()=>setShowScanner(true)} style={{width:"100%",maxWidth:280,padding:"12px",borderRadius:99,border:"none",cursor:"pointer",background:T.charcoal,color:T.bg,fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:500}}>Abrir cámara 📷</button>
                </div>
              )}

              {/* Modal escáner */}
              {showScanner&&(
                <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}}>
                  <div style={{background:T.surface,borderRadius:16,padding:24,width:"90%",maxWidth:400,maxHeight:"80vh",overflow:"auto",position:"relative"}}>
                    <button onClick={()=>setShowScanner(false)} style={{position:"absolute",top:12,right:12,width:32,height:32,borderRadius:99,background:T.card,border:`1px solid ${T.border}`,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>×</button>
                    {!scannedProduct?(
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:20,fontWeight:600,color:T.charcoal,marginBottom:14}}>Escanear Producto</div>
                        <div id="reader" style={{marginBottom:14,borderRadius:12,overflow:"hidden",background:T.bg}}/>
                        {scanLoading&&<div style={{fontSize:14,color:T.textSub}}>Buscando producto...</div>}
                      </div>
                    ):(
                      <div>
                        <div style={{fontSize:20,fontWeight:600,color:T.charcoal,marginBottom:14}}>Confirmar Producto</div>
                        {scannedProduct.imagen&&<img src={scannedProduct.imagen} alt={scannedProduct.nombre} style={{width:"100%",borderRadius:12,marginBottom:12,maxHeight:180,objectFit:"cover"}}/>}
                        <div style={{background:T.card,borderRadius:12,padding:12,marginBottom:12}}>
                          <div style={{fontSize:14,fontWeight:600,color:T.charcoal,marginBottom:4}}>{scannedProduct.nombre}</div>
                          {scannedProduct.marca&&<div style={{fontSize:12,color:T.textSub,marginBottom:6}}>{scannedProduct.marca}</div>}
                          {scannedProduct.energia&&<div style={{fontSize:11,color:T.textMid,marginBottom:2}}>Energía: {scannedProduct.energia} kcal</div>}
                          {scannedProduct.proteinas&&<div style={{fontSize:11,color:T.textMid,marginBottom:2}}>Proteínas: {scannedProduct.proteinas}g</div>}
                          {scannedProduct.grasas&&<div style={{fontSize:11,color:T.textMid,marginBottom:2}}>Grasas: {scannedProduct.grasas}g</div>}
                          {scannedProduct.carbohidratos&&<div style={{fontSize:11,color:T.textMid}}>Carbos: {scannedProduct.carbohidratos}g</div>}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                          <input type="number" placeholder="Cantidad" value={scannedProduct.cantidad||1} onChange={e=>setScannedProduct({...scannedProduct,cantidad:e.target.value})} style={inp({marginBottom:0})}/>
                          <select value={scannedProduct.unidad||"un"} onChange={e=>setScannedProduct({...scannedProduct,unidad:e.target.value})} style={{...inp({marginBottom:0}),padding:"12px",fontSize:14}}><option value="g">g</option><option value="kg">kg</option><option value="ml">ml</option><option value="L">L</option><option value="un">un</option></select>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>{setScannedProduct(null);setScannedCode("");}} style={btn(T.muted,{flex:1})}>Cancelar</button>
                          <button onClick={confirmarProductoEscaneado} style={btn(T.sage,{flex:1})}>Agregar</button>
                        </div>
                      </div>
                    )}
                  </div>
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
                if(!s){setSesionAbierta(null);return null;}
                const ejercicios=parsarEjercicios(s.descripcion);
                const semNum=parseInt((s.grupo||"").match(/\d+/)?.[0]||"1");
                const grupoNombre=(s.grupo||"").replace(/^Sem \d+ · /,"");
                const faseNombre=["Activación","Volumen","Intensidad","Descarga"][semNum-1]||"";
                const logs=logsActuales[s.id]||{};
                const totalSeries=ejercicios.reduce((acc,ej)=>acc+ej.series,0);
                const seriesHechas=Object.values(logs).flatMap(x=>x).filter(x=>x.done).length;
                return(<>
                  {/* Header sesión */}
                  <div style={{padding:"14px 18px 14px",background:T.surface,borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:10,transition:"all .4s"}}>
                    <button onClick={()=>setSesionAbierta(null)} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",color:T.violet,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,padding:0,marginBottom:10}}>← Volver al plan</button>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:11,color:T.violet,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>SEMANA {semNum} · {faseNombre.toUpperCase()}</div>
                        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:600,letterSpacing:"-0.02em",color:T.charcoal}}>{s.dia}</div>
                        <div style={{fontSize:14,color:T.textSub,marginTop:1}}>{grupoNombre}</div>
                      </div>
                      {totalSeries>0&&<div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:600,letterSpacing:"-0.025em",color:seriesHechas===totalSeries?T.sage:T.violet}}>{seriesHechas}/{totalSeries}</div>
                        <div style={{fontSize:11,color:T.textSub}}>series</div>
                      </div>}
                    </div>
                    {totalSeries>0&&<div style={{marginTop:10,background:T.border,borderRadius:99,height:4,overflow:"hidden"}}>
                      <div style={{width:`${(seriesHechas/totalSeries)*100}%`,height:"100%",background:seriesHechas===totalSeries?T.sage:T.violet,borderRadius:99,transition:"width .4s ease"}}/>
                    </div>}
                  </div>
                  {/* Ejercicios */}
                  <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:12}} className="fade-in">
                    {ejercicios.length===0?(
                      <div style={{background:T.card,borderRadius:16,padding:"28px 20px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                        <div style={{fontSize:32,marginBottom:8}}>🔄</div>
                        <div style={{fontSize:14,color:T.charcoal,marginBottom:6,fontWeight:500}}>Esta sesión no tiene ejercicios detallados</div>
                        <div style={{fontSize:12,color:T.textSub,marginBottom:16,lineHeight:1.6}}>Regenera el mesociclo para obtener ejercicios con series y repeticiones.</div>
                        <button onClick={()=>{setSesionAbierta(null);generarEntrenamiento();}} style={{padding:"10px 20px",borderRadius:99,background:T.violet,border:"none",color:"#fff",fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>↻ Regenerar mesociclo</button>
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
                            {allDone&&<div style={{width:28,height:28,borderRadius:99,background:T.violet,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,flexShrink:0}}>✓</div>}
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
                                <button onClick={()=>toggleSetDone(s.id,ej.nombre,setIdx)} style={{width:36,height:36,borderRadius:99,background:setLog.done?T.violet:T.border,border:"none",color:setLog.done?"#fff":T.muted,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .25s",flexShrink:0}}>✓</button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                    {/* Finalizar sesión */}
                    <button onClick={()=>finalizarSesion(sesionAbierta)} style={{padding:"16px",borderRadius:99,background:s.completada?T.muted:seriesHechas===totalSeries&&totalSeries>0?T.sage:T.violet,border:"none",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:4,transition:"background .4s"}}>
                      {s.completada?"✓ Sesión completada":seriesHechas===totalSeries&&totalSeries>0?"✓ ¡Todas las series! Finalizar":"Finalizar sesión →"}
                    </button>
                  </div>
                </>);
              })():(
                /* ═══ VISTA LISTA DE SESIONES ═══ */
                <>
                  <div style={{padding:"18px 20px 14px",background:T.surface,borderBottom:`1px solid ${T.border}`,transition:"all .4s"}}>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal}}>La Transformación <span style={{color:T.violet,opacity:.6}}>✦</span></div>
                    <div style={{fontSize:14,color:T.textSub,marginTop:2}}>Tu plan de entrenamiento mensual</div>
                    {sesiones.length>0&&(
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:12}}>
                        {[[`${sesiones.filter(s=>s.completada).length}/${sesiones.length}`,"Sesiones","completadas"],[`${sesiones.length?Math.round((sesiones.filter(s=>s.completada).length/sesiones.length)*100):0}%`,"Adherencia","al plan"],["4 sem","Progreso","del plan"]].map(([v,k,sb])=>(
                          <div key={k} style={{background:T.bg,borderRadius:12,padding:"10px 8px",textAlign:"center",transition:"background .4s"}}>
                            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:600,letterSpacing:"-0.02em",color:T.violet}}>{v}</div>
                            <div style={{fontSize:11,color:T.charcoal,fontWeight:500}}>{k}</div>
                            <div style={{fontSize:11,color:T.textSub}}>{sb}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:12}} className="mode-in">
                    {entrenamientoError&&<div style={{fontSize:12,color:T.clay,background:T.clay+"18",padding:12,borderRadius:12}}>{entrenamientoError}</div>}
                    {sesiones.length===0?(
                      <div style={{background:T.card,borderRadius:16,padding:"32px 24px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                        <div style={{fontSize:32,marginBottom:14}}>💪</div>
                        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,letterSpacing:"-0.02em",color:T.charcoal,marginBottom:8}}>Sin plan aún</div>
                        <div style={{fontSize:14,color:T.textMid,marginBottom:18,lineHeight:1.6}}>Genera tu primer mesociclo personalizado de 4 semanas.</div>
                        <button onClick={generarEntrenamiento} disabled={entrenamientoLoading} style={{padding:"13px 28px",borderRadius:99,background:entrenamientoLoading?T.muted:T.violet,border:"none",color:"#fff",fontSize:14,cursor:entrenamientoLoading?"default":"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{entrenamientoLoading?"Generando...":"✦ Generar Mesociclo"}</button>
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
                      {/* Cards de sesiones */}
                      {sesPorSemana(semanaActiva).length>0?sesPorSemana(semanaActiva).map(s=>{
                        const ejercicios=parsarEjercicios(s.descripcion);
                        const sLogs=s.logs||{};
                        const totalSer=ejercicios.reduce((acc,ej)=>acc+ej.series,0);
                        const hechas=Object.values(sLogs).flatMap(x=>x).filter(x=>x.done).length;
                        return(
                          <div key={s.id} style={{background:T.card,borderRadius:16,border:`1.5px solid ${s.completada?T.violet+"55":T.border}`,overflow:"hidden",transition:"all .25s",position:"relative"}}>
                            {s.completada&&<div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:T.violet}}/>}
                            <div style={{padding:"15px 16px",display:"flex",alignItems:"center",gap:12}}>
                              <div style={{width:44,height:44,borderRadius:12,background:s.completada?T.violet+"22":T.bg,border:`1.5px solid ${s.completada?T.violet+"66":T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0,transition:"all .3s"}}>{s.completada?"✓":"🏋️"}</div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:14,fontWeight:600,color:s.completada?T.textSub:T.charcoal}}>{s.dia}</div>
                                <div style={{fontSize:12,color:s.completada?T.muted:T.violet,marginTop:1,fontWeight:500}}>{(s.grupo||"").replace(/^Sem \d+ · /,"")}</div>
                                <div style={{fontSize:11,color:T.textSub,marginTop:2}}>
                                  {ejercicios.length>0?`${ejercicios.length} ejercicios${totalSer>0?` · ${hechas}/${totalSer} series`:""}`:s.descripcion?"Ver ejercicios":"Sin detalle — regenerar"}
                                </div>
                              </div>
                              <button onClick={()=>abrirSesion(s.id)} style={{padding:"9px 16px",borderRadius:99,background:s.completada?T.border:T.violet,border:"none",color:s.completada?T.textMid:"#fff",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,flexShrink:0,transition:"all .2s"}}>
                                {s.completada?"Ver":"Iniciar →"}
                              </button>
                            </div>
                            {totalSer>0&&hechas>0&&!s.completada&&(
                              <div style={{height:3,background:T.border}}>
                                <div style={{width:`${(hechas/totalSer)*100}%`,height:"100%",background:T.violet,transition:"width .4s ease"}}/>
                              </div>
                            )}
                          </div>
                        );
                      }):(
                        <div style={{background:T.card,borderRadius:16,padding:"24px 20px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                          <div style={{fontSize:28,marginBottom:8}}>🔒</div>
                          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,color:T.charcoal,marginBottom:4}}>Sin sesiones en esta semana</div>
                          <div style={{fontSize:12,color:T.textSub,lineHeight:1.6}}>Regenera el mesociclo para obtener sesiones.</div>
                        </div>
                      )}
                      {/* Regenerar */}
                      <button onClick={generarEntrenamiento} disabled={entrenamientoLoading} style={{padding:"12px",borderRadius:99,border:`1.5px solid ${T.violet}`,background:"transparent",color:T.violet,fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:500,cursor:entrenamientoLoading?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
                        {entrenamientoLoading?"Regenerando...":"↻ Regenerar mesociclo con IA"}
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
              <div style={{padding:"16px 18px 12px",background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0,transition:"all .4s"}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:600,letterSpacing:"-0.02em",color:T.charcoal}}>Tu asistente <span style={{color:T.sage,opacity:.6}}>✦</span></div>
                <div style={{fontSize:12,color:T.textSub,marginTop:2}}>IA personalizada con tu perfil y despensa</div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:12,background:T.bg}}>
                {msgs.map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:9}}>
                    {m.role==="assistant"&&<div style={{width:29,height:29,borderRadius:99,background:`linear-gradient(135deg,${T.sage},${T.sageD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,marginTop:3}}>✦</div>}
                    <div style={{maxWidth:"78%",padding:"11px 14px",borderRadius:17,background:m.role==="user"?T.sage:T.card,border:m.role==="user"?"none":`1px solid ${T.border}`,borderBottomRightRadius:m.role==="user"?3:17,borderBottomLeftRadius:m.role==="assistant"?3:17,fontSize:14,color:m.role==="user"?"#fff":T.charcoal,lineHeight:1.65,transition:"background .4s,border-color .4s"}}>
                      {m.text.split("\n").map((line,j,arr)=><span key={j}>{line.split(/(\*\*[^*]+\*\*)/).map((p,k)=>p.startsWith("**")?<strong key={k}>{p.slice(2,-2)}</strong>:p)}{j<arr.length-1&&<br/>}</span>)}
                    </div>
                  </div>
                ))}
                {chatLoading&&<div style={{display:"flex",gap:9,alignItems:"flex-end"}}><div style={{width:29,height:29,borderRadius:99,background:`linear-gradient(135deg,${T.sage},${T.sageD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>✦</div><div style={{padding:"11px 14px",borderRadius:17,borderBottomLeftRadius:3,background:T.card,border:`1px solid ${T.border}`}}><div style={{display:"flex",gap:5}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:99,background:T.muted,animation:`pulse 1.2s ease-in-out ${i*.2}s infinite`}}/>)}</div></div></div>}
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
              <div style={{padding:"7px 10px",display:"flex",gap:6,overflowX:"auto",background:T.surface,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
                {["¿Qué puedo cocinar con mi despensa?","Genera mi menú semanal","Crea mi plan de entrenamiento","¿Cómo voy con mi objetivo?"].map(s=>(
                  <button key={s} onClick={()=>setChatInput(s)} style={{padding:"6px 12px",borderRadius:99,fontSize:11,border:`1px solid ${T.border}`,background:T.card,color:T.textMid,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif",flexShrink:0,transition:"all .3s"}}>{s}</button>
                ))}
              </div>
              <div style={{padding:"8px 10px 12px",display:"flex",gap:8,background:T.surface,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Escribe tu consulta..." style={{flex:1,padding:"10px 13px",borderRadius:12,border:`1.5px solid ${T.border}`,background:T.card,fontSize:14,color:T.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif",transition:"all .4s"}}/>
                <button onClick={sendChat} disabled={chatLoading} style={{width:44,height:44,borderRadius:99,background:chatLoading?T.muted:T.sage,border:"none",color:"#fff",fontSize:20,cursor:chatLoading?"default":"pointer",flexShrink:0,transition:"background .2s"}}>→</button>
              </div>
            </div>
          )}

          {/* ═══ PERFIL ═══ */}
          {tab==="perfil"&&(
            <div style={{paddingBottom:16}}>
              <div style={{padding:"18px 20px 16px",background:T.surface,borderBottom:`1px solid ${T.border}`,transition:"all .4s"}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:600,letterSpacing:"-0.025em",color:T.charcoal}}>Mi perfil</div>
              </div>
              <div style={{padding:"18px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                  <Avatar name={`${profile?.nombre||"U"} ${profile?.apellido||""}`} size={56} T={T}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:600,letterSpacing:"-0.02em",color:T.charcoal,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      {profile?.nombre} {profile?.apellido}
                      {profile?.pais&&(()=>{const p=PAISES.find(x=>x.n===profile.pais);return p?<span title={p.n} style={{fontSize:20}}>{p.f}</span>:null;})()}
                    </div>
                    <div style={{fontSize:12,color:T.textSub,marginBottom:6}}>{user?.email}</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <Chip color={T.sage} T={T}>{profile?.objetivo?.replace(/_/g," ")}</Chip>
                      {profile?.restricciones?.map(r=><Chip key={r} color={T.sand} T={T}>{r}</Chip>)}
                    </div>
                  </div>
                </div>
                <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,transition:"all .4s"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>País</div>
                    <div style={{fontSize:12,color:T.textSub,marginTop:1}}>Personaliza tus menús con comida local</div>
                  </div>
                  <select value={profile?.pais||"Chile"} onChange={async e=>{const np=e.target.value;setProfile(p=>({...p,pais:np}));await supabase.from("profiles").update({pais:np}).eq("id",user.id);}} style={{padding:"7px 10px",borderRadius:12,border:`1.5px solid ${T.border}`,background:T.surface,fontSize:14,color:T.charcoal,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",outline:"none"}}>
                    {PAISES.map(p=>(<option key={p.n} value={p.n}>{p.f}  {p.n}</option>))}
                  </select>
                </div>
                <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:10,transition:"all .4s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>Días de entrenamiento</div>
                      <div style={{fontSize:12,color:T.textSub,marginTop:1}}>Sesiones por semana para tu mesociclo</div>
                    </div>
                    <span style={{fontSize:14,fontWeight:700,color:T.violet}}>{profile?.dias_entrenamiento||3} días/sem</span>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    {[2,3,4,5,6].map(d=>{const a=(profile?.dias_entrenamiento||3)===d;return(
                      <button key={d} onClick={async()=>{setProfile(p=>({...p,dias_entrenamiento:d}));await supabase.from("profiles").update({dias_entrenamiento:d}).eq("id",user.id);}} style={{flex:1,padding:"10px 0",borderRadius:12,border:`2px solid ${a?T.violet:T.border}`,background:a?T.violet+"22":"transparent",color:a?T.violet:T.textMid,fontWeight:a?700:400,cursor:"pointer",fontSize:16,transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>{d}</button>
                    );})}
                  </div>
                </div>
                <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all .4s"}}>
                  <div><div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>{dark?"Modo oscuro activo":"Modo claro activo"}</div><div style={{fontSize:12,color:T.textSub,marginTop:1}}>Cambia la apariencia de la app</div></div>
                  <ThemeToggle dark={dark} toggle={toggleTheme} T={T}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
                  {[["PESO ACTUAL",`${profile?.peso_actual||"—"} kg`,T.charcoal],["META",`${profile?.peso_meta||"—"} kg`,T.sage],["SESIONES ✓",sesiones.filter(s=>s.completada).length,T.violet],["POR BAJAR",`${((parseFloat(profile?.peso_actual)||0)-(parseFloat(profile?.peso_meta)||0)).toFixed(1)} kg`,T.clay]].map(([k,v,c])=>(
                    <div key={k} style={{background:T.card,borderRadius:12,padding:"12px",border:`1px solid ${T.border}`,transition:"all .4s"}}>
                      <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em",fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>{k}</div>
                      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:600,letterSpacing:"-0.02em",color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
                {[["Objetivo actual",profile?.objetivo?.replace(/_/g," ")||"—",()=>{}],["Cerrar sesión","Salir de tu cuenta",logout]].map(([label,sub,action])=>(
                  <div key={label} onClick={action} style={{background:T.card,borderRadius:12,padding:"16px",border:`1px solid ${T.border}`,marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",transition:"all .4s"}}>
                    <div><div style={{fontSize:14,color:label==="Cerrar sesión"?T.clay:T.charcoal,fontWeight:500}}>{label}</div><div style={{fontSize:11,color:T.textSub,marginTop:2}}>{sub}</div></div>
                    <span style={{color:T.muted,fontSize:20}}>›</span>
                  </div>
                ))}
              </div>
            </div>
          )}

      </div>

      {/* NavBar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,height:60,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",transition:"background .4s,border-color .4s",zIndex:1000}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,border:"none",background:"transparent",cursor:"pointer"}}>
            <span style={{fontSize:tab===t.id?18:16,color:tab===t.id?T.sage:T.muted,transition:"all .2s"}}>{t.icon}</span>
            <span style={{fontSize:11,color:tab===t.id?T.sage:T.muted,fontWeight:tab===t.id?600:400,fontFamily:"'DM Sans',sans-serif",transition:"color .2s"}}>{t.label}</span>
            {tab===t.id&&<div style={{width:16,height:2,borderRadius:99,background:T.sage,marginTop:1}}/>}
          </button>
        ))}
      </div>
      {showWarningEntrenamiento&&(
        <div onClick={()=>setShowWarningEntrenamiento(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(3px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:16,padding:"28px 24px",maxWidth:340,width:"100%",border:`1px solid ${T.border}`,animation:"modeIn .25s ease",boxShadow:"0 24px 60px rgba(0,0,0,.25)"}}>
            <div style={{textAlign:"center",marginBottom:18}}>
              <div style={{fontSize:32,marginBottom:10}}>⚠️</div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:600,letterSpacing:"-0.02em",color:T.charcoal,marginBottom:10}}>¿Reemplazar plan actual?</div>
              <div style={{fontSize:14,color:T.textMid,lineHeight:1.7}}>
                Tienes <strong style={{color:T.clay}}>{sesiones.filter(s=>!s.completada).length} sesiones</strong> pendientes con registros de peso y repeticiones. Al generar un nuevo mesociclo, todo ese progreso se perderá.
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:4}}>
              <button onClick={()=>{setShowWarningEntrenamiento(false);setAccionSugerida(null);}} style={{flex:1,padding:"12px",borderRadius:99,background:T.border,border:"none",color:T.charcoal,cursor:"pointer",fontSize:14,fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>Cancelar</button>
              <button onClick={()=>{setShowWarningEntrenamiento(false);ejecutarAccionAsistente("entrenamiento",null);}} style={{flex:1,padding:"12px",borderRadius:99,background:T.clay,border:"none",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Sí, reemplazar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
