# PART 3 — AGILE PRODUCT BACKLOG

**Project:** HUSTLERS — Informal Job Agreement & Payment Tracker Platform  
**Version:** 1.0  
**Date:** March 2026  

---

## Backlog Overview

This Product Backlog defines all user stories for the HUSTLERS platform, organised by priority using the MoSCoW method:

- **Must Have (M):** Critical for v1 launch.
- **Should Have (S):** Important but not blocking launch.
- **Could Have (C):** Desirable enhancements.
- **Won't Have (W):** Deferred to future versions.

Stories are assigned to four sprints, each of two-week duration.

---

## Sprint 1 — Foundation & Authentication (Weeks 4–5)

Focus: Core user management and authentication infrastructure.

---

| Story ID | User Story | Priority | Acceptance Criteria | Sprint |
|---|---|---|---|---|
| US-101 | As a **new user**, I want to register with my phone number and a password so that I can create an account on the platform. | **Must** | - Registration form accepts name, phone, password, role. - Duplicate phone number rejected with clear error. - OTP sent to phone within 30 seconds. - Account created with `status: "unverified"`. | Sprint 1 |
| US-102 | As a **new user**, I want to verify my phone number via OTP so that my account is activated. | **Must** | - OTP entry field displayed after registration. - Correct OTP activates account (`status: "verified"`). - Incorrect OTP shows error. - OTP expires after 10 minutes. - Resend OTP available after 60 seconds. | Sprint 1 |
| US-103 | As a **registered user**, I want to log in with my phone number and password so that I can access the platform. | **Must** | - Correct credentials return JWT access and refresh tokens. - Incorrect credentials return `401` with no token. - Tokens stored securely on device. - User redirected to their dashboard after login. | Sprint 1 |
| US-104 | As a **logged-in user**, I want my session to remain active across app restarts so that I do not need to log in repeatedly. | **Must** | - Refresh token used to obtain new access token without login. - Expired refresh token redirects to login screen. | Sprint 1 |
| US-105 | As a **registered user**, I want to reset my password via OTP verification so that I can regain access if I forget my password. | **Must** | - Password reset flow: phone → OTP → new password. - Password updated in database. - All existing sessions invalidated. | Sprint 1 |
| US-106 | As a **verified user**, I want to submit my KYC documents (national ID and selfie) so that I can access all platform features. | **Must** | - Document upload form accepts ID front/back and selfie. - Files validated (type and size). - Submission creates pending KYC record. - User informed that review takes 24–48 hours. | Sprint 1 |
| US-107 | As a **platform administrator**, I want to review pending KYC submissions and approve or reject them so that only verified users access full platform features. | **Must** | - Admin dashboard lists pending KYC submissions. - Approve/reject action with mandatory reason for rejection. - User account status updated. - User notified via push notification. | Sprint 1 |
| US-108 | As a **user**, I want to view and edit my profile (name, skills, location, availability) so that my information is current and accurate. | **Should** | - Profile screen displays all editable fields. - Changes saved and reflected immediately. - Phone number and role are not editable post-registration. | Sprint 1 |

---

## Sprint 2 — Contract & Escrow Core (Weeks 6–9)

Focus: Contract creation, escrow funding, milestone management, and payment release.

---

