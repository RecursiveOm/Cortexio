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


        return res.status(201).json({
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


const getInterviewByIdController = async (req,res)=>{

    try{

        const { interviewId } = req.params;


        const interviewReport =
        await InterviewReportModel.findOne({
            _id:interviewId,
            user:req.user.id
        });


        if(!interviewReport){

            return res.status(404).json({
                message:"Interview report not found"
            });

        }


        return res.status(200).json({
            message:"Interview report fetched successfully",
            interviewReport
        });


    }catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

};


async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}
export default {
    generateInterviewReportController,
    getInterviewByIdController,
    getAllInterviewReportsController
};