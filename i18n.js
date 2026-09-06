const SUPPORTED_LANGS = ['it', 'en', 'es', 'fr', 'de'];
const LANG_LABELS = { it: 'Italiano', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch' };

function detectLang() {
  const nav = navigator.language.slice(0, 2);
  return SUPPORTED_LANGS.includes(nav) ? nav : 'it';
}

let currentLang = localStorage.getItem('lang') || detectLang();

const translations = {
  it: {
    appTitle: 'Il Nostro Menù',
    loading: 'Caricamento...',
    lunch: 'PRANZO',
    dinner: 'CENA',
    altsToggle: 'Altre 2 alternative',
    optionN: 'Opzione',
    shoppingTitle: 'Lista della spesa',
    share: 'Condividi',
    planFor: 'Pianifica per',
    nDays: 'giorni',
    estimatedCal: 'Calorie stimate (col. inclusa)',
    pctOfTarget: 'del target',
    goal: 'obiettivo 1600',
    pastWeek: 'Settimana passata',
    futureWeek: 'Settimana futura',
    today: 'Oggi',
    ingredientsFor: 'Ingredienti per',
    until: 'fino al',
    listCopied: 'Lista copiata negli appunti!',
    copyFailed: 'Impossibile copiare',
    error: 'Errore',
    dishes: 'piatti',
    done: 'Fatto',
    markDone: 'Segna fatto',
    menu: 'Menù',
    shopping: 'Spesa',
    darkMode: 'Modalità scura',
    languageLabel: 'Lingua',
    weekLabel: 'Settimana',
    themeLabel: 'Tema',
    darkModeOn: 'Tema scuro attivo',
    darkModeOff: 'Tema chiaro attivo',
    days: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    daysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    catOrder: ['Carne & Pesce', 'Verdure', 'Cereali & Legumi', 'Latticini & Uova', 'Dispensa', 'Pizza', 'Frutta'],

    // Menu Management Modal
    manageMenu: 'Gestisci menù',
    modalMenuTitle: 'Gestione Menù',
    close: 'Chiudi',
    tabPrompt: '🤖 Prompt AI',
    tabImport: '📥 Importa',
    tabShare: '🔗 Condividi',

    // AI Prompt Generator
    promptIntro: 'Copia questo prompt e incollalo nella chat di un\'AI (es. ChatGPT, Claude, Gemini). L\'AI genererà il JSON del tuo menù su misura, pronto da importare.',
    promptDietLabel: 'Stile alimentare:',
    promptDiets: {
      omnivore: 'Onnivoro / Vario',
      mediterranean: 'Dieta Mediterranea',
      vegetarian: 'Vegetariano',
      vegan: 'Vegano',
      pescatarian: 'Pescetariano',
      keto: 'Chetogenico / Low Carb',
      glutenFree: 'Senza glutine'
    },
    promptWeeksLabel: 'Numero settimane:',
    promptCalLabel: 'Calorie totali al giorno:',
    promptNotesLabel: 'Preferenze aggiuntive o allergie:',
    promptNotesPlaceholder: 'Es. senza lattosio, cene veloci max 20 min, no peperoni...',
    copyPromptBtn: '📋 Copia Prompt per l\'AI',
    promptCopied: 'Prompt copiato negli appunti!',

    // Import Tab
    importTitle: 'Importa il tuo menù',
    importDesc: 'Puoi caricare un file .json, incollare il codice dagli appunti o inserirlo qui sotto:',
    uploadFileBtn: '📁 Carica file .json',
    pasteClipboardBtn: '📋 Incolla da appunti',
    jsonPlaceholder: 'Incolla qui il JSON generato dall\'AI o da un altro menù...',
    importBtn: 'Importa Menù',
    menuImported: 'Menù importato con successo!',
    importError: 'Errore nell\'importazione: JSON non valido o incompleto.',
    presetsTitle: 'Oppure ripristina un menù di esempio:',
    presetLoaded: 'Menù di esempio caricato!',

    // Share Tab
    shareMenuTitle: 'Condividi tramite Link',
    shareMenuDesc: 'Questo link racchiude l\'intero menù compresso in formato URL. Chiunque lo apra riceverà direttamente il menù senza bisogno di server o registrazioni.',
    copyLinkBtn: '🔗 Copia Link condivisibile',
    linkCopied: 'Link copiato negli appunti!',
    nativeShareBtn: 'Condividi link...',
    downloadJsonBtn: '💾 Scarica file JSON',
    copyJsonBtn: '📋 Copia codice JSON',
    jsonCopied: 'JSON copiato negli appunti!',
    sharedMenuLoaded: 'Menù condiviso caricato con successo!'
  },
  en: {
    appTitle: 'Our Menu',
    loading: 'Loading...',
    lunch: 'LUNCH',
    dinner: 'DINNER',
    altsToggle: '2 more alternatives',
    optionN: 'Option',
    shoppingTitle: 'Shopping list',
    share: 'Share',
    planFor: 'Plan for',
    nDays: 'days',
    estimatedCal: 'Estimated calories (breakfast incl.)',
    pctOfTarget: 'of target',
    goal: 'target 1600',
    pastWeek: 'Past week',
    futureWeek: 'Future week',
    today: 'Today',
    ingredientsFor: 'Ingredients for',
    until: 'until',
    listCopied: 'List copied to clipboard!',
    copyFailed: 'Could not copy',
    error: 'Error',
    dishes: 'dishes',
    done: 'Done',
    markDone: 'Mark done',
    menu: 'Menu',
    shopping: 'Shopping',
    darkMode: 'Dark mode',
    languageLabel: 'Language',
    weekLabel: 'Week',
    themeLabel: 'Theme',
    darkModeOn: 'Dark theme active',
    darkModeOff: 'Light theme active',
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    catOrder: ['Meat & Fish', 'Vegetables', 'Grains & Legumes', 'Dairy & Eggs', 'Pantry', 'Pizza', 'Fruit'],

    manageMenu: 'Manage menu',
    modalMenuTitle: 'Menu Management',
    close: 'Close',
    tabPrompt: '🤖 AI Prompt',
    tabImport: '📥 Import',
    tabShare: '🔗 Share',

    promptIntro: 'Copy this prompt into an AI assistant (ChatGPT, Claude, Gemini). The AI will generate a tailored menu JSON ready for import.',
    promptDietLabel: 'Diet style:',
    promptDiets: {
      omnivore: 'Omnivore / Balanced',
      mediterranean: 'Mediterranean diet',
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      pescatarian: 'Pescatarian',
      keto: 'Ketogenic / Low Carb',
      glutenFree: 'Gluten-Free'
    },
    promptWeeksLabel: 'Number of weeks:',
    promptCalLabel: 'Daily target calories:',
    promptNotesLabel: 'Additional preferences or allergies:',
    promptNotesPlaceholder: 'E.g. dairy-free, quick 20-min dinners, no peppers...',
    copyPromptBtn: '📋 Copy AI Prompt',
    promptCopied: 'Prompt copied to clipboard!',

    importTitle: 'Import your menu',
    importDesc: 'Upload a .json file, paste from your clipboard, or edit raw JSON below:',
    uploadFileBtn: '📁 Upload .json file',
    pasteClipboardBtn: '📋 Paste from clipboard',
    jsonPlaceholder: 'Paste valid menu JSON here...',
    importBtn: 'Import Menu',
    menuImported: 'Menu imported successfully!',
    importError: 'Import failed: invalid or incomplete JSON.',
    presetsTitle: 'Or load a sample preset menu:',
    presetLoaded: 'Sample preset menu loaded!',

    shareMenuTitle: 'Share via Link',
    shareMenuDesc: 'This link embeds the entire compressed menu into the URL. Anyone opening it will get your menu instantly without accounts or servers.',
    copyLinkBtn: '🔗 Copy Shareable Link',
    linkCopied: 'Link copied to clipboard!',
    nativeShareBtn: 'Share link...',
    downloadJsonBtn: '💾 Download JSON file',
    copyJsonBtn: '📋 Copy JSON code',
    jsonCopied: 'JSON copied to clipboard!',
    sharedMenuLoaded: 'Shared menu loaded successfully!'
  },
  es: {
    appTitle: 'Nuestro Menú',
    loading: 'Cargando...',
    lunch: 'ALMUERZO',
    dinner: 'CENA',
    altsToggle: 'Otras 2 alternativas',
    optionN: 'Opción',
    shoppingTitle: 'Lista de la compra',
    share: 'Compartir',
    planFor: 'Planificar para',
    nDays: 'días',
    estimatedCal: 'Calorías estimadas (desayuno incl.)',
    pctOfTarget: 'del objetivo',
    goal: 'objetivo 1600',
    pastWeek: 'Semana pasada',
    futureWeek: 'Semana futura',
    today: 'Hoy',
    ingredientsFor: 'Ingredientes para',
    until: 'hasta el',
    listCopied: '¡Lista copiada al portapapeles!',
    copyFailed: 'No se pudo copiar',
    error: 'Error',
    dishes: 'platos',
    done: 'Hecho',
    markDone: 'Marcar hecho',
    menu: 'Menú',
    shopping: 'Compra',
    darkMode: 'Modo oscuro',
    languageLabel: 'Idioma',
    weekLabel: 'Semana',
    themeLabel: 'Tema',
    darkModeOn: 'Tema oscuro activo',
    darkModeOff: 'Tema claro activo',
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    catOrder: ['Carne & Pescado', 'Verduras', 'Cereales & Legumbres', 'Lácteos & Huevos', 'Despensa', 'Pizza', 'Fruta'],

    manageMenu: 'Gestionar menú',
    modalMenuTitle: 'Gestión del Menú',
    close: 'Cerrar',
    tabPrompt: '🤖 Prompt IA',
    tabImport: '📥 Importar',
    tabShare: '🔗 Compartir',

    promptIntro: 'Copia este prompt y pégalo en una IA (ChatGPT, Claude, Gemini). La IA generará el menú en JSON listo para importar.',
    promptDietLabel: 'Tipo de dieta:',
    promptDiets: {
      omnivore: 'Omnívoro / Variado',
      mediterranean: 'Dieta Mediterránea',
      vegetarian: 'Vegetariano',
      vegan: 'Vegano',
      pescatarian: 'Pescetariano',
      keto: 'Cetogénico / Low Carb',
      glutenFree: 'Sin gluten'
    },
    promptWeeksLabel: 'Número de semanas:',
    promptCalLabel: 'Calorías diarias totales:',
    promptNotesLabel: 'Preferencias adicionales o alergias:',
    promptNotesPlaceholder: 'Ej. sin lactosa, cenas rápidas de 20 min, sin pimientos...',
    copyPromptBtn: '📋 Copiar Prompt para la IA',
    promptCopied: '¡Prompt copiado al portapapeles!',

    importTitle: 'Importa tu menú',
    importDesc: 'Carga un archivo .json, pega desde el portapapeles o escribe el JSON abajo:',
    uploadFileBtn: '📁 Subir archivo .json',
    pasteClipboardBtn: '📋 Pegar del portapapeles',
    jsonPlaceholder: 'Pega el JSON del menú aquí...',
    importBtn: 'Importar Menú',
    menuImported: '¡Menú importado con éxito!',
    importError: 'Error de importación: JSON no válido o incompleto.',
    presetsTitle: 'O carga un menú de ejemplo predefinido:',
    presetLoaded: '¡Menú de ejemplo cargado!',

    shareMenuTitle: 'Compartir mediante Enlace',
    shareMenuDesc: 'Este enlace contiene todo el menú comprimido en la URL. Quien lo abra cargará tu menú sin registros ni servidores.',
    copyLinkBtn: '🔗 Copiar Enlace para compartir',
    linkCopied: '¡Enlace copiado al portapapeles!',
    nativeShareBtn: 'Compartir enlace...',
    downloadJsonBtn: '💾 Descargar archivo JSON',
    copyJsonBtn: '📋 Copiar código JSON',
    jsonCopied: '¡JSON copiado al portapapeles!',
    sharedMenuLoaded: '¡Menú compartido cargado con éxito!'
  },
  fr: {
    appTitle: 'Notre Menu',
    loading: 'Chargement...',
    lunch: 'DÉJEUNER',
    dinner: 'DÎNER',
    altsToggle: '2 autres alternatives',
    optionN: 'Option',
    shoppingTitle: 'Liste de courses',
    share: 'Partager',
    planFor: 'Planifier pour',
    nDays: 'jours',
    estimatedCal: 'Calories estimées (petit-déj. incl.)',
    pctOfTarget: 'de l\'objectif',
    goal: 'objectif 1600',
    pastWeek: 'Semaine passée',
    futureWeek: 'Semaine future',
    today: 'Aujourd\'hui',
    ingredientsFor: 'Ingrédients pour',
    until: 'jusqu\'au',
    listCopied: 'Liste copiée dans le presse-papiers !',
    copyFailed: 'Impossible de copier',
    error: 'Erreur',
    dishes: 'plats',
    done: 'Fait',
    markDone: 'Marquer fait',
    menu: 'Menu',
    shopping: 'Courses',
    darkMode: 'Mode sombre',
    languageLabel: 'Langue',
    weekLabel: 'Semaine',
    themeLabel: 'Thème',
    darkModeOn: 'Thème sombre actif',
    darkModeOff: 'Thème clair actif',
    days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    daysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    catOrder: ['Viande & Poisson', 'Légumes', 'Céréales & Légumineuses', 'Produits laitiers & Œufs', 'Garde-manger', 'Pizza', 'Fruits'],

    manageMenu: 'Gérer le menu',
    modalMenuTitle: 'Gestion du Menu',
    close: 'Fermer',
    tabPrompt: '🤖 Prompt IA',
    tabImport: '📥 Importer',
    tabShare: '🔗 Partager',

    promptIntro: 'Copiez ce prompt dans une IA (ChatGPT, Claude, Gemini). L\'IA va créer un menu personnalisé au format JSON prêt à importer.',
    promptDietLabel: 'Type d\'alimentation :',
    promptDiets: {
      omnivore: 'Omnivore / Équilibré',
      mediterranean: 'Régime méditerranéen',
      vegetarian: 'Végétarien',
      vegan: 'Végétalien',
      pescatarian: 'Pescétarien',
      keto: 'Cétogène / Low Carb',
      glutenFree: 'Sans gluten'
    },
    promptWeeksLabel: 'Nombre de semaines :',
    promptCalLabel: 'Calories quotidiennes visées :',
    promptNotesLabel: 'Préférences ou allergies :',
    promptNotesPlaceholder: 'Ex. sans lactose, repas rapides en 20 min, pas de poivrons...',
    copyPromptBtn: '📋 Copier le Prompt pour l\'IA',
    promptCopied: 'Prompt copié dans le presse-papiers !',

    importTitle: 'Importer votre menu',
    importDesc: 'Téléversez un fichier .json, collez depuis le presse-papiers ou modifiez le code ci-dessous :',
    uploadFileBtn: '📁 Fichier .json',
    pasteClipboardBtn: '📋 Coller',
    jsonPlaceholder: 'Collez le code JSON valide ici...',
    importBtn: 'Importer le Menu',
    menuImported: 'Menu importé avec succès !',
    importError: 'Échec de l\'importation : JSON invalide ou incomplet.',
    presetsTitle: 'Ou chargez un menu exemple prédéfini :',
    presetLoaded: 'Menu exemple chargé !',

    shareMenuTitle: 'Partager par Lien',
    shareMenuDesc: 'Ce lien intègre l\'ensemble du menu compressé dans l\'URL. N\'importe qui peut l\'ouvrir sans compte ni serveur.',
    copyLinkBtn: '🔗 Copier le Lien de partage',
    linkCopied: 'Lien copié dans le presse-papiers !',
    nativeShareBtn: 'Partager le lien...',
    downloadJsonBtn: '💾 Télécharger le fichier JSON',
    copyJsonBtn: '📋 Copier le code JSON',
    jsonCopied: 'JSON copié dans le presse-papiers !',
    sharedMenuLoaded: 'Menu partagé chargé avec succès !'
  },
  de: {
    appTitle: 'Unser Menü',
    loading: 'Laden...',
    lunch: 'MITTAGESSEN',
    dinner: 'ABENDESSEN',
    altsToggle: '2 weitere Alternativen',
    optionN: 'Option',
    shoppingTitle: 'Einkaufsliste',
    share: 'Teilen',
    planFor: 'Planen für',
    nDays: 'Tage',
    estimatedCal: 'Geschätzte Kalorien (Frühst. inkl.)',
    pctOfTarget: 'des Ziels',
    goal: 'Ziel 1600',
    pastWeek: 'Vergangene Woche',
    futureWeek: 'Nächste Woche',
    today: 'Heute',
    ingredientsFor: 'Zutaten für',
    until: 'bis',
    listCopied: 'Liste in die Zwischenablage kopiert!',
    copyFailed: 'Kopieren fehlgeschlagen',
    error: 'Fehler',
    dishes: 'Gerichte',
    done: 'Erledigt',
    markDone: 'Als erledigt markieren',
    menu: 'Menü',
    shopping: 'Einkauf',
    darkMode: 'Dunkelmodus',
    languageLabel: 'Sprache',
    weekLabel: 'Woche',
    themeLabel: 'Thema',
    darkModeOn: 'Dunkles Design aktiv',
    darkModeOff: 'Helles Design aktiv',
    days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    daysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    catOrder: ['Fleisch & Fisch', 'Gemüse', 'Getreide & Hülsenfrüchte', 'Milchprodukte & Eier', 'Vorratskammer', 'Pizza', 'Obst'],

    manageMenu: 'Menü verwalten',
    modalMenuTitle: 'Menüverwaltung',
    close: 'Schließen',
    tabPrompt: '🤖 KI-Prompt',
    tabImport: '📥 Importieren',
    tabShare: '🔗 Teilen',

    promptIntro: 'Kopieren Sie diesen Prompt in einen KI-Chat (z. B. ChatGPT, Claude, Gemini). Die KI erstellt das Menü im passenden JSON-Format zum Importieren.',
    promptDietLabel: 'Ernährungsform:',
    promptDiets: {
      omnivore: 'Mischkost / Ausgewogen',
      mediterranean: 'Mediterrane Küche',
      vegetarian: 'Vegetarisch',
      vegan: 'Vegan',
      pescatarian: 'Pescetarisch',
      keto: 'Ketogen / Low Carb',
      glutenFree: 'Glutenfrei'
    },
    promptWeeksLabel: 'Anzahl Wochen:',
    promptCalLabel: 'Tägliche Zielkalorien:',
    promptNotesLabel: 'Zusätzliche Wünsche oder Allergien:',
    promptNotesPlaceholder: 'Z. B. laktosefrei, schnelle 20-Minuten-Gerichte, keine Paprika...',
    copyPromptBtn: '📋 KI-Prompt kopieren',
    promptCopied: 'Prompt in die Zwischenablage kopiert!',

    importTitle: 'Eigenes Menü importieren',
    importDesc: 'Laden Sie eine .json-Datei hoch, fügen Sie aus der Zwischenablage ein oder bearbeiten Sie das JSON unten:',
    uploadFileBtn: '📁 .json-Datei hochladen',
    pasteClipboardBtn: '📋 Aus Zwischenablage einfügen',
    jsonPlaceholder: 'Gültigen JSON-Code hier einfügen...',
    importBtn: 'Menü importieren',
    menuImported: 'Menü erfolgreich importiert!',
    importError: 'Importfehler: Ungültiges oder unvollständiges JSON.',
    presetsTitle: 'Oder ein Beispielmenü laden:',
    presetLoaded: 'Beispielmenü geladen!',

    shareMenuTitle: 'Per Link teilen',
    shareMenuDesc: 'Dieser Link enthält das gesamte komprimierte Menü direkt in der URL. Jeder Empfänger kann es sofort ohne Konto oder Server öffnen.',
    copyLinkBtn: '🔗 Teilbaren Link kopieren',
    linkCopied: 'Link in die Zwischenablage kopiert!',
    nativeShareBtn: 'Link teilen...',
    downloadJsonBtn: '💾 JSON-Datei herunterladen',
    copyJsonBtn: '📋 JSON kopieren',
    jsonCopied: 'JSON in die Zwischenablage kopiert!',
    sharedMenuLoaded: 'Geteiltes Menü erfolgreich geladen!'
  }
};

function t(key) {
  return translations[currentLang]?.[key] ?? translations['it'][key] ?? key;
}

function formatDateLocale(d) {
  return currentLang === 'en'
    ? `${d.getMonth() + 1}/${d.getDate()}`
    : `${d.getDate()}/${d.getMonth() + 1}`;
}

function menuFile() {
  return currentLang === 'it' ? 'menu.json' : `menu.${currentLang}.json`;
}

async function changeLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.title = t('appTitle');
  await loadMenu();
  applyStaticTranslations();
  updateHeader();
  buildDayViews();
  slideToSlot(activeSlot, false);
  buildDayNav();
  if (typeof updatePromptPreview === 'function') {
    updatePromptPreview();
  }
}

