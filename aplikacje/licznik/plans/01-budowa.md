# Plan: Budowa aplikacji Licznik

## Cel
Zbudować prostą aplikację licznika działającą w przeglądarce, z przyciskami do zwiększania, zmniejszania i resetu wartości, z persystencją w `localStorage`.

## Wymagania

**Funkcjonalne:**
- Wyświetlanie bieżącej wartości licznika (duża liczba na środku ekranu)
- Przycisk **+1** — zwiększa wartość o 1
- Przycisk **−1** — zmniejsza wartość o 1
- Przycisk **Reset** — ustawia wartość na 0
- Wartość przetrwaje odświeżenie strony

**Niefunkcjonalne:**
- Vanilla HTML + CSS + JavaScript (bez frameworków, bibliotek, bundlera)
- Kod przechowywany w `localStorage` pod kluczem `"count"`
- Prosty, czytelny kod bez warstw abstrakcji
- Bez `console.log` w kodzie produkcyjnym

## Pliki do zmiany
1. **Nowy: `index.html`** — struktura HTML z wyświetlaczem i trzema przyciskami
2. **Nowy: `css/styles.css`** — całe stylowanie (layout, typografia, kolory)
3. **Nowy: `js/app.js`** — zarządzanie stanem, obsługa eventów, zapis do localStorage

## Kroki implementacji

1. **Utwórz `index.html`**
   - Struktura: `<!DOCTYPE html>`, meta charset UTF-8, viewport
   - Linkuj `css/styles.css` w `<head>`
   - Body zawiera: `<div id="counter">` (wyświetlacz), trzy `<button>` (+1, −1, Reset)
   - Na końcu bodya linkuj `js/app.js`

2. **Utwórz `css/styles.css`**
   - Reset: `* { margin: 0; padding: 0; box-sizing: border-box; }`
   - Całe okno: flexbox, centrowanie w pionie i poziomie, wysokość 100vh
   - `#counter`: duża czcionka (np. 80px), font-weight bold
   - Przyciski: sensowny rozmiar (np. 20px, padding 20px), margines, border-radius
   - Hover/active na przyciskach dla interaktywności

3. **Utwórz `js/app.js`**
   - Na starcie: `let count = Number(localStorage.getItem("count") ?? "0");`
   - Funkcja `render()`: ustawia `#counter` na bieżącą wartość
   - Event listener na każdy przycisk:
     - `+1`: `count++`
     - `−1`: `count--`
     - `Reset`: `count = 0`
   - Po każdej zmianie: `localStorage.setItem("count", String(count));` i `render();`
   - Wywołaj `render()` na starcie strony

## Testy manualne

1. Otwórz `index.html` w przeglądarce — licznik powinien wyświetlać `0`
2. Kliknij **+1** trzy razy — licznik powinien pokazywać `3`
3. Kliknij **−1** raz — licznik powinien pokazywać `2`
4. Kliknij **Reset** — licznik powinien pokazywać `0`
5. Zamknij stronę i otwórz ponownie — wartość powinna być taka sama (jeśli była 5, ma być 5)
6. W DevTools (`F12` → Console) sprawdź `localStorage.getItem("count")` — powinna być aktualna wartość

## Ryzyka

- **Brak**: aplikacja jest bardzo prosta, mało co może pójść nie tak
- Uwaga na literówki w selektorach (`#counter`) — JavaScript i HTML muszą się zgadzać
- Pamiętać o `localStorage.setItem(String(count))` — localStorage trzyma stringi, muszą być konwertowane
