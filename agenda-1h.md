# Warsztat GitHub Copilot — wersja 60 minut (run-of-show)

> Cel: w godzinę pokazać **pełną pętlę zespołu agentów** (Spec → Planner → Implementer), a potem dać każdemu zbudować **WŁASNĄ apkę** i **WŁASNEGO agenta**. Pełne ćwiczenia → menu na dole pliku (take-home).
>
> **Audytorium:** mix dev / non-dev. **Format:** demo prowadzącego + „spróbuj sam" równolegle. Zakładamy, że min. 1 osoba ma VS Code + Copilot.

## Przed startem (poproś z wyprzedzeniem)
- VS Code + rozszerzenie GitHub Copilot (zalogowane).
- Sklonowane repo. **Bez Node/npm** — apki to czysty HTML/CSS/JS, odpalają się dwuklikiem na `index.html`.
- Apki w `aplikacje/` mają **tylko `SPEC.md`** — kod budujemy na żywo.
- Link do repo w czacie spotkania.

---

## 0–5 min — Po co tu jesteśmy + 4 powierzchnie
Jednym slajdem/zdaniem każda:
- **Ask** — pytasz, zero akcji. **Agent** — działa narzędziami. **Inline** (`Ctrl/Cmd+I`) — edycja w kontekście. **Smart Actions** — gotowce z menu.
- Zapowiedź łuku: *„Zobaczycie zespół agentów, który planuje i pisze kod sam — z człowiekiem w pętli. Potem każdy zbuduje SWOJĄ apkę i SWOJEGO agenta."*

## 5–20 min — DEMO: Planner → Implementer buduje task-managera od zera
Ty na ekranie, chętni klikają równolegle.
1. Czat → tryb **Agent** → agent **Planner**.
2. *„Zbuduj aplikację zgodnie ze specyfikacją w `aplikacje/task-manager/SPEC.md`."*
3. Pokaż plan, zatwierdź → **handoff do Implementera**.
4. Implementer pisze pliki — komentuj na żywo: edycja plików, „człowiek w pętli", trzymanie się planu.
5. Otwórz `aplikacje/task-manager/index.html` w przeglądarce — działa.

**Punkty do podkreślenia:** agent = persona + zestaw narzędzi; handoff = przekazanie kontroli; zatwierdzanie planu = kontrola człowieka.
**Plan B (gdy model wolny):** miej gotowy wynik w drugiej gałęzi/screenshot, opowiadaj na nim.

## 20–28 min — prompt vs skill vs agent vs instrukcja
Tabelka „co kiedy ładowane" (kto wywołuje: Ty / automat / model):

| | Kiedy | Kto wywołuje |
|---|---|---|
| `copilot-instructions.md` | zawsze | automat |
| `instructions/*` z `applyTo:` | gdy edytujesz pasujący plik | automat |
| `prompts/*.prompt.md` | wpiszesz `/nazwa` | **Ty** |
| `agents/*.agent.md` | wybierzesz w dropdownie | **Ty** |
| `skills/*/SKILL.md` | model uzna, że pasuje | **model** |

Mostek do dalszej części: *„Za chwilę użyjecie nowego agenta — `Spec` — który z dwóch zdań zrobi specyfikację. A na koniec każdy napisze własnego agenta."*

