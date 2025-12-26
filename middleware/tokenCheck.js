const jwt = require('jsonwebtoken');

const tokenCheck = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }
    
    try{
        const token = req.headers.authorization.split(' ')[1];

        if (!token){
            return res.status(403).json({
                success: false,
                input: null,
                error: {
                    message: "user is unauthorized",
                    code: "USER_UNAUTHORIZED"
                },
                result: null,
            });
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedData;
        next();
    }catch(err){
        return res.status(403).json({
            success: false,
            input: null,
            error: {
                message: "user is unauthorized",
                code: "USER_UNAUTHORIZED"
            },
            result: null,
        });
    }
}

module.exports = tokenCheck;