import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Html5QrcodeScanner } from "html5-qrcode";

const supabase = createClient("https://uiktwbtwzotqduzwtjcb.supabase.co","sb_publishable_ONXQyJvXKUIUqppaWnZG4w_epX1u7ml");

const LIGHT={bg:"#F7F5F0",surface:"#FDFCFA",card:"#FFFFFF",border:"#EAE4D8",border2:"#D8D0C0",sage:"#7C9E87",sageL:"#A8C4AF",sageD:"#5A7D65",sand:"#C4A882",clay:"#C4856A",sky:"#7EA8C4",violet:"#9B8EC4",violetL:"#C4B8E8",violetD:"#7060A8",charcoal:"#2C2C2C",textMid:"#6B6458",textSub:"#9C9284",muted:"#B8B0A0",shell:"#E8E4DC",shellRing:"#D8D2C8",notch:"#FDFCFA",notchPill:"#2C2C2C",notchText:"#9C9284",scrollbar:"#C8C0B0"};
const DARK={bg:"#161C18",surface:"#1C2420",card:"#212B25",border:"#2A3830",border2:"#354540",sage:"#7EC494",sageL:"#5A9970",sageD:"#A8D4B4",sand:"#D4B48C",clay:"#D4956A",sky:"#8AB8D4",violet:"#B4A8D8",violetL:"#7868A8",violetD:"#CEC4EC",charcoal:"#EAE6DE",textMid:"#A8A090",textSub:"#6E6860",muted:"#4A4840",shell:"#0E1210",shellRing:"#2A3830",notch:"#1C2420",notchPill:"#EAE6DE",notchText:"#6E6860",scrollbar:"#2A3830"};

const TABS=[{id:"inicio",label:"Inicio",icon:"◈"},{id:"habito",label:"Hábito",icon:"▦"},{id:"despensa",label:"Despensa",icon:"⬡"},{id:"entrena",label:"Entrena",icon:"◉"},{id:"asistente",label:"Asistente",icon:"✦"},{id:"perfil",label:"Perfil",icon:"◎"}];
const DIAS=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const DIAS_C=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

