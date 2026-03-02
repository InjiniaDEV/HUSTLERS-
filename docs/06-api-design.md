# PART 6 — REST API DESIGN

**Project:** HUSTLERS — Informal Job Agreement & Payment Tracker Platform  
**API Version:** v1  
**Base URL:** `https://api.hustlers.ke/v1`  
**Format:** JSON  
**Authentication:** Bearer JWT token in `Authorization` header  
**Date:** March 2026  

---

## API Overview

The HUSTLERS REST API follows RESTful conventions:
- HTTP verbs reflect operation semantics (GET, POST, PATCH, DELETE).
- Resources are named in plural lowercase (`/users`, `/contracts`).
- Responses use standard HTTP status codes.
- All timestamps are ISO 8601 format.
- Monetary amounts are in KES (Kenyan Shillings) as floating-point numbers.
- Pagination uses `page` and `limit` query parameters.

**Standard Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error description",
    "details": {}
  }
}
```

**Standard Success Response Format:**
```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

---

## Authentication Endpoints

---

### POST /auth/register

**Description:** Register a new user account.  
**Authentication Required:** No  

**Request Body:**
```json
{
  "fullName": "Jane Wanjiku",
  "phoneNumber": "+254712345678",
  "password": "SecurePass123!",
  "role": "hustler"
}
```

**Response — 201 Created:**
```json
{
  "success": true,
  "data": {
    "userId": "64f3a1b2c3d4e5f6a7b8c9d0",
    "phoneNumber": "+254712345678",
    "status": "unverified",
    "message": "OTP sent to +254712345678. Please verify your phone number."
  }
}
```

**Response — 409 Conflict (duplicate phone):**
```json
{
  "success": false,
  "error": {
    "code": "PHONE_ALREADY_REGISTERED",
    "message": "This phone number is already registered."
  }
}
```

---

### POST /auth/verify-otp

**Description:** Verify phone number using OTP.  
**Authentication Required:** No  

**Request Body:**
```json
{
  "phoneNumber": "+254712345678",
  "otp": "847291"
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "message": "Phone number verified successfully.",
    "status": "verified"
  }
}
```

---

### POST /auth/login

**Description:** Authenticate a user and issue JWT tokens.  
**Authentication Required:** No  

**Request Body:**
```json
{
  "phoneNumber": "+254712345678",
  "password": "SecurePass123!"
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "user": {
      "userId": "64f3a1b2c3d4e5f6a7b8c9d0",
      "fullName": "Jane Wanjiku",
      "role": "hustler",
      "status": "verified"
    }
  }
}
```

**Response — 401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Incorrect phone number or password."
  }
}
```

---

### POST /auth/refresh

**Description:** Obtain a new access token using a valid refresh token.  
**Authentication Required:** No (refresh token in body)  

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

---

### POST /auth/logout

**Description:** Invalidate the current refresh token (server-side blacklisting).  
**Authentication Required:** Yes (Bearer token)  

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": { "message": "Logged out successfully." }
}
```

---

## KYC Endpoints

---

### POST /kyc/submit

**Description:** Submit KYC documents for identity verification.  
**Authentication Required:** Yes (status: "verified")  
**Content-Type:** `multipart/form-data`  

**Request (multipart form fields):**
```
documentType: "national_id"
frontImage: [binary file]
backImage: [binary file]
selfie: [binary file]
```

**Response — 202 Accepted:**
```json
{
  "success": true,
  "data": {
    "kycId": "65a3b2c1d0e9f8a7b6c5d4e3",
    "status": "pending",
    "message": "KYC documents received. Review takes 24–48 hours."
  }
}
```

---

### GET /kyc/status

