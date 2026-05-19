# 🤖 GitHub Copilot w VS Code — Kompletny Przewodnik: Instrukcje, Prompty, Agenci, Umiejętności, Sub-agenci

Zacznijmy od najważniejszego: w ekosystemie GitHub Copilot mamy **6 różnych mechanizmów** dostosowywania i automatyzacji. Każdy robi coś innego i każdy ma swój konkretny przypadek użycia. Poniżej wyjaśniam je wszystkie od zera.

---

## 🗺️ Mapa całego ekosystemu — szybki przegląd

|Mechanizm|Lokalizacja|Kiedy się aktywuje|Do czego służy|
|---|---|---|---|
|**Custom Instructions**|`.github/copilot-instructions.md`|Zawsze (automatycznie)|Standardy zespołu, domyślne zachowanie|
|**Prompt Files**|`.github/prompts/*.prompt.md`|Na żądanie (slash komenda)|Jednorazowe, powtarzalne zadania|
|**Custom Agents**|`.github/agents/*.agent.md`|Gdy wybierzesz agenta|Wyspecjalizowana rola + kontrola narzędzi|
|**Skills**|`.github/skills/<nazwa>/SKILL.md`|Auto-wykrycie lub slash komenda|Reużywalne wieloetapowe przepływy pracy|
|**MCP Servers**|`.vscode/mcp.json`|Stałe połączenie z zewnętrznymi API|Żywy dostęp do zewnętrznych systemów|
|**Hooks**|`.github/hooks/*.json`|Eventy w cyklu życia agenta|Twarde blokady i bramki bezpieczeństwa|

Zapamiętaj tę zasadę:

- **Instructions** → zawsze aktywne wytyczne
- **Prompts** → nazwane jednorazowe zadania
- **Skills** → reużywalne przepływy pracy z zasobami
- **Custom Agents** → rola + granice narzędzi
- **MCP** → żywy zewnętrzny kontekst
- **Hooks** → twarde egzekwowanie polityki

---

## 1️⃣ Custom Instructions — „Zawsze stosuj te zasady"

### Czym są

To instrukcje w Markdown, które Copilot **automatycznie dołącza do każdego zapytania** — bez żadnego działania z Twojej strony.

Masz trzy warianty:

- **Globalne**: `.github/copilot-instructions.md` — stosuje się do każdego czatu w workspace
- **Celowane na plik/zadanie**: pliki `*.instructions.md` z wzorcem `applyTo` — przechowywane w `.github/instructions/`
- **Multi-agent**: `AGENTS.md` w katalogu głównym — rozpoznawane przez wiele agentów AI, nie tylko Copilota

### Przykład pliku

```markdown
<!-- .github/copilot-instructions.md -->
- Zawsze używaj TypeScript, nigdy czystego JS
- Testy pisz w Vitest, nie w Jest
- Komentarze w kodzie po polsku
- Każda funkcja musi mieć JSDoc
```

### Kiedy używać

✅ Standardy kodowania całego zespołu ✅ Domyślny język, framework, konwencje nazewnictwa ✅ Zasady bezpieczeństwa, które muszą być zawsze aktywne

❌ Nie używaj do jednorazowych zadań — marnujesz kontekst

---

## 2️⃣ Prompt Files — „Wykonaj to zadanie na zawołanie"

### Czym są

Pliki `.prompt.md` to gotowe przepisy na konkretne zadania. Wywołujesz je wpisując `/` w chacie.

```markdown
<!-- .github/prompts/code-review.prompt.md -->
---
description: "Przejrzyj kod pod kątem bezpieczeństwa i wydajności"
---
Przejrzyj wskazany plik. Sprawdź:
1. Potencjalne luki bezpieczeństwa (SQL injection, XSS)
2. Wycieki pamięci
3. Niepotrzebne re-rendery (jeśli React)
Odpowiedz w formie listy z priorytetami: KRYTYCZNE / WAŻNE / SUGESTIA
```

### Jak wywołać

W chacie wpisujesz `/code-review` i Copilot uruchamia ten prompt.

### Kiedy używać

✅ Powtarzalne, jednoetapowe zadania (review, generowanie testów, dokumentacja) ✅ Gdy nie potrzebujesz kontroli nad narzędziami ✅ Szybkie one-shoty bez złożonej logiki

❌ Nie używaj do wieloetapowych przepływów z zasobami (do tego są Skills) ❌ Nie używaj gdy potrzebujesz izolowanej roli z ograniczonymi narzędziami (do tego Custom Agents)

---

## 3️⃣ Custom Agents — „Bądź tym konkretnym specjalistą"

### Czym są

Custom Agents to zestaw instrukcji i narzędzi, które są stosowane gdy przełączysz się na danego agenta. Na przykład agent „Plan" może zawierać instrukcje generowania planu implementacji i używać tylko narzędzi read-only.

Agent ma zdefiniowane: jakich narzędzi może używać, jak wykonuje zadania, oraz punkty przekazania do innych agentów (handoffs).

