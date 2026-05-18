---
mode: agent
description: Dodaj nowy endpoint do backendu według wzorca projektu.
---

# Nowy endpoint backendowy

Dodaj nowy endpoint do `backend/server.js`.

## Wejście

Zapytaj użytkownika (jeśli nie podał):

- **Metoda HTTP** (GET / POST / PATCH / DELETE)
- **Ścieżka** (zaczyna się od `/api/...`)
- **Cel endpointu** (1 zdanie)
- **Walidacja wejścia** (jeśli POST/PATCH — jakie pola, jakie reguły)
- **Format odpowiedzi** (sukces + ewentualny błąd)

## Co masz zrobić

1. Otwórz `backend/server.js`.
2. Dodaj endpoint w stylu spójnym z istniejącymi (kolejność: GET, POST, PATCH, DELETE).
3. Użyj helperów do czytania/zapisu `tasks.json` jeśli już istnieją — nie duplikuj.
4. Waliduj wejście — przy błędzie zwracaj `400` z `{ error: "..." }`.
5. Zwracaj poprawny kod HTTP (`200`/`201` sukces, `404` brak zasobu, `500` błąd serwera).
6. Trzymaj się konwencji z `.github/instructions/backend.instructions.md`.

## Po dodaniu

- Pokaż użytkownikowi przykładowy `curl` testujący endpoint.
- Nie modyfikuj frontendu w tym kroku.
- Nie dodawaj testów ani dokumentacji.

## Czego NIE rób

- Nie zmieniaj istniejących endpointów.
- Nie instaluj nowych pakietów.
- Nie wprowadzaj routerów Express w osobnych plikach.
