// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const studentsRouter = require("./routes/students");

const app = express();

// === 1. 連線 MongoDB Atlas ===
// 請把 <db_password> 換成你 Atlas 使用者的實際密碼
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection fails!"));
db.once("open", () => {
  console.log("Connected to database...");
});

// === 2. Middleware ===
app.use(express.json()); // 接收 JSON body
// 如果你也會用 form-data / x-www-form-urlencoded，可以加這行
// app.use(express.urlencoded({ extended: true }));

// 提供 public 資料夾當作靜態檔案 (index.html 就放在 public 裡)
app.use(express.static(path.join(__dirname, "public")));

// === 3. 掛載 /students 路由 ===
app.use("/students", studentsRouter);

// === 4. 啟動伺服器 ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