### Przykład pliku agenta

```yaml
<!-- .github/agents/security-scout.agent.md -->
---
name: Security Scout
description: "Specjalista od znajdowania luk SQLi i XSS"
tools: [read, search]
model: claude-sonnet-4-5
---
# Instrukcje
Jesteś Senior Security Engineerem.
1. Zawsze zaczynaj od `/src/auth`
2. Skup się na niesanityzowanych inputach
3. Do każdego błędu dołącz plan naprawy
```

### Handoffs — przekazywanie między agentami

Handoffs umożliwiają tworzenie sekwencyjnych przepływów pracy. Po zakończeniu odpowiedzi przez agenta pojawiają się przyciski handoff, które pozwalają przejść do następnego agenta z odpowiednim kontekstem i wstępnie wypełnionym promptem. Na przykład:

- **Planowanie → Implementacja**: wygeneruj plan w agencie planowania, przekaż do agenta implementacji
- **Implementacja → Review**: zakończ implementację, przejdź do agenta code review
- **Pisanie testów → Implementacja**: najpierw napisz nieudane testy, potem implementuj kod który je przejdzie

### Przykład agenta z handoff

```yaml
---
name: Planner
description: "Generuje plan implementacji, nie pisze kodu"
tools: ['web/fetch', 'search/codebase']
model: Claude Opus 4.5
handoffs:
  - label: Implement Plan
    agent: implementer
    prompt: Zaimplementuj plan opisany powyżej.
    send: false
---
# Tryb planowania
Nie edytuj kodu. Tylko generuj szczegółowy plan implementacji.
```

### Poziomy dostępności agentów

- **Osobiste**: `~/.copilot/agents/` — tylko dla Ciebie, we wszystkich workspace'ach
- **Workspace**: `.github/agents/` — dla całego zespołu w tym projekcie
- **Organizacja**: poziom GitHub org — dla wszystkich repozytoriów w organizacji (wymaga planu Business/Enterprise)

### Kiedy używać Custom Agents

✅ Potrzebujesz trwałej persony z ograniczonym zestawem narzędzi ✅ Wieloetapowy przepływ z punktami kontrolnymi (plan → review → implementacja) ✅ Chcesz agenta który **nie może** edytować plików (np. audytor read-only) ✅ Gdy budujesz workflow z handoffami między rolami

❌ Nie używaj do prostych jednorazowych zadań (użyj Prompt File)

---

## 4️⃣ Agent Skills — „Naucz Copilota specjalnych umiejętności"

### Czym są

Skills to foldery z instrukcjami, skryptami i zasobami, które GitHub Copilot może załadować gdy są potrzebne do wykonania wyspecjalizowanych zadań. Agent Skills to otwarty standard działający w wielu agentach — VS Code, GitHub Copilot CLI i GitHub Copilot cloud agent.

Gdy Copilot ustali, że skill jest istotny dla Twojego zadania, ładuje instrukcje i je wykonuje — łącznie z zasobami zawartymi w folderze skill.

### Struktura folderu skill

```
.github/skills/webapp-testing/
├── SKILL.md          # Główna definicja z frontmatter YAML
├── scripts/
│   └── run-tests.sh  # Skrypty które skill może uruchomić
└── references/
    └── test-patterns.md  # Dokumentacja ładowana na żądanie
```

```yaml
<!-- SKILL.md -->
---
name: webapp-testing
description: "Uruchamia testy dla aplikacji webowych z raportowaniem"
user-invocable: true
---
# Webapp Testing Skill
Procedura testowania:
1. Uruchom `scripts/run-tests.sh`
2. Przeanalizuj wyniki z references/test-patterns.md
3. Zwróć raport z podsumowaniem
```

### Progressive loading — jak skill ładuje zasoby

Skille ładują zawartość progresywnie, by efektywnie zarządzać kontekstem:

1. **Discovery**: Copilot czyta nazwę i opis z frontmatter YAML
2. **Instrukcje**: gdy skill pasuje do zadania, Copilot ładuje ciało SKILL.md
3. **Zasoby**: pliki referencyjne i skrypty ładowane są dopiero gdy skill ich potrzebuje

### Sub-agenci w Skills

Skille z opcją `forked context` wykonują swoje instrukcje w osobnym sub-agencie. Tylko finalny wynik jest zwracany do agenta nadrzędnego.

### Lokalizacja Skills

- **Workspace**: `.github/skills/<nazwa>/` — dla projektu
- **Osobiste**: `~/.copilot/skills/` — dostępne we wszystkich workspace'ach

### Kiedy używać Skills

✅ Reużywalne przepływy z towarzyszącymi skryptami i zasobami ✅ Gdy ta sama „umiejętność" ma działać w VS Code, CLI i cloud agencie ✅ Całe playbooki (np. triaging incydentów, postmortem, troubleshooting CI/CD) ✅ Gdy chcesz udostępnić workflow całemu zespołowi lub community

