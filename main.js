const form = document.getElementById("bookmarkForm");
const loader = document.getElementById("loader");
const tableBody = document.querySelector("#dataTable tbody");

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxFxlHq4E-ogeEBTSkW42X5nfV-iuSSA4YyrdmJZ_jUs7rpeSNxLwO7vavsxGNE4Q11vA/exec";

/* ===== Helper ===== */
function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

/* ===== Load Table Data ===== */
let currentPage = 1;
let currentSearch = "";
const limit = 5;

function loadTable() {
  showLoader();

  const url = `${SHEET_URL}?search=${encodeURIComponent(
    currentSearch
  )}&page=${currentPage}&limit=${limit}`;

  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      renderTable(res.data);
      renderPagination(res.totalPages);
    })
    .catch(() => {
      alert("Failed to load table ❌");
    })
    .finally(() => {
      hideLoader();
    });
}

/* ===== Table Data ===== */
function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td data-id="${row.id}">${row.name}</td>
          <td>
            <a 
              href="${row.url}" 
              data-url="${row.url}"
              data-description="${row.description}"
              title="${row.description}"
              target="_blank"
            >
              Visit
            </a>
          </td>
          <td>${new Date(row.date).toLocaleString()}</td>
          <td>
            <button onclick="editRow('${row.id}')">✏️</button>
            <button onclick="deleteRow('${row.id}')">🗑️</button>
          </td>
        `;

    tableBody.appendChild(tr);
  });
}

/* ===== Pagination UI ===== */
function renderPagination(totalPages) {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    btn.style.margin = "0 5px";
    btn.disabled = i === currentPage;

    btn.onclick = () => {
      currentPage = i;
      loadTable();
    };

    container.appendChild(btn);
  }
}

let currentEditId = null;

function editRow(id) {
  const row = [...document.querySelectorAll("#dataTable tbody tr")].find(
    (tr) => tr.children[0].dataset.id === id
  );

  currentEditId = id;

  const link = row.querySelector("a");

  form.name.value = row.children[0].innerText;
  form.url.value = link.dataset.url;
  form.description.value = link.dataset.description;

  form.querySelector("button").innerText = "Update Bookmark";
}

function deleteRow(id) {
  if (!confirm("Are you sure?")) return;

  showLoader();

  fetch(SHEET_URL, {
    method: "POST",
    body: new URLSearchParams({
      action: "delete",
      id,
    }),
  }).then(loadTable);
}

/* ===== Submit Form ===== */
form.addEventListener("submit", function (e) {
  e.preventDefault();
  showLoader();

  const action = currentEditId ? "update" : "create";

  const formData = new URLSearchParams({
    action,
    id: currentEditId || "",
    name: this.name.value,
    url: this.url.value,
    description: this.description.value,
  });

  fetch(SHEET_URL, {
    method: "POST",
    body: formData,
  })
    .then(() => {
      alert("Sent successfully ✅");
      form.reset();
      currentEditId = null;
      form.querySelector("button").innerText = "Add Bookmark";
      loadTable(); // reload table after submit
    })
    .catch(() => {
      alert("Error ❌");
    });
});

/* ===== Search Debounce ===== */
const searchInput = document.getElementById("searchInput");

let debounceTimer;
searchInput.addEventListener("input", function () {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    currentSearch = this.value;
    currentPage = 1;
    loadTable();
  }, 400);
});

/* ===== Initial Load ===== */
loadTable();

const themeToggle = document.getElementById("themeToggle");

// load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.innerText = "☀️ Light";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeToggle.innerText = isDark ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