**Description:** Check current KYC verification status.  
**Authentication Required:** Yes  

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "status": "approved",
    "submittedAt": "2026-02-15T10:30:00Z",
    "reviewedAt": "2026-02-16T09:00:00Z"
  }
}
```

---

### GET /kyc/pending (Admin)

**Description:** List all pending KYC submissions for admin review.  
**Authentication Required:** Yes (role: "admin")  

**Query Parameters:** `page`, `limit`

**Response — 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "kycId": "65a3b2c1d0e9f8a7b6c5d4e3",
      "userId": "64f3a1b2c3d4e5f6a7b8c9d0",
      "fullName": "Jane Wanjiku",
      "documentType": "national_id",
      "submittedAt": "2026-02-15T10:30:00Z",
      "frontImageUrl": "https://storage.hustlers.ke/kyc/abc123-front.jpg",
      "selfieUrl": "https://storage.hustlers.ke/kyc/abc123-selfie.jpg"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 7 }
}
```

---

### PATCH /kyc/:kycId/review (Admin)

**Description:** Approve or reject a KYC submission.  
**Authentication Required:** Yes (role: "admin")  

**Request Body:**
```json
{
  "decision": "rejected",
  "rejectionReason": "ID document image is blurry and unreadable. Please resubmit."
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "kycId": "65a3b2c1d0e9f8a7b6c5d4e3",
    "status": "rejected",
    "message": "KYC decision recorded and user notified."
  }
}
```

---

## Contract Endpoints

---

### POST /contracts

**Description:** Create a new job contract with milestones.  
**Authentication Required:** Yes (role: "manager", status: "kyc_approved")  

**Request Body:**
```json
{
  "title": "Repaint 3-bedroom house exterior",
  "description": "Full exterior repaint of a 3-bedroom maisonette in Karen. Two coats of premium paint.",
  "totalBudget": 15000,
  "startDate": "2026-03-10",
  "endDate": "2026-03-20",
  "milestones": [
    {
      "title": "Surface preparation and priming",
      "description": "Sand, patch, and apply primer to all exterior walls.",
      "paymentAmount": 5000,
      "dueDate": "2026-03-13"
    },
    {
      "title": "First coat of paint",
      "description": "Apply first full coat of agreed exterior paint colour.",
      "paymentAmount": 5000,
      "dueDate": "2026-03-16"
    },
    {
      "title": "Second coat and finishing",
      "description": "Apply second coat, touch up, and clean site.",
      "paymentAmount": 5000,
      "dueDate": "2026-03-20"
    }
  ]
}
```

**Response — 201 Created:**
```json
{
  "success": true,
  "data": {
    "contractId": "66b1c2d3e4f5a6b7c8d9e0f1",
    "status": "draft",
    "totalBudget": 15000,
    "milestoneCount": 3,
    "createdAt": "2026-03-02T14:00:00Z"
  }
}
```

---

### POST /contracts/:contractId/fund

**Description:** Fund a contract by depositing total budget into escrow.  
**Authentication Required:** Yes (role: "manager")  

**Request Body:**
```json
{
  "paymentMethod": "mpesa",
  "mpesaPhone": "+254712345678"
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "contractId": "66b1c2d3e4f5a6b7c8d9e0f1",
    "status": "funded",
    "escrowBalance": 15000,
    "paymentReference": "INTASEND-TXN-00012345",
    "message": "M-Pesa STK Push sent. Enter your PIN to complete payment."
  }
}
```

---

### PATCH /contracts/:contractId/assign

**Description:** Assign a funded contract to a hustler.  
**Authentication Required:** Yes (role: "manager")  

**Request Body:**
```json
{
  "hustlerId": "64f3a1b2c3d4e5f6a7b8c9d0"
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "contractId": "66b1c2d3e4f5a6b7c8d9e0f1",
    "status": "in_progress",
    "hustlerId": "64f3a1b2c3d4e5f6a7b8c9d0",
    "hustlerName": "Jane Wanjiku"
  }
}
```

---

### GET /contracts

**Description:** List contracts for the authenticated user.  
**Authentication Required:** Yes  

**Query Parameters:** `status`, `page`, `limit`

