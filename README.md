# 🛍️ Myntra Clone (Educational Project)

This is a **frontend clone** of the [Myntra](https://www.myntra.com) e-commerce platform, built purely for **educational and learning purposes**. It replicates the UI/UX structure of the original website to practice frontend development skills using **HTML, CSS, and JavaScript**.

> ⚠️ **Disclaimer**: This project is not affiliated with, endorsed by, or sponsored by Myntra or its parent company. All trademarks and copyrights belong to their respective owners.

---

## 📚 Objective

- Practice responsive web design
- Learn UI layout techniques used in large-scale e-commerce sites
- Understand how to build reusable components (navbar, cards, footer, etc.)

---

## 🔧 Tech Stack

- HTML5
- CSS3
- JavaScript 

---

## 📌 Features Implemented

- 🧭 Homepage layout with header, banner, categories
- 🛒 Product cards with hover effects
- 🔎 Search bar UI (non-functional)
- 📱 Fully responsive design for mobile and desktop

---

## 🚫 No Backend Functionality

This project does **not** include real APIs, user login, payment integration, or actual product listings. It is intended as a **static frontend mockup only**.

---

## ✅ Continuous Testing with GitHub Actions

This project uses **GitHub Actions instead of Jenkins**. The workflow is stored
in `.github/workflows/continuous-testing.yml` and runs automatically when code
is pushed to `main` or when a pull request targets `main`.

The workflow:

1. Checks out the latest project files.
2. Sets up Node.js, an open-source runtime.
3. Runs `scripts/validate-site.mjs`.
4. Fails the check if an HTML page has invalid basic structure, references a
   missing local file, or contains JavaScript syntax errors.

In simple terms, every code change gets an automatic check before it is merged.
GitHub shows a green check when validation passes and a red check when a
problem needs to be fixed. This provides a simple continuous testing pipeline
without maintaining a separate Jenkins server.

To run the same validation locally (with Node.js installed):

```bash
node scripts/validate-site.mjs
node --test server/server.test.mjs
```

---

## 🔐 Dummy Backend and Security Testing

The project also includes a small local backend in `server/server.mjs`. It is
for demonstration and security-testing practice only; it does not use a
database and does not store accounts permanently.

Start it with:

```bash
node server/server.mjs
```

Then open `http://localhost:3000/myntralogin.html` and use:

```text
Email: demo@example.com
Password: DemoPass1
```

If port 3000 is already being used by another server, stop that process or use
another port:

```powershell
$env:PORT=3001
node server/server.mjs
```

Then open `http://localhost:3001/myntralogin.html`. The server reports this
specific situation clearly instead of showing an unhandled Node.js error.

The backend exposes `POST /api/login`, hashes the demo password with Node's
`scrypt`, compares passwords using a timing-safe comparison, returns a generic
error for invalid credentials, limits request body size, and sends basic
security headers. The automated backend tests cover successful login, failed
login, and malformed JSON.

This is not production authentication: users are stored only in memory, there
are no sessions or account registration, and the demo password is intentionally
public. A security report should clearly identify these limitations rather than
claiming that this is a real secure login system.

For a safe local penetration-testing exercise, try invalid credentials,
malformed JSON, an oversized request body, and a path such as
`/../README.md`. Confirm that the server returns controlled errors and does not
reveal passwords or internal details. Only test this local application or
systems for which you have explicit permission.

---

## 🎓 Citation / Inspiration

This UI was inspired by the official [Myntra website](https://www.myntra.com). It is used here **strictly for educational purposes** to practice modern frontend techniques.
