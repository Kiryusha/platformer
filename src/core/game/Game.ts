// The class is responsible for keeping and processing the game state
import World from './World';

export default class {
  world: World;

  constructor(
    map: gameMap,
    playerSpriteMap: spriteMap,
  ) {
    this.world = new World(map, playerSpriteMap);
  }

  update(): void {
    this.world.update();
  }
}
