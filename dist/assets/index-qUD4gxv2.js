(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const a of e.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function r(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function s(t){if(t.ep)return;t.ep=!0;const e=r(t);fetch(t.href,e)}})();const C={bg:"#B8B8FF",text:"#1F1A3D",primary:"#1F1A3D",secondary:"#D4E72C",accent:"#E0E0FF",muted:"#FEFEF0"},T=[{id:"1",client:"Acme Corp",date:"2023-10-05",hours:5,rate:50,description:"Diseño de landing page",timestamp:16964832e5},{id:"2",client:"Globex",date:"2023-10-12",hours:3.5,rate:60,description:"Consultoría React",timestamp:1697088e6},{id:"3",client:"Acme Corp",date:"2023-11-01",hours:8,rate:50,description:"Desarrollo Backend",timestamp:1698816e6}];let p=[...T],i={month:"",startDate:"",endDate:"",client:""},y="month",$=null,g={...C};const D=n=>{const o=document.documentElement;o.style.setProperty("--timio-bg",n.bg),o.style.setProperty("--timio-text",n.text),o.style.setProperty("--timio-primary",n.primary),o.style.setProperty("--timio-secondary",n.secondary),o.style.setProperty("--timio-accent",n.accent),o.style.setProperty("--timio-muted",n.muted)},B=()=>Math.random().toString(36).slice(2,9),b=()=>{const n=p.filter(s=>{const t=i.client?s.client===i.client:!0;let e=!0;return y==="month"&&i.month?e=s.date.startsWith(i.month):y==="day"&&i.startDate?e=s.date===i.startDate:y==="range"&&i.startDate&&i.endDate&&(e=s.date>=i.startDate&&s.date<=i.endDate),t&&e}).sort((s,t)=>t.date.localeCompare(s.date)),o=n.reduce((s,t)=>s+t.hours,0),r=n.reduce((s,t)=>s+t.hours*t.rate,0);return{filtered:n,stats:{totalHours:o,totalEarnings:r}}},f=n=>String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),L=()=>{b();const n=document.getElementById("filter-client");if(!n)return;const o=Array.from(new Set(p.map(t=>t.client)));n.innerHTML='<option value="">Todos</option>'+o.map(t=>`<option value="${f(t)}">${f(t)}</option>`).join(""),n.value=i.client;const r=document.getElementById("date-inputs");if(!r)return;if(y==="month"?r.innerHTML=`<input id="filter-month" type="month" class="form-control form-control-sm" value="${i.month}" />`:y==="day"?r.innerHTML=`<input id="filter-day" type="date" class="form-control form-control-sm" value="${i.startDate}" />`:r.innerHTML=`
      <input id="filter-start" type="date" class="form-control form-control-sm" value="${i.startDate}" />
      <input id="filter-end" type="date" class="form-control form-control-sm" value="${i.endDate}" />
    `,Object.entries({"btn-mode-month":"month","btn-mode-day":"day","btn-mode-range":"range"}).forEach(([t,e])=>{const a=document.getElementById(t);a&&a.classList.toggle("active",y===e)}),n.onchange=t=>{i.client=t.target.value,u()},y==="month"){const t=document.getElementById("filter-month");t&&(t.onchange=e=>{i.month=e.target.value,u()})}else if(y==="day"){const t=document.getElementById("filter-day");t&&(t.onchange=e=>{const a=e.target.value;i.startDate=a,i.endDate=a,u()})}else{const t=document.getElementById("filter-start"),e=document.getElementById("filter-end");t&&(t.onchange=a=>{i.startDate=a.target.value,u()}),e&&(e.onchange=a=>{i.endDate=a.target.value,u()})}},k=()=>{const{filtered:n,stats:o}=b(),r=document.getElementById("entries-body"),s=document.getElementById("entries-foot");!r||!s||(n.length?r.innerHTML=n.map(t=>`
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
    `).join(""):r.innerHTML='<tr><td colspan="7" class="text-center text-muted py-4">No hay registros</td></tr>',s.innerHTML=`
    <tr class="summary-row">
      <td colspan="2">Registros: ${n.length}</td>
      <td></td>
      <td class="text-end">${o.totalHours}h</td>
      <td></td>
      <td class="text-end">$${o.totalEarnings.toFixed(2)}</td>
      <td></td>
    </tr>
  `,r.querySelectorAll("[data-edit]").forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-edit");if(!e)return;const a=p.find(c=>c.id===e);a&&F(a)})}),r.querySelectorAll("[data-delete]").forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-delete");e&&confirm("¿Eliminar este registro?")&&(p=p.filter(a=>a.id!==e),u())})}))},H=()=>{const{stats:n,filtered:o}=b(),r=document.getElementById("stat-hours"),s=document.getElementById("stat-earnings"),t=document.getElementById("stat-count");r&&(r.textContent=`${n.totalHours}h`),s&&(s.textContent=`$${n.totalEarnings.toFixed(2)}`),t&&(t.textContent=`${o.length}`)},A=()=>{const{filtered:n}=b(),o=document.getElementById("pie-chart"),r=document.getElementById("pie-legend");if(!o||!r)return;if(!n.length){o.innerHTML='<div class="text-muted small">Sin datos</div>',r.innerHTML="";return}const s=n.reduce((d,l)=>(d[l.client]=(d[l.client]||0)+l.hours*l.rate,d),{}),t=Object.entries(s).sort((d,l)=>l[1]-d[1]),e=t.reduce((d,[,l])=>d+l,0),a=[g.primary,g.secondary,"#FF9F1C","#FF5F5F","#4ECDC4","#1A535C"],c=90,m=2*Math.PI*c;let h=0;const E=t.map(([d,l],x)=>{const I=l/e*m,w=`<circle r="${c}" cx="120" cy="120" fill="transparent"
        stroke="${a[x%a.length]}"
        stroke-width="24"
        stroke-dasharray="${I} ${m-I}"
        stroke-dashoffset="${-h}"
        transform="rotate(-90 120 120)" />`;return h+=I,w}).join("");o.innerHTML=`
    <svg width="240" height="240" viewBox="0 0 240 240">
      <circle r="${c}" cx="120" cy="120" fill="transparent" stroke="#f1f3f5" stroke-width="24" />
      ${E}
      <text x="120" y="125" text-anchor="middle" font-size="14" fill="${g.primary}" font-weight="700">${t.length} clientes</text>
    </svg>
  `,r.innerHTML=t.map(([d,l],x)=>`
    <div class="d-flex align-items-center gap-2 mb-1">
      <span class="rounded-circle d-inline-block" style="width:12px;height:12px;background:${a[x%a.length]};"></span>
      <span>${f(d)}</span>
      <span class="ms-auto fw-bold">$${l.toFixed(2)}</span>
    </div>
  `).join("")},M=()=>{const n=document.getElementById("btn-new");n&&(n.onclick=()=>F());const o=document.getElementById("btn-export-csv");o&&(o.onclick=P);const r=document.getElementById("btn-export-pdf");r&&(r.onclick=O);const s=document.getElementById("file-upload");s&&(s.onchange=j);const t=document.getElementById("btn-analyze");t&&(t.onclick=N);const e=document.getElementById("btn-clear-filters");e&&(e.onclick=()=>{i={month:"",startDate:"",endDate:"",client:""},u()}),Object.entries({"btn-mode-month":"month","btn-mode-day":"day","btn-mode-range":"range"}).forEach(([E,d])=>{const l=document.getElementById(E);l&&(l.onclick=()=>{y=d,u()})});const c=document.getElementById("btn-theme-panel"),m=document.getElementById("theme-panel"),h=document.getElementById("theme-close");c&&m&&(c.onclick=()=>{m.style.display="block"}),h&&m&&(h.onclick=()=>{m.style.display="none"}),m&&m.querySelectorAll("input[data-theme-key]").forEach(E=>{E.addEventListener("input",d=>{const l=d.target.dataset.themeKey,x=d.target.value;g={...g,[l]:x},D(g),u()})})},F=n=>{const o=document.getElementById("entry-modal");if(!o)return;const r=document.getElementById("modal-title"),s=document.getElementById("form-client"),t=document.getElementById("form-date"),e=document.getElementById("form-hours"),a=document.getElementById("form-rate"),c=document.getElementById("form-description");n?($=n.id,r&&(r.textContent="Editar entrada"),s.value=n.client,t.value=n.date,e.value=n.hours.toString(),a.value=n.rate.toString(),c.value=n.description):($=null,r&&(r.textContent="Nueva entrada"),s.value="",t.value=new Date().toISOString().split("T")[0],e.value="0",a.value="0",c.value=""),o.style.display="block",o.classList.add("show")},v=()=>{const n=document.getElementById("entry-modal");n&&(n.style.display="none",n.classList.remove("show"))},S=()=>{const n=document.getElementById("modal-close"),o=document.getElementById("modal-cancel"),r=document.getElementById("entry-form");n&&(n.onclick=v),o&&(o.onclick=v),r&&(r.onsubmit=s=>{s.preventDefault();const t=document.getElementById("form-client").value.trim(),e=document.getElementById("form-date").value,a=parseFloat(document.getElementById("form-hours").value)||0,c=parseFloat(document.getElementById("form-rate").value)||0,m=document.getElementById("form-description").value;!t||!e||($?p=p.map(h=>h.id===$?{...h,client:t,date:e,hours:a,rate:c,description:m,timestamp:Date.now()}:h):p=[{id:B(),client:t,date:e,hours:a,rate:c,description:m,timestamp:Date.now()},...p],v(),u())})},P=()=>{const{filtered:n}=b(),r=[["Fecha","Cliente","Horas","Tarifa/Hora","Total","Descripción"].join(","),...n.map(e=>[e.date,`"${e.client}"`,e.hours,e.rate,e.hours*e.rate,`"${e.description}"`].join(","))].join(`
`),s=new Blob([r],{type:"text/csv;charset=utf-8;"}),t=document.createElement("a");t.href=URL.createObjectURL(s),t.download=`timio_export_${new Date().toISOString().split("T")[0]}.csv`,t.click()},O=()=>{const{filtered:n,stats:o}=b(),r=n.map(e=>`
    <tr>
      <td>${f(e.date)}</td>
      <td>${f(e.client)}</td>
      <td style="text-align:right;">${f(e.hours)}</td>
      <td style="text-align:right;">$${f(e.rate)}</td>
      <td style="text-align:right;">$${(e.hours*e.rate).toFixed(2)}</td>
      <td>${f(e.description)}</td>
    </tr>
  `).join(""),s=`
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
            ${r||'<tr><td colspan="6" style="text-align:center;">Sin registros</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Registros: ${n.length}</td>
              <td style="text-align:right;">${o.totalHours}h</td>
              <td></td>
              <td style="text-align:right;">$${o.totalEarnings.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `,t=window.open("","_blank","width=1200,height=900");if(!t){alert("No se pudo abrir la ventana de impresión. Revisa bloqueadores de pop-ups.");return}t.document.write(s),t.document.close(),t.focus(),t.print(),t.close()},j=n=>{var t;const o=n.target,r=(t=o.files)==null?void 0:t[0];if(!r)return;const s=new FileReader;s.onload=()=>{alert(`Archivo "${r.name}" cargado. (Simulación: se añaden 2 registros)`),p=[...[{id:B(),client:"Importado Inc",date:"2023-12-01",hours:4,rate:45,description:"Datos importados",timestamp:Date.now()},{id:B(),client:"Importado Inc",date:"2023-12-02",hours:2,rate:45,description:"Datos importados vol 2",timestamp:Date.now()}],...p],u()},s.readAsText(r),o.value=""},N=async()=>{const n=document.getElementById("ai-output");if(!n)return;const{filtered:o,stats:r}=b();if(!o.length){n.textContent="No hay datos para analizar.";return}n.textContent="Analizando...",setTimeout(()=>{const s=o.reduce((e,a)=>(e[a.client]=(e[a.client]||0)+a.hours*a.rate,e),{}),t=Object.entries(s).sort((e,a)=>a[1]-e[1])[0];n.innerHTML=`
      <ul class="mb-0">
        <li>Facturación total: <strong>$${r.totalEarnings.toFixed(2)}</strong></li>
        <li>Horas registradas: <strong>${r.totalHours}h</strong></li>
        ${t?`<li>Cliente más rentable: <strong>${f(t[0])}</strong> ($${t[1].toFixed(2)})</li>`:""}
        <li>Tip retro: bloquea sesiones de 90 minutos y toma breaks cortos.</li>
      </ul>
    `},400)},u=()=>{H(),L(),k(),A()},R=()=>{D(g),u(),M(),S()};document.addEventListener("DOMContentLoaded",R);
