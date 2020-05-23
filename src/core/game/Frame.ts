// The class is responsible for keeping single frame from spritesheet

export default class {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }
}
