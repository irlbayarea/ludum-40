export default class UserQuestion {
  constructor(
    public readonly message: string,
    public readonly options: string[],
    public readonly callback: (option: number) => void
  ) {}
}
