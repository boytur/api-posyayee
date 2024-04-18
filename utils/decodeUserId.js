const jwt = require('jsonwebtoken');
decodeUserId = (req) => {

    if (!req) { return; }

    //console.log(req)
    // get user store data from token in cookie
    const userTokenCookies = req.cookies.refresh_token
    if (!userTokenCookies) {
        return false;
    }
    const decoded = jwt.decode(userTokenCookies);
    const userData = decoded;
    return userData;
}

module.exports = decodeUserId;