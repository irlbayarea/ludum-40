import * as Phaser from 'phaser-ce';
import { Armory, HairColor, SkinColor } from './sprites/armory';

export function armoryDemo(game: Phaser.Game): void {
  const armory = new Armory(game);

  // Standard (Naked).
  armory.peonSprite(64 * 5, 64 * 6, { skin: SkinColor.Tan });

  // With Hair.
  armory.peonSprite(64 * 7, 64 * 6, { hair: HairColor.Black });

  // With Beard.
  armory.peonSprite(64 * 9, 64 * 6, { beard: HairColor.White });

  // With Custom Hair.
  armory.peonSprite(64 * 11, 64 * 6, {
    hair: { color: HairColor.Brown, style: 3 },
  });
}
