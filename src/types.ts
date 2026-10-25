export type House =
  | "Gryffindor"
  | "Slytherin"
  | "Ravenclaw"
  | "Hufflepuff";

export interface Entity {
  id: number;
}

export interface WizardTraits {
  [trait: string]: string | number | boolean;
}

export interface Wizard extends Entity {
  name: string;
  house: House;
  level: number;
  active: boolean;
  traits?: WizardTraits;
}

export type SpellCategory = "attack" | "defense" | "healing";

export interface Spell extends Entity {
  name: string;
  category: SpellCategory;
  power: number;
}

export type AcademyEvent =
  | { type: "spell-cast"; wizardId: number; spellName: string }
  | { type: "level-up"; wizardId: number; newLevel: number }
  | { type: "wizard-expelled"; wizardId: number };

export type SpellCastEvent = Extract<AcademyEvent, { type: "spell-cast" }>;

export type SpellOutput<T extends SpellCategory> =
  T extends "attack" ? number :
  T extends "defense" ? boolean :
  T extends "healing" ? string :
  never;

export type ArrayElement<T> =
  T extends (infer Item)[] ? Item : never;

export type NewEntity<T extends Entity> = Omit<T, "id">;
export type EntityUpdate<T extends Entity> = Partial<NewEntity<T>>;

export type NewWizard = NewEntity<Wizard>;          
export type WizardSummary = Pick<Wizard, "id" | "name" | "house">;
export type WizardUpdate = EntityUpdate<Wizard>;    

export type AttackSpell = Extract<Spell, { category: "attack" }>;
export type NonHealingCategory = Exclude<SpellCategory, "healing">;
export type HousePoints = Record<House, number>;