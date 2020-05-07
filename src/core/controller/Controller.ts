// The class is responsible for the user's input processing
import Button from './Button';

export default class {
  left: Button;
  right: Button;
  up: Button;

  constructor() {
    this.left = new Button();
    this.right = new Button();
    this.up = new Button();
  }

  handleKeyEvent(
    type: string,
    keyCode: number
  ): void {
    const isDown = type === 'keydown';
    switch (keyCode) {
      case 37:
        this.left.getInput(isDown);
        break;
      case 38:
        this.up.getInput(isDown);
        break;
      case 39:
        this.right.getInput(isDown);
        break;
    }
  }
}
