# AI Form Grader Dashboard (Modular, Translatable)

An accessible, dynamic dashboard for grading open-ended form responses (Google Forms, Typeform, CSV, etc.) using AI and flexible rubrics.

---

## Features
- Drag-and-drop or upload form responses
- Rubric management and multi-criteria grading
- AI-powered batch grading with override controls
- Accessible dashboard: keyboard, screen reader, high-contrast, etc.
- Export to CSV/JSON and Google Sheets integration
- **Fully modular and product-agnostic core logic**
- **Internationalization (i18n) ready with easy translation**

---

## Project Structure
- `backend/` - Node.js/Express API server
- `frontend/` - React accessible dashboard UI
- `extension/` - Chrome extension version
- `src/core/` - Core logic for formatting, grading, and i18n (product-agnostic, reusable)
- `src/products/` - Product-specific UI/integrations (add your own)
- `locales/` - Translation files and templates
- `scripts/` - Build, test, and translation utilities

---

## Translation & Internationalization
- All user-facing strings are externalized in `_locales/` (Chrome extension) or `locales/` (web/other products).
- To add a translation:
  1. Copy `locales/template.json` to a new language folder (e.g., `locales/ja/messages.json`).
  2. Translate only the `"message"` values.
  3. Test your translation in the UI.
- For non-extension products, use the same message structure for easy integration.

---

## Modularity & Product Integration
- Core logic is in `src/core/` and is product-agnostic (can be used in web apps, extensions, desktop, etc.).
- To add a new product/integration:
  1. Create a folder under `src/products/` (e.g., `src/products/mobile/`).
  2. Implement a UI or integration that imports and uses the core logic.
  3. Follow the modular guidelines in `CONTRIBUTING.md`.

---

## Getting Started

### Backend
```
cd backend
npm install
npm start
```

### Frontend
```
cd frontend
npm install
npm start
```

---

## Accessibility Commitment
This project aims for WCAG compliance, full keyboard navigation, screen reader support, and customizable display options.

---

## Contributing
See `CONTRIBUTING.md` for guidelines on contributions, translations, and adding new product integrations.

---

## License
MIT
