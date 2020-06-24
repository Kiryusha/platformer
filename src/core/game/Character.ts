// The class is responsible for keeping and processing the player object
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

  public isDeathTriggered: boolean = false;
  public isDead: boolean;
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
  // Property possessed only by the NPC. Stores the name of the movement pattern and its values.
  // Used by the Brain class
  public movingPattern?: {
    type: string;
    length: number;
  };
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
  // VelocityYModifier ceiling
  private maxJumpingSpeed: number;
  // Modifier used to adjust jump acceleration. Not really needed.
  // Must be removed after jump reworking
  private friction: number;
  // Flag used to indicate that the jump button has been pressed for longer than 100 ms.
  private isKeepJumping: boolean;
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
        frames
      },
    }: CharacterConfig,
    playerSpriteMap: SpriteMap,
  ) {
    super(entity);

    Object.assign(this, main);

    this.setAnimationDefaults(frameWidth, frameHeight, frames, playerSpriteMap);
  }

  public startMovingLeft(): void {
    if (!this.isMovingRight && !this.isDucking) {
      this.isFacingLeft = true;
      this.isMovingLeft = true;
    }
  }

  public stopMovingLeft(): void {
    this.isMovingLeft = false;
  }

  public startMovingRight(): void {
    if (!this.isMovingLeft && !this.isDucking) {
      this.isFacingLeft = false;
      this.isMovingRight = true;
    }
  }

  public stopMovingRight(): void {
    this.isMovingRight = false;
  }

  public startJumping(): void {
    if (!this.isStuck) {
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
    if (!this.isJumping && !this.isFalling) {
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
    if (!this.isJumping && !this.isDucking) {
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

  public update(gravity: number): void {
    this.adjustHorizontalMovement();
    this.adjustVerticalMovement(gravity);
    this.updateAnimation();

    if (!this.isColliding && this.velocityY > 0) {
      this.isFalling = true;
    }

    if (this.isDeathTriggered) {
      setTimeout(() => {
        this.isDead = true;
      }, 350);
    }
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
    if (this.isDeathTriggered && !this.isDead) {
      this.animator.changeFrameset('death', 'loop', 2);
    } else if (
      (this.isMovingLeft || this.isMovingRight)
      && !this.isJumping
      && !this.isFalling
    ) {
      if (this.isSprinting) {
        this.animator.changeFrameset('skip', 'loop', 1.33);
      } else {
        this.animator.changeFrameset('skip', 'loop', 2);
      }
    } else if (this.isFalling) {
      this.animator.changeFrameset('fall', 'loop', 4);
    } else if (this.isJumping) {
      this.animator.changeFrameset('jump', 'loop', 4);
    } else if (this.isDucking) {
      this.animator.changeFrameset('duck', 'loop', 4);
    } else {
      this.animator.changeFrameset('idle', 'loop', 4);
    }

    this.animator.animate();
  }

  private adjustVerticalMovement(rawGravity: number): void {
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

  private adjustHorizontalMovement(): void {
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
