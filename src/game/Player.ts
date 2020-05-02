// The class is responsible for keeping and processing the player object

export default class {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
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
    this.width = 16;
    this.height = 16;
    this.color = '#ff0000';

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
      this.updateColor();

      this.isJumping = true;
      this.velocityY -= this.weight;
    }
  }

  update (): void {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  updateColor (): void {
    this.color = `#${Math.floor(Math.random() * 16777216).toString(16)}`;

    if (this.color.length !== 7) {
      this.color = `${this.color.slice(0, 1)}0${this.color.slice(1, 6)}`;
    }
  }
}
