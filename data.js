// Preset sample menus
const PRESET_MENUS = [
  { id: 'it', file: 'menu.json', title: 'Italiano (Classico)', weeks: 3 },
  { id: 'en', file: 'menu.en.json', title: 'English (Balanced)', weeks: 3 },
  { id: 'es', file: 'menu.es.json', title: 'Español (Mediterráneo)', weeks: 3 },
  { id: 'fr', file: 'menu.fr.json', title: 'Français (Traditionnel)', weeks: 3 },
  { id: 'de', file: 'menu.de.json', title: 'Deutsch (Ausgewogen)', weeks: 3 }
];

let currentWeekOffset = 0;
let WEEKS = [];
let INGREDIENTS = {};
let CURRENT_MENU_DATA = null;
let sharedMenuLoadedToast = false;

// Dynamic week calculation based on active menu's week count
function getWeekCount() {
  return Array.isArray(WEEKS) && WEEKS.length > 0 ? WEEKS.length : 1;
}

function getWeekIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.floor((now - start) / (7 * 24 * 3600 * 1000));
  const total = getWeekCount();
  return ((weekNum % total) + total) % total;
}

// Menu schema validation
function validateMenuData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Il menù deve essere un oggetto JSON valido.');
  }
  if (!Array.isArray(data.weeks) || data.weeks.length === 0) {
    throw new Error('Il menù deve contenere un array "weeks" con almeno una settimana.');
  }
  data.weeks.forEach((week, wIdx) => {
    if (!week.label) {
      week.label = `Settimana ${wIdx + 1}`;
    }
    if (!Array.isArray(week.days) || week.days.length !== 7) {
      throw new Error(`La settimana "${week.label}" deve contenere esattamente 7 giorni.`);
    }
    week.days.forEach((day, dIdx) => {
      if (!day.day) {
        throw new Error(`Giorno ${dIdx + 1} nella settimana "${week.label}" privo di nome.`);
      }
      if (!day.fruit) day.fruit = '🍎 Frutta';
      if (!Array.isArray(day.meals) || day.meals.length === 0) {
        throw new Error(`Il giorno "${day.day}" nella settimana "${week.label}" non ha pasti.`);
      }
      day.meals.forEach((meal, mIdx) => {
        if (!meal.label || !meal.main || !meal.main.name) {
          throw new Error(`Pasto ${mIdx + 1} del giorno "${day.day}" incompleto (manca label o main.name).`);
        }
        if (typeof meal.main.kcal !== 'number') meal.main.kcal = 450;
        if (!Array.isArray(meal.alts)) meal.alts = [];
      });
    });
  });
  if (!data.baseIngredients || typeof data.baseIngredients !== 'object') {
    data.baseIngredients = { Dispensa: ['Olio evo', 'Sale', 'Aglio'] };
  }
  return true;
}

// Build ingredient maps and store active data
function applyMenuData(data) {
  validateMenuData(data);
  CURRENT_MENU_DATA = data;
  WEEKS = data.weeks;

  INGREDIENTS = {};
  WEEKS.forEach(week => {
    week.days.forEach(day => {
      day.meals.forEach(meal => {
        if (meal.main.ingredients) {
          INGREDIENTS[meal.main.name] = meal.main.ingredients;
        }
      });
    });
  });

  INGREDIENTS['_base'] = data.baseIngredients || {};
}

// Compress JSON string to base64url using native CompressionStream('deflate-raw')
async function compressMenu(jsonStr) {
  const minified = JSON.stringify(JSON.parse(jsonStr));
  const cs = new CompressionStream('deflate-raw');
  const writer = cs.writable.getWriter();
  writer.write(new TextEncoder().encode(minified));
  writer.close();

  const chunks = [];
  const reader = cs.readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
  const buf = new Uint8Array(totalLen);
  let offset = 0;
  for (const c of chunks) {
    buf.set(c, offset);
    offset += c.length;
  }

  let binary = '';
  for (let i = 0; i < buf.length; i++) {
    binary += String.fromCharCode(buf[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Decompress base64url to JSON object using native DecompressionStream('deflate-raw')
async function decompressMenu(b64url) {
  let base64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binary = atob(base64);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buf[i] = binary.charCodeAt(i);
  }

  const ds = new DecompressionStream('deflate-raw');
  const writer = ds.writable.getWriter();
  writer.write(buf);
  writer.close();

  const chunks = [];
  const reader = ds.readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
  const outBuf = new Uint8Array(totalLen);
  let offset = 0;
  for (const c of chunks) {
    outBuf.set(c, offset);
    offset += c.length;
  }

  const jsonStr = new TextDecoder().decode(outBuf);
  return JSON.parse(jsonStr);
}

// Check if shared menu exists in URL hash or search params
async function checkSharedMenuUrl() {
  try {
    let payload = null;
    if (window.location.hash) {
      const match = window.location.hash.match(/[#&]menu=([^&]+)/);
      if (match && match[1]) payload = match[1];
    }
    if (!payload && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('menu')) payload = params.get('menu');
    }

    if (payload) {
      const menuData = await decompressMenu(payload);
      validateMenuData(menuData);
      // Clean URL fragment / query string without page reload
      const cleanUrl = window.location.pathname + window.location.search.replace(/[?&]menu=[^&]+/, '').replace(/^&/, '?');
      history.replaceState(null, '', cleanUrl.replace(/\?$/, ''));
      return { success: true, data: menuData };
    }
  } catch (err) {
    console.error('Failed to parse shared menu URL:', err);
    return { success: false, error: err };
  }
  return null;
}

// Save active menu to localStorage
function saveCustomMenu(data) {
  validateMenuData(data);
  applyMenuData(data);
  localStorage.setItem('theMenu_customMenu', JSON.stringify(data));
}

// Load active menu (Shared URL -> localStorage -> Default preset)
async function loadMenu() {
  // 1. Shared URL
  const shared = await checkSharedMenuUrl();
  if (shared && shared.success) {
    saveCustomMenu(shared.data);
    sharedMenuLoadedToast = true;
    return;
  }

  // 2. Custom menu from localStorage
  const saved = localStorage.getItem('theMenu_customMenu');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      applyMenuData(parsed);
      return;
    } catch (e) {
      console.warn('Saved menu was invalid, resetting to default', e);
      localStorage.removeItem('theMenu_customMenu');
    }
  }

  // 3. Fallback to default preset (menu.json)
  const resp = await fetch('menu.json');
  const data = await resp.json();
  applyMenuData(data);
}

// Load a bundled preset file
async function loadPresetMenu(file) {
  const resp = await fetch(file);
  const data = await resp.json();
  saveCustomMenu(data);
  return data;
}
