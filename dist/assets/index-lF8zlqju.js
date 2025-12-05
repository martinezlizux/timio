(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const s of e.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function l(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function a(t){if(t.ep)return;t.ep=!0;const e=l(t);fetch(t.href,e)}})();const T={bg:"#B8B8FF",text:"#1F1A3D",primary:"#1F1A3D",secondary:"#D4E72C",accent:"#E0E0FF",muted:"#FEFEF0"},L=[{id:"1",client:"Acme Corp",date:"2023-10-05",hours:5,rate:50,description:"Diseño de landing page",timestamp:16964832e5},{id:"2",client:"Globex",date:"2023-10-12",hours:3.5,rate:60,description:"Consultoría React",timestamp:1697088e6},{id:"3",client:"Acme Corp",date:"2023-11-01",hours:8,rate:50,description:"Desarrollo Backend",timestamp:1698816e6}];let g=[...L],r={timeRange:"",clients:[]},v=null,h={...T};const I=n=>{const i=document.documentElement;i.style.setProperty("--timio-bg",n.bg),i.style.setProperty("--timio-text",n.text),i.style.setProperty("--timio-primary",n.primary),i.style.setProperty("--timio-secondary",n.secondary),i.style.setProperty("--timio-accent",n.accent),i.style.setProperty("--timio-muted",n.muted)},$=()=>Math.random().toString(36).slice(2,9),x=()=>{const n=Date.now(),i={"1w":7,"2w":14,"3w":21,"1m":30,"2m":60,"3m":90,"":0},l=g.filter(e=>{const s=r.clients.length?r.clients.includes(e.client):!0,c=i[r.timeRange??""]??0,u=c?n-c*24*60*60*1e3:0,o=u?e.timestamp>=u:!0;return s&&o}).sort((e,s)=>s.timestamp-e.timestamp),a=l.reduce((e,s)=>e+s.hours,0),t=l.reduce((e,s)=>e+s.hours*s.rate,0);return{filtered:l,stats:{totalHours:a,totalEarnings:t}}},f=n=>String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),C=()=>{document.querySelectorAll(".filter-dropdown .dropdown-menu.show").forEach(n=>n.classList.remove("show")),document.querySelectorAll(".filter-dropdown .dropdown-toggle").forEach(n=>n.setAttribute("aria-expanded","false"))};let k=!1;const A=()=>{k||(document.addEventListener("click",()=>C()),k=!0)},D=()=>{const n=document.getElementById("s-filtros-aplicados");if(!n)return;const i={"":"Todos","1w":"Última semana","2w":"Últimas 2 semanas","3w":"Últimas 3 semanas","1m":"Último mes","2m":"Últimos 2 meses","3m":"Últimos 3 meses"},l=[];r.timeRange&&l.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="time">
        <span class="small">Tiempo: ${i[r.timeRange]}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove="time" aria-label="Quitar filtro tiempo">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `),r.clients.forEach(a=>{l.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="client-${a}">
        <span class="small">Cliente: ${f(a)}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove-client="${f(a)}" aria-label="Quitar cliente ${f(a)}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `)}),l.length?(n.innerHTML=l.join(""),n.querySelectorAll('[data-remove="time"]').forEach(a=>{a.addEventListener("click",()=>{r.timeRange="",y()})}),n.querySelectorAll("[data-remove-client]").forEach(a=>{a.addEventListener("click",()=>{const t=a.dataset.removeClient;r.clients=r.clients.filter(e=>e!==t),y()})})):n.innerHTML='<span class="text-muted small">Sin filtros aplicados</span>'},S=()=>{var u;const n=document.getElementById("filter-time-menu"),i=document.getElementById("filter-time-label"),l=document.getElementById("filter-client-menu"),a=document.getElementById("filter-client-label");if(!n||!l||!i||!a)return;const t=[{value:"",label:"Todos"},{value:"1w",label:"Última semana"},{value:"2w",label:"Últimas 2 semanas"},{value:"3w",label:"Últimas 3 semanas"},{value:"1m",label:"Último mes"},{value:"2m",label:"Últimos 2 meses"},{value:"3m",label:"Últimos 3 meses"}];n.innerHTML=t.map(o=>`
    <div class="form-check mb-1">
      <input class="form-check-input" type="radio" name="time-range" id="time-${o.value||"all"}" value="${o.value}" ${r.timeRange===o.value?"checked":""}>
      <label class="form-check-label" for="time-${o.value||"all"}">${o.label}</label>
    </div>
  `).join(""),i.textContent=((u=t.find(o=>o.value===r.timeRange))==null?void 0:u.label)||"Todos";const e=Array.from(new Set(g.map(o=>o.client)));r.clients=r.clients.filter(o=>e.includes(o)),l.innerHTML=`
    <div class="form-check mb-2">
      <input class="form-check-input" type="checkbox" id="client-all" ${r.clients.length===0?"checked":""}>
      <label class="form-check-label" for="client-all">Todos</label>
    </div>
    ${e.map(o=>`
      <div class="form-check mb-1">
        <input class="form-check-input" type="checkbox" id="client-${o.toLowerCase().replace(/[^a-z0-9]+/g,"-")||"item"}" value="${f(o)}" ${r.clients.includes(o)?"checked":""}>
        <label class="form-check-label" for="client-${o.toLowerCase().replace(/[^a-z0-9]+/g,"-")||"item"}">${f(o)}</label>
      </div>
    `).join("")}
  `,r.clients.length===0?a.textContent="Todos":r.clients.length===1?a.textContent=r.clients[0]:a.textContent=`${r.clients.length} seleccionados`,n.querySelectorAll('input[name="time-range"]').forEach(o=>{o.onchange=p=>{const d=p.target.value;r.timeRange=d,y()}});const s=document.getElementById("client-all");s&&(s.onchange=o=>{o.target.checked&&(r.clients=[],y())}),l.querySelectorAll('input[type="checkbox"]').forEach(o=>{o.id!=="client-all"&&(o.onchange=p=>{const d=p.target.value;p.target.checked?r.clients=Array.from(new Set([...r.clients,d])):r.clients=r.clients.filter(m=>m!==d),s&&(s.checked=r.clients.length===0),y()})}),[{buttonId:"filter-time-toggle",menuId:"filter-time-menu"},{buttonId:"filter-client-toggle",menuId:"filter-client-menu"}].forEach(({buttonId:o,menuId:p})=>{const d=document.getElementById(o),m=document.getElementById(p);!d||!m||(d.onclick=b=>{b.stopPropagation(),C(),m.classList.toggle("show"),d.setAttribute("aria-expanded",m.classList.contains("show")?"true":"false")},m.onclick=b=>b.stopPropagation())}),A(),D()},H=()=>{const{filtered:n,stats:i}=x(),l=document.getElementById("entries-body"),a=document.getElementById("entries-foot");!l||!a||(n.length?l.innerHTML=n.map(t=>`
      <tr>
        <td><span class="badge-chip">${f(t.client)}</span></td>
        <td>${f(t.description)}</td>
        <td>${new Date(t.date).toLocaleDateString()}</td>
        <td class="text-end">${t.hours}</td>
        <td class="text-end">$${t.rate}</td>
        <td class="text-end">$${(t.hours*t.rate).toFixed(2)}</td>
        <td class="text-end">
          <div class="entry-actions">
            <button class="btn btn-link-primary btn-sm" data-edit="${t.id}">
              <i class="fa-solid fa-pen-to-square me-1"></i> Editar
            </button>
            <button class="btn btn-outline-danger btn-sm" data-delete="${t.id}">
              <i class="fa-solid fa-trash-can me-1"></i> Borrar
            </button>
          </div>
        </td>
      </tr>
    `).join(""):l.innerHTML=`
      <tr>
        <td colspan="7" class="text-center py-4">
          <div class="empty-placeholder mx-auto">
            <svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label="Sin registros">
              <rect x="24" y="36" width="152" height="112" rx="12" fill="#F7F5FC" stroke="#C7B8F4" stroke-width="3" />
              <rect x="40" y="56" width="72" height="12" rx="6" fill="#C7B8F4" opacity="0.8" />
              <rect x="40" y="78" width="104" height="12" rx="6" fill="#D4F26A" opacity="0.5" />
              <rect x="40" y="100" width="88" height="12" rx="6" fill="#F28C24" opacity="0.4" />
              <rect x="40" y="122" width="48" height="12" rx="6" fill="#4ECDC4" opacity="0.5" />
              <circle cx="158" cy="150" r="18" fill="#F1EEF6" stroke="#C7B8F4" stroke-width="3" />
              <path d="M152 150l8 8 12-16" stroke="#6F5ACF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            <div class="fw-semibold">No tienes ninguna hora registrada</div>
          </div>
        </td>
      </tr>
    `,a.innerHTML=`
    <tr class="summary-row">
      <td colspan="2">Registros: ${n.length}</td>
      <td></td>
      <td class="text-end">${i.totalHours}h</td>
      <td></td>
      <td class="text-end">$${i.totalEarnings.toFixed(2)}</td>
      <td></td>
    </tr>
  `,l.querySelectorAll("[data-edit]").forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-edit");if(!e)return;const s=g.find(c=>c.id===e);s&&B(s)})}),l.querySelectorAll("[data-delete]").forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-delete");e&&confirm("¿Eliminar este registro?")&&(g=g.filter(s=>s.id!==e),y())})}))},M=()=>{const{stats:n,filtered:i}=x(),l=document.getElementById("stat-hours"),a=document.getElementById("stat-earnings"),t=document.getElementById("stat-count");l&&(l.textContent=`${n.totalHours}h`),a&&(a.textContent=`$${n.totalEarnings.toFixed(2)}`),t&&(t.textContent=`${i.length}`)},j=()=>{const{filtered:n}=x(),i=document.getElementById("pie-chart"),l=document.getElementById("pie-legend");if(!i||!l)return;if(!n.length){i.innerHTML='<div class="text-muted small">Sin datos</div>',l.innerHTML="";return}const a=n.reduce((d,m)=>(d[m.client]=(d[m.client]||0)+m.hours*m.rate,d),{}),t=Object.entries(a).sort((d,m)=>m[1]-d[1]),e=t.reduce((d,[,m])=>d+m,0),s=[h.primary,h.secondary,"#FF9F1C","#FF5F5F","#4ECDC4","#1A535C"],c=90,u=2*Math.PI*c;let o=0;const p=t.map(([d,m],b)=>{const E=m/e*u,F=`<circle r="${c}" cx="120" cy="120" fill="transparent"
        stroke="${s[b%s.length]}"
        stroke-width="24"
        stroke-dasharray="${E} ${u-E}"
        stroke-dashoffset="${-o}"
        transform="rotate(-90 120 120)" />`;return o+=E,F}).join("");i.innerHTML=`
    <svg width="240" height="240" viewBox="0 0 240 240">
      <circle r="${c}" cx="120" cy="120" fill="transparent" stroke="#f1f3f5" stroke-width="24" />
      ${p}
      <text x="120" y="125" text-anchor="middle" font-size="14" fill="${h.primary}" font-weight="700">${t.length} clientes</text>
    </svg>
  `,l.innerHTML=t.map(([d,m],b)=>`
    <div class="d-flex align-items-center gap-2 mb-1">
      <span class="rounded-circle d-inline-block" style="width:12px;height:12px;background:${s[b%s.length]};"></span>
      <span>${f(d)}</span>
      <span class="ms-auto fw-bold">$${m.toFixed(2)}</span>
    </div>
  `).join("")},P=()=>{const n=document.getElementById("btn-new");n&&(n.onclick=()=>B());const i=document.getElementById("btn-export-csv");i&&(i.onclick=q);const l=document.getElementById("btn-copy");l&&(l.onclick=()=>{O().then(()=>N("Tabla copiada","success"))});const a=document.getElementById("btn-export-pdf");a&&(a.onclick=z);const t=document.getElementById("file-upload");t&&(t.onchange=U);const e=document.getElementById("btn-analyze");e&&(e.onclick=_);const s=document.getElementById("btn-theme-panel"),c=document.getElementById("theme-panel"),u=document.getElementById("theme-close");s&&c&&(s.onclick=()=>{c.style.display="block"}),u&&c&&(u.onclick=()=>{c.style.display="none"}),c&&c.querySelectorAll("input[data-theme-key]").forEach(o=>{o.addEventListener("input",p=>{const d=p.target.dataset.themeKey,m=p.target.value;h={...h,[d]:m},I(h),y()})})},B=n=>{const i=document.getElementById("entry-modal");if(!i)return;const l=document.getElementById("modal-title"),a=document.getElementById("form-client"),t=document.getElementById("form-date"),e=document.getElementById("form-hours"),s=document.getElementById("form-rate"),c=document.getElementById("form-description");n?(v=n.id,l&&(l.textContent="Editar entrada"),a.value=n.client,t.value=n.date,e.value=n.hours.toString(),s.value=n.rate.toString(),c.value=n.description):(v=null,l&&(l.textContent="Nueva entrada"),a.value="",t.value=new Date().toISOString().split("T")[0],e.value="0",s.value="0",c.value=""),i.style.display="block",i.classList.add("show");const u=document.getElementById("modal-overlay"),o=u||document.createElement("div");o.id="modal-overlay",o.className="modal-backdrop-timio",u||document.body.appendChild(o),requestAnimationFrame(()=>o.classList.add("visible")),document.body.classList.add("modal-open-timio")},w=()=>{const n=document.getElementById("entry-modal");if(!n)return;n.style.display="none",n.classList.remove("show");const i=document.getElementById("modal-overlay");i&&(i.classList.remove("visible"),setTimeout(()=>i.remove(),200)),document.body.classList.remove("modal-open-timio")},R=()=>{const n=document.getElementById("modal-close"),i=document.getElementById("modal-cancel"),l=document.getElementById("entry-form");n&&(n.onclick=w),i&&(i.onclick=w),l&&(l.onsubmit=a=>{a.preventDefault();const t=document.getElementById("form-client").value.trim(),e=document.getElementById("form-date").value,s=parseFloat(document.getElementById("form-hours").value)||0,c=parseFloat(document.getElementById("form-rate").value)||0,u=document.getElementById("form-description").value,o=new Date(e).getTime()||Date.now();!t||!e||(v?g=g.map(p=>p.id===v?{...p,client:t,date:e,hours:s,rate:c,description:u,timestamp:o}:p):g=[{id:$(),client:t,date:e,hours:s,rate:c,description:u,timestamp:o},...g],w(),y())})},q=()=>{const{filtered:n}=x(),l=[["Fecha","Cliente","Horas","Tarifa/Hora","Total","Descripción"].join(","),...n.map(e=>[e.date,`"${e.client}"`,e.hours,e.rate,e.hours*e.rate,`"${e.description}"`].join(","))].join(`
`),a=new Blob([l],{type:"text/csv;charset=utf-8;"}),t=document.createElement("a");t.href=URL.createObjectURL(a),t.download=`timio_export_${new Date().toISOString().split("T")[0]}.csv`,t.click()},O=async()=>{var c,u;const{filtered:n,stats:i}=x(),l=["Cliente","Descripción","Fecha","Horas","Tarifa/Hora","Total"],a=n.map(o=>[f(o.client),f(o.description),f(o.date),String(o.hours),String(o.rate),(o.hours*o.rate).toFixed(2)]),t=["Totales","","",i.totalHours.toFixed(2),"",i.totalEarnings.toFixed(2)],e=[l,...a,t].map(o=>o.join("	")).join(`
`),s=`
    <table style="border-collapse:collapse;min-width:600px;">
      <thead>
        <tr>
          ${l.map(o=>`<th style="border:1px solid #ddd;padding:6px 8px;background:#f7f5fc;font-weight:700;text-align:left;">${o}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${a.map(o=>`
          <tr>
            ${o.map((p,d)=>`<td style="border:1px solid #eee;padding:6px 8px;text-align:${d>=3?"right":"left"};">${p}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
      <tfoot>
        <tr>
          ${t.map((o,p)=>`<td style="border:1px solid #ddd;padding:6px 8px;text-align:${p>=3?"right":"left"};font-weight:${p===0?"700":"600"};background:#fafafa;">${o}</td>`).join("")}
        </tr>
      </tfoot>
    </table>
  `;try{if((c=navigator.clipboard)!=null&&c.write){const o=new ClipboardItem({"text/html":new Blob([s],{type:"text/html"}),"text/plain":new Blob([e],{type:"text/plain"})});await navigator.clipboard.write([o]);return}}catch(o){console.warn("Clipboard HTML write failed, falling back to text",o)}if((u=navigator.clipboard)!=null&&u.writeText)await navigator.clipboard.writeText(e);else{const o=document.createElement("textarea");o.value=e,document.body.appendChild(o),o.select(),document.execCommand("copy"),document.body.removeChild(o)}},N=(n,i="default")=>{const l=document.getElementById("toast-inline");l&&l.remove();const a=document.createElement("div");a.id="toast-inline",a.className=`toast-inline ${i==="success"?"toast-inline--success":""}`,a.textContent=n,document.body.appendChild(a),setTimeout(()=>a.remove(),2500)},z=()=>{const{filtered:n,stats:i}=x(),l=n.map(e=>`
    <tr>
      <td>${f(e.date)}</td>
      <td>${f(e.client)}</td>
      <td style="text-align:right;">${f(e.hours)}</td>
      <td style="text-align:right;">$${f(e.rate)}</td>
      <td style="text-align:right;">$${(e.hours*e.rate).toFixed(2)}</td>
      <td>${f(e.description)}</td>
    </tr>
  `).join(""),a=`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Timio - Export PDF</title>
        <style>
          body { font-family: 'Inter', sans-serif; margin: 32px; color: ${h.text}; }
          h1 { margin: 0 0 16px; color: ${h.primary}; }
          table { width: 100%; border-collapse: collapse; font-size: 14px; }
          th, td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
          th { text-align: left; background: #f3f4f6; text-transform: uppercase; letter-spacing: 0.06em; font-size: 12px; color: ${h.primary}; }
          tfoot td { font-weight: 700; background: #f9fafb; }
        </style>
      </head>
      <body>
        <h1>Entradas de Tiempo</h1>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th style="text-align:right;">Horas</th>
              <th style="text-align:right;">Tarifa/Hora</th>
              <th style="text-align:right;">Total</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            ${l||'<tr><td colspan="6" style="text-align:center;">Sin registros</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Registros: ${n.length}</td>
              <td style="text-align:right;">${i.totalHours}h</td>
              <td></td>
              <td style="text-align:right;">$${i.totalEarnings.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `,t=window.open("","_blank","width=1200,height=900");if(!t){alert("No se pudo abrir la ventana de impresión. Revisa bloqueadores de pop-ups.");return}t.document.write(a),t.document.close(),t.focus(),t.print(),t.close()},U=n=>{var t;const i=n.target,l=(t=i.files)==null?void 0:t[0];if(!l)return;const a=new FileReader;a.onload=()=>{alert(`Archivo "${l.name}" cargado. (Simulación: se añaden 2 registros)`),g=[...[{id:$(),client:"Importado Inc",date:"2023-12-01",hours:4,rate:45,description:"Datos importados",timestamp:new Date("2023-12-01").getTime()},{id:$(),client:"Importado Inc",date:"2023-12-02",hours:2,rate:45,description:"Datos importados vol 2",timestamp:new Date("2023-12-02").getTime()}],...g],y()},a.readAsText(l),i.value=""},_=async()=>{const n=document.getElementById("ai-output");if(!n)return;const{filtered:i,stats:l}=x();if(!i.length){n.textContent="No hay datos para analizar.";return}n.textContent="Analizando...",setTimeout(()=>{const a=i.reduce((e,s)=>(e[s.client]=(e[s.client]||0)+s.hours*s.rate,e),{}),t=Object.entries(a).sort((e,s)=>s[1]-e[1])[0];n.innerHTML=`
      <ul class="mb-0">
        <li>Facturación total: <strong>$${l.totalEarnings.toFixed(2)}</strong></li>
        <li>Horas registradas: <strong>${l.totalHours}h</strong></li>
        ${t?`<li>Cliente más rentable: <strong>${f(t[0])}</strong> ($${t[1].toFixed(2)})</li>`:""}
        <li>Tip retro: bloquea sesiones de 90 minutos y toma breaks cortos.</li>
      </ul>
    `},400)},y=()=>{M(),S(),H(),j()},G=()=>{I(h),y(),P(),R()};document.addEventListener("DOMContentLoaded",G);
