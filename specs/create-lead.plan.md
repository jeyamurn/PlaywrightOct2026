# Create Lead Test Plan

## Application Overview

Test the opentaps CRM Create Lead workflow at http://leaftaps.com/crmsfa/control/createLeadForm. The workflow is authenticated, displays a detailed lead form, and submits to /crmsfa/control/createLead. The form includes company and contact identity, source and marketing campaign selectors, organization details, contact information, and address fields. No native HTML required flags were observed, so required-field and format enforcement must be verified through the application's response. Do not hardcode credentials; use a dedicated QA account supplied through the test environment. Each scenario starts from a fresh browser context, navigates to the app, authenticates, and opens the blank Create Lead form. Use unique QA data and remove created records after each scenario where permissions allow.

## Test Scenarios

### 1. Lead creation

**Seed:** `tests/seed.spec.ts`

#### 1.1. Create a lead with valid core and contact details

**File:** `tests/leads/create-lead-happy-path.spec.ts`

**Steps:**
  1. Start with a fresh browser context and navigate to the configured CRM base URL. Sign in using the dedicated QA credentials supplied securely by the test environment.
    - expect: The CRM home or requested Create Lead page loads for the authenticated QA user.
  2. Open Leads > Create Lead, or navigate to /crmsfa/control/createLeadForm, and confirm all lead fields are blank/defaulted.
    - expect: The Create Lead form is displayed.
    - expect: The form is not pre-populated with values from another scenario.
  3. Enter a unique company name such as QA Prospect <run-id>, a first name, and a last name. Select a valid Source such as Website.
    - expect: Entered text remains in the corresponding fields.
    - expect: The selected source is displayed as selected.
  4. Enter a valid QA email address and phone number. Leave unrelated optional fields at their defaults.
    - expect: The email and phone values remain visible and are not marked invalid.
  5. Submit using the main Create Lead button at the bottom of the form.
    - expect: The application accepts the submission and displays a success confirmation or the newly created lead details.
    - expect: The saved lead displays the submitted company, name, source, email, and phone values.
    - expect: No duplicate record is created by a single submission.
  6. Remove the uniquely identified QA lead if the account permits deletion, then end the browser context.
    - expect: The record is cleaned up, or its unique identifier is recorded for cleanup by the test owner.

#### 1.2. Reject submission when required identity fields are missing

**File:** `tests/leads/create-lead-required-fields.spec.ts`

**Steps:**
  1. Start from a fresh browser context, authenticate with the dedicated QA account, and open the blank Create Lead form.
    - expect: The Create Lead form is displayed with no values from prior scenarios.
  2. Leave Company Name and Last name blank, enter no other data, and submit the form.
    - expect: The application rejects the submission and does not create a lead.
    - expect: The page identifies the missing required fields with a validation message or field-level indication.
    - expect: The form retains the user's entered values if any were provided.
  3. Enter a Company Name but leave Last name blank, then submit again.
    - expect: The application continues to reject the submission and identifies Last name as required.
    - expect: No lead record is created.
  4. End the browser context without saving a record.
    - expect: The scenario leaves no lead data behind.

#### 1.3. Validate malformed contact data

**File:** `tests/leads/create-lead-invalid-contact.spec.ts`

**Steps:**
  1. Start from a fresh browser context, authenticate with the dedicated QA account, and open the blank Create Lead form.
    - expect: The Create Lead form is displayed with no values from prior scenarios.
  2. Enter valid Company Name and Last name values, then enter a malformed email address such as qa-invalid-address and a non-numeric phone number.
    - expect: The values are present in their respective fields before submission.
  3. Submit the form.
    - expect: The application rejects malformed contact data or clearly identifies the email and/or phone validation issue.
    - expect: No lead is created with malformed contact details.
    - expect: The form preserves valid values so they can be corrected.
  4. Correct the email and phone values to valid formats, then leave the form without submitting.
    - expect: The validation indication clears or the corrected values are accepted.
    - expect: No lead record is created during this scenario.

#### 1.4. Save optional profile and address details with valid boundary values

**File:** `tests/leads/create-lead-optional-details.spec.ts`

**Steps:**
  1. Start from a fresh browser context, authenticate with the dedicated QA account, and open the blank Create Lead form.
    - expect: The Create Lead form is displayed with its default country and currency values visible.
  2. Enter unique Company Name and Last name values. Select valid Source and Marketing Campaign options, and populate optional title, department, annual revenue, employee count, description, and primary address fields using valid values, including zero for an optional numeric field if accepted.
    - expect: Selections and optional values remain visible in their intended fields.
    - expect: Default currency and country values remain selected unless explicitly changed.
  3. Submit the completed form.
    - expect: The application accepts valid optional data and displays a success confirmation or the newly created lead details.
    - expect: Saved source, campaign, numeric, description, and address values match the submitted values.
    - expect: The lead's core identity fields are present in the saved record.
  4. Remove the uniquely identified QA lead if the account permits deletion, then end the browser context.
    - expect: The record is cleaned up, or its unique identifier is recorded for cleanup by the test owner.
