import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import TokenBlacklist from "../models/blacklist.model.js";


/**
 * Authenticates and protects Cortexio routes.
 *
 * Workflow:
 * 1. Extract JWT token from HTTP-only cookies
 * 2. Verify token revocation status using blacklist
 * 3. Validate JWT signature and expiration
 * 4. Fetch authenticated user from database
 * 5. Attach user context to request lifecycle
 *
 * @middleware
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 *
 * @returns {Promise<void>}
 */
const authUser = async (req, res, next) => {

    try {

        const token = req.cookies.token;


        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }


        const isBlacklisted = await TokenBlacklist.findOne({
            token
        });


        if (isBlacklisted) {

            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again"
            });

        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        const user = await User.findById(
            decoded.id
        );


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });

        }


        req.user = user;


        next();


    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });

    }

};


export default {
    authUser
};