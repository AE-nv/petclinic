# Project Guidelines

## Architecture
- Monorepo with three primary work areas:
  - `petclinic-backend/`: Spring Boot REST API (Java 21, Maven wrapper).
  - `petclinic-frontend/`: Angular SPA (Angular 16, npm).
  - `qa/`: Java Selenium black-box tests against deployed frontend/backend.
- Keep API behavior aligned with `openapi.yaml` and backend OpenAPI generation flow.
- Prefer changes inside the relevant bounded area; avoid cross-cutting edits unless required by the task.

## Build And Test
- Full stack local run (from repo root):
  - `./run-all.sh`
- Backend (from `petclinic-backend/`):
  - `./mvnw spring-boot:run`
  - `./mvnw test`
- Frontend (from `petclinic-frontend/`):
  - `npm install`
  - `npm start`
  - `npm test`
  - `npm run test-headless`
- Playwright e2e (from repo root):
  - `npx playwright test`
- QA Selenium suite (from `qa/`):
  - `mvn test`

## Conventions
- Use Maven wrapper (`./mvnw`) for backend commands instead of system Maven when possible.
- Frontend uses `REST_API_URL` from environment files in `petclinic-frontend/src/environments/`; keep backend API paths compatible.
- Favor targeted changes and preserve existing module/package structure (`owners`, `pets`, `vets`, `visits`, etc.).
- When adding tests, place them with the existing style:
  - backend unit/integration tests under `petclinic-backend/src/test/java/`
  - frontend specs near feature code under `petclinic-frontend/src/app/**`
  - browser/e2e checks in `tests/` (Playwright) or `qa/src/test/java/` (Selenium)

## Pitfalls
- Root `package.json` does not define a real test script; run tests from subprojects instead.
- `./run-all.sh` starts services but does not install frontend dependencies; ensure `npm install` was run in `petclinic-frontend/` first.
- Playwright config assumes frontend at `http://localhost:4200`; start app before `npx playwright test`.
- QA Selenium tests require Chrome and default to headless mode.

## References
- Project and workshop overview: `README.md`
- Backend details and auxiliary test tooling: `petclinic-backend/readme.md`
- Backend Postman tests: `petclinic-backend/src/test/postman/README.md`
- Backend JMeter tests: `petclinic-backend/src/test/jmeter/README.md`
- QA black-box tests: `qa/README.md`