function applyStaticTranslations() {
  document.getElementById('app-title').textContent = t('appTitle');
  document.getElementById('today-label').textContent = t('loading');
  document.getElementById('nav-menu-label').textContent = t('menu');
  document.getElementById('nav-shopping-label').textContent = t('shopping');
  document.getElementById('shop-title').textContent = t('shoppingTitle');
  document.getElementById('share-label').textContent = t('share');
  document.getElementById('plan-for-label').textContent = t('planFor');
  document.getElementById('lang-label').textContent = t('languageLabel');
  document.getElementById('theme-label').textContent = t('themeLabel');
  document.querySelector('.control-chip-select')?.setAttribute('title', t('languageLabel'));
  document.querySelector('.control-chip-toggle')?.setAttribute('title', t('themeLabel'));
  document.getElementById('dark-toggle').title = t('darkMode');
  document.querySelectorAll('.range-pill').forEach(p => {
    p.textContent = `${p.dataset.days} ${t('nDays')}`;
  });

  // Modal static labels
  const menuModalBtn = document.getElementById('menu-modal-open-btn');
  if (menuModalBtn) {
    menuModalBtn.title = t('manageMenu');
    const srLabel = document.getElementById('menu-modal-open-label');
    if (srLabel) srLabel.textContent = t('manageMenu');
  }
  const modalTitle = document.getElementById('modal-title');
  if (modalTitle) modalTitle.textContent = t('modalMenuTitle');

  const tabPromptBtn = document.getElementById('tab-prompt-btn');
  if (tabPromptBtn) tabPromptBtn.textContent = t('tabPrompt');
  const tabImportBtn = document.getElementById('tab-import-btn');
  if (tabImportBtn) tabImportBtn.textContent = t('tabImport');
  const tabShareBtn = document.getElementById('tab-share-btn');
  if (tabShareBtn) tabShareBtn.textContent = t('tabShare');

  // Prompt tab
  const pIntro = document.getElementById('prompt-intro-text');
  if (pIntro) pIntro.textContent = t('promptIntro');
  const pDietLbl = document.getElementById('prompt-diet-label');
  if (pDietLbl) pDietLbl.textContent = t('promptDietLabel');
  const pWeeksLbl = document.getElementById('prompt-weeks-label');
  if (pWeeksLbl) pWeeksLbl.textContent = t('promptWeeksLabel');
  const pCalLbl = document.getElementById('prompt-cal-label');
  if (pCalLbl) pCalLbl.textContent = t('promptCalLabel');
  const pNotesLbl = document.getElementById('prompt-notes-label');
  if (pNotesLbl) pNotesLbl.textContent = t('promptNotesLabel');
  const pNotesInput = document.getElementById('prompt-notes-input');
  if (pNotesInput) pNotesInput.placeholder = t('promptNotesPlaceholder');
  const copyPBtn = document.getElementById('copy-prompt-btn');
  if (copyPBtn) copyPBtn.textContent = t('copyPromptBtn');

  // Populate prompt diet options
  const dietSelect = document.getElementById('prompt-diet-select');
  if (dietSelect) {
    const currentVal = dietSelect.value || 'mediterranean';
    dietSelect.innerHTML = '';
    const diets = t('promptDiets');
    Object.entries(diets).forEach(([k, label]) => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = label;
      dietSelect.appendChild(opt);
    });
    dietSelect.value = diets[currentVal] ? currentVal : 'mediterranean';
  }

  // Import tab
  const impTitle = document.getElementById('import-section-title');
  if (impTitle) impTitle.textContent = t('importTitle');
  const impDesc = document.getElementById('import-section-desc');
  if (impDesc) impDesc.textContent = t('importDesc');
  const upFileBtn = document.getElementById('upload-file-btn');
  if (upFileBtn) upFileBtn.textContent = t('uploadFileBtn');
  const pasteClipBtn = document.getElementById('paste-clipboard-btn');
  if (pasteClipBtn) pasteClipBtn.textContent = t('pasteClipboardBtn');
  const jsonArea = document.getElementById('import-json-area');
  if (jsonArea) jsonArea.placeholder = t('jsonPlaceholder');
  const impSubmitBtn = document.getElementById('import-submit-btn');
  if (impSubmitBtn) impSubmitBtn.textContent = t('importBtn');
  const presetsTitle = document.getElementById('presets-section-title');
  if (presetsTitle) presetsTitle.textContent = t('presetsTitle');

  // Share tab
  const shareTitle = document.getElementById('share-section-title');
  if (shareTitle) shareTitle.textContent = t('shareMenuTitle');
  const shareDesc = document.getElementById('share-section-desc');
  if (shareDesc) shareDesc.textContent = t('shareMenuDesc');
  const copyLinkBtn = document.getElementById('copy-share-link-btn');
  if (copyLinkBtn) copyLinkBtn.textContent = t('copyLinkBtn');
  const nativeShareBtn = document.getElementById('native-share-btn');
  if (nativeShareBtn) nativeShareBtn.textContent = t('nativeShareBtn');
  const dlJsonBtn = document.getElementById('download-json-btn');
  if (dlJsonBtn) dlJsonBtn.textContent = t('downloadJsonBtn');
  const copyJsonBtn = document.getElementById('copy-json-btn');
  if (copyJsonBtn) copyJsonBtn.textContent = t('copyJsonBtn');

  // Update lang selector
  const sel = document.getElementById('lang-select');
  if (sel) sel.value = currentLang;
}

