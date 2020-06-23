// The class is responsible for keeping and processing the game state
import World from './World';
import Character from './Character';
import spriteMap from '../../assets/sprite-maps/sprites.json';
import playerStats from '../../assets/configs/player.json';

export default class {
  world: World;
  zones: zones;
  player: Character;

  constructor(zones: zones, startingZone: keyof zones) {
    this.zones = zones;
    this.player = this.createPlayer();
    this.loadZone(startingZone);
  }

  private createPlayer(): Character {
    return new Character(playerStats, spriteMap);
  }

  public loadZone(zone: keyof zones): void {
    this.world = new World(this.zones[zone].config, this.player);
    this.world.activeZone = zone;
  }

  public update(): void {
    this.world.update();
  }
}
