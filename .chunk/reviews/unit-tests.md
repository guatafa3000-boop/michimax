# Unit test quality

Review the tests in the change to Michimax (Vitest 5 + jsdom + Testing Library + `@testing-library/jest-dom`, config in `vitest.config.ts`, setup in `tests/unit/setup.ts`). Tests run and pass or fail elsewhere; you judge whether they actually protect the new behavior. Do not report formatting, lint, or a failing run.

## Repository rules
- Unit tests live in `tests/unit/` as `Name.test.tsx` (components) or `name.test.ts` (lib code), matching `include` in `vitest.config.ts`. Files outside that glob never run.
- Component tests render with Testing Library and query by role, label or text (see `ShowPlayer.test.tsx`, `CopyButton.test.tsx`), the way a user finds elements. Assertions use jest-dom matchers. Use `@/` imports. Cleanup is automatic.
- Browser APIs are stubbed per test with `vi.stubGlobal` and restored in `afterEach` (`vi.restoreAllMocks`, `vi.unstubAllGlobals`). User interaction goes through `@testing-library/user-event`.
- Real catalog data is used through `getShow(...)` rather than hand-copied fixtures. Test names and text are in Spanish, like the rest of the repo.
- The repo asks each feature to ship with tests in `tests/unit/` covering what was built.
- `tests/unit/a11y-helpers.test.ts` covers the helper code in `tests/a11y/`. Changes to those helpers should keep that coverage current.

## Severity
- **High/medium (needs a concrete failure):** new or changed behavior in `components/`, `lib/` or `tests/a11y/` helpers with no test at all, when it has branching logic or user-visible states. Also tests that cannot fail: assertions that are always true, a missing `await` on an async interaction so the assertion never runs, an `expect` inside a callback that is never called, mocks that replace the unit under test, or a stub leaking into other tests because it is not restored. Also a test that asserts the wrong behavior against the spec, or a test file outside the `include` glob. Say which behavior would break unnoticed.
- **Low:** missing edge cases for trivial code, naming, query style preferences (`getByText` vs `getByRole`), small duplication, no tests for pure markup or CSS-only changes.

Review only the diff, not untouched code, unless the change makes a problem newly reachable. The requested change is the scope; do not require tests for behavior it did not add. Report all findings at once. If nothing clears the bar, report no findings.
