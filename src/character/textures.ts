import { RenderTexture } from 'phaser-ce';
import {
  Armory,
  SkinColor,
  ShirtColor,
  PantsColor,
  ShieldColor,
  HairColor,
} from '../ui/sprites/armory';

export function goblin(armory: Armory): RenderTexture {
  return armory.peonTexture({
    skin: SkinColor.Green,
    shirt: {
      color: ShirtColor.Green,
      style: 9,
    },
    pants: PantsColor.Green,
    shield: ShieldColor.OrangeGreen,
  });
}

export function guard(armory: Armory): RenderTexture {
  return armory.peonTexture({
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
    },
  });
}
