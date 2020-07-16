// The class is responsible for keeping and processing the character object
import Entity from './Entity';
import Animator from './Animator';
import { bound } from '../../util';

export default class Character extends Entity implements Character {
  // Flags indicating that the character is moving in a certain x direction.
  // Used during horizontal movement adjusting
  public isMovingLeft: boolean;
  public isMovingRight: boolean;
  // Flag used to set the initial jump momentum. Sets the isJumping status flag.
  // Used during vertical movement adjusting
  public isJumpTriggered: boolean;
  // Status indication flags. Mostly used for preventing various actions and for changing animation.
  public isJumping: boolean;
  public isFalling: boolean;
  public isSprinting: boolean;
  public isDucking: boolean;
  // Statuses that indicate climbing - climbing prevents falling and allows your the character
  // to climb.
  public isClimbing: boolean;
  // Moving direction while climbing
  public climbingDirection: string;
  // Flags for processing hurting of the character: start of animation and actual status
  public isHurtTriggered: boolean;
  public isHurt: boolean;
  // Flag for processing death of the character: start of animation and actual status
  public isDeathTriggered: boolean = false;
  // Flag used during camera movement adjusting. If camera aim (player) keeps ducking,
  // camera smoothly moves down.
  public isKeepDucking: boolean;
  // Property for indicating that the character is facing left side.
  // Used to select a reflected texture.
  public isFacingLeft: boolean;
  // Property for storing the flag indicating that the character is stuck in a collision object.
  // Filled during collision processing. So far, only prohibits jumping.
  public isStuck: boolean;
  // Properties for storing velocity values for each axis.
  public velocityX: number;
  public velocityY: number;
  // Animator storage property
  public animator: Animator;
  // Property possessed only by the NPC. Stores the name of the movement pattern and its values.
  // Used by the Brain class
  public movingPattern?: {
    type: string;
    length: number;
    startingPoint: {
      x: number;
      y: number;
    }
  };
  // Property indicates that "jump" button is hold. It is used during throwing up after attacking
  // enemy.
  public isJumpActive: boolean;
  // Likewise for "up" and button. It is used for climbing detection
  public isUpActive: boolean;
  // Flag used to indicate that the jump button has been pressed for longer than 100 ms.
  protected isKeepJumping: boolean;
  // VelocityYModifier ceiling
  protected maxJumpingSpeed: number;
  private climbingSpeed: number;
  // Max running speed
  private maxSpeed: number;
  // Run acceleration modifier: maxSpeed is divided into it and given to velocityX
  private accelerationModifier: number;
  // Running braking modifier: maxSpeed is divided into it and subtracted from the velocityX
  private brakingModifier: number;
  // Jump start momentum value
  private jumpImpulse: number;
  // General modifier of velocityY: used during the jump
  private velocityYModifier: number;
  // Modifier used to adjust jump acceleration. Not really needed.
  // Must be removed after jump reworking
  private friction: number;
  // Timer storage properties
  private duckingTimer: NodeJS.Timer;
  private jumpingTimer: NodeJS.Timer;

  constructor(
    {
      entity,
      main,
      animation: {
        frameWidth,
        frameHeight,
        animations
      },
    }: CharacterConfig,
    spriteMap: SpriteMap,
  ) {
    super(entity);

    Object.assign(this, main);

    this.setAnimationDefaults(frameWidth, frameHeight, animations, spriteMap);
  }

  public startMovingLeft(): void {
    if (!this.isMovingRight && !this.isDucking && !this.isHurt) {
      this.isFacingLeft = true;
      this.isMovingLeft = true;
    }
  }

  public stopMovingLeft(): void {
    this.isMovingLeft = false;
  }

  public startMovingRight(): void {
    if (!this.isMovingLeft && !this.isDucking && !this.isHurt) {
      this.isFacingLeft = false;
      this.isMovingRight = true;
    }
  }

  public stopMovingRight(): void {
    this.isMovingRight = false;
  }

  public startJumping(): void {
    if (!this.isStuck) {
      this.isClimbing = false;
      if (!this.isJumping) {
        this.jumpingTimer = setTimeout(() => {
          this.isKeepJumping = true;
        }, 100);
      }
      this.isJumpTriggered = true;
    }
  }

  public stopJumping(): void {
    clearTimeout(this.jumpingTimer);
    this.isJumpTriggered = false;
    this.isKeepJumping = false;
  }

  public startDucking(): void {
    if (!this.isJumping && !this.isFalling && !this.isHurt) {
      if (!this.isDucking) {
        this.top += 5;
        this.duckingTimer = setTimeout(() => {
          this.isKeepDucking = true;
        }, 1000);
      }
      this.isDucking = true;
      this.isSprinting = false;
      this.isMovingLeft = false;
      this.isMovingRight = false;
      this.brakingModifier = 24;
      this.height = 15;
    }
  }

  public stopDucking(): void {
    this.isDucking = false;
    this.isKeepDucking = false;
    clearTimeout(this.duckingTimer);
    this.brakingModifier = 6;
    this.height = 20;
    this.top -= 5;
  }

  public startSprinting(): void {
    if (!this.isJumping && !this.isDucking && !this.isHurt) {
      this.isSprinting = true;
      this.maxSpeed = 5;
      this.accelerationModifier = 10;
    }
  }

  public stopSprinting(): void {
    this.isSprinting = false;
    this.maxSpeed = 3;
    this.accelerationModifier = 6;
  }

