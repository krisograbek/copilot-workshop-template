# GitHub Copilot w VS Code — kompletny research pod warsztat (maj 2026)

> Dokument przygotowany do 6-godzinnego warsztatu online dla ~12 osób (głównie devi, kilka osób nie-tech). Wszyscy mają darmowe konto GitHub i darmowy plan Copilot.

---

## Część 1 — Krajobraz w maju 2026 (co dokładnie jest na rynku)

### 1.1 Co siedzi w VS Code dzisiaj

Sam VS Code to edytor — darmowy, działa wszędzie, sam w sobie **nie ma żadnej AI**. AI dokłada się przez rozszerzenia. W praktyce każda osoba na warsztacie potrzebuje trzech rzeczy:

1. **VS Code** (najnowsza stabilna wersja — funkcje, o których mówimy, zaczęły się stabilizować od grudnia 2025 i są w stable od stycznia/lutego 2026)
2. **Konto na GitHubie** (darmowe)
3. **Rozszerzenie GitHub Copilot + GitHub Copilot Chat** (instaluje się z Marketplace, działa po zalogowaniu kontem)

Po instalacji w VS Code pojawia się ikona Copilota w pasku stanu i **panel czatu** (`Ctrl+Alt+I` na Windows/Linux, `Cmd+Ctrl+I` na Mac). To jest właśnie ten panel po prawej stronie. W panelu są dwa ważne elementy:

- **Dropdown wyboru trybu** (Ask / Edit / Agent + jakiekolwiek custom agents które utworzysz)
- **Model picker** — wybierasz, który model LLM odpowiada. Tu właśnie wybierasz między modelami od OpenAI (Codex/GPT), Anthropic (Claude) i Google (Gemini). Free tier ma swój zestaw, paid plany — większy.

Drugi element interfejsu to **Inline Chat** (`Ctrl+I`) — okno wyskakujące prosto w edytorze nad zaznaczeniem. Jest do drobnych przeróbek.

Trzeci to **Inline Suggestions / Completions** — szary "ghost text" jak piszesz, Tab żeby zaakceptować. To stary Copilot, działa cały czas niezależnie od czatu.

### 1.2 Pięć trybów pracy z Copilotem w VS Code

To trzeba zrozumieć przed wszystkim innym, bo każda funkcja działa inaczej w innym trybie.

| Tryb | Skrót / Gdzie | Co robi |
|---|---|---|
| **Inline completions** | Szary tekst w edytorze, Tab akceptuje | Sugestie linia po linii. Nie używa czatu. Free: 2000/miesiąc. |
| **Inline Chat** | `Ctrl+I` w edytorze | Krótka rozmowa nad zaznaczonym kodem. Edytuje od razu. |
| **Ask mode** | Panel czatu, opcja "Ask" | Tylko odpowiada na pytania, **nic nie zmienia w plikach**. |
| **Edit mode** | Panel czatu, opcja "Edit" | Edytuje wskazane pliki, ale nie odpala terminala ani nie iteruje. |
| **Agent mode** | Panel czatu, opcja "Agent" | Pełna autonomia: edytuje pliki, odpala komendy, czyta output, sam się poprawia w pętli. To jest ta "magia". |

Plus jeden dodatkowy, młodszy:

- **Plan mode** — built-in agent typu "planista". Tworzy `plan.md` z krokami implementacji, ale **nic nie koduje**. Dopiero potem przekazujesz plan do Agent mode (lub innego agenta) do wykonania.

Najważniejsza zmiana w stosunku do "starego Copilota" sprzed roku: dawniej Copilot to była głównie inline autocompletion + prosty czat. Dziś to jest **platforma agentowa** z trybem autonomicznym, customizacjami, planowaniem, hookami itd. Większość najlepszych praktyk dotyczy właśnie agent mode.

### 1.3 Limity Copilot Free (kluczowe dla warsztatu)

Stan na maj 2026. Każdy uczestnik dostaje:

- **2000 inline completions / miesiąc** — wystarczy spokojnie na warsztat
- **50 chat messages / miesiąc** (łącznie z agent mode, edit mode, code review) — to jest ostry limit
- **50 premium requests / miesiąc** — to są te najmocniejsze modele (Claude Opus, GPT-5.x, itp.). W praktyce każda wiadomość w agent mode = 1 premium request

**Co działa na Free:**
- Wszystkie tryby (Ask, Edit, Agent)
- Custom instructions, prompt files, custom agents, skills, hooks — pełna customizacja
- MCP servers
- Code review tylko jako "Review selection" w VS Code (nie pełen Code Review na PR)
- Limitowany model picker — dostępna podstawa, brak Claude Opus i najnowszych modeli premium
- Cloud agent niedostępny

**Praktyczna implikacja dla warsztatu:** 50 wiadomości na miesiąc to dużo dla pojedynczego użytkownika ale mało jeśli będziemy spamować w agent mode. Trzeba zaplanować ćwiczenia tak, żeby uczestnicy nie palili limitu na pierwszej godzinie. Sugestia: większość ćwiczeń w Ask/Edit mode (które też zużywają wiadomości, ale często dużo mniej intensywnie niż Agent), agent mode tylko 2-3 razy w kluczowych momentach.

> Uwaga: od **1 czerwca 2026** GitHub przechodzi na billing oparty o credits/tokens zamiast requestów. Nowe zapisy do Pro/Pro+/Student są od 20 kwietnia 2026 wstrzymane. Dla warsztatu w maju 2026 stary model 50 wiadomości/miesiąc dalej działa.

### 1.4 Co to są "agents, skills, instructions, prompts, hooks" w jednym akapicie

Cała ta terminologia to **mechanizmy customizacji Copilota**. Są to pliki Markdown (czasem JSON) w specjalnych lokalizacjach w repo (`.github/...`) lub w profilu użytkownika. Wszystkie da się "wyklikać" w VS Code przez **Chat Customizations Editor** (ikona koła zębatego w panelu czatu → "Configure Chat") lub wygenerować slash-komendami `/init`, `/create-instruction`, `/create-prompt`, `/create-agent`, `/create-skill`, `/create-hook`. Każdy z nich robi co innego — szczegóły w Części 2.

### 1.5 A co z Claude Code, Codex, innymi?

Trzy ścieżki konkurencyjne, które warto znać tylko jako kontekst (nie pracujemy z nimi na warsztacie):

- **Claude Code** (Anthropic) — produkt równoległy, historycznie terminal-based. Dziś też ma extension VS Code, ale wymaga osobnej subskrypcji ($20/100/200/mc). Jego pliki konfiguracyjne (`CLAUDE.md`, `.claude/agents/`, `.claude/skills/`) są **automatycznie czytane przez Copilota w VS Code** — formaty się skonwergowały. To znaczy, że workflow Borisa Cherny'ego (twórcy Claude Code) jest praktycznie 1:1 wykonalny w Copilocie.
- **OpenAI Codex** (extension VS Code) — osobny produkt OpenAI, dostępny dla Copilot Pro+. Można też wybrać model "Codex" w model pickerze Copilota, ale to inna rzecz niż osobna ścieżka Codex.
- **Cursor / Windsurf / Cline** — fork'i VS Code lub osobne narzędzia z agentem. Świetne ale poza zakresem.

