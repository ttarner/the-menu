const APP_VERSION = '1.2.0';

// State
const now = new Date();
const todayJSDay = now.getDay(); // 0=Sun
const todayMenuIdx = todayJSDay === 0 ? 6 : todayJSDay - 1; // Mon=0..Sun=6
let activeSlot = todayMenuIdx; // 0=Mon .. 6=Sun, matches container position
let checkedMeals = JSON.parse(localStorage.getItem('checkedMeals') || '{}');
let checkedShop = JSON.parse(localStorage.getItem('checkedShop') || '{}');

function getActiveWeekIndex() {
  const total = getWeekCount();
  const baseWeek = getWeekIndex();
  return ((baseWeek + currentWeekOffset) % total + total) % total;
}

function getWeekData() {
  return WEEKS[getActiveWeekIndex()] || WEEKS[0];
}

// Compute date for a given slot (menuIdx) and week offset
function dateForSlot(slot) {
  const d = new Date(now);
  d.setDate(d.getDate() + (slot - todayMenuIdx) + currentWeekOffset * 7);
  return d;
}

function formatSlotDate(slot) {
  return formatDateLocale(dateForSlot(slot));
}

function buildDayNav(animate) {
  const nav = document.getElementById('day-nav');
  nav.innerHTML = '';
  const daysShort = t('daysShort');
  for (let slot = 0; slot < 7; slot++) {
    const jsDay = slot === 6 ? 0 : slot + 1;
    const isToday = slot === todayMenuIdx && currentWeekOffset === 0;
    const btn = document.createElement('button');
    btn.className = 'day-btn' + (slot === activeSlot ? ' active' : '') + (isToday ? ' today' : '');
    btn.innerHTML = `<span class="day-short">${daysShort[jsDay]}</span><span class="day-num">${formatSlotDate(slot)}</span>`;
    btn.onclick = () => selectDay(slot);
    nav.appendChild(btn);
  }
  // Build sliding pill with white label overlay
  const pill = document.createElement('div');
  pill.className = 'day-nav-pill';
  const labelsContainer = document.createElement('div');
  labelsContainer.className = 'day-nav-pill-labels';
  pill.appendChild(labelsContainer);
  nav.appendChild(pill);

  // Position pill and labels after layout
  requestAnimationFrame(() => {
    const buttons = nav.querySelectorAll('.day-btn:not(.day-nav-pill-labels .day-btn)');
    buttons.forEach((btn) => {
      const clone = btn.cloneNode(true);
      clone.style.left = btn.offsetLeft + 'px';
      clone.style.width = btn.offsetWidth + 'px';
      clone.onclick = null;
      labelsContainer.appendChild(clone);
    });
    setPillPosition(buttons[activeSlot].offsetLeft, buttons[activeSlot].offsetWidth, !animate);
  });
  scrollActiveNavIntoView();
}

function setPillPosition(x, w, instant) {
  const pill = document.querySelector('.day-nav-pill');
  const inner = pill?.querySelector('.day-nav-pill-labels');
  if (!pill || !inner) return;
  if (instant) {
    pill.style.transition = 'none';
    inner.style.transition = 'none';
  }
  pill.style.width = w + 'px';
  pill.style.transform = `translateX(${x}px)`;
  inner.style.transform = `translateX(${-x}px)`;
  if (instant) {
    requestAnimationFrame(() => {
      pill.style.transition = '';
      inner.style.transition = '';
    });
  }
}

function movePillWithSwipe(dx) {
  const nav = document.getElementById('day-nav');
  if (!nav) return;

  const buttons = nav.querySelectorAll('.day-btn');
  const currentBtn = buttons[activeSlot];
  if (!currentBtn) return;

  const progress = Math.max(-1, Math.min(1, -dx / window.innerWidth));

  const targetSlot = progress > 0
    ? Math.min(activeSlot + 1, 6)
    : Math.max(activeSlot - 1, 0);
  const targetBtn = buttons[targetSlot];
  if (!targetBtn) return;

  const p = Math.abs(progress);
  const x = currentBtn.offsetLeft + (targetBtn.offsetLeft - currentBtn.offsetLeft) * p;
  const w = currentBtn.offsetWidth + (targetBtn.offsetWidth - currentBtn.offsetWidth) * p;

  const pill = document.querySelector('.day-nav-pill');
  const inner = pill?.querySelector('.day-nav-pill-labels');
  if (!pill || !inner) return;
  pill.style.transform = `translateX(${x}px)`;
  pill.style.width = `${w}px`;
  inner.style.transform = `translateX(${-x}px)`;
}

