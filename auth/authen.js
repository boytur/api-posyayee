const jwt = require('jsonwebtoken');

module.exports = {
    isLogin: (req, res, next) => {
     
        // get store id from token in cookie
        const tokenCookies = req.cookies.AccessToken;
        const secret = process.env.JWT_SECRET;
    
        try {
            const verify = jwt.verify(tokenCookies, secret);

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