  public startClimbingAndMoving(direction: 'up' | 'right' | 'down' | 'left'): void {
    this.climbingDirection = direction;
  }

  public stopClimbingAndMoving(): void {
    this.climbingDirection = null;
  }

  public update(gravity: number): void {
    this.adjustHealth();
    this.adjustHorizontalMovement();
    this.adjustVerticalMovement(gravity);
    this.updateAnimation();

    if (!this.isColliding) {
      if (this.velocityY > 0 && !this.isOnSurface) {
        this.isFalling = true;
      }
      this.isClimbing = false;
    }
  }

  protected adjustHealth(): void {
    // 350ms - time for death animation
    if (this.isDeathTriggered) {
      setTimeout(() => {
        this.isVanished = true;
      }, 350);
    }
  }

  // As long as the character collides with the collision object from above, he rises and falls
  // no more than one pixel.
  private get isOnSurface(): boolean {
    return this.top - this.oldTop < 1;
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

  // TODO: it needs refactoring
  private updateAnimation(): void {
    if (this.isHurt) {
      this.animator.changeFrameset('hurt');
    } else if (this.isDeathTriggered && !this.isVanished) {
      this.animator.changeFrameset('death');
    } else if (
      (this.isMovingLeft || this.isMovingRight)
      && !this.isJumping
      && !this.isFalling
      && !this.isClimbing
    ) {
      if (this.isSprinting) {
        this.animator.changeFrameset('skip', 1.33);
      } else {
        this.animator.changeFrameset('skip');
      }
    } else if (this.isFalling) {
      this.animator.changeFrameset('fall');
    } else if (this.isClimbing && this.climbingDirection) {
      this.animator.changeFrameset('climb');
    } else if (this.isClimbing && !this.climbingDirection) {
      this.animator.changeFrameset('climb', 30, 'pause');
    } else if (this.isJumping) {
      this.animator.changeFrameset('jump');
    } else if (this.isDucking) {
      this.animator.changeFrameset('duck');
    } else {
      this.animator.changeFrameset('idle');
    }

    this.animator.animate();
  }

  private adjustVerticalMovement(rawGravity: number): void {
    if (this.type === 'enemy' && this.isDeathTriggered) {
      return;
    }

    if (this.isClimbing) {
      switch (this.climbingDirection) {
        case 'up':
          this.velocityY = -this.climbingSpeed;
          break;
        case 'down':
          this.velocityY = this.climbingSpeed;
          break;
        default:
          this.velocityY = 0;
      }

      this.top += this.velocityY;
    } else {
      let gravity = rawGravity;
      this.oldTop = this.top;

      // if the player continues to press the jump key, then gravity will be halved until
      // the character reaches the top point of the jump.
      if (this.isKeepJumping && this.velocityY < 0) {
        gravity *= 0.6;
      } else {
        this.isKeepJumping = false;
      }

      this.velocityYModifier = gravity;

      // trigger jumping calculation only if:
      // 1) the corresponding button has been pressed and
      // 2) we are not in a jump already
      // 3) we are not in a fall.
      if (this.isJumpTriggered && !this.isJumping && !this.isFalling) {
        this.velocityYModifier -= this.jumpImpulse;
        this.isJumping = true;
      }

      this.velocityY = bound(
        this.velocityY + (this.friction * this.velocityYModifier),
        -this.maxJumpingSpeed,
        this.maxJumpingSpeed,
      );

      this.top += this.velocityY + (this.friction * this.velocityY);
    }
  }

  private adjustHorizontalMovement(): void {
    if (this.isDeathTriggered) {
      return;
    }

    if (this.isClimbing) {
      switch (this.climbingDirection) {
        case 'left':
          this.velocityX = -this.climbingSpeed;
          break;
        case 'right':
          this.velocityX = this.climbingSpeed;
          break;
        default:
          this.velocityX = 0;
      }

      this.left += this.velocityX;
    } else {
      this.oldLeft = this.left;
      // If we move to the left,
      if (this.isMovingLeft) {
        // then we will reach maximum speed for as many frames as specified in the modifier.
        if (this.velocityX > -this.maxSpeed) {
          this.velocityX -= this.maxSpeed / this.accelerationModifier;
        }

        // slowing down after sprinting
        if (this.velocityX < -this.maxSpeed) {
          this.velocityX += this.maxSpeed / this.accelerationModifier;
        }
      // And vice versa for the moving to the right.
      } else if (this.isMovingRight) {
        if (this.velocityX < this.maxSpeed) {
          this.velocityX += this.maxSpeed / this.accelerationModifier;
        }

        // slowing down after sprinting
        if (this.velocityX > this.maxSpeed) {
          this.velocityX -= this.maxSpeed / this.accelerationModifier;
        }
      // If we stop left and right moving, then we completely slow down for
      // as many frames as specified in the modifier.
      } else if (!this.isMovingLeft && !this.isMovingRight) {
        if (this.velocityX < 0 ) {
          this.velocityX += this.maxSpeed / this.brakingModifier;

          // this check is protecting against looping at small speed residuals.
          if (this.velocityX > 0) this.velocityX = 0;
        }

        if (this.velocityX > 0) {
          this.velocityX -= this.maxSpeed / this.brakingModifier;

          if (this.velocityX < 0) this.velocityX = 0;
        }
      }

      this.left += this.velocityX;
    }
  }
}
