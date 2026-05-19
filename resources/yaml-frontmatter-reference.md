# YAML frontmatter — pełna referencja + 5-agent setup dla React

## Część 1 — Co możesz wpisać w YAML frontmatter agenta

### Krótka odpowiedź

**Nie jesteś ograniczony do folderów ani języków programowania w YAML frontmatter.** Frontmatter to **konfiguracja zachowania agenta**, a nie ograniczenia na to *gdzie* on może działać.

Ograniczenia per-folder czy per-język robi się gdzie indziej:
- **Per-folder** → w **instructions** (`*.instructions.md` z `applyTo: "src/frontend/**"`)
- **Per-język** → w **instructions** (`applyTo: "**/*.tsx"`)
- **W agencie** → przez **instrukcje tekstowe w body** ("Pracujesz tylko w folderze `frontend/`. Nie modyfikuj `backend/`.")

To rozróżnienie jest ważne: **frontmatter konfiguruje agenta jako całość, body instruuje go co robić.**

### Pełna tabela pól frontmatter (stan na maj 2026)

Wszystkie pola są **opcjonalne** — agent może mieć pusty frontmatter (wtedy nazwa = nazwa pliku, wszystkie narzędzia, defaultowy model).

#### Pola podstawowe (zawsze warto mieć)

| Pole | Typ | Wartość | Co robi |
|---|---|---|---|
| `name` | string | `'Frontend Builder'` | Nazwa w dropdown. Jeśli puste → użyta nazwa pliku (`frontend-builder.agent.md` → `frontend-builder`). |
| `description` | string | `'Implementuje komponenty React'` | Wyświetla się jako placeholder w polu czatu. Pomaga userowi (i innym agentom) wybrać agenta. |
| `argument-hint` | string | `'Opisz komponent do zrobienia'` | Hint tekstowy w polu input czatu. Wskazówka co wpisać. |

#### Pola kontroli zachowania

| Pole | Typ | Wartość | Co robi |
|---|---|---|---|
| `tools` | array | `['edit', 'search/codebase']` | **Lista narzędzi** które agent może używać. Jeśli puste → wszystkie. Patrz Część 2. |
| `model` | string lub array | `'Claude Haiku 4.5'` lub `['Claude Haiku 4.5', 'GPT-5 mini']` | Który model wymusić. Array = fallback (próbuje po kolei). Jeśli puste → wybrany w pickerze. |
| `agents` | array | `['Researcher', 'Implementer']` lub `'*'` lub `[]` | **Które agenty można wywoływać jako sub-agenty z tego.** Wymaga też `agent` w `tools`. `*` = wszystkie. `[]` = żaden. |
| `user-invocable` | boolean | `true` / `false` | Czy agent jest widoczny w dropdown dla usera. `false` = "agent tylko jako sub-agent, niewidoczny w UI". |
| `disable-model-invocation` | boolean | `true` / `false` | Czy inni agenci mogą wywołać tego jako sub-agenta. `true` = "tylko bezpośrednio z UI". |

#### Pola handoffs (przekazywanie między agentami)

| Pole | Typ | Co robi |
|---|---|---|
| `handoffs` | array of objects | Lista przycisków pokazujących się po skończonej odpowiedzi |
| `handoffs[].label` | string | Tekst na przycisku, np. `'🔍 Send to Reviewer'` |
| `handoffs[].agent` | string | Nazwa agenta do którego skoczy (musi match z `name` innego agenta) |
| `handoffs[].prompt` | string | Pre-wypełniony prompt dla następnego agenta |
| `handoffs[].send` | boolean | `true` = wyślij automatycznie. `false` = wstaw do inputu, user wciska enter sam |
| `handoffs[].model` | string | Optionally: wymuś inny model dla tego handoffu, format `'Claude Haiku 4.5 (copilot)'` |

#### Pola zaawansowane (rzadziej używane)