**Wnioskujący punkt dla warsztatu:** w 2024-na-początku-2025 Claude Code był wyraźnie z przodu pod względem trybu agentowego, sub-agentów i customizacji. W ciągu 2025 GitHub Copilot **dogonił prawie wszystko** (custom agents, skills, hooks, plan mode, planning, sub-agents, cloud agents). Jeśli ktoś czytał najlepsze praktyki Claude Code z marca 2025 — większość przenosi się 1:1 do Copilota.

---

## Część 2 — Pięć mechanizmów customizacji w VS Code Copilot

Tu jest meritum warsztatu. Każdy mechanizm opisuję wedle schematu: **co to jest → kiedy używać → gdzie się trzyma plik → jak utworzyć w VS Code → przykład**.

Wszystkie te mechanizmy żyją w jednym z dwóch miejsc:
- **Workspace** — w repo, czyli `.github/...` (lub `.claude/...`, `.agents/...` — kompatybilnie). Commitujesz do gita, dzielisz z zespołem.
- **User** — w profilu VS Code (User Data folder). Tylko dla Ciebie, działa we wszystkich workspace'ach.

Hierarchia ważności: **User-level instructions mają wyższy priorytet niż repo-level** (jeśli się sprzeczają), ale w praktyce repo-level wygrywają w zespole bo są commitowane.

### 2.1 Instructions — "tło" które zawsze leci do AI

**Co to jest:** Pliki Markdown z regułami, które są **automatycznie dołączane** do każdego promptu przed wysłaniem do modelu. To jak system prompt dla Twojego projektu. AI ich nie widzi w odpowiedzi, ale działa zgodnie z nimi.

**Dwa typy:**

#### A) Repository-wide (zawsze aktywne)
Plik `.github/copilot-instructions.md` w korzeniu repo. **Zawsze ładowane** do każdego chatu w tym workspace. Dla rzeczy, które dotyczą całego projektu: stack technologiczny, konwencje nazewnicze, biblioteki preferowane/zakazane, jak się buduje i testuje.

```markdown
# Project: TaskMaster API

Stack: Python 3.12, FastAPI, Postgres, Pydantic v2.

## Coding rules
- Use type hints everywhere.
- Async functions for all DB operations.
- Tests with pytest, use fixtures from `conftest.py`.
- Logging via `structlog`, never `print()`.

## Architecture
- Layered: routers/ → services/ → repositories/ → models/
- Domain logic in services/, never in routers/.

## What to avoid
- No `requests` library — use `httpx`.
- No Pydantic v1 syntax.
```

#### B) Path-specific (warunkowe, glob-aktywowane)
Pliki `*.instructions.md` w katalogu `.github/instructions/`. Każdy ma **front matter** z `applyTo:` (glob). Aktywują się **tylko** gdy edytowany plik pasuje do globa. Reszta plików je ignoruje.

```markdown
---
applyTo: "**/*.tsx"
---
# React component rules

- Functional components only, no class components.
- Use TanStack Query for server state.
- Tailwind, nie styled-components.
- Każdy komponent ma własny plik z `Component.test.tsx`.
```

```markdown
---
applyTo: "src/api/**"
---
# API layer security

- Każdy endpoint wymaga `@requires_auth`.
- Walidacja inputu przez Pydantic, nie ręcznie.
- Loguj userId w każdym request (przez middleware, nie ręcznie).
```

**Jak to się stackuje:** Gdy edytujesz `src/api/users.tsx`, Copilot ewaluuje globy WSZYSTKICH plików `*.instructions.md` równolegle. Te które pasują → wszystkie się dołączają do kontekstu. Plus `copilot-instructions.md` zawsze na wierzchu. Brak konfliktów, brak nadpisywania — wszystko się unią.

**Jak utworzyć w VS Code:**
- `/init` w chat → wygeneruje `copilot-instructions.md` na podstawie analizy projektu
- `/create-instruction` → kreator dla pliku path-specific, pyta o glob i regułę
- Albo ręcznie w Chat Customizations Editor (ikona koła zębatego → tab "Instructions")

**Kiedy używać:**
- Zawsze. Każdy projekt powinien mieć przynajmniej jeden `copilot-instructions.md`.
- Path-specific gdy masz różne stosy / konwencje w różnych częściach repo (frontend vs backend, infrastruktura vs aplikacja).

**Pułapki:**
- Trzymaj zwięźle. Wszystko co tam wpiszesz leci do KAŻDEGO promptu — duże instrukcje to większy koszt tokenów i więcej "rozproszenia" modelu. Boris Cherny mówi że jego CLAUDE.md ma ~2500 tokenów.
- Pisz "dlaczego", nie tylko "co". Zamiast "use date-fns" → "use date-fns instead of moment.js because moment.js is deprecated and bloats bundle by 67KB".
- Pokazuj przykłady (good/bad) zamiast abstrakcyjnych reguł. Modele rozumieją lepiej.

### 2.2 Prompt files — "skróty na powtarzalne zadania"

**Co to jest:** Plik Markdown z gotowym, sparametryzowanym promptem. Wywołujesz go w czacie jako `/nazwa-prompta`. Dostępne też jako slash-commands. **W przeciwieństwie do instructions, prompty trzeba ręcznie odpalić.**

**Gdzie się trzymają:** `.github/prompts/*.prompt.md` (workspace) lub w profilu (user).

**Front matter:**
```markdown
---
description: 'Generuj test jednostkowy dla wybranej funkcji'
agent: 'agent'              # albo 'ask', 'plan', albo nazwa custom agenta
model: 'Claude Sonnet 4.6'  # opcjonalnie
tools: ['search/codebase']  # opcjonalnie
---

Twoim zadaniem jest napisać kompletny test pytest dla funkcji znajdującej się w ${selectedText}.

Wymagania:
- Użyj fixtures z conftest.py jeśli istnieją
- Pokryj happy path + min. 2 przypadki brzegowe
- Test dla wyjątków jeśli funkcja je rzuca
- Asercje używają pytest.approx() dla floatów
```

W ciele promptu możesz używać zmiennych: `${selectedText}` (zaznaczony tekst), `${file}` (aktywny plik), `${workspaceFolder}` (root projektu), `${input:nazwa}` (poprosi użytkownika o wpisanie).

**Jak utworzyć:**
- `/create-prompt` → kreator, opisz co chcesz, AI tworzy plik
- W Chat Customizations Editor → tab "Prompts" → New
- Albo ręcznie

**Kiedy używać:**
- Zadania które robisz wiele razy: "generuj commit message", "review tego diffa pod kątem bezpieczeństwa", "wygeneruj README dla tego folderu", "rozplanuj refactor"
- Boris ma `/commit-push-pr` którego używa codziennie. Każdy zespół powinien mieć swój zestaw 5-10 takich.

**Typowe prompty które warto mieć:**
- `commit-message.prompt.md` — generuje commit message z `git diff --staged`
- `review-pr.prompt.md` — przegląda otwarte PR pod kątem czystości, bezpieczeństwa, testów
- `explain-code.prompt.md` — wyjaśnia działanie zaznaczonego fragmentu pod kątem juniorów
- `write-tests.prompt.md` — generuje testy dla zaznaczonej funkcji
- `refactor.prompt.md` — wskazuje refactoring bez zmiany funkcjonalności

**Pułapka:** Prompty są lepsze niż wklejanie tego samego tekstu w kółko, ale to jeszcze nie agent. Dobry prompt = 5-30 linii. Dłuższe → rozważ skill albo agent.

