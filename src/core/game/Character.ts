// The class is responsible for keeping and processing the player object
import Entity from './Entity';
import Animator from './Animator';
import { bound } from '../../util';

export default class Character extends Entity {
  jumpImpulse: number;
  maxSpeed: number;
  isJumping: boolean;
  velocityX: number;
  velocityY: number;
  isMovingLeft: boolean;
  isMovingRight: boolean;
  accelerationModifier: number;
  brakingModifier: number;
  isFalling: boolean;
  velocityYModifier: number;
  isJumpTriggered: boolean;
  maxJumpingSpeed: number;
  friction: number;
  animator: Animator;
  isFacingLeft: boolean;
  isSprinting: boolean;
  isDucking: boolean;
  isKeepDucking: boolean;
  isKeepJumping: boolean;
  isStuck: boolean;
  defaults: CharacterStats;
  duckingTimer: NodeJS.Timer;
  jumpingTimer: NodeJS.Timer;
  movingPattern: {};
  zoneToGo: string;

  constructor(stats: CharacterStats, playerSpriteMap: SpriteMap) {
    super(
      stats.x,
      stats.y,
      stats.width,
      stats.height,
      stats.group,
      stats.type,
      stats.name
    );
    this.defaults = stats;

    // Physics
    this.jumpImpulse = stats.jumpImpulse;
    this.maxSpeed = stats.maxSpeed;
    this.maxJumpingSpeed = stats.maxJumpingSpeed;
    this.isJumping = stats.isJumping;
    this.isJumpTriggered = stats.isJumpTriggered;
    this.isFalling = stats.isFalling;
    this.accelerationModifier = stats.accelerationModifier;
    this.brakingModifier = stats.brakingModifier;
    this.velocityX = stats.velocityX;
    this.velocityY = stats.velocityY;
    this.isMovingLeft = stats.isMovingLeft;
    this.isMovingRight = stats.isMovingRight;
    this.friction = stats.friction;
    this.isSprinting = stats.isSprinting;
    this.isDucking = stats.isDucking;
    this.isKeepDucking = stats.isKeepDucking;
    this.isStuck = stats.isStuck;
    this.movingPattern = stats.movingPattern;

    // animation stuff
    this.isFacingLeft = stats.isFacingLeft;
    this.setAnimationDefaults(stats, playerSpriteMap);
  }

  setAnimationDefaults(stats: CharacterStats, playerSpriteMap: SpriteMap): void {
    this.animator = new Animator(
      playerSpriteMap,
      stats.frameWidth,
      stats.frameHeight,
      stats.frames,
    );
  }

  updateAnimation(): void {
    if ((this.isMovingLeft || this.isMovingRight) && !this.isJumping && !this.isFalling) {
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

  startDucking(): void {
    if (!this.isJumping && !this.isFalling) {
      if (!this.isDucking) {
        this.y += 5;
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

  stopDucking(): void {
    this.isDucking = false;
    this.isKeepDucking = false;
    clearTimeout(this.duckingTimer);
    this.brakingModifier = 6;
    this.height = 20;
    this.y -= 5;
  }

  startSprinting(): void {
    if (!this.isJumping && !this.isDucking) {
      this.isSprinting = true;
      this.maxSpeed = 5;
      this.accelerationModifier = 10;
    }
  }

  stopSprinting(): void {
    this.isSprinting = false;
    this.maxSpeed = 3;
    this.accelerationModifier = 6;
  }

  startMovingLeft(): void {
    if (!this.isMovingRight && !this.isDucking) {
      this.isFacingLeft = true;
      this.isMovingLeft = true;
    }
  }

  stopMovingLeft(): void {
    this.isMovingLeft = false;
  }

  startMovingRight(): void {
    if (!this.isMovingLeft && !this.isDucking) {
      this.isFacingLeft = false;
      this.isMovingRight = true;
    }
  }

  stopMovingRight(): void {
    this.isMovingRight = false;
  }

  startJumping(): void {
    if (!this.isStuck) {
      if (!this.isJumping) {
        this.jumpingTimer = setTimeout(() => {
          this.isKeepJumping = true;
        }, 100);
      }
      this.isJumpTriggered = true;
    }
  }

  stopJumping(): void {
    clearTimeout(this.jumpingTimer);
    this.isJumpTriggered = false;
    this.isKeepJumping = false;
  }

  update(gravity: number): void {
    this.adjustHorizontalMovement();
    this.adjustVerticalMovement(gravity);
    this.updateAnimation();

    if (!this.isColliding && this.velocityY > 0) {
      this.isFalling = true;
    }
  }

  adjustVerticalMovement(rawGravity: number): void {
    let gravity = rawGravity;
    this.yOld = this.y;

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

    this.y += this.velocityY + (this.friction * this.velocityY);
  }

  adjustHorizontalMovement(): void {
    this.xOld = this.x;
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

    this.x += this.velocityX;
  }
}