**Response — 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "contractId": "66b1c2d3e4f5a6b7c8d9e0f1",
      "title": "Repaint 3-bedroom house exterior",
      "status": "in_progress",
      "totalBudget": 15000,
      "escrowBalance": 10000,
      "milestonesCompleted": 1,
      "milestoneCount": 3
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 3 }
}
```

---

### GET /contracts/:contractId

**Description:** Get full details of a specific contract including milestones.  
**Authentication Required:** Yes (must be manager or assigned hustler)  

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "contractId": "66b1c2d3e4f5a6b7c8d9e0f1",
    "title": "Repaint 3-bedroom house exterior",
    "description": "Full exterior repaint...",
    "status": "in_progress",
    "totalBudget": 15000,
    "escrowBalance": 10000,
    "manager": { "userId": "...", "fullName": "John Kamau" },
    "hustler": { "userId": "...", "fullName": "Jane Wanjiku", "reputationScore": 87 },
    "milestones": [
      {
        "milestoneId": "77c2d3e4f5a6b7c8d9e0f1a2",
        "title": "Surface preparation and priming",
        "paymentAmount": 5000,
        "status": "approved",
        "dueDate": "2026-03-13",
        "approvedAt": "2026-03-12T16:00:00Z"
      }
    ],
    "startDate": "2026-03-10",
    "endDate": "2026-03-20",
    "createdAt": "2026-03-02T14:00:00Z"
  }
}
```

---

## Milestone Endpoints

---

### POST /milestones/:milestoneId/submit

**Description:** Hustler submits proof of work for a milestone.  
**Authentication Required:** Yes (role: "hustler", must be assigned hustler)  
**Content-Type:** `multipart/form-data`  

**Request:**
```
description: "Completed sanding and priming of all exterior walls. Photos attached."
images: [binary file 1], [binary file 2]
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "milestoneId": "77c2d3e4f5a6b7c8d9e0f1a2",
    "status": "submitted",
    "submittedAt": "2026-03-12T10:00:00Z",
    "message": "Submission received. Manager has been notified."
  }
}
```

---

### POST /milestones/:milestoneId/approve

**Description:** Manager approves a submitted milestone and releases escrow payment.  
**Authentication Required:** Yes (role: "manager", must be contract manager)  

**Request Body:**
```json
{
  "comment": "Excellent work. Primer looks great."
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "milestoneId": "77c2d3e4f5a6b7c8d9e0f1a2",
    "status": "approved",
    "paymentReleased": 5000,
    "hustlerWalletBalance": 5000,
    "rewardPointsEarned": 500,
    "message": "Payment of KES 5,000 released to Jane Wanjiku's wallet."
  }
}
```

---

### POST /milestones/:milestoneId/reject

**Description:** Manager rejects a submitted milestone.  
**Authentication Required:** Yes (role: "manager")  

**Request Body:**
```json
{
  "reason": "Priming was not applied to the back wall. Please redo and resubmit."
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "milestoneId": "77c2d3e4f5a6b7c8d9e0f1a2",
    "status": "rejected",
    "reason": "Priming was not applied to the back wall. Please redo and resubmit."
  }
}
```

---

## Wallet Endpoints

---

### GET /wallet

**Description:** Get the authenticated user's wallet balance and summary.  
**Authentication Required:** Yes  

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "walletId": "88d3e4f5a6b7c8d9e0f1a2b3",
    "balance": 12500,
    "currency": "KES",
    "totalEarned": 35000,
    "totalWithdrawn": 22500,
    "rewardPoints": 1250
  }
}
```

---

### POST /wallet/deposit

**Description:** Initiate a deposit into the platform wallet via M-Pesa.  
**Authentication Required:** Yes  

**Request Body:**
```json
{
  "amount": 5000,
  "mpesaPhone": "+254712345678"
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "reference": "INTASEND-DEP-00067890",
    "amount": 5000,
    "message": "M-Pesa STK Push sent. Enter PIN to complete deposit."
  }
}
```

---

### POST /wallet/withdraw

**Description:** Withdraw funds from platform wallet to M-Pesa.  
**Authentication Required:** Yes (role: "hustler")  

**Request Body:**
```json
{
  "amount": 10000,
  "mpesaPhone": "+254712345678"
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "reference": "INTASEND-WD-00099123",
    "amountSent": 10000,
    "fee": 35,
    "newBalance": 2500,
    "message": "KES 10,000 sent to +254712345678 via M-Pesa."
  }
}
```

**Response — 402 Payment Required:**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Your wallet balance (KES 2,000) is less than the requested amount (KES 10,000)."
  }
}
```

