// The class is responsible for keeping and processing the player object
import GameObject from './GameObject';
import { bound } from '../../util';

export default class extends GameObject {
  color1: string;
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
    isOnTop: boolean;

  constructor() {
    super(16, 204, 24, 24);

    // Appearance
    this.color1 = '#404040';
    this.color1 = '#f0f0f0';

    // Physics
    this.jumpImpulse = 221;
    this.maxSpeed = 3;
    this.maxJumpingSpeed = 10;
    this.isOnTop = false;
    this.isJumping = false;
    this.isJumpTriggered = false;
    this.isFalling = true;
    this.accelerationModifier = 6;
    this.brakingModifier = 3;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.friction = 0.09;
  }

  startMovingLeft(): void {
    this.isMovingLeft = true;
  }

  stopMovingLeft(): void {
    this.isMovingLeft = false;
  }

  startMovingRight(): void {
    this.isMovingRight = true;
  }

  stopMovingRight(): void {
    this.isMovingRight = false;
  }

  jump(value: boolean): void {
    this.isJumpTriggered = value;
  }

  update(gravity: number): void {
    this.adjustHorizontalMovement();
    this.adjustVerticalMovement(gravity);
  }

  adjustVerticalMovement(gravity: number): void {
    //
    this.velocityYModifier = gravity;
    this.yOld = this.y;

    // trigger jumping calculation only if:
    // 1) the corresponding button has been pressed and
    // 2) we are not in a jump already
    // 3) we are not in a fall.
    if (this.isJumpTriggered && !this.isJumping && !this.isFalling) {
      this.velocityYModifier = this.velocityYModifier - this.jumpImpulse; // an instant big force impulse
      this.isJumping = true;
    }

    this.velocityY = bound(
      this.velocityY + (this.friction * this.velocityYModifier),
      -this.maxJumpingSpeed,
      this.maxJumpingSpeed,
    );

    // if (this.velocityY === (this.friction * this.velocityYModifier)) {
    //   this.velocityY = 0;
    // }

    // if (this.velocityY > 0 && !this.isOnTop) {
    //   this.isFalling = true;
    // }

    // console.log(this.velocityY, this.isFalling, this.isOnTop)

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
    // And vice versa for the moving to the right.
    } else if (this.isMovingRight) {
      if (this.velocityX < this.maxSpeed) {
        this.velocityX += this.maxSpeed / this.accelerationModifier;
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

    if (window.SHOW_VELOCITY && this.velocityX !== 0) {
      console.log(this.velocityX);
    }
  }
}
