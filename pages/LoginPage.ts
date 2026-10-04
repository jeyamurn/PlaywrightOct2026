import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  get crmSfaLink() {
    return this.page.getByRole('link', { name: 'CRM/SFA', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('/opentaps/control/main');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async openCrmSfa(): Promise<void> {
    await this.crmSfaLink.click();
  }
}