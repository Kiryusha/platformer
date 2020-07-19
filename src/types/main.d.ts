declare module '*.png'{
   const value: any;
   export = value;
}

interface zones {
  [key: string]: {
    config: GameMap
    tileset: string
    backgrounds: {}
    images: {
      spriteSheet?: string
      spriteMap?: SpriteMap
    }
  }
}
