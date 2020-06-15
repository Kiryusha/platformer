// The class is responsible for keeping and processing the game state
import World from './World';

export default class {
  world: World;

  constructor(zones: zones, startingZone: string) {
    this.world = new World(zones[startingZone].config);
    this.world.activeZone = startingZone;
  }

  update(): void {
    this.world.update();
  }
}
