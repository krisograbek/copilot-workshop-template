---
applyTo: "**/*.css"
---

# Instrukcje dla CSS

## Zasady ogólne

- Cały styling w jednym pliku: `css/styles.css`. Nie rozbijaj na komponenty, chyba że poproszę.
- Bez frameworków (Tailwind, Bootstrap, MUI) i bez preprocesorów (Sass, Less).
- Zwykły CSS — żadnego CSS-in-JS, żadnych zmiennych z buildu.

## Konwencje

- Klasy w `kebab-case` (np. `.task-item`, `.task-list--active`).
- Zmienne CSS (custom properties) w `:root` dla kolorów, odstępów, rozmiarów czcionek.
- Reset / normalizacja minimalna: `*, *::before, *::after { box-sizing: border-box; }`, `body { margin: 0; }`.
- Jednostki: `rem` dla rozmiarów typografii i odstępów, `px` tylko dla cienkich obramowań.
- Media queries `min-width` (mobile-first), tylko jeśli są potrzebne.

## Struktura pliku

1. Custom properties w `:root`.
2. Reset / `body`.
3. Layout (np. `#app`, `.container`).
4. Komponenty (`.task-form`, `.task-list`, `.task-item`, `.filters`).
5. Stany (`.is-completed`, `.is-active`).

## Czego unikać

- `!important` (poza autentycznym wyjątkiem).
- ID-selektorów do stylowania (`#foo { ... }`) — używaj klas.
- Zagnieżdżonych selektorów głębszych niż 2 poziomy.
- Inline stylów w HTML.
