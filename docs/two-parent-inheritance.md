# Two-parent Prodigy inheritance — v0.90.35

Same-family parents independently roll for each original Prodigy they carry. Every carrier rolls, even after a successful roll from the other parent. A single carrier has p = (1/750)^(1/6); two carriers have 1 - (1-p)^2. Nursery effects change p for both carriers. Cross-family rules are unchanged.

Each successful parent offers its original bonus, excluding evolution copies. Keep the strongest successful bonus once. A weaker parent can pass its own bonus when the stronger parent fails. Neither adds to the other. Parent strengths and generation counts cannot inflate the stored original bonus.

Pairing previews use the actual carrier count per stat and multiply the combined chances for the all-stat probability. Maximum available rates are labelled as such. With three shared traits and one different trait on each parent, all five have probability (1-(1-p)^2)^3 * p^2 = approximately 1.866%, or one in 53.59 eggs. Six traits with one carrier each remain one in 750; six shared traits become approximately one in 34.79.

Existing eggs retain their saved rolls and original record format. Parent bonus arrays exist only during planning and rolling; saved offspring store one ordinary lineage record per successfully inherited stat.

Validation covers all success/failure combinations for unequal shared bonuses, twelve independent rolls for two six-trait parents, production egg save/hatch, legacy records, evolution and generation stability, and seeded frequency checks for all five target traits with every permitted item combination.
