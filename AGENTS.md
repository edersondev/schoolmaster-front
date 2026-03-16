# Repository Guidelines

## Project Structure & Module Organization
- `src/`: application source. Entry at `src/main.js`, root UI in `src/App.vue`.
- `src/router/`: Vue Router configuration and route modules.
- `src/stores/`: Pinia stores for state management.
- `public/`: static assets copied as-is to the build output.
- Project config: `vite.config.js`, `package.json`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the Vite dev server with hot reload.
- `npm run build`: create a production build in `dist/`.
- `npm run preview`: serve the production build locally for verification.
- `npm run test`: run the Vitest suite.

## Coding Style & Naming Conventions
- Vue 3 with Composition API and `<script setup>`.
- State management via Pinia (`src/stores`); routing via Vue Router (`src/router`).
- Use clear, descriptive file and component names (e.g., `UserList.vue`, `useAuthStore.js`).
- Keep logic in composables/stores rather than components when reusable.
- Tailwind CSS v4 is available; keep class lists readable and grouped by layout/spacing/typography.

## Testing Guidelines
- Vitest is configured for frontend tests.
- Co-locate tests in `src/` with suffixes like `*.spec.js` or `*.test.js`.

## Commit & Pull Request Guidelines
- Commit messages in history are short, imperative, and lower-case, sometimes with a short scope before a colon (e.g., `add tailwindcss plugin to Vite configuration`).
- Keep commits focused and describe the change, not the outcome.
- PRs should include:
  - A concise summary of changes and rationale.
  - Linked issues or tickets when applicable.
  - Screenshots or GIFs for UI changes (before/after if useful).
  - A brief test note (e.g., `npm run dev` smoke check, `npm run build`).
  - Checklist:
    - `npm run build` passes locally.
    - No new linting/config warnings introduced.
    - UI changes verified on desktop and mobile widths.
    - Follow-up tasks or TODOs captured in the description.

## Security & Configuration Tips
- Node version is constrained by `package.json` `engines` (Node `^20.19.0` or `>=22.12.0`).
- Avoid committing secrets; prefer environment variables for any future API keys.
