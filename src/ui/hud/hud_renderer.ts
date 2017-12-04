// import * as common from '../../common';
import HudModel from './hud_model';
import MessagePanel from '../hud/message';
import UserQuestion from '../../user_question';
import TextWidget from './text_widget';
import { Game } from '../../index';

export default class HudRenderer {
  private messages: MessagePanel;
  private deadGoblinWidget: TextWidget;
  private deadGuardWidget: TextWidget;
  private deadDenWidget: TextWidget;
  private deadHutWidget: TextWidget;
  private model: HudModel;

  constructor(private game: Game, messages: MessagePanel) {
    this.messages = messages;
    this.deadGoblinWidget = new TextWidget(this.game, 10, 10);
    this.deadGuardWidget = new TextWidget(this.game, 10, 30);
    this.deadDenWidget = new TextWidget(this.game, 10, 50);
    this.deadHutWidget = new TextWidget(this.game, 10, 70);
  }

  public render(hud: HudModel) {
    if (this.messages.countdown()) {
      this.messages.clearText();
    }
    this.renderDeadGoblins();
    this.renderDeadGuards();
    this.renderDeadDens();
    this.renderDeadHuts();
    if (this.model === hud) {
      return;
    }
    this.model = hud;
    this.renderMessage(this.model.message);
    this.renderQuestion(this.model.question);
  }

  public setMessagePanelClearCountdown() {
    this.messages.startCountdown();
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

  private renderDeadGuards() {
    this.deadGuardWidget.write(
      'Dead Guards : ' + this.game.worldState.getDeadGuards()
    );
    this.deadGuardWidget.bringToTop();
  }

  private renderDeadGoblins() {
    this.deadGoblinWidget.write(
      'Dead Goblins: ' + this.game.worldState.getDeadGoblins()
    );
    this.deadGoblinWidget.bringToTop();
  }

  private renderDeadHuts() {
    this.deadHutWidget.write(
      'Dead Huts   : ' + this.game.worldState.getHutDestroyed()
    );
    this.deadHutWidget.bringToTop();
  }

  private renderDeadDens() {
    this.deadDenWidget.write(
      'Dead Dens   : ' + this.game.worldState.getDenDesdtroyed()
    );
    this.deadDenWidget.bringToTop();
  }
}
