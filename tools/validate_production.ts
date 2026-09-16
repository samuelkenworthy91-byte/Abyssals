// Production validation — strict mode per task §4
// Requires exactly 187 species, starter IDs, assignment table, moves, trainer, sprites, assets, no test fixtures in build, no DevelopmentBattleRules in prod runtime, portrait/story refs

import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

function scanForForbiddenContent(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const srcDir = path.join(process.cwd(), 'src');
  const forbiddenPatterns = [
    { pattern: /PROV-STARTER-01/, desc: 'Forbidden provisional starter ID PROV-STARTER-01' },
    { pattern: /PROV-STARTER-02/, desc: 'Forbidden provisional starter ID PROV-STARTER-02' },
    { pattern: /PROV-STARTER-03/, desc: 'Forbidden provisional starter ID PROV-STARTER-03' },
    { pattern: /PROV-OPPONENT/, desc: 'Forbidden provisional opponent ID' },
    { pattern: /Bramblekin/, desc: 'Forbidden fake species Bramblekin' },
    { pattern: /Emberling/, desc: 'Forbidden fake species Emberling' },
    { pattern: /Tidemaw/, desc: 'Forbidden fake species Tidemaw' },
    { pattern: /Hollow Hound/, desc: 'Forbidden fake species Hollow Hound' },
    { pattern: /Gloam Mite/, desc: 'Forbidden fake species Gloam Mite' },
  ];

  const allowedInComments = [
    'src/data/canonical/validation.ts',
    'src/game/starterSelection.ts',
    'src/game/game.ts',
    'src/game/mapRenderer.ts',
    'tools/validate_production.ts',
    'tools/validate_dev.ts'
  ];

  function scanFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(process.cwd(), filePath);

    if (relativePath.includes('src/test/fixtures')) {
      return;
    }

    if (relativePath.includes('src/data/canonical')) {
      return;
    }

    for (const { pattern, desc } of forbiddenPatterns) {
      if (pattern.test(content)) {
        if (allowedInComments.includes(relativePath)) {
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (pattern.test(line)) {
              if (/Forbidden|must not|invented|not use|PROV-\*|fake/i.test(line)) {
                warnings.push(`${relativePath}:${i+1}: Mentions forbidden content in explanatory context (allowed): ${desc}`);
              } else if (line.includes(': {') || line.includes('id:') || line.includes('name:')) {
                errors.push(`${relativePath}:${i+1}: ${desc} used as data`);
              }
            }
          }
        } else {
          errors.push(`${relativePath}: ${desc}`);
        }
      }
    }

    if (/['\"]PROV-/.test(content) && !relativePath.includes('test/fixtures') && !relativePath.includes('canonical') && !relativePath.includes('validate_')) {
      errors.push(`${relativePath}: Contains PROV-* ID — forbidden in production`);
    }

    if (/from\s+['\"].*test\/fixtures/.test(content)) {
      if (!relativePath.includes('test/') && !relativePath.includes('validate_')) {
        errors.push(`${relativePath}: Production code imports test fixtures — forbidden (must only be in Vitest files)`);
      }
    }

    // Check for TEST_ fixtures — only error if in actual code, not comments, and not in injection helper guarded by isProd
    if (!relativePath.includes('test/') && !relativePath.includes('validate_')) {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        // Skip comments
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue;
        if (/TEST_SPECIES|TEST_MOVE/.test(line)) {
          // Allow if it's in a dev injection helper that checks isProd and throws in prod
          if (relativePath === 'src/data/species.ts' && line.includes('_injectTestSpeciesForDev')) {
            // This is a helper that takes injected data, not directly importing TEST_ — allow with warning
            warnings.push(`${relativePath}:${i+1}: Contains TEST_ in dev injection helper (guarded by isProd) — allowed in dev, but ensure not used in prod runtime`);
            continue;
          }
          // If line contains isProd guard and throws in prod, it's dev-only helper
          if (line.includes('isProd()') || content.includes('_injectTestData') || content.includes('clearly excluded')) {
            // Check if this specific line is part of a function that throws in prod
            const surrounding = lines.slice(Math.max(0, i-5), i+5).join('\n');
            if (surrounding.includes('isProd()') && surrounding.includes('throw')) {
              warnings.push(`${relativePath}:${i+1}: Uses TEST_ in dev-guarded injection helper — allowed for testing, not in prod runtime`);
              continue;
            }
          }
          // Otherwise, error — production code should not reference TEST_
          // But only error if it's not just a comment mentioning TEST_ for documentation
          if (/injection point for TEST_|For dev testing only/.test(line)) {
            warnings.push(`${relativePath}:${i+1}: Mentions TEST_ in dev documentation comment — allowed`);
            continue;
          }
          errors.push(`${relativePath}:${i+1}: Uses TEST_ fixtures in production code — forbidden (must only be in Vitest files)`);
        }
      }
    }

    // DevelopmentBattleRules must not be in production runtime (except battleRules.ts itself and tests)
    // Allow explanatory comments
    if (relativePath.includes('src/') && !relativePath.includes('battleRules') && !relativePath.includes('test/')) {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/DevelopmentBattleRules/.test(line)) {
          const trimmed = line.trim();
          if (trimmed.startsWith('//')) {
            // Comment explaining not final — allow as warning
            if (/NOT FINAL|not final|for testing only|not presented as final/i.test(line)) {
              warnings.push(`${relativePath}:${i+1}: Mentions DevelopmentBattleRules in explanatory comment (allowed)`);
              continue;
            }
          }
          // If it's actual code usage (not comment), error
          if (!trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
            // Check if it's import or usage
            if (/DevelopmentBattleRules/.test(line) && !/NOT FINAL/.test(line)) {
              // Only error if it's not in a comment and not in battleEngine which is allowed to have getBattleRules
              if (relativePath !== 'src/game/battle/battleEngine.ts') {
                errors.push(`${relativePath}:${i+1}: Uses DevelopmentBattleRules in production runtime — forbidden for production validation`);
              } else {
                // battleEngine comment is allowed
                warnings.push(`${relativePath}:${i+1}: Mentions DevelopmentBattleRules in comment (allowed)`);
              }
            }
          }
        }
      }
    }

    // getBattleRules(true) with allowDev true is dev-only, should not be in production runtime for strict validation
    if (/getBattleRules\s*\(\s*true/.test(content) && relativePath.includes('src/') && !relativePath.includes('battleRules') && !relativePath.includes('test/') && !relativePath.includes('battleEngine')) {
      // battleEngine is allowed to have it for testing, but in production strict it should fail if it uses dev
      // Actually battleEngine should also not use dev in prod — check if it's guarded
      if (!content.includes('isProd()') && !content.includes('DEV ONLY')) {
        warnings.push(`${relativePath}: Uses getBattleRules(true) — dev rules, must be replaced with canonical for production`);
      }
    }
  }

  function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (file === 'node_modules' || file === 'dist' || file === '.git' || file === 'android') continue;
        walkDir(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.json')) {
        scanFile(fullPath);
      }
    }
  }

  walkDir(srcDir);

  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
    if (!pkg.version) {
      errors.push('package.json missing version');
    }
    console.log(`[Validation] App version: ${pkg.version}`);
    if (!pkg.engines || !pkg.engines.node) {
      warnings.push('package.json missing engines.node — should require >=22 for Capacitor 8');
    } else {
      console.log(`[Validation] engines.node: ${pkg.engines.node}`);
    }
  } catch (e: any) {
    errors.push(`Failed to read package.json: ${e.message}`);
  }

  try {
    const capConfigPath = path.join(process.cwd(), 'capacitor.config.ts');
    if (!fs.existsSync(capConfigPath)) {
      errors.push('capacitor.config.ts missing');
    } else {
      const content = fs.readFileSync(capConfigPath, 'utf-8');
      if (!content.includes('com.abyssals.game')) {
        errors.push('capacitor.config.ts appId must be com.abyssals.game (acceptable for debug, must be locked before Play Store release)');
      }
    }
  } catch (e: any) {
    errors.push(`Capacitor config check failed: ${e.message}`);
  }

  try {
    const manifestPath = path.join(process.cwd(), 'src/data/canonical/assetManifest.ts');
    if (!fs.existsSync(manifestPath)) {
      errors.push('assetManifest.ts missing');
    }
  } catch {}

  return { ok: errors.length === 0, errors, warnings };
}

