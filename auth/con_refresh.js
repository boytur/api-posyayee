const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { User } = require("../schema/user_schema");
const decodeUserId = require('../utils/decodeUserId');

app.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        //console.log(refreshToken);

        if (!refreshToken) {
            return res.status(403).json({
                success: false,
                msg: 'Refresh token not available for this application.'
            });
        }

        try {

            const secret = process.env.JWT_SECRET;
            const verify = jwt.verify(refreshToken, secret);

            if (verify !== null) {

                const decodeUser = decodeUserId(req);
                const username = decodeUser?.userData?.username;
                const user = await User.findOne({ username });

                if (!user) {
                    return res.status(401).json({ error: "ไม่พบผู้ใช้นี้ค่ะ" });
                }

                const userData = {
                    userId: user?._id,
                    username: user?.username,
                    email: user?.email,
                }

                const accessToken = jwt.sign({ userData }, process.env.JWT_SECRET, { expiresIn: '1d' });

                res.cookie('access_token', accessToken, {
                    maxAge: 1 * 24 * 60 * 60 * 1000,
                    secure: true,
                    httpOnly: true,
                    sameSite: 'None',
                    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
                });

                res.status(200).send({
                    success: true,
                    msg: "refresh token successfully",
                    user: userData
                });

            } else {
                res.status(401).send({
                    success: false,
                    msg: "Access denied!"
                });
            }
        }
        catch (err) {
            console.error(err);
            res.status(401).send({
                success: false,
                msg: "Invalid token!"
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = app;