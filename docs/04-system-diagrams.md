# PART 4 — SYSTEM DIAGRAMS

**Project:** HUSTLERS — Informal Job Agreement & Payment Tracker Platform  
**Version:** 1.0  
**Date:** March 2026  
**Diagram Format:** Mermaid  

---

## 4.1 System Architecture Diagram

### Description

The HUSTLERS system follows a three-tier mobile application architecture. The **Presentation Layer** is a React Native mobile app consumed by Hustlers, Managers, and Administrators. The **Application Layer** is a Node.js/Express.js REST API that orchestrates all business logic, authentication, payment processing, and data access. The **Data Layer** is a MongoDB Atlas instance. External integrations include the IntaSend Payment Gateway (for M-Pesa transactions and escrow management) and an SMS Gateway (for OTP delivery and notifications).

```mermaid
graph TB
    subgraph Client ["📱 Client Layer"]
        App["React Native\nMobile App"]
    end

    subgraph API ["⚙️ Application Layer (Node.js + Express.js)"]
        Auth["Auth Module\n(JWT)"]
        KYC["KYC Module"]
        Contracts["Contract Module"]
        Milestones["Milestone Module"]
        Wallet["Wallet & Escrow\nModule"]
        Reputation["Reputation\nModule"]
        Disputes["Dispute Module"]
        Rewards["Rewards Module"]
        Audit["Audit Log\nModule"]
    end

    subgraph Data ["🗄️ Data Layer"]
        MongoDB["MongoDB Atlas\n(Database)"]
        FileStore["Cloud File Storage\n(KYC Docs, Evidence)"]
    end

    subgraph External ["🌐 External Services"]
        IntaSend["IntaSend\nPayment Gateway"]
        MPesa["M-Pesa\n(Safaricom)"]
        SMS["SMS Gateway\n(OTP / Notifications)"]
    end

    App -->|HTTPS REST API| Auth
    App -->|HTTPS REST API| KYC
    App -->|HTTPS REST API| Contracts
    App -->|HTTPS REST API| Milestones
    App -->|HTTPS REST API| Wallet
    App -->|HTTPS REST API| Reputation
    App -->|HTTPS REST API| Disputes
    App -->|HTTPS REST API| Rewards

    Auth --> MongoDB
    KYC --> MongoDB
    KYC --> FileStore
    Contracts --> MongoDB
    Milestones --> MongoDB
    Milestones --> FileStore
    Wallet --> MongoDB
    Reputation --> MongoDB
    Disputes --> MongoDB
    Disputes --> FileStore
    Rewards --> MongoDB
    Audit --> MongoDB

    Wallet -->|Payment API| IntaSend
    IntaSend -->|STK Push| MPesa
    Auth -->|OTP| SMS
    KYC -->|Notification| SMS
```

---

## 4.2 Use Case Diagram

### Description

The Use Case Diagram identifies the three primary actors (Hustler, Manager, Administrator) and their interactions with the HUSTLERS platform. The diagram shows all major use cases and the relationships between actors and system functionality. The Administrator inherits access to all user-facing features for support purposes, shown via `<<extend>>` relationships where admin functionality extends base user actions.

