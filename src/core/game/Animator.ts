// The class is responsible toggling player animations
export default class {
  spriteMap: SpriteMap;
  frameWidth: number;
  frameHeight: number;
  frames: any;
  count: number;
  delay: number;
  mode: string;
  activeFrameSet: string;
  frameIndex: number;
  frameValue: string;
  flippedSpriteMap: SpriteMap;

  constructor(
    spriteMap: SpriteMap,
    frameWidth: number,
    frameHeight: number,
    frames: {},
  ) {
    this.spriteMap = spriteMap;
    this.flippedSpriteMap = spriteMap;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frames = frames;

    this.count = 0;
    this.delay = 0;
    this.activeFrameSet = '';
    this.mode = 'pause';
    this.frameIndex = 0;
    this.frameValue = '';

    this.getXFlippedCoords();
  }

  getXFlippedCoords() {
    this.flippedSpriteMap = JSON.parse(JSON.stringify(this.spriteMap));

    Object.keys(this.flippedSpriteMap.frames).map(frameName => {
      this.flippedSpriteMap.frames[frameName].frame.x =
        this.flippedSpriteMap.meta.size.w - this.flippedSpriteMap.frames[frameName].frame.x - this.flippedSpriteMap.frames[frameName].frame.w;
    });
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
    set: string,
    mode: 'loop' | 'pause',
    delay: number = 5,
    frameIndex: number = 0,
  ): void {
    let frameSet = set;

    if (!this.frames[frameSet]) {
      frameSet = Object.keys(this.frames)[0];
    }

    if (this.activeFrameSet === frameSet && this.delay === delay) {
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
