// The class is responsible for keeping and processing the game state
import World from './World';

export default class {
  world: World;

  constructor() {
    this.world = new World();
  }

  update(): void {
    this.world.update();
  }
}
