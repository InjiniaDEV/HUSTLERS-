# PART 5 — DATABASE DESIGN

**Project:** HUSTLERS — Informal Job Agreement & Payment Tracker Platform  
**Database:** MongoDB (Document Store)  
**Version:** 1.0  
**Date:** March 2026  

---

## Overview

The HUSTLERS platform uses **MongoDB**, a document-oriented NoSQL database, hosted on MongoDB Atlas. The document model is well-suited to this platform because:

1. Contract and milestone data has a natural parent-child relationship best represented as embedded or referenced documents.
2. User profiles evolve over time (skills, badges, reputation), benefiting from schema flexibility.
3. Audit log entries are append-only and high-volume, fitting MongoDB's write performance profile.

All collections use MongoDB's native `ObjectId` as the primary key (`_id`). References between collections use stored `ObjectId` foreign keys. The design follows a **reference-based approach** for most relationships to optimise query flexibility, with selective embedding for tightly-coupled data.

---

## Collection Schemas

---

### 1. `users` Collection

Stores all platform users — Hustlers, Managers, and Administrators.

```javascript
{
  _id: ObjectId,                    // Auto-generated primary key
  fullName: String,                 // User's full legal name (required)
  phoneNumber: String,              // E.164 format, unique index (required)
  passwordHash: String,             // bcrypt hash, cost factor >= 10 (never returned in API)
  role: {
    type: String,
    enum: ["hustler", "manager", "admin"]
  },
  status: {
    type: String,
    enum: ["unverified", "verified", "kyc_pending", "kyc_approved", "kyc_rejected", "suspended"],
    default: "unverified"
  },
  
  // Profile fields
  skills: [String],                 // e.g., ["plumbing", "delivery", "painting"]
  location: String,                 // City or area, e.g., "Nairobi, Westlands"
  available: Boolean,               // Hustler availability for new jobs
  bio: String,                      // Short description (max 300 chars)
  profileImageUrl: String,          // URL of profile photo
  
  // Reputation and rewards (hustler-specific)
  reputationScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completionRate: Number,           // Percentage of contracts completed
  averageRating: Number,            // Average of all received ratings (1-5)
  totalJobsCompleted: Number,       // Count of closed contracts
  rewardPoints: {
    type: Number,
    default: 0
  },
  badges: [String],                 // e.g., ["first_job", "ten_jobs", "five_star"]
  
  // Security
  refreshTokenHash: String,         // Hash of current refresh token
  failedLoginAttempts: Number,      // Incremented on failed login
  lockedUntil: Date,                // Account lock expiry
  lastLoginAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ phoneNumber: 1 }` — unique index for login and duplicate detection.
- `{ role: 1, status: 1 }` — compound index for admin queries.
- `{ role: 1, reputationScore: -1, available: 1 }` — compound index for worker discovery search.
- `{ skills: 1 }` — index on array field for skill-based search.
- `{ location: 1 }` — index for location-based search.

**Relationships:**
- Referenced by `contracts.managerId`, `contracts.hustlerId`, `wallets.userId`, `transactions.userId`, `disputes.raisedBy`, `ratings.ratedBy`, `ratings.ratedUser`.

---

### 2. `contracts` Collection

Stores all job contracts created by managers.

```javascript
{
  _id: ObjectId,                    // Auto-generated primary key
  managerId: ObjectId,              // Ref: users._id (the manager)
  hustlerId: ObjectId,              // Ref: users._id (the assigned hustler); null until assigned
  
  title: String,                    // Contract title (max 100 chars, required)
  description: String,              // Detailed work description (max 1000 chars)
  totalBudget: Number,              // Total contract value in KES
  escrowBalance: Number,            // Current escrow balance (decrements per milestone)
  
  status: {
    type: String,
    enum: ["draft", "funded", "in_progress", "disputed", "completed", "closed", "cancelled"],
    default: "draft"
  },
  
  startDate: Date,
  endDate: Date,
  
  // Milestones stored as array of ObjectId references
  milestoneIds: [ObjectId],         // Refs: milestones._id
  
  // Metadata
  disputeId: ObjectId,              // Ref: disputes._id (if active dispute)
  cancellationReason: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ managerId: 1, status: 1 }` — for manager's contract list.
- `{ hustlerId: 1, status: 1 }` — for hustler's active jobs.
- `{ status: 1, createdAt: -1 }` — for admin overview.

**Note:** Milestones are stored in a separate collection (rather than embedded) to support individual milestone-level queries and updates without loading the full contract document.

---

### 3. `milestones` Collection

Stores individual milestone records, each linked to a parent contract.

