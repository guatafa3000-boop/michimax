# Correctness and project conventions

Review the change to Michimax, a Next.js 16 (App Router) + React 19 + TypeScript demo streaming site for cat shows. Look for real behavioral bugs and for departures from the structure the repo uses. Do not check formatting, lint rules or failing tests; `npm run lint` and `npm test` already cover them.

## Repository rules
- AGENTS.md says this Next.js has breaking changes. Check any new or changed use of Next APIs (routing, `params`, metadata, `next/link`, `next/navigation`, `next/image`, caching, config) against `node_modules/next/dist/docs/`. In this repo `params` is a `Promise` that must be awaited (see `app/titulos/[slug]/page.tsx`).
- Pages live in `app/`, components in `components/`, and each component has a sibling `*.module.css`. Global design variables are in `app/globals.css`. Tailwind and component libraries are not used.
- Data lives in `lib/catalog.ts` (typed `Show`, `Category`, `CategoryId`; helpers `getShow`, `getCategory`, `showsInCategory`). Reuse these helpers rather than re-deriving data. Title pages use `generateStaticParams` with `dynamicParams = false`.
- Add `"use client"` only to components that need state, effects or browser APIs (see `CopyButton.tsx`, which cleans up its timer in an effect). Server components must not use hooks or browser globals.
- Browser-only code such as `navigator` or `document` must not run during render or SSR. `lib/clipboard.ts` shows the guarded pattern.
- Types must be sound, because CI runs `tsc --noEmit` separately. Avoid `any` and unchecked casts that hide real errors. Use the `@/` import alias.

## Severity
- **High/medium (needs a concrete failure):** logic that gives wrong results for a specific input or state, for example a missing slug that throws instead of calling `notFound()`, an unawaited `params`, hooks in a server component, SSR touching `window`, a leaked timer or listener, an off-by-one in catalog filtering, a type error that would fail `tsc`, a broken import or route, or a use of a removed or changed Next API. Also report a change that edits catalog data in a way that breaks invariants (30 titles, 3 stills each, valid `CategoryId`).
- **Low:** naming, file placement that is odd but works, small duplication, style preferences, speculative edge cases that cannot happen with the static catalog.

Review only the diff, not untouched code, unless the change makes a problem newly reachable. The requested change is the scope; do not demand extras it did not ask for. Report all findings at once. If nothing clears the bar, report no findings.
