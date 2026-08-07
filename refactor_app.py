import re

def main():
    file_path = "src/app/App.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Remove mobile section
    # The mobile section starts with `// ─── TYPES ───` (or similar)
    # and ends right before `type AdminSection =`
    
    match_start = re.search(r"// ─── TYPES ───.*?$", content, re.MULTILINE)
    match_end = re.search(r"type AdminSection = ", content, re.MULTILINE)
    
    if not match_start or not match_end:
        print("Could not find boundaries for mobile code!")
        # Let's try alternative boundaries
        match_start = re.search(r"type Screen\s*=", content)
        match_end = re.search(r"type AdminSection\s*=", content)
        if not match_start or not match_end:
             print("Still couldn't find them.")
             return
             
    start_idx = match_start.start()
    
    # We want to keep `type AdminSection` but delete before it, maybe from the `// ════` comment
    match_admin_header = re.search(r"// ════════════════════════════════════════════════════════════════════════════════\s*// ADMIN DASHBOARD", content)
    if match_admin_header:
        end_idx = match_admin_header.start()
    else:
        end_idx = match_end.start()
        
    new_content = content[:start_idx] + "\n" + content[end_idx:]
    
    # 2. Update AdminTopBar to include Dropdown
    old_topbar = r"""<div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{fontFamily:M,fontSize:10.5,color:C.td,letterSpacing:"0.05em"}}>{tStr} · Jul 23, 2026</div>
      <div style={{display:"flex",alignItems:"center",gap:7,background:AD.inp,border:`1px solid ${AD.inpB}`,borderRadius:9,padding:"7px 12px",width:186}}>
        <Search size={12} color={C.td}/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Quick search…" style={{background:"none",border:"none",outline:"none",fontFamily:P,fontSize:12,color:C.t1,caretColor:C.brand,width:"100%"}}/>
      </div>
      <div style={{position:"relative"}}>
        <div style={{width:34,height:34,borderRadius:9,background:AD.inp,border:`1px solid ${AD.inpB}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Bell size={14} color={C.t2}/></div>
        <div style={{position:"absolute",top:-2,right:-2,width:15,height:15,borderRadius:"50%",background:`linear-gradient(135deg,${C.brand},${C.brandH})`,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${AD.bg}`}}><span style={{fontFamily:M,fontSize:7,fontWeight:700,color:"#fff"}}>3</span></div>
      </div>
      <button onClick={onExit} className="a-btn" style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",background:"rgba(255,90,107,0.07)",border:`1px solid rgba(255,90,107,0.22)`,borderRadius:9,fontFamily:P,fontSize:11,fontWeight:600,color:C.sell,cursor:"pointer",transition:"all 0.15s"}}>
        <ArrowLeft size={12}/>Exit Admin
      </button>
    </div>"""

    new_topbar = r"""<div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{fontFamily:M,fontSize:10.5,color:C.td,letterSpacing:"0.05em"}}>{tStr} · Jul 23, 2026</div>
      <div style={{display:"flex",alignItems:"center",gap:7,background:AD.inp,border:`1px solid ${AD.inpB}`,borderRadius:9,padding:"7px 12px",width:186}}>
        <Search size={12} color={C.td}/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Quick search…" style={{background:"none",border:"none",outline:"none",fontFamily:P,fontSize:12,color:C.t1,caretColor:C.brand,width:"100%"}}/>
      </div>
      <div style={{position:"relative",marginRight:6}}>
        <div style={{width:34,height:34,borderRadius:9,background:AD.inp,border:`1px solid ${AD.inpB}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Bell size={14} color={C.t2}/></div>
        <div style={{position:"absolute",top:-2,right:-2,width:15,height:15,borderRadius:"50%",background:`linear-gradient(135deg,${C.brand},${C.brandH})`,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${AD.bg}`}}><span style={{fontFamily:M,fontSize:7,fontWeight:700,color:"#fff"}}>3</span></div>
      </div>
      
      {/* Admin Profile Dropdown */}
      <div style={{position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",background:AD.inp,border:`1px solid ${AD.inpB}`,borderRadius:9,padding:"4px 10px 4px 4px",transition:"all 0.15s"}} onClick={(e) => { const el = e.currentTarget.nextElementSibling; el.style.display = el.style.display === "none" ? "block" : "none"; }}>
          <div style={{width:26,height:26,borderRadius:6,background:`linear-gradient(135deg,${C.gold}40,${C.goldL}20)`,border:`1px solid ${C.gold}30`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:P,fontSize:10,fontWeight:700,color:C.gold}}>AA</span>
          </div>
          <div style={{display:"flex",flexDirection:"column"}}>
            <span style={{fontFamily:P,fontSize:11,fontWeight:600,color:C.t1,lineHeight:1.1}}>Ahmed Alhajji</span>
            <span style={{fontFamily:P,fontSize:9,color:C.td,lineHeight:1.1}}>Administrator</span>
          </div>
          <ChevronDown size={14} color={C.td} style={{marginLeft:4}}/>
        </div>
        
        {/* Dropdown Menu - Native CSS based toggle */}
        <div style={{display:"none",position:"absolute",top:"100%",right:0,marginTop:8,background:AD.card,backdropFilter:"blur(20px)",border:`1px solid ${AD.cardB}`,borderRadius:12,width:200,padding:"6px",boxShadow:"0 10px 40px rgba(0,0,0,0.5)",zIndex:2000}}>
          <button className="a-btn" style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"transparent",border:"none",borderRadius:8,color:C.t1,fontFamily:P,fontSize:13,cursor:"pointer",textAlign:"left"}}>
            <User size={14} color={C.t2}/> Profile
          </button>
          <button className="a-btn" style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"transparent",border:"none",borderRadius:8,color:C.t1,fontFamily:P,fontSize:13,cursor:"pointer",textAlign:"left"}}>
            <Settings size={14} color={C.t2}/> Account Settings
          </button>
          <div style={{height:1,background:AD.cardB,margin:"4px 0"}}/>
          <button className="a-btn" style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"transparent",border:"none",borderRadius:8,color:C.sell,fontFamily:P,fontSize:13,cursor:"pointer",textAlign:"left"}}>
            <LogOut size={14}/> Logout
          </button>
        </div>
      </div>
    </div>"""

    new_content = new_content.replace(old_topbar, new_topbar)
    
    # 3. Change AdminTopBar parameters
    new_content = new_content.replace("function AdminTopBar({ section,onExit }:{ section:AdminSection;onExit:()=>void })", "function AdminTopBar({ section }:{ section:AdminSection })")
    new_content = new_content.replace("<AdminTopBar section={section} onExit={onExit}/>", "<AdminTopBar section={section}/>")
    new_content = new_content.replace("function AdminDashboard({ onExit }:{ onExit:()=>void })", "export default function AdminDashboard()")
    
    # 4. Remove root App component and make AdminDashboard default export
    root_app = r"""// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode,setMode]=useState<"mobile"|"admin">("mobile");
  const [screen,setScreen]=useState<Screen>("splash");
  if(mode==="admin") return <AdminDashboard onExit={()=>setMode("mobile")}/>;
  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:`radial-gradient(ellipse 80% 50% at 50% 0%,${C.brand}14,#050408 55%)`,fontFamily:P,position:"relative" }}>
      <div style={{ width:390,height:844,borderRadius:52,overflow:"hidden",position:"relative",background:C.bg,boxShadow:`0 0 0 1px rgba(255,255,255,0.07),0 40px 120px ${C.brand}22,0 80px 200px rgba(0,0,0,0.7)`,display:"flex",flexDirection:"column",flexShrink:0 }}>
        <div style={{ position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",width:120,height:34,background:"#000",borderRadius:20,zIndex:50,border:`1px solid rgba(255,255,255,0.06)` }}/>
        {screen==="splash"    && <SplashScreen    onDone={()=>setScreen("login")}/>}
        {screen==="login"     && <LoginScreen     onLogin={()=>setScreen("subscribe")} onRegister={()=>setScreen("register")} onForgot={()=>setScreen("forgot")}/>}
        {screen==="register"  && <RegisterScreen  onBack={()=>setScreen("login")} onDone={()=>setScreen("subscribe")}/>}
        {screen==="forgot"    && <ForgotScreen    onBack={()=>setScreen("login")}/>}
        {screen==="subscribe" && <SubscribeFlow   onComplete={()=>setScreen("app")}/>}
        {screen==="app"       && <MainApp         onSignOut={()=>setScreen("login")}/>}
      </div>
      <button onClick={()=>setMode("admin")} style={{ position:"fixed",bottom:24,right:24,display:"flex",alignItems:"center",gap:7,padding:"10px 18px",background:"rgba(9,7,26,0.95)",backdropFilter:"blur(16px)",border:`1px solid rgba(128,0,255,0.3)`,borderRadius:14,fontFamily:P,fontSize:12,fontWeight:600,color:C.brand,cursor:"pointer",boxShadow:`0 8px 32px rgba(0,0,0,0.5),0 0 0 1px rgba(128,0,255,0.1)`,zIndex:200 }}>
        <BarChart2 size={14}/> Admin Dashboard
      </button>
      <div style={{ position:"fixed",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${C.brand}14,transparent 70%)`,filter:"blur(80px)",pointerEvents:"none",zIndex:-1 }}/>
    </div>
  );
}"""
    
    new_content = new_content.replace(root_app, "")
    
    # 5. Fix unused imports in main.tsx - wait, this file is App.tsx. 
    # Are there any lucide imports we need to clean up?
    # Actually, we can leave imports alone, but we should make sure we didn't remove anything needed.
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print("Successfully refactored App.tsx")

if __name__ == "__main__":
    main()
