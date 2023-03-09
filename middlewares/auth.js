const jwt = require('jsonwebtoken');

module.exports = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let decodedToken;
        try {
            decodedToken = jwt.verify(authHeader, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            return res.status(200).json({
                message: "Invalid Token",
                statusCode: 401,
            });
        }
        if (!decodedToken || !decodedToken.id) {
            console.log(decodedToken)
            return res.status(200).json({
                message: "Unauthorized",
                statusCode: 401,
            });
        }
        req.user_id = decodedToken.id;
        next();
    } catch (error) {
        next(error);
    }
}