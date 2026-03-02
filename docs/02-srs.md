# PART 2 — SOFTWARE REQUIREMENTS SPECIFICATION (IEEE FORMAT)

**Document:** Software Requirements Specification  
**Project:** HUSTLERS — Informal Job Agreement & Payment Tracker Platform  
**Version:** 1.0  
**Date:** March 2026  
**Status:** Approved  

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the functional and non-functional requirements for the HUSTLERS platform — a mobile-first digital system designed to formalise informal job agreements within Kenya's hustle economy. This document is intended for:

- Software developers implementing the system.
- Quality assurance engineers validating system behaviour.
- Project supervisors and academic evaluators assessing system design.
- Future maintainers and system administrators.

The SRS serves as the contractual reference against which the implemented system will be verified and validated.

### 1.2 Scope

The HUSTLERS system is a mobile application and supporting REST API backend that enables:

- Formal digital job agreements between managers (job providers) and hustlers (workers).
- Escrow-backed payment processing via IntaSend/M-Pesa.
- Milestone-based work verification and payment release.
- Digital wallet management for workers and managers.
- Reputation scoring and worker discovery.
- Dispute resolution with full audit trail.
- Gamified engagement through reward points and badges.

The system does **not** include: a web interface (v1), AI-powered KYC document analysis, government identity database integration, multi-currency support, or in-app messaging.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|---|---|
| Hustler | An informal worker who accepts and completes jobs on the platform |
| Manager | A job provider who creates contracts and funds escrow |
| Escrow | A financial arrangement where funds are held by a third party pending fulfilment of contract terms |
| Milestone | A defined unit of work within a contract, with associated payment |
| KYC | Know Your Customer — identity verification process |
| JWT | JSON Web Token — stateless authentication mechanism |
| API | Application Programming Interface |
| REST | Representational State Transfer — architectural style for distributed systems |
| SRS | Software Requirements Specification |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |
| M-Pesa | Kenya's dominant mobile money service operated by Safaricom |
| IntaSend | A Kenyan payment gateway supporting M-Pesa and card transactions |
| SHA-256 | Secure Hash Algorithm 256-bit |
| MongoDB | A document-oriented NoSQL database |
| React Native | A cross-platform mobile application framework |

### 1.4 References

- IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications
- Kenya National Bureau of Statistics, 2023 Economic Survey
- IntaSend API Documentation v2.0 (intasend.com/docs)
- RFC 7519: JSON Web Token (JWT)
- OWASP Mobile Security Testing Guide (2024)
- Central Bank of Kenya, National Payments System Guidelines (2022)

### 1.5 Document Overview

This document is structured as follows:

- **Section 1:** Introduction and context.
- **Section 2:** Overall system description and constraints.
- **Section 3:** Detailed functional requirements for each system module.
- **Section 4:** Non-functional requirements (performance, security, usability).

---

## 2. Overall Description

### 2.1 Product Perspective

The HUSTLERS platform is a new, standalone system with no predecessor product. It operates as a three-tier application:

- **Client Tier:** React Native mobile application (Android primary, iOS secondary).
- **Application Tier:** Node.js + Express.js RESTful API.
- **Data Tier:** MongoDB database hosted on a cloud provider (MongoDB Atlas).

The system interfaces with:
- **IntaSend Payment Gateway:** For M-Pesa and card payment processing.
- **SMS/USSD Gateway:** For KYC OTP verification.

### 2.2 Product Functions

The platform provides the following high-level functions:

1. User registration and identity verification (KYC).
2. Job contract creation with milestone definition.
3. Escrow-backed payment funding and management.
4. Milestone submission (proof of work) and approval.
5. Automatic payment release upon milestone approval.
6. Digital wallet management (deposit, withdraw, balance check).
7. Reputation scoring and worker profile management.
8. Worker discovery and search.
9. Reward points accrual and redemption.
10. Dispute submission and resolution.
11. Comprehensive audit logging.

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Proficiency |
|---|---|---|
| Hustler (Worker) | Informal worker completing jobs. Ages 18–45. Primary mobile user. | Low to medium |
| Manager (Job Provider) | Individual or SME providing jobs. May have basic smartphone experience. | Low to medium |
| Platform Administrator | Backend operator managing KYC reviews, disputes, and platform settings. | High |

