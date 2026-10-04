import { expect, Page } from '@playwright/test';

export interface NewLead {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  areaCode: string;
  phoneNumber: string;
}

export class CreateLeadPage {
  readonly form;

  constructor(private readonly page: Page) {
    this.form = page.locator('form[name="createLeadForm"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/crmsfa/control/createLeadForm');
  }

  async fillLead(lead: NewLead): Promise<void> {
    await this.page.locator('#createLeadForm_companyName').fill(lead.companyName);
    await this.page.locator('#createLeadForm_firstName').fill(lead.firstName);
    await this.page.locator('#createLeadForm_lastName').fill(lead.lastName);
    await this.page.locator('#createLeadForm_primaryEmail').fill(lead.email);
    await this.page.locator('#createLeadForm_primaryPhoneAreaCode').fill(lead.areaCode);
    await this.page.locator('#createLeadForm_primaryPhoneNumber').fill(lead.phoneNumber);
    await this.page.locator('#createLeadForm_dataSourceId').selectOption('LEAD_WEBSITE');
  }

  async submit(): Promise<void> {
    await this.form.locator('input[name="submitButton"]').click();
  }

  async expectLeadCreated(lead: NewLead): Promise<void> {
    await expect(this.page).toHaveURL(/\/crmsfa\/control\/viewLead\?partyId=/);
    await expect(this.page.getByText(lead.companyName, { exact: false }).last()).toBeVisible();
    await expect(this.page.getByText(lead.lastName, { exact: true })).toBeVisible();
    await expect(this.page.getByText('Website', { exact: true })).toBeVisible();
    await expect(this.page.getByText(lead.email, { exact: true })).toBeVisible();
    await expect(this.page.getByText(new RegExp(`${lead.areaCode}-${lead.phoneNumber}`))).toBeVisible();
  }
}