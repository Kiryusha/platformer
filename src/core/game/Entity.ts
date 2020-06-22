// The class is responsible for processing all world objects
// Entity has everything related to positioning: directly obtaining coordinates or setting them
export default class Entity implements Entity {
  xOld: number;
  yOld: number;
  isColliding: boolean;
  collisionXDirection: string;
  collisionYDirection: string;

  constructor(
    public x: number,
    public y: number,
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

  getTop(): number {
    return this.y;
  }

  getRight(): number {
    return this.x + this.width;
  }

  getLeft(): number {
    return this.x;
  }

  getBottom(): number {
    return this.y + this.height;
  }

  getOldTop(): number {
    return this.yOld;
  }

  getOldRight(): number {
    return this.xOld + this.width;
  }

  getOldLeft(): number {
    return this.xOld;
  }

  getOldBottom(): number {
    return this.yOld + this.height;
  }

  setTop(y: number): void {
    this.y = y;
  }

  setRight(x: number): void {
    this.x = x - this.width;
  }

  setLeft(x: number): void {
    this.x = x;
  }

  setBottom(y: number): void {
    this.y = y - this.height;
  }

  setOldTop(y: number): void {
    this.yOld = y;
  }

  setOldRight(x: number): void {
    this.xOld = x - this.width;
  }

  setOldLeft(x: number): void {
    this.xOld = x;
  }

  setOldBottom(y: number): void {
    this.yOld = y - this.height;
  }
}
