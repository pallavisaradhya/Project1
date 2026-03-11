import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companiesData } from '../data/companiesData';

export default function CompanyDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const company = companiesData.find((c) => c.id === parseInt(id));

    if (!company) {
        return (
            <div style={{ paddingTop: 100, textAlign: 'center', color: '#6b7280' }}>
                <h2>Company not found</h2>
                <button onClick={() => navigate('/employee/dashboard')} className="cd-back-btn" style={{ marginTop: 20 }}>
                    ← Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="cd-page">
            <div className="cd-container">
                {/* Back Button */}
                <button className="cd-back-btn" onClick={() => navigate('/employee/dashboard')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Jobs
                </button>

                <div className="cd-layout">
                    {/* Main Content */}
                    <div className="cd-main">
                        {/* Company Header Card */}
                        <div className="cd-card cd-header-card">
                            <div className="cd-header-top">
                                <div
                                    className="cd-logo"
                                    style={{ background: company.logoColor }}
                                >
                                    {company.logoText}
                                </div>
                                <div className="cd-header-info">
                                    <h1 className="cd-role-title">{company.role}</h1>
                                    <h2 className="cd-company-name">{company.name}</h2>
                                    <div className="cd-tags-row">
                                        <span className="cd-tag">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {company.location}
                                        </span>
                                        <span className="cd-tag">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {company.experience}
                                        </span>
                                        <span className="cd-tag">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {company.posted}
                                        </span>
                                        <span
                                            className="cd-match-badge"
                                            style={{
                                                background: company.matchPercent >= 80 ? '#ecfdf5' : '#eef2ff',
                                                color: company.matchPercent >= 80 ? '#059669' : '#4f46e5',
                                                border: `1px solid ${company.matchPercent >= 80 ? '#a7f3d0' : '#c7d2fe'}`,
                                            }}
                                        >
                                            ✨ {company.matchPercent}% AI Match
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Overview */}
                        <div className="cd-card">
                            <h3 className="cd-section-title">Job Overview</h3>
                            <div className="cd-overview-grid">
                                <div className="cd-overview-item">
                                    <span className="cd-ov-icon">🏢</span>
                                    <div>
                                        <div className="cd-ov-label">Employment Type</div>
                                        <div className="cd-ov-val">{company.employmentType}</div>
                                    </div>
                                </div>
                                <div className="cd-overview-item">
                                    <span className="cd-ov-icon">📁</span>
                                    <div>
                                        <div className="cd-ov-label">Department</div>
                                        <div className="cd-ov-val">{company.department}</div>
                                    </div>
                                </div>
                                <div className="cd-overview-item">
                                    <span className="cd-ov-icon">🏷️</span>
                                    <div>
                                        <div className="cd-ov-label">Role Category</div>
                                        <div className="cd-ov-val">{company.roleCategory}</div>
                                    </div>
                                </div>
                                <div className="cd-overview-item">
                                    <span className="cd-ov-icon">🏭</span>
                                    <div>
                                        <div className="cd-ov-label">Industry Type</div>
                                        <div className="cd-ov-val">{company.industryType}</div>
                                    </div>
                                </div>
                                <div className="cd-overview-item">
                                    <span className="cd-ov-icon">🎓</span>
                                    <div>
                                        <div className="cd-ov-label">Education Required</div>
                                        <div className="cd-ov-val">{company.education}</div>
                                    </div>
                                </div>
                                <div className="cd-overview-item">
                                    <span className="cd-ov-icon">💰</span>
                                    <div>
                                        <div className="cd-ov-label">Salary Range</div>
                                        <div className="cd-ov-val" style={{ color: '#059669', fontWeight: 700 }}>{company.salary}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Key Skills */}
                        <div className="cd-card">
                            <h3 className="cd-section-title">Key Skills Required</h3>
                            <div className="cd-skills-wrap">
                                {company.skills.map((skill) => (
                                    <span key={skill} className="cd-skill-chip">{skill}</span>
                                ))}
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="cd-card">
                            <h3 className="cd-section-title">Job Description</h3>
                            <div className="cd-desc-text">
                                {company.jobDescription.split('\n').map((line, i) => (
                                    <p key={i} style={{ marginBottom: line === '' ? '12px' : '6px', color: line.startsWith('•') ? '#374151' : '#6b7280', fontWeight: line.startsWith('Key') ? 600 : 400 }}>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* About Company */}
                        <div className="cd-card">
                            <h3 className="cd-section-title">About {company.name}</h3>
                            <p className="cd-about-text">{company.aboutCompany}</p>
                        </div>

                        {/* Apply CTA at Bottom */}
                        <div className="cd-apply-bottom">
                            <div>
                                <h3 className="cd-apply-title">Ready to Apply?</h3>
                                <p className="cd-apply-sub">Your profile is a {company.matchPercent}% match for this role</p>
                            </div>
                            <div className="cd-apply-btns">
                                <button className="cd-save-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    Save Job
                                </button>
                                <button className="cd-apply-now-btn">
                                    Apply Now
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="cd-sidebar">
                        <div className="cd-card cd-sticky-card">
                            <h3 className="cd-section-title">Quick Apply</h3>
                            <div className="cd-quick-info">
                                <div className="cd-quick-row">
                                    <span>Role</span>
                                    <span>{company.role}</span>
                                </div>
                                <div className="cd-quick-row">
                                    <span>Location</span>
                                    <span>{company.location}</span>
                                </div>
                                <div className="cd-quick-row">
                                    <span>Experience</span>
                                    <span>{company.experience}</span>
                                </div>
                                <div className="cd-quick-row">
                                    <span>Salary</span>
                                    <span style={{ color: '#059669', fontWeight: 700 }}>{company.salary}</span>
                                </div>
                            </div>
                            <div className="cd-match-meter">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>AI Match Score</span>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4f46e5' }}>{company.matchPercent}%</span>
                                </div>
                                <div className="cd-meter-bg">
                                    <div
                                        className="cd-meter-fill"
                                        style={{
                                            width: `${company.matchPercent}%`,
                                            background: company.matchPercent >= 80 ? 'linear-gradient(90deg,#059669,#10b981)' : 'linear-gradient(90deg,#4f46e5,#06b6d4)'
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <button className="cd-apply-now-btn" style={{ width: '100%', marginTop: 16 }}>
                                Apply Now
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                            <button className="cd-save-btn" style={{ width: '100%', marginTop: 10 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                Save for Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .cd-page {
                    min-height: 100vh;
                    background: #f8faff;
                    padding-top: 90px;
                    padding-bottom: 60px;
                }
                .cd-container {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .cd-back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    color: #4b5563;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    cursor: pointer;
                    margin: 24px 0 20px;
                    transition: all 0.2s ease;
                }
                .cd-back-btn:hover { background: #eef2ff; color: #4f46e5; border-color: #c7d2fe; }
                .cd-layout {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 24px;
                    align-items: start;
                }
                .cd-main { display: flex; flex-direction: column; gap: 20px; }
                .cd-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 28px;
                    transition: box-shadow 0.2s ease;
                }
                .cd-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
                .cd-sticky-card { position: sticky; top: 90px; }
                .cd-header-card { padding: 28px; }
                .cd-header-top {
                    display: flex;
                    align-items: flex-start;
                    gap: 20px;
                }
                .cd-logo {
                    width: 70px;
                    height: 70px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 800;
                    flex-shrink: 0;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                }
                .cd-header-info { flex: 1; }
                .cd-role-title {
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: #111827;
                    margin-bottom: 4px;
                    line-height: 1.3;
                }
                .cd-company-name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #6b7280;
                    margin-bottom: 14px;
                }
                .cd-tags-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .cd-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    color: #4b5563;
                    font-size: 0.78rem;
                    font-weight: 500;
                    padding: 4px 10px;
                    border-radius: 6px;
                }
                .cd-match-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.78rem;
                    font-weight: 700;
                    padding: 4px 10px;
                    border-radius: 20px;
                }
                .cd-section-title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #f3f4f6;
                }
                .cd-overview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 16px;
                }
                .cd-overview-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 14px;
                    background: #f9fafb;
                    border-radius: 10px;
                    border: 1px solid #f3f4f6;
                }
                .cd-ov-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 1px; }
                .cd-ov-label {
                    font-size: 0.72rem;
                    color: #9ca3af;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    margin-bottom: 3px;
                }
                .cd-ov-val { font-size: 0.88rem; font-weight: 600; color: #374151; }
                .cd-skills-wrap { display: flex; flex-wrap: wrap; gap: 10px; }
                .cd-skill-chip {
                    padding: 6px 14px;
                    background: #eef2ff;
                    color: #4f46e5;
                    border: 1px solid #c7d2fe;
                    border-radius: 20px;
                    font-size: 0.82rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .cd-skill-chip:hover { background: #4f46e5; color: white; }
                .cd-desc-text { line-height: 1.8; }
                .cd-about-text { font-size: 0.92rem; color: #4b5563; line-height: 1.8; }
                .cd-apply-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    background: linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%);
                    border: 1px solid #c7d2fe;
                    border-radius: 16px;
                    padding: 24px 28px;
                    flex-wrap: wrap;
                }
                .cd-apply-title { font-size: 1.1rem; font-weight: 700; color: #111827; margin-bottom: 4px; }
                .cd-apply-sub { font-size: 0.85rem; color: #6b7280; }
                .cd-apply-btns { display: flex; gap: 12px; }
                .cd-apply-now-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 28px;
                    background: linear-gradient(135deg, #4f46e5, #06b6d4);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    box-shadow: 0 4px 15px rgba(79,70,229,0.35);
                    justify-content: center;
                }
                .cd-apply-now-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(79,70,229,0.45);
                }
                .cd-save-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: white;
                    color: #4f46e5;
                    border: 1.5px solid #c7d2fe;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    justify-content: center;
                }
                .cd-save-btn:hover { background: #eef2ff; }
                .cd-quick-info {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .cd-quick-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.82rem;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #f3f4f6;
                }
                .cd-quick-row span:first-child { color: #9ca3af; }
                .cd-quick-row span:last-child { color: #374151; font-weight: 600; text-align: right; max-width: 160px; }
                .cd-meter-bg {
                    height: 6px;
                    background: #e5e7eb;
                    border-radius: 3px;
                    overflow: hidden;
                }
                .cd-meter-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.8s ease;
                }
                @media (max-width: 900px) {
                    .cd-layout { grid-template-columns: 1fr; }
                    .cd-sticky-card { position: static; }
                }
                @media (max-width: 600px) {
                    .cd-header-top { flex-direction: column; }
                    .cd-apply-bottom { flex-direction: column; }
                    .cd-overview-grid { grid-template-columns: 1fr 1fr; }
                }
            `}</style>
        </div>
    );
}
