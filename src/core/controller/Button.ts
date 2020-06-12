// the class is responsible for button events processing
export default class {
  isActive: boolean;
  isHold: boolean;

  constructor() {
    this.isActive = false;
    this.isHold = false;
  }

  getInput(type: string): void {
    // this prevents repeating actions, if button keeps beeing down
    switch (type) {
      case 'keydown':
        if (this.isActive) {
          this.isHold = true;
        }
        this.isActive = true;
        break;

      case 'keyup':
        this.isActive = false;
        this.isHold = false;
        break;
    }
  }
}
