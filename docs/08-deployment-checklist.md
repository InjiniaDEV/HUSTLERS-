# HUSTLERS Platform - Deployment Checklist

## Pre-Deployment Validation

### Code Quality & Testing
- [x] All backend tests pass (`npm run test:backend`: 3/3 suites, 7/7 tests)
- [x] All mobile tests pass (`npm run test:mobile`: 3/3 suites, 5/5 tests)
- [x] All integration tests pass (`npm run test:all`: 10/10 suites, 12/12 tests)
- [ ] Code review completed by team lead
- [ ] Security audit completed (OWASP Top 10)
- [ ] Performance testing completed (load testing with k6 or similar)

### Environment & Configuration
- [x] Backend `.env` file created with all required variables
- [x] `.env.example` template created for documentation
- [x] JWT_SECRET generated with cryptographically secure random (64 bytes minimum)
- [x] NODE_ENV set to `production` for deployment
- [x] MONGO_URI points to production MongoDB instance (Atlas or self-hosted)
- [x] CORS_ORIGIN configured to specific domain(s), not `*`
- [ ] Environment variables securely stored (AWS Secrets Manager, HashiCorp Vault, etc.)
- [ ] Database backups configured and tested
- [ ] Database connection pooling configured for production

### Dependency & Security
- [x] All dependencies installed and locked in package-lock.json
- [x] npm audit run and reviewed (7 low/high vulnerabilities in dev deps, acceptable for dev)
- [ ] High-severity vulnerabilities in production dependencies resolved
- [ ] Third-party API keys validated (IntaSend, SMTP, etc.)
- [ ] Secrets not committed to git (verify .gitignore includes .env)

### Backend Deployment (Node.js/Express)

#### Pre-Deployment
- [ ] Verify NODE_VERSION matches development (v24.14.1 or compatible)
- [ ] Build process documented and tested
- [ ] Graceful shutdown implemented (handle SIGTERM, drain connections)
- [ ] Health check endpoint available (`GET /health`)
- [ ] Request logging configured (bunyan, winston, or similar)
- [ ] Error tracking integrated (Sentry, LogRocket, or similar)

#### Deployment
- [ ] Server provisioned (AWS EC2, Railway, Heroku, DigitalOcean, etc.)
- [ ] Node.js runtime installed
- [ ] Dependencies installed (`npm ci` or `npm install --production`)
- [ ] Environment variables loaded
- [ ] Database migrations executed (if applicable)
- [ ] Server started with process manager (PM2, systemd, Docker, etc.)

#### Post-Deployment
- [ ] Health check endpoint responding (GET /health returns 200)
- [ ] API endpoints responding to test requests
- [ ] Database connectivity verified
- [ ] JWT token generation and validation working
- [ ] Authentication flow tested end-to-end
- [ ] Logging output verified in server logs
- [ ] Error handling tested (intentional 404, 500 scenarios)
- [ ] Monitoring/alerting configured (CPU, memory, error rates)

### Mobile App Deployment

#### iOS (Apple App Store)
- [ ] Build signed with correct provisioning profile
- [ ] Version number incremented
- [ ] Privacy policy linked in App Store Connect
- [ ] Screenshots and description uploaded
- [ ] TestFlight beta testing completed
- [ ] Submitted for App Review (48-72 hours turnaround)

#### Android (Google Play Store)
- [ ] Build signed with release keystore
- [ ] Version number incremented (build number must increase)
- [ ] Privacy policy linked in Play Console
- [ ] Screenshots and description uploaded
- [ ] Internal testing completed
- [ ] Staged rollout configured (5% → 25% → 100% over days)
- [ ] Submitted for review (usually approved within hours)

#### React Native Specific
- [ ] API_BASE_URL configured to point to production backend
- [ ] Redux store persistence (AsyncStorage) working correctly
- [ ] Network timeouts configured appropriately (30s+ for slow networks)
- [ ] Offline detection and fallback implemented
- [ ] Deep linking configured for push notifications/social sharing
- [ ] Permissions (camera, location, contacts) requested with rationale

### Database Deployment

#### MongoDB Setup
- [ ] MongoDB cluster created (MongoDB Atlas or self-hosted)
- [ ] Network access configured (IP whitelist includes backend server)
- [ ] Authentication enabled (username/password or certificate)
- [ ] Database and collections created
- [ ] Indexes created for query optimization:
  - `User.email` (unique)
  - `User.phone` (unique)
  - `Contract.managerId`
  - `Contract.assignedHustlerId`
  - `Wallet.userId`
  - `Escrow.contractId`
- [ ] Backups automated (daily snapshots, minimum 7-day retention)
- [ ] Backup restoration tested
- [ ] Connection pooling configured (minPoolSize: 10, maxPoolSize: 100)

### Security Checklist

