# Warsztat: GitHub Copilot dla zaawansowanych — Materiały uczestnika

> Witaj! Ten dokument to Twoja mapa drogowa na cały warsztat. Wracaj do niego między blokami, używaj jako ściągi i jako inspiracji do tego, co możesz zbudować *po* warsztacie.

## Cel warsztatu

Po dzisiejszym dniu będziesz umiał:
- **Używać czterech powierzchni Copilota** (Ask, Agent, Inline, Smart Actions) świadomie — wiedzieć, kiedy której użyć.
- **Czytać i rozumieć** strukturę projektu z `.github/` (instructions, prompts, agents, skills).
- **Tworzyć własne** prompty, agentów i skille dopasowane do Twojej pracy.
- **Orkiestrować** wielu agentów w łańcuch (handoffs).
- **Dobierać model i narzędzia** (w tym MCP) pod konkretne zadanie.

## Wymagania techniczne

- VS Code (najnowsza wersja)
- Rozszerzenie GitHub Copilot (zalogowane)
- Node.js 18+ i npm
- Git
- Sklonowane repo warsztatowe

> **Nie jesteś deweloperem?** Większość ćwiczeń możesz wykonać i tak. Tam gdzie wymagana jest znajomość kodu — sparuj się z osobą bardziej techniczną lub obserwuj demo. W Bloku 7 (własne projekty) znajdziesz pomysły dopasowane do Twojej pracy.

---

# Część I — Co potrafi Copilot

## Blok 0 — Setup i orientacja (15 min)

### Umiejętność
Mieć działające środowisko i wiedzieć, co dostałeś w repozytorium.

### Ćwiczenie
1. Sklonuj repo (link w czacie spotkania).
2. Otwórz folder w VS Code.
3. Otwórz wbudowany terminal: `npm install`.
4. Otwórz panel czatu Copilota — sprawdź, że jesteś zalogowany.
5. Rzuć okiem na strukturę `.github/` w eksploratorze plików.

### Co sprawdzić
- Czy widzisz `.github/agents/`, `.github/prompts/`, `.github/instructions/`, `.github/skills/`?
- Czy `npm install` zakończyło się sukcesem?
- Czy w czacie widzisz dropdown wyboru agenta?

---

## Blok 1 — Pierwsza aplikacja (30 min)

### Umiejętność
Zobaczyć orkiestrację agentów w praktyce — jak Planner planuje, oddaje pracę Implementerowi, jak agenci używają narzędzi (edycja plików, terminal), gdzie wchodzi "człowiek w pętli".

### Ćwiczenie
1. Otwórz czat Copilota, wybierz tryb **Agent** i agenta **Planner**.
2. Wpisz: *"Zbuduj aplikację zgodnie ze specyfikacją w pliku SPEC.md"*.
3. Przeczytaj plan, zatwierdź (lub zmodyfikuj).
4. Planner wykona **handoff** do agenta **Implementer**.
5. Implementer pisze kod, instaluje paczki, uruchamia. Obserwuj.
6. Po zakończeniu — otwórz aplikację w przeglądarce.

### Dalsze pomysły (rozbudowa)
- **Zmień SPEC.md** i uruchom ponownie — zobacz, że dostajesz inną aplikację.
- **Przerwij Implementera** w połowie pracy ("Stop") i poproś o zmianę kierunku.
- **Dodaj trzeciego agenta** do łańcucha (np. Reviewer, którego dotworzysz w Bloku 5).
- **Wymuś użycie konkretnej biblioteki** ("…ale użyj Fastify zamiast Express").

---

## Blok 2 — Cztery powierzchnie Copilota (35 min)

### Umiejętność
Wiedzieć, kiedy użyć której powierzchni: **Ask** (eksploracja, bez akcji), **Agent** (akcja z narzędziami), **Inline** (edycja w kontekście), **Smart Actions** (gotowe akcje z menu kontekstowego).

### Ćwiczenia — 5 mikro-zadań (15 min)

