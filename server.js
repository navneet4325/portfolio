const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// 👉 static files (important)
app.use(express.static(path.join(__dirname)));

// 👉 homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// EMAIL API
app.post("/quote", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: "New Contact Message",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    res.json({ message: "Email sent successfully ✅" });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Error sending email ❌" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});