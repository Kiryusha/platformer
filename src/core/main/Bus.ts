// Publisher-subscriber relationship implementation
export default class Bus implements Bus {
  // Constants for various events
  // Only movement adjusting is stopped
  public readonly FREEZE_CHARACTERS: string = 'character.freeze';
  public readonly UNFREEZE_CHARACTERS: string = 'character.unfreeze';
  // Call popup
  public readonly SHOW_POPUP: string = 'display.showPopup';
  public readonly HIDE_POPUP: string = 'display.hidePopup';
  // Disable player controls
  public readonly DISABLE_CONTROLS: string = 'app.disableControls';
  public readonly ENABLE_CONTROLS: string = 'app.enableControls';

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

  public publish(event: string, arg?: any): void {
    if (!this.subscriptions[event]) return;

    Object.keys(this.subscriptions[event]).forEach(id => this.subscriptions[event][id](arg));
  }

  private getId(): string {
    this.lastId += 1;

    return `${this.lastId}`;
  }
}
