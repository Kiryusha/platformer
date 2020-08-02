declare var ASSETS_URL: string;

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