#### Dla wszystkich (dev i non-dev)
1. **Ask**: Otwórz `SPEC.md` lub `package.json`. W czacie (tryb Ask) zapytaj: *"Wytłumacz mi ten plik linijka po linijce"*. Potem dopytaj o jeden szczegół.
2. **Inline na markdownie**: Zaznacz akapit w `README.md` lub `SPEC.md`, wciśnij `Ctrl+I` (`Cmd+I`), wpisz: *"przeformułuj to prościej"*.
3. **Smart Action "Explain"**: Zaznacz dowolny fragment kodu, prawym przyciskiem → Copilot → Explain.

#### Dodatkowo dla dev-ów
4. **Agent — dodaj endpoint**: *"Dodaj endpoint `GET /api/version` zwracający wersję z `package.json`"*.
5. **Inline w terminalu**: W terminalu wciśnij `Ctrl+I` i wpisz: *"pokaż mi pliki .json większe niż 1KB"*.

#### Dodatkowo dla non-dev-ów
4. **Ask — analiza konfiguracji**: *"Co w tym pliku konfiguracyjnym jest ważne, a co mogę zignorować jako nie-programista?"*.
5. **Agent — wygeneruj treść**: *"Stwórz plik `WELCOME.md` z krótkim wprowadzeniem do projektu dla nowej osoby"*.

### Dalsze pomysły
- **Ghost text**: napisz komentarz `// funkcja zwracająca dzisiejszą datę po polsku` i naciśnij Tab.
- **Cycle suggestions**: `Alt+]` / `Alt+[` — przeglądaj alternatywne sugestie autouzupełnienia.
- **Smart Action "Fix"**: celowo zepsuj składnię JSON, wywołaj Fix z menu kontekstowego.
- **Commit message**: w panelu Source Control kliknij ikonę iskierki — wygeneruj wiadomość commita.
- **Inline w pliku markdown**: popraw nagłówek, dodaj spis treści, popraw stylistykę.

---

## Blok 3 — Anatomia projektu (35 min)

### Umiejętność
Zrozumieć cztery typy plików w `.github/` — kiedy każdy z nich ląduje w kontekście modelu i kto je wywołuje.

### Co kiedy jest ładowane

| Plik | Kiedy ładowane | Kto wywołuje |
|---|---|---|
| `.github/copilot-instructions.md` | **Zawsze** w każdej rozmowie | Automatycznie |
| `.github/instructions/*.instructions.md` z polem `applyTo:` | **Warunkowo** — gdy edytujesz pasujący plik | Automatycznie |
| `.github/prompts/*.prompt.md` | Gdy wpiszesz `/nazwa` w czacie | **Ty** |
| `.github/agents/*.agent.md` | Gdy wybierzesz agenta w dropdownie | **Ty** |
| `.github/skills/*/SKILL.md` | Gdy model uzna, że pasuje do prośby | **Model** |

### Decyzja: prompt, skill, agent czy instrukcja?

- **Instrukcja** → trwała zasada zawsze obowiązująca (*"komentarze po polsku"*, *"używaj const, nie var"*)
- **Prompt** → jednorazowa akcja, którą wywołujesz świadomie (*/refaktoryzuj-funkcje*)
- **Skill** → procedura krok-po-kroku, którą model dobiera sam (np. *"jak stworzyć komponent React"*)
- **Agent** → osobna persona z własnym zestawem narzędzi (np. Reviewer, który nie może edytować plików)

### Ćwiczenie (10 min)
1. Otwórz każdy z czterech typów plików w repo.
2. W parach lub indywidualnie: zdecyduj, **co byś użył** dla tych scenariuszy:
   - "Każdy nowy endpoint musi zwracać obiekt JSON, nie tablicę"
   - "Chcę szybko wygenerować JSDoc dla zaznaczonej funkcji"
   - "Chcę, żeby ktoś sprawdził mi PR i nic nie psuł"
   - "Tworzę nowy komponent React — chcę procedurę"

