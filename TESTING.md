# SchoolData Portal — Complete Testing Guide

## Test Credentials

| Role | Login Method | Email | Password/OTP |
|------|-------------|-------|-------------|
| **Admin** | Password | `admin@school.edu` | `admin123` |
| **Reviewer** (Priya) | Password | `priya.reviewer@school.edu` | `reviewer123` |
| **Reviewer** (Amit) | Password | `amit.reviewer@school.edu` | `reviewer123` |
| **Functionary** (KV001) | OTP | `head.kv001@cbss.school.org` | `123456` |
| **Functionary** (DAV002) | OTP | `head.dav002@cbss.school.org` | `123456` |
| **Functionary** (JNV003) | OTP | `head.jnv003@cbss.school.org` | `123456` |
| **Teacher** (Anita) | OTP | `anita.teacher@school.edu` | `123456` |
| **Teacher** (Vikram) | OTP | `vikram.teacher@school.edu` | `123456` |

---

## Test Forms Available

| ID | Title | Type | Status | Fields |
|----|-------|------|--------|--------|
| 1 | Annual Teacher Performance Survey 2024 | Normal | Active | 10 fields (text, email, phone, select, number, radio, textarea) |
| 2 | Best Teacher Award Nomination 2024 | Nomination | Active | 4 fields |
| 3 | School Infrastructure Assessment | Branching | Active | 8 fields (4 conditional sections: Maths/Science/English/Hindi) |
| 4 | CBSE Curriculum Knowledge Quiz | Quiz | Active | 10 MCQ questions, 100 total marks, 15 min timer |
| 5 | Multi-Part School Readiness Assessment | Multi | Active | Normal + Branching + Quiz combined, 20 min timer |

---

## 1. LOGIN TESTS

### 1.1 Admin/Reviewer Password Login
1. Open app → Select **"Admin / Reviewer"** portal
2. Enter `admin@school.edu` / `admin123`
3. Click **Sign In**
4. ✅ Should see admin dashboard with all sidebar items (Dashboard, User Management, Form Builder, Submissions, Review System, Analytics, Email Templates, Audit Logs, Exports)

### 1.2 School Functionary OTP Login
1. Click **← Back** → Select **"School Functionary"** portal
2. Enter `head.kv001@cbss.school.org`
3. Click **Request OTP**
4. ✅ Should show success: "OTP sent! Use 123456 for localhost testing."
5. ✅ Should show extracted school code: **KV001**
6. Enter `123456` → Click **Verify & Sign In**
7. ✅ Should see functionary dashboard with sidebar: Dashboard, My Forms, Nominations, Submissions
8. ✅ Sidebar should show school code badge: **KV001**
9. ✅ Session should expire in 30 minutes (session warning at 28 min)

### 1.3 Teacher OTP Login
1. Click ← Back → Select **"Teacher"** portal
2. Enter `anita.teacher@school.edu`
3. Request OTP → Enter `123456` → Verify
4. ✅ Should see teacher dashboard: Dashboard, Available Forms, My Submissions

### 1.4 Error Cases
- Wrong password → ✅ Shows "Invalid credentials"
- Wrong OTP (`999999`) → ✅ Shows "Invalid OTP"
- Non-existent email → ✅ Shows "User not found"
- Functionary trying password login → ✅ Shows "Access denied"

---

## 2. NORMAL FORM (Type 1)

### 2.1 Admin: View Normal Form
1. Login as **Admin**
2. Go to **Form Builder** → Active tab
3. Find **"Annual Teacher Performance Survey 2024"**
4. Click the **pencil icon** (Edit Fields)
5. ✅ Should show 10 fields: Full Name, Email Address, Phone Number, Subject (dropdown), Grade/Class, Years of Experience (number), Self Assessment Rating (radio), Key Achievements (textarea), Professional Development (textarea), Goals (textarea)
6. Each field should show type badge, label, REQ indicator if required

