# PART 1 — PROJECT PROPOSAL

---

## 1. Title Page

**Project Title:** Informal Job Agreement & Payment Tracker Platform for Kenya's Hustle Economy

**System Name:** HUSTLERS Platform

**Prepared By:** InjiniaDEV Research Team

**Institution:** [University Name]

**Department:** Department of Software Engineering

**Programme:** Bachelor of Science in Software Engineering

**Date:** March 2026

**Supervisor:** [Supervisor Name]

---

## 2. Abstract

Kenya's informal economy constitutes a substantial portion of national employment, with millions of workers engaged in short-term jobs, casual labour, delivery services, and freelance work. Despite its economic significance, this sector is characterised by a lack of formalised agreements, unreliable payment practices, and limited accountability mechanisms. Workers frequently complete assigned tasks without receiving timely or complete compensation, while job providers lack reliable means of assessing worker performance or verifying identity.

This project proposes the design and development of **HUSTLERS**, a mobile-first digital platform that introduces structured, enforceable job agreements into Kenya's informal economy. The system leverages escrow-backed payments, milestone-based work verification, digital wallets, and reputation scoring to create a trusted environment for both workers (hustlers) and job providers (managers). The platform integrates with IntaSend, a Kenya-native payment gateway, and implements KYC identity verification, JWT-based authentication, and comprehensive audit logging.

The platform is built on a React Native mobile frontend, a Node.js/Express.js backend, and a MongoDB database. It is designed following Agile Scrum principles, with iterative sprint delivery ensuring continuous feedback and improvement. The expected outcome is a reliable, scalable, and secure platform that reduces payment disputes, promotes accountability, and formalises the informal job sector in Kenya.

---

## 3. Background of the Study

### 3.1 The Kenyan Informal Economy

Kenya's informal sector, locally known as the *jua kali* or "hustle" economy, employs an estimated 83% of the national workforce (Kenya National Bureau of Statistics, 2023). This encompasses a wide range of occupations including motorbike delivery riders (*boda boda*), house help, market vendors, construction labourers, freelance artisans, event staff, and digital gig workers. The informal economy contributes approximately 34% of Kenya's GDP, making it a critical national asset (World Bank, 2022).

### 3.2 Existing Challenges

Despite its scale, the informal economy operates largely outside formal regulatory frameworks. Key challenges include:

- **Lack of Formal Agreements:** Most job engagements are conducted verbally or via WhatsApp messages, creating no enforceable record of work terms, timelines, or payment obligations.
- **Payment Delays and Defaults:** The colloquial phrase *"Nitakulipa kesho"* (I will pay you tomorrow) encapsulates a widespread culture of deferred or withheld payment. Workers have limited recourse when payments are not honoured.
- **Identity and Trust Deficits:** Managers cannot easily verify the identity or track record of workers, leading to reluctance in hiring unknown individuals for higher-value tasks.
- **No Performance Tracking:** Workers lack a structured mechanism to showcase their reliability or skill level, limiting their ability to attract better-paying opportunities.
- **Dispute Resolution Gaps:** When disputes arise, there is no neutral arbitration mechanism. Workers typically lack the resources to pursue legal action.

### 3.3 Technology as an Enabler

Mobile technology penetration in Kenya is among the highest in Africa, with over 60 million mobile subscribers (Communications Authority of Kenya, 2023). The success of M-Pesa has demonstrated that Kenyans are willing to adopt mobile-based financial services. Platforms like Lynk and Ajiry have made initial inroads into formalising gig work, but lack comprehensive dispute resolution, escrow mechanisms, and gamified engagement systems.

There is a clear opportunity to build a platform that combines **digital contracting**, **escrow payments**, **reputation systems**, and **mobile-first UX** into a unified solution tailored to the Kenyan context.

---

## 4. Problem Statement

The current informal job market in Kenya suffers from systemic failures in trust, accountability, and financial management. Specifically:

1. **Unenforceable Agreements:** Informal agreements have no legal or digital record, making them vulnerable to denial or misinterpretation by either party.
2. **Payment Insecurity:** Workers bear the full risk of non-payment as funds are not secured before work commences.
3. **Absence of Worker Reputation Systems:** There is no standardised mechanism for assessing or recording worker performance across multiple engagements.
4. **Manual Dispute Resolution:** Disputes are resolved informally and often unfairly, with stronger parties (typically employers) prevailing regardless of merit.
5. **Limited Financial Inclusion:** Informal workers lack access to transaction histories, which could otherwise be leveraged for credit scoring and financial services access.

