// The class is responsible for keeping and processing the player object
import Character from './Character';

export default class Player extends Character implements Player {
  // Property used when character moves between zones. It is filled during a collision with a door
  // and read during the general update cycle. It stores the name and coordinates for the
  // character (only for the player for now)
  public destination: {
    name: string;
    x: number;
    y: number;
  } = {
    name: '',
    x: 0,
    y: 0,
  };
  //
  // Property for storaging current player's health
  public currentHealth: number;
  // Property indicates maximum obtainable hp point by player
  public maxHealth: number;

  constructor(
    playerConfig: CharacterConfig,
    playerSpriteMap: SpriteMap,
  ) {
    super(playerConfig, playerSpriteMap);
    this.maxHealth = playerConfig.player.maxHealth;
    this.currentHealth = this.maxHealth;
  }

  public restoreHealth(): void {
    if (this.currentHealth < this.maxHealth) {
      this.currentHealth += 1;
    }
  }

  public throwUp(type?: string): void {
    switch (type) {
      case 'fromThePit':
        this.velocityY -= 7;
        break;
      case 'attacker':
        this.velocityY -= 50;
        if (this.isUpActive) {
          this.isKeepJumping = true;
        }
        break;
      case 'left':
        // The position on the Y axis must be changed to prevent zeroing of velocityY due to a collision
        // with the collision entity.
        this.top -= 1;
        this.velocityY -= 50;
        this.velocityX -= 5;
        break;
      case 'right':
        this.top -= 1;
        this.velocityY -= 50;
        this.velocityX += 5;
        break;
      case 'death':
        this.top -= 1;
        this.velocityY -= 50;
        this.maxJumpingSpeed = 11;
    }
  }

  protected adjustHealth(): void {
    // This prevents accidental movement if the navigation buttons were pre-clamped.
    if (this.isHurt) {
      this.stopMovingLeft();
      this.stopMovingRight();
    }

    if (this.isHurtTriggered) {
      this.isHurtTriggered = false;
      this.isHurt = true;

      this.currentHealth -= 1;

      if (this.currentHealth <= 0) {
        this.isDeathTriggered = true;

        this.throwUp('death');

        setTimeout(() => {
          this.isVanished = true;
        }, 1200);
      } else {
        this.throwUp(this.collisionXDirection);

        setTimeout(() => {
          this.isHurt = false;
        }, 1000);
      }
    }
  }
}