### 2.2 Admin: Edit Fields
1. In the field builder, click on any field to expand
2. ✅ Can change label, type, required, placeholder
3. ✅ For dropdown/radio: can edit options (one per line)
4. ✅ For number: can set min/max
5. ✅ For textarea: can set maxLength
6. Click **+ Text (Short)** to add a new field
7. ✅ New field appears at bottom
8. ✅ Can reorder with ↑↓ arrows
9. ✅ Can duplicate with copy icon
10. ✅ Can delete with trash icon
11. Click **Save Fields** → fields saved

### 2.3 Admin: Preview Form
1. Click the **eye icon** (Preview) on the form
2. ✅ Should show the form exactly as a user would see it
3. ✅ All field types render correctly
4. ✅ Required fields marked with red *
5. ✅ Progress bar at top

### 2.4 Teacher: Fill Normal Form
1. Login as **Teacher** (anita.teacher@school.edu / 123456)
2. Go to **Available Forms** → Find "Annual Teacher Performance Survey"
3. Click the **▶ play icon** to fill
4. ✅ Form header shows title, description, type badge, expiry date
5. ✅ All 10 fields render correctly:
   - Text input with placeholder
   - Email input with validation
   - Phone input
   - Dropdown with 8 subject options
   - Another dropdown for grade
   - Number input (min 0, max 50)
   - Radio buttons (5 rating options)
   - Textarea with character counter
   - Two more textareas
6. ✅ Progress bar updates as you fill required fields
7. Fill partially → Click **Save Draft**
8. ✅ Shows "Auto-saved at [time]"
9. Navigate away → Come back → ✅ Draft is restored
10. Fill all required fields → Click **Submit**
11. ✅ Shows "Submission Complete!" screen
12. ✅ No score shown (normal form has no scoring)

### 2.5 Validation
1. Try submitting with empty required fields
2. ✅ Red error messages appear: "Full Name is required", etc.
3. Enter invalid email → ✅ Shows "Invalid email"
4. Enter number outside min/max → ✅ Shows "Min 0" or "Max 50"

---

## 3. BRANCHING FORM (Type 3)

### 3.1 Admin: View Branching Structure
1. Login as **Admin** → Form Builder
2. Find **"School Infrastructure Assessment"** (branching)
3. Click **pencil icon** (Edit Fields)
4. ✅ Should show:
   - "Your Subject" (select, trigger field) — marked as **Branch trigger**
   - "Full Name" (text, required)
   - "Years of Experience" (number, required)
   - **Mathematics Section** (section) — IF b1 == Mathematics
     - Board syllabus (select), Average class score (number), Algebra approach (textarea)
   - **Science Section** (section) — IF b1 == Science
     - Science stream (select), Lab facilities (checkbox), Practical session (textarea)
   - **English Section** (section) — IF b1 == English
     - Focus area (select), Reading habits (textarea)
   - **Hindi Section** (section) — IF b1 == Hindi
     - Grammar method (textarea), Students above 80% (number)
   - "Additional comments" (textarea)

### 3.2 Admin: Edit Branch Rules
1. Click on any section (e.g., "Mathematics Section") to expand
2. ✅ Shows branch rule: **IF field** = "Your Subject" **EQUALS** "Mathematics"
3. ✅ Can change the trigger field from dropdown
4. ✅ Can change the equals value from trigger's options
5. ✅ Can add/remove child fields inside the section

### 3.3 Teacher: Fill Branching Form
1. Login as **Teacher**
2. Go to Available Forms → Fill "School Infrastructure Assessment"
3. ✅ Initially shows: Subject dropdown, Full Name, Years of Experience, Additional comments
4. ✅ NO conditional sections visible yet

5. **Select "Mathematics"** from Subject dropdown
6. ✅ **Mathematics Section** appears with animation (slide in)
7. ✅ Shows: Board syllabus, Average class score, Algebra approach
8. ✅ Science/English/Hindi sections are HIDDEN
9. ✅ Progress bar recalculates based on visible required fields only

