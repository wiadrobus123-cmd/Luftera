// ===== UŻYTKOWNICY =====
const users = [
  { login: "admin", password: "1234" }
];

// ===== STAN =====
let activeCard = null;

// ===== START =====
renderBoard();
updateEditButton();

// ===== AUTH =====
function isEditor() {
  return localStorage.getItem("isEditor") === "true";
}

function updateEditButton() {
  const btn = document.getElementById("editBtn");
  btn.textContent = isEditor() ? "Wyloguj" : "Edytuj";
  btn.onclick = isEditor() ? logout : openLogin;
}

function openLogin() {
  document.getElementById("loginModal").classList.remove("hidden");
}

function loginUser() {
  const l = login.value;
  const p = password.value;

  const ok = users.find(u => u.login === l && u.password === p);
  if (!ok) {
    error.innerText = "Zły login lub hasło";
    return;
  }

  localStorage.setItem("isEditor", "true");
  document.getElementById("loginModal").classList.add("hidden");
  updateEditButton();
  renderBoard();
}

function logout() {
  localStorage.removeItem("isEditor");
  updateEditButton();
  renderBoard();
}

// ===== DANE =====
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
  const el = document.getElementById("columns");
  el.innerHTML = "";

  const data = getData();

  data.forEach((col, i) => {
    const div = document.createElement("div");
    div.className = "column";

    div.innerHTML = `
      <div class="columnHeader" style="background:${col.color}"></div>
      <h3>${col.name}</h3>

      ${col.cards.map((c, ci) => `
        <div class="card" onclick="openCard(${i}, ${ci})">
          ${c.title}
        </div>
      `).join("")}

      ${isEditor() ? `<button onclick="addCard(${i})">Dodaj zakładkę</button>` : ""}
    `;

    el.appendChild(div);
  });

  if (isEditor()) {
    const btn = document.createElement("button");
    btn.textContent = "Dodaj status";
    btn.onclick = addColumn;
    el.appendChild(btn);
  }
}

// ===== KOLUMNY =====
function addColumn() {
  const name = prompt("Nazwa statusu:");
  if (!name) return;

  const color = prompt("Kolor (HEX):", "#64748b");

  const data = getData();
  data.push({ name, color, cards: [] });
  saveData(data);
  renderBoard();
}

// ===== KARTY =====
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
  cardTitle.innerText = card.title;
  cardDesc.value = card.description || "";

  cardModal.classList.remove("hidden");
}

function saveCard() {
  if (!isEditor()) return;

  const data = getData();
  const card = data[activeCard.colIndex].cards[activeCard.cardIndex];
  card.description = cardDesc.value;

  saveData(data);
  closeCard();
}

function closeCard() {
  cardModal.classList.add("hidden");
  activeCard = null;
}
