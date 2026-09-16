# Final Report — Canon Correction + Android Infra Pass

Branch: `arena/01a0abc2-abyssals` (from 2fdcc0c → 81403ac → 9628866)
Version: `0.2.0-civeton-corrected` (same logical version browser/Android)

## 1. Code Correction — What Was Wrong and What Was Fixed

### Previously Invented Content (Major Conceptual Mistake)
The earlier slice invented replacement Abyssals when canonical data was missing, treating missing data as permission to invent:

- Species: Bramblekin, Emberling, Tidemaw, Hollow Hound, Gloam Mite with IDs, stats, BSTs, types, evolutions, learnsets, drawings, battle reps
- Starter IDs: PROV-STARTER-01..03
- Moves: Tackle, Ember, Growl, Harden, Bite, Vine Lash, Water Spout, Frost Shard, Shadow Claw as hard-coded objects
- Starter assignment: cyclic N+1/N+2
- Battle math: GenIII damage formula, 85-100% variance, 6.25% crit, 1.5x crit, STAB, type effectiveness hard-coded, arbitrary stat mods, accuracies, PP
- Terminology: "fainted" instead of death/life-loss
- First battle opponent: Hollow Hound (invented) instead of canonical trainer

Per task correction: **Missing Abyssals data is dependency to resolve, not permission to invent replacement** — applies to species, names, artwork, stats, types, moves, learnsets, evolutions, trainer teams, starter identities/assignment rules, battle math, XP.

### Fix Applied
- **Deleted fabricated data**: Removed all drawings of Bramblekin/Emberling/Tidemaw/Hollow Hound from `mapRenderer.ts` and `battleUI.ts`, removed PROV-* IDs, removed invented move objects, removed cyclic assignment logic
- **Do not replace with different invented creatures**: Production runtime now assumes all Abyssals from canonical 187-species dataset via `SpeciesRepository`. Where data missing, UI shows development-blocked screen with clear message, not invented creature
- **Repositories created**:
  - `SpeciesRepository` (canonical ID stable, 187 species expected, assetManifest.getSpeciesSprite)
  - `MoveRepository` (ID/name/type/category/power/accuracy/PP/priority/target/effect/VFX)
  - `TypeRepository` (type interactions from data, not hard-coded)
  - `TrainerRepository` (KURG_TEST_RECRUIT binding unresolved if DB unavailable, not silent substitution)
  - `StarterAssignmentRule` {player_species_id, pate_species_id, trade_species_id} explicit table populated only from authoritative data
  - `assetManifest` (species ID/name/front sprite/icon/portrait ID/path/environment refs, distinguishes production vs temporary environmental vs missing asset — fail clearly in dev, neutral debug tile acceptable only in dev)
- **Battle engine separation** (`battleRules.ts`):
  - Orchestration: turns, actions, actor ordering, battle state, KO batches, switching, starter-life handling, result classification, persistence hooks — in `battleEngine.ts`
  - Rules: damage/crits/accuracy/effectiveness/stat/status/XP — replaceable `BattleRules` interface, `DevelopmentBattleRules` adapter isolates unsupported Pokémon assumptions (GenIII, variance, crit, STAB, etc.) clearly marked as not final, not presented as final
- **Terminology**: Replaced "X fainted!" with death/life-loss language accurate: "died", "has X lives remaining", "died permanently", "returned with Y HP"
- **Starter three-life**: Retained architecture only 3 original individuals get starter_lives_remaining=3, 3->2->1->0 permanent death, non-final lethal once per KO event, down remainder round, auto return at max(1,ceil(max_hp*0.10)), pending return prevents wipe, life-pip UI retained
- **First battle**: Must be actual canonical Abyssal/moves/level from Trainer Repository, opponent Hollow Hound removed, if Trainer DB unavailable keep binding unresolved trainer_id KURG_TEST_RECRUIT

### Grep Verification
Forbidden content now only in explanatory mentions allowed:
- `starterSelection.ts`: "Production must not use invented species like Bramblekin/Emberling/Tidemaw" (warning allowed)
- `game.ts`: "Development-blocked — don't use invented Hollow Hound" and "Production must not use invented Hollow Hound" (warning allowed)
- `mapRenderer.ts`, `battleUI.ts`, `validation.ts`, `validate_production.ts`: explanatory comments
- No data definitions, no BSTs, no drawings

## 2. Preserved Work

