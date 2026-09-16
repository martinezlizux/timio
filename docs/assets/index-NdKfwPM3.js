(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();const P={bg:"#F8FAFC",text:"#0F172A",primary:"#9333EA",secondary:"#BEF264",accent:"#E9D5FF",muted:"#64748B"},I=e=>e.toISOString().split("T")[0],k=e=>{const n=new Date;return n.setDate(n.getDate()-e),{date:I(n),timestamp:n.getTime()}},C=k(12),T=k(5),B=k(2),j=[{id:"1",client:"Acme Corp",date:C.date,hours:5,rate:50,description:"Diseño de landing page",timestamp:C.timestamp},{id:"2",client:"Globex",date:T.date,hours:3.5,rate:60,description:"Consultoría React",timestamp:T.timestamp},{id:"3",client:"Acme Corp",date:B.date,hours:8,rate:50,description:"Desarrollo Backend",timestamp:B.timestamp}];let g=[...j];const L=()=>{const e=new Date,n=new Date;return n.setDate(n.getDate()-30),{startDate:I(n),endDate:I(e)}};let r={...L(),clients:[]},x=null,y={...P};const A=e=>{const n=document.documentElement;n.style.setProperty("--timio-bg",e.bg),n.style.setProperty("--timio-text",e.text),n.style.setProperty("--timio-primary",e.primary),n.style.setProperty("--timio-secondary",e.secondary),n.style.setProperty("--timio-accent",e.accent),n.style.setProperty("--timio-muted",e.muted)},D=()=>Math.random().toString(36).slice(2,9),b=()=>{const e=g.filter(a=>{const t=r.clients.length?r.clients.includes(a.client):!0,o=r.startDate?new Date(`${r.startDate}T00:00:00`).getTime():Number.NEGATIVE_INFINITY,c=r.endDate?new Date(`${r.endDate}T23:59:59`).getTime():Number.POSITIVE_INFINITY,i=a.timestamp>=o&&a.timestamp<=c;return t&&i}).sort((a,t)=>t.timestamp-a.timestamp),n=e.reduce((a,t)=>a+t.hours,0),s=e.reduce((a,t)=>a+t.hours*t.rate,0);return{filtered:e,stats:{totalHours:n,totalEarnings:s}}},u=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),E=()=>{document.querySelectorAll(".filter-dropdown .dropdown-menu.show").forEach(e=>e.classList.remove("show")),document.querySelectorAll(".filter-dropdown .dropdown-toggle").forEach(e=>e.setAttribute("aria-expanded","false"))};let F=!1;const S=()=>{F||(document.addEventListener("click",()=>E()),F=!0)},N=()=>{const e=document.getElementById("btn-toggle-filters"),n=document.getElementById("s-filtros-aplicados");e&&n&&e.addEventListener("click",t=>{t.stopPropagation(),n.classList.toggle("d-none"),n.classList.contains("d-none")&&E()});const s=document.getElementById("filter-client-toggle"),a=document.getElementById("filter-client-menu");s&&a&&(s.addEventListener("click",t=>{t.stopPropagation(),E(),a.classList.toggle("show"),s.setAttribute("aria-expanded",a.classList.contains("show")?"true":"false")}),a.addEventListener("click",t=>t.stopPropagation()),S())},O=()=>{const e=document.getElementById("s-filtros-aplicados");if(!e)return;const n=[];(r.startDate||r.endDate)&&n.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="time">
        <span class="small">Fechas: ${r.startDate||"..."} → ${r.endDate||"..."}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove="time" aria-label="Quitar filtro de fechas">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `),r.clients.forEach(s=>{n.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="client-${s}">
        <span class="small">Cliente: ${u(s)}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove-client="${u(s)}" aria-label="Quitar cliente ${u(s)}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `)}),n.length?(e.innerHTML=n.join(""),e.querySelectorAll('[data-remove="time"]').forEach(s=>{s.addEventListener("click",()=>{r={...r,...L()},h()})}),e.querySelectorAll("[data-remove-client]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.removeClient;r.clients=r.clients.filter(t=>t!==a),h()})})):e.innerHTML='<span class="text-muted small">Sin filtros aplicados</span>'},q=()=>{const e=document.getElementById("filter-start"),n=document.getElementById("filter-end"),s=document.getElementById("filter-client-menu"),a=document.getElementById("filter-client-label");if(!e||!n||!s||!a)return;e.value=r.startDate,n.value=r.endDate;const t=Array.from(new Set(g.map(i=>i.client)));r.clients=r.clients.filter(i=>t.includes(i)),s.innerHTML=`
    <div class="form-check mb-2">
      <input class="form-check-input" type="checkbox" id="client-all" ${r.clients.length===0?"checked":""}>
      <label class="form-check-label" for="client-all">Todos</label>
    </div>
    ${t.map(i=>`
      <div class="form-check mb-1">
        <input class="form-check-input" type="checkbox" id="client-${i.toLowerCase().replace(/[^a-z0-9]+/g,"-")||"item"}" value="${u(i)}" ${r.clients.includes(i)?"checked":""}>
        <label class="form-check-label" for="client-${i.toLowerCase().replace(/[^a-z0-9]+/g,"-")||"item"}">${u(i)}</label>
      </div>
    `).join("")}
  `,r.clients.length===0?a.textContent="Todos":r.clients.length===1?a.textContent=r.clients[0]:a.textContent=`${r.clients.length} seleccionados`,e.onchange=i=>{const d=i.target.value;r.startDate=d,r.endDate&&r.startDate>r.endDate&&(r.endDate=r.startDate),h()},n.onchange=i=>{const d=i.target.value;r.endDate=d,r.startDate&&r.startDate>r.endDate&&(r.startDate=r.endDate),h()};const o=document.getElementById("client-all");o&&(o.onchange=i=>{i.target.checked&&(r.clients=[],h())}),s.querySelectorAll('input[type="checkbox"]').forEach(i=>{i.id!=="client-all"&&(i.onchange=d=>{const l=d.target.value;d.target.checked?r.clients=Array.from(new Set([...r.clients,l])):r.clients=r.clients.filter(m=>m!==l),o&&(o.checked=r.clients.length===0),h()})}),[{buttonId:"filter-client-toggle",menuId:"filter-client-menu"}].forEach(({buttonId:i,menuId:d})=>{const l=document.getElementById(i),m=document.getElementById(d);!l||!m||(l.onclick=p=>{p.stopPropagation(),E(),m.classList.toggle("show"),l.setAttribute("aria-expanded",m.classList.contains("show")?"true":"false")},m.onclick=p=>p.stopPropagation())}),S(),O()},R=()=>{const{filtered:e,stats:n}=b(),s=document.getElementById("entries-body"),a=document.getElementById("entries-foot");!s||!a||(e.length?s.innerHTML=e.map(t=>`
      <tr>
        <td><span class="badge-chip">${u(t.client)}</span></td>
        <td>${u(t.description)}</td>
        <td>${new Date(t.date).toLocaleDateString()}</td>
        <td class="text-end">${t.hours}</td>
        <td class="text-end">$${t.rate}</td>
        <td class="text-end">$${(t.hours*t.rate).toFixed(2)}</td>
        <td class="text-end">
          <div class="entry-actions">
            <button class="btn btn-link-primary btn-sm" data-edit="${t.id}">
              <i class="fa-solid fa-pen-to-square me-1"></i> Editar
            </button>
            <button class="btn btn-link-danger btn-sm" data-delete="${t.id}">
              <i class="fa-solid fa-trash-can me-1"></i> Borrar
            </button>
          </div>
        </td>
      </tr>
    `).join(""):s.innerHTML=`
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
      <td colspan="2">Registros: ${e.length}</td>
      <td></td>
      <td class="text-end">${n.totalHours}h</td>
      <td></td>
      <td class="text-end">$${n.totalEarnings.toFixed(2)}</td>
      <td></td>
    </tr>
  `,s.querySelectorAll("[data-edit]").forEach(t=>{t.addEventListener("click",()=>{const o=t.getAttribute("data-edit");if(!o)return;const c=g.find(i=>i.id===o);c&&H(c)})}),s.querySelectorAll("[data-delete]").forEach(t=>{t.addEventListener("click",()=>{const o=t.getAttribute("data-delete");o&&confirm("¿Eliminar este registro?")&&(g=g.filter(c=>c.id!==o),h())})}))},z=()=>{const{stats:e,filtered:n}=b(),s=document.getElementById("stat-hours"),a=document.getElementById("stat-earnings"),t=document.getElementById("stat-count");s&&(s.textContent=`${e.totalHours}h`),a&&(a.textContent=`$${e.totalEarnings.toFixed(2)}`),t&&(t.textContent=`${n.length}`)},_=()=>{const{filtered:e}=b(),n=document.getElementById("pie-chart"),s=document.getElementById("pie-legend");if(!n||!s)return;if(!e.length){n.innerHTML='<div class="text-muted small">Sin datos</div>',s.innerHTML="";return}const a=e.reduce((p,f)=>(p[f.client]=(p[f.client]||0)+f.hours*f.rate,p),{}),t=Object.entries(a).sort((p,f)=>f[1]-p[1]),o=t.reduce((p,[,f])=>p+f,0),c=[y.primary,y.secondary,"#FF9F1C","#FF5F5F","#4ECDC4","#1A535C"],i=90,d=2*Math.PI*i;let l=0;const m=t.map(([p,f],v)=>{const w=f/o*d,M=`<circle r="${i}" cx="120" cy="120" fill="transparent"
        stroke="${c[v%c.length]}"
        stroke-width="24"
        stroke-dasharray="${w} ${d-w}"
        stroke-dashoffset="${-l}"
        transform="rotate(-90 120 120)" />`;return l+=w,M}).join("");n.innerHTML=`
    <svg width="240" height="240" viewBox="0 0 240 240">
      <circle r="${i}" cx="120" cy="120" fill="transparent" stroke="#f1f3f5" stroke-width="24" />
      ${m}
      <text x="120" y="125" text-anchor="middle" font-size="14" fill="${y.primary}" font-weight="700">${t.length} clientes</text>
    </svg>
  `,s.innerHTML=t.map(([p,f],v)=>`
    <div class="d-flex align-items-center gap-2 mb-1">
      <span class="legend-color-dot chart-color-${v%6}"></span>
      <span>${u(p)}</span>
      <span class="ms-auto fw-bold">$${f.toFixed(2)}</span>
    </div>
  `).join("")},U=()=>{const e=document.getElementById("btn-new");e&&(e.onclick=()=>H());const n=document.getElementById("btn-export-csv");n&&(n.onclick=V);const s=document.getElementById("btn-copy");s&&(s.onclick=()=>{K().then(()=>Q("Tabla copiada","success"))});const a=document.getElementById("btn-export-pdf");a&&(a.onclick=Y);const t=document.getElementById("file-upload");t&&(t.onchange=J);const o=document.getElementById("btn-analyze");o&&(o.onclick=W);const c=document.getElementById("btn-theme-panel"),i=document.getElementById("theme-panel"),d=document.getElementById("theme-close");c&&i&&(c.onclick=()=>{i.style.display="block"}),d&&i&&(d.onclick=()=>{i.style.display="none"}),i&&i.querySelectorAll("input[data-theme-key]").forEach(l=>{l.addEventListener("input",m=>{const p=m.target.dataset.themeKey,f=m.target.value;y={...y,[p]:f},A(y),h()})})},H=e=>{const n=document.getElementById("entry-modal");if(!n)return;const s=document.getElementById("modal-title"),a=document.getElementById("form-client"),t=document.getElementById("form-date"),o=document.getElementById("form-hours"),c=document.getElementById("form-rate"),i=document.getElementById("form-description");e?(x=e.id,s&&(s.textContent="Editar entrada"),a.value=e.client,t.value=e.date,o.value=e.hours.toString(),c.value=e.rate.toString(),i.value=e.description):(x=null,s&&(s.textContent="Nueva entrada"),a.value="",t.value=new Date().toISOString().split("T")[0],o.value="0",c.value="0",i.value=""),n.style.display="block",n.classList.add("show");const d=document.getElementById("modal-overlay"),l=d||document.createElement("div");l.id="modal-overlay",l.className="modal-backdrop-timio",d||document.body.appendChild(l),requestAnimationFrame(()=>l.classList.add("visible")),document.body.classList.add("modal-open-timio")},$=()=>{const e=document.getElementById("entry-modal");if(!e)return;e.style.display="none",e.classList.remove("show");const n=document.getElementById("modal-overlay");n&&(n.classList.remove("visible"),setTimeout(()=>n.remove(),200)),document.body.classList.remove("modal-open-timio")},G=()=>{const e=document.getElementById("modal-close"),n=document.getElementById("modal-cancel"),s=document.getElementById("entry-form");e&&(e.onclick=$),n&&(n.onclick=$),s&&(s.onsubmit=a=>{a.preventDefault();const t=document.getElementById("form-client").value.trim(),o=document.getElementById("form-date").value,c=parseFloat(document.getElementById("form-hours").value)||0,i=parseFloat(document.getElementById("form-rate").value)||0,d=document.getElementById("form-description").value,l=new Date(o).getTime()||Date.now();!t||!o||(x?g=g.map(m=>m.id===x?{...m,client:t,date:o,hours:c,rate:i,description:d,timestamp:l}:m):g=[{id:D(),client:t,date:o,hours:c,rate:i,description:d,timestamp:l},...g],$(),h())})},V=()=>{const{filtered:e}=b(),s=[["Fecha","Cliente","Horas","Tarifa/Hora","Total","Descripción"].join(","),...e.map(o=>[o.date,`"${o.client}"`,o.hours,o.rate,o.hours*o.rate,`"${o.description}"`].join(","))].join(`
`),a=new Blob([s],{type:"text/csv;charset=utf-8;"}),t=document.createElement("a");t.href=URL.createObjectURL(a),t.download=`timio_export_${new Date().toISOString().split("T")[0]}.csv`,t.click()},K=async()=>{var i,d;const{filtered:e,stats:n}=b(),s=["Cliente","Descripción","Fecha","Horas","Tarifa/Hora","Total"],a=e.map(l=>[u(l.client),u(l.description),u(l.date),String(l.hours),String(l.rate),(l.hours*l.rate).toFixed(2)]),t=["Totales","","",n.totalHours.toFixed(2),"",n.totalEarnings.toFixed(2)],o=[s,...a,t].map(l=>l.join("	")).join(`
`),c=`
    <style>
      .export-table { border-collapse: collapse; min-width: 600px; font-family: sans-serif; }
      .export-table th { border: 1px solid #ddd; padding: 6px 8px; background: #f7f5fc; font-weight: 700; text-align: left; }
      .export-table td { border: 1px solid #eee; padding: 6px 8px; }
      .export-table .text-right { text-align: right; }
      .export-table .text-left { text-align: left; }
      .export-table .export-total-row td { border: 1px solid #ddd; padding: 6px 8px; background: #fafafa; font-weight: 600; }
      .export-table .export-total-row td:first-child { font-weight: 700; }
    </style>
    <table class="export-table">
      <thead>
        <tr>
          ${s.map(l=>`<th>${l}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${a.map(l=>`
          <tr>
            ${l.map((m,p)=>`<td class="${p>=3?"text-right":"text-left"}">${m}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
      <tfoot>
        <tr class="export-total-row">
          ${t.map((l,m)=>`<td class="${m>=3?"text-right":"text-left"}">${l}</td>`).join("")}
        </tr>
      </tfoot>
    </table>
  `;try{if((i=navigator.clipboard)!=null&&i.write){const l=new ClipboardItem({"text/html":new Blob([c],{type:"text/html"}),"text/plain":new Blob([o],{type:"text/plain"})});await navigator.clipboard.write([l]);return}}catch(l){console.warn("Clipboard HTML write failed, falling back to text",l)}if((d=navigator.clipboard)!=null&&d.writeText)await navigator.clipboard.writeText(o);else{const l=document.createElement("textarea");l.value=o,document.body.appendChild(l),l.select(),document.execCommand("copy"),document.body.removeChild(l)}},Q=(e,n="default")=>{const s=document.getElementById("toast-inline");s&&s.remove();const a=document.createElement("div");a.id="toast-inline",a.className=`toast-inline ${n==="success"?"toast-inline--success":""}`,a.textContent=e,document.body.appendChild(a),setTimeout(()=>a.remove(),2500)},Y=()=>{const{filtered:e,stats:n}=b(),s=e.map(o=>`
    <tr>
      <td>${u(o.date)}</td>
      <td>${u(o.client)}</td>
      <td class="text-end">${u(o.hours)}</td>
      <td class="text-end">$${u(o.rate)}</td>
      <td class="text-end">$${(o.hours*o.rate).toFixed(2)}</td>
      <td>${u(o.description)}</td>
    </tr>
  `).join(""),a=`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Timio - Export PDF</title>
        <style>
          body { font-family: 'Inter', sans-serif; margin: 32px; color: ${y.text}; }
          h1 { margin: 0 0 16px; color: ${y.primary}; }
          table { width: 100%; border-collapse: collapse; font-size: 14px; }
          th, td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
          th { text-align: left; background: #f3f4f6; text-transform: uppercase; letter-spacing: 0.06em; font-size: 12px; color: ${y.primary}; }
          tfoot td { font-weight: 700; background: #f9fafb; }
          .text-end { text-align: right; }
          .text-center { text-align: center; }
        </style>
      </head>
      <body>
        <h1>Entradas de Tiempo</h1>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th class="text-end">Horas</th>
              <th class="text-end">Tarifa/Hora</th>
              <th class="text-end">Total</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            ${s||'<tr><td colspan="6" class="text-center">Sin registros</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Registros: ${e.length}</td>
              <td class="text-end">${n.totalHours}h</td>
              <td></td>
              <td class="text-end">$${n.totalEarnings.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `,t=window.open("","_blank","width=1200,height=900");if(!t){alert("No se pudo abrir la ventana de impresión. Revisa bloqueadores de pop-ups.");return}t.document.write(a),t.document.close(),t.focus(),t.print(),t.close()},J=e=>{var t;const n=e.target,s=(t=n.files)==null?void 0:t[0];if(!s)return;const a=new FileReader;a.onload=()=>{alert(`Archivo "${s.name}" cargado. (Simulación: se añaden 2 registros)`),g=[...[{id:D(),client:"Importado Inc",date:"2023-12-01",hours:4,rate:45,description:"Datos importados",timestamp:new Date("2023-12-01").getTime()},{id:D(),client:"Importado Inc",date:"2023-12-02",hours:2,rate:45,description:"Datos importados vol 2",timestamp:new Date("2023-12-02").getTime()}],...g],h()},a.readAsText(s),n.value=""},W=async()=>{const e=document.getElementById("ai-output");if(!e)return;const{filtered:n,stats:s}=b();if(!n.length){e.textContent="No hay datos para analizar.";return}e.textContent="Analizando...",setTimeout(()=>{const a=n.reduce((o,c)=>(o[c.client]=(o[c.client]||0)+c.hours*c.rate,o),{}),t=Object.entries(a).sort((o,c)=>c[1]-o[1])[0];e.innerHTML=`
      <ul class="mb-0">
        <li>Facturación total: <strong>$${s.totalEarnings.toFixed(2)}</strong></li>
        <li>Horas registradas: <strong>${s.totalHours}h</strong></li>
        ${t?`<li>Cliente más rentable: <strong>${u(t[0])}</strong> ($${t[1].toFixed(2)})</li>`:""}
        <li>Tip retro: bloquea sesiones de 90 minutos y toma breaks cortos.</li>
      </ul>
    `},400)},h=()=>{z(),q(),R(),_()},X=()=>{A(y),h(),U(),G(),N()};document.addEventListener("DOMContentLoaded",X);
