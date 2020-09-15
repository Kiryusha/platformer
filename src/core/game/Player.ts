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
  public currentStars: number = 0;
  public cameraPosition: CameraPosition = {
    x: this.left,
    y: this.top,
  };
  private cameraVelocity: number = 0;
  private cameraVelocityModifier: number = 4;
  private cameraMaxVelocity: number = 100;

  constructor(
    bus: Bus,
    library: Library,
    playerConfig: CharacterConfig,
    playerSpriteMap: SpriteMap,
    private maximumStars: number,
  ) {
    super(bus, library, playerConfig, playerSpriteMap);
    this.maxHealth = playerConfig.player.maxHealth;
    this.currentHealth = this.maxHealth;
  }

  public startJumping(): void {
    super.startJumping();
    if (!this.isJumping && !this.isFalling) {
      this.library.sounds.jump.play();
    }
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

  public getHurt(returnPointId?: string) {
    if (this.isHurt) return;
    this.library.sounds.hurt.play();
    this.bus.publish(this.bus.DISABLE_CONTROLS);
    this.stopMovingLeft();
    this.stopMovingRight();
    this.isHurt = true;
    this.currentHealth -= 1;

    if (this.currentHealth <= 0) {
      this.isDeathTriggered = true;

      this.throwUp('death');

      setTimeout(async () => {
        await this.bus.publish(this.bus.SHOW_POPUP, {
          text: 'YOU DIED',
          fontSize: 3,
        });
        this.isVanished = true;
        this.bus.publish(this.bus.APP_RESTART);
        this.bus.publish(this.bus.ENABLE_CONTROLS);
      }, 1200);
    } else {
      this.throwUp('death');

      setTimeout(() => {
        this.isHurt = false;
        this.bus.publish(this.bus.ENABLE_CONTROLS);
        if (returnPointId) {
          this.bus.publish(this.bus.TELEPORT_PLAYER, returnPointId);
        }
      }, 600);
    }
  }

  // This method is needed in order to understand where the camera will be located, relative to
  // the player, if you pass only the coordinates of the upper left corner of
  // the character's square
  public getCameraPositionRelativeToPlayer(x: number, y: number): CameraPosition | undefined {
    if (this.isDeathTriggered) {
      return;
    }

    let aimY;
    let top = y;

    if (this.isDucking) {
      // This condition is necessary in order to keep the camera in the same place when the character
      // begins to duck.
      top = y - (this.defaults.height - this.height);

      // But if the character continues ducking, gamera will smoothly moves down
      if (this.isKeepDucking && (this.cameraVelocity <= this.cameraMaxVelocity)) {
        this.cameraVelocity += this.cameraVelocityModifier;
      }
    } else {
      if (this.cameraVelocity) {
        this.cameraVelocity -= this.cameraVelocityModifier;
      }
    }

    aimY = top + this.cameraVelocity;

    const xCenter = x + (this.defaults.width / 2);
    const yCenter = aimY + (this.defaults.height / 2);

    return {
      x: xCenter,
      y: yCenter,
    };
  }

  public update(gravity: number) {
    this.updateCameraPosition();
    super.update(gravity);
  }

  private updateCameraPosition() {
    const cameraPosition = this.getCameraPositionRelativeToPlayer(this.left, this.top);
    if (cameraPosition) {
      this.cameraPosition.x = cameraPosition.x;
      this.cameraPosition.y = cameraPosition.y;
    }
  }
}