These challenges lead to exploitation, demotivation of the informal workforce, and suppressed economic productivity. There is a critical need for a digital platform that addresses these structural deficiencies through technology-driven formalisation.

---

## 5. General Objective

To design and develop a mobile-based platform that formalises informal job agreements in Kenya through escrow-backed payments, milestone verification, digital identity management, and reputation scoring, thereby improving financial security and accountability within the informal labour market.

---

## 6. Specific Objectives

1. To design and implement a user registration and KYC identity verification module that enables trusted participation on the platform.
2. To develop a digital contract management system that allows managers to create structured job agreements with defined milestones and payment terms.
3. To implement an escrow-backed payment system integrated with IntaSend that secures worker payments prior to job commencement.
4. To develop a milestone submission and approval workflow that links payment releases to verified work completion.
5. To implement a reputation scoring engine that aggregates worker performance data across multiple contracts.
6. To create a worker discovery module that allows managers to search, filter, and evaluate candidate hustlers based on verified reputation metrics.
7. To design and implement a dispute resolution system with audit logging for transparent conflict management.
8. To develop a gamification and rewards system that incentivises platform engagement and reliable behaviour.

---

## 7. Justification of the Study

### 7.1 Social Impact

The HUSTLERS platform directly addresses labour exploitation in one of Kenya's most vulnerable economic sectors. By providing escrow-backed security, the platform removes the financial risk workers currently bear, enabling them to engage more confidently in the labour market.

### 7.2 Economic Empowerment

The platform creates transaction histories for informal workers, potentially enabling them to access formal financial services such as microloans. It also creates an environment where skilled workers can differentiate themselves through verified reputation scores, commanding better pay.

### 7.3 Academic Contribution

This project contributes to the academic body of knowledge on applying software engineering principles—specifically escrow architecture, reputation systems, and digital contracting—to informal economy contexts in Sub-Saharan Africa.

### 7.4 Technical Innovation

The integration of mobile-first UX, real-time escrow management, and gamification within a single platform represents a novel technical contribution to the Kenyan fintech and labour-tech ecosystems.

---

## 8. Scope of the Project

### 8.1 In Scope

- Mobile application (React Native) for Android, with iOS compatibility as a secondary goal.
- User registration with phone-number-based KYC verification.
- Contract creation, milestone management, and escrow payment processing.
- Digital wallet system with IntaSend integration for deposits and withdrawals.
- Reputation scoring and worker discovery features.
- Reward points and basic gamification (badges and leaderboard).
- Dispute submission and resolution with audit logging.
- REST API backend exposing all platform functionality.

### 8.2 Out of Scope

- Web-based dashboard (planned for future phases).
- Automated KYC document analysis using AI/ML (manual review assumed in v1).
- Integration with government identity databases (planned for v2).
- Multi-currency support (KES only in v1).
- In-app messaging or real-time chat features.

---

## 9. Literature Review

### 9.1 Gig Economy Platforms

Platforms such as Uber, Fiverr, and Upwork have successfully formalised gig work through digital contracts and automated payment. However, their design prioritises high-bandwidth internet connections and formal banking infrastructure, limiting adoption in low-income markets. Research by Chen et al. (2021) highlights the importance of designing gig platforms for local payment infrastructure and low-data environments.

### 9.2 Escrow Mechanisms in Digital Platforms

Escrow services in digital platforms have been studied extensively in the context of e-commerce (eBay, Alibaba). Pavlou and Fygenson (2006) demonstrated that escrow mechanisms significantly increase trust in online transactions. The application of escrow to gig labour contracts is a natural extension of this model, formalising payment obligations before work commences.

### 9.3 Reputation Systems

Reputation systems have been shown to reduce information asymmetry in peer-to-peer markets (Resnick et al., 2000). Platforms like Airbnb and TaskRabbit rely heavily on bidirectional review systems. For informal labour markets, reputation systems must account for low literacy levels and limited time for complex interactions, necessitating simple, clear visualisation (e.g., star ratings).

### 9.4 Mobile Money in Africa

M-Pesa's success has established mobile money as the dominant payment rail in Kenya. IntaSend, a Kenyan payment gateway, provides APIs for M-Pesa integration suitable for platform-based payment flows. Research by Jack and Suri (2011) showed that access to mobile money significantly reduces consumption volatility among poor households, underlining the transformative potential of payment-integrated labour platforms.

