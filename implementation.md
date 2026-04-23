# Product Requirements Document (PRD)

## Multi-Level Form Management & Review System

**Version:** 1.0  
**Date:** 2024  
**Product Type:** SaaS - Form Builder with Multi-Level Review Workflow  
**Tech Stack:** MERN + TypeScript (Backend focus per request)

---

## 1. Executive Summary

A comprehensive form management platform that enables administrators to create custom forms, distribute them via shareable links, collect user submissions, and route submissions through multi-level reviewer workflows with collaborative grading/marking capabilities. The system supports rich form fields (including file uploads), advanced filtering, bulk exports, and detailed analytics.

---

## 2. User Roles & Permissions

### 2.1 Admin
**Primary User** - Full system control

**Capabilities:**
- Create, edit, delete, publish forms
- Configure form expiration & file upload constraints
- Manage all users (User Management)
- Assign reviewers to levels
- Create and manage review levels with filtering
- View all submissions across all forms
- Export data (CSV, ZIP with folder structure)
- Access analytics dashboard
- Configure review mode (Marks vs. Grades)

### 2.2 Reviewer
**Secondary User** - Review workflow participant

**Capabilities:**
- View assigned forms based on level assignment
- Review submissions assigned to their level
- Provide marks/grades and written descriptions
- View only their assigned level (no cross-level visibility)
- Cannot edit forms or manage users

### 2.3 End User (Form Filler)
**External User** - No login required (link-based access)

**Capabilities:**
- Access form via shared link (within expiration window)
- Fill and submit form once
- Edit own submission before expiration (if allowed by admin)
- No dashboard access

---

## 3. Core Modules & Features

---

## 3.1 Authentication & Authorization

### Admin Login
```
POST /api/v1/auth/admin/login
Body: { username, password }
Response: { accessToken, refreshToken (cookie) }
```

**Security:**
- bcrypt password hashing (cost factor 12)
- JWT access token (15min), refresh token (7d) in HttpOnly cookie
- Account lockout after 5 failed attempts (15min)
- Rate limit: 10 requests/min on auth endpoints

### Reviewer Login
```
POST /api/v1/auth/reviewer/login
Body: { email, password }
Response: { accessToken, refreshToken (cookie) }
```

**Role-based route protection:**
- Middleware: `requireAuth` → `roleGuard(['admin'])` or `roleGuard(['reviewer'])`

---

## 3.2 Form Builder (Admin Only)

### 3.2.1 Form Schema (MongoDB)

```typescript
{
  _id: ObjectId,
  title: string,                    // Form name
  description: string,
  adminId: ObjectId,                // Creator
  status: 'active' | 'expired' | 'draft',
  fields: [
    {
      fieldId: string,              // Unique within form
      label: string,
      type: 'text' | 'email' | 'number' | 'textarea' | 'dropdown' | 'file' | 'date',
      required: boolean,
      options?: string[],           // For dropdown
      fileConfig?: {
        allowedFormats: string[],   // ['jpg', 'png', 'pdf']
        maxSizeMB: number
      }
    }
  ],
  expiresAt: Date,                  // Form link expiration
  allowEdit: boolean,               // Can users edit before expiration?
  shareableLink: string,            // Generated UUID
  reviewConfig: {
    mode: 'marks' | 'grades',       // Admin sets review mode
    maxMarks?: number,              // If mode = marks
    gradeOptions?: string[]         // If mode = grades (e.g., ['A+', 'A', 'B', 'C', 'F'])
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 3.2.2 API Endpoints

**Create Form**
```
POST /api/v1/forms
Auth: Admin only
Body: {
  title, description, fields[], expiresAt, allowEdit, reviewConfig
}
Response: { success: true, data: { form, shareableLink } }
```

**Edit Form**
```
PATCH /api/v1/forms/:formId
Auth: Admin only
Body: Partial form fields
Response: { success: true, data: updatedForm }
```

**List Forms (Active)**
```
GET /api/v1/forms?status=active&page=1&limit=20
Auth: Admin only
Response: { success: true, data: forms[], pagination }
```

**List Forms (Expired)**
```
GET /api/v1/forms?status=expired&page=1&limit=20
Auth: Admin only
Response: { success: true, data: forms[], pagination }
```

**Delete Form**
```
DELETE /api/v1/forms/:formId
Auth: Admin only
Response: { success: true }
Note: Soft delete (isDeleted: true)
```

---

## 3.3 Form Submission (Public Link Access)

### 3.3.1 Submission Schema

```typescript
{
  _id: ObjectId,
  formId: ObjectId,
  userId: ObjectId | null,          // null for anonymous users
  responses: [
    {
      fieldId: string,              // Matches form.fields[].fieldId
      value: string | string[],     // string[] for file paths
    }
  ],
  files: [
    {
      fieldId: string,
      originalName: string,
      storedPath: string,           // S3/Cloudinary URL or local path
      mimeType: string,
      sizeBytes: number
    }
  ],
  submittedAt: Date,
  lastEditedAt: Date,
  currentLevel: number,             // Review workflow tracking (0 = not assigned)
  reviews: [                        // Embedded reviews from each level
    {
      levelId: ObjectId,
      reviewerId: ObjectId,
      reviewerName: string,
      marksGiven?: number,
      gradeGiven?: string,
      description: string,
      reviewedAt: Date
    }
  ],
  averageMarks?: number,            // Computed from reviews
  finalGrade?: string
}
```

### 3.3.2 API Endpoints

**Get Form (Public - No Auth)**
```
GET /api/v1/public/forms/:shareableLink
Response: {
  success: true,
  data: {
    form: { title, description, fields, expiresAt, allowEdit },
    isExpired: boolean
  }
}
```

**Submit Form (Public)**
```
POST /api/v1/public/forms/:shareableLink/submit
Body: {
  responses: [ { fieldId, value } ],
  files: FormData (multipart/form-data)
}
Response: { success: true, data: { submissionId } }

