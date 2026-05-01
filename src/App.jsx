import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uiktwbtwzotqduzwtjcb.supabase.co",
  "sb_publishable_ONXQyJvXKUIUqppaWnZG4w_epX1u7ml"
);

const LIGHT = { bg:"#F7F5F0", surface:"#FDFCFA", card:"#FFFFFF", border:"#EAE4D8", sage:"#7C9E87", sageL:"#A8C4AF", sageD:"#5A7D65", sand:"#C4A882", clay:"#C4856A", sky:"#7EA8C4", violet:"#9B8EC4", charcoal:"#2C2C2C", textMid:"#6B6458", textSub:"#9C9284", muted:"#B8B0A0", shell:"#E8E4DC" };
const DARK  = { bg:"#161C18", surface:"#1C2420", card:"#212B25", border:"#2A3830", sage:"#7EC494", sageL:"#5A9970", sageD:"#A8D4B4", sand:"#D4B48C", clay:"#D4956A", sky:"#8AB8D4", violet:"#B4A8D8", charcoal:"#EAE6DE", textMid:"#A8A090", textSub:"#6E6860", muted:"#4A4840", shell:"#0E1210" };

const TABS = [{id:"inicio",label:"Inicio",icon:"◈"},{id:"habito",label:"Hábito",icon:"▦"},{id:"despensa",label:"Despensa",icon:"⬡"},{id:"entrena",label:"Entrena",icon:"◉"},{id:"perfil",label:"Perfil",icon:"✦"}];

