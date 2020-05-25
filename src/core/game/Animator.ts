// The class is responsible toggling player animations
export default class {
  spriteMap: spriteMap;
  frameWidth: number;
  frameHeight: number;
  frames: any;
  count: number;
  delay: number;
  mode: string;
  activeFrameSet: string;
  frameIndex: number;
  frameValue: string;

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

    this.count = 0;
    this.delay = 0;
    this.activeFrameSet = '';
    this.mode = 'pause';
    this.frameIndex = 0;
    this.frameValue = '';
  }

  animate(): void {
    switch (this.mode) {
      case 'loop':
        this.loop();
        break;
      case 'pause':
    }
  }

  changeFrameset(
    frameSet: string,
    mode: 'loop' | 'pause',
    delay: number = 5,
    frameIndex: number = 0,
  ): void {
    if (this.activeFrameSet === frameSet) {
      return;
    }

    this.count = 0;
    this.delay = delay;
    this.mode = mode;
    this.activeFrameSet = frameSet;
    this.frameIndex = frameIndex;
    this.frameValue = this.frames[frameSet][this.frameIndex];
  }

  loop(): void {
    this.count += 1;

    while (this.count > this.delay) {
      this.count -= this.delay;

      this.frameIndex = (this.frameIndex < this.frames[this.activeFrameSet].length - 1) ? this.frameIndex + 1 : 0;
      this.frameValue = this.frames[this.activeFrameSet][this.frameIndex];
    }
  }
}
