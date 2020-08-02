interface Library {
  font: AssetsManager;
  spriteSheet: AssetsManager;
  popup: AssetsManager;
  loadingProgress: number;
  buffer: WebGLRenderingContext;
  context: CanvasRenderingContext2D;
  zones: Zones;
  initAssets(): void;
}

interface AssetsManager {
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
    tileset: AssetsManager;
    backgrounds: AssetsManager[];
    images: {
      spriteSheet?: AssetsManager;
      spriteMap?: SpriteMap;
    }
  }
}
