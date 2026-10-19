// Readable site records, evidence and individual warden conversations for side expeditions.
export const SIDE_CAMPAIGNS = [
  {
    "key": "marchMeadow",
    "title": "The Winter Nursery",
    "stages": [
      "Snowbreak Hollow",
      "Three Hearth Shelter",
      "Pinebound Nursery"
    ],
    "intro": "The nesting baskets are empty, but there are no broken shells. I think the young fled to the old winter shelter when the patrols came through. Follow the baskets, then see whether its nursery hearth can still be lit.",
    "clues": [
      "The wool lining has been folded back rather than torn. There are no broken shells, bloodstains or drag marks. Several sets of small paw prints leave the basket and climb towards Three Hearth Shelter. The animals appear to have fled the noise on the road.\n\nFollow that uphill trail. The path warden controls the next gate; win the warden’s challenge after examining these tracks. At the shelter, look for the hearth ledger before lighting anything.",
      "The ledger explains why the shelter failed: the watch crew connected its smoke fires to the nursery chimney. Lighting every brazier would fill the nesting room with smoke again.\n\nLeave the Nursery hearth lit, with the Smoke flue and Watch brazier dark. Controls 1 and 2 also reverse the next lamp; control 3 reverses only itself. Check all three lights after each pull. Reset puts them all out if you want to start again.",
      "The bed ledger lists nesting baskets along the warm wall and traveller beds behind woven screens. The room could serve only the young, or both the young and displaced families. Either plan keeps soldiers’ torches outside.\n\nWin the final warden’s challenge, then use the decision register farther along the path to choose. Return to Alice at Snowbreak Hollow afterwards; she is the keeper who can provide the wool and arrange the room."
    ],
    "puzzleKind": "lanterns",
    "puzzleClue": "Light the nursery hearth only. Leave the smoke flue and old watch brazier dark.",
    "solution": [
      true,
      false,
      false
    ],
    "affinity": "FIRE",
    "objective": [
      "Follow the baskets through the snowbreak",
      "Restore the shelter hearths",
      "Read the site register, win the last warden’s challenge and choose how to care for Pinebound Nursery"
    ],
    "guardianIds": [
      "210",
      "222",
      "361"
    ],
    "choice": {
      "a": {
        "label": "Keep it a nursery",
        "text": "Alice reserves the heated chamber for wild young and keeps traveller beds outside."
      },
      "b": {
        "label": "Share the shelter",
        "text": "Alice divides the chamber with woven screens so refugees and hatchlings can stay together."
      }
    },
    "conclusion": {
      "a": "Alice hangs a pine-basket sign: soldiers must leave their torches outside the nursery.",
      "b": "A travelling family helps mend the screens. Their blankets join the wool around the nests."
    },
    "reward": {
      "money": 220,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "Before the border patrols came, the families outside Civeton brought their nesting baskets into this hollow each winter. Wool lined the baskets, and the young Abyssals could stay close to the grazing herds. Travellers bought fodder here before taking the March road.\n\nWhen soldiers began burning the verges to deny cover to enemy scouts, the frightened herds scattered. The keepers carried the youngest uphill to Three Hearth Shelter. Most of the keepers were then called away to tend the army’s animals. Nobody returned to open the shelter for the next frost.\n\nAn empty basket does not mean its occupant was taken. Look for the little tracks climbing away from the road. The old hearth ledger should still be inside the shelter; it explains how to warm the nursery without filling it with smoke.",
      "Three Hearth Shelter was built for people travelling with young Abyssals. Its nursery fire warmed a low stone wall, allowing the nesting baskets to stand safely on the other side. Two separate fires served a smoke flue and the old watch post.\n\nA wartime watch crew joined all three fires to the nursery chimney. They wanted a taller signal plume above the pines. When every brazier was lit, smoke backed into the baskets. The keepers fled with the young and barred the inner room. The shelter has stood cold ever since.\n\nOnly the nursery hearth should burn while nests are occupied. The smoke flue and watch brazier must stay dark. Their damaged control chains are linked, so moving one may change another. Read the maintenance inscription before using them, and check the final pattern rather than assuming each chain works alone.",
      "The Pinebound Nursery was never an army barracks. Road families maintained it with wool, firewood and a few coins left beside the door. Its keeper offered beds to travellers as long as the young Abyssals could rest undisturbed behind woven screens.\n\nThe war changed who came through the door. Displaced families arrived without blankets, while passing officers expected the room to be held for soldiers. With the keepers gone, no one agreed whose need came first. The baskets were left to wild parents, and the traveller beds fell apart.\n\nRestoring the heat makes the room usable again, but it does not settle how to share it. The bed ledger records space for a nursery or for screened family beds. After hearing the last warden, enter your decision at the register beyond the post. Alice can then arrange the wool and screens."
    ],
    "controlLabels": [
      "Nursery hearth",
      "Smoke flue",
      "Watch brazier"
    ],
    "trainerVoices": [
      {
        "before": "Dawn Bloom scouts drove our winter convoy off the road. The fodder burned before we could turn the wagons. Civeton needs these shelters if the next convoy is to get through. Show me you can protect your partners out here.",
        "after": "You kept your partners together. Most recruits watch the banner and forget who is walking behind it.",
        "repeat": "My brother drives a fodder wagon. Every empty stable here means another horse he has to leave on the road."
      },
      {
        "before": "The watch captain ordered every brazier lit. Then he marched away and left the keepers coughing. I wear his colours, but I will not pretend that was good soldiering. Let us see how you handle a command.",
        "after": "You know when to hold back. I wish the captain had learned that before winter.",
        "repeat": "A shelter without fuel is just a roof. I have asked the quartermaster for wood three times. He keeps sending flags."
      },
      {
        "before": "We were told to reserve these beds for the next column. There are children coming down from the border tonight. If I admit them, I am the one who must answer for it. Give me a reason to trust your judgement.",
        "after": "All right. I will hear your decision about the room. I am tired of waiting for an order that never comes.",
        "repeat": "Soldiers leave at dawn. A family with nowhere to go is still here when the next dawn comes."
      }
    ],
    "recordTitles": [
      "The Shelter Above the March",
      "Three Fires, One Nursery",
      "Who May Sleep Beneath This Roof"
    ],
    "recordSources": [
      "Copied from the winter keepers’ account",
      "A hearth keeper’s maintenance book",
      "The last shelter keeper’s entry"
    ]
  },
  {
    "key": "burrowHollow",
    "title": "The Buried Water Road",
    "stages": [
      "Surveyor’s Descent",
      "Counterweight Gallery",
      "Burrow Well"
    ],
    "intro": "The village well went dry after the tunnel collapsed. I found an older spring beyond it, but the lift is jammed. Follow my survey marks to the counterweights. We need water without draining the burrows that depend on it.",
    "clues": [
      "A draught moves dust through the narrow opening beside Henry’s chalk arrow. The broad cart tunnel is blocked by fresh rubble. A bucket rim beneath the stones confirms this was once a water route, rather than an empty mine.\n\nTake the marked survey passage towards Counterweight Gallery. Examine the lift plate there before moving the drums. The first path warden will open the onward gate when you have read these marks and won the challenge.",
      "The carvings show unequal loads because the lift was designed to balance them at different points on its frame. Equal buckets will leave the frame jammed.\n\nSet Left bucket to 1, Middle bucket to 2 and Right bucket to 3. Each press adds one stone; after 3, the setting returns to 0. The current amounts are shown beside the control names. Match those amounts, then speak to the gallery warden before continuing to Burrow Well.",
      "The keeper’s seasonal notes record a shared spring, not an unused reservoir. Reopening the village rope would provide a public well, but people would need to respect the nearby nests. A pipe could carry less water outside while leaving the inner pool undisturbed.\n\nAfter the last warden’s challenge, choose the well arrangement at the decision register. Return to Henry at Surveyor’s Descent to report it; repairing the lift alone does not finish the water agreement."
    ],
    "puzzleKind": "weights",
    "puzzleClue": "Set the left bucket to one stone, the middle to two, and the right to three.",
    "solution": [
      1,
      2,
      3
    ],
    "affinity": "GROUND",
    "objective": [
      "Read the survey markers",
      "Balance the buried lift",
      "Read the site register, win the last warden’s challenge and choose how to care for Burrow Well"
    ],
    "guardianIds": [
      "025",
      "027",
      "335"
    ],
    "choice": {
      "a": {
        "label": "Open a public well",
        "text": "Henry leaves the village draw-rope accessible and marks safe times around the burrows."
      },
      "b": {
        "label": "Protect the burrow spring",
        "text": "Henry pipes a smaller flow outside and keeps the inner pool undisturbed."
      }
    },
    "conclusion": {
      "a": "Caravans stop charging for water here; Henry watches the hatchling season closely.",
      "b": "The spring remains quiet. Villagers carry smaller buckets, but the burrows keep their water."
    },
    "reward": {
      "money": 300,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "The Buried Water Road is older than the military tunnels around it. Village keepers lowered buckets into a spring beneath the dunes and hauled them to roadside wells. Burrowing Abyssals drank from the inner pool, while the people drew from an outer shaft. For many years the same spring served both.\n\nThe armies widened nearby passages for supply carts. During a retreat, soldiers brought down a roof to prevent pursuit. Falling stone blocked the draw-rope and cut the village off from its water. Merchants now carry in barrels and charge for every cup.\n\nHenry FitzWalter is trying to reach the spring by the older survey passage. His chalk arrows follow moving air, which can escape through surviving openings. Follow those marks instead of choosing the broadest tunnel. Beyond them lies the counterweight lift that once raised the village’s water.",
      "This lift raised full water buckets from the Burrow Well. Its three counterweight drums were balanced in steps: one stone in the left bucket, two in the middle, three in the right. The unequal weights kept the lifting frame level as its load rose.\n\nWhen the neighbouring supply tunnel collapsed, masonry struck the drums and knocked them back to their empty settings. The rope frame jammed. People above ground assumed the spring had dried, but the water keeper’s scratches show that the inner pool remains full.\n\nTurning each drum adds one stone until it reaches three; turning again empties it. Restore the old one-two-three balance to release the frame. Do not try to make the buckets equal. The carved marks were left by the workers who used this lift daily, and describe the load it was built to carry.",
      "The Burrow Well served two households: the village above the shaft and the nesting colonies around its inner pool. The water keeper watched the draw during the hatchling season, when the burrows needed a steady water level. The village drew less on those days and filled storage jars beforehand.\n\nSince the tunnel collapsed, the village has depended on expensive water barrels. The colonies have stayed below, leaving scratch marks beside the unreachable draw-rope. Repairing the lift will bring people back into a place the Abyssals have had to themselves during the fighting.\n\nThe keeper’s ledger offers two workable approaches. Reopen the public draw-rope with care around the nests, or keep the inner pool quiet and carry a smaller flow outside through a pipe. Neither gives unlimited water. Settle the choice at the well register after the last challenge, then report to Henry at Surveyor’s Descent."
    ],
    "controlLabels": [
      "Left bucket",
      "Middle bucket",
      "Right bucket"
    ],
    "trainerVoices": [
      {
        "before": "Dawn Bloom sappers brought this roof down to stop our wagons. Now the nearest village buys its own water back from merchants. I guard the passage because another collapse would finish them. Are your partners ready?",
        "after": "Steady work. You did not make the ground shake just to prove a point.",
        "repeat": "The merchants call it a transport charge. They charge the children too."
      },
      {
        "before": "Our engineers want this tunnel for supply carts. Henry says the burrows hold the roof together. If the engineers clear them out, we might lose the whole water road. I want to see how you handle your partners.",
        "after": "You can work with what is here. Perhaps the engineers should take a look before drawing another straight line on a map.",
        "repeat": "A map makes a tunnel look empty. Spend one night here and listen to the walls."
      },
      {
        "before": "A thirsty garrison cannot hold a road. A thirsty village cannot feed a garrison. Every officer I ask thinks the other one should go without. Show me you are worth listening to.",
        "after": "I will hear your plan for the spring. Someone has to start with the people standing at the well.",
        "repeat": "The war has reached every bucket. That is how you know the front is closer than the officers say."
      }
    ],
    "recordTitles": [
      "The Road That Carried Water",
      "Instructions for the Buried Lift",
      "A Spring With Two Households"
    ],
    "recordSources": [
      "From the village well account",
      "A surveyor’s copy of the lift plate",
      "The water keeper’s surviving ledger"
    ]
  },
  {
    "key": "glassSluice",
    "title": "The Water That Remembers",
    "stages": [
      "Mineral Seep",
      "Prism Valve Walk",
      "Glass Archive"
    ],
    "intro": "The drinking water turned cloudy after the military road works. The old sluice archive should name whoever ordered the diversion. Trace the deposits, flush the valves in their old order, and help me recover the records.",
    "clues": [
      "White crust marks the old fresh-water inlet. Red clay appears where a newer trench cuts across it from the widened road. The water was not naturally cloudy at its source: the road works introduced the dirt farther along the channel.\n\nFollow the clean-water marks towards Prism Valve Walk. Win the path warden’s challenge to pass the gate. At the valves, read the maintenance plate before opening the drinking cistern; a wrong order would send unsettled clay into town again.",
      "The plate describes a process, not three valves to open at once. First admit clean water through the Inlet valve. Next fill the Settling basin so grit can drop out. Open the Drinking cistern only after those two steps.\n\nUse control 1, then 2, then 3: left, middle, right. A wrong selection clears the sequence, so begin again with the inlet. Once the flush is complete, win the gallery warden’s challenge to reach the archive.",
      "The diversion order is signed, dated and marked with the same contractor’s seal as the road accounts. It is evidence that the muddy water followed an authorised change, rather than an unexplained fault in the spring.\n\nAfter the last challenge, use the decision register to publish copies at the well or entrust the originals to Agnes for the engineers. Both choices seek repairs; they differ in who can inspect the evidence. Report your decision to Agnes at Mineral Seep."
    ],
    "puzzleKind": "order",
    "puzzleClue": "Open inlet, settling basin, then drinking cistern: left, middle, right.",
    "solution": [
      0,
      1,
      2
    ],
    "affinity": "WATER",
    "objective": [
      "Trace the deposits",
      "Flush the sluice in the safe order",
      "Read the site register, win the last warden’s challenge and choose how to care for Glass Archive"
    ],
    "guardianIds": [
      "139",
      "016",
      "301"
    ],
    "choice": {
      "a": {
        "label": "Publish the diversion records",
        "text": "Agnes posts copies at the town well so families can demand repairs."
      },
      "b": {
        "label": "Give Agnes the originals",
        "text": "Agnes takes the evidence directly to the engineers and supervises repairs herself."
      }
    },
    "conclusion": {
      "a": "Names and dates appear beside the well. The next water levy must now be explained in public.",
      "b": "Agnes returns with tools and labourers; the repaired sluice runs clear before the next caravan."
    },
    "reward": {
      "money": 380,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "The Mineral Seep once supplied Dorelem with clear drinking water. Water entered a settling basin before being allowed into the town cistern. Mineral crust built up slowly around the clean inlet, leaving pale marks that are still visible on the stone.\n\nDuring the war, a contractor widened the military road so supply wagons could pass quickly. The work diverted muddy runoff into the old water channel. Red clay reached the drinking cistern, and families began finding grit in their jars. The sluice keeper objected to the diversion and was dismissed. The contractor continued charging a repair levy.\n\nAgnes Giffard wants the old works restored and the order behind the diversion recovered. Follow the pale inlet deposits into Prism Valve Walk. The old maintenance sequence can flush the system safely. The Glass Archive beyond the valves should hold the signed orders and show who was responsible.",
      "The drinking sluice had three duties. Its inlet admitted fresh water. Its settling basin held the water long enough for heavy grit to fall to the bottom. Only then did the drinking-cistern valve release it towards Dorelem.\n\nThe road works broke that order by sending clay-laden water straight into the last channel. Opening every valve together will carry the same clay back into the town’s drinking supply. The basin must do its work before the cistern is opened.\n\nThe keeper placed the three controls in the order of the water’s journey: inlet on the left, settling basin in the middle, drinking cistern on the right. Operate them in that order. The archive passage lies beyond the cleaned channel. Its records matter because repairs paid from the public levy were ordered here, even though the town never received clean water in return.",
      "The Glass Archive kept Dorelem’s water accounts. Every change to the sluice required an order naming the contractor, the works to be done and the levy charged to the town. The glass-lined shelves protected those papers from mineral damp.\n\nWhen the drinking water turned cloudy, families asked to see what their levy had bought. The archive was sealed under military authority. Officials said its plans might expose supply routes. That also concealed the contractor’s diversion order and the repairs that had not been carried out.\n\nRecovering the order will explain how road clay reached the cistern. Publishing copies at the town well would let families question the levy themselves. Giving the originals to Agnes would let her press the engineers directly and supervise repairs. Decide at the archive register after the last warden’s challenge. Agnes waits back at Mineral Seep for your report."
    ],
    "controlLabels": [
      "Inlet valve",
      "Settling basin",
      "Drinking cistern"
    ],
    "trainerVoices": [
      {
        "before": "The road was widened so our wagons could outrun Dawn Bloom patrols. Nobody asked where the runoff would go. Now our own recruits are drinking mud. Show me what you can do before I let you farther in.",
        "after": "You have earned a look at the works. I hope you brought better sense than the contractor.",
        "repeat": "A faster road is little use when half the escort is sick before it leaves town."
      },
      {
        "before": "They told us the dirty water was enemy sabotage. I was here when the contractor tipped the first load of clay. Keep that between us until you have something with a signature on it. Now, your challenge.",
        "after": "You can pass. If those records survive, perhaps I can finally say this aloud.",
        "repeat": "A soldier who contradicts a report needs evidence. A contractor only seems to need a friend in the fort."
      },
      {
        "before": "My orders say these records could expose our supply routes. Agnes says they expose unpaid repairs. I have read enough to know both are true. Prove you can carry a difficult responsibility.",
        "after": "The papers are yours to examine. I will not decide what the town is allowed to know.",
        "repeat": "Both armies want Dorelem thirsty enough to obey. The people at the well have begun asking different questions."
      }
    ],
    "recordTitles": [
      "How Dorelem Lost Its Clear Water",
      "The Sluice Keeper’s Three Duties",
      "Why the Glass Archive Was Sealed"
    ],
    "recordSources": [
      "A public copy of the mineral keeper’s account",
      "From a valve-maintenance manual",
      "Notes attached to the diversion register"
    ]
  },
  {
    "key": "emberQuarry",
    "title": "Ashes Owed",
    "stages": [
      "Cold Kiln Road",
      "Foundry Chainworks",
      "Last Forge"
    ],
    "intro": "The forge shut with the workers still owed their pay. There is salvage inside, and tally rings that could prove the debt. Find the old safety instructions before touching the heat channels; then help me decide what the salvage should pay for.",
    "clues": [
      "This tally ring records six weeks of work without payment. Its edge has been worn smooth by someone carrying it while waiting for the wage chest. Other rings point towards the shut foundry, where names have been cut into the brickwork.\n\nFollow the trail to Foundry Chainworks after the warden’s challenge. Look for the brass safety token there. The remaining forge channels may still hold hot ash, even though the kiln fires have gone out.",
      "The safety token explains the danger: a closed quench channel and cracked bellows have left heat trapped behind the crucible. Opening the middle shutter first would release it towards the passage.\n\nUse Quench basin on the right first, Bellows vent on the left second, Crucible in the middle last. That is control 3 → 1 → 2. A wrong control clears the sequence; start again from the quench basin. The warden’s challenge comes after the workings are safe.",
      "The brick names and tally rings belong to the same workers. There is evidence of unpaid labour, but no intact wage chest. Remaining salvage could provide individual repayments, or the means to open a forge that supports work again.\n\nWin the final warden’s challenge, then record your choice at the forge ledger beyond the post. Return to Musa at Cold Kiln Road to arrange it. Both plans use the recovered property; neither should leave the workers’ names unaccounted for."
    ],
    "puzzleKind": "order",
    "puzzleClue": "Quench first, vent second, open the crucible last: right, left, middle.",
    "solution": [
      2,
      0,
      1
    ],
    "affinity": "FIRE",
    "objective": [
      "Collect the worker’s clues",
      "Make the heat channels safe",
      "Read the site register, win the last warden’s challenge and choose how to care for Last Forge"
    ],
    "guardianIds": [
      "249",
      "025",
      "315"
    ],
    "choice": {
      "a": {
        "label": "Return the tally rings",
        "text": "Musa traces the surviving workers and divides the forge’s salvage among them."
      },
      "b": {
        "label": "Fund a common forge",
        "text": "Musa uses the salvage to reopen the forge with a shared worker ledger."
      }
    },
    "conclusion": {
      "a": "Old apprentices return for their share. Each ring is crossed off in front of its owner.",
      "b": "The first tools forged here are water hooks and gate hinges; every worker signs the new ledger."
    },
    "reward": {
      "money": 420,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "Ember Quarry supplied iron for farm tools, wagon fittings and the army. Its workers were paid against tally rings: each ring recorded labour that could be exchanged for wages when the pay chest arrived. Families trusted the marks because the forge had honoured them for years.\n\nWhen First Light advanced onto the ridge, the charcoal road was cut. Work stopped and the owner left with the wage chest. Workers waited beside the cold kilns until they could no longer buy food, then scattered to seek employment elsewhere. Their unpaid rings remain along the road.\n\nMusa al-Haddad believes the remaining metal could meet some of that debt. The foundry was shut in haste, however, and heat and ash remain trapped in its workings. Follow the workers’ tokens to the chainworks. Read their safety instructions before touching the furnace controls or entering the Last Forge.",
      "The chainworks controlled the Last Forge’s quench basin, bellows vent and crucible. Workers used the quench water to cool the channels before venting the bellows. Only after heat and pressure were released could the crucible be opened safely.\n\nThe evacuation crew closed the channels as they left. A cracked bellows now traps hot ash behind the shutter. The forge looks dead from outside, but opening its crucible first could release that ash into the working passage. This is why the workers left safety tokens near the control chain.\n\nThe right-hand control feeds the quench basin. The left opens the bellows vent. The middle releases the crucible. Use them in that order: cool, vent, open. Making the forge safe will allow its remaining metal and wage records to be examined. It will not erase what the workers were owed when the owner fled.",
      "Before the army’s orders filled its yard, the Last Forge repaired plough fittings, water hooks and village gates. Its smiths and apprentices lived from those small commissions. Wartime iron contracts increased the work, but the pay stopped when the charcoal road was lost.\n\nThe names scratched into these bricks match the tally rings left outside. The workers made their own record because the owner took the wage chest and official books. What metal remains here is the only property from which some of their debt might be met.\n\nMusa offers two ways to use it. The salvage can be divided among surviving workers against their rings. Or it can reopen a common forge, with a shared wage ledger that every worker can inspect. After the final challenge, enter your choice at the forge register. Return to Musa at Cold Kiln Road so he can find the workers and carry it out."
    ],
    "controlLabels": [
      "Bellows vent",
      "Crucible",
      "Quench basin"
    ],
    "trainerVoices": [
      {
        "before": "First Light took the ridge and cut the charcoal road. Our officers promised the forge would reopen in a week. I have stood here long enough to watch grass grow through the weighbridge. Show me your partners.",
        "after": "You have more fire left than this place. Go carefully among the old channels.",
        "repeat": "Every smith missing from this quarry is another cart of tools the villages have to buy from outside."
      },
      {
        "before": "My father forged water hooks here. The army bought the iron, then the owner stopped paying him. Now they call this an enemy loss on the accounts. I would like to know whose enemy he was. Ready yourself.",
        "after": "A fair challenge. My father would have liked that.",
        "repeat": "The quartermaster asks how many spearheads we can recover. Nobody has asked how many smiths we lost."
      },
      {
        "before": "The garrison wants the remaining metal. Musa wants the workers paid. Without the garrison we lose the road; without the workers there will be nothing left to defend. Let your partners speak first.",
        "after": "I will stand aside. Tell Musa I heard his claim.",
        "repeat": "The first repaired plough would do more for this valley than another locked wagon of spearheads."
      }
    ],
    "recordTitles": [
      "The Workers Left at Cold Kiln Road",
      "Before Opening a Dead Furnace",
      "What the Last Forge Still Owes"
    ],
    "recordSources": [
      "A quarry clerk’s unpaid-wage account",
      "A foundry safety book",
      "A copy of the workers’ salvage petition"
    ]
  },
  {
    "key": "stormBluffs",
    "title": "The Broken Stormwatch",
    "stages": [
      "Windcut Steps",
      "Beacon Crown",
      "Stormwatch Refuge"
    ],
    "intro": "Caravans are following the wrong lights into the old quarry tracks. The true beacon is above the fog. Follow the stormwatch marks and find its lamp record; once it is safe, we must decide who keeps the watch.",
    "clues": [
      "The blue cloth is tied above the quarry turn, where an upper path continues along the ledge. Broken wagon timber lies below the lower lamps. The wreckage explains why a visible light is not necessarily a safe guide here.\n\nFollow the blue knots towards Beacon Crown, after winning the first warden’s challenge. Find the old watch journal there. It identifies which lamp stood above the fog before the signals were changed during the fighting.",
      "The journal distinguishes the crown beacon from the quarry lamps. Only the crown marks a route that can carry caravans safely through fog. The two lower lights must be left dark so drivers cannot mistake them for the crossing.\n\nLeave control 3’s Crown beacon lit, with controls 1 and 2’s quarry lamps dark. The chains are linked: 1 changes lamps 1 and 2; 2 changes lamps 2 and 3; 3 changes lamp 3 alone. Check the finished pattern before continuing.",
      "The refuge register records missing drivers, spare blankets and volunteers who once took turns searching the ledge. Restoring a lamp will help, but someone must keep supplies here and notice when a traveller fails to arrive.\n\nAfter the last warden’s challenge, choose a neutral civilian beacon or a volunteer rescue watch at the decision register. Return to Umar at Windcut Steps to arrange it. Neither plan requires putting a faction banner over the refuge beds."
    ],
    "puzzleKind": "lanterns",
    "puzzleClue": "Keep the two quarry decoys dark and light the crown beacon on the right.",
    "solution": [
      false,
      false,
      true
    ],
    "affinity": "FLYING",
    "objective": [
      "Follow the stormwatch marks",
      "Restore the true beacon",
      "Read the site register, win the last warden’s challenge and choose how to care for Stormwatch Refuge"
    ],
    "guardianIds": [
      "099",
      "012",
      "299"
    ],
    "choice": {
      "a": {
        "label": "Keep the beacon neutral",
        "text": "Umar displays no faction banner and guides every civilian caravan."
      },
      "b": {
        "label": "Create a rescue watch",
        "text": "Umar stations local volunteers at the refuge and signals only when someone needs help."
      }
    },
    "conclusion": {
      "a": "Travellers learn to trust the unmarked light above the fog.",
      "b": "Three volunteers leave blankets at the refuge and keep a nightly rescue tally."
    },
    "reward": {
      "money": 470,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "Stormwatch was built to guide wagons along the only safe ledge above the quarry. A beacon on the crown stood high enough to show over winter fog. Drivers watched for it, while the lower quarry lamps served workers using paths that ended at the stone workings.\n\nDuring the fighting, signal crews lit those lower lamps to mislead an approaching column. Civilian grain wagons were travelling with the soldiers. Several followed the wrong lights and went over the edge. The signal crews withdrew, but the false lamps and damaged markings remained.\n\nUmar ibn Ibrahim is trying to make the crossing trustworthy again. Blue knots mark the old upper route. Follow them to Beacon Crown and read the watch journal before changing any lights. The true beacon can guide food and medicine over the bluffs again, if travellers can be certain it no longer leads into the quarry.",
      "The crown beacon was the only Stormwatch light designed for fog. Its high position showed drivers the safe upper ledge. The two lower lamps served quarry tracks and were never directions for a loaded caravan crossing the bluffs.\n\nThat distinction was deliberately confused during the war. A signal crew used the quarry lamps as false guides, and wagons fell from tracks that could not carry them. The crown later went dark when the watch was withdrawn. Travellers now see the easiest lights to reach instead of the safest light to follow.\n\nThe crown is the right-hand beacon. It should be the only lamp lit in the restored pattern. Leave both quarry lamps dark. Damage to the shared control chains means the first two controls also pull the next light, so inspect the whole pattern after each movement. The watch journal records the arrangement for anyone taking over the post.",
      "Stormwatch Refuge housed drivers and passengers caught above the quarry in bad weather. Its attendants kept blankets, lamp oil and a list of people who had not reached the lower road. Volunteers searched the ledge before dawn when someone was overdue.\n\nBoth armies drew attendants away for other duties. With the true beacon dark, more travellers became lost just as fewer people were left to find them. The refuge guardian stayed through the storms, but an Abyssal cannot keep a missing-person register or explain a safe route to a frightened family.\n\nA repaired beacon needs a lasting purpose. It could remain unmarked and guide civilian caravans from either side. Or local volunteers could maintain the refuge as a rescue watch, signalling when someone needs help. Choose at the refuge register after the final warden’s challenge. Umar waits at Windcut Steps to organise the watch you propose."
    ],
    "controlLabels": [
      "Lower quarry lamp",
      "Quarry spur lamp",
      "Crown beacon"
    ],
    "trainerVoices": [
      {
        "before": "First Light followed our lamps up these cliffs once. The signal crew changed them, and a grain convoy went over the edge with the soldiers. I still hear the drivers when the wind turns. Prepare your partners.",
        "after": "You kept your footing. The bluff takes people who rush it.",
        "repeat": "That convoy fed more than an army. The villages below spent the winter stretching flour with ground roots."
      },
      {
        "before": "The officers want a beacon that only our people can read. Fog does not check a traveller’s seal. I have carried enough strangers out of the quarry to know that. Face me here, away from the edge.",
        "after": "Good. You watched the ground as well as your opponent.",
        "repeat": "We can blind an enemy column for one night. Then we spend a month bringing home the people who followed it."
      },
      {
        "before": "My watch was cut to send more soldiers north. The road stayed open on the maps, so the paymaster called it a saving. Show me you can keep something alive before you promise to guard this refuge.",
        "after": "The watch needs a decision. I will listen to yours.",
        "repeat": "A safe road brings grain, medicine and families home. That is a war effort I can still understand."
      }
    ],
    "recordTitles": [
      "The Night the Lamps Were Changed",
      "The Light Above the Fog",
      "The Empty Stormwatch Beds"
    ],
    "recordSources": [
      "From a caravan driver’s stormwatch account",
      "The former beacon keeper’s instructions",
      "A refuge volunteer’s unfinished register"
    ]
  },
  {
    "key": "orchardCanopy",
    "title": "Roots for the Hungry",
    "stages": [
      "Abandoned Graft Row",
      "Irrigation Crown",
      "Hospice Seed Vault"
    ],
    "intro": "The hospice used to eat from this orchard. The channels were abandoned when the pickers fled. Read the graft tags, balance the water, and help me open the seed store without losing next winter’s planting stock.",
    "clues": [
      "Each graft tag gives a family name and a row number. A newer requisition mark has been cut over the old hospice share, followed by the words “unpaid”. The orchard once supported patients as well as its growers; the military collection interrupted both shares.\n\nFollow the tagged rows towards Irrigation Crown after the first warden’s challenge. The seed packets along the larger expedition trail belong to Hasan’s earlier collection work. The repair itself is explained at the water-measure board in the next clearing.",
      "The tenders planted these beds for different flows. Seedlings need one measure, saplings two, established roots three. The largest trees take the greatest share because their root beds cover more ground.\n\nSet Seedling water on the left to 1, Sapling water in the middle to 2, Established roots on the right to 3. Each drum cycles through 0, 1, 2, 3 and back to 0. Check the displayed amounts, then win the warden’s challenge to reach the vault.",
      "The inventory separates the ripe fruit from the seed reserve. Using the fruit now will feed patients; keeping the seed jars intact protects the next planting season. Neither proposed arrangement requires eating the reserve.\n\nAfter the last challenge, use the decision register to send the first fruit directly to the hospice or share grafts with families who promise future deliveries. Then report to Hasan at Abandoned Graft Row. He needs your decision before he can organise the growers."
    ],
    "puzzleKind": "weights",
    "puzzleClue": "Give one measure to seedlings, two to saplings, three to established roots.",
    "solution": [
      1,
      2,
      3
    ],
    "affinity": "GRASS",
    "objective": [
      "Read the graft families’ records",
      "Balance water across the orchard",
      "Read the site register, win the last warden’s challenge and choose how to care for Hospice Seed Vault"
    ],
    "guardianIds": [
      "060",
      "152",
      "337"
    ],
    "choice": {
      "a": {
        "label": "Send the first fruit to the hospice",
        "text": "Hasan saves seed before sending the ripe fruit to the nurses."
      },
      "b": {
        "label": "Plant a public orchard",
        "text": "Hasan shares grafts with nearby families and asks each to supply the hospice in turn."
      }
    },
    "conclusion": {
      "a": "The nurses’ meals improve; labelled seed jars remain ready for winter.",
      "b": "New fruit trees appear along the road, each tied to a family’s promise to the hospice."
    },
    "reward": {
      "money": 530,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "This orchard was planted by families who supplied the hospice outside Philomere. Each family maintained a graft row and delivered part of its harvest to the nurses. The names on the wooden tags identify those families; they are not military ownership marks.\n\nDuring the fighting, requisition parties began taking the fruit for marching columns. Raids made the delivery road unsafe, and the pickers left to find shelter. With no one tending the channels, water stopped reaching the youngest trees. The hospice lost its fresh food just as more wounded people arrived.\n\nHasan ibn Ali is trying to put the orchard back into use. Follow the graft tags towards Irrigation Crown and read the tenders’ water measures. Beyond the channels stands a sealed seed store. Its ripe fruit can help the hospice now, but its planting stock must survive if the same help is to exist next year.",
      "The orchard’s trees do not all need the same amount of water. A seedling has few roots, a sapling has a wider spread, and an established tree draws through the deepest beds. The channel tenders measured those differences with three marked water drums.\n\nWhen the pickers fled the requisition parties and fighting, nobody stayed to maintain the water shares. The drums were left at empty settings. Mature trees survived for a time on deep moisture, while the seedlings dried. Equal measures would still leave the larger root beds short of the flow they were planted to receive.\n\nThe old measure board assigns one measure to seedlings, two to saplings and three to established roots. The controls run left to right in that order. Restore those settings to reopen the irrigation path. The hospice depends on the existing harvest, but tending the younger trees is what keeps later harvests possible.",
      "The Hospice Seed Vault stores two different kinds of food. Ripe fruit was set aside for the patients’ meals. Seed jars and grafting stock were saved for the next season. The jars were labelled separately so a hungry delivery crew would not empty the planting reserve by mistake.\n\nWhen military collectors claimed the harvest, the keeper sealed this room rather than surrender everything. The orchard then lost its pickers and channel tenders to the war. A locked vault preserved some stock, but it could not carry food to the people waiting at the hospice.\n\nThe seed must remain reserved under either proposed plan. The first fruit can go directly to the hospice, or grafts can be shared with nearby families who agree to supply it in turn. After the final warden’s challenge, record the arrangement at the vault register. Hasan waits at Abandoned Graft Row to organise the deliveries or planting."
    ],
    "controlLabels": [
      "Seedling water",
      "Sapling water",
      "Established roots"
    ],
    "trainerVoices": [
      {
        "before": "First Light patrols burned the carts on the northern road. Our own collectors took the fruit that was left. Ask a hospice nurse which banner made her patients hungrier. Show me how you care for your partners.",
        "after": "They trust you. That is harder to earn than a seal on a requisition order.",
        "repeat": "An army can claim a harvest in an afternoon. A graft takes years to replace."
      },
      {
        "before": "I used to bring my daughter here at blossom time. Now I count wagon tracks to see whether the harvest has reached the kitchens or the barracks. Your partners look ready. Are you?",
        "after": "Well fought. There are people at the hospice who would have cheered that.",
        "repeat": "The kitchen has been boiling the same thin soup for days. The trees do not know how urgent we are."
      },
      {
        "before": "The seed store could feed the garrison today. Empty it, and next year we guard bare branches. I need to know you can think past the next victory. Take your place.",
        "after": "You have earned a hearing. Keep next winter in mind when you open that ledger.",
        "repeat": "The war keeps borrowing from next year. Sooner or later there will be nothing left to borrow."
      }
    ],
    "recordTitles": [
      "The Families Behind the Graft Tags",
      "Water for Three Ages of Tree",
      "The Harvest That Must Not Be Eaten"
    ],
    "recordSources": [
      "From the hospice orchard account",
      "A channel tender’s planting book",
      "An inventory left inside the seed vault"
    ]
  },
  {
    "key": "reedSanctuary",
    "title": "The Black Reed Trail",
    "stages": [
      "Siltmarked Channels",
      "Reed Filter Beds",
      "Warden’s Pool"
    ],
    "intro": "Something upstream is fouling the nesting pool. The old reeds can filter it, but their gates are closed. Trace the stained current, restore the filter beds, and bring me whatever identifies the dumping boats.",
    "clues": [
      "The film grows thicker as the current is followed upstream. A cargo tag is stained on the side facing the depot channel. The feathers at the pool outlet are clean underneath, suggesting the nests were here before the waste arrived.\n\nFollow the polluted current towards Reed Filter Beds. Win the first warden’s challenge to pass the gate, then inspect the maintenance board. It describes how the original workers made water settle before admitting it to the nursery pool.",
      "The heavy waste must be caught before water enters the reeds, and the reeds must receive the flow before it is released into the nursery. The three controls therefore cannot be used in any order.\n\nUse Settling gate in the middle first, Reed beds on the left second, Pool outlet on the right last: control 2 → 1 → 3. A wrong selection clears the sequence. Begin again with the settling gate, then check the restored route before facing the warden.",
      "The stained tags identify a cargo route used by the dumping boats. They do not by themselves remove the waste, but they give Asma something more definite than competing accusations between depots.\n\nAfter the last challenge, choose at the decision register whether to expose the route at market or establish a permanent filter watch with the boat families. Report to Asma at Siltmarked Channels. A repaired gate needs someone willing to prevent the next barrel being emptied upstream."
    ],
    "puzzleKind": "order",
    "puzzleClue": "Use settling gate, reed beds, then pool outlet: middle, left, right.",
    "solution": [
      1,
      0,
      2
    ],
    "affinity": "WATER",
    "objective": [
      "Trace the polluted current",
      "Restore the reed filters",
      "Read the site register, win the last warden’s challenge and choose how to care for Warden’s Pool"
    ],
    "guardianIds": [
      "079",
      "133",
      "261"
    ],
    "choice": {
      "a": {
        "label": "Expose the dumping route",
        "text": "Asma takes the stained cargo tags to the market and demands a watched disposal site."
      },
      "b": {
        "label": "Build a permanent filter watch",
        "text": "Asma trains boat families to tend the reed beds and inspect incoming water."
      }
    },
    "conclusion": {
      "a": "Merchants must now account for the waste they carry upriver.",
      "b": "Families take turns cutting the reeds; clean channels remain open through the nesting season."
    },
    "reward": {
      "money": 580,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "The reeds here were deliberately tended as a living filter. Heavy river waste settled before entering the beds, and the reed roots trapped what remained. Cleaner water then flowed into a nesting pool and on to the boat settlements below.\n\nAs wartime depots expanded upstream, supply boats began leaving oily waste in the narrow channels. The filter gates clogged, and the crews who once cut the reeds stopped coming. Dark water reached the nests. Families downstream now have to carry drinking water from other landings, while each depot denies responsibility for the dumping.\n\nAsma bint Musa is following the stained current towards its source. The darkest film is above the pool, which suggests waste is entering upstream rather than coming from the nesting Abyssals. Find the old filter board farther along the trail. Restoring the water’s proper route will help the pool; identifying the dumping boats may keep it clean afterwards.",
      "The Reed Filter Beds were built to slow dirty water in three stages. The settling gate caught the heaviest waste. The reeds took the slower flow and trapped finer dirt around their roots. The outlet then carried the cleaned water into the nesting pool.\n\nDepot waste clogged the first gate, and neglected reeds blocked the next channel. Water began bypassing the beds, carrying oily film straight towards the nests. Opening the pool outlet first would release more of that dirty water before the filters could work.\n\nStart with the settling gate in the middle. Then open the reed beds on the left. Release the pool outlet on the right last. The sequence restores the intended route rather than simply opening every passage. Clean water matters beyond the sanctuary: boat families draw from this river, and the market’s fish are caught downstream of it.",
      "The Warden’s Pool is a nursery for Water Abyssals. Young animals shelter among the reeds before moving into the larger river. The boat families below the outlet relied on the same current for washing, drinking and fishing, so keeping the pool healthy served both people and Abyssals.\n\nArmy supply depots now crowd the upper channels. Waste barrels have been carried into quiet reaches and emptied beyond the busy docks. Stained cargo tags can show which route the dumping boats used, even when their crews blame another depot or the opposing army.\n\nA restored filter will need protection from further waste. Asma could take the tags to market and expose the cargo route publicly. Or boat families could maintain a permanent watch and tend the filter beds themselves. After the final challenge, enter the plan at the pool register. Return to Asma at Siltmarked Channels with the recovered evidence and your decision."
    ],
    "controlLabels": [
      "Reed beds",
      "Settling gate",
      "Pool outlet"
    ],
    "trainerVoices": [
      {
        "before": "First Light raids drove the depot boats into these narrow channels. Our officers kept them here after the raids stopped. Now the waste comes down with our own seals on the barrels. Ready your partners.",
        "after": "You have earned passage. Mind the water on their coats.",
        "repeat": "The boat families cannot move their homes whenever a depot moves its rubbish."
      },
      {
        "before": "My orders say to keep this channel clear for supply barges. Asma says the nests will die if another barge washes through. There is no spare river on my map. I will test you here on dry ground.",
        "after": "You kept control. That is more than I can say for the depot crews.",
        "repeat": "The garrison buys its fish downstream. We are poisoning tomorrow’s rations and paying boatmen to do it."
      },
      {
        "before": "Merchants blame soldiers; soldiers blame enemy boats. I have been guarding the same stained pool through all of it. Show me someone can finish a thing they started.",
        "after": "Then let us hear what you intend to do about the dumping.",
        "repeat": "A clean river crosses the border whether either army permits it or not."
      }
    ],
    "recordTitles": [
      "The River the Reeds Used to Clean",
      "How the Filter Beds Work",
      "Who Lives Below the Outlet"
    ],
    "recordSources": [
      "A reed warden’s public account",
      "The boat families’ maintenance instructions",
      "From the pool keeper’s cargo book"
    ]
  },
  {
    "key": "coralGrotto",
    "title": "The Reef Toll",
    "stages": [
      "Broken Mooring Cove",
      "Tide Lock Chambers",
      "Coral Pilgrim Vault"
    ],
    "intro": "The reef crossing used to be free. Now its locks are jammed and a toll crew claims the only safe landing. Follow the old pilgrim shells, work out the tide-lock order, and help me reopen the crossing.",
    "clues": [
      "The shell markers carry several coast scripts but no marks for paid passage. Their pointed edges face the original lock trail. A newer toll stake has been driven across one marker, showing that the fee post came later than the crossing.\n\nFollow the shell trail to Tide Lock Chambers after the path warden’s challenge. The plate there explains how to release the water pressure safely. Do not treat the entrance gate as the first control simply because it is the nearest way in.",
      "The lock plate describes what is trapped behind the entrance. Water must drain through the deep gate, then air must leave through the side vent. Opening the entrance before both steps would flood the walking passage.\n\nUse Deep-water gate on the right, Side vent in the middle, Entrance gate on the left: control 3 → 2 → 1. A wrong control clears the sequence, allowing you to begin again. The warden’s challenge follows the completed cycle.",
      "The vault inventory lists practical refuge supplies and missing travellers, with no original toll schedule. Maintaining a safe crossing could be done through a free public route or a mooring supported by voluntary donations.\n\nWin the last warden’s challenge and use the decision register beyond the post to choose. Then report to Ismail at Broken Mooring Cove. Restoring the locks opens the route, but Ismail needs an agreement about who keeps its lamps and rescue ropes ready."
    ],
    "puzzleKind": "order",
    "puzzleClue": "Release deep-water gate, side vent, then entrance: right, middle, left.",
    "solution": [
      2,
      1,
      0
    ],
    "affinity": "WATER",
    "objective": [
      "Read the pilgrim shell trail",
      "Cycle the tide locks",
      "Read the site register, win the last warden’s challenge and choose how to care for Coral Pilgrim Vault"
    ],
    "guardianIds": [
      "079",
      "139",
      "270"
    ],
    "choice": {
      "a": {
        "label": "Restore free passage",
        "text": "Ismail replaces the toll notice with tide times and safe crossing marks."
      },
      "b": {
        "label": "Fund a rescue mooring",
        "text": "Ismail asks for voluntary rope and lamp donations to maintain a shelter at the reef."
      }
    },
    "conclusion": {
      "a": "Boats cross by the tide markers again; Ismail keeps the lost pilgrims’ names in the vault.",
      "b": "A stocked mooring replaces the toll post. Travellers leave what they can spare."
    },
    "reward": {
      "money": 640,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "Coast families and pilgrims once maintained this reef crossing together. Travellers left rope, oil or labour when they could spare it. Shell markers in several scripts showed the safe landing and the time of tide. No payment was required before a boat could shelter.\n\nThe war closed inland roads and pushed more grain boats towards the reef. Toll crews seized the narrow mooring, removed the tide markers and demanded coins from every arrival. A raid later forced the tide locks shut. The old crossing became both dangerous and expensive, while smaller boats began risking unmarked channels to avoid the fee.\n\nIsmail ibn Hasan is tracing the original shell trail. Follow the surviving markers towards Tide Lock Chambers and find the keeper’s instructions. The chambers must be drained and vented before their entrance is opened. Safe passage could reconnect fishing villages and markets that can no longer rely on the inland road.",
      "These chambers made the reef passage usable between tides. A deep-water gate released the water held against the inner wall. A side vent let trapped air escape. Only then could the entrance be opened without driving water through the passage.\n\nWhen a raid threatened the mooring, the toll crew closed everything and withdrew. Water and air were left trapped inside. From the dry landing the entrance may look safe, but opening it first would expose the path to pressure the other controls were built to release.\n\nThe keeper’s plate puts the deep-water gate on the right, the side vent in the middle and the entrance on the left. Use them in that order. The instructions concern the water inside the chambers, not the order in which the controls are nearest to you. Beyond them lies the old refuge where travellers once waited safely for the next tide.",
      "The Coral Pilgrim Vault was a refuge rather than a treasury. Its shelves held ropes, lamps, blankets and the names of travellers who had not reached the next port. Boats arriving too late for the tide tied up here until a keeper could guide them through.\n\nWartime traffic brought toll collectors. They replaced the refuge table with a payment desk and claimed their fees supported the coast watch. The old inventory shows what the crossing actually needs: maintained moorings, clear tide marks and basic rescue supplies. Coins alone do not provide any of those things.\n\nIsmail could restore free passage and put the tide markers back. Or he could organise a rescue mooring supplied through voluntary rope and oil donations. After the last warden’s challenge, record the arrangement in the refuge register. Ismail waits at Broken Mooring Cove. The choice will determine how the reopened crossing is maintained, not whether travellers must surrender belongings before they are allowed ashore."
    ],
    "controlLabels": [
      "Entrance gate",
      "Side vent",
      "Deep-water gate"
    ],
    "trainerVoices": [
      {
        "before": "First Light seized the inland road, so grain boats began hugging this reef. A toll appeared the next morning. There is always someone ready to make a profit when an army closes a road. Show me your partners.",
        "after": "You can cross my post. Take care of the boats already waiting.",
        "repeat": "Some crews have sold their spare rope to pay the toll. I wonder what they will throw to the next drowning sailor."
      },
      {
        "before": "The toll master says his fees pay for our coast watch. I mend my own coat and borrow lamp oil from Ismail. You may ask him where the money goes after our challenge.",
        "after": "A clean victory. You are owed passage.",
        "repeat": "I joined to keep raiders from the fishing boats. Charging the boats to survive our protection was never part of it."
      },
      {
        "before": "A free crossing could carry First Light scouts as easily as pilgrims. A closed one leaves our own villages hungry. That is the argument I get every morning. Let me see your judgement in battle.",
        "after": "The register is open to you. Give the next boat somewhere safe to tie up.",
        "repeat": "The sea takes enough from the coast without us adding a price to every landing."
      }
    ],
    "recordTitles": [
      "The Crossing Before the Toll",
      "A Door Held Shut by the Tide",
      "What the Pilgrims Left Behind"
    ],
    "recordSources": [
      "From a coastal pilgrims’ crossing book",
      "A tide keeper’s lock instructions",
      "An inventory of the pilgrim refuge"
    ]
  },
  {
    "key": "moonlitDepths",
    "title": "Names Beneath the Tide",
    "stages": [
      "Moonpool Landing",
      "Mourning Lamp Walk",
      "Drowned Name Chapel"
    ],
    "intro": "The chapel below the pools holds names scraped away after the fighting. The old ferryman left a lamp record. Find the mourning signal, reach the tablets, and help me return the names to the people who lost them.",
    "clues": [
      "The ferryman’s note was hidden beneath the mooring stone when the landing became a military post. It calls the middle light the Mourning lamp and warns families away from the barracks alarms on either side.\n\nFollow the marked path towards Mourning Lamp Walk after the first warden’s challenge. The signal sketch there explains which lights must remain dark. The aim is to reopen the chapel route, not to reproduce the garrison’s emergency signal.",
      "The sketch shows one middle light between two crossed-out alarms. The outer lamps summoned soldiers; the middle guided families to the chapel. Their control chains were joined during the occupation, so changing one lamp may change another.\n\nLeave West alarm dark, Mourning lamp lit, East alarm dark. Control 1 reverses lamps 1 and 2; control 2 reverses lamps 2 and 3; control 3 reverses only lamp 3. Reset clears all lights. Check the final pattern, then speak to the warden.",
      "Names can still be read beneath the newer military orders. They belong to civilians whose relatives may not know a record survived. Some names are too damaged to recover, and their spaces should not be filled with guesses.\n\nAfter the last challenge, use the decision register to choose family copies or a shared public memorial. Return to Ali at Moonpool Landing to organise the work. The decision concerns how to return the surviving names to people, rather than which faction may claim the chapel."
    ],
    "puzzleKind": "lanterns",
    "puzzleClue": "Light the mourner’s middle lamp; leave both garrison alarm lamps dark.",
    "solution": [
      false,
      true,
      false
    ],
    "affinity": "GHOST",
    "objective": [
      "Gather the erased names",
      "Set the mourning signal",
      "Read the site register, win the last warden’s challenge and choose how to care for Drowned Name Chapel"
    ],
    "guardianIds": [
      "053",
      "139",
      "255"
    ],
    "choice": {
      "a": {
        "label": "Return the names to families",
        "text": "Ali makes small copies for surviving relatives before displaying the tablet."
      },
      "b": {
        "label": "Create a shared memorial",
        "text": "Ali restores every readable name together without separating them by faction."
      }
    },
    "conclusion": {
      "a": "Families carry the copies home. The empty spaces remain marked for those still unidentified.",
      "b": "Fresh flowers float beside the shared tablet; neither army receives a place above the names."
    },
    "reward": {
      "money": 700,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "Before the landing became a military post, families crossed this pool to visit a chapel beneath the tidal rock. A ferryman guided them by a mourning lamp. The chapel kept the names of local people who had died, allowing relatives to leave flowers even when no body had been returned.\n\nA garrison later took over the landing. Its soldiers fitted alarm lamps beside the old signal and restricted access to the chapel. After fighting in the district, a military clerk scraped civilian names from the tablets and wrote orders over the stone. Families were left unsure whether their relatives had ever been recorded.\n\nAli ibn Umar has found the ferryman’s hidden directions. Search beneath the mooring stone, then follow the lamp walk below the pools. Restoring the mourning signal can reopen the way to the tablets. The lost names are the reason to go there; the chapel was a place of remembrance before either army made it part of the war.",
      "The middle lamp was the ferryman’s sign that mourners could follow him beneath the tide. Families waited on the landing until it was lit. Neither outer lamp formed part of that old crossing signal.\n\nWhen the garrison occupied the landing, soldiers added the west and east alarms to summon patrols. They linked the control chains so one watchman could raise several signals quickly. After the garrison left, damage to the chains made the arrangement confusing. Lighting every lamp would reproduce an alarm, not the invitation to the chapel.\n\nLeave the Mourning lamp in the middle lit and both alarm lamps dark. The first control also changes the middle light; the second also changes the right-hand alarm; the third changes its own lamp alone. Read the ferryman’s sketch and check the complete pattern. The route below was made for grieving families and can be used again without calling a patrol.",
      "The Drowned Name Chapel kept a public record for people whose deaths might otherwise be forgotten. Some families could not afford a grave marker; others never recovered a relative from the road or river. A name here gave them somewhere to bring flowers and tell their children what had happened.\n\nAfter the district changed hands, a clerk removed names judged inconvenient to the garrison’s account of the fighting. Orders were carved across the same tablets. The stone was scraped too shallowly to destroy everything. Letters remain beneath the newer writing.\n\nAli can make copies for surviving families before the tablets are displayed. Or the recovered names can be restored together as a shared memorial, without separating them by faction. After the final challenge, choose at the tablet register. Return to Ali at Moonpool Landing. Empty spaces will remain for unreadable names; choosing a memorial cannot recover what the stone no longer holds."
    ],
    "controlLabels": [
      "West alarm",
      "Mourning lamp",
      "East alarm"
    ],
    "trainerVoices": [
      {
        "before": "First Light calls the dead here enemy sympathisers. Our officers call them martyrs. My aunt sold bread to anyone who had a coin. Her name belongs to neither report. Prepare for your challenge.",
        "after": "You can pass. If you find her name, read it properly.",
        "repeat": "Her stall stood by the landing. I still turn towards it when I come off the boat."
      },
      {
        "before": "The alarms were meant to warn the garrison. They kept the mourners away long after the soldiers had gone. I was told to leave them as they were. Show me why I should let you through.",
        "after": "All right. I will not raise an alarm over flowers and a few old names.",
        "repeat": "A truce can reopen a road. It takes longer to persuade a family it is safe to use it."
      },
      {
        "before": "The new orders gave the chapel a military name. Nobody here uses it. You cannot command people to forget a place just by changing the sign. Let us settle your passage.",
        "after": "You have earned access to the tablets. Take time over them.",
        "repeat": "When officers ask how long this war will last, I think of the children learning where their grandparents disappeared."
      }
    ],
    "recordTitles": [
      "The Chapel Beneath the Pools",
      "A Lamp for Mourners, Two for Soldiers",
      "The Names Below the Orders"
    ],
    "recordSources": [
      "Copied from a ferryman’s account",
      "The old landing’s signal book",
      "A chapel attendant’s surviving note"
    ]
  },
  {
    "key": "relicCrags",
    "title": "The Witness in Stone",
    "stages": [
      "Fractured Shell Shelf",
      "Witness Seal Court",
      "Crag Record Chamber"
    ],
    "intro": "Both armies claim this refuge. The broken shellstone records describe a hearing that stopped before its ruling. Read the fragments, restore the witness sequence, and help me establish who was meant to care for this place.",
    "clues": [
      "The first fragment dates the refugees’ arrival before the military banners on the ridge. That detail matters: the families were not settlers brought in by either army to establish a new claim.\n\nFollow the matching shellstone marks to Witness Seal Court after the first warden’s challenge. The clerk’s order there identifies the remaining testimony. Read it before setting the seals, so the hearing is restored in the sequence its witnesses were actually heard.",
      "The hearing begins with the families’ arrival, then establishes where the armies stood, then names the lawful civilian keeper. Changing that order would confuse the basis of the refuge claim.\n\nUse Arrival testimony on the left, Ridge testimony in the middle, Keeper’s record on the right: control 1 → 2 → 3. A wrong seal clears the sequence. Restore the hearing, then win the court warden’s challenge to reach the record chamber.",
      "The keeper’s record assigns the spring to civilian care. The completed testimony supports that duty, but somebody still needs a way to defend it when the next military company arrives.\n\nAfter the last challenge, choose at the decision register to return custody to the keeper’s descendants or preserve the whole hearing as a public record. Return to Amina at Fractured Shell Shelf with your decision. Both plans keep the original witnesses’ words; they differ in who carries the responsibility for them."
    ],
    "puzzleKind": "evidence",
    "puzzleClue": "Present arrival testimony, ridge testimony, then the keeper’s record: left, middle, right.",
    "solution": [
      0,
      1,
      2
    ],
    "affinity": "ROCK",
    "objective": [
      "Compare the shellstone testimony",
      "Complete the witness sequence",
      "Read the site register, win the last warden’s challenge and choose how to care for Crag Record Chamber"
    ],
    "guardianIds": [
      "025",
      "077",
      "349"
    ],
    "choice": {
      "a": {
        "label": "Restore civilian custody",
        "text": "Amina gives the keeper’s descendants a copy of the completed hearing."
      },
      "b": {
        "label": "Preserve a public record",
        "text": "Amina displays the full hearing so neither army can quietly claim the refuge."
      }
    },
    "conclusion": {
      "a": "The refuge gains a civilian keeper again; both factions are asked to leave their weapons outside.",
      "b": "The hearing stands open on the crag wall, with every witness’s words beside the ruling."
    },
    "reward": {
      "money": 620,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "Travellers used the spring beneath these crags before either army built a post on the ridge. A civilian keeper maintained the draw and gave families shelter beside it. When armed columns began passing through, both sides claimed the refuge as part of their military road.\n\nThe families brought their complaint to a tribunal. Witnesses described when the refugees had arrived, where the troops first raised banners and who had cared for the water. Fighting interrupted the hearing before its final seal was set. Broken shellstone fragments preserve the testimony, but neither army recognises an unfinished ruling.\n\nAmina bint Ibrahim is comparing the fragments. Follow their matching marks into Witness Seal Court and restore the witnesses in the clerk’s recorded order. The completed hearing could establish civilian custody of the spring. Without it, garrisons keep charging the same families for water their keeper once supplied freely.",
      "Witness Seal Court preserved a hearing through numbered shellstone seals. The clerk placed testimony in the order it had been heard, so a later reader could distinguish the original statements from a final decision. A seal out of order would give a misleading account of the case.\n\nThis hearing concerned the refuge spring. The first witness described families arriving before the troops. The second placed armed banners on the ridge rather than inside the refuge. The keeper’s record then explained who had maintained the water and on whose behalf.\n\nFighting broke the court before that sequence was completed. Set the arrival testimony first, ridge testimony second and keeper’s record third. The seals stand left, middle and right. Restoring them will make the hearing readable as a whole. It cannot remove the armies by itself, but it gives the civilian claim a record that a new captain cannot quietly replace with another order.",
      "The Crag Record Chamber held the spring keeper’s duties and the refuge’s water agreement. Civilian custody did not mean the keeper could deny a traveller water at whim. It meant the spring was maintained for the road families, rather than treated as a source of garrison income.\n\nWhen the hearing was interrupted, military claimants used the lack of a final seal to disregard those duties. Each new company charged its own levy. Families paid again whenever the ridge changed hands, even though the draw-rope and water never moved.\n\nThe completed testimony could return custody to the keeper’s descendants. Alternatively, the entire hearing could be displayed publicly so anyone challenging the refuge must answer its witnesses. After the final warden’s challenge, choose at the chamber register. Amina waits at Fractured Shell Shelf. The choice concerns how the civilian record will be upheld; it does not grant a new army ownership of the spring."
    ],
    "controlLabels": [
      "Arrival testimony",
      "Ridge testimony",
      "Keeper’s record"
    ],
    "trainerVoices": [
      {
        "before": "First Light claims these walls because its banner stood on the ridge. Our captains claim them because we drove that banner off. The families below were here before either of us. Show me your strength.",
        "after": "Strong enough to reach the court. I hope you listen when you get there.",
        "repeat": "We keep winning the same spring and sending the same families away from it."
      },
      {
        "before": "I have carried three different orders naming three different owners. Every one says the matter is settled. The water keeper is still waiting outside. Your challenge comes first.",
        "after": "You have earned your way through. Those seals might settle more than my orders ever did.",
        "repeat": "The spring feeds the caravan road. Control the buckets and you control who can travel. No wonder the captains keep arguing."
      },
      {
        "before": "If the refuge is civilian ground, my company loses its water levy. That levy buys our rations. I know what that sounds like. Take your place; then we will talk about the record.",
        "after": "I will not destroy a record because it is inconvenient. The hearing is yours to finish.",
        "repeat": "I have asked for proper supply pay. If it comes, perhaps the water keeper can stop paying for my supper."
      }
    ],
    "recordTitles": [
      "The Refuge Older Than the Banners",
      "A Hearing Left Unfinished",
      "Who Is Entitled to the Spring"
    ],
    "recordSources": [
      "From the shellstone testimony fragments",
      "The tribunal clerk’s order of evidence",
      "A copy of the refuge water record"
    ]
  },
  {
    "key": "philomereBackwaters",
    "title": "The Three Missing Barges",
    "stages": [
      "Cargo Reed Maze",
      "Flood Balance Locks",
      "Boatwright’s Dry Dock"
    ],
    "intro": "Three supply barges are caught beyond the reeds. Their cargo was meant for three settlements. Follow the manifests, balance the flooded locks, and help me recover the loads before another patrol claims them.",
    "clues": [
      "The manifests name three loads: bandages, grain and timber. Their receivers are settlements, not military companies. The painted hulls were an attempt to protect the convoy on the main river; they do not change who was supposed to receive the goods.\n\nFollow the cargo trail through the three stretches, collecting marked crates where you find them. After the first warden’s challenge, inspect the counterweight board at Flood Balance Locks. It explains how to free the stranded route without abandoning the heaviest barge.",
      "Each lock must be balanced for the barge caught beside it. The medical boat is lightest, the grain barge is heavier and the timber barge heaviest. Giving all three drums the same setting will not restore the old balance.\n\nSet Bandage lock on the left to 1, Grain lock in the middle to 2, Timber lock on the right to 3. Each press cycles its drum through 0–3. Check the amounts shown, then win the lock warden’s challenge to reach the dock.",
      "The receivers’ ledger confirms where the three loads were meant to go. A note from the boatwright also records the timber needed to repair the public ferry. There is a real choice between immediate delivery and restoring transport first.\n\nWin the final challenge, then use the decision register to deliver by the manifests or use agreed timber for the ferry before distributing the rest. Report to Alice at Cargo Reed Maze. Recovering the earlier marked crates is a separate collection she can also account for there."
    ],
    "puzzleKind": "weights",
    "puzzleClue": "Balance the locks with one counterweight for bandages, two for grain, three for timber.",
    "solution": [
      1,
      2,
      3
    ],
    "affinity": "WATER",
    "objective": [
      "Trace the three cargo manifests",
      "Balance the flooded locks",
      "Read the site register, win the last warden’s challenge and choose how to care for Boatwright’s Dry Dock"
    ],
    "guardianIds": [
      "106",
      "052",
      "116"
    ],
    "choice": {
      "a": {
        "label": "Deliver by the manifests",
        "text": "Alice returns each load to its named community before taking a salvage fee."
      },
      "b": {
        "label": "Repair the ferry first",
        "text": "Alice uses agreed timber to repair the public ferry, then delivers the remaining supplies."
      }
    },
    "conclusion": {
      "a": "Three receivers sign for their goods; Alice keeps their receipts out of military hands.",
      "b": "The repaired ferry reconnects the settlements and carries the other two loads home."
    },
    "reward": {
      "money": 780,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "The backwater channels connected three small settlements to Philomere’s market. Their boats carried timber towards the town and returned with food, cloth and medicine. Boatwright Alice de Vesci maintained the ferry that let workers and families cross between the banks.\n\nDuring the fighting, patrols began stopping cargo on the main river. Three civilian supply barges had been given military paint in the hope that an escort’s colours would protect them. Instead they were forced into these narrow reeds. The pilots left, the flood locks went unattended, and the barges settled against closed gates.\n\nTheir manifests still name the settlements waiting for the loads. Follow the scattered cargo marks towards Flood Balance Locks. The boatwright’s counterweight instructions can make the channel passable again. Beyond it lies the dry dock, where the timber cargo may help repair the public ferry if an agreement can be reached with its intended receivers.",
      "The backwater locks were built to move different loads through the same flood channel. Medical cargo travelled on the lightest barge, grain on a middle load, and timber on the heaviest. Counterweights held each lock stable while a loaded hull passed through.\n\nWhen the convoy was driven off the main river, its pilots could not complete the lock cycle. The water rose around the stranded barges, and the drums were left at empty settings. Trying to open every gate without restoring the balance would leave the loaded boats pressed against them.\n\nThe boatwright marked one counterweight for bandages, two for grain and three for timber. The drums stand left, middle and right in that order. Set those amounts to restore the flood balance. The cargo is recorded as civilian supplies, even though its hulls carry military paint; the people waiting for it did not become an army simply because someone changed the boats’ colours.",
      "The Boatwright’s Dry Dock repaired the public ferry and the small cargo craft serving the backwater settlements. Its work depended on a steady supply of timber and the ability of carpenters to cross the river. Checkpoints and fighting interrupted both.\n\nThe three stranded barges carried bandages, grain and timber to named civilian receivers. Delivering them as listed would honour those claims. Yet the ferry is still broken, preventing workers and families from reaching one another. Using some of the timber for repairs could make later deliveries possible, provided its owners agree.\n\nAlice offers to return each load to its recorded settlement, or use agreed timber to repair the ferry first and deliver what remains. After the dock warden’s challenge, record the arrangement at the receivers’ register. Return to Alice at Cargo Reed Maze to organise it. Repairing the flood locks allows salvage; the cargo decision determines who receives the benefit first."
    ],
    "controlLabels": [
      "Bandage lock",
      "Grain lock",
      "Timber lock"
    ],
    "trainerVoices": [
      {
        "before": "First Light checked every boat on the main river. Our convoy turned into the reeds and lost its pilots. Now the officers call these three loads missing in action. The villages still call them dinner and medicine. Ready yourself.",
        "after": "You can follow the barges. I will keep the main channel watched.",
        "repeat": "Military paint was meant to protect the cargo. It seems to have painted a target on it instead."
      },
      {
        "before": "My ration boat arrives under escort. Alice has been asking for one pilot to bring these supplies home. The river captain says he has nobody to spare. Let us see how you manage a small company.",
        "after": "You made good use of what you had. The river captain could learn something.",
        "repeat": "If the backwater villages empty, the garrison loses its boatbuilders. I keep putting that in my reports."
      },
      {
        "before": "The ferry carried workers to both banks before the checkpoints. Repair it and somebody will accuse us of helping the enemy cross. Leave it broken and our own carpenters cannot get home. Take your position.",
        "after": "I will accept your judgement on the cargo. Alice knows the people waiting for it.",
        "repeat": "A repaired ferry will still be carrying people when the latest checkpoint has rotted into the river."
      }
    ],
    "recordTitles": [
      "Three Barges Off the River Road",
      "Balancing the Flooded Gates",
      "The Ferry and the Waiting Villages"
    ],
    "recordSources": [
      "A boatwright’s account of the lost convoy",
      "From the dry dock’s lock manual",
      "Notes in the cargo receivers’ ledger"
    ]
  },
  {
    "key": "smugglersWeir",
    "title": "A Bell for the Uncounted",
    "stages": [
      "Silent Ferry Reach",
      "Night Signal Walk",
      "Hidden Passenger Quay"
    ],
    "intro": "My ferry bell vanished, and the night landing has gone quiet. Families may be using it to avoid the toll patrols. Follow their marks, restore the safe lamp, and find a way to bring the bell back without abandoning them.",
    "clues": [
      "The chalk boat has been drawn under the middle lamp. Beside it is a request for silence near the water. These are passengers trying to avoid patrols, not cargo marks pointing towards a hidden weapons store.\n\nFollow the chalk towards Night Signal Walk after the first path warden’s challenge. The old signal there distinguishes the safe landing from the toll alarms. Umar’s bell was carried farther up to the quay, where it warns boats away from the rocks.",
      "The middle light is the invitation to the safe landing. The two outer lights call armed toll boats. The aim is therefore to guide passengers with one light, not to light the whole bank.\n\nLeave West toll alarm dark, Safe landing lit, East toll alarm dark. Control 1 also reverses lamp 2; control 2 also reverses lamp 3; control 3 moves only itself. Reset puts all lights out. Check the final pattern, then win the warden’s challenge to continue.",
      "The passenger register lists blankets and family names, with no weapons among the loads. Returning the borrowed bell would help Umar’s ferry, but the families still need a usable route through the checkpoints.\n\nAfter the final warden’s challenge, choose a declared civilian crossing or a discreet night landing at the decision register. Return to Umar at Silent Ferry Reach. The actual bell remains part of his recovery job at the upper landing; the route agreement decides what happens to the passengers afterwards."
    ],
    "puzzleKind": "lanterns",
    "puzzleClue": "Light the safe middle signal only; keep both toll alarms dark.",
    "solution": [
      false,
      true,
      false
    ],
    "affinity": "DARK",
    "objective": [
      "Investigate the hidden passenger route",
      "Set a safe ferry signal",
      "Read the site register, win the last warden’s challenge and choose how to care for Hidden Passenger Quay"
    ],
    "guardianIds": [
      "022",
      "054",
      "111"
    ],
    "choice": {
      "a": {
        "label": "Create a civilian ferry route",
        "text": "Umar returns the bell and announces an unarmed route for displaced families."
      },
      "b": {
        "label": "Keep the night landing quiet",
        "text": "Umar returns the bell but leaves the discreet safe signal for families avoiding patrols."
      }
    },
    "conclusion": {
      "a": "The daytime ferry makes space for families without travel seals.",
      "b": "The bell returns to its post; at night, one quiet lamp still marks the sheltered landing."
    },
    "reward": {
      "money": 830,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "This reach was once an ordinary ferry route between market settlements. People crossed to buy flour, visit relatives or find work. When the war divided the river, checkpoints began demanding travel seals. Families displaced from the road often had no documents accepted on either bank.\n\nSome boatmen began landing those passengers at a sheltered quay after dark. Toll crews called the route smuggling and seized boats, even when their cargo was blankets and cooking pots. The pilots developed a quiet lamp signal so families could find the safe landing without summoning an armed toll boat.\n\nUmar ibn Hasan’s ferry bell was taken to this quay to warn arrivals away from the rocks. Follow the passenger chalk marks towards Night Signal Walk. Restoring the safe lamp can guide boats again. The bell’s return must also be arranged, so one landing is not made safe by leaving another without a warning.",
      "Night Signal Walk served families using the sheltered passenger quay. Its middle lamp told unarmed boats that the safe landing was clear. The two outer lights were toll alarms: armed crews answered them, expecting an interception or a seizure.\n\nA patrol damaged the signal chains while trying to close the route. The landing was left dark, and the remaining controls no longer move independently. Lighting every lamp would call the toll boats to the very families the pilots were trying to guide away from them.\n\nThe safe pattern is one middle light, with both outer alarms dark. The left control also changes the middle lamp. The middle control also changes the right lamp. The right control moves its own lamp alone. The child’s boat drawing preserves which light the passengers trust. Restore that pattern before continuing towards the quay and its register of people waiting to cross.",
      "The Hidden Passenger Quay shelters families unable to obtain travel seals. Its register lists names, blankets and places where relatives may be found. It contains no weapon cargo. The borrowed ferry bell hangs at the upper landing to warn arriving boats away from the rocks.\n\nThe bell belongs to Umar’s regular ferry, whose passengers also need a warning. Returning it need not mean closing the night route. The question is whether the families here should use an openly declared civilian crossing or retain a quiet landing while the checkpoints remain dangerous to them.\n\nAfter the quay warden’s challenge, choose at the passenger register. A declared route could make space for people without seals in daylight. A discreet route would keep the safe night signal available. Return to Umar at Silent Ferry Reach to arrange the crossing. The lookout’s separate challenge and recovery of the bell are handled at the upper landing."
    ],
    "controlLabels": [
      "West toll alarm",
      "Safe landing",
      "East toll alarm"
    ],
    "trainerVoices": [
      {
        "before": "First Light turns away people without its seal. Our river officers do the same with ours. My cousin has one of each and is frightened to show either. Prepare your partners.",
        "after": "You may pass my post. Keep your voice down by the passengers.",
        "repeat": "A border is a line to an officer. To my cousin it is three days looking for a boat."
      },
      {
        "before": "They call everyone on these boats a smuggler. Yesterday the seized cargo was blankets and a cooking pot. I am still waiting to hear which army those were meant to arm. Your challenge, then.",
        "after": "That was fairly fought. I will not hold you here.",
        "repeat": "The toll crews earn a share of what they seize. There will always be smugglers while that is how they are paid."
      },
      {
        "before": "If I report this landing, the patrol will close it. If I keep quiet and a boat sinks, the families will ask why I did nothing. I need more than another promise. Show me what you can do.",
        "after": "You have earned a say. Umar knows these waters; make your plan with him.",
        "repeat": "I joined the river watch to bring people ashore. I would like that to be my work again."
      }
    ],
    "recordTitles": [
      "How Passengers Became Smugglers",
      "The Signal the Toll Boats Do Not Answer",
      "The Bell at the Hidden Landing"
    ],
    "recordSources": [
      "From the ferryman’s passenger account",
      "A night boat pilot’s chalk instructions",
      "Notes kept with the passenger register"
    ]
  },
  {
    "key": "saltFlats",
    "title": "The Measure of Thirst",
    "stages": [
      "Ledger Salt Trail",
      "Cistern Weight Court",
      "Caravan Water House"
    ],
    "intro": "The water house says its cistern is failing, but I have seen full buckets going out the back. Find the missing accounts and put them in order. We need proof before the keeper can be made to repay the levy.",
    "clues": [
      "The oldest receipt records a full cistern. The later levy claims emergency repairs, but there are no entries for tools, materials or labour. That gap makes the charge suspicious; it does not yet show who received the money.\n\nCollect the missing pages along the three stretches and follow the account marks towards Cistern Weight Court. After the first warden’s challenge, examine the evidence order there. The private payment page completes the trail from water charge to the person who profited.",
      "The order of the papers explains the fraud. A full supply existed before the repair levy was demanded, and the private payment happened after the extra coins were collected. Presenting that sequence lets another reader understand the accusation without taking Fatima’s word for it.\n\nUse Full-cistern receipt on the left, Repair levy on the right, Private account in the middle: control 1 → 3 → 2. A wrong seal clears the sequence. Restore the record, then face the court warden.",
      "The account links the extra water payments to private funds. The recovered money could be returned to identified caravans, or used to give travellers a free daily drinking allowance. These are different ways to address the harm, not evidence of different culprits.\n\nAfter the final challenge, make the choice at the decision register and report to Fatima at Ledger Salt Trail. Her original page-recovery job also ends there; keep any recovered ledger pages for her to account for."
    ],
    "puzzleKind": "evidence",
    "puzzleClue": "Show the full-cistern receipt, false repair levy, then private-account page: left, right, middle.",
    "solution": [
      0,
      2,
      1
    ],
    "affinity": "GROUND",
    "objective": [
      "Find the missing water accounts",
      "Reconstruct the water-house evidence",
      "Read the site register, win the last warden’s challenge and choose how to care for Caravan Water House"
    ],
    "guardianIds": [
      "037",
      "082",
      "089"
    ],
    "choice": {
      "a": {
        "label": "Repay the charged caravans",
        "text": "Fatima tracks each receipt and returns the unlawful levy."
      },
      "b": {
        "label": "Fund free drinking water",
        "text": "Fatima publishes the fraud and puts the recovered levy into a public cistern fund."
      }
    },
    "conclusion": {
      "a": "Receipts are crossed off as families receive their coins; the levy disappears.",
      "b": "The water house displays a daily free allowance, paid for from the recovered account."
    },
    "reward": {
      "money": 880,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "The Salt Flats water house was built where caravans could refill before the road to Cybressa. Its keeper charged a fixed measure for maintaining the cistern and draw-rope. Travellers knew the cost before entering the flats and carried enough coin for the return journey.\n\nWhen raiding made escorts expensive, the keeper added an emergency repair levy. The charge differed between caravans, while favoured military wagons still drew freely. Small carriers began selling goods before reaching market just to pay for water. The accounts vanished when merchants asked what had been repaired.\n\nFatima bint Ali has found pages scattered along the salt trail. Follow them towards Cistern Weight Court. A receipt for a full cistern, a later repair demand and a private payment page can be compared there. The water house may have a working cistern and an invented shortage, rather than a damaged supply that needs another levy.",
      "Cistern Weight Court checked the water keeper’s charges against receipts and dated work accounts. Its seals were used to present evidence in time order. A shortage claim could then be compared with the amount of water recorded before it and the repairs supposedly paid for afterwards.\n\nThree papers survive from the disputed levy. The first receipt records a full cistern. A later demand adds an emergency repair charge, but lists no tools or workers. A private-account page then records where the extra coins went. Reading only the demand would make the shortage appear genuine.\n\nPresent the full-cistern receipt first, repair levy second, private account last. Their seals are left, right and middle. This court’s repair is a repair of the public record: it makes the charges understandable and gives Fatima evidence to challenge them. The cistern does not need to be broken for the people depending on it to be harmed.",
      "The Caravan Water House stands on a supply road used by merchants, military escorts and families travelling towards Cybressa. A fair water charge kept the cistern maintained. The later levy made access depend on how much a traveller could surrender at the gate.\n\nThe recovered account shows extra payments going to an outrider’s private funds instead of repairs. The damage reaches beyond the cheated drivers. When small caravans turn back or sell their loads cheaply, the city receives less food and the carriers return home without their expected wages.\n\nFatima can trace the surviving receipts and repay the caravans that were charged. Or the recovered levy can fund a daily public drinking allowance at the water house. After the final warden’s challenge, enter the decision at the accounts register. Return to Fatima at Ledger Salt Trail. Either arrangement must be backed by the exposed account, so the same charge cannot quietly reappear under another name."
    ],
    "controlLabels": [
      "Full-cistern receipt",
      "Private account",
      "Repair levy"
    ],
    "trainerVoices": [
      {
        "before": "First Light raids made escorts expensive. The water keeper found he could blame every price rise on them. His cousins still fill their skins for nothing. Show me you can stand your ground here.",
        "after": "You can continue. Keep those receipts dry.",
        "repeat": "Small carriers cannot afford another levy. When they leave, the big contractors buy their camels for half their worth."
      },
      {
        "before": "I escorted a repair wagon here last month. It carried wine for the officers. Now my signature is beside a cistern repair that never happened. I need those pages as much as Fatima does. Ready your partners.",
        "after": "Fairly won. If the account names me, tell Fatima I will answer her questions.",
        "repeat": "A soldier signs for a wagon and discovers later what he was supposed to have seen."
      },
      {
        "before": "The outrider says the levy keeps the supply road safe. My company has not received a coin of it. Meanwhile thirsty drivers are selling their loads before they reach Cybressa. Let us settle your challenge.",
        "after": "You have earned access to the account. I will not hide it for him.",
        "repeat": "A caravan that turns back carries no food to the city and no wages home. The keeper counts neither loss."
      }
    ],
    "recordTitles": [
      "When the Water Price Changed",
      "Three Papers Against a Water Levy",
      "The Coins Behind the Water House"
    ],
    "recordSources": [
      "A caravan merchant’s account",
      "Instructions left by a cistern court clerk",
      "From the recovered water-house account"
    ]
  },
  {
    "key": "rescueGlade",
    "title": "After the Banners Fall",
    "stages": [
      "Trampled Supply Trail",
      "Muster Signal Clearing",
      "Unmarked Burial Grove"
    ],
    "intro": "There are wounded people farther along that trail. Both columns left supplies at the old muster ground. Find the retreat signals and see whether any of those bundles can still be brought back.",
    "clues": [
      "Boot tracks cross the burial rows before joining the supply trail. Several bundles have been dropped with their straps still fastened, suggesting a hurried retreat rather than an organised transfer of stores.\n\nBeyond the first camp, follow the bundles towards Muster Signal Clearing. Win the path warden’s challenge and read the evacuation board there. Helping the cornered soldier resolves the patrol encounter; reopening this older aid route is a further task with its own records and decision.",
      "The board explains who should be protected during a retreat. Wounded people leave with their carriers first. Supplies follow once the stretcher teams are clear. The banner escort leaves last, covering the others rather than drawing them away early.\n\nUse Wounded signal in the middle, Supply signal on the right, Banner signal on the left: control 2 → 3 → 1. A wrong signal clears the sequence. Restore the proper order, then win the warden’s challenge to reach the burial grove.",
      "The burial register names people from both factions and some with no military allegiance. The abandoned bundles contain aid supplies that were never delivered during the failed retreat. Taking them for another column would leave that original need unanswered.\n\nAfter the last challenge, use the decision register to send the bundles to civilian healers or stock a neutral shelter beside the graves. Return to the young soldier at Trampled Supply Trail to report the arrangement. His earlier rescue gift is handled separately from this aid-station work."
    ],
    "puzzleKind": "order",
    "puzzleClue": "Ring wounded’s signal, supply signal, then banner signal: middle, right, left.",
    "solution": [
      1,
      2,
      0
    ],
    "affinity": "GRASS",
    "objective": [
      "Read the retreat and burial marks",
      "Restore the muster signals",
      "Read the site register, win the last warden’s challenge and choose how to care for Unmarked Burial Grove"
    ],
    "guardianIds": [
      "042",
      "060",
      "152"
    ],
    "choice": {
      "a": {
        "label": "Send supplies to the wounded",
        "text": "The recovered bundles go to civilian healers regardless of the injured person’s banner."
      },
      "b": {
        "label": "Make the grove a neutral shelter",
        "text": "The supplies stock an unarmed resting place beside the shared burial ground."
      }
    },
    "conclusion": {
      "a": "The bundles go to the healers. They write down who was treated, with no column for allegiance.",
      "b": "A white cloth marks the stocked shelter. Neither banner is raised over the graves."
    },
    "reward": {
      "money": 350,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "Marchwood Glade served as a muster ground long before the latest patrol stopped here. Soldiers gathered supplies in the clearing, while healers used the sheltered ground farther along the trail. A burial grove grew behind it as successive retreats brought people who could not be carried any farther.\n\nBoth armies have used the station. During the latest fighting, evacuation signals were sounded in the wrong order. Carriers scattered before all the wounded were moved, and aid bundles were abandoned along the supply trail. The graves and unclaimed supplies remain after the columns have gone.\n\nThe young soldier’s rescue concerns the patrol in the first clearing. Beyond that camp is another task: finding the old retreat record and recovering the aid route. Follow the trampled bundles towards Muster Signal Clearing. The evacuation board there explains how wounded people were meant to leave before stores and banners.",
      "The muster ground used three signals to organise a retreat. The first sent the wounded ahead with their carriers. The second moved supplies once the stretcher teams were clear. The final signal withdrew the banner and its escort, who were expected to protect those leaving before them.\n\nDuring the last retreat, the banner signal was sounded first. Carriers understood it as an order to flee and scattered. Supplies were left on the path, while some wounded people never reached the road. Later reports called the signal misunderstood, but the evacuation board still records the intended order.\n\nRestore the sequence of wounded, supplies, banner. The wounded signal is in the middle, supplies on the right and the banner on the left. Using the old order opens the abandoned aid route. It also preserves a clear account of what the retreat was supposed to protect, rather than allowing the surviving banner to stand as proof that everything went well.",
      "The Unmarked Burial Grove contains people from both armies and civilians caught between them. Some stones give a name and village. Others mark only where an unknown person was laid. The same keeper recorded them because the retreat left no separate graveyard for each allegiance.\n\nAid bundles remain near the burial rows. They were brought for wounded people, but the failed evacuation left them unclaimed. Later patrols argue over which company may take them, even though the register describes dressings, blankets and food for people unable to march.\n\nThe supplies could go to civilian healers who treat anyone brought to them. Or they could stock an unarmed shelter beside the grove, giving travellers and injured people somewhere to rest. After the last warden’s challenge, enter the arrangement at the burial register. Report to the young soldier at Trampled Supply Trail. This decision does not replace his thanks for the earlier rescue; it concerns the older aid station beyond his camp."
    ],
    "controlLabels": [
      "Banner signal",
      "Wounded signal",
      "Supply signal"
    ],
    "trainerVoices": [
      {
        "before": "First Light left a rearguard here and our patrol caught it. Now every messenger calls this a victory. I have spent the morning carrying men who will never walk home. Prepare your partners.",
        "after": "You have earned passage. Watch where you tread; some graves have lost their stones.",
        "repeat": "The road changes hands. The wounded keep arriving at the same clearing."
      },
      {
        "before": "Our captain ordered the banner saved before the stretchers. The carriers thought it meant retreat and ran. He says the signal was misunderstood. I was standing beside him. Let us get your challenge over.",
        "after": "You kept your partners close. I wish the captain had watched his people that carefully.",
        "repeat": "The banner is dry and clean in the fort. The stretchers are still missing."
      },
      {
        "before": "My brother lies in this grove. A First Light healer stayed with him when our column left. I will not have anyone tell me which graves deserve supplies. Show me what sort of company you lead.",
        "after": "Go to the register. If your plan helps the wounded, I will carry the first bundle.",
        "repeat": "Some people here wore no colours at all. They had come to find their children."
      }
    ],
    "recordTitles": [
      "The Muster Ground Behind the Camp",
      "Why the Stretchers Were Left",
      "A Grove With No Single Banner"
    ],
    "recordSources": [
      "An account left beside the burial rows",
      "A copied evacuation board",
      "From the burial keeper’s supply register"
    ]
  },
  {
    "key": "anglersReach",
    "title": "The Net Beneath the Contest",
    "stages": [
      "Abandoned Net Bank",
      "Spawning Channel Locks",
      "Warden’s Winter Pool"
    ],
    "intro": "The catches have thinned since the old supply net broke loose. Its floats lead towards the spawning channel. Restore the flow before lifting the net, then help me keep the winter pool safe.",
    "clues": [
      "Small scales cling to the upstream face of the abandoned net. That is the side fish would reach while trying to travel into the spawning channel. The floats lead away from the contest jetty towards the jammed locks.\n\nFollow them and win the first path warden’s challenge. At Spawning Channel Locks, inspect the fishing board before using the winch. Pulling the mesh away is only part of the repair: the animals also need fresh water and a safe connection to the winter pool.",
      "The board sets out a water-first repair. Restore fresh flow so the trapped animals have a usable channel. Raise the old net after the current returns. Release the pool gate last, once the obstruction has been removed.\n\nUse Fresh flow on the left, Net winch on the right, Pool gate in the middle: control 1 → 3 → 2. A wrong control clears the sequence. Complete it, then win the lock warden’s challenge to reach the winter refuge.",
      "The old register sets the winter pool aside for breeding partners. Protecting it supports later fish runs, rather than simply reserving a better catch for someone else. The damaged net shows why the boundary needs attention after the supply crews have left.\n\nAfter the final challenge, choose a protected refuge boundary or a volunteer net-recovery patrol at the decision register. Return to the competition warden at Abandoned Net Bank. The daily contest still takes place downstream at its usual jetty, with its normal entry and prizes."
    ],
    "puzzleKind": "order",
    "puzzleClue": "Open fresh flow, raise the net, then release the pool gate: left, right, middle.",
    "solution": [
      0,
      2,
      1
    ],
    "affinity": "WATER",
    "objective": [
      "Follow the lost net floats",
      "Restore the spawning channel",
      "Read the site register, win the last warden’s challenge and choose how to care for Warden’s Winter Pool"
    ],
    "guardianIds": [
      "051",
      "079",
      "139"
    ],
    "choice": {
      "a": {
        "label": "Protect the winter pool",
        "text": "The warden marks the pool as a refuge and keeps the competition at its existing jetty."
      },
      "b": {
        "label": "Teach safe net recovery",
        "text": "The warden starts a volunteer patrol that removes abandoned nets and guides anglers away from spawning beds."
      }
    },
    "conclusion": {
      "a": "The warden marks the refuge boundary. Downstream, the contest boats remain at their usual jetty.",
      "b": "The first recovery patrol brings in a torn net. The contest crews help mend floats for the next patrol."
    },
    "reward": {
      "money": 320,
      "poultices": 2,
      "heartyFood": 2
    },
    "signs": [
      "Angler’s Reach supplied the village with fish before its jetty hosted a daily contest. The upper channel was left open during spawning, allowing Water Abyssals to reach the quiet winter pool. Fishers returned to the lower bank, knowing the refuge would keep future seasons alive.\n\nWhen wartime attacks interrupted food wagons, a military supply crew stretched a heavy net across the run. It produced a large catch quickly, but trapped the animals trying to travel upstream. The crew later withdrew, leaving tackle to jam the channel locks. Local catches began thinning even after the soldiers had gone.\n\nThe competition warden has found lost floats leading towards the obstruction. Follow them beyond the contest bank to Spawning Channel Locks. The old board explains why fresh flow must be restored before the net is raised. The jetty contest can continue, but the village cannot rely on it if the breeding run remains blocked.",
      "The spawning channel carried fresh water past the contest bank into the winter refuge. Its gate and net winch allowed keepers to clear old tackle without draining the pool or leaving migrating Abyssals stranded in stagnant water.\n\nThe abandoned military net caught on the lock works. With the gates jammed, little fresh water reached the run. Raising the net before restoring flow would free the mesh without giving the trapped animals a healthy channel to move through. Opening the pool first would let the refuge drain into the same blocked reach.\n\nBegin with fresh flow on the left. Raise the net using the right-hand winch. Release the pool gate in the middle last. The order restores water, removes the obstruction and then reconnects the refuge. It repairs damage from the supply crew’s hurried fishing, rather than creating a new fishing ground for the contest boats.",
      "The Warden’s Winter Pool was kept outside ordinary fishing bounds. Breeding Water Abyssals sheltered here through cold months, then returned to the river. Fishers accepted the boundary because it gave their children a run to return to in later years.\n\nMilitary supply crews ignored it when food deliveries failed. Their heavy net blocked the channel and was abandoned during a withdrawal. Taking more from the pool might briefly fill another ration barrel, but would deepen the shortage that brought the supply crews here in the first place.\n\nThe keeper can clearly mark the pool as a refuge, or organise volunteers to recover abandoned nets and guide anglers away from the spawning beds. After the final warden’s challenge, record the plan at the pool register and report to the competition warden at Abandoned Net Bank. The daily contest stays at its existing jetty; this decision protects the water and breeding stock beyond it."
    ],
    "controlLabels": [
      "Fresh flow",
      "Pool gate",
      "Net winch"
    ],
    "trainerVoices": [
      {
        "before": "Dawn Bloom patrols cut the fish wagons off last winter. The quartermaster ordered this net put across the whole run. We ate for a week. Now the boats come back nearly empty. Show me your partners.",
        "after": "You can go upstream. There is still time to save this season’s run.",
        "repeat": "The cooks ask for more fish. The boatmen ask where the young ones have gone. Neither gets an answer."
      },
      {
        "before": "I used to fish here with my mother. We put the small ones back because we wanted to come again next year. Give an officer a supply target and somehow he forgets that. Your challenge starts here.",
        "after": "You know when to stop pressing. That is a useful thing to know by the water.",
        "repeat": "The contest brings buyers to the village. No spawning run means no contest, and no winter trade either."
      },
      {
        "before": "The garrison wants the winter pool opened to supply crews. The warden wants breeding partners left alone. I will defend this road better with a village behind me than with one more barrel of fish. Ready yourself.",
        "after": "You have earned a say at the register. Give the village a winter after this one.",
        "repeat": "When the war is over, I would like to bring my children here without having to explain what used to live in the pool."
      }
    ],
    "recordTitles": [
      "The Net Across the Winter Run",
      "How to Free a Spawning Channel",
      "The Fish Kept for Another Year"
    ],
    "recordSources": [
      "From the angling warden’s winter account",
      "A channel keeper’s fishing board",
      "The winter pool’s boundary register"
    ]
  }
];
