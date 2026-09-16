import './styles/main.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

type TimeEntry = {
  id: string;
  client: string;
  date: string;
  hours: number;
  rate: number;
  description: string;
  timestamp: number;
};

type FilterState = {
  startDate: string;
  endDate: string;
  clients: string[];
};

type ThemeColors = {
  bg: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
};

const DEFAULT_THEME: ThemeColors = {
  bg: '#F8FAFC',
  text: '#0F172A',
  primary: '#9333EA',
  secondary: '#BEF264',
  accent: '#E9D5FF',
  muted: '#64748B',
};

const formatDate = (d: Date) => d.toISOString().split('T')[0];
const getRelativeDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    date: formatDate(d),
    timestamp: d.getTime()
  };
};

const d1 = getRelativeDate(12);
const d2 = getRelativeDate(5);
const d3 = getRelativeDate(2);

const INITIAL_ENTRIES: TimeEntry[] = [
  { id: '1', client: 'Acme Corp', date: d1.date, hours: 5, rate: 50, description: 'Diseño de landing page', timestamp: d1.timestamp },
  { id: '2', client: 'Globex', date: d2.date, hours: 3.5, rate: 60, description: 'Consultoría React', timestamp: d2.timestamp },
  { id: '3', client: 'Acme Corp', date: d3.date, hours: 8, rate: 50, description: 'Desarrollo Backend', timestamp: d3.timestamp }
];

let entries: TimeEntry[] = [...INITIAL_ENTRIES];
const getDefaultDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return { startDate: formatDate(start), endDate: formatDate(end) };
};
let filter: FilterState = { ...getDefaultDateRange(), clients: [] };
let editingId: string | null = null;
let theme: ThemeColors = { ...DEFAULT_THEME };

const setCSSTheme = (t: ThemeColors) => {
  const root = document.documentElement;
  root.style.setProperty('--timio-bg', t.bg);
  root.style.setProperty('--timio-text', t.text);
  root.style.setProperty('--timio-primary', t.primary);
  root.style.setProperty('--timio-secondary', t.secondary);
  root.style.setProperty('--timio-accent', t.accent);
  root.style.setProperty('--timio-muted', t.muted);
};

const uid = () => Math.random().toString(36).slice(2, 9);

const getFilteredEntries = () => {
  const filtered = entries.filter(entry => {
    const matchClient = filter.clients.length ? filter.clients.includes(entry.client) : true;
    const startTs = filter.startDate ? new Date(`${filter.startDate}T00:00:00`).getTime() : Number.NEGATIVE_INFINITY;
    const endTs = filter.endDate ? new Date(`${filter.endDate}T23:59:59`).getTime() : Number.POSITIVE_INFINITY;
    const matchDate = entry.timestamp >= startTs && entry.timestamp <= endTs;
    return matchClient && matchDate;
  }).sort((a, b) => b.timestamp - a.timestamp);

  const totalHours = filtered.reduce((sum, e) => sum + e.hours, 0);
  const totalEarnings = filtered.reduce((sum, e) => sum + e.hours * e.rate, 0);
  return { filtered, stats: { totalHours, totalEarnings } };
};

