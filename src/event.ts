export default class Event {
  public readonly start: number;
  public readonly end: number;
  public readonly value: any;
  public readonly key: string;

  constructor(key: string, value: any, start: number, end: number) {
    this.value = value;
    this.start = start;
    this.end = end;
    this.key = key;
  }
}