```javascript
{
  _id: ObjectId,                    // Auto-generated primary key
  contractId: ObjectId,             // Ref: contracts._id (required)
  
  title: String,                    // Milestone title (max 100 chars)
  description: String,              // What work constitutes completion (max 500 chars)
  paymentAmount: Number,            // KES amount to release on approval
  dueDate: Date,                    // Expected completion date
  
  status: {
    type: String,
    enum: ["pending", "submitted", "approved", "rejected"],
    default: "pending"
  },
  
  // Submission fields (populated when hustler submits)
  submissionDescription: String,    // Hustler's description of completed work
  submissionImages: [String],       // Array of image URLs (max 3)
  submittedAt: Date,
  
  // Approval/rejection fields
  approvedAt: Date,
  rejectionReason: String,          // Required if rejected
  rejectedAt: Date,
  
  // Feedback from manager on approval
  approvalComment: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ contractId: 1 }` — for fetching all milestones of a contract.
- `{ contractId: 1, status: 1 }` — for checking contract completion.

---

### 4. `wallets` Collection

Stores the platform wallet balance for each user. One wallet per user.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                 // Ref: users._id; unique index
  
  balance: {
    type: Number,
    default: 0,
    min: 0                         // Balance cannot be negative
  },
  
  currency: {
    type: String,
    default: "KES"
  },
  
  // Running totals for analytics
  totalEarned: Number,              // Total credits (hustler)
  totalSpent: Number,               // Total debits (manager)
  totalWithdrawn: Number,
  
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1 }` — unique index; one wallet per user.

**Note:** Wallet balance updates use MongoDB transactions (`session.withTransaction`) to ensure atomicity when debiting escrow and crediting wallet simultaneously.

---

### 5. `transactions` Collection

Append-only record of all financial movements on the platform. Transactions are never updated or deleted.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                 // Ref: users._id (owner of this transaction record)
  
  type: {
    type: String,
    enum: [
      "deposit",         // Manager deposits into wallet
      "escrow_in",       // Funds moved from wallet/M-Pesa to escrow
      "escrow_out",      // Funds released from escrow to hustler wallet
      "withdrawal",      // Hustler withdraws to M-Pesa
      "reward_credit",   // Reward points converted (future feature)
      "dispute_refund",  // Refund from dispute resolution
      "fee"              // Platform transaction fee
    ]
  },
  
  amount: Number,                   // KES amount (always positive)
  
  // References (nullable based on transaction type)
  contractId: ObjectId,             // Ref: contracts._id
  milestoneId: ObjectId,            // Ref: milestones._id
  
  // Payment gateway details
  gatewayReference: String,         // IntaSend transaction reference
  gatewayStatus: {
    type: String,
    enum: ["pending", "processing", "completed", "failed", "reversed"]
  },
  
  // Metadata
  description: String,              // Human-readable description
  metadata: Object,                 // Gateway-specific response data
  
  createdAt: Date                   // Immutable; transactions are append-only
}
```

**Indexes:**
- `{ userId: 1, createdAt: -1 }` — for user transaction history (time-sorted).
- `{ contractId: 1, type: 1 }` — for contract-level financial summaries.
- `{ gatewayReference: 1 }` — unique sparse index for deduplication of gateway webhooks.
- `{ createdAt: -1 }` — for admin financial reporting.

---

### 6. `kyc` Collection

