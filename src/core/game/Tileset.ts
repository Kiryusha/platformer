// The class is responsible for processing spritesheets
import Frame from './Frame';

export default class {
  columns: number;
  tileSize: number;
  frames: Frame[];

  constructor(
    columns: number,
    tileSize: number,
  ) {
    this.columns = columns;
    this.tileSize = tileSize;

    this.frames = [
      new Frame(115, 96, 13, 16, 0, -2), // idle-left
      new Frame(50, 96, 13, 16, 0, -2), // jump-left
      new Frame(102, 96, 13, 16, 0, -2), new Frame(89, 96, 13, 16, 0, -2), new Frame(76, 96, 13, 16, 0, -2), new Frame(63, 96, 13, 16, 0, -2), // walk-left
      new Frame(0, 112, 13, 16, 0, -2), // idle-right
      new Frame(65, 112, 13, 16, 0, -2), // jump-right
      new Frame(13, 112, 13, 16, 0, -2), new Frame(26, 112, 13, 16, 0, -2), new Frame(39, 112, 13, 16, 0, -2), new Frame(52, 112, 13, 16, 0, -2) // walk-right
    ];
  }
}
