/* ===================== EDIT ME ===================== */
const OWNERS=[
 {id:"1544876770791129105",role:"Owner",fallback:{bio:"Founder of Ruby Hub."}},
 {id:"1287472260394782870",role:"Co-Owner",fallback:{bio:"Co-owner of Ruby Hub."}}
];
/* Discord does not expose "About Me" bios to any public API, so the bio comes from
   fallback.bio above (or from Lanyard KV key "bio" if you use Lanyard). */
const SCRIPTS=[
 {name:"Example Script 1",game:"Universal",desc:"Replace this with what your script does.",code:'loadstring(game:HttpGet("https://YOUR-HOST/script1.lua"))()'},
 {name:"Example Script 2",game:"Your Game",desc:"Another placeholder. Swap in your real loadstring.",code:'loadstring(game:HttpGet("https://YOUR-HOST/script2.lua"))()'}
];
/* =================================================== */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let tt;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),1800)}
/* ---- scripts ---- */
let filter="All";
const games=["All",...new Set(SCRIPTS.map(s=>s.game))];
function renderScripts(){
 const t=$("#q").value.trim().toLowerCase();
 $("#chips").innerHTML=games.map(g=>`<button class="chip${g===filter?" on":""}" data-g="${esc(g)}">${esc(g)}</button>`).join("");
 const l=SCRIPTS.map((s,i)=>({s,i})).filter(({s})=>(filter==="All"||s.game===filter)&&(s.name+s.game+s.desc).toLowerCase().includes(t));
 $("#grid").innerHTML=l.length?l.map(({s,i})=>`<article class="card"><div class="top"><span class="tag">${esc(s.game)}</span></div><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p><div class="code">${esc(s.code)}</div><button class="btn sm" data-i="${i}">Copy script</button></article>`).join(""):'<div class="empty">No scripts found.</div>';
}
$("#chips").addEventListener("click",e=>{const b=e.target.closest("[data-g]");if(b){filter=b.dataset.g;renderScripts()}});
$("#q").addEventListener("input",renderScripts);
$("#grid").addEventListener("click",async e=>{const b=e.target.closest("[data-i]");if(!b)return;
 try{await navigator.clipboard.writeText(SCRIPTS[b.dataset.i].code);toast("Copied to clipboard")}catch(_){toast("Copy failed, select it manually")}});
$("#count").textContent=SCRIPTS.length;
/* ---- owners (Discord) ---- */
const fetchJ=async(u,ms=6000)=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(u,{signal:c.signal});if(!r.ok)throw 0;return await r.json()}finally{clearTimeout(t)}};
const defAv=id=>{try{return`https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id)>>22n)%6n)}.png`}catch(_){return""}};
const hex=c=>typeof c==="number"?"#"+c.toString(16).padStart(6,"0"):(typeof c==="string"&&c?(c[0]==="#"?c:"#"+c):"");
async function getOwner(o){
 const d={name:"Discord user",username:"",avatar:"",banner:"",color:"",bio:"",status:"offline",activity:"",...o.fallback};
 const[a,b]=await Promise.allSettled([fetchJ(`https://discordlookup.mesalytic.moe/v1/user/${o.id}`),fetchJ(`https://api.lanyard.rest/v1/users/${o.id}`)]);
 if(a.status==="fulfilled"&&a.value){const u=a.value;d.name=u.global_name||u.username||d.name;d.username=u.username||d.username;d.avatar=u.avatar?.link||d.avatar;d.banner=u.banner?.link||d.banner;d.color=hex(u.banner?.color||u.accent_color)||d.color}
 if(b.status==="fulfilled"&&b.value?.success){const x=b.value.data,du=x.discord_user||{};
  if(d.name==="Discord user")d.name=du.global_name||du.username||d.name;d.username=d.username||du.username||"";
  if(!d.avatar&&du.avatar)d.avatar=`https://cdn.discordapp.com/avatars/${o.id}/${du.avatar}.${du.avatar.startsWith("a_")?"gif":"png"}?size=256`;
  d.status=x.discord_status||d.status;const cs=(x.activities||[]).find(z=>z.type===4);if(cs?.state)d.activity=cs.state;if(x.kv?.bio)d.bio=x.kv.bio}
 return d}
function card(o,d){
 const bg=d.banner?`background-image:url('${esc(d.banner)}')`:(d.color?`background:${esc(d.color)}`:"");
 return `<article class="pcard" data-r><div class="banner" style="${bg}"></div><div class="pbody"><div class="avwrap"><img src="${esc(d.avatar||defAv(o.id))}" alt="" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${defAv(o.id)}'"><span class="dot ${esc(d.status)}" title="${esc(d.status)}"></span></div><div class="pname"><h3>${esc(d.name)}</h3><span class="role">${esc(o.role)}</span></div>${d.username?`<div class="uname">@${esc(d.username)}</div>`:""}${d.activity?`<div class="act">${esc(d.activity)}</div>`:""}<p class="bio">${esc(d.bio)}</p><a class="btn sm" href="https://discord.com/users/${o.id}" target="_blank" rel="noopener noreferrer">View on Discord</a></div></article>`}
async function loadTeam(){
 const box=$("#team");box.innerHTML=OWNERS.map((o,i)=>`<div id="o${i}"></div>`).join("");
 OWNERS.forEach(async(o,i)=>{const el=$("#o"+i);
  el.outerHTML=card(o,{name:"Loading…",status:"offline",...o.fallback}).replace('class="pcard"','class="pcard" id="o'+i+'"');
  const d=await getOwner(o);const n=$("#o"+i);n.outerHTML=card(o,d).replace('class="pcard"','class="pcard in" id="o'+i+'"')})}
/* ---- fx ---- */
document.addEventListener("pointermove",e=>{const c=e.target.closest(".card,.pcard");if(c){const r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")}});
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.12});
function observe(){document.querySelectorAll("[data-r]:not(.in)").forEach(n=>io.observe(n))}
renderScripts();loadTeam();observe();setTimeout(observe,50);
