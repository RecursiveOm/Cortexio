import React, { useState } from 'react';
import { useInterview } from "../../hook/useInterview.js";
import '../styles/interview.scss';

const severityMeta = {
    high:   { label: 'Critical',  color: '#c0392b' },
    medium: { label: 'Moderate',  color: '#d4860a' },
    low:    { label: 'Minor',     color: '#2e7d52' },
};

const ScoreRing = ({ score }) => {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const filled = (score / 100) * circ;
    return (
        <svg className="score-ring" viewBox="0 0 130 130" aria-label={`Match score ${score}%`}>
            <circle cx="65" cy="65" r={r} className="ring-track" />
            <circle
                cx="65" cy="65" r={r}
                className="ring-fill"
                strokeDasharray={`${filled} ${circ}`}
                strokeDashoffset={circ * 0.25}
                style={{ stroke: score >= 80 ? '#c0392b' : score >= 60 ? '#d4860a' : '#888' }}
            />
            <text x="65" y="60" className="score-number">{score}</text>
            <text x="65" y="79" className="score-label">/ 100</text>
        </svg>
    );
};

const Accordion = ({ question, intention, answer, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`accordion ${open ? 'open' : ''}`}>
            <button className="accordion-header" onClick={() => setOpen(o => !o)}>
                <span className="acc-index">Q{String(index).padStart(2, '0')}</span>
                <span className="acc-question">{question}</span>
                <span className="acc-chevron">{open ? '−' : '+'}</span>
            </button>
            {open && (
                <div className="accordion-body">
                    <div className="acc-section">
                        <p className="acc-tag">Intention</p>
                        <p className="acc-text intent-text">{intention}</p>
                    </div>
                    <div className="acc-section">
                        <p className="acc-tag">Model Answer</p>
                        <p className="acc-text">{answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const Interview = () => {
    const [activeTab, setActiveTab] = useState("technical");
    const { report, loading } = useInterview();

    if (loading) return <h1>Loading...</h1>;
    if (!report)  return <h1>No report found</h1>;

    const data = report;

    const tabs = [
        { id: 'technical',  label: 'Technical' },
        { id: 'behavioral', label: 'Behavioral' },
        { id: 'gaps',       label: 'Skill Gaps' },
        { id: 'plan',       label: 'Prep Plan' },
    ];

    const questions = activeTab === 'technical'
        ? data.technicalQuestions
        : data.behavioralQuestions;

    return (
        <div className="interview-page">

            {/* ─── Header ─── */}
            <header className="iv-header">
                <div className="iv-header-left">
                    <p className="iv-eyebrow">Interview Report</p>
                    <h1 className="iv-title">{data.title}</h1>
                    <p className="iv-date">
                        {new Date(data.createdAt.$date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                        })}
                    </p>
                </div>
                <div className="iv-header-right">
                    <ScoreRing score={data.matchScore} />
                    <p className="score-caption">Match Score</p>
                </div>
            </header>

            {/* ─── Tab Nav ─── */}
            <nav className="iv-tabs">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        className={`iv-tab ${activeTab === t.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
                <span className="tab-ink" />
            </nav>

            {/* ─── Content ─── */}
            <main className="iv-content">

                {(activeTab === 'technical' || activeTab === 'behavioral') && (
                    <section className="questions-section">
                        <p className="section-meta">
                            {questions.length} questions &mdash; click to expand answers
                        </p>
                        {questions.map((q, i) => (
                            <Accordion
                                key={i}
                                index={i + 1}
                                question={q.question}
                                intention={q.intention}
                                answer={q.answer}
                            />
                        ))}
                    </section>
                )}

                {activeTab === 'gaps' && (
                    <section className="gaps-section">
                        <p className="section-meta">Areas identified for improvement</p>
                        <div className="gaps-grid">
                            {data.skillGaps.map((g, i) => {
                                const meta = severityMeta[g.severity] || severityMeta.low;
                                return (
                                    <div key={i} className="gap-card">
                                        <div className="gap-severity-bar" style={{ background: meta.color }} />
                                        <div className="gap-body">
                                            <p className="gap-skill">{g.skill}</p>
                                            <span
                                                className="gap-badge"
                                                style={{
                                                    color: meta.color,
                                                    borderColor: `${meta.color}55`,
                                                    background: `${meta.color}12`,
                                                }}
                                            >
                                                {meta.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {activeTab === 'plan' && (
                    <section className="plan-section">
                        <p className="section-meta">Your structured preparation timeline</p>
                        <div className="plan-timeline">
                            {data.preparationPlan.map((p, i) => (
                                <div key={i} className="plan-card">
                                    <div className="plan-day-col">
                                        <div className="plan-day-badge">Day {p.day}</div>
                                        {i < data.preparationPlan.length - 1 && (
                                            <div className="plan-connector" />
                                        )}
                                    </div>
                                    <div className="plan-body">
                                        <h3 className="plan-focus">{p.focus}</h3>
                                        <ul className="plan-tasks">
                                            {p.tasks.map((task, j) => (
                                                <li key={j} className="plan-task">
                                                    <span className="task-bullet" />
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </main>
        </div>
    );
};

export default Interview;