### 2.3 Custom agents — "persony AI z własną osobowością i narzędziami"

**Co to jest:** Specjalizowany "tryb" w model pickerze, z własnymi instrukcjami, listą narzędzi i preferowanym modelem. Włączasz go jak Ask/Edit/Agent — dropdown w czacie. **Kluczowa różnica względem promptu:** prompt to jednorazowa komenda, agent to persistent persona, w której prowadzisz całą rozmowę.

**Gdzie się trzymają:** `.github/agents/*.agent.md` (workspace) lub w profilu. Kompatybilnie też `.claude/agents/*.md` (Claude format).

**Front matter:**
```markdown
---
name: Code Reviewer
description: Reviewer code wedle naszych standardów
tools: ['search/codebase', 'search/usages', 'readFile']
model: 'Claude Opus 4.6'
---

Jesteś senior code reviewerem. Zadanie: review kodu wedle reguł poniżej.

Sprawdź:
1. Naming: PascalCase dla klas, camelCase dla funkcji
2. Error handling: każdy async call w try/catch ze structured logging
3. Tests: każda publiczna metoda ma test
4. Performance: brak n+1 queries, brak loadowania całej tabeli do pamięci
5. Security: brak hardcoded secrets, walidacja inputu

Zgłoś naruszenia konkretnie, z linijką i propozycją fixu.
Nigdy nie edytuj kodu — tylko komentuj.
```

**Jak utworzyć:**
- `/create-agent` w chacie → wizard
- Chat Customizations Editor → tab "Agents" → New
- Ręcznie plik

**Built-in agents (zawsze są):**
- **Ask** — czat read-only
- **Edit** — edytuje pliki ale nie odpala komend
- **Agent** — pełna autonomia (default)
- **Plan** — planuje implementację, nic nie edytuje (od listopada 2025 built-in)

**Kiedy używać custom agents:**
- Specjalistyczne workflow które chcesz wykonywać raz po razie z konsystentnym podejściem
- Code Reviewer, Test Writer, Bug Hunter, Documentation Writer, Refactorer, Security Auditor, Database Architect

**Praktyczne wzorce:**
- **Planner z ograniczonymi narzędziami** — tylko read-only narzędzia (`search/codebase`, `web/fetch`). Daje plan, nie psuje niczego.
- **Implementer z pełnymi narzędziami** — robi to co Planner zaplanował.
- **Reviewer bez edit-tools** — czyta i komentuje, nigdy nie edytuje.

**Handoffs (przekazywanie między agentami):**
W front matter agenta możesz zdefiniować przyciski przekazywania pracy:
```yaml
handoffs:
  - label: Implement Plan
    agent: agent
    prompt: Implement the plan outlined above.
    send: false  # wstawi do inputu, ale nie wyśle
```
Po skończeniu agenta pojawia się przycisk → klik → przeskakujesz do drugiego agenta z kontekstem. To jest **mocny wzorzec workflow zespołowego** (zwłaszcza Plan → Implement → Review).

**Społeczność:** repo `github/awesome-copilot` ma 175+ gotowych agentów do skopiowania. Strona `awesome-copilot.github.com` ma to z wyszukiwarką.

### 2.4 Agent Skills — "pakiety wiedzy proceduralnej, ładowane dynamicznie"

**Co to jest:** Najbardziej zaawansowany mechanizm. Skill to **folder** z plikiem `SKILL.md` + opcjonalne skrypty, templates, przykłady, dokumentacja. Copilot **sam decyduje** kiedy go załadować na podstawie opisu w front matterze. Działa to przez progressive disclosure:

1. Copilot widzi tylko `name` + `description` wszystkich skilli — to są małe, leżą w kontekście
2. Gdy user prompt pasuje semantycznie do opisu — Copilot ładuje `SKILL.md` do kontekstu
3. Gdy w trakcie pracy potrzebuje konkretnego pliku ze skilla (np. template) — czyta go w tym momencie, ad-hoc

To znaczy że możesz mieć 50 skilli zainstalowanych, a tylko 1-2 trafią do kontekstu na daną sesję. Inaczej niż instructions, które są zawsze załadowane.

**Gdzie się trzymają:** 
- Workspace: `.github/skills/<nazwa>/SKILL.md`, też `.claude/skills/`, `.agents/skills/`
- Personal: `~/.copilot/skills/`, `~/.claude/skills/`

**Struktura skilla:**
```
.github/skills/
└── webapp-testing/
    ├── SKILL.md          # opis + instrukcje + linki do reszty
    ├── test-template.js  # template testu
    ├── scenarios/
    │   └── login.md      # przykład scenariusza
    └── scripts/
        └── setup-e2e.sh  # skrypt który skill może wywołać
```

**`SKILL.md`:**
```markdown
---
name: webapp-testing
description: |
  Used when writing or running end-to-end tests for our web app.
  Use when asked about Playwright tests, E2E coverage, or testing
  user flows like login, checkout, account management.
allowed-tools: ['bash', 'readFile']  # explicit lista, defaultowo brak shell
---

# Webapp Testing

When writing E2E tests:

1. Use the template at `test-template.js` as starting point
2. For login flows, see `scenarios/login.md`
3. Setup is done via `scripts/setup-e2e.sh` — run it once before running tests
4. ...
```

**Jak utworzyć:**
- `/create-skill` w chacie → wizard
- `gh skill install <plugin>@awesome-copilot` z CLI (jeśli masz Copilot CLI)
- Ręcznie folder z plikami

**Skill vs Instruction vs Prompt — kiedy czego?**

| Kryterium | Instruction | Prompt | Skill |
|---|---|---|---|
| Kiedy się aktywuje | Zawsze (lub glob-match) | Ręcznie (`/nazwa`) | Auto, gdy AI uzna że pasuje |
| Co zawiera | Reguły, konwencje | Komendę z parametrami | Wielokrokową procedurę + pliki |
| Wielkość | Mała (zwięzła) | Średnia | Duża, z artefaktami |
| Przykład | "Use date-fns, not moment" | "Generate commit msg" | "Debug failing CI pipeline" |
| Format | `.md` z opcjonalnym `applyTo:` | `.prompt.md` w prompts/ | Folder z `SKILL.md` |

**Kiedy używać skills:**
- Złożone, wieloetapowe procedury których pracownik nie pamięta z głowy (debug CI, migracja DB, generowanie release notes z konkretnymi krokami)
- Workflowy które wymagają zewnętrznych zasobów (templates, scripts, decision trees)
- Wiedza domain-specific która rzadko jest potrzebna ale jak już to dokładnie

**Społeczność:** repo `anthropics/skills` (oryginalne) + `github/awesome-copilot` (skills + agents + instructions). 200+ skilli do wzięcia.

### 2.5 Hooks — "automatyzacja na zdarzeniach życia sesji"

**Co to jest:** Shell commands, które VS Code automatycznie odpala w określonych momentach sesji agenta. To nie jest customizacja "co AI mówi", tylko "co się dzieje wokół tego co AI robi". Najbliższe analogii: git hooks albo pre-commit hooks, tylko że dla AI.

**Gdzie się trzymają:** `.github/hooks/*.json` (workspace, team-shared), `.claude/settings.json` (Claude format też działa), `~/.claude/settings.json` (user-level).

**Lifecycle events (8 sztuk):**

