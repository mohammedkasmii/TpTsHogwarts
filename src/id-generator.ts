export interface IdGenerator {
  next(): number;
}

export class SequentialIdGenerator implements IdGenerator {
  private current: number;

  constructor(start = 1) {
    if (!Number.isInteger(start) || start < 1) {
      throw new RangeError("Id sequence must start at a positive integer");
    }
    this.current = start;
  }

  next(): number {
    return this.current++;
  }
}
