// The class is for popup - dialog, which can be drawn by Display
export default class Popup implements Popup {
  public background: AssetsManager;
  public offset: number = 70;
  public readonly offsetMax: number = 70;
  public readonly offsetStep: number = 5;
  public isVisible: boolean = false;
  public text: string = '';
  public fontSize: number = 1;

  constructor(private bus: Bus) {
    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    this.bus.subscribe(this.bus.SHOW_POPUP, this.showPopup.bind(this));
    this.bus.subscribe(this.bus.HIDE_POPUP, this.hidePopup.bind(this));
  }

  private showPopup(payload: PopupPayload | string): void {
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
  }

  private hidePopup(): void {
    this.isVisible = false;
  }
}
