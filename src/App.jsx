import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uiktwbtwzotqduzwtjcb.supabase.co",
  "sb_publishable_ONXQyJvXKUIUqppaWnZG4w_epX1u7ml"
);

const LIGHT = { bg:"#F7F5F0", surface:"#FDFCFA", card:"#FFFFFF", border:"#EAE4D8", sage:"#7C9E87", charcoal:"#2C2C2C", textMid:"#6B6458", textSub:"#9C9284", muted:"#B8B0A0", clay:"#C4856A" };
const DARK  = { bg:"#161C18", surface:"#1C2420", card:"#212B25", border:"#2A3830", sage:"#7EC494", charcoal:"#EAE6DE", textMid:"#A8A090", textSub:"#6E6860", muted:"#4A4840", clay:"#D4956A" };

export default function App() {
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modo, setModo] = useState("login");
  const T = dark ? DARK : LIGHT;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
    supabase.auth.onAuthStateChange((_, session) => setUser(session?.user || null));
  }, []);

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

  const logout = async () => { await supabase.auth.signOut(); setUser(null); };

  if (user) return (
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
        <div style={{background:T.surface,borderRadius:20,padding:30,border:"1px solid "+T.border}}>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:600,color:T.charcoal,marginBottom:8}}>Bienvenido!</div>
          <div style={{fontSize:15,color:T.textMid,marginBottom:24}}>Email: <strong>{user.email}</strong></div>
          <div style={{background:T.sage+"18",borderRadius:16,padding:20,border:"1px solid "+T.sage+"33"}}>
            <div style={{fontFamily:"Playfair Display,serif",fontSize:18,color:T.charcoal,marginBottom:12}}>Proximos pasos</div>
            <div style={{fontSize:14,color:T.textMid,lineHeight:1.8}}>
              La Despensa — inventario y compras automaticas<br/>
              El Habito — menus personalizados con IA<br/>
              La Transformacion — planes de entrenamiento mensual
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Sans,system-ui",padding:20,transition:"background .4s"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@400;500;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}`}</style>
      <div style={{width:"100%",maxWidth:400,background:T.surface,borderRadius:24,padding:"40px 28px",border:"1px solid "+T.border}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:26,fontWeight:600,color:T.charcoal}}>Tri<span style={{color:T.sage}}>Flow</span></div>
          <button onClick={()=>setDark(!dark)} style={{width:40,height:40,borderRadius:99,border:"1px solid "+T.border,background:T.card,cursor:"pointer",fontSize:18}}>{dark?"☀️":"🌙"}</button>
        </div>
        <div style={{display:"flex",marginBottom:24,background:T.bg,borderRadius:12,padding:4}}>
          <button onClick={()=>{setModo("login");setError("")}} style={{flex:1,padding:"10px",borderRadius:9,border:"none",background:modo==="login"?T.card:"transparent",color:modo==="login"?T.charcoal:T.muted,fontWeight:modo==="login"?600:400,cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:14}}>Iniciar sesion</button>
          <button onClick={()=>{setModo("registro");setError("")}} style={{flex:1,padding:"10px",borderRadius:9,border:"none",background:modo==="registro"?T.card:"transparent",color:modo==="registro"?T.charcoal:T.muted,fontWeight:modo==="registro"?600:400,cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:14}}>Crear cuenta</button>
        </div>
        {error && <div style={{background:T.clay+"22",border:"1px solid "+T.clay,borderRadius:12,padding:"10px 12px",marginBottom:16,fontSize:13,color:T.clay}}>{error}</div>}
        <input type="email" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid "+T.border,background:T.card,fontSize:14,marginBottom:12,color:T.charcoal,outline:"none",fontFamily:"DM Sans,sans-serif"}}/>
        <input type="password" placeholder="Contrasena (minimo 6 caracteres)" value={pass} onChange={e=>setPass(e.target.value)} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid "+T.border,background:T.card,fontSize:14,marginBottom:20,color:T.charcoal,outline:"none",fontFamily:"DM Sans,sans-serif"}}/>
        <button onClick={handleAuth} disabled={loading||!email||!pass} style={{width:"100%",padding:14,borderRadius:99,background:email&&pass&&!loading?T.sage:T.muted,border:"none",color:"#fff",fontSize:15,fontWeight:600,cursor:email&&pass&&!loading?"pointer":"default",fontFamily:"DM Sans,sans-serif",transition:"background .2s"}}>
          {loading?"Cargando...":modo==="login"?"Iniciar sesion":"Crear cuenta"}
        </button>
      </div>
    </div>
  );
}