Validation:
- Check expiresAt > now
- Validate all required fields
- Validate file formats & sizes
- One submission per IP/cookie (unless allowEdit = true)
```

**Edit Submission (Public - before expiration)**
```
PATCH /api/v1/public/submissions/:submissionId
Body: Same as submit
Conditions:
- allowEdit = true on form
- expiresAt > now
- Submission must match session cookie/token
```

---

## 3.4 View Submissions (Admin)

### 3.4.1 List Submissions per Form

```
GET /api/v1/forms/:formId/submissions
Auth: Admin only
Query params:
  ?page=1&limit=20
  &search=<text>               // Search across all text fields
  &filter[fieldId]=value       // Dynamic filter by any form field
  &filter[currentLevel]=1      // Filter by review level
  &sortBy=submittedAt&order=desc

Response: {
  success: true,
  data: submissions[],
  pagination: { total, page, limit, totalPages }
}
```

### 3.4.2 View Single Submission

```
GET /api/v1/submissions/:submissionId
Auth: Admin only
Response: {
  success: true,
  data: {
    submission: { ...full submission with responses, files, reviews },
    form: { title, fields }
  }
}
```

### 3.4.3 View Uploaded Files

```
GET /api/v1/submissions/:submissionId/files/:fileId
Auth: Admin only
Response: Redirect to signed URL or stream file
```

---

## 3.5 Export & Download (Admin)

### 3.5.1 Export CSV

```
POST /api/v1/forms/:formId/export/csv
Auth: Admin only
Body: {
  filters: { fieldId: value, ... },
  includeReviews: boolean,          // Include reviewer marks/grades
  includeReviewerNames: boolean
}
Response: CSV file download
Headers: Content-Disposition: attachment; filename="formName_export.csv"

CSV Columns (dynamic based on form fields):
- Submission ID
- Submitted At
- [Each form field as column]
- [If includeReviews: Level 1 Reviewer, Level 1 Marks/Grade, Level 1 Description, ...]
- Average Marks / Final Grade
```

### 3.5.2 Export ZIP (Folder Structure)

```
POST /api/v1/forms/:formId/export/zip
Auth: Admin only
Body: {
  filters: { fieldId: value, ... },
  includeReviews: boolean
}
Response: ZIP file download

ZIP Structure:
formName_export/
  ├── user_1_[submissionId]/
  │   ├── submission.json          // All form responses
  │   ├── reviews.json             // All reviews (if includeReviews)
  │   ├── uploads/
  │   │   ├── photo.jpg
  │   │   └── document.pdf
  ├── user_2_[submissionId]/
  │   └── ...
  └── summary.csv                  // Same as CSV export