const escapeHtml = (val: string | number) =>
  String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderLayout = () => {
  const root = document.getElementById('app');
  if (!root) return;

  root.innerHTML = `
    <div class="min-vh-100 timio-app p-3 p-md-4">
      <div class="container-lg">
        <header class="d-flex justify-content-between align-items-center mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold brand-avatar">T</div>
            <div>
              <h1 class="h4 mb-0 text-brand">Timio</h1>
              <small class="text-muted">Tracker de horas</small>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button id="btn-theme-panel" class="btn btn-outline-primary btn-sm">Tema</button>
            <button id="btn-login" class="btn btn-soft-primary btn-sm">Login</button>
          </div>
        </header>

        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <div class="card-soft p-3">
              <div class="text-muted text-uppercase small">Total horas</div>
              <div id="stat-hours" class="fs-3 fw-bold text-brand">0h</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card-soft p-3">
              <div class="text-muted text-uppercase small">Total facturado</div>
              <div id="stat-earnings" class="fs-3 fw-bold text-brand">$0.00</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card-soft p-3">
              <div class="text-muted text-uppercase small">Registros</div>
              <div id="stat-count" class="fs-3 fw-bold text-brand">0</div>
            </div>
          </div>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2 mb-3" id="filter-bar">
          <div class="d-flex align-items-center gap-2">
            <i class="fa-solid fa-filter text-muted"></i>
            <label class="text-muted small mb-0">Desde</label>
            <input id="filter-start" type="date" class="form-control form-control-sm" />
            <label class="text-muted small mb-0">Hasta</label>
            <input id="filter-end" type="date" class="form-control form-control-sm" />
          </div>
          <div class="dropdown filter-dropdown">
            <button id="filter-client-toggle" class="btn btn-outline-primary btn-sm dropdown-toggle" type="button" aria-expanded="false">
              Cliente: <span id="filter-client-label">Todos</span>
            </button>
            <div class="dropdown-menu shadow-sm p-3 dropdown-menu-client" id="filter-client-menu"></div>
          </div>
        </div>

        <div class="d-flex flex-wrap gap-2 mb-3">
          <button id="btn-new" class="btn btn-soft-primary"><i class="fa-solid fa-plus me-1"></i> Nueva entrada</button>
          <button id="btn-copy" class="btn btn-link-primary" title="Copiar tabla">
            <i class="fa-solid fa-copy me-1"></i> Copiar
          </button>
          <button id="btn-export-csv" class="btn btn-outline-primary btn-soft">
            <i class="fa-solid fa-file-export me-1"></i> Exportar CSV
          </button>
          <button id="btn-export-pdf" class="btn btn-outline-primary btn-soft">
            <i class="fa-solid fa-file-pdf me-1"></i> Exportar PDF
          </button>
          <label class="btn btn-outline-secondary btn-soft mb-0">
            <i class="fa-solid fa-file-import me-1"></i> Importar
            <input id="file-upload" type="file" accept=".csv,.xlsx" hidden />
          </label>
          <button id="btn-analyze" class="btn btn-outline-success btn-soft"><i class="fa-solid fa-wand-magic-sparkles me-1"></i> Analizar con AI</button>
        </div>

        <div class="card-soft mb-4">
          <div class="table-responsive">
            <table class="table table-timio mb-0">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                  <th class="text-end">Horas</th>
                  <th class="text-end">Tarifa</th>
                  <th class="text-end">Total</th>
                  <th class="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody id="entries-body"></tbody>
              <tfoot id="entries-foot"></tfoot>
            </table>
          </div>
        </div>

        <div class="row g-4 mb-5">
          <div class="col-lg-6">
            <div class="card-soft box-white p-3 h-100">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="mb-0 text-brand">Distribución por cliente</h5>
                <small class="text-muted">Ingresos</small>
              </div>
              <div id="pie-chart" class="d-flex justify-content-center align-items-center chart-container"></div>
              <div id="pie-legend" class="mt-3 small"></div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card-soft p-3 h-100">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="mb-0 text-brand">Insights AI</h5>
              </div>
              <div id="ai-output" class="text-muted small">Sin análisis. Haz clic en "Analizar con AI".</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="entry-modal" class="modal fade d-none" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="modal-title" class="modal-title">Nueva entrada</h5>
            <button type="button" class="btn-close" id="modal-close"></button>
          </div>
          <div class="modal-body">
            <form id="entry-form" class="row g-3">
              <div class="col-12">
                <label class="form-label">Cliente</label>
                <input id="form-client" type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha</label>
                <input id="form-date" type="date" class="form-control" required />
              </div>
              <div class="col-md-3">
                <label class="form-label">Horas</label>
                <input id="form-hours" type="number" step="0.1" min="0" class="form-control" required />
              </div>
              <div class="col-md-3">
                <label class="form-label">Tarifa/Hora</label>
                <input id="form-rate" type="number" step="1" min="0" class="form-control" required />
              </div>
              <div class="col-12">
                <label class="form-label">Descripción</label>
                <textarea id="form-description" class="form-control" rows="2"></textarea>
              </div>
              <div class="col-12 text-end">
                <button type="button" class="btn btn-link text-muted me-2" id="modal-cancel">Cancelar</button>
                <button type="submit" class="btn btn-soft-primary" id="modal-submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div id="theme-panel" class="card-soft p-3 position-fixed theme-panel-drawer d-none">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>Tema</strong>
        <button id="theme-close" class="btn btn-sm btn-outline-secondary">Cerrar</button>
      </div>
      <div class="d-grid gap-2">
        ${['bg','text','primary','secondary','accent','muted'].map(key => `
          <label class="small d-flex justify-content-between align-items-center">
            <span class="text-capitalize">${key}</span>
            <input data-theme-key="${key}" type="color" value="${(theme as any)[key]}" class="form-control form-control-color" />
          </label>
        `).join('')}
      </div>
    </div>
  `;
};