| Story ID | User Story | Priority | Acceptance Criteria | Sprint |
|---|---|---|---|---|
| US-201 | As a **manager**, I want to create a job contract with a title, description, budget, and milestones so that the work expectations are formally documented. | **Must** | - Contract form accepts all required fields. - At least one milestone required. - Milestone amounts must sum to total budget. - Contract saved with `status: "draft"`. - Manager redirected to contract detail screen. | Sprint 2 |
| US-202 | As a **manager**, I want to fund a contract via M-Pesa so that the payment is secured in escrow before work begins. | **Must** | - Payment screen shows contract amount and fees. - M-Pesa STK push initiated on confirmation. - Contract status updated to `"funded"` on payment success. - Escrow record created. - Transaction recorded in history. | Sprint 2 |
| US-203 | As a **manager**, I want to assign a funded contract to a specific hustler so that the work can begin. | **Must** | - Search or enter hustler phone/ID. - Hustler must be KYC approved. - Notification sent to hustler. - Contract status updated to `"in_progress"`. | Sprint 2 |
| US-204 | As a **hustler**, I want to view contracts assigned to me so that I know what work is expected and the payment terms. | **Must** | - Dashboard shows all active contracts with statuses. - Contract detail shows all milestones, amounts, and due dates. | Sprint 2 |
| US-205 | As a **hustler**, I want to submit proof of work for a milestone with a description and photos so that the manager can verify completion. | **Must** | - Submission form accepts description text and up to 3 images. - Submission creates record with `status: "submitted"`. - Manager receives notification. - Hustler can view submission history. | Sprint 2 |
| US-206 | As a **manager**, I want to review a milestone submission and approve it so that payment is automatically released to the hustler. | **Must** | - Manager sees submission description and images. - Approve button triggers payment release. - Hustler wallet credited with milestone amount. - Milestone status updated to `"approved"`. - Reward points issued to hustler. | Sprint 2 |
| US-207 | As a **manager**, I want to reject a milestone submission with a reason so that the hustler knows what needs to be corrected. | **Must** | - Rejection requires mandatory reason text. - Milestone returns to `"pending"` for resubmission. - Hustler receives rejection notification with reason. | Sprint 2 |
| US-208 | As a **manager**, I want to view the escrow balance for each of my contracts so that I can track funded amounts. | **Must** | - Contract detail screen shows escrow balance. - Balance decrements after each milestone approval. | Sprint 2 |
| US-209 | As a **user**, I want to receive push notifications for contract events (assignment, submission, approval, rejection) so that I stay informed in real time. | **Should** | - Notifications sent within 60 seconds of trigger events. - Notification content is clear and actionable. - Tapping notification navigates to relevant screen. | Sprint 2 |
| US-210 | As a **manager**, I want to view all contracts I have created with their current status so that I can manage multiple jobs simultaneously. | **Should** | - Manager dashboard lists contracts by status. - Status badges clearly colour-coded. - Filter by status supported. | Sprint 2 |

---

## Sprint 3 — Wallet, Reputation & Discovery (Weeks 10–13)

Focus: Digital wallet functionality, reputation scoring, and worker search.

---

| Story ID | User Story | Priority | Acceptance Criteria | Sprint |
|---|---|---|---|---|
| US-301 | As a **hustler**, I want to view my wallet balance so that I know how much I have earned. | **Must** | - Wallet screen shows current balance in KES. - Balance updates within 30 seconds of payment receipt. | Sprint 3 |
| US-302 | As a **hustler**, I want to withdraw funds from my wallet to my M-Pesa so that I can access my earnings. | **Must** | - Withdrawal form accepts amount and M-Pesa number. - Minimum withdrawal of KES 50 enforced. - Withdrawal fee displayed before confirmation. - M-Pesa payment sent via IntaSend. - Transaction recorded. - Balance updated. | Sprint 3 |
| US-303 | As a **user**, I want to view my full transaction history so that I can track all my earnings and payments. | **Must** | - Transaction history lists all credits and debits. - Each entry shows date, type, amount, and reference. - Filterable by transaction type. - Paginated (20 per page). | Sprint 3 |
| US-304 | As a **manager**, I want to deposit funds into my platform wallet so that I can use them to fund contracts without repeated M-Pesa transactions. | **Should** | - Deposit form initiates M-Pesa STK push. - Wallet balance credited on payment confirmation. - Transaction recorded. | Sprint 3 |
| US-305 | As a **manager**, I want to rate a hustler after contract completion so that other managers can benefit from my experience. | **Must** | - Rating form available after contract closure. - 1–5 star rating with optional text review. - Rating cannot be edited after submission. - Average rating displayed on hustler profile. | Sprint 3 |
| US-306 | As a **hustler**, I want to view my reputation score and the ratings I have received so that I can understand how managers perceive my work. | **Must** | - Reputation score displayed prominently on profile. - List of received ratings with manager name and review text. - Score breakdown visible (completion rate, average rating). | Sprint 3 |
| US-307 | As a **manager**, I want to search for hustlers by skill, location, and minimum reputation score so that I can find the right worker for my job. | **Must** | - Search form with skill, location, and reputation filters. - Results list shows hustler name, score, job count. - Tap to view full profile. - Paginated results. | Sprint 3 |
| US-308 | As a **manager**, I want to view a hustler's public profile before assigning a contract so that I can make an informed hiring decision. | **Must** | - Public profile shows: name, reputation score, skills, completed jobs, recent reviews, badge count. - "Assign Contract" button on profile. | Sprint 3 |
| US-309 | As a **hustler**, I want to set my availability status so that managers know I am open for new work. | **Should** | - Toggle on profile to set `available: true/false`. - Status visible in search results. | Sprint 3 |
| US-310 | As a **hustler**, I want to set my skills and service categories so that I appear in relevant manager searches. | **Should** | - Skills multi-select from predefined category list. - Free-text custom skill entry. - Up to 10 skills per user. | Sprint 3 |

