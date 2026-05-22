---
mode: agent
description: Dodaj nową akcję (np. edycja, sortowanie, filtr) do aktualnej aplikacji w stylu projektu.
---

# Nowa akcja w aplikacji

Pracujesz nad aplikacją z **aktualnie otwartego folderu** w `aplikacje/` (tam, gdzie leży `SPEC.md` i `js/app.js`). Dodaj nową funkcjonalność — wszystko **w folderze tej aplikacji**. Cała logika idzie do `js/app.js`, ewentualne style do `css/styles.css`, ewentualne nowe elementy DOM do `index.html`.

## Wejście

Zapytaj użytkownika (jeśli nie podał):

- **Nazwa akcji** (np. „edycja notatki", „sortowanie po dacie", „reset licznika")
- **Trigger** (klik przycisku, zmiana selecta, submit formularza)
- **Walidacja** (jeśli dotyczy — jakie reguły)
- **Co się zmienia w stanie aplikacji** (która zmienna stanu, mutacja jakich pól)
- **Co się zmienia w UI** (jak ma wyglądać po akcji)

## Co masz zrobić

1. Otwórz `js/app.js` i znajdź miejsce na nową funkcję (sekcja funkcji akcji, obok istniejących).
2. Dodaj funkcję akcji. Zmień stan w odpowiedniej zmiennej, zapisz do `localStorage`, wywołaj `render()`.
3. Jeśli potrzebny nowy element UI — dodaj go w `index.html` (semantyczny tag, klasa w `kebab-case`).
4. Jeśli potrzebny styl — dodaj go w `css/styles.css` (na końcu odpowiedniej sekcji).
5. Wpinanie eventu: w sekcji event listenerów na końcu `js/app.js`.
6. Trzymaj się konwencji z `.github/instructions/js.instructions.md`, `html.instructions.md`, `css.instructions.md`.

## Po dodaniu

- Powiedz użytkownikowi, jak to przetestować (kroki w przeglądarce po otwarciu `index.html`).
- Nie dodawaj testów ani dokumentacji.
- Nie wprowadzaj nowych zależności ani plików, chyba że to konieczne — wtedy najpierw zapytaj.

## Czego NIE rób

- Nie instaluj paczek npm — w projekcie nie ma `package.json`.
- Nie dodawaj `fetch` / API — persystencja jest w `localStorage`.
- Nie wprowadzaj modułów ES (`import` / `export`).
- Nie refaktoryzuj istniejących funkcji „przy okazji".
