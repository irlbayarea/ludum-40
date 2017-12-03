import * as Phaser from 'phaser-ce';
import { Armory, HairColor, ShirtColor, SkinColor, PantsColor, ShieldColor } from './sprites/armory';

export function armoryDemo(game: Phaser.Game): void {
  const armory = new Armory(game);

  // Green Goblin.
  armory.peonSprite(64 * 3, 64 * 6, {
    skin: SkinColor.Green,
    shirt: {
      color: ShirtColor.Green,
      style: 9,
    },
    pants: PantsColor.Green,
    shield: ShieldColor.OrangeGreen,
  });

  // Tan Guy With Short Dark Hair.
  armory.peonSprite(64 * 5, 64 * 6, {
    hair: HairColor.Brown,
    skin: SkinColor.Tan,
    shirt: {
      color: ShirtColor.Orange,
      style: 13,
    },
    pants: PantsColor.Black,
    shield: {
      color: ShieldColor.Silver,
      style: 9,
    }
  });

  // Wizard Like Character.
  armory.peonSprite(64 * 7, 64 * 6, {
    beard: {
      color: HairColor.White,
      style: 2,
    },
    shirt: {
      color: ShirtColor.Tan,
      style: 8,
    },
    hair: {
      color: HairColor.White,
      style: 1,
    },
    hat: 32,
  });

  // With Custom Hair.
  armory.peonSprite(64 * 9, 64 * 6, {
    hair: { color: HairColor.Black, style: 3 },
    skin: SkinColor.Brown,
    shirt: {
      color: ShirtColor.Purple,
      style: 3,
    },
  });

  // Hobbit.
  armory.peonSprite(64 * 11, 64 * 6, {
    shirt: { color: ShirtColor.Teal, style: 4 },
  });
}
