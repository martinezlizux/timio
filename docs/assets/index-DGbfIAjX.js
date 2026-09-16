(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function a(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(e){if(e.ep)return;e.ep=!0;const i=a(e);fetch(e.href,i)}})();const P={es:{brand:{title:"Timio",subtitle:"Tracker de horas",login:"Login"},hero:{pill:"Nuevo",title:"Controla tus horas trabajadas con Timio",description:"Registra, exporta y analiza tus proyectos en un solo lugar. Visualiza tus totales y obtén insights al instante.",alt:"Monstruo de Timio"},stats:{hours:"Total de horas",earnings:"Total facturado",entries:"Registros"},table:{title:"Mis horas",addDescription:"Agregar descripción",filter:"Filtrar",uploadFile:"Upload file",add:"Add",copy:"Copy",download:"Download",clientFilter:"Cliente",clientAll:"Todos",clientSelected:"{count} seleccionados",colClient:"Cliente",colDescription:"Descripción",colDate:"Fecha",colHours:"Horas",colRate:"Tarifa",colTotal:"Total",colActions:"Acciones",btnEdit:"Editar",btnDelete:"Borrar",emptyTitle:"No tienes ninguna hora registrada",summaryRecords:"Registros: {count}",noFilters:"Sin filtros aplicados",dateRange:"Fechas: {start} → {end}",clientFilterBadge:"Cliente: {client}"},analytics:{clientDist:"Distribución por cliente",incomeSubtitle:"Ingresos",clientsCount:"{count} clientes",aiTitle:"Insights AI",aiBtn:"Analizar con AI",aiEmpty:'Sin análisis. Haz clic en "Analizar con AI".',aiAnalyzing:"Analizando...",aiTotalBilled:"Facturación total:",aiLoggedHours:"Horas registradas:",aiTopClient:"Cliente más rentable:",aiTip:"Tip retro: bloquea sesiones de 90 minutos y toma breaks cortos.",aiNoData:"No hay datos para analizar."},modal:{newTitle:"Nueva entrada",editTitle:"Editar entrada",labelClient:"Cliente",placeholderClient:"Ej. Acme Corp",labelDate:"Fecha",labelHours:"Horas",labelRate:"Tarifa/Hora",labelDescription:"Descripción",placeholderDescription:"Escribe una descripción del trabajo realizado...",btnCancel:"Cancelar",btnSave:"Guardar",btnSaveEdit:"Guardar cambios"},messages:{tableCopied:"Tabla copiada",confirmDelete:"¿Eliminar este registro?",fileUploaded:'Archivo "{fileName}" cargado. (Simulación: se añaden 2 registros)'}},en:{brand:{title:"Timio",subtitle:"Time tracker",login:"Login"},hero:{pill:"New",title:"Track your worked hours with Timio",description:"Log, export, and analyze your projects all in one place. View your totals and get insights instantly.",alt:"Timio monster mascot"},stats:{hours:"Total hours",earnings:"Total billed",entries:"Entries"},table:{title:"My hours",addDescription:"Add a description",filter:"Filter",uploadFile:"Upload file",add:"Add",copy:"Copy",download:"Download",clientFilter:"Client",clientAll:"All",clientSelected:"{count} selected",colClient:"Client",colDescription:"Description",colDate:"Date",colHours:"Hours",colRate:"Rate",colTotal:"Total",colActions:"Actions",btnEdit:"Edit",btnDelete:"Delete",emptyTitle:"No logged hours found",summaryRecords:"Entries: {count}",noFilters:"No filters applied",dateRange:"Dates: {start} → {end}",clientFilterBadge:"Client: {client}"},analytics:{clientDist:"Client Distribution",incomeSubtitle:"Earnings",clientsCount:"{count} clients",aiTitle:"AI Insights",aiBtn:"Analyze with AI",aiEmpty:'No analysis yet. Click "Analyze with AI".',aiAnalyzing:"Analyzing...",aiTotalBilled:"Total earnings:",aiLoggedHours:"Logged hours:",aiTopClient:"Top profitable client:",aiTip:"Productivity tip: block 90-minute focus sessions and take short breaks.",aiNoData:"No data to analyze."},modal:{newTitle:"New entry",editTitle:"Edit entry",labelClient:"Client",placeholderClient:"e.g. Acme Corp",labelDate:"Date",labelHours:"Hours",labelRate:"Rate/Hour",labelDescription:"Description",placeholderDescription:"Write a description of the work done...",btnCancel:"Cancel",btnSave:"Save",btnSaveEdit:"Save changes"},messages:{tableCopied:"Table copied",confirmDelete:"Delete this entry?",fileUploaded:'File "{fileName}" uploaded. (Simulation: 2 entries added)'}}},S="timio_lang",q=()=>{const t=localStorage.getItem(S);return t==="es"||t==="en"?t:navigator.language.slice(0,2).toLowerCase()==="es"?"es":"en"};let E=q();const O=t=>{E=t,localStorage.setItem(S,t),document.documentElement.lang=t},d=(t,n)=>{const a=t.split(".");let o=P[E];for(const e of a)if(o&&typeof o=="object"&&e in o)o=o[e];else return t;return typeof o!="string"?t:n?Object.entries(n).reduce((e,[i,c])=>e.replace(new RegExp(`\\{${i}\\}`,"g"),String(c)),o):o},U={bg:"#F8FAFC",text:"#0F172A",primary:"#9333EA",secondary:"#BEF264",accent:"#E9D5FF",muted:"#64748B"},I=t=>t.toISOString().split("T")[0],k=t=>{const n=new Date;return n.setDate(n.getDate()-t),{date:I(n),timestamp:n.getTime()}},A=k(12),F=k(5),B=k(2),_=[{id:"1",client:"Acme Corp",date:A.date,hours:5,rate:50,description:"Diseño de landing page",timestamp:A.timestamp},{id:"2",client:"Globex",date:F.date,hours:3.5,rate:60,description:"Consultoría React",timestamp:F.timestamp},{id:"3",client:"Acme Corp",date:B.date,hours:8,rate:50,description:"Desarrollo Backend",timestamp:B.timestamp}];let y=[..._];const H=()=>{const t=new Date,n=new Date;return n.setDate(n.getDate()-30),{startDate:I(n),endDate:I(t)}};let r={...H(),clients:[]},w=null,b={...U};const N=()=>{document.documentElement.lang=E,document.querySelectorAll("[data-i18n]").forEach(t=>{const n=t.dataset.i18n;n&&(t.textContent=d(n))}),document.querySelectorAll("[data-i18n-placeholder]").forEach(t=>{const n=t.dataset.i18nPlaceholder;n&&(t.placeholder=d(n))}),document.querySelectorAll("[data-i18n-alt]").forEach(t=>{const n=t.dataset.i18nAlt;n&&(t.alt=d(n))}),document.querySelectorAll(".btn-lang-item").forEach(t=>{t.dataset.lang===E?t.classList.add("active"):t.classList.remove("active")})},R=t=>{const n=document.documentElement;n.style.setProperty("--timio-bg",t.bg),n.style.setProperty("--timio-text",t.text),n.style.setProperty("--timio-primary",t.primary),n.style.setProperty("--timio-secondary",t.secondary),n.style.setProperty("--timio-accent",t.accent),n.style.setProperty("--timio-muted",t.muted)},$=()=>Math.random().toString(36).slice(2,9),x=()=>{const t=y.filter(o=>{const e=r.clients.length?r.clients.includes(o.client):!0,i=r.startDate?new Date(`${r.startDate}T00:00:00`).getTime():Number.NEGATIVE_INFINITY,c=r.endDate?new Date(`${r.endDate}T23:59:59`).getTime():Number.POSITIVE_INFINITY,s=o.timestamp>=i&&o.timestamp<=c;return e&&s}).sort((o,e)=>e.timestamp-o.timestamp),n=t.reduce((o,e)=>o+e.hours,0),a=t.reduce((o,e)=>o+e.hours*e.rate,0);return{filtered:t,stats:{totalHours:n,totalEarnings:a}}},g=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),T=()=>{document.querySelectorAll(".filter-dropdown .dropdown-menu.show").forEach(t=>t.classList.remove("show")),document.querySelectorAll(".filter-dropdown .dropdown-toggle").forEach(t=>t.setAttribute("aria-expanded","false"))};let L=!1;const M=()=>{L||(document.addEventListener("click",()=>T()),L=!0)},G=()=>{const t=document.getElementById("btn-toggle-filters"),n=document.getElementById("s-filtros-aplicados");t&&n&&t.addEventListener("click",e=>{e.stopPropagation(),n.classList.toggle("d-none"),n.classList.contains("d-none")&&T()});const a=document.getElementById("filter-client-toggle"),o=document.getElementById("filter-client-menu");a&&o&&(a.addEventListener("click",e=>{e.stopPropagation(),T(),o.classList.toggle("show"),a.setAttribute("aria-expanded",o.classList.contains("show")?"true":"false")}),o.addEventListener("click",e=>e.stopPropagation()),M())},V=()=>{const t=document.getElementById("s-filtros-aplicados");if(!t)return;const n=[];(r.startDate||r.endDate)&&n.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="time">
        <span class="small">${d("table.dateRange",{start:r.startDate||"...",end:r.endDate||"..."})}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove="time" aria-label="Quitar filtro de fechas">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `),r.clients.forEach(a=>{n.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="client-${a}">
        <span class="small">${d("table.clientFilterBadge",{client:g(a)})}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove-client="${g(a)}" aria-label="Quitar cliente ${g(a)}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `)}),n.length?(t.innerHTML=n.join(""),t.querySelectorAll('[data-remove="time"]').forEach(a=>{a.addEventListener("click",()=>{r={...r,...H()},h()})}),t.querySelectorAll("[data-remove-client]").forEach(a=>{a.addEventListener("click",()=>{const o=a.dataset.removeClient;r.clients=r.clients.filter(e=>e!==o),h()})})):t.innerHTML=`<span class="text-muted small">${d("table.noFilters")}</span>`},K=()=>{const t=document.getElementById("filter-start"),n=document.getElementById("filter-end"),a=document.getElementById("filter-client-menu"),o=document.getElementById("filter-client-label");if(!t||!n||!a)return;t.value=r.startDate,n.value=r.endDate;const e=Array.from(new Set(y.map(s=>s.client)));r.clients=r.clients.filter(s=>e.includes(s)),a.innerHTML=`
    <div class="form-check mb-2">
      <input class="form-check-input" type="checkbox" id="client-all" ${r.clients.length===0?"checked":""}>
      <label class="form-check-label" for="client-all">${d("table.clientAll")}</label>
    </div>
    ${e.map(s=>`
      <div class="form-check mb-1">
        <input class="form-check-input" type="checkbox" id="client-${s.toLowerCase().replace(/[^a-z0-9]+/g,"-")||"item"}" value="${g(s)}" ${r.clients.includes(s)?"checked":""}>
        <label class="form-check-label" for="client-${s.toLowerCase().replace(/[^a-z0-9]+/g,"-")||"item"}">${g(s)}</label>
      </div>
    `).join("")}
  `,o&&(r.clients.length===0?o.textContent=d("table.clientAll"):r.clients.length===1?o.textContent=r.clients[0]:o.textContent=d("table.clientSelected",{count:r.clients.length})),t.onchange=s=>{const u=s.target.value;r.startDate=u,r.endDate&&r.startDate>r.endDate&&(r.endDate=r.startDate),h()},n.onchange=s=>{const u=s.target.value;r.endDate=u,r.startDate&&r.startDate>r.endDate&&(r.startDate=r.endDate),h()};const i=document.getElementById("client-all");i&&(i.onchange=s=>{s.target.checked&&(r.clients=[],h())}),a.querySelectorAll('input[type="checkbox"]').forEach(s=>{s.id!=="client-all"&&(s.onchange=u=>{const l=u.target.value;u.target.checked?r.clients=Array.from(new Set([...r.clients,l])):r.clients=r.clients.filter(m=>m!==l),i&&(i.checked=r.clients.length===0),h()})}),[{buttonId:"filter-client-toggle",menuId:"filter-client-menu"}].forEach(({buttonId:s,menuId:u})=>{const l=document.getElementById(s),m=document.getElementById(u);!l||!m||(l.onclick=p=>{p.stopPropagation(),T(),m.classList.toggle("show"),l.setAttribute("aria-expanded",m.classList.contains("show")?"true":"false")},m.onclick=p=>p.stopPropagation())}),M(),V()},Y=()=>{const{filtered:t,stats:n}=x(),a=document.getElementById("entries-body"),o=document.getElementById("entries-foot");!a||!o||(t.length?a.innerHTML=t.map(e=>`
      <tr>
        <td><span class="badge-chip">${g(e.client)}</span></td>
        <td>${g(e.description)}</td>
        <td>${new Date(e.date).toLocaleDateString()}</td>
        <td class="text-end">${e.hours}</td>
        <td class="text-end">$${e.rate}</td>
        <td class="text-end">$${(e.hours*e.rate).toFixed(2)}</td>
        <td class="text-end">
          <div class="entry-actions">
            <button class="btn btn-link-primary btn-sm" data-edit="${e.id}">
              <i class="fa-solid fa-pen-to-square me-1"></i> ${d("table.btnEdit")}
            </button>
            <button class="btn btn-link-danger btn-sm" data-delete="${e.id}">
              <i class="fa-solid fa-trash-can me-1"></i> ${d("table.btnDelete")}
            </button>
          </div>
        </td>
      </tr>
    `).join(""):a.innerHTML=`
      <tr>
        <td colspan="7" class="text-center py-4">
          <div class="empty-placeholder mx-auto">
            <svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label="${d("table.emptyTitle")}">
              <rect x="24" y="36" width="152" height="112" rx="12" fill="#F7F5FC" stroke="#C7B8F4" stroke-width="3" />
              <rect x="40" y="56" width="72" height="12" rx="6" fill="#C7B8F4" opacity="0.8" />
              <rect x="40" y="78" width="104" height="12" rx="6" fill="#D4F26A" opacity="0.5" />
              <rect x="40" y="100" width="88" height="12" rx="6" fill="#F28C24" opacity="0.4" />
              <rect x="40" y="122" width="48" height="12" rx="6" fill="#4ECDC4" opacity="0.5" />
              <circle cx="158" cy="150" r="18" fill="#F1EEF6" stroke="#C7B8F4" stroke-width="3" />
              <path d="M152 150l8 8 12-16" stroke="#6F5ACF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            <div class="fw-semibold">${d("table.emptyTitle")}</div>
          </div>
        </td>
      </tr>
    `,o.innerHTML=`
    <tr class="summary-row">
      <td colspan="2">${d("table.summaryRecords",{count:t.length})}</td>
      <td></td>
      <td class="text-end">${n.totalHours}h</td>
      <td></td>
      <td class="text-end">$${n.totalEarnings.toFixed(2)}</td>
      <td></td>
    </tr>
  `,a.querySelectorAll("[data-edit]").forEach(e=>{e.addEventListener("click",()=>{const i=e.getAttribute("data-edit");if(!i)return;const c=y.find(s=>s.id===i);c&&j(c)})}),a.querySelectorAll("[data-delete]").forEach(e=>{e.addEventListener("click",()=>{const i=e.getAttribute("data-delete");i&&confirm(d("messages.confirmDelete"))&&(y=y.filter(c=>c.id!==i),h())})}))},Q=()=>{const{stats:t,filtered:n}=x(),a=document.getElementById("stat-hours"),o=document.getElementById("stat-earnings"),e=document.getElementById("stat-count");a&&(a.textContent=`${t.totalHours}h`),o&&(o.textContent=`$${t.totalEarnings.toFixed(2)}`),e&&(e.textContent=`${n.length}`)},W=()=>{const{filtered:t}=x(),n=document.getElementById("pie-chart"),a=document.getElementById("pie-legend");if(!n||!a)return;if(!t.length){n.innerHTML='<div class="text-muted small">Sin datos</div>',a.innerHTML="";return}const o=t.reduce((p,f)=>(p[f.client]=(p[f.client]||0)+f.hours*f.rate,p),{}),e=Object.entries(o).sort((p,f)=>f[1]-p[1]),i=e.reduce((p,[,f])=>p+f,0),c=[b.primary,b.secondary,"#FF9F1C","#FF5F5F","#4ECDC4","#1A535C"],s=90,u=2*Math.PI*s;let l=0;const m=e.map(([p,f],D)=>{const C=f/i*u,z=`<circle r="${s}" cx="120" cy="120" fill="transparent"
        stroke="${c[D%c.length]}"
        stroke-width="24"
        stroke-dasharray="${C} ${u-C}"
        stroke-dashoffset="${-l}"
        transform="rotate(-90 120 120)" />`;return l+=C,z}).join("");n.innerHTML=`
    <svg width="240" height="240" viewBox="0 0 240 240">
      <circle r="${s}" cx="120" cy="120" fill="transparent" stroke="#f1f3f5" stroke-width="24" />
      ${m}
      <text x="120" y="125" text-anchor="middle" font-size="14" fill="${b.primary}" font-weight="700">${d("analytics.clientsCount",{count:e.length})}</text>
    </svg>
  `,a.innerHTML=e.map(([p,f],D)=>`
    <div class="d-flex align-items-center gap-2 mb-1">
      <span class="legend-color-dot chart-color-${D%6}"></span>
      <span>${g(p)}</span>
      <span class="ms-auto fw-bold">$${f.toFixed(2)}</span>
    </div>
  `).join("")},J=()=>{document.querySelectorAll(".btn-lang-item").forEach(l=>{l.onclick=()=>{const m=l.dataset.lang;m&&m!==E&&(O(m),N(),h())}});const t=document.getElementById("btn-new");t&&(t.onclick=()=>j());const n=document.getElementById("btn-export-csv");n&&(n.onclick=Z);const a=document.getElementById("btn-copy");a&&(a.onclick=()=>{tt().then(()=>et(d("messages.tableCopied"),"success"))});const o=document.getElementById("btn-export-pdf");o&&(o.onclick=nt);const e=document.getElementById("file-upload");e&&(e.onchange=ot);const i=document.getElementById("btn-analyze");i&&(i.onclick=at);const c=document.getElementById("btn-theme-panel"),s=document.getElementById("theme-panel"),u=document.getElementById("theme-close");c&&s&&(c.onclick=()=>{s.style.display="block"}),u&&s&&(u.onclick=()=>{s.style.display="none"}),s&&s.querySelectorAll("input[data-theme-key]").forEach(l=>{l.addEventListener("input",m=>{const p=m.target.dataset.themeKey,f=m.target.value;b={...b,[p]:f},R(b),h()})})},j=t=>{const n=document.getElementById("entry-modal");if(!n)return;const a=document.getElementById("modal-title"),o=document.getElementById("modal-submit"),e=document.getElementById("form-client"),i=document.getElementById("form-date"),c=document.getElementById("form-hours"),s=document.getElementById("form-rate"),u=document.getElementById("form-description");t?(w=t.id,a&&(a.textContent=d("modal.editTitle")),o&&(o.textContent=d("modal.btnSaveEdit")),e.value=t.client,i.value=t.date,c.value=t.hours.toString(),s.value=t.rate.toString(),u.value=t.description):(w=null,a&&(a.textContent=d("modal.newTitle")),o&&(o.textContent=d("modal.btnSave")),e.value="",i.value=new Date().toISOString().split("T")[0],c.value="0",s.value="0",u.value=""),n.classList.remove("d-none"),n.style.display="block",n.classList.add("show");const l=document.getElementById("modal-overlay"),m=l||document.createElement("div");m.id="modal-overlay",m.className="modal-backdrop-timio",l||document.body.appendChild(m),requestAnimationFrame(()=>m.classList.add("visible")),document.body.classList.add("modal-open-timio")},v=()=>{const t=document.getElementById("entry-modal");if(!t)return;t.style.display="none",t.classList.remove("show");const n=document.getElementById("modal-overlay");n&&(n.classList.remove("visible"),setTimeout(()=>n.remove(),200)),document.body.classList.remove("modal-open-timio")},X=()=>{const t=document.getElementById("modal-close"),n=document.getElementById("modal-cancel"),a=document.getElementById("entry-modal"),o=document.getElementById("entry-form");t&&(t.onclick=v),n&&(n.onclick=v),a&&(a.onclick=e=>{e.target===a&&v()}),o&&(o.onsubmit=e=>{e.preventDefault();const i=document.getElementById("form-client").value.trim(),c=document.getElementById("form-date").value,s=parseFloat(document.getElementById("form-hours").value)||0,u=parseFloat(document.getElementById("form-rate").value)||0,l=document.getElementById("form-description").value,m=new Date(c).getTime()||Date.now();!i||!c||(w?y=y.map(p=>p.id===w?{...p,client:i,date:c,hours:s,rate:u,description:l,timestamp:m}:p):y=[{id:$(),client:i,date:c,hours:s,rate:u,description:l,timestamp:m},...y],v(),h())})},Z=()=>{const{filtered:t}=x(),a=[["Fecha","Cliente","Horas","Tarifa/Hora","Total","Descripción"].join(","),...t.map(i=>[i.date,`"${i.client}"`,i.hours,i.rate,i.hours*i.rate,`"${i.description}"`].join(","))].join(`
`),o=new Blob([a],{type:"text/csv;charset=utf-8;"}),e=document.createElement("a");e.href=URL.createObjectURL(o),e.download=`timio_export_${new Date().toISOString().split("T")[0]}.csv`,e.click()},tt=async()=>{var s,u;const{filtered:t,stats:n}=x(),a=["Cliente","Descripción","Fecha","Horas","Tarifa/Hora","Total"],o=t.map(l=>[g(l.client),g(l.description),g(l.date),String(l.hours),String(l.rate),(l.hours*l.rate).toFixed(2)]),e=["Totales","","",n.totalHours.toFixed(2),"",n.totalEarnings.toFixed(2)],i=[a,...o,e].map(l=>l.join("	")).join(`
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
          ${a.map(l=>`<th>${l}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${o.map(l=>`
          <tr>
            ${l.map((m,p)=>`<td class="${p>=3?"text-right":"text-left"}">${m}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
      <tfoot>
        <tr class="export-total-row">
          ${e.map((l,m)=>`<td class="${m>=3?"text-right":"text-left"}">${l}</td>`).join("")}
        </tr>
      </tfoot>
    </table>
  `;try{if((s=navigator.clipboard)!=null&&s.write){const l=new ClipboardItem({"text/html":new Blob([c],{type:"text/html"}),"text/plain":new Blob([i],{type:"text/plain"})});await navigator.clipboard.write([l]);return}}catch(l){console.warn("Clipboard HTML write failed, falling back to text",l)}if((u=navigator.clipboard)!=null&&u.writeText)await navigator.clipboard.writeText(i);else{const l=document.createElement("textarea");l.value=i,document.body.appendChild(l),l.select(),document.execCommand("copy"),document.body.removeChild(l)}},et=(t,n="default")=>{const a=document.getElementById("toast-inline");a&&a.remove();const o=document.createElement("div");o.id="toast-inline",o.className=`toast-inline ${n==="success"?"toast-inline--success":""}`,o.textContent=t,document.body.appendChild(o),setTimeout(()=>o.remove(),2500)},nt=()=>{const{filtered:t,stats:n}=x(),a=t.map(i=>`
    <tr>
      <td>${g(i.date)}</td>
      <td>${g(i.client)}</td>
      <td class="text-end">${g(i.hours)}</td>
      <td class="text-end">$${g(i.rate)}</td>
      <td class="text-end">$${(i.hours*i.rate).toFixed(2)}</td>
      <td>${g(i.description)}</td>
    </tr>
  `).join(""),o=`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Timio - Export PDF</title>
        <style>
          body { font-family: 'Inter', sans-serif; margin: 32px; color: ${b.text}; }
          h1 { margin: 0 0 16px; color: ${b.primary}; }
          table { width: 100%; border-collapse: collapse; font-size: 14px; }
          th, td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
          th { text-align: left; background: #f3f4f6; text-transform: uppercase; letter-spacing: 0.06em; font-size: 12px; color: ${b.primary}; }
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
            ${a||'<tr><td colspan="6" class="text-center">Sin registros</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Registros: ${t.length}</td>
              <td class="text-end">${n.totalHours}h</td>
              <td></td>
              <td class="text-end">$${n.totalEarnings.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `,e=window.open("","_blank","width=1200,height=900");if(!e){alert("No se pudo abrir la ventana de impresión. Revisa bloqueadores de pop-ups.");return}e.document.write(o),e.document.close(),e.focus(),e.print(),e.close()},ot=t=>{var e;const n=t.target,a=(e=n.files)==null?void 0:e[0];if(!a)return;const o=new FileReader;o.onload=()=>{alert(d("messages.fileUploaded",{fileName:a.name})),y=[...[{id:$(),client:"Importado Inc",date:"2023-12-01",hours:4,rate:45,description:"Datos importados",timestamp:new Date("2023-12-01").getTime()},{id:$(),client:"Importado Inc",date:"2023-12-02",hours:2,rate:45,description:"Datos importados vol 2",timestamp:new Date("2023-12-02").getTime()}],...y],h()},o.readAsText(a),n.value=""},at=async()=>{const t=document.getElementById("ai-output");if(!t)return;const{filtered:n,stats:a}=x();if(!n.length){t.textContent=d("analytics.aiNoData");return}t.textContent=d("analytics.aiAnalyzing"),setTimeout(()=>{const o=n.reduce((i,c)=>(i[c.client]=(i[c.client]||0)+c.hours*c.rate,i),{}),e=Object.entries(o).sort((i,c)=>c[1]-i[1])[0];t.innerHTML=`
      <ul class="mb-0">
        <li>${d("analytics.aiTotalBilled")} <strong>$${a.totalEarnings.toFixed(2)}</strong></li>
        <li>${d("analytics.aiLoggedHours")} <strong>${a.totalHours}h</strong></li>
        ${e?`<li>${d("analytics.aiTopClient")} <strong>${g(e[0])}</strong> ($${e[1].toFixed(2)})</li>`:""}
        <li>${d("analytics.aiTip")}</li>
      </ul>
    `},400)},h=()=>{Q(),K(),Y(),W()},it=()=>{R(b),N(),h(),J(),X(),G()};document.addEventListener("DOMContentLoaded",it);