const closeDropdowns = () => {
  document.querySelectorAll<HTMLElement>('.filter-dropdown .dropdown-menu.show').forEach(menu => menu.classList.remove('show'));
  document.querySelectorAll<HTMLButtonElement>('.filter-dropdown .dropdown-toggle').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
};

let dropdownCloserAttached = false;
const initDropdownCloser = () => {
  if (dropdownCloserAttached) return;
  document.addEventListener('click', () => closeDropdowns());
  dropdownCloserAttached = true;
};

const initFilterToggle = () => {
  const btn = document.getElementById('btn-toggle-filters');
  const applied = document.getElementById('s-filtros-aplicados');
  if (btn && applied) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      applied.classList.toggle('d-none');
      if (applied.classList.contains('d-none')) {
        closeDropdowns();
      }
    });
  }

  const clientToggle = document.getElementById('filter-client-toggle');
  const clientMenu = document.getElementById('filter-client-menu');
  if (clientToggle && clientMenu) {
    clientToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDropdowns();
      clientMenu.classList.toggle('show');
      clientToggle.setAttribute('aria-expanded', clientMenu.classList.contains('show') ? 'true' : 'false');
    });
    clientMenu.addEventListener('click', (e) => e.stopPropagation());
    initDropdownCloser();
  }
};

const renderAppliedFilters = () => {
  const chips = document.getElementById('s-filtros-aplicados');
  if (!chips) return;

  const chipParts: string[] = [];

  if (filter.startDate || filter.endDate) {
    chipParts.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="time">
        <span class="small">Fechas: ${filter.startDate || '...'} → ${filter.endDate || '...'}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove="time" aria-label="Quitar filtro de fechas">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `);
  }

  filter.clients.forEach(client => {
    chipParts.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="client-${client}">
        <span class="small">Cliente: ${escapeHtml(client)}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove-client="${escapeHtml(client)}" aria-label="Quitar cliente ${escapeHtml(client)}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `);
  });

  if (!chipParts.length) {
    chips.innerHTML = `<span class="text-muted small">Sin filtros aplicados</span>`;
  } else {
    chips.innerHTML = chipParts.join('');
    chips.querySelectorAll('[data-remove="time"]').forEach(btn => {
      btn.addEventListener('click', () => {
        filter = { ...filter, ...getDefaultDateRange() };
        renderAll();
      });
    });
    chips.querySelectorAll<HTMLButtonElement>('[data-remove-client]').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.removeClient;
        filter.clients = filter.clients.filter(c => c !== value);
        renderAll();
      });
    });
  }
};

