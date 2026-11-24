# StackGuard QA Engineer Assignment

Automated UI and API checks using TypeScript and Playwright Test.

## Coverage

- Sauce Demo UI: login, inventory, cart, checkout, order completion and logout. All UI scenarios use `standard_user` only (negative login tests vary the password or leave fields empty).
- Restful-Booker API: create, read, update, partial update, delete and negative authorization/ID scenarios.
- Test plan: `test-plan.md`
- Bug report template and investigation guidance: `bug-reports/README.md`
- AI usage record: `ai-notes.md`

The UI suite contains more than 15 test definitions and the API suite contains 10 test definitions. Test execution against public practice services is required before treating results as verified.

## Requirements

- Node.js (use a currently supported LTS release)
- npm
- Git (for repository submission)

## Setup

```bash
npm install
npx playwright install chromium
```

## Run tests

All Sauce Demo UI tests are configured to use **only `standard_user`** with password `secret_sauce`. Negative login coverage uses that same username with an incorrect password or an empty required field; no other Sauce Demo account is used.


```bash
# All UI and API tests
npm test

# UI tests only
npm run test:ui

# API tests only
npm run test:api

# Show browser while UI tests run
npm run test:headed

# TypeScript type checking
npm run typecheck

# Open HTML report after a run
npm run report
```

Playwright writes its HTML report to `playwright-report/` and test artifacts to `test-results/`.

## Configuration

Defaults:
- Sauce Demo: `https://www.saucedemo.com`
- Restful-Booker: `https://restful-booker.herokuapp.com`

Optional environment overrides:
- `SAUCEDEMO_BASE_URL`
- `RESTFUL_BOOKER_BASE_URL`

The Sauce Demo URL is configured as `baseURL` in `playwright.config.ts` and reads `SAUCEDEMO_BASE_URL` when set. Playwright's `getByTestId()` is configured to use Sauce Demo's actual `data-test` attributes.

## Test data and independence

UI tests use Sauce Demo's documented practice accounts. API tests create unique booking records for their own scenarios. The API is a shared public demo service and may be rate-limited, reset or temporarily unavailable. Some tests create records without cleanup to avoid a cleanup failure masking the test result; use only disposable demo data.

## Known limitations / items to verify before submission

- Run the full suite and resolve environment or application changes.
- Confirm the behavior/status code of the invalid booking ID scenario against the live service.
- The two required bug reports must be based on defects you personally reproduce. Do not submit hypothetical issues as confirmed bugs.
- Update `ai-notes.md` with your actual AI usage and one real incorrect suggestion you caught.
- Add screenshots under `bug-reports/evidence/` only for verified defects.
- If any item remains incomplete, state that clearly here before submitting.

## Suggested Git workflow

```bash
git init
git add .
git commit -m "chore: initialize StackGuard QA assignment"
git add tests/ui
git commit -m "test: add Sauce Demo UI coverage"
git add tests/api utils
git commit -m "test: add Restful Booker API coverage"
git add .
git commit -m "docs: add test plan and assignment documentation"
```

Create an empty GitHub repository, then follow GitHub's instructions to add its remote and push the `main` branch.

## Submission readiness

See `SUBMISSION-CHECKLIST.md`. Two real bug reports, actual test execution, and personal AI validation notes are **still required**. Placeholder bug report worksheets are not verified defects. Do not submit the repository as fully complete until those items are resolved.

## Troubleshooting: all UI tests time out on username

In the supplied Windows run, **10 API tests passed** and **25 UI tests failed** waiting for `getByTestId('username')`. The page loaded (HTTP 200, title `Swag Labs`), but Sauce Demo exposes its selectors using `data-test`, whereas Playwright defaults to `data-testid`. The configuration now maps `getByTestId()` to `data-test`. The previous run's UI failures were therefore cascading locator failures, not 25 individually proven product defects.

Run from CMD in the project folder:

```cmd
npm run diagnose:ui
```

A visible Chromium browser opens and `diagnostics/saucedemo-check.json` plus `diagnostics/saucedemo-page.png` are generated. If `usernameFound` is 0, inspect `finalUrl`, `httpStatus`, and the screenshot. Confirm the actual input selector in DevTools; this project expects `data-test="username"`. Test the URL manually in Chrome. If a network filter or redirect is present, fix that first; **do not bypass it by weakening assertions**.

If the site is accessible at a different *verified* URL, override it in CMD for that session:

```cmd
set SAUCEDEMO_BASE_URL=https://www.saucedemo.com
npm run test:ui
```

The UI suite now uses a shared navigation helper that fails in ~8 seconds with the actual URL, HTTP status and page title when the expected login form is missing. This is a diagnostic improvement, **not a claim that UI tests now pass**.
