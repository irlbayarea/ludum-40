import HudModel from './hud_model';
import MessagePanel from '../message';
import UserQuestion from '../../user_question';

export default class HudRenderer {
  private messages: MessagePanel;
  private model: HudModel;

  constructor(messages: MessagePanel) {
    this.messages = messages;
  }

  public render(hud: HudModel) {
    if (this.model === hud) {
      return;
    }
    this.model = hud;
    this.renderMessage(this.model.message);
    this.renderQuestion(this.model.question);
  }

  private renderMessage(m: any) {
    if (m !== undefined) {
      this.messages.setText(String(m));
    }
  }

  private renderQuestion(q: UserQuestion | null) {
    if (q != null) {
      this.messages.askUser(q.options, q.callback);
    }
  }
}