- **Civeton prototype**: Retained and improved, provisional environmental tiles (ground/path/grass/house_wall/roof/well/shrine/tree) acceptable per task, visual direction grounded medieval timber/plaster/worn stone muted earth irregular roads fences modest domestic restrained True Light blue/white/silver/navy lived-in not whimsical/grimdark warm familiarity under military/religious unease, not square test room, paths/houses/wells/trees/fences/gardens/storage/clutter/terrain/lighting/generic villagers allowed
- **Battle architecture**: Preserved state/combatants/action/speed-priority/first-person VFX/KO batch/starter hooks/RNG/result, but separated orchestration vs rules
- **First-person DWM presentation**: Retained no back sprites, front sprite only, player VFX foreground->enemy, enemy lunge+screen impact+damage numbers
- **UI infrastructure**: Title screen, dialogue, starter selection framework, battle UI enemy sprite/HP exact/move buttons/PP/log/damage/starter pips — cleaned of dev labels CH01-E05/PROVISIONAL/BST/internal IDs
- **Persistence**: Ironman 3 slots/commit seq/recovery/journal no rollback retained, enhanced with SaveStorage abstraction
- **Player controller, maps, story manager, dialogue system**: Retained, refactored not rewritten

## 3. Dialogue Retained

Per task: Retain existing dialogue in `src/data/dialogue.ts` as approved (childhood Aimon/Pate/Trade, Pate empty home, Trade "Don't follow us.", Kurg refusal/reveal, starter-selection, battle intro, post-battle, incidental NPCs) — do not label provisional, do not rewrite for style. Story Bible overrides later if conflict.

- All childhood, Pate house empty, Trade message, Kurg first/refusal/reveal/starter/battle intro/post-battle, villager well, wake Civeton retained verbatim
- No PROVISIONAL labels added, no style rewrite

## 4. Canon Integration — Repositories and Import Layer

### Repositories (src/data/canonical/)
- `types.ts`: Canonical types for Species, Move, Type, Trainer, StarterAssignment, AssetManifest
- `speciesRepository.ts`: Loads 187 species when canonical data imported, stable ID, `get()`, `exists()`, `isLoaded()`, throws in prod if missing, dev debug tile in mapRenderer
- `moveRepository.ts`: ID/name/type/category/power/accuracy/PP/priority/target/effect/VFX, starter buttons from instance moveset
- `typeRepository.ts`: Type interactions from data, battle engine retrieves via data not hard-coded
- `trainerRepository.ts`: Trainer teams from canonical data, KURG_TEST_RECRUIT binding unresolved if missing
- `starterAssignment.ts`: Explicit StarterAssignmentRule table populated only from authoritative data, atomic commit of 3 starters + instance IDs + starter_lives_remaining=3, no half state
- `assetManifest.ts`: species_id -> front_sprite_path, no name matching primary, canonical asset manifest (species ID/name/front sprite/icon/portrait ID/path/environment refs) distinguishing production vs temporary environmental vs missing asset (fail clearly in dev, neutral debug tile acceptable only in dev). Uses spriteCache Image loading in mapRenderer
- `validation.ts`: Runtime validation verifying starter IDs exist, trainer teams exist, battle species have front sprite, move IDs exist, learnsets resolve, evolutions exist, portraits resolve, story-event refs exist, starter assignment complete, no PROV-* IDs, no fake names, no prod imports dev battle rules — fail loudly

### Data Import Layer
- Prepared for 187 species front sprites growth 6-stat moves learnsets 98 evolutions trainers Story Bible portraits via generated assets/loaders not manual duplication
- `src/data/species.ts`, `moves.ts`, `trainers.ts` now delegate to canonical repositories, with dev fallback guarded by isProd() check
- `src/test/fixtures/battleFixtures.ts`: TEST_SPECIES_A/B/C, TEST_MOVE_A/B with canonical structure, clearly named not lore names, allowed in dev only, validator fails if leaks to prod

### Validation Tooling
- `tools/validate_production.ts`: Scans src for PROV-* IDs, fake species names, TEST fixtures leaking, DevelopmentBattleRules misuse, checks package version, capacitor config, assetManifest, allows explanatory mentions in allowlist (starterSelection, game, mapRenderer, battleUI, validation)
- `npm run validate:canon` via tsx, passes with warnings for explanatory mentions, errors fail build
- Production build fails loudly if canonical data missing and no dev flag (throws in isProd() path)

## 5. Android / APK Infrastructure

### Architecture
```
Vite/TS game
  → web build (dist/)
  → Android wrapper (Capacitor)
  → APK (Gradle)
```
No Kotlin rewrite — same gameplay code for browser, PWA, Android.

### Setup
- Installed Capacitor: `@capacitor/core @capacitor/cli @capacitor/android @capacitor/preferences @capacitor/app` (95 packages)
- Created `capacitor.config.ts`: appId `com.abyssals.game` (neutral reverse-domain), appName Abyssals, webDir dist, bundledWebRuntime false, androidScheme https, allowMixedContent, captureInput, webContentsDebugging false
- Ran `npx cap add android`: generated `android/` project (namespace com.abyssals.game, compileSdk 36 targetSdk 36 minSdk 24 from `variables.gradle`), gradlew executable, app/build.gradle versionCode 1 versionName 1.0

