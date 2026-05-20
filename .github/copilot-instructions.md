# Konwencje projektu Task Manager

To prosta aplikacja webowa używana na warsztacie. Najważniejsze: **prostota i czytelność**.

## Stack

- **Vanilla HTML + CSS + JavaScript.** Żadnego Reacta, Vue, Vite, Webpacka, Node.js, npm.
- Brak bundlera, brak build stepu. Otwierasz `index.html` w przeglądarce i działa.
- Persystencja: `localStorage` (klucz `"tasks"`, wartość — JSON-owa tablica obiektów).
- Brak TypeScriptu, brak bazy danych, brak backendu, brak autoryzacji.

## Struktura repo

```text
index.html         ← struktura strony, ładuje css/ i js/
css/styles.css     ← cały styling
js/app.js          ← cała logika (stan, render, eventy)
SPEC.md            ← specyfikacja aplikacji
```

## Zasady

- Pisz **prosty kod**. Bez warstw, bez abstrakcji, bez wzorców. Jeden plik = jedna rzecz.
- Nazwy zmiennych i funkcji **po angielsku** (bo standard).
- Komentarze **po polsku** — to materiał warsztatowy.
- Cała logika w `js/app.js`. Wydzielaj do kolejnego pliku tylko jeśli wprost o to poproszę.
- Cały styling w `css/styles.css`. Bez frameworków (Tailwind, Bootstrap itp.).
- DOM: `document.querySelector`, `addEventListener`, `element.textContent`/`element.innerHTML`. Bez jQuery.
- Stan trzymaj w jednej zmiennej (np. `let tasks = []`) i po każdej zmianie wywołuj `render()`.
- Używaj `crypto.randomUUID()` dla ID zadań.
- Po każdej zmianie stanu zapisuj do `localStorage`.

## Czego unikać

- Bibliotek z CDN (chyba że poproszę).
- `npm install`, `package.json`, `node_modules/` — w tym projekcie ich nie ma i nie powinny się pojawić.
- Buildowania, transpilacji, bundlerów.
- Dodawania feature'ów, o które nie poprosiłem.
- `console.log` w kodzie produkcyjnym (tylko podczas debugowania).
