interface Tileset {
  firstgid: number
  tiles: any[]
  name: string
  columns: number
  tilewidth: number
}

interface backgrounds {
  [key: string]: HTMLImageElement
}
