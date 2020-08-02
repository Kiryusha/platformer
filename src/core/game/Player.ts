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
  // Property shows amount of all the obtained stars
  public currentStars: number;
  private maximumStars: number;

  constructor(
    bus: Bus,
    private library: Library,
    playerConfig: CharacterConfig,
    playerSpriteMap: SpriteMap,
    maximumStars: number,
  ) {
    super(bus, playerConfig, playerSpriteMap);
    this.maxHealth = playerConfig.player.maxHealth;
    this.currentHealth = this.maxHealth;
    this.currentStars = 0;
    this.maximumStars = maximumStars;
  }

  public startJumping(): void {
    super.startJumping();
    this.library.sounds.jump.audio.play();
  }

  public obtainStar(): void {
    this.currentStars += 1;

    if (this.currentStars === this.maximumStars) {
      this.bus.publish(this.bus.SHOW_POPUP, 'Wow! You have collected all the stars!');
    }
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

        setTimeout(async () => {
          await this.bus.publish(this.bus.SHOW_POPUP, {
            text: 'YOU DIED',
            fontSize: 6,
          });
          this.isVanished = true;
          this.bus.publish(this.bus.APP_RESTART);
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
