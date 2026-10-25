import type { Entity, EntityUpdate, NewEntity, Spell, Wizard } from "./types";
import { Log, MeasureTime } from "./decorators";
import { type IdGenerator, SequentialIdGenerator } from "./id-generator";

export class Repository<T extends Entity> {
  private items: T[] = [];

  constructor(private readonly ids: IdGenerator = new SequentialIdGenerator()) {}

  create(data: NewEntity<T>): T {
    const entity = { ...data, id: this.ids.next() } as T;
    this.add(entity);
    return entity;
  }

  @Log
  add(item: T): void {
    if (this.items.some(existing => existing.id === item.id)) {
      throw new Error(`An item with id ${item.id} already exists`);
    }
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: EntityUpdate<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

export class WizardRepository extends Repository<Wizard> {}
export class SpellRepository extends Repository<Spell> {}