#### Network Security
- [ ] HTTPS/TLS enforced on all endpoints (SSL certificate installed)
- [ ] HTTP redirects to HTTPS
- [ ] Security headers configured:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security: max-age=31536000`
- [ ] CORS configured to specific origins only (not `*`)
- [ ] Rate limiting implemented (prevent brute force attacks)
- [ ] Request validation on all endpoints (size limits, content-type validation)

#### Authentication & Authorization
- [x] JWT implementation with strong secret (64+ bytes)
- [x] Token expiration set to 24h
- [x] Role-based access control enforced on all protected endpoints
- [ ] Password reset flow tested (email verification required)
- [ ] Account lockout after failed attempts implemented
- [ ] Session timeout implemented (15-30 minutes of inactivity)
- [ ] Multi-factor authentication planned for Phase 2

#### Data Protection
- [ ] Passwords hashed with bcrypt (10 salt rounds)
- [ ] Sensitive data not logged (tokens, passwords, API keys)
- [ ] Database encryption at rest enabled (if available in hosting plan)
- [ ] API keys and secrets rotated regularly
- [ ] PII data handling complies with local regulations (GDPR, DPA 2018)

#### Payment Security (IntaSend Integration)
- [ ] Payment API keys validated and tested
- [ ] Webhook signatures verified (prevent spoofing)
- [ ] Webhook retry logic implemented
- [ ] Payment amount validation on backend (prevent tampering)
- [ ] Sensitive payment data not stored in app logs

### Monitoring & Logging

- [ ] Application logging configured (structured JSON format)
- [ ] Log aggregation service set up (CloudWatch, Datadog, ELK, etc.)
- [ ] APM (Application Performance Monitoring) configured:
  - Database query performance
  - API response times
  - Error rates and types
  - Business metrics (contracts created, payments processed)
- [ ] Alerting rules configured:
  - Error rate > 1% for 5 minutes
  - API response time > 2 seconds
  - Database connection failures
  - Disk space < 20% available
  - Memory usage > 85%
- [ ] On-call rotation established with escalation procedures
- [ ] Runbook created for common incidents

### Documentation

- [x] API documentation complete (endpoints, parameters, error codes)
- [x] Database schema documented (models with all fields)
- [x] Environment variables documented (`.env.example`)
- [ ] Deployment procedure documented (step-by-step for new team members)
- [ ] Troubleshooting guide created (common issues and solutions)
- [ ] Architecture diagram updated (data flow, components, integrations)
- [ ] Release notes prepared for this version
- [ ] Change log updated (what's new, what's fixed)

### Infrastructure

#### Backend Server
- [ ] CPU: Minimum 1 core, recommended 2+ cores
- [ ] Memory: Minimum 512MB, recommended 2GB+
- [ ] Storage: Minimum 10GB (for logs and data)
- [ ] Network: 100Mbps+ bandwidth
- [ ] Uptime SLA: 99.5%+ (if critical infrastructure)

#### Database Server
- [ ] CPU: Minimum 2 cores, recommended 4+ cores
- [ ] Memory: Minimum 2GB, recommended 8GB+
- [ ] Storage: High-performance SSD, sized for 1-year data growth
- [ ] Network: 1Gbps+ bandwidth
- [ ] Backup storage: At least 3x main database size

### Testing in Production

- [ ] Smoke tests run successfully (critical user flows)
- [ ] Data verification (sample users, contracts created)
- [ ] Payment flow tested with small transaction amounts
- [ ] Error handling tested (intentional failures monitored)
- [ ] Load testing completed at expected concurrent users
- [ ] Mobile app tested on real devices (iOS and Android)
- [ ] API rate limits tested
- [ ] Database backups tested and restorable

### Post-Deployment

- [ ] Version number recorded for rollback procedures
- [ ] Release notes published to team/users
- [ ] Support team briefed on new features/changes
- [ ] Customer communication sent (if applicable)
- [ ] Monitoring dashboard reviewed for anomalies
- [ ] Performance metrics baseline established
- [ ] Incident response procedures reviewed with team
- [ ] Retrospective scheduled (what went well, what to improve)

---

## Rollback Procedure

If critical issues arise in production:

1. **Immediate Response** (First 5 minutes)
   - Identify severity: P1 (down), P2 (degraded), P3 (minor issue)
   - Declare incident in Slack/communication channel
   - Notify team lead and on-call engineer

2. **Investigation** (5-15 minutes)
   - Check logs for errors
   - Verify database connectivity
   - Check external service status (IntaSend, MongoDB Atlas)
   - Review recent changes

3. **Rollback Decision** (15 minutes)
   - Is it a quick fix (< 30 minutes)? Fix forward
   - Otherwise? Rollback to previous version

4. **Rollback Execution**
   - Stop current server: `pm2 stop app` or equivalent
   - Checkout previous commit: `git checkout <previous-tag>`
   - Restore previous .env file from backup
   - Reinstall dependencies: `npm ci`
   - Restart server: `pm2 start app` or equivalent
   - Run smoke tests
   - Monitor error rates for 10 minutes

5. **Post-Mortem**
   - Schedule within 24 hours
   - Document root cause
   - Create tickets for preventive fixes
   - Update runbook

---

## Version History

| Version | Date       | Environment | Status |
|---------|------------|-------------|--------|
| 1.0.0   | 2026-04-16 | Development | Ready for staging |

---

## Contact & Support

- **Tech Lead:** [Name]
- **DevOps Engineer:** [Name]
- **On-Call Rotation:** [Link to schedule]
- **Incident Channel:** #incidents (Slack)
- **Production Runbook:** [Link]

---

**Last Updated:** 2026-04-16
**Next Review:** 2026-05-16
