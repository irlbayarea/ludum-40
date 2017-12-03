import { RenderTexture } from 'phaser-ce';
import {
  Armory,
  SkinColor,
  ShirtColor,
  PantsColor,
  ShieldColor,
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
