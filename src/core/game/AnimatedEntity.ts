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
        animations
      },
    }: AnimatedEntityConfig,
    spriteMap: SpriteMap,
  ) {
    super(entity);

    this.setAnimationDefaults(frameWidth, frameHeight, animations, spriteMap);
  }

  public update(): void {
    this.updateAnimation();
  }

  private setAnimationDefaults(
    frameWidth: number,
    frameHeight: number,
    animations: {},
    playerSpriteMap: SpriteMap,
  ): void {
    this.animator = new Animator(
      playerSpriteMap,
      frameWidth,
      frameHeight,
      animations,
    );
  }

  private updateAnimation(): void {
    this.animator.changeFrameset('idle');
    this.animator.animate();
  }
}
