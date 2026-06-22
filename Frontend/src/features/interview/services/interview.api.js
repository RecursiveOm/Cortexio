import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
});


/**
 * Generate AI interview report
 *
 * @param {Object} data
 * @param {string} data.jobDescription
 * @param {string} data.selfDescription
 * @param {File} data.resumeFile
 *
 * @returns {Promise<Object>} Generated interview report
 */
export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile
})=>{

    const formData = new FormData();

    formData.append(
        "jobDescription",
        jobDescription
    );

    formData.append(
        "selfDescription",
        selfDescription
    );

    formData.append(
        "resume",
        resumeFile
    );


    const response = await api.post(
        "/api/interview",
        formData,
        {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
    );


    return response.data;

};



/**
 * Fetch single interview report by id
 *
 * @param {string} interviewId
 *
 * @returns {Promise<Object>} Interview report
 */
export const getInterviewReportById = async (
    interviewId
)=>{

    const response =
    await api.get(
        `/api/interview/report/${interviewId}`
    );


    return response.data;

};



/**
 * Fetch all interview reports of logged-in user
 *
 * @returns {Promise<Array>} Interview reports list
 */
export const getAllInterviewReports = async ()=>{

    const response =
    await api.get(
        "/api/interview"
    );


    return response.data;

};