| Pole | Typ | Co robi |
|---|---|---|
| `target` | string | `'vscode'` lub `'github-copilot'`. Agent działa tylko w danym środowisku. Domyślnie obu. |
| `mcp-servers` | array | Lista MCP serverów dla tego agenta (tylko gdy `target: github-copilot`) |
| `hooks` | object | Hooki scoped do tego agenta (preview). Patrz [dokumentacja hooks](https://code.visualstudio.com/docs/copilot/customization/hooks) |
| `infer` | boolean | **Deprecated**. Używaj `user-invocable` i `disable-model-invocation`. |

### Format Claude (alternatywny)

Jeśli używasz folderu `.claude/agents/` zamiast `.github/agents/`, plik to zwykły `.md` (nie `.agent.md`) i frontmatter ma inny format:

| Pole | Format Claude | Wartość |
|---|---|---|
| `name` | string | wymagane |
| `description` | string | |
| `tools` | comma-separated string | `"Read, Grep, Glob, Bash"` (nie array!) |
| `disallowedTools` | comma-separated string | `"Bash, Write"` |

VS Code mapuje nazwy Claude na VS Code automatycznie. **Mieszanie formatów jest OK** — możesz mieć część agentów w `.github/agents/`, część w `.claude/agents/`.

---

## Część 2 — Tools — pełna lista i jak ich używać

### Najważniejsze: nazwy tools się zmieniają

Microsoft pisze wprost: *"Tool names vary across GitHub Copilot platforms. Select the Tools icon in the chat window to see available tool names."*

To znaczy że **autoritatywna lista nazw to ikona Tools w panelu czatu**, nie żaden static dokument. **Pokazują się dynamicznie** w zależności od wersji VS Code, zainstalowanych extensions, i MCP serwerów.

Tym niemniej — oto stabilny zestaw nazw, działa w stable VS Code od ~lutego 2026:

### Tools wbudowane (built-in)

#### Czytanie / przeszukiwanie (read-only)
| Tool name | Co robi |
|---|---|
| `readFile` lub `read` | Czyta plik |
| `search/codebase` lub `codebase` | Semantic search po kodzie projektu |
| `search/usages` lub `findReferences` | Znajduje gdzie symbol jest używany |
| `search` | Bardziej ogólne, łączy semantic + text search |
| `findTestFiles` | Lokalizuje pliki testów |
| `searchResults` | Wynik aktualnego search w sidebar |
| `problems` | Lista błędów/warningów z Problems panel |
| `changes` | Lista zmian w git (jak `git status`) |
| `terminalLastCommand` | Czyta output ostatniej komendy terminala |
| `terminalSelection` | Zaznaczony tekst w terminalu |
| `testFailure` | Output ostatniego failed testu |

#### Edycja i wykonywanie
| Tool name | Co robi |
|---|---|
| `edit` lub `edit/editFiles` | Edytuje pliki w workspace |
| `execute` lub `runCommands` | Odpala komendy w terminalu |
| `runTasks` | Odpala tasks zdefiniowane w `tasks.json` |
| `runTests` | Odpala test runner |

#### Web i meta
| Tool name | Co robi |
|---|---|
| `web/fetch` lub `fetch` | Pobiera URL (HTML/JSON) |
| `vscode` | Meta-tool do operacji VS Code (komenda palette, settings) |
| `vscode/askQuestions` | Pyta usera w trakcie wykonania (jak input prompt) |

#### Tool sets (grupowe)
| Tool set | Zawiera |
|---|---|
| `#edit` | Wszystkie tools edycji |
| `#search` | Wszystkie tools przeszukiwania |

#### Sub-agenty
| Tool name | Co robi |
|---|---|
| `agent` | Umożliwia wywołanie sub-agentów (musisz mieć to + `agents:` lista) |

### Tools z MCP

Jeśli masz MCP serwer skonfigurowany, jego tools wchodzą do listy. Format: `<server-name>/<tool-name>`. Żeby dać wszystkie z danego serwera: `<server-name>/*`.

Przykład:
```yaml
tools: ['edit', 'github/*', 'playwright/click', 'playwright/screenshot']
```

### Tools z extensions

Niektóre extensions VS Code wstrzykują tools. Przykład — Playwright extension dodaje `playwright` tool. Po prostu po nazwie.

### Jak sprawdzić co masz dostępne (krok po kroku)

1. Otwórz Chat view (`Ctrl+Alt+I`)
2. Wybierz dowolnego built-in agenta (np. Agent)
3. Kliknij ikonę **Tools** (zwykle przy polu input, ikona klucza/wrench)
4. Zobaczysz pełną listę — każdy z aktualną nazwą
5. Zaznacz / odznacz żeby przetestować w real-time

**Tutorialowo dla warsztatu:** każ uczestnikom otworzyć tę listę i przekopiować 3 nazwy do swojego agent file. To trwa 30 sekund i daje pewność że nazwy są aktualne.

### Limit: 128 tools na request

> *"A chat request can have a maximum of 128 tools enabled at a time."*

W praktyce nigdy tego nie przekroczysz custom agentem. Limit jest istotny gdy masz dużo MCP serwerów.

---

## Część 3 — Ograniczanie agenta do folderu / języka

Teraz to o co pytasz: jak ograniczyć agenta Frontend do React/`frontend/`, a Backend do Node/`backend/`.

### Metoda 1: Instrukcje w body agenta (najprostsze)

W body agenta wpisujesz wprost:

```markdown
---
name: Frontend Builder
description: Buduje komponenty React
tools: ['edit', 'readFile', 'search/codebase', 'execute']
model: 'Claude Haiku 4.5'
---

# Frontend Builder

Jesteś specjalistą React. Pracujesz **tylko** w folderze `frontend/`.

## Co robisz
- Edytujesz pliki w `frontend/src/`
- Komponenty funkcyjne z hooks
- Tailwind dla stylów
- Zarządzanie stanem przez React Query (server) i useState (local)

## Czego NIE robisz
- NIE dotykasz folderu `backend/`
- NIE edytujesz `package.json` w roocie (tylko w `frontend/`)
- NIE odpalasz `npm install` w `backend/` 
- Jeśli zauważysz że problem jest w API (backend) — zgłoś usera, nie próbuj naprawić
```

**Plus:** proste, działa od razu, łatwe do zrozumienia dla uczestników warsztatu.  
**Minus:** to są tylko instrukcje. Haiku może je *zignorować* gdy się "zaplącze". Trzeba mu czasem przypomnieć.

### Metoda 2: Path-specific instructions (lepsze egzekwowanie konwencji)

Tworzysz `.github/instructions/frontend.instructions.md`:

```markdown
---
applyTo: "frontend/**"
---

# Frontend conventions

- React functional components only
- Tailwind for styles
- Files in PascalCase: `TaskList.jsx`
- Use absolute imports from `@/components/`
```

I drugi `.github/instructions/backend.instructions.md`:

```markdown
---
applyTo: "backend/**"
---

# Backend conventions

- ES Modules (`import`, nie `require`)
- Express routes w `backend/src/routes/`
- SQLite przez `better-sqlite3` (sync)
```

Gdy Frontend Builder edytuje plik w `frontend/`, automatycznie zaaplikuje się frontend.instructions.md. Gdy Backend Builder edytuje w `backend/` — backend.instructions.md. **Konwencje są egzekwowane przez ścieżkę pliku, nie przez instrukcje w agencie.**

**Plus:** path-based, niezawodnie. Działa nawet jak agent "się pomyli".  
**Minus:** musisz utrzymać te pliki osobno.

### Metoda 3: Kombinacja (zalecane dla warsztatu)

**Robisz oba:**
1. Agent ma w body: "Pracuj w folderze X". To "kierunkuje" agenta.
2. Path-specific instructions zapewniają że *kiedy* już edytuje w danym folderze, robi to wg konwencji.

To jest **defense in depth**. Sygnał z dwóch źródeł = mniejsza szansa że Haiku zboczy.

### Czego **NIE** możesz zrobić w YAML

- **Nie ma pola `workingDirectory:`** w frontmatter
- **Nie ma pola `restrictPaths:`** ani `language:` ani `framework:`
- Nie ma "twardego" blokowania pisania w `backend/` dla Frontend Buildera — agent technicznie może, jeśli mu pozwolą tools. To są **soft constraints przez instrukcje + path-aware instructions**.

Hard constraint robi się przez **tools** (`tools: ['readFile']` = read-only, nie zedytuje niczego nigdzie). Ale nie można "edit w jednym folderze, read-only w innym" — to wszystko-albo-nic.

---

## Część 4 — Setup pod Haiku + React: 5 agentów rozbitych po rolach

Skoro masz Haiku — kluczowe są **wąski scope** i **prosty kontekst**. Każdy agent powinien mieć:
- Krótkie instrukcje (do 300-500 słów body)
- Jasny scope (jeden folder, jeden typ pliku)
- Minimalne tools (mniej = mniej decyzji = lepsze rezultaty z małego modelu)
- Jasne "czego nie robisz"

### Architektura

```
┌──────────────────┐
│   Plan mode      │  ← built-in
│   (built-in)     │     plan.md
└────────┬─────────┘
         │ handoff
         ▼
┌──────────────────┐
│   Frontend       │  ← custom (React/Tailwind)
│   Builder        │     edits frontend/ only
└────────┬─────────┘
         │ handoff: "Backend done? Build API"
         ▼
┌──────────────────┐
│   Backend        │  ← custom (Node/Express)
│   Builder        │     edits backend/ only
└────────┬─────────┘
         │ handoff
         ▼
┌──────────────────┐
│   Reviewer       │  ← custom (read-only)
│                  │     reads both folders
└────────┬─────────┘
         │ handoff
         ▼
┌──────────────────┐
│   TestWriter     │  ← custom (tests only)
│                  │     edits tests/ folder
└──────────────────┘
```

### Plik 1: `.github/copilot-instructions.md` (global)

```markdown
# TaskFlow — React + Node TaskManager

Aplikacja do zarządzania zadaniami.

## Stack
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js 20 + Express + better-sqlite3
- Tests: Vitest (frontend), Jest + Supertest (backend)
- Manager: npm (nie pnpm, nie yarn)

## Struktura projektu

```
taskflow/
├── frontend/             # React app (Vite)
│   ├── src/
│   │   ├── components/   # PascalCase.jsx
│   │   ├── hooks/        # useCamelCase.js
│   │   ├── api.js        # fetch wrappers
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/              # Express API
│   ├── src/
│   │   ├── routes/       # tasks.js
│   │   ├── db.js         # SQLite setup
│   │   └── index.js
│   ├── package.json
│   └── tasks.db
├── tests/
│   ├── frontend/         # *.test.jsx
│   └── backend/          # *.test.js
└── package.json          # workspaces root
```

## Konwencje globalne
- ES Modules wszędzie (`"type": "module"`)
- async/await
- Walidacja inputu zawsze na backend
- Errors: `res.status(N).json({ error: "msg" })`
- Tests: każdy endpoint i każdy komponent ma test

## Czego NIE używamy
- TypeScript
- Redux (useState/useReducer wystarczą)
- ORM (raw SQL via better-sqlite3)
- Docker, CI/CD, deployment
- Auth (poza zakresem warsztatu)
```

### Plik 2: `.github/instructions/frontend.instructions.md`

```markdown
---
applyTo: "frontend/**"
---

# Frontend rules (React)

## Components
- Functional components only, hooks (useState, useEffect, useCallback)
- PascalCase filename + PascalCase export: `TaskList.jsx` → `export default function TaskList()`
- Jeden komponent = jeden plik (max 200 linii — jak więcej, rozbij)

## Styles
- Tailwind classes
- Brak inline `style={{}}` chyba że dynamiczne
- Brak `styled-components`, brak CSS modules

## State
- Local state: `useState` / `useReducer`
- Server state: fetch przez `src/api.js` wrappery
- Form state: kontrolowane inputy z useState

## API calls
- Zawsze przez `src/api.js`
- Tam jest base URL (`/api`)
- Catch errors, pokazuj usera-friendly message

## Czego NIE rób
- Brak `dangerouslySetInnerHTML` bez sanityzacji
- Brak inline JS w event handlers (`onClick={() => { ... 20 linii ... }}`)
- Brak prop drilling > 2 poziomy (użyj context lub przepakuj komponenty)
```

### Plik 3: `.github/instructions/backend.instructions.md`

```markdown
---
applyTo: "backend/**"
---

# Backend rules (Express + SQLite)

## Routes
- Każdy route w `backend/src/routes/<resource>.js`
- Express Router pattern
- Funkcje async
- Walidacja inputu **przed** dotknięciem DB

## Database
- `better-sqlite3` (synchroniczne, szybkie)
- **ZAWSZE** prepared statements: `db.prepare(...)`
- **NIGDY** string concatenation w SQL (SQL injection)
- Migracje w `backend/src/db.js` przez `CREATE TABLE IF NOT EXISTS`

## Errors
- HTTP 400: invalid input
- HTTP 404: not found
- HTTP 500: internal (log + generic message do usera)
- Format: `res.status(N).json({ error: "human-readable" })`

## Response shape
```js
// Success
res.json({ data: result })

// Error
res.status(400).json({ error: "Title is required" })
```

## Czego NIE rób
- Brak `console.log` w produkcyjnym kodzie (użyj proper logger gdyby był)
- Brak hardcoded secrets / paths
- Brak sync I/O blokującego event loop (poza better-sqlite3 które jest OK)
```

### Plik 4: `.github/agents/frontend-builder.agent.md`

```markdown
---
name: Frontend Builder
description: Buduje komponenty React w folderze frontend/
tools: ['edit', 'readFile', 'search/codebase', 'execute', 'problems']
model: 'Claude Haiku 4.5'
handoffs:
  - label: 🔧 Backend done? Switch to Backend Builder
    agent: Backend Builder
    prompt: Implement the backend part of the plan.
    send: false
  - label: 🔍 Review my work
    agent: Reviewer
    prompt: Review the frontend changes I just made.
    send: false
---

# Frontend Builder

Jesteś specjalistą React. Pracujesz **wyłącznie** w `frontend/`.

## Workflow

1. **Przeczytaj `plan.md`** — szukaj części oznaczonych [Frontend]
2. **Wykonuj krok po kroku** według tego co jest w planie dla frontu
3. **Po każdym kroku** uruchom `cd frontend && npm run dev` żeby sprawdzić że nie wywaliłeś buildu
4. **Po wszystkich krokach** — daj summary co zostało zrobione

## Kontrakt z backendem

Jeśli potrzebujesz endpointu którego nie ma — **NIE TWÓRZ GO** w backendzie.
Zamiast tego:
1. Wpisz w odpowiedzi: "Frontend wymaga endpointu X (POST /api/tasks/X) — przekaż do Backend Buildera"
2. Użyj handoff do Backend Builder
3. Wstrzymaj swoją pracę

## Konwencje
- Komponenty: funkcyjne, hooks, PascalCase
- Style: tailwind
- API: przez `src/api.js`
- Stan: useState/useReducer, no Redux

## Czego NIE robisz
- NIE edytuj plików w `backend/`
- NIE edytuj plików testowych w `tests/` (to robi TestWriter)
- NIE odpalaj `npm install` w `backend/`
- NIE zmieniaj API kontraktu — jeśli trzeba, zgłoś
- NIE używaj TypeScript
```

### Plik 5: `.github/agents/backend-builder.agent.md`

```markdown
---
name: Backend Builder
description: Buduje API Express w folderze backend/
tools: ['edit', 'readFile', 'search/codebase', 'execute', 'problems', 'runTests']
model: 'Claude Haiku 4.5'
handoffs:
  - label: 🎨 Backend done? Switch to Frontend Builder
    agent: Frontend Builder
    prompt: Implement the frontend part of the plan now that API is ready.
    send: false
  - label: 🔍 Review my work
    agent: Reviewer
    prompt: Review the backend changes I just made.
    send: false
---

# Backend Builder

Jesteś specjalistą Node.js + Express + SQLite. Pracujesz **wyłącznie** w `backend/`.

## Workflow

1. **Przeczytaj `plan.md`** — szukaj części oznaczonych [Backend]
2. **Zacznij od schematu DB** (jeśli plan tego wymaga) — `backend/src/db.js`
3. **Potem route'y** — `backend/src/routes/`
4. **Po każdej zmianie** odpal testy: `cd backend && npm test`
5. **Jeśli test failuje** — popraw zanim przejdziesz dalej
6. **Daj summary** na końcu

## Kontrakt z frontendem

Endpointy które tworzysz **musisz udokumentować** w komentarzu na górze pliku route:
```js
// API contract:
// GET /api/tasks → 200 { data: Task[] }
// POST /api/tasks → 201 { data: Task } | 400 { error: string }
// PUT /api/tasks/:id → 200 { data: Task } | 404
// DELETE /api/tasks/:id → 204 | 404
```

To pomoże Frontend Builderowi wiedzieć co wywołać.

## Konwencje
- ES Modules
- async/await
- better-sqlite3 prepared statements
- Walidacja inputu **zawsze** przed DB
- Errors HTTP w formacie `{ error: "msg" }`

## Czego NIE robisz
- NIE edytuj plików w `frontend/`
- NIE używaj raw SQL z user input bez prepared statement
- NIE zwracaj surowych error.message do usera (security)
- NIE używaj ORM (raw SQL przez better-sqlite3)
```

### Plik 6: `.github/agents/reviewer.agent.md`

```markdown
---
name: Reviewer
description: Code review obu warstw — frontend i backend
tools: ['readFile', 'search/codebase', 'search/usages', 'changes']
model: 'Claude Haiku 4.5'
handoffs:
  - label: ✅ Looks good — write tests
    agent: TestWriter
    prompt: Add tests for the changes that were just reviewed.
    send: false
  - label: 🔧 Send back to Frontend Builder
    agent: Frontend Builder
    prompt: Address the frontend issues from the review.
    send: false
  - label: 🔧 Send back to Backend Builder
    agent: Backend Builder
    prompt: Address the backend issues from the review.
    send: false
---

# Reviewer

Jesteś senior reviewerem. Czytasz, komentujesz. **NIE edytujesz.**

## Co sprawdzasz

### Wspólne
- Czy kod działa? (logika, edge cases)
- Czy przestrzega copilot-instructions.md?
- Czy są oczywiste bugi?

### Frontend
- Czy komponent ma sensowne propsy (typy implicite, ale dokumentacja jasna)?
- Czy error states są obsłużone (API failed → user widzi co?)
- Czy loading states są (gdy fetch trwa → user widzi co?)
- Brak inline funkcji w renderze które tworzą memory leak?

### Backend
- Czy każdy endpoint waliduje input?
- Czy używane są prepared statements?
- Czy odpowiedzi są spójne (zawsze `{data:...}` lub `{error:...}`)?
- Czy errory są logowane, ale niewyświetlane userowi w surowej formie?

## Format odpowiedzi

```
## Review summary
[2-3 zdania ogólnie]

## 🔴 Critical
- [plik:linia] problem + sugestia

## 🟡 Warnings
- [plik:linia] problem + sugestia

## 💡 Nice to have
- [plik:linia] sugestia

## ✅ What's good
- coś pozytywnego (zawsze!)

## Verdict
[ ] Looks good — proceed to tests
[ ] Send back to Frontend Builder
[ ] Send back to Backend Builder
```

## Czego NIE robisz
- NIE edytuj plików (tools są read-only, ale i tak ci przypominam)
- NIE pisz całego kodu — sugeruj
- Bądź uprzejmy. Sugeruj, nie obwiniaj.
- Jeśli wszystko OK — powiedz to wprost "Looks good, ready for tests"
```

### Plik 7: `.github/agents/test-writer.agent.md`

```markdown
---
name: TestWriter
description: Dodaje testy do frontu (Vitest) i backendu (Jest+Supertest)
tools: ['edit', 'readFile', 'search/codebase', 'execute', 'runTests']
model: 'Claude Haiku 4.5'
---

# TestWriter

Specjalista od testów. Edytujesz **tylko** pliki w `tests/`. Nie zmieniasz logiki produkcyjnej.

## Workflow

1. Przeczytaj `plan.md` żeby wiedzieć co było dodane
2. Sprawdź `git diff` żeby zobaczyć rzeczywiste zmiany
3. **Dla zmian we frontend/** → dodaj testy w `tests/frontend/` (Vitest)
4. **Dla zmian w backend/** → dodaj testy w `tests/backend/` (Jest + Supertest)
5. Odpal testy. Wszystkie muszą przejść.
6. Jeśli test odkrywa bug w kodzie produkcyjnym — **zgłoś, NIE naprawiaj sam**

## Frontend tests (Vitest + Testing Library)

- Każdy komponent: render + co najmniej 1 user interaction
- Mock fetch API (msw albo vi.fn())
- Asercje: testing-library queries (`getByRole`, `getByText`)

## Backend tests (Jest + Supertest)

Dla każdego endpoint:
- Happy path (valid input → expected response)
- Bad input → 400
- Missing resource → 404 (jeśli applicable)
- Edge case (empty, max length, special chars)

## Czego NIE robisz
- NIE edytuj plików w `frontend/` ani `backend/` (tylko `tests/`)
- NIE zmieniaj kodu żeby test przeszedł — to bug w produktach, zgłoś
- NIE pisz integration tests UI-to-API (poza zakresem warsztatu)
```

### Plik 8: `.github/prompts/add-feature.prompt.md`

```markdown
---
description: 'Pełen workflow nowej feature: Plan → FE/BE Build → Review → Tests'
agent: Planner
---

Chcę dodać nową feature do TaskFlow.

Feature: ${input:feature:Opisz feature którą chcesz dodać}

Twoja rola jako Planner:
1. Zrozum feature
2. Zadaj max 3 pytania doprecyzowujące jeśli trzeba
3. Stwórz `plan.md` w formacie poniżej
4. Pokaż plan
5. Czekaj na akceptację → przyciski handoff przerzucą do Frontend lub Backend Buildera

## Format plan.md

```markdown
# Feature: <nazwa>

## Goal
[1 zdanie: co user może po implementacji]

## Backend changes
- [ ] Step 1: ...
- [ ] Step 2: ...

## Frontend changes
- [ ] Step 1: ...
- [ ] Step 2: ...

## Tests
- [ ] Backend: ...
- [ ] Frontend: ...

## Order of execution
1. Backend first (potrzebne dla frontu)
2. Frontend
3. Review obu
4. Tests
```

WAŻNE: oznaczaj kroki [Backend] vs [Frontend] żeby agenci wiedzieli co ich dotyczy.
```

---

## Część 5 — Co dokładnie dzieje się podczas handoffu

To warto wiedzieć przed warsztatem:

1. **Frontend Builder kończy odpowiedź** (np. "Wykonałem 3 komponenty, gotowe")
2. **Pod odpowiedzią pojawiają się przyciski handoffów** (zdefiniowane w `handoffs:`)
3. **User klika np. "🔧 Backend done? Switch to Backend Builder"**
4. **VS Code:**
   - Wybiera agenta `Backend Builder` w dropdown
   - Wstawia w pole input prompt z handoff (`'Implement the backend part of the plan.'`)
   - **NIE wysyła go** (bo `send: false`)
   - User widzi co zostanie wysłane i może dopisać kontekst
5. **User wciska Enter** → Backend Builder dostaje prompt + ma cały kontekst poprzedniej sesji w historii czatu (kontekst się **przenosi**)

**Kontekst się przenosi.** To znaczy że Backend Builder widzi co Frontend Builder zrobił. To kluczowe — pozwala na "Backend, wiesz że Frontend potrzebuje X, zrób to".

Jeśli ustawisz `send: true` — wysyła natychmiast. Plus: szybciej. Minus: user nie ma szansy doprecyzować.

**Dla warsztatu sugeruję `send: false`** — uczestnicy widzą co się dzieje, mogą się czegoś nauczyć.

---

## Część 6 — Praktyczne rady pod Haiku

### Dlaczego Haiku jest trudniejsze niż Opus/Sonnet

- **Mniejsze context window** efektywnie (wszystko w 200k tokens jest, ale "uważa" tylko na pierwsze ~50k)
- **Mniej spryt deduktywny** — Haiku nie domyśli się z subtelności
- **Łatwiej się gubi** w długich sesjach

### Adaptacje w setupie

1. **Krótsze instrukcje w agent body** — max 300-500 słów. Każde dodatkowe zdanie to mniej "uwagi" na zadanie.
2. **Bullet points zamiast prozy** — łatwiej parsowalne dla małego modelu.
3. **Explicit "czego NIE robić"** — Haiku potrzebuje wprost powiedziane "nie dotykaj X".
4. **Krótsze sesje** — `/clear` po każdej feature. Nie ciągnij rozmowy.
5. **Mniej tools per agent** — każdy tool = decyzja "czy użyć?". Mniej decyzji = lepsze decyzje.
6. **Bardziej granularne agenty** — Twoja decyzja o rozbiciu Buildera na FE/BE jest dokładnie tym czego Haiku potrzebuje.

### Konkretnie w plikach które ci dałem

- Każdy agent body to ~200-400 słów. ✅
- Wszędzie bullet points. ✅
- Każdy ma sekcję "Czego NIE robisz". ✅
- Tools per agent: 4-7 (nie wszystkie). ✅
- Model wymuszony: `'Claude Haiku 4.5'`. ✅

### Ważne: Haiku 4.5 dostępność

⚠️ Sprawdź czy uczestnicy mają **Claude Haiku 4.5** w pickerze. Free tier może mieć ograniczenia.

Jeśli Haiku nie ma → użyj fallback array:
```yaml
model: ['Claude Haiku 4.5', 'Claude Sonnet 4.6', 'GPT-5 mini']
```

VS Code spróbuje pierwszy, jak niedostępny → drugi, itd.

---

## Część 7 — Skąd zaczerpnąć więcej (oficjalne źródła)

Pełne dokumenty oficjalne (czytaj jak chcesz wgłąb):

1. **Custom agents** — pełna referencja YAML frontmatter:  
   https://code.visualstudio.com/docs/copilot/customization/custom-agents
2. **Tools** — wszystkie dostępne tools i jak działają:  
   https://code.visualstudio.com/docs/copilot/agents/agent-tools
3. **Subagents** — gdy chcesz żeby jeden agent wywoływał drugiego automatycznie:  
   https://code.visualstudio.com/docs/copilot/agents/subagents
4. **Hooks reference** — pola JSON dla hooków:  
   https://code.visualstudio.com/docs/copilot/customization/hooks
5. **Awesome Copilot** — 175+ przykładów agentów od społeczności:  
   https://github.com/github/awesome-copilot/tree/main/agents
6. **GitHub docs (custom agents config)** — alternatywne źródło:  
   https://docs.github.com/en/copilot/reference/custom-agents-configuration

### Cheat: gdzie szybko sprawdzić nazwy tools

W VS Code: panel czatu → ikona **Tools** (klucz/wrench) → klikalna lista wszystkich dostępnych. Aktualizuje się gdy zmienisz extensions / MCP.

---

## TL;DR — co tu się stało

1. **YAML frontmatter** ma ~15 pól; tych ważnych jest **6**: `name`, `description`, `tools`, `model`, `agents`, `handoffs`. Reszta to detale.
2. **Folder/język ograniczanie** **nie idzie przez YAML** — idzie przez **path-specific instructions** (`applyTo:` glob) + instrukcje w body agenta.
3. **Rozbicie Buildera na FE/BE pod Haiku jest świetną decyzją** — krótsze, focused konteksty.
4. **Setup który dostajesz**: Plan (built-in) → Frontend Builder → Backend Builder → Reviewer → TestWriter. Każdy z minimalnymi tools, krótkim body, jasnym scope.
5. **Handoffs robią workflow visually** — uczestnicy zobaczą przyciski "🔧 Switch to Backend Builder", "🔍 Review my work". To jest to "wow" które uczestnicy zapamiętają.