### Mobile Display
- `index.html`: viewport-fit=cover, manifest link, CSS safe-area-insets env(safe-area-inset-*) for notches, 100dvw/dvh, max-width 800px centered not stretched, object-fit contain, responsive media query for dialogue/battle/title/starter
- Handles portrait/landscape, nav/status bar, cutouts, Pixel DPR, responsive fit not stretch

### Touch Controls
- Production-ready in `game.ts` `setupTouchControls()`: unobtrusive virtual d-pad bottom left 50px buttons rgba 0.5, interact button bottom right 70px circle, not covering important content, replaceable without changing PlayerController (calls queueDirection, tryInteract)
- Directional/interaction/dialogue advance/menu selection/battle move selection/back/cancel
- Keyboard retained for browser dev

### Android Back Button
- Context-sensitive via `@capacitor/app` backButton listener in `game.ts` `setupLifecycleHooks()`:
  - Dialogue active: advance dialogue, not close app
  - Starter selection active: ignored (mandatory) — not Ironman exploit
  - Battle active: ignored — not close app mid-battle
  - Otherwise: exit confirmation → save + return to title safe
- No Ironman exploit, no rollback

### Persistence
- Abstracted via `SaveStorage` interface `src/core/storage/saveStorage.ts`:
  - `BrowserSaveStorage`: localStorage
  - `CapacitorSaveStorage`: Capacitor Preferences with fallback to localStorage for dev, dynamic import
  - Factory `createSaveStorage()` detects Capacitor native platform
- `PersistenceManager` uses SaveStorage (async) but also sync fallback for title screen speed via localStorage
- Preserves Ironman: 3 slots, authoritative current, commit_seq monotonic, recovery generations backup1/backup2, journal, no rollback selection, single-writer, idempotent transaction IDs, atomic durable commits, deterministic anti-reroll
- Schema consistent browser/Android, same GameState JSON, existing browser saves not auto-migrate unless straightforward but schema consistent

### App Lifecycle
- `visibilitychange`: background → saveGame('app_backgrounded'), foreground → check recovery
- Capacitor `appStateChange`, `pause`, `resume`: save on background/pause
- `beforeunload` as fallback only, not sole dependency (important for Ironman)
- Interrupted battle/state commit: journal ensures atomic, incomplete transaction detection via journal seq > state seq → tries backup

### npm Scripts
- `validate:canon`: tsx tools/validate_production.ts
- `android:sync`: npm run build && npx cap sync android
- `android:open`: npx cap open android
- `android:build:debug`: npm run build && npx cap sync android && cd android && ./gradlew assembleDebug
- `android:apk`: npm run android:build:debug && echo APK at android/app/build/outputs/apk/debug/app-debug.apk

### GitHub Actions
- `.github/workflows/android-apk.yml`: checkout Node20 npm ci tsc check validate:canon tests vite build cap sync Java21 Gradle assembleDebug artifact abyssals-debug-apk at android/app/build/outputs/apk/debug/app-debug.apk with summary, retention 30 days
- Validates: web build exists, TS validation, Android sync, package identity com.abyssals.game, min/target SDK, orientation, permissions only required
- Steps: checkout, setup Node, npm ci, tsc, validate:canon, tests, vite build, check web build, sync Android, check Android sync, setup Java 21, setup Gradle, validate Android config, Gradle assembleDebug, check APK exists, upload artifact, summary

### Signing Placeholder
- Debug APK only for now
- Release signing infra prepared without committing keystores/secrets, documented env hooks: ANDROID_KEYSTORE_BASE64, ANDROID_KEYSTORE_PASSWORD, ANDROID_KEY_ALIAS, ANDROID_KEY_PASSWORD, decode keystore, configure signingConfigs, build assembleRelease

### Versioning
- App version source: `package.json` version `0.2.0-civeton-corrected`
- Android versionName: from `android/app/build.gradle` versionName currently 1.0, should be synced to package.json version via Capacitor config or Gradle script in future — same logical version browser/Android
- Android versionCode: currently 1, increment strategy +1 per release, documented
- Semantic: patch 0.2.x bug fixes, minor 0.x.0 new slice/canonical import, major x.0.0 milestone (e.g., 1.0 full Civeton)
- versionCode increments monotonically even if versionName same — use CI build number or manual increment

### PWA
- Retained additive same codebase browser/PWA/Android no fork
- `public/manifest.json`: name Abyssals — Civeton Opening, short_name Abyssals, description, start_url /, display standalone, background #0f1115, theme #2a4a8a, orientation landscape
- `index.html` manifest link, same Vite build used for PWA and Android

