// the class is responsible for all the work with the camera
export default class {
  x: number;
  y: number;
  width: number;
  height: number;
  yDiff: number;

  constructor(
    width: number,
    height: number,
  ) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.yDiff = 0;
  }

  adjustCamera(
    aim: Character,
    stageWidth: number,
    stageHeight: number,
  ): void {
    let aimY = aim.y;

    // This condition is necessary in order to keep the camera in the same place when the character
    // begins to duck.
    if (aim.isDucking) {
      aimY = aim.y - (aim.defaults.height - aim.height);
    }

    const aimXCenter = aim.x + (aim.defaults.width / 2);
    const aimYCenter = aimY + (aim.defaults.height / 2);

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