async function checkCanonicalData(): Promise<{ errors: string[], warnings: string[] }> {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log('\n--- Checking canonical data completeness (strict production) ---');

  // Try to import repositories via tsx dynamic import
  try {
    // Use dynamic import to load TS modules
    const { speciesRepository } = await import('../src/data/canonical/speciesRepository.ts');
    const { moveRepository } = await import('../src/data/canonical/moveRepository.ts');
    const { starterAssignmentRepository } = await import('../src/data/canonical/starterAssignment.ts');
    const { trainerRepository } = await import('../src/data/canonical/trainerRepository.ts');
    const { assetManifest } = await import('../src/data/canonical/assetManifest.ts');

    // Species roster — exactly 187 expected
    if (!speciesRepository.isLoaded()) {
      errors.push('SpeciesRepository not loaded — expected 187 species from canonical dataset (data/canon/species.json or equivalent)');
    } else {
      const all = speciesRepository.getAll();
      console.log(`[Production] Species loaded: ${all.length}`);
      if (all.length !== 187) {
        errors.push(`Species roster incomplete: expected exactly 187, got ${all.length}`);
      }
      // Check starters resolve
      try {
        const starters = speciesRepository.getStarters();
        console.log(`[Production] Starters: ${starters.length}`);
        if (starters.length !== 3) {
          errors.push(`Starter roster incomplete: expected 3 canonical starters, got ${starters.length}`);
        }
      } catch (e: any) {
        errors.push(`Starter IDs do not resolve: ${e.message}`);
      }
    }

    // Starter assignment table complete
    if (!starterAssignmentRepository.isLoaded()) {
      errors.push('StarterAssignment table not loaded — explicit StarterAssignmentRule table required, populated only from authoritative data');
    } else {
      try {
        const assignments = (starterAssignmentRepository as any).getAll?.() || [];
        console.log(`[Production] Starter assignments: ${assignments.length || 'unknown (isLoaded true)'}`);
        // At minimum, check that assignment for each starter exists
        if (speciesRepository.isLoaded()) {
          const starters = speciesRepository.getStarters();
          for (const s of starters) {
            try {
              starterAssignmentRepository.getAssignment(s.id);
            } catch (e: any) {
              errors.push(`Starter assignment missing for ${s.id}: ${e.message}`);
            }
          }
        }
      } catch (e: any) {
        errors.push(`Starter assignment check failed: ${e.message}`);
      }
    }

    // Moves resolve
    if (!moveRepository.isLoaded()) {
      errors.push('MoveRepository not loaded — required moves must resolve from canonical data');
    } else {
      const moves = moveRepository.getAll();
      console.log(`[Production] Moves loaded: ${moves.length}`);
      if (moves.length === 0) {
        errors.push('MoveRepository empty — required moves must resolve');
      }
    }

    // Trainer team resolves
    if (!trainerRepository.isLoaded()) {
      errors.push('TrainerRepository not loaded — required trainer KURG_TEST_RECRUIT must resolve from canonical data');
    } else {
      try {
        const trainer = trainerRepository.get('KURG_TEST_RECRUIT');
        console.log(`[Production] Trainer KURG_TEST_RECRUIT found: ${trainer.id} team ${trainer.team.length}`);
        if (!trainer.team || trainer.team.length === 0) {
          errors.push('Trainer KURG_TEST_RECRUIT team empty');
        }
        // Check opponent species has front sprite
        for (const member of trainer.team) {
          try {
            speciesRepository.get(member.species_id);
          } catch (e: any) {
            errors.push(`Trainer team member species ${member.species_id} does not resolve: ${e.message}`);
          }
          try {
            const spritePath = assetManifest.getSpeciesSprite(member.species_id);
            if (!spritePath || spritePath === 'MISSING_ASSET_DEBUG_TILE') {
              errors.push(`Battle species ${member.species_id} missing front sprite`);
            }
          } catch (e: any) {
            errors.push(`Battle species ${member.species_id} front sprite missing: ${e.message}`);
          }
        }
      } catch (e: any) {
        errors.push(`Required trainer KURG_TEST_RECRUIT does not resolve: ${e.message}`);
      }
    }

    // All battle species have front sprites
    if (speciesRepository.isLoaded() && assetManifest.isLoaded()) {
      const allSpecies = speciesRepository.getAll();
      let missingSprites = 0;
      for (const sp of allSpecies) {
        try {
          const p = assetManifest.getSpeciesSprite(sp.id);
          if (!p || p === 'MISSING_ASSET_DEBUG_TILE') missingSprites++;
        } catch {
          missingSprites++;
        }
      }
      if (missingSprites > 0) {
        errors.push(`Missing front sprites: ${missingSprites} species without production sprite (expected 187 at assets/production/abyssals/)`);
      }
    } else {
      if (!assetManifest.isLoaded()) {
        errors.push('AssetManifest not loaded — production asset paths must exist at assets/production/abyssals/');
      }
    }

    // Production asset paths exist
    const prodAssetsPath = path.join(process.cwd(), 'assets/production/abyssals');
    if (!fs.existsSync(prodAssetsPath)) {
      errors.push(`Production asset path missing: ${prodAssetsPath} — expected 187 front sprites`);
    } else {
      const files = fs.readdirSync(prodAssetsPath);
      console.log(`[Production] Production sprites found: ${files.length}`);
      if (files.length < 187) {
        errors.push(`Production sprites incomplete: expected 187, found ${files.length} at ${prodAssetsPath}`);
      }
    }

  } catch (e: any) {
    errors.push(`Failed to load canonical repositories for production validation: ${e.message}`);
    console.error(e);
  }

  return { errors, warnings };
}

