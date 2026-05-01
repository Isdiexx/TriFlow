import { useState } from "react";

const LIGHT = {
  bg:"#F7F5F0", surface:"#FDFCFA", card:"#FFFFFF", border:"#EAE4D8",
  sage:"#7C9E87", charcoal:"#2C2C2C", textMid:"#6B6458", textSub:"#9C9284", muted:"#B8B0A0",
  clay:"#C4856A", shell:"#E8E4DC",
};
const DARK = {
  bg:"#161C18", surface:"#1C2420", card:"#212B25", border:"#2A3830",
  sage:"#7EC494", charcoal:"#EAE6DE", textMid:"#A8A090", textSub:"#6E6860", muted:"#4A4840",
  clay:"#D4956A", shell:"#0E1210",
};

export default function App() {
  const [dark, setDark] = useState(false);
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const T = dark ? DARK : LIGHT;

  const doLogin = () => {
    if (email && pass) setScreen("home");
  };

  if (screen === "home") {
    return (
      <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',system-ui",padding:"40px 20px",transition:"background .4s"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');*{margin:0;padding:0;box-sizing:border-box;}`}</style>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:600,color:T.charcoal}}>Tri<span style={{color:T.sage}}>Flow</span></div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDark(!dark)} style={{padding:"8px 16px",borderRadius:99,border:"1px solid "+T.border,background:T.card,cursor:"pointer",fontSize:14}}>{dark?"☀️":"🌙"}</button>
              <button onClick={()=>{setScreen("login");setEmail("");setPass("");}} style={{padding:"8px 16px",borderRadius:99,background:T.clay,border:"none",color:"#fff",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>Salir</button>
            </div>
          </div>
          <div style={{background:T.surface,borderRadius:20,padding:30,border:"1px solid "+T.border}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:600,color:T.charcoal,marginBottom:8}}>Bienvenido!</div>
            <div style={{fontSize:15,color:T.textMid,marginBottom:24}}>Email: <strong>{email}</strong></div>
            <div style={{background:T.sage+"18",borderRadius:16,padding:20,border:"1px solid "+T.sage+"33"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:T.charcoal,marginBottom:8}}>Proximamente</div>
              <div style={{fontSize:14,color:T.textMid,lineHeight:1.7}}>
                La Despensa - tu inventario y compras<br/>
                El Habito - menus personalizados con IA<br/>
                La Transformacion - planes de entrenamiento
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',system-ui",transition:"background .4s",padding:20}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');*{margin:0;padding:0;box-sizing:border-box;}`}</style>
      <div style={{width:"100%",maxWidth:400,background:T.surface,borderRadius:24,padding:"40px 28px",border:"1px solid "+T.border}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:600,color:T.charcoal}}>Tri<span style={{color:T.sage}}>Flow</span></div>
          <button onClick={()=>setDark(!dark)} style={{width:40,height:40,borderRadius:99,border:"1px solid "+T.border,background:T.card,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>{dark?"☀️":"🌙"}</button>
        </div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:T.charcoal,marginBottom:8}}>Inicia sesion</div>
        <div style={{fontSize:14,color:T.textSub,marginBottom:24}}>Organiza tu cambio con TriFlow</div>
        <input type="email" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid "+T.border,background:T.card,fontSize:14,marginBottom:12,color:T.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
        <input type="password" placeholder="Contrasena" value={pass} onChange={e=>setPass(e.target.value)} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid "+T.border,background:T.card,fontSize:14,marginBottom:20,color:T.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
        <button onClick={doLogin} style={{width:"100%",padding:14,borderRadius:99,background:email&&pass?T.sage:T.muted,border:"none",color:"#fff",fontSize:15,fontWeight:600,cursor:email&&pass?"pointer":"default",fontFamily:"'DM Sans',sans-serif"}}>Iniciar sesion</button>
        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:T.muted}}>triflow.cl</div>
      </div>
    </div>
  );
}