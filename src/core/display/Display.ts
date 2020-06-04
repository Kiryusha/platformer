// the class is responsible for all the rendering in the canvas
import AssetsManager from './AssetsManager';
import Camera from './Camera';
import Renderer from './Renderer';

export default class {
  buffer: CanvasRenderingContext2D;
  context: CanvasRenderingContext2D;
  mapTileset: AssetsManager;
  spriteSheet: AssetsManager;
  camera: Camera;
  renderer: Renderer;
  bufferGL: WebGLRenderingContext;

  constructor(
    canvas: HTMLCanvasElement,
    cameraWidth: number,
    cameraHeight: number,
  ) {
    this.buffer = document.createElement('canvas').getContext('2d');
    this.context = canvas.getContext('2d');
    this.bufferGL = document.createElement('canvas').getContext('webgl');
    this.mapTileset = new AssetsManager(8, 23);
    this.spriteSheet = new AssetsManager(8, 23);
    this.camera = new Camera(cameraWidth, cameraHeight);
    this.renderer = new Renderer(this.bufferGL);
  }

  drawObject(
    image: CanvasImageSource,
    sourceX: number,
    sourceY: number,
    destinationX: number,
    destinationY: number,
    width: number,
    height: number,
  ): void {
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
      [sideName: string]: number[]
    } = {
      top: [255, 0, 0, 0.5],
      'top-left': [255, 100, 0, 0.5],
      'top-right': [255, 0, 136, 0.5],
      left: [0, 181, 204, 0.5],
      right: [145, 61, 136, 0.5],
      bottom: [255, 255, 0, 0.5],
      'bottom-left': [255, 255, 204, 0.5],
      'bottom-right': [255, 255, 136, 0.5],
      full: [200, 200, 200, 0.5], // for some reason white is not transparent in webgl
    };

    this.renderer.clear();

    for (let i = 0; i < map.length; i += 1) {
      for (let k = 0; k < map[i].length; k += 1) {
        if (map[i][k].type === 'collision') {
          this.renderer.drawRect([
            map[i][k].x, map[i][k].y, // upper-left corner
            map[i][k].x + map[i][k].width, map[i][k].y,
            map[i][k].x, map[i][k].y + map[i][k].height,
            map[i][k].x, map[i][k].y + map[i][k].height, // bottom-right corner
            map[i][k].x + map[i][k].width, map[i][k].y,
            map[i][k].x + map[i][k].width, map[i][k].y + map[i][k].height, // bottom-right corner
          ], colorsDictionary[map[i][k].name]);
        }
      }
    }
  }

  drawMap(map: number[], mapColumns: number): void {
    for (let i: number = 0; i < map.length; i += 1) {
      if (!map[i]) continue;

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

      // Do not draw what does not get into the camera right now, plus a margin of two tiles.
      // Margin is needed in order to avoid glitches during fast movement
      const margin = this.mapTileset.tileSize * 2;

      if (
        mapY > this.camera.y + this.camera.height + margin
        || mapY < this.camera.y - margin
        || mapX > this.camera.x + this.camera.width + margin
        || mapX < this.camera.x - margin
      ) continue;

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

  render(
    player: Character,
    stageWidth: number,
    stageHeight: number,
  ): void {
    this.camera.adjustCamera(player, stageWidth, stageHeight);
    this.context.drawImage(
      this.buffer.canvas,
      this.camera.x,
      this.camera.y,
      this.camera.width,
      this.camera.height,
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );
    if (window.SHOW_COLLISIONS) {
      this.context.drawImage(
        this.bufferGL.canvas,
        this.camera.x,
        this.camera.y,
        this.camera.width,
        this.camera.height,
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height,
      );
    }
  }

  resize(
    width: number,
    height: number,
    ratio: number,
  ): void {
    if (height / width > ratio) {
      this.context.canvas.height = width * ratio;
      this.context.canvas.width = width;
      this.bufferGL.canvas.height = width * ratio;
      this.bufferGL.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / ratio;
      this.bufferGL.canvas.height = height;
      this.bufferGL.canvas.width = height / ratio;
    }

    this.context.imageSmoothingEnabled = false;
  }
}
