import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Update branching form (id=3) with proper show_when rules
    const branchingFields = [
      { id: "b1", type: "select", label: "Your Subject", required: true, options: ["Mathematics", "Science", "English", "Hindi"], is_trigger: true },
      { id: "b2", type: "text", label: "Full Name", required: true },
      { id: "b3", type: "number", label: "Years of Experience", required: true },
      {
        id: "grp_maths", type: "section", label: "Mathematics Section",
        show_when: { field: "b1", equals: "Mathematics" },
        children: [
          { id: "m1", type: "select", label: "Board syllabus you follow", options: ["CBSE", "ICSE", "State Board"], required: true },
          { id: "m2", type: "number", label: "Average class score in last exam" },
          { id: "m3", type: "textarea", label: "Describe your approach to teaching Algebra" }
        ]
      },
      {
        id: "grp_science", type: "section", label: "Science Section",
        show_when: { field: "b1", equals: "Science" },
        children: [
          { id: "s1", type: "select", label: "Science stream", options: ["Physics", "Chemistry", "Biology", "General Science"], required: true },
          { id: "s2", type: "checkbox", label: "Lab facilities available", options: ["Physics Lab", "Chemistry Lab", "Biology Lab", "Computer Lab"] },
          { id: "s3", type: "textarea", label: "Describe a recent practical session you conducted" }
        ]
      },
      {
        id: "grp_english", type: "section", label: "English Section",
        show_when: { field: "b1", equals: "English" },
        children: [
          { id: "e1", type: "select", label: "Primary focus area", options: ["Literature", "Grammar", "Creative Writing", "Communication Skills"], required: true },
          { id: "e2", type: "textarea", label: "How do you encourage reading habits among students?" }
        ]
      },
      {
        id: "grp_hindi", type: "section", label: "Hindi Section",
        show_when: { field: "b1", equals: "Hindi" },
        children: [
          { id: "h1", type: "textarea", label: "Describe your method for teaching Hindi grammar" },
          { id: "h2", type: "number", label: "Number of students scoring above 80 percent" }
        ]
      },
      { id: "b_final", type: "textarea", label: "Any additional comments or feedback" }
    ];

    const { error: e1 } = await supabase.from('forms').update({
      fields: JSON.stringify(branchingFields)
    }).eq('id', 3);
    if (e1) throw e1;

    // Update quiz form (id=4) with more questions and proper scoring
    const quizFields = [
      { id: "q1", type: "mcq", label: "What year was the National Education Policy (NEP) introduced?", options: ["2018", "2019", "2020", "2021"], correct: "2020", points: 10 },
      { id: "q2", type: "mcq", label: "NEP recommends education in which language till Grade 5?", options: ["English", "Hindi", "Mother tongue / regional language", "Sanskrit"], correct: "Mother tongue / regional language", points: 10 },
      { id: "q3", type: "mcq", label: "Under NEP 2020, the new school structure is:", options: ["10+2", "5+3+3+4", "6+3+3", "4+4+4"], correct: "5+3+3+4", points: 10 },
      { id: "q4", type: "mcq", label: "Which body regulates higher education under NEP 2020?", options: ["UGC", "AICTE", "Higher Education Commission of India (HECI)", "NCERT"], correct: "Higher Education Commission of India (HECI)", points: 10 },
      { id: "q5", type: "mcq", label: "At what age does NEP 2020 recommend starting formal schooling?", options: ["3 years", "5 years", "6 years", "7 years"], correct: "6 years", points: 10 },
      { id: "q6", type: "mcq", label: "NEP 2020 proposes board exams to be:", options: ["Abolished completely", "Conducted twice a year", "Made easier with focus on core competencies", "Unchanged"], correct: "Made easier with focus on core competencies", points: 10 },
      { id: "q7", type: "mcq", label: "What percentage of GDP does NEP 2020 recommend for education?", options: ["4%", "5%", "6%", "8%"], correct: "6%", points: 10 },
      { id: "q8", type: "mcq", label: "NEP 2020 introduces coding from which grade?", options: ["Grade 1", "Grade 3", "Grade 6", "Grade 9"], correct: "Grade 6", points: 10 },
      { id: "q9", type: "mcq", label: "The foundational stage in NEP covers ages:", options: ["3-6 years", "3-8 years", "5-8 years", "6-11 years"], correct: "3-8 years", points: 10 },
      { id: "q10", type: "mcq", label: "NEP 2020 replaces which previous policy?", options: ["NPE 1968", "NPE 1986", "NPE 1992", "NPE 2005"], correct: "NPE 1986", points: 10 }
    ];

    const quizSettings = {
      time_limit: 15,
      passing_score: 60,
      negative_marking: false,
      shuffle_options: true,
      show_answers: false,
      total_marks: 100
    };

    const { error: e2 } = await supabase.from('forms').update({
      fields: JSON.stringify(quizFields),
      settings: JSON.stringify(quizSettings)
    }).eq('id', 4);
    if (e2) throw e2;

    // Update normal form (id=1) with richer fields
    const normalFields = [
      { id: "f1", type: "text", label: "Full Name", required: true, placeholder: "Enter your full name" },
      { id: "f2", type: "email", label: "Email Address", required: true, placeholder: "your.email@school.edu" },
      { id: "f3", type: "phone", label: "Phone Number", placeholder: "+91 98765 43210" },
      { id: "f4", type: "select", label: "Subject", required: true, options: ["Mathematics", "Science", "English", "Hindi", "Social Studies", "Computer Science", "Physical Education", "Art"] },
      { id: "f5", type: "select", label: "Grade/Class Teaching", options: ["Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12"] },
      { id: "f6", type: "number", label: "Years of Teaching Experience", required: true, min: 0, max: 50 },
      { id: "f7", type: "radio", label: "Self Assessment Rating", required: true, options: ["1 - Needs Improvement", "2 - Satisfactory", "3 - Good", "4 - Very Good", "5 - Excellent"] },
      { id: "f8", type: "textarea", label: "Key Achievements This Year", required: true, placeholder: "Describe your major accomplishments...", maxLength: 1000 },
      { id: "f9", type: "textarea", label: "Professional Development Activities", placeholder: "Workshops, certifications, training attended..." },
      { id: "f10", type: "textarea", label: "Goals for Next Year", placeholder: "What do you aim to achieve?" }
    ];

    const { error: e3 } = await supabase.from('forms').update({
      fields: JSON.stringify(normalFields)
    }).eq('id', 1);
    if (e3) throw e3;

    // Update multi form (id=5) — combination of normal + branching + quiz
    const multiFields = [
      // Section 1: Normal fields
      {
        id: "sec_normal", type: "section", label: "Part 1 \u2014 Basic Information (Normal)",
        section_type: "normal",
        children: [
          { id: "mn1", type: "text", label: "Full Name", required: true, placeholder: "Enter your full name" },
          { id: "mn2", type: "email", label: "Email", required: true },
          { id: "mn3", type: "select", label: "School Type", options: ["Primary", "Secondary", "Senior Secondary"], required: true },
          { id: "mn4", type: "number", label: "Total Students", min: 1, max: 5000 },
          { id: "mn5", type: "file", label: "School Photo", allowedFormats: ["jpg", "png"], maxSizeMB: 5 }
        ]
      },
      // Section 2: Branching fields
      { id: "mb_trigger", type: "select", label: "Your Department", required: true, options: ["Academic", "Administration", "Sports"], is_trigger: true },
      {
        id: "sec_academic", type: "section", label: "Part 2 \u2014 Academic Department Questions",
        section_type: "branching",
        show_when: { field: "mb_trigger", equals: "Academic" },
        children: [
          { id: "ma1", type: "textarea", label: "Describe curriculum improvements this year", required: true },
          { id: "ma2", type: "number", label: "Average student pass rate (%)", min: 0, max: 100 }
        ]
      },
      {
        id: "sec_admin", type: "section", label: "Part 2 \u2014 Administration Questions",
        section_type: "branching",
        show_when: { field: "mb_trigger", equals: "Administration" },
        children: [
          { id: "mad1", type: "textarea", label: "Key administrative challenges faced", required: true },
          { id: "mad2", type: "select", label: "Budget utilization", options: ["Below 50%", "50-75%", "75-90%", "Above 90%"] }
        ]
      },
      {
        id: "sec_sports", type: "section", label: "Part 2 \u2014 Sports Department Questions",
        section_type: "branching",
        show_when: { field: "mb_trigger", equals: "Sports" },
        children: [
          { id: "ms1", type: "checkbox", label: "Sports facilities available", options: ["Cricket Ground", "Football Field", "Basketball Court", "Swimming Pool", "Indoor Gym"] },
          { id: "ms2", type: "number", label: "Number of sports achievements this year" }
        ]
      },
      // Section 3: Quiz MCQs
      {
        id: "sec_quiz", type: "section", label: "Part 3 \u2014 Knowledge Assessment (Quiz)",
        section_type: "quiz",
        children: [
          { id: "mq1", type: "mcq", label: "RTE Act was passed in which year?", options: ["2006", "2009", "2010", "2012"], correct: "2009", points: 10 },
          { id: "mq2", type: "mcq", label: "CBSE stands for?", options: ["Central Board of School Education", "Central Board of Secondary Education", "Central Bureau of Secondary Education", "Central Board of Senior Education"], correct: "Central Board of Secondary Education", points: 10 },
          { id: "mq3", type: "mcq", label: "Mid-Day Meal scheme covers up to which class?", options: ["Class 5", "Class 8", "Class 10", "Class 12"], correct: "Class 8", points: 10 }
        ]
      }
    ];

    const { error: e4 } = await supabase.from('forms').update({
      fields: JSON.stringify(multiFields),
      settings: JSON.stringify({ time_limit: 20, passing_score: 50 })
    }).eq('id', 5);
    if (e4) throw e4;

    return res.status(200).json({ success: true, message: 'All form fields updated successfully' });
  } catch (err) {
    console.error('Seed error:', err);
    return res.status(500).json({ error: err.message });
  }
}
