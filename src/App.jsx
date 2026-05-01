import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://uiktwbtwzotqduzwtjcb.supabase.co","sb_publishable_ONXQyJvXKUIUqppaWnZG4w_epX1u7ml");
const LIGHT={bg:"#F7F5F0",surface:"#FDFCFA",card:"#FFFFFF",border:"#EAE4D8",sage:"#7C9E87",sageL:"#A8C4AF",sageD:"#5A7D65",sand:"#C4A882",clay:"#C4856A",sky:"#7EA8C4",violet:"#9B8EC4",charcoal:"#2C2C2C",textMid:"#6B6458",textSub:"#9C9284",muted:"#B8B0A0",shell:"#E8E4DC"};
const DARK={bg:"#161C18",surface:"#1C2420",card:"#212B25",border:"#2A3830",sage:"#7EC494",sageL:"#5A9970",sageD:"#A8D4B4",sand:"#D4B48C",clay:"#D4956A",sky:"#8AB8D4",violet:"#B4A8D8",charcoal:"#EAE6DE",textMid:"#A8A090",textSub:"#6E6860",muted:"#4A4840",shell:"#0E1210"};
const TABS=[{id:"inicio",label:"Inicio",icon:"◈"},{id:"habito",label:"Hábito",icon:"▦"},{id:"despensa",label:"Despensa",icon:"⬡"},{id:"entrena",label:"Entrena",icon:"◉"},{id:"asistente",label:"Asistente",icon:"✦"}];
const CSS=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@400;500;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}`;
export default function App(){
const[dark,setDark]=useState(false);const[user,setUser]=useState(null);const[profile,setProfile]=useState(null);const[screen,setScreen]=useState("auth");const[tab,setTab]=useState("inicio");
const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[loading,setLoading]=useState(false);const[error,setError]=useState("");const[modo,setModo]=useState("login");
const[ob,setOb]=useState({nombre:"",apellido:"",peso_actual:"",peso_meta:"",objetivo:"bajar_peso",restricciones:[]});
const[agua,setAgua]=useState(0);const[stock,setStock]=useState([]);const[menu,setMenu]=useState([]);const[sesiones,setSesiones]=useState([]);
const[nuevoProducto,setNuevoProducto]=useState({nombre:"",cantidad:"",unidad:"g"});const[mostrarForm,setMostrarForm]=useState(false);
const[msgs,setMsgs]=useState([]);const[chatInput,setChatInput]=useState("");const[chatLoading,setChatLoading]=useState(false);
const chatBottom=useRef(null);
const T=dark?DARK:LIGHT;
useEffect(()=>{supabase.auth.getSession().then(async({data:{session}})=>{if(session?.user){setUser(session.user);await loadAll(session.user.id);}});supabase.auth.onAuthStateChange(async(_,session)=>{if(session?.user){setUser(session.user);await loadAll(session.user.id);}else{setUser(null);setProfile(null);setScreen("auth");}});},[]);
useEffect(()=>{chatBottom.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
const loadAll=async(uid)=>{
  const{data:p}=await supabase.from("profiles").select("*").eq("id",uid).single();
  if(!p?.nombre){setScreen("onboarding");return;}
  setProfile(p);
  const{data:a}=await supabase.from("agua_diaria").select("*").eq("user_id",uid).eq("fecha",new Date().toISOString().split("T")[0]).single();
  setAgua(a?.vasos||0);
  const{data:s}=await supabase.from("stock").select("*").eq("user_id",uid).order("created_at");
  setStock(s||[]);
  const{data:m}=await supabase.from("menu_semanal").select("*").eq("user_id",uid).order("created_at");
  setMenu(m||[]);
  const{data:se}=await supabase.from("sesiones").select("*").eq("user_id",uid).order("created_at");
  setSesiones(se||[]);
  setMsgs([{role:"assistant",text:`Hola, ${p.nombre}! 🌱\n\nSoy tu asistente de TriFlow. Conozco tu perfil:\n\n**Objetivo:** ${p.objetivo?.replace(/_/g," ")}\n**Peso actual:** ${p.peso_actual} kg → Meta: ${p.peso_meta} kg\n**Restricciones:** ${p.restricciones?.length?p.restricciones.join(", "):"Ninguna"}\n\n¿En qué te ayudo hoy?`}]);
  setScreen("app");
};
const handleAuth=async()=>{setLoading(true);setError("");try{if(modo==="registro"){const{error:e}=await supabase.auth.signUp({email,password:pass});if(e)throw e;setError("Revisa tu email para confirmar tu cuenta");}else{const{error:e}=await supabase.auth.signInWithPassword({email,password:pass});if(e)throw e;}}catch(e){setError(e.message);}setLoading(false);};
const saveProfile=async()=>{setLoading(true);const{error:e}=await supabase.from("profiles").upsert({id:user.id,email:user.email,...ob,peso_actual:parseFloat(ob.peso_actual),peso_meta:parseFloat(ob.peso_meta)});if(!e){await supabase.from("progreso_peso").insert({user_id:user.id,peso:parseFloat(ob.peso_actual)});setProfile({...ob,email:user.email});setScreen("app");}else setError(e.message);setLoading(false);};
const logout=async()=>{await supabase.auth.signOut();};
const updateAgua=async(v)=>{setAgua(v);await supabase.from("agua_diaria").upsert({user_id:user.id,fecha:new Date().toISOString().split("T")[0],vasos:v},{onConflict:"user_id,fecha"});};
const agregarProducto=async()=>{if(!nuevoProducto.nombre)return;const{data}=await supabase.from("stock").insert({user_id:user.id,...nuevoProducto,cantidad:parseFloat(nuevoProducto.cantidad)||0}).select().single();if(data){setStock(p=>[...p,data]);setNuevoProducto({nombre:"",cantidad:"",unidad:"g"});setMostrarForm(false);}};
const eliminarProducto=async(id)=>{await supabase.from("stock").delete().eq("id",id);setStock(p=>p.filter(s=>s.id!==id));};
const toggleSesion=async(id,completada)=>{await supabase.from("sesiones").update({completada:!completada}).eq("id",id);setSesiones(p=>p.map(s=>s.id===id?{...s,completada:!completada}:s));};
const sendChat=async()=>{
  if(!chatInput.trim()||chatLoading)return;
  const txt=chatInput.trim();setChatInput("");
  setMsgs(p=>[...p,{role:"user",text:txt}]);
  setChatLoading(true);
  try{
    const stockInfo=stock.map(s=>`${s.nombre}: ${s.cantidad}${s.unidad}`).join(", ");
    const system=`Eres el asistente personal de TriFlow para ${profile?.nombre} ${profile?.apellido}.
