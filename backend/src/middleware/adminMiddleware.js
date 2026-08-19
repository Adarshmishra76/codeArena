
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const adminMiddleware = async (req, res, next) => {
    try {
        // Try to get token from cookie first, then from Authorization header
        let token = req.cookies?.token;
        
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' prefix
            }
        }
        
        if (!token) {
            return res.status(401).send("Error: Token is not present");
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id, role } = payload;

        if (!_id) {
            return res.status(401).send("Error: Invalid token");
        }

        if (role !== 'admin') {
            return res.status(403).send("Error: Admin access required");
        }

        const result = await User.findById(_id);
        if (!result) {
            return res.status(401).send("Error: User doesn't exist");
        }

        // Check if token is in Redis blocklist
        const IsBlocked = await redisClient.exists(`token:${token}`);
        if (IsBlocked) {
            return res.status(401).send("Error: Token is blocked");
        }

        req.result = result;
        next();
    } catch (err) {
        console.error('Admin Middleware Error:', err);
        res.status(401).send("Error: " + err.message);
    }
}

module.exports = adminMiddleware;