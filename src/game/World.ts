// The class is responsible for keeping and processing the game world
import Player from './Player';
import Collider from './Collider';
import map from '../assets/map.json';

export default class {
  friction: number;
  gravity: number;
  height: number;
  width: number;
  backgroundMap: number[];
  middleMap: number[];
  frontMap: number[];
  collisionMap: number[];
  columns: number;
  rows: number;
  tileSize: number;
  player: Player;
  collider: Collider;

  constructor () {
    // Physics
    this.friction = 0.7;
    this.gravity = 2;

    // Appearance
    this.columns = 20;
    this.rows = 20;
    this.tileSize = 8;
    this.backgroundMap = map.layers[0].data;
    this.middleMap = map.layers[1].data;
    this.frontMap = map.layers[2].data;
    this.collisionMap = map.layers[3].data;
    this.height = this.tileSize * this.rows;
    this.width = this.tileSize * this.columns;

    // Objects
    this.player = new Player();
    this.collider = new Collider();
  }

  processCollision (object: Player): void {
    this.processBoundariesCollision(object);
    this.processPlatformCollision(object);
  }

  processPlatformCollision (object: Player): void {
    let top;
    let right;
    let bottom;
    let left;

    // Collision of top left corner
    top = Math.floor(object.getTop() / this.tileSize);
    left = Math.floor(object.getLeft() / this.tileSize);
    this.collider.processCollision(
      this.collisionMap[top * this.columns + left],
      object,
      left * this.tileSize,
      top * this.tileSize,
      this.tileSize,
    );

    // Collision of top right corner
    top = Math.floor(object.getTop() / this.tileSize);
    right = Math.floor(object.getRight() / this.tileSize);
    this.collider.processCollision(
      this.collisionMap[top * this.columns + right],
      object,
      right * this.tileSize,
      top * this.tileSize,
      this.tileSize,
    );

    // Collision of bottom left corner
    left = Math.floor(object.getLeft() / this.tileSize);
    bottom = Math.floor(object.getBottom() / this.tileSize);
    this.collider.processCollision(
      this.collisionMap[bottom * this.columns + left],
      object,
      left * this.tileSize,
      bottom * this.tileSize,
      this.tileSize,
    );

    // Collision of bottom right corner
    right = Math.floor(object.getRight() / this.tileSize);
    bottom = Math.floor(object.getBottom() / this.tileSize);
    this.collider.processCollision(
      this.collisionMap[bottom * this.columns + right],
      object,
      right * this.tileSize,
      bottom * this.tileSize,
      this.tileSize,
    );
  }

  processBoundariesCollision (object: Player): void {
    // collisions with the world boundaries
    // left
    if (object.x < 0) {
      object.x = 0;
      object.velocityX = 0;
    }

    // right
    if (object.x + object.width > this.width) {
      object.x = this.width - object.width;
      object.velocityX = 0;
    }

    // top
    if (object.y < 0) {
      object.y = 0;
      object.velocityY = 0;
    }

    // bottom
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
