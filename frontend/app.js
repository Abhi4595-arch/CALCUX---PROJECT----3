const API="http://localhost:8080";
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const get=async u=>(await fetch(API+u)).json();
const post=async(u,b)=>(await fetch(API+u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)})).json();

const pages={
dashboard:["WORKSPACE / OVERVIEW","Dashboard"],
calculator:["WORKSPACE / CALCULATION","Basic Calculator"],
advanced:["WORKSPACE / ADVANCED","Advanced Operations"],
expression:["WORKSPACE / EXPRESSIONS","Expression Calculator"],
history:["WORKSPACE / RECORDS","Calculation History"],
statistics:["WORKSPACE / ANALYTICS","Statistics"]
};

function showPage(name){
  $$(".page").forEach(p=>p.classList.remove("active","active-page"));
  $(`[id="${name}"]`)?.classList.add("active","active-page");
  $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===name));
  if(pages[name]){
    $("#page-kicker").textContent=pages[name][0];
    $("#page-title").textContent=pages[name][1];
  }
  if(name==="dashboard")loadDashboard();
  if(name==="history")loadHistory();
  if(name==="statistics")loadStats();
}

$$(".nav-item").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
$$("[data-go]").forEach(b=>b.onclick=()=>showPage(b.dataset.go));
$$("[data-page-target]").forEach(b=>b.onclick=()=>showPage(b.dataset.pageTarget));

function result(el,value,msg,expression){
  $(el).querySelector("strong").textContent=value;
  const m=$(el).querySelector("span:last-child");
  if(m)m.textContent=msg||"";
  const e=expression&&$(expression);
  if(e)e.textContent=expression;
}

async function health(){
  try{
    const r=await get("/health");
    const ok=r.success;
    $("#sidebar-api-status").textContent=ok?"API Connected":"API Offline";
    $("#dash-engine-status").textContent=ok?"ONLINE":"OFFLINE";
    $("#topbar-status").innerHTML=
      `<span class="status-dot"></span><span>API ${ok?"ONLINE":"OFFLINE"}</span>`;
  }catch{
    $("#sidebar-api-status").textContent="API Offline";
    $("#dash-engine-status").textContent="OFFLINE";
    $("#topbar-status").innerHTML="<span></span><span>API OFFLINE</span>";
  }
}

async function loadDashboard(){
  try{
    const r=await get("/history");
    $("#dash-total").textContent=r.count??0;
    const list=$("#dashboard-history");
    if(!r.history?.length){
      list.innerHTML='<div class="empty-state">No calculations yet.</div>';
      return;
    }
    list.innerHTML=r.history.slice(-3).reverse().map(x=>
      `<div class="recent-item"><b>${esc(x)}</b><span>C++ BACKEND</span></div>`
    ).join("");
  }catch{}
}

let basicOp={operation:"add",symbol:"+",name:"Addition",help:"Adds two numbers."};

function setBasic(op,btn){
  basicOp={
    operation:op,
    symbol:btn.dataset.symbol||"?",
    name:btn.dataset.name||op,
    help:btn.dataset.help||""
  };
  $$(".basic-operation").forEach(x=>x.classList.toggle("active",x===btn));
  $("#selected-symbol").textContent=basicOp.symbol;
  $("#selected-operation-name").textContent=basicOp.name;
  $("#selected-operation-help").textContent=basicOp.help;
  $("#backend-operation-symbol").textContent=basicOp.symbol;
  $("#backend-operation-name").textContent=basicOp.name;
}

$$(".basic-operation").forEach(b=>b.onclick=()=>setBasic(b.dataset.operation,b));

$("#calculate-basic-btn")?.addEventListener("click",async()=>{
  const a=Number($("#first-number").value),b=Number($("#second-number").value);
  if(Number.isNaN(a)||Number.isNaN(b)){
    result("#basic-calculator-result","—","Enter valid numbers.");
    return;
  }
  try{
    const r=await post("/calculate",{operation:basicOp.operation,a,b});
    result("#basic-calculator-result",r.success?r.value:"Error",r.message||"");
    $("#basic-calculator-expression").textContent=
      r.success?`${a} ${basicOp.symbol} ${b} = ${r.value}`:"";
  }catch{
    result("#basic-calculator-result","Error","Backend connection failed.");
  }
});

let advOp={operation:"power",symbol:"^",name:"Power",help:"Raises a base to an exponent.",unary:false};

function setAdvanced(btn){
  advOp={
    operation:btn.dataset.operation,
    symbol:btn.dataset.symbol||"",
    name:btn.dataset.name||"",
    help:btn.dataset.help||"",
    unary:btn.dataset.unary==="true"
  };
  $$(".advanced-option").forEach(x=>x.classList.toggle("active",x===btn));
  $("#advanced-title").textContent=advOp.name;
  $("#advanced-symbol").textContent=advOp.symbol;
  $("#advanced-help").textContent=advOp.help;
  $("#advanced-backend-symbol").textContent=advOp.symbol;
  $("#advanced-backend-name").textContent=advOp.name;

  const f=$("#advanced-fields");
  if(!f)return;
  f.innerHTML=advOp.unary
    ?'<div class="advanced-field"><label>VALUE</label><input class="input-field" id="advanced-value" type="number" placeholder="Enter value"></div>'
    :'<div class="advanced-field"><label>FIRST VALUE</label><input class="input-field" id="advanced-a" type="number" placeholder="Enter value"></div><div class="advanced-field"><label>SECOND VALUE</label><input class="input-field" id="advanced-b" type="number" placeholder="Enter value"></div>';
}

