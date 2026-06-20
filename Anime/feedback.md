# HIKARI Scaffold — Plan Re-Review

**Reviewer:** claude-reviewer
**Date:** 2026-06-20 12:30:00+05:30
**Verdict:** APPROVED

> See the recent git history of this file for context. Prior review (2728a7c) returned CHANGES NEEDED with three findings. Doer addressed all three in commit 9867609.

---

## Finding 1: Phase 2 Tier Monotonicity — RESOLVED

Phase 2 now reads: T6 (cheap), T7 (cheap), T8 (cheap), T9 (standard), T10 (standard), T11 (standard), T12 (standard). The old T12 (folder stubs, cheap) was promoted to T8, and the former T8–T11 renumbered to T9–T12. Tier sequence is monotonically non-decreasing: cheap → cheap → cheap → standard → standard → standard → standard.

PLAN.md and progress.json are fully consistent — IDs, titles, tiers, and phases match across both files. No stale references from the old numbering remain.

PASS.

---

## Finding 2: Phase 5 Hidden Dependencies — RESOLVED

The CSS port task is now T23 (first in Phase 5), with blocker "Phase 4 complete." All subsequent Phase 5 tasks list T23 as an explicit blocker:

- T24 (nav/ticker/hero): blockers T23
- T25 (grid/categories/seller/footer): blockers T23, T24
- T26 (canvas motes): blockers T23, T24
- T27 (ticker animation): blockers T23, T24

This eliminates the hidden dependency — no component task can begin until the CSS foundation (design tokens, hand-written styles) is in place. T25 additionally depends on T24, which is sensible since T24 establishes the component-conversion pattern that T25 follows for the remaining sections.

PASS.

---

## Finding 3: Phase 5 Specifications — RESOLVED

**(a) Canvas animation cleanup:** T26's done criteria now explicitly require: "`useEffect` cleanup cancels animation frame via `cancelAnimationFrame`, removes resize event listener, and nullifies canvas context on unmount." This directly addresses risk R4 (memory leaks from raw DOM in React) with verifiable cleanup steps. progress.json T26's notes mirror this requirement.

**(b) CSS specificity strategy:** T23's description now includes the decision in bold: "landing page styles remain hand-written CSS in a single stylesheet — do NOT convert to Tailwind utilities. Tailwind is used only for new app pages." The done criteria require "design tokens defined as `:root` CSS custom properties in `landing.css`; all landing styles are hand-written CSS, not Tailwind." R5 in the risk register is updated to match this decision, noting that component class names are scoped by existing prefixes (`.card`, `.hero`, `.seller`, etc.).

The ambiguity from the prior review's "stylesheet or Tailwind" is fully resolved — the approach is now explicit and two developers would implement it the same way.

PASS.

---

## R7 Risk Entry — RESOLVED

R7 has been added to the risk register: "`hikari-landing.html` reference file missing or modified during sprint." Impact: Phase 5 port has no stable reference. Likelihood: Low. Mitigation: file committed to `sprint/scaffold` and frozen for the sprint; design changes require a separate update commit before Phase 5 tasks resume. This is adequate.

PASS.

---

## Final Pass: New Issues from Reorder

Checked the full plan for regressions introduced by the reorder:

- **Dependency integrity:** All blockers in Phase 2 (T8→T6, T9→T7, T10→T7, T11→T10, T12→T9+T10+T11) and Phase 5 (T23→Phase 4, T24→T23, T25→T23+T24, T26→T23+T24, T27→T23+T24) are topologically valid. No circular or forward references.
- **ID uniqueness:** T1–T27 and V1–V5 are sequential with no duplicates or gaps.
- **VERIFY placement:** V1–V5 each appear at the end of their respective phase, after all implementation tasks. No verify step was displaced by the reorder.
- **PLAN.md ↔ progress.json consistency:** All 27 tasks and 5 verify entries match in ID, title, phase, tier, and type across both files.
- **Cross-phase dependencies:** Phase 3 requires "Phase 2 complete," Phase 4 requires "Phase 1 complete," Phase 5 requires "Phase 4 complete" — all still correct after renumbering.

No new issues found.

PASS.

---

## Summary

All three prior findings (tier monotonicity, hidden dependencies, Phase 5 specs) are fully resolved. The suggested R7 risk entry has been added. PLAN.md and progress.json are consistent, dependency chains are valid, and no regressions were introduced by the reorder.

The plan is ready for implementation.
