declare module '*.png'{
   const value: any;
   export = value;
}

interface gameMap {
  layers: {
    [index: number]: {
      data: any[]
    };
  }
}
