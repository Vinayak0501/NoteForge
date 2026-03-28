const jwt = require('jsonwebtoken');

function tokenVerificationMiddleware(req, res, next){

    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({
            message: 'No token, access denied'
        });
    }

    try{

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.userId;
        next();
    }

    catch(error){
        res.status(401).json({
            message: 'Invalid token'
        })
    }
}

module.exports = tokenVerificationMiddleware;