### 2.4 Operating Environment

- **Mobile OS:** Android 8.0 (API 26) and above; iOS 13 and above.
- **Backend Server:** Ubuntu 22.04 LTS on cloud VPS (e.g., AWS EC2 or DigitalOcean Droplet).
- **Database:** MongoDB Atlas (cloud-hosted).
- **Network:** Designed for low-bandwidth environments (2G/3G compatible).
- **Language Support:** English and Swahili (v1 English only, Swahili localisation planned).

### 2.5 Design and Implementation Constraints

- All API communication must use HTTPS (TLS 1.2 or higher).
- Payment processing must comply with IntaSend's API terms and Central Bank of Kenya guidelines.
- User passwords must be hashed using bcrypt with a minimum cost factor of 10.
- JWT tokens must expire within 24 hours (access tokens) and 7 days (refresh tokens).
- The mobile application must function with intermittent network connectivity (offline-tolerant UI).
- MongoDB collections must implement appropriate indexing for query performance.

### 2.6 Assumptions and Dependencies

1. Users possess a Kenyan phone number registered with a mobile network operator.
2. M-Pesa service is available in the user's region.
3. The IntaSend API remains stable and backwards-compatible throughout development.
4. Users have access to an Android smartphone with a camera (for KYC document submission).
5. Platform administrators will manually review KYC submissions in v1.

---

## 3. Functional Requirements

---

### Module 1: User Registration and Authentication

---

#### FR-1.1: User Registration

**Description:** The system shall allow new users to create an account by providing their phone number, full name, and a secure password. Users select a role (Hustler or Manager) at registration.

**Inputs:**
- Full name (string, required)
- Phone number (string, E.164 format, required, unique)
- Password (string, min 8 characters, required)
- Role (enum: "hustler" | "manager", required)

**Outputs:**
- Success: `201 Created` with user ID and verification prompt.
- Failure: `400 Bad Request` with validation error messages.
- Duplicate phone: `409 Conflict`.

**Preconditions:**
- Phone number is not already registered on the platform.

**Postconditions:**
- User account created in `users` collection with `status: "unverified"`.
- OTP sent to the provided phone number for verification.

**Priority:** High

---

#### FR-1.2: Phone Number Verification (OTP)

**Description:** The system shall verify user phone numbers via a one-time password (OTP) sent via SMS.

**Inputs:**
- Phone number (string)
- OTP code (6-digit numeric string)

**Outputs:**
- Success: `200 OK`; account status updated to `"verified"`.
- Failure: `400 Bad Request` for invalid or expired OTP.

**Preconditions:**
- User account exists with `status: "unverified"`.
- OTP has been generated and sent (within 10-minute expiry window).

**Postconditions:**
- User `status` updated to `"verified"` in the database.
- OTP record marked as used.

**Priority:** High

---

#### FR-1.3: User Login

**Description:** The system shall authenticate registered users via phone number and password, returning a JWT access token and refresh token.

**Inputs:**
- Phone number (string)
- Password (string)

**Outputs:**
- Success: `200 OK` with `accessToken` (24-hour expiry) and `refreshToken` (7-day expiry).
- Failure: `401 Unauthorized` for invalid credentials.
- Locked account: `403 Forbidden` with reason.

**Preconditions:**
- User account exists and is in `"verified"` or `"kyc_approved"` status.

**Postconditions:**
- JWT tokens issued.
- Last login timestamp updated.
- Failed login attempts tracked.

**Priority:** High

---

#### FR-1.4: Token Refresh

**Description:** The system shall issue a new access token when a valid refresh token is provided, without requiring re-authentication.

**Inputs:**
- Refresh token (JWT string)

**Outputs:**
- Success: `200 OK` with new `accessToken`.
- Failure: `401 Unauthorized` for expired or invalid refresh token.

**Preconditions:**
- Refresh token is valid and not expired or blacklisted.

**Postconditions:**
- New access token issued with a fresh 24-hour expiry.

**Priority:** High

---

#### FR-1.5: Password Reset

