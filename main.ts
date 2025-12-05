import './styles/main.scss';

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
  timeRange: '' | '1w' | '2w' | '3w' | '1m' | '2m' | '3m';
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
  bg: '#B8B8FF',
  text: '#1F1A3D',
  primary: '#1F1A3D',
  secondary: '#D4E72C',
  accent: '#E0E0FF',
  muted: '#FEFEF0',
};

const INITIAL_ENTRIES: TimeEntry[] = [
  { id: '1', client: 'Acme Corp', date: '2023-10-05', hours: 5, rate: 50, description: 'Diseño de landing page', timestamp: 1696483200000 },
  { id: '2', client: 'Globex', date: '2023-10-12', hours: 3.5, rate: 60, description: 'Consultoría React', timestamp: 1697088000000 },
  { id: '3', client: 'Acme Corp', date: '2023-11-01', hours: 8, rate: 50, description: 'Desarrollo Backend', timestamp: 1698816000000 }
];

let entries: TimeEntry[] = [...INITIAL_ENTRIES];
let filter: FilterState = { timeRange: '', clients: [] };
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
  const now = Date.now();
  const rangeDays: Record<NonNullable<FilterState['timeRange']>, number> = {
    '1w': 7,
    '2w': 14,
    '3w': 21,
    '1m': 30,
    '2m': 60,
    '3m': 90,
    '': 0
  };
  const filtered = entries.filter(entry => {
    const matchClient = filter.clients.length ? filter.clients.includes(entry.client) : true;
    const days = rangeDays[filter.timeRange ?? ''] ?? 0;
    const cutoff = days ? now - days * 24 * 60 * 60 * 1000 : 0;
    const matchDate = cutoff ? entry.timestamp >= cutoff : true;
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
    <div class="min-vh-100 timio-app p-3 p-md-4" style="background:${theme.bg}">
      <div class="container-lg">
        <header class="d-flex justify-content-between align-items-center mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style="width:48px;height:48px;background:${theme.primary};">T</div>
            <div>
              <h1 class="h4 mb-0" style="color:${theme.primary}">Timio</h1>
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
              <div id="stat-hours" class="fs-3 fw-bold" style="color:${theme.primary}">0h</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card-soft p-3">
              <div class="text-muted text-uppercase small">Total facturado</div>
              <div id="stat-earnings" class="fs-3 fw-bold" style="color:${theme.primary}">$0.00</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card-soft p-3">
              <div class="text-muted text-uppercase small">Registros</div>
              <div id="stat-count" class="fs-3 fw-bold" style="color:${theme.primary}">0</div>
            </div>
          </div>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2 mb-3" id="filter-bar">
          <div class="dropdown filter-dropdown d-flex align-items-center gap-2">
            <i class="fa-solid fa-filter text-muted"></i>
            <button id="filter-time-toggle" class="btn btn-outline-primary btn-sm dropdown-toggle" type="button" aria-expanded="false">
              Tiempo: <span id="filter-time-label">Todos</span>
            </button>
            <div class="dropdown-menu shadow-sm p-3" id="filter-time-menu"></div>
          </div>
          <div class="dropdown filter-dropdown">
            <button id="filter-client-toggle" class="btn btn-outline-primary btn-sm dropdown-toggle" type="button" aria-expanded="false">
              Cliente: <span id="filter-client-label">Todos</span>
            </button>
            <div class="dropdown-menu shadow-sm p-3" id="filter-client-menu" style="min-width:240px;"></div>
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
                <h5 class="mb-0" style="color:${theme.primary}">Distribución por cliente</h5>
                <small class="text-muted">Ingresos</small>
              </div>
              <div id="pie-chart" class="d-flex justify-content-center align-items-center" style="min-height:240px;"></div>
              <div id="pie-legend" class="mt-3 small"></div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card-soft p-3 h-100">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="mb-0" style="color:${theme.primary}">Insights AI</h5>
              </div>
              <div id="ai-output" class="text-muted small">Sin análisis. Haz clic en "Analizar con AI".</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="entry-modal" class="modal fade" style="display:none;" aria-hidden="true">
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

    <div id="theme-panel" class="card-soft p-3 position-fixed" style="right:16px; bottom:16px; width:260px; display:none; z-index:50;">
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

const renderAppliedFilters = () => {
  const chips = document.getElementById('s-filtros-aplicados');
  if (!chips) return;
  const timeLabels: Record<NonNullable<FilterState['timeRange']>, string> = {
    '': 'Todos',
    '1w': 'Última semana',
    '2w': 'Últimas 2 semanas',
    '3w': 'Últimas 3 semanas',
    '1m': 'Último mes',
    '2m': 'Últimos 2 meses',
    '3m': 'Últimos 3 meses'
  };

  const chipParts: string[] = [];

  if (filter.timeRange) {
    chipParts.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="time">
        <span class="small">Tiempo: ${timeLabels[filter.timeRange]}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove="time" aria-label="Quitar filtro tiempo">
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
        filter.timeRange = '';
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
  const timeMenu = document.getElementById('filter-time-menu');
  const timeLabel = document.getElementById('filter-time-label');
  const clientMenu = document.getElementById('filter-client-menu');
  const clientLabel = document.getElementById('filter-client-label');
  if (!timeMenu || !clientMenu || !timeLabel || !clientLabel) return;

  const timeOptions: { value: FilterState['timeRange']; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: '1w', label: 'Última semana' },
    { value: '2w', label: 'Últimas 2 semanas' },
    { value: '3w', label: 'Últimas 3 semanas' },
    { value: '1m', label: 'Último mes' },
    { value: '2m', label: 'Últimos 2 meses' },
    { value: '3m', label: 'Últimos 3 meses' }
  ];

  timeMenu.innerHTML = timeOptions.map(opt => `
    <div class="form-check mb-1">
      <input class="form-check-input" type="radio" name="time-range" id="time-${opt.value || 'all'}" value="${opt.value}" ${filter.timeRange === opt.value ? 'checked' : ''}>
      <label class="form-check-label" for="time-${opt.value || 'all'}">${opt.label}</label>
    </div>
  `).join('');
  timeLabel.textContent = timeOptions.find(o => o.value === filter.timeRange)?.label || 'Todos';

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

  timeMenu.querySelectorAll<HTMLInputElement>('input[name="time-range"]').forEach(input => {
    input.onchange = (e) => {
      const val = (e.target as HTMLInputElement).value as FilterState['timeRange'];
      filter.timeRange = val;
      renderAll();
    };
  });

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
    { buttonId: 'filter-time-toggle', menuId: 'filter-time-menu' },
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
            <button class="btn btn-outline-danger btn-sm" data-delete="${e.id}">
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
      <span class="rounded-circle d-inline-block" style="width:12px;height:12px;background:${colors[idx % colors.length]};"></span>
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
  const form = document.getElementById('entry-form') as HTMLFormElement | null;
  if (modalClose) modalClose.onclick = closeModal;
  if (modalCancel) modalCancel.onclick = closeModal;
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
    <table style="border-collapse:collapse;min-width:600px;">
      <thead>
        <tr>
          ${headers.map(h => `<th style="border:1px solid #ddd;padding:6px 8px;background:#f7f5fc;font-weight:700;text-align:left;">${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            ${row.map((cell, idx) => {
              const align = idx >= 3 ? 'right' : 'left';
              return `<td style="border:1px solid #eee;padding:6px 8px;text-align:${align};">${cell}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr>
          ${totalsRow.map((cell, idx) => {
            const align = idx >= 3 ? 'right' : 'left';
            const weight = idx === 0 ? '700' : '600';
            return `<td style="border:1px solid #ddd;padding:6px 8px;text-align:${align};font-weight:${weight};background:#fafafa;">${cell}</td>`;
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
      <td style="text-align:right;">${escapeHtml(e.hours)}</td>
      <td style="text-align:right;">$${escapeHtml(e.rate)}</td>
      <td style="text-align:right;">$${(e.hours * e.rate).toFixed(2)}</td>
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
            ${rows || '<tr><td colspan="6" style="text-align:center;">Sin registros</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Registros: ${filtered.length}</td>
              <td style="text-align:right;">${stats.totalHours}h</td>
              <td></td>
              <td style="text-align:right;">$${stats.totalEarnings.toFixed(2)}</td>
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
};

document.addEventListener('DOMContentLoaded', bootstrapApp);
