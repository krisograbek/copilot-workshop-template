---
applyTo: "js/**"
---

# Instrukcje dla JavaScript

## Stack

- **Vanilla JavaScript** w przeglądarce. Bez Reacta, bez Vue, bez bundlera.
- Bez `import` / `export` — zwykły skrypt ładowany `<script src="js/app.js"></script>`.
- Bez TypeScriptu, bez transpilacji. Piszesz kod, który przeglądarka uruchamia bezpośrednio.

## Struktura `js/app.js`

1. Stałe (np. `const STORAGE_KEY = "tasks";`).
2. Stan (np. `let tasks = [];`).
3. Funkcje pomocnicze (`loadTasks`, `saveTasks`).
4. Funkcje akcji (`addTask`, `toggleTask`, `deleteTask`, `setFilter`).
5. Funkcja `render()` przerysowująca UI.
6. Wpinanie eventów (`document.addEventListener("DOMContentLoaded", ...)`).

## Konwencje

- Funkcje strzałkowe dla helperów, `function` dla głównych akcji — obojętne, byle spójnie.
- `const` domyślnie, `let` tylko dla wartości, które się zmieniają.
- DOM: `document.querySelector` / `querySelectorAll`, `element.addEventListener`.
- Renderowanie: zbuduj nowy HTML stringiem lub `document.createElement`, podmień `innerHTML` lub `replaceChildren`. Bez bibliotek diffujących.
- ID zadania: `crypto.randomUUID()`.
- Czas utworzenia: `new Date().toISOString()`.

## Persystencja

- Zapis: `localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))`.
- Odczyt: `JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")`.
- Po każdej modyfikacji stanu: zapisz → wyrenderuj.

## Czego unikać

- jQuery, Lodash, axios i innych bibliotek.
- `var`. Używaj `const` / `let`.
- `==` — używaj `===`.
- Operacji asynchronicznych (`fetch`, `async/await`) — w tym projekcie nie ma backendu.
- Modułów ES (`import` / `export`) — utrudnia uruchomienie z `file://`.
