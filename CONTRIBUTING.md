# Contributing to AI Form Grader Dashboard

We welcome contributions for new features, bug fixes, and translations!

## How to Contribute
- Fork the repository and create your branch from `main`.
- For new product integrations, create a new folder under `src/products/` and follow the modular guidelines in the README.
- For translations, copy `locales/template.json` to a new language folder and translate the values.
- Open a pull request with a clear description.

## Translation Guidelines
- Use `locales/template.json` as your starting point.
- Translate only the `"message"` values, not the keys.
- Test your translation in the UI if possible.

## Coding Guidelines
- Keep core logic in `src/core/`.
- Keep product-specific code in `src/products/`.
- Write clear, well-documented code.

## Issues
If you find a bug or have a feature request, please open an issue.