### Dalsze pomysły
- **Eksperyment ze sprzecznością**: dodaj do `copilot-instructions.md` regułę sprzeczną z `instructions/backend.instructions.md`. Zobacz, co wybierze model.
- **Słowniczek projektu**: dodaj do głównych instrukcji sekcję wyjaśniającą, co w Twoim domenie oznacza "klient", "zadanie", "status".
- **Reguła dla testów**: stwórz `tests.instructions.md` z `applyTo: "**/*.test.js"` wymuszającą strukturę AAA (Arrange, Act, Assert).
- **Sekcja "Zabronione"**: zablokuj `==` i wymuś `===`; zablokuj `var`.

---

## Blok 4 — Demo tworzenia (25 min, obserwacja)

### Co zobaczysz
Prowadzący na żywo stworzy z poziomu UI VS Code:
1. **Prompt** — np. `/przetlumacz-na-5-latka` używający `${selection}`
2. **Agent** — np. *Reviewer* z ograniczonymi narzędziami (read-only)
3. **Skill** — np. `dokumentuj-endpoint` z własnym szablonem

### O co warto zapytać
- *"Skąd wiesz, jakie narzędzia (tools) wpisać?"*
- *"Co się stanie, jeśli zostawię puste `description:`?"*
- *"Jak debugować, kiedy mój prompt/agent nie działa?"*
- *"Czy mogę commitować `.github/` do repo, żeby cały team korzystał?"*

### Notatki
Zapisuj pytania na bieżąco — w Bloku 7 będziesz to robił sam.

---

## Blok 5 — Subagenci i handoffs (20 min)

### Umiejętność
Rozumieć, jak orkiestrować wielu agentów, kiedy łańcuch ma sens, a kiedy wystarczy jeden duży agent.

### Ćwiczenie (10 min)
Otwórz plik agenta `Planner` (lub `Full Stack Builder`, jeśli jest). Znajdź pola:
- `agents:` — lista agentów, których może wywołać
- `handoffs:` — propozycje przekazań kontroli

Mini-zadanie: **dodaj trzeciego agenta** `Reviewer` do istniejącego łańcucha. Zdefiniuj handoff: po Implementerze → Reviewer.

### Dalsze pomysły
- **Cykl Reviewer → Implementer**: niech Reviewer zwraca pracę do Implementera, jeśli znajdzie problem.
- **Zmiana modelu w handoffie**: użyj Haiku dla drobnych poprawek, Opus dla rewizji architektonicznych.
- **Równoległe agenty**: Audyt = Bezpiecznik + Tester wywoływani naraz.
- **Onboarding bot**: agent wołający Wyjaśniacza plik po pliku dla nowych członków zespołu.

---

## Blok 6 — MCP i modele (20 min)

### Umiejętność
Wiedzieć, co to MCP i kiedy ma sens, oraz jak dobierać model do zadania.

### MCP — Model Context Protocol
Otwarte rozszerzenie pozwalające Copilotowi rozmawiać z **zewnętrznymi systemami**: GitHubem, Notion, Slackiem, bazą danych, własną pamięcią, itp.

### Ćwiczenie (jeśli czas pozwoli)
1. Zainstaluj **GitHub MCP**.
2. W czacie wpisz: *"Wylistuj otwarte issues w tym repo"*.
3. Następnie: *"Stwórz nowy issue: Dodaj dark mode"*.
4. Otwórz plik `.vscode/mcp.json` i zobacz, jak jest skonfigurowany.

### Modele
- **Haiku / GPT-4o-mini** — szybkie, tanie. Idealne do inline chat, drobnych poprawek.
- **Sonnet / GPT-4o** — balans. Dobre do większości zadań deweloperskich.
- **Opus / GPT-5 thinking** — drogie, ale potrafi rozwiązywać skomplikowane problemy architektoniczne.

### Dalsze pomysły
- **Memory MCP** — pamięć między rozmowami.
- **Filesystem MCP** — dostęp do plików poza repo.
- **Notion / Linear MCP** — synchronizacja z systemem zarządzania pracą.
- **Własny MCP** — można napisać własny serwer w Pythonie / TypeScripcie.

