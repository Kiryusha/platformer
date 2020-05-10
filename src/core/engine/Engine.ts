// The class is responsible for the fixed time loop engine
// https://gameprogrammingpatterns.com/game-loop.html
// https://github.com/pothonprogramming/pothonprogramming.github.io/blob/master/content/rabbit-trap/01/engine-01.js

export default class {
  render: any;
  update: any;
  animationFrame: any;
  handleRun: any;
  timeStep: number;
  accumulatedTime: number;
  previousTime: number;
  isUpdated: boolean;

  constructor(
    timeStep: number,
    render: any,
    update: any,
  ) {
    this.update = update;
    this.render = render;
    this.animationFrame = () => {};
    this.handleRun = () => {};
    this.timeStep = timeStep;
    this.previousTime = 0;
    this.accumulatedTime = 0;
    this.isUpdated = false;
  }

  run(timestamp: number): void {
    this.accumulatedTime += timestamp - this.previousTime;
    this.previousTime = timestamp;

    if (this.accumulatedTime >=  this.timeStep * 3) {
      this.accumulatedTime = this.timeStep;
    }

    while (this.accumulatedTime >= this.timeStep) {
      this.accumulatedTime -= this.timeStep;
      this.update(this.timeStep);
      this.isUpdated = true;
    }

    if (this.isUpdated) {
      this.isUpdated = false;
      this.render();
    }

    this.animationFrame = window.requestAnimationFrame(this.handleRun);
  }

  start(): void {
    this.accumulatedTime = this.timeStep;
    this.previousTime = window.performance.now();
    window.requestAnimationFrame(this.handleRun = this.run.bind(this));
  }

  stop(): void {
    window.cancelAnimationFrame(this.animationFrame);
  }
}
