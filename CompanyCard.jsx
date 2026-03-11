import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyCard = ({ company }) => {
    const navigate = useNavigate();

    const matchColor = company.matchPercent >= 80
        ? '#059669'
        : company.matchPercent >= 60
            ? '#d97706'
            : '#4f46e5';

    return (
        <div className="cc-card" onClick={() => navigate(`/employee/company/${company.id}`)}>
            <div className="cc-top">
                <div className="cc-logo-wrap">
                    <div
                        className="cc-logo"
                        style={{ background: company.logoColor || 'linear-gradient(135deg,#4f46e5,#06b6d4)' }}
                    >
                        {company.logoText}
                    </div>
                </div>
                <div
                    className="cc-match-badge"
                    style={{ background: matchColor + '18', color: matchColor, borderColor: matchColor + '40' }}
                >
                    <span className="cc-match-dot" style={{ background: matchColor }}></span>
                    {company.matchPercent}% Match
                </div>
            </div>

            <h3 className="cc-company">{company.name}</h3>
            <p className="cc-role">{company.role}</p>

            <div className="cc-meta">
                <span className="cc-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {company.location}
                </span>
                <span className="cc-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {company.experience}
                </span>
            </div>

            <p className="cc-desc">{company.description}</p>

            <div className="cc-footer">
                <span className="cc-posted">{company.posted}</span>
                <button
                    className="cc-view-btn"
                    onClick={(e) => { e.stopPropagation(); navigate(`/employee/company/${company.id}`); }}
                >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <style>{`
                .cc-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 22px;
                    cursor: pointer;
                    transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .cc-card:hover {
                    box-shadow: 0 12px 40px rgba(79,70,229,0.12);
                    transform: translateY(-4px);
                    border-color: #c7d2fe;
                }
                .cc-top {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 12px;
                }
                .cc-logo-wrap { flex-shrink: 0; }
                .cc-logo {
                    width: 52px;
                    height: 52px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1rem;
                    font-weight: 800;
                    letter-spacing: 0.02em;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
                }
                .cc-match-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.72rem;
                    font-weight: 700;
                    border: 1px solid;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .cc-match-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .cc-company {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #111827;
                    line-height: 1.3;
                    margin-top: 4px;
                }
                .cc-role {
                    font-size: 0.875rem;
                    color: #4f46e5;
                    font-weight: 600;
                }
                .cc-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .cc-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.78rem;
                    color: #6b7280;
                }
                .cc-desc {
                    font-size: 0.82rem;
                    color: #6b7280;
                    line-height: 1.5;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .cc-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 4px;
                    padding-top: 12px;
                    border-top: 1px solid #f3f4f6;
                }
                .cc-posted {
                    font-size: 0.75rem;
                    color: #9ca3af;
                }
                .cc-view-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 7px 16px;
                    background: #eef2ff;
                    color: #4f46e5;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s ease, transform 0.2s ease;
                }
                .cc-view-btn:hover {
                    background: #4f46e5;
                    color: white;
                    transform: translateX(2px);
                }
            `}</style>
        </div>
    );
};

export default CompanyCard;