---

# Część II — Twój własny warsztat (2h)

Czas zbudować coś **dla siebie**. Możesz pracować solo lub w małej grupie (3–4 osoby).

## Blok 7a — Discovery (20 min)

### Krok 1: Lista frustracji (5 min, indywidualnie)
Odpowiedz krótkimi hasłami na 4 pytania:

1. **Co w pracy robię więcej niż 3 razy w tygodniu i zajmuje mi to więcej niż 5 minut?**
2. **Jaki dokument / odpowiedź / kod piszę po raz n-ty, bo zawsze ma podobną strukturę?**
3. **Co tłumaczę nowym osobom w pracy w kółko?**
4. **Czego boję się zapomnieć w jakimś procesie?**

### Krok 2: Mapowanie na narzędzie (7 min, w parach)
Opowiedz partnerowi swoją listę. Razem przypiszcie każdy element do typu:

| Brzmi jak… | Użyj… |
|---|---|
| "to się powtarza, ale różne dane" | **Prompt** |
| "to procedura: zrób A, potem B, potem C" | **Skill** |
| "to rola z określonym dostępem" | **Agent** |
| "to ma być zawsze" | **Instrukcja** |
| "to ma być łańcuchem akcji" | **Subagenci** |

### Krok 3: Wybór 1 rzeczy (3 min)
Wypełnij szablon:

```
Co automatyzuję: _______________________________________
Typ: [prompt / skill / agent / instrukcja / łańcuch]
Jak wywołuję: __________________________________________
Co dostaję na wyjściu: _________________________________
Dla kogo to jest: ______________________________________
```

### Krok 4: Decyzja solo / grupa (5 min)
- **Solo** — mam konkretny personalny use case, chcę go zrobić od początku do końca.
- **Grupa** — wolę zbudować coś większego (np. zespół agentów) razem z innymi.

Prowadzący rozdzieli do breakout roomów.

## Blok 7b — Budowanie (70 min)

### Pomysły indywidualne — DLA DEWELOPERÓW

**Prompty (`/komenda`)**
- `/refaktoryzuj` — bierze zaznaczenie i przepisuje na czytelniejszą wersję
- `/conventional-commit` — generuje sformalizowaną wiadomość commita z `git diff`
- `/przetlumacz-komentarze` — z angielskich na polskie (lub odwrotnie)
- `/jsdoc-dla-funkcji` — dodaje dokumentację JSDoc/TSDoc
- `/test-dla-endpointa` — generuje test Jest+Supertest dla otwartego kontrolera
- `/podsumuj-diff` — opisuje, co zmieniło się w bieżącym diffie
- `/README-dla-folderu` — pisze README na podstawie zawartości katalogu
- `/dokumentacja-endpointa` — sekcja Markdown z otwartego kontrolera
- `/git-status-podsumowanie` — przyjazne podsumowanie stanu repo
- `/wytlumacz-jak-5-latkowi` — proste tłumaczenie zaznaczenia
- `/sprawdz-bezpieczenstwo` — szybki audyt security otwartego pliku
- `/code-review` — krótki przegląd kodu w roli seniora
- `/wytlumacz-blad` — bierze ostatni błąd z terminala i tłumaczy
- `/mock-data` — generator danych testowych z opisu modelu
- `/release-notes` — z `git log` ostatnich N commitów
- `/migracja-na-typescript` — konwersja pliku JS → TS
- `/openapi-z-routerow` — generuje schemat OpenAPI z kodu
- `/podpowiedz-nazwe-zmiennej` — alternatywne nazwy dla zaznaczonej zmiennej
- `/regex-z-opisu` — buduje regex z opisu po polsku
- `/sql-z-opisu` — generuje SQL z opisu po polsku

