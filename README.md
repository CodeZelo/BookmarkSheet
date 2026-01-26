# 📌 BookmarkSheet

![Bookmark Management Web App](https://www.codezelo.com/en/categories/projects/build-bookmark-web-app-with-google-sheets/featured.en_hu_46adb0af58c515df.webp "Bookmark Management Web App")

A simple **Bookmark Management Web App** to save and manage YouTube channels, websites, or any online resources using **Google Sheets as a database**.

This project demonstrates how to build a complete CRUD web application without a traditional backend server.

---

## 🚀 Project Overview

BookmarkSheet is a lightweight web application that supports full **CRUD operations**:

- ➕ Create new bookmarks
- ✏️ Update existing bookmarks
- 🗑️ Delete bookmarks
- 📄 Read and display data in a table

The backend logic is handled using **Google Sheets + Google Apps Script**.

---

## ✨ Features

- 📋 Form to add bookmarks (Name, URL, Description)
- 📊 Data table to display saved bookmarks
- 🔍 Search by source name
- 📑 Pagination (shows last 5 records by default – configurable in JavaScript)
- 🌙 Dark Mode / Light Mode toggle
- ⏳ Loader during Create / Update / Delete actions
- 🧠 Clean and simple code, easy to customize and extend

---

## 🧱 Project Structure

```text
BookmarkSheet/
│
├── index.html      # Page structure
├── style.css       # Styling + Dark Mode
└── main.js         # App logic + CRUD + Google Sheet integration
```

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Google Sheets
- Google Apps Script (Web App)

---

## ⚙️ How to Run the Project

1. Create a new Google Sheet (e.g. `Bookmarks`)
2. Add the following columns in the first row:

   ```text
   ID | Name | URL | Description | Date
   ```

3. Go to:
   **Extensions → Apps Script**
4. Add the required `doGet` and `doPost` functions for CRUD operations
5. Deploy the script as a **Web App**
   - Access: Anyone

6. Copy the generated Web App URL
7. Paste the URL inside `main.js`
8. Open `index.html` in your browser

---

## 📚 Tutorials & Resources

- 🎥 A full YouTube video explaining the project step by step
- 🔗 [Article](https://www.codezelo.com/en/categories/projects/build-bookmark-web-app-with-google-sheets/) covering:
  - Saving HTML form data to Google Sheets
  - Fetching data using GET requests
  - Updating and deleting data using POST requests

---

## 🧩 Customization

You can easily:

- Change the number of displayed records
- Reuse the project for different data types
- Extend it with authentication
- Modify the UI or logic to fit your own idea

💬 If you need a custom version or a similar application, feel free to contact me.

---

## ❤️ Support the Project

If you like this project:

- ⭐ Star the repository on GitHub
- 👍 Like & share the video [Part 1](https://youtu.be/ba3z9k2QBkc)
- 👍 Like & share the video [Part 2](https://youtu.be/dc4Hnv2_OV4)
- 🔔 Subscribe to the [channel](https://www.youtube.com/@CodeZelo)

Have feedback or a project idea? Leave a comment!

---

**Made with ❤️ by Mahmoud Adel**
