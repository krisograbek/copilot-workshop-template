import express from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TASKS_FILE = path.join(__dirname, 'tasks.json');
const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

// TODO: helpery do odczytu/zapisu tasks.json
// async function readTasks() { ... }
// async function writeTasks(tasks) { ... }

// TODO: endpointy zgodnie z SPEC.md
// GET    /api/tasks         — lista zadań
// POST   /api/tasks         — utworzenie zadania (walidacja: title required, max 200)
// PATCH  /api/tasks/:id     — aktualizacja (np. completed)
// DELETE /api/tasks/:id     — usunięcie

app.listen(PORT, () => {
  console.log(`Backend nasłuchuje na http://localhost:${PORT}`);
});
