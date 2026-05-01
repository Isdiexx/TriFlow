import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uiktwbtwzotqduzwtjcb.supabase.co",
  "sb_publishable_ONXQyJvXKUIUqppaWnZG4w_epX1u7ml"
);

const LIGHT = { bg:"#F7F5F0", surface:"#FDFCFA", card:"#FFFFFF", border:"#EAE4D8", sage:"#7C9E87", sageD:"#5A7D65", charcoal:"#2C2C2C", textMid:"#6B6458", textSub:"#9C9284", muted:"#B8B0A0", clay:"#C4856A", sand:"#C4A882" };
const DARK  = { bg:"#161C18", surface:"#1C2420", card:"#212B25", border:"#2A3830", sage:"#7EC494", sageD:"#A8D4B4", charcoal:"#EAE6DE", textMid:"#A8A090", textSub:"#6E6860", muted:"#4A4840", clay:"#D4956A", sand:"#D4B48C" };

const s = (obj) => Object.assign({}, obj);

export default function App() {
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState("auth");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modo, setModo] = useState("login");
  const [onboarding, setOnboarding] = useState({ nombre:"", apellido:"", peso_actual:"", peso_meta:"", objetivo:"bajar_peso", restricciones:[] });
  const T = dark ? DARK : LIGHT;

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) { setUser(session.user); await loadProfile(session.user.id); }
    });
    supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) { setUser(session.user); await loadProfile(session.user.id); }
      else { setUser(null); setProfile(null); setScreen("auth"); }
    });
  }, []);

  const loadProfile = async (uid) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (data?.nombre) { setProfile(data); setScreen("home"); }
    else setScreen("onboarding");
  };

  const handleAuth = async () => {
    setLoading(true); setError("");
    try {
      if (modo === "registro") {
        const { error: e } = await supabase.auth.signUp({ email, password: pass });
        if (e) throw e;
        setError("Revisa tu email para confirmar tu cuenta");
      } else {
        const { error: e } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (e) throw e;
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const saveProfile = async () => {
    setLoading(true);
    const { error: e } = await supabase.from("profiles").upsert({ id: user.id, email: user.email, ...onboarding, peso_actual: parseFloat(onboarding.peso_actual), peso_meta: parseFloat(onboarding.peso_meta) });
    if (!e) { setProfile({ ...onboarding, email: user.email }); setScreen("home"); }
    else setError(e.message);
    setLoading(false);
  };

  const logout = async () => { await supabase.auth.signOut(); };

  const inp = (extra={}) => ({ width:"100%", padding:"12px 14px", borderRadius:12, border:"1.5px solid "+T.border, background:T.card, fontSize:14, marginBottom:12, color:T.charcoal, outline:"none", fontFamily:"DM Sans,sans-serif", ...extra });
  const btn = (bg, extra={}) => ({ width:"100%", padding:14, borderRadius:99, background:bg, border:"none", color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif", transition:"background .2s", ...extra });

  if (screen === "auth") return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,transition:"background .4s"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@400;500;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}`}</style>
      <div style={{width:"100%",maxWidth:400,background:T.surface,borderRadius:24,padding:"40px 28px",border:"1px solid "+T.border}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:26,fontWeight:600,color:T.charcoal}}>Tri<span style={{color:T.sage}}>Flow</span></div>
          <button onClick={()=>setDark(!dark)} style={{width:40,height:40,borderRadius:99,border:"1px solid "+T.border,background:T.card,cursor:"pointer",fontSize:18}}>{dark?"☀️":"🌙"}</button>
        </div>
        <div style={{display:"flex",marginBottom:24,background:T.bg,borderRadius:12,padding:4}}>
          {["login","registro"].map(m=>(
            <button key={m} onClick={()=>{setModo(m);setError("")}} style={{flex:1,padding:"10px",borderRadius:9,border:"none",background:modo===m?T.card:"transparent",color:modo===m?T.charcoal:T.muted,fontWeight:modo===m?600:400,cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:14}}>
              {m==="login"?"Iniciar sesion":"Crear cuenta"}
            </button>
          ))}
        </div>
        {error && <div style={{background:T.clay+"22",border:"1px solid "+T.clay,borderRadius:12,padding:"10px 12px",marginBottom:16,fontSize:13,color:T.clay}}>{error}</div>}
        <input type="email" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={inp()}/>
        <input type="password" placeholder="Contrasena (min 6 caracteres)" value={pass} onChange={e=>setPass(e.target.value)} style={inp({marginBottom:20})}/>
        <button onClick={handleAuth} disabled={loading||!email||!pass} style={btn(email&&pass&&!loading?T.sage:T.muted)}>
          {loading?"Cargando...":modo==="login"?"Iniciar sesion":"Crear cuenta"}
        </button>
      </div>
    </div>
  );

  if (screen === "onboarding") return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,transition:"background .4s"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@400;500;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}`}</style>
      <div style={{width:"100%",maxWidth:440,background:T.surface,borderRadius:24,padding:"40px 28px",border:"1px solid "+T.border}}>
        <div style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:600,color:T.charcoal,marginBottom:6}}>Cuéntanos sobre ti</div>
        <div style={{fontSize:14,color:T.textSub,marginBottom:28}}>Para personalizar tu experiencia en TriFlow</div>
        {error && <div style={{background:T.clay+"22",border:"1px solid "+T.clay,borderRadius:12,padding:"10px 12px",marginBottom:16,fontSize:13,color:T.clay}}>{error}</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:0}}>
          <input placeholder="Nombre" value={onboarding.nombre} onChange={e=>setOnboarding({...onboarding,nombre:e.target.value})} style={inp()}/>
          <input placeholder="Apellido" value={onboarding.apellido} onChange={e=>setOnboarding({...onboarding,apellido:e.target.value})} style={inp()}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <input type="number" placeholder="Peso actual (kg)" value={onboarding.peso_actual} onChange={e=>setOnboarding({...onboarding,peso_actual:e.target.value})} style={inp()}/>
          <input type="number" placeholder="Peso meta (kg)" value={onboarding.peso_meta} onChange={e=>setOnboarding({...onboarding,peso_meta:e.target.value})} style={inp()}/>
        </div>
        <div style={{fontSize:12,color:T.textSub,marginBottom:8,marginTop:4}}>OBJETIVO PRINCIPAL</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {[["bajar_peso","Bajar de peso","↓"],["ganar_musculo","Ganar musculo","↑"],["rendimiento","Mejorar rendimiento","⚡"]].map(([val,label,ico])=>(
            <button key={val} onClick={()=>setOnboarding({...onboarding,objetivo:val})} style={{padding:"12px 16px",borderRadius:12,border:"1.5px solid "+(onboarding.objetivo===val?T.sage:T.border),background:onboarding.objetivo===val?T.sage+"18":"transparent",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,fontFamily:"DM Sans,sans-serif"}}>
              <span style={{fontSize:18}}>{ico}</span>
              <span style={{fontSize:14,color:onboarding.objetivo===val?T.sageD:T.charcoal,fontWeight:onboarding.objetivo===val?600:400}}>{label}</span>
            </button>
          ))}
        </div>
        <div style={{fontSize:12,color:T.textSub,marginBottom:8}}>RESTRICCIONES ALIMENTARIAS (opcional)</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
          {["Sin lactosa","Sin gluten","Vegano","Vegetariano"].map(r=>{
            const sel = onboarding.restricciones.includes(r);
            return <button key={r} onClick={()=>setOnboarding({...onboarding,restricciones:sel?onboarding.restricciones.filter(x=>x!==r):[...onboarding.restricciones,r]})} style={{padding:"8px 14px",borderRadius:99,border:"1.5px solid "+(sel?T.sand:T.border),background:sel?T.sand+"22":"transparent",color:sel?T.sand:T.textMid,cursor:"pointer",fontSize:13,fontFamily:"DM Sans,sans-serif"}}>{r}</button>
          })}
        </div>
        <button onClick={saveProfile} disabled={loading||!onboarding.nombre||!onboarding.peso_actual} style={btn(onboarding.nombre&&onboarding.peso_actual&&!loading?T.sage:T.muted)}>
          {loading?"Guardando...":"Comenzar mi cambio →"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"DM Sans,system-ui",padding:"40px 20px",transition:"background .4s"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@400;500;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}`}</style>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:28,fontWeight:600,color:T.charcoal}}>Tri<span style={{color:T.sage}}>Flow</span></div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setDark(!dark)} style={{padding:"8px 16px",borderRadius:99,border:"1px solid "+T.border,background:T.card,cursor:"pointer"}}>{dark?"☀️":"🌙"}</button>
            <button onClick={logout} style={{padding:"8px 16px",borderRadius:99,background:T.clay,border:"none",color:"#fff",cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>Salir</button>
          </div>
        </div>
        <div style={{background:T.surface,borderRadius:20,padding:30,border:"1px solid "+T.border,marginBottom:20}}>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:600,color:T.charcoal,marginBottom:4}}>Hola, {profile?.nombre}!</div>
          <div style={{fontSize:14,color:T.textMid,marginBottom:24}}>Bienvenido a TriFlow — tu cambio comienza hoy</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
            {[["Peso actual",profile?.peso_actual+" kg",T.sage],["Meta",profile?.peso_meta+" kg",T.sand],["Objetivo",profile?.objetivo?.replace("_"," "),T.clay]].map(([k,v,c])=>(
              <div key={k} style={{background:T.bg,borderRadius:14,padding:"14px 16px",border:"1px solid "+T.border}}>
                <div style={{fontSize:11,color:T.textSub,marginBottom:4}}>{k.toUpperCase()}</div>
                <div style={{fontFamily:"Playfair Display,serif",fontSize:20,fontWeight:600,color:c,textTransform:"capitalize"}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{background:T.sage+"18",borderRadius:16,padding:20,border:"1px solid "+T.sage+"33"}}>
            <div style={{fontFamily:"Playfair Display,serif",fontSize:17,color:T.charcoal,marginBottom:10}}>Los tres pilares de tu cambio</div>
            {[["La Despensa","Inventario, stock y compras automaticas","🥦"],["El Habito","Menus personalizados con IA","🥗"],["La Transformacion","Plan de entrenamiento mensual","💪"]].map(([t,d,e])=>(
              <div key={t} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
                <span style={{fontSize:20}}>{e}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:T.charcoal}}>{t}</div>
                  <div style={{fontSize:13,color:T.textMid}}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
