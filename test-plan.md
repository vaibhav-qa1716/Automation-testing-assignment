# Sauce Demo Checkout – Test Plan

## Objective
Validate the main shopping and checkout journey on Sauce Demo, including authentication, product selection, cart management, checkout validation, order completion and logout.

## Scope
- Login and session access
- Product inventory and sorting
- Add/remove products and cart contents
- Checkout customer information validation
- Order summary, totals and completion
- Logout

## Main risks
1. A user may be unable to sign in or an unauthorized/locked account may gain access.
2. Product selection may not be reflected correctly in the cart.
3. Cart badge, line items or quantities may be inconsistent.
4. Checkout may accept missing mandatory customer information.
5. Order summary calculations may be incorrect.
6. An order may be reported as complete when it was not submitted.
7. Navigation or logout may leave a user in an unexpected authenticated state.

## Prioritized test cases

| Priority | Test case | Expected result | Automate? | Reason |
|---|---|---|---|---|
| P1 | Login with valid credentials | Inventory page opens | Yes | Critical, repeatable regression path |
| P1 | Login with invalid password | Clear authentication error; no access | Yes | Security and negative validation |
| P1 | Login as standard_user with an incorrect password | Clear authentication error; no access | Yes | Important negative authentication behavior |
| P1 | Add product to cart | Correct product and badge count appear | Yes | Core shopping function |
| P1 | Remove product from cart | Product is removed and cart updates | Yes | Core cart behavior |
| P1 | Checkout with valid customer details | User reaches order overview | Yes | Critical purchase path |
| P1 | Complete checkout | Confirmation page is displayed | Yes | Confirms successful end-to-end flow |
| P1 | Verify order total | Total equals subtotal plus tax | Yes | Financial calculation risk |
| P2 | Submit checkout with missing required fields | Relevant validation message appears | Yes | Repeatable field validation |
| P2 | Cancel checkout | User returns to cart without completing order | Yes | Navigation and abandonment behavior |

## Test approach
- Use Playwright Test with TypeScript.
- Use semantic locators or stable `data-test` attributes.
- Assert observable outcomes in every test.
- Keep tests independent and avoid fixed sleeps.
- Run tests in Chromium locally and in GitHub Actions.
- Record reproducible defects with steps, expected/actual results and evidence.

## Out of scope
Payment gateway processing, real shipping integrations, production load testing and security penetration testing are not represented by this practice application.