**Agenci**
- **Tester** — pisze i uruchamia testy (`edit` + terminal)
- **Doc-writer** — edytuje wyłącznie pliki dokumentacji
- **Bezpiecznik** — read-only, szuka podatności
- **UI Designer** — tylko CSS / układ, bez logiki biznesowej
- **DevOps** — pisze skrypty deploymentowe, CI/CD
- **Migrator** — przepisuje kod legacy na nowe standardy
- **Refaktor** — modyfikuje, ale bez uruchamiania
- **Wyjaśniacz** — read-only, tylko analogie i proste słowa
- **Junior** — edytuje, ale zawsze pyta o zgodę
- **Architekt** — read-only, ale z `web/fetch` do badania trendów

**Skille**
- Scaffolder komponentu React z szablonem w `templates/`
- Generator changelogów z `git log`
- 10-punktowa lista code review checklist
- Postmortem template dla incydentów
- Generator OpenAPI z kontrolerów
- Onboarding bot dla nowego dewa (mapa repo)
- Sprzątacz `console.log` i martwego kodu
- Generator ADR (Architecture Decision Record)
- Skill do tworzenia diagramów Mermaid z kodu
- Generator pull request description

### Pomysły indywidualne — DLA NIE-DEWELOPERÓW

**Prompty (`/komenda`)**
- `/oferta-handlowa` — generator oferty z parametrów (klient, produkt, cena)
- `/post-linkedin` — z tematu generuje post w określonym stylu
- `/email-followup` — follow-up po spotkaniu z notatek
- `/agenda-spotkania` — generator agendy z celów spotkania
- `/podsumowanie-notatek` — wyciąga action items z luźnych notatek
- `/odpowiedz-na-maila` — szkic odpowiedzi z parametrami tonu
- `/pytania-do-wywiadu` — z opisu stanowiska generuje pytania
- `/checklista-onboardingu` — z roli nowego pracownika
- `/opis-stanowiska` — z wymagań biznesowych generuje job description
- `/raport-tygodniowy` — z notatek tygodnia generuje raport
- `/decyzje-z-transkrypcji` — wyciąga decyzje z luźnej transkrypcji
- `/cv-feedback` — review CV (Twojego lub kandydata)
- `/faq-z-dokumentu` — generuje FAQ z dłuższego dokumentu
- `/jezyk-prosty` — tłumaczy z żargonu na prosty język
- `/pytania-do-retro` — generator pytań retrospektywnych
- `/scenariusz-rozmowy` — scenariusz trudnej rozmowy z parametrami
- `/podsumuj-spotkanie` — z transkrypcji robi sekcje: tematy, decyzje, ToDo
- `/krytyka-pomyslu` — kontrargumenty do Twojego pomysłu
- `/persona-klienta` — generator persony z opisu segmentu

**Agenci**
- **Copywriter** — pisze treści marketingowe, ale tylko w plikach `marketing/`
- **PM-asystent** — pomaga zarządzać zadaniami, nie modyfikuje kodu
- **Recruiter** — review CV, generowanie ofert pracy
- **Trener** — uczy nowe osoby, używa analogii
- **Researcher** — read-only + `web/fetch`, robi research na temat
- **Edytor stylistyczny** — poprawia teksty, nie zmienia znaczenia
- **Asystent prawny** — analizuje dokumenty, flaguje ryzyka (NIE zastępuje prawnika!)
- **Asystent finansowy** — analizuje wydatki, generuje raporty

**Skille**
- Szablon raportu tygodniowego
- Szablon oferty handlowej
- Generator notatek ze spotkań (struktura: kontekst, decyzje, ToDo)
- Procedura onboardingu (krok po kroku)
- Szablon postu LinkedIn (różne typy: edukacyjny, ogłoszenie, opinia)
- Szablon scenariusza rozmowy 1:1
- Generator FAQ z dokumentu
- Procedura recenzji CV

### Pomysły zespołowe (BREAKOUTS)

Jeśli chcesz pracować z grupą — wybierzcie jeden z poniższych projektów lub wymyślcie własny:

