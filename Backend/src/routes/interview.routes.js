import upload from "../middlewares/file.middleware.js";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import interviewController from "../controllers/interview.controller.js";
const interviewRouter =  express.Router()


interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController);

interviewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewController
    .generateInterviewReportController
)


interviewRouter.get("/",authMiddleware.authUser,interviewController.getAllInterviewReportsController)
export default  interviewRouter