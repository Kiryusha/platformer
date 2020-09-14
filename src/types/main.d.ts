declare module '*.png'{
   const value: any;
   export = value;
}

interface Bus {
  FREEZE_CHARACTERS: 'character.freeze';
  UNFREEZE_CHARACTERS: 'character.unfreeze';
  SHOW_POPUP: 'popup.callPopup';
  HIDE_POPUP: 'popup.startHiding';
  DISABLE_CONTROLS: 'app.disableControls';
  ENABLE_CONTROLS: 'app.enableControls';
  LOAD_ZONE: 'app.loadZone';
  APP_RESTART: 'app.restart';
  APP_PAUSE: 'app.pause';
  APP_RESUME: 'app.resume';
  SHOW_ZONE_TITLE: 'zoneTitle.show';
  TELEPORT_PLAYER: 'world.teleport';
  TRANSITION_CAMERA: 'camera.makeTransition';
  subscribe(event: string, callback: Callback): string;
  unsubscribe(event: string, id: string): void;
  publish(event: string, arg?: any): void;
}

interface Callback {
  (param?: any): void;
}

interface Subscriptions {
  [key: string]: {
    [key: string]: Callback;
  };
}

interface ZonePayload {
  name: string;
  x: number;
  y: number;
}