const renderFilters = () => {
  const startInput = document.getElementById('filter-start') as HTMLInputElement | null;
  const endInput = document.getElementById('filter-end') as HTMLInputElement | null;
  const clientMenu = document.getElementById('filter-client-menu');
  const clientLabel = document.getElementById('filter-client-label');
  if (!startInput || !endInput || !clientMenu || !clientLabel) return;

  startInput.value = filter.startDate;
  endInput.value = filter.endDate;

  const clients = Array.from(new Set(entries.map(e => e.client)));
  filter.clients = filter.clients.filter(c => clients.includes(c));
  clientMenu.innerHTML = `
    <div class="form-check mb-2">
      <input class="form-check-input" type="checkbox" id="client-all" ${filter.clients.length === 0 ? 'checked' : ''}>
      <label class="form-check-label" for="client-all">Todos</label>
    </div>
    ${clients.map(c => `
      <div class="form-check mb-1">
        <input class="form-check-input" type="checkbox" id="client-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'item'}" value="${escapeHtml(c)}" ${filter.clients.includes(c) ? 'checked' : ''}>
        <label class="form-check-label" for="client-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'item'}">${escapeHtml(c)}</label>
      </div>
    `).join('')}
  `;
  if (filter.clients.length === 0) {
    clientLabel.textContent = 'Todos';
  } else if (filter.clients.length === 1) {
    clientLabel.textContent = filter.clients[0];
  } else {
    clientLabel.textContent = `${filter.clients.length} seleccionados`;
  }

  startInput.onchange = (e) => {
    const val = (e.target as HTMLInputElement).value;
    filter.startDate = val;
    if (filter.endDate && filter.startDate > filter.endDate) {
      filter.endDate = filter.startDate;
    }
    renderAll();
  };

  endInput.onchange = (e) => {
    const val = (e.target as HTMLInputElement).value;
    filter.endDate = val;
    if (filter.startDate && filter.startDate > filter.endDate) {
      filter.startDate = filter.endDate;
    }
    renderAll();
  };

  const clientAll = document.getElementById('client-all') as HTMLInputElement | null;
  if (clientAll) {
    clientAll.onchange = (e) => {
      if ((e.target as HTMLInputElement).checked) {
        filter.clients = [];
        renderAll();
      }
    };
  }
  clientMenu.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(input => {
    if (input.id === 'client-all') return;
    input.onchange = (e) => {
      const value = (e.target as HTMLInputElement).value;
      if ((e.target as HTMLInputElement).checked) {
        filter.clients = Array.from(new Set([...filter.clients, value]));
      } else {
        filter.clients = filter.clients.filter(c => c !== value);
      }
      if (clientAll) clientAll.checked = filter.clients.length === 0;
      renderAll();
    };
  });

  const dropdowns = [
    { buttonId: 'filter-client-toggle', menuId: 'filter-client-menu' }
  ];
  dropdowns.forEach(({ buttonId, menuId }) => {
    const btn = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;
    btn.onclick = (e) => {
      e.stopPropagation();
      closeDropdowns();
      menu.classList.toggle('show');
      btn.setAttribute('aria-expanded', menu.classList.contains('show') ? 'true' : 'false');
    };
    menu.onclick = (e) => e.stopPropagation();
  });
  initDropdownCloser();
  renderAppliedFilters();
};