const makeCSS=(dark)=>`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:${dark?DARK.scrollbar:LIGHT.scrollbar};border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes modeIn{from{opacity:0;transform:scale(.98)}to{opacity:1;transform:scale(1)}}
  .fade-up{animation:fadeUp .45s ease both}.fade-in{animation:fadeIn .35s ease both}.mode-in{animation:modeIn .3s ease both}
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

export default function App(){
  const[dark,setDark]=useState(false);
  const[user,setUser]=useState(null);const[profile,setProfile]=useState(null);
  const[screen,setScreen]=useState(window.location.search.includes("dev")?"app":"auth");
  const[tab,setTab]=useState("inicio");
  const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[loading,setLoading]=useState(false);const[error,setError]=useState("");
  const[modo,setModo]=useState("welcome");const[showPass,setShowPass]=useState(false);const[rememberMe,setRememberMe]=useState(false);const[onboardingSlide,setOnboardingSlide]=useState(0);
  const[ob,setOb]=useState({nombre:"",apellido:"",peso_actual:"",peso_meta:"",objetivo:"bajar_peso",restricciones:[]});
  const[agua,setAgua]=useState(0);const[stock,setStock]=useState([]);const[menu,setMenu]=useState([]);const[sesiones,setSesiones]=useState([]);const[listaCompra,setListaCompra]=useState([]);
  const[nuevoProducto,setNuevoProducto]=useState({nombre:"",cantidad:"",unidad:"g"});const[mostrarForm,setMostrarForm]=useState(false);
  const[diaMenu,setDiaMenu]=useState(0);const[despensaTab,setDespensaTab]=useState("stock");const[semanaActiva,setSemanaActiva]=useState(1);
  const[showScanner,setShowScanner]=useState(false);const[scannedCode,setScannedCode]=useState("");const[scannedProduct,setScannedProduct]=useState(null);const[scanLoading,setScanLoading]=useState(false);
  const[msgs,setMsgs]=useState([]);const[chatInput,setChatInput]=useState("");const[chatLoading,setChatLoading]=useState(false);
  const[menuLoading,setMenuLoading]=useState(false);const[menuError,setMenuError]=useState("");
  const[entrenamientoLoading,setEntrenamientoLoading]=useState(false);const[entrenamientoError,setEntrenamientoError]=useState("");
  const chatBottom=useRef(null);const scannerRef=useRef(null);
  const T=dark?DARK:LIGHT;
  const toggleTheme=()=>setDark(d=>!d);

  useEffect(()=>{
    const saved=localStorage.getItem("triflow_email");if(saved)setEmail(saved);
    if(window.location.search.includes("dev")){const devUser={id:"dev-user-123",email:"dev@test.com"};setUser(devUser);loadAll(devUser.id);}
    else{
      supabase.auth.getSession().then(async({data:{session}})=>{if(session?.user){setUser(session.user);await loadAll(session.user.id);}});
      supabase.auth.onAuthStateChange(async(_,session)=>{if(session?.user){setUser(session.user);await loadAll(session.user.id);}else{setUser(null);setProfile(null);setScreen("auth");}});
    }
  },[]);
  useEffect(()=>{chatBottom.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  useEffect(()=>{
    if(showScanner&&!scannedProduct){
      try{const scanner=new Html5QrcodeScanner("reader",{fps:10,qrbox:{width:250,height:250}});scannerRef.current=scanner;scanner.render((r)=>{handleScanSuccess(r);scanner.clear()},()=>{});}
      catch(e){console.error("Scanner error:",e);}
    }
    return()=>{if(scannerRef.current){try{scannerRef.current.clear();}catch(e){}}};
  },[showScanner,scannedProduct]);

  const loadAll=async(uid)=>{
    let p=null;
    if(window.location.search.includes("dev")){p={id:uid,nombre:"Diego",apellido:"Test",peso_actual:85,peso_meta:75,objetivo:"bajar_peso",restricciones:["Sin lactosa"]};setProfile(p);setUser({id:uid,email:"test@triflow.com"});}
    else{const{data:prof}=await supabase.from("profiles").select("*").eq("id",uid).single();p=prof;if(!p?.nombre){setScreen("onboarding");return;}setProfile(p);}
    const{data:a}=await supabase.from("agua_diaria").select("*").eq("user_id",uid).eq("fecha",new Date().toISOString().split("T")[0]).single();setAgua(a?.vasos||0);
    const{data:s}=await supabase.from("stock").select("*").eq("user_id",uid).order("created_at");setStock(s||[]);
    const{data:m}=await supabase.from("menu_semanal").select("*").eq("user_id",uid).order("created_at");setMenu(m||[]);
    const{data:se}=await supabase.from("sesiones").select("*").eq("user_id",uid).order("created_at");setSesiones(se||[]);
    setMsgs([{role:"assistant",text:`Hola, ${p.nombre}! 🌱\n\nSoy tu asistente de TriFlow. Conozco tu perfil:\n\n**Objetivo:** ${p.objetivo?.replace(/_/g," ")}\n**Peso actual:** ${p.peso_actual} kg → Meta: ${p.peso_meta} kg\n**Restricciones:** ${p.restricciones?.length?p.restricciones.join(", "):"Ninguna"}\n\n¿En qué te ayudo hoy?`}]);
    setScreen("app");
  };
  const handleAuth=async()=>{setLoading(true);setError("");try{if(rememberMe)localStorage.setItem("triflow_email",email);else localStorage.removeItem("triflow_email");if(modo==="registro"){const{error:e}=await supabase.auth.signUp({email,password:pass});if(e)throw e;setError("Revisa tu email para confirmar tu cuenta");}else{const{error:e}=await supabase.auth.signInWithPassword({email,password:pass});if(e)throw e;}}catch(e){setError(e.message);}setLoading(false);};
  const saveProfile=async()=>{setLoading(true);const{error:e}=await supabase.from("profiles").upsert({id:user.id,email:user.email,...ob,peso_actual:parseFloat(ob.peso_actual),peso_meta:parseFloat(ob.peso_meta)});if(!e){await supabase.from("progreso_peso").insert({user_id:user.id,peso:parseFloat(ob.peso_actual)});setProfile({...ob,email:user.email});setScreen("app");}else setError(e.message);setLoading(false);};
  const logout=async()=>{await supabase.auth.signOut();};
  const updateAgua=async(v)=>{setAgua(v);await supabase.from("agua_diaria").upsert({user_id:user.id,fecha:new Date().toISOString().split("T")[0],vasos:v},{onConflict:"user_id,fecha"});};
  const agregarProducto=async()=>{if(!nuevoProducto.nombre)return;const{data}=await supabase.from("stock").insert({user_id:user.id,...nuevoProducto,cantidad:parseFloat(nuevoProducto.cantidad)||0}).select().single();if(data){setStock(p=>[...p,data]);setNuevoProducto({nombre:"",cantidad:"",unidad:"g"});setMostrarForm(false);}};
  const eliminarProducto=async(id)=>{await supabase.from("stock").delete().eq("id",id);setStock(p=>p.filter(s=>s.id!==id));};
  const toggleSesion=async(id,completada)=>{await supabase.from("sesiones").update({completada:!completada}).eq("id",id);setSesiones(p=>p.map(s=>s.id===id?{...s,completada:!completada}:s));};
  const generarMenu=async()=>{if(menuLoading)return;setMenuLoading(true);setMenuError("");try{const res=await fetch("/api/generate-menu",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile,stock})});const data=await res.json();if(!res.ok)throw new Error(data?.error||`Error ${res.status}`);if(!Array.isArray(data.menu)||!data.menu.length)throw new Error("Menú vacío");await supabase.from("menu_semanal").delete().eq("user_id",user.id);const rows=data.menu.map(m=>({user_id:user.id,dia:m.dia,desayuno:m.desayuno||"",almuerzo:m.almuerzo||"",snack:m.snack||"",cena:m.cena||""}));const{data:inserted,error}=await supabase.from("menu_semanal").insert(rows).select();if(error)throw error;setMenu(inserted||rows);setListaCompra(Array.isArray(data.lista_compra)?data.lista_compra:[]);}catch(e){console.error("generarMenu error:",e);setMenuError(e.message||"Error generando menú");}setMenuLoading(false);};
  const generarEntrenamiento=async()=>{if(entrenamientoLoading)return;setEntrenamientoLoading(true);setEntrenamientoError("");try{const res=await fetch("/api/generate-training",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile})});const data=await res.json();if(!res.ok)throw new Error(data?.error||`Error ${res.status}`);if(!Array.isArray(data.sesiones)||!data.sesiones.length)throw new Error("Sin sesiones generadas");await supabase.from("sesiones").delete().eq("user_id",user.id);const rows=data.sesiones.map(s=>({user_id:user.id,dia:s.dia,grupo:`Sem ${s.semana||1} · ${s.grupo}`,completada:false}));const{data:inserted,error}=await supabase.from("sesiones").insert(rows).select();if(error)throw error;setSesiones(inserted||rows);}catch(e){console.error("generarEntrenamiento error:",e);setEntrenamientoError(e.message||"Error generando plan");}setEntrenamientoLoading(false);};
  const agregarSugerencia=async(item,idx)=>{const payload={user_id:user.id,nombre:item.nombre,cantidad:parseFloat(item.cantidad)||0,unidad:item.unidad||"g"};const{data,error}=await supabase.from("stock").insert(payload).select().single();if(error){setMenuError(error.message);return;}setStock(p=>[...p,data]);setListaCompra(p=>p.filter((_,i)=>i!==idx));};
  const lookupProductByBarcode=async(barcode)=>{try{const res=await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);if(!res.ok)return null;const data=await res.json();if(!data.product)return null;return{nombre:data.product.product_name||barcode,imagen:data.product.image_front_url||null,marca:data.product.brands||"",energia:data.product.nutriments?.energy_kcal_100g||null,proteinas:data.product.nutriments?.proteins_100g||null,grasas:data.product.nutriments?.fat_100g||null,carbohidratos:data.product.nutriments?.carbohydrates_100g||null};}catch(e){console.error("Open Food Facts error:",e);return null;}};
  const handleScanSuccess=async(decodedText)=>{setScannedCode(decodedText);setScanLoading(true);const product=await lookupProductByBarcode(decodedText);setScannedProduct(product||{nombre:decodedText,cantidad:"1",unidad:"un",imagen:null});setScanLoading(false);};
  const confirmarProductoEscaneado=async()=>{if(!scannedProduct?.nombre)return;const payload={user_id:user.id,nombre:scannedProduct.nombre,cantidad:parseFloat(scannedProduct.cantidad)||1,unidad:scannedProduct.unidad||"un"};const{data}=await supabase.from("stock").insert(payload).select().single();if(data){setStock(p=>[...p,data]);setShowScanner(false);setScannedCode("");setScannedProduct(null);}};
  const sendChat=async()=>{if(!chatInput.trim()||chatLoading)return;const txt=chatInput.trim();setChatInput("");setMsgs(p=>[...p,{role:"user",text:txt}]);setChatLoading(true);try{const stockInfo=stock.map(s=>`${s.nombre}: ${s.cantidad}${s.unidad}`).join(", ");const system=`Eres el asistente personal de TriFlow para ${profile?.nombre} ${profile?.apellido}.\nPerfil: objetivo ${profile?.objetivo?.replace(/_/g," ")}, peso actual ${profile?.peso_actual}kg, meta ${profile?.peso_meta}kg, restricciones: ${profile?.restricciones?.join(", ")||"ninguna"}.\nDespensa actual: ${stockInfo||"vacía"}.\nResponde en español, cálido y conciso (máx 200 palabras).`;const msgHistory=msgs.slice(1).map(m=>({role:m.role,content:m.text.replace(/\*\*/g,"")}));const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1000,system,messages:[...msgHistory,{role:"user",content:txt}]})});const data=await res.json();if(!res.ok)throw new Error(data?.error||`Error ${res.status}`);const responseText=data?.content?.[0]?.text;if(!responseText)throw new Error("Respuesta vacía del servidor");setMsgs(p=>[...p,{role:"assistant",text:responseText}]);}catch(e){console.error("Chat error:",e);setMsgs(p=>[...p,{role:"assistant",text:`Error: ${e.message||"No se pudo obtener respuesta"}. Intenta de nuevo.`}]);}setChatLoading(false);};

  const inp=(x={})=>({width:"100%",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${T.border}`,background:T.card,fontSize:14,marginBottom:12,color:T.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif",...x});
  const btn=(bg,x={})=>({width:"100%",padding:14,borderRadius:99,background:bg,border:"none",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",...x});

  const hoyIdx=new Date().getDay()===0?6:new Date().getDay()-1;
  const menuHoy=menu.find(m=>m.dia===DIAS[hoyIdx])||menu[0];
  const stockCritico=stock.filter(s=>s.cantidad<=(s.minimo||0));
  const sesPorSemana=(n)=>sesiones.filter(s=>s.grupo?.startsWith(`Sem ${n}`));
  const onboardingSlides=[{emoji:"🌱",title:"Organiza tu cambio",desc:"Perfil personalizado según tus objetivos y restricciones"},{emoji:"🥗",title:"Tu alimentación, ordenada",desc:"Menú semanal generado con IA basado en tu despensa"},{emoji:"✦",title:"Con un profesional real",desc:"Tu asistente IA entrena contigo y adapta planes"}];

  /* ── AUTH ─────────────────────────────────────────────── */
  if(screen==="auth"){
    const wrap=(children)=>(<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,transition:"background .4s",fontFamily:"'DM Sans',sans-serif"}}><style>{makeCSS(dark)}</style>{children}</div>);
    const card={width:"100%",maxWidth:400,background:T.surface,borderRadius:24,padding:"40px 28px",border:`1px solid ${T.border}`,position:"relative"};
    if(modo==="welcome")return wrap(
      <div style={card} className="fade-up">
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:600,color:T.charcoal,marginBottom:4}}>Tri<span style={{color:T.sage}}>Flow</span></div>
          <div style={{fontSize:36,marginBottom:24}}>🌱</div>
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
          <div style={{fontSize:52,marginBottom:14,lineHeight:1}}>{s.emoji}</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:23,fontWeight:600,color:T.charcoal,marginBottom:8}}>{s.title}</div>
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
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:600,color:T.charcoal}}>Tri<span style={{color:T.sage}}>Flow</span></div>
          <ThemeToggle dark={dark} toggle={toggleTheme} T={T}/>
        </div>
        {modo==="registro"&&<div style={{marginBottom:20}}><div style={{fontSize:20,fontWeight:600,color:T.charcoal,marginBottom:6}}>Crear tu cuenta</div><button onClick={()=>{setModo("welcome");setError("");}} style={{background:"none",border:"none",color:T.textSub,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",textDecoration:"underline"}}>← Atrás</button></div>}
        {error&&<div style={{background:T.clay+"22",border:`1px solid ${T.clay}`,borderRadius:12,padding:"10px 12px",marginBottom:16,fontSize:13,color:T.clay}}>{error}</div>}
        <input type="email" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={inp()}/>
        <div style={{position:"relative",marginBottom:20}}><input type={showPass?"text":"password"} placeholder="Contraseña" value={pass} onChange={e=>setPass(e.target.value)} style={inp({marginBottom:0,paddingRight:40})}/><button onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:12,top:12,background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.textSub}}>{showPass?"👁️":"👁️‍🗨️"}</button></div>
        {modo==="login"&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20,fontSize:13}}><input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} style={{cursor:"pointer"}}/><label style={{cursor:"pointer",color:T.textMid}}>Recordar usuario</label></div>}
        <button onClick={handleAuth} disabled={loading||!email||!pass} style={btn(email&&pass&&!loading?T.sage:T.muted)}>{loading?"Cargando...":modo==="login"?"Iniciar sesión":"Crear cuenta"}</button>
        {modo==="login"&&<button onClick={()=>{setModo("welcome");setError("");}} style={{width:"100%",marginTop:12,padding:10,borderRadius:99,background:"transparent",border:`1px solid ${T.border}`,color:T.charcoal,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13}}>¿No tienes cuenta? Regístrate</button>}
      </div>
    );
  }

  /* ── ONBOARDING ───────────────────────────────────────── */
  if(screen==="onboarding")return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,transition:"background .4s",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{makeCSS(dark)}</style>
      <div style={{width:"100%",maxWidth:440,background:T.surface,borderRadius:24,padding:"40px 28px",border:`1px solid ${T.border}`}} className="fade-up">
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:600,color:T.charcoal,marginBottom:4}}>Cuéntanos sobre ti</div>
        <div style={{fontSize:14,color:T.textSub,marginBottom:24}}>Para personalizar tu experiencia en TriFlow</div>
        {error&&<div style={{background:T.clay+"22",border:`1px solid ${T.clay}`,borderRadius:12,padding:"10px 12px",marginBottom:16,fontSize:13,color:T.clay}}>{error}</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <input placeholder="Nombre" value={ob.nombre} onChange={e=>setOb({...ob,nombre:e.target.value})} style={inp()}/>
          <input placeholder="Apellido" value={ob.apellido} onChange={e=>setOb({...ob,apellido:e.target.value})} style={inp()}/>
          <input type="number" placeholder="Peso actual kg" value={ob.peso_actual} onChange={e=>setOb({...ob,peso_actual:e.target.value})} style={inp()}/>
          <input type="number" placeholder="Peso meta kg" value={ob.peso_meta} onChange={e=>setOb({...ob,peso_meta:e.target.value})} style={inp()}/>
        </div>
        <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.07em",marginBottom:10,marginTop:4}}>OBJETIVO</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {[["bajar_peso","Bajar de peso","↓"],["ganar_musculo","Ganar músculo","↑"],["rendimiento","Mejorar rendimiento","⚡"]].map(([v,l,i])=>(
            <button key={v} onClick={()=>setOb({...ob,objetivo:v})} style={{padding:"11px 16px",borderRadius:12,border:`1.5px solid ${ob.objetivo===v?T.sage:T.border}`,background:ob.objetivo===v?T.sage+"18":"transparent",cursor:"pointer",textAlign:"left",display:"flex",gap:10,alignItems:"center",fontFamily:"'DM Sans',sans-serif"}}>
              <span>{i}</span><span style={{fontSize:14,color:ob.objetivo===v?T.sageD:T.charcoal,fontWeight:ob.objetivo===v?600:400}}>{l}</span>
            </button>
          ))}
        </div>
        <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.07em",marginBottom:8}}>RESTRICCIONES (opcional)</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
          {["Sin lactosa","Sin gluten","Vegano","Vegetariano"].map(r=>{const s=ob.restricciones.includes(r);return<button key={r} onClick={()=>setOb({...ob,restricciones:s?ob.restricciones.filter(x=>x!==r):[...ob.restricciones,r]})} style={{padding:"7px 14px",borderRadius:99,border:`1.5px solid ${s?T.sand:T.border}`,background:s?T.sand+"22":"transparent",color:s?T.sand:T.textMid,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>{r}</button>;})}
        </div>
        <button onClick={saveProfile} disabled={loading||!ob.nombre||!ob.peso_actual} style={btn(ob.nombre&&ob.peso_actual&&!loading?T.sage:T.muted)}>{loading?"Guardando...":"Comenzar mi cambio →"}</button>
      </div>
    </div>
  );

  /* ── APP SHELL ────────────────────────────────────────── */
  const hora=new Date().getHours();
  const saludo=hora<12?"Buenos días":hora<19?"Buenas tardes":"Buenas noches";

  return(
    <div style={{minHeight:"100vh",background:T.shell,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 20px",fontFamily:"'DM Sans',sans-serif",transition:"background .4s"}}>
      <style>{makeCSS(dark)}</style>
      <div style={{width:"100%",maxWidth:390,background:T.bg,borderRadius:44,overflow:"hidden",boxShadow:`0 40px 100px rgba(0,0,0,${dark?.38:.18}), 0 0 0 8px ${T.shellRing}`,position:"relative",minHeight:780,transition:"all .4s"}}>

        {/* Notch */}
        <div style={{height:44,background:T.notch,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",transition:"background .4s",flexShrink:0}}>
          <div style={{fontSize:12,fontWeight:600,color:T.notchText}}>9:41</div>
          <div style={{width:96,height:26,background:T.notchPill,borderRadius:99,transition:"background .4s"}}/>
          <div style={{fontSize:11,color:T.notchText}}>●●●</div>
        </div>

        {/* Scroll container */}
        <div style={{height:"calc(780px - 104px)",overflowY:"auto",background:T.bg,transition:"background .4s"}}>

          {/* ═══ INICIO ═══ */}
          {tab==="inicio"&&(
            <div style={{paddingBottom:16}} className="mode-in">
              {/* Header */}
              <div style={{padding:"18px 20px 12px",background:T.surface,borderBottom:`1px solid ${T.border}`,transition:"all .4s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:13,color:T.textSub}}>{saludo}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:T.charcoal,marginTop:2}}>{profile?.nombre} <span style={{fontStyle:"italic",color:T.sage}}>✦</span></div>
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

              <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:12}}>
                {/* Progreso peso + ProgressRing agua */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div style={{background:T.card,borderRadius:22,padding:"16px",border:`1px solid ${T.border}`,transition:"all .4s"}}>
                    <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.07em",marginBottom:6}}>PESO</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:600,color:T.charcoal,lineHeight:1}}>{profile?.peso_actual}<span style={{fontSize:14,fontWeight:400}}> kg</span></div>
                    <div style={{fontSize:11,color:T.textSub,marginBottom:8}}>meta {profile?.peso_meta} kg</div>
                    <div style={{background:T.border,borderRadius:99,height:5,overflow:"hidden"}}>
                      <div style={{width:Math.max(5,Math.min(100,100-((parseFloat(profile?.peso_actual||0)-parseFloat(profile?.peso_meta||0))/(parseFloat(profile?.peso_actual||1))*100)))+"%",height:"100%",background:`linear-gradient(90deg,${T.sage},${T.sageL})`,borderRadius:99,transition:"width .8s ease"}}/>
                    </div>
                    <div style={{fontSize:10,color:T.textSub,marginTop:4}}>{(parseFloat(profile?.peso_actual||0)-parseFloat(profile?.peso_meta||0)).toFixed(1)} kg por llegar</div>
                  </div>
                  <div style={{background:T.card,borderRadius:22,padding:"16px",border:`1px solid ${T.border}`,transition:"all .4s",display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.07em",marginBottom:6,alignSelf:"flex-start"}}>AGUA HOY</div>
                    <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}>
                      <ProgressRing value={agua} max={8} size={64} stroke={6} color={T.sky}/>
                      <div style={{position:"absolute",fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,color:T.sky}}>{agua}</div>
                    </div>
                    <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"center"}}>
                      {Array.from({length:8}).map((_,i)=>(
                        <button key={i} onClick={()=>updateAgua(Math.min(8,i+1))} style={{width:16,height:16,borderRadius:99,background:i<agua?T.sky:T.border,border:"none",cursor:"pointer",transition:"background .2s",padding:0}}/>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Menú hoy */}
                {menuHoy?(
                  <div style={{background:T.card,borderRadius:22,padding:"14px 16px",border:`1px solid ${T.border}`,transition:"all .4s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.07em"}}>MENÚ DE HOY</div>
                      <button onClick={()=>setTab("habito")} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:T.sage,fontFamily:"'DM Sans',sans-serif"}}>Ver todo →</button>
                    </div>
                    {[["🌅",menuHoy.desayuno],["☀️",menuHoy.almuerzo],["🍎",menuHoy.snack],["🌙",menuHoy.cena]].filter(([,v])=>v).map(([emoji,texto],i,arr)=>(
                      <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"7px 0",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none"}}>
                        <span style={{fontSize:14,marginTop:1}}>{emoji}</span>
                        <div style={{fontSize:13,color:T.charcoal,flex:1,lineHeight:1.35}}>{texto}</div>
                      </div>
                    ))}
                  </div>
                ):(
                  <div style={{background:T.sage+"14",borderRadius:22,padding:"16px 18px",border:`1px solid ${T.sage}22`,textAlign:"center"}}>
                    <div style={{fontSize:13,color:T.sageD,marginBottom:8}}>No hay menú generado aún</div>
                    <button onClick={()=>setTab("habito")} style={{padding:"8px 18px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Generar menú ✦</button>
                  </div>
                )}

                {/* Alerta despensa */}
                {stockCritico.length>0&&(
                  <div style={{background:dark?T.clay+"18":`linear-gradient(135deg,${T.sand}18,${T.clay}10)`,borderRadius:22,padding:"14px 16px",border:`1px solid ${T.clay}33`,transition:"all .4s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{fontSize:11,color:T.sand,letterSpacing:"0.07em",fontWeight:600}}>⚠ DESPENSA</div>
                      <button onClick={()=>setTab("despensa")} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.clay,fontFamily:"'DM Sans',sans-serif"}}>Ver lista →</button>
                    </div>
                    <div style={{fontSize:14,color:T.charcoal,marginBottom:8}}>Faltan <strong>{stockCritico.length} productos</strong> para tu menú.</div>
                    <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{stockCritico.slice(0,3).map(p=><Chip key={p.id} color={T.clay} T={T}>{p.nombre}</Chip>)}</div>
                  </div>
                )}

                {/* Motivación */}
                <div style={{background:dark?T.sage+"18":`linear-gradient(135deg,${T.sage}20,${T.sage}08)`,borderRadius:22,padding:"16px 18px",border:`1px solid ${T.sage}33`,transition:"all .4s"}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontStyle:"italic",color:T.sageD,marginBottom:6}}>"La constancia es el hábito más valioso."</div>
                  <div style={{fontSize:13,color:T.textMid,lineHeight:1.65,marginBottom:10}}>
                    <strong style={{color:T.charcoal}}>{sesiones.filter(s=>s.completada).length}/{sesiones.length}</strong> sesiones completadas · <strong style={{color:T.charcoal}}>💧 {agua}/8</strong> vasos hoy
                  </div>
                  <button onClick={()=>setTab("asistente")} style={{background:"none",border:`1.5px solid ${T.sage}`,borderRadius:99,padding:"8px 16px",cursor:"pointer",fontSize:13,color:T.sageD,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>Hablar con mi asistente →</button>
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
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:T.charcoal}}>El Hábito</div>
                    <div style={{fontSize:13,color:T.textSub,marginTop:2}}>Tu menú semanal personalizado</div>
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
              <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:11}} className="fade-in">
                {menuError&&<div style={{background:T.clay+"22",border:`1px solid ${T.clay}`,borderRadius:12,padding:"10px 12px",fontSize:12,color:T.clay}}>{menuError}</div>}
                {menu.length===0?(
                  <div style={{background:T.card,borderRadius:20,padding:"32px 24px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                    <div style={{fontSize:40,marginBottom:14}}>🥗</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:T.charcoal,marginBottom:8}}>Sin menú aún</div>
                    <div style={{fontSize:13,color:T.textMid,marginBottom:18,lineHeight:1.6}}>Genera tu menú personalizado según tu objetivo, restricciones y despensa.</div>
                    <button onClick={generarMenu} disabled={menuLoading} style={{padding:"12px 24px",borderRadius:99,background:menuLoading?T.muted:T.sage,border:"none",color:"#fff",fontSize:14,cursor:menuLoading?"default":"pointer",fontFamily:"'DM Sans',sans-serif"}}>{menuLoading?"Generando menú...":"Generar menú semanal ✦"}</button>
                  </div>
                ):(()=>{
                  const md=menu.find(m=>m.dia===DIAS[diaMenu])||menu[Math.min(diaMenu,menu.length-1)];
                  return md?(<>
                    {[["🌅","DESAYUNO","desayuno"],["☀️","ALMUERZO","almuerzo"],["🍎","ONCE","snack"],["🌙","CENA","cena"]].map(([emoji,label,key])=>md[key]&&(
                      <div key={key} style={{background:T.card,borderRadius:20,padding:"14px 16px",border:`1px solid ${T.border}`,transition:"all .4s"}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                          <span style={{fontSize:14}}>{emoji}</span>
                          <span style={{fontSize:11,color:T.textSub,letterSpacing:"0.07em"}}>{label}</span>
                        </div>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,color:T.charcoal,lineHeight:1.4}}>{md[key]}</div>
                      </div>
                    ))}
                  </>):null;
                })()}
                {listaCompra.length>0&&(
                  <div style={{background:T.sand+"14",border:`1px solid ${T.sand}44`,borderRadius:18,padding:"14px 16px",marginTop:4}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.sand,marginBottom:4}}>🛒 Sugerencias para tu despensa</div>
                    <div style={{fontSize:11,color:T.textSub,marginBottom:10}}>Productos faltantes para este menú</div>
                    {listaCompra.map((item,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:i>0?`1px solid ${T.border}`:"none",gap:10}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,color:T.charcoal,fontWeight:500}}>{item.nombre} <span style={{color:T.textSub,fontWeight:400}}>· {item.cantidad}{item.unidad}</span></div>
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
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:T.charcoal,marginBottom:12}}>La Despensa</div>
                <div style={{display:"flex"}}>
                  {[["stock","Mi stock"],["compras","Lista compras"],["scan","Escanear"]].map(([id,label])=>(
                    <button key={id} onClick={()=>setDespensaTab(id)} style={{padding:"9px 14px",fontSize:13,fontWeight:500,borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:`2px solid ${despensaTab===id?T.sage:"transparent"}`,color:despensaTab===id?T.sage:T.textMid,background:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s",marginBottom:0}}>{label}</button>
                  ))}
                </div>
              </div>

              {despensaTab==="stock"&&(
                <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:9}} className="fade-in">
                  <button onClick={()=>setMostrarForm(!mostrarForm)} style={{padding:"9px 16px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",alignSelf:"flex-start"}}>+ Agregar producto</button>
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
                    <div style={{background:T.card,borderRadius:18,padding:24,border:`1px solid ${T.border}`,textAlign:"center"}}>
                      <div style={{fontSize:36,marginBottom:12}}>📦</div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:T.charcoal,marginBottom:6}}>Despensa vacía</div>
                      <div style={{fontSize:13,color:T.textMid}}>Agrega tus productos para hacer seguimiento.</div>
                    </div>
                  ):stock.map(s=>(
                    <div key={s.id} style={{background:T.card,borderRadius:16,padding:"13px 16px",border:`1px solid ${s.cantidad<=(s.minimo||0)?T.clay+"33":T.border}`,display:"flex",alignItems:"center",gap:12,transition:"all .4s"}}>
                      <div style={{width:9,height:9,borderRadius:99,background:s.cantidad<=(s.minimo||0)?T.clay:T.sage,flexShrink:0}}/>
                      <div style={{flex:1}}><div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>{s.nombre}</div><div style={{fontSize:11,color:T.textSub,marginTop:1}}>{s.cantidad} {s.unidad}</div></div>
                      {s.cantidad<=(s.minimo||0)&&<Chip color={T.clay} T={T}>Reponer</Chip>}
                      <button onClick={()=>eliminarProducto(s.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:T.muted,padding:0,lineHeight:1}}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {despensaTab==="compras"&&(
                <div style={{padding:"14px 18px"}} className="fade-in">
                  {listaCompra.length===0?(
                    <div style={{background:T.card,borderRadius:18,padding:28,border:`1px solid ${T.border}`,textAlign:"center"}}>
                      <div style={{fontSize:32,marginBottom:12}}>🛒</div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:T.charcoal,marginBottom:6}}>Sin lista de compras</div>
                      <div style={{fontSize:13,color:T.textMid,lineHeight:1.6}}>Genera tu menú para obtener sugerencias de compra.</div>
                    </div>
                  ):(<>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:T.charcoal,marginBottom:4}}>{listaCompra.length} productos por comprar</div>
                    <div style={{fontSize:13,color:T.textSub,marginBottom:14}}>Basado en tu menú semanal</div>
                    <div style={{display:"flex",flexDirection:"column",gap:9}}>
                      {listaCompra.map((item,i)=>(
                        <div key={i} style={{background:T.card,borderRadius:16,padding:"13px 16px",border:`1px solid ${T.clay}33`,display:"flex",alignItems:"center",gap:12}}>
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
                  <div style={{width:100,height:100,borderRadius:99,background:T.sage+"18",border:`2px dashed ${T.sage}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>⬡</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,color:T.charcoal}}>Escanea un producto</div>
                  <div style={{fontSize:14,color:T.textMid,lineHeight:1.7,maxWidth:260}}>Apunta al código de barras para registrar el producto con sus datos nutricionales.</div>
                  <button onClick={()=>setShowScanner(true)} style={{width:"100%",maxWidth:280,padding:"13px",borderRadius:99,border:"none",cursor:"pointer",background:T.charcoal,color:T.bg,fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:500}}>Abrir cámara 📷</button>
                </div>
              )}

              {/* Modal escáner */}
              {showScanner&&(
                <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}}>
                  <div style={{background:T.surface,borderRadius:20,padding:24,width:"90%",maxWidth:400,maxHeight:"80vh",overflow:"auto",position:"relative"}}>
                    <button onClick={()=>setShowScanner(false)} style={{position:"absolute",top:12,right:12,width:32,height:32,borderRadius:99,background:T.card,border:`1px solid ${T.border}`,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>×</button>
                    {!scannedProduct?(
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:17,fontWeight:600,color:T.charcoal,marginBottom:14}}>Escanear Producto</div>
                        <div id="reader" style={{marginBottom:14,borderRadius:12,overflow:"hidden",background:T.bg}}/>
                        {scanLoading&&<div style={{fontSize:13,color:T.textSub}}>Buscando producto...</div>}
                      </div>
                    ):(
                      <div>
                        <div style={{fontSize:17,fontWeight:600,color:T.charcoal,marginBottom:14}}>Confirmar Producto</div>
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
                          <select value={scannedProduct.unidad||"un"} onChange={e=>setScannedProduct({...scannedProduct,unidad:e.target.value})} style={{...inp({marginBottom:0}),padding:"10px 12px",fontSize:13}}><option value="g">g</option><option value="kg">kg</option><option value="ml">ml</option><option value="L">L</option><option value="un">un</option></select>
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
              <div style={{padding:"18px 20px 14px",background:T.surface,borderBottom:`1px solid ${T.border}`,transition:"all .4s"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:T.charcoal}}>La Transformación <span style={{fontStyle:"italic",color:T.violet}}>✦</span></div>
                <div style={{fontSize:13,color:T.textSub,marginTop:2}}>Tu plan de entrenamiento mensual</div>
                {sesiones.length>0&&(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:12}}>
                    {[[`${sesiones.filter(s=>s.completada).length}/${sesiones.length}`,"Sesiones","completadas"],[`${sesiones.length?Math.round((sesiones.filter(s=>s.completada).length/sesiones.length)*100):0}%`,"Adherencia","al plan"],["4 sem","Progreso","del plan"]].map(([v,k,s])=>(
                      <div key={k} style={{background:T.bg,borderRadius:12,padding:"10px 8px",textAlign:"center",transition:"background .4s"}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,color:T.violet}}>{v}</div>
                        <div style={{fontSize:11,color:T.charcoal,fontWeight:500}}>{k}</div>
                        <div style={{fontSize:10,color:T.textSub}}>{s}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:12}} className="mode-in">
                {entrenamientoError&&<div style={{fontSize:12,color:T.clay,background:T.clay+"18",padding:12,borderRadius:12}}>{entrenamientoError}</div>}
                {sesiones.length===0?(
                  <div style={{background:T.card,borderRadius:20,padding:"32px 24px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                    <div style={{fontSize:40,marginBottom:14}}>💪</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:T.charcoal,marginBottom:8}}>Sin plan aún</div>
                    <div style={{fontSize:13,color:T.textMid,marginBottom:18,lineHeight:1.6}}>Genera tu primer mesociclo personalizado de 4 semanas.</div>
                    <button onClick={generarEntrenamiento} disabled={entrenamientoLoading} style={{padding:"13px 28px",borderRadius:99,background:entrenamientoLoading?T.muted:T.violet,border:"none",color:"#fff",fontSize:14,cursor:entrenamientoLoading?"default":"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{entrenamientoLoading?"Generando...":"✦ Generar Mesociclo"}</button>
                  </div>
                ):(<>
                  {/* Selector semanas */}
                  <div style={{display:"flex",gap:8}}>
                    {[1,2,3,4].map(n=>{
                      const ss=sesPorSemana(n);const completa=ss.length>0&&ss.every(s=>s.completada);
                      return(<button key={n} onClick={()=>setSemanaActiva(n)} style={{flex:1,padding:"10px 6px",borderRadius:14,border:`1.5px solid ${semanaActiva===n?T.violet:T.border}`,background:semanaActiva===n?T.violet+"22":"transparent",color:semanaActiva===n?T.violet:T.textMid,fontSize:12,fontWeight:semanaActiva===n?600:400,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s",textAlign:"center"}}>
                        Sem {n}{completa&&<div style={{fontSize:9,color:T.sage,marginTop:1}}>✓ ok</div>}
                      </button>);
                    })}
                  </div>
                  {/* Info semana */}
                  <div style={{background:T.violet+"14",borderRadius:18,padding:"12px 16px",border:`1px solid ${T.violet}22`}}>
                    <div style={{fontSize:11,color:T.violet,letterSpacing:"0.07em",marginBottom:3}}>SEMANA {semanaActiva}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:T.charcoal}}>Semana de {["Activación","Volumen","Intensidad","Descarga"][semanaActiva-1]}</div>
                  </div>
                  {/* Sesiones */}
                  {sesPorSemana(semanaActiva).length>0?sesPorSemana(semanaActiva).map(s=>(
                    <div key={s.id} onClick={()=>toggleSesion(s.id,s.completada)} style={{background:T.card,borderRadius:20,padding:"15px 16px",border:`1.5px solid ${s.completada?T.violet+"44":T.border}`,cursor:"pointer",transition:"all .25s",position:"relative",overflow:"hidden"}}>
                      {s.completada&&<div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:T.violet,borderRadius:"4px 0 0 4px"}}/>}
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:42,height:42,borderRadius:14,background:s.completada?T.violet+"22":T.bg,border:`1.5px solid ${s.completada?T.violet+"66":T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,transition:"all .3s"}}>{s.completada?"✓":"🏋️"}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:15,fontWeight:600,color:s.completada?T.textSub:T.charcoal}}>{s.dia}</div>
                          <div style={{fontSize:12,color:s.completada?T.muted:T.violet,marginTop:2,fontWeight:500}}>{s.grupo?.replace(/^Sem \d+ · /,"")}</div>
                        </div>
                        <div style={{fontSize:20,color:T.muted}}>›</div>
                      </div>
                    </div>
                  )):(
                    <div style={{background:T.card,borderRadius:18,padding:"24px 20px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                      <div style={{fontSize:28,marginBottom:8}}>🔒</div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:T.charcoal,marginBottom:4}}>Sin sesiones en esta semana</div>
                      <div style={{fontSize:12,color:T.textSub,lineHeight:1.6}}>Regenera el mesociclo para obtener sesiones.</div>
                    </div>
                  )}
                  {/* Regenerar */}
                  <button onClick={generarEntrenamiento} disabled={entrenamientoLoading} style={{padding:"13px",borderRadius:99,border:`1.5px solid ${T.violet}`,background:"transparent",color:T.violet,fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:500,cursor:entrenamientoLoading?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
                    {entrenamientoLoading?"Regenerando...":"↻ Regenerar mesociclo con IA"}
                  </button>
                </>)}
              </div>
            </div>
          )}

          {/* ═══ ASISTENTE ═══ */}
          {tab==="asistente"&&(
            <div style={{display:"flex",flexDirection:"column",height:"calc(780px - 104px)"}}>
              <div style={{padding:"16px 18px 12px",background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0,transition:"all .4s"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:600,color:T.charcoal}}>Tu asistente <span style={{fontStyle:"italic",color:T.sage}}>✦</span></div>
                <div style={{fontSize:12,color:T.textSub,marginTop:2}}>IA personalizada con tu perfil y despensa</div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:12,background:T.bg}}>
                {msgs.map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:9}}>
                    {m.role==="assistant"&&<div style={{width:29,height:29,borderRadius:99,background:`linear-gradient(135deg,${T.sage},${T.sageD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,marginTop:3}}>✦</div>}
                    <div style={{maxWidth:"78%",padding:"11px 14px",borderRadius:17,background:m.role==="user"?T.sage:T.card,border:m.role==="user"?"none":`1px solid ${T.border}`,borderBottomRightRadius:m.role==="user"?3:17,borderBottomLeftRadius:m.role==="assistant"?3:17,fontSize:13,color:m.role==="user"?"#fff":T.charcoal,lineHeight:1.65,transition:"background .4s,border-color .4s"}}>
                      {m.text.split("\n").map((line,j,arr)=><span key={j}>{line.split(/(\*\*[^*]+\*\*)/).map((p,k)=>p.startsWith("**")?<strong key={k}>{p.slice(2,-2)}</strong>:p)}{j<arr.length-1&&<br/>}</span>)}
                    </div>
                  </div>
                ))}
                {chatLoading&&<div style={{display:"flex",gap:9,alignItems:"flex-end"}}><div style={{width:29,height:29,borderRadius:99,background:`linear-gradient(135deg,${T.sage},${T.sageD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>✦</div><div style={{padding:"11px 14px",borderRadius:17,borderBottomLeftRadius:3,background:T.card,border:`1px solid ${T.border}`}}><div style={{display:"flex",gap:5}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:99,background:T.muted,animation:`pulse 1.2s ease-in-out ${i*.2}s infinite`}}/>)}</div></div></div>}
                <div ref={chatBottom}/>
              </div>
              <div style={{padding:"7px 10px",display:"flex",gap:6,overflowX:"auto",background:T.surface,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
                {["¿Qué puedo cocinar con mi despensa?","Genera mi menú semanal","Crea mi plan de entrenamiento","¿Cómo voy con mi objetivo?"].map(s=>(
                  <button key={s} onClick={()=>setChatInput(s)} style={{padding:"6px 12px",borderRadius:99,fontSize:11,border:`1px solid ${T.border}`,background:T.card,color:T.textMid,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif",flexShrink:0,transition:"all .3s"}}>{s}</button>
                ))}
              </div>
              <div style={{padding:"8px 10px 12px",display:"flex",gap:8,background:T.surface,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Escribe tu consulta..." style={{flex:1,padding:"10px 13px",borderRadius:12,border:`1.5px solid ${T.border}`,background:T.card,fontSize:13,color:T.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif",transition:"all .4s"}}/>
                <button onClick={sendChat} disabled={chatLoading} style={{width:44,height:44,borderRadius:99,background:chatLoading?T.muted:T.sage,border:"none",color:"#fff",fontSize:17,cursor:chatLoading?"default":"pointer",flexShrink:0,transition:"background .2s"}}>→</button>
              </div>
            </div>
          )}

          {/* ═══ PERFIL ═══ */}
          {tab==="perfil"&&(
            <div style={{paddingBottom:16}}>
              <div style={{padding:"18px 20px 16px",background:T.surface,borderBottom:`1px solid ${T.border}`,transition:"all .4s"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:T.charcoal}}>Mi perfil</div>
              </div>
              <div style={{padding:"18px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                  <Avatar name={`${profile?.nombre||"U"} ${profile?.apellido||""}`} size={56} T={T}/>
                  <div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,color:T.charcoal}}>{profile?.nombre} {profile?.apellido}</div>
                    <div style={{fontSize:12,color:T.textSub,marginBottom:6}}>{user?.email}</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <Chip color={T.sage} T={T}>{profile?.objetivo?.replace(/_/g," ")}</Chip>
                      {profile?.restricciones?.map(r=><Chip key={r} color={T.sand} T={T}>{r}</Chip>)}
                    </div>
                  </div>
                </div>
                <div style={{background:T.card,borderRadius:16,padding:"13px 16px",border:`1px solid ${T.border}`,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all .4s"}}>
                  <div><div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>{dark?"Modo oscuro activo":"Modo claro activo"}</div><div style={{fontSize:12,color:T.textSub,marginTop:1}}>Cambia la apariencia de la app</div></div>
                  <ThemeToggle dark={dark} toggle={toggleTheme} T={T}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
                  {[["PESO ACTUAL",`${profile?.peso_actual||"—"} kg`,T.charcoal],["META",`${profile?.peso_meta||"—"} kg`,T.sage],["SESIONES ✓",sesiones.filter(s=>s.completada).length,T.violet],["POR BAJAR",`${((parseFloat(profile?.peso_actual)||0)-(parseFloat(profile?.peso_meta)||0)).toFixed(1)} kg`,T.clay]].map(([k,v,c])=>(
                    <div key={k} style={{background:T.card,borderRadius:14,padding:"13px",border:`1px solid ${T.border}`,transition:"all .4s"}}>
                      <div style={{fontSize:10,color:T.textSub,letterSpacing:"0.07em",marginBottom:4}}>{k}</div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:600,color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
                {[["Objetivo actual",profile?.objetivo?.replace(/_/g," ")||"—",()=>{}],["Cerrar sesión","Salir de tu cuenta",logout]].map(([label,sub,action])=>(
                  <div key={label} onClick={action} style={{background:T.card,borderRadius:13,padding:"13px 16px",border:`1px solid ${T.border}`,marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",transition:"all .4s"}}>
                    <div><div style={{fontSize:14,color:label==="Cerrar sesión"?T.clay:T.charcoal,fontWeight:500}}>{label}</div><div style={{fontSize:11,color:T.textSub,marginTop:2}}>{sub}</div></div>
                    <span style={{color:T.muted,fontSize:18}}>›</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* NavBar */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:60,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",transition:"background .4s,border-color .4s"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,border:"none",background:"transparent",cursor:"pointer"}}>
              <span style={{fontSize:tab===t.id?18:16,color:tab===t.id?T.sage:T.muted,transition:"all .2s"}}>{t.icon}</span>
              <span style={{fontSize:9,color:tab===t.id?T.sage:T.muted,fontWeight:tab===t.id?600:400,fontFamily:"'DM Sans',sans-serif",transition:"color .2s"}}>{t.label}</span>
              {tab===t.id&&<div style={{width:16,height:2,borderRadius:99,background:T.sage,marginTop:1}}/>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
