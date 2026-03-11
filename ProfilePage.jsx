import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockEmployeeProfile } from '../data/employeeProfileData';

/* ─── Reusable Icon Buttons ─── */
function EditIcon({ onClick }) {
    return (
        <button className="pp-edit-btn" onClick={onClick} title="Edit"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>

        </button>
    );
}

function DeleteIcon({ onClick }) {
    return (
        <button className="pp-delete-btn" onClick={onClick} title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    );
}

function Modal({ title, onClose, children }) {
    return (
        <div className="pp-modal-overlay" onClick={onClose}>
            <div className="pp-modal" onClick={e => e.stopPropagation()}>
                <div className="pp-modal-header">
                    <h3>{title}</h3>
                    <button className="pp-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="pp-modal-body">{children}</div>
            </div>
        </div>
    );
}

/* ─── Main ProfilePage Component ─── */
export default function ProfilePage() {
    const [searchParams] = useSearchParams();
    const startInEdit = searchParams.get('edit') === 'true';

    const [profile, setProfile] = useState({ ...mockEmployeeProfile });
    const [isEditing, setIsEditing] = useState(startInEdit);
    const [editData, setEditData] = useState({ ...mockEmployeeProfile });
    const [newSkill, setNewSkill] = useState('');
    const [newCert, setNewCert] = useState('');
    const [modal, setModal] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const resumeRef = useRef(null);
    const photoRef = useRef(null);

    // Profile completion calculation
    const completionItems = [
        !!profile.name, !!profile.email, !!profile.resume,
        profile.skills.length > 0, profile.education.length > 0,
        profile.employment.length > 0, profile.projects.length > 0,
        !!profile.professional.overallExperience, !!profile.linkedinUrl,
        profile.certifications.length > 0
    ];
    const completionPercent = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);
    const circumference = 2 * Math.PI * 38;
    const offset = circumference - (completionPercent / 100) * circumference;
    const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    // ─── Edit mode handlers ───
    const startEditing = () => { setEditData({ ...profile }); setIsEditing(true); };
    const cancelEditing = () => setIsEditing(false);
    const saveAll = () => { setProfile({ ...editData }); setIsEditing(false); };
    const setEdit = (key, val) => setEditData(d => ({ ...d, [key]: val }));
    const setProfEdit = (key, val) => setEditData(d => ({ ...d, professional: { ...d.professional, [key]: val } }));

    // Resume
    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (isEditing) setEditData(d => ({ ...d, resume: file.name }));
            else setProfile(p => ({ ...p, resume: file.name }));
        }
    };

    // Profile Photo
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setProfilePhoto(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Skills
    const removeSkill = (skill) => {
        if (isEditing) setEditData(d => ({ ...d, skills: d.skills.filter(s => s !== skill) }));
        else setProfile(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
    };
    const addSkill = () => {
        const s = newSkill.trim();
        if (!s) return;
        if (isEditing) {
            if (!editData.skills.includes(s)) setEditData(d => ({ ...d, skills: [...d.skills, s] }));
        } else {
            if (!profile.skills.includes(s)) setProfile(p => ({ ...p, skills: [...p.skills, s] }));
        }
        setNewSkill('');
    };

    // Certification add/remove
    const addCert = () => {
        const c = newCert.trim();
        if (!c) return;
        if (isEditing) {
            if (!editData.certifications.includes(c)) setEditData(d => ({ ...d, certifications: [...d.certifications, c] }));
        } else {
            if (!profile.certifications.includes(c)) setProfile(p => ({ ...p, certifications: [...p.certifications, c] }));
        }
        setNewCert('');
    };
    const removeCert = (cert) => {
        if (isEditing) setEditData(d => ({ ...d, certifications: d.certifications.filter(c => c !== cert) }));
        else setProfile(p => ({ ...p, certifications: p.certifications.filter(c => c !== cert) }));
    };

    // Education CRUD
    const addEducation = (form) => { setProfile(p => ({ ...p, education: [...p.education, { ...form, id: Date.now() }] })); setModal(null); };
    const editEducation = (form) => { setProfile(p => ({ ...p, education: p.education.map(e => e.id === modal.data.id ? { ...e, ...form } : e) })); setModal(null); };
    const deleteEducation = (id) => { if (window.confirm('Delete this education entry?')) setProfile(p => ({ ...p, education: p.education.filter(e => e.id !== id) })); };

    // Employment CRUD
    const addEmployment = (form) => { setProfile(p => ({ ...p, employment: [...p.employment, { ...form, id: Date.now() }] })); setModal(null); };
    const editEmployment = (form) => { setProfile(p => ({ ...p, employment: p.employment.map(e => e.id === modal.data.id ? { ...e, ...form } : e) })); setModal(null); };
    const deleteEmployment = (id) => { if (window.confirm('Delete this employment entry?')) setProfile(p => ({ ...p, employment: p.employment.filter(e => e.id !== id) })); };

    // Project CRUD
    const addProject = (form) => { setProfile(p => ({ ...p, projects: [...p.projects, { ...form, id: Date.now() }] })); setModal(null); };
    const editProject = (form) => { setProfile(p => ({ ...p, projects: p.projects.map(pr => pr.id === modal.data.id ? { ...pr, ...form } : pr) })); setModal(null); };
    const deleteProject = (id) => { if (window.confirm('Delete this project?')) setProfile(p => ({ ...p, projects: p.projects.filter(pr => pr.id !== id) })); };

    const data = isEditing ? editData : profile;

    return (
        <div className="pp-page">
            <div className="pp-container">

                {/* ─── Hero Card ─── */}
                <div className="pp-card pp-hero-card">
                    <div className="pp-hero-bg"></div>
                    <div className="pp-hero-content">
                        <div className="pp-avatar-ring">
                            <svg className="pp-ring-svg" width="96" height="96" viewBox="0 0 96 96">
                                <circle cx="48" cy="48" r="38" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                                <circle cx="48" cy="48" r="38" fill="none" stroke="url(#ppGrad)" strokeWidth="5"
                                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                                    transform="rotate(-90 48 48)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                                <defs><linearGradient id="ppGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
                            </svg>
                            {profilePhoto ? (
                                <img src={profilePhoto} alt="Profile" className="pp-avatar-img" />
                            ) : (
                                <div className="pp-avatar-inner">{initials}</div>
                            )}
                        </div>
                        <div className="pp-hero-info">
                            <h1 className="pp-hero-name">{data.name}</h1>
                            <p className="pp-hero-role">{data.preferredRole} · {data.totalExperience} Experience</p>
                            <div className="pp-hero-loc">📍 {data.location}</div>
                        </div>
                        <div className="pp-completion-info">
                            <div className="pp-comp-percent">{completionPercent}%</div>
                            <div className="pp-comp-label">Profile complete</div>
                            <div className="pp-comp-tip">Add more details to improve visibility</div>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="pp-hero-actions">
                        {!isEditing ? (
                            <>
                                <button className="pp-hero-btn pp-hero-btn-primary" onClick={startEditing}>
                                    ✏️ Edit Profile
                                </button>
                                <button className="pp-hero-btn pp-hero-btn-outline" onClick={() => photoRef.current.click()}>
                                    📷 Change Photo
                                </button>
                                {profilePhoto && (
                                    <button className="pp-hero-btn" style={{ background: '#fff1f2', color: '#be123c', border: '1.5px solid #fecaca' }} onClick={() => setProfilePhoto(null)}>
                                        🗑️ Remove
                                    </button>
                                )}
                                <input type="file" accept="image/*" ref={photoRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
                            </>
                        ) : (
                            <>
                                <button className="pp-hero-btn pp-hero-btn-primary" onClick={saveAll}>
                                    ✅ Save Changes
                                </button>
                                <button className="pp-hero-btn pp-hero-btn-outline" onClick={cancelEditing}>
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="pp-layout">
                    <div className="pp-main">

                        {/* ─── Basic Details ─── */}
                        <div className="pp-card">
                            <div className="pp-card-header">
                                <h2 className="pp-card-title"><span className="pp-card-icon">👤</span> Basic Details</h2>
                            </div>
                            {isEditing ? (
                                <div className="pp-form-grid">
                                    <div className="pp-form-field"><label>Full Name</label><input value={editData.name} onChange={e => setEdit('name', e.target.value)} /></div>
                                    <div className="pp-form-field"><label>Email</label><input type="email" value={editData.email} onChange={e => setEdit('email', e.target.value)} placeholder="e.g. yourname@gmail.com" /></div>
                                    <div className="pp-form-field"><label>Phone</label><input value={editData.phone} onChange={e => setEdit('phone', e.target.value)} /></div>
                                    <div className="pp-form-field"><label>Location</label><input value={editData.location || editData.address} onChange={e => setEdit('location', e.target.value)} /></div>
                                    <div className="pp-form-field"><label>Gender</label>
                                        <select value={editData.gender} onChange={e => setEdit('gender', e.target.value)}>
                                            <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="pp-form-field"><label>Date of Birth</label><input type="date" value={editData.dob} onChange={e => setEdit('dob', e.target.value)} /></div>
                                </div>
                            ) : (
                                <div className="pp-info-grid">
                                    <div className="pp-info-item"><span className="pp-info-icon">✉️</span><div><div className="pp-info-label">Email</div><div className="pp-info-val">{data.email}</div></div></div>
                                    <div className="pp-info-item"><span className="pp-info-icon">📱</span><div><div className="pp-info-label">Phone</div><div className="pp-info-val">{data.phone}</div></div></div>
                                    <div className="pp-info-item"><span className="pp-info-icon">📍</span><div><div className="pp-info-label">Location</div><div className="pp-info-val">{data.location}</div></div></div>
                                    <div className="pp-info-item"><span className="pp-info-icon">⚧</span><div><div className="pp-info-label">Gender</div><div className="pp-info-val">{data.gender || '—'}</div></div></div>
                                    <div className="pp-info-item"><span className="pp-info-icon">🎂</span><div><div className="pp-info-label">Date of Birth</div><div className="pp-info-val">{data.dob || '—'}</div></div></div>
                                </div>
                            )}
                        </div>

                        {/* ─── Resume ─── */}
                        <div className="pp-card">
                            <div className="pp-card-header">
                                <h2 className="pp-card-title"><span className="pp-card-icon">📄</span> Resume</h2>
                            </div>
                            <div className="pp-resume-box">
                                <div className="pp-resume-file">
                                    <div className="pp-resume-icon">📎</div>
                                    <div>
                                        <div className="pp-resume-name">{data.resume}</div>
                                        <div className="pp-resume-meta">PDF · Updated recently</div>
                                    </div>
                                </div>
                                <div className="pp-resume-actions">
                                    <input type="file" accept=".pdf,.doc,.docx" ref={resumeRef} onChange={handleResumeUpload} style={{ display: 'none' }} />
                                    <button className="pp-upload-btn" onClick={() => resumeRef.current.click()}>⬆ Upload New</button>
                                    <button className="pp-upload-btn pp-view-btn">👁️ View</button>
                                    <button className="pp-upload-btn pp-download-btn">⬇ Download</button>
                                </div>
                            </div>
                        </div>

                        {/* ─── Key Skills ─── */}
                        <div className="pp-card">
                            <div className="pp-card-header">
                                <h2 className="pp-card-title"><span className="pp-card-icon">🛠️</span> Key Skills</h2>
                            </div>
                            <div className="pp-skills-wrap">
                                {data.skills.map(skill => (
                                    <span key={skill} className="pp-skill-chip">
                                        {skill}
                                        <button className="pp-skill-remove" onClick={() => removeSkill(skill)}>×</button>
                                    </span>
                                ))}
                            </div>
                            <div className="pp-add-skill">
                                <input className="pp-skill-input" placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} />
                                <button className="pp-add-skill-btn" onClick={addSkill}>Add</button>
                            </div>
                        </div>

                        {/* ─── Education ─── */}
                        <div className="pp-card">
                            <div className="pp-card-header">
                                <h2 className="pp-card-title"><span className="pp-card-icon">🎓</span> Education</h2>
                            </div>
                            <div className="pp-timeline">
                                {profile.education.map((edu, i) => (
                                    <div key={edu.id} className="pp-timeline-item">
                                        <div className="pp-timeline-dot"></div>
                                        {i < profile.education.length - 1 && <div className="pp-timeline-line"></div>}
                                        <div className="pp-timeline-content">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div className="pp-emp-role">{edu.degree}</div>
                                                    <span className="pp-emp-company-badge">{edu.institution}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <EditIcon onClick={() => setModal({ type: 'editEdu', data: edu })} />
                                                    <DeleteIcon onClick={() => deleteEducation(edu.id)} />
                                                </div>
                                            </div>
                                            <div className="pp-emp-duration">Passing Year: {edu.passingYear} · CGPA: {edu.cgpa}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="pp-add-new-btn" onClick={() => setModal({ type: 'addEdu' })}>+ Add Education</button>
                        </div>

                        {/* ─── Employment ─── */}
                        <div className="pp-card">
                            <div className="pp-card-header">
                                <h2 className="pp-card-title"><span className="pp-card-icon">💼</span> Employment Details</h2>
                            </div>
                            <div className="pp-timeline">
                                {profile.employment.map((emp, i) => (
                                    <div key={emp.id} className="pp-timeline-item">
                                        <div className="pp-timeline-dot"></div>
                                        {i < profile.employment.length - 1 && <div className="pp-timeline-line"></div>}
                                        <div className="pp-timeline-content">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div className="pp-emp-role">{emp.role}</div>
                                                    <span className="pp-emp-company-badge">{emp.company}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <EditIcon onClick={() => setModal({ type: 'editEmp', data: emp })} />
                                                    <DeleteIcon onClick={() => deleteEmployment(emp.id)} />
                                                </div>
                                            </div>
                                            <div className="pp-emp-duration">{emp.duration}</div>
                                            <p className="pp-emp-desc">{emp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="pp-add-new-btn" onClick={() => setModal({ type: 'addEmp' })}>+ Add Employment</button>
                        </div>

                        {/* ─── Projects ─── */}
                        <div className="pp-card">
                            <div className="pp-card-header">
                                <h2 className="pp-card-title"><span className="pp-card-icon">🚀</span> Projects</h2>
                            </div>
                            <div className="pp-projects-list">
                                {profile.projects.map(proj => (
                                    <div key={proj.id} className="pp-project-card">
                                        <div className="pp-project-header">
                                            <div>
                                                <h4 className="pp-project-name">{proj.name}</h4>
                                                <div className="pp-project-techs">
                                                    {(proj.technologies || proj.tech.split(', ')).map(t => (
                                                        <span key={t} className="pp-project-tech">{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <EditIcon onClick={() => setModal({ type: 'editProj', data: proj })} />
                                                <DeleteIcon onClick={() => deleteProject(proj.id)} />
                                            </div>
                                        </div>
                                        <p className="pp-project-desc">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="pp-add-new-btn" onClick={() => setModal({ type: 'addProj' })}>+ Add Project</button>
                        </div>

                        {/* ─── Professional Details ─── */}
                        <div className="pp-card">
                            <div className="pp-card-header">
                                <h2 className="pp-card-title"><span className="pp-card-icon">📊</span> Professional Details</h2>
                            </div>
                            {isEditing ? (
                                <div className="pp-form-grid">
                                    <div className="pp-form-field"><label>Overall Experience (Years)</label><input type="number" value={editData.professional.overallExperience} onChange={e => setProfEdit('overallExperience', e.target.value)} /></div>
                                    <div className="pp-form-field"><label>Relevant Experience (Years)</label><input type="number" value={editData.professional.relevantExperience} onChange={e => setProfEdit('relevantExperience', e.target.value)} /></div>
                                    <div className="pp-form-field"><label>Current CTC (LPA)</label><input type="number" value={editData.professional.currentCTC} onChange={e => setProfEdit('currentCTC', e.target.value)} /></div>
                                    <div className="pp-form-field"><label>Expected CTC (LPA)</label><input type="number" value={editData.professional.expectedCTC} onChange={e => setProfEdit('expectedCTC', e.target.value)} /></div>
                                    <div className="pp-form-field" style={{ gridColumn: '1/-1' }}>
                                        <label>Notice Period</label>
                                        <select value={editData.professional.noticePeriod} onChange={e => setProfEdit('noticePeriod', e.target.value)}>
                                            <option value="Immediate">Immediate</option><option value="15 Days">15 Days</option><option value="30 Days">30 Days</option><option value="60 Days">60 Days</option><option value="90 Days">90 Days</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="pp-prof-grid">
                                    <div className="pp-prof-item"><div className="pp-prof-label">Overall Experience</div><div className="pp-prof-val">{data.professional.overallExperience} Years</div></div>
                                    <div className="pp-prof-item"><div className="pp-prof-label">Relevant Experience</div><div className="pp-prof-val">{data.professional.relevantExperience} Years</div></div>
                                    <div className="pp-prof-item"><div className="pp-prof-label">Current CTC</div><div className="pp-prof-val">₹{data.professional.currentCTC} LPA</div></div>
                                    <div className="pp-prof-item"><div className="pp-prof-label">Expected CTC</div><div className="pp-prof-val">₹{data.professional.expectedCTC} LPA</div></div>
                                    <div className="pp-prof-item"><div className="pp-prof-label">Notice Period</div><div className="pp-prof-val">{data.professional.noticePeriod}</div></div>
                                </div>
                            )}
                        </div>

                        {/* ─── Certifications & Links ─── */}
                        <div className="pp-card">
                            <div className="pp-card-header">
                                <h2 className="pp-card-title"><span className="pp-card-icon">🏆</span> Certifications & Links</h2>
                            </div>
                            {isEditing ? (
                                <div className="pp-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                    <div className="pp-form-field">
                                        <label>Certifications</label>
                                        <div className="pp-skills-wrap" style={{ marginBottom: 8 }}>
                                            {editData.certifications.map(c => (
                                                <span key={c} className="pp-cert-chip">
                                                    {c}
                                                    <button className="pp-skill-remove" onClick={() => removeCert(c)}>×</button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pp-add-skill">
                                            <input className="pp-skill-input" placeholder="Add a certification..." value={newCert} onChange={e => setNewCert(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCert()} />
                                            <button className="pp-add-skill-btn" onClick={addCert}>+ Add</button>
                                        </div>
                                    </div>
                                    <div className="pp-form-field"><label>LinkedIn URL</label><input value={editData.linkedinUrl} onChange={e => setEdit('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
                                    <div className="pp-form-field"><label>GitHub URL</label><input value={editData.githubUrl} onChange={e => setEdit('githubUrl', e.target.value)} placeholder="https://github.com/..." /></div>
                                    <div className="pp-form-field"><label>Portfolio URL</label><input value={editData.portfolioUrl} onChange={e => setEdit('portfolioUrl', e.target.value)} placeholder="https://..." /></div>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ marginBottom: 16 }}>
                                        <div className="pp-info-label" style={{ marginBottom: 8 }}>CERTIFICATIONS</div>
                                        <div className="pp-skills-wrap">
                                            {data.certifications.map(c => (
                                                <span key={c} className="pp-cert-chip">
                                                    {c}
                                                    <button className="pp-skill-remove" onClick={() => removeCert(c)}>×</button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pp-add-skill" style={{ marginTop: 8 }}>
                                            <input className="pp-skill-input" placeholder="Add a certification..." value={newCert} onChange={e => setNewCert(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCert()} />
                                            <button className="pp-add-skill-btn" onClick={addCert}>+ Add</button>
                                        </div>
                                    </div>
                                    <div className="pp-links-grid">
                                        {data.linkedinUrl && (
                                            <a href={data.linkedinUrl} target="_blank" rel="noreferrer" className="pp-link-card">
                                                <span>🔗</span> LinkedIn
                                            </a>
                                        )}
                                        {data.githubUrl && (
                                            <a href={data.githubUrl} target="_blank" rel="noreferrer" className="pp-link-card">
                                                <span>💻</span> GitHub
                                            </a>
                                        )}
                                        {data.portfolioUrl && (
                                            <a href={data.portfolioUrl} target="_blank" rel="noreferrer" className="pp-link-card">
                                                <span>🌐</span> Portfolio
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* ─── Sidebar ─── */}
                    <div className="pp-sidebar">
                        <div className="pp-card pp-sidebar-widget">
                            <h3 className="pp-widget-title">Profile Strength</h3>
                            <div className="pp-strength-list">
                                {[
                                    { label: 'Basic Details', done: !!profile.name },
                                    { label: 'Resume Uploaded', done: !!profile.resume },
                                    { label: 'Key Skills', done: profile.skills.length > 0 },
                                    { label: 'Education', done: profile.education.length > 0 },
                                    { label: 'Employment Details', done: profile.employment.length > 0 },
                                    { label: 'Projects Added', done: profile.projects.length > 0 },
                                    { label: 'Professional Details', done: !!profile.professional.overallExperience },
                                    { label: 'Certifications', done: profile.certifications.length > 0 },
                                    { label: 'Social Links', done: !!profile.linkedinUrl },
                                ].map(item => (
                                    <div key={item.label} className={`pp-strength-item ${item.done ? 'done' : ''}`}>
                                        <span className="pp-strength-check">{item.done ? '✓' : '○'}</span>{item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pp-card pp-sidebar-widget">
                            <h3 className="pp-widget-title">Performance This Week</h3>
                            <div className="pp-perf-list">
                                <div className="pp-perf-row"><span>Profile Views</span><span className="pp-perf-num">24</span></div>
                                <div className="pp-perf-row"><span>Search Appearances</span><span className="pp-perf-num">142</span></div>
                                <div className="pp-perf-row"><span>Recruiter Actions</span><span className="pp-perf-num">18</span></div>
                                <div className="pp-perf-row"><span>Job Matches</span><span className="pp-perf-num">8</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Modals ─── */}
            {modal?.type === 'addEdu' && <Modal title="Add Education" onClose={() => setModal(null)}><EduForm onSave={addEducation} onClose={() => setModal(null)} /></Modal>}
            {modal?.type === 'editEdu' && <Modal title="Edit Education" onClose={() => setModal(null)}><EduForm initial={modal.data} onSave={editEducation} onClose={() => setModal(null)} /></Modal>}
            {modal?.type === 'addEmp' && <Modal title="Add Employment" onClose={() => setModal(null)}><EmpForm onSave={addEmployment} onClose={() => setModal(null)} /></Modal>}
            {modal?.type === 'editEmp' && <Modal title="Edit Employment" onClose={() => setModal(null)}><EmpForm initial={modal.data} onSave={editEmployment} onClose={() => setModal(null)} /></Modal>}
            {modal?.type === 'addProj' && <Modal title="Add Project" onClose={() => setModal(null)}><ProjForm onSave={addProject} onClose={() => setModal(null)} /></Modal>}
            {modal?.type === 'editProj' && <Modal title="Edit Project" onClose={() => setModal(null)}><ProjForm initial={modal.data} onSave={editProject} onClose={() => setModal(null)} /></Modal>}

            <style>{profileStyles}</style>
        </div >
    );
}

/* ─── Education Form ─── */
function EduForm({ initial = {}, onSave, onClose }) {
    const [f, setF] = useState({ institution: initial.institution || '', degree: initial.degree || '', cgpa: initial.cgpa || '', passingYear: initial.passingYear || '' });
    const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));
    return (
        <>
            <div className="pp-form-grid">
                <div className="pp-form-field" style={{ gridColumn: '1/-1' }}><label>Institution *</label><input placeholder="e.g. IIT Bangalore" value={f.institution} onChange={set('institution')} /></div>
                <div className="pp-form-field"><label>Degree *</label><input placeholder="e.g. B.Tech CS" value={f.degree} onChange={set('degree')} /></div>
                <div className="pp-form-field"><label>CGPA / Percentage</label><input placeholder="e.g. 8.5" value={f.cgpa} onChange={set('cgpa')} /></div>
                <div className="pp-form-field"><label>Passing Year</label><input placeholder="e.g. 2023" value={f.passingYear} onChange={set('passingYear')} /></div>
            </div>
            <div className="pp-edit-actions" style={{ marginTop: 14 }}>
                <button className="pp-save-btn" onClick={() => { if (!f.institution || !f.degree) return alert('Fill required fields'); onSave(f); }}>Save</button>
                <button className="pp-cancel-btn" onClick={onClose}>Cancel</button>
            </div>
        </>
    );
}

/* ─── Employment Form ─── */
function EmpForm({ initial = {}, onSave, onClose }) {
    const [f, setF] = useState({ company: initial.company || '', role: initial.role || '', duration: initial.duration || '', description: initial.description || '' });
    const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));
    return (
        <>
            <div className="pp-form-grid">
                <div className="pp-form-field"><label>Company *</label><input placeholder="e.g. Google" value={f.company} onChange={set('company')} /></div>
                <div className="pp-form-field"><label>Role *</label><input placeholder="e.g. Frontend Developer" value={f.role} onChange={set('role')} /></div>
                <div className="pp-form-field" style={{ gridColumn: '1/-1' }}><label>Duration *</label><input placeholder="e.g. Jan 2023 – Present" value={f.duration} onChange={set('duration')} /></div>
                <div className="pp-form-field" style={{ gridColumn: '1/-1' }}><label>Description</label><textarea rows={3} placeholder="Key responsibilities..." value={f.description} onChange={set('description')} /></div>
            </div>
            <div className="pp-edit-actions" style={{ marginTop: 14 }}>
                <button className="pp-save-btn" onClick={() => { if (!f.company || !f.role || !f.duration) return alert('Fill required fields'); onSave(f); }}>Save</button>
                <button className="pp-cancel-btn" onClick={onClose}>Cancel</button>
            </div>
        </>
    );
}

/* ─── Project Form ─── */
function ProjForm({ initial = {}, onSave, onClose }) {
    const [f, setF] = useState({ name: initial.name || '', tech: initial.tech || '', description: initial.description || '' });
    const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));
    return (
        <>
            <div className="pp-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="pp-form-field"><label>Project Name *</label><input placeholder="e.g. Chat App" value={f.name} onChange={set('name')} /></div>
                <div className="pp-form-field"><label>Tech Stack *</label><input placeholder="e.g. React, Node.js" value={f.tech} onChange={set('tech')} /></div>
                <div className="pp-form-field"><label>Description</label><textarea rows={3} placeholder="What did you build?" value={f.description} onChange={set('description')} /></div>
            </div>
            <div className="pp-edit-actions" style={{ marginTop: 14 }}>
                <button className="pp-save-btn" onClick={() => { if (!f.name || !f.tech) return alert('Fill required fields'); onSave(f); }}>Save</button>
                <button className="pp-cancel-btn" onClick={onClose}>Cancel</button>
            </div>
        </>
    );
}

/* ─── All Styles ─── */
const profileStyles = `
.pp-page { min-height:100vh; background:#f8faff; padding-top:90px; padding-bottom:60px; }
.pp-container { max-width:1100px; margin:0 auto; padding:24px 24px 0; display:flex; flex-direction:column; gap:20px; }
.pp-card { background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:26px; transition:box-shadow .2s; }
.pp-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.06); }
.pp-hero-card { position:relative; overflow:hidden; }
.pp-hero-bg { position:absolute; inset:0; background:linear-gradient(135deg,#eef2ff,#f0fdf4); z-index:0; }
.pp-hero-content { position:relative; z-index:1; display:flex; align-items:center; gap:24px; flex-wrap:wrap; }
.pp-avatar-ring { position:relative; width:96px; height:96px; flex-shrink:0; }
.pp-ring-svg { position:absolute; top:0; left:0; }
.pp-avatar-inner { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,#4f46e5,#06b6d4); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.2rem; font-weight:800; }
.pp-avatar-img { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:72px; height:72px; border-radius:50%; object-fit:cover; }
.pp-hero-info { flex:1; }
.pp-hero-name { font-size:1.5rem; font-weight:800; color:#111827; margin-bottom:4px; }
.pp-hero-role { font-size:.9rem; color:#4f46e5; font-weight:600; margin-bottom:8px; }
.pp-hero-loc { font-size:.82rem; color:#6b7280; }
.pp-completion-info { text-align:center; background:#fff; border-radius:12px; padding:16px 20px; border:1px solid #e5e7eb; flex-shrink:0; }
.pp-comp-percent { font-size:2rem; font-weight:900; background:linear-gradient(135deg,#4f46e5,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.pp-comp-label { font-size:.78rem; font-weight:700; color:#374151; margin-bottom:4px; }
.pp-comp-tip { font-size:.7rem; color:#9ca3af; max-width:140px; line-height:1.4; }
.pp-hero-actions { position:relative; z-index:1; display:flex; gap:10px; margin-top:18px; flex-wrap:wrap; }
.pp-hero-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; border-radius:10px; font-size:.85rem; font-weight:600; cursor:pointer; transition:all .2s; border:none; }
.pp-hero-btn-primary { background:#4f46e5; color:#fff; }
.pp-hero-btn-primary:hover { background:#3730a3; }
.pp-hero-btn-outline { background:#fff; color:#4f46e5; border:1.5px solid #c7d2fe; }
.pp-hero-btn-outline:hover { background:#eef2ff; }
.pp-layout { display:grid; grid-template-columns:1fr 280px; gap:20px; align-items:start; }
.pp-main { display:flex; flex-direction:column; gap:20px; }
.pp-sidebar { display:flex; flex-direction:column; gap:16px; }
.pp-card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid #f3f4f6; }
.pp-card-title { display:flex; align-items:center; gap:9px; font-size:1rem; font-weight:700; color:#111827; }
.pp-card-icon { font-size:1.1rem; }
.pp-edit-btn { background:#f3f4f6; border:none; cursor:pointer; color:#6b7280; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; transition:all .2s; }
.pp-edit-btn:hover { background:#eef2ff; color:#4f46e5; }
.pp-delete-btn { background:#fff1f2; border:none; cursor:pointer; color:#dc2626; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; transition:all .2s; }
.pp-delete-btn:hover { background:#fee2e2; }
.pp-info-grid { display:flex; flex-direction:column; gap:16px; }
.pp-info-item { display:flex; align-items:flex-start; gap:12px; }
.pp-info-icon { font-size:1.1rem; flex-shrink:0; margin-top:1px; }
.pp-info-label { font-size:.72rem; color:#9ca3af; text-transform:uppercase; letter-spacing:.05em; margin-bottom:2px; }
.pp-info-val { font-size:.9rem; font-weight:600; color:#374151; }
.pp-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px; }
.pp-form-field { display:flex; flex-direction:column; gap:5px; }
.pp-form-field label { font-size:.78rem; font-weight:600; color:#6b7280; }
.pp-form-field input, .pp-form-field textarea, .pp-form-field select { padding:9px 12px; border:1.5px solid #e5e7eb; border-radius:8px; font-size:.875rem; color:#374151; background:#fafafa; outline:none; font-family:inherit; transition:border-color .2s; resize:vertical; }
.pp-form-field input:focus, .pp-form-field textarea:focus, .pp-form-field select:focus { border-color:#4f46e5; background:#fff; }
.pp-edit-actions { display:flex; gap:10px; }
.pp-save-btn { padding:9px 20px; background:#4f46e5; color:#fff; border:none; border-radius:8px; font-size:.85rem; font-weight:600; cursor:pointer; transition:background .2s; }
.pp-save-btn:hover { background:#3730a3; }
.pp-cancel-btn { padding:9px 16px; background:#fff; color:#6b7280; border:1px solid #e5e7eb; border-radius:8px; font-size:.85rem; font-weight:500; cursor:pointer; transition:all .2s; }
.pp-cancel-btn:hover { background:#f3f4f6; }
.pp-resume-box { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.pp-resume-file { display:flex; align-items:center; gap:12px; }
.pp-resume-icon { width:48px; height:48px; background:#eef2ff; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; }
.pp-resume-name { font-size:.875rem; font-weight:600; color:#374151; margin-bottom:2px; }
.pp-resume-meta { font-size:.75rem; color:#9ca3af; }
.pp-resume-actions { display:flex; gap:8px; flex-wrap:wrap; }
.pp-upload-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; background:#eef2ff; color:#4f46e5; border:1.5px solid #c7d2fe; border-radius:8px; font-size:.82rem; font-weight:600; cursor:pointer; transition:all .2s; }
.pp-upload-btn:hover { background:#4f46e5; color:#fff; }
.pp-view-btn { background:#f0fdf4; color:#059669; border-color:#a7f3d0; }
.pp-view-btn:hover { background:#059669; color:#fff; }
.pp-download-btn { background:#fffbeb; color:#d97706; border-color:#fde68a; }
.pp-download-btn:hover { background:#d97706; color:#fff; }
.pp-skills-wrap { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px; }
.pp-skill-chip { display:inline-flex; align-items:center; gap:5px; padding:5px 12px; background:#eef2ff; color:#4f46e5; border:1px solid #c7d2fe; border-radius:20px; font-size:.82rem; font-weight:600; transition:all .2s; }
.pp-skill-chip:hover { background:#4f46e5; color:#fff; }
.pp-skill-remove { background:none; border:none; cursor:pointer; color:inherit; font-size:1rem; line-height:1; padding:0; opacity:.6; }
.pp-skill-remove:hover { opacity:1; }
.pp-add-skill { display:flex; gap:8px; }
.pp-skill-input { flex:1; padding:8px 12px; border:1.5px solid #e5e7eb; border-radius:8px; font-size:.85rem; outline:none; font-family:inherit; transition:border-color .2s; }
.pp-skill-input:focus { border-color:#4f46e5; }
.pp-add-skill-btn { padding:8px 16px; background:#4f46e5; color:#fff; border:none; border-radius:8px; font-size:.82rem; font-weight:600; cursor:pointer; transition:background .2s; }
.pp-add-skill-btn:hover { background:#3730a3; }
.pp-cert-chip { display:inline-flex; padding:5px 14px; background:#fffbeb; color:#92400e; border:1px solid #fde68a; border-radius:20px; font-size:.82rem; font-weight:600; }
.pp-links-grid { display:flex; gap:10px; flex-wrap:wrap; }
.pp-link-card { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; text-decoration:none; color:#374151; font-size:.85rem; font-weight:600; transition:all .2s; }
.pp-link-card:hover { background:#eef2ff; border-color:#c7d2fe; color:#4f46e5; }
.pp-prof-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
.pp-prof-item { background:#f9fafb; padding:14px 16px; border-radius:10px; border:1px solid #f3f4f6; }
.pp-prof-label { font-size:.72rem; color:#9ca3af; text-transform:uppercase; letter-spacing:.05em; margin-bottom:4px; }
.pp-prof-val { font-size:1rem; font-weight:700; color:#111827; }
.pp-project-techs { display:flex; gap:4px; flex-wrap:wrap; margin-top:4px; }
.pp-timeline { display:flex; flex-direction:column; margin-bottom:16px; }
.pp-timeline-item { display:flex; gap:16px; position:relative; padding-bottom:24px; }
.pp-timeline-item:last-child { padding-bottom:0; }
.pp-timeline-dot { width:14px; height:14px; border-radius:50%; background:#4f46e5; border:3px solid #eef2ff; flex-shrink:0; margin-top:4px; z-index:1; }
.pp-timeline-line { position:absolute; left:6.5px; top:18px; bottom:0; width:2px; background:#e5e7eb; }
.pp-timeline-content { flex:1; }
.pp-emp-role { font-size:.95rem; font-weight:700; color:#111827; margin-bottom:4px; }
.pp-emp-company-badge { display:inline-block; background:#f3f4f6; color:#374151; font-size:.78rem; font-weight:600; padding:2px 10px; border-radius:5px; }
.pp-emp-duration { font-size:.75rem; color:#9ca3af; margin:6px 0; }
.pp-emp-desc { font-size:.85rem; color:#6b7280; line-height:1.5; }
.pp-projects-list { display:flex; flex-direction:column; gap:14px; margin-bottom:16px; }
.pp-project-card { padding:16px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; transition:border-color .2s; }
.pp-project-card:hover { border-color:#c7d2fe; }
.pp-project-header { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; margin-bottom:8px; flex-wrap:wrap; }
.pp-project-name { font-size:.9rem; font-weight:700; color:#111827; }
.pp-project-tech { font-size:.72rem; background:#eef2ff; color:#4f46e5; padding:2px 8px; border-radius:5px; font-weight:600; display:inline-block; }
.pp-project-desc { font-size:.83rem; color:#6b7280; line-height:1.5; }
.pp-add-new-btn { padding:10px 16px; background:none; border:2px dashed #c7d2fe; border-radius:8px; font-size:.85rem; font-weight:600; color:#4f46e5; cursor:pointer; width:100%; transition:all .2s; }
.pp-add-new-btn:hover { background:#eef2ff; border-style:solid; }
.pp-sidebar-widget { padding:20px; }
.pp-widget-title { font-size:.85rem; font-weight:700; color:#111827; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid #f3f4f6; }
.pp-strength-list { display:flex; flex-direction:column; gap:8px; }
.pp-strength-item { display:flex; align-items:center; gap:8px; font-size:.82rem; color:#9ca3af; }
.pp-strength-item.done { color:#374151; }
.pp-strength-check { width:18px; height:18px; border-radius:50%; background:#f3f4f6; color:#9ca3af; display:flex; align-items:center; justify-content:center; font-size:.65rem; font-weight:700; flex-shrink:0; }
.pp-strength-item.done .pp-strength-check { background:#dcfce7; color:#059669; }
.pp-perf-list { display:flex; flex-direction:column; gap:10px; }
.pp-perf-row { display:flex; justify-content:space-between; align-items:center; font-size:.82rem; color:#6b7280; padding-bottom:10px; border-bottom:1px solid #f9fafb; }
.pp-perf-row:last-child { border-bottom:none; padding-bottom:0; }
.pp-perf-num { font-weight:800; color:#4f46e5; font-size:1rem; }
/* Modal */
.pp-modal-overlay { position:fixed; inset:0; background:rgba(17,24,39,.5); backdrop-filter:blur(4px); z-index:2000; display:flex; align-items:center; justify-content:center; animation:ppFadeIn .2s ease; }
.pp-modal { background:#fff; border-radius:16px; max-width:520px; width:90%; max-height:85vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.2); animation:ppSlideUp .3s ease; }
.pp-modal-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid #f3f4f6; }
.pp-modal-header h3 { font-size:1.05rem; font-weight:700; color:#111827; }
.pp-modal-close { background:#f3f4f6; border:none; cursor:pointer; color:#6b7280; width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1rem; transition:all .2s; }
.pp-modal-close:hover { background:#e5e7eb; color:#111827; }
.pp-modal-body { padding:24px; }
@keyframes ppFadeIn { from{opacity:0} to{opacity:1} }
@keyframes ppSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@media(max-width:900px) { .pp-layout{grid-template-columns:1fr;} .pp-sidebar{flex-direction:row;flex-wrap:wrap;} .pp-sidebar-widget{flex:1;min-width:240px;} .pp-prof-grid{grid-template-columns:1fr 1fr;} }
@media(max-width:600px) { .pp-form-grid{grid-template-columns:1fr;} .pp-hero-content{flex-direction:column;text-align:center;} .pp-resume-box{flex-direction:column;align-items:flex-start;} .pp-prof-grid{grid-template-columns:1fr;} }
`;
