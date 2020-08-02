// the class is responsible for creating tilesheets
export default class AssetsManager implements AssetsManager {
  public image: HTMLImageElement;
  public tileSize: number;
  public columns: number;
  public flippedImage: CanvasImageSource;
  public texture: WebGLTexture;
  public flippedTexture: WebGLTexture;
  public url: any;
  private gl: WebGLRenderingContext;

  constructor(
    gl: WebGLRenderingContext,
  ) {
    this.gl = gl;
    this.image = new Image();
  }

  public async loadAsset(
    url: any,
    makeFlipped: boolean = false,
  ): Promise<void> {
    this.url = url;
    if (makeFlipped) {
      await Promise.all([
        this.loadImage(url),
        this.flipImage(url),
      ]);
      this.texture = this.createTexture(this.image);
      this.flippedTexture = this.createTexture(this.flippedImage);
    } else {
      await this.loadImage(url);
      this.texture = this.createTexture(this.image);
    }
  }

  private createTexture(image: any): WebGLTexture {
    const texture = this.gl.createTexture();

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image,
    );

    return texture;
  }

  private loadImage(url: any) {
    return new Promise((resolve, reject) => {
      this.image.addEventListener('load', () => resolve());
      this.image.addEventListener('error', err => reject(err));
      this.image.src = url;
    });
  }

  private flipImage(url: any): any {
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
