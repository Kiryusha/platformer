// The class is responsible for keeping and processing the player object

export default class {
  x: number;
  y: number;
  width: number;
  height: number;
  color1: string;
  color2: string;
  weight: number;
  speed: number;
  isJumping: boolean;
  velocityX: number;
  velocityY: number;

  constructor () {
    // Position
    this.x = 0;
    this.y = 0;

    // Appearance
    this.width = 8;
    this.height = 8;
    this.color1 = '#404040';
    this.color1 = '#f0f0f0';

    // Physics
    this.weight = 20;
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
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}
