# Leader-fate evolution — post-v0.90.52 source patch

An ordinary city leader's **first** completed judgement is the evolution trigger for
three former story-choice families. All eight leaders qualify, regardless of location.
No old per-town oath, banner, or alliance scene is required.

| Base | Minimum level | Spare (benevolent) | Execute (darker) |
| --- | --- | --- | --- |
| Cairant (070) | 32 | 071 — kept oath | 072 — broken oath |
| Flaggrim (073) | 30 | 074 — raised banner | 075 — torn banner |
| Jerbune (092) | 30 | 093 — accepted alliance | 094 — rejected alliance |

- Only **living party members** present when the choice is confirmed qualify.
  Reserves, dead partners and knocked-out partners cannot evolve from that choice.
- Having reached the minimum level is sufficient, even if a captured partner
  has not earned another level with Aimon.
- Existing one-evolution-per-level protection remains.
- Multiple eligible party members may evolve on the same judgement.
- If a partner is too young, it can qualify at a **later undecided** city leader.
  The prior decision does not grant a stored, automatic evolution.
- Each leader fate is recorded and applied once. Replays, spared-leader rematches,
  reloads, and older saved fates cannot award extra evolutions.
- Existing save records, Prodigy inheritance, gained stats, HP proportion, shiny
  state and lives are preserved by the regular promotion engine.
- The form changes atomically with the decision and persists immediately.
  Evolution cinematics, stat cards and entry move learning are queued as a durable
  notice and shown after the associated story dialogue (or after loading a save).
- Old story-choice fields can remain in saves and narrative content, but cannot
  trigger these three evolutions on their own. Censmoke and Triskit are untouched.

Validation: `tests/leader-fate-evolution.test.mjs` exercises 8 leaders × 2
judgements × 3 families, level thresholds, eligibility, party filtering, old
story flags, save/reload and retained non-story evolution rules. This is a source
change awaiting a **new release version and APK build**; v0.90.52 is unchanged.