Stores KYC document submissions and review records.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                 // Ref: users._id; unique sparse index
  
  documentType: {
    type: String,
    enum: ["national_id", "passport"]
  },
  
  frontImageUrl: String,            // Secure URL in encrypted cloud storage
  backImageUrl: String,             // National ID back (null for passport)
  selfieUrl: String,
  
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  
  rejectionReason: String,          // Admin-provided reason for rejection
  
  reviewedBy: ObjectId,             // Ref: users._id (admin who reviewed)
  submittedAt: Date,
  reviewedAt: Date
}
```

**Indexes:**
- `{ userId: 1 }` — unique sparse index; one KYC record per user.
- `{ status: 1, submittedAt: 1 }` — for admin review queue.

---

### 7. `disputes` Collection

Stores dispute records raised against contracts.

```javascript
{
  _id: ObjectId,
  contractId: ObjectId,             // Ref: contracts._id
  raisedBy: ObjectId,               // Ref: users._id (the disputing party)
  
  disputeType: {
    type: String,
    enum: ["non_payment", "poor_quality", "contract_breach", "other"]
  },
  
  description: String,              // max 1000 chars
  evidenceFiles: [String],          // Array of file URLs (max 5)
  
  status: {
    type: String,
    enum: ["open", "under_review", "resolved", "dismissed"],
    default: "open"
  },
  
  // Resolution fields (populated by admin)
  resolution: {
    type: String,
    enum: ["favour_hustler", "favour_manager", "split", null]
  },
  resolutionNotes: String,
  splitPercentage: Number,          // 0-100; hustler receives this % of frozen amount
  
  resolvedBy: ObjectId,             // Ref: users._id (admin resolver)
  createdAt: Date,
  resolvedAt: Date
}
```

**Indexes:**
- `{ contractId: 1, status: 1 }` — for contract-level dispute checking.
- `{ status: 1, createdAt: 1 }` — for admin dispute queue.
- `{ raisedBy: 1 }` — for user's dispute history.

---

### 8. `ratings` Collection

Stores post-contract ratings and reviews.

```javascript
{
  _id: ObjectId,
  contractId: ObjectId,             // Ref: contracts._id; ensures one rating per contract per rater
  ratedBy: ObjectId,                // Ref: users._id (the rater)
  ratedUser: ObjectId,              // Ref: users._id (the ratee)
  
  stars: {
    type: Number,
    min: 1,
    max: 5
  },
  
  review: String,                   // Optional text review (max 300 chars)
  
  createdAt: Date
}
```

**Indexes:**
- `{ contractId: 1, ratedBy: 1 }` — unique compound index; prevents duplicate ratings per contract.
- `{ ratedUser: 1, createdAt: -1 }` — for user's received ratings feed.

---

### 9. `rewards` Collection

Stores individual reward events (points earned, badges awarded).

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                 // Ref: users._id
  
  type: {
    type: String,
    enum: ["points", "badge"]
  },
  
  points: Number,                   // For type "points": amount earned
  badgeName: String,                // For type "badge": e.g., "first_job", "five_star"
  
  contractId: ObjectId,             // Ref: contracts._id (if earned via contract)
  description: String,              // Human-readable description
  
  awardedAt: Date
}
```

**Indexes:**
- `{ userId: 1, awardedAt: -1 }` — for user's rewards history.
- `{ userId: 1, type: 1, badgeName: 1 }` — for badge deduplication checks.

---

### 10. `auditlogs` Collection

Immutable, append-only record of all system events for security and compliance.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                 // Ref: users._id (actor); null for system events
  
  eventType: {
    type: String,
    enum: [
      "user_registered", "user_login", "user_login_failed", "password_reset",
      "kyc_submitted", "kyc_approved", "kyc_rejected",
      "contract_created", "contract_funded", "contract_assigned",
      "contract_completed", "contract_closed", "contract_cancelled",
      "milestone_submitted", "milestone_approved", "milestone_rejected",
      "payment_initiated", "payment_completed", "payment_failed",
      "wallet_credited", "wallet_debited",
      "dispute_opened", "dispute_resolved",
      "admin_action"
    ]
  },
  
  entityType: String,               // e.g., "contract", "milestone", "user"
  entityId: ObjectId,               // ID of the affected entity
  
  metadata: Object,                 // Event-specific data snapshot
  ipAddress: String,                // Client IP (for security events)
  userAgent: String,
  
  timestamp: Date                   // Immutable creation timestamp
}
```

**Indexes:**
- `{ userId: 1, timestamp: -1 }` — for user activity timeline.
- `{ eventType: 1, timestamp: -1 }` — for event-type filtering.
- `{ entityType: 1, entityId: 1 }` — for entity-level audit trail.
- TTL index: `{ timestamp: 1 }` with `expireAfterSeconds: 63072000` — auto-delete logs older than 2 years.

---

## Relationships Summary

```
users (1) ──────── (N) contracts   [via managerId and hustlerId]
contracts (1) ───── (N) milestones [via contractId]
users (1) ────────── (1) wallets    [via userId]
users (1) ──────── (N) transactions
contracts (1) ──── (N) transactions
contracts (1) ───── (N) disputes
users (1) ────────── (1) kyc        [via userId]
contracts (1) ──── (N) ratings
users (1) ──────── (N) ratings     [as ratedBy and ratedUser]
users (1) ──────── (N) rewards
users (1) ──────── (N) auditlogs
```

---

## MongoDB Transaction Usage

The following operations require multi-document transactions using MongoDB sessions to ensure atomicity:

1. **Escrow Funding:** Debit user wallet (or record M-Pesa payment) AND update contract escrow balance AND insert transaction record.
2. **Milestone Approval Payment:** Decrement contract.escrowBalance AND increment hustler wallet.balance AND insert transaction record AND insert reward record — all in one atomic operation.
3. **Wallet Withdrawal:** Decrement wallet.balance AND initiate IntaSend API call — balance only decremented after IntaSend confirmation.
4. **Dispute Resolution:** Disburse frozen escrow according to resolution AND insert transaction records for both parties AND update dispute status.

---

*End of Part 5 — Database Design*
