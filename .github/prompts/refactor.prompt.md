---
name: Method Refactor
description: Refactor selected methods while preserving behavior and API contracts
argument-hint: file paths + method names + goals (readability/performance/cleanup)
agent: agent
---

Refactor only the methods I specify and keep all behavior unchanged.

Inputs I will provide:
- Target file(s)
- Method/function name(s)
- Optional goals (readability, complexity reduction, performance, duplication cleanup)
- Optional constraints (keep signatures, keep comments, no new dependencies, etc.)

Hard requirements:
- Preserve public API contracts, method signatures, side effects, error behavior, and execution order.
- Do not change business logic or observable behavior.
- Keep changes scoped to the requested methods unless a tiny adjacent change is required for correctness.
- Do not add new external dependencies.
- Follow the existing style and conventions of the codebase.
- Keep comments concise and only where they clarify non-obvious intent.

Refactoring approach:
1. Analyze the selected methods for duplication, complexity, naming clarity, and dead/local redundancy.
2. Apply safe refactors (extract helper logic only when useful, simplify conditionals, reduce nesting, improve naming, remove redundant variables).
3. Avoid speculative architecture changes.
4. If a requested refactor is risky, explain why and choose the safest equivalent improvement.

Output format:
1. Updated code (only touched files).
2. Short summary of what changed per method.
3. Risk check: why behavior is preserved.
4. Suggested tests to validate the refactor.