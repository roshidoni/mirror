# Repository Guidelines

## Project Structure & Module Organization
True Mirror is a Svelte + TypeScript Vite SPA. `src/main.ts` wires Vite to `App.svelte`, while self-contained UI modules live under `src/lib/` (e.g., `Camera.svelte`, `Counter.svelte`). Shared visuals belong in `src/assets/`, global styles in `src/app.css`, and browser-only entry markup in `index.html`. Public, unprocessed assets sit in `public/` and are served verbatim. Build tooling lives alongside `vite.config.ts`, `svelte.config.js`, and `tsconfig*.json`; edit these before altering bundler behavior.

## Build, Test, and Development Commands
Run `pnpm install` once to sync dependencies (pnpm is locked in via `pnpm-lock.yaml`). `pnpm dev` starts the Vite dev server with HMR at `http://localhost:5173`. `pnpm build` produces the optimized bundle in `dist/`, and `pnpm preview` serves that build for sanity checks. `pnpm check` executes `svelte-check` plus a TypeScript project build to catch type drift before reviews.

## Coding Style & Naming Conventions
Use TypeScript everywhere (`allowJs` exists but `checkJs` enforces static analysis). Follow the repo’s 2-space indentation, double-quoted imports, and semicolons in scripts. Name Svelte components in PascalCase (`Camera.svelte`), files housing stores/utilities in camelCase, and long-lived assets with kebab-case (`src/assets/camera-feed.svg`). Keep component state minimal, preferring exported stores when logic is shared.

## Testing Guidelines
At minimum, run `pnpm check` before pushing—CI rejects builds that fail static analysis. When adding automated tests, place Vitest/Svelte Testing Library specs beside the source in `src/lib/__tests__/Component.spec.ts`. Mock browser-only APIs such as `navigator.mediaDevices` to keep tests deterministic. Document any manual flows (e.g., camera permissions) in PR descriptions until e2e coverage is introduced.

## Commit & Pull Request Guidelines
History favors short, descriptive summaries (`Delete .vscode directory`, `Camera Feature was added`). Keep commits focused, written in the imperative mood, and under ~72 characters. Every PR should describe the user-facing change, note media permissions or configuration impacts, link to tracking issues, and attach before/after screenshots when UI shifts. Request a review only after `pnpm check` and any relevant manual device tests succeed.

## Security & Configuration Tips
Camera access depends on secure origins; test with `pnpm preview` + HTTPS tunneling before shipping. Never commit API keys or device IDs—reference them through `.env` entries consumed via Vite’s `import.meta.env`. Audit third-party assets placed in `public/` to ensure usage rights.
