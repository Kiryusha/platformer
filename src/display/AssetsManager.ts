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

  loadAsset(url: string, callback: () => void): void {
    this.image.addEventListener('load', () => {
      callback();
    }, { once : true});

    this.image.src = url;
  }
}
