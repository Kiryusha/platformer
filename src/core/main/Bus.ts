// Publisher-subscriber relationship implementation
export default class Bus {
  // Constants for various events
  // Pause when only movement adjusting is stopped
  public static readonly SOFT_PAUSE: string = 'app.isPaused'
  // Event to call popup
  public static readonly POPUP_CALL: string = 'app.showPopup'

  private subscriptions: Subscriptions = {};
  private lastId: number = 0;

  public subscribe(event: string, callback: Callback): string {
    const id = this.getId();

    if (!this.subscriptions[event]) this.subscriptions[event] = {};

    this.subscriptions[event][id] = callback;

    return id;
  }

  public unsubscribe(event: string, id: string): void {
    delete this.subscriptions[event][id];
  }

  public publish(event: string, arg: any): void {
    if (!this.subscriptions[event]) return;

    Object.keys(this.subscriptions[event]).forEach(id => this.subscriptions[event][id](arg))
  }

  private getId(): string {
    this.lastId += 1;

    return `${this.lastId}`;
  }
}
