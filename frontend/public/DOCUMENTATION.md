# SchoolData Portal — Complete Documentation

## Overview
SchoolData Portal is a comprehensive school data collection system built for education boards and government organizations. It supports multi-portal access for Admins, Reviewers, School Functionaries, and Teachers with role-based access control, 5 form types, multi-level review pipelines, and full audit trails.

---

## Table of Contents
1. [Quick Start & Login Credentials](#1-quick-start--login-credentials)
2. [Architecture](#2-architecture)
3. [Authentication System](#3-authentication-system)
4. [Form Builder — 5 Types](#4-form-builder--5-types)
5. [Form Fill Flow](#5-form-fill-flow)
6. [Submission System](#6-submission-system)
7. [Review System](#7-review-system)
8. [Nomination System](#8-nomination-system)
9. [Analytics](#9-analytics)
10. [User Management](#10-user-management)
11. [Email Templates](#11-email-templates)
12. [Audit Logs](#12-audit-logs)
13. [Data Exports](#13-data-exports)
14. [Database Schema](#14-database-schema)
15. [API Reference](#15-api-reference)
16. [Security](#16-security)

---

## 1. Quick Start & Login Credentials

### Test Accounts

| Role | Email | Password/OTP | Session |
|------|-------|-------------|---------|
| **Admin** | `admin@school.edu` | `admin123` | 24 hours |
| **Reviewer** | `priya.reviewer@school.edu` | `reviewer123` | 24 hours |
| **Reviewer** | `amit.reviewer@school.edu` | `reviewer123` | 24 hours |
| **Functionary** | `head.kv001@cbss.school.org` | OTP: `123456` | 30 minutes |
| **Functionary** | `head.dav002@cbss.school.org` | OTP: `123456` | 30 minutes |
| **Teacher** | `anita.teacher@school.edu` | OTP: `123456` | 24 hours |
| **Teacher** | `vikram.teacher@school.edu` | OTP: `123456` | 24 hours |

> **Localhost OTP:** Always use `123456` for all OTP verifications.

### Login Portals
- **Admin/Reviewer:** Username + Password login
- **School Functionary:** Email OTP (format: `head.{code}@cbss.school.org`)
- **Teacher:** Email/Phone OTP or direct link access

---

## 2. Architecture

### Tech Stack
- **Frontend:** React 19 + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

### Project Structure
```
├── api/                    # Serverless API routes
│   ├── auth.js             # Authentication (login, OTP, token verify)
│   ├── forms.js            # CRUD for forms
│   ├── submissions.js      # CRUD for submissions
│   ├── reviews.js          # Review pipeline
│   ├── nominations.js      # Teacher nominations
│   ├── review-levels.js    # Multi-level review config
│   ├── review-scores.js    # Detailed scoring
│   ├── email-templates.js  # Email template management
│   ├── form-versions.js    # Version history
│   ├── notifications.js    # In-app notifications
│   ├── comments.js         # Comment threads
│   ├── audit-logs.js       # Security audit trail
│   ├── stats.js            # Analytics/statistics
│   └── users.js            # User management
├── src/
│   ├── components/
│   │   ├── FormRenderer.tsx     # Universal form rendering engine
│   │   ├── FormFieldBuilder.tsx # Visual field editor for admins
│   │   ├── Layout.tsx           # App shell with sidebar
│   │   ├── DataTable.tsx        # Searchable/sortable table
│   │   ├── Modal.tsx            # Reusable modal
│   │   ├── StatCard.tsx         # Dashboard stat cards
│   │   └── StatusBadge.tsx      # Status pills
│   ├── pages/
│   │   ├── Login.tsx            # Multi-portal login
│   │   ├── Dashboard.tsx        # Role-based dashboard
│   │   ├── Forms.tsx            # Form builder + listing
│   │   ├── FormFill.tsx         # Form fill page (user-facing)
│   │   ├── FormView.tsx         # Read-only submission viewer
│   │   ├── Submissions.tsx      # Submission management
│   │   ├── Reviews.tsx          # Review pipeline
│   │   ├── Nominations.tsx      # Functionary nominations
│   │   ├── Analytics.tsx        # Charts and insights
│   │   ├── UserManagement.tsx   # User CRUD
│   │   ├── EmailTemplates.tsx   # Template editor
│   │   ├── AuditLogs.tsx        # Security logs
│   │   ├── Exports.tsx          # CSV data exports
│   │   └── Profile.tsx          # User profile
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   ├── auth.ts              # Auth utilities
│   │   └── theme.ts             # Dark mode
│   └── hooks/
│       └── useAuth.ts           # Auth hook
```

---

## 3. Authentication System

### Dual Auth Model

**Admin/Reviewer — Password Login:**
- Email + password stored in `users.password_hash`
- Returns JWT-like base64 token with 24h expiry
- All logins logged to `audit_logs` with IP + user agent

**Functionary — Email OTP:**
- Email format: `head.{school_code}@cbss.school.org`
- System auto-extracts school code (e.g., `KV001` from `head.kv001@cbss.school.org`)
- OTP: `123456` for localhost testing
- Session: 30 minutes (shorter for security)
- Session timeout warning appears at 2 minutes remaining

**Teacher — OTP or Direct Link:**
- OTP via email or phone
- Direct link access: `/form/fill?token={unique_token}&sc={SCHOOL_CODE}`
- Token validated against nominations table

### Session Management
- Token stored in `localStorage`
- Auto-verified on page load via `POST /api/auth { action: "verify-token" }`
- Session expiry check runs every second
- Warning banner at 2 minutes remaining with "Extend" button

---

## 4. Form Builder — 5 Types

### Type 1: Normal Form
**What:** Standard form with fields, anyone with the link fills it.

**Available Fields:**
| Field Type | Description |
|-----------|-------------|
| Text (Short) | Single-line text input |
| Text (Long) | Multi-line textarea |
| Number | Numeric input with min/max |
| Email | Email with validation |
| Phone | Phone number input |
| Date | Date picker |
| Dropdown | Select from admin-defined options |
| Radio | Single-select radio buttons |
| Checkbox | Multi-select checkboxes |
| File Upload | Upload with format/size limits |
| Rating | 1-5 (or custom) star rating |

**Logic:** Fields render top-to-bottom → user fills → submits → data stored as-is.

**Settings:**
- Form expiry date/time — after this, link stops working
- Login type: OTP required or direct fill
- Review type: Marks or Grade

---

### Type 2: Nomination Form
**What:** Admin creates form → sends to functionaries → functionaries nominate teachers → teachers fill the form.

**Flow:**
1. Admin creates nomination form
2. Admin sets max teacher limit per functionary (e.g., 5)
3. Admin uploads CSV of functionary emails
4. System sends form link to each functionary
5. Functionary logs in via OTP → sees form → nominates teachers (name, email, phone)
6. Admin gets all nominated teacher emails
7. Admin bulk-sends form link to teachers
8. Teacher gets link → logs in via OTP → fills form
9. Functionary can see teacher name + fill status (NOT form content)

**Settings:**
- `max_nominations`: Max teachers per functionary
- `teacher_login`: OTP or direct link (no login)

---

### Type 3: Branching Form
**What:** Form that shows/hides sections based on user's previous answers.

**Logic:**
```
IF field_X value == "Maths"
  → SHOW Section_A (maths questions)
  → HIDE Section_B, Section_C

IF field_X value == "Science"
  → SHOW Section_B (science questions)
  → HIDE Section_A, Section_C
```

**How admin builds it:**
1. Add a **trigger field** (Dropdown or Radio) — mark it as "Branch trigger"
2. Add **Sections** — each section has an IF-THEN rule:
   - IF `trigger_field` EQUALS `value` → SHOW this section
3. Add fields inside each section
4. Fields outside sections always show

**On submit:** Only visible/shown fields are submitted. Hidden fields' data is NOT stored.

**Example (seeded in Form #3):**
- Q: "Your Subject" [Dropdown: Maths, Science, English, Hindi]
- If Maths → Shows: Board syllabus, Average score, Algebra approach
- If Science → Shows: Stream, Lab facilities, Practical description
- If English → Shows: Focus area, Reading habits strategy
- If Hindi → Shows: Grammar method, Student scores

---

### Type 4: Quiz Form
**What:** MCQ-only form with predefined correct answers and marks. System auto-calculates score.

**Admin defines per question:**
- `question_text` — the question
- `options[]` — MCQ choices
- `correct_answer` — **hidden from user AND reviewer**
- `points` — marks for correct answer

**On submit:**
```
FOR each question:
  IF user_answer == correct_answer
    score += points
  ELSE IF negative_marking_enabled AND user_answered
    score -= points * 0.25

total_percentage = (score / total_possible) * 100
```

**Visibility Rules:**
| Who | Sees Questions | Sees Options | Sees Correct Answers | Sees Marks/Points | Sees Total Score |
|-----|:-:|:-:|:-:|:-:|:-:|
| **User (Teacher)** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Reviewer** | ✅ | ✅ (user's answer highlighted) | ❌ | ❌ | ✅ |
| **Admin** | ✅ | ✅ (correct=green, wrong=red) | ✅ | ✅ | ✅ |

**Quiz Settings:**
- `time_limit`: Minutes (timer with auto-submit)
- `passing_score`: Percentage to pass
- `negative_marking`: 25% deduction for wrong answers
- `shuffle_options`: Randomize option order

**Example (seeded in Form #4):** 10 questions about NEP 2020, 10 marks each, 100 total.

---

### Type 5: Multi-Form
**What:** Combination of Normal + Branching + Quiz in one form.

**Logic:**
1. Some sections = normal fields (always visible)
2. Some sections = branching (conditional visibility)
3. Some sections = quiz MCQs (auto-scored)
4. On submit: branching logic runs first (hide/show), then quiz scoring runs on visible MCQs

**Example (seeded in Form #5):**
- Part 1: Normal (name, email, school type, file upload)
- Part 2: Branching (if Department=Academic → academic questions, if Sports → sports questions)
- Part 3: Quiz (3 MCQs about RTE Act, CBSE, Mid-Day Meal)

---

## 5. Form Fill Flow

### For Users (Teachers/Functionaries)

1. Navigate to **Forms** → click **Fill** button on active form
2. Form renders with all fields based on type:
   - Normal: All fields shown top-to-bottom
   - Branching: Trigger dropdown shown first → selecting value reveals relevant section
   - Quiz: Start screen with question count, time limit, passing score → click "Begin" → timer starts
   - Multi: All sections render, branching applies, quiz timer runs
3. **Progress bar** shows completion percentage
4. **Auto-save** every 30 seconds (shows timestamp)
5. **Save Draft** button for manual save
6. **Validation** on submit: required fields, email format, min/max
7. **Submit** → data stored → success screen

### Draft Recovery
- If user has a saved draft, it auto-loads when they return
- Draft responses pre-fill all fields
- User can continue editing and submit

### Expiry Handling
- Expired forms show "Form Expired" screen
- No fill or edit allowed after expiry

---

## 6. Submission System

### Data Storage
Each submission stores:
- `form_id`, `user_id`, `user_name`, `user_email`
- `form_title` (denormalized for quick display)
- `responses` (JSON object: `{ field_id: value }`)
- `status`: submitted | under_review | approved | rejected
- `score`: Quiz percentage (null for non-quiz forms)
- `is_draft`: Boolean for draft saves
- `submitted_at`: Timestamp

### Viewing Submissions
- **Admin:** Sees all submissions with scores
- **Reviewer:** Sees assigned submissions with scores (no correct answers)
- **Teacher/Functionary:** Sees only own submissions (no scores)

### "View Full Response" Button
Opens the FormView page which renders the submission using FormRenderer in read-only mode with proper viewMode:
- `viewMode='admin'`: Correct answers highlighted green/red, points shown, full score breakdown
- `viewMode='reviewer'`: User answers shown, total score shown, correct answers hidden
- `viewMode='user'`: Only user's answers shown, no scoring info

---

## 7. Review System

### Multi-Level Pipeline
1. **Admin creates Review Levels** for a form:
   - Level 1: "Initial Screening" — assign reviewers, set scoring type
   - Level 2: "Detailed Review" — filter from Level 1 results (e.g., grade ≥ B)
2. **Reviewer** sees assigned submissions → scores → adds comments → approves/rejects
3. **Admin** views all scores, creates next level from filtered results

### Scoring Options
- **Form-level:** Single overall score + grade
- **Question-level:** Score each question individually
- **Grade scale:** Configurable (A/B/C/D or Outstanding/Good/Average)
- **Blind review:** Reviewer can't see submitter's identity

### Review Score Storage
- `question_scores`: JSON of per-question marks
- `overall_score`: Numeric
- `grade`: Letter grade
- `comments`: Text feedback
- `recommendation`: approve | reject | next_level | revise
- `is_draft`: Reviewers can save drafts

---

## 8. Nomination System

### Functionary Dashboard
- See assigned forms with nomination limits (e.g., 3/5 used)
- Progress bars showing invited/in-progress/completed
- Add teachers individually or via CSV bulk import
- Copy unique links, resend invites

### Teacher Nomination Flow
1. Functionary adds teacher (name, email, phone)
2. System auto-creates teacher account if new
3. Generates unique token link: `/form/fill?token={tok}&sc={CODE}`
4. Teacher access: OTP or direct link (configurable per form)
5. Functionary sees teacher name + status (NOT form responses)

---

## 9. Analytics

### Dashboard Analytics
- KPI cards: Users, Active Forms, Submissions, Completion Rate, Avg Score
- Submission timeline bar chart (last 14 days)
- Status distribution (submitted/under_review/approved/rejected)
- Score distribution histogram
- Nomination status breakdown
- School code listing
- Filter by specific form

---

## 10. User Management

### Roles
| Role | Access |
|------|--------|
| **Admin** | Full access — all modules, all data |
| **Reviewer** | Assigned reviews, submissions (no correct answers) |
| **Functionary** | Assigned forms, nominations, own submissions |
| **Teacher** | Available forms, own submissions |

### Features
- Create/Edit/Delete users
- Bulk CSV import
- CSV export
- Filter by role
- Search by name, email, school, district

---

## 11. Email Templates

### Variable System
Templates support these placeholders:
- `{{teacher_name}}` — Teacher's full name
- `{{form_name}}` — Form title
- `{{form_link}}` — Unique form URL
- `{{school_code}}` — School code
- `{{deadline}}` — Form expiry date
- `{{otp_code}}` — One-time password
- `{{submission_id}}` — Submission ID
- `{{reviewer_name}}` — Reviewer name
- `{{review_level}}` — Review level number
- `{{pending_count}}` — Pending review count

### Template Types
- Invite, OTP, Confirmation, Reminder (7/3/1 day), Review Assignment

---

## 12. Audit Logs

Every action is logged with:
- **User ID** — who performed the action
- **Action** — login, otp_requested, create_form, submit_form, review, export
- **Details** — JSON with method, IP address, user agent, school code
- **Timestamp** — precise datetime

---

## 13. Data Exports

CSV exports available for:
- Users (with roles, schools, status)
- Forms (with types, fields, settings)
- Submissions (with responses, scores)
- Nominations (with status tracking)
- Reviews (with decisions)
- Review Scores (with grades, comments)
- Audit Logs (with IPs, timestamps)

---

## 14. Database Schema

### Tables (12 total)

| Table | Purpose |
|-------|---------|
| `users` | All user accounts (admin, reviewer, functionary, teacher) |
| `forms` | Form definitions with fields JSON and settings |
| `submissions` | User responses with status and scores |
| `reviews` | Review assignments and decisions |
| `review_levels` | Multi-level review pipeline configuration |
| `review_scores` | Detailed scoring per review |
| `nominations` | Teacher nominations by functionaries |
| `notifications` | In-app notification messages |
| `comments` | Comment threads on submissions |
| `audit_logs` | Security and activity trail |
| `email_templates` | Email template definitions |
| `form_versions` | Version history for form changes |

### Key Relationships
```
forms ──< submissions ──< reviews ──< review_scores
forms ──< nominations
forms ──< form_versions
forms ──< review_levels
users ──< submissions
users ──< nominations (as functionary)
users ──< nominations (as teacher)
submissions ──< comments
```

---

## 15. API Reference

### Authentication
```
POST /api/auth
  { action: "login-password", email, password }     → { user, token }
  { action: "request-otp", email }                   → { message, school_code }
  { action: "verify-otp", email, otp }               → { user, token }
  { action: "verify-token", token }                  → { user }
```

### Forms
```
GET    /api/forms              → [forms]
GET    /api/forms?id=1         → form
POST   /api/forms              → created form
POST   /api/forms { action: "clone", form_id }  → cloned form
PUT    /api/forms { id, ... }  → updated form
DELETE /api/forms { id }       → { ok: true }
```

### Submissions
```
GET    /api/submissions                    → [submissions]
GET    /api/submissions?form_id=1          → filtered
GET    /api/submissions?id=1               → single
POST   /api/submissions { form_id, responses, score }  → created
PUT    /api/submissions { id, status }     → updated
```

### All Other Endpoints
Same CRUD pattern: `GET` (list/filter), `POST` (create), `PUT` (update), `DELETE` (remove)
- `/api/reviews`, `/api/nominations`, `/api/review-levels`
- `/api/review-scores`, `/api/email-templates`, `/api/form-versions`
- `/api/notifications`, `/api/comments`, `/api/audit-logs`
- `/api/users`, `/api/stats`

---

## 16. Security

- **Authentication:** Dual-mode (password + OTP)
- **Session tokens:** Base64-encoded JSON with expiry timestamp
- **Session timeout:** 30min (functionary) / 24h (admin/reviewer/teacher)
- **Timeout warning:** 2-minute countdown with extend option
- **Audit trail:** All logins, actions, exports logged with IP
- **CORS headers:** Set on all API routes
- **Input validation:** Client-side + server-side
- **Password handling:** Stored as-is in dev (bcrypt recommended for production)
- **School code isolation:** Token + school_code prevent cross-access
- **Score visibility:** Quiz answers hidden from users and reviewers (admin only)
- **Draft auto-save:** Every 30 seconds with timestamp
- **Form expiry:** Hard cutoff — no fill/edit after expiry date
