// The class is responsible for keeping and processing the player object
import GameObject from './GameObject';

export default class extends GameObject {
  color1: string;
  weight: number;
  maxSpeed: number;
  isJumping: boolean;
  velocityX: number;
  velocityY: number;
  friction: number;
  isMovingLeft: boolean;
  isMovingRight: boolean;
  accelerationModifier: number;
  brakingModifier: number;

  constructor() {
    super(16, 204, 24, 24);

    // Appearance
    this.color1 = '#404040';
    this.color1 = '#f0f0f0';

    // Physics
    this.weight = 33;
    this.maxSpeed = 4;
    this.isJumping = false;
    this.accelerationModifier = 6;
    this.brakingModifier = 3;
    this.velocityX = 0;
    this.velocityY = 0;
    this.friction = 0.7;
    this.isMovingLeft = false;
    this.isMovingRight = false;
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

  jump(): void {
    if (!this.isJumping) {
      this.isJumping = true;
      this.velocityY -= this.weight;
    }
  }

  update(gravity: number): void {
    this.xOld = this.x;
    this.yOld = this.y;

    this.adjustHorizontalMovement();

    this.velocityY += gravity;
    this.x += this.velocityX;
    this.y += this.velocityY;

    // this.velocityX *= this.friction;
    this.velocityY *= this.friction;
  }

  adjustHorizontalMovement(): void {
    // TODO: adjust movement in isJumping state

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

    if (window.SHOW_VELOCITY && this.velocityX !== 0) {
      console.log(this.velocityX);
    }
  }
}
