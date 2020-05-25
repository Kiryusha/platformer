// The class is responsible for keeping and processing the game state
import World from './World';

export default class {
  world: World;

  constructor(map: gameMap) {
    this.world = new World(map);
  }

  update(): void {
    this.world.update();
  }
}
