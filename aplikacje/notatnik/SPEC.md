# Notatnik — specyfikacja

Prosta aplikacja do krótkich notatek. Działa **w przeglądarce, bez serwera** — dane trzymane w `localStorage`.

## Funkcjonalności

1. Wyświetlanie listy notatek (najnowsze na górze).
2. Dodawanie nowej notatki (pole tekstowe + przycisk „Dodaj").
3. Usuwanie notatki.
4. Licznik notatek (ile jest w sumie).
5. Notatki przeżywają odświeżenie strony.

## Model danych

Notatka to obiekt:

- `id`: string (UUID z `crypto.randomUUID()`)
- `text`: string (1–500 znaków)
- `createdAt`: string (ISO date)

## Persystencja

- Wszystkie notatki trzymane w `localStorage` pod kluczem `"notes"`.
- Zapis: `localStorage.setItem("notes", JSON.stringify(notes))`.
- Odczyt: `JSON.parse(localStorage.getItem("notes") ?? "[]")`.
- Brak serwera, brak fetch, brak API.

## Struktura plików (w folderze aplikacji)

```text
index.html         ← struktura strony, ładuje css/ i js/
css/styles.css     ← cały styling
js/app.js          ← cała logika (stan, render, eventy)
```

## Walidacja

- `text` przy dodawaniu: wymagany, niepusty po `trim()`, max 500 znaków.
- Pusta notatka: nie dodawaj (najwyżej krótki komunikat w UI).
