declare module '*.png'{
   const value: any;
   export = value;
}

interface gameMap {
  layers: any[]
}

interface Entity {
  name: string,
  type: string;
  x: number;
  y: number;
  xOld: number;
  yOld: number;
  width: number;
  height: number;
  getTop(): number;
  getRight(): number;
  getLeft(): number;
  getBottom(): number;
  getOldTop(): number;
  getOldRight(): number;
  getOldLeft(): number;
  getOldBottom(): number;
  setTop(y: number): void;
  setRight(x: number): void;
  setLeft(x: number): void;
  setBottom(y: number): void;
  setOldTop(y: number): void;
  setOldRight(x: number): void;
  setOldLeft(x: number): void;
  setOldBottom(y: number): void;
}

interface Player extends Entity {
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
  isFalling: boolean;
}
