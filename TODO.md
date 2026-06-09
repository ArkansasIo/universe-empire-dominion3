# TODO - Missing Button Functions, Game Logic, and Features

- [x] Audit priority gameplay pages for missing button handlers and placeholder actions
- [ ] Wire missing button handlers to GameContext actions
- [ ] Implement missing game logic in `frontend/src/lib/gameContext.tsx` where UI expects behavior
- [ ] Ensure queue/event/mission/message/alliance interactions are consistent
- [ ] Patch pages with no-op callbacks, disabled placeholders, and unimplemented actions
- [ ] Add frontend tsconfig path alias for `@shared/*`
- [ ] Replace `NodeJS.Timeout` usage in `frontend/src/lib/gameContext.tsx`
- [ ] Add `ignoreDeprecations` setting for `baseUrl` deprecation warning
- [ ] Validate TypeScript diagnostics
- [ ] Run frontend type/build checks and fix compile/runtime issues
- [ ] Final pass: verify major gameplay loops (building, research, units, fleet, market, alliance, messaging)
