const form = document.getElementById("bookmarkForm");
const loader = document.getElementById("loader");
const tableBody = document.querySelector("#dataTable tbody");

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyDGorCqcSbPTLwYTCjyxSVAjHivslpG5p8AtMqDxIKXtot6S6Ci4lbWjgJn5WzyFq4/exec";

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
      let i = 1;
      data.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${i++}</td>
          <td>${row.name}</td>
          <td>${row.email}</td>
          <td>${row.message}</td>
          <td>${new Date(row.date).toLocaleString()}</td>
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

/* ===== Submit Form ===== */
form?.addEventListener("submit", function (e) {
  e.preventDefault();
  showLoader();

  const formData = JSON.stringify({
    name: this.name.value,
    email: this.email.value,
    message: this.message.value,
  });

  fetch(SHEET_URL, {
    method: "POST",
    body: formData,
  })
    .then(() => {
      alert("Sent successfully ✅");
      form.reset();
      loadTable(); // reload table after submit
    })
    .catch(() => {
      alert("Error ❌");
      hideLoader();
    });
});

/* ===== Initial Load ===== */
loadTable();