```

**Implementation:**
- Use `archiver` (npm) to create ZIP on-the-fly
- Stream to response to avoid memory issues
- Pre-signed S3 URLs bundled or files streamed directly

---

## 3.6 User Management (Admin)

### 3.6.1 User Schema

```typescript
{
  _id: ObjectId,
  role: 'admin' | 'reviewer',
  username: string,                 // For admin
  email: string,                    // For reviewer
  passwordHash: string,
  profile: {
    fullName: string,
    phone?: string
  },
  assignedLevels: ObjectId[],       // Reviewer only - references Level._id
  createdBy: ObjectId,              // Admin who created this user
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.6.2 API Endpoints

**List All Users**
```
GET /api/v1/users?role=reviewer&page=1&limit=20
Auth: Admin only
Response: { success: true, data: users[], pagination }
```

**Create User**
```
POST /api/v1/users
Auth: Admin only
Body: {
  role: 'reviewer',
  email, password, fullName, assignedLevels[]
}
Response: { success: true, data: newUser }
```

**Edit User**
```
PATCH /api/v1/users/:userId
Auth: Admin only
Body: Partial user fields
Response: { success: true, data: updatedUser }
```

**Delete User**
```
DELETE /api/v1/users/:userId
Auth: Admin only
Response: { success: true }
Note: Soft delete (isActive: false)
```

**View User Profile (Admin)**
```
GET /api/v1/users/:userId/profile
Auth: Admin only
Response: {
  success: true,
  data: {
    user: { ...profile },
    stats: {
      totalFormsReviewed: number,
      pendingReviews: number,
      assignedLevels: Level[]
    }
  }
}
```

---

## 3.7 Multi-Level Review Workflow

### 3.7.1 Level Schema

```typescript
{
  _id: ObjectId,
  formId: ObjectId,
  levelNumber: number,              // 1, 2, 3, ...
  name: string,                     // "Level 1 - Initial Review"
  assignedReviewers: ObjectId[],    // User IDs with role=reviewer
  submissions: ObjectId[],          // Submission IDs assigned to this level
  createdAt: Date
}
```

### 3.7.2 Admin: Create Level & Assign Submissions

**Create Level**
```
POST /api/v1/forms/:formId/levels
Auth: Admin only
Body: {
  levelNumber: 1,
  name: "Initial Screening",
  assignedReviewers: [reviewerId1, reviewerId2]
}
Response: { success: true, data: level }
```

**Assign Submissions to Level (with Filters)**
```
POST /api/v1/forms/:formId/levels/:levelId/assign
Auth: Admin only
Body: {
  filters: {
    fieldId: value,                 // Apply same filtering as export
    previousLevel: 1                // Promote from previous level
  },
  submissionIds?: string[]          // Or explicit list
}
Response: {
  success: true,
  data: { assignedCount: number }
}

Business Logic:
- Apply filters to submissions
- Update submission.currentLevel = levelNumber
- Add submission IDs to level.submissions[]

**Transactional Integrity:**
- All level assignments and review submissions must use **MongoDB Transactions** to ensure atomicity across `submissions`, `levels`, and `auditLogs` collections.
```

**List Levels for Form**
```
GET /api/v1/forms/:formId/levels
Auth: Admin only
Response: {
  success: true,
  data: levels[]
}
```

---

### 3.7.3 Reviewer: View & Review Submissions

**List Assigned Submissions**
```
GET /api/v1/reviewer/submissions
Auth: Reviewer only
Query: ?levelId=<levelId>&page=1&limit=20
Response: {
  success: true,
  data: submissions[]              // Only submissions at reviewer's assigned levels
}

Business Logic:
- Get levels where req.user._id is in assignedReviewers[]
- Return submissions where currentLevel matches those levels
```

**Submit Review**
```
POST /api/v1/submissions/:submissionId/review
Auth: Reviewer only
Body: {
  marksGiven?: number,              // If form.reviewConfig.mode = 'marks'
  gradeGiven?: string,              // If form.reviewConfig.mode = 'grades'
  description: string
}
Response: { success: true }

Validation:
- Reviewer must be assigned to current level of submission
- If mode=marks: validate marksGiven <= form.reviewConfig.maxMarks
- If mode=grades: validate gradeGiven in form.reviewConfig.gradeOptions
- Append review to submission.reviews[]
- Recalculate averageMarks if all reviewers at this level have reviewed
```

---

### 3.7.4 Admin: View Review Progress

**View Submissions by Level**
```
GET /api/v1/forms/:formId/levels/:levelId/submissions
Auth: Admin only
Query: ?page=1&limit=20
Response: {
  success: true,
  data: submissions[],              // With embedded reviews
  stats: {
    total: number,
    reviewed: number,
    pending: number
  }
}
```

**View All Reviews for a Submission**
```
GET /api/v1/submissions/:submissionId/reviews
Auth: Admin only
Response: {
  success: true,
  data: {
    reviews: [
      {
        level: 1,
        reviewerName: "John Doe",
        marksGiven: 85,
        description: "Good work",
        reviewedAt: Date
      }
    ],
    averageMarks: 85,
    finalGrade: "A"
  }
}
```

---

## 3.8 Analytics Dashboard (Admin)

### 3.8.1 Form-Level Analytics

```
GET /api/v1/analytics/forms/:formId
Auth: Admin only
Response: {
  success: true,
  data: {
    totalSubmissions: number,
    activeSubmissions: number,       // Within expiration
    expiredSubmissions: number,
    totalFilesUploaded: number,
    totalFileSizeMB: number,
    submissionsByDay: [              // Time-series data
      { date: "2024-01-15", count: 12 }
    ],
    fieldStats: [                    // Per-field analysis
      {
        fieldId: "email",
        uniqueValues: 45,
        mostCommonValue: "example@domain.com"
      }
    ],
    reviewProgress: {
      level1: { total: 100, reviewed: 80, avgMarks: 75 },
      level2: { total: 80, reviewed: 50, avgMarks: 82 }
    }
  }
}
```

### 3.8.2 Global Analytics (All Forms)

```
GET /api/v1/analytics/overview
Auth: Admin only
Query: ?status=active  // or expired
Response: {
  success: true,
  data: {
    totalForms: number,
    activeForms: number,
    expiredForms: number,
    totalSubmissions: number,
    totalUsers: number,              // End users who submitted
    totalReviewers: number,
    formBreakdown: [
      { formId, formTitle, submissionCount, avgMarks }
    ]
  }
}
```

---

## 3.9 Export Full System Data (Admin)

```
POST /api/v1/export/all
Auth: Admin only
Body: {
  includeForms: boolean,
  includeSubmissions: boolean,
  includeReviews: boolean,
  includeUsers: boolean
}
Response: ZIP file

ZIP Structure:
full_export_[timestamp]/
  ├── forms/
  │   ├── form1_[formId].json
  │   └── form2_[formId].json
  ├── submissions/
  │   ├── [formId]/
  │   │   ├── submission1/
  │   │   │   ├── data.json
  │   │   │   ├── reviews.json
  │   │   │   └── uploads/
  │   │   └── submission2/
  ├── users.csv
  └── analytics_summary.json
```

---

## 3.10 Audit Logging (Admin & System)

### 3.10.1 AuditLog Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId,                 // Who performed the action
  action: string,                   // e.g., 'CREATE_FORM', 'DELETE_USER'
  targetType: string,               // 'Form', 'Submission', 'User', 'Level'
  targetId: ObjectId,               // ID of the target resource
  details: Mixed,                   // Optional snapshot of changes or metadata
  metadata: {
    ip: string,
    userAgent: string
  },
  createdAt: Date                   // TTL Index: Auto-expire after 90 days
}
```

### 3.10.2 API Endpoints (Admin Only)

**List Audit Logs**
```
GET /api/v1/admin/audit-logs
Auth: Admin only
Query: ?userId=...&targetType=...&page=1&limit=50
Response: { success: true, data: logs[], pagination }
```

---

## 4. Database Schema Summary

### Collections

1. **users**
   - Indexes: `email` (unique), `username` (unique, sparse), `role`

2. **forms**
   - Indexes: `adminId`, `status`, `shareableLink` (unique), `expiresAt`
   - TTL Index: `expiresAt` (auto-expire after 30 days past expiration)

3. **submissions**
   - Indexes: `formId`, `userId`, `currentLevel`, `submittedAt`
   - Compound: `{ formId: 1, currentLevel: 1 }`
   - Text index on `responses.value` for search

4. **levels**
   - Indexes: `formId`, `levelNumber`
   - Compound: `{ formId: 1, levelNumber: 1 }` (unique)

5. **sessions** (refresh tokens)
   - Indexes: `userId`, `tokenHash` (unique)
   - TTL: 7 days

6. **auditLogs**
   - Indexes: `userId`, `action`, `targetType`, `createdAt`
   - TTL Index: `createdAt` (auto-delete after 90 days)

---

## 5. File Upload Strategy

### 5.1 Storage Options

**Development:** Local filesystem under `backend/uploads/`

**Production:** AWS S3 or Cloudinary

### 5.2 Upload Flow

1. Admin creates form with file field config (formats, max size)
2. User submits form with file
3. Backend validates:
   - File size <= maxSizeMB
   - MIME type in allowedFormats
   - Virus scan (optional: ClamAV integration)
4. Generate unique filename: `[submissionId]_[fieldId]_[timestamp]_[originalName]`
5. Upload to S3/Cloudinary (or save locally)
6. Store metadata in `submissions.files[]`

### 5.3 Download Flow

```
GET /api/v1/submissions/:submissionId/files/:fileId
Auth: Admin or assigned Reviewer
Response:
- If S3: Generate pre-signed URL (expires in 5 min), redirect
- If local: Stream file with correct Content-Type header
```

### 5.4 Security

- No direct public access to files
- All file downloads require authentication
- File paths never exposed to client (use fileId)
- Sanitize filenames to prevent directory traversal

---

## 6. Security Checklist (Backend Implementation)

### 6.1 Authentication & Authorization

- ✅ bcrypt password hashing (cost 12)
- ✅ JWT access (15min) + refresh (7d) tokens
- ✅ Refresh token rotation with breach detection
- ✅ HttpOnly, Secure, SameSite=Strict cookies
- ✅ Account lockout: 5 attempts → 15min lock (TTL index on `loginAttempts` collection)
- ✅ `requireAuth` middleware on all protected routes
- ✅ `roleGuard(['admin'])` / `roleGuard(['reviewer'])` per route

### 6.2 Input Validation & Sanitization

- ✅ Zod schemas for all request bodies, query params, path params
- ✅ `express-mongo-sanitize` to prevent NoSQL injection
- ✅ File upload validation (size, MIME type, extension whitelist)
- ✅ Validate `expiresAt` is in future on form creation
- ✅ Generic error messages on login (no "user not found" vs "wrong password")

### 6.3 Rate Limiting

```typescript
// Global API limit
const apiLimiter = rateLimit({ windowMs: 60_000, max: 100 });
app.use('/api', apiLimiter);

