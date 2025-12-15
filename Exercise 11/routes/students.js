// routes/students.js
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// === Schema & Model 定義 ===
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // 必填
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  grade: {
    type: String,
    required: true,
    trim: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

// =============================
//  GET /students
//  取得全部學生資料
// =============================
router.get("/", async (req, res) => {
  try {
    const students = await Student.find(); // 找出所有學生
    res.json(students); // 回傳 JSON
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =============================
//  POST /students
//  新增一位學生
// =============================
router.post("/", async (req, res) => {
  try {
    const { name, age, grade } = req.body;

    // 簡單驗證（可加可不加，讓錯誤更清楚）
    if (!name || age === undefined || !grade) {
      return res.status(400).json({ message: "name, age, grade 為必填欄位" });
    }

    const student = new Student({
      name,
      age,
      grade,
    });

    const newStudent = await student.save();
    res.status(201).json(newStudent); // 201 代表建立成功
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =============================
//  (加分) GET /students/:id
//  取得特定學生
// =============================
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =============================
//  (加分) PUT /students/:id
//  更新特定學生資料
// =============================
router.put("/:id", async (req, res) => {
  try {
    const { name, age, grade } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, age, grade },
      { new: true, runValidators: true } // new: 回傳更新後資料
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: "Update student failed!", detail: err.message });
  }
});

// =============================
//  (加分) DELETE /students/:id
//  刪除特定學生
// =============================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Delete student successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Remove student failed!", detail: err.message });
  }
});

module.exports = router;
