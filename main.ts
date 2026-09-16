import './styles/main.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { t, currentLanguage, setLanguage, Language } from './services/i18n';

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

const applyTranslations = () => {
  document.documentElement.lang = currentLanguage;

  // Text translations
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key) {
      el.textContent = t(key);
    }
  });

  // Placeholder translations
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (key) {
      el.placeholder = t(key);
    }
  });

  // Image alt translations
  document.querySelectorAll<HTMLImageElement>('[data-i18n-alt]').forEach(el => {
    const key = el.dataset.i18nAlt;
    if (key) {
      el.alt = t(key);
    }
  });

  // Update switcher buttons state
  document.querySelectorAll<HTMLButtonElement>('.btn-lang-item').forEach(btn => {
    const lang = btn.dataset.lang;
    if (lang === currentLanguage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};

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
        <span class="small">${t('table.dateRange', { start: filter.startDate || '...', end: filter.endDate || '...' })}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove="time" aria-label="Quitar filtro de fechas">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `);
  }

  filter.clients.forEach(client => {
    chipParts.push(`
      <span class="badge text-bg-primary filter-chip" data-chip="client-${client}">
        <span class="small">${t('table.clientFilterBadge', { client: escapeHtml(client) })}</span>
        <button type="button" class="btn btn-link btn-sm p-0 m-0 text-white" data-remove-client="${escapeHtml(client)}" aria-label="Quitar cliente ${escapeHtml(client)}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `);
  });

  if (!chipParts.length) {
    chips.innerHTML = `<span class="text-muted small">${t('table.noFilters')}</span>`;
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
  if (!startInput || !endInput || !clientMenu) return;

  startInput.value = filter.startDate;
  endInput.value = filter.endDate;

  const clients = Array.from(new Set(entries.map(e => e.client)));
  filter.clients = filter.clients.filter(c => clients.includes(c));
  clientMenu.innerHTML = `
    <div class="form-check mb-2">
      <input class="form-check-input" type="checkbox" id="client-all" ${filter.clients.length === 0 ? 'checked' : ''}>
      <label class="form-check-label" for="client-all">${t('table.clientAll')}</label>
    </div>
    ${clients.map(c => `
      <div class="form-check mb-1">
        <input class="form-check-input" type="checkbox" id="client-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'item'}" value="${escapeHtml(c)}" ${filter.clients.includes(c) ? 'checked' : ''}>
        <label class="form-check-label" for="client-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'item'}">${escapeHtml(c)}</label>
      </div>
    `).join('')}
  `;
  if (clientLabel) {
    if (filter.clients.length === 0) {
      clientLabel.textContent = t('table.clientAll');
    } else if (filter.clients.length === 1) {
      clientLabel.textContent = filter.clients[0];
    } else {
      clientLabel.textContent = t('table.clientSelected', { count: filter.clients.length });
    }
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
            <svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label="${t('table.emptyTitle')}">
              <rect x="24" y="36" width="152" height="112" rx="12" fill="#F7F5FC" stroke="#C7B8F4" stroke-width="3" />
              <rect x="40" y="56" width="72" height="12" rx="6" fill="#C7B8F4" opacity="0.8" />
              <rect x="40" y="78" width="104" height="12" rx="6" fill="#D4F26A" opacity="0.5" />
              <rect x="40" y="100" width="88" height="12" rx="6" fill="#F28C24" opacity="0.4" />
              <rect x="40" y="122" width="48" height="12" rx="6" fill="#4ECDC4" opacity="0.5" />
              <circle cx="158" cy="150" r="18" fill="#F1EEF6" stroke="#C7B8F4" stroke-width="3" />
              <path d="M152 150l8 8 12-16" stroke="#6F5ACF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            <div class="fw-semibold">${t('table.emptyTitle')}</div>
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
              <i class="fa-solid fa-pen-to-square me-1"></i> ${t('table.btnEdit')}
            </button>
            <button class="btn btn-link-danger btn-sm" data-delete="${e.id}">
              <i class="fa-solid fa-trash-can me-1"></i> ${t('table.btnDelete')}
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  tfoot.innerHTML = `
    <tr class="summary-row">
      <td colspan="2">${t('table.summaryRecords', { count: filtered.length })}</td>
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
      if (id && confirm(t('messages.confirmDelete'))) {
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
      <text x="120" y="125" text-anchor="middle" font-size="14" fill="${theme.primary}" font-weight="700">${t('analytics.clientsCount', { count: entriesData.length })}</text>
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
  // Selector de idioma
  document.querySelectorAll<HTMLButtonElement>('.btn-lang-item').forEach(btn => {
    btn.onclick = () => {
      const lang = btn.dataset.lang as Language;
      if (lang && lang !== currentLanguage) {
        setLanguage(lang);
        applyTranslations();
        renderAll();
      }
    };
  });

  const btnNew = document.getElementById('btn-new');
  if (btnNew) btnNew.onclick = () => openModal();

  const btnCsv = document.getElementById('btn-export-csv');
  if (btnCsv) btnCsv.onclick = handleExportCSV;

  const btnCopy = document.getElementById('btn-copy');
  if (btnCopy) btnCopy.onclick = () => { handleCopyTable().then(() => showToast(t('messages.tableCopied'), 'success')); };

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
  const submitBtn = document.getElementById('modal-submit');
  const formClient = document.getElementById('form-client') as HTMLInputElement;
  const formDate = document.getElementById('form-date') as HTMLInputElement;
  const formHours = document.getElementById('form-hours') as HTMLInputElement;
  const formRate = document.getElementById('form-rate') as HTMLInputElement;
  const formDesc = document.getElementById('form-description') as HTMLTextAreaElement;

  if (entry) {
    editingId = entry.id;
    if (title) title.textContent = t('modal.editTitle');
    if (submitBtn) submitBtn.textContent = t('modal.btnSaveEdit');
    formClient.value = entry.client;
    formDate.value = entry.date;
    formHours.value = entry.hours.toString();
    formRate.value = entry.rate.toString();
    formDesc.value = entry.description;
  } else {
    editingId = null;
    if (title) title.textContent = t('modal.newTitle');
    if (submitBtn) submitBtn.textContent = t('modal.btnSave');
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
    alert(t('messages.fileUploaded', { fileName: file.name }));
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
    output.textContent = t('analytics.aiNoData');
    return;
  }
  output.textContent = t('analytics.aiAnalyzing');
  // Simulación simple en lugar de llamada externa
  setTimeout(() => {
    const topClient = filtered.reduce<Record<string, number>>((acc, e) => {
      acc[e.client] = (acc[e.client] || 0) + e.hours * e.rate;
      return acc;
    }, {});
    const best = Object.entries(topClient).sort((a, b) => b[1] - a[1])[0];
    output.innerHTML = `
      <ul class="mb-0">
        <li>${t('analytics.aiTotalBilled')} <strong>$${stats.totalEarnings.toFixed(2)}</strong></li>
        <li>${t('analytics.aiLoggedHours')} <strong>${stats.totalHours}h</strong></li>
        ${best ? `<li>${t('analytics.aiTopClient')} <strong>${escapeHtml(best[0])}</strong> ($${best[1].toFixed(2)})</li>` : ''}
        <li>${t('analytics.aiTip')}</li>
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
  applyTranslations();
  renderAll();
  bindGlobalActions();
  bindModal();
  initFilterToggle();
};

document.addEventListener('DOMContentLoaded', bootstrapApp);
