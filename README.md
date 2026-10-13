# JobBoard Frontend → Backend Build Roadmap

## 0. Project Goal

Figma/UI = JobBoard job marketplace.

Main actors:

- Guest
- Candidate / Job Seeker
- Employer
- Admin

Core flow:

```text
Frontend UI
   ↓
React/Next.js
   ↓
API Client / Axios
   ↓
Express.js REST API
   ↓
Auth Middleware
   ↓
Controller
   ↓
Service / Business Logic
   ↓
MongoDB
```

Backend must support:

```text
Auth
Users
Employers
Jobs
Categories
Applications
Saved Jobs
Candidate Profiles
Company Profiles
Testimonials
Newsletter
Admin
Dashboard Stats
Search / Filter / Pagination
File/Image handling
Email
Security
```

---

# 1. Figma → Backend Feature Map

Figma sections visible:

```text
Navbar
Hero Search
Popular Search
Company Logos
4 Steps
Talent CTA
Job Categories
New Job Offers
Testimonials
Final CTA
Footer
Newsletter
```

Backend dependency:

```text
Navbar
  └─ mostly static

Hero Search
  └─ GET /api/jobs/search
  └─ GET /api/jobs?keyword=&location=

4 Steps
  └─ static content

Talent CTA
  └─ candidate registration
  └─ candidate profile

Job Categories
  └─ GET /api/categories

New Job Offers
  └─ GET /api/jobs
  └─ GET /api/jobs/latest

Testimonials
  └─ GET /api/testimonials

Newsletter
  └─ POST /api/newsletter/subscribe

Employer
  └─ POST /api/jobs
  └─ PUT /api/jobs/:id
  └─ DELETE /api/jobs/:id

Candidate
  └─ POST /api/applications
  └─ GET /api/applications/my
  └─ POST /api/saved-jobs
```

---

# 2. Recommended Backend Stack

```text
Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs
Nodemailer
Cloudinary
Multer
dotenv
cors
cookie-parser
helmet
express-rate-limit
express-validator
```

Optional:

```text
Redis
Socket.IO
Cloudinary
Stripe
```

Use optional tools only when feature requires them.

## Email setup

Add `SMTP_USER` and `SMTP_PASS` to `.env`. User registration sends a UUID verification code to the provided email address; the code expires after five minutes.

---

# 3. Backend Architecture

Recommended:

```text
Controller
    ↓
Service
    ↓
Model
    ↓
MongoDB
```

Request flow:

```text
POST /api/auth/register
        ↓
auth.routes.js
        ↓
auth.controller.js
        ↓
auth.service.js
        ↓
User model
        ↓
MongoDB
        ↓
response
```

Middleware flow:

```text
Request
  ↓
CORS
  ↓
JSON parser
  ↓
Security middleware
  ↓
Auth middleware
  ↓
Role middleware
  ↓
Route
  ↓
Controller
  ↓
Service
  ↓
DB
```

---

# 4. Recommended Backend Folder Structure

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   ├── cloudinary.js
│   │   └── mail.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── candidateProfile.model.js
│   │   ├── company.model.js
│   │   ├── job.model.js
│   │   ├── category.model.js
│   │   ├── application.model.js
│   │   ├── savedJob.model.js
│   │   ├── testimonial.model.js
│   │   └── newsletter.model.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── candidate.controller.js
│   │   ├── company.controller.js
│   │   ├── job.controller.js
│   │   ├── category.controller.js
│   │   ├── application.controller.js
│   │   ├── savedJob.controller.js
│   │   ├── testimonial.controller.js
│   │   ├── newsletter.controller.js
│   │   └── admin.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── candidate.service.js
│   │   ├── company.service.js
│   │   ├── job.service.js
│   │   ├── category.service.js
│   │   ├── application.service.js
│   │   ├── savedJob.service.js
│   │   ├── testimonial.service.js
│   │   ├── newsletter.service.js
│   │   └── email.service.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── candidate.routes.js
│   │   ├── company.routes.js
│   │   ├── job.routes.js
│   │   ├── category.routes.js
│   │   ├── application.routes.js
│   │   ├── savedJob.routes.js
│   │   ├── testimonial.routes.js
│   │   ├── newsletter.routes.js
│   │   └── admin.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── upload.middleware.js
│   │   └── rateLimit.middleware.js
│   │
│   ├── validations/
│   │   ├── auth.validation.js
│   │   ├── job.validation.js
│   │   ├── application.validation.js
│   │   └── profile.validation.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── generateEmailToken.js
│   │   ├── pagination.js
│   │   ├── response.js
│   │   └── slugify.js
│   │
│   ├── constants/
│   │   ├── roles.js
│   │   ├── jobStatus.js
│   │   └── applicationStatus.js
│   │
│   ├── app.js
│   └── server.js
│
├── uploads/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# 5. Build Order — IMPORTANT

