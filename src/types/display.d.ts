interface Tileset {
  firstgid: number
  tiles: any[]
  name: string
  columns: number
  tilewidth: number
}

interface FontMap {
  [key: string]: {
    x: number;
    y: number;
    w: number;
    h: number;
    m: number;
  }
}

interface Backgrounds {
  [key: string]: HTMLImageElement
}
