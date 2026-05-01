import { useState } from "react";

const LIGHT = {
  bg:"#F7F5F0", surface:"#FDFCFA", card:"#FFFFFF", border:"#EAE4D8", border2:"#D8D0C0",
  sage:"#7C9E87", sageL:"#A8C4AF", sageD:"#5A7D65",
  sand:"#C4A882", clay:"#C4856A", sky:"#7EA8C4",
  violet:"#9B8EC4", violetL:"#C4B8E8", violetD:"#7060A8",
  charcoal:"#2C2C2C", text:"#2C2C2C", textMid:"#6B6458", textSub:"#9C9284", muted:"#B8B0A0",
  shell:"#E8E4DC", shellRing:"#D8D2C8", notch:"#FDFCFA", notchPill:"#2C2C2C", notchText:"#9C9284", scrollbar:"#C8C0B0",
};

const DARK = {
  bg:"#161C18", surface:"#1C2420", card:"#212B25", border:"#2A3830", border2:"#354540",
  sage:"#7EC494", sageL:"#5A9970", sageD:"#A8D4B4",
  sand:"#D4B48C", clay:"#D4956A", sky:"#8AB8D4",
  violet:"#B4A8D8", violetL:"#7868A8", violetD:"#CEC4EC",
  charcoal:"#EAE6DE", text:"#EAE6DE", textMid:"#A8A090", textSub:"#6E6860", muted:"#4A4840",
  shell:"#0E1210", shellRing:"#2A3830", notch:"#1C2420", notchPill:"#EAE6DE", notchText:"#6E6860", scrollbar:"#2A3830",
};

export default function App() {
  const [dark, setDark] = useState(false);
  const T = dark ? DARK : LIGHT;

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans', system-ui",color:T.text,transition:"background .4s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:${T.shell}; }
      `}</style>
      <div style={{width:"100%",maxWidth:390,background:T.bg,borderRadius:44,overflow:"hidden",boxShadow:`0 40px 100px rgba(0,0,0,${dark?.35:.18})`,textAlign:"center",padding:"60px 40px",transition:"all .4s"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:600,marginBottom:40}}>
          Tri<span style={{color:T.sage}}>Flow</span>
        </div>
        <div style={{fontSize:48,marginBottom:24}}>🚀</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:T.charcoal,marginBottom:16}}>Organiza tu cambio</div>
        <div style={{fontSize:15,color:T.textMid,lineHeight:1.7,marginBottom:32}}>
          La app está siendo desplegada. Dentro de poco tendrás los tres pilares: La Despensa, El Hábito y La Transformación.
        </div>
        <button onClick={()=>setDark(d=>!d)} style={{padding:"12px 28px",borderRadius:99,background:dark?T.sage:T.charcoal,border:"none",color:dark?"#0A0C10":"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
          {dark?"☀️ Modo claro":"🌙 Modo oscuro"}
        </button>
        <div style={{marginTop:40,fontSize:12,color:T.muted}}>triflow.cl — Disponible pronto</div>
      </div>
    </div>
  );
}