import { GoogleGenAI } from "@google/genai";
import z from "zod";



const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


const questionSchema = z.object({
    question:  z.string(),
    intention: z.string(),
    answer:    z.string(),
});

const interviewReportSchema = z.object({
    title:      z.string(),
    matchScore: z.number().min(0).max(100),

    technicalQuestions: z.array(questionSchema).min(8).max(10),
    behavioralQuestions: z.array(questionSchema).min(5).max(7),

    skillGaps: z.array(
        z.object({
            skill:    z.string(),
            severity: z.enum(["low", "medium", "high"]),
        })
    ).min(3).max(6),

    preparationPlan: z.array(
        z.object({
            day:   z.number(),
            focus: z.string(),
            tasks: z.array(z.string()).min(2),
        })
    ).min(7).max(14),
});


const QUESTION_SCHEMA_GEMINI = {
    type: "object",
    properties: {
        question:  { type: "string" },
        intention: { type: "string" },
        answer:    { type: "string" },
    },
    required: ["question", "intention", "answer"],
};

const GEMINI_RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        title: {
            type: "string",
            description: "Concise report title naming the role and company, e.g. 'Senior Frontend Engineer at Stripe — Interview Prep Report'.",
        },
        matchScore: {
            type: "integer",
            minimum: 0,
            maximum: 100,
            description: "0–100 alignment score. 90–100 = exceptional, 70–89 = strong, 50–69 = moderate, <50 = significant gaps. Scores above 88 should be rare.",
        },
        technicalQuestions: {
            type: "array",
            minItems: 8,
            maxItems: 10,
            items: QUESTION_SCHEMA_GEMINI,
            description: "8–10 role-specific technical questions from the job's exact stack, escalating in difficulty. Each includes interviewer intent and a detailed model answer.",
        },
        behavioralQuestions: {
            type: "array",
            minItems: 5,
            maxItems: 7,
            items: QUESTION_SCHEMA_GEMINI,
            description: "5–7 behavioral questions targeting competencies in the JD. Model answers must follow STAR (Situation, Task, Action, Result) and reference the candidate's real experiences.",
        },
        skillGaps: {
            type: "array",
            minItems: 3,
            maxItems: 6,
            items: {
                type: "object",
                properties: {
                    skill: {
                        type: "string",
                        description: "Specific skill or knowledge area where the candidate falls short.",
                    },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "'low' = addressable in days; 'medium' = weeks of focused effort; 'high' = critical gap that materially weakens this candidacy.",
                    },
                },
                required: ["skill", "severity"],
            },
            description: "3–6 honest, prioritized skill gaps. Do not sugarcoat — flag high-severity gaps clearly.",
        },
        preparationPlan: {
            type: "array",
            minItems: 7,
            maxItems: 14,
            items: {
                type: "object",
                properties: {
                    day:   { type: "integer", minimum: 1 },
                    focus: { type: "string", description: "Single primary theme, e.g. 'Dynamic Programming', 'System Design: Databases', 'Behavioral Story Bank'." },
                    tasks: {
                        type: "array",
                        minItems: 2,
                        items: { type: "string" },
                        description: "Specific, actionable tasks — name exact LeetCode tags, book chapters, or drills. No vague tasks like 'study algorithms'.",
                    },
                },
                required: ["day", "focus", "tasks"],
            },
            description: "7–14 day prep plan. Address high-severity gaps in the first half. Final days = mock interviews and review.",
        },
    },
    required: [
        "title",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
    ],
};



// Prompts

const SYSTEM_INSTRUCTION = `You are an elite technical interview coach with 15+ years of experience preparing engineers for FAANG and top-tier tech companies. You have deep expertise in:
- Calibrating candidate readiness against specific job requirements
- Identifying genuine skill gaps without sugarcoating
- Crafting targeted, role-specific interview questions (not generic ones)
- Building realistic, high-ROI preparation plans

Your output is always specific to this exact candidate and this exact role. You never produce generic advice.
You output ONLY valid JSON matching the provided schema exactly. No markdown, no prose, no commentary.`;

function buildUserPrompt({ resume, selfDescription, jobDescription }) {
    return `
Analyze the candidate profile below against the job description and generate a comprehensive, highly personalized interview preparation report.

════════════════════════════════════════
JOB DESCRIPTION
════════════════════════════════════════
${jobDescription?.trim() || "Not provided."}

════════════════════════════════════════
CANDIDATE RESUME
════════════════════════════════════════
${resume?.trim() || "Not provided."}

════════════════════════════════════════
CANDIDATE SELF-DESCRIPTION
════════════════════════════════════════
${selfDescription?.trim() || "Not provided."}

════════════════════════════════════════
YOUR TASK
════════════════════════════════════════
1. TITLE          — Specific report title naming the role and company if identifiable.
2. MATCH SCORE    — Honest 0–100 alignment rating. Above 88 should be rare.
3. TECHNICAL Qs   — 8–10 questions specific to this role's stack and seniority. Escalate difficulty.
4. BEHAVIORAL Qs  — 5–7 questions targeting competencies from the JD. STAR-format model answers.
5. SKILL GAPS     — 3–6 real gaps with honest severity. Flag high-severity gaps clearly.
6. PREP PLAN      — 7–14 day plan. High-severity gaps first. Name specific LeetCode tags, chapters, or drills. End with mock interview days.

Output ONLY the JSON object. Nothing else.
`.trim();
}


// Service Function

/**
 * Generates a comprehensive interview preparation report.
 *
 * @param {Object} params
 * @param {string} params.resume           - Candidate's resume (plain text).
 * @param {string} params.selfDescription  - Candidate's personal statement.
 * @param {string} params.jobDescription   - Target job description (plain text).
 * @returns {Promise<z.infer<typeof interviewReportSchema>>}
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    if (!jobDescription?.trim()) {
        throw new Error("jobDescription is required to generate an interview report.");
    }

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: buildUserPrompt({ resume, selfDescription, jobDescription }),
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: GEMINI_RESPONSE_SCHEMA,   // ← plain object, no zod-to-json-schema needed
            temperature: 0.4,
        },
    });

    const rawText =
        typeof response.text === "function" ? response.text() : response.text;

    if (!rawText?.trim()) {
        throw new Error("Gemini returned an empty response.");
    }

    let parsed;
    try {
        parsed = JSON.parse(rawText);
    } catch (err) {
        throw new Error(
            `Failed to parse Gemini response as JSON.\nCause: ${err.message}\nRaw response: ${rawText}`
        );
    }

    // Zod validates the parsed object as a second safety net
    const validation = interviewReportSchema.safeParse(parsed);

    if (!validation.success) {
        console.error("[ai.service] Schema validation failed:", validation.error.flatten());
        throw new Error(
            `AI response did not match expected schema.\n${JSON.stringify(validation.error.flatten(), null, 2)}`
        );
    }

    return validation.data;
}

export { generateInterviewReport };