// The class is responsible for simple but animated entities
import Entity from './Entity';
import Animator from './Animator';

export default class AnimatedEntity extends Entity implements AnimatedEntity {
  public animator: Animator;

  constructor(
    {
      entity,
      animations,
    }: AnimatedEntityConfig,
    spriteMap: SpriteMap,
  ) {
    super(entity);

    this.setAnimationDefaults(animations, spriteMap);
  }

  public update(): void {
    this.updateAnimation();
  }

  private setAnimationDefaults(
    animations: {},
    playerSpriteMap: SpriteMap,
  ): void {
    this.animator = new Animator(
      playerSpriteMap,
      animations,
    );
  }

  private updateAnimation(): void {
    this.animator.changeFrameset('idle');
    this.animator.animate();
  }
}