| Event | Kiedy się odpala |
|---|---|
| `SessionStart` | Na początku nowej sesji agenta |
| `UserPromptSubmit` | Gdy user wysyła prompt |
| `PreToolUse` | **Przed** wywołaniem dowolnego tool'a (czyli edit pliku, bash, web fetch) |
| `PostToolUse` | **Po** udanym wywołaniu tool'a |
| `PreCompact` | Przed kompresją kontekstu |
| `SubagentStart` / `SubagentStop` | Start/koniec sub-agenta |
| `Stop` | Koniec sesji |

**Format JSON:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "type": "command",
        "command": "npx prettier --write $CLAUDE_FILE_PATHS",
        "timeout": 30
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "type": "command",
        "command": "./scripts/validate-bash.sh",
        "timeout": 5
      }
    ]
  }
}
```

Hook może zwrócić JSON na stdout który **wpływa na akcję** — np. PreToolUse hook może zwrócić `{"decision": "deny", "reason": "..."}` żeby zablokować akcję.

**Klasyczne use case:**
- **Auto-format po edycji** — `PostToolUse` z `prettier`/`black`/`gofmt`. Boris Cherny robi dokładnie to w swoim workflow.
- **Audit trail** — log każdej akcji do pliku
- **Security guard** — `PreToolUse` blokuje `rm -rf`, `sudo`, dostęp do `.env`
- **Auto-lint i auto-test** — po edit'cie automatycznie odpalaj lint i testy

**Jak utworzyć:**
- `/create-hook` → wizard
- Chat Customizations Editor → tab "Hooks"

**Pułapka bezpieczeństwa:** Hooki **wykonują dowolny shell command z uprawnieniami VS Code'a**. Nigdy nie kopiuj cudzych hooków bez przeczytania. Plus org może zablokować hooki w VS Code (enterprise policy).

### 2.6 Jak te mechanizmy ze sobą współgrają — workflow przykład

Wyobraź sobie pojedyncze pytanie do agenta: "Dodaj endpoint POST /users/avatar do upload zdjęcia profilowego." Co się dzieje pod spodem w kolejności:

1. **`copilot-instructions.md`** — załadowane zawsze. AI wie że projekt to FastAPI + Postgres, walidacja Pydantic, async.
2. **`.github/instructions/api.instructions.md`** z `applyTo: src/api/**` — załadowane, bo prawdopodobnie edytujemy w `src/api/`. AI wie że każdy endpoint wymaga `@requires_auth`, że trzeba logować userId.
3. **`webapp-testing` skill** — dopasowany semantycznie ("dodaj endpoint" + projekt ma istniejące testy E2E w skills). AI ładuje SKILL.md.
4. **Agent: built-in `Agent`** (default, no custom). Ma wszystkie tools.
5. AI tworzy plik handlera, model bazy danych, schemat Pydantic, test.
6. Każdy zapis pliku → **PostToolUse hook**: `prettier --write` formatuje.
7. AI próbuje odpalić `pytest` → **PreToolUse hook** sprawdza że to dozwolona komenda → puszczam.
8. Test failuje → AI sam analizuje błąd, poprawia.
9. Test przechodzi → AI proponuje commit. Ty wpisujesz `/commit-push-pr` (twój **prompt**) → kreuje commit message, robi push, otwiera PR.
10. PR otwarty → możesz teraz uruchomić swojego **custom agenta "Code Reviewer"** żeby zweryfikował zmiany przed mergem.

To jest pełna pętla i pokazuje że te mechanizmy nie są alternatywami — są **warstwami**, każda w innym wymiarze.

---

## Część 3 — Workflowy najlepszych developerów (i jak je przełożyć na Copilota)

W tej sekcji zbieram wzorce od osób które mają autorytet w temacie. Każdy wzorzec mapuję na Copilota.

### 3.1 Boris Cherny (twórca Claude Code, Anthropic)

Wystąpił publicznie w styczniu 2026 z 13 tipami "How I Use Claude Code" plus szczegółowy wywiad u Gergely'a Orosza. Te wzorce są bazowe i większość dobrych praktyk się z nich wywodzi.

#### Wzorzec 1: Plan first, code second
> "Most sessions start in Plan mode. If my goal is to write a Pull Request, I will use Plan mode, and go back and forth with Claude until I like its plan. From there, I switch into auto-accept edits mode and Claude can usually 1-shot it."

To jest **najważniejszy** wzorzec. Boris ma jedną zasadę nadrzędną: **nigdy nie pozwól modelowi pisać kodu, dopóki nie zatwierdziłeś planu**.

**W Copilocie:** Użyj wbudowanego trybu **Plan agent** (`/plan` w czacie albo wybór z dropdownu). Tworzy plik `plan.md` automatycznie w `memories/session/`. Iteruj nad planem, popraw, dopiero potem przełącz na Agent mode i powiedz "wykonaj plan z `plan.md`".

#### Wzorzec 2: CLAUDE.md (u nas: copilot-instructions.md) jako living document
Każdy zespół w Anthropic ma swój CLAUDE.md w git, który dokumentuje:
- mistakes (tak żeby Claude/Copilot uczył się i ich nie powtarzał)
- style conventions
- design guidelines
- PR templates

Boris **dodaje notki do CLAUDE.md z code review'ów**: "@.claude add this learning to CLAUDE.md".

**W Copilocie:** dokładnie to samo z `copilot-instructions.md`. Po każdym PR-review, kiedy zauważasz że Copilot powtarza ten sam błąd, dodaj jedną linijkę do `copilot-instructions.md`. Boris dba żeby plik nie urósł — jego ma ~2.5k tokenów.

#### Wzorzec 3: Slash commands na wszystko co robisz wielokrotnie
> "I use slash commands for every inner loop workflow that I do many times a day. This saves me from repeated prompting, and makes it so Claude can use these workflows, too."

Boris i jego zespół używają `/commit-push-pr` codziennie. Wszystkie commands są commitowane do `.claude/commands/`.

**W Copilocie:** to są **prompt files** (`.github/prompts/*.prompt.md`). Te same use case'y. Twórz prompty na te 5-10 rzeczy które robisz codziennie.

#### Wzorzec 4: Sub-agenty jak slash commands
Boris używa sub-agentów (`code-simplifier`, `verify-app`) regularnie. Traktuje je jak "wyspecjalizowane prompty z własnymi narzędziami".

**W Copilocie:** to są **custom agents** (`.github/agents/*.agent.md`). Możesz mieć agenta "Code Simplifier" który ma jeden cel — uproszczać kod po tym jak główny agent skończy pracę.

#### Wzorzec 5: PostToolUse hook do auto-format
> "We use a PostToolUse hook to format Claude's code. Claude usually generates well-formatted code out of the box, and the hook handles the last 10% to avoid formatting errors in CI later."

**W Copilocie:** dokładnie to samo. Hook w `.github/hooks/`:
```json
{
  "hooks": {
    "PostToolUse": [
      { "matcher": "Write|Edit", "type": "command", "command": "npm run format" }
    ]
  }
}
```

#### Wzorzec 6: /permissions zamiast --dangerously-skip-permissions
> "I don't use --dangerously-skip-permissions. Instead, I use /permissions to pre-allow common bash commands that I know are safe in my environment."

Boris pre-aprobuje konkretne komendy które są bezpieczne (`npm test`, `npm run build`) — komitowane do `.claude/settings.json`, dzielone z zespołem.

**W Copilocie:** Permission picker w czacie (ikona obok agent type). Możesz ustawić poziom dla sesji. Persistowanie przez setting `chat.permissions.default`.

#### Wzorzec 7: Feedback loop dla agenta
> "The most important tip is to give Claude a way to verify its work through a feedback loop, such as running a bash command, a test suite, or testing the app through the browser or a simulator."

Bez sposobu na weryfikację, agent strzela ślepymi nabojami. Z testami → agent sam iteruje aż przechodzą.

**W Copilocie:** dodaj do `copilot-instructions.md` zdanie: "When you finish a change, always run `npm test`. If tests fail, fix them before reporting completion."

#### Wzorzec 8: 5+ równoległych sesji
Boris ma w terminalu 5 tabs, każda to osobny git checkout, każda to osobna sesja Claude. Wysyła zadanie do każdej, czeka, przegląda diffy.

**W Copilocie:** Otwórz wiele okien VS Code z różnymi checkout'ami. Każde ma swoją sesję agent mode. Plus cloud agents (jeśli masz Pro/Business) odpalasz w tle. Free user tego nie zrobi w pełni — dla warsztatu na free pomińmy.

### 3.2 Simon Willison (Datasette, Django co-creator)

Simon to najbardziej trzeźwy głos w temacie. Jego patterns:

#### Wzorzec: "LLM as overconfident junior developer"
> "Think of an LLM pair programmer as over-confident and prone to mistakes. It writes code with complete conviction — including bugs or nonsense — and won't tell you something is wrong unless you catch it."

**Implikacja dla warsztatu:** zawsze testuj output. Nigdy "wklej i puść". Czytaj kod.

#### Wzorzec: Hoard known techniques
Simon trzyma "skarbiec" rozwiązań w swoim GitHubie (simonw/tools) — każdy mały tool. AI **bardzo dobrze rekomponuje** techniki które już znasz: paste'ujesz kod referencyjny z poprzedniego projektu i mówisz "zrób tak samo tutaj".

**W Copilocie:** ten wzorzec mapuje się na **prompt files** + **skills**. Skill może zawierać template'y twoich starych rozwiązań.

#### Wzorzec: Cognitive debt
> "Code runs, but you don't understand the principle."

Simon ostrzega przed sytuacją gdy "vibe coding" generuje działający kod którego nie rozumiesz. Jego sposób: po vibe code session, każe agentowi wygenerować **interaktywne wyjaśnienie** (walkthrough document, animowane diagramy). Dług kognitywny → spłata przez naukę.

#### Wzorzec: Tests as specification language
Simon (i wielu innych w 2026) widzi testy jako primary specification dla agenta. Zamiast pisać dłuuugi prompt, piszesz failing test → "make it pass". Test daje agentowi feedback loop + verification.

### 3.3 Armin Ronacher (Flask, Sentry)

Najbardziej skrytyczny + najbardziej praktyczny głos. Jego key insights:

#### Wzorzec: Simple over clever
> "Prefer simple, descriptive function names over clever classes. Use plain SQL rather than complex ORMs. Keep permission checks locally visible."

Agenci pracują **lepiej** na prostym kodzie. Złożone abstrakcje, magic, deep inheritance → agent się gubi. To zmienia paradygmat: pisz dla agenta tak jak pisałbyś dla nowego juniora.

#### Wzorzec: Fast feedback loops
> "Fast compilation, fast tests, fast tool responses. If your toolchain is slow, agents will struggle."

Agent w pętli "edit → test → fix" robi to 5-10 razy. Jak każda iteracja trwa 30s, to 5 minut. Jak 30 minut, to 5 godzin. Inwestuj w szybkie testy zanim zaczniesz pracować z agentem.

#### Wzorzec: "Tools need to be protected against an LLM chaos monkey"
Agent czasem zrobi coś głupiego (skasuje, rozwali). Twoje narzędzia muszą być odporne:
- Read-only domyślnie
- Wyraźne błędy które agent rozumie (zła komenda → "did you mean X?")
- Sandbox / izolacja

#### Wzorzec: Mental disengagement is the real risk
> "When you stop thinking like an engineer, quality drops, time gets wasted and you don't understand and learn."

To jest kluczowe ostrzeżenie. Nadmierna automatyzacja = mózg się wyłącza = po pół roku jesteś gorszym programistą. **Warsztatowy punkt:** pokazuj że Copilot **uzupełnia** myślenie, nie zastępuje.

#### Wzorzec: Nie automatyzuj rzeczy których nie robisz regularnie
Armin pisze że ma stos "porzuconych automatyzacji". Reguła: automatyzuj **tylko to co robisz wielokrotnie**. Inaczej automatyzacja gnije.

### 3.4 Addy Osmani (Google)

Addy w grudniu 2025 napisał "My LLM coding workflow going into 2026". Punkty:

#### Wzorzec: Spec.md przed kodem
Pierwszy krok każdego większego zadania: brainstorm z AI → wspólnie tworzycie `spec.md` (requirements + architecture + data model + testing strategy). Dopiero potem kodowanie.

**W Copilocie:** wbudowany Plan mode robi większość tego automatycznie. Można też mieć prompt `/spec` który specjalnie generuje spec.md.

#### Wzorzec: "AI lets me operate at higher level of abstraction"
> "I focus on design, interface, architecture while it churns out the boilerplate."

Twoja rola = arcytekt + reviewer. AI = implementer.

### 3.5 Wspólne mianowniki (co mówią wszyscy)

Niezależnie od osoby, te wzorce się powtarzają — to jest sól research'u:

1. **Plan przed kodem.** Plan mode, plan.md, spec.md — call it whatever.
2. **Każde zadanie ma "definition of done".** Testy, asercje, kryteria akceptacji **w prompcie**.
3. **Trzymaj kontekst czysty.** Nowa sesja dla nowego zadania. Nie pozwalaj długim historiom rozmywać uwagi.
4. **Living config files.** `copilot-instructions.md` ewoluuje z każdym PR-review.
5. **Slash commands na wszystko powtarzalne.** Codzienna pętla → prompt.
6. **Auto-format hookiem.** Nie pozwól na "ale CI nie przeszło bo brak spacji".
7. **Read-only by default.** Permissions ostrożnie.
8. **Review wszystko.** Trust but verify. Każdy diff czytany przed mergem.
9. **Feedback loop = testy.** Agent który nie ma jak zweryfikować → strzela ślepymi.
10. **Mental engagement.** Nie wyłączaj mózgu. AI ≠ wykonawca; AI = junior pod twoją kontrolą.

---

## Część 4 — Czego Copilot NIE umie (vs Claude Code i konkurencja)

Sekcja przygotowana żeby na warsztacie odpowiedzieć "a czy się da..." Stan na maj 2026.

### Co Copilot potrafi prawie tak samo dobrze jak Claude Code:
- Wszystkie 5 mechanizmów customizacji (instructions, prompts, agents, skills, hooks)
- Plan mode → Implement mode
- Sub-agents (custom agents z handoffs)
- Auto-accept edits
- Cloud agents (na płatnych planach)
- MCP servers
- Permission management
- 1M token context window (z modelami które to wspierają)

### Czego Copilot **NIE** umie / robi gorzej:

| Funkcja | Claude Code | Copilot |
|---|---|---|
| **Parallel sub-agent teams** | Tak — wiele sub-agentów w paralel z dependency tracking | Częściowo — sub-agents są, ale orchestracja prostsza |
| **`/loop` — recurring tasks** | Tak — `/loop babysit my PRs` przez 3 dni | Nie ma bezpośredniego ekwiwalentu |
| **`/teleport` sesji między urządzeniami** | Tak (CLI ↔ mobile ↔ web) | Sessions list działa per-machine, ale teleport ograniczony |
| **Native sandbox / `/sandbox`** | Tak — pełny sandbox dla bash | Częściowo — przez permissions, ale mniej granularnie |
| **`/rewind` do dowolnego checkpoint'u** | Tak | Tak (checkpoints), ale prostsze |
| **`--dangerously-skip-permissions`** | Tak (Boris nie używa, ale jest) | Permission picker + autopilot — podobnie |
| **Native Slack/Linear integracje przez MCP** | Mature | Działa, ale ekosystem nieco młodszy |
| **`/voice` voice input** | Tak | VS Code ma voice w inline chat, ale nie pełne |
| **`/fewer-perms` automatyczne ograniczanie** | Tak | Nie ma 1:1 |
| **Workflowy agentic na schedule (cron)** | Tak | Cloud agents można triggerować przez GitHub Actions schedule |

### Kluczowe praktyczne różnice dla początkujących:

1. **Claude Code jest CLI-first**, Copilot jest IDE-first. Dla osób które żyją w VS Code, Copilot ma niższy próg wejścia.
2. **Claude Code wymaga płatnej licencji od dnia zero** ($20/100/200/mc). Copilot ma darmowy plan z 50 wiadomościami.
3. **Cloud agents** — Copilot mocno integruje się z GitHub PR-flow. Cloud agent dostaje issue → tworzy branch → otwiera PR. To jest unikalne dla Copilota.
4. **Pre-built skills i agents** — `github/awesome-copilot` ma 600+ resources, anthropics/skills ma swoje. Te dwa repozytoria są **wzajemnie kompatybilne** (pliki działają w obu narzędziach).

---

## Część 5 — Best practices DLA POCZĄTKUJĄCYCH (warsztat, prosta apka)

Wybrane *kluczowe* wzorce dla 6h warsztatu, w którym budujemy prostą aplikację. Reszta best practices → Część 6 dla seniorów.

### 5.1 Setup — pierwsze 30 minut warsztatu

Każdy uczestnik na koniec setupu ma mieć:

1. VS Code zainstalowany
2. Zalogowany przez GitHub
3. Extensions zainstalowane: GitHub Copilot + GitHub Copilot Chat (zwykle jak install jednego, drugi też się dociągnie)
4. Włączony Agent mode (default jest, ale warto pokazać ikonę w pasku stanu Copilota)
5. **Sprawdzone że działa**: prosty prompt "create hello.py with print('hello')" w Agent mode → uczestnik widzi że plik się tworzy

### 5.2 Minimum viable customization — w trakcie warsztatu

W trakcie 6h każdy uczestnik tworzy **dokładnie te 3 pliki**:

#### A) `.github/copilot-instructions.md` (jeden plik, ~30-50 linijek)
Generowany w 60 sekund przez `/init`. Po wygenerowaniu — uczestnik **czyta i poprawia** (kluczowy moment: AI nie wie wszystkiego o tobie, plik wymaga editowania).

#### B) Jeden prompt file: `.github/prompts/explain.prompt.md`
```markdown
---
description: 'Wyjaśnij zaznaczony kod dla osoby nietechnicznej'
---
Wyjaśnij poniższy fragment kodu używając analogii z życia codziennego.
Nie używaj żargonu programistycznego.

Kod: ${selectedText}
```

To pokazuje **mechanizm promptów** + jest praktyczne (uczestnik może później pokazać niezrozumiały kod znajomemu).

#### C) Jeden custom agent: `.github/agents/reviewer.agent.md`
```markdown
---
name: Reviewer
description: Reviewer kodu pod kątem czytelności i bugów
tools: ['readFile', 'search/codebase']
---

Jesteś code reviewerem. Sprawdź czy kod jest:
1. Czytelny — czy nazwy zmiennych mówią co się dzieje
2. Bezpieczny — czy są oczywiste bugi/błędy
3. Otestowany — czy ma testy

Zgłaszaj jedno naruszenie na raz, konkretnie z linijką.
NIE EDYTUJ kodu — tylko komentuj.
```

To pokazuje że **agenta można zbudować w 5 minut** i że można go odseparować od głównego agenta (nie nadpisze ci kodu).

### 5.3 Workflow dla początkujących — 5 kroków, które muszą wejść w nawyk

To jest minimum-viable agent flow. Każdy uczestnik musi go przejść **przynajmniej dwa razy** podczas warsztatu na różnych zadaniach.

#### Krok 1: Plan przed kodem
Otwórz czat → wybierz **Plan** mode → opisz zadanie ("dodaj endpoint do uploadu pliku"). Plan agent zada pytania doprecyzowujące. Iteruj, aż plan ma sens. Plan jest w `plan.md`.

#### Krok 2: Przejdź do Agent mode
Wybierz **Agent** w dropdown. Napisz: "wykonaj plan z `plan.md`". Albo skorzystaj z przycisku handoff (jeśli Plan agent ma takie skonfigurowane).

#### Krok 3: Patrz co robi
NIE klikaj "auto-approve all". Pierwsze 5 akcji zatwierdzaj ręcznie żeby zobaczyć jak agent pracuje. Potem ewentualnie autopilot.

#### Krok 4: Testuj zanim zaakceptujesz
Po skończeniu agenta — **uruchom kod**. Zobacz czy działa. Otwórz testy. Sprawdź diff.

#### Krok 5: Review (twoim własnym custom agentem)
Przełącz na agenta `Reviewer` → "review changes I just accepted". On NIC nie zmieni, tylko skomentuje. Czytaj uwagi, wprowadzaj poprawki sam albo przez agenta.

To są te 5 kroków, które przekuwają wszystkie wzorce Borisa/Simona/Armina w coś co początkujący zrozumie i wykona.

### 5.4 Zasady-złote dla początkujących (jednolinijkowce)

Powieś na warsztacie, każdy uczestnik niech sobie zapisze:

1. **Plan first. Code second.**
2. **Każde zadanie ma "kiedy uznać że zrobione".** (test? wymóg w prompcie? screenshot?)
3. **Nowa sesja dla nowego zadania.** (Nie wal wszystkiego do jednego czatu.)
4. **Czytaj diff przed akceptacją.** (Tab ≠ Enter na nowym życiu produkcji.)
5. **Jak AI 3 razy się myli w tym samym miejscu — dopisz to do `copilot-instructions.md`.**
6. **Limit 50 wiadomości / miesiąc.** Nie spamuj.
7. **Jak nie wiesz dlaczego coś działa — zapytaj agenta `explain`.** (Cognitive debt.)
8. **Free Copilot to demo, nie tool produkcyjny.** Jeśli ci się spodoba — Pro.

### 5.5 Typowe pułapki w pierwszym dniu

To gdzie ludzie się wykładają na warsztatach:

- **Zapominają wybrać Agent mode** — siedzą w Ask i się dziwią że nic nie kodzi
- **Zapominają zainstalować Copilot Chat** osobno (różny extension od Copilot core)
- **Pakują wszystko do jednego czatu** — kontekst rośnie, jakość spada
- **Nie wiedzą jak wskazać kontekst** — `#file:nazwa.py`, `@workspace`, `#selection` w czacie
- **Klikają Accept All** — i agent rozwala plik
- **Free limit się kończy w godzinę** — bo każde "ok zrób to" w agent mode = osobna wiadomość

### 5.6 Co dać uczestnikom jako homework / dalej

Zestaw odnośników na koniec warsztatu:
- `github/awesome-copilot` — repo z 600+ gotowych konfiguracji
- `awesome-copilot.github.com` — strona z wyszukiwarką
- VS Code docs: code.visualstudio.com/docs/copilot
- Boris Cherny tips: `howborisusesclaudecode.com` (mimo że to o Claude Code, mappingi są te same)
- Simon Willison: `simonwillison.net/tags/ai-assisted-programming`
- Addy Osmani: `addyosmani.com/blog/ai-coding-workflow`

---

## Część 6 — Best practices DLA SENIORÓW (aneks)

Te wzorce są zaawansowane i mogą wybrukać warsztat. Wrzucaj je do warsztatu **tylko jeśli zostanie czas** albo jeśli ktoś dopyta. Inaczej zachowaj na ewentualną drugą sesję / followup.

### 6.1 Sub-agents jak slash commands

Boris: "Subagents są jak slash commands z większą izolacją." Setup pipeline:
1. `/plan` (Plan agent) → tworzy plan
2. **Custom agent `Implementer`** (z auto-accept) → wykonuje plan
3. **Custom agent `Simplifier`** (read+write) → upraszcza kod po implementerze
4. **Custom agent `Reviewer`** (read-only) → review zmian
5. **Custom agent `TestWriter`** (write only do tests/) → dodaje brakujące testy

Każdy z nich ma własny zestaw tools i własne instrukcje. Możesz przeskakiwać między nimi handoffs'ami. To jest **niemal pełny pipeline release'u** zaszyty w configu repo.

### 6.2 Wielopoziomowa hierarchia instructions w monorepo

W monorepo: `.github/instructions/` na różnych głębokościach, z różnymi globami:
```
.github/copilot-instructions.md           # zawsze, podstawy projektu
.github/instructions/
  ├── frontend.instructions.md            # applyTo: "apps/web/**"
  ├── backend.instructions.md             # applyTo: "apps/api/**"  
  ├── infra.instructions.md               # applyTo: "infrastructure/**"
  └── tests.instructions.md               # applyTo: "**/*.test.*"
