# PART 8 — CONCEPTUAL DIAGRAM & DATA FLOW DIAGRAMS

**Project:** HUSTLERS — Informal Job Agreement & Payment Tracker Platform  
**Version:** 1.0  
**Date:** March 2026  
**Diagram Format:** Mermaid  

---

## 8.1 Conceptual Diagram

### Description

The Conceptual Diagram presents the core business concepts of the HUSTLERS platform and the meaningful relationships between them, independent of any technical implementation. It captures the domain vocabulary shared by all stakeholders:

| Concept | Meaning |
|---|---|
| **User** | Any person registered on the platform — can act as a Hustler (worker), a Manager (job poster), or an Administrator |
| **KYC Record** | Identity verification documents submitted by a User to unlock payment features |
| **Contract** | A digital job agreement created by a Manager that specifies the work, budget, and timeline |
| **Milestone** | A discrete, verifiable unit of work within a Contract, each carrying its own payment amount |
| **Escrow** | Funds held in trust by the platform after a Manager pays and before a Hustler earns |
| **Wallet** | A platform-held digital balance belonging to a User, funded by escrow releases |
| **Transaction** | A financial event (escrow top-up, milestone payout, deposit, or withdrawal) |
| **Rating** | A post-contract evaluation one party gives another, feeding into Reputation |
| **Reputation Score** | A computed score per User derived from their ratings and milestone track record |
| **Reward** | Points and badges awarded to Hustlers for completing milestones; drive the Leaderboard |
| **Dispute** | A formal objection raised by either party against a Contract, pausing escrow release |
| **Audit Log** | An immutable record of every significant system event for accountability and compliance |

```mermaid
graph TD
    User["👤 User\n(Hustler / Manager / Admin)"]
    KYC["🪪 KYC Record"]
    Contract["📄 Contract"]
    Milestone["🏁 Milestone"]
    Escrow["🔒 Escrow"]
    Wallet["💳 Wallet"]
    Transaction["💸 Transaction"]
    Rating["⭐ Rating"]
    Reputation["📊 Reputation Score"]
    Reward["🏆 Reward\n(Points & Badges)"]
    Dispute["⚖️ Dispute"]
    AuditLog["📋 Audit Log"]
    Payment["📲 M-Pesa Payment\n(via IntaSend)"]

    %% User relationships
    User -->|"submits"| KYC
    User -->|"Manager creates"| Contract
    User -->|"Hustler assigned to"| Contract
    User -->|"owns"| Wallet
    User -->|"gives / receives"| Rating
    User -->|"earns"| Reward
    User -->|"has"| Reputation
    User -->|"raises"| Dispute
    User -->|"generates"| AuditLog

    %% Contract relationships
    Contract -->|"composed of"| Milestone
    Contract -->|"backed by"| Escrow
    Contract -->|"subject of"| Dispute
    Contract -->|"reviewed via"| Rating

    %% Financial flow
    Milestone -->|"approval triggers"| Escrow
    Escrow -->|"releases funds to"| Wallet
    Wallet -->|"withdrawal creates"| Payment
    Payment -->|"deposit creates"| Escrow
    Wallet -->|"records movement as"| Transaction
    Escrow -->|"records movement as"| Transaction

    %% Rewards & reputation
    Milestone -->|"completion awards"| Reward
    Rating -->|"updates"| Reputation
```

---

## 8.2 Data Flow Diagram — Level 0 (Context Diagram)

### Description

The Level-0 DFD (Context Diagram) treats the entire HUSTLERS platform as a **single process** and shows the external entities that interact with it, together with the high-level data flows crossing the system boundary.

| External Entity | Role |
|---|---|
| **Hustler** | Receives contracts, submits milestone work, earns and withdraws money |
| **Manager** | Creates contracts, funds escrow, reviews milestone submissions |
| **Administrator** | Reviews KYC documents, resolves disputes, monitors audit logs |
| **IntaSend / M-Pesa** | Processes inbound payments (escrow top-up) and outbound disbursements (withdrawals) |
| **SMS Gateway** | Delivers OTP codes and push notifications |

```mermaid
graph TD
    Hustler(["👷 Hustler"])
    Manager(["💼 Manager"])
    Admin(["🔐 Administrator"])
    IntaSend(["🏦 IntaSend /\nM-Pesa"])
    SMS(["📨 SMS Gateway"])

    HUSTLERS[["⚙️ HUSTLERS\nPlatform"]]

    %% Hustler flows
    Hustler -->|"Registration, KYC docs,\nmilestone submissions,\nwithdrawal requests"| HUSTLERS
    HUSTLERS -->|"Contract assignments,\npayment credits,\nreward notifications"| Hustler

    %% Manager flows
    Manager -->|"Registration, KYC docs,\ncontract details,\nmilestone approvals/rejections,\nescrow funding requests"| HUSTLERS
    HUSTLERS -->|"Escrow confirmations,\nmilestone alerts,\ncontract status updates"| Manager

    %% Admin flows
    Admin -->|"KYC decisions,\ndispute resolutions"| HUSTLERS
    HUSTLERS -->|"KYC queue,\ndispute cases,\naudit log reports"| Admin

    %% Payment gateway flows
    HUSTLERS -->|"STK push requests,\nB2C payout instructions"| IntaSend
    IntaSend -->|"Payment confirmations\n(webhooks)"| HUSTLERS

    %% SMS flows
    HUSTLERS -->|"OTP codes,\nnotification messages"| SMS
    SMS -->|"Delivery receipts"| HUSTLERS
```

