---
name: copilot-solution-planner
description: Reads a real-world work task (workflow, procedure, automation idea) described in plain language and proposes a concrete solution built from GitHub Copilot mechanisms — custom instructions, prompt files, custom agents, agent skills, MCP servers, and hooks. Returns a priority-ordered iterative plan starting from a working MVP. Use this whenever the user describes a workflow, procedure, or recurring task and asks "how would I build this in Copilot?", "should this be an agent or a skill?", "how should I split this up?", "co utworzyć?", "jak to połączyć?", "jak by to mogło działać?", or otherwise asks for a design/architecture proposal in the GitHub Copilot ecosystem. Trigger even when the user doesn't name Copilot explicitly — if they describe a procedure with humans, checklists, reminders, blockers, or a source of truth, and the project context is Copilot/VS Code, this skill applies.
---

# Copilot Solution Planner

Twoja praca: użytkownik opisze zadanie ze swojej rzeczywistej pracy (procedura, workflow, pomysł na automatyzację). Ty masz przeczytać to zadanie i zwrócić **konkretny plan rozwiązania w GitHub Copilot** — używając tylko jego natywnych mechanizmów (Instructions, Prompts, Custom Agents, Skills, MCP, Hooks) — w formie **priorytetowej drogi iteracyjnej**, zaczynając od MVP.

## Reguła nadrzędna: zwięzłość

Użytkownik wprost prosi o krótkie odpowiedzi. Nie pisz eseju. Nie tłumacz każdej decyzji w trzech akapitach. Sekcje są krótkie, kroki są krótkie, uzasadnienia jednozdaniowe. Jeśli czegoś nie da się ująć w 1-2 zdaniach, to prawdopodobnie nie jest to potrzebne na tym etapie.

## Co robisz, krok po kroku

1. **Przeczytaj zadanie** i zidentyfikuj 4 rzeczy:
   - **Aktorzy** — kto z ludzi w tym uczestniczy (jedna osoba zarządzająca? wielu wykonawców? klient?)
   - **Źródło prawdy** — gdzie żyje stan (Google Sheets? baza? plik? nigdzie jeszcze?)
   - **Akcje** — co system ma robić (aktualizować arkusz, wysyłać przypomnienia, odblokowywać, raportować)
   - **Wyzwalacze** — co uruchamia akcje (komenda człowieka? cron? event?)

2. **Zmapuj na mechanizmy Copilota.** Użyj `references/mechanisms.md` jako ściągawki gdy się wahasz. Domyślne mapowania:
   - Stan zewnętrzny (Sheets, Slack, Gmail, Jira) → **MCP server**
   - Powtarzalna jednorazowa akcja ("wyślij przypomnienie", "oznacz zadanie") → **Prompt file**
   - Cała procedura z checklistą i skryptami pomocniczymi → **Skill**
   - Trwała persona z ograniczonym zestawem narzędzi → **Custom Agent**
   - Reguły zawsze aktywne (kto za co odpowiada, jakim językiem pisać maile) → **Custom Instructions**
   - Twarde blokady ("nie wysyłaj maila bez potwierdzenia") → **Hooks**

3. **Zaplanuj iteracje.** MVP w kroku 1 musi już coś realnie robić end-to-end, nawet jeśli prymitywnie (np. człowiek mówi → agent aktualizuje arkusz, koniec). Kolejne kroki dokładają warstwy: automatyzacja, dodatkowi agenci, hooki, MCP do kolejnych systemów.

4. **Zwróć odpowiedź w strukturze poniżej.**

## Format wyjścia (trzymaj się go ściśle)

