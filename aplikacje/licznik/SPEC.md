# Licznik — specyfikacja

Najprostsza możliwa aplikacja. Działa **w przeglądarce, bez serwera** — wartość trzymana w `localStorage`.

## Funkcjonalności

1. Wyświetlanie aktualnej wartości licznika (duża liczba na środku).
2. Przycisk **+1** — zwiększa wartość.
3. Przycisk **−1** — zmniejsza wartość.
4. Przycisk **Reset** — ustawia wartość na 0.
5. Wartość przeżywa odświeżenie strony.

## Model danych

- `count`: liczba całkowita (może być ujemna).

## Persystencja

- Wartość trzymana w `localStorage` pod kluczem `"count"`.
- Zapis: `localStorage.setItem("count", String(count))`.
- Odczyt: `Number(localStorage.getItem("count") ?? "0")`.
- Brak serwera, brak fetch, brak API.

## Struktura plików (w folderze aplikacji)

```text
index.html         ← struktura strony, ładuje css/ i js/
css/styles.css     ← cały styling
js/app.js          ← cała logika (stan, render, eventy)
```

## Uwagi

- Po każdej zmianie zapisz do `localStorage` i przerysuj wyświetlaną liczbę.
- Bez animacji i bibliotek — czysty HTML/CSS/JS.
