declare module '*.png'{
   const value: any;
   export = value;
}

interface gameMap {
  layers: any[]
}

interface spriteMap {
  frames: any
  meta: any
}

interface mapObject {
  name: string,
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Entity {
  name: string,
  type: string;
  group: string;
  x: number;
  y: number;
  xOld: number;
  yOld: number;
  width: number;
  height: number;
  getTop(): number;
  getRight(): number;
  getLeft(): number;
  getBottom(): number;
  getOldTop(): number;
  getOldRight(): number;
  getOldLeft(): number;
  getOldBottom(): number;
  setTop(y: number): void;
  setRight(x: number): void;
  setLeft(x: number): void;
  setBottom(y: number): void;
  setOldTop(y: number): void;
  setOldRight(x: number): void;
  setOldLeft(x: number): void;
  setOldBottom(y: number): void;
}

interface Character extends Entity {
  defaults: CharacterStats;
  jumpImpulse: number;
  maxSpeed: number;
  isJumping: boolean;
  velocityX: number;
  velocityY: number;
  isMovingLeft: boolean;
  isMovingRight: boolean;
  accelerationModifier: number;
  brakingModifier: number;
  isFalling: boolean;
  velocityYModifier: number;
  isJumpTriggered: boolean;
  maxJumpingSpeed: number;
  friction: number;
  animator: {};
  isFacingLeft: boolean;
  isSprinting: boolean;
  isDucking: boolean;
  isKeepDucking: boolean;
  duckingTimer: NodeJS.Timer;
  isStuck: boolean;
  setAnimationDefaults(stats: CharacterStats, playerSpriteMap: spriteMap): void;
  updateAnimation(): void;
  startDucking(): void;
  stopDucking(): void;
  startSprinting(): void;
  stopSprinting(): void;
  startMovingLeft(): void;
  stopMovingLeft(): void;
  startMovingRight(): void;
  stopMovingRight(): void;
  jump(value: boolean): void;
  update(gravity: number): void;
  adjustVerticalMovement(gravity: number): void;
  adjustHorizontalMovement(): void;
}

interface CharacterStats {
  x: number;
  y: number;
  name: string,
  type: string;
  group: string;
  width: number;
  height: number;
  isStuck: boolean;
  jumpImpulse: number;
  maxSpeed: number;
  maxJumpingSpeed: number;
  isJumping: boolean;
  isJumpTriggered: boolean;
  isFalling: boolean;
  accelerationModifier: number;
  brakingModifier: number;
  velocityX: number;
  velocityY: number;
  isMovingLeft: boolean;
  isMovingRight: boolean;
  friction: number;
  isSprinting: boolean;
  isDucking: boolean;
  isKeepDucking: boolean;
  isFacingLeft: boolean;
  spriteMap: {},
  frameWidth: number;
  frameHeight: number;
  frames: {
    idle: string[],
    skip: string[],
    jump: string[],
    fall: string[],
    duck: string[]
  };
}
