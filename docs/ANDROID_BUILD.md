# Android Build — Abyssals

This document describes how to produce an Android APK from the same Vite/TypeScript codebase used for browser/PWA.

## Architecture

```
Vite/TypeScript game
  → production web build (dist/)
  → Android wrapper (Capacitor)
  → APK (Gradle)
```

- **No Kotlin rewrite** — same gameplay code for browser, PWA, Android
- **Package ID:** `com.abyssals.game` (neutral, reverse-domain, no invented company) — acceptable for internal/debug testing for now. **Final Android package/application ID must be deliberately locked before any Play Store/public release because changing application identity later is disruptive.** Do not change during this task, but document final locking requirement.
- **Android project:** `android/` (generated via Capacitor, committed for CI)
- **Web assets:** `dist/` → `android/app/src/main/assets/public/` via `npx cap sync`

## Prerequisites

- Node.js 22+ (Capacitor 8.5.2 requires Node >=22, enforced via package.json engines)
- npm
- Java 21 (Temurin recommended)
- Android SDK (for local builds, or use GitHub Actions)
- Android Studio (optional, for `npx cap open android`)

For CI, GitHub Actions provides Node 22, Java 21, Gradle. Local/project requirements consistent with CI via engines field.

## Local Debug Workflow

```bash
# 1. Install
npm install

# 2. Build web
npm run build

# 3. Sync Android wrapper
npm run android:sync
# Equivalent: npm run build && npx cap sync android

# 4. Open in Android Studio (optional)
npm run android:open
# Then build/run from Android Studio

# 5. Or build debug APK via Gradle (no Android Studio needed)
npm run android:build:debug
# Builds: android/app/build/outputs/apk/debug/app-debug.apk

# 6. Shortcut
npm run android:apk
# Builds and echoes APK path
```

### APK Output Path

- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release (future, signed): `android/app/build/outputs/apk/release/`

## Production Web Build

```bash
npm run build
# Validates TypeScript, builds Vite to dist/
```

The web build is the same artifact used for PWA and Android.

## Capacitor Sync

```bash
npx cap sync android
```

- Copies `dist/` → `android/app/src/main/assets/public/`
- Updates Capacitor plugins (`@capacitor/app`, `@capacitor/preferences`)
- Syncs Gradle

## Gradle / APK Build

```bash
cd android
./gradlew assembleDebug
```

Requirements:
- Java 21
- Android SDK with compileSdk 36, targetSdk 36, minSdk 24 (see `android/variables.gradle`)

## Android Studio Workflow

```bash
npm run android:sync
npm run android:open
```

Then in Android Studio:
- Select device/emulator (Pixel family tested)
- Run → builds and installs APK

## GitHub Actions Workflow

File: `.github/workflows/android-apk.yml`

Triggers on push to `arena/*` and `main`, PRs to main, manual dispatch.

Steps:
1. Checkout
2. Setup Node 22 (Capacitor 8 requires >=22), verify engines requirement
3. npm ci
4. TypeScript check (`tsc -b`)
5. Canonical validation DEVELOPMENT BUILD (`npm run validate:dev`) — allows incomplete datasets, fails for fabricated, PROV, test fixture imports
6. Tests (`npm test`) — blocking, 31 tests, failures fail CI (no `|| echo`)
7. Vite build (`npm run build`)
8. Verify production bundle contains no test fixtures (no battleFixtures, TEST_SPECIES, TEST_MOVE, no battleFixtures chunk)
9. Cap sync android (Node 22)
10. Setup Java 21, Gradle
11. Validate Android config (package ID `com.abyssals.game` debug acceptable, must be locked before Play Store release, SDK versions, permissions)
12. Gradle `assembleDebug`
13. Verify production validation correctly fails for missing canonical data (expected until 187 species etc imported)
14. Upload artifact `abyssals-debug-apk` (path `android/app/build/outputs/apk/debug/app-debug.apk`, retention 30 days)

Artifact name: **abyssals-debug-apk**

Download from Actions tab → workflow run → Artifacts.

This workflow is DEVELOPMENT BUILD — uses validate:dev. Future release workflow must use validate:production.

## Signing Placeholder (Release)

For now, only debug APK. For future signed release:

- Do NOT commit keystores, passwords, signing secrets
- Use GitHub Secrets:
  - `ANDROID_KEYSTORE_BASE64` — base64-encoded keystore
  - `ANDROID_KEYSTORE_PASSWORD`
  - `ANDROID_KEY_ALIAS`
  - `ANDROID_KEY_PASSWORD`
