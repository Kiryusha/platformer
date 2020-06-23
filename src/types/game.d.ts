interface GameMap {
  tilewidth: number
  width: number
  height: number
  layers: any[]
  tilesets: Tileset[]
}

interface GameLayer {
  data?: any[]
  objects?: any[]
  name: string
}

interface SpriteMap {
  frames: any
  meta: any
}

interface MapObject {
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
  properties?: any[]
}

interface Entity {
  name: string;
  type: string;
  group: string;
  width: number;
  height: number;
  isColliding: boolean;
  collisionXDirection: string;
  collisionYDirection: string;
  defaults: EntityConfig;
  properties?: {
    target?: string;
    offset?: string;
    destinationX?: string;
    destinationY?: string;
  };
  top: number;
  right: number;
  bottom: number;
  left: number;
  oldTop: number;
  oldRight: number;
  oldBottom: number;
  oldLeft: number;
}

interface Animator {
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
}

interface Character extends Entity {
  movingPattern: any
  isJumping: boolean
  velocityX: number
  velocityY: number
  isMovingLeft: boolean
  isMovingRight: boolean
  isFalling: boolean
  isJumpTriggered: boolean
  animator: Animator
  isFacingLeft: boolean
  isSprinting: boolean
  isDucking: boolean
  isKeepDucking: boolean
  isStuck: boolean
  destination: {
    name: string
    x: number
    y: number
  }
  startDucking(): void
  stopDucking(): void
  startSprinting(): void
  stopSprinting(): void
  startMovingLeft(): void
  stopMovingLeft(): void
  startMovingRight(): void
  stopMovingRight(): void
  startJumping(): void
  stopJumping(): void
  update(gravity: number): void
}

interface EntityConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  group: string;
  type: string;
  name: string;
  properties?: {};
}

interface CharacterConfig {
  entity: EntityConfig;
  main: {
    isStuck: boolean
    jumpImpulse: number
    maxSpeed: number
    maxJumpingSpeed: number
    isJumping: boolean
    isJumpTriggered: boolean
    isFalling: boolean
    accelerationModifier: number
    brakingModifier: number
    velocityX: number
    velocityY: number
    isMovingLeft: boolean
    isMovingRight: boolean
    friction: number
    isSprinting: boolean
    isDucking: boolean
    isKeepDucking: boolean
    isFacingLeft: boolean
    movingPattern: any
  }
  animation: {
    frameWidth: number
    frameHeight: number
    frames: {}
  }
}