**Description:** The system shall allow users to reset their password via OTP-verified phone number confirmation.

**Inputs:**
- Phone number (string)
- OTP (for verification)
- New password (string, min 8 characters)

**Outputs:**
- Success: `200 OK` confirming password update.
- Failure: `400 Bad Request` for validation errors.

**Preconditions:**
- User account exists.
- OTP successfully verified.

**Postconditions:**
- Password hash updated in the database.
- All existing JWT tokens invalidated.

**Priority:** Medium

---

### Module 2: KYC Identity Verification

---

#### FR-2.1: KYC Document Submission

**Description:** The system shall allow verified users to submit KYC documents (national ID or passport) to enable full platform access.

**Inputs:**
- Document type (enum: "national_id" | "passport")
- Document front image (JPEG/PNG, max 5 MB)
- Document back image (JPEG/PNG, max 5 MB, for national ID)
- Selfie image (JPEG/PNG, max 5 MB)

**Outputs:**
- Success: `202 Accepted` with KYC submission ID.
- Failure: `400 Bad Request` for invalid file types or sizes.

**Preconditions:**
- User is authenticated and in `"verified"` status.
- No pending or approved KYC submission exists.

**Postconditions:**
- KYC documents stored securely.
- KYC record created with `status: "pending"`.
- Admin notified of pending review.

**Priority:** High

---

#### FR-2.2: KYC Review (Admin)

**Description:** Platform administrators shall be able to approve or reject KYC submissions with a mandatory reason for rejection.

**Inputs:**
- KYC submission ID
- Decision (enum: "approved" | "rejected")
- Rejection reason (string, required if rejected)

**Outputs:**
- Success: `200 OK`.
- Failure: `404 Not Found` if submission does not exist.

**Preconditions:**
- Admin is authenticated with admin role.
- KYC submission exists with `status: "pending"`.

**Postconditions:**
- KYC status updated to `"approved"` or `"rejected"`.
- User account status updated to `"kyc_approved"` or `"kyc_rejected"`.
- User notified via SMS/push notification.

**Priority:** High

---

### Module 3: Contract and Milestone Management

---

#### FR-3.1: Contract Creation

**Description:** The system shall allow managers to create a job contract specifying the title, description, total budget, start and end dates, and one or more milestones.

**Inputs:**
- Contract title (string, max 100 chars)
- Contract description (string, max 1000 chars)
- Total budget (number, KES, min 100)
- Start date (ISO 8601 date)
- End date (ISO 8601 date)
- Milestones array: each milestone contains title, description, payment amount, and due date.
- Hustler user ID (optional at creation; can be assigned later)

**Outputs:**
- Success: `201 Created` with contract ID and details.
- Failure: `400 Bad Request` for validation errors (e.g., milestone amounts exceed total budget).

**Preconditions:**
- Manager is authenticated and KYC approved.
- Sum of milestone payments must equal total budget.

**Postconditions:**
- Contract document created with `status: "draft"`.
- Milestones created as sub-documents within the contract.

**Priority:** High

---

#### FR-3.2: Contract Funding (Escrow Deposit)

**Description:** The system shall allow managers to fund a contract by depositing the total budget into escrow via IntaSend.

**Inputs:**
- Contract ID
- Payment method (M-Pesa or card)
- M-Pesa phone number (if M-Pesa selected)

**Outputs:**
- Success: `200 OK` with payment reference and escrow balance confirmation.
- Failure: `402 Payment Required` if payment fails.

**Preconditions:**
- Contract exists with `status: "draft"`.
- Manager's wallet or M-Pesa account has sufficient funds.

**Postconditions:**
- Contract `status` updated to `"funded"`.
- Escrow balance created/updated for the contract.
- Transaction record created in `transactions` collection.

**Priority:** High

---

#### FR-3.3: Contract Assignment

**Description:** The system shall allow managers to assign a funded contract to a specific hustler.

**Inputs:**
- Contract ID
- Hustler user ID

**Outputs:**
- Success: `200 OK` with updated contract.
- Failure: `404 Not Found` if hustler or contract does not exist.

