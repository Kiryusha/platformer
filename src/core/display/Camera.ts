// the class is responsible for all the work with the camera
export default class {
  x: number;
  y: number;
  width: number;
  height: number;
  yDiff: number;
  velocity: number;
  velocityModifier: number;
  maxVelocity: number;

  constructor(
    width: number,
    height: number,
  ) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.yDiff = 0;
    this.velocity = 0;
    this.velocityModifier = 4;
    this.maxVelocity = this.height / 2.5;
  }

  adjustCamera(
    aim: Character,
    stageWidth: number,
    stageHeight: number,
  ): void {
    let aimY;

    if (aim.isDucking) {
      // This condition is necessary in order to keep the camera in the same place when the character
      // begins to duck.
      aimY = aim.top - (aim.defaults.height - aim.height) + this.velocity;

      // But if the character continues ducking, gamera will smoothly moves down
      if (aim.isKeepDucking && (this.velocity <= this.maxVelocity)) {
        this.velocity += this.velocityModifier;
      }
    } else {
      if (this.velocity) {
        this.velocity -= this.velocityModifier;
      }
      aimY = aim.top + this.velocity;
    }

    const aimXCenter = aim.left + (aim.defaults.width / 2);
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
