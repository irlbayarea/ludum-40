import Player from './player';
import Character from './character';

export default class GameEnginer {
  private player: Player;

  private guards: Character[];

  constructor(player: Player) {
    this.player = player;
  }

  public getPlayer(): Player {
    return this.player;
  }

  public getGuards(): Character[] {
    return this.guards;
  }
}
