// The class is responsible for keeping and processing the game world
import Entity from './Entity';
import Player from './Player';
import Collider from './Collider';

export default class {
  gravity: number;
  height: number;
  width: number;
  backgroundMap: number[];
  middleMap: number[];
  frontMap: number[];
  collisionDebugMap: (number | string)[];
  columns: number;
  rows: number;
  tileSize: number;
  player: Player;
  collider: Collider;
  map: gameMap;
  rawLayers: any;
  collisionObjects: any;

  constructor (map: gameMap) {
    // Physics
    this.gravity = 10;

    // Appearance
    this.columns = 40;
    this.rows = 40;
    this.tileSize = 8;
    this.width = this.columns * this.tileSize;
    this.height = this.rows * this.tileSize;


    this.processMap(map);

    this.height = this.tileSize * this.rows;
    this.width = this.tileSize * this.columns;

    this.player = new Player();
    this.collider = new Collider();
  }

  processMap(map: gameMap) {
    this.rawLayers = map.layers.reduce((result, layer) => {
      switch (layer.type) {
        case 'tilelayer':
          result[layer.name] = layer.data;
          break;
        case 'objectgroup':
          result[layer.name] = layer.objects.map((object: mapObject) => new Entity(
            object.x,
            object.y,
            object.width,
            object.height,
            object.type,
            object.name,
          ));
      }

      return result;
    }, {});

    this.backgroundMap = [...this.rawLayers.background];
    this.middleMap = [...this.rawLayers.middle];
    this.frontMap = [...this.rawLayers.front];
    this.collisionObjects = [...this.rawLayers.collisionsObjects];
    this.collisionDebugMap = [];
  }

  processCollision (): void {
    this.processBoundariesCollision(this.player);
    const collisions = this.collider.processBroadPhase([this.player, ...this.collisionObjects]);
    this.collisionDebugMap = collisions;

    // TODO: Fix condition, as last frame of jumping is taken for falling
    if (!collisions.length && this.player.velocityY > 0) {
      this.player.isFalling = true;
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
    this.processCollision();
  }
}