Perfil: objetivo ${profile?.objetivo?.replace(/_/g," ")}, peso actual ${profile?.peso_actual}kg, meta ${profile?.peso_meta}kg, restricciones: ${profile?.restricciones?.join(", ")||"ninguna"}.
Despensa actual: ${stockInfo||"vacía"}.
Responde en español, cálido y conciso (máx 200 palabras). Usa el contexto del perfil y despensa para respuestas personalizadas.`;
    const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:msgs.filter(m=>m.role!=="assistant"||msgs.indexOf(m)>0).slice(-10).map(m=>({role:m.role,content:m.text.replace(/\*\*/g,"")})).concat([{role:"user",content:txt}])})});
    const data=await res.json();
    setMsgs(p=>[...p,{role:"assistant",text:data?.content?.[0]?.text || "Sin respuesta."}]);
  }catch(e){setMsgs(p=>[...p,{role:"assistant",text:"Error de conexión. Intenta de nuevo."}]);}
  setChatLoading(false);
};
const inp=(x={})=>({width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid "+T.border,background:T.card,fontSize:14,marginBottom:12,color:T.charcoal,outline:"none",fontFamily:"DM Sans,sans-serif",...x});
const btn=(bg,x={})=>({width:"100%",padding:14,borderRadius:99,background:bg,border:"none",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"DM Sans,sans-serif",...x});
if(screen==="auth")return(<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,transition:"background .4s"}}><style>{CSS}</style><div style={{width:"100%",maxWidth:400,background:T.surface,borderRadius:24,padding:"40px 28px",border:"1px solid "+T.border}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}><div style={{fontFamily:"Playfair Display,serif",fontSize:26,fontWeight:600,color:T.charcoal}}>Tri<span style={{color:T.sage}}>Flow</span></div><button onClick={()=>setDark(!dark)} style={{width:40,height:40,borderRadius:99,border:"1px solid "+T.border,background:T.card,cursor:"pointer",fontSize:18}}>{dark?"☀️":"🌙"}</button></div><div style={{display:"flex",marginBottom:24,background:T.bg,borderRadius:12,padding:4}}>{["login","registro"].map(m=><button key={m} onClick={()=>{setModo(m);setError("");}} style={{flex:1,padding:"10px",borderRadius:9,border:"none",background:modo===m?T.card:"transparent",color:modo===m?T.charcoal:T.muted,fontWeight:modo===m?600:400,cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:14}}>{m==="login"?"Iniciar sesión":"Crear cuenta"}</button>)}</div>{error&&<div style={{background:T.clay+"22",border:"1px solid "+T.clay,borderRadius:12,padding:"10px 12px",marginBottom:16,fontSize:13,color:T.clay}}>{error}</div>}<input type="email" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={inp()}/><input type="password" placeholder="Contraseña" value={pass} onChange={e=>setPass(e.target.value)} style={inp({marginBottom:20})}/><button onClick={handleAuth} disabled={loading||!email||!pass} style={btn(email&&pass&&!loading?T.sage:T.muted)}>{loading?"Cargando...":modo==="login"?"Iniciar sesión":"Crear cuenta"}</button></div></div>);
if(screen==="onboarding")return(<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,transition:"background .4s"}}><style>{CSS}</style><div style={{width:"100%",maxWidth:440,background:T.surface,borderRadius:24,padding:"40px 28px",border:"1px solid "+T.border}}><div style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:600,color:T.charcoal,marginBottom:6}}>Cuéntanos sobre ti</div><div style={{fontSize:14,color:T.textSub,marginBottom:24}}>Para personalizar tu experiencia en TriFlow</div>{error&&<div style={{background:T.clay+"22",border:"1px solid "+T.clay,borderRadius:12,padding:"10px 12px",marginBottom:16,fontSize:13,color:T.clay}}>{error}</div>}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><input placeholder="Nombre" value={ob.nombre} onChange={e=>setOb({...ob,nombre:e.target.value})} style={inp()}/><input placeholder="Apellido" value={ob.apellido} onChange={e=>setOb({...ob,apellido:e.target.value})} style={inp()}/><input type="number" placeholder="Peso actual kg" value={ob.peso_actual} onChange={e=>setOb({...ob,peso_actual:e.target.value})} style={inp()}/><input type="number" placeholder="Peso meta kg" value={ob.peso_meta} onChange={e=>setOb({...ob,peso_meta:e.target.value})} style={inp()}/></div><div style={{fontSize:12,color:T.textSub,marginBottom:8,marginTop:4}}>OBJETIVO</div><div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>{[["bajar_peso","Bajar de peso","↓"],["ganar_musculo","Ganar músculo","↑"],["rendimiento","Mejorar rendimiento","⚡"]].map(([v,l,i])=><button key={v} onClick={()=>setOb({...ob,objetivo:v})} style={{padding:"11px 16px",borderRadius:12,border:"1.5px solid "+(ob.objetivo===v?T.sage:T.border),background:ob.objetivo===v?T.sage+"18":"transparent",cursor:"pointer",textAlign:"left",display:"flex",gap:10,alignItems:"center",fontFamily:"DM Sans,sans-serif"}}><span>{i}</span><span style={{fontSize:14,color:ob.objetivo===v?T.sageD:T.charcoal,fontWeight:ob.objetivo===v?600:400}}>{l}</span></button>)}</div><div style={{fontSize:12,color:T.textSub,marginBottom:8}}>RESTRICCIONES (opcional)</div><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>{["Sin lactosa","Sin gluten","Vegano","Vegetariano"].map(r=>{const s=ob.restricciones.includes(r);return<button key={r} onClick={()=>setOb({...ob,restricciones:s?ob.restricciones.filter(x=>x!==r):[...ob.restricciones,r]})} style={{padding:"7px 14px",borderRadius:99,border:"1.5px solid "+(s?T.sand:T.border),background:s?T.sand+"22":"transparent",color:s?T.sand:T.textMid,cursor:"pointer",fontSize:13,fontFamily:"DM Sans,sans-serif"}}>{r}</button>;})}</div><button onClick={saveProfile} disabled={loading||!ob.nombre||!ob.peso_actual} style={btn(ob.nombre&&ob.peso_actual&&!loading?T.sage:T.muted)}>{loading?"Guardando...":"Comenzar mi cambio →"}</button></div></div>);
return(<div style={{background:T.shell,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Sans,system-ui",transition:"background .4s"}}><style>{CSS}</style><div style={{width:"100%",maxWidth:390,background:T.bg,borderRadius:44,overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,.2)",minHeight:780,position:"relative",transition:"background .4s"}}>
<div style={{height:44,background:T.surface,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px"}}><span style={{fontSize:12,fontWeight:600,color:T.textSub}}>9:41</span><div style={{width:90,height:24,background:T.charcoal,borderRadius:99}}/><span style={{fontSize:11,color:T.textSub}}>●●●</span></div>
<div style={{height:"calc(780px - 104px)",overflowY:"auto",background:T.bg,transition:"background .4s"}}>
{tab==="inicio"&&(<div style={{padding:"20px 18px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div><div style={{fontSize:13,color:T.textSub}}>Buenos días</div><div style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:600,color:T.charcoal}}>{profile?.nombre} <span style={{color:T.sage}}>✦</span></div></div><button onClick={()=>setDark(!dark)} style={{width:36,height:20,borderRadius:99,border:"none",background:dark?T.sage:T.border,cursor:"pointer",padding:2,display:"flex",alignItems:"center",justifyContent:dark?"flex-end":"flex-start"}}><div style={{width:16,height:16,borderRadius:99,background:"#fff"}}/></button></div>
<div style={{background:T.card,borderRadius:20,padding:18,border:"1px solid "+T.border,marginBottom:14}}>
<div style={{fontSize:11,color:T.textSub,marginBottom:8}}>PROGRESO DE PESO</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontFamily:"Playfair Display,serif",fontSize:34,fontWeight:600,color:T.charcoal}}>{profile?.peso_actual} kg</div><div style={{textAlign:"right"}}><div style={{fontSize:13,color:T.sage,fontWeight:600}}>Meta: {profile?.peso_meta} kg</div><div style={{fontSize:12,color:T.textSub}}>Por llegar: {(parseFloat(profile?.peso_actual||0)-parseFloat(profile?.peso_meta||0)).toFixed(1)} kg</div></div></div>
<div style={{background:T.border,borderRadius:99,height:6,marginTop:12,overflow:"hidden"}}><div style={{width:Math.max(5,Math.min(100,100-((parseFloat(profile?.peso_actual||0)-parseFloat(profile?.peso_meta||0))/(parseFloat(profile?.peso_actual||1))*100)))+"%",height:"100%",background:"linear-gradient(90deg,"+T.sage+","+T.sageL+")",borderRadius:99}}/></div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
<div style={{background:T.card,borderRadius:18,padding:16,border:"1px solid "+T.border}}>
<div style={{fontSize:11,color:T.textSub,marginBottom:6}}>AGUA HOY</div>
<div style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:600,color:T.sky}}>{agua}</div>
<div style={{fontSize:11,color:T.textSub,marginBottom:8}}>de 8 vasos</div>
<div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{Array.from({length:8}).map((_,i)=><button key={i} onClick={()=>updateAgua(Math.min(8,i+1))} style={{width:18,height:18,borderRadius:99,background:i<agua?T.sky:T.border,border:"none",cursor:"pointer"}}/>)}</div>
</div>
<div style={{background:T.card,borderRadius:18,padding:16,border:"1px solid "+T.border}}>
<div style={{fontSize:11,color:T.textSub,marginBottom:6}}>OBJETIVO</div>
<div style={{fontSize:13,fontWeight:600,color:T.clay,textTransform:"capitalize",marginBottom:6}}>{profile?.objetivo?.replace(/_/g," ")}</div>
<div style={{fontSize:11,color:T.textSub,marginBottom:4}}>Restricciones:</div>
<div style={{fontSize:11,color:T.textMid}}>{profile?.restricciones?.length?profile.restricciones.join(", "):"Ninguna"}</div>
</div>
</div>
<div style={{background:T.sage+"18",borderRadius:18,padding:16,border:"1px solid "+T.sage+"33"}}>
<div style={{fontSize:13,fontWeight:600,color:T.sageD,marginBottom:8}}>Resumen de hoy</div>
<div style={{fontSize:13,color:T.textMid,marginBottom:4}}>📦 Despensa: {stock.length} productos ({stock.filter(s=>s.cantidad<=s.minimo).length} por reponer)</div>
<div style={{fontSize:13,color:T.textMid,marginBottom:4}}>💧 Agua: {agua}/8 vasos</div>
<div style={{fontSize:13,color:T.textMid,marginBottom:8}}>💪 Sesiones: {sesiones.filter(s=>s.completada).length}/{sesiones.length} completadas</div>
<button onClick={()=>setTab("asistente")} style={{padding:"8px 16px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>Hablar con mi asistente ✦</button>
</div>
</div>)}
{tab==="habito"&&(<div style={{padding:"20px 18px"}}>
<div style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:600,color:T.charcoal,marginBottom:4}}>El Hábito</div>
<div style={{fontSize:13,color:T.textSub,marginBottom:18}}>Tu menú semanal personalizado</div>
{menu.length===0?(<div style={{background:T.card,borderRadius:18,padding:24,border:"1px solid "+T.border,textAlign:"center"}}>
<div style={{fontSize:32,marginBottom:12}}>🥗</div>
<div style={{fontFamily:"Playfair Display,serif",fontSize:18,color:T.charcoal,marginBottom:8}}>Sin menú aún</div>
<div style={{fontSize:13,color:T.textMid,marginBottom:16}}>Pídele a tu asistente IA que genere tu menú personalizado.</div>
<button onClick={()=>setTab("asistente")} style={{padding:"10px 20px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>Ir al asistente ✦</button>
</div>):menu.map((m,i)=>(<div key={i} style={{background:T.card,borderRadius:18,padding:"14px 16px",border:"1px solid "+T.border,marginBottom:10}}>
<div style={{fontSize:12,color:T.textSub,marginBottom:6,fontWeight:600}}>{m.dia?.toUpperCase()}</div>
{m.desayuno&&<div style={{fontSize:13,color:T.textMid,marginBottom:3}}>🌅 {m.desayuno}</div>}
{m.almuerzo&&<div style={{fontSize:13,color:T.textMid,marginBottom:3}}>☀️ {m.almuerzo}</div>}
{m.snack&&<div style={{fontSize:13,color:T.textMid,marginBottom:3}}>🍎 {m.snack}</div>}
{m.cena&&<div style={{fontSize:13,color:T.textMid}}>🌙 {m.cena}</div>}
</div>))}
</div>)}
{tab==="despensa"&&(<div style={{padding:"20px 18px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
<div style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:600,color:T.charcoal}}>La Despensa</div>
<button onClick={()=>setMostrarForm(!mostrarForm)} style={{padding:"8px 14px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>+ Agregar</button>
</div>
{mostrarForm&&(<div style={{background:T.card,borderRadius:16,padding:16,border:"1px solid "+T.border,marginBottom:16}}>
<input placeholder="Nombre del producto" value={nuevoProducto.nombre} onChange={e=>setNuevoProducto({...nuevoProducto,nombre:e.target.value})} style={inp()}/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
<input type="number" placeholder="Cantidad" value={nuevoProducto.cantidad} onChange={e=>setNuevoProducto({...nuevoProducto,cantidad:e.target.value})} style={inp()}/>
<select value={nuevoProducto.unidad} onChange={e=>setNuevoProducto({...nuevoProducto,unidad:e.target.value})} style={{...inp(),marginBottom:12}}><option value="g">gramos</option><option value="kg">kg</option><option value="ml">ml</option><option value="L">litros</option><option value="un">unidades</option></select>
</div>
<button onClick={agregarProducto} style={btn(T.sage,{padding:"10px"})}>Guardar producto</button>
</div>)}
{stock.length===0?(<div style={{background:T.card,borderRadius:18,padding:24,border:"1px solid "+T.border,textAlign:"center"}}>
<div style={{fontSize:32,marginBottom:12}}>📦</div>
<div style={{fontFamily:"Playfair Display,serif",fontSize:18,color:T.charcoal,marginBottom:8}}>Despensa vacía</div>
<div style={{fontSize:13,color:T.textMid}}>Agrega tus productos para hacer seguimiento de tu stock.</div>
</div>):stock.map((s)=>(<div key={s.id} style={{background:T.card,borderRadius:16,padding:"13px 16px",border:"1px solid "+(s.cantidad<=s.minimo?T.clay+"33":T.border),display:"flex",alignItems:"center",gap:12,marginBottom:9}}>
<div style={{width:9,height:9,borderRadius:99,background:s.cantidad<=s.minimo?T.clay:T.sage,flexShrink:0}}/>
<div style={{flex:1}}><div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>{s.nombre}</div><div style={{fontSize:11,color:T.textSub,marginTop:1}}>{s.cantidad} {s.unidad}</div></div>
{s.cantidad<=s.minimo&&<span style={{fontSize:11,color:T.clay,background:T.clay+"18",padding:"3px 10px",borderRadius:99}}>Reponer</span>}
<button onClick={()=>eliminarProducto(s.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.muted}}>×</button>
</div>))}
</div>)}
{tab==="entrena"&&(<div style={{padding:"20px 18px"}}>
<div style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:600,color:T.charcoal,marginBottom:4}}>La Transformación</div>
<div style={{fontSize:13,color:T.textSub,marginBottom:18}}>Tu plan de entrenamiento</div>
{sesiones.length===0?(<div style={{background:T.card,borderRadius:18,padding:24,border:"1px solid "+T.border,textAlign:"center"}}>
<div style={{fontSize:32,marginBottom:12}}>💪</div>
<div style={{fontFamily:"Playfair Display,serif",fontSize:18,color:T.charcoal,marginBottom:8}}>Sin plan aún</div>
<div style={{fontSize:13,color:T.textMid,marginBottom:16}}>Pídele a tu asistente que genere tu mesociclo.</div>
<button onClick={()=>setTab("asistente")} style={{padding:"10px 20px",borderRadius:99,background:T.violet,border:"none",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>Ir al asistente ✦</button>
</div>):(<div>
<div style={{background:T.violet+"14",borderRadius:18,padding:16,border:"1px solid "+T.violet+"22",marginBottom:16}}>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",textAlign:"center",gap:8}}>
<div><div style={{fontFamily:"Playfair Display,serif",fontSize:18,fontWeight:600,color:T.violet}}>{sesiones.filter(s=>s.completada).length}/{sesiones.length}</div><div style={{fontSize:10,color:T.textSub}}>Sesiones</div></div>
<div><div style={{fontFamily:"Playfair Display,serif",fontSize:18,fontWeight:600,color:T.violet}}>{sesiones.length?Math.round((sesiones.filter(s=>s.completada).length/sesiones.length)*100):0}%</div><div style={{fontSize:10,color:T.textSub}}>Adherencia</div></div>
<div><div style={{fontFamily:"Playfair Display,serif",fontSize:18,fontWeight:600,color:T.violet}}>Sem {Math.max(...sesiones.map(s=>s.semana||1))}</div><div style={{fontSize:10,color:T.textSub}}>Progreso</div></div>
</div></div>
{sesiones.map(s=>(<div key={s.id} onClick={()=>toggleSesion(s.id,s.completada)} style={{background:T.card,borderRadius:18,padding:"14px 16px",border:"1.5px solid "+(s.completada?T.violet+"44":T.border),marginBottom:10,cursor:"pointer",opacity:s.completada?.7:1,transition:"all .25s"}}>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<div style={{width:26,height:26,borderRadius:99,border:"2px solid "+(s.completada?T.violet:T.border),background:s.completada?T.violet:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff"}}>{s.completada&&"✓"}</div>
<div><div style={{fontSize:14,color:s.completada?T.textSub:T.charcoal,fontWeight:500,textDecoration:s.completada?"line-through":"none"}}>{s.dia}</div><div style={{fontSize:12,color:T.violet,marginTop:2}}>{s.grupo}</div></div>
</div></div>))}
</div>)}
</div>)}
{tab==="asistente"&&(<div style={{display:"flex",flexDirection:"column",height:"calc(780px - 104px)"}}>
<div style={{padding:"16px 18px 12px",background:T.surface,borderBottom:"1px solid "+T.border,flexShrink:0}}>
<div style={{fontFamily:"Playfair Display,serif",fontSize:20,fontWeight:600,color:T.charcoal}}>Tu asistente <span style={{color:T.sage}}>✦</span></div>
<div style={{fontSize:12,color:T.textSub,marginTop:2}}>IA personalizada con tu perfil y despensa</div>
</div>
<div style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:12,background:T.bg}}>
{msgs.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8}}>
{m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:99,background:"linear-gradient(135deg,"+T.sage+","+T.sageD+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,marginTop:3}}>✦</div>}
<div style={{maxWidth:"78%",padding:"10px 13px",borderRadius:16,background:m.role==="user"?T.sage:T.card,border:m.role==="user"?"none":"1px solid "+T.border,borderBottomRightRadius:m.role==="user"?3:16,borderBottomLeftRadius:m.role==="assistant"?3:16,fontSize:13,color:m.role==="user"?"#fff":T.charcoal,lineHeight:1.65}}>
{m.text.split("\n").map((line,j,arr)=><span key={j}>{line.split(/(\*\*[^*]+\*\*)/).map((p,k)=>p.startsWith("**")?<strong key={k}>{p.slice(2,-2)}</strong>:p)}{j<arr.length-1&&<br/>}</span>)}
</div></div>))}
{chatLoading&&<div style={{display:"flex",gap:8}}><div style={{width:28,height:28,borderRadius:99,background:"linear-gradient(135deg,"+T.sage+","+T.sageD+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>✦</div><div style={{padding:"10px 14px",borderRadius:16,borderBottomLeftRadius:3,background:T.card,border:"1px solid "+T.border}}><div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:99,background:T.muted,animation:"pulse 1.2s ease-in-out "+i*.2+"s infinite"}}/>)}</div></div></div>}
<div ref={chatBottom}/>
</div>
<div style={{padding:"6px 10px",display:"flex",gap:6,overflowX:"auto",background:T.surface,borderTop:"1px solid "+T.border,flexShrink:0}}>
{["¿Qué puedo cocinar con mi despensa?","Genera mi menú semanal","Crea mi plan de entrenamiento","¿Cómo voy con mi objetivo?"].map(s=><button key={s} onClick={()=>setChatInput(s)} style={{padding:"6px 12px",borderRadius:99,fontSize:11,border:"1px solid "+T.border,background:T.card,color:T.textMid,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"DM Sans,sans-serif",flexShrink:0}}>{s}</button>)}
</div>
<div style={{padding:"8px 10px 12px",display:"flex",gap:8,background:T.surface,borderTop:"1px solid "+T.border,flexShrink:0}}>
<input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Pregunta algo..." style={{flex:1,padding:"10px 13px",borderRadius:12,border:"1.5px solid "+T.border,background:T.card,fontSize:13,color:T.charcoal,outline:"none",fontFamily:"DM Sans,sans-serif"}}/>
<button onClick={sendChat} disabled={chatLoading} style={{width:42,height:42,borderRadius:99,background:chatLoading?T.muted:T.sage,border:"none",color:"#fff",fontSize:16,cursor:chatLoading?"default":"pointer",flexShrink:0}}>→</button>
</div>
</div>)}
</div>
<div style={{position:"absolute",bottom:0,left:0,right:0,height:60,background:T.surface,borderTop:"1px solid "+T.border,display:"flex"}}>
{TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,border:"none",background:"transparent",cursor:"pointer"}}>
<span style={{fontSize:16,color:tab===t.id?T.sage:T.muted}}>{t.icon}</span>
<span style={{fontSize:9,color:tab===t.id?T.sage:T.muted,fontWeight:tab===t.id?600:400,fontFamily:"DM Sans,sans-serif"}}>{t.label}</span>
{tab===t.id&&<div style={{width:16,height:2,borderRadius:99,background:T.sage}}/>}
</button>)}
</div>
</div></div>);
}





