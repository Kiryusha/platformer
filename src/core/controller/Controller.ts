// The class is responsible for the user's input processing
import Button from './Button';

export default class {
  left: Button;
  right: Button;
  up: Button;
  shift: Button;
  down: Button;
  jump: Button;

  constructor() {
    this.left = new Button();
    this.right = new Button();
    this.up = new Button();
    this.shift = new Button();
    this.down = new Button();
    this.jump = new Button();
  }

  handleKeyEvent(
    type: string,
    keyCode: number
  ): void {
    switch (keyCode) {
      case 37:
        this.left.getInput(type);
        break;
      case 38:
        this.up.getInput(type);
        break;
      case 39:
        this.right.getInput(type);
        break;
      case 16:
        this.shift.getInput(type);
        break;
      case 40:
        this.down.getInput(type);
        break;
      case 90:
        this.jump.getInput(type);
        break;
    }
  }
}
