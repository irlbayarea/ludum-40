/**
 * CrisisOption
 * Encapsulates a game event option.
 */
class CrisisOption {
  private parent: Crisis;
  private description: string;
  private value: number;

  constructor(parent: Crisis, description: string, value: number) {
    this.parent = parent;
    this.description = description;
    this.value = value;
  }

  public choose(guard: Character): boolean {
    return this.parent.claim(guard, this);
  }

  public getParent(): Crisis {
    return this.parent;
  }

  public getDescription(): string {
    return this.description;
  }

  public getValue(): number {
    return this.value;
  }
}
