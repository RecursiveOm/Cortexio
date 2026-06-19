import bcrypt from "bcryptjs";
import User from "../models/user.model.js";


/**
 * Registers a new Cortexio user.
 *
 * Workflow:
 * 1. Validate incoming user details
 * 2. Check existing username/email
 * 3. Securely hash password
 * 4. Persist user data
 *
 * @route POST /api/auth/register
 * @access Public
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * 
 * @returns {Promise<void>}
 */
const registerUser = async (req, res) => {

    try {

        const { username, email, password } = req.body;


        if (!username || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }


        const existingUser = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "User already exists"
            });

        }


        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });


        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });

    }

};


export {
    registerUser
};