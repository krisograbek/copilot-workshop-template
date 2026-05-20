# Task Manager — specyfikacja

Prosta aplikacja do zarządzania zadaniami. Działa **w przeglądarce, bez serwera** — dane trzymane w `localStorage`.

## Funkcjonalności

1. Wyświetlanie listy zadań
2. Dodawanie nowego zadania (tytuł)
3. Oznaczanie zadania jako wykonane / niewykonane
4. Usuwanie zadania
5. Filtrowanie: wszystkie / aktywne / wykonane
6. Licznik pozostałych do wykonania

## Model danych

Zadanie to obiekt:

- `id`: string (UUID z `crypto.randomUUID()`)
- `title`: string (1–200 znaków)
- `completed`: boolean
- `createdAt`: string (ISO date)

## Persystencja

- Wszystkie zadania trzymane w `localStorage` pod kluczem `"tasks"`.
- Zapis: `localStorage.setItem("tasks", JSON.stringify(tasks))`.
- Odczyt: `JSON.parse(localStorage.getItem("tasks") ?? "[]")`.
- Brak serwera, brak fetch, brak API.

## Struktura plików

```text
index.html         ← struktura strony, ładuje css/ i js/
css/styles.css     ← cały styling
js/app.js          ← cała logika (stan, render, eventy)
```

## Walidacja

- `title` przy dodawaniu: wymagany, niepusty po `trim()`, max 200 znaków.
- Pusty tytuł: nie dodawaj zadania (najwyżej krótki komunikat w UI).
