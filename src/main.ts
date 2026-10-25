import {
  type Wizard,
  type Spell,
  type AcademyEvent,
  type House,
  type HousePoints,
  type SpellCategory,
  type SpellOutput,
  type ArrayElement,
  type WizardSummary,
  type WizardUpdate,
  type NewWizard,
  type AttackSpell,
  type NonHealingCategory,
} from "./types";

import { WizardRepository, SpellRepository } from "./repository";
import { Log } from "./decorators";

function isHouse(value: unknown): value is House {
  return (
    value === "Gryffindor" ||
    value === "Slytherin" ||
    value === "Ravenclaw" ||
    value === "Hufflepuff"
  );
}

function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house) &&
    typeof candidate.level === "number" &&
    typeof candidate.active === "boolean"
  );
}

class AcademyService {
  constructor(
    private readonly wizards: WizardRepository,
    private readonly spells: SpellRepository
  ) {}

  @Log
  castSpell(wizardId: number, spellId: number): string {
    const wizard = this.wizards.findById(wizardId);
    const spell = this.spells.findById(spellId);

    if (!wizard || !spell) {
      throw new Error("Wizard or spell not found");
    }

    return `${wizard.name} casts ${spell.name}!`;
  }

  getHouseSummaries(house: Wizard["house"]): WizardSummary[] {
    return this.wizards
      .findByHouse(house)
      .map(({ id, name, house }) => ({ id, name, house }));
  }

  updateWizard(id: number, changes: WizardUpdate): boolean {
    return this.wizards.update(id, changes);
  }

  getSpellEvents(events: AcademyEvent[]): Extract<AcademyEvent, { type: "spell-cast" }>[] {
    return events.filter(
      (event): event is Extract<AcademyEvent, { type: "spell-cast" }> =>
        event.type === "spell-cast"
    );
  }
}

const wizards = new WizardRepository();
const spells = new SpellRepository();

wizards.create({
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
  traits: { patronus: "Stag" }
});

wizards.create({
  name: "Hermione Granger",
  house: "Gryffindor",
  level: 8,
  active: true
});

wizards.create({
  name: "Draco Malfoy",
  house: "Slytherin",
  level: 6,
  active: true
});

spells.add({
  id: 101,
  name: "Expelliarmus",
  category: "attack",
  power: 80
});

spells.add({
  id: 102,
  name: "Protego",
  category: "defense",
  power: 60
});

const academy = new AcademyService(wizards, spells);

console.log("\n--- Exercise 1: register a new wizard (no id) ---");
const newcomer: NewWizard = {
  name: "Luna Lovegood",
  house: "Ravenclaw",
  level: 4,
  active: true,
  traits: { patronus: "Hare", wand: "Hawthorn" }
};

const luna = wizards.create(newcomer);
console.log(`Registered ${luna.name} with generated id ${luna.id}`);
console.log(wizards.findById(luna.id));

console.log("\n--- Cast a spell ---");
console.log(academy.castSpell(1, 101));

console.log("\n--- Exercise 2: filter wizards by house ---");
const gryffindors = wizards.findByHouse("Gryffindor");
console.log(`Gryffindor: ${gryffindors.map(w => w.name).join(", ")}`);
console.log(`Ravenclaw: ${wizards.findByHouse("Ravenclaw").map(w => w.name).join(", ")}`);
console.log(`Hufflepuff: ${wizards.findByHouse("Hufflepuff").length} wizard(s)`);
console.log(academy.getHouseSummaries("Slytherin"));

console.log("\n--- Update a wizard ---");
academy.updateWizard(1, { level: 6 });
console.log(wizards.findById(1));

console.log("\n--- Type guard ---");
const unknownWizard: unknown = wizards.findById(1);
if (isWizard(unknownWizard)) {
  console.log(`${unknownWizard.name} belongs to ${unknownWizard.house}`);
}

console.log("\n--- Record utility type ---");
const points: HousePoints = {
  Gryffindor: 100,
  Slytherin: 80,
  Ravenclaw: 90,
  Hufflepuff: 70
};
console.log(points);

console.log("\n--- Extract spell-cast events ---");
const events: AcademyEvent[] = [
  { type: "spell-cast", wizardId: 1, spellName: "Lumos" },
  { type: "level-up", wizardId: 2, newLevel: 9 },
  { type: "wizard-expelled", wizardId: 3 }
];
console.log(academy.getSpellEvents(events));

type CastArguments = Parameters<AcademyService["castSpell"]>;
type CastResult = ReturnType<AcademyService["castSpell"]>;
type AttackOutput = SpellOutput<"attack">; 
type HealingOutput = SpellOutput<"healing">; 
type SpellItem = ArrayElement<Spell[]>; 
type AttackSpellExample = AttackSpell;
type RemainingCategories = NonHealingCategory;
type CategoryExample = SpellCategory;

const typeExamples: [
  CastArguments,
  CastResult,
  AttackOutput,
  HealingOutput,
  SpellItem,
  AttackSpellExample["category"],
  RemainingCategories,
  CategoryExample
] | null = null;

void typeExamples;