1. **System rekrutacyjny** — 4 agenty: CV-reader → Interviewer (pytania) → Scorer (ocena) → Reporter (raport dla HR)
2. **Content pipeline** — Research → Outline → Writer → Editor → SEO-checker
3. **Bug squad** — Triager (klasyfikuje) → Reproducer (pisze test) → Fixer (poprawia) → Verifier (sprawdza)
4. **Documentation team** — Extractor (z kodu) → Structurer (układa) → Writer (formatuje) → Reviewer
5. **Onboarding bot** — Detector roli → Plan generator → Buddy assignment → Progress checker
6. **Stand-up automation** — Gatherer (zbiera updaty) → Summarizer → Risk flagger → Publisher
7. **Project kickoff** — Requirements gatherer → Architect → Estimator → Scheduler
8. **Customer support pipeline** — Classifier → Responder draft → Tone checker → Escalator
9. **Sprint retro asystent** — Mood gatherer → Theme detector → Action proposer → Notetaker
10. **Audyt zgodności** — Scanner kodu → Policy checker → Risk reporter → Remediator
11. **Marketing campaign team** — Research → Copy → Visual prompts → Schedule
12. **Workshop assistant** — Materials generator → Exercise designer → Quiz maker → Feedback collector

### Archetypy (jeśli nie wiesz, od czego zacząć)

Wypełnij swoim kontekstem:

| Archetyp | Twoja wersja |
|---|---|
| Asystent do pisania ___ | ? |
| Tłumacz z ___ na ___ | ? |
| Recenzent ___ | ? |
| Generator ___ z ___ | ? |
| Wyszukiwacz ___ w ___ | ? |
| Sprawdzacz checklisty ___ | ? |
| Konwerter formatu ___ → ___ | ? |
| Trener ___ | ? |
| Audytor ___ | ? |

## Blok 8 — Sharing (15 min)

W swoim breakout roomie pokażcie sobie nawzajem to, co stworzyliście. Potem wracamy na plenum — kilka osób lub grup pokaże swoje rozwiązania.

---

# Cheat sheet

## Skróty klawiszowe

| Skrót | Co robi |
|---|---|
| `Ctrl+I` / `Cmd+I` | Inline chat (w edytorze i terminalu) |
| `Alt+]` / `Alt+[` | Cycle suggestions (ghost text) |
| `Tab` | Zaakceptuj sugestię ghost text |
| `Esc` | Odrzuć sugestię |
| `Ctrl+Enter` | Wyślij wiadomość w czacie |

## Szablon frontmatter

### Prompt
```markdown
---
description: Krótki opis, kiedy używać
---
Treść promptu, używaj ${input:nazwa}, ${selection}, ${file}.
```

### Instrukcja warunkowa
```markdown
---
applyTo: "backend/**/*.js"
---
Reguły, które obowiązują, gdy edytujesz pliki backendu.
```

### Agent
```markdown
---
name: Nazwa
description: Krótki opis
tools: ['edit', 'search/codebase']
---
Systemowy prompt agenta. Określ rolę, ograniczenia, styl pracy.
```

### Skill
```markdown
# Narzędzia
Wymagane: #tool:edit

# Instrukcje
Krok-po-kroku procedura, którą model wykona.
```

## Zmienne dostępne w promptach

| Zmienna | Co zwraca |
|---|---|
| `${input:nazwa}` | Pyta użytkownika o wartość |
| `${selection}` | Aktualne zaznaczenie w edytorze |
| `${file}` | Aktualnie otwarty plik |
| `${input:nazwa:opis}` | Pyta z dodatkowym opisem |

---

# Co dalej (po warsztacie)

- Dokumentacja Copilot Customization: https://docs.github.com/en/copilot
- VS Code dokumentacja agentów: https://code.visualstudio.com/docs/copilot
- MCP servers registry: https://github.com/modelcontextprotocol/servers
- Pomyśl o **commit `.github/` do swojego repo zawodowego** — niech cały team korzysta.
- Stwórz **własny szablon** projektu z preferowaną konfiguracją Copilota.
