# GitHub Copilot Workshop - Spring PetClinic

A hands-on workshop for developers to learn **GitHub Copilot** using a real-world full-stack application. Covers prompt engineering, code generation, refactoring, test generation, custom instructions, and MCP Playwright for E2E testing.

---

## Table of Contents

- [Workshop Overview](#workshop-overview)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Architecture Overview](#architecture-overview)
- [Lab 1 - Warm-up: Code Generation with Copilot Chat](#lab-1---warm-up-code-generation-with-copilot-chat)
- [Lab 2 - TDD Kata: String Calculator](#lab-2---tdd-kata-string-calculator)
- [Lab 3 - TDD Kata: Invoice Service](#lab-3---tdd-kata-invoice-service)
- [Lab 4 - Prompt Engineering](#lab-4---prompt-engineering)
- [Lab 5 - Refactoring with Copilot](#lab-5---refactoring-with-copilot)
- [Lab 6 - Copilot Custom Instructions](#lab-6---copilot-custom-instructions)
- [Lab 7 - Generate Tests with Copilot](#lab-7---generate-tests-with-copilot)
- [Lab 8 - MCP Playwright: E2E Testing](#lab-8---mcp-playwright-e2e-testing)
- [Tips & Tricks](#tips--tricks)
- [Reference: Project Structure](#reference-project-structure)

---

## Workshop Overview

| # | Lab | Topic | Duration |
|---|-----|-------|----------|
| 1 | Warm-up | Copilot Chat basics, inline completions, `#workspace` | 15 min |
| 2 | String Calculator Kata | TDD with Copilot (Java + TypeScript) | 30 min |
| 3 | Invoice Service Kata | TDD with Copilot (Java + TypeScript) | 20 min |
| 4 | Prompt Engineering | Crafting effective prompts, iterating on output | 25 min |
| 5 | Refactoring | Using Copilot to refactor real production code | 30 min |
| 6 | Custom Instructions | `.github/copilot-instructions.md`, `.instructions.md` files | 20 min |
| 7 | Generate Tests | Unit, integration, and API test generation | 25 min |
| 8 | MCP Playwright | E2E browser testing with the Playwright MCP server | 25 min |

**Total estimated duration: ~3 hours** (adjust based on group size and depth)

---

## Prerequisites

### Tools Required

| Tool | Version | Purpose |
|------|---------|---------|
| **VS Code** | Latest | IDE |
| **GitHub Copilot** extension | Latest | AI pair programmer |
| **GitHub Copilot Chat** extension | Latest | Chat interface |
| **Java JDK** | 21+ | Backend |
| **Maven** | 3.9+ (or use included `./mvnw`) | Backend build |
| **Node.js** | 16+ | Frontend |
| **npm** | 8+ | Frontend dependencies |
| **Git** | Latest | Version control |

### Copilot Setup Checklist

1. Ensure you have an **active GitHub Copilot license** (Individual, Business, or Enterprise)
2. Sign in to GitHub in VS Code
3. Verify Copilot is active: look for the Copilot icon in the status bar
4. Open Copilot Chat with `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Shift+I` (macOS)

---

## Project Setup

### Clone and Start

```sh
git clone <repository-url>
cd petclinic
```

### Run Full Stack

```sh
./run-all.sh
```

### Or Run Separately

**Backend** (Spring Boot):
```sh
cd petclinic-backend
./mvnw spring-boot:run
```

**Frontend** (Angular):
```sh
cd petclinic-frontend
npm install
npm start
```

### Verify

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| H2 Console | http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:petclinic`, user: `sa`, no password) |

### Run Tests

```sh
# Backend
cd petclinic-backend && ./mvnw test

# Frontend
cd petclinic-frontend && npm test
```

---

## Architecture Overview

```
┌──────────────────────┐         ┌──────────────────────┐
│   petclinic-frontend │  HTTP   │  petclinic-backend    │
│   Angular 16 SPA     │ ──────► │  Spring Boot 3.5      │
│   Port 4200          │         │  Port 8080            │
└──────────────────────┘         └──────────┬───────────┘
                                            │ JPA
                                 ┌──────────▼───────────┐
                                 │   H2 / PostgreSQL     │
                                 └──────────────────────┘
```

**Backend layers**: REST Controllers → MapStruct Mappers → JPA Repositories → Database

**Key packages**:
| Package | Contents |
|---------|----------|
| `rest/` | REST controllers (`OwnerRestController`, `VetRestController`, ...) |
| `model/` | JPA entities (`Owner`, `Pet`, `Vet`, `Visit`, `PetType`, `Specialty`) |
| `repository/` | Spring Data JPA repositories |
| `mapper/` | MapStruct DTO ↔ Entity mappers |
| `rest/dto/` | Generated DTOs from OpenAPI spec |
| `invoice/` | Invoice calculation service (exercise) |
| `util/` | String Calculator (exercise) |

**Frontend modules**: Owners, Pets, Vets, Visits, PetTypes, Specialties — each with list/add/edit components and a service.

---

## Lab 1 - Warm-up: Code Generation with Copilot Chat

**Goal**: Get comfortable with Copilot's different interaction modes.

### Exercise 1.1 — Inline Completions

1. Open `petclinic-backend/src/main/java/org/springframework/samples/petclinic/rest/OwnerRestController.java`
2. Place your cursor at the end of the file (inside the class, before the closing `}`)
3. Start typing a comment: `// endpoint to get all pets for a given owner`
4. Observe Copilot's inline suggestion — press `Tab` to accept
5. Try writing another comment and see what Copilot generates

> **Tip**: Press `Alt+]` / `Option+]` to cycle through alternative suggestions.

### Exercise 1.2 — Copilot Chat: Ask About the Codebase

Open Copilot Chat and try these prompts:

```
What is the architecture of this project?
```

```
How are DTOs mapped to entities in the backend?
```

```
Where is the Owner entity defined and what fields does it have?
```

### Exercise 1.3 — Explain and Document

1. Open `petclinic-frontend/src/app/owners/owner-list/owner-list.component.ts`
2. Select the `searchByLastName` method
3. In Copilot Chat, type: `/explain`
4. Try: `Explain the subscription pattern used in this Angular component`

### Exercise 1.4 — Quick Fix

1. Open any file with linting or compile issues
2. Hover over the issue and look for the Copilot "Fix" action
3. Or select the problematic code and ask: `/fix`

---

## Lab 2 - TDD Kata: String Calculator

**Goal**: Practice Test-Driven Development with Copilot. Write tests first, then let Copilot help implement the code.

This exercise exists in **both the backend (Java) and the frontend (TypeScript)** — pick your preferred language or do both.

### The Kata

Implement a `calculate` / `add` function that takes a string of comma-separated numbers and returns their sum.

**Rules** (from [kata-log.rocks/string-calculator-kata](https://kata-log.rocks/string-calculator-kata)):
1. An empty string returns `0`
2. A single number returns that number (`"1"` → `1`)
3. Two comma-separated numbers return their sum (`"1,2"` → `3`)
4. Handle any amount of numbers
5. Handle newline `\n` as a separator (`"1\n2,3"` → `6`)
6. Support custom delimiters: `"//;\n1;2"` → `3`
7. Negative numbers throw an exception listing all negatives

### Backend (Java)

**Files**:
- Implementation: `petclinic-backend/src/main/java/.../util/Calculator.java`
- Test: `petclinic-backend/src/test/java/.../util/CalculatorTest.java`

**Steps**:

1. Open `CalculatorTest.java` — it's empty
2. Start writing a test. Type the following and let Copilot complete it:
   ```java
   @Test
   void emptyStringReturnsZero() {
   ```
3. Accept the suggestion, then add more tests one by one (following the kata rules above)
4. After each test, switch to `Calculator.java` and let Copilot help implement the logic
5. Run tests:
   ```sh
   cd petclinic-backend
   ./mvnw test -pl . -Dtest=CalculatorTest
   ```

**Prompt hints** — if Copilot needs guidance, try in chat:
```
Implement the calculate method in Calculator.java following the String Calculator Kata rules. 
The tests in CalculatorTest.java define the expected behavior.
```

### Frontend (TypeScript)

**Files**:
- Implementation: `petclinic-frontend/src/app/calculator/calculator.ts`
- Test: `petclinic-frontend/src/app/calculator/calculator.spec.ts`

**Steps**:

1. Open `calculator.spec.ts` — it has the import but no tests
2. Write tests incrementally:
   ```typescript
   describe('String Calculator', () => {
     it('should return 0 for empty string', () => {
   ```
3. Let Copilot complete each test, then implement `add()` in `calculator.ts`
4. Run tests:
   ```sh
   cd petclinic-frontend
   npm test -- --include='**/calculator*'
   ```

### Discussion Points

- How did Copilot handle the TDD cycle (red → green → refactor)?
- Did you need to adjust suggestions? When?
- Compare the Java and TypeScript implementations — did Copilot produce similar approaches?

---

## Lab 3 - TDD Kata: Invoice Service

**Goal**: A more business-oriented TDD exercise. Calculate invoice totals with discounts and tax.

### The Kata

Implement `calculateTotal` that:
1. Multiplies each item's `price × quantity`
2. Applies the item's `discount` percentage (e.g., 0.10 = 10% off)
3. Sums all discounted line totals
4. Returns the grand total (optionally with VAT via `TaxService`)

### Backend (Java)

**Files**:
- `petclinic-backend/src/main/java/.../invoice/InvoiceService.java` — has `calculateTotal` returning `null`
- `petclinic-backend/src/main/java/.../invoice/Item.java` — record with `name`, `price`, `quantity`, `discount`
- `petclinic-backend/src/main/java/.../invoice/TaxService.java` — provides VAT calculation
- `petclinic-backend/src/test/java/.../invoice/InvoiceServiceTest.java` — empty test class

**Steps**:

1. Open `InvoiceServiceTest.java`
2. Write tests one at a time:
   ```java
   @Test
   void emptyListReturnsZero() {
       assertThat(service.calculateTotal(List.of())).isEqualByComparingTo(BigDecimal.ZERO);
   }
   ```
3. Let Copilot suggest the next test cases (single item, multiple items, discount, etc.)
4. Implement `calculateTotal` assisted by Copilot
5. Run: `./mvnw test -Dtest=InvoiceServiceTest`

### Frontend (TypeScript)

**Files**:
- `petclinic-frontend/src/app/invoice/invoice.service.ts` — returns `0`
- `petclinic-frontend/src/app/invoice/item.model.ts` — `Item` interface
- `petclinic-frontend/src/app/invoice/tax.service.ts` — VAT at 19%
- `petclinic-frontend/src/app/invoice/invoice.service.spec.ts` — empty test suite

**Steps**:

1. Open `invoice.service.spec.ts`
2. Write your first test inside the `describe` block
3. Iterate: write test → implement → refactor
4. Run: `npm test -- --include='**/invoice*'`

### Bonus Challenge

Ask Copilot:
```
Add a method calculateTotalWithVat that uses TaxService to apply VAT after calculating the subtotal.
Write the test first.
```

---

## Lab 4 - Prompt Engineering

**Goal**: Learn how to write effective prompts that produce better Copilot output.

### Exercise 4.1 — Vague vs. Specific Prompts

Try these prompts in Copilot Chat and compare the results:

**Vague** ❌:
```
Add search to the vets page
```

**Specific** ✅:
```
In VetListComponent (petclinic-frontend/src/app/vets/vet-list/vet-list.component.ts), 
add a search input that filters the vets table by last name. 
Use the existing pattern from OwnerListComponent which already has a searchByLastName method.
Follow the same Angular reactive pattern with debounce.
```

Observe how the specific prompt produces more accurate, contextual code.

### Exercise 4.2 — Role-Based Prompting

Try assigning Copilot a role:

```
You are a senior Spring Boot developer. Review the OwnerRestController 
and suggest improvements for error handling, validation, and REST best practices.
```

```
You are a security auditor. Review the security configuration in petclinic-backend.
What vulnerabilities do you see? How would you fix them?
```

### Exercise 4.3 — Step-by-Step Prompting

Break complex tasks into steps:

```
I want to add pagination to the GET /api/owners endpoint. Let's do this step by step:

1. First, update OwnerRepository to support Spring Data Pageable
2. Then update OwnerRestController.listOwners to accept page/size query parameters
3. Update the OwnerDto response to include pagination metadata
4. Finally update the Angular OwnerService and OwnerListComponent

Start with step 1.
```

### Exercise 4.4 — Using Context Effectively

Learn to reference context in your prompts:

```
# Reference files explicitly
Look at #file:openapi.yaml and generate a new endpoint 
for searching visits by date range. Follow the patterns in VisitRestController.
```

```
# Reference selections
# (Select a method first, then ask)
Refactor this method to use Java Streams instead of the for-loop.
```

```
# Reference terminal output
# (After a test failure)
@terminal Fix the failing test based on the error output.
```

### Discussion Points

- What makes a prompt "good"? (Specificity, context, constraints, examples)
- When is it better to use inline completions vs. chat?
- How do you iterate when the first result isn't right?

---

## Lab 5 - Refactoring with Copilot

**Goal**: Use Copilot to refactor real code in the project. Learn the `/fix`, inline chat, and chat-based refactoring workflows.

### Exercise 5.1 — Clean Up the Owner List Component

Open `petclinic-frontend/src/app/owners/owner-list/owner-list.component.ts`.

This component has several code smells:
- Inconsistent formatting (brace style, spacing)  
- Deprecated RxJS subscribe pattern (no error handler in `.subscribe()`)
- Console.log statements left in production code
- Duplicated logic in `searchByLastName`

**Task**: Select the entire `searchByLastName` method and ask Copilot:
```
Refactor this method. Remove console.logs, eliminate the if/else duplication, 
and use modern RxJS patterns with proper error handling.
```

### Exercise 5.2 — Extract a Service Method (Backend)

Open `petclinic-backend/src/main/java/.../rest/OwnerRestController.java`.

The `updateOwner` method manually maps fields one by one:
```java
currentOwner.setAddress(ownerFieldsDto.getAddress());
currentOwner.setCity(ownerFieldsDto.getCity());
currentOwner.setFirstName(ownerFieldsDto.getFirstName());
currentOwner.setLastName(ownerFieldsDto.getLastName());
currentOwner.setTelephone(ownerFieldsDto.getTelephone());
```

**Task**: Ask Copilot:
```
Refactor the updateOwner method to use the OwnerMapper (MapStruct) for mapping 
the OwnerFieldsDto fields onto the existing Owner entity, instead of manually 
setting each field. Check how other controllers handle updates.
```

### Exercise 5.3 — Modernize Angular Component

Pick any component (e.g., `PetListComponent` or `VisitListComponent`) and ask:
```
Refactor this component to use modern Angular practices:
- Replace subscribe() with the async pipe in the template
- Use typed reactive forms if applicable
- Remove any deprecated patterns
```

### Exercise 5.4 — Rename with Copilot

1. Place your cursor on a variable or method name
2. Press `F2` (Rename Symbol) — Copilot can suggest better names
3. Or ask in chat: `Suggest better variable names for the fields in this component`

### Exercise 5.5 — Batch Refactoring with Copilot Edits

Use **Copilot Edits** (the multi-file editing mode) to make a cross-cutting change:
```
Add proper HTTP status codes to all REST controller methods in petclinic-backend. 
Currently some methods return void — they should return ResponseEntity with 
appropriate status codes (200, 201, 204, 404).
```

---

## Lab 6 - Copilot Custom Instructions

**Goal**: Configure Copilot to follow your team's conventions automatically.

### Exercise 6.1 — Create Repository-Level Instructions

Create `.github/copilot-instructions.md` at the project root:

```sh
mkdir -p .github
```

Then create the file with content like:

```markdown
## Project Conventions

### Backend (Java / Spring Boot)
- Use Java 21 features (records, pattern matching, sealed classes) where appropriate
- Follow Spring Boot 3.x conventions
- Use constructor injection via Lombok `@RequiredArgsConstructor` (never field injection)
- Use MapStruct for all DTO ↔ Entity mappings
- Use `ResponseEntity` with proper HTTP status codes in controllers
- Use Bean Validation annotations (`@NotEmpty`, `@Valid`) for input validation
- Write tests with JUnit 5 + AssertJ assertions (not Hamcrest)
- Use `BigDecimal` for monetary values, never `double` or `float`

### Frontend (Angular / TypeScript)
- Use Angular 16 conventions
- Use RxJS operators and the `async` pipe — avoid manual `.subscribe()` where possible
- Use Angular Material components for UI elements
- Use TypeScript strict mode — no `any` types
- Service methods should return `Observable<T>`, not `Promise<T>`

### General
- Prefer immutability — use `final` in Java, `const`/`readonly` in TypeScript
- No console.log in production code
- Write descriptive test names that explain the expected behavior
```

**Test it**: After saving, open a controller and ask Copilot to add a new endpoint. Verify it follows the conventions (constructor injection, ResponseEntity, etc.)

### Exercise 6.2 — Folder-Scoped Instructions

Create a `.instructions.md` file scoped to the test folder:

Create `petclinic-backend/src/test/.instructions.md`:

```markdown
---
applyTo: "**/*Test.java"
---
## Test Conventions
- Use JUnit 5 (`@Test` from `org.junit.jupiter.api`)
- Use AssertJ for assertions (`assertThat(...).isEqualTo(...)`)
- Use `@ExtendWith(MockitoExtension.class)` for mocked tests
- Use `@WebMvcTest` for controller tests with MockMvc
- Test method names: `should_ExpectedBehavior_When_Condition()`
- Use `@DisplayName` for readable test descriptions
- Arrange-Act-Assert pattern in every test
```

Create `petclinic-frontend/src/.instructions.md`:

```markdown
---
applyTo: "**/*.spec.ts"
---
## Angular Test Conventions
- Use Jasmine `describe`/`it` blocks
- Use Angular TestBed for component tests
- Mock HTTP calls with HttpClientTestingModule
- Test names should read as sentences: `it('should display owners when loaded')`
- Use `fakeAsync`/`tick` for async operations
```

**Test it**: Open a test file and ask Copilot to generate a new test. Verify it follows the conventions.

### Exercise 6.3 — Experiment and Iterate

1. Try adding a rule that intentionally conflicts (e.g., "use Hamcrest assertions") and see how Copilot resolves it
2. Add a rule about code comments (e.g., "never add comments that explain *what* — only *why*")
3. Ask Copilot to generate code with and without the instructions file — compare the results

### Discussion Points

- How do custom instructions differ from putting conventions in a prompt each time?
- What's the right level of specificity? Too strict vs. too loose?
- How would you roll these out across a team?

---

## Lab 7 - Generate Tests with Copilot

**Goal**: Use Copilot to generate comprehensive tests for existing code.

### Exercise 7.1 — Generate Unit Tests (Backend)

1. Open `petclinic-backend/src/main/java/.../rest/OwnerRestController.java`
2. In Copilot Chat:
   ```
   /tests Generate comprehensive unit tests for OwnerRestController. 
   Use @WebMvcTest, MockMvc, and mock the repositories with Mockito.
   Cover: list all owners, get by ID, create owner with validation, 
   update owner, delete owner, and error cases (not found).
   ```
3. Review the generated tests — do they compile? Are assertions meaningful?
4. Run the tests and fix any issues with Copilot's help

### Exercise 7.2 — Generate Unit Tests (Frontend)

1. Open `petclinic-frontend/src/app/owners/owner-list/owner-list.component.ts`
2. Ask:
   ```
   /tests Generate Jasmine tests for OwnerListComponent.
   Mock OwnerService using a spy. Test: initial load fetches owners,
   search by last name calls the service, empty search reloads all owners,
   and error handling.
   ```

### Exercise 7.3 — Generate Tests from a Spec

Use the OpenAPI specification to generate tests:
```
Based on #file:openapi.yaml, generate integration tests for the 
/api/owners endpoints. Use @SpringBootTest with TestRestTemplate. 
Cover all status codes defined in the spec (200, 201, 400, 404).
```

### Exercise 7.4 — Test Edge Cases

Select an existing test file and ask:
```
Review these existing tests and suggest missing edge cases. 
What scenarios are not covered? Generate tests for them.
```

### Exercise 7.5 — Property-Based Testing (Bonus)

The project includes **jqwik** (a property-based testing library). Try:
```
This project uses jqwik for property-based testing. 
Write property-based tests for the Calculator.calculate method 
that verify: commutativity of addition, identity element (adding 0), 
and that the result is always >= 0 for positive inputs.
```

---

## Lab 8 - MCP Playwright: E2E Testing

**Goal**: Use the **Playwright MCP server** to write end-to-end browser tests by having Copilot interact with the running application.

### Setup

1. Make sure the application is running (backend on :8080, frontend on :4200)

2. Install Playwright MCP Server — add to your VS Code `settings.json`:
   ```json
   {
     "mcp": {
       "servers": {
         "playwright": {
           "command": "npx",
           "args": ["@playwright/mcp@latest"]
         }
       }
     }
   }
   ```

3. Restart VS Code to activate the MCP server

### Exercise 8.1 — Explore the App with Playwright

In Copilot Chat (Agent mode), ask:
```
Using the Playwright MCP tools, navigate to http://localhost:4200 
and take a screenshot. Describe what you see on the page.
```

Then:
```
Navigate to the Owners page, take a screenshot, and describe 
the table structure and available actions.
```

### Exercise 8.2 — Create an Owner (Interactive)

```
Using Playwright MCP, perform the following on http://localhost:4200:
1. Navigate to the Owners page
2. Click "Add Owner"  
3. Fill in the form with: First Name = "John", Last Name = "Copilot", 
   Address = "123 AI Street", City = "Redmond", Telephone = "1234567890"
4. Submit the form
5. Verify the new owner appears in the owners list
Take a screenshot after each step.
```

### Exercise 8.3 — Generate a Playwright Test Script

After exploring the app, ask Copilot to generate a reusable test:
```
Based on the screenshots and page structure you've seen, generate a 
Playwright test script (TypeScript) that:
1. Opens the PetClinic app
2. Navigates to Owners
3. Searches for owners with last name "Davis"
4. Clicks on the first result
5. Verifies the owner details page shows the correct name
6. Adds a new pet to this owner

Save it as petclinic-frontend/e2e/owners.spec.ts
```

### Exercise 8.4 — Visual Regression Discovery

```
Using Playwright MCP:
1. Navigate to http://localhost:4200/owners
2. Take a screenshot  
3. Search for "Franklin"
4. Take another screenshot
5. Compare what changed on the page and describe the differences
```

### Exercise 8.5 — Full CRUD Flow

```
Using Playwright MCP, test the complete CRUD lifecycle:
1. Create a new owner
2. Add a pet to the owner  
3. Add a visit for the pet
4. Verify all data is displayed correctly
5. Delete the owner
6. Verify the owner no longer appears in the list
Report any bugs or UI issues you discover.
```

### Discussion Points

- How does MCP Playwright compare to writing E2E tests manually?
- When would you use this approach vs. traditional Playwright scripts?
- What are the limitations of AI-driven E2E testing?

---

## Tips & Tricks

### Copilot Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| Accept suggestion | `Tab` | `Tab` |
| Dismiss suggestion | `Esc` | `Esc` |
| Next suggestion | `Alt+]` | `Option+]` |
| Previous suggestion | `Alt+[` | `Option+[` |
| Open Copilot Chat | `Ctrl+Shift+I` | `Cmd+Shift+I` |
| Inline Chat | `Ctrl+I` | `Cmd+I` |

### Useful Chat Commands

| Command | Purpose |
|---------|---------|
| `/explain` | Explain selected code |
| `/fix` | Fix issues in selected code |
| `/tests` | Generate tests for selected code |
| `/doc` | Generate documentation |
| `#workspace` | Ask about the entire codebase |
| `@terminal` | Reference terminal output |
| `#file:path` | Reference a specific file |
| `#selection` | Reference selected code |

### Prompt Engineering Cheat Sheet

| Technique | Example |
|-----------|---------|
| **Be specific** | "Add a `findByCity` method to `OwnerRepository` returning `List<Owner>`" |
| **Provide context** | "Following the pattern in `VetRestController`, add a delete endpoint to..." |
| **Set constraints** | "Use only Java 21 features. No external libraries." |
| **Give examples** | "Like this: `assertThat(result).isEqualTo(expected)`" |
| **Assign a role** | "You are a Spring Security expert. Review this configuration." |
| **Iterate** | "Good, but also handle the case where the list is empty" |

---

## Reference: Project Structure

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Spring Boot | 3.5.9 |
| Backend | Java | 21 |
| Backend | Spring Data JPA | via Spring Boot |
| Backend | MapStruct | 1.6.3 |
| Backend | Lombok | 1.18.36 |
| Backend | OpenAPI / Swagger | springdoc 2.8.15 |
| Frontend | Angular | 16.2.1 |
| Frontend | Angular Material | 16.2.1 |
| Frontend | TypeScript | 4.9.5 |
| Frontend | RxJS | 6.3.1 |
| Database | H2 (dev) / PostgreSQL | Embedded / 16.3 |
| QA | Selenium | 4.31.0 |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/owners` | List owners (optional `?lastName=` filter) |
| GET | `/api/owners/{id}` | Get owner by ID |
| POST | `/api/owners` | Create owner |
| PUT | `/api/owners/{id}` | Update owner |
| DELETE | `/api/owners/{id}` | Delete owner |
| GET | `/api/pets` | List all pets |
| GET | `/api/pets/{id}` | Get pet by ID |
| PUT | `/api/pets/{id}` | Update pet |
| DELETE | `/api/pets/{id}` | Delete pet |
| GET | `/api/vets` | List all vets |
| POST | `/api/vets` | Create vet |
| PUT | `/api/vets/{id}` | Update vet |
| DELETE | `/api/vets/{id}` | Delete vet |
| GET | `/api/pettypes` | List pet types |
| POST | `/api/pettypes` | Create pet type |
| GET | `/api/specialties` | List specialties |
| POST | `/api/specialties` | Create specialty |
| GET | `/api/visits` | List visits |
| POST | `/api/visits` | Create visit |
| POST | `/api/users` | Create user |

### Database

**H2 (Default)** — In-memory, auto-populated at startup  
- Console: http://localhost:8080/h2-console  
- JDBC URL: `jdbc:h2:mem:petclinic` | User: `sa` | Password: _(blank)_

**PostgreSQL** — `spring.profiles.active=postgres`
```sh
cd petclinic-backend && docker-compose --profile postgres up
```

### Security

Disabled by default. Enable with `petclinic.security.enable=true`.  
Roles: `OWNER_ADMIN`, `VET_ADMIN`, `ADMIN` | Default credentials: `admin` / `admin`

