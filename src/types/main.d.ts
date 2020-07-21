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
