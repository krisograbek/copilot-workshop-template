// Stan licznika
let count = Number(localStorage.getItem("count") ?? "0");

// Funkcja przerysowania wyświetlacza
function render() {
  const counterElement = document.querySelector("#counter");
  counterElement.textContent = count;
}

// Funkcja zapisu do localStorage
function save() {
  localStorage.setItem("count", String(count));
}

// Wczytanie i wyświetlenie stanu przy starcie
document.addEventListener("DOMContentLoaded", () => {
  render();
});

// Obsługa przycisku +1
document.querySelector("#btn-increment").addEventListener("click", () => {
  count++;
  save();
  render();
});

// Obsługa przycisku −1
document.querySelector("#btn-decrement").addEventListener("click", () => {
  count--;
  save();
  render();
});

// Obsługa przycisku Reset
document.querySelector("#btn-reset").addEventListener("click", () => {
  count = 0;
  save();
  render();
});
