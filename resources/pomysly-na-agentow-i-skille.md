# Pomysły na agentów i skille (ściągawka prowadzącego)

> Prywatna ściągawka do bloku **HANDS-ON 2 — „każdy dodaje własnego agenta"** (46–58 min).
> Uczestnicy piszą agenta **sami**; Ty podsuwasz pomysł dopasowany do profilu i masz pod ręką gotowy frontmatter.
> Plik agenta: `.github/agents/<nazwa>.agent.md`. Każdy uruchamia go na **swojej** apce z `aplikacje/`.
> Sekcja **Pomysły na skille** (na dole) to materiał zaawansowany / praca domowa — gdy ktoś skończy wcześniej albo zapyta o skille.

## Jedna pointa, którą powtarzasz przy każdym

**Narzędzia (`tools`) = rola.** Ten sam mechanizm „custom agent"; różni go tylko zestaw narzędzi i system prompt.
- read-only (`read`, `search/codebase`) → agent, który **patrzy i mówi**, nie ruszy kodu (Reviewer, Tłumacz).
- + `edit` → agent, który **zmienia pliki** (Tester, Dokumentalista).
- + `execute` → agent, który **uruchamia** (rzadko potrzebne przy vanilla HTML).

---

## Dla technicznych

### Tester
Pisze proste testy (asercje w osobnym pliku `tests.html` z `console.assert`, bo w projekcie nie ma npm/runnera). Wariant TDD: najpierw test, który **nie przechodzi**, potem handoff do Implementera „zrób, żeby przeszedł".

```yaml
---
description: Pisze proste testy asercyjne dla logiki z js/app.js. Nie zmienia kodu aplikacji.
name: Tester
tools: ['search/codebase', 'read', 'edit']
model: ['Claude Haiku 4.5', 'GPT-4.1']
handoffs:
  - label: Przekaż do Implementera
    agent: Implementer
    prompt: Te testy nie przechodzą. Zmień kod aplikacji tak, żeby przeszły. Nie ruszaj samych testów.
    send: false
---
```
**System prompt (skrót):** „Czytasz `js/app.js` i piszesz testy asercyjne w `tests.html` (`console.assert`, wynik w konsoli). Testujesz logikę, nie DOM. Nie zmieniasz `js/app.js`."

### Reviewer (read-only)
Najmocniejsza pointa o narzędziach: **świadomie BEZ `edit` i `execute`**.

```yaml
---
description: Recenzuje kod po Implementerze. Nie zmienia go — zwraca listę uwag + werdykt.
name: Reviewer
tools: ['search/codebase', 'read']
model: ['Claude Haiku 4.5', 'GPT-4.1']
handoffs:
  - label: Odeślij do Implementera
    agent: Implementer
    prompt: Reviewer zgłosił uwagi powyżej. Popraw kod zgodnie z nimi.
    send: false
---
```
**System prompt (skrót):** „Recenzujesz kod po Implementerze pod kątem `.github/copilot-instructions.md`. Nie zmieniasz plików. Zwracasz listę uwag + werdykt `APPROVE` / `CHANGES`."

---

## Dla nietechnicznych

### Tłumacz kodu (read-only)
Tłumaczy `js/app.js` na ludzki polski — idealne dla osoby, która nie programuje.

```yaml
---
description: Tłumaczy kod aplikacji na prosty polski. Niczego nie zmienia.
name: Tlumacz
tools: ['search/codebase', 'read']
model: ['Claude Haiku 4.5', 'GPT-4.1']
---
```
**System prompt (skrót):** „Czytasz wskazany plik (np. `js/app.js`) i tłumaczysz, co robi, prostym polskim, krok po kroku, bez żargonu. Niczego nie edytujesz."

### Dokumentalista (instrukcja użytkownika)
Pisze `README.md` / instrukcję obsługi apki dla zwykłego użytkownika.

```yaml
---
description: Pisze instrukcję użytkownika (README) dla aplikacji. Nie rusza kodu aplikacji.
name: Dokumentalista
tools: ['search/codebase', 'read', 'edit']
model: ['Claude Haiku 4.5', 'GPT-4.1']
---
```
**System prompt (skrót):** „Czytasz `SPEC.md` i `index.html` aplikacji i piszesz `README.md` w folderze aplikacji: do czego służy, jak uruchomić (otwórz `index.html`), jak używać krok po kroku. Prosty język, bez technikaliów. Nie edytujesz `js/app.js` ani `css/`."

### Copywriter UI
Poprawia teksty w interfejsie (etykiety, komunikaty, placeholdery) — bez ruszania logiki.

