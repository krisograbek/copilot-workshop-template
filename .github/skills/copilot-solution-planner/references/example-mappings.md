# Przykładowe mapowania zadanie → Copilot

Trzy realne zadania rozłożone na mechanizmy + plan iteracyjny. Używaj jako wzorca formatu, **nie kopiuj treści** — zadanie użytkownika będzie inne.

---

## Przykład 1 — Procedura zamknięcia miesiąca księgowego

**Zadanie (skrócone):** Procedura zamknięcia miesiąca z checklistą, blokerami, źródłem prawdy w Google Sheets. Jedna osoba zarządzająca mówi asystentowi co zostało zrobione, asystent aktualizuje arkusz i rozsyła przypomnienia / informacje "możesz iść dalej" do odpowiednich osób.

### Z czego się składa
- **Aktorzy:** 1 osoba zarządzająca + N wykonawców (księgowi, finanse)
- **Źródło prawdy:** Google Sheets (status każdego kroku, blokery, deadlines)
- **Akcje:** aktualizuj komórki w arkuszu, wyślij przypomnienie do osoby X, wyślij info "odblokowane" do osoby Y, pokaż checklistę z blokerami
- **Wyzwalacze:** zarządzający mówi w czacie ("Anna skończyła punkt 3", "co zostało na dziś?")

### Mapowanie
| Element | Mechanizm | Lokalizacja |
|---|---|---|
| Google Sheets jako źródło prawdy | MCP server | `.vscode/mcp.json` |
| Gmail / Slack do powiadomień | MCP server | `.vscode/mcp.json` |
| Procedura zamknięcia (checklisty, kolejność, kto za co odpowiada) | Skill | `.github/skills/month-end-closing/SKILL.md` + `references/checklist.md` |
| Osoba zarządzająca jako trwała rola | Custom Agent | `.github/agents/closing-manager.agent.md` |
| Jednorazowe akcje ("/wyslij-przypomnienie", "/odblokuj-osobe") | Prompt files | `.github/prompts/*.prompt.md` |
| Zawsze aktywne ("ton maili — formalny po polsku, podpis: 'Zespół Księgowości'") | Instructions | `.github/copilot-instructions.md` |
| "Nie wysyłaj maila bez potwierdzenia" | Hook (preToolUse) | `.github/hooks/confirm-email.json` — dopiero w kroku 4 |

### Plan iteracyjny

**Krok 1 — MVP: ręczna aktualizacja arkusza**
- **Cel:** zarządzający mówi "Anna skończyła punkt 3" → agent aktualizuje arkusz. Koniec. Bez powiadomień, bez logiki blokerów.
- **Co zbudować:**
  1. MCP do Google Sheets (`.vscode/mcp.json`)
  2. Custom instructions z listą osób i ID arkusza
- **Test:** Powiedz "Anna skończyła punkt 3" — sprawdź komórkę w arkuszu.

**Krok 2 — Skill z checklistą i blokerami**
- **Cel:** zapytanie "co dziś jest do zrobienia" zwraca posortowaną listę z blokerami.
- **Co dodać:**
  1. Skill `month-end-closing` z `SKILL.md` (procedura) + `references/checklist.md` (lista kroków, zależności)
  2. Prompt `/status-dnia` jako szybki skrót
- **Test:** wpisz `/status-dnia` — dostaniesz "Anna: czeka na potwierdzenie X od Marka. Marek: blokuje 4 osoby."

**Krok 3 — Powiadomienia (Gmail/Slack)**
- **Cel:** agent sam wysyła przypomnienia i info o odblokowaniu.
- **Co dodać:**
  1. MCP do Gmail lub Slack
  2. Prompty `/wyslij-przypomnienie` i `/poinformuj-odblokowanych`
  3. Custom Agent "Closing Manager" z handoffem do tych promptów
- **Test:** "Marek skończył X" — agent aktualizuje arkusz + wysyła 4 powiadomienia.

**Krok 4+ — opcjonalne ulepszenia**
- Hook `preToolUse` blokujący wysyłkę maila bez potwierdzenia
- Cloud agent uruchamiany codziennie rano (raport statusu)
- Skill `month-end-postmortem` po zakończeniu miesiąca

---

## Przykład 2 — Onboarding nowego dewelopera

**Zadanie:** Nowy człowiek dołącza do zespołu. Chcemy, żeby Copilot prowadził go przez setup: clone repo, install deps, znajdź mentora, zrób pierwszy PR.

### Mapowanie (skrócone)
| Element | Mechanizm |
|---|---|
| Standardy kodowe zespołu | Instructions |
| Pełna procedura onboardingu (krok po kroku, ze scriptami setup) | Skill `onboarding/` ze scriptem `setup.sh` |
| `/find-mentor` zwracający najlepszego mentora | Prompt file |
| MCP do Slack (powiadom mentora) | MCP |

### Plan iteracyjny (skrócony)
- **Krok 1:** Instructions z konwencjami + skill `onboarding` ze statyczną checklistą.
- **Krok 2:** Skill dostaje script `setup.sh` — automatyzuje clone + npm install.
- **Krok 3:** MCP do Slacka + prompt `/find-mentor` — agent powiadamia mentora.

---

## Przykład 3 — Triaging błędów zgłaszanych przez klientów

**Zadanie:** Klient zgłasza buga w Linear. Chcemy, żeby Copilot zaklasyfikował, sprawdził logi, przypisał właściciela.

### Mapowanie (skrócone)
| Element | Mechanizm |
|---|---|
| Linear (czytanie/aktualizacja ticketu) | MCP |
| Logi (np. Sentry, Grafana) | MCP |
| Procedura triażu z regułami klasyfikacji | Skill `bug-triage/` |
| Custom Agent "Triager" — read-only do kodu, write do Linear | Custom Agent |
| "Krytyczny bug — zawsze pinguj on-calla" | Hook lub Instructions |

### Plan iteracyjny (skrócony)
- **Krok 1:** MCP do Linear + custom agent "Triager" robi tylko klasyfikację (P0/P1/P2).
- **Krok 2:** Skill dokłada zaglądanie do logów + dopinanie do ticketu.
- **Krok 3:** Hook pingowania on-calla przy P0.

---

## Wnioski z tych przykładów

1. **MCP prawie zawsze w kroku 1.** Bez połączenia z systemem-źródłem prawdy nic nie działa.
2. **Skill = procedura, Agent = osoba.** Często potrzebujesz obu, ale skill możesz zbudować pierwszy, agent dorobić później.
3. **Hooki w kroku 3-4, nigdy w 1.** Najpierw musi działać, potem zabezpieczasz.
4. **Prompty są tanie.** Możesz mieć ich 5-10 jako mikro-akcje wewnątrz większej procedury.
