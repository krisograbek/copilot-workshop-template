# Copilot Warsztat — Task Manager

Szkielet projektu na warsztat z GitHub Copilot. Aplikacja typu Task Manager — frontend (React + Vite) + backend (Express).

## Wymagania

- Node.js 18+
- npm

## Jak odpalić

### 1. Sklonuj repozytorium

```bash
git clone <url-repo>
cd copilot-warsztat
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

Backend uruchomi się domyślnie na `http://localhost:3001`.

### 3. Frontend

W nowym terminalu:

```bash
cd frontend
npm install
npm run dev
```

Frontend uruchomi się domyślnie na `http://localhost:5173`.

## Struktura projektu

```
copilot-warsztat/
├── .github/           ← konfiguracja Copilota (instructions, agents, prompts)
├── frontend/          ← React + Vite
├── backend/           ← Express + cors
├── README.md
└── SPEC.md            ← specyfikacja aplikacji (dla Plannera)
```

## Workflow warsztatowy

1. Otwórz `SPEC.md` i przeczytaj wymagania aplikacji.
2. Uruchom **Plannera** (`.github/agents/planner.agent.md`) — zaplanuje implementację.
3. Po handoffie uruchom **Implementera** (`.github/agents/implementer.agent.md`) — zrealizuje plan.
4. Korzystaj z prompt files (`.github/prompts/`) dla powtarzalnych zadań.
