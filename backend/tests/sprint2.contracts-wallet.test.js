const request = require('supertest');
const {
  initTestServer,
  clearDatabase,
  teardownTestServer,
  registerAndLogin,
} = require('./testSetup');

let app;

describe('Sprint 2 Contracts, Escrow, Wallet', () => {
  beforeAll(async () => {
    app = await initTestServer();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardownTestServer();
  });

  it('supports create -> fund -> assign -> submit -> approve and credits wallet', async () => {
    const manager = await registerAndLogin({
      name: 'Manager One',
      email: 'manager1@example.com',
      phone: '+254700000002',
      password: 'TestPass123',
      role: 'manager',
    });

    const hustler = await registerAndLogin({
      name: 'Hustler One',
      email: 'hustler1@example.com',
      phone: '+254700000003',
      password: 'TestPass123',
      role: 'hustler',
      kycStatus: 'approved',
    });

    const createRes = await request(app)
      .post('/api/contracts')
      .set('Authorization', `Bearer ${manager.token}`)
      .send({
        title: 'Kitchen Repair',
        description: 'Repair cabinets and sink area',
        milestones: [
          {
            title: 'Parts and prep',
            description: 'Buy and prepare materials',
            amount: 3000,
            dueDate: '2026-04-20',
          },
          {
            title: 'Final install',
            description: 'Install and cleanup',
            amount: 4000,
            dueDate: '2026-04-22',
          },
        ],
      });

    expect(createRes.statusCode).toBe(201);
    const contractId = createRes.body.contract._id;
    const firstMilestoneId = createRes.body.contract.milestones[0]._id;

    const fundRes = await request(app)
      .patch(`/api/contracts/${contractId}/fund`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send();

    expect(fundRes.statusCode).toBe(200);

    const assignRes = await request(app)
      .patch(`/api/contracts/${contractId}/assign`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send({ hustlerId: hustler.user.id });

    expect(assignRes.statusCode).toBe(200);
    expect(assignRes.body.contract.status).toBe('in_progress');

    const submitRes = await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${firstMilestoneId}/submit`)
      .set('Authorization', `Bearer ${hustler.token}`)
      .send({
        description: 'Completed materials and prep work.',
        images: ['https://example.com/proof-1.jpg'],
      });

    expect(submitRes.statusCode).toBe(200);
    expect(submitRes.body.milestone.status).toBe('submitted');

    const approveRes = await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${firstMilestoneId}/approve`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send();

    expect(approveRes.statusCode).toBe(200);
    expect(approveRes.body.result.releasedAmount).toBe(3000);

    const balanceRes = await request(app)
      .get('/api/wallet/balance')
      .set('Authorization', `Bearer ${hustler.token}`);

    expect(balanceRes.statusCode).toBe(200);
    expect(balanceRes.body.balance).toBe(3000);
  });

  it('blocks assignment to hustler without approved KYC', async () => {
    const manager = await registerAndLogin({
      name: 'Manager Two',
      email: 'manager2@example.com',
      phone: '+254700000004',
      password: 'TestPass123',
      role: 'manager',
    });

    const hustler = await registerAndLogin({
      name: 'Hustler Two',
      email: 'hustler2@example.com',
      phone: '+254700000005',
      password: 'TestPass123',
      role: 'hustler',
      kycStatus: 'pending',
    });

    const createRes = await request(app)
      .post('/api/contracts')
      .set('Authorization', `Bearer ${manager.token}`)
      .send({
        title: 'Painting',
        milestones: [
          {
            title: 'Primer',
            amount: 2000,
            dueDate: '2026-04-21',
          },
        ],
      });

    const contractId = createRes.body.contract._id;

    await request(app)
      .patch(`/api/contracts/${contractId}/fund`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send();

    const assignRes = await request(app)
      .patch(`/api/contracts/${contractId}/assign`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send({ hustlerId: hustler.user.id });

    expect(assignRes.statusCode).toBe(400);
    expect(assignRes.body.message).toMatch(/KYC-approved/);
  });

  it('prevents duplicate milestone approval and supports rejection reason', async () => {
    const manager = await registerAndLogin({
      name: 'Manager Three',
      email: 'manager3@example.com',
      phone: '+254700000006',
      password: 'TestPass123',
      role: 'manager',
    });

    const hustler = await registerAndLogin({
      name: 'Hustler Three',
      email: 'hustler3@example.com',
      phone: '+254700000007',
      password: 'TestPass123',
      role: 'hustler',
      kycStatus: 'approved',
    });

    const createRes = await request(app)
      .post('/api/contracts')
      .set('Authorization', `Bearer ${manager.token}`)
      .send({
        title: 'Tiling',
        milestones: [
          { title: 'Measure floor', amount: 1500, dueDate: '2026-04-23' },
        ],
      });

    const contractId = createRes.body.contract._id;
    const milestoneId = createRes.body.contract.milestones[0]._id;

    await request(app)
      .patch(`/api/contracts/${contractId}/fund`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send();

    await request(app)
      .patch(`/api/contracts/${contractId}/assign`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send({ hustlerId: hustler.user.id });

    await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/submit`)
      .set('Authorization', `Bearer ${hustler.token}`)
      .send({ description: 'Measured and marked' });

    const rejectWithoutReason = await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/reject`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send({});

    expect(rejectWithoutReason.statusCode).toBe(400);

    await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/reject`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send({ reason: 'Need clearer measurements with photos.' });

    await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/submit`)
      .set('Authorization', `Bearer ${hustler.token}`)
      .send({ description: 'Resubmitted with photos' });

    const firstApproval = await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/approve`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send();

    expect(firstApproval.statusCode).toBe(200);

    const secondApproval = await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/approve`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send();

    expect(secondApproval.statusCode).toBe(400);
  });
});
