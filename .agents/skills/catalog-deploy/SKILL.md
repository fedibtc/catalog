---
name: catalog-deploy
description: How to add or change a mod in fedibtc/catalog and how to deploy master to production. Use for any catalog PR, any "deploy the catalog" or "push the mods to prod" request, a newMods.json conflict, or a red build check whose log says M bun.lock.
---

# Catalog PRs and deploys

Two branches. `master` is the source of truth and deploys to the Vercel `staging` environment on every push. `vercel/production` serves https://fedi-catalog.vercel.app and only ever advances by merging master. Merging that PR is the production deploy and a human does it on GitHub. An agent opens the PR and never merges it, not with `gh pr merge`, not with `--admin`, and never pushes to vercel/production directly.

## Adding or changing a mod

- one PR per mod into master, from a branch off master. never open a second PR into vercel/production
- the mod lives at `mods/<category>/<id>/meta.json` and must pass the zod schema in `app/lib/schemas.ts`. a mod that fails the schema is silently dropped from the catalog, so check the Vercel preview of the PR before asking for review
- `iconUrl` is a url on the mod's own site. do not copy the image into this repo. pick one a browser can embed from another origin, a favicon or apple touch icon usually works, and check it renders on the Vercel preview. a host that blocks cross-origin embeds with `cross-origin-resource-policy` serves the file fine to curl and still shows a blank card, so trust the preview over a status code
- a PR that adds a mod has its icon loaded in a browser from another origin, so a url only that mod's own site can display fails the PR. every icon is checked the same way on a weekly schedule, and a broken one opens an issue naming the mod, to fix its url or take the mod out
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

3. wait for its checks, then hand over the link. a human merges it on GitHub with a merge commit, never squash or rebase, and never cherry-pick into vercel/production. each of those creates a commit master does not have, the branches stop sharing history, and the next deploy conflicts on every file touched since. production needs one approval from someone other than the last pusher, or the admin bypass in the merge dialog

4. once it is merged, confirm the deploy the same way as staging, with `environment=Production` and https://fedi-catalog.vercel.app as the target

## Lockfile and dependabot

The project uses bun. `bun.lock` is the only lockfile and dependabot runs on the `bun` ecosystem, so its PRs update bun.lock directly. If the `build` check fails with ` M bun.lock` in its log, package.json changed without the lockfile. Run `nix develop -c bun install`, commit bun.lock, and merge that first, because every open PR is red until it lands.

## Running the e2e suite

`nix develop -c bun test:e2e` builds and serves the app locally on port 3023, and reuses whatever already listens there, so check the port is free first. `E2E_BASE_URL=<url>` runs the same suite against a deployed url without building. On a cold deployment the first page load can exceed the navigation timeout. A retry that passes is fine, a repeat failure is not.
