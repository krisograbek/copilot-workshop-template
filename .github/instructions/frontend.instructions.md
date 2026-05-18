---
applyTo: "frontend/**"
---

# Instrukcje dla frontendu

## Stack

- React 18 (functional components + hooks).
- Vite jako bundler.
- JavaScript (`.jsx`), nie TypeScript.
- CSS bez frameworków (zwykły `App.css`).

## Komunikacja z backendem

- Adres API: `http://localhost:3001/api`.
- Używaj wbudowanego `fetch` — nie instaluj `axios`.
- Owijaj wywołania w `try/catch`, obsługuj błędy w UI.
- Stany asynchroniczne: `loading`, `error`, `data`.

## Komponenty

- Funkcje strzałkowe: `const TaskList = () => { ... }`.
- Jeden komponent na plik (chyba że trywialny pomocniczy).
- Stan lokalny przez `useState` / `useEffect`. Bez `redux`, `zustand` itp.
- Pliki komponentów: `PascalCase.jsx` w `frontend/src/`.

## Styl

- Klasy CSS w `kebab-case`.
- Style w `App.css` lub komponentowych plikach `.css`.
- Bez frameworków (Tailwind, MUI, Bootstrap) — czysty CSS.

## Czego unikać

- `class` components.
- `axios`, `redux`, `react-router` (jeśli niepotrzebne dla zakresu).
- Defaultowych eksportów wszędzie — preferuj `export const`.
