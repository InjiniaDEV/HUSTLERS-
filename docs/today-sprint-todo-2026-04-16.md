# HUSTLERS - Sprint Todo (2026-04-16)

## Sprint Focus
Day 2 goals from the implementation plan: contracts, escrow, wallet, and milestone workflow.

## Today's Todo

- [ ] Finish environment setup after Node install.
  - Run `npm install` at monorepo root.
  - Confirm workspace scripts run: `npm run dev:backend` and `npm run start:mobile`.
  - Verify `.env` exists for backend with Mongo URI and JWT secret.

- [x] Add backend data models for core Sprint 2 domain.
  - Create `Contract` model with manager, hustler, budget, status, fundedAt.
  - Create embedded or related `Milestone` structure with amount, dueDate, status.
  - Create `Wallet` model with user reference, balance, transaction ledger.
  - Create `Escrow` model linked to contract with remaining balance.

- [x] Implement backend API for contracts and milestones.
  - Add route/controller: create contract (draft).
  - Add route/controller: assign contract to hustler (KYC-approved only).
  - Add route/controller: submit milestone proof (text + image URLs/metadata).
  - Add route/controller: approve milestone and trigger release logic.
  - Add route/controller: reject milestone with mandatory reason.
  - Add route/controller: close contract when all milestones are approved.

- [x] Implement escrow and wallet transaction logic.
  - Add service for atomic transfer: escrow -> hustler wallet on approval.
  - Record immutable transaction entries for credit/debit operations.
  - Validate milestone amount <= escrow remaining balance.
  - Add simple idempotency protection for payment release endpoint.

- [x] Implement backend API for wallet flows.
  - Add balance inquiry endpoint.
  - Add transaction history endpoint with pagination.
  - Add withdrawal endpoint scaffold (integration-ready for IntaSend).

- [x] Add mobile UI stubs for Sprint 2 workflows.
  - Contract list screen (manager and hustler views).
  - Contract detail screen with milestones and escrow balance.
  - Milestone submission form screen.
  - Milestone review screen (approve/reject + reason).
  - Wallet screen (balance + transactions + withdraw action).

- [x] Add tests for Sprint 2 critical paths.
  - Backend tests for contract creation and assignment rules.
  - Backend tests for milestone submit/approve/reject state transitions.
  - Backend tests for escrow release and wallet balance updates.
  - Negative tests: double approval, insufficient escrow, invalid assignee.

- [x] End-of-day quality gate.
  - Run backend tests and fix failing cases.
  - Smoke-test key mobile screens and API calls.
  - Update `project-progress.md` with completed Sprint 2 items.

## Definition of Done (Today)

- Contract and milestone APIs are functional for create -> assign -> submit -> approve/reject flow.
- Escrow balance and wallet balances update correctly on approval.
- Transaction history endpoint returns expected records.
- At least one end-to-end backend test covers milestone payment release.
- [x] Progress file updated with what is complete and what remains.
