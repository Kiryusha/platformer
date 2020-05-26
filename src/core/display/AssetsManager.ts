// the class is responsible for creating tilesheets
export default class {
  image: HTMLImageElement;
  tileSize: number;
  columns: number;
  flippedImage: CanvasImageSource;

  constructor(tileSize: number, columns: number) {
    this.image = new Image();
    this.tileSize = tileSize;
    this.columns = columns;
  }

  loadAsset(url: string, makeFlipped: boolean = false): any {
    if (makeFlipped) {
      return Promise.all([
        this.loadImage(url),
        this.flipImage(url),
      ]);
    } else {
      return this.loadImage(url);
    }
  }

  loadImage(url: string) {
    return new Promise((resolve, reject) => {
      this.image.addEventListener('load', () => resolve());
      this.image.addEventListener('error', err => reject(err));
      this.image.src = url;
    });
  }

  flipImage(url: string): any {
    return new Promise((resolve, reject) => {
      const buffer = document.createElement('canvas').getContext('2d');
      const image = new Image();
      image.src = url;
      image.addEventListener('error', err => reject(err));
      image.addEventListener('load', () => {
        buffer.canvas.width  = image.width;
        buffer.canvas.height = image.height;
        buffer.save();
        buffer.scale(-1, 1);
        buffer.drawImage(
          image,
          -image.width,
          0,
          image.width,
          image.height,
        );
        buffer.restore();
        this.flippedImage = buffer.canvas;
        resolve();
      }, { once: true });
    });
  }
}
