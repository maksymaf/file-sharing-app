require('dotenv').config();
const jwt = require('jsonwebtoken');
const generateAcessToken = (id, roles) => {
    const payload = {
        id,
        roles
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "72h"})
}

module.exports = generateAcessToken;