// Auth endpoints
const authLimiter = rateLimit({ windowMs: 60_000, max: 10, skipSuccessfulRequests: true });
app.use('/api/v1/auth', authLimiter);

// Public form submit
const submitLimiter = rateLimit({ windowMs: 60_000, max: 5 });
app.use('/api/v1/public/forms/:link/submit', submitLimiter);
```

### 6.4 Data Access Control

- ✅ All form queries filter by `adminId` (prevent cross-admin access)
- ✅ All submission queries validate form ownership before returning data
- ✅ Reviewers can only see submissions at their assigned levels
- ✅ `assertOwnership()` helper used in every resource controller
- ✅ Always return 404 (not 403) when resource doesn't belong to user

### 6.5 Infrastructure

- ✅ `helmet()` for security headers
- ✅ CORS with explicit origin list (no `*`)
- ✅ `express.json({ limit: '10kb' })`
- ✅ Winston structured logging (no passwords/tokens in logs)
- ✅ Sentry error monitoring with `beforeSend` scrubbing
- ✅ `GET /health` and `GET /ready` endpoints
- ✅ MongoDB connection with restricted user (not root)
- ✅ MongoDB Atlas IP allowlist

### 6.6 File Security

- ✅ Virus scanning on upload (optional but recommended)
- ✅ File paths never exposed (use fileId for download)
- ✅ Signed URLs with short expiration for S3
- ✅ Filename sanitization to prevent path traversal
- ✅ MIME type validation (not just extension)

---

## 7. API Error Codes

| HTTP | Code | Message | When |
|------|------|---------|------|
| 400 | `VALIDATION_ERROR` | Validation failed | Zod validation error |
| 400 | `FORM_EXPIRED` | Form link has expired | Submission after expiresAt |
| 400 | `EDIT_NOT_ALLOWED` | Editing is disabled for this form | allowEdit = false |
| 400 | `INVALID_FILE_FORMAT` | File format not allowed | File MIME type not in allowedFormats |
| 400 | `FILE_TOO_LARGE` | File exceeds maximum size | File > maxSizeMB |
| 400 | `INVALID_REVIEW_MODE` | Review mode mismatch | Sending marks when mode = grades |
| 401 | `UNAUTHORIZED` | Authentication required | No token |
| 401 | `TOKEN_EXPIRED` | Access token expired | Expired JWT |
| 401 | `ACCOUNT_LOCKED` | Account temporarily locked | 5 failed login attempts |
| 403 | `FORBIDDEN` | Insufficient permissions | Wrong role |
| 403 | `NOT_ASSIGNED_TO_LEVEL` | Not assigned to this review level | Reviewer accessing wrong level |
| 404 | `FORM_NOT_FOUND` | Form not found | Invalid formId or shareableLink |
| 404 | `SUBMISSION_NOT_FOUND` | Submission not found | Invalid submissionId |
| 404 | `USER_NOT_FOUND` | User not found | Invalid userId |
| 409 | `DUPLICATE_SUBMISSION` | Submission already exists | User trying to submit twice (when allowEdit = false) |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests | Rate limit hit |
| 500 | `INTERNAL_ERROR` | Internal server error | Unhandled exception |

---

## 8. API Endpoint Summary

### Authentication
- `POST /api/v1/auth/admin/login` - Admin login
- `POST /api/v1/auth/reviewer/login` - Reviewer login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout (clear refresh token)

### Forms (Admin)
- `POST /api/v1/forms` - Create form
- `GET /api/v1/forms` - List forms (with status filter)
- `GET /api/v1/forms/:formId` - Get single form
- `PATCH /api/v1/forms/:formId` - Edit form
- `DELETE /api/v1/forms/:formId` - Delete form (soft delete)

### Public Form Access
- `GET /api/v1/public/forms/:shareableLink` - Get form details
- `POST /api/v1/public/forms/:shareableLink/submit` - Submit form
- `PATCH /api/v1/public/submissions/:submissionId` - Edit submission (before expiration)

### Submissions (Admin)
- `GET /api/v1/forms/:formId/submissions` - List submissions with filters
- `GET /api/v1/submissions/:submissionId` - Get single submission
- `GET /api/v1/submissions/:submissionId/files/:fileId` - Download file

### Export (Admin)
- `POST /api/v1/forms/:formId/export/csv` - Export CSV
- `POST /api/v1/forms/:formId/export/zip` - Export ZIP with folder structure
- `POST /api/v1/export/all` - Export entire system

### User Management (Admin)
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user (admin/reviewer)
- `GET /api/v1/users/:userId` - Get user details
- `PATCH /api/v1/users/:userId` - Edit user
- `DELETE /api/v1/users/:userId` - Delete user (soft delete)
- `GET /api/v1/users/:userId/profile` - View user profile with stats

### Levels (Admin)
- `POST /api/v1/forms/:formId/levels` - Create review level
- `GET /api/v1/forms/:formId/levels` - List levels for form
- `POST /api/v1/forms/:formId/levels/:levelId/assign` - Assign submissions to level
- `GET /api/v1/forms/:formId/levels/:levelId/submissions` - View submissions at level

### Reviews (Reviewer)
- `GET /api/v1/reviewer/submissions` - List assigned submissions
- `POST /api/v1/submissions/:submissionId/review` - Submit review
- `GET /api/v1/submissions/:submissionId/reviews` - View all reviews (Admin only)

### Analytics (Admin)
- `GET /api/v1/analytics/overview` - Global analytics
- `GET /api/v1/analytics/forms/:formId` - Form-level analytics

### Health
- `GET /health` - Liveness check
- `GET /ready` - Readiness check (DB connection)

---

## 9. Non-Functional Requirements

### 9.1 Performance
- List endpoints must support pagination (default 20 items/page)
- Text search on submissions should use MongoDB text index
- File downloads use streaming (no full load into memory)
- ZIP exports generated on-the-fly with streaming
- Average API response time < 500ms (excluding file operations)

### 9.2 Scalability
- Support 10,000 forms with 1M+ total submissions
- Background job queue for heavy operations (ZIP generation, analytics computation)
- Use `node-cron` for scheduled tasks:
  - Auto-expire forms (mark status = expired)
  - Clean up old soft-deleted records (30 days retention)

### 9.3 Availability
- Uptime target: 99.5%
- Health checks for load balancer
- Graceful shutdown (finish in-flight requests)

### 9.4 Data Retention
- Soft-deleted forms/submissions retained for 30 days
- After 30 days: hard delete via cron job
- Exported data is user's responsibility (no automatic backups exposed)

### 9.5 Monitoring
- Winston logs all errors and warnings
- Sentry for real-time error tracking
- Log successful exports and review submissions (audit trail)

---

## 10. Future Enhancements (Out of Scope for v1)

1. **Email Notifications**
   - Notify reviewers when submissions assigned
   - Notify admin when all reviews completed for a level

2. **Webhooks**
   - POST to external URL on form submission
   - POST on review completion

3. **Form Templates**
   - Pre-built form templates for common use cases
   - Admin can save custom forms as templates

4. **Conditional Logic**
   - Show/hide fields based on previous answers
   - Dynamic dropdown options based on other fields

5. **Collaboration**
   - Multiple admins per form with role-based permissions
   - Real-time collaboration on form builder

6. **Advanced Analytics**
   - Reviewer performance metrics
   - Time-to-review tracking
   - Inter-rater reliability analysis

7. **Mobile App**
   - Native iOS/Android apps for reviewers
   - Push notifications

8. **API Rate Limiting by User Tier**
   - Free tier: 100 submissions/month
   - Pro tier: Unlimited

---

## 11. Development Phases

### Phase 1: Core Foundation (Week 1-2)
- ✅ Auth (Admin + Reviewer login)
- ✅ User management (CRUD)
- ✅ Form builder (create, edit, list)
- ✅ Form schema with field types (excluding file uploads)

### Phase 2: Submissions & Public Access (Week 3)
- ✅ Public form access (shareable link)
- ✅ Form submission (text fields only)
- ✅ Form expiration logic
- ✅ Edit submission (if allowEdit = true)

### Phase 3: File Uploads & Storage (Week 4)
- ✅ File upload field type
- ✅ File validation (size, format)
- ✅ S3/Cloudinary integration
- ✅ File download endpoint

### Phase 4: Review Workflow (Week 5-6)
- ✅ Level creation
- ✅ Assign submissions to levels (with filters)
- ✅ Reviewer submission view
- ✅ Submit review (marks/grades)
- ✅ Calculate average marks
- ✅ Admin view all reviews

### Phase 5: Export & Analytics (Week 7)
- ✅ CSV export with filters
- ✅ ZIP export with folder structure
- ✅ Include reviews in exports
- ✅ Form-level analytics
- ✅ Global analytics dashboard

### Phase 6: Testing & Deployment (Week 8)
- ✅ Postman collection for all endpoints
- ✅ Security audit (Section 6 checklist)
- ✅ Load testing (1000 concurrent submissions)
- ✅ Deploy to production (Render/Railway)
- ✅ MongoDB Atlas setup with backups

---

## 12. Success Metrics

### Technical Metrics
- Zero high/critical npm audit vulnerabilities
- 100% API endpoint documentation coverage
- < 2% error rate on production API calls
- All endpoints respond < 1s (95th percentile)

### Business Metrics
- Admin can create and publish a form in < 5 minutes
- Users can submit a form in < 2 minutes
- Reviewers can review 20 submissions/hour
- Export ZIP with 1000 submissions completes in < 30 seconds

---

## 13. Dependencies (Latest Versions - Verify Per Section ⚠️)

**Before adding to package.json, web search + `npm show` for EACH:**

### Backend
- express
- mongoose
- typescript
- zod
- jsonwebtoken
- bcryptjs
- helmet
- cors
- express-rate-limit
- express-mongo-sanitize
- winston
- @sentry/node
- multer (file uploads)
- archiver (ZIP generation)
- aws-sdk (S3) or cloudinary
- node-cron
- nodemailer (future email feature)

### DevDependencies
- @types/node
- @types/express
- @types/bcryptjs
- @types/jsonwebtoken
- @types/multer
- tsx (dev server)
- nodemon

---

## 14. Environment Variables (.env.example)

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/form_management_system

# JWT
JWT_ACCESS_SECRET=generate_64_char_hex
JWT_REFRESH_SECRET=generate_different_64_char_hex
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173

# File Storage (choose one)
# S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=form-uploads

# OR Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Monitoring
SENTRY_DSN=https://your_sentry_dsn

# Admin Credentials (initial seed)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ChangeMe123!
ADMIN_EMAIL=admin@yourdomain.com
```