**Preconditions:**
- Contract has `status: "funded"`.
- Hustler is KYC approved.

**Postconditions:**
- Contract `hustlerId` field updated.
- Contract `status` updated to `"in_progress"`.
- Hustler notified of assignment.

**Priority:** High

---

#### FR-3.4: Milestone Submission (Proof of Work)

**Description:** The system shall allow hustlers to submit proof of work for a specific milestone, including a description and optional supporting images.

**Inputs:**
- Milestone ID
- Submission description (string, max 500 chars)
- Supporting images (array, JPEG/PNG, max 3 images, 5 MB each, optional)

**Outputs:**
- Success: `200 OK` with milestone status updated to `"submitted"`.
- Failure: `400 Bad Request` for validation errors.
- Unauthorised: `403 Forbidden` if submitting user is not the assigned hustler.

**Preconditions:**
- Contract `status` is `"in_progress"`.
- Milestone `status` is `"pending"` or `"rejected"`.
- Authenticated user is the assigned hustler.

**Postconditions:**
- Milestone `status` updated to `"submitted"`.
- Submission timestamp recorded.
- Manager notified of submission.

**Priority:** High

---

#### FR-3.5: Milestone Approval

**Description:** The system shall allow managers to approve a submitted milestone, triggering escrow release to the hustler's wallet.

**Inputs:**
- Milestone ID
- Optional feedback comment (string)

**Outputs:**
- Success: `200 OK` confirming approval and payment release.
- Failure: `403 Forbidden` if approving user is not the contract manager.

**Preconditions:**
- Milestone `status` is `"submitted"`.
- Authenticated user is the contract manager.
- Escrow balance sufficient for milestone payment.

**Postconditions:**
- Milestone `status` updated to `"approved"`.
- Milestone payment amount transferred from escrow to hustler's platform wallet.
- Transaction record created.
- Reward points issued to hustler.
- If all milestones approved, contract `status` updated to `"completed"`.

**Priority:** High

---

#### FR-3.6: Milestone Rejection

**Description:** The system shall allow managers to reject a submitted milestone with a mandatory reason, returning it to `"pending"` status for resubmission.

**Inputs:**
- Milestone ID
- Rejection reason (string, required)

**Outputs:**
- Success: `200 OK` with milestone status updated.
- Failure: `400 Bad Request` if rejection reason is missing.

**Preconditions:**
- Milestone `status` is `"submitted"`.
- Authenticated user is the contract manager.

**Postconditions:**
- Milestone `status` updated to `"rejected"`.
- Rejection reason recorded.
- Hustler notified.

**Priority:** High

---

#### FR-3.7: Contract Closure

**Description:** Upon completion of all milestones, the system shall automatically close the contract and update reputation scores.

**Inputs:** (Triggered automatically upon final milestone approval)

**Outputs:**
- Contract `status` updated to `"closed"`.
- Both user reputation scores updated.

**Preconditions:**
- All milestones within the contract have `status: "approved"`.

**Postconditions:**
- Contract `status` updated to `"closed"`.
- Reputation scores updated for both hustler and manager.
- Contract summary sent to both parties.

**Priority:** High

---

### Module 4: Wallet, Escrow, and Payment System

---

#### FR-4.1: Wallet Balance Inquiry

**Description:** The system shall allow users to view their current platform wallet balance.

**Inputs:** JWT token (in Authorization header)

**Outputs:**
- Success: `200 OK` with wallet balance (KES).

**Preconditions:**
- User is authenticated.

**Postconditions:** None (read-only).

**Priority:** High

---

#### FR-4.2: Wallet Withdrawal

**Description:** The system shall allow hustlers to withdraw funds from their platform wallet to their registered M-Pesa number.

**Inputs:**
- Amount (number, KES, min 50)
- M-Pesa phone number (string)

**Outputs:**
- Success: `200 OK` with transaction reference.
- Failure: `402 Payment Required` if insufficient balance.
- Failure: `503 Service Unavailable` if IntaSend is unreachable.

**Preconditions:**
- User is authenticated with role `"hustler"`.
- Wallet balance is ≥ withdrawal amount + applicable fees.
- IntaSend API is available.

