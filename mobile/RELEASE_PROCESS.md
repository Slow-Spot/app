# Release Process (US/EU stores)

## Versioning
- Use Semantic Versioning (MAJOR.MINOR.PATCH).
- Storage schema changes: bump STORAGE_SCHEMA_VERSION in `src/services/storage.ts`; patch/minor/major aligned with app change impact.

## Conventional Commits
- `feat: ...` new user-facing functionality
- `fix: ...` bug fixes
- `chore: ...` tooling/docs/non-prod changes
- `refactor: ...` code-only refactors
- `perf: ...` performance improvements
- `docs: ...` documentation only
- `revert: ...` revert commit

## Semantic Release (to wire in CI)
1) Install dev deps: `npm i -D semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/npm @semantic-release/exec conventional-changelog-conventionalcommits`.
2) Add script: `"release": "semantic-release"` to `package.json`.
3) Create `.releaserc` with plugins:
   - `@semantic-release/commit-analyzer` (preset conventionalcommits)
   - `@semantic-release/release-notes-generator`
   - `@semantic-release/changelog`
   - `@semantic-release/npm` (to bump package version)
   - `@semantic-release/git` (commit CHANGELOG/package.json)
4) Protect branches: release from `main`; add CI step after tests/build.
5) Tagging: semantic-release will tag (e.g., `v1.2.3`) and update CHANGELOG.md.

## App/Store Version Alignment
- `app.json` `expo.version` must match released semver.
- `eas.json` / store submissions should use the same version + build numbers per platform (iOS buildNumber, Android versionCode) when updated.

## Data Schema Checklist
- On schema change: update STORAGE_SCHEMA_VERSION and add migration in `ensureStorageSchema`.
- Keep backward compatibility across OTA updates (Expo updates) by running migrations on app start.

## Submission Preflight (US/EU)
- Confirm notification icon set (Android): `app.json -> android.notification.icon`.
- Confirm privacy: “no data collected” declared in Play Console and App Store Connect.
- Confirm localization strings for supported languages; store listings localized at minimum EN + target EU languages.
- Run `npm run lint && npm test` (if present) and `expo-doctor` prior to release.