10. **Change to "Science"**
11. ✅ Mathematics section disappears (animation out)
12. ✅ Science section appears: Science stream, Lab facilities (checkboxes), Practical session
13. ✅ Previously entered Maths data is cleared from visible section

14. **Change to "English"**
15. ✅ Science disappears → English appears: Focus area, Reading habits

16. **Change to "Hindi"**
17. ✅ English disappears → Hindi appears: Grammar method, Students above 80%

18. Fill all visible fields → Submit
19. ✅ Submission stored with ONLY visible field data
20. ✅ Hidden section data NOT included in submission

### 3.4 Verify Submission Data
1. Login as **Admin** → Submissions
2. Find the branching submission
3. Click to view → ✅ Response data only contains the selected subject's fields
4. ✅ No data from hidden sections

---

## 4. QUIZ FORM (Type 4)

### 4.1 Admin: View Quiz Structure
1. Login as **Admin** → Form Builder
2. Find **"CBSE Curriculum Knowledge Quiz"** (quiz)
3. Click **pencil icon**
4. ✅ Shows 10 MCQ questions
5. Each question shows: label, options, **correct answer** (yellow box), **points** (10 each)
6. ✅ Total: 10 questions × 10 marks = 100 marks

### 4.2 Admin: Edit Quiz
1. Click on any question to expand
2. ✅ Can edit question text
3. ✅ Can edit options (one per line)
4. ✅ Can select correct answer from dropdown
5. ✅ Can set points per question
6. ✅ Yellow box shows: "Correct answer is hidden from users and reviewers. Only admin sees it."

### 4.3 Admin: Quiz Settings
1. Click **settings icon** on the quiz form
2. ✅ Quiz Settings panel shows:
   - Time Limit: 15 min
   - Passing Score: 60%
   - Negative Marking: No
   - Shuffle options: checkbox

### 4.4 Teacher: Take Quiz
1. Login as **Teacher**
2. Go to Available Forms → Click ▶ on "CBSE Curriculum Knowledge Quiz"
3. ✅ **Quiz Ready** start screen appears:
   - "10 quiz questions · 100 total marks"
   - "Time: 15 min"
   - "Pass: 60%"
   - "Timer starts on Begin. Auto-submits when time runs out."
4. Click **Begin Quiz**
5. ✅ Timer starts counting down: "14:59 remaining"
6. ✅ 10 MCQ questions displayed
7. ✅ Each question shows options as radio buttons
8. ✅ **NO correct answers visible**
9. ✅ **NO marks/points visible** on questions
10. ✅ Progress bar tracks answered questions

11. Answer 8 out of 10 correctly:
    - Q1: 2020 ✓
    - Q2: Mother tongue / regional language ✓
    - Q3: 5+3+3+4 ✓
    - Q4: Higher Education Commission of India (HECI) ✓
    - Q5: 6 years ✓
    - Q6: Made easier with focus on core competencies ✓
    - Q7: 6% ✓
    - Q8: Grade 6 ✓
    - Q9: Pick wrong answer ✗
    - Q10: Pick wrong answer ✗

12. Click **Submit**
13. ✅ Shows "Submission Complete!"
14. ✅ Message: "Your response has been submitted. Scores are calculated by the system and not visible to participants."
15. ✅ **NO score shown to teacher**

### 4.5 Score Visibility Rules

#### As Teacher (viewing own submission):
1. Go to **My Submissions** → Click on quiz submission
2. ✅ Score column is **HIDDEN** in table
3. ✅ Score card is **NOT shown** in detail modal
4. Click "View Full Response" → ✅ Shows questions + selected answers
5. ✅ **NO correct answers highlighted**
6. ✅ **NO score displayed**
7. ✅ **NO marks per question shown**