```

Plus włączenie ustawienia `chat.useCustomizationsInParentRepositories: true` jeśli pracujesz w sub-folderze monorepo a `.github/` jest wyżej.

### 6.3 MCP-driven skills

Skill który ma instrukcje + MCP serwer do realnych zewnętrznych systemów. Przykład:
- Skill `debug-prod-issue` z MCP do Sentry + Datadog + PagerDuty
- Gdy ktoś pyta o produkcyjny issue → skill się aktywuje → wyciąga ze Sentry stacktrace → odpowiada z konkretami

To **wykracza poza zakres warsztatu** (MCP to osobny temat) ale warto wiedzieć że istnieje.

### 6.4 Parallel sessions + worktrees

Boris: 5 równoległych Claude'ów, każdy w osobnym `git worktree`. Workflow:
- Tab 1: feature A
- Tab 2: feature B (niezależne od A)
- Tab 3: bug fix
- Tab 4: refactor
- Tab 5: review komuś jego PR

**W Copilocie:** wiele okien VS Code + Copilot CLI w terminalu + cloud agents w tle. Free user nie zrobi tego w pełni; Pro+ czy Business — jak najbardziej.

### 6.5 PR-driven evolution of instructions

@.claude / @copilot bot na PR review:
- Reviewer komentuje "AI used `requests` instead of `httpx`"
- Replier: "@.claude add this learning to CLAUDE.md"
- AI tworzy commit do PR który dopisuje regułę do `copilot-instructions.md`
- Merge → cały zespół ma już regułę w kontekście

Wymaga konfiguracji `claude.yml` / Copilot GitHub Action.

### 6.6 Spec-driven development

W zaawansowanej formie: **kod jest produktem ubocznym specu**. Repozytorium ma `specs/` z plikami markdown opisującymi system. Kod się regeneruje. Narzędzia: GitHub Spec Kit, OpenSpec, Kiro. Awantgarda ale realnie używana w niektórych zespołach.

### 6.7 Custom planning agent z templates

Standardowy Plan agent jest ogólny. Można zrobić własny z templates planu specyficznymi dla zespołu:
```yaml
---
name: TeamPlanner
description: Plan generator dla naszego zespołu
tools: ['search/codebase', 'web/fetch', 'readFile']
model: 'Claude Opus 4.6'
handoffs:
  - label: Implement
    agent: agent
    prompt: "Implement plan.md step-by-step. After each step run tests."
