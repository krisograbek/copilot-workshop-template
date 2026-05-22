---
applyTo: "**/*.html"
---

# Instrukcje dla HTML

## Zasady ogólne

- Jeden plik: `index.html` w folderze aplikacji. Bez dodatkowych stron, chyba że wprost poproszę.
- `<!doctype html>`, `lang="pl"`, `<meta charset="UTF-8">`, viewport meta.
- Wczytuj CSS w `<head>` (`<link rel="stylesheet" href="css/styles.css" />`).
- Wczytuj JS na końcu `<body>` (`<script src="js/app.js"></script>`). Bez `type="module"`, chyba że wyraźnie potrzebne.

## Struktura

- Semantyczne tagi: `<main>`, `<header>`, `<section>`, `<ul>`, `<li>`, `<button>`, `<form>`, `<input>`.
- ID tylko tam, gdzie naprawdę potrzebne dla JS (np. `id="app"`, `id="task-form"`).
- Atrybuty `class` w `kebab-case`.
- Inputy w formularzu mają `name` i powiązany `<label>`.

## Czego unikać

- Inline JS (`onclick="..."`) — eventy wpinaj w `js/app.js`.
- Inline CSS (`style="..."`) — wszystko do `css/styles.css`.
- Pustego `<div>` tam, gdzie pasuje semantyczny tag.
- Importowania bibliotek z CDN, chyba że poproszę.