Do NOT build random endpoints.

Follow dependency order:

```text
1. Project setup
       ↓
2. DB connection
       ↓
3. Environment config
       ↓
4. User model
       ↓
5. Auth
       ↓
6. Auth middleware
       ↓
7. Role middleware
       ↓
8. User/Profile
       ↓
9. Company
       ↓
10. Category
       ↓
11. Job
       ↓
12. Search/Filter
       ↓
13. Application
       ↓
14. Saved Jobs
       ↓
15. Testimonials
       ↓
16. Newsletter
       ↓
17. Admin
       ↓
18. Dashboard statistics
       ↓
19. Email
       ↓
20. Upload
       ↓
21. Security
       ↓
22. Testing
       ↓
23. Deployment
```

---

# 6. Phase 1 — Project Setup

Commands:

```bash
mkdir backend
cd backend
npm init -y
npm install express mongoose dotenv cors cookie-parser bcryptjs jsonwebtoken nodemailer helmet express-rate-limit express-validator multer cloudinary
npm install -D nodemon
```

Create:

```text
src/
├── app.js
├── server.js
└── config/
    └── db.js
```

First target:

```text
Server starts
       ↓
MongoDB connects
       ↓
GET /api/health
       ↓
200 OK
```

Health endpoint:

```text
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "API is running"
}
```

---

# 7. Phase 2 — Environment Config

`.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

EMAIL=your_email
EMAIL_PASSWORD=your_app_password

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

NEVER commit `.env`.

`.gitignore`:

```text
node_modules/
.env
uploads/
```

---

# 8. Phase 3 — Database Models

## User

```text
User
├── name
├── email
├── password
├── role
├── avatar
├── isVerified
├── status
├── createdAt
└── updatedAt
```

Roles:

```text
candidate
employer
admin
```

---

## CandidateProfile

```text
CandidateProfile
├── user
├── headline
├── bio
├── phone
├── location
├── skills[]
├── experience[]
├── education[]
├── resume
├── portfolio
└── socialLinks
```

---

## Company

```text
Company
├── owner
├── name
├── logo
├── description
├── website
├── industry
├── location
├── companySize
└── socialLinks
```

---

## Category

```text
Category
├── name
├── slug
├── icon
├── description
└── isActive
```

Figma examples:

```text
UI/UX Design
Illustration
Cool Art
Web Design
Product Design
Developer
Animation
```

---

## Job

```text
Job
├── employer
├── company
├── category
├── title
├── slug
├── description
├── requirements[]
├── responsibilities[]
├── skills[]
├── location
├── employmentType
├── salary
├── experienceLevel
├── deadline
├── status
├── views
├── createdAt
└── updatedAt
```

Example:

```json
{
  "title": "Frontend Developer",
  "location": "New York",
  "employmentType": "Full Time",
  "experienceLevel": "Mid Level",
  "salary": {
    "min": 5000,
    "max": 7000,
    "currency": "USD"
  }
}
```

---

# 9. Phase 4 — Auth

Auth comes BEFORE job/application logic.

Endpoints:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/auth/verify-email/:token
POST /api/auth/forgot-password
POST /api/auth/reset-password/:token
```

Flow:

```text
Register
  ↓
Validate input
  ↓
Check email
  ↓
Hash password
  ↓
Create User
  ↓
Generate verification token
  ↓
Send email
  ↓
User verifies email
  ↓
Login
  ↓
Generate JWT
```

Password:

