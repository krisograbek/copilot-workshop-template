# Copilot Warsztat — Task Manager

Szkielet projektu na warsztat z GitHub Copilot. Aplikacja typu Task Manager w **czystym HTML / CSS / JS** — bez frameworków, bez Node.js, bez `npm`.

## Wymagania

- VS Code (najnowsza wersja)
- Rozszerzenie GitHub Copilot (zalogowane)
- Przeglądarka (Chrome / Firefox / Edge / Safari)

> Nie potrzebujesz Node.js ani npm. Aplikacja uruchamia się przez otwarcie `index.html` w przeglądarce.

## Jak odpalić

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/krisograbek/copilot-workshop-template.git
cd copilot-warsztat
```

### 2. Otwórz aplikację

Dwie opcje:

- **Dwuklik na `index.html`** — otworzy się w domyślnej przeglądarce.
- **VS Code Live Server** — kliknij prawym na `index.html` → „Open with Live Server" (auto-reload po zapisie).

Dane (zadania) trzymane są w `localStorage` przeglądarki — przeżywają odświeżenie, ale są lokalne dla danej przeglądarki.

## Struktura projektu

```text
copilot-warsztat/
├── .github/           ← konfiguracja Copilota (instructions, agents, prompts)
├── css/
│   └── styles.css     ← cały styling
├── js/
│   └── app.js         ← cała logika (stan, render, eventy)
├── index.html         ← struktura strony, wejście do aplikacji
├── README.md
└── SPEC.md            ← specyfikacja aplikacji (dla Plannera)
```

## Workflow warsztatowy

1. Otwórz `SPEC.md` i przeczytaj wymagania aplikacji.
2. Uruchom **Plannera** (`.github/agents/planner.agent.md`) — zaplanuje implementację.
3. Po handoffie uruchom **Implementera** (`.github/agents/implementer.agent.md`) — zrealizuje plan.
4. Korzystaj z prompt files (`.github/prompts/`) dla powtarzalnych zadań.
