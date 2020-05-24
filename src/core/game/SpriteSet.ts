// The class is responsible for processing spritesheets
export default class {
  spriteMap: spriteMap;
  frameWidth: number;
  frameHeight: number;
  frames: {};

  constructor(
    spriteMap: spriteMap,
    frameWidth: number,
    frameHeight: number,
    frames: {},
  ) {
    this.spriteMap = spriteMap;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frames = frames;
  }
}