```mermaid
graph LR
    Hustler(("👷 Hustler"))
    Manager(("💼 Manager"))
    Admin(("🔐 Admin"))

    subgraph HUSTLERS_Platform ["HUSTLERS Platform"]
        Register["Register Account"]
        Login["Login"]
        SubmitKYC["Submit KYC Documents"]
        ViewProfile["View Profile"]
        EditProfile["Edit Profile"]

        CreateContract["Create Contract"]
        FundContract["Fund Contract via\nM-Pesa Escrow"]
        AssignContract["Assign Contract\nto Hustler"]
        ViewContracts["View Contracts"]

        SubmitMilestone["Submit Milestone\nProof of Work"]
        ApproveMilestone["Approve Milestone"]
        RejectMilestone["Reject Milestone"]

        ViewWallet["View Wallet Balance"]
        Withdraw["Withdraw Funds\nto M-Pesa"]
        Deposit["Deposit Funds"]

        SearchWorkers["Search & Discover\nWorkers"]
        ViewWorkerProfile["View Worker Profile"]
        RateWorker["Rate Worker"]

        EarnPoints["Earn Reward Points"]
        ViewBadges["View Badges"]
        ViewLeaderboard["View Leaderboard"]

        OpenDispute["Open Dispute"]
        ReviewDispute["Review & Resolve\nDispute"]
        ReviewKYC["Review KYC\nSubmissions"]
        ViewAuditLog["View Audit Logs"]
    end

    Hustler --> Register
    Hustler --> Login
    Hustler --> SubmitKYC
    Hustler --> ViewProfile
    Hustler --> EditProfile
    Hustler --> ViewContracts
    Hustler --> SubmitMilestone
    Hustler --> ViewWallet
    Hustler --> Withdraw
    Hustler --> EarnPoints
    Hustler --> ViewBadges
    Hustler --> ViewLeaderboard
    Hustler --> OpenDispute

    Manager --> Register
    Manager --> Login
    Manager --> SubmitKYC
    Manager --> ViewProfile
    Manager --> CreateContract
    Manager --> FundContract
    Manager --> AssignContract
    Manager --> ViewContracts
    Manager --> ApproveMilestone
    Manager --> RejectMilestone
    Manager --> SearchWorkers
    Manager --> ViewWorkerProfile
    Manager --> RateWorker
    Manager --> Deposit
    Manager --> ViewWallet
    Manager --> OpenDispute

    Admin --> ReviewKYC
    Admin --> ReviewDispute
    Admin --> ViewAuditLog
    Admin --> ViewContracts
```

---

## 4.3 Entity Relationship Diagram

### Description

