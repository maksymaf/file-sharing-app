const jwt = require('jsonwebtoken');

const roleCheck = (roles) => {

    return function(req, res, next){
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
            const {roles: userRoles} = jwt.verify(token, process.env.JWT_SECRET);

            let hasRole = false;

            userRoles.forEach(item => {
                if (roles.includes(item)){
                    hasRole = true;
                }
            });

            if (hasRole){
                return next();
            }

            return res.status(403).json({
                success: false,
                input: null,
                error: {
                    message: "acess denied",
                    code: "ACESS_DENIED"
                },
                result: null,
            });
           
        }catch(err){
            return res.status(403).json({
                success: false,
                input: null,
                error: {
                    message: "acess denied",
                    code: "ACESS_DENIED"
                },
                result: null,
            });
        }   
    }

}

module.exports = roleCheck;