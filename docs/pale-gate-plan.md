# The Pale Gate

The first Circle is a transit district. Its queues hold True Light and Dawn Bloom dead side by side. The environment is built from familiar things that have lost their context: roads ending at doors with no houses, name slips hanging from quay chains, a courthouse where all the benches face the exit. Vantis calls it the Threshold. People above call its ruler the first Prince.

## Vantis Eldrin

Vantis used to copy arrivals into the Keeper's ledger. He discovered that a faithful entry can hold a fading identity together, and that the same procedure can trap someone behind a transcription error. He carries a pocket copy of entries the official record has lost. At the mirror, the signature that Hasan or the custodian recognises gives away how long Vantis has been doing this.

Vantis knows the crossing and its rules. He lets Aimon figure out what to do with them. When he sees the Keeper, he puts away his ledger before speaking. Leave the reason unresolved here. His eventual role as King Below remains a later reveal. Pate and Trade retain agency over any return, and their window is conveyed in dialogue without imposing a campaign-wide timer.

## The Arrival Quay

Give the player one short stretch to orient themselves and return freely to Ramelle. The two queues merge at a closed gate. An eligible executed leader can appear as a quiet echo concerned with what happened to their city. Use a familiar ordinary trainer if there were no executions.

A clerk has filed three belongings under matching names, but one belonged to an Abyssal. The optional Return a Name quest asks the player to reconstruct the partner's name from a bell tag, a handler's account and a scratched feeding bowl. The reunion plays out at the quay and updates the memorial record. It gives the player a reason to care about how the registry works before the Prince fight.

## The Countercurrent

A riddle carved into the launch post reads:

> A mother gives me before I can ask.
>
> Bronze gives me voice, though I have no throat.
>
> I have a tongue of iron and swing without a foot.

Each line corresponds to a fork. The answer sequence is Name, Bell, Door. The first fork offers Name, Mouth and Ear. The second offers Bell, Trumpet and Coin. The third offers Door, Blade and Key. At the launch, the ferryman demonstrates that “bronze” is the material, and a loose latch on the landing is labelled “tongue” on a repair diagram. The first bell after launch demonstrates the timing window before a moving gate demands it.

The ferry drifts in real time. Steer between lanes, use slack water to line up and ring the correct chain when its gate marker is aligned. Telegraph each window with a moving pointer, a distinct chime and an outline change. Start with 12 seconds between forks and a four-second alignment window, and tune from touch playtests. Offer slower current at the launch post. Opening a pause menu, losing focus or entering dialogue freezes the crossing. A wrong chain or missed gate washes the ferry back to the last landing with no life loss. Only completed landings persist, so reloading starts from a stable place.

A side landing reached by deliberately taking the quieter current leads to a reed bed with a rare wild encounter. Mark the landing and its return route before the player commits. Keep wild checks and battles on dry land.

## The Hall of Misfiled Names

An intake board shows three arrivals, each with a timestamp, a destination and a witness mark. On the far side of the hall, a receipt shows a single entry stamped as departed even though its witness never signed. The player uses the stamp order and the witness mark to identify the wrong file, then reverses the intake gate. Let them inspect each record in any order and keep the evidence in the journal. Wrong submissions identify the conflicting field and allow another try. Correcting the entry opens the Prince's chamber. A second optional discrepancy opens a rare Abyssal side room.

Place two distinct demon fights across the chapter. A Toll Bailiff guards the far landing and demonstrates a switch-punishing team. A Ledger Hound patrols a shortcut through the Hall, with an alternate corridor for players who read the records. Demon trainer battles use existing stakes. Rare Abyssals use normal food-based befriending and are chosen from the live roster when encounter balance is implemented. The bed supports a low-frequency repeatable encounter. The side room should use the existing authored encounter rules if its species is unique.

## First Prince — Hugh FitzAlan, Keeper of Names

Hugh is the current registry name for WRD-01, historically Veyr. His duty is to hold identities together until the dead move on. He intervenes because Aimon is walking upstream through a process that cannot accommodate exceptions.

Build the match around Namefog, active before turn one under the locked symmetric field rules. Show its effects and restoration after temporary replacement in the battle HUD. The party should be able to prepare at a landing before entering. Author a late-game team with legal existing moves, an opening scout, a sturdy pivot and a visible ace. Set the exact roster and levels against the live Hierophant clear curve. The battle's pressure comes from the field and switching decisions, with standard HP and defeat resolution.

On victory, persist the Threshold clear once and unlock the deeper route. Wire the Underway Relay to the existing first-Circle progression and Return a Name contract. End this chapter at the Circle II entrance. Verify the boss on a normal save and on a save that already saw the old mirror scene.

## Art and implementation order

1. Mirror introduction, full-body art, dialogue portrait, and portal sprite. Preserve the existing save keys and historic character ID. Create directional idle and walking frames for Vantis when he joins the field route.
2. Arrival Quay, river puzzle and dry-land encounters. Build the crossing as an isolated state machine, then test keyboard and touch, pause and resume, reload, and failure recovery.
3. Hall records, demon patrol and rare side room. Test gate connectivity with each optional encounter completed and skipped.
4. Prince battle, return route and relay progression. Test ordinary losses and retries, field replacement and restoration, victory persistence, and original save compatibility. Package and publish only after the playable slice passes release validation.
