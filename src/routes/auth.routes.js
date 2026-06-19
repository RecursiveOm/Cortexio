import { Router } from "express";

import authController from "../controllers/auth.controller.js";


const authRouter = Router();


authRouter.post("/register",authController.registerUser);
authRouter.post("/login",authController.loginUser);
authRouter.get("/logout",authController.logoutUser);


export default authRouter; 