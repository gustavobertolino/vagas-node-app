const jwt = require('jsonwebtoken');
const database = require('../firebaseConfig');
const secretKey = require('../secretKey');

const validateToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send({
            auth: false,
            message: 'No token provided'
        });
    }

    if (token.split(' ')[0] != 'Bearer') {
        return res.status(401).send({
            auth: false,
            message: 'Invalid token'
        });
    }

    jwt.verify(token.split(' ')[1], secretKey, async (error, decoded) => {
        if (error) {
            return res.status(500).send({
                auth: false,
                message: 'Failed to decode'
            });
        }

        let data = await database.collection('users').get();
        data.docs.find(user => {
            if (user.id === decoded.id) {
                next();
            }
            return res.status(401).send({
                auth: false,
                message: 'Invalid token'
            });
        })
    })
}

module.exports = validateToken;