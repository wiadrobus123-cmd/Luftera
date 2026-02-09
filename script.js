// ===== ELEMENTY =====
const columnsEl = document.getElementById("columns");
const editBtn = document.getElementById("editBtn");

const loginModal = document.getElementById("loginModal");
const cardModal = document.getElementById("cardModal");

const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");
const errorEl = document.getElementById("error");

const cardTitleEl = document.getElementById("cardTitle");
const cardDescEl = document.getElementById("cardDesc");

// ===== USERS =====
const users = [
  { login: "admin", password: "1234" }
];

// ===== STATE =====
let activeCard = null;

// ===== INIT =====
renderBoard();
updateEditButton();

// ===== AUTH =====
function isEditor() {
  return localStorage.getItem("isEditor") === "true";
}

function updateEditButton() {
  editBtn.textContent = isEditor() ? "Wyloguj" : "Edytuj";
  editBtn.onclick = isEditor() ? logout : openLogin;
}

function openLogin() {
  errorEl.textContent = "";
  loginModal.classList.remove("hidden");
}

function loginUser() {
  const l = loginInput.value.trim();
  const p = passwordInput.value.trim();

  const ok = users.find(u => u.login === l && u.password === p);
  if (!ok) {
    errorEl.textContent = "Zły login lub hasło";
    return;
  }

  localStorage.setItem("isEditor", "true");
  loginModal.classList.add("hidden");
  updateEditButton();
  renderBoard();
}

function logout() {
  localStorage.removeItem("isEditor");
  updateEditButton();
  renderBoard();
}

// ===== DATA =====
function getData() {
  return JSON.parse(localStorage.getItem("board")) || [
    {
      name: "Do kupienia",
      color: "#38bdf8",
      cards: [
        { title: "Produkt A", description: "Sprawdzić ceny" }
      ]
    }
  ];
}

function saveData(data) {
  localStorage.setItem("board", JSON.stringify(data));
}

// ===== BOARD =====
function renderBoard() {
  columnsEl.innerHTML = "";
  const data = getData();

  data.forEach((col, colIndex) => {
    const column = document.createElement("div");
    column.className = "column";

    column.innerHTML = `
      <div class="columnHeader" style="background:${col.color}"></div>
      <h3>${col.name}</h3>
    `;

    col.cards.forEach((card, cardIndex) => {
      const c = document.createElement("div");
      c.className = "card";
      c.textContent = card.title;
      c.onclick = () => openCard(colIndex, cardIndex);
      column.appendChild(c);
    });

    if (isEditor()) {
      const btn = document.createElement("button");
      btn.textContent = "Dodaj zakładkę";
      btn.onclick = () => addCard(colIndex);
      column.appendChild(btn);
    }

    columnsEl.appendChild(column);
  });

  if (isEditor()) {
    const addCol = document.createElement("button");
    addCol.textContent = "Dodaj status";
    addCol.onclick = addColumn;
    columnsEl.appendChild(addCol);
  }
}

// ===== COLUMNS =====
function addColumn() {
  const name = prompt("Nazwa statusu:");
  if (!name) return;

  const color = prompt("Kolor (HEX):", "#64748b");

  const data = getData();
  data.push({ name, color, cards: [] });
  saveData(data);
  renderBoard();
}

// ===== CARDS =====
function addCard(colIndex) {
  const title = prompt("Nazwa zakładki:");
  if (!title) return;

  const data = getData();
  data[colIndex].cards.push({ title, description: "" });
  saveData(data);
  renderBoard();
}

function openCard(colIndex, cardIndex) {
  activeCard = { colIndex, cardIndex };

  const card = getData()[colIndex].cards[cardIndex];
  cardTitleEl.textContent = card.title;
  cardDescEl.value = card.description || "";

  // PODGLĄD: textarea readonly
  cardDescEl.readOnly = !isEditor();

  cardModal.classList.remove("hidden");
}

function saveCard() {
  if (!isEditor() || !activeCard) return;

  const data = getData();
  data[activeCard.colIndex].cards[activeCard.cardIndex].description =
    cardDescEl.value;

  saveData(data);
  closeCard();
}

function closeCard() {
  cardModal.classList.add("hidden");
  activeCard = null;
}