### 9.5 KYC and Digital Identity in Emerging Markets

KYC processes in Africa must balance regulatory compliance with accessibility. Platforms like Flutterwave and Paystack use tiered KYC models (phone verification → national ID → biometric) to onboard users progressively. This project adopts a similar tiered approach suitable for the target demographic.

### 9.6 Gamification in Labour Platforms

Deterding et al. (2011) define gamification as the use of game design elements in non-game contexts. In labour platforms, gamification has been shown to increase engagement and platform loyalty. Points, badges, and levels provide non-monetary incentives that complement financial rewards, which is particularly relevant in low-income markets where reputational currency is highly valued.

---

## 10. Proposed System Overview

HUSTLERS is a three-tier mobile platform comprising:

1. **Presentation Layer:** A React Native mobile application providing a consistent experience across Android and iOS devices.
2. **Application Layer:** A Node.js/Express.js RESTful API handling business logic, contract state management, payment orchestration, and security.
3. **Data Layer:** A MongoDB database storing all user, contract, transaction, and audit data.

The core workflow is:

```
Manager funds job → Funds go to escrow → Hustler works on milestone
→ Hustler submits proof of work → Manager reviews milestone
→ Manager approves milestone → Escrow releases payment to hustler wallet
→ Reward points issued → Hustler withdraws funds via payment gateway
```

The system incorporates six major functional modules:

| Module | Description |
|---|---|
| User Registration & KYC | Identity verification and account management |
| Reputation & Worker Discovery | Scoring engine and search functionality |
| Contract & Milestone Management | Digital contracting and work verification |
| Wallet, Escrow & Payments | Financial management and IntaSend integration |
| Rewards & Gamification | Points, badges, and leaderboards |
| Dispute Resolution & Audit Logs | Conflict management and accountability |

---

## 11. Expected Benefits

### 11.1 Benefits to Workers (Hustlers)

- **Payment Security:** Escrow guarantees payment is secured before work begins.
- **Reputation Building:** Verified work history enables career progression within the platform.
- **Financial Records:** Transaction history supports financial inclusion and credit access.
- **Dispute Protection:** Structured dispute resolution provides recourse against non-payment.

### 11.2 Benefits to Managers (Job Providers)

- **Verified Workers:** KYC verification and reputation scores reduce hiring risk.
- **Work Accountability:** Milestone-based submissions create documented proof of work.
- **Payment Control:** Escrow ensures payment is only released upon verified completion.

### 11.3 Macro-Level Benefits

- **Reduced Informality:** Structured digital agreements reduce labour market informality.
- **Economic Data Generation:** Anonymised transaction data provides valuable labour market insights.
- **Financial Inclusion:** Platform participation creates financial footprints for unbanked workers.

---

## 12. Development Methodology — Agile Scrum

The project is developed using **Agile Scrum**, a widely adopted iterative framework that accommodates changing requirements and delivers working software incrementally.

### 12.1 Scrum Roles

| Role | Description |
|---|---|
| Product Owner | Prioritises the product backlog and defines acceptance criteria |
| Scrum Master | Facilitates Scrum ceremonies and removes team impediments |
| Development Team | Cross-functional team responsible for sprint delivery |

### 12.2 Sprint Structure

Each sprint runs for **two weeks** and follows a consistent cadence:

- **Sprint Planning:** Define sprint goals and select backlog items.
- **Daily Standups:** 15-minute synchronisation meetings.
- **Sprint Review:** Demo of completed features to stakeholders.
- **Sprint Retrospective:** Team reflection and process improvement.

### 12.3 Artefacts

- **Product Backlog:** Comprehensive list of all desired features (see Part 3).
- **Sprint Backlog:** Items selected for the current sprint.
- **Increment:** Working software delivered at end of each sprint.

### 12.4 Definition of Done

A user story is considered "done" when:
- All acceptance criteria are met.
- Unit tests pass with ≥ 80% coverage.
- Code has been reviewed and merged to the main branch.
- Feature is demonstrable in the staging environment.

---

## 13. Tools and Technologies

