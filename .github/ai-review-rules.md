# AI Review — Project-Specific Rules

These rules are appended to the system prompt that the AI reviewer uses on every
Pull Request. The general checks (bugs, security, performance, ...) always run;
this file lets you layer project conventions on top.

Edit freely — the file is read fresh from the PR head on every run.
Delete this file (or empty it) to disable project-specific rules.

---

## Example: Angular 19+ / TypeScript

- Use **Signals** when appropriate; prefer them over `BehaviorSubject` for component state.
- Prefer **standalone components**; flag new modules unless clearly needed.
- Follow the existing project architecture and naming conventions.
- Prefer reusable components over duplicated markup/logic.
- **Avoid business logic inside templates** — move it to the component or a service.
- Use RxJS operators correctly; avoid nested subscriptions; always unsubscribe (or use `takeUntilDestroyed` / async pipe).
- Avoid `any` unless absolutely required; prefer explicit interfaces and generics.
- Keep components thin; push business logic into services.
- Use **theme variables** (CSS custom properties) instead of hardcoded colors so dark/light mode keeps working.
- Do not break i18n — flag hardcoded user-facing strings.
- Enforce accessibility: ARIA labels, keyboard navigation, semantic HTML.

## Tips

- Keep this list short and concrete. Long rule sets dilute the model's attention.
- Phrase rules as **what to flag**, not abstract philosophy.
- Bad: "Write clean code." Good: "Flag functions longer than 50 lines or with cyclomatic complexity > 10."
