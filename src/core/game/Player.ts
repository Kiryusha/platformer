// The class is responsible for keeping and processing the player object
import Entity from './Entity';
import SpriteSet from './SpriteSet';
import { bound } from '../../util';

export default class Player extends Entity {
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
  spriteSet: SpriteSet;

  constructor(playerSpriteMap: spriteMap) {
    super(16, 204, 20, 20, 'character', 'player');

    // Appearance
    this.color1 = '#404040';
    this.color1 = '#f0f0f0';

    // Physics
    this.jumpImpulse = 221;
    this.maxSpeed = 3;
    this.maxJumpingSpeed = 9;
    this.isJumping = false;
    this.isJumpTriggered = false;
    this.isFalling = true;
    this.accelerationModifier = 6;
    this.brakingModifier = 6;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.friction = 0.09;

    // animation stuff
    this.setAnimationFrames(playerSpriteMap);
  }

  setAnimationFrames(playerSpriteMap: spriteMap): void {
    this.spriteSet = new SpriteSet(
      playerSpriteMap,
      37,
      32,
      {
        idle: [
          'player-idle-1',
          'player-idle-2',
          'player-idle-3',
          'player-idle-4',
          'player-idle-5',
          'player-idle-6',
          'player-idle-7',
          'player-idle-8',
          'player-idle-9',
        ],
        skip: [
          'player-skip-1',
          'player-skip-2',
          'player-skip-3',
          'player-skip-4',
          'player-skip-5',
          'player-skip-6',
          'player-skip-7',
          'player-skip-8',
        ],
        jump: [
          'player-jump-1',
          'player-jump-2',
          'player-jump-3',
          'player-jump-4',
        ],
        fall: [
          'player-fall-1',
          'player-fall-2',
          'player-fall-3',
          'player-fall-4',
        ]
      }
    );
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
