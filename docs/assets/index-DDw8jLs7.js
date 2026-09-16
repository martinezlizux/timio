(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function o(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(t){if(t.ep)return;t.ep=!0;const s=o(t);fetch(t.href,s)}})();const P={bg:"#F8FAFC",text:"#0F172A",primary:"#9333EA",secondary:"#BEF264",accent:"#E9D5FF",muted:"#64748B"},I=e=>e.toISOString().split("T")[0],k=e=>{const n=new Date;return n.setDate(n.getDate()-e),{date:I(n),timestamp:n.getTime()}},B=k(12),C=k(5),T=k(2),j=[{id:"1",client:"Acme Corp",date:B.date,hours:5,rate:50,description:"Diseño de landing page",timestamp:B.timestamp},{id:"2",client:"Globex",date:C.date,hours:3.5,rate:60,description:"Consultoría React",timestamp:C.timestamp},{id:"3",client:"Acme Corp",date:T.date,hours:8,rate:50,description:"Desarrollo Backend",timestamp:T.timestamp}];let g=[...j];const L=()=>{const e=new Date,n=new Date;return n.setDate(n.getDate()-30),{startDate:I(n),endDate:I(e)}};let r={...L(),clients:[]},E=null,y={...P};const A=e=>{const n=document.documentElement;n.style.setProperty("--timio-bg",e.bg),n.style.setProperty("--timio-text",e.text),n.style.setProperty("--timio-primary",e.primary),n.style.setProperty("--timio-secondary",e.secondary),n.style.setProperty("--timio-accent",e.accent),n.style.setProperty("--timio-muted",e.muted)},D=()=>Math.random().toString(36).slice(2,9),b=()=>{const e=g.filter(a=>{const t=r.clients.length?r.clients.includes(a.client):!0,s=r.startDate?new Date(`${r.startDate}T00:00:00`).getTime():Number.NEGATIVE_INFINITY,c=r.endDate?new Date(`${r.endDate}T23:59:59`).getTime():Number.POSITIVE_INFINITY,i=a.timestamp>=s&&a.timestamp<=c;return t&&i}).sort((a,t)=>t.timestamp-a.timestamp),n=e.reduce((a,t)=>a+t.hours,0),o=e.reduce((a,t)=>a+t.hours*t.rate,0);return{filtered:e,stats:{totalHours:n,totalEarnings:o}}},u=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),v=()=>{document.querySelectorAll(".filter-dropdown .dropdown-menu.show").forEach(e=>e.classList.remove("show")),document.querySelectorAll(".filter-dropdown .dropdown-toggle").forEach(e=>e.setAttribute("aria-expanded","false"))};let F=!1;const S=()=>{F||(document.addEventListener("click",()=>v()),F=!0)},N=()=>{const e=document.getElementById("btn-toggle-filters"),n=document.getElementById("s-filtros-aplicados");e&&n&&e.addEventListener("click",t=>{t.stopPropagation(),n.classList.toggle("d-none"),n.classList.contains("d-none")&&v()});const o=document.getElementById("filter-client-toggle"),a=document.getElementById("filter-client-menu");o&&a&&(o.addEventListener("click",t=>{t.stopPropagation(),v(),a.classList.toggle("show"),o.setAttribute("aria-expanded",a.classList.contains("show")?"true":"false")}),a.addEventListener("click",t=>t.stopPropagation()),S())},O=()=>{const e=document.getElementById("s-filtros-aplicados");if(!e)return;const n=[];(r.startDate||r.endDate)&&n.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="time">
        <span class="small">Fechas: ${r.startDate||"..."} → ${r.endDate||"..."}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove="time" aria-label="Quitar filtro de fechas">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `),r.clients.forEach(o=>{n.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="client-${o}">
        <span class="small">Cliente: ${u(o)}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove-client="${u(o)}" aria-label="Quitar cliente ${u(o)}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `)}),n.length?(e.innerHTML=n.join(""),e.querySelectorAll('[data-remove="time"]').forEach(o=>{o.addEventListener("click",()=>{r={...r,...L()},h()})}),e.querySelectorAll("[data-remove-client]").forEach(o=>{o.addEventListener("click",()=>{const a=o.dataset.removeClient;r.clients=r.clients.filter(t=>t!==a),h()})})):e.innerHTML='<span class="text-muted small">Sin filtros aplicados</span>'},q=()=>{const e=document.getElementById("filter-start"),n=document.getElementById("filter-end"),o=document.getElementById("filter-client-menu"),a=document.getElementById("filter-client-label");if(!e||!n||!o||!a)return;e.value=r.startDate,n.value=r.endDate;const t=Array.from(new Set(g.map(i=>i.client)));r.clients=r.clients.filter(i=>t.includes(i)),o.innerHTML=`
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
  `,r.clients.length===0?a.textContent="Todos":r.clients.length===1?a.textContent=r.clients[0]:a.textContent=`${r.clients.length} seleccionados`,e.onchange=i=>{const d=i.target.value;r.startDate=d,r.endDate&&r.startDate>r.endDate&&(r.endDate=r.startDate),h()},n.onchange=i=>{const d=i.target.value;r.endDate=d,r.startDate&&r.startDate>r.endDate&&(r.startDate=r.endDate),h()};const s=document.getElementById("client-all");s&&(s.onchange=i=>{i.target.checked&&(r.clients=[],h())}),o.querySelectorAll('input[type="checkbox"]').forEach(i=>{i.id!=="client-all"&&(i.onchange=d=>{const l=d.target.value;d.target.checked?r.clients=Array.from(new Set([...r.clients,l])):r.clients=r.clients.filter(p=>p!==l),s&&(s.checked=r.clients.length===0),h()})}),[{buttonId:"filter-client-toggle",menuId:"filter-client-menu"}].forEach(({buttonId:i,menuId:d})=>{const l=document.getElementById(i),p=document.getElementById(d);!l||!p||(l.onclick=m=>{m.stopPropagation(),v(),p.classList.toggle("show"),l.setAttribute("aria-expanded",p.classList.contains("show")?"true":"false")},p.onclick=m=>m.stopPropagation())}),S(),O()},R=()=>{const{filtered:e,stats:n}=b(),o=document.getElementById("entries-body"),a=document.getElementById("entries-foot");!o||!a||(e.length?o.innerHTML=e.map(t=>`
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
    `,a.innerHTML=`
    <tr class="summary-row">
      <td colspan="2">Registros: ${e.length}</td>
      <td></td>
      <td class="text-end">${n.totalHours}h</td>
      <td></td>
      <td class="text-end">$${n.totalEarnings.toFixed(2)}</td>
      <td></td>
    </tr>
  `,o.querySelectorAll("[data-edit]").forEach(t=>{t.addEventListener("click",()=>{const s=t.getAttribute("data-edit");if(!s)return;const c=g.find(i=>i.id===s);c&&H(c)})}),o.querySelectorAll("[data-delete]").forEach(t=>{t.addEventListener("click",()=>{const s=t.getAttribute("data-delete");s&&confirm("¿Eliminar este registro?")&&(g=g.filter(c=>c.id!==s),h())})}))},z=()=>{const{stats:e,filtered:n}=b(),o=document.getElementById("stat-hours"),a=document.getElementById("stat-earnings"),t=document.getElementById("stat-count");o&&(o.textContent=`${e.totalHours}h`),a&&(a.textContent=`$${e.totalEarnings.toFixed(2)}`),t&&(t.textContent=`${n.length}`)},_=()=>{const{filtered:e}=b(),n=document.getElementById("pie-chart"),o=document.getElementById("pie-legend");if(!n||!o)return;if(!e.length){n.innerHTML='<div class="text-muted small">Sin datos</div>',o.innerHTML="";return}const a=e.reduce((m,f)=>(m[f.client]=(m[f.client]||0)+f.hours*f.rate,m),{}),t=Object.entries(a).sort((m,f)=>f[1]-m[1]),s=t.reduce((m,[,f])=>m+f,0),c=[y.primary,y.secondary,"#FF9F1C","#FF5F5F","#4ECDC4","#1A535C"],i=90,d=2*Math.PI*i;let l=0;const p=t.map(([m,f],w)=>{const $=f/s*d,M=`<circle r="${i}" cx="120" cy="120" fill="transparent"
        stroke="${c[w%c.length]}"
        stroke-width="24"
        stroke-dasharray="${$} ${d-$}"
        stroke-dashoffset="${-l}"
        transform="rotate(-90 120 120)" />`;return l+=$,M}).join("");n.innerHTML=`
    <svg width="240" height="240" viewBox="0 0 240 240">
      <circle r="${i}" cx="120" cy="120" fill="transparent" stroke="#f1f3f5" stroke-width="24" />
      ${p}
      <text x="120" y="125" text-anchor="middle" font-size="14" fill="${y.primary}" font-weight="700">${t.length} clientes</text>
    </svg>
  `,o.innerHTML=t.map(([m,f],w)=>`
    <div class="d-flex align-items-center gap-2 mb-1">
      <span class="legend-color-dot chart-color-${w%6}"></span>
      <span>${u(m)}</span>
      <span class="ms-auto fw-bold">$${f.toFixed(2)}</span>
    </div>
  `).join("")},U=()=>{const e=document.getElementById("btn-new");e&&(e.onclick=()=>H());const n=document.getElementById("btn-export-csv");n&&(n.onclick=V);const o=document.getElementById("btn-copy");o&&(o.onclick=()=>{K().then(()=>Q("Tabla copiada","success"))});const a=document.getElementById("btn-export-pdf");a&&(a.onclick=Y);const t=document.getElementById("file-upload");t&&(t.onchange=J);const s=document.getElementById("btn-analyze");s&&(s.onclick=W);const c=document.getElementById("btn-theme-panel"),i=document.getElementById("theme-panel"),d=document.getElementById("theme-close");c&&i&&(c.onclick=()=>{i.style.display="block"}),d&&i&&(d.onclick=()=>{i.style.display="none"}),i&&i.querySelectorAll("input[data-theme-key]").forEach(l=>{l.addEventListener("input",p=>{const m=p.target.dataset.themeKey,f=p.target.value;y={...y,[m]:f},A(y),h()})})},H=e=>{const n=document.getElementById("entry-modal");if(!n)return;const o=document.getElementById("modal-title"),a=document.getElementById("form-client"),t=document.getElementById("form-date"),s=document.getElementById("form-hours"),c=document.getElementById("form-rate"),i=document.getElementById("form-description");e?(E=e.id,o&&(o.textContent="Editar entrada"),a.value=e.client,t.value=e.date,s.value=e.hours.toString(),c.value=e.rate.toString(),i.value=e.description):(E=null,o&&(o.textContent="Nueva entrada"),a.value="",t.value=new Date().toISOString().split("T")[0],s.value="0",c.value="0",i.value=""),n.classList.remove("d-none"),n.style.display="block",n.classList.add("show");const d=document.getElementById("modal-overlay"),l=d||document.createElement("div");l.id="modal-overlay",l.className="modal-backdrop-timio",d||document.body.appendChild(l),requestAnimationFrame(()=>l.classList.add("visible")),document.body.classList.add("modal-open-timio")},x=()=>{const e=document.getElementById("entry-modal");if(!e)return;e.style.display="none",e.classList.remove("show");const n=document.getElementById("modal-overlay");n&&(n.classList.remove("visible"),setTimeout(()=>n.remove(),200)),document.body.classList.remove("modal-open-timio")},G=()=>{const e=document.getElementById("modal-close"),n=document.getElementById("modal-cancel"),o=document.getElementById("entry-modal"),a=document.getElementById("entry-form");e&&(e.onclick=x),n&&(n.onclick=x),o&&(o.onclick=t=>{t.target===o&&x()}),a&&(a.onsubmit=t=>{t.preventDefault();const s=document.getElementById("form-client").value.trim(),c=document.getElementById("form-date").value,i=parseFloat(document.getElementById("form-hours").value)||0,d=parseFloat(document.getElementById("form-rate").value)||0,l=document.getElementById("form-description").value,p=new Date(c).getTime()||Date.now();!s||!c||(E?g=g.map(m=>m.id===E?{...m,client:s,date:c,hours:i,rate:d,description:l,timestamp:p}:m):g=[{id:D(),client:s,date:c,hours:i,rate:d,description:l,timestamp:p},...g],x(),h())})},V=()=>{const{filtered:e}=b(),o=[["Fecha","Cliente","Horas","Tarifa/Hora","Total","Descripción"].join(","),...e.map(s=>[s.date,`"${s.client}"`,s.hours,s.rate,s.hours*s.rate,`"${s.description}"`].join(","))].join(`
`),a=new Blob([o],{type:"text/csv;charset=utf-8;"}),t=document.createElement("a");t.href=URL.createObjectURL(a),t.download=`timio_export_${new Date().toISOString().split("T")[0]}.csv`,t.click()},K=async()=>{var i,d;const{filtered:e,stats:n}=b(),o=["Cliente","Descripción","Fecha","Horas","Tarifa/Hora","Total"],a=e.map(l=>[u(l.client),u(l.description),u(l.date),String(l.hours),String(l.rate),(l.hours*l.rate).toFixed(2)]),t=["Totales","","",n.totalHours.toFixed(2),"",n.totalEarnings.toFixed(2)],s=[o,...a,t].map(l=>l.join("	")).join(`
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
          ${o.map(l=>`<th>${l}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${a.map(l=>`
          <tr>
            ${l.map((p,m)=>`<td class="${m>=3?"text-right":"text-left"}">${p}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
      <tfoot>
        <tr class="export-total-row">
          ${t.map((l,p)=>`<td class="${p>=3?"text-right":"text-left"}">${l}</td>`).join("")}
        </tr>
      </tfoot>
    </table>
  `;try{if((i=navigator.clipboard)!=null&&i.write){const l=new ClipboardItem({"text/html":new Blob([c],{type:"text/html"}),"text/plain":new Blob([s],{type:"text/plain"})});await navigator.clipboard.write([l]);return}}catch(l){console.warn("Clipboard HTML write failed, falling back to text",l)}if((d=navigator.clipboard)!=null&&d.writeText)await navigator.clipboard.writeText(s);else{const l=document.createElement("textarea");l.value=s,document.body.appendChild(l),l.select(),document.execCommand("copy"),document.body.removeChild(l)}},Q=(e,n="default")=>{const o=document.getElementById("toast-inline");o&&o.remove();const a=document.createElement("div");a.id="toast-inline",a.className=`toast-inline ${n==="success"?"toast-inline--success":""}`,a.textContent=e,document.body.appendChild(a),setTimeout(()=>a.remove(),2500)},Y=()=>{const{filtered:e,stats:n}=b(),o=e.map(s=>`
    <tr>
      <td>${u(s.date)}</td>
      <td>${u(s.client)}</td>
      <td class="text-end">${u(s.hours)}</td>
      <td class="text-end">$${u(s.rate)}</td>
      <td class="text-end">$${(s.hours*s.rate).toFixed(2)}</td>
      <td>${u(s.description)}</td>
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
            ${o||'<tr><td colspan="6" class="text-center">Sin registros</td></tr>'}
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
  `,t=window.open("","_blank","width=1200,height=900");if(!t){alert("No se pudo abrir la ventana de impresión. Revisa bloqueadores de pop-ups.");return}t.document.write(a),t.document.close(),t.focus(),t.print(),t.close()},J=e=>{var t;const n=e.target,o=(t=n.files)==null?void 0:t[0];if(!o)return;const a=new FileReader;a.onload=()=>{alert(`Archivo "${o.name}" cargado. (Simulación: se añaden 2 registros)`),g=[...[{id:D(),client:"Importado Inc",date:"2023-12-01",hours:4,rate:45,description:"Datos importados",timestamp:new Date("2023-12-01").getTime()},{id:D(),client:"Importado Inc",date:"2023-12-02",hours:2,rate:45,description:"Datos importados vol 2",timestamp:new Date("2023-12-02").getTime()}],...g],h()},a.readAsText(o),n.value=""},W=async()=>{const e=document.getElementById("ai-output");if(!e)return;const{filtered:n,stats:o}=b();if(!n.length){e.textContent="No hay datos para analizar.";return}e.textContent="Analizando...",setTimeout(()=>{const a=n.reduce((s,c)=>(s[c.client]=(s[c.client]||0)+c.hours*c.rate,s),{}),t=Object.entries(a).sort((s,c)=>c[1]-s[1])[0];e.innerHTML=`
      <ul class="mb-0">
        <li>Facturación total: <strong>$${o.totalEarnings.toFixed(2)}</strong></li>
        <li>Horas registradas: <strong>${o.totalHours}h</strong></li>
        ${t?`<li>Cliente más rentable: <strong>${u(t[0])}</strong> ($${t[1].toFixed(2)})</li>`:""}
        <li>Tip retro: bloquea sesiones de 90 minutos y toma breaks cortos.</li>
      </ul>
    `},400)},h=()=>{z(),q(),R(),_()},X=()=>{A(y),h(),U(),G(),N()};document.addEventListener("DOMContentLoaded",X);
