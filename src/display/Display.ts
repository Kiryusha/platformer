// the class is responsible for all the rendering in the canvas
export default class {
  buffer: CanvasRenderingContext2D;
  context: CanvasRenderingContext2D;

  constructor (canvas: HTMLCanvasElement) {
    this.buffer = document.createElement('canvas').getContext('2d');
    this.context = canvas.getContext('2d');
  }

  drawRectangle (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ): void {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(
      Math.floor(x),
      Math.floor(y),
      width,
      height,
    );
  }

  fill (color: string): void {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(
      0,
      0,
      this.buffer.canvas.width,
      this.buffer.canvas.height,
    );
  }

  render (): void {
    this.context.drawImage(
      this.buffer.canvas,
      0,
      0,
      this.buffer.canvas.width,
      this.buffer.canvas.height,
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );
  }

  resize (
    width: number,
    height: number,
    ratio: number,
  ): void {
    if (height / width > ratio) {
      this.context.canvas.height = width * ratio;
      this.context.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / ratio;
    }

    this.context.imageSmoothingEnabled = false;
  }
}
