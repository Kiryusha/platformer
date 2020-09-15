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
  background: ImageManager;
  isVisible: boolean;
  offset: number;
  offsetMax: number;
  offsetStep: number;
  text: string | string[];
  fontSize: number;
  align: Align;
  resolve: Callback;
  isResolved: boolean;
  isWaiting: boolean;
  startWaiting(): void;
}

type Align = 'left' | 'right' | 'center';

interface PopupPayload {
  text: string;
  fontSize?: number;
  align?: Align;
}

interface LayerTile {
  sourceX: number;
  sourceY: number;
  mapX: number;
  mapY: number;
  tileSize: number;
}

interface CameraTransitionPayload {
  to: CameraPosition;
  steps?: number;
  from?: CameraPosition;
}

interface Camera {
  x: number;
  y: number;
  width: number;
  height: number;
  adjustCamera(
    aim: CameraPosition | null,
    stageWidth: number,
    stageHeight: number,
  ): void
}
