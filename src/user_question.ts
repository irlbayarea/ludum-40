export default class UserQuestion {
  constructor(
    public readonly options: string[],
    public readonly callback: (option: number) => void
  ) {}
}
