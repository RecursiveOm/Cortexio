import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import BlacklistToken from "../models/blacklist.model.js";


const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
};


/**
 * Registers a new Cortexio user.
 *
 * Workflow:
 * 1. Validate user input
 * 2. Check existing account
 * 3. Hash password securely
 * 4. Store user in database
 * 5. Generate JWT session
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


        const hashedPassword =
            await bcrypt.hash(password,10);


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
            cookieOptions
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
 * Authenticates existing users.
 *
 * Workflow:
 * 1. Verify credentials
 * 2. Compare hashed password
 * 3. Issue JWT session token
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


        const user =
            await User
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
            cookieOptions
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
 * Logs out authenticated users.
 *
 * Workflow:
 * 1. Extract JWT
 * 2. Blacklist token
 * 3. Clear cookie
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


        res.clearCookie(
            "token",
            {
                httpOnly:true,
                sameSite:"lax"
            }
        );


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


/**
 * Returns current authenticated user.
 *
 * User is provided by auth middleware.
 *
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = async(req,res)=>{

    return res.status(200).json({
        success:true,
        message:"User authenticated",
        user:{
            id:req.user._id,
            username:req.user.username,
            email:req.user.email
        }
    });

};


export default {
    registerUser,
    loginUser,
    logoutUser,
    getMe
};