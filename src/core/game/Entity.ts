// The class is responsible for processing all world objects
// Entity has everything related to positioning: obtaining coordinates or setting them
export default class Entity implements Entity {
  // Cataloging entities
  // Current use: Collider processing
  public group: string;
  public type: string;
  // Is the entity in collision right now
  // Current use: setting isFalling status for the Character
  public collisionType: string = null;
  // Last collisions for left and right directions
  // Current use: Brain processing of moving patterns
  public collisionXDirection: string = '';
  public collisionYDirection: string = '';
  // Property for the future, not used now
  public id: string;
  // Storage of any custom properties
  // Current use: Doors custom properties
  public properties?: {};
  // Storage of initial values.
  // Current use: adjusting Camera position
  public readonly defaults: EntityConfig;
  // Size in the axis
  public width: number;
  public height: number;
  // Flag indicating that the entity is no longer being processed.
  public isVanished: boolean = false;
  // Position on the axis: the current frame and the previous one
  private x: number;
  private y: number;
  private xOld: number;
  private yOld: number;

  constructor(config: EntityConfig) {
    Object.assign(this, config);

    this.defaults = config;
    this.xOld = config.x;
    this.yOld = config.y;
  }

  // Shortcuts for getting / setting Entity positions in the current or previous frame
  public get top(): number {
    return this.y;
  }

  public set top(value) {
    this.y = value;
  }

  public get right(): number {
    return this.x + this.width;
  }

  public set right(value) {
    this.x = value - this.width;
  }

  public get bottom(): number {
    return this.y + this.height;
  }

  public set bottom(value) {
    this.y = value - this.height;
  }

  public get left(): number {
    return this.x;
  }

  public set left(value) {
    this.x = value;
  }

  public get oldTop(): number {
    return this.yOld;
  }

  public set oldTop(value) {
    this.yOld = value;
  }

  public get oldRight(): number {
    return this.xOld + this.width;
  }

  public set oldRight(value) {
    this.xOld = value - this.width;
  }

  public get oldBottom(): number {
    return this.yOld + this.height;
  }

  public set oldBottom(value) {
    this.yOld = value - this.height;
  }

  public get oldLeft(): number {
    return this.xOld;
  }

  public set oldLeft(value) {
    this.xOld = value;
  }
}