| Category | Technology | Justification |
|---|---|---|
| Mobile Frontend | React Native | Cross-platform iOS/Android development with a single codebase |
| Backend Framework | Node.js + Express.js | High-performance, non-blocking I/O suitable for real-time payment events |
| Database | MongoDB | Flexible document model accommodates evolving contract and user schemas |
| Authentication | JWT (JSON Web Tokens) | Stateless authentication suitable for mobile API consumption |
| Payment Gateway | IntaSend API | Kenya-native M-Pesa integration with escrow support |
| Security | HTTPS + SHA-256 | Industry-standard transport encryption and password hashing |
| Version Control | Git + GitHub | Industry-standard collaborative development |
| Project Management | Jira / GitHub Projects | Agile sprint management and backlog tracking |
| CI/CD | GitHub Actions | Automated testing and deployment pipelines |
| Testing | Jest + Supertest | Unit and integration testing for Node.js APIs |

---

## 14. Project Timeline

The project is estimated at **20 weeks**, divided into six phases:

| Phase | Duration | Activities |
|---|---|---|
| Phase 1: Requirements & Design | Weeks 1–3 | Requirements gathering, SRS writing, system design, wireframing |
| Phase 2: Sprint 1 — Foundation | Weeks 4–5 | User registration, KYC module, JWT authentication |
| Phase 3: Sprint 2 — Core Features | Weeks 6–9 | Contract management, milestone workflow, escrow payments |
| Phase 4: Sprint 3 — Advanced Features | Weeks 10–13 | Wallet system, reputation scoring, worker discovery |
| Phase 5: Sprint 4 — Gamification & Disputes | Weeks 14–17 | Rewards system, dispute resolution, audit logging |
| Phase 6: Testing & Documentation | Weeks 18–20 | Integration testing, UAT, documentation finalisation, deployment |

### Gantt Chart Description

```
Week:     1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
Phase 1:  ██ ██ ██
Phase 2:           ██ ██
Phase 3:                 ██ ██ ██ ██
Phase 4:                             ██ ██ ██ ██
Phase 5:                                         ██ ██ ██ ██
Phase 6:                                                     ██ ██ ██
```

**Phase 1** focuses on stakeholder interviews, detailed requirement analysis, and producing the SRS and design documentation. System architecture decisions are finalised during this phase.

**Phase 2** establishes the project foundation: database configuration, API skeleton, user registration, and authentication. This sprint delivers the core security infrastructure.

**Phase 3** implements the platform's central value proposition: digital contracts, milestone tracking, and escrow payment processing. This phase carries the highest technical complexity.

**Phase 4** adds value-enhancing features: the digital wallet interface, reputation scoring algorithm, and worker discovery search functionality.

**Phase 5** completes the platform with gamification mechanics, dispute management workflows, and comprehensive audit logging.

**Phase 6** is dedicated to thorough testing (unit, integration, and user acceptance testing), performance optimisation, and preparation of all project documentation for submission.

---

## 15. Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|---|---|---|---|
| IntaSend API changes or downtime | Medium | High | Abstract payment layer; implement fallback error handling and retry logic |
| Scope creep | High | Medium | Strict adherence to sprint goals; change requests managed through backlog refinement |
| Mobile device compatibility issues | Medium | Medium | Test on multiple Android versions; use Expo for managed React Native builds |
| Data loss or breach | Low | High | Encrypted storage, regular backups, HTTPS enforcement, JWT expiry policies |
| Team member unavailability | Medium | Medium | Cross-train team members; maintain comprehensive code documentation |
| MongoDB performance at scale | Low | Medium | Implement indexing strategy; use aggregation pipelines for complex queries |
| Regulatory compliance (CBK) | Low | High | Monitor Central Bank of Kenya guidelines; adopt tiered KYC approach |
| User adoption resistance | Medium | High | User testing sessions during development; design for low-literacy UX |

---

## 16. Conclusion

The HUSTLERS platform represents a timely and technically sound response to a well-documented problem in Kenya's informal labour market. By applying established software engineering principles — escrow payment architecture, reputation systems, milestone-based contract management, and digital identity verification — to the specific context of the Kenyan hustle economy, the platform has the potential to meaningfully improve the financial security and professional standing of millions of informal workers.

The use of Agile Scrum methodology ensures that the development process remains responsive to user feedback and evolving requirements, while the chosen technology stack provides a solid foundation for future scalability. The documentation presented in this package provides a comprehensive blueprint for the system's design, development, and deployment.

---

*End of Part 1 — Project Proposal*
