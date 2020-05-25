// the class is responsible for all the rendering in the canvas
import AssetsManager from './AssetsManager';

export default class {
  buffer: CanvasRenderingContext2D;
  context: CanvasRenderingContext2D;
  mapTileset: AssetsManager;
  playerSprite: AssetsManager;

  constructor(canvas: HTMLCanvasElement) {
    this.buffer = document.createElement('canvas').getContext('2d');
    this.context = canvas.getContext('2d');
    this.mapTileset = new AssetsManager(8, 23);
    this.playerSprite = new AssetsManager(8, 23);
  }

  // image, source_x, source_y, destination_x, destination_y, width, height
  drawObject(
    image,
    sourceX: number,
    sourceY: number,
    destinationX: number,
    destinationY: number,
    width: number,
    height: number,
  ): void {
    // console.log(image,
    // sourceX,
    // sourceY,
    // width,
    // height,
    // Math.round(destinationX),
    // Math.round(destinationY),
    // width,
    // height)
    // <img src=​"images/​player.png"> 111 64 undefined undefined NaN 212 undefined undefined
    this.buffer.drawImage(
      image,
      sourceX,
      sourceY,
      width,
      height,
      Math.round(destinationX),
      Math.round(destinationY),
      width,
      height,
    );
  }

  drawCollisionDebugMap(map: any[]): void {
    const colorsDictionary: {
      [sideName: string]: string
    } = {
      top: 'rgba(255, 0, 0, 0.8)',
      'top-left': 'rgba(255, 100, 0, 0.8)',
      'top-right': 'rgba(255, 0, 136, 0.8)',
      left: 'rgba(0, 181, 204, 0.8)',
      right: 'rgba(145, 61, 136, 0.8)',
      bottom: 'rgba(255, 255, 0, 0.8)',
      'bottom-left': 'rgba(255, 255, 204, 0.8)',
      'bottom-right': 'rgba(255, 255, 136, 0.8)',
      full: 'rgba(255, 255, 255, 0.8)',
    };

    for (let i = 0; i < map.length; i += 1) {
      for (let k = 0; k < map[i].length; k += 1) {
        if (map[i][k].type === 'collision') {
          this.buffer.fillStyle = colorsDictionary[map[i][k].name];
          this.buffer.fillRect(
            map[i][k].x,
            map[i][k].y,
            map[i][k].width,
            map[i][k].height,
          );
        }
      }
    }
  }

  drawMap(map: number[], mapColumns: number): void {
    for (let i: number = 0; i < map.length; i += 1) {
      const id = map[i];
      const position = i;

      const sourceRow = Math.floor(id / this.mapTileset.columns);
      const sourceColumn = id % this.mapTileset.columns - 1;

      const mapRow = Math.floor(position / mapColumns);
      const mapColumn = position % mapColumns;

      const sourceX = this.mapTileset.tileSize * sourceColumn;
      const sourceY = this.mapTileset.tileSize * sourceRow;

      const mapX = this.mapTileset.tileSize * mapColumn;
      const mapY = this.mapTileset.tileSize * mapRow;

      this.buffer.drawImage(
        this.mapTileset.image,
        sourceX,
        sourceY,
        this.mapTileset.tileSize,
        this.mapTileset.tileSize,
        mapX,
        mapY,
        this.mapTileset.tileSize,
        this.mapTileset.tileSize,
      );
    }
  }

  render(): void {
    this.context.drawImage(
      this.buffer.canvas,
      0,
      0,
      this.buffer.canvas.width,
      this.buffer.canvas.height,
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );
  }

  resize(
    width: number,
    height: number,
    ratio: number,
  ): void {
    if (height / width > ratio) {
      this.context.canvas.height = width * ratio;
      this.context.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / ratio;
    }

    this.context.imageSmoothingEnabled = false;
  }
}