- Workflow would decode keystore, configure `android/app/build.gradle` signingConfigs, build `assembleRelease`
- Documented hook, not implemented yet

## Versioning

- **App version source:** `package.json` version — `0.2.0-civeton-corrected`
- **Android versionName:** from `android/app/build.gradle` `versionName` — currently `1.0`, should be synced to package.json version via Capacitor config or Gradle script in future
- **Android versionCode:** from `android/app/build.gradle` `versionCode` — currently `1`, increment strategy: +1 per release, documented in `capacitor.config.ts` and `android/app/build.gradle`

Browser and Android identify same logical game version via `package.json`.

Increment strategy:
- Patch (0.2.x): bug fixes, no canonical data change
- Minor (0.x.0): new slice, new canonical data import, new systems
- Major (x.0.0): major milestone (e.g., 1.0 for full Civeton)

Android versionCode should increment monotonically even if versionName is same — use CI build number or manual increment.

## Mobile Display

- **Orientation:** Game designed for landscape primarily, but handles portrait via responsive CSS (title, dialogue, battle, starter selection use `min()`, `vw/vh`, flex, grid)
- **Safe areas:** `viewport-fit=cover` in `index.html`, CSS `env(safe-area-inset-*)` should be used for notches (future)
- **Status bar / Navigation bar:** Capacitor handles, transparent, game uses full screen
- **Cutouts:** Handled via safe area, important UI not at edges (dialogue bottom 20px, HP top 20px, etc.)
- **Pixel-class screens:** Tested on Pixel family (narrow phone displays), layout uses max-width 800px, centered, not stretched desktop canvas
- **DPR:** Canvas uses fixed 800×600 logical, CSS scales, `image-rendering: pixelated` for crisp
- **Touch:** Unobtrusive virtual d-pad bottom left (50px buttons, rgba 0.5), interact button bottom right 70px circle, not covering important content, replaceable without changing PlayerController

## Touch Controls

- **Keyboard retained** for browser dev (WASD/arrows, E/Space/Enter)
- **Mobile:** Touch hooks in `src/game/game.ts` `setupTouchControls()`:
  - Directional movement: d-pad ▲◀▼▶ queues direction to PlayerController
  - Interaction: tap or E button → tryInteract()
  - Dialogue advance: tap or E button → dialogueUI.advance()
  - Menu selection: click/tap on buttons
  - Battle move selection: tap on move buttons
  - Back/cancel: Android back button context-sensitive (see below)

Controls are replaceable/refinable later without changing PlayerController — touch layer calls `player.queueDirection()` and `tryInteract()`.

## Android Back Button

Handled in `src/game/game.ts` `setupLifecycleHooks()` via `@capacitor/app` `backButton` listener:

- **Dialogue active:** Advance dialogue (not close app)
- **Starter selection active:** Ignored (mandatory) — cannot become Ironman exploit
- **Battle active:** Ignored — cannot close app mid-battle
- **Otherwise:** Exit confirmation → save + return to title (reload) if confirmed

Does not permit back navigation to become Ironman-save exploit — no rollback, only safe state persistence.

## Persistence on Android

Abstracted via `SaveStorage` interface in `src/core/storage/saveStorage.ts`:

- `BrowserSaveStorage`: localStorage (browser)
- `CapacitorSaveStorage`: Capacitor Preferences (Android) with fallback to localStorage for dev

Factory `createSaveStorage()` detects Capacitor native platform.

`PersistenceManager` now uses `SaveStorage` (async) but also sync fallback for title screen speed via localStorage.

Preserves Ironman architecture:
- 3 campaign slots
- Authoritative current state
- commit_seq monotonic
- Recovery generations (backup1, backup2)
- Journal

No easy rollback path — player cannot choose backup, recovery selects highest valid automatically.

Schema consistent between browser and Android — same GameState structure, same JSON.

Existing browser saves do not auto-migrate to Android unless straightforward, but data schema remains consistent.

## App Lifecycle

Handled in `PersistenceManager` and `Game`:

- `visibilitychange`: background → saveGame('app_backgrounded'), foreground → check recovery
- Capacitor `appStateChange`, `pause`, `resume`: save on background/pause
- `beforeunload` as fallback only, not sole dependency (important for Ironman)
- Interrupted battle/state commit: journal ensures atomic, incomplete transaction detection via journal seq > state seq → tries backup

## Permissions

