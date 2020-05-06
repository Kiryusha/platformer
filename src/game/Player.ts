// The class is responsible for keeping and processing the player object
import GameObject from './GameObject';

export default class extends GameObject {
  color1: string;
  weight: number;
  speed: number;
  isJumping: boolean;
  velocityX: number;
  velocityY: number;

  constructor () {
    super(16, 204, 16, 16);

    // Appearance
    this.color1 = '#404040';
    this.color1 = '#f0f0f0';

    // Physics
    this.weight = 33;
    this.speed = 0.8;
    this.isJumping = false;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  moveLeft (): void {
    this.velocityX -= this.speed;
  }

  moveRight (): void {
    this.velocityX += this.speed;
  }

  jump (): void {
    if (!this.isJumping) {
      this.isJumping = true;
      this.velocityY -= this.weight;
    }
  }

  update (gravity: number, friction: number): void {
    this.xOld = this.x;
    this.yOld = this.y;

    this.velocityY += gravity;
    this.x += this.velocityX;
    this.y += this.velocityY;

    this.velocityX *= friction;
    this.velocityY *= friction;
  }
}
