// import * as common from '../../common';
import HudModel from './hud_model';
import MessagePanel from '../hud/message';
import UserQuestion from '../../user_question';
import TextWidget from './text_widget';
import { Game } from '../../index';
import { globals } from '../../common';

export default class HudRenderer {
  private static readonly xPad = 10;
  private static readonly yPad = 10;
  private static readonly fontSize = 20;
  private static readonly font = 'Courier New';
  private static readonly colNum = 2;
  private static readonly rowNum = 2;

  private static readonly hudW = globals.dimensions.width / 2;
  private static readonly hudH = HudRenderer.rowNum *
    (HudRenderer.fontSize + HudRenderer.yPad);

  private messages: MessagePanel;
  private HUD: TextWidget[] = [];
  private model: HudModel;

  constructor(private game: Game, messages: MessagePanel) {
    this.messages = messages;
    for (let c = 0; c < HudRenderer.colNum; c++) {
      for (let r = 0; r < HudRenderer.rowNum; r++) {
        this.HUD.push(
          new TextWidget(
            game,
            c / HudRenderer.colNum * HudRenderer.hudW + HudRenderer.xPad,
            r / HudRenderer.rowNum * HudRenderer.hudH + HudRenderer.yPad,
            HudRenderer.hudW / HudRenderer.colNum + HudRenderer.xPad / 2,
            HudRenderer.hudH / HudRenderer.rowNum + HudRenderer.yPad / 2,
            HudRenderer.fontSize,
            HudRenderer.font
          )
        );
      }
    }
  }

  public render(hud: HudModel) {
    if (this.messages.countdown()) {
      this.messages.clearText();
    }
    this.renderHUD();
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

  private renderHUD() {
    this.renderDeadGoblins(this.HUD[0]);
    this.renderLivingGuards(this.HUD[1]);
    this.renderStandingHuts(this.HUD[2]);
    this.renderMoney(this.HUD[3]);
  }

  private renderMoney(tw: TextWidget) {
    tw.write('Money :$' + this.game.worldState.playerCharacter.getMoney());
  }

  private renderLivingGuards(tw: TextWidget) {
    tw.write(
      'Guards       : ' +
        this.game.worldState.characters.filter(char => !char.isGoblin).length
    );
  }

  private renderStandingHuts(tw: TextWidget) {
    tw.write('Huts  : ' + this.game.worldState.getHutCount());
  }

  private renderDeadGoblins(tw: TextWidget) {
    tw.write('Dead Goblins : ' + this.game.worldState.getDeadGoblins());
    tw.bringToTop();
  }
}
