// the class is responsible for all the work with the camera
export default class Camera implements Camera {
  public x: number = 0;
  public y: number = 0;
  public xOld: number = 0;
  public yOld: number = 0;
  public width: number;
  public height: number;

  constructor(
    width: number,
    height: number,
  ) {
    this.width = width;
    this.height = height;
  }

  public adjustCamera(
    aim: CameraPosition | null,
    stageWidth: number,
    stageHeight: number,
  ): void {
    this.xOld = this.x;
    this.yOld = this.y;

    if (!aim) {
      this.x = this.xOld;
      this.y = this.yOld;
    }

    let positionX = aim.x - (this.width / 2);
    let positionY = aim.y - (this.height / 2);

    if (positionX < 0) {
      positionX = 0;
    }

    if ((aim.x + (this.width / 2)) > stageWidth) {
      positionX = stageWidth - this.width;
    }

    if (positionY < 0) {
      positionY = 0;
    }

    if ((aim.y + (this.height / 2)) > stageHeight) {
      positionY = stageHeight - this.height;
    }

    this.x = Math.round(positionX);
    this.y = Math.round(positionY);
  }
}
