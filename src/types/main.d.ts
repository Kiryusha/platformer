declare module '*.png'{
   const value: any;
   export = value;
}

interface Zones {
  [key: string]: {
    config: GameMap;
    tileset: string;
    backgrounds: {};
    images: {
      spriteSheet?: string;
      spriteMap?: SpriteMap;
    }
  }
}

interface Bus {
  SOFT_PAUSE: string;
  POPUP_CALL: string;
  subscribe(event: string, callback: Callback): string;
  unsubscribe(event: string, id: string): void;
  publish(event: string, arg: any): void;
}

interface Callback {
  (param: any): void;
}

interface Subscriptions {
  [key: string]: {
    [key: string]: Callback;
  };
}
