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
      return res.status(401).json({ error: "ไม่พบผู้ใช้นี้ค่ะ" });
    }

    //ถอดรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //ถ้ารหัสไม่ตรง
    if (!isPasswordValid) {
      return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    }

    //ถ้าพาสตรงยูสตรง
    const userId = user?.id;
    const accessToken = jwt.sign({ username, userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const refreshToken = jwt.sign({ username, userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Calculate the expiration date for 30 days from now
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    //Send cookies
    res.cookie('AccessToken', accessToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
      secure: true,
      httpOnly: true,
      sameSite: 'None',
      expires: expirationDate
    });

    res.status(200).send({
      success: true,
      message: "ล็อกอินสำเร็จค่ะ!",
      refresh: refreshToken
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดบางอย่าง" });
  }
};