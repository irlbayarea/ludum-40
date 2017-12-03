import HudModel from './hud_model';
import UserQuestion from '../../user_question';

export default class HudBuilder {
  public score: number;
  public killCount: number;
  public message: any;
  public question: UserQuestion | null;

  public build(): HudModel {
    return new HudModel(
      this,
      (this.score = 0),
      (this.killCount = 0),
      this.message,
      this.question
    );
  }
}
