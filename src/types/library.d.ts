interface Library {
  font: ImageManager;
  spriteSheet: ImageManager;
  popup: ImageManager;
  loadingProgress: number;
  buffer: WebGLRenderingContext;
  context: CanvasRenderingContext2D;
  zones: Zones;
  initAssets(): void;
}

interface ImageManager {
  image: HTMLImageElement;
  tileSize: number;
  columns: number;
  flippedImage: CanvasImageSource;
  texture: WebGLTexture;
  flippedTexture: WebGLTexture;
  url: any;
  loadAsset(
    url: any,
    makeFlipped: boolean,
    tileSize?: number,
    columns?: number,
  ): Promise<any>
}

interface Zones {
  [key: string]: {
    config: GameMap;
    tileset: ImageManager;
    backgrounds: ImageManager[];
    images: {
      spriteSheet?: ImageManager;
      spriteMap?: SpriteMap;
    }
  }
}
