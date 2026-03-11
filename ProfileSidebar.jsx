import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const completionPercent = 72;
    const circumference = 2 * Math.PI * 45; // radius=45
    const offset = circumference - (completionPercent / 100) * circumference;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleLogout = () => {
        onClose();
        navigate('/login');
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`ps-overlay ${isOpen ? 'ps-overlay-active' : ''}`}
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div className={`ps-sidebar ${isOpen ? 'ps-sidebar-open' : ''}`}>
                {/* Close Button */}
                <button className="ps-close-btn" onClick={onClose} aria-label="Close sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Profile Header */}
                <div className="ps-profile-header">
                    {/* Circular Progress Ring */}
                    <div className="ps-progress-wrapper">
                        <svg className="ps-progress-ring" width="110" height="110" viewBox="0 0 110 110">
                            <circle
                                cx="55" cy="55" r="45"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="6"
                            />
                            <circle
                                cx="55" cy="55" r="45"
                                fill="none"
                                stroke="url(#progressGrad)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                transform="rotate(-90 55 55)"
                                style={{ transition: 'stroke-dashoffset 1s ease' }}
                            />
                            <defs>
                                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#4f46e5" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="ps-avatar-inner">
                            <span>Pallavi</span>
                        </div>
                        <div className="ps-completion-label">{completionPercent}%</div>
                    </div>

                    <h3 className="ps-name">Pallavi K S</h3>
                    <p className="ps-role">React Developer • 3 Years Exp</p>
                    <p className="ps-completion-text">
                        <span className="ps-completion-badge">Profile {completionPercent}% complete</span>
                    </p>
                    <div className="ps-profile-links">
                        <Link to="/employee/profile" className="ps-link-btn" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Profile
                        </Link>
                        <Link to="/employee/profile?edit=true" className="ps-link-btn ps-link-outline" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Update Profile
                        </Link>
                    </div>
                </div>

                {/* Profile Performance Section */}
                <div className="ps-section">
                    <div className="ps-section-title">Profile Performance</div>
                    <div className="ps-perf-grid">
                        <div className="ps-perf-card">
                            <div className="ps-perf-num">142</div>
                            <div className="ps-perf-label">Search appearances</div>
                        </div>
                        <div className="ps-perf-card">
                            <div className="ps-perf-num">18</div>
                            <div className="ps-perf-label">Recruiter actions</div>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="ps-section">
                    <div className="ps-section-title">Quick Links</div>
                    <nav className="ps-menu">
                        <Link to="/career-advice" className="ps-menu-item" onClick={onClose}>
                            <span className="ps-menu-icon">🎯</span>
                            <span>Career Guidance</span>
                            <span className="ps-menu-arrow">›</span>
                        </Link>
                        <Link to="/employee/settings" className="ps-menu-item" onClick={onClose}>
                            <span className="ps-menu-icon">⚙️</span>
                            <span>Settings</span>
                            <span className="ps-menu-arrow">›</span>
                        </Link>
                        <Link to="/help" className="ps-menu-item" onClick={onClose}>
                            <span className="ps-menu-icon">❓</span>
                            <span>FAQs</span>
                            <span className="ps-menu-arrow">›</span>
                        </Link>
                    </nav>
                </div>

                {/* Logout */}
                <div className="ps-logout-section">
                    <button className="ps-logout-btn" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>

            <style>{`
                .ps-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(17, 24, 39, 0.5);
                    backdrop-filter: blur(4px);
                    z-index: 1100;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.35s ease;
                }
                .ps-overlay-active {
                    opacity: 1;
                    pointer-events: all;
                }
                .ps-sidebar {
                    position: fixed;
                    top: 0;
                    right: 0;
                    height: 100%;
                    width: 340px;
                    max-width: 100vw;
                    background: #ffffff;
                    z-index: 1200;
                    box-shadow: -8px 0 40px rgba(0,0,0,0.15);
                    transform: translateX(100%);
                    transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }
                .ps-sidebar-open {
                    transform: translateX(0);
                }
                .ps-close-btn {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: #f3f4f6;
                    border: none;
                    cursor: pointer;
                    color: #4b5563;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s ease, color 0.2s ease;
                    z-index: 10;
                }
                .ps-close-btn:hover { background: #e5e7eb; color: #111827; }
                .ps-profile-header {
                    background: linear-gradient(160deg, #eef2ff 0%, #f0fdf4 100%);
                    padding: 40px 24px 28px;
                    text-align: center;
                    border-bottom: 1px solid #e5e7eb;
                }
                .ps-progress-wrapper {
                    position: relative;
                    width: 110px;
                    height: 110px;
                    margin: 0 auto 16px;
                }
                .ps-progress-ring {
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .ps-avatar-inner {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 82px;
                    height: 82px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.4rem;
                    font-weight: 800;
                }
                .ps-completion-label {
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #4f46e5;
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 20px;
                    white-space: nowrap;
                }
                .ps-name {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 4px;
                }
                .ps-role {
                    font-size: 0.82rem;
                    color: #6b7280;
                    margin-bottom: 12px;
                }
                .ps-completion-text { margin-bottom: 16px; }
                .ps-completion-badge {
                    background: #dcfce7;
                    color: #166534;
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 3px 10px;
                    border-radius: 20px;
                }
                .ps-profile-links {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                }
                .ps-link-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 7px 14px;
                    background: #4f46e5;
                    color: white;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: background 0.2s ease, transform 0.2s ease;
                }
                .ps-link-btn:hover { background: #3730a3; transform: translateY(-1px); }
                .ps-link-outline {
                    background: transparent;
                    color: #4f46e5;
                    border: 1.5px solid #4f46e5;
                }
                .ps-link-outline:hover { background: #eef2ff; }
                .ps-section {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f3f4f6;
                }
                .ps-section-title {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin-bottom: 14px;
                }
                .ps-perf-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .ps-perf-card {
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 14px;
                    text-align: center;
                    transition: box-shadow 0.2s ease;
                }
                .ps-perf-card:hover { box-shadow: 0 4px 12px rgba(79,70,229,0.1); }
                .ps-perf-num {
                    font-size: 1.6rem;
                    font-weight: 800;
                    color: #4f46e5;
                    line-height: 1;
                    margin-bottom: 4px;
                }
                .ps-perf-label {
                    font-size: 0.72rem;
                    color: #6b7280;
                    line-height: 1.3;
                }
                .ps-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .ps-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 14px;
                    border-radius: 10px;
                    text-decoration: none;
                    color: #374151;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: background 0.15s ease, color 0.15s ease;
                    cursor: pointer;
                }
                .ps-menu-item:hover {
                    background: #eef2ff;
                    color: #4f46e5;
                }
                .ps-menu-icon { font-size: 1.1rem; flex-shrink: 0; }
                .ps-menu-arrow { margin-left: auto; color: #9ca3af; font-size: 1.1rem; }
                .ps-logout-section {
                    padding: 20px 24px;
                    margin-top: auto;
                }
                .ps-logout-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    background: #fff1f2;
                    color: #dc2626;
                    border: 1.5px solid #fecaca;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                .ps-logout-btn:hover { background: #fee2e2; }
            `}</style>
        </>
    );
};

export default ProfileSidebar;
