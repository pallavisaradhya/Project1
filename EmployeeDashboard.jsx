import React from 'react';
import CompanyCard from '../components/CompanyCard';
import { companiesData } from '../data/companiesData';

export default function EmployeeDashboard() {
    return (
        <div className="ed-page">
            <div className="ed-container">
                {/* Header */}
                <div className="ed-header">
                    <div className="ed-greeting">
                        <div className="ed-greeting-badge">
                            <span className="ed-greeting-dot"></span>
                            AI-Powered Matches
                        </div>
                        <h1 className="ed-heading">Recommended Companies for You</h1>
                        <p className="ed-subheading">
                            Based on your skills and experience, we've curated the best opportunities for you this week.
                        </p>
                    </div>
                    <div className="ed-stats">
                        <div className="ed-stat">
                            <span className="ed-stat-num">8</span>
                            <span className="ed-stat-label">New Matches</span>
                        </div>
                        <div className="ed-stat-divider"></div>
                        <div className="ed-stat">
                            <span className="ed-stat-num">82%</span>
                            <span className="ed-stat-label">Avg Match</span>
                        </div>
                        <div className="ed-stat-divider"></div>
                        <div className="ed-stat">
                            <span className="ed-stat-num">3</span>
                            <span className="ed-stat-label">Shortlisted</span>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="ed-filter-bar">
                    <button className="ed-filter-btn ed-filter-active">All</button>
                    <button className="ed-filter-btn">High Match (80%+)</button>
                    <button className="ed-filter-btn">Remote</button>
                    <button className="ed-filter-btn">Freshers Welcome</button>
                    <button className="ed-filter-btn">Top Companies</button>
                </div>

                {/* Company Cards Grid */}
                <div className="ed-cards-grid">
                    {companiesData.map((company) => (
                        <CompanyCard key={company.id} company={company} />
                    ))}
                </div>
            </div>

            <style>{`
                .ed-page {
                    min-height: 100vh;
                    background: #f8faff;
                    padding-top: 90px;
                    padding-bottom: 60px;
                }
                .ed-container {
                    max-width: 1300px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .ed-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 32px;
                    padding: 40px 0 32px;
                    flex-wrap: wrap;
                }
                .ed-greeting-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #eef2ff;
                    color: #4f46e5;
                    font-size: 0.78rem;
                    font-weight: 700;
                    padding: 5px 14px;
                    border-radius: 20px;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }
                .ed-greeting-dot {
                    width: 7px;
                    height: 7px;
                    background: #4f46e5;
                    border-radius: 50%;
                    animation: pulse-ed 2s infinite;
                }
                @keyframes pulse-ed {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0.7; }
                }
                .ed-heading {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #111827;
                    margin-bottom: 10px;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                }
                .ed-subheading {
                    font-size: 0.95rem;
                    color: #6b7280;
                    max-width: 520px;
                    line-height: 1.6;
                }
                .ed-stats {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 14px;
                    padding: 20px 28px;
                    flex-shrink: 0;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }
                .ed-stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                }
                .ed-stat-num {
                    font-size: 1.6rem;
                    font-weight: 800;
                    color: #4f46e5;
                    line-height: 1;
                }
                .ed-stat-label {
                    font-size: 0.72rem;
                    color: #9ca3af;
                    font-weight: 500;
                    white-space: nowrap;
                }
                .ed-stat-divider {
                    width: 1px;
                    height: 36px;
                    background: #e5e7eb;
                }
                .ed-filter-bar {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 28px;
                    flex-wrap: wrap;
                }
                .ed-filter-btn {
                    padding: 8px 18px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 20px;
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .ed-filter-btn:hover {
                    background: #eef2ff;
                    border-color: #c7d2fe;
                    color: #4f46e5;
                }
                .ed-filter-active {
                    background: #4f46e5 !important;
                    border-color: #4f46e5 !important;
                    color: white !important;
                }
                .ed-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                @media (max-width: 768px) {
                    .ed-heading { font-size: 1.5rem; }
                    .ed-stats { width: 100%; justify-content: center; }
                    .ed-cards-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
