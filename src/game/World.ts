// The class is responsible for keeping and processing the game world
import Player from './Player';
import map from '../assets/map.json';
import background from '../assets/background.json';

export default class {
  friction: number;
  gravity: number;
  backgroundColor: string;
  height: number;
  width: number;
  player: Player;
  map: number[];
  background: number[];
  columns: number;
  rows: number;
  tileSize: number;

  constructor () {
    // Physics
    this.friction = 0.9;
    this.gravity = 3;

    // Appearance
    this.columns = 20;
    this.rows = 20;
    this.tileSize = 8;
    this.map = map.layers[0].data;
    this.background = background.layers[0].data;
    this.height = this.tileSize * this.rows;
    this.width = this.tileSize * this.columns;

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
