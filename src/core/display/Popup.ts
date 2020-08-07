// The class is for popup - dialog, which can be drawn by Display.
export default class Popup implements Popup {
  // Popup rendering stats
  public readonly width: number = 236;
  public readonly height: number = 66;
  public readonly xPadding: number = 15;
  public readonly yPadding: number = 13;
  public readonly offsetMax: number = 70;
  public readonly offsetStep: number = 5;
  public background: ImageManager;
  public offset: number = 70;
  public text: string | string[] = '';
  public fontSize: number = 1;
  // The resolving method of the current popup calling.
  public resolve: Callback;
  // Flags to avoid triggering bus events multiple times.
  public isResolved: boolean = false;
  public isWaiting: boolean = false;
  // This is the trigger for Display class to start showing/hiding animation.
  public isVisible: boolean = false;
  // The ID of the subscription created on the fly.
  private id: string;

  constructor(private bus: Bus) {
    this.subscribeToEvents();
  }

  public startWaiting() {
    this.bus.publish(this.bus.ENABLE_CONTROLS);
  }

  private subscribeToEvents() {
    this.bus.subscribe(this.bus.SHOW_POPUP, this.callPopup.bind(this));
  }

  // This is the SHOW_POPUP event handler method. It returns Promise. During its execution, it
  // subscribes to the HIDE_POPUP event, in the handler of which it passes the resolve method.
  private callPopup(payload: PopupPayload | string) {
    return new Promise(resolve => {
      this.isResolved = false;
      this.isWaiting = false;
      this.bus.publish(this.bus.DISABLE_CONTROLS);
      this.bus.publish(this.bus.FREEZE_CHARACTERS);
      this.isVisible = true;

      if (typeof payload === 'object') {
        this.text = payload.text;

        if (payload.fontSize) {
          this.fontSize = payload.fontSize;
        } else {
          this.fontSize = 1;
        }
      } else {
        this.text = payload;
        this.fontSize = 1;
      }

      this.id = this.bus.subscribe(this.bus.HIDE_POPUP, () => this.startHiding(resolve));
    });
  }

  // This is the HIDE_POPUP event handler method. During its execution, it writes to the
  // "this.resolve" the resolve method of the promise.
  private startHiding(resolve: Callback): void {
    this.bus.publish(this.bus.DISABLE_CONTROLS);
    this.bus.unsubscribe(this.bus.HIDE_POPUP, this.id);
    this.isVisible = false;
    // This method will be called, when the hiding animation is over.
    this.resolve = () => {
      this.bus.publish(this.bus.UNFREEZE_CHARACTERS);
      this.bus.publish(this.bus.ENABLE_CONTROLS);
      resolve();
    };
  }
}