**Postconditions:**
- Wallet balance decremented.
- Transaction record created with `type: "withdrawal"`.
- M-Pesa payment initiated via IntaSend.

**Priority:** High

---

#### FR-4.3: Transaction History

**Description:** The system shall allow users to view a paginated history of all their wallet transactions.

**Inputs:**
- `page` (integer, default 1)
- `limit` (integer, default 20, max 100)
- `type` filter (optional: "deposit" | "withdrawal" | "escrow_in" | "escrow_out" | "reward")

**Outputs:**
- `200 OK` with paginated transaction array.

**Preconditions:** User is authenticated.

**Postconditions:** None.

**Priority:** Medium

---

### Module 5: Reputation and Worker Discovery

---

#### FR-5.1: Reputation Score Calculation

**Description:** The system shall automatically calculate and update a hustler's reputation score upon contract completion. The score is a weighted composite of: completion rate (40%), average manager rating (40%), and response time (20%).

**Inputs:** Triggered automatically upon contract closure.

**Outputs:** Updated reputation score (0–100) stored in user profile.

**Preconditions:** Contract has been closed.

**Postconditions:** User `reputationScore` field updated.

**Priority:** High

---

#### FR-5.2: Post-Contract Rating

**Description:** The system shall allow managers to rate hustlers (1–5 stars) and provide a text review after contract completion. Hustlers may optionally rate managers.

**Inputs:**
- Contract ID
- Rating (integer 1–5)
- Review text (string, max 300 chars, optional)

**Outputs:**
- `201 Created` with rating record.
- `409 Conflict` if already rated for this contract.

**Preconditions:**
- Contract `status` is `"closed"`.
- Rating user has not previously rated for this contract.

**Postconditions:**
- Rating record stored.
- Reputation score recalculated.

**Priority:** High

---

#### FR-5.3: Worker Profile View

**Description:** The system shall provide a public worker profile page displaying a hustler's verified name, reputation score, skills, completed job count, and recent reviews.

**Inputs:**
- Hustler user ID (URL parameter)

**Outputs:**
- `200 OK` with public profile data.

**Preconditions:** None (public endpoint, no authentication required).

**Postconditions:** None.

**Priority:** Medium

---

#### FR-5.4: Worker Search and Discovery

**Description:** The system shall allow managers to search for hustlers by skill category, location, minimum reputation score, and availability status.

**Inputs:**
- `skill` (string, optional)
- `location` (string, optional)
- `minReputation` (integer 0–100, optional)
- `available` (boolean, optional)
- `page` and `limit` pagination parameters

**Outputs:**
- `200 OK` with paginated hustler list including reputation scores and key metrics.

**Preconditions:** Manager is authenticated and KYC approved.

**Postconditions:** None.

**Priority:** Medium

---

### Module 6: Rewards and Gamification

---

#### FR-6.1: Reward Points Accrual

**Description:** The system shall automatically issue reward points to hustlers upon milestone approval. Points are calculated as 1 point per KES 10 earned.

**Inputs:** Triggered by milestone approval event.

**Outputs:** Reward points balance updated.

**Preconditions:** Milestone has been approved.

**Postconditions:** Hustler `rewardPoints` balance incremented. Reward transaction recorded.

**Priority:** Medium

---

#### FR-6.2: Badge Award System

**Description:** The system shall automatically award achievement badges based on predefined milestones (e.g., "First Job Completed", "10 Jobs Completed", "5-Star Worker").

**Inputs:** Triggered by system events (contract closure, rating received).

**Outputs:** Badge added to user profile.

**Preconditions:** User meets the badge award criteria.

**Postconditions:** Badge record created; user notified.

**Priority:** Low

---

#### FR-6.3: Leaderboard

**Description:** The system shall provide a regional leaderboard of top-rated hustlers by reputation score, updated weekly.

**Inputs:** `region` filter (optional)

**Outputs:** `200 OK` with ranked hustler list (top 50).

**Preconditions:** None.

**Postconditions:** None.

**Priority:** Low

---

### Module 7: Dispute Resolution and Audit Logs

---

#### FR-7.1: Dispute Submission

