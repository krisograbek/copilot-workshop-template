# Mechanizmy Copilota — ściągawka decyzyjna

Krótkie podsumowanie sześciu mechanizmów + sygnały, kiedy każdy z nich jest właściwym wyborem. Używaj gdy nie jesteś pewien, do której szuflady wrzucić dany element zadania.

## 1. Custom Instructions — `.github/copilot-instructions.md`

**Czym jest:** plik markdown automatycznie doklejany do każdego promptu w workspace. Zero akcji ze strony użytkownika.

**Wybierz gdy:**
- Reguła ma być **zawsze aktywna** (kto jest właścicielem czego, w jakim tonie pisać maile, jaki format dat)
- To są standardy zespołu, nie logika konkretnej procedury
- Można też mieć warianty `*.instructions.md` z `applyTo:` celowane na konkretne pliki

**Nie wybieraj gdy:**
- To jednorazowe zadanie (użyj promptu)
- To wieloetapowa procedura (użyj skilla)

## 2. Prompt Files — `.github/prompts/<nazwa>.prompt.md`

**Czym jest:** gotowy "przepis" na jedno zadanie. Wywoływany przez `/nazwa` w czacie.

**Wybierz gdy:**
- Jedna konkretna akcja, powtarzalna ("wyślij przypomnienie do X", "zaktualizuj status w arkuszu")
- Nie potrzebujesz skryptów ani zasobów obok
- Logika mieści się w kilkunastu linijkach instrukcji

**Nie wybieraj gdy:**
- Procedura ma checklisty, blokery, wiele faz → skill
- Potrzebujesz trwałej roli z ograniczonymi narzędziami → custom agent

## 3. Custom Agents — `.github/agents/<nazwa>.agent.md`

**Czym jest:** persona z konkretnym zestawem narzędzi i instrukcji. Wybierasz go w pickerze agentów. Może mieć **handoffy** do innych agentów (np. Plan → Implementer).

**Wybierz gdy:**
- Potrzebujesz **roli** ("Manager Zamknięcia Miesiąca", "Code Reviewer")
- Chcesz ograniczyć narzędzia (read-only audytor, agent bez dostępu do terminala)
- Workflow ma wyraźne fazy z przekazaniem (plan → review → implementacja)

**Nie wybieraj gdy:**
- To pojedyncza akcja → prompt
- Chodzi tylko o "jak coś zrobić" bez ograniczeń → skill

## 4. Agent Skills — `.github/skills/<nazwa>/SKILL.md`

**Czym jest:** folder z `SKILL.md` + opcjonalnie `scripts/` i `references/`. Ładowany progresywnie, gdy zadanie pasuje.

**Wybierz gdy:**
- Powtarzalna procedura, którą wykonujesz w ten sam sposób (zamknięcie miesiąca, onboarding, postmortem)
- Potrzebujesz **skryptów** lub **plików referencyjnych** obok instrukcji
- Chcesz, żeby działało w VS Code, Copilot CLI i cloud agent — skill jest przenośny

**Nie wybieraj gdy:**
- Wystarczy jedna instrukcja bez plików → prompt
- Chodzi o twardą blokadę → hook

## 5. MCP Servers — `.vscode/mcp.json`

**Czym jest:** stałe połączenie agenta z zewnętrznym systemem (Google Sheets, Gmail, Slack, Notion, Jira, Calendar, baza danych).

**Wybierz gdy:**
- W zadaniu pojawia się jakikolwiek **żywy zewnętrzny system** ze stanem
- Agent ma czytać/pisać do arkusza, wysyłać maile, zaglądać do tickietów

**Reguła:** Bez MCP do danego systemu agent **nie ma rąk** do niego. Jeśli zadanie zawiera "Google Sheets jako źródło prawdy" — MCP do Sheets jest absolutnie pierwszą rzeczą do skonfigurowania.

## 6. Hooks — `.github/hooks/*.json`

**Czym jest:** deterministyczne komendy shell odpalane na wydarzeniach (`preToolUse`, `postToolUse`, `sessionEnd` itd.). Mogą **blokować** akcje agenta.

**Wybierz gdy:**
- Potrzebujesz **twardej** reguły, której agent nie ominie ("nie wysyłaj maila bez potwierdzenia człowieka", "nigdy `rm -rf`")
- Chcesz audytować/logować akcje
- MVP już działa i widzisz konkretne ryzyko, które trzeba okiełznać

**Nie wybieraj gdy:**
- Wystarczy reguła w instructions (agent będzie się jej trzymać, ale to nie jest twarda blokada)
- To pierwszy krok — hooki są warstwą **późniejszą**

---

## Częste wzorce kompozycji

- **Procedura biznesowa z ludźmi i zewnętrznym arkuszem:** MCP (Sheets/Gmail/Slack) + Skill (sam playbook) + Custom Agent (osoba prowadząca) + ewentualnie kilka promptów na powtarzalne mikrozadania.
- **Code review:** Custom Agent (read-only) + Prompt file (`/review`).
- **Onboarding nowego dewelopera:** Skill ze scriptami + Instructions z konwencjami zespołu.
- **Wieloetapowy projekt:** Plan Agent → handoff → Implementer Agent → handoff → Reviewer Agent.

---

## Antywzorce — czego nie robić

- **Wszystko na raz w jednym agencie.** Custom Agent z 20 narzędziami i 500-liniowym promptem to nie jest design. Rozbij na role + skille.
- **Hooki zamiast instructions.** Hook to blokada, nie miejsce na "ogólne zasady stylu".
- **Skill bez plików obok.** Jeśli skill nie ma `scripts/` ani `references/` i mieści się w 30 liniach — to prawdopodobnie powinien być prompt.
- **MCP do każdego systemu na zapas.** Konfiguruj MCP tylko do systemów, które MVP realnie dotyka. Resztę dokładasz w krokach 2-3.
