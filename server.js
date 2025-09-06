import express from "express";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import crypto from "crypto";

const app = express();
app.use(express.json());

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Emeae3@!GYuQafd?><{",
  database: "Baz",
  port: 3306
});


// Konfiguracja maila (tu Gmail, ale może być inny SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "newssquidgame@gmail.com",
    pass: "rsgh wzip gcpd ixwa" // NIE hasło zwykłe! Hasło aplikacji z Gmaila
  }
});

// 1. Żądanie resetu – wysłanie kodu
app.post("/api/request-reset", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Podaj email" });

  const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  if (rows.length === 0) return res.status(400).json({ message: "Email nie istnieje" });

  const userId = rows[0].id;

  // Generujemy kod 6-cyfrowy
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minut

  await db.query("INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)", [userId, token, expires]);

  // Wysyłamy maila
  await transporter.sendMail({
    from: "Boblox <twojemail@gmail.com>",
    to: email,
    subject: "Reset hasła - Boblox",
    text: `Twój kod resetu hasła to: ${token}`
  });

  res.json({ message: "Kod został wysłany na email." });
});

// 2. Potwierdzanie kodu
app.post("/api/verify-reset", async (req, res) => {
  const { token } = req.body;
  const [rows] = await db.query("SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()", [token]);
  if (rows.length === 0) return res.status(400).json({ message: "Nieprawidłowy lub wygasły kod" });

  res.json({ message: "Kod poprawny!" });
});

// 3. Resetowanie hasła
app.post("/api/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  const [rows] = await db.query("SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()", [token]);
  if (rows.length === 0) return res.status(400).json({ message: "Nieprawidłowy lub wygasły kod" });

  const reset = rows[0];
  await db.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, reset.user_id]);
  await db.query("DELETE FROM password_resets WHERE user_id = ?", [reset.user_id]);

  res.json({ message: "Hasło zostało zmienione." });
});

app.listen(3000, () => console.log("Server działa na http://localhost:3000"));
