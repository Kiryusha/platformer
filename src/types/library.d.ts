declare module '*.ogg' {
  const src: string;
  export default src;
}

interface Library {
  loadingProgress: number;
  buffer: WebGLRenderingContext;
  context: CanvasRenderingContext2D;
  zones: Zones;
  images: ImagesCollection;
  sounds: SoundsCollection;
  gameMaps: GameMapsCollection;
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
    makeFlipped?: boolean,
  ): Promise<any>;
}

interface AudioManager {
  loadAsset(
    url: any,
  ): Promise<void>;
  play(): void;
}

interface SoundsCollection {
  [key: string]: AudioManager;
}

interface ImagesCollection {
  [key: string]: ImageManager;
}

interface GameMapsCollection {
  [key: string]: GameMap;
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