$$(".advanced-option").forEach(b=>b.onclick=()=>setAdvanced(b));

$("#advanced-calculate-btn")?.addEventListener("click",async()=>{
  let body={operation:advOp.operation};
  if(advOp.unary){
    const v=Number($("#advanced-value")?.value);
    if(Number.isNaN(v)){
      $("#advanced-result").textContent="Error";
      $("#advanced-message").textContent="Enter a valid value.";
      return;
    }
    body.value=v;
  }else{
    const a=Number($("#advanced-a")?.value),b=Number($("#advanced-b")?.value);
    if(Number.isNaN(a)||Number.isNaN(b)){
      $("#advanced-result").textContent="Error";
      $("#advanced-message").textContent="Enter valid numbers.";
      return;
    }
    body.a=a;body.b=b;
  }
  try{
    const r=await post("/calculate",body);
    $("#advanced-result").textContent=r.success?r.value:"Error";
    $("#advanced-message").textContent=r.message||"";
  }catch{
    $("#advanced-result").textContent="Error";
    $("#advanced-message").textContent="Backend connection failed.";
  }
});

const exprInput=$("#expression-input");

$$(".keypad-key").forEach(k=>k.onclick=()=>{
  const v=k.dataset.value??k.textContent;
  if(!exprInput)return;
  exprInput.value+=v==="×"?"*":v==="÷"?"/":v==="−"?"-":v;
  exprInput.dispatchEvent(new Event("input"));
  exprInput.focus();
});

$("#expression-clear")?.addEventListener("click",()=>{
  exprInput.value="";
  $("#expression-result").textContent="—";
});

$("#expression-evaluate")?.addEventListener("click",evalExpr);
exprInput?.addEventListener("keydown",e=>{if(e.key==="Enter")evalExpr()});
exprInput?.addEventListener("input",()=>{
  $("#expression-char-count").textContent=`${exprInput.value.length} characters`;
});

async function evalExpr(){
  const expression=exprInput.value.trim();
  if(!expression){
    $("#expression-result").textContent="—";
    return;
  }
  try{
    const r=await post("/expression",{expression});
    $("#expression-result").textContent=r.success?r.value:"Error";
  }catch{
    $("#expression-result").textContent="Error";
  }
}

async function loadHistory(query=""){
  try{
    const r=await get(query?`/history/search?query=${encodeURIComponent(query)}`:"/history");
    $("#history-count").textContent=`${r.count??r.history?.length??0} calculations`;
    const list=$("#history-list");
    if(!r.history?.length){
      list.innerHTML='<div class="history-empty"><h4>No history found</h4><p>Successful calculations will appear here.</p></div>';
      return;
    }
    list.innerHTML=r.history.slice().reverse().map(x=>
      `<div class="history-item"><div class="history-item-main"><div class="history-item-icon">=</div><div><strong>${esc(x)}</strong><small>C++ BACKEND</small></div></div></div>`
    ).join("");
  }catch{
    $("#history-list").innerHTML='<div class="history-empty"><h4>Backend unavailable</h4><p>Start the CALCUX C++ server and try again.</p></div>';
  }
}

$("#history-search-button")?.addEventListener("click",()=>loadHistory($("#history-search").value.trim()));
$("#history-search")?.addEventListener("keydown",e=>{
  if(e.key==="Enter")loadHistory(e.target.value.trim());
});
$("#history-refresh")?.addEventListener("click",()=>loadHistory());
$("#clear-history")?.addEventListener("click",async()=>{
  if(!confirm("Clear calculation history?"))return;
  try{
    await fetch(API+"/history",{method:"DELETE"});
    loadHistory();
    loadDashboard();
    loadStats();
  }catch{}
});

async function loadStats(){
  try{
    const r=await get("/history/statistics");
    const ids={
      total:"stat-total",
      other:"stat-other",
      addition:"stat-addition",
      subtraction:"stat-subtraction",
      multiplication:"stat-multiplication",
      division:"stat-division",
      modulus:"stat-modulus",
      power:"stat-power"
    };
    Object.entries(ids).forEach(([k,id])=>{
      if($( "#"+id))$( "#"+id).textContent=r[k]??0;
    });
    $("#stat-total-breakdown").textContent=`${r.total??0} total records`;
    $("#stat-other-breakdown").textContent=`${r.other??0} other operations`;
  }catch{}
}

function esc(v){
  return String(v).replace(/[&<>"']/g,m=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

function init(){
  const first=$(".basic-operation");
  if(first)setBasic(first.dataset.operation,first);
  const adv=$(".advanced-option");
  if(adv)setAdvanced(adv);
  health();
  loadDashboard();
}

init();