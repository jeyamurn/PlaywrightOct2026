import { expect, test } from '@playwright/test';
import { CreateLeadPage } from '../pages/CreateLeadPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Lead creation', () => {
  test('Create a lead with valid core and contact details', async ({ page }) => {
    const { faker } = await import('@faker-js/faker');
    const username = process.env.LEAFTAPS_USERNAME;
    const password = process.env.LEAFTAPS_PASSWORD;
    if (!username || !password) {
      throw new Error('Set LEAFTAPS_USERNAME and LEAFTAPS_PASSWORD in the test environment.');
    }

    // Generate unique, non-production test data for this run.
    const runId = `${Date.now()}-${faker.string.alphanumeric(6).toLowerCase()}`;
    const lead = {
      companyName: `QA ${faker.company.name()} ${runId}`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: `${faker.string.alphanumeric(10).toLowerCase()}@example.com`,
      areaCode: '415',
      phoneNumber: `555${faker.string.numeric(4)}`,
    };

    const loginPage = new LoginPage(page);
    const createLeadPage = new CreateLeadPage(page);

    // Step 1: Open the opentaps CRM entry page and sign in with environment-provided credentials.
    await loginPage.goto();
    await loginPage.login(username, password);

    // Step 2: Enter CRMSFA through the authenticated CRM/SFA session handoff.
    await expect(loginPage.crmSfaLink).toBeVisible();
    await loginPage.openCrmSfa();

    // Step 3: Open the Create Lead form from the authenticated CRMSFA session.
    await createLeadPage.goto();
    await expect(createLeadPage.form).toBeVisible();

    // Step 5: Fill the identity and contact fields and select Website as the lead source.
    await createLeadPage.fillLead(lead);

    // Step 6: Submit the completed lead form.
    await createLeadPage.submit();

    // Step 7: Verify the saved lead details and contact data on the lead view.
    await createLeadPage.expectLeadCreated(lead);
  });
});
