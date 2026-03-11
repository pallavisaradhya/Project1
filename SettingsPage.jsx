import React, { useState, useRef } from 'react';
import { mockEmployeeProfile, mockSettingsData } from '../data/employeeProfileData';

function ToggleSwitch({ checked, onChange }) {
    return (
        <button
            className={`st-toggle ${checked ? 'st-toggle-on' : ''}`}
            onClick={() => onChange(!checked)}
            type="button"
        >
            <span className="st-toggle-knob" />
        </button>
    );
}

export default function SettingsPage() {
    const [notifications, setNotifications] = useState({ ...mockSettingsData.notifications });
    const [privacy, setPrivacy] = useState({ ...mockSettingsData.privacy });
    const [preferences, setPreferences] = useState({ ...mockSettingsData.preferences });
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [passwordSaved, setPasswordSaved] = useState(false);

    // Account details state
    const [accountDetails, setAccountDetails] = useState({
        email: mockEmployeeProfile.email,
        phone: mockEmployeeProfile.phone
    });
    const [editingField, setEditingField] = useState(null); // 'email' | 'phone' | null
    const [tempValue, setTempValue] = useState('');

    // Refs for scroll-to navigation
    const accountRef = useRef(null);
    const notificationsRef = useRef(null);
    const privacyRef = useRef(null);
    const preferencesRef = useRef(null);
    const dangerRef = useRef(null);

    const scrollTo = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const toggleNotif = (key) => setNotifications(p => ({ ...p, [key]: !p[key] }));
    const togglePrivacy = (key) => setPrivacy(p => ({ ...p, [key]: !p[key] }));
    const setPref = (key, val) => setPreferences(p => ({ ...p, [key]: val }));

    const handlePasswordSave = () => {
        if (!passwords.newPass || !passwords.confirm) return alert('Please fill all password fields');
        if (passwords.newPass !== passwords.confirm) return alert('New password and confirm password do not match');
        if (passwords.newPass.length < 6) return alert('Password must be at least 6 characters');
        setPasswordSaved(true);
        setTimeout(() => {
            setPasswordSaved(false);
            setShowChangePassword(false);
            setPasswords({ current: '', newPass: '', confirm: '' });
        }, 2000);
    };

    const handleEditStart = (field, currentValue) => {
        setEditingField(field);
        setTempValue(currentValue);
    };

    const handleEditSave = (field) => {
        setAccountDetails(prev => ({ ...prev, [field]: tempValue }));
        setEditingField(null);
    };

    return (
        <div className="st-page">
            <div className="st-container">
                <div className="st-header">
                    <h1 className="st-title">Settings</h1>
                    <p className="st-subtitle">Manage your account, privacy, and preferences</p>
                </div>

                <div className="st-layout">
                    <div className="st-main">

                        {/* ─── Account Settings ─── */}
                        <div className="st-card" ref={accountRef}>
                            <div className="st-card-head">
                                <h2 className="st-card-title"><span>👤</span> Account Settings</h2>
                            </div>
                            <div className="st-info-grid">
                                <div className="st-info-item">
                                    <div className="st-info-label">Full Name</div>
                                    <div className="st-info-val">{mockEmployeeProfile.name}</div>
                                </div>
                                <div className="st-info-item">
                                    <div className="st-info-label">Email</div>
                                    <div className="st-info-val-row">
                                        {editingField === 'email' ? (
                                            <div className="st-inline-edit">
                                                <input type="email" value={tempValue} onChange={e => setTempValue(e.target.value)} autoFocus />
                                                <button className="st-save-icon-btn" onClick={() => handleEditSave('email')}>✅</button>
                                                <button className="st-cancel-icon-btn" onClick={() => setEditingField(null)}>❌</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{accountDetails.email}</span>
                                                <button className="st-edit-icon-btn" onClick={() => handleEditStart('email', accountDetails.email)}>✏️ Edit</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="st-info-item">
                                    <div className="st-info-label">Phone Number</div>
                                    <div className="st-info-val-row">
                                        {editingField === 'phone' ? (
                                            <div className="st-inline-edit">
                                                <input type="tel" value={tempValue} onChange={e => setTempValue(e.target.value)} autoFocus />
                                                <button className="st-save-icon-btn" onClick={() => handleEditSave('phone')}>✅</button>
                                                <button className="st-cancel-icon-btn" onClick={() => setEditingField(null)}>❌</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{accountDetails.phone}</span>
                                                <button className="st-edit-icon-btn" onClick={() => handleEditStart('phone', accountDetails.phone)}>✏️ Edit</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="st-info-item">
                                    <div className="st-info-label">Password</div>
                                    <div className="st-info-val">
                                        {!showChangePassword ? (
                                            <button className="st-change-pw-btn" onClick={() => setShowChangePassword(true)}>
                                                🔒 Change Password
                                            </button>
                                        ) : passwordSaved ? (
                                            <div className="st-pw-saved">✅ Password changed successfully!</div>
                                        ) : (
                                            <div className="st-pw-form">
                                                <div className="st-pw-field">
                                                    <label>Current Password</label>
                                                    <input type="password" placeholder="Enter current password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
                                                </div>
                                                <div className="st-pw-field">
                                                    <label>New Password</label>
                                                    <input type="password" placeholder="Enter new password" value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} />
                                                </div>
                                                <div className="st-pw-field">
                                                    <label>Confirm New Password</label>
                                                    <input type="password" placeholder="Confirm new password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                                                </div>
                                                <div className="st-pw-actions">
                                                    <button className="st-pw-save-btn" onClick={handlePasswordSave}>Save Password</button>
                                                    <button className="st-pw-cancel-btn" onClick={() => { setShowChangePassword(false); setPasswords({ current: '', newPass: '', confirm: '' }); }}>Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── Notification Preferences ─── */}
                        <div className="st-card" ref={notificationsRef}>
                            <div className="st-card-head">
                                <h2 className="st-card-title"><span>🔔</span> Notification Preferences</h2>
                            </div>
                            <div className="st-toggle-list">
                                <div className="st-toggle-row">
                                    <div><div className="st-toggle-label">Job Alerts</div><div className="st-toggle-desc">Get notified about new job matches</div></div>
                                    <ToggleSwitch checked={notifications.jobAlerts} onChange={() => toggleNotif('jobAlerts')} />
                                </div>
                                <div className="st-toggle-row">
                                    <div><div className="st-toggle-label">Application Updates</div><div className="st-toggle-desc">Status changes on your applications</div></div>
                                    <ToggleSwitch checked={notifications.applicationUpdates} onChange={() => toggleNotif('applicationUpdates')} />
                                </div>
                                <div className="st-toggle-row">
                                    <div><div className="st-toggle-label">Recruiter Messages</div><div className="st-toggle-desc">Direct messages from recruiters</div></div>
                                    <ToggleSwitch checked={notifications.recruiterMessages} onChange={() => toggleNotif('recruiterMessages')} />
                                </div>
                                <div className="st-toggle-row">
                                    <div><div className="st-toggle-label">Marketing Emails</div><div className="st-toggle-desc">Newsletters, tips, and promotional content</div></div>
                                    <ToggleSwitch checked={notifications.marketingEmails} onChange={() => toggleNotif('marketingEmails')} />
                                </div>
                            </div>
                        </div>

                        {/* ─── Privacy Settings ─── */}
                        <div className="st-card" ref={privacyRef}>
                            <div className="st-card-head">
                                <h2 className="st-card-title"><span>🔒</span> Privacy Settings</h2>
                            </div>
                            <div className="st-toggle-list">
                                <div className="st-toggle-row">
                                    <div><div className="st-toggle-label">Profile Visibility</div><div className="st-toggle-desc">Make your profile visible to recruiters</div></div>
                                    <ToggleSwitch checked={privacy.profileVisibility} onChange={() => togglePrivacy('profileVisibility')} />
                                </div>
                                <div className="st-toggle-row">
                                    <div><div className="st-toggle-label">Resume Visibility</div><div className="st-toggle-desc">Allow recruiters to view your resume</div></div>
                                    <ToggleSwitch checked={privacy.resumeVisibility} onChange={() => togglePrivacy('resumeVisibility')} />
                                </div>
                                <div className="st-toggle-row">
                                    <div><div className="st-toggle-label">Show Phone Number</div><div className="st-toggle-desc">Display your phone number on profile</div></div>
                                    <ToggleSwitch checked={privacy.showPhone} onChange={() => togglePrivacy('showPhone')} />
                                </div>
                                <div className="st-toggle-row">
                                    <div><div className="st-toggle-label">Show Email</div><div className="st-toggle-desc">Display your email address on profile</div></div>
                                    <ToggleSwitch checked={privacy.showEmail} onChange={() => togglePrivacy('showEmail')} />
                                </div>
                            </div>
                        </div>

                        {/* ─── Preferences ─── */}
                        <div className="st-card" ref={preferencesRef}>
                            <div className="st-card-head">
                                <h2 className="st-card-title"><span>⚙️</span> Preferences</h2>
                            </div>
                            <div className="st-pref-grid">
                                <div className="st-pref-field">
                                    <label>Preferred Job Role</label>
                                    <input value={preferences.preferredRole} onChange={e => setPref('preferredRole', e.target.value)} />
                                </div>
                                <div className="st-pref-field">
                                    <label>Preferred Location</label>
                                    <input value={preferences.preferredLocation} onChange={e => setPref('preferredLocation', e.target.value)} />
                                </div>
                                <div className="st-pref-field">
                                    <label>Salary Expectation</label>
                                    <input value={preferences.salaryExpectation} onChange={e => setPref('salaryExpectation', e.target.value)} />
                                </div>
                                <div className="st-pref-field" style={{ gridColumn: '1/-1' }}>
                                    <label>Work Mode Preference</label>
                                    <div className="st-radio-group">
                                        {[
                                            { value: 'remote', label: '🏠 Remote' },
                                            { value: 'hybrid', label: '🔄 Hybrid' },
                                            { value: 'onsite', label: '🏢 On-site' }
                                        ].map(opt => (
                                            <label key={opt.value} className={`st-radio-card ${preferences.workMode === opt.value ? 'st-radio-active' : ''}`}>
                                                <input type="radio" name="workMode" value={opt.value} checked={preferences.workMode === opt.value} onChange={() => setPref('workMode', opt.value)} />
                                                <span>{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── Danger Zone ─── */}
                        <div className="st-card st-danger-card" ref={dangerRef}>
                            <div className="st-card-head">
                                <h2 className="st-card-title" style={{ color: '#dc2626' }}><span>⚠️</span> Danger Zone</h2>
                            </div>
                            <div className="st-danger-grid">
                                <div className="st-danger-item">
                                    <div>
                                        <div className="st-danger-label">Deactivate Account</div>
                                        <div className="st-danger-desc">Temporarily hide your profile. You can reactivate later.</div>
                                    </div>
                                    {!showDeactivateConfirm ? (
                                        <button className="st-danger-btn st-deactivate-btn" onClick={() => setShowDeactivateConfirm(true)}>Deactivate</button>
                                    ) : (
                                        <div className="st-confirm-actions">
                                            <span className="st-confirm-text">Are you sure?</span>
                                            <button className="st-danger-btn st-deactivate-btn" onClick={() => { alert('Account deactivated (UI only)'); setShowDeactivateConfirm(false); }}>Yes</button>
                                            <button className="st-outline-btn-sm" onClick={() => setShowDeactivateConfirm(false)}>No</button>
                                        </div>
                                    )}
                                </div>
                                <div className="st-danger-item">
                                    <div>
                                        <div className="st-danger-label">Delete Account</div>
                                        <div className="st-danger-desc">Permanently delete your account and all data. This cannot be undone.</div>
                                    </div>
                                    {!showDeleteConfirm ? (
                                        <button className="st-danger-btn st-delete-btn" onClick={() => setShowDeleteConfirm(true)}>Delete Account</button>
                                    ) : (
                                        <div className="st-confirm-actions">
                                            <span className="st-confirm-text">This is permanent!</span>
                                            <button className="st-danger-btn st-delete-btn" onClick={() => { alert('Account deleted (UI only)'); setShowDeleteConfirm(false); }}>Yes, Delete</button>
                                            <button className="st-outline-btn-sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ─── Sidebar ─── */}
                    <div className="st-sidebar">
                        <div className="st-card st-sidebar-widget">
                            <h3 className="st-widget-title">Quick Navigation</h3>
                            <nav className="st-nav-list">
                                <button className="st-nav-item" onClick={() => scrollTo(accountRef)}>👤 Account</button>
                                <button className="st-nav-item" onClick={() => scrollTo(notificationsRef)}>🔔 Notifications</button>
                                <button className="st-nav-item" onClick={() => scrollTo(privacyRef)}>🔒 Privacy</button>
                                <button className="st-nav-item" onClick={() => scrollTo(preferencesRef)}>⚙️ Preferences</button>
                                <button className="st-nav-item" onClick={() => scrollTo(dangerRef)} style={{ color: '#dc2626' }}>⚠️ Danger Zone</button>
                            </nav>
                        </div>
                        <div className="st-card st-sidebar-widget">
                            <h3 className="st-widget-title">Need Help?</h3>
                            <p style={{ fontSize: '.85rem', color: '#6b7280', lineHeight: 1.5, marginBottom: 12 }}>
                                Having trouble with your settings? Our support team is here to help.
                            </p>
                            <a href="/help" className="st-help-btn">📧 Contact Support</a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{settingsStyles}</style>
        </div>
    );
}

const settingsStyles = `
.st-page { min-height:100vh; background:#f8faff; padding-top:90px; padding-bottom:60px; }
.st-container { max-width:1100px; margin:0 auto; padding:24px; }
.st-header { margin-bottom:28px; }
.st-title { font-size:1.8rem; font-weight:800; color:#111827; margin-bottom:6px; }
.st-subtitle { font-size:.92rem; color:#6b7280; }
.st-layout { display:grid; grid-template-columns:1fr 280px; gap:20px; align-items:start; }
.st-main { display:flex; flex-direction:column; gap:20px; }
.st-sidebar { display:flex; flex-direction:column; gap:16px; position:sticky; top:100px; }
.st-card { background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:26px; transition:box-shadow .2s; }
.st-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.06); }
.st-card-head { margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid #f3f4f6; }
.st-card-title { display:flex; align-items:center; gap:9px; font-size:1rem; font-weight:700; color:#111827; }
.st-info-grid { display:flex; flex-direction:column; gap:18px; }
.st-info-item { display:flex; flex-direction:column; gap:6px; }
.st-info-label { font-size:.72rem; color:#9ca3af; text-transform:uppercase; letter-spacing:.05em; font-weight:600; }
.st-info-val { font-size:.9rem; font-weight:600; color:#374151; }
.st-info-val-row { display:flex; align-items:center; gap:12px; font-size:.9rem; font-weight:600; color:#374151; height:32px; }
.st-edit-icon-btn { display:inline-flex; align-items:center; gap:4px; padding:4px 8px; font-size:.75rem; color:#4f46e5; background:#eef2ff; border:none; border-radius:6px; cursor:pointer; font-weight:600; transition:background .2s; }
.st-edit-icon-btn:hover { background:#e0e7ff; }
.st-inline-edit { display:flex; align-items:center; gap:6px; }
.st-inline-edit input { padding:6px 10px; border:1.5px solid #c7d2fe; border-radius:6px; font-size:.85rem; color:#374151; outline:none; }
.st-inline-edit input:focus { border-color:#4f46e5; }
.st-save-icon-btn, .st-cancel-icon-btn { display:flex; align-items:center; justify-content:center; width:28px; height:28px; border:none; border-radius:6px; cursor:pointer; font-size:.85rem; }
.st-save-icon-btn { background:#dcfce7; color:#166534; }
.st-save-icon-btn:hover { background:#bbf7d0; }
.st-cancel-icon-btn { background:#fee2e2; color:#991b1b; }
.st-cancel-icon-btn:hover { background:#fecaca; }
/* Change Password */
.st-change-pw-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; background:#eef2ff; color:#4f46e5; border:1.5px solid #c7d2fe; border-radius:8px; font-size:.85rem; font-weight:600; cursor:pointer; transition:all .2s; }
.st-change-pw-btn:hover { background:#4f46e5; color:#fff; }
.st-pw-form { display:flex; flex-direction:column; gap:12px; margin-top:8px; max-width:360px; }
.st-pw-field { display:flex; flex-direction:column; gap:4px; }
.st-pw-field label { font-size:.75rem; font-weight:600; color:#6b7280; }
.st-pw-field input { padding:9px 12px; border:1.5px solid #e5e7eb; border-radius:8px; font-size:.85rem; color:#374151; background:#fafafa; outline:none; font-family:inherit; transition:border-color .2s; }
.st-pw-field input:focus { border-color:#4f46e5; background:#fff; }
.st-pw-actions { display:flex; gap:8px; margin-top:4px; }
.st-pw-save-btn { padding:9px 18px; background:#4f46e5; color:#fff; border:none; border-radius:8px; font-size:.82rem; font-weight:600; cursor:pointer; transition:background .2s; }
.st-pw-save-btn:hover { background:#3730a3; }
.st-pw-cancel-btn { padding:9px 14px; background:#fff; color:#6b7280; border:1px solid #e5e7eb; border-radius:8px; font-size:.82rem; font-weight:500; cursor:pointer; transition:all .2s; }
.st-pw-cancel-btn:hover { background:#f3f4f6; }
.st-pw-saved { color:#059669; font-weight:600; font-size:.88rem; padding:8px 0; }
/* Toggles */
.st-toggle-list { display:flex; flex-direction:column; gap:4px; }
.st-toggle-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid #f9fafb; }
.st-toggle-row:last-child { border-bottom:none; }
.st-toggle-label { font-size:.9rem; font-weight:600; color:#374151; margin-bottom:2px; }
.st-toggle-desc { font-size:.78rem; color:#9ca3af; }
.st-toggle { position:relative; width:44px; height:24px; border-radius:12px; background:#e5e7eb; border:none; cursor:pointer; transition:background .2s; flex-shrink:0; }
.st-toggle-on { background:#4f46e5; }
.st-toggle-knob { position:absolute; top:2px; left:2px; width:20px; height:20px; border-radius:50%; background:#fff; transition:transform .2s; box-shadow:0 1px 3px rgba(0,0,0,.15); }
.st-toggle-on .st-toggle-knob { transform:translateX(20px); }
.st-outline-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; background:#fff; color:#4f46e5; border:1.5px solid #c7d2fe; border-radius:8px; font-size:.85rem; font-weight:600; cursor:pointer; transition:all .2s; }
.st-outline-btn:hover { background:#eef2ff; }
/* Preferences */
.st-pref-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.st-pref-field { display:flex; flex-direction:column; gap:5px; }
.st-pref-field label { font-size:.78rem; font-weight:600; color:#6b7280; }
.st-pref-field input { padding:9px 12px; border:1.5px solid #e5e7eb; border-radius:8px; font-size:.875rem; color:#374151; background:#fafafa; outline:none; font-family:inherit; transition:border-color .2s; }
.st-pref-field input:focus { border-color:#4f46e5; background:#fff; }
.st-radio-group { display:flex; gap:10px; margin-top:4px; }
.st-radio-card { display:flex; align-items:center; gap:6px; padding:10px 18px; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:10px; cursor:pointer; font-size:.85rem; font-weight:600; color:#6b7280; transition:all .2s; }
.st-radio-card:hover { border-color:#c7d2fe; color:#4f46e5; }
.st-radio-active { border-color:#4f46e5; background:#eef2ff; color:#4f46e5; }
.st-radio-card input { display:none; }
/* Danger Zone */
.st-danger-card { border-color:#fecaca; }
.st-danger-grid { display:flex; flex-direction:column; gap:20px; }
.st-danger-item { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.st-danger-label { font-size:.9rem; font-weight:600; color:#374151; margin-bottom:2px; }
.st-danger-desc { font-size:.78rem; color:#9ca3af; max-width:400px; }
.st-danger-btn { padding:8px 18px; border:none; border-radius:8px; font-size:.82rem; font-weight:600; cursor:pointer; transition:all .2s; }
.st-deactivate-btn { background:#fffbeb; color:#92400e; border:1.5px solid #fde68a; }
.st-deactivate-btn:hover { background:#fef3c7; }
.st-delete-btn { background:#fff1f2; color:#dc2626; border:1.5px solid #fecaca; }
.st-delete-btn:hover { background:#fee2e2; }
.st-confirm-actions { display:flex; align-items:center; gap:8px; }
.st-confirm-text { font-size:.82rem; font-weight:600; color:#dc2626; }
.st-outline-btn-sm { padding:6px 14px; background:#fff; border:1px solid #e5e7eb; border-radius:6px; font-size:.78rem; font-weight:500; cursor:pointer; color:#6b7280; transition:all .2s; }
.st-outline-btn-sm:hover { background:#f3f4f6; }
/* Sidebar */
.st-sidebar-widget { padding:20px; }
.st-widget-title { font-size:.85rem; font-weight:700; color:#111827; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid #f3f4f6; }
.st-nav-list { display:flex; flex-direction:column; gap:4px; }
.st-nav-item { display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:8px; text-decoration:none; color:#374151; font-size:.85rem; font-weight:500; transition:all .15s; border:none; background:none; cursor:pointer; width:100%; text-align:left; }
.st-nav-item:hover { background:#eef2ff; color:#4f46e5; }
.st-help-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; background:#4f46e5; color:#fff; border-radius:8px; font-size:.82rem; font-weight:600; text-decoration:none; transition:background .2s; }
.st-help-btn:hover { background:#3730a3; }
@media(max-width:900px) { .st-layout{grid-template-columns:1fr;} .st-sidebar{position:static;flex-direction:row;flex-wrap:wrap;} .st-sidebar-widget{flex:1;min-width:240px;} }
@media(max-width:600px) { .st-pref-grid{grid-template-columns:1fr;} .st-radio-group{flex-direction:column;} .st-danger-item{flex-direction:column;align-items:flex-start;} }
`;
