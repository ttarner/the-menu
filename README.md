# The Menu 🍽️

A modern, fast, and elegant **100% client-side Progressive Web Application (PWA)** for family weekly menu planning and smart shopping list generation.

Zero build steps, zero external dependencies, no server or backend required. Host it directly on **GitHub Pages**, install it on iOS / Android / Desktop, and customize or share your meal plans freely.

---

## ✨ Features

- 📱 **Mobile-First PWA**: Installable on iOS (Safari Add to Home Screen) and Android (Chrome PWA) with full offline support via Service Worker.
- 🤖 **AI Menu Generator**: Export customized prompts in your interface language (English, Italian, Spanish, French, German) for ChatGPT, Claude, Gemini, or local LLMs to generate a compatible weekly plan formatted strictly as JSON.
- 📥 **Flexible Menu Import**:
  - Upload any `.json` file from your device.
  - Paste directly from your clipboard or edit the raw JSON in the app.
  - Choose from 5 bundled preset examples (Italian, English, Spanish, French, German).
- 🔗 **Zero-Backend URL Sharing**:
  - Share your entire weekly menu using a single compressed link (`#menu=<base64url>`).
  - Native `deflate-raw` compression keeps URLs compact and URL-fragment safe (no server limits or privacy leaks).
  - Anyone opening the link instantly imports and saves the menu in their local browser storage.
- 🛒 **Smart Shopping List**:
  - Automatically calculates ingredient quantities and aggregates ingredients across 7, 14, 21, or 28 days.
  - Categorized by department (Meat & Fish, Vegetables, Grains & Legumes, Dairy & Eggs, Pantry, Pizza, Fruit).
  - One-tap clipboard export or native device share.
- 🌓 **Warm Aesthetic & Dark Mode**:
  - Refined typography and warm parchment palette.
  - Seamless system/manual dark theme toggle with instant persistence.
- 🌐 **Multilingual Interface**:
  - Fully translated UI in English, Italian, Spanish, French, and German.
  - Changing interface language retains your loaded custom menu.

---

## 🚀 GitHub Pages Deployment

This repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`) that deploys the application automatically whenever you push to the `main` branch.

### Enabling GitHub Pages in your repository:

1. Push this repository to GitHub.
2. Go to your repository on GitHub: **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. Push a commit to `main` (or run the workflow manually under the **Actions** tab).
5. Your app will be live at `https://<your-username>.github.io/<repository-name>/`.

---

## 🤖 Generating Menus with AI

1. Tap the **⚙️ (Menu)** button in the header.
2. Select the **🤖 AI Prompt** tab.
3. Customize your dietary preference (Mediterranean, Omnivore, Vegetarian, Vegan, Keto, Gluten-Free, etc.), number of weeks, and daily calorie target.
4. Tap **📋 Copy AI Prompt**.
5. Paste the prompt into ChatGPT, Claude, Gemini, or any AI assistant.
6. Copy the resulting JSON output from the AI.
7. Return to the app, switch to the **📥 Import** tab, click **📋 Paste from clipboard**, and tap **Import Menu**.

---

## 📋 Menu JSON Schema

If you want to create your own menu files programmatically or inspect the format, the expected structure is:

```json
{
  "baseIngredients": {
    "Dispensa": ["Extra virgin olive oil", "Salt", "Garlic", "Lemon"]
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
                "name": "Pasta with tomato and basil",
                "detail": "Whole wheat pasta, fresh tomatoes, basil, olive oil",
                "kcal": 480,
                "ingredients": {
                  "Grains & Legumes": ["Whole wheat pasta"],
                  "Vegetables": ["Tomatoes", "Fresh basil"],
                  "Pantry": ["Extra virgin olive oil"]
                }
              },
              "alts": [
                {
                  "name": "Vegetable brown rice",
                  "detail": "Brown rice with sauteed zucchini",
                  "kcal": 460
                },
                {
                  "name": "Farro salad",
                  "detail": "Spelt with cherry tomatoes and olives",
                  "kcal": 450
                }
              ]
            },
            {
              "label": "Dinner",
              "main": {
                "name": "Baked sea bream with potatoes",
                "detail": "Sea bream fillet, potato slices, rosemary",
                "kcal": 520,
                "ingredients": {
                  "Meat & Fish": ["Sea bream fillet"],
                  "Vegetables": ["Potatoes", "Rosemary"]
                }
              },
              "alts": [
                {
                  "name": "Grilled salmon",
                  "detail": "Salmon fillet with mixed greens",
                  "kcal": 510
                },
                {
                  "name": "Zucchini frittata",
                  "detail": "Eggs, sauteed zucchini, parmesan",
                  "kcal": 480
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 💻 Local Development

Because this is a pure static web app, no installation or build tools are required. Any local static server will work:

```bash
# Using Python 3:
python -m http.server 8000

# Or using Node.js:
npx serve .
```

Then open `http://localhost:8000` in your web browser.

---

## 📄 License

MIT License. Feel free to use, modify, and share!
