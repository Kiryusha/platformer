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

interface Callback {
  (param: any): void;
}

interface Subscriptions {
  [key: string]: {
    [key: string]: Callback;
  };
}