```yaml
---
description: Poprawia teksty w UI (etykiety, komunikaty). Edytuje tylko teksty w index.html.
name: Copywriter
tools: ['search/codebase', 'read', 'edit']
model: ['Claude Haiku 4.5', 'GPT-4.1']
---
```
**System prompt (skrót):** „Poprawiasz teksty widoczne dla użytkownika w `index.html` (etykiety, przyciski, komunikaty, placeholdery) na jaśniejsze i przyjaźniejsze. Nie zmieniasz struktury HTML, klas ani logiki w `js/app.js`."

---

## Pomysły na skille (zaawansowane / praca domowa)

Plik skilla: `.github/skills/<nazwa>/SKILL.md` (opcjonalnie `scripts/` i `references/`).

### Pointa o skillach

**Skill ≠ agent.** Agenta **wybierasz** z dropdownu; skill **model dobiera sam** na podstawie `description`, dlatego musi być konkretny. Dwie rzeczy, których nie ma agent:
- **progressive loading** — model ładuje treść `SKILL.md` dopiero, gdy uzna, że pasuje (nie zajmuje kontekstu na zapas).
- **dołączone zasoby** — skill może wieźć ze sobą skrypt w `scripts/` albo materiały w `references/`, które model uruchamia/czyta w razie potrzeby.

### Dla technicznych (skille)

**Changelog (skill + skrypt)** — czyta historię gita i składa `CHANGELOG.md`. Pokazuje skrypt + progressive loading.

```yaml
---
name: changelog
description: Generuje CHANGELOG.md z historii commitów. Użyj, gdy ktoś prosi o changelog, listę zmian albo „co się zmieniło od ostatniego release".
---
```
**Treść (skrót):** „1. Uruchom `scripts/git-log.sh` (zwraca commity od ostatniego tagu). 2. Pogrupuj w sekcje Added / Changed / Fixed. 3. Dopisz na górze `CHANGELOG.md`." W `scripts/git-log.sh`: `git log $(git describe --tags --abbrev=0)..HEAD --pretty='- %s'`.

**Commit-msg** — pisze wiadomość commita ze zmian w stagingu.

```yaml
---
name: commit-msg
description: Pisze wiadomość commita w stylu conventional commits na podstawie zmian w stagingu (git diff --cached).
---
```
**Treść (skrót):** „Uruchom `git diff --cached`, na tej podstawie napisz jedną linię `typ(zakres): opis` + opcjonalny krótki body. Nie commituj — tylko zaproponuj treść."

### Dla nietechnicznych (skille)

**Nowości dla użytkowników** — zamienia techniczną historię zmian na prosty opis „co nowego".

```yaml
---
name: nowosci-dla-uzytkownikow
description: Zamienia listę zmian / commity na prosty opis „co nowego" dla użytkowników aplikacji, bez żargonu.
---
```
**Treść (skrót):** „Weź `CHANGELOG.md` albo `git log`, przepisz na 3–5 punktów językiem użytkownika (co zyskuje, nie jak to zrobiono). Bez nazw plików i funkcji."

**Przegląd aplikacji** — czyta wszystkie `SPEC.md` i pisze prosty katalog apek.

```yaml
---
name: przeglad-aplikacji
description: Czyta wszystkie SPEC.md w aplikacje/ i pisze prosty przegląd: jakie apki są w repo i co robią.
---
```
**Treść (skrót):** „Znajdź wszystkie `aplikacje/*/SPEC.md`, dla każdej napisz 1–2 zdania, co to za apka i co potrafi. Wynik jako tabelka albo lista, prostym językiem."

---

## Jak to odpalić na warsztacie (skrót dla Ciebie)

**Agent:**
1. Uczestnik tworzy `.github/agents/<nazwa>.agent.md`, wkleja frontmatter z odpowiedniej sekcji, dopisuje system prompt.
2. Wybiera agenta w dropdownie czatu (tryb Agent).
3. Otwiera plik swojej apki (`js/app.js` / `index.html`) i prosi agenta o jego zadanie.
4. Pointa: *„zmieniliście tylko `tools` i prompt — i macie inną rolę w zespole."*

**Skill:**
1. Uczestnik tworzy `.github/skills/<nazwa>/SKILL.md` (i ewentualnie `scripts/`).
2. **Nie wybiera go ręcznie** — pisze w czacie zadanie pasujące do `description` i patrzy, czy model sam sięgnie po skill.
3. Pointa: *„agenta wołasz, skill model dobiera sam — dlatego `description` musi być precyzyjny."*
