// the class is responsible for creating tilesheets
export default class {
  image: HTMLImageElement;
  tileSize: number;
  columns: number;

  constructor(tileSize: number, columns: number) {
    this.image = new Image();
    this.tileSize = tileSize;
    this.columns = columns;
  }

  loadAsset(url: string): any {
    return new Promise((resolve, reject) => {
      this.image.addEventListener('load', () => resolve());
      this.image.addEventListener('error', err => reject(err));
      this.image.src = url;
    });
  }
}
