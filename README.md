# HUSTLERS — Informal Job Agreement & Payment Tracker Platform

> A mobile-first digital platform that formalises informal job agreements in Kenya's hustle economy through escrow-backed payments, milestone verification, digital wallets, and reputation scoring.

---

## Documentation Package

This repository contains the complete final-year Software Engineering documentation package for the HUSTLERS platform.

| # | Document | Description |
|---|---|---|
| 1 | [Project Proposal](docs/01-project-proposal.md) | Background, objectives, methodology, timeline, and risk assessment |
| 2 | [Software Requirements Specification (SRS)](docs/02-srs.md) | IEEE-format functional and non-functional requirements |
| 3 | [Agile Product Backlog](docs/03-agile-backlog.md) | Prioritised user stories with acceptance criteria across 4 sprints |
| 4 | [System Diagrams](docs/04-system-diagrams.md) | Architecture, Use Case, ERD, Sequence, State Machine, and Activity diagrams (Mermaid) |
| 5 | [Database Design](docs/05-database-design.md) | MongoDB schema for all collections with indexes and relationships |
| 6 | [REST API Design](docs/06-api-design.md) | All REST endpoints with request/response structures |
| 7 | [Security Architecture](docs/07-security-architecture.md) | JWT, escrow atomicity, HTTPS, audit logging, and fraud prevention |
| 8 | [Conceptual Diagram & Data Flow Diagrams](docs/08-conceptual-and-dfd.md) | Conceptual domain model and Level-0 / Level-1 Data Flow Diagrams |

---

## System Overview

```
Manager funds job → Funds go to escrow → Hustler works on milestone
→ Hustler submits proof of work → Manager reviews milestone
→ Manager approves milestone → Escrow releases payment to hustler wallet
→ Reward points issued → Hustler withdraws funds via payment gateway
```

## Technology Stack

| Layer | Technology |
|---|---|
| Mobile Frontend | React Native |
| Backend API | Node.js + Express.js |
| Database | MongoDB |
| Authentication | JWT |
| Payments | IntaSend API (M-Pesa) |
| Security | HTTPS + bcrypt + SHA-256 |

## System Modules

1. **User Registration & KYC** — Identity verification and account management
2. **Reputation & Worker Discovery** — Scoring engine and search functionality
3. **Contract & Milestone Management** — Digital contracting and work verification
4. **Wallet, Escrow & Payments** — Financial management and IntaSend integration
5. **Rewards & Gamification** — Points, badges, and leaderboards
6. **Dispute Resolution & Audit Logs** — Conflict management and accountability

---

*HUSTLERS Platform — Final Year Software Engineering Project Documentation*