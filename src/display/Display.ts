// the class is responsible for all the rendering in the canvas
import TileSheet from './TileSheet';

export default class {
  buffer: CanvasRenderingContext2D;
  context: CanvasRenderingContext2D;
  tileSheet: TileSheet;

  constructor (canvas: HTMLCanvasElement) {
    this.buffer = document.createElement('canvas').getContext('2d');
    this.context = canvas.getContext('2d');
    this.tileSheet = new TileSheet(8, 23);
  }

  drawPlayer (
    rectangle: {
      x: number,
      y: number,
      width: number,
      height: number,
    },
    color1: string,
  ): void {
    this.buffer.fillStyle = color1;
    this.buffer.fillRect(
      Math.round(rectangle.x),
      Math.round(rectangle.y),
      rectangle.width,
      rectangle.height,
    );
    this.buffer.fillStyle = '#000000';
    this.buffer.fillRect(
      Math.round(rectangle.x + 1),
      Math.round(rectangle.y + 1),
      rectangle.width - 2,
      rectangle.height - 2,
    );
  }

  drawCollisionDebugMap(
    map: (number | string)[],
    mapColumns: number,
    tileSize: number,
  ): void {
    const colorsDictionary: {
      [sideName: string]: string
    } = {
      top: 'rgba(255, 0, 0, 0.8)',
      left: 'rgba(0, 181, 204, 0.8)',
      right: 'rgba(145, 61, 136, 0.8)',
      bottom: 'rgba(255, 255, 0, 0.8)',
    };
    for (let i: number = 0; i < map.length; i += 1) {
      const position = i;


      if (map[i]) {
        const mapRow = Math.floor(position / mapColumns);
        const mapColumn = position % mapColumns;

        this.buffer.fillStyle = colorsDictionary[map[i]];
        this.buffer.fillRect(
          mapColumn * tileSize,
          mapRow * tileSize,
          tileSize,
          tileSize,
        );
      }
    }
  }

  drawMap (map: number[], mapColumns: number): void {
    for (let i: number = 0; i < map.length; i += 1) {
      const id = map[i];
      const position = i;

      const sourceRow = Math.floor(id / this.tileSheet.columns);
      const sourceColumn = id % this.tileSheet.columns - 1;

      const mapRow = Math.floor(position / mapColumns);
      const mapColumn = position % mapColumns;

      const sourceX = this.tileSheet.tileSize * sourceColumn;
      const sourceY = this.tileSheet.tileSize * sourceRow;

      const mapX = this.tileSheet.tileSize * mapColumn;
      const mapY = this.tileSheet.tileSize * mapRow;

      this.buffer.drawImage(
        this.tileSheet.image,
        sourceX,
        sourceY,
        this.tileSheet.tileSize,
        this.tileSheet.tileSize,
        mapX,
        mapY,
        this.tileSheet.tileSize,
        this.tileSheet.tileSize,
      );
    }
  }

  render (): void {
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

  resize (
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
