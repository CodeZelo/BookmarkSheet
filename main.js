const form = document.getElementById("bookmarkForm");
const loader = document.getElementById("loader");
const tableBody = document.querySelector("#dataTable tbody");

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbz6IqTI1PJ_kBCiV1ZZlO7N-bVp59gDakB50q38CnOjN5mmXwef8HhkR2QE2O0VOQOoig/exec";

/* ===== Helper ===== */
function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

/* ===== Load Table Data ===== */
let page = 1;
let search = "";
let sort = "date_desc";
let limit = 5;
let dateFrom = null;
let dateTo = null;

function loadTable() {
  showLoader();

  const params = new URLSearchParams({
    search,
    sort,
    page,
    limit,
  });

  if (dateFrom) params.append("dateFrom", dateFrom);
  if (dateTo) params.append("dateTo", dateTo);

  fetch(`${SHEET_URL}?${params.toString()}`)
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
          <td>
            <input data-id="${row.id}" type="checkbox" class="row-check" data-id="${row.id}">
          </td>
          <td data-id="${row.id}">${row.name}</td>
          <td>
            <span class="badge badge-${row.type}">
              ${row.type}
            </span>
          </td>
          <td>
            <a 
              href="${row.url}" 
              data-name="${row.name}"
              data-url="${row.url}"
              data-description="${row.description}"
              data-type="${row.type}"
              title="${row.description}"
              target="_blank"
            >
              Visit
            </a>
          </td>
          <td>${new Date(row.date).toLocaleString()}</td>
          <td>
            <button onclick="togglePin('${row.id}', ${row.pinned})">
              ${row.pinned ? "📌" : "📍"}
            </button>
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
    btn.disabled = i === page;

    btn.onclick = () => {
      page = i;
      loadTable();
    };

    container.appendChild(btn);
  }
}

let currentEditId = null;

function editRow(id) {
  const row = [...document.querySelectorAll("#dataTable tbody tr")].find(
    (tr) => tr.children[1].dataset.id === id,
  );

  currentEditId = id;

  const link = row.querySelector("a");

  form.name.value = link.dataset.name;
  form.url.value = link.dataset.url;
  form.description.value = link.dataset.description;
  form.type.value = link.dataset.type;

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

function togglePin(id, pinned) {
  showLoader();

  fetch(SHEET_URL, {
    method: "POST",
    body: new URLSearchParams({
      action: "pin",
      id,
      pinned: !pinned,
    }),
  })
    .then(loadTable)
    .finally(hideLoader);
}

/* ===== Bulk Delete ===== */
function bulkDelete() {
  const ids = getSelectedIds();
  if (!ids.length) return alert("No rows selected");

  if (!confirm("Delete selected items?")) return;

  showLoader();

  fetch(SHEET_URL, {
    method: "POST",
    body: new URLSearchParams({
      action: "bulk_delete",
      ids: JSON.stringify(ids),
    }),
  })
    .then(loadTable)
    .finally(hideLoader);
}

/* ===== Bulk Pinned ===== */
function bulkPin() {
  const ids = getSelectedIds();
  if (!ids.length) return alert("No rows selected");

  showLoader();

  fetch(SHEET_URL, {
    method: "POST",
    body: new URLSearchParams({
      action: "bulk_pin",
      ids: JSON.stringify(ids),
    }),
  })
    .then(loadTable)
    .finally(hideLoader);
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
    type: this.type.value,
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

// Storage
function saveSettings() {
  localStorage.setItem(
    "bookmark_settings",
    JSON.stringify({
      search,
      sort,
      page,
      limit,
      dateFrom,
      dateTo,
    }),
  );
}

function loadSettings() {
  const s = JSON.parse(localStorage.getItem("bookmark_settings") || "{}");

  search = s.search || "";
  sort = s.sort || "date_desc";
  page = s.page || 1;
  limit = s.limit || 5;
  dateFrom = s.dateFrom || null;
  dateTo = s.dateTo || null;

  limitSelect.value = limit;
  searchInput.value = search;
  sortSelect.value = sort;
  dateFromInput.value = dateFrom;
  dateToInput.value = dateTo;
}

/* ===== Sorting ===== */
const sortSelect = document.getElementById("sortSelect");

sortSelect.addEventListener("change", () => {
  sort = sortSelect.value;
  saveSettings();
  loadTable();
});

/* ===== Search Debounce ===== */
const searchInput = document.getElementById("searchInput");

let debounceTimer;
searchInput.addEventListener("input", function () {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    search = this.value;
    page = 1;
    saveSettings();
    loadTable();
  }, 400);
});

const limitSelect = document.getElementById("limitSelect");

limitSelect.addEventListener("change", () => {
  limit = parseInt(limitSelect.value);
  page = 1;
  saveSettings();
  loadTable();
});

const dateFromInput = document.getElementById("dateFrom");
const dateToInput = document.getElementById("dateTo");

/* ===== Filtering ===== */
function filterByDate() {
  dateFrom = dateFromInput.value;
  dateTo = dateToInput.value;

  page = 1;
  saveSettings();
  loadTable();
}

function clearFilterByDate() {
  dateFromInput.value = null;
  dateToInput.value = null;

  saveSettings();
  loadTable();
}

/* ===== IDS ===== */
function getSelectedIds() {
  return [...document.querySelectorAll(".row-check:checked")].map(
    (cb) => cb.dataset.id,
  );
}

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

/* ===== Initial Load ===== */
loadSettings();
loadTable();