const renderTable = () => {
  const { filtered, stats } = getFilteredEntries();
  const tbody = document.getElementById('entries-body');
  const tfoot = document.getElementById('entries-foot');
  if (!tbody || !tfoot) return;

  if (!filtered.length) {
    tbody.innerHTML = `
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
    `;
  } else {
    tbody.innerHTML = filtered.map(e => `
      <tr>
        <td><span class="badge-chip">${escapeHtml(e.client)}</span></td>
        <td>${escapeHtml(e.description)}</td>
        <td>${new Date(e.date).toLocaleDateString()}</td>
        <td class="text-end">${e.hours}</td>
        <td class="text-end">$${e.rate}</td>
        <td class="text-end">$${(e.hours * e.rate).toFixed(2)}</td>
        <td class="text-end">
          <div class="entry-actions">
            <button class="btn btn-link-primary btn-sm" data-edit="${e.id}">
              <i class="fa-solid fa-pen-to-square me-1"></i> Editar
            </button>
            <button class="btn btn-link-danger btn-sm" data-delete="${e.id}">
              <i class="fa-solid fa-trash-can me-1"></i> Borrar
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  tfoot.innerHTML = `
    <tr class="summary-row">
      <td colspan="2">Registros: ${filtered.length}</td>
      <td></td>
      <td class="text-end">${stats.totalHours}h</td>
      <td></td>
      <td class="text-end">$${stats.totalEarnings.toFixed(2)}</td>
      <td></td>
    </tr>
  `;

  tbody.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).getAttribute('data-edit');
      if (!id) return;
      const entry = entries.find(en => en.id === id);
      if (entry) openModal(entry);
    });
  });
  tbody.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).getAttribute('data-delete');
      if (id && confirm('¿Eliminar este registro?')) {
        entries = entries.filter(en => en.id !== id);
        renderAll();
      }
    });
  });
};

const renderStats = () => {
  const { stats, filtered } = getFilteredEntries();
  const h = document.getElementById('stat-hours');
  const e = document.getElementById('stat-earnings');
  const c = document.getElementById('stat-count');
  if (h) h.textContent = `${stats.totalHours}h`;
  if (e) e.textContent = `$${stats.totalEarnings.toFixed(2)}`;
  if (c) c.textContent = `${filtered.length}`;
};

const renderPieChart = () => {
  const { filtered } = getFilteredEntries();
  const container = document.getElementById('pie-chart');
  const legend = document.getElementById('pie-legend');
  if (!container || !legend) return;

  if (!filtered.length) {
    container.innerHTML = `<div class="text-muted small">Sin datos</div>`;
    legend.innerHTML = '';
    return;
  }

  const totals = filtered.reduce<Record<string, number>>((acc, e) => {
    acc[e.client] = (acc[e.client] || 0) + e.hours * e.rate;
    return acc;
  }, {});
  const entriesData = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const sum = entriesData.reduce((s, [, v]) => s + v, 0);
  const colors = [theme.primary, theme.secondary, '#FF9F1C', '#FF5F5F', '#4ECDC4', '#1A535C'];

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const slices = entriesData.map(([name, value], idx) => {
    const pct = value / sum;
    const dash = pct * circumference;
    const circle = `<circle r="${radius}" cx="120" cy="120" fill="transparent"
        stroke="${colors[idx % colors.length]}"
        stroke-width="24"
        stroke-dasharray="${dash} ${circumference - dash}"
        stroke-dashoffset="${-offset}"
        transform="rotate(-90 120 120)" />`;
    offset += dash;
    return circle;
  }).join('');

  container.innerHTML = `
    <svg width="240" height="240" viewBox="0 0 240 240">
      <circle r="${radius}" cx="120" cy="120" fill="transparent" stroke="#f1f3f5" stroke-width="24" />
      ${slices}
      <text x="120" y="125" text-anchor="middle" font-size="14" fill="${theme.primary}" font-weight="700">${entriesData.length} clientes</text>
    </svg>
  `;

  legend.innerHTML = entriesData.map(([name, value], idx) => `
    <div class="d-flex align-items-center gap-2 mb-1">
      <span class="legend-color-dot chart-color-${idx % 6}"></span>
      <span>${escapeHtml(name)}</span>
      <span class="ms-auto fw-bold">$${value.toFixed(2)}</span>
    </div>
  `).join('');
};

const bindGlobalActions = () => {
  const btnNew = document.getElementById('btn-new');
  if (btnNew) btnNew.onclick = () => openModal();

  const btnCsv = document.getElementById('btn-export-csv');
  if (btnCsv) btnCsv.onclick = handleExportCSV;

  const btnCopy = document.getElementById('btn-copy');
  if (btnCopy) btnCopy.onclick = () => { handleCopyTable().then(() => showToast('Tabla copiada', 'success')); };

  const btnPdf = document.getElementById('btn-export-pdf');
  if (btnPdf) btnPdf.onclick = handleExportPDF;

  const fileUpload = document.getElementById('file-upload') as HTMLInputElement | null;
  if (fileUpload) fileUpload.onchange = handleFileUpload;

  const btnAnalyze = document.getElementById('btn-analyze');
  if (btnAnalyze) btnAnalyze.onclick = handleAnalyzeAI;

  const btnTheme = document.getElementById('btn-theme-panel');
  const panel = document.getElementById('theme-panel');
  const close = document.getElementById('theme-close');
  if (btnTheme && panel) btnTheme.onclick = () => { panel.style.display = 'block'; };
  if (close && panel) close.onclick = () => { panel.style.display = 'none'; };
  if (panel) {
    panel.querySelectorAll('input[data-theme-key]').forEach(input => {
      input.addEventListener('input', (e) => {
        const key = (e.target as HTMLInputElement).dataset.themeKey as keyof ThemeColors;
        const value = (e.target as HTMLInputElement).value;
        theme = { ...theme, [key]: value };
        setCSSTheme(theme);
        renderAll();
      });
    });
  }
};

const openModal = (entry?: TimeEntry) => {
  const modal = document.getElementById('entry-modal') as HTMLElement | null;
  if (!modal) return;
  const title = document.getElementById('modal-title');
  const formClient = document.getElementById('form-client') as HTMLInputElement;
  const formDate = document.getElementById('form-date') as HTMLInputElement;
  const formHours = document.getElementById('form-hours') as HTMLInputElement;
  const formRate = document.getElementById('form-rate') as HTMLInputElement;
  const formDesc = document.getElementById('form-description') as HTMLTextAreaElement;

  if (entry) {
    editingId = entry.id;
    if (title) title.textContent = 'Editar entrada';
    formClient.value = entry.client;
    formDate.value = entry.date;
    formHours.value = entry.hours.toString();
    formRate.value = entry.rate.toString();
    formDesc.value = entry.description;
  } else {
    editingId = null;
    if (title) title.textContent = 'Nueva entrada';
    formClient.value = '';
    formDate.value = new Date().toISOString().split('T')[0];
    formHours.value = '0';
    formRate.value = '0';
    formDesc.value = '';
  }
  modal.classList.remove('d-none');
  modal.style.display = 'block';
  modal.classList.add('show');
  const existingOverlay = document.getElementById('modal-overlay');
  const overlay = existingOverlay || document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.className = 'modal-backdrop-timio';
  if (!existingOverlay) document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('visible'));
  document.body.classList.add('modal-open-timio');
};

const closeModal = () => {
  const modal = document.getElementById('entry-modal') as HTMLElement | null;
  if (!modal) return;
  modal.style.display = 'none';
  modal.classList.remove('show');
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 200);
  }
  document.body.classList.remove('modal-open-timio');
};

const bindModal = () => {
  const modalClose = document.getElementById('modal-close');
  const modalCancel = document.getElementById('modal-cancel');
  const modal = document.getElementById('entry-modal');
  const form = document.getElementById('entry-form') as HTMLFormElement | null;
  if (modalClose) modalClose.onclick = closeModal;
  if (modalCancel) modalCancel.onclick = closeModal;
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  }
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const client = (document.getElementById('form-client') as HTMLInputElement).value.trim();
      const date = (document.getElementById('form-date') as HTMLInputElement).value;
      const hours = parseFloat((document.getElementById('form-hours') as HTMLInputElement).value) || 0;
      const rate = parseFloat((document.getElementById('form-rate') as HTMLInputElement).value) || 0;
      const description = (document.getElementById('form-description') as HTMLTextAreaElement).value;
      const dateTimestamp = new Date(date).getTime() || Date.now();
      if (!client || !date) return;

      if (editingId) {
        entries = entries.map(en => en.id === editingId ? { ...en, client, date, hours, rate, description, timestamp: dateTimestamp } : en);
      } else {
        entries = [{ id: uid(), client, date, hours, rate, description, timestamp: dateTimestamp }, ...entries];
      }
      closeModal();
      renderAll();
    };
  }
};

const handleExportCSV = () => {
  const { filtered } = getFilteredEntries();
  const headers = ['Fecha', 'Cliente', 'Horas', 'Tarifa/Hora', 'Total', 'Descripción'];
  const csvContent = [
    headers.join(','),
    ...filtered.map(e => [
      e.date,
      `"${e.client}"`,
      e.hours,
      e.rate,
      e.hours * e.rate,
      `"${e.description}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `timio_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

const handleCopyTable = async () => {
  const { filtered, stats } = getFilteredEntries();
  const headers = ['Cliente', 'Descripción', 'Fecha', 'Horas', 'Tarifa/Hora', 'Total'];
  const rows = filtered.map(e => [
    escapeHtml(e.client),
    escapeHtml(e.description),
    escapeHtml(e.date),
    String(e.hours),
    String(e.rate),
    (e.hours * e.rate).toFixed(2)
  ]);

  const totalsRow = [
    'Totales',
    '',
    '',
    stats.totalHours.toFixed(2),
    '',
    stats.totalEarnings.toFixed(2)
  ];

  const tsv = [headers, ...rows, totalsRow].map(cols => cols.join('\t')).join('\n');

  const htmlTable = `
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
          ${headers.map(h => `<th>${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            ${row.map((cell, idx) => {
              const alignClass = idx >= 3 ? 'text-right' : 'text-left';
              return `<td class="${alignClass}">${cell}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr class="export-total-row">
          ${totalsRow.map((cell, idx) => {
            const alignClass = idx >= 3 ? 'text-right' : 'text-left';
            return `<td class="${alignClass}">${cell}</td>`;
          }).join('')}
        </tr>
      </tfoot>
    </table>
  `;

  try {
    if (navigator.clipboard?.write) {
      const item = new ClipboardItem({
        'text/html': new Blob([htmlTable], { type: 'text/html' }),
        'text/plain': new Blob([tsv], { type: 'text/plain' })
      });
      await navigator.clipboard.write([item]);
      return;
    }
  } catch (err) {
    console.warn('Clipboard HTML write failed, falling back to text', err);
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(tsv);
  } else {
    const ta = document.createElement('textarea');
    ta.value = tsv;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
};

const showToast = (message: string, type: 'success' | 'default' = 'default') => {
  const existing = document.getElementById('toast-inline');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.id = 'toast-inline';
  div.className = `toast-inline ${type === 'success' ? 'toast-inline--success' : ''}`;
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2500);
};

const handleExportPDF = () => {
  const { filtered, stats } = getFilteredEntries();
  const rows = filtered.map(e => `
    <tr>
      <td>${escapeHtml(e.date)}</td>
      <td>${escapeHtml(e.client)}</td>
      <td class="text-end">${escapeHtml(e.hours)}</td>
      <td class="text-end">$${escapeHtml(e.rate)}</td>
      <td class="text-end">$${(e.hours * e.rate).toFixed(2)}</td>
      <td>${escapeHtml(e.description)}</td>
    </tr>
  `).join('');

  const html = `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Timio - Export PDF</title>
        <style>
          body { font-family: 'Inter', sans-serif; margin: 32px; color: ${theme.text}; }
          h1 { margin: 0 0 16px; color: ${theme.primary}; }
          table { width: 100%; border-collapse: collapse; font-size: 14px; }
          th, td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
          th { text-align: left; background: #f3f4f6; text-transform: uppercase; letter-spacing: 0.06em; font-size: 12px; color: ${theme.primary}; }
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
            ${rows || '<tr><td colspan="6" class="text-center">Sin registros</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Registros: ${filtered.length}</td>
              <td class="text-end">${stats.totalHours}h</td>
              <td></td>
              <td class="text-end">$${stats.totalEarnings.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `;

  const win = window.open('', '_blank', 'width=1200,height=900');
  if (!win) {
    alert('No se pudo abrir la ventana de impresión. Revisa bloqueadores de pop-ups.');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
  win.close();
};

const handleFileUpload = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    alert(`Archivo "${file.name}" cargado. (Simulación: se añaden 2 registros)`);
    const mock: TimeEntry[] = [
      { id: uid(), client: 'Importado Inc', date: '2023-12-01', hours: 4, rate: 45, description: 'Datos importados', timestamp: new Date('2023-12-01').getTime() },
      { id: uid(), client: 'Importado Inc', date: '2023-12-02', hours: 2, rate: 45, description: 'Datos importados vol 2', timestamp: new Date('2023-12-02').getTime() }
    ];
    entries = [...mock, ...entries];
    renderAll();
  };
  reader.readAsText(file);
  input.value = '';
};

const handleAnalyzeAI = async () => {
  const output = document.getElementById('ai-output');
  if (!output) return;
  const { filtered, stats } = getFilteredEntries();
  if (!filtered.length) {
    output.textContent = 'No hay datos para analizar.';
    return;
  }
  output.textContent = 'Analizando...';
  // Simulación simple en lugar de llamada externa
  setTimeout(() => {
    const topClient = filtered.reduce<Record<string, number>>((acc, e) => {
      acc[e.client] = (acc[e.client] || 0) + e.hours * e.rate;
      return acc;
    }, {});
    const best = Object.entries(topClient).sort((a, b) => b[1] - a[1])[0];
    output.innerHTML = `
      <ul class="mb-0">
        <li>Facturación total: <strong>$${stats.totalEarnings.toFixed(2)}</strong></li>
        <li>Horas registradas: <strong>${stats.totalHours}h</strong></li>
        ${best ? `<li>Cliente más rentable: <strong>${escapeHtml(best[0])}</strong> ($${best[1].toFixed(2)})</li>` : ''}
        <li>Tip retro: bloquea sesiones de 90 minutos y toma breaks cortos.</li>
      </ul>
    `;
  }, 400);
};

const renderAll = () => {
  renderStats();
  renderFilters();
  renderTable();
  renderPieChart();
};

const bootstrapApp = () => {
  setCSSTheme(theme);
  renderAll();
  bindGlobalActions();
  bindModal();
  initFilterToggle();
};

document.addEventListener('DOMContentLoaded', bootstrapApp);
