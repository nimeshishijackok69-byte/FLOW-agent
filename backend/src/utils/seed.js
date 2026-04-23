import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Form } from '../models/Form.js';
import { connectDB } from '../config/db.js';
export const seedData = async (shouldExit = true, clearFirst = true) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }
        if (clearFirst) {
            await User.deleteMany({});
            await Form.deleteMany({});
            console.log('\uD83D\uDDD1\uFE0F Existing data cleared');
        }
        const admin = await User.create({
            email: 'admin@school.edu',
            passwordHash: 'admin123',
            role: 'admin',
            profile: { fullName: 'System Administrator' }
        });
        const reviewers = await User.insertMany([
            { email: 'priya.reviewer@school.edu', passwordHash: 'reviewer123', role: 'reviewer', profile: { fullName: 'Priya Reviewer' } },
            { email: 'amit.reviewer@school.edu', passwordHash: 'reviewer123', role: 'reviewer', profile: { fullName: 'Amit Reviewer' } }
        ]);
        const functionaries = await User.insertMany([
            { email: 'head.kv001@cbss.school.org', role: 'functionary', profile: { fullName: 'Head KV001', schoolCode: 'KV001' } },
            { email: 'head.dav002@cbss.school.org', role: 'functionary', profile: { fullName: 'Head DAV002', schoolCode: 'DAV002' } }
        ]);
        const teachers = await User.insertMany([
            { email: 'anita.teacher@school.edu', role: 'teacher', profile: { fullName: 'Anita Teacher' } }
        ]);
        console.log('\u2705 Users seeded');
        const forms = await Form.insertMany([
            {
                title: 'Annual Teacher Performance Survey 2024',
                description: 'Standard performance review form for all teachers.',
                adminId: admin._id,
                status: 'active',
                formType: 'normal',
                shareableLink: 'normal-form-1',
                fields: [
                    { id: "f1", type: "text", label: "Full Name", required: true, placeholder: "Enter your full name" },
                    { id: "f2", type: "email", label: "Email Address", required: true, placeholder: "your.email@school.edu" },
                    { id: "f3", type: "phone", label: "Phone Number", placeholder: "+91 98765 43210" },
                    { id: "f4", type: "dropdown", label: "Subject", required: true, options: ["Mathematics", "Science", "English", "Hindi", "Social Studies", "Computer Science", "Physical Education", "Art"] },
                    { id: "f5", type: "dropdown", label: "Grade/Class Teaching", options: ["Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12"] },
                    { id: "f6", type: "number", label: "Years of Teaching Experience", required: true, min: 0, max: 50 },
                    { id: "f7", type: "radio", label: "Self Assessment Rating", required: true, options: ["1 - Needs Improvement", "2 - Satisfactory", "3 - Good", "4 - Very Good", "5 - Excellent"] },
                    { id: "f8", type: "textarea", label: "Key Achievements This Year", required: true, placeholder: "Describe your major accomplishments...", maxLength: 1000 },
                    { id: "f9", type: "textarea", label: "Professional Development Activities", placeholder: "Workshops, certifications, training attended..." },
                    { id: "f10", type: "textarea", label: "Goals for Next Year", placeholder: "What do you aim to achieve?" }
                ]
            },
            {
                title: 'School Infrastructure Assessment',
                description: 'Branching form based on subject department.',
                adminId: admin._id,
                status: 'active',
                formType: 'branching',
                shareableLink: 'branching-form-3',
                fields: [
                    { id: "b1", type: "dropdown", label: "Your Subject", required: true, options: ["Mathematics", "Science", "English", "Hindi"], is_trigger: true },
                    { id: "b2", type: "text", label: "Full Name", required: true },
                    { id: "b3", type: "number", label: "Years of Experience", required: true },
                    {
                        id: "grp_maths", type: "section", label: "Mathematics Section",
                        show_when: { field: "b1", equals: "Mathematics" },
                        children: [
                            { id: "m1", type: "dropdown", label: "Board syllabus you follow", options: ["CBSE", "ICSE", "State Board"], required: true },
                            { id: "m2", type: "number", label: "Average class score in last exam" },
                            { id: "m3", type: "textarea", label: "Describe your approach to teaching Algebra" }
                        ]
                    },
                    {
                        id: "grp_science", type: "section", label: "Science Section",
                        show_when: { field: "b1", equals: "Science" },
                        children: [
                            { id: "s1", type: "dropdown", label: "Science stream", options: ["Physics", "Chemistry", "Biology", "General Science"], required: true },
                            { id: "s2", type: "checkbox", label: "Lab facilities available", options: ["Physics Lab", "Chemistry Lab", "Biology Lab", "Computer Lab"] },
                            { id: "s3", type: "textarea", label: "Describe a recent practical session you conducted" }
                        ]
                    },
                    { id: "b_final", type: "textarea", label: "Any additional comments or feedback" }
                ]
            },
            {
                title: 'CBSE Curriculum Knowledge Quiz',
                description: '10 quiz questions about NEP 2020.',
                adminId: admin._id,
                status: 'active',
                formType: 'quiz',
                shareableLink: 'quiz-form-4',
                fields: [
                    { id: "q1", type: "mcq", label: "What year was the National Education Policy (NEP) introduced?", options: ["2018", "2019", "2020", "2021"], correct: "2020", points: 10 },
                    { id: "q2", type: "mcq", label: "NEP recommends education in which language till Grade 5?", options: ["English", "Hindi", "Mother tongue / regional language", "Sanskrit"], correct: "Mother tongue / regional language", points: 10 },
                    { id: "q3", type: "mcq", label: "Under NEP 2020, the new school structure is:", options: ["10+2", "5+3+3+4", "6+3+3", "4+4+4"], correct: "5+3+3+4", points: 10 }
                ],
                settings: {
                    time_limit: 15,
                    passing_score: 60,
                    total_marks: 30
                }
            }
        ]);
        console.log('\u2705 Forms seeded');
        if (shouldExit)
            process.exit(0);
    }
    catch (err) {
        console.error('\u274C Seed error:', err.message);
        if (shouldExit)
            process.exit(1);
    }
};
if (import.meta.url === `file://${process.argv[1]}`) {
    seedData();
}
//# sourceMappingURL=seed.js.map