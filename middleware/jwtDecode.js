const jwt = require('jsonwebtoken');

const jwtDecode = (req) => {
    // get store id from token in cookie
    const tokenCookies = req.cookies.AccessToken;
    
    if (!tokenCookies) {
        return false;
    }
    const decoded = jwt.decode(tokenCookies);
    return decoded;
}

module.exports = jwtDecode;