---

Twoim zadaniem jest stworzyć plan implementacji.

Format planu (MUST):
1. **Goal** — co osiągamy w jednym zdaniu
2. **Affected files** — lista plików które trzeba zmienić, z uzasadnieniem
3. **Steps** — ponumerowane, każdy ≤2h pracy
4. **Tests** — które testy potwierdzą że działa
5. **Rollback** — jak cofnąć w razie problemu
6. **Risks** — co może pójść nie tak

Zapisz w `plan.md`.
Zadawaj pytania jeśli nie znasz: domain, użytkowników, ograniczeń.
NIGDY nie edytuj kodu.
```

To jest agent który *narzuca strukturę* planów na zespół.

### 6.8 Diff-first, loop-first

Senior pattern z "Agentic AI Handbook":
- **Diff-first:** każda zmiana review'owana jako diff w PR (nie linijka po linijce w czacie)
- **Loop-first:** agent działa w pętli z **clear exit conditions** (testy zielone, lint czysty, eval threshold)

Praktycznie: każdy task = osobna gałąź + osobny PR + clear "done when". Nie wolisz long-running session bez końca.

### 6.9 Context window economy

Zaawansowane techniki:
- `/compact` — kompresuje historię czatu zachowując esencję
- `/clear` po każdym zadaniu — zerowy state
- Maksymalna jakość modelu = pierwsze ~50% context window. Reszta = "context rot".
- Pliki które nie są częścią aktualnego zadania → usuń z kontekstu (`#file:` ale potem clear)

