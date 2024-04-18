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
      return res.status(401).json({
        "success": false,
        "msg": "ไม่พบผู้ใช้นี้ค่ะ"
      });
    }

    const userData = {
      userId: user._id,
      username: user.username,
      email: user.email,
    }

    //ถอดรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //ถ้ารหัสไม่ตรง
    if (!isPasswordValid) {
      return res.status(401).json({
        "success": false,
        "msg": "รหัสผ่านไม่ถูกต้อง"
      });
    }

    //ถ้าพาสตรงยูสตรง
    const refreshToken = jwt.sign({ userData }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const accessToken = jwt.sign({ userData }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    res.cookie('refresh_token', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
      sameSite: 'None',
      expires: expirationDate
    });

    res.cookie('access_token', accessToken, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
      sameSite: 'None',
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // หมดอายุใน 1 วัน
    });

    return res.json({
      "success": true,
      "msg": "ล็อกอินสำเร็จค่ะ",
      user: userData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดบางอย่าง" });
  }
};