Only required permissions — currently none extra beyond Capacitor default (INTERNET for dev, etc.). No unnecessary permissions added. Check `android/app/src/main/AndroidManifest.xml` (generated by Capacitor) — should not have LOCATION, CAMERA, etc.

## Common Errors

- **Capacitor Preferences not found:** Falls back to localStorage, logs warning — install `@capacitor/preferences`
- **Java version mismatch:** Need Java 21 for Gradle with compileSdk 36
- **Android SDK not found:** Install Android SDK or use GitHub Actions
- **APK not found after build:** Check `android/app/build/outputs/apk/debug/` — ensure `npm run build` succeeded and `npx cap sync` copied assets
- **Package ID mismatch:** Must be `com.abyssals.game` per `capacitor.config.ts` and `android/app/build.gradle`
- **Canonical data missing:** Starter/battle shows development-blocked screen, not invented creatures — import canonical datasets per `ORIGINAL_SOURCE_INVENTORY.md` and `docs/ANDROID_BUILD.md`
- **Validation fails:** `npm run validate:canon` checks for PROV-* IDs, fake species names, dev fixtures leaking — fix before production build

## Testing Current Slice on Android

After correction, verify shell still supports:
1. Title screen (3 slots, responsive)
2. New campaign (childhood)
3. Childhood opening (dialogue retained)
4. Civeton (map, movement, collision)
5. Pate house empty
6. Trade message “Don't follow us.”
7. Kurg sequence (refusal, reveal, starter, battle intro)
8. Starter-selection framework (dev-blocked if canonical missing, test fixtures via dev button)
9. First-battle framework (dev-blocked if trainer missing, test fixtures)
10. Post-battle flow
11. Save/reload (Ironman, no rollback)

Where canonical creature data not yet supplied, starter/battle step marked development-blocked rather than using invented creatures — engine testable via dev fixtures under `src/test/fixtures/` with TEST_SPECIES_A etc., clearly excluded from production, validator fails if leaks.

## Package ID — Final Locking Requirement

- Current debug ID: `com.abyssals.game` — acceptable for internal/debug testing for now per task §5
- **Final Android package/application ID must be deliberately locked before any Play Store/public release because changing application identity later is disruptive**
- Changing applicationId after release breaks updates, Play Store listing, deep links, save data migration, and requires new app listing
- Document final ID decision in `capacitor.config.ts`, `android/app/build.gradle`, and Play Console before public release
- Do not change during this infrastructure fix task

## Security / Dependency Audit (2026-09-16)

Initial `npm install` reported 7 vulnerabilities (5 moderate, 1 high, 1 critical):

- **esbuild <=0.24.2** moderate — dev server request forgery, via vite <=6.4.2 → vite-node → vitest. Runtime: dev dependency only (vite dev server), not in production bundle. Fixed by upgrading vite 5.4.21 → 6.4.3 (major, but compatible, requires Node >=18, we use Node 22)
- **vite <=6.4.2** high — path traversal in optimized deps `.map` handling, launch-editor NTLMv2 hash disclosure, server.fs.deny bypass. Runtime: dev dependency, not production bundle. Fixed by vite 6.4.3
- **vitest <=3.2.5** critical — arbitrary file read/exec when UI server listening, via vite-node. Runtime: dev dependency (test runner), not production bundle. Fixed by vitest 1.6.1 → 5.0.1 (major, Node >=20 required, we use Node 22)
- **@vitest/mocker 2.1.0-4.1.10** moderate — path traversal via redirect mock. Runtime: dev. Fixed by vitest 5.0.1
- **uuid <11.1.1** moderate — buffer bounds check, via xcode → @capacitor/cli 8.5.2. Runtime: @capacitor/cli is dependency (CLI tool, not app runtime bundle, used for sync/open), but still in node_modules. Fixed by overrides uuid ^11.1.1 in package.json
- **@capacitor/cli 8.5.0-8.5.3** moderate — via xcode → uuid. Runtime: CLI tool, not app bundle. Fixed via uuid override, no need to downgrade to 8.4.3 (audit suggested breaking downgrade, we used override instead)

After safe upgrades:
- vite 5.4.21 → 6.4.3
- vitest 1.6.1 → 5.0.1
- overrides: uuid ^11.1.1

Result: `npm audit` → **0 vulnerabilities**

Remaining risk: none known. All fixed without destabilising Capacitor 8.5.2 (still compatible with Node 22). Production bundle (dist) contains only app code, no vite/vitest/uuid runtime.

## Version Control

- Branch: `arena/01a0abc2-abyssals`
- Do not merge to main yet
- Commits logical per task §39