### 6.10 Mental model: AI jako reviewer reviewer'a

Niektórzy seniorzy używają drugiego modelu (np. GPT) do review zmian wygenerowanych przez Claude'a (i odwrotnie). "AI on AI code review" — łapie rzeczy które jeden model przegapił. W Copilocie: zmień model w pickerze przed code review, daje surowsze opinie.

---

## Część 7 — Praktyczne uwagi dla 12-osobowego warsztatu online

### 7.1 Co działa, co nie na Free tier — kontrolnie

✅ Działa:
- Wszystkie tryby (Ask, Edit, Agent)
- Custom instructions, prompts, agents, skills, hooks
- Plan mode (jest built-in)
- Slash commands
- Generators (`/init`, `/create-instruction`, itd.)
- Wybór modelu w pickerze (z ograniczonej listy)
- MCP servers
- Inline completions

❌ Nie działa / ograniczone:
- Cloud agents (musisz mieć Pro/Business)
- Pełne code review na PR (tylko "Review selection" w VS Code)
- Top modele (Claude Opus, GPT-5 najnowsze) — w pickerze są niedostępne
- Premium request capacity — 50/mc to mało jeśli sesje są długie

### 7.2 Co przygotować przed warsztatem

**Po stronie klienta (uczestników):**
- VS Code zainstalowany (najnowsza stabilna)
- Konto GitHub (każdy)
- Stabilne łącze (5+ Mbps — Copilot Chat dużo gada z chmurą)
- Mikrofon do pytań