```text
plain password
      ↓
bcrypt.hash()
      ↓
hashed password
      ↓
MongoDB
```

Login:

```text
email + password
       ↓
find user
       ↓
bcrypt.compare()
       ↓
JWT
       ↓
client
```

---

# 10. Phase 5 — Auth Middleware

`auth.middleware.js`

Flow:

```text
Request
  ↓
Authorization header
  ↓
Bearer token
  ↓
JWT verify
  ↓
req.user
  ↓
next()
```

Header:

```http
Authorization: Bearer JWT_TOKEN
```

Role middleware:

```text
requireRole("admin")
requireRole("employer")
requireRole("candidate")
```

Example:

```text
POST /api/jobs
       ↓
authMiddleware
       ↓
employerMiddleware
       ↓
createJobController
```

---

# 11. Phase 6 — Candidate

Endpoints:

```text
GET  /api/candidates/me
PUT  /api/candidates/me
POST /api/candidates/avatar
POST /api/candidates/resume
```

Candidate dashboard:

```text
Profile
Applications
Saved Jobs
Resume
Settings
```

---

# 12. Phase 7 — Employer + Company

Endpoints:

```text
POST /api/companies
GET  /api/companies/:id
PUT  /api/companies/:id
DELETE /api/companies/:id
```

Employer dashboard:

```text
Company Profile
Post Job
My Jobs
Applications
Statistics
```

---

# 13. Phase 8 — Categories

Public:

```text
GET /api/categories
GET /api/categories/:slug
```

Admin:

```text
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
```

Frontend:

```text
Choose Your Desire Category
        ↓
GET /api/categories
        ↓
category cards
```

---

# 14. Phase 9 — Jobs

Core endpoints:

```text
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

Employer-only:

```text
POST /api/jobs
PUT /api/jobs/:id
DELETE /api/jobs/:id
```

Public:

```text
GET /api/jobs
GET /api/jobs/:id
```

---

# 15. Job Query System

Figma Hero:

```text
Job Title, Keywords
City or Postcode
Find Job
```

Backend:

```text
GET /api/jobs?keyword=developer&location=New York
```

Support:

```text
keyword
location
category
employmentType
experienceLevel
minSalary
maxSalary
sort
page
limit
```

Example:

```text
GET /api/jobs
    ?keyword=react
    &location=remote
    &category=developer
    &employmentType=full-time
    &page=1
    &limit=6
    &sort=-createdAt
```

Response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 100,
    "totalPages": 17
  }
}
```

---

# 16. Phase 10 — Homepage Job Cards

Figma:

```text
New Job Offer
```

Frontend should call:

```text
GET /api/jobs?limit=6&sort=-createdAt
```

Each card needs:

```text
Company logo
Company name
Job title
Location
Posted time
Job type
Salary
Apply button
```

Backend should NOT return unnecessary DB fields.

Use DTO / response shaping.

---

# 17. Phase 11 — Applications

Application model:

```text
Application
├── job
├── candidate
├── employer
├── resume
├── coverLetter
├── status
├── appliedAt
└── updatedAt
```

Statuses:

```text
pending
reviewing
shortlisted
interview
rejected
hired
```

Candidate:

```text
POST /api/applications
GET  /api/applications/my
GET  /api/applications/:id
DELETE /api/applications/:id
```

Employer:

```text
GET /api/employer/applications
PUT /api/applications/:id/status
```

Critical rule:

```text
1 candidate
   +
1 job
   ↓
1 application
```

Prevent duplicate applications with DB unique index.

---

# 18. Phase 12 — Saved Jobs

Model:

```text
SavedJob
├── user
├── job
└── createdAt
```

Endpoints:

```text
POST   /api/saved-jobs/:jobId
GET    /api/saved-jobs
DELETE /api/saved-jobs/:jobId
```

Frontend:

```text
Job card
   ↓
Save button
   ↓
POST /api/saved-jobs/:jobId
```

---

# 19. Phase 13 — Testimonials

Figma:

```text
What A Job Holder Says About Us
```

Model:

```text
Testimonial
├── user
├── name
├── avatar
├── role
├── message
├── rating
└── isPublished
```

Public:

```text
GET /api/testimonials
```

Admin:

```text
POST /api/testimonials
PUT /api/testimonials/:id
DELETE /api/testimonials/:id
```

---

# 20. Phase 14 — Newsletter

Figma footer:

```text
Newsletter
Enter Email
Send
```

Endpoint:

```text
POST /api/newsletter/subscribe
```

Body:

```json
{
  "email": "user@example.com"
}
```

Model:

```text
Newsletter
├── email
├── isSubscribed
└── createdAt
```

Email must be unique.

---

# 21. Phase 15 — Admin

Admin routes:

```text
GET /api/admin/users
GET /api/admin/jobs
GET /api/admin/applications
GET /api/admin/stats
PUT /api/admin/users/:id/status
DELETE /api/admin/users/:id
DELETE /api/admin/jobs/:id
```

Admin dashboard stats:

```text
Total Users
Total Candidates
Total Employers
Total Jobs
Total Applications
Active Jobs
Pending Applications
```

MongoDB aggregation can calculate stats.

---

# 22. Phase 16 — File Upload

Required files:

```text
Avatar
Company Logo
Resume
```

Flow:

```text
Frontend
   ↓
multipart/form-data
   ↓
Multer
   ↓
Cloudinary
   ↓
URL
   ↓
MongoDB
```

Do NOT store large files directly inside MongoDB documents.

Store URL + metadata.

---

# 23. Phase 17 — Email System

Use Nodemailer.

Emails:

```text
Verification Email
Welcome Email
Forgot Password
Password Reset
Application Received
Application Status Changed
```

Example:

```text
Candidate applies
      ↓
Application created
      ↓
Email employer
      ↓
Employer changes status
      ↓
Email candidate
```

---

# 24. Phase 18 — Security

Must-have:

```text
bcrypt password hashing
JWT validation
Role authorization
Helmet
CORS
Rate limiting
Input validation
MongoDB injection protection
XSS-safe output
Secure cookies if using cookie auth
Environment variables
File upload validation
Request size limits
```

Never:

```text
Store plain password
Trust req.body blindly
Trust frontend role
Expose JWT_SECRET
Return password from API
Allow employer to edit another employer's job
Allow candidate to edit another candidate's profile
```

---

# 25. Authorization Matrix

```text
                    Guest  Candidate  Employer  Admin

View jobs             ✓       ✓          ✓        ✓
Search jobs           ✓       ✓          ✓        ✓
View categories       ✓       ✓          ✓        ✓

Apply job             ✗       ✓          ✗        ✓
Save job              ✗       ✓          ✗        ✓

Create job            ✗       ✗          ✓        ✓
Update own job        ✗       ✗          ✓        ✓
Delete own job        ✗       ✗          ✓        ✓

Manage users          ✗       ✗          ✗        ✓
Manage categories     ✗       ✗          ✗        ✓
Manage testimonials   ✗       ✗          ✗        ✓
```

---

# 26. API Route Tree

```text
/api
│
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   ├── GET  /me
│   ├── GET  /verify-email/:token
│   ├── POST /forgot-password
│   └── POST /reset-password/:token
│
├── /users
│   ├── GET /me
│   └── PUT /me
│
├── /candidates
│   ├── GET /me
│   └── PUT /me
│
├── /companies
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   └── DELETE /:id
│
├── /categories
│   ├── GET /
│   ├── GET /:slug
│   ├── POST /
│   ├── PUT /:id
│   └── DELETE /:id
│
├── /jobs
│   ├── GET /
│   ├── GET /:id
│   ├── POST /
│   ├── PUT /:id
│   └── DELETE /:id
│
├── /applications
│   ├── POST /
│   ├── GET /my
│   ├── GET /:id
│   ├── DELETE /:id
│   └── PUT /:id/status
│
├── /saved-jobs
│   ├── GET /
│   ├── POST /:jobId
│   └── DELETE /:jobId
│
├── /testimonials
│   └── GET /
│
├── /newsletter
│   └── POST /subscribe
│
└── /admin
    ├── GET /stats
    ├── GET /users
    ├── GET /jobs
    ├── GET /applications
    ├── PUT /users/:id/status
    └── DELETE /jobs/:id
```

---