**Description:** The system shall allow either party (hustler or manager) to open a dispute against an active or recently completed contract, providing a description and supporting evidence.

**Inputs:**
- Contract ID
- Dispute description (string, max 1000 chars)
- Dispute type (enum: "non_payment" | "poor_quality" | "contract_breach" | "other")
- Evidence files (array, max 5 files, JPEG/PNG/PDF, 10 MB each, optional)

**Outputs:**
- `201 Created` with dispute ID.

**Preconditions:**
- Contract exists and is `"in_progress"`, `"completed"`, or `"closed"` (within 7 days).
- No existing open dispute for the same contract from the same user.

**Postconditions:**
- Dispute record created with `status: "open"`.
- Escrow funds frozen if dispute is on an active contract.
- Admin notified.
- Both parties notified.

**Priority:** High

---

#### FR-7.2: Dispute Resolution (Admin)

**Description:** Platform administrators shall be able to review evidence and resolve disputes with a decision (favour hustler, favour manager, or split).

**Inputs:**
- Dispute ID
- Resolution (enum: "favour_hustler" | "favour_manager" | "split")
- Resolution notes (string, required)
- Split percentage (integer 0–100, required if resolution is "split")

**Outputs:**
- `200 OK` with updated dispute and payment adjustment details.

**Preconditions:**
- Admin is authenticated.
- Dispute `status` is `"open"` or `"under_review"`.

**Postconditions:**
- Dispute `status` updated to `"resolved"`.
- Escrow funds disbursed according to resolution.
- Both parties notified.
- Audit log entry created.

**Priority:** High

---

#### FR-7.3: Audit Log Retrieval (Admin)

**Description:** Platform administrators shall be able to retrieve a comprehensive audit log of all financial transactions, status changes, and user actions.

**Inputs:**
- `userId` filter (optional)
- `eventType` filter (optional)
- `dateFrom` and `dateTo` range (optional)
- Pagination parameters

**Outputs:**
- `200 OK` with paginated audit log entries.

**Preconditions:** Admin is authenticated.

**Postconditions:** None.

**Priority:** Medium

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

| ID | Requirement |
|---|---|
| NFR-1 | API response time shall not exceed 2 seconds for 95% of requests under normal load. |
| NFR-2 | The system shall support up to 1,000 concurrent users in v1. |
| NFR-3 | Payment processing shall complete within 30 seconds (dependent on IntaSend SLA). |
| NFR-4 | Database queries shall be optimised to return results within 500 ms for indexed fields. |

### 4.2 Security Requirements

| ID | Requirement |
|---|---|
| NFR-5 | All API communication shall use HTTPS with TLS 1.2 or higher. |
| NFR-6 | Passwords shall be hashed with bcrypt (cost factor ≥ 10). Never stored in plaintext. |
| NFR-7 | JWT access tokens shall expire within 24 hours. |
| NFR-8 | KYC document images shall be stored in encrypted cloud storage. |
| NFR-9 | Failed login attempts shall be rate-limited to 5 per 15 minutes per IP address. |
| NFR-10 | All financial transactions shall be atomic to prevent partial fund transfers. |

### 4.3 Usability Requirements

| ID | Requirement |
|---|---|
| NFR-11 | The mobile application shall be navigable by a user with a Standard 6 education level. |
| NFR-12 | All critical user actions shall be completable within 3 taps from the main dashboard. |
| NFR-13 | Error messages shall be clearly written in plain English with actionable guidance. |

### 4.4 Reliability and Availability

| ID | Requirement |
|---|---|
| NFR-14 | The backend API shall target 99.5% uptime (excluding planned maintenance). |
| NFR-15 | The system shall implement graceful degradation when the payment gateway is unavailable. |
| NFR-16 | Database backups shall be performed daily, with point-in-time recovery available. |

### 4.5 Maintainability

| ID | Requirement |
|---|---|
| NFR-17 | The codebase shall maintain a minimum test coverage of 80% for backend services. |
| NFR-18 | All API endpoints shall be documented using OpenAPI 3.0 specification. |
| NFR-19 | The system shall use environment variables for all configuration; no hardcoded secrets. |

---

*End of Part 2 — Software Requirements Specification*
