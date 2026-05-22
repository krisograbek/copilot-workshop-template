# GitHub Copilot: zespół agentów AI w twoim repo

Warsztat, na którym budujesz własny zespół agentów AI — takich, które planują, piszą kod i recenzują się nawzajem, z tobą w pętli. Nie uczysz się „jak używać Copilota do podpowiedzi". Budujesz konfigurację, którą commitujesz do firmowego repo i z której od następnego dnia korzysta cały zespół.

## Czego się nauczysz

- **Cztery powierzchnie Copilota** — kiedy pytasz (Ask), kiedy agent działa narzędziami, kiedy edytujesz w kontekście (Inline), kiedy sięgasz po gotowca (Smart Actions).
- **Agent = persona + narzędzia** — jak z jednego mechanizmu zrobić różne role, zmieniając tylko zestaw narzędzi i prompt. Read-only patrzy i mówi; z `edit` zmienia pliki.
- **Łańcuch agentów (handoffs)** — jak przekazywać kontrolę między agentami: spec → plan → implementacja → recenzja, z zatwierdzaniem przez człowieka na każdym kroku.
- **Co kiedy się ładuje** — różnica między instrukcją (zawsze aktywna), promptem (`/wołasz`), agentem (wybierasz) i skillem (model dobiera sam).
- **Wytyczna vs egzekwowanie** — kiedy wystarczy instrukcja, a kiedy potrzebujesz twardej blokady (hook).

## Co zbudujesz na warsztacie

To jest serce warsztatu. Każdy buduje na swoim pomyśle, w swoim repo.

- **Własna aplikacja od zera** — w dwóch zdaniach mówisz, co chcesz. Agent `Spec` zamienia to w specyfikację, `Planner` układa plan, `Implementer` pisze kod. Otwierasz w przeglądarce — działa. Twój pomysł, zbudowany przez zespół agentów.
- **Własny agent** — piszesz agenta dopasowanego do swojej pracy: `Tester`, który pisze testy, `Reviewer`, który recenzuje bez prawa do zmian, `Tłumacz`, który objaśnia kod, albo `Dokumentalista`, który pisze instrukcję użytkownika. Zmieniasz `tools` i prompt — dostajesz inną rolę.
- **Konfiguracja repo** — instrukcje, prompty i agenci w katalogu `.github/`, gotowe do scommitowania. To, co zbudujesz, zostaje w repo i działa dla każdego, kto je sklonuje.

## Co zyska Twoja firma

- **Jeden standard pracy z AI w repo** — zamiast „każdy promptuje po swojemu" macie wspólnych agentów, instrukcje i konwencje zapisane w projekcie.
- **Wiedza zostaje w organizacji** — sposób planowania, zasady recenzji, konwencje kodu — wszystko jako asset w repo, nie w czyjejś głowie. Nowa osoba klonuje repo i od dnia pierwszego pracuje tak jak reszta.
- **Fundament pod skalowanie** — agenci i skille zbudowane na warsztacie to gotowy wsad pod większą automatyzację w zespole.

## Format

- **Czas trwania:** 60 minut
- **Formuła:** warsztat interaktywny (demo prowadzącego + „spróbuj sam" równolegle)
- **Uczestnicy:** programiści i osoby techniczne; część ćwiczeń robi też każdy nie-dev
- **Wymagania:** VS Code z rozszerzeniem GitHub Copilot (zalogowane).

## Deliverables

- **Gotowi agenci** — `Spec`, `Planner`, `Implementer` plus agent, którego napiszesz sam. Zostają w repo.
- **Gotowe prompty i instrukcje** — przetestowane, działają od razu po sklonowaniu repo.
- **Materiały po warsztacie** — menu ćwiczeń od łatwych do zaawansowanych (skille, hooki, MCP) do samodzielnej nauki.
