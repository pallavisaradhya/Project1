import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PhoneInputField from '../components/PhoneInputField'
import PageLayout from '../components/PageLayout'

export default function Login({ mode = 'login' }) {
    const navigate = useNavigate()
    const [isSignUp, setIsSignUp] = useState(mode === 'signup')
    const [step, setStep] = useState(1)
    const [showOTP, setShowOTP] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [phoneError, setPhoneError] = useState('')
    const [loginMethod, setLoginMethod] = useState('email') // 'email' or 'phone' for login
    const [regVerificationStep, setRegVerificationStep] = useState('email') // 'email' or 'phone' for registration

    // Sync state with prop
    useEffect(() => {
        setIsSignUp(mode === 'signup')
        setStep(1)
        setShowOTP(false)
        setShowPassword(false)
        setPasswordError('')
    }, [mode])

    // Form Data State
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        countryCode: '+91',
        password: '',
        otp: ['', '', '', '', '', ''],
        fullName: '',
        gender: '',
        dob: '',
        address: '',
        skills: [],
        education: [
            { institution: '', degree: '', cgpa: '' }
        ],
        experience: [
            { company: '', position: '', duration: '', description: '' }
        ],
        projects: [
            { name: '', technologies: [], description: '' }
        ],
        workExperience: '',
        overallExperience: '',
        relevantExperience: '',
        currentCTC: '',
        expectedCTC: '',
        noticePeriod: 'Immediate',
        resume: null
    })

    const [skillInput, setSkillInput] = useState('')
    const [otpTimer, setOtpTimer] = useState(30)
    const fileInputRef = useRef(null)

    // OTP Timer
    useEffect(() => {
        let interval
        if (showOTP && otpTimer > 0) {
            interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000)
        }
        return () => clearInterval(interval)
    }, [showOTP, otpTimer])

    const handleBack = () => setStep(prev => prev - 1)
    const handleNext = () => setStep(prev => prev + 1)

    const validatePassword = (pwd) => {
        if (pwd.length < 8) return 'Password must be at least 8 characters'
        if (!/[A-Z]/.test(pwd)) return 'Must contain at least one uppercase letter'
        if (!/[a-z]/.test(pwd)) return 'Must contain at least one lowercase letter'
        if (!/\d/.test(pwd)) return 'Must contain at least one digit'
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) return 'Must contain at least one special character'
        return ''
    }

    const handlePasswordChange = (e) => {
        const pwd = e.target.value
        setFormData(prev => ({ ...prev, password: pwd }))
        setPasswordError(validatePassword(pwd))
    }

    const handlePasswordSubmit = (e) => {
        e.preventDefault()
        const error = validatePassword(formData.password)
        if (error) {
            setPasswordError(error)
            return
        }
        setShowPassword(false)
        setShowOTP(true)
        setOtpTimer(30)
    }

    const handlePhoneChange = (digits) => {
        setFormData(prev => ({ ...prev, phone: digits }))
        if (digits.length > 0 && digits.length < 10) {
            setPhoneError('Please enter a valid 10-digit phone number')
        } else {
            setPhoneError('')
        }
    }

    const handleFieldChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleOTPChange = (index, value) => {
        if (!/^\d*$/.test(value)) return
        const newOTP = [...formData.otp]
        newOTP[index] = value.slice(-1)
        setFormData(prev => ({ ...prev, otp: newOTP }))

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            if (nextInput) nextInput.focus()
        }
    }

    const handleOTPKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            if (prevInput) prevInput.focus()
        }
    }

    const handleOTPVerify = (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            if (isSignUp) {
                if (regVerificationStep === 'email') {
                    setRegVerificationStep('phone')
                    setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }))
                    setOtpTimer(30)
                } else {
                    setStep(2)
                    setShowOTP(false)
                }
            } else {
                navigate('/employee/dashboard')
            }
        }, 1000)
    }

    const handleSkillAdd = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault()
            setFormData(prev => ({
                ...prev,
                skills: [...new Set([...prev.skills, skillInput.trim()])]
            }))
            setSkillInput('')
        }
    }

    const removeSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }))
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({ ...prev, resume: file }))
        }
    }

    const handleSubmitRegistration = (e) => {
        e.preventDefault()
        setIsSuccess(true)
        setTimeout(() => {
            navigate('/employee/dashboard')
        }, 3000)
    }

    // --- DYNAMIC ARRAY HANDLERS ---
    const handleArrayChange = (section, index, field, value) => {
        setFormData(prev => {
            const newArray = [...prev[section]]
            newArray[index] = { ...newArray[index], [field]: value }
            return { ...prev, [section]: newArray }
        })
    }

    const addArrayItem = (section, emptyItem) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], emptyItem]
        }))
    }

    const removeArrayItem = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }))
    }

    const handleProjectTechAdd = (index, e) => {
        const value = e.target.value.trim()
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            if (value) {
                // Split by comma in case user pasted a comma-separated list
                const techs = value.split(',').map(t => t.trim()).filter(t => t)
                setFormData(prev => {
                    const newProjects = [...prev.projects]
                    newProjects[index] = {
                        ...newProjects[index],
                        technologies: [...new Set([...newProjects[index].technologies, ...techs])]
                    }
                    return { ...prev, projects: newProjects }
                })
                e.target.value = ''
            }
        }
    }

    const removeProjectTech = (projectIndex, techToRemove) => {
        setFormData(prev => {
            const newProjects = [...prev.projects]
            newProjects[projectIndex] = {
                ...newProjects[projectIndex],
                technologies: newProjects[projectIndex].technologies.filter(t => t !== techToRemove)
            }
            return { ...prev, projects: newProjects }
        })
    }

    // --- SUB-COMPONENTS ---

    const renderStepper = () => {
        const steps = ['Basic Info', 'Resume', 'Profile', 'Professional', 'Review']
        return (
            <div className="auth-stepper">
                {steps.map((label, i) => (
                    <div key={i} className={`step-item ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'completed' : ''}`}>
                        <div className="step-number">{step > i + 1 ? '✓' : i + 1}</div>
                        <span className="step-label">{label}</span>
                    </div>
                ))}
            </div>
        )
    }

    const renderOTPScreen = ({ title, onVerify }) => (
        <div className="auth-form page-card">
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                {isSignUp ? (regVerificationStep === 'email' ? 'Verify Email' : 'Verify Phone') : (title || 'OTP Verification')}
            </h3>
            <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: 'var(--fs-sm)' }}>
                Enter the 6-digit code sent to your {isSignUp ? (regVerificationStep === 'email' ? 'email ID' : 'phone number') : (loginMethod === 'phone' ? 'phone number' : 'email ID')} ({isSignUp ? (regVerificationStep === 'email' ? formData.email : formData.phone) : (loginMethod === 'phone' ? formData.phone : formData.email)})
            </p>
            <div className="otp-input-container">
                {formData.otp.map((digit, i) => (
                    <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        className="otp-digit"
                        value={digit}
                        onChange={(e) => handleOTPChange(i, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(i, e)}
                        maxLength={1}
                    />
                ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
                {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : <button className="link-btn" onClick={() => setOtpTimer(30)}>Resend OTP</button>}
            </p>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={onVerify} disabled={formData.otp.join('').length < 6}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
        </div>
    )

    // --- MAIN RENDER ---

    if (isSuccess) {
        return (
            <PageLayout title="Success!" subtitle="Registration sequence complete">
                <div className="auth-container" style={{ textAlign: 'center' }}>
                    <div className="success-check">✓</div>
                    <h2 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 800, marginBottom: '1rem' }}>Registration Completed Successfully</h2>
                    <p style={{ color: 'var(--gray-600)' }}>Your professional journey as a candidate begins now. Redirecting to your dashboard...</p>
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout
            title={isSignUp ? 'Create Employee Account' : 'Employee Login'}
            subtitle={isSignUp ? 'Join India\'s most advanced AI hiring platform' : 'Access your professional dashboard'}
        >
            <div className="auth-container">
                {isSignUp && renderStepper()}

                {!isSignUp ? (
                    /* LOGIN FLOW: Email → Password → OTP */
                    !showPassword && !showOTP ? (
                        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setShowPassword(true) }}>
                            <div className="form-group">
                                <label>{loginMethod === 'email' ? 'Email ID' : 'Phone Number'}</label>
                                {loginMethod === 'email' ? (
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email ID"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleFieldChange}
                                        required
                                    />
                                ) : (
                                    <PhoneInputField
                                        countryCode={formData.countryCode}
                                        phone={formData.phone}
                                        onCountryChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
                                        onPhoneChange={handlePhoneChange}
                                        error={phoneError}
                                    />
                                )}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginTop: '1rem' }}
                                disabled={loginMethod === 'phone' ? (formData.phone.length < 10 || !!phoneError) : !formData.email}
                            >
                                Next
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
                                <button
                                    type="button"
                                    className="link-btn"
                                    onClick={() => setLoginMethod(loginMethod === 'email' ? 'phone' : 'email')}
                                    style={{ fontWeight: 600 }}
                                >
                                    Login with {loginMethod === 'email' ? 'phone number' : 'email ID'}
                                </button>
                            </div>

                            <p className="auth-switch" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                New to Rozgar.ai? <button type="button" className="link-btn" onClick={() => setIsSignUp(true)}>Register</button>
                            </p>
                        </form>
                    ) : showPassword && !showOTP ? (
                        <form className="auth-form" onSubmit={handlePasswordSubmit}>
                            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Enter Password</h3>
                            <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
                                Enter your password to continue
                            </p>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                {passwordError && formData.password && (
                                    <p style={{ color: 'var(--danger, #e53e3e)', fontSize: 'var(--fs-xs)', marginTop: '0.5rem' }}>{passwordError}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginTop: '1rem' }}
                                disabled={!formData.password || !!validatePassword(formData.password)}
                            >
                                Next
                            </button>
                            <button
                                type="button"
                                className="link-btn"
                                style={{ display: 'block', margin: '1rem auto 0', fontWeight: 600 }}
                                onClick={() => { setShowPassword(false); setPasswordError(''); setFormData(prev => ({ ...prev, password: '' })) }}
                            >
                                ← Back
                            </button>
                        </form>
                    ) : (
                        renderOTPScreen({ title: 'Employee Login', onVerify: handleOTPVerify })
                    )
                ) : (
                    /* REGISTRATION FLOW */
                    <div className="auth-step-content">
                        {step === 1 && (
                            !showOTP ? (
                                <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setShowOTP(true); setOtpTimer(30) }}>
                                    <div className="form-group">
                                        <label>Email ID</label>
                                        <input type="email" name="email" className="form-control" placeholder="example@email.com" value={formData.email} onChange={handleFieldChange} required />
                                    </div>
                                    <div className="form-group" style={{ marginTop: '1rem' }}>
                                        <label>Phone Number</label>
                                        <PhoneInputField
                                            countryCode={formData.countryCode}
                                            phone={formData.phone}
                                            onCountryChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
                                            onPhoneChange={handlePhoneChange}
                                            error={phoneError}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        style={{ width: '100%', marginTop: '2rem' }}
                                        onClick={() => setRegVerificationStep('email')}
                                        disabled={formData.phone.length < 10 || phoneError}
                                    >
                                        Next
                                    </button>
                                    <p className="auth-switch" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                        Already have an account? <button type="button" className="link-btn" onClick={() => setIsSignUp(false)}>Login</button>
                                    </p>
                                </form>
                            ) : (
                                renderOTPScreen({ title: 'Verify Your Identity', onVerify: handleOTPVerify })
                            )
                        )}

                        {step === 2 && (
                            <div className="auth-form">
                                <h3 style={{ marginBottom: '1.5rem' }}>Upload Your Resume</h3>
                                <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                                    <div className="upload-icon">📄</div>
                                    <p style={{ fontWeight: 600 }}>Drag & Drop or Click to Upload</p>
                                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-500)' }}>PDF, DOC, DOCX (Max 2MB)</p>
                                    {formData.resume && (
                                        <div style={{ marginTop: '1rem', background: 'var(--white)', padding: '0.5rem', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--primary-100)' }}>
                                            <span style={{ fontSize: '0.8rem' }}>📎 {formData.resume.name}</span>
                                            <button onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, resume: null })) }} style={{ color: 'var(--danger)', fontWeight: 800 }}>×</button>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} hidden accept=".pdf,.doc,.docx" />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleBack}>Back</button>
                                    <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext} disabled={!formData.resume}>Next</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="auth-form">
                                <h3 style={{ marginBottom: '1.5rem' }}>Profile Details</h3>
                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleFieldChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleFieldChange}>
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input type="date" name="dob" value={formData.dob} onChange={handleFieldChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text" name="address" placeholder="City, State" value={formData.address} onChange={handleFieldChange} />
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginTop: '1rem' }}>
                                    <label>Skills (Press Enter to add)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. React, Python, UI Design"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleSkillAdd}
                                    />
                                    <div className="skills-container">
                                        {formData.skills.map(s => (
                                            <span key={s} className="skill-tag">{s} <button type="button" onClick={() => removeSkill(s)}>×</button></span>
                                        ))}
                                    </div>
                                </div>

                                <hr style={{ margin: '2rem 0', borderColor: 'var(--gray-200)' }} />

                                {/* Educational Details */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--primary-700)' }}>Educational Details</h4>
                                    {formData.education.map((edu, index) => (
                                        <div key={index} className="page-card" style={{ padding: '1.5rem', marginBottom: '1rem', position: 'relative' }}>
                                            {formData.education.length > 1 && (
                                                <button type="button" onClick={() => removeArrayItem('education', index)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--danger)', fontWeight: 'bold' }}>✕</button>
                                            )}
                                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                    <label>Institution</label>
                                                    <input type="text" placeholder="University/College Name" value={edu.institution} onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Degree</label>
                                                    <input type="text" placeholder="e.g. B.Tech Computer Science" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>CGPA / Percentage</label>
                                                    <input type="text" placeholder="e.g. 8.5 or 85%" value={edu.cgpa} onChange={(e) => handleArrayChange('education', index, 'cgpa', e.target.value)} required />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-outline" style={{ fontSize: 'var(--fs-sm)' }} onClick={() => addArrayItem('education', { institution: '', degree: '', cgpa: '' })}>+ Add Education</button>
                                </div>

                                {/* Experience Details */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--primary-700)' }}>Experience Details</h4>
                                    {formData.experience.map((exp, index) => (
                                        <div key={index} className="page-card" style={{ padding: '1.5rem', marginBottom: '1rem', position: 'relative' }}>
                                            {formData.experience.length > 1 && (
                                                <button type="button" onClick={() => removeArrayItem('experience', index)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--danger)', fontWeight: 'bold' }}>✕</button>
                                            )}
                                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div className="form-group">
                                                    <label>Company</label>
                                                    <input type="text" placeholder="Company Name" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Position</label>
                                                    <input type="text" placeholder="Job Title" value={exp.position} onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Duration</label>
                                                    <input type="text" placeholder="e.g. Jan 2020 - Present" value={exp.duration} onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)} required />
                                                </div>
                                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                    <label>Description</label>
                                                    <textarea className="form-control" placeholder="Describe your responsibilities and achievements..." style={{ height: '80px', padding: '10px' }} value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)} required></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-outline" style={{ fontSize: 'var(--fs-sm)' }} onClick={() => addArrayItem('experience', { company: '', position: '', duration: '', description: '' })}>+ Add Experience</button>
                                </div>

                                {/* Project Details */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--primary-700)' }}>Project Details</h4>
                                    {formData.projects.map((proj, index) => (
                                        <div key={index} className="page-card" style={{ padding: '1.5rem', marginBottom: '1rem', position: 'relative' }}>
                                            {formData.projects.length > 1 && (
                                                <button type="button" onClick={() => removeArrayItem('projects', index)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--danger)', fontWeight: 'bold' }}>✕</button>
                                            )}
                                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                                <div className="form-group">
                                                    <label>Project Name</label>
                                                    <input type="text" placeholder="e.g. Ecommerce Platform" value={proj.name} onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Technologies Used (Press Enter or comma to add)</label>
                                                    <input type="text" placeholder="e.g. React, Node.js, MongoDB" onKeyDown={(e) => handleProjectTechAdd(index, e)} />
                                                    <div className="skills-container" style={{ marginTop: '0.5rem' }}>
                                                        {proj.technologies.map(t => (
                                                            <span key={t} className="skill-tag" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)' }}>{t} <button type="button" onClick={() => removeProjectTech(index, t)}>✕</button></span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Description</label>
                                                    <textarea className="form-control" placeholder="What did you build? What was your role?" style={{ height: '80px', padding: '10px' }} value={proj.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} required></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-outline" style={{ fontSize: 'var(--fs-sm)' }} onClick={() => addArrayItem('projects', { name: '', technologies: [], description: '' })}>+ Add Project</button>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={handleBack}>Back</button>
                                    <button className="btn btn-primary" style={{ flex: 2 }} onClick={(e) => {
                                        e.preventDefault()
                                        // Simple validation check before proceeding
                                        const form = e.target.closest('form') || document.querySelector('.auth-form');
                                        if (form && form.checkValidity && !form.checkValidity()) {
                                            form.reportValidity()
                                            return;
                                        }
                                        handleNext()
                                    }}>Next</button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="auth-form">
                                <h3 style={{ marginBottom: '1.5rem' }}>Professional Details</h3>
                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>Overall Experience (Years)</label>
                                        <input type="number" name="overallExperience" placeholder="0" value={formData.overallExperience} onChange={handleFieldChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Relevant Experience (Years)</label>
                                        <input type="number" name="relevantExperience" placeholder="0" value={formData.relevantExperience} onChange={handleFieldChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Current CTC (LPA)</label>
                                        <input type="number" name="currentCTC" placeholder="e.g. 5.5" value={formData.currentCTC} onChange={handleFieldChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Expected CTC (LPA)</label>
                                        <input type="number" name="expectedCTC" placeholder="e.g. 8.0" value={formData.expectedCTC} onChange={handleFieldChange} />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label>Notice Period</label>
                                        <select name="noticePeriod" value={formData.noticePeriod} onChange={handleFieldChange}>
                                            <option value="Immediate">Immediate</option>
                                            <option value="15 Days">15 Days</option>
                                            <option value="30 Days">30 Days</option>
                                            <option value="60 Days">60 Days</option>
                                            <option value="90 Days">90 Days</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleBack}>Back</button>
                                    <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext}>Review & Register</button>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="auth-form">
                                <h3 style={{ marginBottom: '0.25rem' }}>Review Your Application</h3>
                                <p style={{ color: 'var(--gray-500)', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>Please verify all details before submitting your profile.</p>

                                {/* Contact & Resume Row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div className="page-card" style={{ padding: '1rem' }}>
                                        <h4 style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>👤 Contact Info</h4>
                                        <p style={{ fontWeight: 700, fontSize: 'var(--fs-base)', marginBottom: '0.25rem' }}>{formData.fullName || '—'}</p>
                                        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--gray-600)' }}>{formData.email}</p>
                                        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--gray-600)' }}>{formData.countryCode} {formData.phone}</p>
                                        {formData.address && <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--gray-500)', marginTop: '0.25rem' }}>📍 {formData.address}</p>}
                                    </div>
                                    <div className="page-card" style={{ padding: '1rem' }}>
                                        <h4 style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📄 Resume</h4>
                                        <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{formData.resume?.name || 'No file uploaded'}</p>
                                        {formData.gender && <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--gray-500)', marginTop: '0.5rem' }}>{formData.gender}{formData.dob ? ` • Born ${formData.dob}` : ''}</p>}
                                    </div>
                                </div>

                                {/* Skills */}
                                {formData.skills.length > 0 && (
                                    <div className="page-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>🛠️ Key Skills</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {formData.skills.map(s => (
                                                <span key={s} style={{ background: 'var(--primary-50, #eef2ff)', color: 'var(--primary-700, #4338ca)', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: 'var(--fs-xs)', fontWeight: 500 }}>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education Summary */}
                                {formData.education.some(e => e.institution) && (
                                    <div className="page-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>🎓 Education</h4>
                                        {formData.education.filter(e => e.institution).map((edu, i) => (
                                            <div key={i} style={{ marginBottom: i < formData.education.length - 1 ? '0.5rem' : 0, paddingBottom: i < formData.education.length - 1 ? '0.5rem' : 0, borderBottom: i < formData.education.length - 1 ? '1px solid var(--gray-100, #f3f4f6)' : 'none' }}>
                                                <p style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{edu.degree || 'Degree not specified'}</p>
                                                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-500)' }}>{edu.institution}{edu.cgpa ? ` • CGPA: ${edu.cgpa}` : ''}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Experience Summary */}
                                {formData.experience.some(e => e.company) && (
                                    <div className="page-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>💼 Experience</h4>
                                        {formData.experience.filter(e => e.company).map((exp, i) => (
                                            <div key={i} style={{ marginBottom: i < formData.experience.length - 1 ? '0.5rem' : 0, paddingBottom: i < formData.experience.length - 1 ? '0.5rem' : 0, borderBottom: i < formData.experience.length - 1 ? '1px solid var(--gray-100, #f3f4f6)' : 'none' }}>
                                                <p style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{exp.position || 'Position not specified'} <span style={{ fontWeight: 400, color: 'var(--gray-500)' }}>at {exp.company}</span></p>
                                                {exp.duration && <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-500)' }}>{exp.duration}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Projects Summary */}
                                {formData.projects.some(p => p.name) && (
                                    <div className="page-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>🚀 Projects</h4>
                                        {formData.projects.filter(p => p.name).map((proj, i) => (
                                            <div key={i} style={{ marginBottom: i < formData.projects.length - 1 ? '0.5rem' : 0, paddingBottom: i < formData.projects.length - 1 ? '0.5rem' : 0, borderBottom: i < formData.projects.length - 1 ? '1px solid var(--gray-100, #f3f4f6)' : 'none' }}>
                                                <p style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{proj.name}</p>
                                                {proj.technologies.length > 0 && <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--primary-600, #4f46e5)' }}>{proj.technologies.join(', ')}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Professional Details */}
                                <div className="page-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                                    <h4 style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>📊 Professional Details</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                        <div>
                                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-500)' }}>Experience</p>
                                            <p style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{formData.overallExperience ? `${formData.overallExperience} Years` : '—'}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-500)' }}>Current CTC</p>
                                            <p style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{formData.currentCTC ? `₹${formData.currentCTC} LPA` : '—'}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-500)' }}>Expected CTC</p>
                                            <p style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{formData.expectedCTC ? `₹${formData.expectedCTC} LPA` : '—'}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-500)' }}>Relevant Exp.</p>
                                            <p style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{formData.relevantExperience ? `${formData.relevantExperience} Years` : '—'}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--gray-500)' }}>Notice Period</p>
                                            <p style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{formData.noticePeriod}</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(3)}>Edit Details</button>
                                    <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSubmitRegistration}>Confirm & Submit</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PageLayout>
    )
}