# 27. Frontend → Backend Build Sequence

Build frontend integration in this order:

```text
1. API base URL
        ↓
2. Auth
        ↓
3. Navbar auth state
        ↓
4. Homepage categories
        ↓
5. Homepage latest jobs
        ↓
6. Job search
        ↓
7. Job details
        ↓
8. Candidate profile
        ↓
9. Save job
        ↓
10. Apply job
        ↓
11. Employer company
        ↓
12. Employer create job
        ↓
13. Employer manage jobs
        ↓
14. Application management
        ↓
15. Admin dashboard
        ↓
16. Testimonials
        ↓
17. Newsletter
```

Why?

```text
Auth → user identity
user identity → role
role → protected routes
protected routes → candidate/employer features
jobs → applications
applications → dashboards
```

---

# 28. Frontend API Layer

Do NOT call Axios everywhere.

Use:

```text
src/
├── api/
│   ├── axios.js
│   ├── auth.api.js
│   ├── jobs.api.js
│   ├── category.api.js
│   ├── application.api.js
│   ├── candidate.api.js
│   ├── company.api.js
│   └── admin.api.js
```

Example:

```js
export const getJobs = async (params) => {
  const { data } = await axios.get("/jobs", { params });
  return data;
};
```

Then UI:

```text
Page
 ↓
Hook
 ↓
API function
 ↓
Axios
 ↓
Backend
```

Better:

```text
React Query / TanStack Query
```

for server state.

---

# 29. Backend Development Tree

```text
START
 │
 ├── Setup
 │    ├── Express
 │    ├── MongoDB
 │    └── ENV
 │
 ├── Core
 │    ├── User Model
 │    ├── Auth
 │    ├── JWT
 │    └── Middleware
 │
 ├── User System
 │    ├── Candidate
 │    └── Employer
 │
 ├── Job System
 │    ├── Category
 │    ├── Company
 │    ├── Job CRUD
 │    ├── Search
 │    ├── Filter
 │    └── Pagination
 │
 ├── Candidate System
 │    ├── Apply
 │    ├── Saved Jobs
 │    └── Resume
 │
 ├── Employer System
 │    ├── Post Job
 │    ├── Manage Jobs
 │    └── Applications
 │
 ├── Content
 │    ├── Testimonials
 │    └── Newsletter
 │
 ├── Admin
 │    ├── Users
 │    ├── Jobs
 │    ├── Categories
 │    └── Statistics
 │
 ├── Production
 │    ├── Security
 │    ├── Validation
 │    ├── Logging
 │    ├── Error Handling
 │    └── Testing
 │
 └── Deploy
      ├── MongoDB Atlas
      ├── Backend hosting
      ├── Frontend hosting
      ├── ENV
      └── CORS
```

---

# 30. Error Handling Architecture

Central error middleware:

```text
Controller
   ↓
throw error
   ↓
next(error)
   ↓
error.middleware.js
   ↓
standard JSON response
```

Response format:

```json
{
  "success": false,
  "message": "Something went wrong",
  "error": null
}
```

Validation error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

Keep response structure consistent across API.

---

# 31. Pagination

All large lists need pagination:

```text
Users
Jobs
Applications
Saved Jobs
Testimonials
```

Query:

```text
?page=1&limit=10
```

Calculation:

```text
skip = (page - 1) * limit
```

Response:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

# 32. MongoDB Indexes

Important indexes:

```text
User.email
Job.title
Job.location
Job.category
Job.createdAt
Job.status
Application.job + Application.candidate
SavedJob.user + SavedJob.job
Newsletter.email
Category.slug
```

Unique compound indexes:

```text
Application:
(job, candidate)

SavedJob:
(user, job)
```

This prevents duplicate data.

---

# 33. Job Search Strategy

Start simple:

```text
MongoDB regex / text search
```

Later:

```text
MongoDB Atlas Search
```

Search fields:

```text
title
description
skills
company name
location
```

Do NOT over-engineer search at first.

---

# 34. API Testing Order

Use Postman.

Test:

```text
1. GET /api/health

2. POST /api/auth/register

3. GET /api/auth/verify-email/:token

4. POST /api/auth/login

5. GET /api/auth/me

6. POST /api/companies

7. POST /api/categories

8. POST /api/jobs

9. GET /api/jobs

10. GET /api/jobs/:id

11. POST /api/saved-jobs/:jobId

12. POST /api/applications

13. GET /api/applications/my

14. PUT /api/applications/:id/status

15. GET /api/admin/stats
```

Never start frontend integration before core API works in Postman.

---

# 35. Git Commit Strategy

Use small commits:

```text
feat: setup express server
feat: connect mongodb
feat: add user model
feat: add register api
feat: add login api
feat: add jwt middleware
feat: add role middleware
feat: add company api
feat: add category api
feat: add job crud
feat: add job search
feat: add application api
feat: add saved job api
feat: add admin stats
fix: handle duplicate application
fix: improve auth error handling
```

---

# 36. Production Deployment

Recommended architecture:

```text
Frontend
   ↓
Vercel / Netlify

Backend
   ↓
Render / Railway / VPS

Database
   ↓
MongoDB Atlas

Images / Resume
   ↓
Cloudinary
```

Production flow:

```text
Browser
   ↓
Frontend domain
   ↓
Backend API domain
   ↓
MongoDB Atlas
```

Production ENV:

```text
PORT
MONGO_URI
JWT_SECRET
JWT_EXPIRES_IN
CLIENT_URL
EMAIL
EMAIL_PASSWORD
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

---

# 37. Final Recommended Project Structure

Full system:

```text
job-board/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── utils/
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── validations/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# 38. Senior Backend Rule

Do NOT think:

```text
Figma section → create endpoint
```

Think:

```text
Business entity
      ↓
Business rule
      ↓
Database model
      ↓
Service
      ↓
Controller
      ↓
Route
      ↓
Middleware
      ↓
API
      ↓
Frontend
```

Example:

```text
Apply Job
   ↓
Business rule:
candidate cannot apply twice
   ↓
Application model
   ↓
unique index
   ↓
application service
   ↓
application controller
   ↓
auth + candidate middleware
   ↓
POST /api/applications
   ↓
Frontend Apply button
```

This approach keeps backend scalable.

---

# 39. MVP vs Advanced

## MVP

Build first:

```text
Auth
Users
Candidate
Employer
Company
Category
Job CRUD
Job Search
Job Details
Apply Job
Saved Jobs
Basic Admin
Newsletter
```

## Advanced

Build later:

```text
Realtime notifications
Socket.IO
Advanced search
Recommendation system
Redis caching
Job alerts
Email queue
Analytics
Payment
Subscription
AI job matching
Microservices
```

Do NOT start with advanced features.

---

# 40. Exact Build Roadmap

```text
WEEK 1
├── Express setup
├── MongoDB
├── ENV
├── User model
├── Register
├── Login
├── JWT
├── Email verification
└── Auth middleware

WEEK 2
├── Candidate profile
├── Company
├── Category
├── Role authorization
└── File upload

WEEK 3
├── Job model
├── Job CRUD
├── Search
├── Filter
├── Pagination
└── Job details

WEEK 4
├── Application
├── Saved Jobs
├── Employer dashboard APIs
├── Candidate dashboard APIs
└── Application status

WEEK 5
├── Admin APIs
├── Statistics
├── Testimonials
├── Newsletter
├── Email notifications
└── Error handling

WEEK 6
├── Security
├── Validation
├── DB indexes
├── Postman testing
├── Frontend integration
└── Deployment
```

---

# 41. Final Dependency Tree

```text
ENV
 ↓
Express
 ↓
MongoDB
 ↓
User
 ↓
Auth
 ↓
JWT Middleware
 ↓
Role Middleware
 ↓
Candidate / Employer
 ↓
Company
 ↓
Category
 ↓
Job
 ↓
Search + Filter + Pagination
 ↓
Saved Job
 ↓
Application
 ↓
Application Status
 ↓
Dashboard
 ↓
Admin
 ↓
Testimonials + Newsletter
 ↓
Email + Upload
 ↓
Security + Testing
 ↓
Deployment
```

This is correct dependency order.

Build bottom → top.

Do not jump directly from Figma → 20 controllers.

Build business foundation first.
