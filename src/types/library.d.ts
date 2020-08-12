declare module '*.ogg' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

interface Library {
  loadingProgress: number;
  contextWebGL: WebGLRenderingContext;
  context2D: CanvasRenderingContext2D;
  contextAudio: AudioContext;
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
  play(params?: PlayParams): void;
  resume(params?: PlayParams): void;
  pause(): void;
}

interface PlayParams {
  isSimultaneous?: boolean; // Should it be allowed to play similar sounds at the same time
  volume?: number; // Volume of the current play
  loop?: boolean; // Should sound repeat
  startTime?: number; // timestamp
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
    title: string;
    group: string;
    config: GameMap;
    tileset: ImageManager;
    backgrounds: ImageManager[];
    images: {
      spriteSheet?: ImageManager;
      spriteMap?: SpriteMap;
    }
    audio?: {
      bgm?: AudioManager;
      ambient?: AudioManager;
    }
  }
}