❌ Nie używaj do prostych standardów bez zasobów (użyj Instructions) ❌ Nie używaj gdy potrzebujesz twardej blokady (użyj Hooks)

---

## 5️⃣ Typy Agentów (gdzie działają)

VS Code oferuje trzy typy agentów zależnie od tego gdzie działają:

- **Copilot CLI (lokalny)**: działa na Twoim komputerze, może używać Git worktrees do izolacji zmian
- **Cloud agent**: działa zdalnie i integruje się z pull requestami GitHub — idealny do zadań bez potrzeby natychmiastowej interakcji
- **Third-party**: agenci od Anthropic i OpenAI, działają lokalnie lub w chmurze

### Copilot CLI — w tle, bez Twojej interakcji

Copilot CLI idealnie nadaje się do delegowania zadań, które nie wymagają natychmiastowej interakcji. Może używać Git worktrees do izolowania zmian od Twojego głównego workspace'u, by uniknąć konfliktów. Możesz uruchomić wiele sesji CLI dla różnych zadań jednocześnie, nie przerywając głównego workflow.

### Cloud Agent — PR i współpraca zespołowa

Cloud agent działa na zdalnej infrastrukturze i jest idealny dla zadań które nie wymagają natychmiastowego feedbacku, nie muszą działać lokalnie, lub wymagają współpracy przez GitHub. Tworzy branch i pull request w Twoim repozytorium — możesz śledzić postęp w widoku Sessions.

---

## 6️⃣ Hooks — „Twarde egzekwowanie polityki"

Hooks to deterministyczne komendy shell uruchamiane w kluczowych momentach workflow agenta. Konfigurowane jako pliki JSON w `.github/hooks/*.json`.

Dostępne typy hooków: `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, `agentStop`, `subagentStop`, `errorOccurred`.

Hook `preToolUse` jest najpotężniejszy — może zatwierdzić lub odrzucić wykonanie narzędzia zanim do niego dojdzie.

```json
// .github/hooks/no-delete.json
{
  "event": "preToolUse",
  "tool": "terminal",
  "condition": "input.command.includes('rm -rf')",
  "action": "deny",
  "message": "Usuwanie plików jest zablokowane przez politykę projektu"
}
```

---

## 🔗 Jak łączyć wszystko razem — praktyczne wzorce

### Wzorzec 1: Plan → Implementacja → Review

```
[Plan Agent] -- handoff --> [Implementer Agent] -- handoff --> [Security Scout Agent]
     ↓                              ↓                                    ↓
  Tylko read          CLI w tle (worktree)               Tylko read, raport
```

1. Uruchamiasz **Plan Agent** — dostaje plan bez pisania kodu
2. Handoff do **Copilot CLI** w tle — implementuje w izolowanym worktree
3. Po skończeniu handoff do **Security Scout** — przegląda bez możliwości edycji

### Wzorzec 2: Skill z sub-agentem dla ciężkich zadań

```
Główny agent
    └── [/research skill] → spawns sub-agenci równolegle
            ├── Sub-agent 1: przeszukuje docs
            ├── Sub-agent 2: przeszukuje codebase
            └── Sub-agent 3: przeszukuje testy
                        ↓
              Wyniki scalone i zwrócone do głównego agenta
```

### Wzorzec 3: Pełna ochrona z Hooks

```
Użytkownik wpisuje prompt
    → Hook: userPromptSubmitted (logowanie)
    → Agent wykonuje działania
    → Hook: preToolUse (blokada rm -rf, blokada prod deploymentów)
    → Hook: postToolUse (audyt tego co zostało zrobione)
    → Hook: sessionEnd (raport bezpieczeństwa)
```

---

## 📋 Kiedy użyć czego — decyzyjna ściągawka

|Pytanie|Odpowiedź|
|---|---|
|„Chcę by Copilot zawsze pisał TypeScript"|**Instructions**|
|„Chcę komendę `/review` do code review"|**Prompt File**|
|„Chcę agenta który TYLKO planuje i nigdy nie edytuje"|**Custom Agent**|
|„Chcę playbook dla incydentów ze skryptami"|**Skill**|
|„Chcę zablokować `rm -rf` w terminalu"|**Hook**|
|„Chcę połączyć się z Jira / Slack / zewnętrznym API"|**MCP Server**|
|„Chcę zadanie wykonane w tle bez przerywania pracy"|**Copilot CLI**|
|„Chcę PR na GitHubie bez mojej ingerencji"|**Cloud Agent**|

---

## 🚀 Jak zacząć — kolejność nauki

1. **Zacznij od Instructions** — wejdź w `.github/copilot-instructions.md`, napisz swoje standardy
2. **Dodaj kilka Prompt Files** dla najczęstszych zadań (review, generowanie testów)
3. **Stwórz pierwszy Custom Agent** — np. read-only Security Reviewer
4. **Dodaj Skill** gdy masz powtarzalny workflow ze skryptami
5. **Połącz je handoffami** między agentami
6. **Dodaj Hooks** gdy potrzebujesz twardych reguł bezpieczeństwa