## 28–46 min — HANDS-ON 1: każdy buduje WŁASNĄ apkę
To uczestnicy robią **sami**; Ty krążysz i tłumaczysz różnice.
1. W 2–3 zdaniach mówią, co chcą (np. „lista zakupów z odhaczaniem", „licznik kalorii", „pomodoro").
2. Agent **Spec** → tworzy `aplikacje/<nazwa>/SPEC.md` w nowym folderze.
3. **Handoff do Plannera** → plan → zatwierdzenie → **handoff do Implementera** → kod.
4. Otwierają swój `index.html` — mają własną, działającą apkę.

**Punkt do podkreślenia:** ten sam łańcuch co w demo, ale teraz na ICH pomyśle. Spec → Planner → Implementer = zespół, każdy z inną rolą.
**Plan B (non-dev / wolni / brak pomysłu):** weź gotowy `aplikacje/notatnik/SPEC.md` i puść od Plannera.

## 46–58 min — HANDS-ON 2: każdy dodaje WŁASNEGO agenta
Każdy pisze **swojego** agenta — pomysł zależny od profilu. Ściągawka prowadzącego z gotowym frontmatterem: `resources/pomysly-na-agentow-i-skille.md`.
- **Techniczni** → **Tester** (pisze testy, wariant: najpierw failing test + handoff do Implementera) albo **Reviewer** read-only.
- **Nietechniczni** → **Tłumacz kodu** (read-only, tłumaczy `js/app.js` na polski) albo **Dokumentalista** (pisze README/instrukcję użytkownika).

Kroki:
1. Nowy plik `.github/agents/<nazwa>.agent.md` — wkleić frontmatter ze ściągawki, dopisać krótki system prompt.
2. **Kluczowy moment:** w `tools:` decydujesz, co agent może. read-only (`read`/`search`) = patrzy i mówi; `+edit` = zmienia pliki. *To* definiuje rolę.
3. Wybrać agenta w dropdownie, odpalić na swojej apce.

**Punkt do podkreślenia:** ten sam mechanizm „custom agent" — wystarczy zmienić `tools` i prompt, żeby dostać inną rolę w zespole. Pokazuje to lepiej niż jakikolwiek slajd.

## 58–60 min — Zamknięcie
- **Diagram zespołu** (Twój, przygotowany wcześniej): Spec → Planner → Implementer → [Reviewer/Tester] — jak grają razem.
- **1 frustracja → 1 mechanizm:** „powtarza się, różne dane" → prompt · „procedura A→B→C" → skill · „rola z dostępem" → agent · „ma być zawsze" → instrukcja.
- Zachęta: **commitujcie `.github/` do firmowego repo** — cały zespół korzysta. Menu poniżej jako praca domowa.

---

## Menu ćwiczeń (take-home) — od łatwych do zaawansowanych

> Wszystko osadzone w apkach z `aplikacje/` (vanilla HTML/CSS/JS, `localStorage`). Każde to rzecz, którą **piszesz sam** — gotowców nie ma w repo. Kolumna „Przewodnik" wskazuje sekcję w `resources/VS Code Copilot Przewodnik…md`.

### Poziom 1 — łatwe (2–5 min, robi każdy, też non-dev)
Pokazują **Instructions** i **Prompty** — mechanizmy bez narzędzi i bez ról.

| Ćwiczenie | Mechanizm | Przewodnik | Pointa |
|---|---|---|---|
| Dopisz do `copilot-instructions.md` regułę „komentarze po polsku, używaj `const`" → każ Implementerowi coś dodać, patrz jak słucha | Custom Instructions | §1 | „zawsze aktywne, bez wywoływania" |
| Stwórz `tests.instructions.md` z `applyTo: "**/*.test.js"` wymuszający strukturę AAA | Instrukcja warunkowa | §1 | ładowane **tylko** przy pasującym pliku |
| Prompt `/wytlumacz-plik` z `${file}` — tłumaczy otwarty plik | Prompt File | §2 | jednorazowe, wołasz `/` |
| Prompt `/napisz-testy` na otwartym `js/app.js` (generuje, nie odpala) | Prompt File | §2 | one-shot bez kontroli narzędzi |

### Poziom 2 — średnie (10–15 min, dla devów)
Pokazują **Custom Agents** i **handoffs** — rola + granice narzędzi + łańcuch.

| Ćwiczenie | Mechanizm | Przewodnik | Pointa |
|---|---|---|---|
| **Reviewer** read-only (`tools: read/search`, BEZ `edit`/`execute`) + handoff od/do Implementera | Custom Agent + handoff | §3 | odbierasz narzędzia → zmieniasz rolę |
| **Tester** piszący najpierw *failing* test, potem handoff do Implementera „zrób, żeby przeszedł" | Agent + handoff (TDD) | §3 (wzorzec „testy→implementacja") | kolejność w łańcuchu ma znaczenie |
| Zmiana modelu w handoffie: Haiku do drobnych poprawek, Opus do rewizji | `model:` w agencie | §3 | dobór modelu = koszt vs moc |

### Poziom 3 — zaawansowane (demo prowadzącego lub praca domowa)
Pokazują **Skills**, **Hooks**, **MCP**, sub-agentów — mechanizmy, których nie ma w gotowym repo, więc tu najmocniej widać różnicę.

| Ćwiczenie | Mechanizm | Przewodnik | Pointa |
|---|---|---|---|
| Skill `changelog` z prawdziwym skryptem w `scripts/` (czyta `git log`) | Skill + zasoby | §4 | model **sam** dobiera + progressive loading |
| **Hook `preToolUse`** blokujący edycję `SPEC.md` (albo `rm -rf`) | Hook | §6 | ⭐ instrukcja = miękka prośba, hook = twarda blokada |
| GitHub MCP: „wylistuj issues", „stwórz issue: dark mode" | MCP Server | §0 mapa + ściągawka | żywy dostęp do zewnętrznego systemu |
| Skill z `forked context` — sub-agent robi research, zwraca tylko wynik | Sub-agent w skillu | §4 + wzorzec 2 | izolacja kontekstu |

### Najmocniejszy kontrast do pokazania na żywo
Zrób **to samo** dwoma mechanizmami:
1. Dopisz do instrukcji „**nie edytuj `SPEC.md`**" → poproś agenta o edycję `SPEC.md` → czasem i tak to zrobi (miękka wytyczna).
2. Dodaj **hook `preToolUse`**, który twardo odrzuca edycję `SPEC.md` → ta sama prośba → zablokowane deterministycznie.

To w 2 minuty tłumaczy całą oś „wytyczna vs egzekwowanie" z przewodnika (§1 vs §6) lepiej niż jakikolwiek slajd.
