# Contributing to OnlineGames

First of all: **thank you for considering contributing! 🎉**

Any kind of help is welcome — bug reports, feature ideas, documentation improvements, or code contributions.

This project is intended to be **beginner-friendly**, so don’t worry if you’re not an expert. Contributions of all sizes are appreciated.

---

# 📌 Ways to Contribute

You can contribute in several ways:

- 🐞 **Reporting bugs**
- 💡 **Suggesting new features**
- 🧹 **Refactoring or improving code**
- 📝 **Improving documentation**
- 🎮 **Adding new games or quiz features**
- 🧪 **Testing and reporting issues**

---

# 🐞 Reporting Bugs

If you find a bug, please open an **Issue** and include:

- A clear description of the problem
- Steps to reproduce the issue
- Expected behavior
- Screenshots or error messages (if applicable)
- Browser / OS information if relevant

---

# 💡 Feature Requests

Feature ideas are welcome!

Please open an **Issue** and describe:

- What problem the feature solves
- Why it would be useful
- Any ideas for implementation (optional)

---

# 🛠 Development Setup

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v18+ recommended)
- **npm**
- **XAMPP** or **Laragon** (for running the API and database locally)

---

# 📥 Clone the Repository

```bash
git clone https://github.com/GrofDzsepetto/OnlineGames.git
cd OnlineGames
npm install


## ⚙ Backend Setup (API + Database)

The project uses a **local PHP API and MySQL database**, which must run locally for development.

You can use either:

- **Laragon** (recommended)
- **XAMPP**

Make sure **Apache** and **MySQL** are running.

---

## 📂 API Location

The `api` folder from this repository must be placed inside your local web server directory.

Example locations:

C:\laragon\www\ (api folder)


---

# 🔐 Environment Variables

You must create a `.env` file **inside the `api` folder**.

Example:

APP_ENV=local
ALLOWED_ORIGINS=http://localhost:5173

SESSION_DOMAIN=localhost
DB_HOST=127.0.0.1
DB_NAME=dzsepetto_local_quiz
DB_USER=root
DB_PASS=


### Important

`DB_NAME` should match the name of the database you create locally.

You can keep the default or use a different name if you prefer — just update the `.env` accordingly.

---

# 🗄 Database Setup

A database dump is included in the repository: "dzsepetto_local_quiz.sql"

Import this file into your local MySQL server.

Example using **phpMyAdmin**:

1. Create a new database (for example `dzsepetto_local_quiz`)
2. Click **Import**
3. Select the file: "dzsepetto_local_quiz.sql"
4. Run the import

Make sure the database name matches the `DB_NAME` value in your `.env` file.

---

# ▶ Running the Frontend

After the API and database are running:

```bash
npm run dev
