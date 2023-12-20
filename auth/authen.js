module.exports = {
    isLogin: (req, res, next) => {
        const jwt = require('jsonwebtoken');
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).send({
                success: false,
                msg: "Access denied! Authorization header missing or invalid format."
            });
        }

        const token = authorizationHeader.replace('Bearer ', '');
        const secret = process.env.JWT_SECRET;

        try {
            const verify = jwt.verify(token, secret);

            if (verify !== null) {
                next();
            } else {
                res.status(401).send({
                    success: false,
                    msg: "Access denied!"
                });
            }
        } catch (error) {
            res.status(401).send({
                success: false,
                msg: "Invalid token!"
            });
        }
    }
}