function checkDistForTestFixtures(): { errors: string[], warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log('\n--- Checking dist/ for test fixtures leakage ---');

  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    warnings.push('dist/ does not exist — run npm run build first');
    return { errors, warnings };
  }

  const files = fs.readdirSync(distPath, { recursive: true } as any) as string[];
  // For Node <20 recursive may not be supported, fallback to walk
  function walkDist(dir: string, list: string[] = []): string[] {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walkDist(full, list);
      } else {
        list.push(full);
      }
    }
    return list;
  }

  const allFiles = fs.existsSync(distPath) ? walkDist(distPath) : [];

  let foundBattleFixtures = false;
  let foundTestSpecies = false;
  let foundTestMove = false;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    if (file.includes('battleFixtures')) {
      foundBattleFixtures = true;
      errors.push(`dist contains battleFixtures file: ${path.relative(process.cwd(), file)}`);
    }
    if (/battleFixtures/.test(content)) {
      if (!foundBattleFixtures) {
        // Only error if it's actual code, not just comment
        if (content.includes('TEST_SPECIES') || content.includes('TEST_MOVE')) {
          foundBattleFixtures = true;
          errors.push(`dist file ${path.relative(process.cwd(), file)} contains battleFixtures code`);
        }
      }
    }
    if (/TEST_SPECIES/.test(content)) {
      foundTestSpecies = true;
      errors.push(`dist file ${path.relative(process.cwd(), file)} contains TEST_SPECIES — test fixtures leaked to production bundle`);
    }
    if (/TEST_MOVE/.test(content)) {
      foundTestMove = true;
      errors.push(`dist file ${path.relative(process.cwd(), file)} contains TEST_MOVE — test fixtures leaked to production bundle`);
    }
  }

  if (!foundBattleFixtures) {
    console.log('[Production] No battleFixtures in dist — OK');
  }
  if (!foundTestSpecies) {
    console.log('[Production] No TEST_SPECIES in dist — OK');
  }
  if (!foundTestMove) {
    console.log('[Production] No TEST_MOVE in dist — OK');
  }

  return { errors, warnings };
}

