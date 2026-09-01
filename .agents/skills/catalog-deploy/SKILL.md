---
name: catalog-deploy
description: How to add or change a mod in fedibtc/catalog and how to deploy master to production. Use for any catalog PR, any "deploy the catalog" or "push the mods to prod" request, a newMods.json conflict, or a red build check whose log says M bun.lock.
---

# Catalog PRs and deploys

Two branches. `master` is the source of truth and deploys to the Vercel `staging` environment on every push. `vercel/production` serves https://fedi-catalog.vercel.app and only ever advances by merging master.

## Adding or changing a mod

- one PR per mod into master, from a branch off master. never open a second PR into vercel/production
- the mod lives at `mods/<category>/<id>/meta.json` and must pass the zod schema in `app/lib/schemas.ts`. a mod that fails the schema is silently dropped from the catalog, so check the Vercel preview of the PR before asking for review
- `newMods.json` is a sliding window of six ids, oldest first. drop the first entry and append the new id. sibling PRs cut from the same base all conflict on this file, so merge them in the order they were opened and merge master into the next one after each merge
- master needs no approvals. a merge commit or a squash are both fine on master

## Deploying to production

1. validate staging. every master push deploys to the Vercel `staging` environment. get its url from the latest staging deployment's status and run the suite against it:

   ```
   id=$(gh api "repos/fedibtc/catalog/deployments?environment=staging&per_page=1" --jq '.[0].id')
   url=$(gh api "repos/fedibtc/catalog/deployments/$id/statuses" --jq '.[0].environment_url')
   E2E_BASE_URL=$url nix develop -c bunx playwright test
   ```

2. open a PR from master into vercel/production. it lists only the commits that landed since the last deploy

   ```
   gh pr create --base vercel/production --head master --title "build: deploy master to production"
   ```

3. merge it with a merge commit, never squash or rebase, and never cherry-pick into vercel/production. each of those creates a commit master does not have, the branches stop sharing history, and the next deploy conflicts on every file touched since. production needs one approval from someone other than the last pusher, or an admin merge:

   ```
   gh pr merge <n> --merge --admin
   ```

4. confirm the deploy the same way as staging, with `environment=Production` and https://fedi-catalog.vercel.app as the target

## Lockfile and dependabot

The project uses bun. `bun.lock` is the only lockfile and dependabot runs on the `bun` ecosystem, so its PRs update bun.lock directly. If the `build` check fails with ` M bun.lock` in its log, package.json changed without the lockfile. Run `nix develop -c bun install`, commit bun.lock, and merge that first, because every open PR is red until it lands.

## Running the e2e suite

`nix develop -c bun test:e2e` builds and serves the app locally. `E2E_BASE_URL=<url>` runs the same suite against a deployed url without building. Against a deployed url a url-filtering test can flake, because third-party mod icons load slowly and a few tests race them. A retry that passes is fine, a repeat failure is not.
