// The class is responsible for processing all world objects
export default class {
  x: number;
  y: number;
  xOld: number;
  yOld: number;
  width: number;
  height: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    // Position
    this.x = x;
    this.y = y;
    this.xOld = x;
    this.yOld = y;

    // Appearance
    this.width = width;
    this.height = height;
  }

  getTop(): number {
    return this.y;
  }

  getRight(): number {
    return this.x + this.width;
  }

  getLeft(): number {
    return this.x;
  }

  getBottom(): number {
    return this.y + this.height;
  }

  getOldTop(): number {
    return this.yOld;
  }

  getOldRight(): number {
    return this.xOld + this.width;
  }

  getOldLeft(): number {
    return this.xOld;
  }

  getOldBottom(): number {
    return this.yOld + this.height;
  }

  setTop(y: number): void {
    this.y = y;
  }

  setRight(x: number): void {
    this.x = x - this.width;
  }

  setLeft(x: number): void {
    this.x = x;
  }

  setBottom(y: number): void {
    this.y = y - this.height;
  }

  setOldTop(y: number): void {
    this.yOld = y;
  }

  setOldRight(x: number): void {
    this.xOld = x - this.width;
  }

  setOldLeft(x: number): void {
    this.xOld = x;
  }

  setOldBottom(y: number): void {
    this.yOld = y - this.height;
  }
}