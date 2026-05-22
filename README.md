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

### 2. Wybierz aplikację do zbudowania

W folderze `aplikacje/` masz kilka gotowych specyfikacji do wyboru — każda w swoim folderze, na początku zawiera **tylko `SPEC.md`**. Aplikację zbudujesz od zera, a kod powstanie obok specyfikacji.

Po zbudowaniu otwórz `index.html` z folderu aplikacji:

- **Dwuklik na `index.html`** — otworzy się w domyślnej przeglądarce.
- **VS Code Live Server** — kliknij prawym na `index.html` → „Open with Live Server" (auto-reload po zapisie).

Dane trzymane są w `localStorage` przeglądarki — przeżywają odświeżenie, ale są lokalne dla danej przeglądarki.

## Struktura projektu

```text
copilot-warsztat/
├── .github/                    ← konfiguracja Copilota (instructions, agents, prompts)
└── aplikacje/                  ← jedna aplikacja = jeden folder
    ├── licznik/SPEC.md         ← najprostsza: +/− i reset
    ├── notatnik/SPEC.md        ← dodawanie/usuwanie krótkich notatek
    └── task-manager/SPEC.md    ← lista zadań z filtrami (najbogatsza)
```

Folder aplikacji po zbudowaniu wygląda tak:

```text
aplikacje/<nazwa>/
├── SPEC.md            ← specyfikacja TEJ aplikacji
├── index.html         ← struktura strony
├── css/styles.css     ← styling
└── js/app.js          ← logika
```

## Workflow warsztatowy

1. Wybierz folder aplikacji w `aplikacje/` i otwórz jego `SPEC.md`.
2. Uruchom **Plannera** (`.github/agents/planner.agent.md`) — zaplanuje implementację **w tym folderze**.
3. Po handoffie uruchom **Implementera** (`.github/agents/implementer.agent.md`) — zbuduje aplikację obok `SPEC.md`.
4. Korzystaj z prompt files (`.github/prompts/`) dla powtarzalnych zadań.
