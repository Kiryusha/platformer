// the class is responsible for all the rendering in the canvas
import AssetsManager from './AssetsManager';
import Camera from './Camera';
import Renderer from './Renderer';

export default class {
  context: CanvasRenderingContext2D;
  mapTileset: AssetsManager;
  spriteSheet: AssetsManager;
  images: AssetsManager;
  camera: Camera;
  renderer: Renderer;
  buffer: WebGLRenderingContext;
  backgrounds: AssetsManager[];
  imagesMap: SpriteMap;

  constructor(
    canvas: HTMLCanvasElement,
    cameraWidth: number,
    cameraHeight: number,
  ) {
    this.context = canvas.getContext('2d');
    this.buffer = document.createElement('canvas').getContext('webgl');
    this.mapTileset = new AssetsManager(this.buffer);
    this.spriteSheet = new AssetsManager(this.buffer);
    this.backgrounds = [];
    this.images = new AssetsManager(this.buffer);
    this.camera = new Camera(cameraWidth, cameraHeight);
    this.renderer = new Renderer(this.buffer);
  }

  private isObjectWithinCamera(
    x: number,
    y: number,
    w?: number,
    h?: number,
  ): boolean {
    if (w === undefined) w = x;

    if (h === undefined) h = y;

    // Do not draw what does not get into the camera right now, plus a margin of two tiles.
    // Margin is needed in order to avoid glitches during fast movement
    const margin = this.mapTileset.tileSize * 2;

    return !(y > this.camera.y + this.camera.height + margin
      || h < this.camera.y - margin
      || x > this.camera.x + this.camera.width + margin
      || w < this.camera.x - margin);
  }

  private drawLargeTiles(
    imagesTilesData: Tileset,
    tileId: number,
    mapX: number,
    mapY: number,
  ): void {
    const tile = imagesTilesData.tiles[tileId - imagesTilesData.firstgid];
    const source = this.imagesMap.frames[tile.type];
    const destinationX = mapX;
    const destinationY = mapY - (source.frame.h - this.mapTileset.tileSize);

    if (this.isObjectWithinCamera(
      destinationX,
      destinationY,
      destinationX + source.frame.w,
      destinationY + source.frame.h,
    )) {
      this.renderer.drawImage(
        this.images.texture,
        this.images.image.width,
        this.images.image.height,
        source.frame.x,
        source.frame.y,
        source.frame.w,
        source.frame.h,
        destinationX,
        destinationY,
        source.frame.w,
        source.frame.h,
      );
    }
  }

  public adjustBufferCanvasSize(stageWidth: number, stageHeight: number): void {
    this.buffer.canvas.width = stageWidth;
    this.buffer.canvas.height = stageHeight;
  }

  public drawObject(
    isFlipped: boolean,
    asset: AssetsManager,
    sourceX: number,
    sourceY: number,
    destinationX: number,
    destinationY: number,
    width: number,
    height: number,
  ): void {
    if (this.isObjectWithinCamera(destinationX, destinationY)) {
      this.renderer.drawImage(
        isFlipped ? asset.flippedTexture : asset.texture,
        asset.image.width,
        asset.image.height,
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
  }

  public drawBackgrounds(): void {
    for (let i = 0; i < this.backgrounds.length; i += 1) {
      let destinationX = 0;
      let destinationY = 0;
      const modifier = i + 1;

      // creating parallax according to aspect ratio - 9/16
      // each subsequent layer will be slower
      destinationX += this.camera.x / (6 * modifier);
      destinationY += this.camera.y / (10.66 * modifier);

      // first background rendering
      this.renderer.drawImage(
        this.backgrounds[i].texture,
        this.backgrounds[i].image.width,
        this.backgrounds[i].image.height,
        0,
        0,
        this.backgrounds[i].image.width,
        this.backgrounds[i].image.height,
        destinationX,
        destinationY,
        this.backgrounds[i].image.width,
        this.backgrounds[i].image.height,
      );

      // additional background rendering in case the background is very narrow
      // and does not fit in the camera
      while (
        (destinationX + this.backgrounds[i].image.width) <= (this.camera.x + this.camera.width)
      ) {
        destinationX += this.backgrounds[i].image.width;
        this.renderer.drawImage(
          this.backgrounds[i].texture,
          this.backgrounds[i].image.width,
          this.backgrounds[i].image.height,
          0,
          0,
          this.backgrounds[i].image.width,
          this.backgrounds[i].image.height,
          destinationX,
          destinationY,
          this.backgrounds[i].image.width,
          this.backgrounds[i].image.height,
        );
      }
    }
  }

  public drawCollisionDebugMap(map: any[]): void {
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

    for (let i = 0; i < map.length; i += 1) {
      for (let k = 0; k < map[i].length; k += 1) {
        if (map[i][k].group === 'collisions') {
          this.renderer.drawRect([
            map[i][k].x, map[i][k].y, // upper-left corner
            map[i][k].x + map[i][k].width, map[i][k].y,
            map[i][k].x, map[i][k].y + map[i][k].height,
            map[i][k].x, map[i][k].y + map[i][k].height, // bottom-right corner
            map[i][k].x + map[i][k].width, map[i][k].y,
            map[i][k].x + map[i][k].width, map[i][k].y + map[i][k].height, // bottom-right corner
          ], colorsDictionary[map[i][k].type]);
        }
      }
    }
  }

  public drawMap(
    map: number[],
    mapColumns: number,
    imagesTilesData: Tileset,
  ): void {
    for (let i: number = 0; i < map.length; i += 1) {
      if (!map[i]) continue;

      const id = map[i];
      const position = i;
      const remainder = id % this.mapTileset.columns;

      let sourceRow = remainder
        ? Math.floor(id / this.mapTileset.columns)
        : (id / this.mapTileset.columns) - 1;
      let sourceColumn = remainder
        ? remainder - 1
        : this.mapTileset.columns - 1;

      const mapRow = Math.floor(position / mapColumns);
      const mapColumn = position % mapColumns;

      const sourceX = this.mapTileset.tileSize * sourceColumn;
      const sourceY = this.mapTileset.tileSize * sourceRow;

      const mapX = this.mapTileset.tileSize * mapColumn;
      const mapY = this.mapTileset.tileSize * mapRow;

      if (imagesTilesData && (id >= imagesTilesData.firstgid)) {
        this.drawLargeTiles(imagesTilesData, id, mapX, mapY);
      }

      if (this.isObjectWithinCamera(mapX, mapY)) {
        this.renderer.drawImage(
          this.mapTileset.texture,
          this.mapTileset.image.width,
          this.mapTileset.image.height,
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
  }

  public render(): void {
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
  }

  public resize(
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
