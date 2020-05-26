// the class is responsible for creating tilesheets
export default class {
  image: HTMLImageElement;
  tileSize: number;
  columns: number;
  flippedImage: HTMLImageElement;

  constructor(tileSize: number, columns: number) {
    this.image = new Image();
    this.flippedImage = new Image();
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
      const canvas = document.createElement('canvas')
      const buffer = canvas.getContext('2d');
      this.flippedImage.src = url;
      this.flippedImage.addEventListener('error', err => reject(err));
      this.flippedImage.addEventListener('load', () => {
        canvas.width  = this.flippedImage.width;
        canvas.height = this.flippedImage.height;
        buffer.save();
        buffer.scale(-1, 1);
        buffer.drawImage(
          this.flippedImage,
          -this.flippedImage.width,
          0,
          this.flippedImage.width,
          this.flippedImage.height,
        );
        buffer.restore();
        console.log(this.flippedImage)
        document.body.appendChild(canvas);
        this.flippedImage.src = canvas.toDataURL();
        resolve();
      }, { once: true });
    });
  }
}
