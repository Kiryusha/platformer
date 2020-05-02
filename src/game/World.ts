// The class is responsible for keeping and processing the game world
import Player from './Player';

export default class {
  friction: number;
  gravity: number;
  backgroundColor: string;
  height: number;
  width: number;
  player: Player;

  constructor () {
    // Physics
    // friction force
    this.friction = 0.9;
    // gravitation force
    this.gravity = 3;

    // Appearance
    this.backgroundColor = 'rgba(40,48,56,0.25)';
    this.height = 72;
    this.width = 128;

    // Objects
    this.player = new Player();
  }

  processCollision (object: Player): void {
    // collision with the left border of the world
    if (object.x < 0) {
      object.x = 0;
      object.velocityX = 0;
    }

    // collision with the right border of the world
    if (object.x + object.width >  this.width) {
      object.x = this.width - object.width;
      object.velocityX = 0;
    }

    // collision with the top border of the world
    if (object.y < 0) {
      object.y = 0;
      object.velocityY = 0;
    }

    // collision with the bottom border of the world
    if (object.y + object.height > this.height) {
      object.isJumping = false;
      object.y = this.height - object.height;
      object.velocityY = 0;
    }
  }

  update (): void {
    this.player.velocityY += this.gravity;
    this.player.update();

    this.player.velocityX *= this.friction;
    this.player.velocityY *= this.friction;

    this.processCollision(this.player);
  }
}