---

## 8.3 Data Flow Diagram — Level 1 (Major Processes)

### Description

The Level-1 DFD decomposes the HUSTLERS platform into its **six major process groups** and shows how data flows between them, the data stores they read from or write to, and the external entities they interface with. Each numbered process corresponds to a core system module.

| Process | Description |
|---|---|
| **P1 — User Registration & KYC** | Handles sign-up, login, identity verification, and admin KYC review |
| **P2 — Contract & Milestone Management** | Manages contract creation, hustler assignment, milestone lifecycle, and work submission |
| **P3 — Wallet, Escrow & Payments** | Orchestrates escrow funding, milestone payout, deposits, and M-Pesa withdrawals |
| **P4 — Reputation & Worker Discovery** | Calculates reputation scores, manages ratings, and powers worker search |
| **P5 — Rewards & Gamification** | Awards points and badges when milestones are completed; maintains leaderboard |
| **P6 — Dispute Resolution & Audit Logging** | Handles dispute creation, admin adjudication, and writes all events to the audit log |

```mermaid
graph TD
    %% External entities
    Hustler(["👷 Hustler"])
    Manager(["💼 Manager"])
    Admin(["🔐 Administrator"])
    IntaSend(["🏦 IntaSend /\nM-Pesa"])
    SMS(["📨 SMS Gateway"])

    %% Data stores
    DS_Users[("DS1: Users")]
    DS_Contracts[("DS2: Contracts &\nMilestones")]
    DS_Wallet[("DS3: Wallets &\nTransactions")]
    DS_KYC[("DS4: KYC Records")]
    DS_Reputation[("DS5: Ratings &\nReputation")]
    DS_Rewards[("DS6: Rewards")]
    DS_Disputes[("DS7: Disputes")]
    DS_Audit[("DS8: Audit Logs")]

    %% Processes
    P1["P1\nUser Registration\n& KYC"]
    P2["P2\nContract &\nMilestone Management"]
    P3["P3\nWallet, Escrow\n& Payments"]
    P4["P4\nReputation &\nWorker Discovery"]
    P5["P5\nRewards &\nGamification"]
    P6["P6\nDispute Resolution\n& Audit Logging"]

    %% P1 flows
    Hustler -->|"sign-up / login / KYC docs"| P1
    Manager -->|"sign-up / login / KYC docs"| P1
    P1 -->|"OTP request"| SMS
    P1 -->|"verified user record"| DS_Users
    P1 -->|"KYC submission"| DS_KYC
    Admin -->|"KYC approve / reject decision"| P1
    P1 -->|"KYC status update"| DS_KYC
    P1 -->|"account confirmed"| Hustler
    P1 -->|"account confirmed"| Manager

    %% P2 flows
    Manager -->|"contract details,\nmilestone definitions"| P2
    Hustler -->|"milestone proof of work"| P2
    Manager -->|"approve / reject milestone"| P2
    P2 -->|"contract & milestone records"| DS_Contracts
    P2 -->|"user lookup (KYC check)"| DS_Users
    P2 -->|"fund escrow trigger"| P3
    P2 -->|"milestone approved event"| P3
    P2 -->|"milestone approved event"| P5
    P2 -->|"assignment notification"| Hustler
    P2 -->|"submission alert"| Manager

    %% P3 flows
    Manager -->|"escrow funding request\n(M-Pesa number)"| P3
    Hustler -->|"withdrawal request\n(M-Pesa number)"| P3
    P3 -->|"STK push / B2C payout"| IntaSend
    IntaSend -->|"payment / payout webhook"| P3
    P3 -->|"wallet & transaction records"| DS_Wallet
    P3 -->|"contract escrow balance update"| DS_Contracts
    P3 -->|"credit confirmation"| Hustler
    P3 -->|"escrow confirmed"| Manager

    %% P4 flows
    Manager -->|"worker search query\n(skill / location)"| P4
    Manager -->|"post-contract rating"| P4
    Hustler -->|"post-contract rating"| P4
    P4 -->|"rating record"| DS_Reputation
    P4 -->|"reputation score update"| DS_Users
    P4 -->|"search results"| Manager

    %% P5 flows
    P5 -->|"points & badge records"| DS_Rewards
    P5 -->|"reward notification"| Hustler

    %% P6 flows
    Hustler -->|"dispute submission"| P6
    Manager -->|"dispute submission"| P6
    Admin -->|"dispute resolution decision"| P6
    P6 -->|"dispute record"| DS_Disputes
    P6 -->|"contract status update\n(freeze / unfreeze escrow)"| DS_Contracts
    P6 -->|"all system events"| DS_Audit
    P6 -->|"resolution outcome"| Hustler
    P6 -->|"resolution outcome"| Manager
```

---

*End of Part 8 — Conceptual Diagram & Data Flow Diagrams*
