    import express from "express"
    import authRouter from "./routes/auth.routes.js";
    import cookieParser from "cookie-parser";
    import interviewRouter from "./routes/interview.routes.js";
    import cors from "cors";
    const app = express();

    
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin:"http://localhost:5173",
        credentials:true
    }) );
 
    //using auth routes
    app.use("/api/auth",authRouter);
    app.use("/api/interview",interviewRouter);
    


export default app;