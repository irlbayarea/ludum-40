import HudModel from './hud_model';
import MessagePanel from '../hud/message';
import UserQuestion from '../../user_question';
import TextWidget from './text_widget';
import { Game } from '../../index';

export default class HudRenderer {
  private messages: MessagePanel;
  private scoreWidget: TextWidget;
  private killWidget: TextWidget;
  private model: HudModel;

  constructor(game: Game, messages: MessagePanel) {
    this.messages = messages;
    this.scoreWidget = new TextWidget(game, 10, 10);
    this.killWidget = new TextWidget(game, 10, 30);
  }

  public render(hud: HudModel) {
    if (this.model === hud) {
      return;
    }
    this.model = hud;
    this.renderMessage(this.model.message);
    this.renderQuestion(this.model.question);
    this.renderKillCount(this.model.killCount);
    this.renderScore(this.model.score);
  }

  private renderMessage(m: any) {
    if (m !== undefined) {
      this.messages.setText(String(m));
    }
  }

  private renderQuestion(q: UserQuestion | null) {
    if (q != null) {
      this.messages.setText(q.message);
      this.messages.setOptions(q.options);
    } else {
      this.messages.clearOptions();
    }
  }

  private renderScore(s: number) {
    this.scoreWidget.write('Score: ' + s);
  }

  private renderKillCount(c: number) {
    this.killWidget.write('Kill count: ' + c);
  }
}