#### As Reviewer:
1. Login as **Reviewer** (priya.reviewer@school.edu / reviewer123)
2. Go to **Submissions** → Find quiz submission
3. ✅ Score column **IS visible** in table (e.g., "80%")
4. Click on submission → ✅ Score card shows "80%"
5. Click "View Full Response" → ✅ Shows:
   - Questions + user's selected answers
   - Total score: 80%
   - "PASSED" or "FAILED" indicator
   - "Note: Correct answers are hidden. Only admin can see answer key."
6. ✅ **NO green/red highlighting on options**
7. ✅ **NO correct answer indicators**
8. ✅ **NO marks per question**

#### As Admin:
1. Login as **Admin**
2. Go to **Submissions** → Find quiz submission
3. ✅ Score visible in table
4. Click "View Full Response" → ✅ Shows:
   - Questions with **correct answers highlighted in green**
   - Wrong answers highlighted in **red**
   - Per-question: "✓ +10 marks" or "✗ 0 marks"
   - Points badge on each question: "10 marks"
   - Total score: 80%
   - "8/10 correct"
   - PASSED/FAILED indicator

### 4.6 Quiz Timer Auto-Submit
1. Login as Teacher → Start quiz
2. Wait for timer to reach 0:00
3. ✅ Form auto-submits with whatever answers were selected
4. ✅ Score calculated on whatever was answered

---

## 5. MULTI FORM (Type 5)

### 5.1 Structure
1. Login as **Admin** → Form Builder → Find "Multi-Part School Readiness Assessment"
2. Click pencil icon
3. ✅ Shows mixed structure:
   - **Part 1 — Basic Information (Normal)**: name, email, school type, total students, file upload
   - **Your Department** (trigger dropdown): Academic / Administration / Sports
   - **Part 2 — Academic** (branching): curriculum improvements, pass rate — shows IF Department=Academic
   - **Part 2 — Administration** (branching): challenges, budget — shows IF Department=Administration
   - **Part 2 — Sports** (branching): facilities checklist, achievements — shows IF Department=Sports
   - **Part 3 — Knowledge Assessment (Quiz)**: 3 MCQ questions with correct answers and marks

### 5.2 Fill Multi Form
1. Login as Teacher → Fill "Multi-Part School Readiness Assessment"
2. ✅ Start screen shows: "3 quiz questions · 30 total marks · Time: 20 min"
3. Click Begin Form
4. ✅ Part 1 always visible (normal fields)
5. ✅ Department dropdown visible
6. Select "Academic" → ✅ Academic section appears, others hidden
7. ✅ Part 3 Quiz always visible (no branching condition)
8. ✅ Quiz questions show as MCQ radio buttons (no correct answers shown)
9. Fill everything → Submit
10. ✅ Score calculated from quiz portion only
11. ✅ Branching data: only visible section submitted

---

## 6. FORM BUILDER TESTS

### 6.1 Create New Form
1. Login as Admin → Form Builder
2. Click **Create Form** or click a type card
3. ✅ Modal opens with: Title, Description, Form Type, Status, Expiry Date
4. ✅ Form Settings section: Login Type (OTP/Direct), Review Type (Marks/Grade)
5. ✅ Type-specific settings appear:
   - Nomination: Max teachers per school, Teacher login type
   - Quiz: Time limit, Passing score, Negative marking, Shuffle
   - Branching: Info about IF-THEN rules
6. Fill in details → Click **Create Form**
7. ✅ Form created, appears in list

### 6.2 Field Builder
1. Click pencil icon on any form
2. ✅ Add buttons at bottom: Text, Long Text, Number, Email, Phone, Date, Dropdown, Radio, Checkbox, File Upload, MCQ, Rating, Section
3. ✅ For quiz forms: only MCQ add button shown
4. ✅ For normal forms: Section and MCQ buttons hidden
5. ✅ For branching/multi: all buttons shown

### 6.3 File Upload Field
1. Add a File Upload field
2. Expand it → ✅ Shows: Allowed Formats (pdf, jpg, png), Max Size (5 MB)
3. ✅ Can change formats and size
4. Preview → ✅ Shows upload area with format/size info