export default function App() {
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState("auth");
  const [tab, setTab] = useState("inicio");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modo, setModo] = useState("login");
  const [ob, setOb] = useState({nombre:"",apellido:"",peso_actual:"",peso_meta:"",objetivo:"bajar_peso",restricciones:[]});
  const [agua, setAgua] = useState(5);
  const [checks, setChecks] = useState({});
  const T = dark ? DARK : LIGHT;

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{ if(session?.user){setUser(session.user);await loadProfile(session.user.id);} });
    supabase.auth.onAuthStateChange(async(_,session)=>{ if(session?.user){setUser(session.user);await loadProfile(session.user.id);}else{setUser(null);setProfile(null);setScreen("auth");} });
  },[]);

  const loadProfile = async(uid)=>{
    const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();
    if(data?.nombre){setProfile(data);setScreen("app");}else setScreen("onboarding");
  };

  const handleAuth = async()=>{
    setLoading(true);setError("");
    try{
      if(modo==="registro"){const{error:e}=await supabase.auth.signUp({email,password:pass});if(e)throw e;setError("Revisa tu email para confirmar tu cuenta");}
      else{const{error:e}=await supabase.auth.signInWithPassword({email,password:pass});if(e)throw e;}
    }catch(e){setError(e.message);}
    setLoading(false);
  };

  const saveProfile = async()=>{
    setLoading(true);
    const{error:e}=await supabase.from("profiles").upsert({id:user.id,email:user.email,...ob,peso_actual:parseFloat(ob.peso_actual),peso_meta:parseFloat(ob.peso_meta)});
    if(!e){setProfile({...ob,email:user.email});setScreen("app");}else setError(e.message);
    setLoading(false);
  };

  const logout=async()=>{await supabase.auth.signOut();};
  const inp=(x={})=>({width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid "+T.border,background:T.card,fontSize:14,marginBottom:12,color:T.charcoal,outline:"none",fontFamily:"DM Sans,sans-serif",...x});
  const btn=(bg,x={})=>({width:"100%",padding:14,borderRadius:99,background:bg,border:"none",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"DM Sans,sans-serif",...x});

  const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@400;500;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}`;

  if(screen==="auth") return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,transition:"background .4s"}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:400,background:T.surface,borderRadius:24,padding:"40px 28px",border:"1px solid "+T.border}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:26,fontWeight:600,color:T.charcoal}}>Tri<span style={{color:T.sage}}>Flow</span></div>
          <button onClick={()=>setDark(!dark)} style={{width:40,height:40,borderRadius:99,border:"1px solid "+T.border,background:T.card,cursor:"pointer",fontSize:18}}>{dark?"☀️":"🌙"}</button>
        </div>
        <div style={{display:"flex",marginBottom:24,background:T.bg,borderRadius:12,padding:4}}>
          {["login","registro"].map(m=><button key={m} onClick={()=>{setModo(m);setError("");}} style={{flex:1,padding:"10px",borderRadius:9,border:"none",background:modo===m?T.card:"transparent",color:modo===m?T.charcoal:T.muted,fontWeight:modo===m?600:400,cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:14}}>{m==="login"?"Iniciar sesión":"Crear cuenta"}</button>)}
        </div>
        {error&&<div style={{background:T.clay+"22",border:"1px solid "+T.clay,borderRadius:12,padding:"10px 12px",marginBottom:16,fontSize:13,color:T.clay}}>{error}</div>}
        <input type="email" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={inp()}/>
        <input type="password" placeholder="Contraseña (mín 6 caracteres)" value={pass} onChange={e=>setPass(e.target.value)} style={inp({marginBottom:20})}/>
        <button onClick={handleAuth} disabled={loading||!email||!pass} style={btn(email&&pass&&!loading?T.sage:T.muted)}>{loading?"Cargando...":modo==="login"?"Iniciar sesión":"Crear cuenta"}</button>
      </div>
    </div>
  );

  if(screen==="onboarding") return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,transition:"background .4s"}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:440,background:T.surface,borderRadius:24,padding:"40px 28px",border:"1px solid "+T.border}}>
        <div style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:600,color:T.charcoal,marginBottom:6}}>Cuéntanos sobre ti</div>
        <div style={{fontSize:14,color:T.textSub,marginBottom:24}}>Para personalizar tu experiencia en TriFlow</div>
        {error&&<div style={{background:T.clay+"22",border:"1px solid "+T.clay,borderRadius:12,padding:"10px 12px",marginBottom:16,fontSize:13,color:T.clay}}>{error}</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <input placeholder="Nombre" value={ob.nombre} onChange={e=>setOb({...ob,nombre:e.target.value})} style={inp()}/>
          <input placeholder="Apellido" value={ob.apellido} onChange={e=>setOb({...ob,apellido:e.target.value})} style={inp()}/>
          <input type="number" placeholder="Peso actual (kg)" value={ob.peso_actual} onChange={e=>setOb({...ob,peso_actual:e.target.value})} style={inp()}/>
          <input type="number" placeholder="Peso meta (kg)" value={ob.peso_meta} onChange={e=>setOb({...ob,peso_meta:e.target.value})} style={inp()}/>
        </div>
        <div style={{fontSize:12,color:T.textSub,marginBottom:8,marginTop:4}}>OBJETIVO</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {[["bajar_peso","Bajar de peso","↓"],["ganar_musculo","Ganar músculo","↑"],["rendimiento","Mejorar rendimiento","⚡"]].map(([v,l,i])=>(
            <button key={v} onClick={()=>setOb({...ob,objetivo:v})} style={{padding:"11px 16px",borderRadius:12,border:"1.5px solid "+(ob.objetivo===v?T.sage:T.border),background:ob.objetivo===v?T.sage+"18":"transparent",cursor:"pointer",textAlign:"left",display:"flex",gap:10,alignItems:"center",fontFamily:"DM Sans,sans-serif"}}>
              <span style={{fontSize:16}}>{i}</span><span style={{fontSize:14,color:ob.objetivo===v?T.sageD:T.charcoal,fontWeight:ob.objetivo===v?600:400}}>{l}</span>
            </button>
          ))}
        </div>
        <div style={{fontSize:12,color:T.textSub,marginBottom:8}}>RESTRICCIONES (opcional)</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
          {["Sin lactosa","Sin gluten","Vegano","Vegetariano"].map(r=>{const s=ob.restricciones.includes(r);return<button key={r} onClick={()=>setOb({...ob,restricciones:s?ob.restricciones.filter(x=>x!==r):[...ob.restricciones,r]})} style={{padding:"7px 14px",borderRadius:99,border:"1.5px solid "+(s?T.sand:T.border),background:s?T.sand+"22":"transparent",color:s?T.sand:T.textMid,cursor:"pointer",fontSize:13,fontFamily:"DM Sans,sans-serif"}}>{r}</button>;})}
        </div>
        <button onClick={saveProfile} disabled={loading||!ob.nombre||!ob.peso_actual} style={btn(ob.nombre&&ob.peso_actual&&!loading?T.sage:T.muted)}>{loading?"Guardando...":"Comenzar mi cambio →"}</button>
      </div>
    </div>
  );

  const MENU = [{t:"Desayuno",e:"🌅",d:"Avena con frutas y leche vegetal",k:320,h:"08:00"},{t:"Almuerzo",e:"☀️",d:"Pechuga grillada, quinoa y ensalada",k:480,h:"13:00"},{t:"Once",e:"🍎",d:"Manzana + 10 almendras",k:180,h:"16:30"},{t:"Cena",e:"🌙",d:"Sopa de verduras y pan integral",k:380,h:"20:00"}];
  const STOCK = [{n:"Avena",c:800,u:"g",ok:true},{n:"Pechuga",c:600,u:"g",ok:true},{n:"Huevos",c:4,u:"un",ok:false},{n:"Salmón",c:0,u:"g",ok:false},{n:"Quinoa",c:100,u:"g",ok:false}];
  const EJERCICIOS = [{n:"Sentadilla goblet",s:3,r:"12",p:"12kg"},{n:"Peso muerto rumano",s:3,r:"12",p:"20kg"},{n:"Press de banca",s:3,r:"10",p:"30kg"},{n:"Remo con mancuerna",s:3,r:"12",p:"14kg"},{n:"Plancha",s:3,r:"30s",p:"—"}];

  return (
    <div style={{background:T.shell,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Sans,system-ui",transition:"background .4s"}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:390,background:T.bg,borderRadius:44,overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,.2)",minHeight:780,position:"relative",transition:"background .4s"}}>
        <div style={{height:44,background:T.surface,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",transition:"background .4s"}}>
          <span style={{fontSize:12,fontWeight:600,color:T.textSub}}>9:41</span>
          <div style={{width:90,height:24,background:T.charcoal,borderRadius:99}}/>
          <span style={{fontSize:11,color:T.textSub}}>●●●</span>
        </div>

        <div style={{height:"calc(780px - 44px - 60px)",overflowY:"auto",background:T.bg,transition:"background .4s"}}>

          {tab==="inicio" && (
            <div style={{padding:"20px 18px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div>
                  <div style={{fontSize:13,color:T.textSub}}>Buenos días</div>
                  <div style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:600,color:T.charcoal}}>{profile?.nombre} <span style={{color:T.sage}}>✦</span></div>
                </div>
                <button onClick={()=>setDark(!dark)} style={{width:36,height:20,borderRadius:99,border:"none",background:dark?T.sage:T.border,cursor:"pointer",padding:2,display:"flex",alignItems:"center",justifyContent:dark?"flex-end":"flex-start"}}>
                  <div style={{width:16,height:16,borderRadius:99,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
                </button>
              </div>
              <div style={{background:T.card,borderRadius:20,padding:18,border:"1px solid "+T.border,marginBottom:14,transition:"all .4s"}}>
                <div style={{fontSize:11,color:T.textSub,marginBottom:8}}>CALORÍAS HOY</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontFamily:"Playfair Display,serif",fontSize:34,fontWeight:600,color:T.charcoal}}>1.240</div>
                  <div style={{fontSize:13,color:T.textSub}}>de 1.600 kcal</div>
                </div>
                <div style={{background:T.border,borderRadius:99,height:6,marginTop:12,overflow:"hidden"}}>
                  <div style={{width:"78%",height:"100%",background:"linear-gradient(90deg,"+T.sage+","+T.sageL+")",borderRadius:99}}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div style={{background:T.card,borderRadius:18,padding:16,border:"1px solid "+T.border,transition:"all .4s"}}>
                  <div style={{fontSize:11,color:T.textSub,marginBottom:6}}>AGUA</div>
                  <div style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:600,color:T.sky}}>{agua}</div>
                  <div style={{fontSize:11,color:T.textSub,marginBottom:8}}>de 8 vasos</div>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                    {Array.from({length:8}).map((_,i)=><button key={i} onClick={()=>setAgua(Math.min(8,i+1))} style={{width:18,height:18,borderRadius:99,background:i<agua?T.sky:T.border,border:"none",cursor:"pointer",fontSize:8}}/>)}
                  </div>
                </div>
                <div style={{background:T.card,borderRadius:18,padding:16,border:"1px solid "+T.border,transition:"all .4s"}}>
                  <div style={{fontSize:11,color:T.textSub,marginBottom:6}}>PROGRESO</div>
                  <div style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:600,color:T.sage}}>{profile?.peso_actual} kg</div>
                  <div style={{fontSize:11,color:T.textSub,marginBottom:8}}>meta {profile?.peso_meta} kg</div>
                  <div style={{background:T.border,borderRadius:99,height:6,overflow:"hidden"}}>
                    <div style={{width:"28%",height:"100%",background:T.sage,borderRadius:99}}/>
                  </div>
                </div>
              </div>
              <div style={{background:T.sage+"18",borderRadius:18,padding:16,border:"1px solid "+T.sage+"33"}}>
                <div style={{fontSize:13,fontWeight:600,color:T.sageD,marginBottom:4}}>Tu próxima sesión</div>
                <div style={{fontSize:14,color:T.charcoal}}>Miércoles · Cardio + Core</div>
                <button onClick={()=>setTab("entrena")} style={{marginTop:10,padding:"8px 16px",borderRadius:99,background:T.sage,border:"none",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>Ver entrenamiento →</button>
              </div>
            </div>
          )}

          {tab==="habito" && (
            <div style={{padding:"20px 18px"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:600,color:T.charcoal,marginBottom:18}}>El Hábito</div>
              {MENU.map((m,i)=>(
                <div key={i} onClick={()=>setChecks(p=>({...p,[i]:!p[i]}))} style={{background:T.card,borderRadius:18,padding:"14px 16px",border:"1px solid "+(checks[i]?T.sage+"44":T.border),marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:12,opacity:checks[i]?.7:1,transition:"all .25s"}}>
                  <div style={{width:26,height:26,borderRadius:99,border:"2px solid "+(checks[i]?T.sage:T.border),background:checks[i]?T.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",flexShrink:0}}>{checks[i]&&"✓"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:T.textSub}}>{m.e} {m.t.toUpperCase()} · {m.h}</div>
                    <div style={{fontSize:14,color:checks[i]?T.textSub:T.charcoal,textDecoration:checks[i]?"line-through":"none",marginTop:2}}>{m.d}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:1}}>{m.k} kcal</div>
                  </div>
                </div>
              ))}
              <div style={{background:T.sage+"14",borderRadius:18,padding:16,border:"1px solid "+T.sage+"22",marginTop:8}}>
                <div style={{fontSize:11,color:T.textSub,marginBottom:8}}>RESUMEN DEL DÍA</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",textAlign:"center",gap:8}}>
                  {[["1.360","Kcal",T.charcoal],["72g","Prot",T.clay],["158g","Carbs",T.sand],["41g","Grasas",T.sky]].map(([v,k,c])=>(
                    <div key={k}><div style={{fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:600,color:c}}>{v}</div><div style={{fontSize:10,color:T.textSub}}>{k}</div></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab==="despensa" && (
            <div style={{padding:"20px 18px"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:600,color:T.charcoal,marginBottom:18}}>La Despensa</div>
              {STOCK.map((s,i)=>(
                <div key={i} style={{background:T.card,borderRadius:16,padding:"13px 16px",border:"1px solid "+(s.ok?T.border:T.clay+"33"),display:"flex",alignItems:"center",gap:12,marginBottom:9,transition:"all .4s"}}>
                  <div style={{width:9,height:9,borderRadius:99,background:s.ok?T.sage:T.clay,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,color:T.charcoal,fontWeight:500}}>{s.n}</div>
                    <div style={{fontSize:11,color:T.textSub,marginTop:1}}>{s.c} {s.u}</div>
                  </div>
                  {!s.ok&&<span style={{fontSize:11,color:T.clay,background:T.clay+"18",padding:"3px 10px",borderRadius:99}}>Reponer</span>}
                </div>
              ))}
              <div style={{background:T.sand+"18",borderRadius:16,padding:16,border:"1px solid "+T.sand+"33",marginTop:8}}>
                <div style={{fontSize:13,fontWeight:500,color:T.sand,marginBottom:4}}>Lista de compras</div>
                {STOCK.filter(s=>!s.ok).map((s,i)=><div key={i} style={{fontSize:13,color:T.textMid,marginBottom:4}}>· {s.n}</div>)}
              </div>
            </div>
          )}

          {tab==="entrena" && (
            <div style={{padding:"20px 18px"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:600,color:T.charcoal,marginBottom:4}}>La Transformación</div>
              <div style={{fontSize:13,color:T.violet,marginBottom:18}}>Semana 2 · Cuerpo completo</div>
              <div style={{background:T.violet+"14",borderRadius:18,padding:16,border:"1px solid "+T.violet+"22",marginBottom:16}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",textAlign:"center",gap:8}}>
                  {[["4/6","Sesiones"],["67%","Adherencia"],["Sem 2","Progreso"]].map(([v,k])=>(
                    <div key={k}><div style={{fontFamily:"Playfair Display,serif",fontSize:18,fontWeight:600,color:T.violet}}>{v}</div><div style={{fontSize:10,color:T.textSub}}>{k}</div></div>
                  ))}
                </div>
              </div>
              {EJERCICIOS.map((e,i)=>{
                const done=checks["e"+i];
                return(
                  <div key={i} onClick={()=>setChecks(p=>({...p,["e"+i]:!p["e"+i]}))} style={{background:T.card,borderRadius:18,padding:"14px 16px",border:"1.5px solid "+(done?T.violet+"44":T.border),marginBottom:10,cursor:"pointer",transition:"all .25s",opacity:done?.7:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:26,height:26,borderRadius:99,border:"2px solid "+(done?T.violet:T.border),background:done?T.violet:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",flexShrink:0}}>{done&&"✓"}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,color:done?T.textSub:T.charcoal,fontWeight:500,textDecoration:done?"line-through":"none"}}>{e.n}</div>
                        <div style={{display:"flex",gap:12,marginTop:4}}>
                          {[["Series",e.s],["Reps",e.r],["Peso",e.p]].map(([k,v])=>(
                            <div key={k}><div style={{fontSize:12,fontWeight:600,color:done?T.muted:T.violet}}>{v}</div><div style={{fontSize:10,color:T.muted}}>{k}</div></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab==="perfil" && (
            <div style={{padding:"20px 18px"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:600,color:T.charcoal,marginBottom:20}}>Mi perfil</div>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                <div style={{width:56,height:56,borderRadius:99,background:"linear-gradient(135deg,"+T.sage+","+T.sageD+")",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:20,fontWeight:600}}>{profile?.nombre?.[0]}{profile?.apellido?.[0]}</div>
                <div>
                  <div style={{fontFamily:"Playfair Display,serif",fontSize:18,fontWeight:600,color:T.charcoal}}>{profile?.nombre} {profile?.apellido}</div>
                  <div style={{fontSize:13,color:T.textSub}}>{profile?.email}</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {[["Peso actual",profile?.peso_actual+" kg",T.sage],["Meta",profile?.peso_meta+" kg",T.sand],["Objetivo",profile?.objetivo?.replace("_"," "),T.clay]].map(([k,v,c])=>(
                  <div key={k} style={{background:T.card,borderRadius:14,padding:14,border:"1px solid "+T.border,transition:"all .4s"}}>
                    <div style={{fontSize:10,color:T.textSub,marginBottom:3}}>{k.toUpperCase()}</div>
                    <div style={{fontFamily:"Playfair Display,serif",fontSize:18,fontWeight:600,color:c,textTransform:"capitalize"}}>{v}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>setDark(!dark)} style={{width:"100%",padding:"13px",borderRadius:14,border:"1px solid "+T.border,background:T.card,color:T.charcoal,cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:14,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>{dark?"Modo oscuro":"Modo claro"}</span><span>{dark?"🌙":"☀️"}</span>
              </button>
              <button onClick={logout} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:T.clay,color:"#fff",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:14,fontWeight:600}}>Cerrar sesión</button>
            </div>
          )}

        </div>

        <div style={{position:"absolute",bottom:0,left:0,right:0,height:60,background:T.surface,borderTop:"1px solid "+T.border,display:"flex",transition:"all .4s"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,border:"none",background:"transparent",cursor:"pointer"}}>
              <span style={{fontSize:16,color:tab===t.id?T.sage:T.muted}}>{t.icon}</span>
              <span style={{fontSize:9,color:tab===t.id?T.sage:T.muted,fontWeight:tab===t.id?600:400,fontFamily:"DM Sans,sans-serif"}}>{t.label}</span>
              {tab===t.id&&<div style={{width:16,height:2,borderRadius:99,background:T.sage}}/>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
