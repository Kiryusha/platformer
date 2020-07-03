// The class is responsible for simple but animated entities
import Entity from './Entity';
import Animator from './Animator';

export default class AnimatedEntity extends Entity implements AnimatedEntity {
  animator: Animator;

  constructor(
    {
      entity,
      animation: {
        frameWidth,
        frameHeight,
        frames
      },
    }: AnimatedEntityConfig,
    spriteMap: SpriteMap,
  ) {
    super(entity);

    this.setAnimationDefaults(frameWidth, frameHeight, frames, spriteMap);
  }

  public update(): void {
    this.updateAnimation();
  }

  private setAnimationDefaults(
    frameWidth: number,
    frameHeight: number,
    frames: {},
    playerSpriteMap: SpriteMap,
  ): void {
    this.animator = new Animator(
      playerSpriteMap,
      frameWidth,
      frameHeight,
      frames,
    );
  }

  private updateAnimation(): void {
    this.animator.changeFrameset('idle', 'loop', 6);
    this.animator.animate();
  }
}
