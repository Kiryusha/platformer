declare module '*.png'{
   const value: any;
   export = value;
}

interface Bus {
  FREEZE_CHARACTERS: string;
  UNFREEZE_CHARACTERS: string;
  SHOW_POPUP: string;
  HIDE_POPUP: string;
  DISABLE_CONTROLS: string;
  ENABLE_CONTROLS: string;
  LOAD_ZONE: string;
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