### 6.4 Clone Form
1. Click **copy icon** on any form
2. ✅ Creates "[Form Name] (Copy)" with same fields
3. ✅ Status set to draft

### 6.5 Version History
1. Click **history icon** on a form
2. ✅ Shows version list: v1 "Initial creation", v2 "Updated", etc.
3. ✅ Each version shows timestamp

---

## 7. NOMINATION FLOW

### 7.1 Functionary: View Nominations
1. Login as **Functionary** (head.kv001@cbss.school.org / 123456)
2. Go to **Nominations**
3. ✅ Shows nomination limit progress bar (e.g., 3/5 nominations)
4. ✅ Shows teacher table: name, school code, status, access type, reminders

### 7.2 Functionary: Add Teacher
1. Select a form from dropdown
2. Click **Add Teacher**
3. Fill: name, email, phone, access type (OTP/Direct)
4. ✅ School code auto-attached (KV001)
5. ✅ "Teacher account auto-created if new"
6. Click **Add & Invite**
7. ✅ Teacher appears in table with status "invited"

### 7.3 Functionary: Bulk Import
1. Click **CSV Import**
2. Paste: `Teacher1, t1@test.com, +911111111111`
3. Click **Import & Invite**
4. ✅ Teachers created and added to nominations

### 7.4 Functionary: Actions
1. ✅ Can copy unique link for each teacher
2. ✅ Can resend reminders (reminder count increments)
3. ✅ Can see status: invited / in_progress / completed
4. ✅ **Cannot see teacher's actual form responses** (only name + status)

---

## 8. REVIEW SYSTEM

### 8.1 Admin: Create Review Level
1. Login as Admin → Review System
2. Click **Create Level**
3. ✅ Form: select form, level number, name, scoring type (form/question level), grade scale, reviewer IDs, blind review toggle
4. Create level → ✅ Appears in review levels list

### 8.2 Admin: Review Stats
1. ✅ Shows 3 stat cards: Pending / Approved / Rejected counts
2. ✅ Review levels section shows all configured levels

### 8.3 Reviewer: Review Submissions
1. Login as **Reviewer**
2. Go to **My Reviews** → Pending tab
3. Click on a pending review
4. ✅ Shows submission responses
5. ✅ Can enter: Overall Score (0-100), Grade (A/B/C/D), Recommendation
6. ✅ Can add review comments
7. ✅ **Save Draft** button saves without finalizing
8. Click **Approve** or **Reject**
9. ✅ Review status updated
10. ✅ Submission status updated to approved/rejected
11. ✅ Audit log entry created

---

## 9. DASHBOARD TESTS

### 9.1 Admin Dashboard
1. ✅ 4 stat cards: Total Users, Active Forms, Submissions, Pending Reviews
2. ✅ Recent Submissions list with status badges
3. ✅ Activity Timeline with audit log entries (shows IP addresses)
4. ✅ Submission Status bar chart
5. ✅ Users by Role cards

### 9.2 Functionary Dashboard
1. ✅ 4 stat cards: Active Forms, Nominations, Completion Rate, Pending
2. ✅ Shows school code in sidebar

### 9.3 Teacher Dashboard
1. ✅ 4 stat cards: Available Forms, My Submissions, Approved, Under Review

### 9.4 Reviewer Dashboard
1. ✅ 4 stat cards: Pending Reviews, Completed, Avg Score, Total Submissions

---

## 10. OTHER FEATURES

### 10.1 Analytics (Admin only)
1. ✅ Form selector dropdown (All Forms or specific form)
2. ✅ 5 KPI cards with gradients
3. ✅ Submission Timeline bar chart
4. ✅ Submission Status distribution bars
5. ✅ Score Distribution chart
6. ✅ Nomination Status cards
7. ✅ Active School Codes list

