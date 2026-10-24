// Shared tactical techniques: all entries are global, type-tutorable moves.
// Individual species receive only a small, role-appropriate level-up selection.
export const TACTICAL_MOVES=[
  {
    "id": 538,
    "name": "Shrapnel Barrage",
    "type_id": "STEEL",
    "category": "PHYSICAL",
    "power": 24,
    "accuracy": 95,
    "pp": 12,
    "priority": 0,
    "target": "SINGLE_FOE",
    "hits": {
      "min": 2,
      "max": 4
    },
    "effects": [],
    "effect_text": "Hits 2–4 times (24 power each); each hit rolls its own critical chance.",
    "tutorTypes": [
      "STEEL",
      "FIGHTING",
      "GROUND"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Shrapnel Barrage: 2–4 individually timed strikes with visible hit counters.",
    "sceneAction": "rake"
  },
  {
    "id": 539,
    "name": "Needle Frenzy",
    "type_id": "BUG",
    "category": "PHYSICAL",
    "power": 18,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "target": "SINGLE_FOE",
    "hits": {
      "min": 2,
      "max": 5
    },
    "effects": [],
    "effect_text": "Hits 2–5 times (18 power each); each hit rolls its own critical chance.",
    "tutorTypes": [
      "BUG",
      "GRASS",
      "POISON"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Needle Frenzy: 2–5 individually timed strikes with visible hit counters.",
    "sceneAction": "rake"
  },
  {
    "id": 540,
    "name": "Phantom Knives",
    "type_id": "GHOST",
    "category": "PHYSICAL",
    "power": 23,
    "accuracy": 100,
    "pp": 12,
    "priority": 0,
    "target": "SINGLE_FOE",
    "hits": {
      "min": 2,
      "max": 3
    },
    "effects": [],
    "effect_text": "Hits 2–3 times (23 power each); each hit rolls its own critical chance.",
    "tutorTypes": [
      "GHOST",
      "DARK",
      "STEEL"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Phantom Knives: 2–3 individually timed strikes with visible hit counters.",
    "sceneAction": "rake"
  },
  {
    "id": 541,
    "name": "Claw Rattle",
    "type_id": "NORMAL",
    "category": "PHYSICAL",
    "power": 18,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "target": "SINGLE_FOE",
    "hits": {
      "min": 2,
      "max": 5
    },
    "effects": [],
    "effect_text": "Hits 2–5 times (18 power each); each hit rolls its own critical chance.",
    "tutorTypes": [
      "NORMAL",
      "FIGHTING",
      "DARK",
      "BUG"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Claw Rattle: 2–5 individually timed strikes with visible hit counters.",
    "sceneAction": "rake"
  },
  {
    "id": 542,
    "name": "Arc Volley",
    "type_id": "ELECTRIC",
    "category": "SPECIAL",
    "power": 24,
    "accuracy": 90,
    "pp": 12,
    "priority": 0,
    "target": "SINGLE_FOE",
    "hits": {
      "min": 2,
      "max": 4
    },
    "effects": [],
    "effect_text": "Hits 2–4 times (24 power each); each hit rolls its own critical chance.",
    "tutorTypes": [
      "ELECTRIC",
      "STEEL",
      "FLYING"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Arc Volley: 2–4 individually timed strikes with visible hit counters.",
    "sceneAction": "rake"
  },
  {
    "id": 543,
    "name": "Mica Volley",
    "type_id": "ROCK",
    "category": "SPECIAL",
    "power": 24,
    "accuracy": 95,
    "pp": 12,
    "priority": 0,
    "target": "SINGLE_FOE",
    "hits": {
      "min": 2,
      "max": 4
    },
    "effects": [],
    "effect_text": "Hits 2–4 times (24 power each); each hit rolls its own critical chance.",
    "tutorTypes": [
      "ROCK",
      "GROUND",
      "STEEL"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Mica Volley: 2–4 individually timed strikes with visible hit counters.",
    "sceneAction": "rake"
  },
  {
    "id": 544,
    "name": "Riptide Combo",
    "type_id": "WATER",
    "category": "PHYSICAL",
    "power": 23,
    "accuracy": 95,
    "pp": 12,
    "priority": 0,
    "target": "SINGLE_FOE",
    "hits": {
      "min": 2,
      "max": 4
    },
    "effects": [],
    "effect_text": "Hits 2–4 times (23 power each); each hit rolls its own critical chance.",
    "tutorTypes": [
      "WATER",
      "FIGHTING"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Riptide Combo: 2–4 individually timed strikes with visible hit counters.",
    "sceneAction": "rake"
  },
  {
    "id": 545,
    "name": "Soundstorm",
    "type_id": "NORMAL",
    "category": "SPECIAL",
    "power": 22,
    "accuracy": 95,
    "pp": 12,
    "priority": 0,
    "target": "SINGLE_FOE",
    "hits": {
      "min": 2,
      "max": 4
    },
    "effects": [],
    "effect_text": "Hits 2–4 times (22 power each); each hit rolls its own critical chance.",
    "tutorTypes": [
      "NORMAL",
      "STEEL",
      "FAIRY",
      "FLYING"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Soundstorm: 2–4 individually timed strikes with visible hit counters.",
    "sceneAction": "rake"
  },
  {
    "id": 546,
    "name": "Icebound Shards",
    "type_id": "ICE",
    "category": "SPECIAL",
    "power": 23,
    "accuracy": 95,
    "pp": 12,
    "priority": 0,
    "target": "SINGLE_FOE",
    "hits": {
      "min": 2,
      "max": 4
    },
    "effects": [],
    "effect_text": "Hits 2–4 times (23 power each); each hit rolls its own critical chance.",
    "tutorTypes": [
      "ICE",
      "WATER",
      "ROCK"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Icebound Shards: 2–4 individually timed strikes with visible hit counters.",
    "sceneAction": "rake"
  },
  {
    "id": 547,
    "name": "Reforged Bulwark",
    "type_id": "STEEL",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 15,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "defence",
          "sp_defence"
        ],
        "stages": 1
      }
    ],
    "effect_text": "Raises the user's Defence and Special Defence by 1 stage.",
    "tutorTypes": [
      "STEEL",
      "ROCK"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Reforged Bulwark: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 548,
    "name": "Warforged Tempo",
    "type_id": "STEEL",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 15,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "attack",
          "defence"
        ],
        "stages": 1
      }
    ],
    "effect_text": "Raises the user's Attack and Defence by 1 stage.",
    "tutorTypes": [
      "STEEL",
      "FIGHTING"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Warforged Tempo: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 549,
    "name": "Chorus of Renewal",
    "type_id": "FAIRY",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 8,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "party_heal",
        "target": "ACTIVE_SIDE",
        "max_hp_fraction": [
          1,
          8
        ]
      }
    ],
    "effect_text": "Restores 12.5% max HP to every living party member; cannot revive.",
    "tutorTypes": [
      "FAIRY",
      "GRASS",
      "FIRE",
      "NORMAL"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Chorus of Renewal: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 550,
    "name": "Warding Chorus",
    "type_id": "FAIRY",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 10,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "party_stage",
        "target": "ACTIVE_SIDE",
        "stats": [
          "defence",
          "sp_defence"
        ],
        "stages": 1
      }
    ],
    "effect_text": "Raises Defence and Special Defence by 1 stage for the user and active allies.",
    "tutorTypes": [
      "FAIRY",
      "STEEL",
      "ICE"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Warding Chorus: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 551,
    "name": "Coordinated Focus",
    "type_id": "PSYCHIC",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 10,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "party_stage",
        "target": "ACTIVE_SIDE",
        "stats": [
          "sp_attack",
          "accuracy"
        ],
        "stages": 1
      }
    ],
    "effect_text": "Raises Special Attack and Accuracy by 1 stage for the user and active allies.",
    "tutorTypes": [
      "PSYCHIC",
      "FAIRY",
      "NORMAL"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Coordinated Focus: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 552,
    "name": "Overcharge Protocol",
    "type_id": "ELECTRIC",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 5,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "attack",
          "speed"
        ],
        "stages": 2
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "sp_defence"
        ],
        "stages": -2
      }
    ],
    "effect_text": "Raises Attack and Speed by 2 stages, but lowers Special Defence by 2.",
    "tutorTypes": [
      "ELECTRIC",
      "STEEL"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Overcharge Protocol: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 553,
    "name": "Executioner's Bargain",
    "type_id": "DARK",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 5,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "attack"
        ],
        "stages": 3
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "speed"
        ],
        "stages": 1
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "defence",
          "sp_defence"
        ],
        "stages": -2
      }
    ],
    "effect_text": "Attack +3 and Speed +1, but Defence and Special Defence -2.",
    "tutorTypes": [
      "DARK",
      "GHOST",
      "FIGHTING"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Executioner's Bargain: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 554,
    "name": "Furnace Lockdown",
    "type_id": "FIRE",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 8,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "defence",
          "sp_defence"
        ],
        "stages": 2
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "speed"
        ],
        "stages": -2
      }
    ],
    "effect_text": "Defence and Special Defence +2, but Speed -2.",
    "tutorTypes": [
      "FIRE",
      "STEEL"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Furnace Lockdown: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 555,
    "name": "Root Communion",
    "type_id": "GRASS",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 8,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "party_heal",
        "target": "ACTIVE_SIDE",
        "max_hp_fraction": [
          1,
          10
        ]
      }
    ],
    "effect_text": "Restores 10% max HP to every living party member; cannot revive.",
    "tutorTypes": [
      "GRASS",
      "WATER",
      "FAIRY"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Root Communion: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 556,
    "name": "Second Tide",
    "type_id": "WATER",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 8,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "heal",
        "target": "SELF",
        "max_hp_fraction": [
          1,
          3
        ]
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "attack"
        ],
        "stages": 1
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "defence"
        ],
        "stages": -1
      }
    ],
    "effect_text": "Restores one-third max HP and raises Attack +1, but lowers Defence -1.",
    "tutorTypes": [
      "WATER",
      "FIGHTING"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Second Tide: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 557,
    "name": "Entropic Ritual",
    "type_id": "POISON",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 8,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "sp_attack"
        ],
        "stages": 2
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "sp_defence"
        ],
        "stages": 1
      },
      {
        "effect_id": "hp_cost",
        "basis": "MAX_HP",
        "fraction": [
          1,
          5
        ]
      }
    ],
    "effect_text": "Special Attack +2, Special Defence +1; costs 20% maximum HP.",
    "tutorTypes": [
      "POISON",
      "GHOST"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Entropic Ritual: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 558,
    "name": "Anchored Artillery",
    "type_id": "ROCK",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 8,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "sp_attack"
        ],
        "stages": 2
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "accuracy"
        ],
        "stages": 1
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "speed"
        ],
        "stages": -2
      }
    ],
    "effect_text": "Special Attack +2, Accuracy +1, but Speed -2.",
    "tutorTypes": [
      "ROCK",
      "STEEL",
      "GROUND"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Anchored Artillery: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 559,
    "name": "Astral Sacrifice",
    "type_id": "DRAGON",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 1,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "attack",
          "sp_attack",
          "speed"
        ],
        "stages": 3
      },
      {
        "effect_id": "hp_cost",
        "basis": "MAX_HP",
        "fraction": [
          1,
          2
        ]
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "defence",
          "sp_defence"
        ],
        "stages": -2
      }
    ],
    "effect_text": "Attack, Special Attack and Speed +3; costs 50% max HP and lowers both defences -2.",
    "tutorTypes": [
      "DRAGON"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Astral Sacrifice: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 560,
    "name": "Last Bastion",
    "type_id": "STEEL",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 5,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "defence",
          "sp_defence"
        ],
        "stages": 3
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "attack",
          "speed"
        ],
        "stages": -3
      }
    ],
    "effect_text": "Defence and Special Defence +3, but Attack and Speed -3.",
    "tutorTypes": [
      "STEEL",
      "ROCK",
      "ICE"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Last Bastion: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 561,
    "name": "Battle Rally",
    "type_id": "NORMAL",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 10,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "party_stage",
        "target": "ACTIVE_SIDE",
        "stats": [
          "attack",
          "speed"
        ],
        "stages": 1
      }
    ],
    "effect_text": "Raises Attack and Speed +1 for the user and active allies.",
    "tutorTypes": [
      "NORMAL",
      "FIGHTING",
      "STEEL",
      "BUG"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Battle Rally: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 562,
    "name": "Floral Regrowth",
    "type_id": "GRASS",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 8,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "heal",
        "target": "SELF",
        "max_hp_fraction": [
          1,
          2
        ]
      }
    ],
    "effect_text": "Restores half of the user's maximum HP; cannot revive.",
    "tutorTypes": [
      "GRASS",
      "FAIRY"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Floral Regrowth: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 563,
    "name": "Ember Attrition",
    "type_id": "FIRE",
    "category": "SPECIAL",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "target": "SINGLE_FOE",
    "effects": [
      {
        "effect_id": "inflict_status",
        "status": "BURN",
        "chance_percent": 25
      }
    ],
    "effect_text": "25% chance to burn.",
    "tutorTypes": [
      "FIRE",
      "STEEL"
    ],
    "sharedTacticalMove": true,
    "sceneAction": "pulse",
    "authored_visual_action": "Lingering embers strike, leaving a burning wake."
  },
  {
    "id": 564,
    "name": "Rime Halo",
    "type_id": "ICE",
    "category": "SPECIAL",
    "power": 65,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "target": "SINGLE_FOE",
    "effects": [
      {
        "effect_id": "inflict_status",
        "status": "FROSTBITE",
        "chance_percent": 25
      }
    ],
    "effect_text": "25% chance to inflict Frostbite, weakening Special Attack.",
    "tutorTypes": [
      "ICE",
      "STEEL",
      "WATER"
    ],
    "sharedTacticalMove": true,
    "sceneAction": "ripple",
    "authored_visual_action": "Ice rings close around the target and scatter into frosty shards."
  },
  {
    "id": 565,
    "name": "Duality Crest",
    "type_id": "DRAGON",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 8,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "attack",
          "sp_attack",
          "speed"
        ],
        "stages": 1
      },
      {
        "effect_id": "hp_cost",
        "basis": "MAX_HP",
        "fraction": [
          1,
          6
        ]
      }
    ],
    "effect_text": "Attack, Special Attack and Speed +1; costs one-sixth maximum HP.",
    "tutorTypes": [
      "DRAGON",
      "PSYCHIC"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Duality Crest: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 566,
    "name": "Mind Toll",
    "type_id": "PSYCHIC",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 5,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "sp_attack"
        ],
        "stages": 3
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "sp_defence"
        ],
        "stages": -2
      },
      {
        "effect_id": "hp_cost",
        "basis": "MAX_HP",
        "fraction": [
          1,
          4
        ]
      }
    ],
    "effect_text": "Special Attack +3, but Special Defence -2 and costs 25% max HP.",
    "tutorTypes": [
      "PSYCHIC",
      "FAIRY"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Mind Toll: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 567,
    "name": "Mender's Pulse",
    "type_id": "STEEL",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 8,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "party_heal",
        "target": "ACTIVE_SIDE",
        "max_hp_fraction": [
          1,
          10
        ]
      }
    ],
    "effect_text": "Restores 10% max HP to every living party member; cannot revive.",
    "tutorTypes": [
      "STEEL",
      "NORMAL",
      "FAIRY"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Mender's Pulse: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 568,
    "name": "Shield Relay",
    "type_id": "STEEL",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 10,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "party_stage",
        "target": "ACTIVE_SIDE",
        "stats": [
          "defence",
          "sp_defence"
        ],
        "stages": 1
      }
    ],
    "effect_text": "Raises Defence and Special Defence +1 for the user and active allies.",
    "tutorTypes": [
      "STEEL",
      "FIGHTING"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Shield Relay: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  },
  {
    "id": 569,
    "name": "Momentum Feast",
    "type_id": "FIGHTING",
    "category": "STATUS",
    "power": null,
    "accuracy": "ALWAYS",
    "pp": 8,
    "priority": 0,
    "target": "SELF",
    "effects": [
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "attack"
        ],
        "stages": 2
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "speed"
        ],
        "stages": 1
      },
      {
        "effect_id": "stat_stage",
        "target": "SELF",
        "stats": [
          "defence"
        ],
        "stages": -2
      }
    ],
    "effect_text": "Attack +2, Speed +1, but Defence -2.",
    "tutorTypes": [
      "FIGHTING",
      "DARK",
      "STEEL"
    ],
    "sharedTacticalMove": true,
    "authored_visual_action": "Momentum Feast: distinct tactical aura and visible stage or healing effects.",
    "sceneAction": "pulse"
  }
];
export const TACTICAL_BRANCH_LEARNSETS={
  "vigil": [
    [
      22,
      540
    ],
    [
      34,
      561
    ],
    [
      46,
      553
    ]
  ],
  "furnace": [
    [
      22,
      554
    ],
    [
      34,
      549
    ],
    [
      46,
      563
    ]
  ],
  "storm": [
    [
      22,
      542
    ],
    [
      34,
      548
    ],
    [
      46,
      552
    ]
  ],
  "rime": [
    [
      22,
      546
    ],
    [
      34,
      547
    ],
    [
      46,
      564
    ]
  ],
  "dusk": [
    [
      22,
      541
    ],
    [
      34,
      553
    ],
    [
      46,
      561
    ]
  ],
  "chitin": [
    [
      22,
      539
    ],
    [
      34,
      561
    ],
    [
      46,
      548
    ]
  ],
  "steel": [
    [
      22,
      547
    ],
    [
      34,
      568
    ],
    [
      46,
      560
    ]
  ],
  "normal": [
    [
      22,
      545
    ],
    [
      34,
      551
    ],
    [
      46,
      567
    ]
  ],
  "water": [
    [
      22,
      544
    ],
    [
      34,
      556
    ],
    [
      46,
      550
    ]
  ],
  "grass": [
    [
      22,
      555
    ],
    [
      34,
      562
    ],
    [
      46,
      550
    ]
  ],
  "fighting": [
    [
      22,
      538
    ],
    [
      34,
      548
    ],
    [
      46,
      569
    ]
  ],
  "poison": [
    [
      22,
      557
    ],
    [
      34,
      567
    ],
    [
      46,
      550
    ]
  ],
  "ground": [
    [
      22,
      538
    ],
    [
      34,
      548
    ],
    [
      46,
      560
    ]
  ],
  "flying": [
    [
      22,
      545
    ],
    [
      34,
      551
    ],
    [
      46,
      542
    ]
  ],
  "psychic": [
    [
      22,
      548
    ],
    [
      34,
      561
    ],
    [
      46,
      550
    ]
  ],
  "rock": [
    [
      22,
      543
    ],
    [
      34,
      558
    ],
    [
      46,
      547
    ]
  ],
  "dragon": [
    [
      22,
      565
    ],
    [
      34,
      545
    ],
    [
      46,
      559
    ]
  ],
  "fairy": [
    [
      22,
      549
    ],
    [
      34,
      550
    ],
    [
      46,
      551
    ]
  ]
};
