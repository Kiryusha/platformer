// Publisher-subscriber relationship implementation
export default class Bus implements Bus {
  // Constants for various events
  // Only movement adjusting is stopped
  public readonly FREEZE_CHARACTERS = 'character.freeze';
  public readonly UNFREEZE_CHARACTERS = 'character.unfreeze';
  // Call popup
  public readonly SHOW_POPUP = 'popup.callPopup';
  public readonly HIDE_POPUP = 'popup.startHiding';
  // Disable player controls
  public readonly DISABLE_CONTROLS = 'app.disableControls';
  public readonly ENABLE_CONTROLS = 'app.enableControls';
  // Event is triggered on entering doors
  public readonly LOAD_ZONE = 'app.loadZone';
  // Load the whole game
  public readonly APP_RESTART = 'app.restart';
  // pause game
  public readonly APP_PAUSE = 'app.pause';
  public readonly APP_RESUME = 'app.resume';
  // show zone title
  public readonly SHOW_ZONE_TITLE = 'zoneTitle.show';
  // teleport player to someplace on the zone
  public readonly TELEPORT_PLAYER = 'world.teleport';
  // smooth camera transition on different events
  public readonly TRANSITION_CAMERA = 'camera.makeTransition';

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

  public async publish(event: string, arg?: any): Promise<void> {
    if (!this.subscriptions[event]) return;

    const ids: string[] = Object.keys(this.subscriptions[event]);

    for (const id of ids) {
      await this.subscriptions[event][id](arg);
    }
  }

  private getId(): string {
    this.lastId += 1;

    return `${this.lastId}`;
  }
}
