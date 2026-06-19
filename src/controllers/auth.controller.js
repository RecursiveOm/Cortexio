import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import BlacklistToken from "../models/blacklist.model.js";


/**
 * Registers a new Cortexio user.
 *
 * Workflow:
 * 1. Validate user input
 * 2. Check existing account
 * 3. Hash password
 * 4. Create user
 * 5. Generate authentication token
 *
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (req,res)=>{

    try{

        const {username,email,password}=req.body;


        if(!username || !email || !password){

            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });

        }


        const existingUser = await User.findOne({
            $or:[
                {username},
                {email}
            ]
        });


        if(existingUser){

            return res.status(409).json({
                success:false,
                message:"User already exists"
            });

        }


        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        const user = await User.create({
            username,
            email,
            password:hashedPassword
        });


        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        );


        res.cookie(
            "token",
            token,
            {
                httpOnly:true,
                secure:false
            }
        );


        return res.status(201).json({
            success:true,
            message:"User registered successfully",
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        });


    }catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

};


/**
 * Authenticates an existing Cortexio user.
 *
 * Workflow:
 * 1. Verify email credentials
 * 2. Compare encrypted passwords
 * 3. Generate JWT session token
 *
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = async(req,res)=>{

    try{

        const {email,password}=req.body;


        if(!email || !password){

            return res.status(400).json({
                success:false,
                message:"Email and password required"
            });

        }


        const user = await User
            .findOne({email})
            .select("+password");


        if(!user){

            return res.status(404).json({
                success:false,
                message:"User not found"
            });

        }


        const isPasswordValid =
        await bcrypt.compare(
            password,
            user.password
        );


        if(!isPasswordValid){

            return res.status(401).json({
                success:false,
                message:"Invalid credentials"
            });

        }

        

        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        );


        res.cookie(
            "token",
            token,
            {
                httpOnly:true,
                secure:false
            }
        );


        return res.status(200).json({
            success:true,
            message:"Login successful",
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        });


    }catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

/**
 * Logs out authenticated Cortexio users.
 *
 * Workflow:
 * 1. Extract JWT from cookies
 * 2. Store token in blacklist
 * 3. Clear authentication cookie
 *
 * @route GET /api/auth/logout
 * @access Private
 */
const logoutUser = async(req,res)=>{

    try{

        const token = req.cookies.token;


        if(!token){

            return res.status(400).json({
                success:false,
                message:"No token provided"
            });

        }


        await BlacklistToken.create({
            token
        });


        res.clearCookie("token");


        return res.status(200).json({
            success:true,
            message:"Logout successful"
        });


    }catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



export default{
    registerUser,
    loginUser,
    logoutUser
};