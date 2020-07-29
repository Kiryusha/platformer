interface Tileset {
  firstgid: number;
  tiles: any[];
  name: string;
  columns: number;
  tilewidth: number;
}

interface FontMap {
  [key: string]: {
    x: number;
    y: number;
    w: number;
    h: number;
    m: number;
  }
}

interface Backgrounds {
  [key: string]: HTMLImageElement;
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

interface Popup {
  width: number;
  height: number;
  xPadding: number;
  yPadding: number;
  background: AssetsManager;
  isVisible: boolean;
  offset: number;
  offsetMax: number;
  offsetStep: number;
  text: string;
  fontSize: number;
  resolve: Callback;
  isResolved: boolean;
  isWaiting: boolean;
  startWaiting(): void;
}

interface PopupPayload {
  text: string;
  fontSize?: number;
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

interface Library {
  zones: Zones;
  initAssets(): void;
}
