import mongoose from "mongoose";

/**
 * Interview Report Schema
 *
 * {
 *   jobDescription: String,
 *   resume: String,
 *   selfDescription: String,
 *   matchScore: Number,
 *
 *   technicalQuestions:[
 *      {
 *          question:String,
 *          intention:String,
 *          answer:String
 *      }
 *   ],
 *
 *   behavioralQuestions:[
 *      {
 *          question:String,
 *          intention:String,
 *          answer:String
 *      }
 *   ],
 *
 *   skillGaps:[
 *      {
 *          skill:String,
 *          severity:"low | medium | high"
 *      }
 *   ],
 *
 *   preparationPlan:[
 *      {
 *          day:Number,
 *          focus:String,
 *          tasks:[String]
 *      }
 *   ],
 *
 *   user:ObjectId,
 *   title:String
 * }
 */

const technicalQuestionSchema = new mongoose.Schema(
    {
        question:{
            type:String,
            required:true
        },
        intention:{
            type:String,
            required:true
        },
        answer:{
            type:String,
            required:true
        }
    },
    {_id:false}
);

const behavioralQuestionSchema = new mongoose.Schema(
    {
        question:{
            type:String,
            required:true
        },
        intention:{
            type:String,
            required:true
        },
        answer:{
            type:String,
            required:true
        }
    },
    {_id:false}
);

const skillGapSchema = new mongoose.Schema(
    {
        skill:{
            type:String,
            required:true
        },
        severity:{
            type:String,
            enum:["low","medium","high"],
            required:true
        }
    },
    {_id:false}
);

const preparationPlanSchema = new mongoose.Schema(
    {
        day:{
            type:Number,
            required:true
        },
        focus:{
            type:String,
            required:true
        },
        tasks:[
            {
                type:String,
                required:true
            }
        ]
    },
    {_id:false}
);

const interviewReportSchema = new mongoose.Schema(
    {
        jobDescription:{
            type:String,
            required:true
        },
        resume:{
            type:String
        },
        selfDescription:{
            type:String
        },
        matchScore:{
            type:Number,
            min:0,
            max:100
        },
        technicalQuestions:[technicalQuestionSchema],
        behavioralQuestions:[behavioralQuestionSchema],
        skillGaps:[skillGapSchema],
        preparationPlan:[preparationPlanSchema],

        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        title:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
);

const InterviewReport = mongoose.model(
    "InterviewReport",
    interviewReportSchema
);

export default InterviewReport;