**Po stronie prowadzącego:**
- Drugi monitor / drugie konto żeby pokazywać setup z perspektywy "świeżego użytkownika"
- Slajdy z kluczowymi screenshot'ami (Chat Customizations Editor, model picker, dropdown agentów)
- Repo szablonowe gotowe do sklonowania:
  - `copilot-instructions.md` (pusty z komentarzem żeby uzupełnili)
  - 1 przykładowy prompt
  - 1 przykładowy custom agent
  - README z 5-krokowym workflowem
- Lista 3-5 "zadań warsztatowych" o rosnącej trudności (od "dodaj button do strony" po "dodaj nowy endpoint z testami")
- Awaryjny plan B na wypadek gdyby Copilot Free padł u kogoś (też się zdarza)

### 7.3 Typowe pułapki 12-osobowego callu online

- **Setup zajmuje 30-45 minut.** Zacznij od tego, koniecznie. Nie zostawiaj na ostatnią chwilę.
- **Ktoś będzie miał problem z auth na GitHubie** — zaplanuj 5 minut bufora dla każdej osoby.
- **Free limit się wyczerpie u 1-2 osób.** Miej w zapasie zadanie które nie wymaga agent mode.
- **Ekran współdzielony jest mały u uczestników.** Powiększ czcionkę w VS Code do 18-22pt.
- **Pytania o "a czy w Cursorze..." / "a co z Claude Code..."** — miej krótkie odpowiedzi gotowe (sekcja 4).
- **Nie-devi się zgubią przy słowach typu "PR", "diff", "lint"** — definiuj na bieżąco.

### 7.4 Sugerowany budżet czasu (6h)

To tylko sugestia, dopasuj.

| Czas | Co | Czemu |
|---|---|---|
| 0:00–0:30 | Setup wszystkich, welcome, kontekst | Bez tego nic nie zadziała |
| 0:30–1:15 | Część 1: jak działa Copilot, 5 trybów, demo | Fundament |
| 1:15–1:30 | Przerwa | — |
| 1:30–2:45 | Część 2A: instructions + prompts (z ćwiczeniem) | Najczęściej używane |
| 2:45–3:00 | Przerwa | — |
| 3:00–4:15 | Część 2B: custom agents + skills + hooks (z ćwiczeniem) | Tu robi się ciekawiej |
| 4:15–4:30 | Przerwa | — |
| 4:30–5:30 | Workflow Borisa + ćwiczenie "buduj proste mini-app w 5 krokach" | Spinanie wiedzy |
| 5:30–5:45 | Przerwa | — |
| 5:45–6:00 | Q&A + co dalej (linki, materiały, sekcja seniorska jako preview) | Domknięcie |

### 7.5 Mini-projekt na warsztat

Sugestia: **prosty FastAPI / Express endpoint app + frontend HTML** (np. lista TODO z 3 endpoints: GET, POST, DELETE). Proste, każdy zrozumie, da się zrobić w 1.5h z Copilotem, i pozwala pokazać:
- Generowanie boilerplatu (inline completions + Edit mode)
- Plan mode dla "dodaj endpoint X"
- Agent mode dla pełnej implementacji
- Custom agent Reviewer w roli mentora
- Prompt do generowania testów
- Hook do auto-format
- Skill do "jak się testuje tę apkę" (opcjonalnie)

### 7.6 Jak prowadzić dla mieszanej grupy (dev + nie-dev)

- **Otwieraj każdą sekcję analogią** — instructions to "manual zachowania dla agenta", prompts to "skróty na klawiaturze do typowych zadań", agents to "specjalizacje pracowników", skills to "instrukcje obsługi sprzętu", hooks to "automatyczne reakcje na zdarzenia".
- **Pokazuj prawdziwy ekran** — nie tylko slajdy. Nie-dev zrozumie więcej widząc kursor który pisze, niż słuchając o "front matterze YAML".
- **Po każdej koncepcji daj 2 minuty na samodzielną próbę** — nawet jeśli nie-dev nie zrobi tego perfekcyjnie, dotyk klawiatury utrwala.
- **Nie udawaj że nie-dev "też pisze kod"** — niech używa Copilota do generowania, niech klika Accept, niech testuje. To jest właśnie demokratyzacja kodu.

---

## Część 8 — Streszczenie na jedną stronę (dla siebie)

To jest ściąga którą sobie wydrukuj i miej obok ekranu podczas warsztatu.

### 5 mechanizmów Copilota:
| | Co | Plik | Aktywacja |
|---|---|---|---|
| **Instructions** | Tło/reguły | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` | Auto (zawsze lub glob) |
| **Prompts** | Skróty | `.github/prompts/*.prompt.md` | Ręcznie: `/nazwa` |
| **Agents** | Persony | `.github/agents/*.agent.md` | Wybór z dropdown |
| **Skills** | Procedury | `.github/skills/<nazwa>/SKILL.md` | Auto (semantic match) |
| **Hooks** | Reakcje | `.github/hooks/*.json` | Auto (lifecycle event) |

### Slash commands do generowania:
`/init`, `/create-instruction`, `/create-prompt`, `/create-agent`, `/create-skill`, `/create-hook`

### Tryby pracy:
Inline completions (Tab) · Inline Chat (Ctrl+I) · Ask · Edit · Agent · Plan

### Free tier:
2000 completions · 50 chat messages · 50 premium requests · brak Cloud agent · ograniczony model picker

### 5 kroków workflowu (dla początkujących):
1. **Plan** mode → iteruj plan
2. Przełącz na **Agent**, wykonaj plan
3. Zatwierdzaj akcje (nie auto-accept od razu)
4. **Testuj** wynik
5. **Review** własnym custom agentem

### 10 zasad-jednolinijkowców:
1. Plan first, code second
2. Każde zadanie ma "definition of done"
3. Nowa sesja = nowe zadanie
4. Czytaj diff przed akceptacją
5. AI powtarza błąd 3x → dopisz do instructions
6. 50 wiadomości / miesiąc — nie spamuj
7. Nie wiesz dlaczego działa? Zapytaj `explain`
8. Free to demo, Pro to praca
9. Mental engagement — nie wyłączaj mózgu
10. Trust but verify — zawsze review

### Boris workflow w 7 punktach:
1. Plan mode → auto-accept edits
2. CLAUDE.md = living doc (u nas: copilot-instructions.md)
3. Slash commands na codzienne workflowy
4. Sub-agents jak specjalizowane prompty
5. PostToolUse hook do format
6. /permissions zamiast skip-permissions
7. Feedback loop = testy

### Linki dla uczestników:
- code.visualstudio.com/docs/copilot
- github.com/github/awesome-copilot
- awesome-copilot.github.com
- howborisusesclaudecode.com
- simonwillison.net/tags/ai-assisted-programming

---

*Dokument przygotowany na bazie oficjalnej dokumentacji GitHub i VS Code (kwiecień–maj 2026), publicznych wystąpień Borisa Cherny'ego, blogów Simon Willison, Armin Ronacher i Addy Osmani, oraz aktualnych zasobów społeczności (github/awesome-copilot).*