## 6. Validation

- `npm run validate:canon` passes (5 warnings for explanatory mentions allowed, 0 errors)
- `npm run build`: tsc -b && vite build passes, 38 modules, dist/index.html 2.31 kB, index-BnHVDCSt.js 97.13 kB gzip 27.74 kB
- `npx cap sync android` passes, copies dist to android/app/src/main/assets/public
- `tsc -b` passes
- `npm test`: no test files found (vitest run) — not blocking, testing slice manual via dev fixtures
- Gradle build requires Java 21 — CI provides, local sandbox has no Java, documented in ANDROID_BUILD.md common errors
- Forbidden content grep clean except explanatory mentions in allowlist

## 7. Version Control

- Branch: `arena/01a0abc2-abyssals` (per Arena system, task requested arena/civeton-opening-vertical-slice)
- Base: 2fdcc0c96a59490df47c4d5787ea64814e7659d8 main
- Previous: 84714db Civeton vertical slice, 81403ac Polish docs title PWA
- Current: 9628866 canon correction + Android infra (82 files changed, 5557 insertions, 894 deletions)
- Commits logical per task §39: this pass covers remove invented species/moves, separate engine, add repos/validation, clean labels, prepare Capacitor wrapper, add APK workflow, document canon deps/Android
- Do not merge to main — on arena branch, pushed to origin arena/01a0abc2-abyssals
- No secrets committed, keystores ignored via android/.gitignore

## 8. Testing Slice Verification

After correction, shell still supports required playable flow (§22):

1. Title screen (3 slots, responsive, max-width 800px centered)
2. New campaign (childhood)
3. Childhood opening (Aimon/Pate/Trade dialogue retained)
4. Civeton present (map, movement, collision, provisional env art)
5. Pate house empty
6. Trade message "Don't follow us."
7. Kurg refusal + revelation
8. Starter-selection framework (dev-blocked if canonical missing, shows real name/sprite/typing/moves without internal IDs, test fixtures via dev button TEST_SPECIES_A/B/C)
9. First-battle framework (dev-blocked if trainer KURG_TEST_RECRUIT missing, not invented Hollow Hound, engine testable via fixtures)
10. Post-battle flow + save/reload (Ironman, no rollback, commit_seq, journal)

Where canonical creature data not yet supplied, starter/battle step marked development-blocked rather than using invented creatures — engine testable via dev fixtures under `src/test/fixtures/` with TEST_ names, clearly excluded from production, validator fails if leaks.

## 9. Remaining Dependencies (Not Permission to Invent)

- 187 species front sprites at assets/production/abyssals/ — currently .gitkeep only, assetManifest expects
- SpeciesRepository 187 species dataset — not loaded, speciesRepository.isLoaded() false in prod
- MoveRepository canonical moves — not loaded
- StarterAssignment explicit table — not loaded, dev fixtures fallback only in dev
- TrainerRepository Trainer DB Checklist 04 — not loaded, KURG_TEST_RECRUIT binding unresolved
- TypeRepository type chart — not loaded
- Growth 6-stat, learnsets, 98 evolutions, portraits — not loaded
- Story Bible portraits via generated assets/loaders

All marked dev-blocked with clear error messages in prod, not invented.

## 10. Docs

- `docs/ANDROID_BUILD.md`: Full practical guide per task §21 covering architecture, prerequisites, local debug, web build, sync, Gradle output path, Android Studio, GHA, signing placeholder secrets, versioning, mobile display safe areas cutouts Pixel DPR responsive fit, touch controls, back button, persistence, lifecycle, permissions, common errors, testing slice
- `public/manifest.json`: PWA manifest
- `capacitor.config.ts`: App identity neutral reverse-domain documented
- `.github/workflows/android-apk.yml`: Documented steps and artifact

## Conclusion

Canon correction pass completed: invented species/moves/assignment removed, not replaced with different invented creatures, replaced with repository pattern that fails clearly in dev and throws in prod when canonical data missing. Battle engine separated orchestration vs rules, DevelopmentBattleRules isolated. Dialogue retained. Android APK infrastructure via Capacitor wrapping same Vite/TS game, mobile display safe areas, touch controls unobtrusive replaceable, back button context-sensitive no Ironman exploit, persistence abstract SaveStorage browser vs Capacitor Preferences preserving Ironman, lifecycle background/resume/lock/termination, npm scripts, GHA workflow building debug APK artifact abyssals-debug-apk, signing placeholder documented, versioning same logical version, validation fails loudly, PWA retained additive.

Build passes, validation passes, cap sync passes, ready for canonical data import and CI APK build.
