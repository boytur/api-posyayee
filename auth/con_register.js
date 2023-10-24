const { User, validate } = require('../schema/user_schema');
const bcrypt = require('bcrypt');

exports.con_register = async (req, res) => {
    try {
        // ตรวจสอบความถูกต้องของข้อมูลที่ผู้ใช้ป้อน
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // ตรวจสอบว่าอีเมลถูกลงทะเบียนแล้วหรือไม่
        let existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'ชื่อนี้ถูกลงทะเบียนแล้ว' });
        }

        // เข้ารหัสรหัสผ่านก่อนบันทึกในฐานข้อมูล
        const saltRounds = 10; // จำนวนรอบในการเข้ารหัส (ความปลอดภัย)
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            if (err) {
                console.error('เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน', err);
                return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน' });
            }

            // สร้างเอกสารผู้ใช้ใหม่
            const user = new User({
                username: req.body.username,
                password: hash, // ใช้รหัสผ่านที่เข้ารหัสแล้ว
                email: req.body.email
            });

            // บันทึกผู้ใช้ในฐานข้อมูล
            await user.save();

            // สร้างโทเค็นการพิสูจน์ตัวตน
            const token = user.generateAuthToken();

            // ตอบกลับด้วยข้อมูลผู้ใช้และโทเคน
            res.status(200).json({
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                },
                token: token
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดบางอย่าง' });
    }
};
