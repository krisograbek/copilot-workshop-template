# Konwencje projektu Task Manager

To prosta full-stack aplikacja używana na warsztacie. Najważniejsze: **prostota i czytelność**.

## Stack
- Frontend: React 18 + Vite, komponenty funkcyjne, hooki (useState, useEffect)
- Style: czyste CSS w plikach `.css` importowanych do komponentów
- Backend: Node.js + Express + cors, **wszystko w jednym pliku `backend/server.js`**
- Persystencja: `fs/promises` zapisuje do `backend/tasks.json`
- Brak TypeScriptu, brak bazy danych, brak autoryzacji

## Zasady

- Pisz **prosty kod**. Bez warstw, bez abstrakcji, bez wzorców. Jeden plik = jedna rzecz.
- Nazwy zmiennych i funkcji **po angielsku** (bo standard).
- Komentarze **po polsku** — to materiał warsztatowy.
- Backend: nie rozdzielaj na routes/controllers/services. **Wszystko w `server.js`**.
- Frontend: jeden komponent `App.jsx`. Wydzielaj tylko jeśli wprost o to poproszę.
- Po każdej zmianie pliku `tasks.json` musisz najpierw odczytać aktualną zawartość, zmodyfikować, zapisać z powrotem.
- Używaj `crypto.randomUUID()` dla ID zadań.

## Czego unikać
- Bibliotek innych niż te w `package.json` (chyba że poproszę).
- Dodawania feature'ów, o które nie poprosiłem.
- `console.log` w kodzie produkcyjnym (tylko podczas debugowania).