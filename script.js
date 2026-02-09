// 🔑 UŻYTKOWNICY
const users = [
  { login: "admin", password: "1234" },
  { login: "luftera", password: "shop123" }
];

// AUTO LOGIN
if (localStorage.getItem("loggedUser")) {
  showBoard();
}

// LOGOWANIE
function login() {
  const login = document.getElementById("login").value;
  const password = document.getElementById("password").value;

  const user = users.find(
    u => u.login === login && u.password === password
  );

  if (!user) {
    document.getElementById("error").innerText = "❌ Zły login lub hasło";
    return;
  }

  localStorage.setItem("loggedUser", login);
  showBoard();
}

// WYLOGOWANIE
function logout() {
  localStorage.removeItem("loggedUser");
  location.reload();
}

// POKAZ BOARD
function showBoard() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("board").classList.remove("hidden");
  loadColumns();
}

// ====== BOARD ======

function getData() {
  return JSON.parse(localStorage.getItem("board")) || [];
}

function saveData(data) {
  localStorage.setItem("board", JSON.stringify(data));
}

function addColumn() {
  const name = prompt("Nazwa statusu:");
  if (!name) return;

  const data = getData();
  data.push({ name, cards: [] });
  saveData(data);
  loadColumns();
}

function addCard(i) {
  const text = prompt("Nazwa zakładki:");
  if (!text) return;

  const data = getData();
  data[i].cards.push(text);
  saveData(data);
  loadColumns();
}

function loadColumns() {
  const el = document.getElementById("columns");
  el.innerHTML = "";

  getData().forEach((col, i) => {
    const div = document.createElement("div");
    div.className = "column";

    div.innerHTML = `
      <h3>${col.name}</h3>
      ${col.cards.map(c => `<div class="card">${c}</div>`).join("")}
      <button onclick="addCard(${i})">➕ Zakładka</button>
    `;

    el.appendChild(div);
  });
}
