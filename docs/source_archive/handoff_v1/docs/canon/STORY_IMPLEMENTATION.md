# Story implementation guardrails

The full authored Story Bible remains the narrative source, while this file gives coding agents the invariants needed before detailed scene scripting is imported.

- Story runs from mortal crusade-route settlements into nine Hell circles, then postgame restoration/Primeval content.
- Aimon is renamable but stable character IDs, scene IDs and state keys never use the display name.
- Story Bible `CHxx-Eyy` mandatory and `CHxx-Oyy` optional scene identifiers must remain stable when the source scene list is imported.
- Town progression should use one authoritative enum (`UNREACHED / CONTESTED / CONQUERED / RESTORING / RESTORED`) rather than contradictory booleans.
- Mortal leader fate is separate from current life state. An executed-then-restored leader remains historically executed.
- No visible morality score. Character dialogue may derive patterns from individual choices.
- Pate and Trade progression/life state must be independent and restoration is elective within the five-use human restoration pool.
- Hell leader encounters are conditional on mortal executions; the set may contain zero through eight leaders.
- Main plot services cannot be permanently blocked by a SPARE/EXECUTE choice.
- Postgame may expose opposite story-evolution branches without rewriting the original historical branch decision.
