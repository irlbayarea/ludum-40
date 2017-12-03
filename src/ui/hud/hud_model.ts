import HudBuilder from './hud_builder';
import UserQuestion from '../../user_question';

export default class HudModel {
  public constructor(
    private builder: HudBuilder,
    public readonly score: number,
    public readonly killCount: number,
    public readonly message: any,
    public readonly question: UserQuestion | null
  ) {
    this.builder.score = score;
    this.builder.killCount = killCount;
    this.builder.message = message;
    this.builder.question = question;
  }

  public setScore(s: number): HudModel {
    this.builder.score = s;
    return this.builder.build();
  }

  public setKillCount(k: number): HudModel {
    this.builder.killCount = k;
    return this.builder.build();
  }

  public setMessage(m: any): HudModel {
    this.builder.message = m;
    return this.builder.build();
  }

  public setQuestion(
    message: string,
    options: string[],
    callback: (option: number) => void
  ): HudModel {
    this.builder.question = new UserQuestion(message, options, callback);
    return this.builder.build();
  }

  public clearQuestion() {
    this.builder.question = null;
    return this.builder.build();
  }
}
