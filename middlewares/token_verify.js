if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS') return next()

    try {
        const token = req.headers.authorization.split(' ')[1]

        console.log(`v - ` + token)

        if(!token) res.json({ error: true, message: 'No Authorization' })

        const verified = jwt.verify(token, process.env.jwtSecret);

        req.data = verified;

        next()
    }
    catch(err) {
        console.log(err)

        res.json({ error: true, message: 'JWT expired or Invalid Authorization' })
    }
}