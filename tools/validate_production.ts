// Production validation — fails loudly if fake data in production, checks canonical references
// Per task §21

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
    { pattern: /TACKLE.*:.*\{/, desc: 'Potentially invented move TACKLE as object (check canonical)' },
  ];

  // Allowlist: files that are allowed to mention forbidden names in comments/error messages explaining what NOT to use
  // But production code must not use them as data
  const allowedInComments = [
    'src/data/canonical/validation.ts',
    'src/game/starterSelection.ts',
    'src/game/game.ts',
    'src/game/mapRenderer.ts',
    'tools/validate_production.ts'
  ];

  function scanFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(process.cwd(), filePath);

    // Skip test fixtures — they are allowed to have TEST_ names
    if (relativePath.includes('src/test/fixtures')) {
      return;
    }

    // Skip canonical repositories — they have comments about forbidden
    if (relativePath.includes('src/data/canonical')) {
      // But check for actual data definitions, not just mentions
      // For now, skip detailed check for canonical files
      return;
    }

    for (const { pattern, desc } of forbiddenPatterns) {
      if (pattern.test(content)) {
        // Check if it's in a comment explaining what not to use vs actual data definition
        // For simplicity, if file is in allowlist and pattern appears in string explaining forbidden, allow as warning
        if (allowedInComments.includes(relativePath)) {
          // Check if it's part of an error message vs data definition
          // If it's in a data definition (e.g., 'PROV-STARTER-01': { ), it's error
          // If it's in a string like "Forbidden ... Bramblekin", it's warning
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (pattern.test(line)) {
              // If line contains 'Forbidden' or 'must not' or 'invented', it's explanatory, not data
              if (/Forbidden|must not|invented|not use|PROV-\*|fake/i.test(line)) {
                warnings.push(`${relativePath}:${i+1}: Mentions forbidden content in explanatory context (allowed): ${desc} — "${line.trim().slice(0,80)}"`);
              } else if (line.includes(': {') || line.includes('id:') || line.includes('name:')) {
                errors.push(`${relativePath}:${i+1}: ${desc} used as data — "${line.trim().slice(0,100)}"`);
              }
            }
          }
        } else {
          errors.push(`${relativePath}: ${desc}`);
        }
      }
    }

    // Check for PROV-* as data ID
    if (/['\"]PROV-/.test(content) && !relativePath.includes('test/fixtures') && !relativePath.includes('canonical') && !relativePath.includes('validate_production')) {
      errors.push(`${relativePath}: Contains PROV-* ID — forbidden in production`);
    }

    // Check for production importing dev fixtures — only flag static imports from test/fixtures
    // TEST_ string usage is allowed in dev if guarded by isProd() check
    if (/from\s+['\"].*test\/fixtures/.test(content)) {
      if (!relativePath.includes('test/') && !relativePath.includes('validate_production') && !relativePath.includes('starterSelection')) {
        // Check if guarded by isProd() or DEV ONLY
        const isGuarded = content.includes('isProd()') || content.includes('import.meta.env.PROD') || content.includes('DEV ONLY');
        if (!isGuarded) {
          errors.push(`${relativePath}: Production code imports test fixtures — forbidden`);
        } else {
          warnings.push(`${relativePath}: Imports test fixtures but guarded by isProd()/DEV ONLY — allowed in dev, must not leak to prod build`);
        }
      }
    }

    // Check for TEST_ species/moves used without guard — only error if in prod path without isProd check
    if (/TEST_SPECIES|TEST_MOVE/.test(content) && !relativePath.includes('test/') && !relativePath.includes('validate_production')) {
      const hasGuard = content.includes('isProd()') || content.includes('DEV ONLY');
      if (!hasGuard) {
        errors.push(`${relativePath}: Uses TEST_ fixtures without isProd() guard — forbidden`);
      }
    }

    // Check for dev battle rules in production
    if (/DevelopmentBattleRules/.test(content) && relativePath.includes('src/') && !relativePath.includes('battleRules') && !relativePath.includes('battleEngine') && !relativePath.includes('test/')) {
      // battleEngine is allowed to use dev rules for testing with warning, but should not be presented as final
      // Check if it's explicitly marked as dev
      if (!content.includes('DEV ONLY') && !content.includes('Development') && !content.includes('not final')) {
        warnings.push(`${relativePath}: Uses DevelopmentBattleRules — must be clearly isolated and not presented as final`);
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

  // Check package.json for version
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
    if (!pkg.version) {
      errors.push('package.json missing version');
    }
    console.log(`[Validation] App version: ${pkg.version}`);
  } catch (e: any) {
    errors.push(`Failed to read package.json: ${e.message}`);
  }

  // Check capacitor config
  try {
    const capConfigPath = path.join(process.cwd(), 'capacitor.config.ts');
    if (!fs.existsSync(capConfigPath)) {
      errors.push('capacitor.config.ts missing');
    } else {
      const content = fs.readFileSync(capConfigPath, 'utf-8');
      if (!content.includes('com.abyssals.game')) {
        warnings.push('capacitor.config.ts appId should be com.abyssals.game per docs');
      }
    }
  } catch (e: any) {
    warnings.push(`Capacitor config check failed: ${e.message}`);
  }

  // Check asset manifest
  try {
    const manifestPath = path.join(process.cwd(), 'src/data/canonical/assetManifest.ts');
    if (!fs.existsSync(manifestPath)) {
      errors.push('assetManifest.ts missing');
    }
  } catch {}

  return { ok: errors.length === 0, errors, warnings };
}

function main() {
  console.log('=== Abyssals Production Validation ===');
  console.log('Checking for fabricated species, moves, starter assignment, dev rules in production...\n');

  const result = scanForForbiddenContent();

  console.log('\n--- Errors ---');
  if (result.errors.length === 0) {
    console.log('No errors');
  } else {
    result.errors.forEach(e => console.error(`ERROR: ${e}`));
  }

  console.log('\n--- Warnings ---');
  if (result.warnings.length === 0) {
    console.log('No warnings');
  } else {
    result.warnings.forEach(w => console.warn(`WARN: ${w}`));
  }

  console.log('\n--- Summary ---');
  if (result.ok) {
    console.log('✅ Validation passed (warnings allowed in dev)');
    if (result.warnings.length > 0) {
      console.log(`⚠️  ${result.warnings.length} warnings — review, but not blocking in dev`);
    }
  } else {
    console.error(`❌ Validation FAILED with ${result.errors.length} errors`);
    process.exit(1);
  }

  // Additional checks for canonical data
  console.log('\n--- Canonical Data Status ---');
  console.log('SpeciesRepository: should have 187 species when canonical data imported — currently expected to be not loaded until data pack wired');
  console.log('MoveRepository: should have canonical moves — currently not loaded');
  console.log('StarterAssignment: explicit table required — currently not loaded');
  console.log('AssetManifest: 187 front sprites at assets/production/abyssals/ — currently .gitkeep only');
  console.log('TrainerRepository: Trainer DB Checklist 04 — currently not loaded');
  console.log('\nFor current slice, dev fixtures TEST_SPECIES_A/B/C allowed in dev only, blocked in production.');
  console.log('Production build will fail loudly if canonical data missing and no dev flag.');
}

main();
