import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const allNotifications = [
    {
        id: 1,
        icon: '👁️',
        type: 'Profile View',
        title: 'Your profile was viewed by Infosys',
        description: 'A recruiter from Infosys viewed your profile and spent 2 minutes reviewing your skills and experience. This could be a potential opportunity!',
        time: '2 hours ago',
        date: 'Today',
        unread: true,
        actionLabel: 'View Company',
        actionLink: '/employee/company/1',
    },
    {
        id: 2,
        icon: '🎉',
        type: 'Shortlisted',
        title: 'You are shortlisted for React Developer role',
        description: 'Congratulations! TCS has shortlisted you for the Full Stack Developer position in Mumbai. Your profile matched 82% of the job requirements. Please review the job details and apply.',
        time: '5 hours ago',
        date: 'Today',
        unread: true,
        actionLabel: 'View Job Details',
        actionLink: '/employee/company/2',
    },
    {
        id: 3,
        icon: '💼',
        type: 'Job Match',
        title: 'New job matches available based on your profile',
        description: '8 new jobs matching your skills in React.js, JavaScript, and TypeScript have been found. Companies include Swiggy, Razorpay, and PhonePe. Check them out before they expire!',
        time: '1 day ago',
        date: 'Yesterday',
        unread: false,
        actionLabel: 'View Matches',
        actionLink: '/employee/dashboard',
    },
    {
        id: 4,
        icon: '🔔',
        type: 'Reminder',
        title: 'Complete your profile to increase visibility',
        description: 'Your profile is 72% complete. Adding your education details and certifications can increase your search appearances by up to 3x. Complete it now to get more recruiter attention.',
        time: '2 days ago',
        date: 'Feb 24',
        unread: false,
        actionLabel: 'Update Profile',
        actionLink: '/employee/profile',
    },
    {
        id: 5,
        icon: '👁️',
        type: 'Profile View',
        title: 'Your profile was viewed by Wipro',
        description: 'A hiring manager from Wipro\'s Digital Experience team viewed your profile. They are actively hiring Frontend Engineers in Hyderabad.',
        time: '3 days ago',
        date: 'Feb 23',
        unread: false,
        actionLabel: 'View Company',
        actionLink: '/employee/company/3',
    },
    {
        id: 6,
        icon: '📩',
        type: 'Message',
        title: 'Recruiter from Razorpay sent you a message',
        description: 'Hi Pallavi, I came across your profile and was impressed with your React.js experience. We have an exciting UI Engineer role at Razorpay. Would you be interested in a quick chat?',
        time: '4 days ago',
        date: 'Feb 22',
        unread: false,
        actionLabel: 'View Job',
        actionLink: '/employee/company/6',
    },
    {
        id: 7,
        icon: '⭐',
        type: 'Achievement',
        title: 'Your profile reached 142 search appearances this week',
        description: 'Great news! Your profile appeared in 142 recruiter searches this week, a 23% increase from last week. Keep your profile updated to maintain this momentum.',
        time: '5 days ago',
        date: 'Feb 21',
        unread: false,
        actionLabel: 'View Stats',
        actionLink: '/employee/profile',
    },
    {
        id: 8,
        icon: '🎯',
        type: 'Job Match',
        title: 'Google is hiring Software Engineers in Gurugram',
        description: 'A new Software Engineer III position at Google matches 71% of your profile. The role requires React.js, TypeScript, and System Design skills. Salary range: ₹40-70 LPA.',
        time: '1 week ago',
        date: 'Feb 19',
        unread: false,
        actionLabel: 'View Job',
        actionLink: '/employee/company/4',
    },
];

