# Consumer and Nexora Frontend Audit Report

## Scope and safety

Audited the Consumer E-Commerce and Nexora E-Commerce frontends separately and compared their API/authentication behavior with the available Spring Boot backend source. No backend files were modified. Existing uncommitted work in both frontend folders was preserved; the fixes below are limited to the confirmed Consumer issues that could be corrected without an Admin-auth contract.

## Confirmed findings and actions

| Application / feature | Confirmed issue and evidence | Action |
|---|---|---|
| Consumer / expired customer session | The backend JWT expires after one hour. Consumer session restoration trusts the saved user and does not proactively validate token expiry. Product requests can therefore receive `401` while the UI still considers the customer signed in. | Product list/detail requests now call the existing logout action on `401`, clearing the saved customer and token and prompting the customer to sign in again. |
| Consumer / product detail ratings | `ProductDetailPage.jsx` supplied a fixed rating of `4.0` and `230` reviews despite the product API response having no verified rating/review contract. This displayed unverified data. | Changed those mapped values to `0`, matching the existing “No ratings yet” UI behavior. |
| Consumer / signed-out catalog requests | Backend `SecurityConfig` protects every route except `/api/auth/**` and product-image GETs. Product list/detail endpoints therefore require a bearer token, but the Consumer catalog is reachable while signed out. | Product list/detail pages now avoid sending anonymous product requests, explain that sign-in is required, and link to `/login`. A `401` from an expired token still clears the session. |
| Consumer / signup and login integration | Frontend calls `POST /api/auth/signup` and `POST /api/auth/login` with `name`, normalized `email`, and `password` fields as appropriate. These match the current backend mappings and request DTOs; successful responses provide `id`, `name`, `email`, and `token`. | No endpoint or payload change was justified by the source comparison. End-to-end behavior remains unverified because the backend was unavailable and no valid test account was used. |
| Nexora / Admin login and API authorization | `src/pages/auth/Login/Login.tsx` uses a mock timeout and does not authenticate with the backend or obtain a token. Backend has shared customer `/api/auth/login` that may issue a `role` claim for an account marked `ADMIN`; however, `SecurityConfig` only requires `.authenticated()` for non-auth routes and does not require `ROLE_ADMIN`. The source does not define a separate Admin login or a verified Admin-only authorization policy/provisioning flow. | Left unchanged. Do not substitute Consumer credentials or wire an Admin UI to a role claim that the backend does not enforce on Admin routes. Backend must define/enforce the Admin authentication and authorization contract first. |
| Nexora / protected data APIs | Orders, Products, Merchants, Payments, Customers, and Notifications are protected by backend authentication, while the relevant Nexora requests do not send a bearer token. The backend requires authentication for non-auth routes. | Left unchanged because there is no valid Admin token/role contract to wire. Adding a customer token would not establish Admin authorization. |
| Nexora / initial data loading | Payments and Customers requests start in `src/app/App.tsx` before the mock login completes and do not retry after login. | Left unchanged pending a real Admin auth contract; requests need to be initiated with the authorized Admin session. |
| Nexora / customer status | Customer status changes are stored in browser local storage, while the backend exposes a customer status endpoint. | Not changed in this repair. The appropriate Admin authorization and desired status-update behavior must be established before sending mutations. |

## Files changed in this repair

- `src/context/AuthContext.jsx` — made the existing logout callback stable so it can safely be used by product-fetch effects.
- `src/pages/ProductsPage.jsx` — require a Consumer session before the protected product-list request, show a login link when signed out, and clear the session on a `401`.
- `src/pages/ProductDetailPage.jsx` — require a Consumer session before protected product requests, show a login link when signed out, clear the session on a `401`, and stop showing the unsupported fixed rating/review count.
- `CONSUMER_PROJECT_AUDIT_REPORT.md` — this report.

No Nexora source files or backend files were changed during this repair. Other modified files visible in the frontend Git worktrees predated these focused changes and were not reverted or rewritten.

## Verification

| Check | Result |
|---|---|
| Consumer `npm run build` | Passed. Vite emitted the existing Node `module.register()` deprecation warning. |
| Consumer `npm run lint` | Passed after correcting the callback dependency identified by the first lint run. |
| Nexora `npm run build` | Passed (`tsc -b` and Vite). |
| Nexora `npm run lint` | Passed with one warning: `react(set-state-in-effect)` in `src/features/order/Orders.tsx`. |
| Nexora `git diff --check` | Passed. |
| Consumer `git diff --check` | Reports trailing whitespace in the pre-existing modified `src/data/products.js`; that unrelated line was not changed. |
| API URL and configured CORS origins | Source configuration matches the local applications: both frontends use `http://localhost:8080`; Nexora Vite uses port `3001`; Consumer Vite defaults to `5173`; backend defaults allow origins `http://localhost:3001,http://localhost:5173`. |
| Live signup/login, protected API flows, and CORS | Not verified: a request to `localhost:8080` failed with connection refused, so the backend is not running at that address. No valid customer/Admin credentials were provided. No test account or database data was created or changed. |

## Remaining blockers and warnings

1. **Admin authorization is a backend blocker.** The inspected backend has a shared login response and a possible `ADMIN` token claim, but its security chain does not enforce `ROLE_ADMIN` for Admin data routes. Define/provide an Admin authentication and authorization contract, Admin-user provisioning, and role-enforced endpoint policy before wiring Nexora.
2. **No Admin API success flow was verified.** The API calls currently omit authentication and are expected to fail with `401` under the inspected backend security configuration.
3. **Backend must be started separately.** Consumer signup/login, token issuance, protected requests, and runtime CORS remain unverified because the server did not respond at `localhost:8080`. Start the backend with its required environment configuration, then verify using test credentials.
4. **Consumer cart/checkout does not currently create an order through a backend flow.** No checkout contract was added or assumed in this audit.
5. **Lint/build warnings remain as listed above.** They did not fail the builds or lint command except the unrelated Consumer whitespace check.

## Final build status

- **Consumer E-Commerce:** build passed; lint passed.
- **Nexora E-Commerce:** build passed; lint passed with the noted warning.
- **Backend end-to-end integration:** not verified.
