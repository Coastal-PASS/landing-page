# Next.js 15 Upgrade Cliff Notes

Source: https://nextjs.org/docs/app/guides/upgrading/version-15

## Required Versions
- Run `npx @next/codemod@canary upgrade latest` to auto-update dependencies and config, or manually run `npm i next@latest react@latest react-dom@latest eslint-config-next@latest`.
- App Router builds expect `react` and `react-dom` >= 19; Pages Router can stay on React 18 but still needs peer warning suppression during install.
- Ensure Node.js is >= 18.17 before starting.

## React 19 Changes That Break 14.x Code
- `useFormState` is deprecated; migrate forms to `useActionState` or expect a warning and follow-up removal.
- `useFormStatus` hooks now expose `{ pending, data, method, action }`, so update destructuring when toggling submit buttons.
- Server Actions rely on React 19 “sibling prewarming”, so review any custom suspense boundaries that assumed the old behavior.

## Async Request APIs
- `headers()`, `cookies()`, `draftMode()`, route `params`, and `searchParams` are asynchronous inside layouts/pages/routes. Wrap references in `await` or convert to `const cookiesStore = await cookies()`.
- Use the provided codemod (`npx @next/codemod async-requests`) if the upgrade output flagged sync usage.

## Install Hygiene
- After dependency bumps, delete `.next`, rerun `npm install`, then execute `npm run lint && npm run build` to surface lingering type errors.
- If peer complaints persist (common with libraries that lag React 19), temporarily add `--legacy-peer-deps` but track the offending packages in the PR description.

Keep this file in your context window whenever you touch `package.json`, `next.config.js`, or React forms during the upgrade.
