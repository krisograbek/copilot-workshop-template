---
applyTo: "backend/**"
---

# Instrukcje dla backendu

## Stack

- Node.js + Express.
- `cors` dla obsługi cross-origin z frontendu.
- Plik `tasks.json` jako "baza danych" (odczyt/zapis przez `fs/promises`).
- JavaScript, format modułów zgodny z `package.json` (`type: "module"` lub CommonJS — trzymaj się jednego).

## Struktura `server.js`

1. Import zależności (`express`, `cors`, `fs/promises`, `path`).
2. Middleware: `cors()`, `express.json()`.
3. Helpery do czytania/zapisu `tasks.json`.
4. Endpointy `/api/tasks` (GET, POST, PATCH, DELETE).
5. `app.listen(3001, ...)`.

## Konwencje API

- Wszystkie endpointy pod `/api`.
- JSON in / JSON out.
- Kody odpowiedzi:
  - `200` — OK (GET, PATCH, DELETE).
  - `201` — Created (POST).
  - `400` — błąd walidacji.
  - `404` — zasób nie istnieje.
  - `500` — błąd serwera.
- Format błędu: `{ error: "opis błędu" }`.

## Walidacja

- `title` w POST i PATCH: wymagany string, niepusty, max 200 znaków.
- `completed`: boolean.
- `id`: w URL parsowany jako string (bez wymuszania liczby).

## Persystencja

- Odczyt/zapis `tasks.json` przez `fs/promises.readFile` / `writeFile`.
- Plik startuje jako pusta tablica `[]`.
- Każdy zapis nadpisuje cały plik.

## Czego unikać

- Bazy danych (SQLite, mongo itp.).
- ORM-ów.
- Routerów Express w osobnych plikach (na warsztat trzymaj wszystko w `server.js`).
- Bibliotek walidacyjnych (zod, joi) — wystarczą zwykłe `if`-y.