The ERD models the core data entities and their relationships. **Users** can be Hustlers or Managers. A Manager creates **Contracts**; each Contract has one or more **Milestones**. A Hustler is assigned to a Contract. **Wallets** are associated with users; **Transactions** record all financial movements. **Disputes** are raised against Contracts. **Rewards** track points and badges per user. **AuditLogs** record all system events.

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string fullName
        string phoneNumber UK
        string passwordHash
        string role
        string status
        float reputationScore
        int rewardPoints
        string[] skills
        string location
        boolean available
        datetime createdAt
    }

    CONTRACTS {
        ObjectId _id PK
        ObjectId managerId FK
        ObjectId hustlerId FK
        string title
        string description
        float totalBudget
        string status
        float escrowBalance
        date startDate
        date endDate
        datetime createdAt
    }

    MILESTONES {
        ObjectId _id PK
        ObjectId contractId FK
        string title
        string description
        float paymentAmount
        string status
        string submissionDescription
        string[] submissionImages
        string rejectionReason
        date dueDate
        datetime submittedAt
        datetime approvedAt
    }

    WALLETS {
        ObjectId _id PK
        ObjectId userId FK
        float balance
        string currency
        datetime updatedAt
    }

    TRANSACTIONS {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId contractId FK
        ObjectId milestoneId FK
        string type
        float amount
        string status
        string reference
        string gateway
        datetime createdAt
    }

    KYC {
        ObjectId _id PK
        ObjectId userId FK
        string documentType
        string frontImageUrl
        string backImageUrl
        string selfieUrl
        string status
        string rejectionReason
        datetime submittedAt
        datetime reviewedAt
        ObjectId reviewedBy FK
    }

    DISPUTES {
        ObjectId _id PK
        ObjectId contractId FK
        ObjectId raisedBy FK
        string disputeType
        string description
        string[] evidenceFiles
        string status
        string resolution
        string resolutionNotes
        int splitPercentage
        ObjectId resolvedBy FK
        datetime createdAt
        datetime resolvedAt
    }

    RATINGS {
        ObjectId _id PK
        ObjectId contractId FK
        ObjectId ratedBy FK
        ObjectId ratedUser FK
        int stars
        string review
        datetime createdAt
    }

    REWARDS {
        ObjectId _id PK
        ObjectId userId FK
        string type
        int points
        string badgeName
        ObjectId contractId FK
        datetime awardedAt
    }

    AUDITLOGS {
        ObjectId _id PK
        ObjectId userId FK
        string eventType
        string entityType
        ObjectId entityId
        object metadata
        string ipAddress
        datetime timestamp
    }

    USERS ||--o{ CONTRACTS : "creates (manager)"
    USERS ||--o{ CONTRACTS : "assigned to (hustler)"
    CONTRACTS ||--|{ MILESTONES : "contains"
    USERS ||--|| WALLETS : "owns"
    USERS ||--o{ TRANSACTIONS : "has"
    CONTRACTS ||--o{ TRANSACTIONS : "generates"
    USERS ||--o| KYC : "submits"
    CONTRACTS ||--o{ DISPUTES : "subject of"
    USERS ||--o{ DISPUTES : "raises"
    CONTRACTS ||--o{ RATINGS : "reviewed in"
    USERS ||--o{ RATINGS : "gives"
    USERS ||--o{ RATINGS : "receives"
    USERS ||--o{ REWARDS : "earns"
    USERS ||--o{ AUDITLOGS : "generates"
```

---

## 4.4 Job Payment Sequence Diagram

### Description

This sequence diagram illustrates the complete end-to-end workflow of a single milestone payment, from contract funding through to the hustler's wallet credit. It shows the interactions between the Manager, Hustler, the HUSTLERS API, the MongoDB database, and the IntaSend payment gateway.

```mermaid
sequenceDiagram
    actor Manager
    actor Hustler
    participant API as HUSTLERS API
    participant DB as MongoDB
    participant IntaSend as IntaSend Gateway
    participant MPesa as M-Pesa

    rect rgb(230, 245, 230)
        Note over Manager, MPesa: Step 1: Contract Funding
        Manager->>API: POST /contracts/create (title, milestones, budget)
        API->>DB: Insert Contract {status: "draft"}
        API-->>Manager: 201 Created {contractId}

        Manager->>API: POST /contracts/{id}/fund
        API->>IntaSend: Initiate STK Push (amount, phone)
        IntaSend->>MPesa: M-Pesa STK Push
        MPesa-->>Manager: PIN prompt on phone
        Manager->>MPesa: Enters M-Pesa PIN
        MPesa-->>IntaSend: Payment confirmed
        IntaSend-->>API: Webhook: payment_success
        API->>DB: Update Contract {status: "funded", escrowBalance: amount}
        API->>DB: Insert Transaction {type: "escrow_in"}
        API-->>Manager: 200 OK {status: "funded"}
    end

    rect rgb(230, 235, 245)
        Note over Manager, Hustler: Step 2: Contract Assignment
        Manager->>API: PATCH /contracts/{id}/assign {hustlerId}
        API->>DB: Update Contract {hustlerId, status: "in_progress"}
        API-->>Hustler: Push notification: "New contract assigned"
        API-->>Manager: 200 OK
    end

    rect rgb(245, 245, 230)
        Note over Hustler, Manager: Step 3: Milestone Submission
        Hustler->>API: POST /milestones/{id}/submit (description, images)
        API->>DB: Update Milestone {status: "submitted", submittedAt}
        API-->>Manager: Push notification: "Milestone submitted"
        API-->>Hustler: 200 OK
    end

    rect rgb(245, 230, 230)
        Note over Manager, Hustler: Step 4: Milestone Approval & Payment Release
        Manager->>API: POST /milestones/{id}/approve
        API->>DB: Check escrow balance >= milestone amount

        API->>DB: Update Milestone {status: "approved"}
        API->>DB: Decrement Contract.escrowBalance by milestone amount
        API->>DB: Increment Wallet.balance by milestone amount (hustler)
        API->>DB: Insert Transaction {type: "escrow_out"}
        API->>DB: Insert Reward {points: amount/10}

        API-->>Hustler: Push notification: "Payment released: KES {amount}"
        API-->>Manager: 200 OK {approved: true, walletCredited: amount}
    end

    rect rgb(240, 240, 240)
        Note over Hustler, MPesa: Step 5: Withdrawal
        Hustler->>API: POST /wallet/withdraw {amount, mpesaNumber}
        API->>DB: Check Wallet.balance >= amount
        API->>IntaSend: Initiate B2C payment (amount, phone)
        IntaSend->>MPesa: Send to M-Pesa
        MPesa-->>Hustler: M-Pesa received confirmation
        IntaSend-->>API: Webhook: withdrawal_success
        API->>DB: Decrement Wallet.balance
        API->>DB: Insert Transaction {type: "withdrawal"}
        API-->>Hustler: 200 OK {withdrawn: amount}
    end
```

---

## 4.5 Contract Lifecycle State Machine

### Description

The Contract State Machine defines all valid states a contract can occupy and the transitions between them. Invalid state transitions are rejected by the API with a `400 Bad Request` response. This ensures contractual integrity throughout the platform.

```mermaid
stateDiagram-v2
    [*] --> Draft : Manager creates contract

    Draft --> Funded : Manager funds escrow\n(IntaSend payment success)
    Draft --> Cancelled : Manager cancels draft

    Funded --> InProgress : Manager assigns hustler

    InProgress --> InProgress : Milestone submitted /\nMilestone rejected /\nMilestone approved\n(if more milestones remain)

    InProgress --> Disputed : Either party opens dispute

    Disputed --> InProgress : Admin resolves dispute\n(partial resolution)
    Disputed --> Completed : Admin resolves dispute\n(full resolution)

    InProgress --> Completed : All milestones approved

    Completed --> Closed : Rating period ends\nor both parties rate\n(automated after 7 days)

    Cancelled --> [*]
    Closed --> [*]

    Draft : **Draft**\nContract created,\nnot yet funded
    Funded : **Funded**\nEscrow loaded,\nawaitng assignment
    InProgress : **In Progress**\nWork underway,\nmilestones active
    Disputed : **Disputed**\nEscrow frozen,\nadmin reviewing
    Completed : **Completed**\nAll milestones done,\nrating window open
    Closed : **Closed**\nAll ratings done,\nreputation updated
    Cancelled : **Cancelled**\nNo funds charged
```

---

## 4.6 Job Creation Activity Diagram

### Description

This activity diagram models the complete workflow from when a manager initiates job creation to when a hustler begins working. It includes decision nodes for KYC verification status checks, escrow payment confirmation, and hustler assignment.

```mermaid
flowchart TD
    Start([🚀 Manager opens\nCreate Job screen]) --> CheckKYC{Manager KYC\napproved?}

    CheckKYC -->|No| PromptKYC[Prompt Manager\nto complete KYC]
    PromptKYC --> End1([End: KYC Required])

    CheckKYC -->|Yes| FillForm[Manager fills\ncontract form:\nTitle, Description,\nBudget, Dates]

    FillForm --> AddMilestones[Manager adds\nmilestones with\namounts and due dates]

    AddMilestones --> ValidateBudget{Milestone amounts\n= Total budget?}

    ValidateBudget -->|No| ShowBudgetError[Show error:\n'Milestone amounts must\nsum to total budget']
    ShowBudgetError --> AddMilestones

    ValidateBudget -->|Yes| SaveDraft[Save contract\nas Draft]

    SaveDraft --> SelectPayment[Manager selects\npayment method:\nM-Pesa or Wallet]

    SelectPayment --> MPesaFlow{Pay via\nM-Pesa?}

    MPesaFlow -->|Yes| InitSTK[Initiate M-Pesa\nSTK Push to Manager's phone]
    InitSTK --> WaitPIN[Manager enters\nM-Pesa PIN]
    WaitPIN --> PaymentResult{Payment\nconfirmed?}

    MPesaFlow -->|No: Wallet| CheckWalletBalance{Wallet balance\nsufficient?}
    CheckWalletBalance -->|No| InsufficientFunds[Show error:\n'Insufficient wallet balance']
    InsufficientFunds --> SelectPayment
    CheckWalletBalance -->|Yes| DeductWallet[Deduct from wallet]
    DeductWallet --> FundEscrow

    PaymentResult -->|No: Timeout/Fail| PaymentFailed[Show error:\n'Payment failed,\nplease retry']
    PaymentFailed --> SelectPayment

    PaymentResult -->|Yes| FundEscrow[Move funds\nto Escrow]

    FundEscrow --> UpdateStatus[Update contract\nstatus to Funded]

    UpdateStatus --> SearchHustler[Manager searches\nfor hustler by\nskill/location/reputation]

    SearchHustler --> SelectHustler[Manager selects\nand views hustler profile]

    SelectHustler --> CheckHustlerKYC{Hustler KYC\napproved?}

    CheckHustlerKYC -->|No| ShowKYCWarning[Show warning:\n'Hustler not KYC verified']
    ShowKYCWarning --> SearchHustler

    CheckHustlerKYC -->|Yes| AssignHustler[Assign hustler\nto contract]

    AssignHustler --> NotifyHustler[Send push notification\nto Hustler]

    NotifyHustler --> UpdateInProgress[Update contract\nstatus to In Progress]

    UpdateInProgress --> End2([✅ Contract Active:\nHustler begins work])
```

---

*End of Part 4 — System Diagrams*
