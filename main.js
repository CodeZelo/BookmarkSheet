const form = document.getElementById("bookmarkForm");
const loader = document.getElementById("loader");
const tableBody = document.querySelector("#dataTable tbody");

const SHEET_URL = "";

/* ===== Helper ===== */
function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

/* ===== Load Table Data ===== */
function loadTable() {
  showLoader();

  fetch(SHEET_URL)
    .then((res) => res.json())
    .then((data) => {
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
    })
    .catch(() => {
      alert("Failed to load table ❌");
    })
    .finally(() => {
      hideLoader();
    });
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

/* ===== Initial Load ===== */
loadTable();
