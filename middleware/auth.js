const jwt = require('jsonwebtoken');
const config = require('config');

async function auth (req, res, next) {

    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try {
        const decoded = await jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(ex) {
        res.status(401).send('Invalid token')
    }
}

module.exports = auth;