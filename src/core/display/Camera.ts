// the class is responsible for all the work with the camera
export default class Camera implements Camera {
  public x: number = 0;
  public y: number = 0;
  public xOld: number = 0;
  public yOld: number = 0;
  public width: number;
  public height: number;
  private transitionTo: CameraPosition;
  private transitionFrom: CameraPosition;
  private transitionSteps: number;
  private transitionCounter: number;

  constructor(
    private bus: Bus,
    width: number,
    height: number,
  ) {
    this.width = width;
    this.height = height;
    this.subscribeToEvents();
  }

  private transitionCamera({ to, steps = 10, from }: CameraTransitionPayload): void {
    this.transitionCounter = steps;
    this.transitionTo = to;
    this.transitionSteps = steps;
    this.transitionFrom = from ? from : {
      x: this.x,
      y: this.y,
    };
  }

  private subscribeToEvents(): void {
    this.bus.subscribe(this.bus.TRANSITION_CAMERA, this.transitionCamera.bind(this));
  }

  public adjustCamera(
    aimRaw: CameraPosition | null,
    stageWidth: number,
    stageHeight: number,
  ): void {
    let aim;
    this.xOld = this.x;
    this.yOld = this.y;

    if (this.transitionCounter) {
      if (!aim) aim = this.transitionFrom;
      aim.x += (this.transitionTo.x - this.transitionFrom.x) / this.transitionSteps;
      aim.y += (this.transitionTo.y - this.transitionFrom.y) / this.transitionSteps;
      console.log(aim.x, this.transitionTo.x)
      
      this.transitionCounter -= 1;
    } else {
      aim = aimRaw;
    }

    let positionX = aim.x - (this.width / 2);
    let positionY = aim.y - (this.height / 2);

    if (positionX < 0) {
      positionX = 0;
    }

    if ((aim.x + (this.width / 2)) > stageWidth) {
      positionX = stageWidth - this.width;
    }

    if (positionY < 0) {
      positionY = 0;
    }

    if ((aim.y + (this.height / 2)) > stageHeight) {
      positionY = stageHeight - this.height;
    }

    this.x = Math.round(positionX);
    this.y = Math.round(positionY);
  }
}
