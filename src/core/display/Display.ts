// the class is responsible for all the rendering in the canvas
import AssetsManager from './AssetsManager';
import Camera from './Camera';
import Renderer from './Renderer';
import Popup from './Popup';
import fontMap from '../../assets/sprite-maps/font.json';

export default class {
  context: CanvasRenderingContext2D;
  mapTileset: AssetsManager;
  spriteSheet: AssetsManager;
  font: AssetsManager;
  images: AssetsManager;
  camera: Camera;
  renderer: Renderer;
  buffer: WebGLRenderingContext;
  backgrounds: AssetsManager[];
  imagesMap: SpriteMap;
  popup: Popup;

  constructor(
    private bus: Bus,
    canvas: HTMLCanvasElement,
    cameraWidth: number,
    cameraHeight: number,
  ) {
    this.context = canvas.getContext('2d');
    this.buffer = document.createElement('canvas').getContext('webgl');
    this.mapTileset = new AssetsManager(this.buffer);
    this.spriteSheet = new AssetsManager(this.buffer);
    this.font = new AssetsManager(this.buffer);
    this.backgrounds = [];
    this.images = new AssetsManager(this.buffer);
    this.camera = new Camera(cameraWidth, cameraHeight);
    this.renderer = new Renderer(this.buffer);
    this.popup = new Popup(this.bus);
    this.popup.background = new AssetsManager(this.buffer);
  }

  public adjustBufferCanvasSize(stageWidth: number, stageHeight: number): void {
    this.buffer.canvas.width = stageWidth;
    this.buffer.canvas.height = stageHeight;
  }


  public drawPopup(
    x: number = 10,
    y: number = 68,
  ): void {
    // Popup is off-screen, if its offset is greater than offsetMax, so we skip the rest
    if (!this.popup.isVisible && this.popup.offset > this.popup.offsetMax) {
      // Popup is off-screen, but its promise is not resolved
      if (this.popup.resolve && !this.popup.isResolved) {
        this.popup.resolve();
        this.popup.isResolved = true;
      }
      return;
    }

    // If the popup is visible, but it has offset, lower its offset till it is zero.
    if (this.popup.isVisible && this.popup.offset > 0) {
      this.popup.offset -= this.popup.offsetStep;
    // If the popup is no more visible, raise its offset until it reaches its maximum.
    } else if (!this.popup.isVisible) {
      this.popup.offset += this.popup.offsetStep;
    // Start waiting, if the popup's offset is zero, but it is still visible
    } else if (this.popup.startWaiting && !this.popup.isWaiting) {
      this.popup.startWaiting();
      this.popup.isWaiting = true;
    }

    this.drawObject(
      false,
      <AssetsManager>this.popup.background,
      0,
      0,
      this.camera.x + x,
      this.camera.y + y + this.popup.offset,
      this.popup.width,
      this.popup.height,
    );

    // Drawing text
    this.drawText(
      this.popup.text,
      x + this.popup.xPadding,
      y + this.popup.yPadding + this.popup.offset,
      'left',
      this.popup.fontSize,
    );
  }

  public drawText(
    word: string,
    x: number = 0,
    rawY: number = 0,
    align: string = 'left',
    fontSize: number = 1,
  ): void {
    let y = rawY;
    const lineHeight = 11;
    // Font sprite map
    const dictionary: FontMap = fontMap;
    // Letters to draw
    let letters: string[] = word.split('');
    // Margin between letters
    const leftMargin: number = 1;
    // Cumulative string length
    let width: number = 0;

    if (align === 'right') {
      letters = letters.reverse();
    }

    for (let i = 0; i < letters.length; i += 1) {
      if (letters[i] === '|') {
        y += lineHeight;
        width = -leftMargin;
        continue;
      }
      const letter: any = dictionary[letters[i]];
      // Width of previous letter
      const shouldAddWidth = letters[i - 1] && letters[i - 1] !== '|';
      const prevWidth: number = shouldAddWidth ? dictionary[letters[i - 1]].w : 0;
      // Left margin is only need after first letter
      if (i) width += prevWidth + leftMargin;
      // The position of the letter on the x-axis
      let posX = this.camera.x + x + (width * fontSize);

      if (align === 'right') {
        posX = this.camera.x + x - (width * fontSize);
      }

      this.drawObject(
        false,
        this.font,
        letter.x,
        // The font tile y + margin to the letter itself
        letter.y + letter.m,
        posX,
        this.camera.y + y,
        letter.w,
        letter.h,
        letter.w * fontSize,
        letter.h * fontSize,
      );
    }
  }

  public drawCharacters(characters: Character[]): void {
    characters.forEach((character: Character) => {
      if (character.isVanished) {
        return;
      }

      let frame;

      if (character.isFacingLeft) {
        frame =
          character.animator.flippedSpriteMap.frames[character.animator.frameValue].frame;
      } else {
        frame =
          character.animator.spriteMap.frames[character.animator.frameValue].frame;
      }

      this.drawObject(
        character.isFacingLeft,
        this.spriteSheet,
        frame.x,
        frame.y,
        character.left + Math.floor(character.width * 0.5 - frame.w * 0.5),
        character.top - Math.floor(frame.h - character.height),
        frame.w,
        frame.h,
      );
    });
  }

  public drawCollectables(collectables: AnimatedEntity[]) {
    collectables.forEach((collectable: AnimatedEntity) => {
      if (collectable.isVanished) {
        return;
      }

      let frame = collectable.animator.spriteMap.frames[collectable.animator.frameValue].frame;

      this.drawObject(
        false,
        this.spriteSheet,
        frame.x,
        frame.y,
        collectable.left,
        collectable.top,
        frame.w,
        frame.h,
      );
    });
  }

  public drawHud(
    player: Player,
    spriteMap: SpriteMap,
  ): void {
    const frameSource = spriteMap.frames[`hud-${player.currentHealth}-hp`];
    if (!frameSource) {
      return;
    }
    const margin = 2;
    const { frame } = frameSource;

    this.drawObject(
      false,
      this.spriteSheet,
      frame.x,
      frame.y,
      this.camera.x + margin,
      this.camera.y + margin,
      frame.w,
      frame.h,
    );

    // Drawing current stars amount
    this.drawText(`${player.currentStars}`, 52, 4, 'right');
  }

  public drawObject(
    isFlipped: boolean,
    asset: AssetsManager,
    sourceX: number,
    sourceY: number,
    destinationX: number,
    destinationY: number,
    srcWidth: number,
    srcHeight: number,
    dstWidth?: number,
    dstHeight?: number,
  ): void {
    if (dstWidth === undefined) {
      dstWidth = srcWidth;
    }

    if (dstHeight === undefined) {
      dstHeight = srcHeight;
    }

    if (this.isObjectWithinCamera(destinationX, destinationY)) {
      this.renderer.drawImage(
        isFlipped ? asset.flippedTexture : asset.texture,
        asset.image.width,
        asset.image.height,
        sourceX,
        sourceY,
        srcWidth,
        srcHeight,
        Math.round(destinationX),
        Math.round(destinationY),
        dstWidth,
        dstHeight,
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
}
