// the class is responsible for all the work with the camera
export default class {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(
    width: number,
    height: number,
  ) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
  }

  adjustCamera(
    aim: Entity,
    stageWidth: number,
    stageHeight: number,
  ): void {
    const aimXCenter = aim.x + (aim.width / 2);
    const aimYCenter = aim.y + (aim.height / 2);

    let positionX = aimXCenter - (this.width / 2);
    let positionY = aimYCenter - (this.height / 2);

    if (positionX < 0) {
      positionX = 0;
    }

    if ((aimXCenter + (this.width / 2)) > stageWidth) {
      positionX = stageWidth - this.width;
    }

    if (positionY < 0) {
      positionY = 0;
    }

    if ((aimYCenter + (this.height / 2)) > stageHeight) {
      positionY = stageHeight - this.height;
    }

    this.x = positionX;
    this.y = positionY;
  }
}
