// The class is responsible for keeping and processing the game world
import Player from './Player';
import Collider from './Collider';
import map from '../assets/levels/map.json';

export default class {
  gravity: number;
  height: number;
  width: number;
  backgroundMap: number[];
  middleMap: number[];
  frontMap: number[];
  collisionMap: number[];
  collisionDebugMap: (number | string)[];
  columns: number;
  rows: number;
  tileSize: number;
  player: Player;
  collider: Collider;

  constructor () {
    // Physics
    this.gravity = 2;

    // Appearance
    this.columns = 40;
    this.rows = 40;
    this.tileSize = 8;
    this.backgroundMap = map.layers[0].data;
    this.middleMap = map.layers[1].data;
    this.frontMap = map.layers[2].data;
    this.collisionMap = map.layers[3].data;
    this.collisionDebugMap = map.layers[4].data;
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
    let topLeft;
    let topRight;
    let bottomLeft;
    let bottomRight;
    let platformType;

    this.collisionDebugMap = [...map.layers[4].data];

    // Collision of top edge
    top = Math.floor(object.getTop() / this.tileSize) - 1;
    left = Math.floor(object.getLeft() / this.tileSize);
    right = Math.floor(object.getRight() / this.tileSize);
    topLeft = top * this.columns + left;
    topRight = top * this.columns + right;
    for (; topLeft <= topRight; topLeft += 1) {
      platformType = this.collisionMap[topLeft];
      if (platformType) {
        this.collisionDebugMap[topLeft] = 'top';
        this.collider.processCollision(
          platformType,
          object,
          right * this.tileSize,
          top * this.tileSize,
          this.tileSize,
        );
      }
    }

    // Collision of left edge
    top = Math.floor(object.getTop() / this.tileSize);
    left = Math.floor(object.getLeft() / this.tileSize);
    bottom = Math.floor((object.getBottom()) / (this.tileSize));
    topLeft = top * this.columns + left;
    bottomLeft = bottom * this.columns + left;
    for (; topLeft <= bottomLeft; topLeft += this.columns) {
      platformType = this.collisionMap[topLeft];
      if (platformType) {
        this.collisionDebugMap[topLeft] = 'left';
        this.collider.processCollision(
          platformType,
          object,
          left * this.tileSize,
          top * this.tileSize,
          this.tileSize,
        );
      }
    }

    // Collision of right edge
    top = Math.floor(object.getTop() / this.tileSize);
    right = Math.floor(object.getRight() / this.tileSize);
    bottom = Math.floor((object.getBottom()) / (this.tileSize));
    topRight = top * this.columns + right;
    bottomRight = bottom * this.columns + right;
    for (; topRight <= bottomRight; topRight += this.columns) {
      platformType = this.collisionMap[topRight];
      if (platformType) {
        this.collisionDebugMap[topRight] = 'right';
        this.collider.processCollision(
          platformType,
          object,
          right * this.tileSize,
          top * this.tileSize,
          this.tileSize,
        );
      }
    }

    // Collision of bottom edge
    left = Math.floor(object.getLeft() / this.tileSize);
    right = Math.floor(object.getRight() / this.tileSize);
    bottom = Math.floor((object.getBottom()) / (this.tileSize));
    bottomLeft = bottom * this.columns + left;
    bottomRight = bottom * this.columns + right;
    for (; bottomLeft <= bottomRight; bottomLeft += 1) {
      platformType = this.collisionMap[bottomLeft];
      if (platformType) {
        this.collisionDebugMap[bottomLeft] = 'bottom';
        this.collider.processCollision(
          platformType,
          object,
          right * this.tileSize,
          bottom * this.tileSize,
          this.tileSize,
        );
      }
    }
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
    this.player.update(this.gravity);
    this.processCollision(this.player);
  }
}
