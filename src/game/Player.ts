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
    super(16, 104, 4, 4);

    // Appearance
    this.color1 = '#404040';
    this.color1 = '#f0f0f0';

    // Physics
    this.weight = 17;
    this.speed = 0.5;
    this.isJumping = true;
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

  update (): void {
    this.xOld = this.x;
    this.yOld = this.y;
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}
