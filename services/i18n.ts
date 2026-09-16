export type Language = 'es' | 'en';

export const translations = {
  es: {
    brand: {
      title: 'Timio',
      subtitle: 'Tracker de horas',
      login: 'Login',
    },
    hero: {
      pill: 'Nuevo',
      title: 'Controla tus horas trabajadas con Timio',
      description: 'Registra, exporta y analiza tus proyectos en un solo lugar. Visualiza tus totales y obtén insights al instante.',
      alt: 'Ilustración de persona sosteniendo un reloj',
    },
    stats: {
      hours: 'Total de horas',
      earnings: 'Total facturado',
      entries: 'Registros',
    },
    table: {
      title: 'Mis horas',
      addDescription: 'Agregar descripción',
      filter: 'Filtrar',
      uploadFile: 'Upload file',
      add: 'Add',
      copy: 'Copy',
      download: 'Download',
      clientFilter: 'Cliente',
      clientAll: 'Todos',
      clientSelected: '{count} seleccionados',
      colClient: 'Cliente',
      colDescription: 'Descripción',
      colDate: 'Fecha',
      colHours: 'Horas',
      colRate: 'Tarifa',
      colTotal: 'Total',
      colActions: 'Acciones',
      btnEdit: 'Editar',
      btnDelete: 'Borrar',
      emptyTitle: 'No tienes ninguna hora registrada',
      summaryRecords: 'Registros: {count}',
      noFilters: 'Sin filtros aplicados',
      dateRange: 'Fechas: {start} → {end}',
      clientFilterBadge: 'Cliente: {client}',
    },
    analytics: {
      clientDist: 'Distribución por cliente',
      incomeSubtitle: 'Ingresos',
      clientsCount: '{count} clientes',
      aiTitle: 'Insights AI',
      aiBtn: 'Analizar con AI',
      aiEmpty: 'Sin análisis. Haz clic en "Analizar con AI".',
      aiAnalyzing: 'Analizando...',
      aiTotalBilled: 'Facturación total:',
      aiLoggedHours: 'Horas registradas:',
      aiTopClient: 'Cliente más rentable:',
      aiTip: 'Tip retro: bloquea sesiones de 90 minutos y toma breaks cortos.',
      aiNoData: 'No hay datos para analizar.',
    },
    modal: {
      newTitle: 'Nueva entrada',
      editTitle: 'Editar entrada',
      labelClient: 'Cliente',
      placeholderClient: 'Ej. Acme Corp',
      labelDate: 'Fecha',
      labelHours: 'Horas',
      labelRate: 'Tarifa/Hora',
      labelDescription: 'Descripción',
      placeholderDescription: 'Escribe una descripción del trabajo realizado...',
      btnCancel: 'Cancelar',
      btnSave: 'Guardar',
      btnSaveEdit: 'Guardar cambios',
    },
    messages: {
      tableCopied: 'Tabla copiada',
      confirmDelete: '¿Eliminar este registro?',
      fileUploaded: 'Archivo "{fileName}" cargado. (Simulación: se añaden 2 registros)',
    }
  },
  en: {
    brand: {
      title: 'Timio',
      subtitle: 'Time tracker',
      login: 'Login',
    },
    hero: {
      pill: 'New',
      title: 'Track your worked hours with Timio',
      description: 'Log, export, and analyze your projects all in one place. View your totals and get insights instantly.',
      alt: 'Illustration of a person holding a clock',
    },
    stats: {
      hours: 'Total hours',
      earnings: 'Total billed',
      entries: 'Entries',
    },
    table: {
      title: 'My hours',
      addDescription: 'Add a description',
      filter: 'Filter',
      uploadFile: 'Upload file',
      add: 'Add',
      copy: 'Copy',
      download: 'Download',
      clientFilter: 'Client',
      clientAll: 'All',
      clientSelected: '{count} selected',
      colClient: 'Client',
      colDescription: 'Description',
      colDate: 'Date',
      colHours: 'Hours',
      colRate: 'Rate',
      colTotal: 'Total',
      colActions: 'Actions',
      btnEdit: 'Edit',
      btnDelete: 'Delete',
      emptyTitle: 'No logged hours found',
      summaryRecords: 'Entries: {count}',
      noFilters: 'No filters applied',
      dateRange: 'Dates: {start} → {end}',
      clientFilterBadge: 'Client: {client}',
    },
    analytics: {
      clientDist: 'Client Distribution',
      incomeSubtitle: 'Earnings',
      clientsCount: '{count} clients',
      aiTitle: 'AI Insights',
      aiBtn: 'Analyze with AI',
      aiEmpty: 'No analysis yet. Click "Analyze with AI".',
      aiAnalyzing: 'Analyzing...',
      aiTotalBilled: 'Total earnings:',
      aiLoggedHours: 'Logged hours:',
      aiTopClient: 'Top profitable client:',
      aiTip: 'Productivity tip: block 90-minute focus sessions and take short breaks.',
      aiNoData: 'No data to analyze.',
    },
    modal: {
      newTitle: 'New entry',
      editTitle: 'Edit entry',
      labelClient: 'Client',
      placeholderClient: 'e.g. Acme Corp',
      labelDate: 'Date',
      labelHours: 'Hours',
      labelRate: 'Rate/Hour',
      labelDescription: 'Description',
      placeholderDescription: 'Write a description of the work done...',
      btnCancel: 'Cancel',
      btnSave: 'Save',
      btnSaveEdit: 'Save changes',
    },
    messages: {
      tableCopied: 'Table copied',
      confirmDelete: 'Delete this entry?',
      fileUploaded: 'File "{fileName}" uploaded. (Simulation: 2 entries added)',
    }
  }
};

const STORAGE_KEY = 'timio_lang';

export const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (saved === 'es' || saved === 'en') return saved;
  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  return browserLang === 'es' ? 'es' : 'en';
};

export let currentLanguage: Language = getInitialLanguage();

export const setLanguage = (lang: Language): void => {
  currentLanguage = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
};

export const t = (path: string, params?: Record<string, string | number>): string => {
  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = translations[currentLanguage];
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return path;
    }
  }
  if (typeof current !== 'string') return path;
  if (!params) return current;
  return Object.entries(params).reduce((str, [paramKey, val]) => {
    return str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
  }, current);
};
