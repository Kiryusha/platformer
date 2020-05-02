// the class is responsible for button events processing
export default class {
  isDown: boolean;
  isActive: boolean;

  constructor () {
    this.isDown = false;
    this.isActive = false;
  }

  getInput (isDown: boolean): void {
    if (this.isDown !== isDown) {
      this.isActive = isDown;
    }

    this.isDown = isDown;
  }
}
