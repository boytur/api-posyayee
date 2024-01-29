const express = require('express');
const authen = require('./authen');
const app = express();
const { USer, User } = require("../schema/user_schema");
const jwtDecode = require('../middleware/jwtDecode');
const jwt = require('jsonwebtoken');

app.get('/refresh', authen.isLogin, async (req, res) => {
    try {

        const decode = jwtDecode(req);
        const user = await User.findById(decode.userId);

        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User not found!"
            });
        }

        const username = user.username;
        const userId = user.id;

        const refreshToken = jwt.sign({ username, userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).send({
            success: true,
            refreshToken: refreshToken,
        });
    }
    catch (err) {
        console.error(err);
    }
});

module.exports = app;