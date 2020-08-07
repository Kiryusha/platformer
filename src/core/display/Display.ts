// the class is responsible for all the rendering in the canvas
import Camera from './Camera';
import Renderer from './Renderer';
import Popup from './Popup';
import fontMap from '../../assets/sprite-maps/font.json';

export default class Display {
  context2D: CanvasRenderingContext2D;
  camera: Camera;
  renderer: Renderer;
  contextWebGL: WebGLRenderingContext;
  imagesMap: SpriteMap;
  popup: Popup;
  backgrounds: ImageManager[];
  mapTileset: ImageManager;
  images: ImageManager;

  constructor(
    private bus: Bus,
    private library: Library,
    cameraWidth: number,
    cameraHeight: number,
  ) {
    this.context2D = this.library.context2D;
    this.contextWebGL = this.library.contextWebGL;
    this.backgrounds = [];
    this.camera = new Camera(cameraWidth, cameraHeight);
    this.renderer = new Renderer(this.contextWebGL);
    this.popup = new Popup(this.bus);
  }

  public adjustBufferCanvasSize(stageWidth: number, stageHeight: number): void {
    this.contextWebGL.canvas.width = stageWidth;
    this.contextWebGL.canvas.height = stageHeight;
  }

  public drawLoading() {
    const loaderHeight = 10;
    const visibleProgress = Math.ceil(this.library.loadingProgress);
    const width =  (this.camera.width / 100) * this.library.loadingProgress;
    const posX = (this.camera.width / 2) - (width / 2);
    const color = [255, 255, 255, 1];

    this.renderer.drawRect([
      posX, (this.camera.height / 2) - loaderHeight, // upper-left corner
      posX + width, (this.camera.height / 2) - loaderHeight,
      posX, (this.camera.height / 2) + loaderHeight,
      posX, (this.camera.height / 2) + loaderHeight, // bottom-left corner
      posX + width, (this.camera.height / 2) - loaderHeight,
      posX + width, (this.camera.height / 2) + loaderHeight, // bottom-right corner
    ], color);

    // If the texture hasn't loaded yet, don't call the method.
    if (this.library.images.font.texture) {
      this.drawText(
        `${Math.ceil(visibleProgress)}%`,
        (this.camera.width / 2),
        (this.camera.height / 2) - 7,
        'center',
        2,
      );

      if (this.library.loadingProgress === 100) {
        this.drawText(
          'Press any key',
          (this.camera.width / 2),
          (this.camera.height / 2) + 28,
          'center',
          3,
        );
      }
    }
  }

  public drawPopup(
    x: number = 10,
    y: number = 68,
  ): void {
    // We will conventionally assume that the line height increases by one and a half times for
    // each step of the font size greater than one.
    const lineHeight = 11 + (0.5 * 11 * (this.popup.fontSize - 1));
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
      <ImageManager>this.library.images.popup,
      0,
      0,
      this.camera.x + x,
      this.camera.y + y + this.popup.offset,
      this.popup.width,
      this.popup.height,
    );

    // Drawing text
    // console.log(this.popup.text)
    if (!this.popup.text) return;

    let posX = 0;
    let posY = 0;

    switch (this.popup.align) {
      case 'left':
        posX = x + this.popup.xPadding;
        posY = y + this.popup.yPadding + this.popup.offset;
        break;
      case 'right':
        posX = x + this.popup.width - this.popup.xPadding;
        posY = y + this.popup.yPadding + this.popup.offset;
        break;
      case 'center':
        posX = x + (this.popup.width / 2);
        posY = y + this.popup.offset + (this.popup.height / 2);
        break;
    }

    if (Array.isArray(this.popup.text)) {
      for (let i = 0; i < this.popup.text.length; i += 1) {
        this.drawText(
          this.popup.text[i],
          posX,
          this.popup.align === 'center'
            ? posY - (((lineHeight * this.popup.text.length) / 2) - (lineHeight * i))
            : posY + (lineHeight * i),
          this.popup.align,
          this.popup.fontSize,
        );
      }
    } else {
      this.drawText(
        this.popup.text,
        posX,
        this.popup.align === 'center'
          ? posY - (lineHeight / 2)
          : posY,
        this.popup.align,
        this.popup.fontSize,
      );
    }
  }

  public drawText(
    word: string,
    x: number = 0,
    y: number = 0,
    align: Align = 'left',
    fontSize: number = 1,
  ): void {
    // Font sprite map
    const dictionary: FontMap = fontMap;
    // Letters to draw
    let letters: string[] = word.split('');
    // Margin between letters
    const leftMargin: number = 1;
    // Cumulative string length for each letter
    let currentWidth: number = 0;
    // Modificator for align center
    let fullWidth: number = 0;

    switch (align) {
      case 'right':
        letters = letters.reverse();
        break;
      case 'center':
        for (let i = 1; i <= letters.length; i += 1) {
          const letter: any = dictionary[letters[i - 1]];

          fullWidth += i === letters.length ? letter.w * fontSize : (letter.w + leftMargin) * fontSize;
        }
        break;
    }

    for (let i = 0; i < letters.length; i += 1) {
      const letter: any = dictionary[letters[i]];
      // currentWidth of previous letter
      const shouldAddWidth = !!letters[i - 1];
      const prevWidth: number = shouldAddWidth ? dictionary[letters[i - 1]].w : 0;
      // Left margin is only need after first letter
      if (i) currentWidth += prevWidth + leftMargin;
      // The position of the letter on the x-axis
      let posX;

      switch (align) {
        case 'left':
          posX = this.camera.x + x + (currentWidth * fontSize);
          break;
        case 'right':
          posX = this.camera.x + x - (currentWidth * fontSize);
          break;
        case 'center':
          posX = (this.camera.x + x + (currentWidth * fontSize) - (fullWidth / 2));
          break;
      }

      this.drawObject(
        false,
        this.library.images.font,
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
        this.library.images.spriteSheet,
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
        this.library.images.spriteSheet,
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
      this.library.images.spriteSheet,
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
    asset: ImageManager,
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
            map[i][k].x + map[i][k].width, map[i][k].y, // upper-right corner
            map[i][k].x, map[i][k].y + map[i][k].height,
            map[i][k].x, map[i][k].y + map[i][k].height, // bottom-left corner
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
    this.context2D.drawImage(
      this.contextWebGL.canvas,
      this.camera.x,
      this.camera.y,
      this.camera.width,
      this.camera.height,
      0,
      0,
      this.context2D.canvas.width,
      this.context2D.canvas.height,
    );
  }

  public resize(
    width: number,
    height: number,
    ratio: number,
  ): void {
    if (height / width > ratio) {
      this.context2D.canvas.height = width * ratio;
      this.context2D.canvas.width = width;
    } else {
      this.context2D.canvas.height = height;
      this.context2D.canvas.width = height / ratio;
    }

    this.context2D.imageSmoothingEnabled = false;
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
    const margin = this.mapTileset ? this.mapTileset.tileSize * 2 : 32;

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
