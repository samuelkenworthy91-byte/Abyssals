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
- **Package ID:** `com.abyssals.game` (neutral, reverse-domain, no invented company)
- **Android project:** `android/` (generated via Capacitor, committed for CI)
- **Web assets:** `dist/` → `android/app/src/main/assets/public/` via `npx cap sync`

## Prerequisites

- Node.js 20+
- npm
- Java 21 (Temurin recommended)
- Android SDK (for local builds, or use GitHub Actions)
- Android Studio (optional, for `npx cap open android`)

For CI, GitHub Actions provides Java and Gradle.

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
2. Setup Node 20, npm ci
3. TypeScript check (`tsc -b --noEmit`)
4. Canonical validation (`npm run validate:canon`) — dev warnings allowed, errors fail
5. Tests (`npm run test` if present)
6. Vite build (`npm run build`)
7. Cap sync android
8. Setup Java 21, Gradle
9. Validate Android config (package ID `com.abyssals.game`, SDK versions, permissions)
10. Gradle `assembleDebug`
11. Upload artifact `abyssals-debug-apk` (path `android/app/build/outputs/apk/debug/app-debug.apk`, retention 30 days)

Artifact name: **abyssals-debug-apk**

Download from Actions tab → workflow run → Artifacts.

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

## Version Control

- Branch: `arena/01a0abc2-abyssals`
- Do not merge to main yet
- Commits logical per task §39