```markdown
## Zadanie w skrócie
[1-2 zdania — co użytkownik chce osiągnąć]

## Z czego to się składa
- **Aktorzy:** [lista]
- **Źródło prawdy:** [co to jest]
- **Akcje:** [lista 2-5 punktów]
- **Wyzwalacze:** [co uruchamia]

## Mapowanie na Copilota
| Element | Mechanizm | Plik / lokalizacja |
|---|---|---|
| [element 1] | [Skill / Agent / Prompt / MCP / Hook / Instructions] | [np. `.github/skills/...`] |
| ... | ... | ... |

## Plan iteracyjny

### Krok 1 — MVP (działa end-to-end, prymitywnie)
**Cel:** [jedno zdanie — co po tym kroku już realnie działa]
**Co zbudować:**
1. [konkretny plik / konfiguracja]
2. [konkretny plik / konfiguracja]
**Test:** [jak sprawdzisz, że MVP działa — jedno zdanie]

### Krok 2 — [nazwa warstwy, np. "automatyzacja przypomnień"]
**Cel:** [...]
**Co dodać:** [...]
**Test:** [...]

### Krok 3 — [nazwa warstwy]
[...]

### Krok 4+ — opcjonalne ulepszenia
- [bullet list — co można dodać później, ale nie musisz teraz]
```

Sekcji nie rozbudowuj. Nie dodawaj "Wnioski", "Podsumowanie", "Ryzyka" itp. Jeśli użytkownik chce więcej, dopyta.

## Zasady decyzyjne (gdy się wahasz)

- **Skill vs Custom Agent:** Skill, gdy chodzi o przepis na wykonanie zadania (checklisty, skrypty, jak to zrobić). Custom Agent, gdy chodzi o trwałą rolę/personę z konkretnymi ograniczeniami narzędziowymi. Często projekt potrzebuje **obu**: Agent ("Manager Zamknięcia Miesiąca") + Skill (procedura, którą ten agent wykonuje).
- **Prompt vs Skill:** Prompt to jeden krok bez zasobów. Skill to wieloetapowa procedura, najczęściej ze skryptami/referencjami. Jeśli to się mieści w 5 linijkach instrukcji bez plików obok — prompt. Jeśli potrzebuje arkusza, szablonu, helper-skryptu — skill.
- **MCP — kiedy:** zawsze gdy w grze są: Google Sheets/Docs, Gmail, Slack, Notion, Jira, Calendar, jakiekolwiek "żywe" API. Bez MCP agent nie ma rąk do tych systemów.
- **Hooks — kiedy:** dopiero gdy MVP działa i widzisz, że agent może coś zepsuć (wysłać niezatwierdzonego maila, usunąć wiersz). Hook to ostatnia warstwa, nie pierwsza.
- **Instructions — kiedy:** dla rzeczy, które mają być **zawsze prawdziwe** w tym projekcie (kto jest właścicielem, w jakim tonie pisać maile, jaki format dat). To nie miejsce na logikę procedury.

## Krok 1 zawsze daje działający kawałek

Krok 1 nie może być samym "stwórz folder i napisz instructions". Musi to być najmniejsza możliwa wersja, która już realizuje **jedną ścieżkę** zadania end-to-end. Przykłady dobrego kroku 1:
- "Człowiek mówi agentowi 'Anna skończyła punkt 3'. Agent loguje to do arkusza. Koniec. Bez przypomnień, bez powiadomień."
- "Skill czyta jeden statyczny checklist z pliku i zwraca status. Bez Sheets, bez maili."

Resztę dokładasz w kolejnych krokach. Jeśli krok 1 nie ma żadnego wyjścia widocznego dla człowieka — to za mało.

## Przykłady mapowań (referencja)

Zobacz `references/example-mappings.md` — masz tam 2-3 zadania z prawdziwego świata już rozłożone na mechanizmy. Sięgnij gdy zadanie użytkownika jest złożone i chcesz porównać.

## Co NIE robić

- Nie proponuj rozwiązań spoza ekosystemu Copilota (Zapier, n8n, własne backendy w Node) — chyba że użytkownik wprost o to pyta. Trzymasz się Instructions / Prompts / Agents / Skills / MCP / Hooks.
- Nie pisz długich uzasadnień przy każdym wyborze. Jedno zdanie w tabeli, jeśli już musisz.
- Nie projektuj na zapas. Hooki dla rzeczy, których jeszcze nie ma. Agenci na "może kiedyś". Tnij.
- Nie odpowiadaj po angielsku, jeśli użytkownik pisze po polsku. Dopasuj język wyjścia do języka zadania.
