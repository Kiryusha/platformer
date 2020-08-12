// The class is for zone group titles.
export default class Title {
  public readonly titleVisibilityStep: number = 0.2;
  public readonly titleVisibilityMax: number = 1;
  public titleVisibility: number = 0;
  public isVisible: boolean = false;
  public text: string;

  constructor(private bus: Bus) {
    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    this.bus.subscribe(this.bus.SHOW_ZONE_TITLE, this.show.bind(this));
  }

  private show(text: string) {
    this.text = text;
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 3000);
  }
}
