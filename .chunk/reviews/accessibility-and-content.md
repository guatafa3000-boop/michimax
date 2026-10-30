# Accessibility and content language

Michimax is a demo built for a CircleCI workshop whose CI runs axe-core through Playwright (`tests/a11y/`, `npm run test:a11y`) on every static route plus pages discovered by following links. That job is not part of the commands run per change, so you are the check for it. Review the changed UI for accessibility regressions and for language and content rules.

## Repository rules
- Every interactive control needs an accessible name. `CopyButton.tsx` appends a `visually-hidden` context span to the button label and announces results through `role="status"`. Follow that pattern for new buttons and async feedback.
- Videos have no audio. `ShowPlayer.tsx` names the video with `aria-label`, gives a text description (`clipDescription`) and a subtitle track (`es-MX`), and respects `prefers-reduced-motion`. Images need meaningful `alt` text; the catalog supplies it per still.
- Use semantic landmarks and one `h1` per page, with heading levels that do not skip. Links and buttons are not interchangeable: links navigate, buttons act. Navigation should use `next/link`, and `NavLinks.tsx` marks the current page.
- Visible text must be in Mexican Spanish. Show titles stay in English. Set `lang` appropriately for any English passage.
- Colors come from the variables in `app/globals.css`. Text and UI must keep WCAG AA contrast, and focus indicators must stay visible. Do not remove outlines without a replacement.
- Keyboard use must work: no click handlers on non-interactive elements without role, tabindex and key handling, and no focus traps.

## Severity
- **High/medium (needs a concrete failure):** a change that axe or a keyboard or screen-reader user would hit. Examples: a button or link with no accessible name, an `img` with no `alt`, a `div onClick` with no keyboard access, a form control with no label, a missing or duplicated `h1` or a skipped heading level, ARIA misuse (invalid role, `aria-labelledby` pointing to a missing id), text or controls with insufficient contrast, a removed focus outline, an autoplaying or moving video that ignores reduced motion, or an interactive result that is not announced. Also report visible English UI copy, other than titles, in a Spanish page. Name the element and the rule it breaks.
- **Low:** wording or accent style, minor heading-order preferences, redundant ARIA that is harmless, contrast that is borderline but not clearly failing.

Review only the diff, not untouched code, unless the change makes a problem newly reachable. The requested change is the scope. Report all findings at once. If nothing clears the bar, report no findings.