---

### GET /wallet/transactions

**Description:** Get paginated transaction history.  
**Authentication Required:** Yes  

**Query Parameters:** `page`, `limit`, `type`

**Response — 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "transactionId": "99e4f5a6b7c8d9e0f1a2b3c4",
      "type": "escrow_out",
      "amount": 5000,
      "description": "Milestone payment: Surface preparation and priming",
      "contractId": "66b1c2d3e4f5a6b7c8d9e0f1",
      "status": "completed",
      "createdAt": "2026-03-12T16:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 14 }
}
```

---

## Worker Discovery Endpoints

---

### GET /workers/search

**Description:** Search and filter hustlers for job assignment.  
**Authentication Required:** Yes (role: "manager", status: "kyc_approved")  

**Query Parameters:**
- `skill` (string): Filter by skill keyword
- `location` (string): Filter by location
- `minReputation` (integer 0–100): Minimum reputation score
- `available` (boolean): Only show available workers
- `page`, `limit`

**Example Request:**
```
GET /workers/search?skill=plumbing&location=Nairobi&minReputation=70&available=true
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "64f3a1b2c3d4e5f6a7b8c9d0",
      "fullName": "Jane Wanjiku",
      "location": "Nairobi, Westlands",
      "skills": ["plumbing", "tiling", "pipe fitting"],
      "reputationScore": 87,
      "averageRating": 4.6,
      "totalJobsCompleted": 23,
      "badges": ["first_job", "ten_jobs"],
      "available": true
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 8 }
}
```

---

### GET /workers/:userId

**Description:** Get a hustler's public profile.  
**Authentication Required:** No (public endpoint)  

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "userId": "64f3a1b2c3d4e5f6a7b8c9d0",
    "fullName": "Jane Wanjiku",
    "bio": "Professional painter and decorator with 5+ years experience.",
    "location": "Nairobi, Westlands",
    "skills": ["plumbing", "tiling", "pipe fitting"],
    "reputationScore": 87,
    "averageRating": 4.6,
    "totalJobsCompleted": 23,
    "completionRate": 95,
    "badges": ["first_job", "ten_jobs"],
    "available": true,
    "recentReviews": [
      {
        "stars": 5,
        "review": "Jane did an incredible job, very thorough.",
        "createdAt": "2026-02-20T12:00:00Z"
      }
    ],
    "memberSince": "2025-10-01T00:00:00Z"
  }
}
```

---

## Dispute Endpoints

---

### POST /disputes

**Description:** Open a dispute against a contract.  
**Authentication Required:** Yes  
**Content-Type:** `multipart/form-data`  

**Request:**
```
contractId: "66b1c2d3e4f5a6b7c8d9e0f1"
disputeType: "non_payment"
description: "Manager has refused to approve milestone 2 despite correct work being done."
evidence: [binary file 1], [binary file 2]
```

**Response — 201 Created:**
```json
{
  "success": true,
  "data": {
    "disputeId": "aab5c6d7e8f9a0b1c2d3e4f5",
    "status": "open",
    "message": "Dispute opened. Escrow has been frozen. An admin will review within 48 hours."
  }
}
```

---

### GET /disputes/:disputeId