---

## 15. README Template (for Repository)

```markdown
# Form Management & Review System

Multi-level form builder with submission management and collaborative review workflows.

## Features
- 🔐 Role-based access (Admin, Reviewer)
- 📝 Drag-and-drop form builder with rich field types
- 📎 File uploads with format/size validation
- ⏰ Time-based form expiration
- 🔄 Multi-level review workflow with marks/grades
- 📊 Advanced filtering and search
- 📦 Bulk export (CSV + ZIP with folder structure)
- 📈 Analytics dashboard

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, MongoDB
- **Auth:** JWT (access + refresh tokens)
- **Storage:** AWS S3 / Cloudinary
- **Monitoring:** Winston, Sentry

## Setup

### Prerequisites
- Node.js 20+ (LTS)
- MongoDB 6+
- AWS account (for S3) or Cloudinary account

### Installation

1. Clone repository
```bash
git clone <repo-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment
```bash
cp .env.example .env
# Edit .env with your values
```

4. Seed admin user
```bash
npm run seed
```

5. Run development server
```bash
npm run dev
```

Server runs on http://localhost:5000

### Production Deployment

```bash
npm run build
npm start
```

## API Documentation

Import `postman/collection.json` into Postman.

Base URL: `http://localhost:5000/api/v1`

### Quick Test Flow
1. POST `/auth/admin/login` - Get access token
2. POST `/forms` - Create a form
3. GET `/forms/:formId` - View form details
4. Use shareable link to submit form (public endpoint)
5. GET `/forms/:formId/submissions` - View all submissions
6. POST `/forms/:formId/export/zip` - Download all data