// Generate localized prompt template for AI models
function buildAiPromptTemplate({ weeks = 3, dietKey = 'mediterranean', kcal = 1600, notes = '' }) {
  const lang = currentLang;
  const dietName = translations[lang].promptDiets[dietKey] || dietKey;
  const daysList = translations[lang].days.slice(1).concat(translations[lang].days[0]); // Lun..Dom / Mon..Sun
  const mainCategories = translations[lang].catOrder.filter(c => c !== translations[lang].catOrder[translations[lang].catOrder.length - 1]).join('", "');
  const pantryCat = translations[lang].catOrder[4] || 'Dispensa';

  if (lang === 'it') {
    return `Agisci come nutrizionista e chef esperto. Crea un piano pasti settimanale per la famiglia suddiviso in ${weeks} settimana/e, con preferenza alimentare "${dietName}" e circa ${kcal} kcal stimate al giorno (inclusa una colazione da ~300 kcal).
${notes ? `Requisiti e note aggiuntive: ${notes}\n` : ''}
Regole obbligatorie sulla struttura:
1. Ogni settimana ("weeks") ha un'etichetta ("label", es. "Settimana 1") e esattamente 7 giorni ("days", da Lunedì a Domenica).
2. Ogni giorno ha il nome del giorno ("day"), un frutto consigliato con emoji ("fruit", es. "🍎 Mela"), e 2 pasti: "Pranzo" e "Cena" ("meals").
3. Per ogni pasto:
   - "label": "Pranzo" o "Cena"
   - "main": piatto principale con "name", "detail" (descrizione breve), stima "kcal" e "ingredients" suddivisi nelle categorie: "${mainCategories}".
   - "alts": array con esattamente 2 piatti alternativi, ciascuno con "name", "detail" e "kcal".
4. Includi gli ingredienti di base comuni all'inizio in "baseIngredients" sotto "${pantryCat}".

REQUISITO FONDAMENTALE DI OUTPUT:
Rispondi ESCLUSIVAMENTE con il codice JSON valido. NON usare blocchi di codice markdown (NON scrivere \`\`\`json o \`\`\`), NON inserire spiegazioni, saluti, introduzioni o conclusioni. La risposta DEVE iniziare direttamente con il carattere { e terminare con } in modo da poter essere importata direttamente con JSON.parse().

Esempio di struttura JSON attesa:
{
  "baseIngredients": {
    "${pantryCat}": ["Olio evo", "Sale", "Aglio", "Limone"]
  },
  "weeks": [
    {
      "label": "Settimana 1",
      "days": [
        {
          "day": "Lunedì",
          "fruit": "🍎 Mela",
          "meals": [
            {
              "label": "Pranzo",
              "main": {
                "name": "Pasta integrale al pomodoro e basilico",
                "detail": "Pasta integrale, pomodoro fresco, basilico, olio evo",
                "kcal": 480,
                "ingredients": {
                  "Cereali & Legumi": ["Pasta integrale"],
                  "Verdure": ["Pomodoro", "Basilico"],
                  "Dispensa": ["Olio evo"]
                }
              },
              "alts": [
                { "name": "Riso alle verdure", "detail": "Riso basmati saltato con zucchine", "kcal": 460 },
                { "name": "Insalata di farro", "detail": "Farro con pomodorini e olive", "kcal": 450 }
              ]
            },
            {
              "label": "Cena",
              "main": {
                "name": "Filetto di orata al forno con patate",
                "detail": "Orata, patate a fette, rosmarino, olio",
                "kcal": 520,
                "ingredients": {
                  "Carne & Pesce": ["Orata"],
                  "Verdure": ["Patate", "Rosmarino"],
                  "Dispensa": ["Olio evo"]
                }
              },
              "alts": [
                { "name": "Frittata di zucchine", "detail": "Uova e zucchine trifolate", "kcal": 480 },
                { "name": "Tofu alla piastra con verdure", "detail": "Tofu marinato con verdure miste", "kcal": 450 }
              ]
            }
          ]
        }
      ]
    }
  ]
}`;
  }

  if (lang === 'es') {
    return `Actúa como nutricionista y chef experto. Diseña un plan semanal de comidas familiar de ${weeks} semana(s), estilo "${dietName}" con aproximadamente ${kcal} kcal diarias estimadas (incluyendo un desayuno de ~300 kcal).
${notes ? `Requisitos y notas adicionales: ${notes}\n` : ''}
Reglas obligatorias de estructura:
1. Cada semana ("weeks") tiene una etiqueta ("label", ej. "Semana 1") y exactamente 7 días ("days", de Lunes a Domingo).
2. Cada día tiene el nombre del día ("day"), una fruta recomendada con emoji ("fruit", ej. "🍎 Manzana"), y 2 comidas: "Almuerzo" y "Cena" ("meals").
3. Para cada comida:
   - "label": "Almuerzo" o "Cena"
   - "main": plato principal con "name", "detail", "kcal" estimados e "ingredients" agrupados en categorías: "${mainCategories}".
   - "alts": array con exactamente 2 alternativas, cada una con "name", "detail" y "kcal".
4. Incluye ingredientes básicos comunes en "baseIngredients" bajo "${pantryCat}".

REQUISITO FUNDAMENTAL DE SALIDA:
Responde EXCLUSIVAMENTE con código JSON válido. NO uses bloques markdown (NO uses \`\`\`json ni \`\`\`), NO agregues comentarios, saludos ni explicaciones. La respuesta DEBE empezar con { y terminar con } para ser directamente procesada por JSON.parse().`;
  }

  if (lang === 'fr') {
    return `Agis en tant que nutritionniste et chef cuisinier. Crée un plan de repas familial de ${weeks} semaine(s), style "${dietName}" d'environ ${kcal} kcal estimées par jour (petit-déjeuner de ~300 kcal inclus).
${notes ? `Préférences et allergies : ${notes}\n` : ''}
Règles strictes de structure :
1. Chaque semaine ("weeks") comporte un libellé ("label", ex. "Semaine 1") et exactement 7 jours ("days", du Lundi au Dimanche).
2. Chaque jour comprend le nom du jour ("day"), un fruit conseillé avec emoji ("fruit", ex. "🍎 Pomme"), et 2 repas : "Déjeuner" et "Dîner" ("meals").
3. Pour chaque repas :
   - "label": "Déjeuner" ou "Dîner"
   - "main": plat principal avec "name", "detail", calories estimées "kcal" et "ingredients" classés dans : "${mainCategories}".
   - "alts": exactement 2 alternatives, avec "name", "detail" et "kcal".
4. Inclus les ingrédients de base dans "baseIngredients" sous "${pantryCat}".

EXIGENCE CRUCIALE DE SORTIE :
Réponds EXCLUSIVEMENT avec le code JSON valide. N'utilise AUCUN bloc markdown (PAS de \`\`\`json ni de \`\`\`), AUCUNE salutation ni texte introductif. La réponse DOIT commencer par { et finir par } afin d'être directement analysée par JSON.parse().`;
  }

  if (lang === 'de') {
    return `Agiere als professioneller Ernährungsberater und Koch. Erstelle einen Menüplan für ${weeks} Woche(n), Ernährungsform "${dietName}" mit ca. ${kcal} geschätzten kcal pro Tag (inklusive Frühstück von ~300 kcal).
${notes ? `Besondere Wünsche oder Unverträglichkeiten: ${notes}\n` : ''}
Vorgegebene Struktur:
1. Jede Woche ("weeks") hat eine Bezeichnung ("label", z. B. "Woche 1") und genau 7 Tage ("days", Montag bis Sonntag).
2. Jeder Tag hat den Wochentagsnamen ("day"), ein empfohlenes Obst mit Emoji ("fruit", z. B. "🍎 Apfel") und 2 Mahlzeiten: "Mittagessen" und "Abendessen" ("meals").
3. Für jede Mahlzeit:
   - "label": "Mittagessen" oder "Abendessen"
   - "main": Hauptgericht mit "name", "detail", "kcal" und "ingredients" gruppiert nach: "${mainCategories}".
   - "alts": genau 2 Alternativgerichte mit "name", "detail" und "kcal".
4. Basis-Vorratszutaten werden unter "baseIngredients" in "${pantryCat}" definiert.

AUSGABE-VORGABE:
Antworte AUSSCHLIESSLICH mit gültigem JSON. Verwende KEINE Markdown-Codeblöcke (KEIN \`\`\`json oder \`\`\`), keine Einleitung, Erklärungen oder Grußformeln. Die Ausgabe MUSS direkt mit { beginnen und mit } enden.`;
  }

  // Default: English
  return `Act as an expert nutritionist and professional chef. Create a family meal plan for ${weeks} week(s), with a "${dietName}" diet style and approximately ${kcal} estimated kcal/day (including a ~300 kcal breakfast).
${notes ? `Additional preferences or allergies: ${notes}\n` : ''}
Mandatory structure rules:
1. Each week in "weeks" has a "label" (e.g. "Week 1") and exactly 7 days ("days", Monday to Sunday).
2. Each day has "day", a recommended fruit with emoji ("fruit", e.g. "🍎 Apple"), and 2 meals: "Lunch" and "Dinner" ("meals").
3. For each meal:
   - "label": "Lunch" or "Dinner"
   - "main": main dish with "name", brief "detail", estimated "kcal", and "ingredients" categorized into: "${mainCategories}".
   - "alts": exactly 2 alternatives with "name", "detail", and "kcal".
4. Include common pantry essentials in "baseIngredients" under "${pantryCat}".

MANDATORY OUTPUT REQUIREMENT:
Respond ONLY with valid JSON. Do NOT use markdown code fences (NO \`\`\`json or \`\`\`), do NOT include any introductory or concluding text, explanations or greetings. The output MUST start directly with { and end with } so it can be parsed immediately by JSON.parse().

Expected JSON structure example:
{
  "baseIngredients": {
    "${pantryCat}": ["Extra virgin olive oil", "Salt", "Garlic", "Lemon"]
  },
  "weeks": [
    {
      "label": "Week 1",
      "days": [
        {
          "day": "Monday",
          "fruit": "🍎 Apple",
          "meals": [
            {
              "label": "Lunch",
              "main": {
                "name": "Whole wheat pasta with tomato & basil",
                "detail": "Whole wheat pasta, fresh tomatoes, fresh basil, extra virgin olive oil",
                "kcal": 480,
                "ingredients": {
                  "Grains & Legumes": ["Whole wheat pasta"],
                  "Vegetables": ["Tomatoes", "Fresh basil"],
                  "Pantry": ["Extra virgin olive oil"]
                }
              },
              "alts": [
                { "name": "Vegetable brown rice", "detail": "Brown rice with sauteed zucchini", "kcal": 460 },
                { "name": "Farro summer salad", "detail": "Farro with cherry tomatoes and olives", "kcal": 450 }
              ]
            },
            {
              "label": "Dinner",
              "main": {
                "name": "Baked sea bream with potatoes",
                "detail": "Sea bream fillet, sliced potatoes, rosemary, olive oil",
                "kcal": 520,
                "ingredients": {
                  "Meat & Fish": ["Sea bream fillet"],
                  "Vegetables": ["Potatoes", "Rosemary"],
                  "Pantry": ["Extra virgin olive oil"]
                }
              },
              "alts": [
                { "name": "Zucchini frittata", "detail": "Eggs and sauteed zucchini", "kcal": 480 },
                { "name": "Grilled tofu and greens", "detail": "Marinated tofu with mixed vegetables", "kcal": 450 }
              ]
            }
          ]
        }
      ]
    }
  ]
}`;
}
