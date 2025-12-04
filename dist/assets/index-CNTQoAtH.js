(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const i of e.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function r(t){if(t.ep)return;t.ep=!0;const e=o(t);fetch(t.href,e)}})();const T={bg:"#B8B8FF",text:"#1F1A3D",primary:"#1F1A3D",secondary:"#D4E72C",accent:"#E0E0FF",muted:"#FEFEF0"},k=[{id:"1",client:"Acme Corp",date:"2023-10-05",hours:5,rate:50,description:"Diseño de landing page",timestamp:16964832e5},{id:"2",client:"Globex",date:"2023-10-12",hours:3.5,rate:60,description:"Consultoría React",timestamp:1697088e6},{id:"3",client:"Acme Corp",date:"2023-11-01",hours:8,rate:50,description:"Desarrollo Backend",timestamp:1698816e6}];let h=[...k],l={month:"",startDate:"",endDate:"",client:""},b="month",v=null,g={...T};const F=n=>{const a=document.documentElement;a.style.setProperty("--timio-bg",n.bg),a.style.setProperty("--timio-text",n.text),a.style.setProperty("--timio-primary",n.primary),a.style.setProperty("--timio-secondary",n.secondary),a.style.setProperty("--timio-accent",n.accent),a.style.setProperty("--timio-muted",n.muted)},w=()=>Math.random().toString(36).slice(2,9),E=()=>{const n=h.filter(r=>{const t=l.client?r.client===l.client:!0;let e=!0;return b==="month"&&l.month?e=r.date.startsWith(l.month):b==="day"&&l.startDate?e=r.date===l.startDate:b==="range"&&l.startDate&&l.endDate&&(e=r.date>=l.startDate&&r.date<=l.endDate),t&&e}).sort((r,t)=>t.date.localeCompare(r.date)),a=n.reduce((r,t)=>r+t.hours,0),o=n.reduce((r,t)=>r+t.hours*t.rate,0);return{filtered:n,stats:{totalHours:a,totalEarnings:o}}},u=n=>String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),L=()=>{E();const n=document.getElementById("filter-client");if(!n)return;const a=Array.from(new Set(h.map(t=>t.client)));n.innerHTML='<option value="">Todos</option>'+a.map(t=>`<option value="${u(t)}">${u(t)}</option>`).join(""),n.value=l.client;const o=document.getElementById("date-inputs");if(!o)return;if(b==="month"?o.innerHTML=`<input id="filter-month" type="month" class="form-control form-control-sm" value="${l.month}" />`:b==="day"?o.innerHTML=`<input id="filter-day" type="date" class="form-control form-control-sm" value="${l.startDate}" />`:o.innerHTML=`
      <input id="filter-start" type="date" class="form-control form-control-sm" value="${l.startDate}" />
      <input id="filter-end" type="date" class="form-control form-control-sm" value="${l.endDate}" />
    `,Object.entries({"btn-mode-month":"month","btn-mode-day":"day","btn-mode-range":"range"}).forEach(([t,e])=>{const i=document.getElementById(t);i&&i.classList.toggle("active",b===e)}),n.onchange=t=>{l.client=t.target.value,p()},b==="month"){const t=document.getElementById("filter-month");t&&(t.onchange=e=>{l.month=e.target.value,p()})}else if(b==="day"){const t=document.getElementById("filter-day");t&&(t.onchange=e=>{const i=e.target.value;l.startDate=i,l.endDate=i,p()})}else{const t=document.getElementById("filter-start"),e=document.getElementById("filter-end");t&&(t.onchange=i=>{l.startDate=i.target.value,p()}),e&&(e.onchange=i=>{l.endDate=i.target.value,p()})}},H=()=>{const{filtered:n,stats:a}=E(),o=document.getElementById("entries-body"),r=document.getElementById("entries-foot");!o||!r||(n.length?o.innerHTML=n.map(t=>`
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
            <button class="btn btn-outline-danger btn-sm" data-delete="${t.id}">
              <i class="fa-solid fa-trash-can me-1"></i> Borrar
            </button>
          </div>
        </td>
      </tr>
    `).join(""):o.innerHTML=`
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
    `,r.innerHTML=`
    <tr class="summary-row">
      <td colspan="2">Registros: ${n.length}</td>
      <td></td>
      <td class="text-end">${a.totalHours}h</td>
      <td></td>
      <td class="text-end">$${a.totalEarnings.toFixed(2)}</td>
      <td></td>
    </tr>
  `,o.querySelectorAll("[data-edit]").forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-edit");if(!e)return;const i=h.find(m=>m.id===e);i&&C(i)})}),o.querySelectorAll("[data-delete]").forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-delete");e&&confirm("¿Eliminar este registro?")&&(h=h.filter(i=>i.id!==e),p())})}))},S=()=>{const{stats:n,filtered:a}=E(),o=document.getElementById("stat-hours"),r=document.getElementById("stat-earnings"),t=document.getElementById("stat-count");o&&(o.textContent=`${n.totalHours}h`),r&&(r.textContent=`$${n.totalEarnings.toFixed(2)}`),t&&(t.textContent=`${a.length}`)},A=()=>{const{filtered:n}=E(),a=document.getElementById("pie-chart"),o=document.getElementById("pie-legend");if(!a||!o)return;if(!n.length){a.innerHTML='<div class="text-muted small">Sin datos</div>',o.innerHTML="";return}const r=n.reduce((c,d)=>(c[d.client]=(c[d.client]||0)+d.hours*d.rate,c),{}),t=Object.entries(r).sort((c,d)=>d[1]-c[1]),e=t.reduce((c,[,d])=>c+d,0),i=[g.primary,g.secondary,"#FF9F1C","#FF5F5F","#4ECDC4","#1A535C"],m=90,f=2*Math.PI*m;let s=0;const y=t.map(([c,d],x)=>{const $=d/e*f,D=`<circle r="${m}" cx="120" cy="120" fill="transparent"
        stroke="${i[x%i.length]}"
        stroke-width="24"
        stroke-dasharray="${$} ${f-$}"
        stroke-dashoffset="${-s}"
        transform="rotate(-90 120 120)" />`;return s+=$,D}).join("");a.innerHTML=`
    <svg width="240" height="240" viewBox="0 0 240 240">
      <circle r="${m}" cx="120" cy="120" fill="transparent" stroke="#f1f3f5" stroke-width="24" />
      ${y}
      <text x="120" y="125" text-anchor="middle" font-size="14" fill="${g.primary}" font-weight="700">${t.length} clientes</text>
    </svg>
  `,o.innerHTML=t.map(([c,d],x)=>`
    <div class="d-flex align-items-center gap-2 mb-1">
      <span class="rounded-circle d-inline-block" style="width:12px;height:12px;background:${i[x%i.length]};"></span>
      <span>${u(c)}</span>
      <span class="ms-auto fw-bold">$${d.toFixed(2)}</span>
    </div>
  `).join("")},M=()=>{const n=document.getElementById("btn-new");n&&(n.onclick=()=>C());const a=document.getElementById("btn-export-csv");a&&(a.onclick=P);const o=document.getElementById("btn-copy");o&&(o.onclick=()=>{O().then(()=>N("Tabla copiada","success"))});const r=document.getElementById("btn-export-pdf");r&&(r.onclick=R);const t=document.getElementById("file-upload");t&&(t.onchange=q);const e=document.getElementById("btn-analyze");e&&(e.onclick=z);const i=document.getElementById("btn-clear-filters");i&&(i.onclick=()=>{l={month:"",startDate:"",endDate:"",client:""},p()}),Object.entries({"btn-mode-month":"month","btn-mode-day":"day","btn-mode-range":"range"}).forEach(([c,d])=>{const x=document.getElementById(c);x&&(x.onclick=()=>{b=d,p()})});const f=document.getElementById("btn-theme-panel"),s=document.getElementById("theme-panel"),y=document.getElementById("theme-close");f&&s&&(f.onclick=()=>{s.style.display="block"}),y&&s&&(y.onclick=()=>{s.style.display="none"}),s&&s.querySelectorAll("input[data-theme-key]").forEach(c=>{c.addEventListener("input",d=>{const x=d.target.dataset.themeKey,B=d.target.value;g={...g,[x]:B},F(g),p()})})},C=n=>{const a=document.getElementById("entry-modal");if(!a)return;const o=document.getElementById("modal-title"),r=document.getElementById("form-client"),t=document.getElementById("form-date"),e=document.getElementById("form-hours"),i=document.getElementById("form-rate"),m=document.getElementById("form-description");n?(v=n.id,o&&(o.textContent="Editar entrada"),r.value=n.client,t.value=n.date,e.value=n.hours.toString(),i.value=n.rate.toString(),m.value=n.description):(v=null,o&&(o.textContent="Nueva entrada"),r.value="",t.value=new Date().toISOString().split("T")[0],e.value="0",i.value="0",m.value=""),a.style.display="block",a.classList.add("show")},I=()=>{const n=document.getElementById("entry-modal");n&&(n.style.display="none",n.classList.remove("show"))},j=()=>{const n=document.getElementById("modal-close"),a=document.getElementById("modal-cancel"),o=document.getElementById("entry-form");n&&(n.onclick=I),a&&(a.onclick=I),o&&(o.onsubmit=r=>{r.preventDefault();const t=document.getElementById("form-client").value.trim(),e=document.getElementById("form-date").value,i=parseFloat(document.getElementById("form-hours").value)||0,m=parseFloat(document.getElementById("form-rate").value)||0,f=document.getElementById("form-description").value;!t||!e||(v?h=h.map(s=>s.id===v?{...s,client:t,date:e,hours:i,rate:m,description:f,timestamp:Date.now()}:s):h=[{id:w(),client:t,date:e,hours:i,rate:m,description:f,timestamp:Date.now()},...h],I(),p())})},P=()=>{const{filtered:n}=E(),o=[["Fecha","Cliente","Horas","Tarifa/Hora","Total","Descripción"].join(","),...n.map(e=>[e.date,`"${e.client}"`,e.hours,e.rate,e.hours*e.rate,`"${e.description}"`].join(","))].join(`
`),r=new Blob([o],{type:"text/csv;charset=utf-8;"}),t=document.createElement("a");t.href=URL.createObjectURL(r),t.download=`timio_export_${new Date().toISOString().split("T")[0]}.csv`,t.click()},O=async()=>{var m,f;const{filtered:n,stats:a}=E(),o=["Cliente","Descripción","Fecha","Horas","Tarifa/Hora","Total"],r=n.map(s=>[u(s.client),u(s.description),u(s.date),String(s.hours),String(s.rate),(s.hours*s.rate).toFixed(2)]),t=["Totales","","",a.totalHours.toFixed(2),"",a.totalEarnings.toFixed(2)],e=[o,...r,t].map(s=>s.join("	")).join(`
`),i=`
    <table style="border-collapse:collapse;min-width:600px;">
      <thead>
        <tr>
          ${o.map(s=>`<th style="border:1px solid #ddd;padding:6px 8px;background:#f7f5fc;font-weight:700;text-align:left;">${s}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${r.map(s=>`
          <tr>
            ${s.map((y,c)=>`<td style="border:1px solid #eee;padding:6px 8px;text-align:${c>=3?"right":"left"};">${y}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
      <tfoot>
        <tr>
          ${t.map((s,y)=>`<td style="border:1px solid #ddd;padding:6px 8px;text-align:${y>=3?"right":"left"};font-weight:${y===0?"700":"600"};background:#fafafa;">${s}</td>`).join("")}
        </tr>
      </tfoot>
    </table>
  `;try{if((m=navigator.clipboard)!=null&&m.write){const s=new ClipboardItem({"text/html":new Blob([i],{type:"text/html"}),"text/plain":new Blob([e],{type:"text/plain"})});await navigator.clipboard.write([s]);return}}catch(s){console.warn("Clipboard HTML write failed, falling back to text",s)}if((f=navigator.clipboard)!=null&&f.writeText)await navigator.clipboard.writeText(e);else{const s=document.createElement("textarea");s.value=e,document.body.appendChild(s),s.select(),document.execCommand("copy"),document.body.removeChild(s)}},N=(n,a="default")=>{const o=document.getElementById("toast-inline");o&&o.remove();const r=document.createElement("div");r.id="toast-inline",r.className=`toast-inline ${a==="success"?"toast-inline--success":""}`,r.textContent=n,document.body.appendChild(r),setTimeout(()=>r.remove(),2500)},R=()=>{const{filtered:n,stats:a}=E(),o=n.map(e=>`
    <tr>
      <td>${u(e.date)}</td>
      <td>${u(e.client)}</td>
      <td style="text-align:right;">${u(e.hours)}</td>
      <td style="text-align:right;">$${u(e.rate)}</td>
      <td style="text-align:right;">$${(e.hours*e.rate).toFixed(2)}</td>
      <td>${u(e.description)}</td>
    </tr>
  `).join(""),r=`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Timio - Export PDF</title>
        <style>
          body { font-family: 'Inter', sans-serif; margin: 32px; color: ${g.text}; }
          h1 { margin: 0 0 16px; color: ${g.primary}; }
          table { width: 100%; border-collapse: collapse; font-size: 14px; }
          th, td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
          th { text-align: left; background: #f3f4f6; text-transform: uppercase; letter-spacing: 0.06em; font-size: 12px; color: ${g.primary}; }
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
            ${o||'<tr><td colspan="6" style="text-align:center;">Sin registros</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Registros: ${n.length}</td>
              <td style="text-align:right;">${a.totalHours}h</td>
              <td></td>
              <td style="text-align:right;">$${a.totalEarnings.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `,t=window.open("","_blank","width=1200,height=900");if(!t){alert("No se pudo abrir la ventana de impresión. Revisa bloqueadores de pop-ups.");return}t.document.write(r),t.document.close(),t.focus(),t.print(),t.close()},q=n=>{var t;const a=n.target,o=(t=a.files)==null?void 0:t[0];if(!o)return;const r=new FileReader;r.onload=()=>{alert(`Archivo "${o.name}" cargado. (Simulación: se añaden 2 registros)`),h=[...[{id:w(),client:"Importado Inc",date:"2023-12-01",hours:4,rate:45,description:"Datos importados",timestamp:Date.now()},{id:w(),client:"Importado Inc",date:"2023-12-02",hours:2,rate:45,description:"Datos importados vol 2",timestamp:Date.now()}],...h],p()},r.readAsText(o),a.value=""},z=async()=>{const n=document.getElementById("ai-output");if(!n)return;const{filtered:a,stats:o}=E();if(!a.length){n.textContent="No hay datos para analizar.";return}n.textContent="Analizando...",setTimeout(()=>{const r=a.reduce((e,i)=>(e[i.client]=(e[i.client]||0)+i.hours*i.rate,e),{}),t=Object.entries(r).sort((e,i)=>i[1]-e[1])[0];n.innerHTML=`
      <ul class="mb-0">
        <li>Facturación total: <strong>$${o.totalEarnings.toFixed(2)}</strong></li>
        <li>Horas registradas: <strong>${o.totalHours}h</strong></li>
        ${t?`<li>Cliente más rentable: <strong>${u(t[0])}</strong> ($${t[1].toFixed(2)})</li>`:""}
        <li>Tip retro: bloquea sesiones de 90 minutos y toma breaks cortos.</li>
      </ul>
    `},400)},p=()=>{S(),L(),H(),A()},U=()=>{F(g),p(),M(),j()};document.addEventListener("DOMContentLoaded",U);