---

## Sprint 4 — Gamification, Disputes & Audit (Weeks 14–17)

Focus: Rewards system, dispute management, and audit logging.

---

| Story ID | User Story | Priority | Acceptance Criteria | Sprint |
|---|---|---|---|---|
| US-401 | As a **hustler**, I want to see my reward points balance so that I can track my gamification progress. | **Should** | - Points balance displayed on dashboard and wallet screen. - Points total updated within 60 seconds of milestone approval. | Sprint 4 |
| US-402 | As a **hustler**, I want to earn reward points for completing milestones so that I am incentivised to deliver quality work. | **Should** | - 1 point per KES 10 earned, issued automatically. - Points transaction recorded. - Notification sent for point accrual. | Sprint 4 |
| US-403 | As a **hustler**, I want to earn achievement badges for reaching platform milestones so that I can showcase my accomplishments. | **Could** | - "First Job" badge on first contract completion. - "10 Jobs" badge after 10 completed contracts. - "5-Star Worker" badge for maintaining ≥4.5 average rating. - Badges visible on public profile. | Sprint 4 |
| US-404 | As a **user**, I want to view a regional leaderboard of top-rated hustlers so that I can see how I rank among my peers. | **Could** | - Top 50 hustlers by reputation score. - Filterable by region. - Updated weekly. - User's own rank shown if not in top 50. | Sprint 4 |
| US-405 | As a **hustler**, I want to open a dispute if a manager refuses to approve legitimate work so that I have recourse against unfair treatment. | **Must** | - Dispute form available from contract screen. - Requires description and dispute type. - Optional evidence file uploads (up to 5). - Dispute creates record with `status: "open"`. - Escrow frozen on dispute. - Both parties notified. | Sprint 4 |
| US-406 | As a **manager**, I want to open a dispute if a hustler submits inadequate work that they refuse to correct so that I can recover escrowed funds. | **Must** | - Same dispute form available to managers. - Requires description and evidence. | Sprint 4 |
| US-407 | As a **platform administrator**, I want to review and resolve disputes by examining evidence and making a fair decision so that conflicts are resolved professionally. | **Must** | - Admin dispute dashboard with all open disputes. - Evidence files viewable. - Resolution options: favour hustler, favour manager, split. - Mandatory resolution notes. - Funds disbursed on resolution. - Both parties notified. | Sprint 4 |
| US-408 | As a **platform administrator**, I want to view comprehensive audit logs so that I can investigate suspicious activity or resolve user queries. | **Should** | - Audit log queryable by user, date range, and event type. - All financial transactions, status changes, and login events logged. - Log entries include timestamp, user ID, action, and metadata. - Exportable as CSV. | Sprint 4 |
| US-409 | As a **user**, I want to view my own activity log so that I can review my actions on the platform. | **Could** | - Personal activity log on profile screen. - Shows contract events, payments, and login history. - Paginated. | Sprint 4 |
| US-410 | As a **manager**, I want to cancel a draft contract (before funding) so that I can remove job postings I no longer need. | **Should** | - Cancel option on draft contract. - Confirmation prompt before cancellation. - Cancellation logged. | Sprint 4 |

---

## Backlog Summary

| Sprint | Stories | Priority Focus |
|---|---|---|
| Sprint 1 | US-101 to US-108 | User registration, KYC, authentication |
| Sprint 2 | US-201 to US-210 | Contract creation, escrow, milestones |
| Sprint 3 | US-301 to US-310 | Wallet, reputation, worker discovery |
| Sprint 4 | US-401 to US-410 | Rewards, disputes, audit logs |
| **Total** | **38 Stories** | |

| Priority | Count |
|---|---|
| Must Have | 23 |
| Should Have | 10 |
| Could Have | 5 |
| Won't Have | 0 (deferred to v2 in roadmap) |

---

*End of Part 3 — Agile Product Backlog*
