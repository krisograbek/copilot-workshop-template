# Task Manager — specyfikacja

Prosta aplikacja do zarządzania zadaniami. Działa lokalnie, bez logowania.

## Funkcjonalności

1. Wyświetlanie listy zadań
2. Dodawanie nowego zadania (tytuł)
3. Oznaczanie zadania jako wykonane / niewykonane
4. Usuwanie zadania
5. Filtrowanie: wszystkie / wykonane / niewykonane

## Model danych

Zadanie to obiekt:
- `id`: string (UUID)
- `title`: string
- `completed`: boolean
- `createdAt`: string (ISO date)

## Backend API

- `GET /api/tasks` — lista wszystkich zadań
- `POST /api/tasks` — dodaj zadanie (body: `{ title }`)
- `PATCH /api/tasks/:id` — zmień zadanie (body: `{ title?, completed? }`)
- `DELETE /api/tasks/:id` — usuń zadanie

## Persystencja

Wszystkie zadania zapisywane do `backend/tasks.json`.