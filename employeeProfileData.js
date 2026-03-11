// Centralized mock employee profile data
// Used by ProfilePage, SettingsPage, and ProfileSidebar

export const mockEmployeeProfile = {
    // Basic Info
    name: 'Pallavi K S',
    email: 'pallavi.ks@gmail.com',
    phone: '+91 98765 43210',
    countryCode: '+91',
    gender: 'Female',
    dob: '1999-08-15',
    address: 'Bangalore, Karnataka',
    location: 'Bangalore, Karnataka',
    preferredRole: 'React Developer',
    totalExperience: '3 Years',

    // Resume
    resume: 'Pallavi_Resume_2026.pdf',

    // Skills
    skills: ['React.js', 'JavaScript', 'TypeScript', 'Redux', 'Node.js', 'CSS3', 'HTML5', 'Git'],

    // Education
    education: [
        {
            id: 1,
            institution: 'Visvesvaraya Technological University',
            degree: 'B.Tech in Computer Science',
            cgpa: '8.7',
            passingYear: '2023'
        },
        {
            id: 2,
            institution: 'Delhi Public School',
            degree: 'Higher Secondary (XII)',
            cgpa: '92%',
            passingYear: '2019'
        }
    ],

    // Employment / Experience
    employment: [
        {
            id: 1,
            company: 'Accenture',
            role: 'Software Engineer',
            duration: 'Jan 2025 – Present',
            description: 'Built enterprise-grade React applications for global banking clients. Led frontend architecture decisions and mentored junior developers.'
        },
        {
            id: 2,
            company: 'Capgemini',
            role: 'Junior Developer',
            duration: 'Jun 2023 – Dec 2024',
            description: 'Developed UI components and integrated REST APIs using React and TypeScript. Participated in agile sprints and code reviews.'
        }
    ],

    // Projects
    projects: [
        {
            id: 1,
            name: 'E-Commerce Dashboard',
            tech: 'React.js, Redux, Chart.js',
            technologies: ['React.js', 'Redux', 'Chart.js'],
            description: 'Built a real-time analytics dashboard for an e-commerce client with live sales data, charts, and order management.'
        },
        {
            id: 2,
            name: 'Hospital Management System',
            tech: 'React, Node.js, MongoDB',
            technologies: ['React', 'Node.js', 'MongoDB'],
            description: 'Full-stack hospital management platform with patient records, appointment scheduling, and billing workflows.'
        }
    ],

    // Professional Details
    professional: {
        overallExperience: '3',
        relevantExperience: '2.5',
        currentCTC: '8',
        expectedCTC: '14',
        noticePeriod: '30 Days'
    },

    // Certifications
    certifications: [
        'AWS Cloud Practitioner',
        'Meta Frontend Developer Certificate'
    ],

    // Social / Links
    linkedinUrl: 'https://linkedin.com/in/pallavi-ks',
    githubUrl: 'https://github.com/pallavi-ks',
    portfolioUrl: 'https://pallavi-ks.dev'
};

// Settings mock data
export const mockSettingsData = {
    notifications: {
        jobAlerts: true,
        applicationUpdates: true,
        recruiterMessages: false,
        marketingEmails: false
    },
    privacy: {
        profileVisibility: true,
        resumeVisibility: true,
        showPhone: false,
        showEmail: true
    },
    preferences: {
        preferredRole: 'React Developer',
        preferredLocation: 'Bangalore',
        salaryExpectation: '14 LPA',
        workMode: 'hybrid' // 'remote' | 'hybrid' | 'onsite'
    },
    recentDevices: [
        { device: 'Chrome on Windows', location: 'Bangalore, India', time: '2 hours ago', current: true },
        { device: 'Safari on iPhone', location: 'Bangalore, India', time: '1 day ago', current: false },
        { device: 'Chrome on MacBook', location: 'Mumbai, India', time: '5 days ago', current: false }
    ]
};