function scrollActiveNavIntoView() {
  const wrap = document.querySelector('.day-nav-wrap');
  const active = wrap && wrap.querySelector('.day-btn.active');
  if (active) {
    active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function selectDay(slot) {
  activeSlot = slot;
  slideToSlot(slot, true);
  const nav = document.getElementById('day-nav');
  const buttons = nav.querySelectorAll('.day-btn:not(.day-nav-pill-labels .day-btn)');
  buttons.forEach((btn, i) => btn.classList.toggle('active', i === slot));
  const btn = buttons[slot];
  if (btn) setPillPosition(btn.offsetLeft, btn.offsetWidth, false);
}

function slideToSlot(slot, animate) {
  const container = document.getElementById('day-views-container');
  if (animate) {
    container.classList.add('animating');
  } else {
    container.classList.remove('animating');
  }
  container.style.transform = `translateX(${-slot * 100}%)`;
  if (animate) {
    const onEnd = () => {
      container.classList.remove('animating');
      container.removeEventListener('transitionend', onEnd);
    };
    container.addEventListener('transitionend', onEnd);
  }
  document.querySelector('main').scrollTop = 0;
}

function buildDayViews() {
  const container = document.getElementById('day-views-container');
  container.innerHTML = '';
  const weekData = getWeekData();

  for (let menuIdx = 0; menuIdx < 7; menuIdx++) {
    const dayData = weekData.days[menuIdx];
    const view = document.createElement('div');
    view.className = 'day-view';
    view.id = 'day-view-' + menuIdx;

    const totalKcal = dayData.meals.reduce((s, m) => s + m.main.kcal, 0) + 300;
    const pct = Math.min(100, Math.round(totalKcal / 1600 * 100));

    view.innerHTML = `
      <div class="day-title">${dayData.day} <span>—</span></div>
      <div class="day-meta">${weekData.label}</div>
      <div class="fruit-pill"><span class="fruit-icon">${dayData.fruit.split(' ')[0]}</span><span>${dayData.fruit.replace(/^\S+\s/, '')}</span></div>
      <div class="kcal-bar">
        <div>
          <div class="kcal-label">${t('estimatedCal')}</div>
          <div class="kcal-value">~${totalKcal} kcal</div>
        </div>
        <div style="text-align:right">
          <div class="kcal-sub">${pct}% ${t('pctOfTarget')}</div>
          <div class="kcal-sub">${t('goal')}</div>
        </div>
      </div>
      <div class="kcal-track" style="margin:-10px 0 20px"><div class="kcal-fill" style="width:${pct}%"></div></div>
      ${dayData.meals.map((meal, mIdx) => {
        const key = `${getActiveWeekIndex()}-${menuIdx}-${mIdx}`;
        const isDone = !!checkedMeals[key];
        return `
        <div class="meal-card${isDone ? ' done' : ''}" id="mcard-${key}">
          <div class="meal-header">
            <span class="meal-type">${meal.label}</span>
          </div>
          <div class="meal-main">
            <div class="meal-name">${meal.main.name}</div>
            <div class="meal-detail">${meal.main.detail}</div>
            <div class="meal-kcal">~${meal.main.kcal} kcal</div>
          </div>
          <div class="alt-toggle">
            <button class="alt-toggle-btn" id="altbtn-${key}" onclick="toggleAlts('${key}')">
              ${t('altsToggle')} <span class="alt-arrow">▼</span>
            </button>
            <div class="alt-list" id="altlist-${key}">
              ${meal.alts.map((a, ai) => `
                <div class="alt-item">
                  <div class="alt-item-num">${t('optionN')} ${ai+2}</div>
                  <div class="alt-item-name">${a.name}</div>
                  <div class="alt-item-detail">${a.detail}</div>
                  <div class="meal-kcal">~${a.kcal} kcal</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>`;
      }).join('')}
    `;
    container.appendChild(view);
  }
}

function toggleMeal(key) {
  checkedMeals[key] = !checkedMeals[key];
  localStorage.setItem('checkedMeals', JSON.stringify(checkedMeals));
  const card = document.getElementById('mcard-' + key);
  if (!card) return;
  const isDone = checkedMeals[key];
  card.classList.toggle('done', isDone);
  const btn = card.querySelector('.done-btn');
  btn.querySelector('.done-check').textContent = isDone ? '✓' : '○';
  btn.querySelector('span:last-child').textContent = isDone ? t('done') : t('markDone');
}

function toggleAlts(key) {
  const list = document.getElementById('altlist-' + key);
  const btn = document.getElementById('altbtn-' + key);
  const isOpen = list.classList.contains('open');
  list.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
}

// Build ingredient → count map from active weeks/days
function buildIngredientCounts(days) {
  const counts = {};
  const weeksNeeded = getShopWeeksNeeded(days);

  weeksNeeded.forEach(({ weekIndex }) => {
    WEEKS[weekIndex].days.forEach(dayData => {
      dayData.meals.forEach(meal => {
        const mealName = meal.main.name;
        const ingData = meal.main.ingredients;
        if (!ingData) return;
        Object.entries(ingData).forEach(([cat, ings]) => {
          ings.forEach(ing => {
            const key = cat + '|' + ing;
            if (!counts[key]) counts[key] = { cat, ingredient: ing, count: 0, dishes: [] };
            counts[key].count++;
            if (!counts[key].dishes.includes(mealName)) counts[key].dishes.push(mealName);
          });
        });
      });
    });
  });

  // Add base pantry items once
  if (Object.keys(counts).length > 0) {
    Object.entries(INGREDIENTS['_base']).forEach(([cat, ings]) => {
      ings.forEach(ing => {
        const key = cat + '|' + ing;
        if (!counts[key]) counts[key] = { cat, ingredient: ing, count: 0, dishes: [] };
      });
    });
  }

  return counts;
}

let shopDays = 7;

function setShopDays(n) {
  shopDays = n;
  document.querySelectorAll('.range-pill').forEach(p => {
    p.classList.toggle('active', parseInt(p.dataset.days) === n);
  });
  buildShoppingList();
}

function getShopWeeksNeeded(days) {
  const result = [];
  const baseWeekIdx = getActiveWeekIndex();
  const total = getWeekCount();
  const weeksNeeded = Math.ceil(days / 7);
  for (let i = 0; i < weeksNeeded; i++) {
    const wi = (baseWeekIdx + i) % total;
    result.push({ weekIndex: wi, weekLabel: WEEKS[wi]?.label || `Settimana ${wi + 1}` });
  }
  return result;
}

function buildShoppingList() {
  const container = document.getElementById('shop-list');
  container.innerHTML = '';

  const weeksNeeded = getShopWeeksNeeded(shopDays);
  const infoEl = document.getElementById('shop-range-info');

  if (weeksNeeded.length > 1) {
    const labels = weeksNeeded.map(w => w.weekLabel).join(', ');
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + shopDays - 1);
    const endStr = formatDateLocale(endDate);
    infoEl.textContent = `${t('ingredientsFor')} ${shopDays} ${t('nDays')} (${t('until')} ${endStr}) — ${labels}`;
    infoEl.classList.add('visible');
  } else {
    infoEl.classList.remove('visible');
  }

  const counts = buildIngredientCounts(shopDays);
  const catOrder = t('catOrder');

  // Group by category
  const byCat = {};
  Object.values(counts).forEach(({ cat, ingredient, count, dishes }) => {
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push({ ingredient, count, dishes });
  });

  // Add fruit category from week data
  const fruitCat = catOrder[catOrder.length - 1]; // Fruit category name
  const fruitSet = new Set();
  weeksNeeded.forEach(({ weekIndex }) => {
    WEEKS[weekIndex].days.forEach(d => {
      const name = d.fruit.replace(/^\S+\s/, '').replace(/\s*o\s+.*/i, '').trim();
      fruitSet.add(name);
    });
  });
  if (fruitSet.size) byCat[fruitCat] = [...fruitSet].map(f => ({ ingredient: f, count: 0, dishes: [] }));

  catOrder.forEach(cat => {
    if (!byCat[cat] || !byCat[cat].length) return;
    const items = byCat[cat].sort((a, b) => b.count - a.count || a.ingredient.localeCompare(b.ingredient));
    const catDiv = document.createElement('div');
    catDiv.className = 'shop-cat';
    const safecat = cat.replace(/[^a-zA-Z0-9]/g, '_');
    catDiv.innerHTML = `<div class="shop-cat-header">${cat}</div><div class="shop-items" id="shopcat-${safecat}"></div>`;
    container.appendChild(catDiv);
    const itemsDiv = catDiv.querySelector('.shop-items');

    items.forEach(({ ingredient, count, dishes }) => {
      const key = `shop-${shopDays}-${cat}-${ingredient}`;
      const isChecked = !!checkedShop[key];
      const div = document.createElement('div');
      div.className = 'shop-item' + (isChecked ? ' checked' : '');

      const countBadge = count > 1
        ? `<span class="shop-count" title="${dishes.join(', ')}">${count} ${t('dishes')}</span>`
        : '';

      div.innerHTML = `
        <div class="shop-check">${isChecked ? '✓' : ''}</div>
        <div class="shop-item-name">${ingredient}</div>
        ${countBadge}`;
      div.onclick = () => toggleShop(key, div);
      itemsDiv.appendChild(div);
    });
  });
}

function toggleShop(key, el) {
  checkedShop[key] = !checkedShop[key];
  localStorage.setItem('checkedShop', JSON.stringify(checkedShop));
  el.classList.toggle('checked', !!checkedShop[key]);
  el.querySelector('.shop-check').textContent = checkedShop[key] ? '✓' : '';
}

function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('nav-' + view).classList.add('active');
  document.body.classList.toggle('view-shopping', view === 'shopping');
  if (view === 'shopping') buildShoppingList();
}

function updateHeader() {
  const wi = getActiveWeekIndex();
  const weekBadge = document.getElementById('week-badge');
  const weekLabel = WEEKS[wi].label;
  const compactWeekLabel = weekLabel.split(' ').pop();
  if (weekBadge) {
    weekBadge.textContent = compactWeekLabel;
    weekBadge.setAttribute('aria-label', `${t('weekLabel')} ${compactWeekLabel}`);
    weekBadge.title = weekLabel;
  }
  const days = t('days');
  const label = `${days[todayJSDay === 0 ? 0 : todayJSDay].toLowerCase()} ${formatDateLocale(now)} · v${APP_VERSION}`;
  document.getElementById('today-label').textContent = label;

  // Banner for past / future week
  const banner = document.getElementById('week-offset-banner');
  if (!banner) return;
  if (currentWeekOffset === 0) {
    banner.className = 'week-offset-banner';
    banner.innerHTML = '';
    return;
  }
  const offsetDays = currentWeekOffset * 7;
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + daysToMonday + offsetDays);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const isPast = currentWeekOffset < 0;
  banner.className = 'week-offset-banner visible ' + (isPast ? 'past' : 'future');
  banner.innerHTML = `
    <span class="banner-arrow">${isPast ? '←' : '→'}</span>
    <span>${isPast ? t('pastWeek') : t('futureWeek')} · ${formatDateLocale(weekStart)}–${formatDateLocale(weekEnd)}</span>
    <button class="banner-back" onclick="changeWeek(${-currentWeekOffset})">${t('today')}</button>
  `;
}

function changeWeek(delta) {
  currentWeekOffset += delta;
  if (currentWeekOffset === 0) activeSlot = todayMenuIdx;
  updateHeader();
  buildDayViews();
  slideToSlot(activeSlot, false);
  buildDayNav();
}

function shareShoppingList() {
  const counts = buildIngredientCounts(shopDays);
  const byCat = {};
  Object.values(counts).forEach(({ cat, ingredient }) => {
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push(ingredient);
  });

  // Add fruit
  const catOrder = t('catOrder');
  const fruitCat = catOrder[catOrder.length - 1];
  const weeksNeeded = getShopWeeksNeeded(shopDays);
  const fruitSet = new Set();
  weeksNeeded.forEach(({ weekIndex }) => {
    WEEKS[weekIndex].days.forEach(d => {
      const name = d.fruit.replace(/^\S+\s/, '').replace(/\s*o\s+.*/i, '').trim();
      fruitSet.add(name);
    });
  });
  if (fruitSet.size) byCat[fruitCat] = [...fruitSet];

  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + shopDays - 1);
  let text = `🛒 ${t('shoppingTitle')}\n📅 ${formatDateLocale(now)}–${formatDateLocale(endDate)}\n\n`;

  catOrder.forEach(cat => {
    if (!byCat[cat]?.length) return;
    text += `${cat}\n`;
    byCat[cat].forEach(ing => { text += `☐ ${ing}\n`; });
    text += '\n';
  });

  if (navigator.share) {
    navigator.share({ title: t('shoppingTitle'), text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text)
      .then(() => showToast(t('listCopied')))
      .catch(() => showToast(t('copyFailed')));
  }
}

function showToast(msg) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function toggleKcal() {
  const show = document.body.classList.toggle('show-kcal');
  localStorage.setItem('showKcal', show ? '1' : '0');
}

function toggleDark() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark ? '1' : '0');
  document.getElementById('toggle-knob').textContent = isDark ? '🌙' : '☀️';
  updateThemeToggleState(isDark);
}

function updateThemeToggleState(isDark) {
  const toggle = document.getElementById('dark-toggle');
  const stateLabel = document.getElementById('dark-toggle-state');
  if (!toggle || !stateLabel) return;
  toggle.setAttribute('aria-checked', isDark ? 'true' : 'false');
  stateLabel.textContent = isDark ? t('darkModeOn') : t('darkModeOff');
}

// Swipe navigation
function initSwipe() {
  const swipeTarget = document.getElementById('view-menu');
  const container = document.getElementById('day-views-container');
  let startX = 0;
  let startY = 0;
  let tracking = false;
  let dirLocked = null;
  const LOCK_THRESHOLD = 4;

  swipeTarget.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
    dirLocked = null;
    container.classList.remove('animating');
    const pill = document.querySelector('.day-nav-pill');
    const pillInner = pill?.querySelector('.day-nav-pill-labels');
    if (pill) pill.style.transition = 'none';
    if (pillInner) pillInner.style.transition = 'none';
  }, { passive: true });

  swipeTarget.addEventListener('touchmove', (e) => {
    if (!tracking) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    if (!dirLocked) {
      if (Math.abs(dx) > LOCK_THRESHOLD || Math.abs(dy) > LOCK_THRESHOLD) {
        dirLocked = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      } else {
        return;
      }
    }

    if (dirLocked === 'v') return;

    e.preventDefault();
    const baseOffset = -activeSlot * 100;
    const pxToPercent = (dx / window.innerWidth) * 100;
    container.style.transform = `translateX(${baseOffset + pxToPercent}%)`;

    movePillWithSwipe(dx);
  }, { passive: false });

  swipeTarget.addEventListener('touchend', (e) => {
    const pill = document.querySelector('.day-nav-pill');
    const pillInner = pill?.querySelector('.day-nav-pill-labels');
    if (pill) pill.style.transition = '';
    if (pillInner) pillInner.style.transition = '';

    if (!tracking || dirLocked !== 'h') {
      tracking = false;
      return;
    }
    tracking = false;
    const dx = e.changedTouches[0].clientX - startX;
    const threshold = window.innerWidth * 0.25;

    if (Math.abs(dx) > threshold) {
      const direction = dx > 0 ? -1 : 1;
      navigateSwipe(direction);
    } else {
      slideToSlot(activeSlot, true);
      const nav = document.getElementById('day-nav');
      const btn = nav.querySelectorAll('.day-btn')[activeSlot];
      if (btn) setPillPosition(btn.offsetLeft, btn.offsetWidth, false);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    slideToSlot(activeSlot, false);
  });
}

function navigateSwipe(direction) {
  const newSlot = activeSlot + direction;

  if (newSlot < 0 || newSlot > 6) {
    const container = document.getElementById('day-views-container');
    container.classList.add('animating');
    container.style.transform = `translateX(${-newSlot * 100}%)`;

    const onEnd = () => {
      container.removeEventListener('transitionend', onEnd);
      container.classList.remove('animating');

      if (newSlot < 0) {
        currentWeekOffset--;
        activeSlot = 6;
      } else {
        currentWeekOffset++;
        activeSlot = 0;
      }
      updateHeader();
      buildDayViews();
      slideToSlot(activeSlot, false);
      buildDayNav();
      document.querySelector('main').scrollTop = 0;
    };
    container.addEventListener('transitionend', onEnd);
  } else {
    activeSlot = newSlot;
    slideToSlot(activeSlot, true);
    buildDayNav();
  }
}

// --- MENU MANAGEMENT MODAL ---

let currentShareUrl = '';

function openMenuModal(initialTab = 'prompt') {
  const modal = document.getElementById('menu-modal');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  switchModalTab(initialTab);
  updatePromptPreview();
  renderPresetButtons();
  prepareShareTab();
  clearImportError();
}

function closeMenuModal() {
  const modal = document.getElementById('menu-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  clearImportError();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenuModal();
});

function switchModalTab(tabId) {
  const tabs = ['prompt', 'import', 'share'];
  tabs.forEach(id => {
    const tabBtn = document.getElementById(`tab-${id}-btn`);
    const pane = document.getElementById(`tab-${id}`);
    if (tabBtn) {
      tabBtn.classList.toggle('active', id === tabId);
      tabBtn.setAttribute('aria-selected', id === tabId ? 'true' : 'false');
    }
    if (pane) {
      pane.classList.toggle('active', id === tabId);
    }
  });

  if (tabId === 'share') {
    prepareShareTab();
  }
}

// AI Prompt Tab logic
function updatePromptPreview() {
  const dietKey = document.getElementById('prompt-diet-select')?.value || 'mediterranean';
  const weeks = parseInt(document.getElementById('prompt-weeks-select')?.value || '3', 10);
  const kcal = parseInt(document.getElementById('prompt-cal-input')?.value || '1600', 10);
  const notes = document.getElementById('prompt-notes-input')?.value.trim() || '';

  const promptText = buildAiPromptTemplate({ weeks, dietKey, kcal, notes });
  const preview = document.getElementById('prompt-preview-area');
  if (preview) {
    preview.value = promptText;
  }
}

function copyAiPrompt() {
  const preview = document.getElementById('prompt-preview-area');
  if (!preview) return;
  navigator.clipboard.writeText(preview.value)
    .then(() => showToast(t('promptCopied')))
    .catch(() => {
      preview.select();
      document.execCommand('copy');
      showToast(t('promptCopied'));
    });
}

// Import Tab logic
function clearImportError() {
  const errEl = document.getElementById('import-error-msg');
  if (errEl) errEl.textContent = '';
}

function showImportError(msg) {
  const errEl = document.getElementById('import-error-msg');
  if (errEl) errEl.textContent = msg;
}

function handleFileUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target.result;
    document.getElementById('import-json-area').value = content;
    submitImportJson();
  };
  reader.onerror = () => {
    showImportError(t('importError'));
  };
  reader.readAsText(file);
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      document.getElementById('import-json-area').value = text;
      clearImportError();
    }
  } catch (err) {
    showToast(t('copyFailed'));
  }
}

function submitImportJson() {
  clearImportError();
  const raw = document.getElementById('import-json-area')?.value.trim();
  if (!raw) {
    showImportError(t('importError'));
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    saveCustomMenu(parsed);
    refreshAppAfterMenuChange();
    showToast(t('menuImported'));
    closeMenuModal();
    document.getElementById('import-json-area').value = '';
  } catch (err) {
    showImportError(`${t('importError')}: ${err.message}`);
  }
}

function renderPresetButtons() {
  const grid = document.getElementById('presets-grid');
  if (!grid) return;
  grid.innerHTML = '';
  PRESET_MENUS.forEach(preset => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.type = 'button';
    btn.innerHTML = `<strong>${preset.title}</strong><br><small>${preset.weeks} ${t('weekLabel').toLowerCase()}</small>`;
    btn.onclick = async () => {
      try {
        await loadPresetMenu(preset.file);
        refreshAppAfterMenuChange();
        showToast(t('presetLoaded'));
        closeMenuModal();
      } catch (err) {
        showToast(t('error') + ': ' + err.message);
      }
    };
    grid.appendChild(btn);
  });
}

function refreshAppAfterMenuChange() {
  currentWeekOffset = 0;
  activeSlot = todayMenuIdx;
  updateHeader();
  buildDayViews();
  slideToSlot(activeSlot, false);
  buildDayNav();
  if (document.getElementById('view-shopping')?.classList.contains('active')) {
    buildShoppingList();
  }
}

// Share Tab logic
async function prepareShareTab() {
  const shareInput = document.getElementById('share-link-input');
  if (!shareInput) return;
  try {
    shareInput.value = t('loading');
    const jsonStr = JSON.stringify(CURRENT_MENU_DATA || { weeks: WEEKS, baseIngredients: INGREDIENTS['_base'] });
    const b64 = await compressMenu(jsonStr);
    const url = `${window.location.origin}${window.location.pathname}#menu=${b64}`;
    currentShareUrl = url;
    shareInput.value = url;
    const nativeBtn = document.getElementById('native-share-btn');
    if (nativeBtn && navigator.share) {
      nativeBtn.style.display = 'inline-flex';
    }
  } catch (err) {
    console.error('Failed to prepare share link:', err);
    shareInput.value = window.location.href;
  }
}

function copyShareLink() {
  const shareInput = document.getElementById('share-link-input');
  if (!shareInput || !currentShareUrl) return;
  navigator.clipboard.writeText(currentShareUrl)
    .then(() => showToast(t('linkCopied')))
    .catch(() => {
      shareInput.select();
      document.execCommand('copy');
      showToast(t('linkCopied'));
    });
}

function shareMenuLink() {
  if (navigator.share && currentShareUrl) {
    navigator.share({
      title: t('appTitle'),
      text: t('shareMenuTitle'),
      url: currentShareUrl
    }).catch(() => {});
  } else {
    copyShareLink();
  }
}

function downloadMenuJson() {
  const data = CURRENT_MENU_DATA || { weeks: WEEKS, baseIngredients: INGREDIENTS['_base'] };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'menu.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function copyMenuJson() {
  const data = CURRENT_MENU_DATA || { weeks: WEEKS, baseIngredients: INGREDIENTS['_base'] };
  const jsonStr = JSON.stringify(data, null, 2);
  navigator.clipboard.writeText(jsonStr)
    .then(() => showToast(t('jsonCopied')))
    .catch(() => showToast(t('copyFailed')));
}

// Init
async function initApp() {
  try {
    await loadMenu();

    const savedDark = localStorage.getItem('darkMode');
    const prefersDark = savedDark !== null ? savedDark === '1' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.add('dark');
      document.getElementById('toggle-knob').textContent = '🌙';
    }
    updateThemeToggleState(prefersDark);
    if (localStorage.getItem('showKcal') === '1') {
      document.body.classList.add('show-kcal');
    }

    document.documentElement.lang = currentLang;
    document.title = t('appTitle');
    applyStaticTranslations();

    activeSlot = todayMenuIdx;
    updateHeader();
    buildDayViews();
    slideToSlot(activeSlot, false);
    buildDayNav();
    initSwipe();

    if (sharedMenuLoadedToast) {
      showToast(t('sharedMenuLoaded'));
    }

    const modal = document.getElementById('menu-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeMenuModal();
      });
    }

    // Prevent pinch zoom on iOS (ignores user-scalable=no)
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    // Register Service Worker for offline use
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  } catch (err) {
    document.getElementById('today-label').textContent = `${t('error')}: ${err.message}`;
  }
}

initApp();
