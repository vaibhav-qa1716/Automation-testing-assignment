
## 1. AI Tools Used
- ChatGPT (OpenAI)

## 2. How I Used AI
I used ChatGPT to:
- Understand the assignment requirements.
- Design the test plan and prioritize test scenarios.
- Create UI tests for login, inventory, cart, checkout and logout.
- Create API tests for Restful-Booker.
- Analyze test execution errors and improve the automation framework.

## 3. One Incorrect AI Suggestion and How I Identified It

The initial AI-generated project used Playwright's `getByTestId('username')` locator without configuring the correct test ID attribute.

However, SauceDemo uses `data-test` attributes instead of Playwright's default `data-testid` attribute.

During test execution, I noticed that multiple UI tests were failing because the username locator could not be found, even though the application loaded successfully.

I investigated the error logs and identified the locator configuration mismatch.

I corrected the issue by configuring `testIdAttribute: 'data-test'` in the Playwright configuration.

This experience taught me that AI-generated code should always be reviewed and validated against the actual application.

## 4. My Testing and Validation

- Initial execution: 10 tests passed and 25 failed.
- Updated execution: 28 tests passed and 6 failed.
- I reviewed the execution results and used the failure logs to identify issues.
- The remaining 6 failures require further investigation.

## 5. What I Learned

AI helped me accelerate test development and improve test coverage. However, I learned that AI-generated code and suggestions are not always correct.

As a QA Engineer, I need to independently validate test scenarios, inspect failures, verify actual application behavior and ensure that every reported defect is reproducible.


==================================================
