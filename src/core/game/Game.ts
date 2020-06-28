// The class is responsible for keeping and processing the game state
import World from './World';
import Player from './Player';
import spriteMap from '../../assets/sprite-maps/sprites.json';
import playerConfig from '../../assets/configs/player.json';

export default class {
  world: World;
  zones: zones;
  player: Player;
  spriteMap: SpriteMap;

  constructor(zones: zones, startingZone: keyof zones) {
    this.spriteMap = spriteMap;
    this.zones = zones;
    this.player = this.createPlayer();
    this.loadZone(startingZone);
  }

  private createPlayer(): Player {
    return new Player(playerConfig, this.spriteMap);
  }

  public loadZone(zone: keyof zones): void {
    this.world = new World(this.zones[zone].config, this.player);
    this.world.activeZone = zone;
  }

  public update(): void {
    this.world.update();
  }
}