## Security Checklist

See [PROJECT_BLUEPRINT.md Section 6](./docs/PROJECT_BLUEPRINT.md#6-backend-security-checklist)

## License
MIT
```

---

## 16. Postman Collection Structure

```json
{
  "info": { "name": "Form Management API" },
  "item": [
    {
      "name": "Auth",
      "item": [
        { "name": "Admin Login", "request": { "method": "POST", "url": "{{baseUrl}}/auth/admin/login" } },
        { "name": "Reviewer Login", "request": { "method": "POST", "url": "{{baseUrl}}/auth/reviewer/login" } },
        { "name": "Refresh Token", "request": { "method": "POST", "url": "{{baseUrl}}/auth/refresh" } },
        { "name": "Logout", "request": { "method": "POST", "url": "{{baseUrl}}/auth/logout" } }
      ]
    },
    {
      "name": "Forms",
      "item": [
        { "name": "Create Form", "request": { "method": "POST", "url": "{{baseUrl}}/forms" } },
        { "name": "List Forms (Active)", "request": { "method": "GET", "url": "{{baseUrl}}/forms?status=active" } },
        { "name": "Get Form", "request": { "method": "GET", "url": "{{baseUrl}}/forms/{{formId}}" } },
        { "name": "Edit Form", "request": { "method": "PATCH", "url": "{{baseUrl}}/forms/{{formId}}" } },
        { "name": "Delete Form", "request": { "method": "DELETE", "url": "{{baseUrl}}/forms/{{formId}}" } }
      ]
    },
    {
      "name": "Public - Form Submission",
      "item": [
        { "name": "Get Form (Public)", "request": { "method": "GET", "url": "{{baseUrl}}/public/forms/{{shareableLink}}" } },
        { "name": "Submit Form", "request": { "method": "POST", "url": "{{baseUrl}}/public/forms/{{shareableLink}}/submit" } },
        { "name": "Edit Submission", "request": { "method": "PATCH", "url": "{{baseUrl}}/public/submissions/{{submissionId}}" } }
      ]
    },
    {
      "name": "Submissions (Admin)",
      "item": [
        { "name": "List Submissions", "request": { "method": "GET", "url": "{{baseUrl}}/forms/{{formId}}/submissions" } },
        { "name": "Get Submission", "request": { "method": "GET", "url": "{{baseUrl}}/submissions/{{submissionId}}" } },
        { "name": "Download File", "request": { "method": "GET", "url": "{{baseUrl}}/submissions/{{submissionId}}/files/{{fileId}}" } }
      ]
    },
    {
      "name": "Export",
      "item": [
        { "name": "Export CSV", "request": { "method": "POST", "url": "{{baseUrl}}/forms/{{formId}}/export/csv" } },
        { "name": "Export ZIP", "request": { "method": "POST", "url": "{{baseUrl}}/forms/{{formId}}/export/zip" } },
        { "name": "Export All Data", "request": { "method": "POST", "url": "{{baseUrl}}/export/all" } }
      ]
    },
    {
      "name": "User Management",
      "item": [
        { "name": "List Users", "request": { "method": "GET", "url": "{{baseUrl}}/users" } },
        { "name": "Create User", "request": { "method": "POST", "url": "{{baseUrl}}/users" } },
        { "name": "Get User Profile", "request": { "method": "GET", "url": "{{baseUrl}}/users/{{userId}}/profile" } },
        { "name": "Edit User", "request": { "method": "PATCH", "url": "{{baseUrl}}/users/{{userId}}" } },
        { "name": "Delete User", "request": { "method": "DELETE", "url": "{{baseUrl}}/users/{{userId}}" } }
      ]
    },
    {
      "name": "Review Levels",
      "item": [
        { "name": "Create Level", "request": { "method": "POST", "url": "{{baseUrl}}/forms/{{formId}}/levels" } },
        { "name": "List Levels", "request": { "method": "GET", "url": "{{baseUrl}}/forms/{{formId}}/levels" } },
        { "name": "Assign Submissions to Level", "request": { "method": "POST", "url": "{{baseUrl}}/forms/{{formId}}/levels/{{levelId}}/assign" } },
        { "name": "View Level Submissions", "request": { "method": "GET", "url": "{{baseUrl}}/forms/{{formId}}/levels/{{levelId}}/submissions" } }
      ]
    },
    {
      "name": "Reviews (Reviewer)",
      "item": [
        { "name": "My Assigned Submissions", "request": { "method": "GET", "url": "{{baseUrl}}/reviewer/submissions" } },
        { "name": "Submit Review", "request": { "method": "POST", "url": "{{baseUrl}}/submissions/{{submissionId}}/review" } },
        { "name": "View All Reviews (Admin)", "request": { "method": "GET", "url": "{{baseUrl}}/submissions/{{submissionId}}/reviews" } }
      ]
    },
    {
      "name": "Analytics",
      "item": [
        { "name": "Global Overview", "request": { "method": "GET", "url": "{{baseUrl}}/analytics/overview" } },
        { "name": "Form Analytics", "request": { "method": "GET", "url": "{{baseUrl}}/analytics/forms/{{formId}}" } }
      ]
    },
    {
      "name": "Health",
      "item": [
        { "name": "Liveness", "request": { "method": "GET", "url": "{{baseUrl}}/health" } },
        { "name": "Readiness", "request": { "method": "GET", "url": "{{baseUrl}}/ready" } }
      ]
    }
  ]
}
```

---

**END OF PRD**

This document serves as the **single source of truth** for backend development. All implementation must follow the architecture, security standards, and API contracts defined here.