const filterTabs = ['All', 'Profile View', 'Shortlisted', 'Job Match', 'Message', 'Reminder', 'Achievement'];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(allNotifications);
    const [activeTab, setActiveTab] = useState('All');

    const filtered = activeTab === 'All' ? notifications : notifications.filter(n => n.type === activeTab);
    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, unread: false })));
    const markRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, unread: false } : n));

    const grouped = {};
    filtered.forEach(n => {
        if (!grouped[n.date]) grouped[n.date] = [];
        grouped[n.date].push(n);
    });

    return (
        <div className="np-page">
            <div className="np-container">
                {/* Header */}
                <div className="np-header">
                    <div>
                        <h1 className="np-title">Notifications</h1>
                        <p className="np-subtitle">Stay updated with your job search activity</p>
                    </div>
                    {unreadCount > 0 && (
                        <button className="np-mark-all" onClick={markAllRead}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Mark all as read ({unreadCount})
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="np-tabs">
                    {filterTabs.map(tab => (
                        <button key={tab} className={`np-tab ${activeTab === tab ? 'np-tab-active' : ''}`} onClick={() => setActiveTab(tab)}>
                            {tab}
                            {tab === 'All' && unreadCount > 0 && <span className="np-tab-badge">{unreadCount}</span>}
                        </button>
                    ))}
                </div>

                {/* Notification List */}
                {Object.keys(grouped).length === 0 ? (
                    <div className="np-empty">
                        <span style={{ fontSize: '3rem' }}>🔔</span>
                        <p>No notifications in this category</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([date, items]) => (
                        <div key={date} className="np-group">
                            <div className="np-date-label">{date}</div>
                            <div className="np-list">
                                {items.map(n => (
                                    <div key={n.id} className={`np-item ${n.unread ? 'np-unread' : ''}`} onClick={() => markRead(n.id)}>
                                        <div className="np-icon-wrap">
                                            <span className="np-icon">{n.icon}</span>
                                        </div>
                                        <div className="np-content">
                                            <div className="np-item-top">
                                                <span className="np-type-badge">{n.type}</span>
                                                <span className="np-time">{n.time}</span>
                                            </div>
                                            <h3 className="np-item-title">{n.title}</h3>
                                            <p className="np-item-desc">{n.description}</p>
                                            <Link to={n.actionLink} className="np-action-btn" onClick={() => markRead(n.id)}>
                                                {n.actionLabel}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                        {n.unread && <span className="np-unread-dot"></span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .np-page { min-height:100vh; background:#f8faff; padding-top:90px; padding-bottom:60px; }
                .np-container { max-width:800px; margin:0 auto; padding:24px; }
                .np-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:24px; flex-wrap:wrap; }
                .np-title { font-size:1.6rem; font-weight:800; color:#111827; margin-bottom:4px; }
                .np-subtitle { font-size:.88rem; color:#6b7280; }
                .np-mark-all { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; background:#eef2ff; color:#4f46e5; border:1px solid #c7d2fe; border-radius:8px; font-size:.82rem; font-weight:600; cursor:pointer; transition:all .2s; }
                .np-mark-all:hover { background:#4f46e5; color:#fff; }
                .np-tabs { display:flex; gap:8px; margin-bottom:28px; flex-wrap:wrap; overflow-x:auto; padding-bottom:4px; }
                .np-tab { padding:7px 16px; background:#fff; border:1px solid #e5e7eb; border-radius:20px; font-size:.8rem; font-weight:500; color:#6b7280; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:6px; white-space:nowrap; }
                .np-tab:hover { background:#eef2ff; border-color:#c7d2fe; color:#4f46e5; }
                .np-tab-active { background:#4f46e5 !important; border-color:#4f46e5 !important; color:#fff !important; }
                .np-tab-badge { background:rgba(255,255,255,.25); padding:1px 6px; border-radius:10px; font-size:.7rem; font-weight:700; }
                .np-tab-active .np-tab-badge { background:rgba(255,255,255,.3); }
                .np-group { margin-bottom:24px; }
                .np-date-label { font-size:.72rem; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; padding-left:4px; }
                .np-list { display:flex; flex-direction:column; gap:12px; }
                .np-item { display:flex; gap:14px; background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:18px 20px; cursor:pointer; transition:all .2s; position:relative; }
                .np-item:hover { box-shadow:0 6px 24px rgba(79,70,229,.08); border-color:#c7d2fe; }
                .np-unread { background:#fafaff; border-color:#c7d2fe; }
                .np-icon-wrap { flex-shrink:0; }
                .np-icon { width:44px; height:44px; display:flex; align-items:center; justify-content:center; background:#eef2ff; border-radius:12px; font-size:1.3rem; }
                .np-content { flex:1; min-width:0; }
                .np-item-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
                .np-type-badge { font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:#4f46e5; background:#eef2ff; padding:2px 8px; border-radius:5px; }
                .np-time { font-size:.72rem; color:#9ca3af; }
                .np-item-title { font-size:.92rem; font-weight:700; color:#111827; margin-bottom:6px; line-height:1.4; }
                .np-item-desc { font-size:.82rem; color:#6b7280; line-height:1.5; margin-bottom:10px; }
                .np-action-btn { display:inline-flex; align-items:center; gap:4px; font-size:.8rem; font-weight:600; color:#4f46e5; text-decoration:none; transition:gap .2s; }
                .np-action-btn:hover { gap:8px; }
                .np-unread-dot { position:absolute; top:20px; right:18px; width:9px; height:9px; background:#4f46e5; border-radius:50%; box-shadow:0 0 0 3px #eef2ff; }
                .np-empty { text-align:center; padding:60px 20px; color:#9ca3af; }
                .np-empty p { margin-top:12px; font-size:.9rem; }
                @media(max-width:600px) { .np-item{flex-direction:column;gap:10px;} .np-icon{width:36px;height:36px;font-size:1.1rem;} }
            `}</style>
        </div>
    );
}
