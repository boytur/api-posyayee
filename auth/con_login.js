const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../schema/user_schema");
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.con_login = async (req, res) => {
  const { username, password } = req.body;
  try {
    //หาว่ามี username นี้ไหม
    const user = await User.findOne({ username });

    //ถ้าไม่มี
    if (!user) {
      return res.status(401).json({ error: "ผู้ใช้ไม่พบ" });
    }

    //ถอดรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //ถ้ารหัสไม่ตรง
    if (!isPasswordValid) {
      return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    } 

    //ถ้าพาสตรงยูสตรง
    const token = jwt.sign({username},process.env.JWT_SECRET,{expiresIn:'1d'});
    return res.json({token,username})

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดบางอย่าง" });
  }
};