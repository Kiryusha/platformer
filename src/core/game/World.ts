// The class is responsible for keeping and processing the game world
import Player from './Player';
import Collider from './Collider';
import HashGrid from './HashGrid';

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
  map: gameMap;
  hashGrid: HashGrid;
  rawLayers: any;

  constructor (map: gameMap) {
    // Physics
    this.gravity = 10;

    // Appearance
    this.columns = 40;
    this.rows = 40;
    this.tileSize = 8;

    this.processMap(map)

    this.height = this.tileSize * this.rows;
    this.width = this.tileSize * this.columns;

    // Objects
    this.player = new Player();
    this.collider = new Collider();
    // this.hashGrid = new HashGrid(
    //   this.width,
    //   this.height,
    //   this.width,
    //   this.width,
    //   console.log,
    // );
    this.calculateCollisionPositions();
  }

  processMap(map: gameMap) {
    this.rawLayers = map.layers.reduce((result, layer) => {
      switch (layer.type) {
        case 'tilelayer':
          result[layer.name] = layer.data;
          break;
        case 'objectgroup':
          result[layer.name] = layer.objects;
      }

      return result;
    }, {});

    this.backgroundMap = this.rawLayers.background;
    this.middleMap = this.rawLayers.middle;
    this.frontMap = this.rawLayers.front;
    this.collisionMap = this.rawLayers.middle;
    this.collisionDebugMap = this.rawLayers.debug;
  }

  calculateCollisionPositions() {

  }

  processCollision (object: Player): void {
    this.processBoundariesCollision(object);
    this.broadPhaseDetection(object);
    // this.hashGrid.check([{
    //   x: 1,
    //   y: 1,
    //   width: 24,
    //   height: 24,
    // }]);

    // console.log(Math.floor(object.y / 4), Math.floor(object.yOld / 4))

    // console.log(Math.floor(object.y / this.tileSize), Math.floor(object.yOld / this.tileSize))

    // if (
    //   Math.floor(object.y / 4) !== Math.floor(object.yOld / 4) ||
    //   Math.floor(object.x / 4) !== Math.floor(object.xOld / 4)
    // ) {
    //   this.processBoundariesCollision(object);
    //   this.broadPhaseDetection(object);
    // }

    // console.log(
    //   Math.floor(object.y / this.tileSize) !== Math.floor(object.yOld / this.tileSize) ||
    //   Math.floor(object.x / this.tileSize) !== Math.floor(object.xOld / this.tileSize)
    // );
    // if (Math.ceil(object.x) % 2 === 0) {
    //   console.log('collision: ',object.x);
    // }
  }

  broadPhaseDetection (object: Player): void {
    let top;
    let right;
    let bottom;
    let left;
    let platformType;
    let isCollisionDetected = false;
    const objectColumns = Math.ceil(object.width / this.tileSize);
    const objectRows = Math.ceil(object.height / this.tileSize);

    this.collisionDebugMap = [...this.rawLayers.debug];
    top = Math.floor(object.getTop() / this.tileSize);
    left = Math.floor(object.getLeft() / this.tileSize);
    right = Math.floor(object.getRight() / this.tileSize);
    bottom = Math.floor((object.getBottom()) / (this.tileSize));

    if (bottom % this.tileSize === 0) {
      bottom -= 1;
    }

    if (right % this.tileSize === 0) {
      right -= 1;
    }

    const topLeft = top * this.columns + left;
    const topRight = top * this.columns + right;
    const bottomLeft = bottom * this.columns + left;

    // Collision of top edge
    for (let i = 0; i < objectColumns; i += 1) {
      platformType = this.collisionMap[topLeft + i];
      if (platformType) {
        isCollisionDetected = true;
        this.collisionDebugMap[topLeft + i] = 'top';
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
    for (let i = 0; i < objectRows; i += 1) {
      platformType = this.collisionMap[topLeft + (i * this.columns)];
      if (platformType) {
        isCollisionDetected = true;
        this.collisionDebugMap[topLeft + (i * this.columns)] = 'left';
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
    for (let i = 0; i < objectRows; i += 1) {
      platformType = this.collisionMap[topRight + (i * this.columns)];
      if (platformType) {
        isCollisionDetected = true;
        this.collisionDebugMap[topRight + (i * this.columns)] = 'right';
        this.collider.processCollision(
          platformType,
          object,
          right * this.tileSize,
          top * this.tileSize,
          this.tileSize,
        );
      }
    }

    // 1123 0 "bottom: " 28.99875 28 "left: " 2 2
    // 1124 0 "bottom: " 28.99875 28 "left: " 2 2
    // 1162 215 "bottom: " 29.121375 29 "left: " 2 2
    // 1123 0 "bottom: " 28.99875 28 "left: " 2 2
    // 1124 0 "bottom: " 28.99875 28 "left: " 2 2
    // 1082 0 "bottom: " 27.7725 27 "left: " 2 2
    // 1083 0 "bottom: " 27.7725 27 "left: " 2 2
    // 1084 0 "bottom: " 27.7725 27 "left: " 2 2
    // 1042 0 "bottom: " 26.668875 26 "left: " 2 2
    // 1043 0 "bottom: " 26.668875 26 "left: " 2 2
    // 1044 0 "bottom: " 26.668875 26 "left: " 2 2
    // 1002 0 "bottom: " 25.687875 25 "left: " 2 2
    // 1003 0 "bottom: " 25.687875 25 "left: " 2 2
    // 1004 0 "bottom: " 25.687875 25 "left: " 2 2
    // 962 215 "bottom: " 24.8295 24 "left: " 2 2
    // 963 0 "bottom: " 24.8295 24 "left: " 2 2
    // 964 0 "bottom: " 24.8295 24 "left: " 2 2
    // 962 215 "bottom: " 24.09375 24 "left: " 2 2
    // 963 0 "bottom: " 24.09375 24 "left: " 2 2
    // 964 0 "bottom: " 24.09375 24 "left: " 2 2
    // 922 0 "bottom: " 23.480625 23 "left: " 2 2
    // 923 0 "bottom: " 23.480625 23 "left: " 2 2
    // 924 0 "bottom: " 23.480625 23 "left: " 2 2
    // 882 0 "bottom: " 22.990125 22 "left: " 2 2
    // 883 0 "bottom: " 22.990125 22 "left: " 2 2
    // 884 0 "bottom: " 22.990125 22 "left: " 2 2
    // 882 0 "bottom: " 22.377 22 "left: " 2 2
    // 883 0 "bottom: " 22.377 22 "left: " 2 2
    // 884 0 "bottom: " 22.377 22 "left: " 2 2
    // 882 0 "bottom: " 22.622249999999998 22 "left: " 2 2
    // 883 0 "bottom: " 22.622249999999998 22 "left: " 2 2
    // 884 0 "bottom: " 22.622249999999998 22 "left: " 2 2
    // 922 0 "bottom: " 23.480625 23 "left: " 2 2
    // 923 0 "bottom: " 23.480625 23 "left: " 2 2
    // 924 0 "bottom: " 23.480625 23 "left: " 2 2
    // 962 215 "bottom: " 24.09375 24 "left: " 2 2
    // 963 0 "bottom: " 24.09375 24 "left: " 2 2
    // 964 0 "bottom: " 24.09375 24 "left: " 2 2
    // 962 215 "bottom: " 24.8295 24 "left: " 2 2
    // 963 0 "bottom: " 24.8295 24 "left: " 2 2
    // 964 0 "bottom: " 24.8295 24 "left: " 2 2
    // 1002 0 "bottom: " 25.687875 25 "left: " 2 2
    // 1003 0 "bottom: " 25.687875 25 "left: " 2 2
    // 1004 0 "bottom: " 25.687875 25 "left: " 2 2
    // 1042 0 "bottom: " 26.668875 26 "left: " 2 2
    // 1043 0 "bottom: " 26.668875 26 "left: " 2 2
    // 1044 0 "bottom: " 26.668875 26 "left: " 2 2
    // 1082 0 "bottom: " 27.7725 27 "left: " 2 2
    // 1083 0 "bottom: " 27.7725 27 "left: " 2 2
    // 1084 0 "bottom: " 27.7725 27 "left: " 2 2
    // 1122 0 "bottom: " 28.99875 28 "left: " 2 2
    // 1123 0 "bottom: " 28.99875 28 "left: " 2 2
    // 1124 0 "bottom: " 28.99875 28 "left: " 2 2

    // 1202 0 "bottom: " 30.225 30 "left: " 2 2
    // 1203 0 "bottom: " 30.225 30 "left: " 2 2
    // 1204 0 "bottom: " 30.225 30 "left: " 2 2
    // 1242 0 "bottom: " 31.45125 31 "left: " 2 2
    // 1243 0 "bottom: " 31.45125 31 "left: " 2 2
    // 1244 0 "bottom: " 31.45125 31 "left: " 2 2
    // 1282 0 "bottom: " 32.6775 32 "left: " 2 2
    // 1283 0 "bottom: " 32.6775 32 "left: " 2 2
    // 1284 0 "bottom: " 32.6775 32 "left: " 2 2
    // 1322 0 "bottom: " 33.90375 33 "left: " 2 2
    // 1323 0 "bottom: " 33.90375 33 "left: " 2 2
    // 1324 0 "bottom: " 33.90375 33 "left: " 2 2

    // Collision of bottom edge
    for (let i = 0; i < objectColumns; i += 1) {
      // console.log(
      //   ((Math.floor(object.getBottom() / this.tileSize) * this.columns) + Math.floor(object.getLeft() / this.tileSize)) + i,
      //   this.collisionMap[((Math.floor(object.getBottom() / this.tileSize) * this.columns) + Math.floor(object.getLeft() / this.tileSize)) + i],
      //   'bottom: ',
      //   object.getBottom() / this.tileSize,
      //   Math.floor(object.getBottom() / this.tileSize),
      //   'left: ',
      //   object.getLeft() / this.tileSize,
      //   Math.floor(object.getLeft() / this.tileSize),
      // )
      platformType = this.collisionMap[bottomLeft + i];
      if (platformType) {
        isCollisionDetected = true;
        this.collisionDebugMap[bottomLeft + i] = 'bottom';
        this.collider.processCollision(
          platformType,
          object,
          right * this.tileSize,
          bottom * this.tileSize,
          this.tileSize,
        );
      }
    }

    if (!isCollisionDetected && !object.isJumping && object.velocityY !== 0) {
      object.isFalling = true;
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
