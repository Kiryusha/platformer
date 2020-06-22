// The class is responsible for processing all world objects
// Entity has everything related to positioning: directly obtaining coordinates or setting them
export default class Entity implements Entity {
  private xOld: number;
  private yOld: number;
  public isColliding: boolean;
  public collisionXDirection: string;
  public collisionYDirection: string;

  constructor(
    private x: number,
    private y: number,
    public width: number,
    public height: number,
    public group: string,
    public type: string,
    public name: string,
    public properties?: {},
  ) {
    // types
    this.group = group;
    this.type = type;
    this.name = name;

    // Position
    this.x = x;
    this.y = y;
    this.xOld = x;
    this.yOld = y;

    // Colliding
    this.isColliding = false;
    this.collisionXDirection = '';
    this.collisionYDirection = '';

    // Appearance
    this.width = width;
    this.height = height;

    // custom
    this.properties = properties;
  }

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
    return this.y + this.height
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
