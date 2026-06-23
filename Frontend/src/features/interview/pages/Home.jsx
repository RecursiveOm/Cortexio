import React, { useState, useRef } from 'react';
import "../styles/home.scss";
import { useInterview } from "../../hook/useInterview.js";
import { useNavigate } from "react-router";

const Home = () => {
    const { loading, generateReport, reports } = useInterview();

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");

    const resumeInputRef = useRef(null);
    const navigate = useNavigate();

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0];

        if (!jobDescription) {
            alert("Job description required");
            return;
        }

        if (!resumeFile && !selfDescription) {
            alert("Upload resume or add self description");
            return;
        }

        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile,
        });

        navigate(`/interview/${data._id}`);
    };

    if (loading) {
        return (
            <main className="loading-screen">
                <p>Preparing your interview plan…</p>
            </main>
        );
    }

    return (
        <div className="home">

            {/* ─── Left: Job Description ─── */}
            <div className="left">
                <p className="left-label">Job Description</p>
                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here…"
                    maxLength={5000}
                />
            </div>

            {/* ─── Right: Resume + Self Description + CTA ─── */}
            <div className="right">

                <div className="input-group">
                    <label htmlFor="resume">Upload Resume</label>
                    <input
                        ref={resumeInputRef}
                        type="file"
                        id="resume"
                        name="resume"
                        accept=".pdf"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="selfDescription">Self Description</label>
                    <textarea
                        id="selfDescription"
                        value={selfDescription}
                        onChange={(e) => setSelfDescription(e.target.value)}
                        placeholder="Briefly describe your background, skills, and goals…"
                    />
                </div>

                <button
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="generate-btn"
                >
                    {loading ? "Generating…" : "Generate Interview Report"}
                </button>

            </div>

        </div>
    );
};

export default Home;