### 10.2 Email Templates (Admin only)
1. ✅ List of templates: Invite, OTP, Confirmation, Reminder, etc.
2. ✅ Create/Edit with: Name, Type, Subject, Body
3. ✅ Variable buttons: {{teacher_name}}, {{form_link}}, {{school_code}}, {{deadline}}, etc.
4. ✅ Click variable → inserts into body

### 10.3 Audit Logs (Admin only)
1. ✅ Table: ID, User, Action, Details (IP, method, school code), Timestamp
2. ✅ Filter by action type
3. ✅ Shows IP addresses and user agents

### 10.4 Exports (Admin only)
1. ✅ 7 export cards: Users, Forms, Submissions, Nominations, Reviews, Review Scores, Audit Logs
2. ✅ Click Export CSV → downloads file
3. ✅ Export logged in audit trail

### 10.5 User Management (Admin only)
1. ✅ Table with all users, filterable by role
2. ✅ Create user: name, email, phone, role, school, district, password, status
3. ✅ Edit user (click row)
4. ✅ Delete user
5. ✅ Bulk Import CSV
6. ✅ Export CSV

### 10.6 Notifications
1. ✅ Bell icon in header with unread count badge
2. ✅ Click → dropdown with notification list
3. ✅ Mark all read button

### 10.7 Dark Mode
1. ✅ Toggle sun/moon icon in header
2. ✅ All pages render correctly in dark mode
3. ✅ Persists on reload

### 10.8 Session Timeout
1. ✅ Functionary: 30-minute session
2. ✅ Admin/Reviewer: 24-hour session
3. ✅ Warning bar appears at 2 minutes remaining
4. ✅ "Extend Session" button available
5. ✅ Auto-logout when expired

### 10.9 Profile Page
1. ✅ Shows user info: name, email, phone, role, school, district
2. ✅ Session info: timeout duration, auth method
3. ✅ School code displayed for functionaries

### 10.10 Breadcrumbs
1. ✅ Header shows: Home > Current Page
2. ✅ Clickable navigation

### 10.11 Mobile Responsive
1. ✅ Sidebar collapses to hamburger menu
2. ✅ Tables scroll horizontally
3. ✅ All buttons min-height 44px (touch targets)
4. ✅ Forms stack vertically on mobile

---

## 11. SECURITY CHECKS

| Check | Status |
|-------|--------|
| Password not returned in API responses | ✅ `password_hash` stripped from user objects |
| Quiz correct answers hidden from teacher | ✅ Only `viewMode=admin` shows correct answers |
| Quiz score hidden from teacher | ✅ Score column hidden, score card hidden |
| Quiz score visible to reviewer (no answers) | ✅ Score shown, correct answers hidden |
| Quiz score + answers visible to admin | ✅ Full scoring breakdown shown |
| Wrong OTP rejected | ✅ Returns 401 |
| Wrong password rejected | ✅ Returns 401 |
| Non-existent user rejected | ✅ Returns 404 |
| Functionary can't use password login | ✅ Returns 403 |
| School code extracted from email | ✅ head.kv001@cbss.school.org → KV001 |
| Session timeout enforced | ✅ Token has `exp` field checked |
| Audit logs track logins with IP | ✅ IP and user-agent stored |
| Branching: hidden fields not submitted | ✅ Only visible field IDs included |
| CORS headers on all APIs | ✅ All routes have CORS headers |

---

## 12. KNOWN LIMITATIONS

1. **File upload**: Simulated (stores filename string, not actual file binary) — needs S3/Supabase Storage integration for production
2. **Email sending**: Simulated (templates stored but no SMTP integration) — needs SendGrid/SES for production
3. **QR code generation**: Not yet implemented — needs qrcode library
4. **Offline/PWA**: Service worker not configured — needs workbox setup
5. **Drag-drop reorder**: Uses arrow buttons instead of true drag-drop — needs dnd-kit library
6. **Negative marking**: Deducts 25% fixed — not configurable per-question yet
