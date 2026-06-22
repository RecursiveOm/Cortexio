import { PDFParse } from "pdf-parse";

import InterviewReportModel from "../models/interviewReport.model.js";
import { generateInterviewReport } from "../services/ai.service.js";

const generateInterviewReportController = async (req,res)=>{

    try{

        if(!req.file){
            return res.status(400).json({
                message:"Resume required"
            });
        }

        const parser = new PDFParse({
            data:req.file.buffer
        });

        const parsedPdf = await parser.getText();

        const resumeContent = parsedPdf.text;

        const {
            selfDescription,
            jobDescription
        } = req.body;


        const interviewReportByAi =
        await generateInterviewReport({
            resume:resumeContent,
            selfDescription,
            jobDescription
        });


        const interviewReport =
        await InterviewReportModel.create({

            user:req.user.id,

            resume:resumeContent,

            selfDescription,

            jobDescription,

            ...interviewReportByAi

        });


        res.status(201).json({
            message:"Interview report generated successfully",
            interviewReport
        });


    }catch(error){

    console.log("FULL ERROR =================");
    console.log(error);

    return res.status(500).json({
        success:false,
        message:error.message
    });
}
};


export default {
    generateInterviewReportController
};