**Description:** Get dispute details.  
**Authentication Required:** Yes (involved parties or admin)  

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "disputeId": "aab5c6d7e8f9a0b1c2d3e4f5",
    "contractId": "66b1c2d3e4f5a6b7c8d9e0f1",
    "disputeType": "non_payment",
    "description": "Manager has refused to approve milestone 2...",
    "status": "under_review",
    "raisedBy": { "userId": "...", "fullName": "Jane Wanjiku" },
    "evidenceFiles": ["https://storage.hustlers.ke/disputes/ev1.jpg"],
    "createdAt": "2026-03-01T09:00:00Z"
  }
}
```

---

### PATCH /disputes/:disputeId/resolve (Admin)

**Description:** Resolve a dispute and disburse escrowed funds.  
**Authentication Required:** Yes (role: "admin")  

**Request Body:**
```json
{
  "resolution": "favour_hustler",
  "resolutionNotes": "Evidence shows milestone was completed satisfactorily. Full payment released to hustler."
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "disputeId": "aab5c6d7e8f9a0b1c2d3e4f5",
    "status": "resolved",
    "resolution": "favour_hustler",
    "amountDisbursed": 5000,
    "recipient": "Jane Wanjiku",
    "message": "Dispute resolved. KES 5,000 released to hustler's wallet."
  }
}
```

---

## Rewards Endpoints

---

### GET /rewards

**Description:** Get the authenticated user's reward points balance and recent rewards history.  
**Authentication Required:** Yes  

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "totalPoints": 1250,
    "badges": ["first_job", "ten_jobs"],
    "recentRewards": [
      {
        "type": "points",
        "points": 500,
        "description": "Milestone completed: Surface preparation and priming",
        "awardedAt": "2026-03-12T16:00:00Z"
      }
    ]
  }
}
```

---

### GET /leaderboard

**Description:** Get the regional leaderboard of top-rated hustlers.  
**Authentication Required:** No (public endpoint)  

**Query Parameters:** `region` (optional)

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "region": "Nairobi",
    "updatedAt": "2026-02-24T00:00:00Z",
    "rankings": [
      { "rank": 1, "fullName": "James Otieno", "reputationScore": 97, "totalJobsCompleted": 54 },
      { "rank": 2, "fullName": "Grace Achieng", "reputationScore": 94, "totalJobsCompleted": 41 }
    ]
  }
}
```

---

## Admin Endpoints

---

### GET /admin/audit-logs

**Description:** Query comprehensive audit logs.  
**Authentication Required:** Yes (role: "admin")  

**Query Parameters:** `userId`, `eventType`, `dateFrom`, `dateTo`, `page`, `limit`

**Response — 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "logId": "bbc6d7e8f9a0b1c2d3e4f5a6",
      "userId": "64f3a1b2c3d4e5f6a7b8c9d0",
      "eventType": "milestone_approved",
      "entityType": "milestone",
      "entityId": "77c2d3e4f5a6b7c8d9e0f1a2",
      "metadata": { "amount": 5000, "contractId": "66b1c2d3e4f5a6b7c8d9e0f1" },
      "ipAddress": "102.0.2.45",
      "timestamp": "2026-03-12T16:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 534 }
}
```

---

## HTTP Status Code Reference

| Code | Meaning |
|---|---|
| 200 | OK — Successful GET, PATCH, DELETE |
| 201 | Created — Successful POST creating a resource |
| 202 | Accepted — Request received, processing asynchronously |
| 400 | Bad Request — Validation error |
| 401 | Unauthorized — Missing or invalid token |
| 403 | Forbidden — Authenticated but insufficient permissions |
| 404 | Not Found — Resource does not exist |
| 409 | Conflict — Duplicate resource or state conflict |
| 402 | Payment Required — Insufficient funds |
| 422 | Unprocessable Entity — Business logic violation |
| 429 | Too Many Requests — Rate limit exceeded |
| 500 | Internal Server Error — Unexpected server failure |
| 503 | Service Unavailable — External service (e.g., IntaSend) unavailable |

---

*End of Part 6 — REST API Design*