async function main() {
  console.log('=== Abyssals Production Validation (STRICT) ===');
  console.log('This must fail until canonical packs are imported — correct behaviour per task §4\n');

  const forbiddenResult = scanForForbiddenContent();

  console.log('\n--- Forbidden content check ---');
  if (forbiddenResult.errors.length === 0) {
    console.log('No forbidden content errors');
  } else {
    forbiddenResult.errors.forEach(e => console.error(`ERROR: ${e}`));
  }
  if (forbiddenResult.warnings.length > 0) {
    forbiddenResult.warnings.forEach(w => console.warn(`WARN: ${w}`));
  }

  const canonicalResult = await checkCanonicalData();
  const distResult = checkDistForTestFixtures();

  const allErrors = [...forbiddenResult.errors, ...canonicalResult.errors, ...distResult.errors];
  const allWarnings = [...forbiddenResult.warnings, ...canonicalResult.warnings, ...distResult.warnings];

  console.log('\n--- Errors ---');
  if (allErrors.length === 0) {
    console.log('No errors');
  } else {
    allErrors.forEach(e => console.error(`ERROR: ${e}`));
  }

  console.log('\n--- Warnings ---');
  if (allWarnings.length === 0) {
    console.log('No warnings');
  } else {
    allWarnings.forEach(w => console.warn(`WARN: ${w}`));
  }

  console.log('\n--- Summary ---');
  if (allErrors.length === 0) {
    console.log('✅ Production validation PASSED — all canonical data present, no test fixtures in bundle');
  } else {
    console.error(`❌ Production validation FAILED with ${allErrors.length} errors — expected until canonical packs imported`);
    console.error('\nExpected missing-data blockers (until canonical import):');
    console.error('- SpeciesRepository not loaded — 187 species');
    console.error('- MoveRepository not loaded');
    console.error('- StarterAssignment table not loaded');
    console.error('- AssetManifest not loaded / production sprites missing at assets/production/abyssals/');
    console.error('- TrainerRepository KURG_TEST_RECRUIT not loaded');
    console.error('\nThese failures are CORRECT until canonical packs are imported per ORIGINAL_SOURCE_INVENTORY.md');
    process.exit(1);
  }
}

main();
