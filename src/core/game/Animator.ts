// The class is responsible toggling player animations
export default class {
  spriteMap: SpriteMap;
  frameWidth: number;
  frameHeight: number;
  animations: any;
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
    animations: {},
  ) {
    this.spriteMap = spriteMap;
    this.flippedSpriteMap = spriteMap;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.animations = animations;

    this.count = 0;
    this.delay = 0;
    this.activeFrameSet = '';
    this.mode = 'pause';
    this.frameIndex = 0;
    this.frameValue = '';

    this.getXFlippedCoords();
  }

  public animate(): void {
    switch (this.mode) {
      case 'loop':
        this.loop();
        break;
      case 'pause':
    }
  }

  public changeFrameset(
    set: string,
    delay?: number,
    mode: string = 'loop',
    frameIndex: number = 0,
  ): void {
    let frameSet = set;

    // If entity does not have animation for this case, then we take its first animation
    if (!this.animations[frameSet]) {
      frameSet = Object.keys(this.animations)[0];
    }

    // Delay can be taken from the config or received as an argument
    let delayNew = delay || this.animations[frameSet].delay;

    // Skip the frameset change, if it is already set and its delay has not change
    if (this.activeFrameSet === frameSet && delayNew === this.delay) {
      return;
    }

    this.count = 0;
    this.delay = delayNew;
    this.mode = mode;
    this.activeFrameSet = frameSet;
    this.frameIndex = frameIndex;
    this.frameValue = this.animations[frameSet].frames[this.frameIndex];
  }

  private getXFlippedCoords() {
    this.flippedSpriteMap = JSON.parse(JSON.stringify(this.spriteMap));

    Object.keys(this.flippedSpriteMap.frames).map(frameName => {
      this.flippedSpriteMap.frames[frameName].frame.x =
        this.flippedSpriteMap.meta.size.w - this.flippedSpriteMap.frames[frameName].frame.x - this.flippedSpriteMap.frames[frameName].frame.w;
    });
  }

  private loop(): void {
    this.count += 1;

    // This function is called every frame, but the animation frame changes only when the function
    // run counter reaches the animation delay value, then the counter is reduced by the delay value.
    // This way we control how fast the animation should take place. For example: we have Bunny idle
    // animation, it has 9 frames and the delay value is 4. We divide the current number of frames
    // per second (30) by the delay value and get how often the frame will change - 7.5 frames per
    // second. Accordingly, the entire Bunny idle animation will last 1.2 seconds.
    if (this.count > this.delay) {
      this.count -= this.delay;

      // We gradually increase the frame index untill it reaches the animation frameset length and
      // then return it to zero
      this.frameIndex = (this.frameIndex < this.animations[this.activeFrameSet].frames.length - 1)
        ? this.frameIndex + 1 : 0;
      this.frameValue = this.animations[this.activeFrameSet].frames[this.frameIndex];
    }
  }
}
