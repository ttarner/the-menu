# Agent Instructions

This repository is a small static PWA for a multilingual weekly family menu. It has no build step, no package manager, and no automated test suite. Most behavior lives in global browser scripts loaded by `index.html` in this order: `i18n.js`, `data.js`, then `app.js`.

## Repository Shape

- `index.html` defines the app shell, accessible labels, controls, and script order.
- `style.css` owns the responsive layout, dark theme, swipe/day-nav presentation, and mobile browser behavior.
- `i18n.js` owns supported languages, UI translations, date formatting, menu-file selection, and static text application.
- `data.js` owns week rotation, current week offset, loaded menu data, and the derived ingredient map.
- `app.js` owns UI rendering, state in `localStorage`, navigation, shopping-list generation, sharing, theme state, swipe handling, app init, and service-worker registration.
- `menu.json` is Italian menu content. `menu.en.json`, `menu.es.json`, `menu.fr.json`, and `menu.de.json` mirror it for translated content.
- `sw.js` owns the offline cache and network-first fetch behavior.
- `manifest.json` owns PWA metadata.

## Development Principles

- Keep changes focused. The commit history favors narrow feature, fix, and cleanup commits rather than broad rewrites.
- Preserve the static-app model. Do not add frameworks, bundlers, package managers, transpilers, or generated assets unless the user explicitly asks and the benefit is clear.
- Respect the global script contract. Functions and variables in `i18n.js` and `data.js` are used by `app.js`; preserve script order and avoid module syntax unless the whole app is intentionally migrated.
- Prefer small, direct DOM updates that match the existing style. This app currently renders most dynamic UI through plain DOM APIs and template strings.
- Use English for all code identifiers, comments, documentation, commit messages, pull request text, and agent-facing notes. User-facing translated strings and menu content are the only expected non-English repository content.
- Treat mobile Safari and narrow Android layouts as first-class. Many past fixes addressed touch gestures, viewport overflow, tap highlight, pinch zoom, sticky headers, and day-nav sizing.
- Do not leave temporary debug UI or logging behind. The history includes adding and later removing a temporary touch debug indicator.
- Avoid unrelated visual redesign. Match the warm, restrained menu-app design language and existing CSS variables.

## Feature Work

- Identify which layer changes: shell (`index.html`), styling (`style.css`), translations (`i18n.js`), menu data (`menu*.json`), app behavior (`app.js`), PWA metadata (`manifest.json`), or offline caching (`sw.js`).
- For new visible UI text, add translations for every supported language in `i18n.js`; avoid hard-coded app strings in `app.js` or `index.html` unless they are placeholders immediately replaced by `applyStaticTranslations()`.
- For language-sensitive menu content, update every `menu*.json` file together. Menus in all languages must stay aligned in dishes, products, ingredients, categories, calories, alternatives, days, and week structure; translated files should describe the same menu, not introduce language-specific substitutions.
- Keep accessibility attributes current when controls change: labels, `aria-label`, `aria-labelledby`, `role`, `aria-checked`, and screen-reader-only text should remain accurate.
- Preserve user preferences stored in `localStorage` (`lang`, `darkMode`, `showKcal`, `checkedMeals`, `checkedShop`) unless the task is specifically about changing persistence.
- When changing day navigation or swipe behavior, verify tap, swipe, week-boundary navigation, resize behavior, and vertical scrolling.
- When adding files that must work offline, add them to `ASSETS` in `sw.js` and bump the `CACHE` name.

## Bug Fixing

- Reproduce or reason from the smallest affected surface first. Many historical bug fixes were one- or two-file changes.
- Look for ID and selector mismatches between `index.html`, `i18n.js`, `style.css`, and `app.js`; recent fixes include a loading-label ID mismatch.
- For layout bugs, check both structure and CSS. Several fixes involved the interaction between `#view-menu`, `#day-views-container`, sticky areas, overflow, and touch actions.
- For iOS issues, be careful with passive event listeners, `touch-action`, `gesturestart`, `touchmove`, and `preventDefault()`.
- For service-worker or offline bugs, remember that stale caches can hide fixes. Bump `CACHE` when cached assets or cache strategy change.
- For shopping-list bugs, inspect both `buildIngredientCounts()` and `buildShoppingList()`, including fruit handling and category ordering from `t('catOrder')`.

## Menu Data Guidelines

- Preserve the existing JSON shape:
  - top-level `baseIngredients`
  - `weeks[]`
  - each week has `label` and `days[]`
  - each day has `day`, `fruit`, and `meals[]`
  - each meal has `label`, `main`, and `alts[]`
  - `main` has `name`, `detail`, `kcal`, and `ingredients`
  - alternatives have `name`, `detail`, and `kcal`
- Keep the three-week rotation intact unless the user asks to change the planning model.
- Keep main-meal ingredient categories aligned with the relevant language's `catOrder`, because the shopping list groups by translated category names.
- Keep all language menu files semantically aligned. A dish, product, ingredient, fruit, calorie value, meal alternative, or category changed in one language must be changed equivalently in every other language.
- After editing menu JSON, validate every language file parses and still has matching week/day/meal counts, meal names, ingredient sets, alternatives, calories, and category placement.

## Validation Checklist

Because there is no automated test suite, validate changes manually and with lightweight local checks:

- Parse all JSON files: `menu.json`, translated menu files, and `manifest.json`.
- Open `index.html` through a local static server, not just as a file, so `fetch()` and the service worker behave realistically.
- Check the initial load, language switcher, dark-mode toggle, day selection, previous/next week buttons, swipe navigation, shopping-list range buttons, share/copy flow, and offline-relevant assets when touched.
- Check both desktop and narrow mobile widths. Pay special attention to header controls, day-nav overflow, bottom-nav spacing, and whether text wraps cleanly.
- If service-worker behavior changed, test after unregistering or refreshing the service worker, and confirm the cache name was bumped.
- If translations changed, switch through IT, EN, ES, FR, and DE and verify labels, dates, category names, and menu loading.

## Commit Guidelines

Follow the style already present in the repository history.

- Use a short, imperative subject in sentence case, usually under 72 characters.
- Write commit subjects and bodies in English only.
- Start with a clear verb such as `Add`, `Fix`, `Remove`, `Hide`, `Move`, `Switch`, `Prevent`, `Disable`, `Scope`, `Align`, `Translate`, `Bump`, or `Use`.
- Mention the user-visible behavior or affected area, not the implementation detail alone.
- Prefer one logical change per commit. Separate data updates, UI fixes, service-worker changes, and refactors when they can stand alone.
- Before every new commit, increment the patch version in `APP_VERSION` in `app.js`. For large feature or behavior changes, increment the minor version instead.
- Use a body only when the change is broad or benefits from context. For larger features, add concise bullets describing the main capabilities or affected files.
- Good examples from this repo:
  - `Fix header control order on small screens`
  - `Add multi-language support (IT, EN, ES, FR, DE)`
  - `Bump SW cache version and add error handling to initApp`
  - `Scope day button hover style to non-touch devices only`
  - `Remove week badge from header`
- Avoid vague subjects such as `Update files`, `Fix bug`, `Changes`, or `WIP`.
- If a commit changes offline-cached assets, the subject or body should make the service-worker/cache implication clear.

## Before Finishing

- Run `git status --short` and confirm only intended files changed.
- Summarize what changed, how it was validated, and any risks that remain.
- Do not commit unless the user explicitly asks for a commit.
