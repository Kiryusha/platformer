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
  background: AssetsManager;
  isVisible: boolean;
  offset: number;
  offsetMax: number;
  offsetStep: number;
  text: string;
  fontSize: number;
}

interface PopupPayload {
  text: string;
  fontSize?: number;
}
