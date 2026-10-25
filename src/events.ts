import type { AcademyEvent, SpellCastEvent } from "./types";

export function isSpellCastEvent(event: AcademyEvent): event is SpellCastEvent {
  return event.type === "spell-cast";
}

export function handleSpellCast(event: SpellCastEvent): string {
  return `Wizard #${event.wizardId} cast ${event.spellName}`;
}
