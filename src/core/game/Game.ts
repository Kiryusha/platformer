// The class is responsible for keeping and processing the game state
import World from './World';
import Player from './Player';
import spriteMap from '../../assets/sprite-maps/sprites.json';
import playerConfig from '../../assets/configs/player.json';

export default class {
  world: World;
  zones: zones;
  spriteMap: SpriteMap;
  // permanent objects which do not recreate when zones change
  player: Player;
  objects: ZoneObjectsCollections = {};

  constructor(zones: zones, startingZone: keyof zones) {
    this.spriteMap = spriteMap;
    this.zones = zones;
    this.player = this.createPlayer();
    this.loadZone(startingZone);
  }

  private createPlayer(): Player {
    return new Player(playerConfig, this.spriteMap);
  }

  public loadZone(zone: keyof zones | keyof ZoneObjectsCollections): void {
    this.objects[zone] = this.objects[zone] || <ZoneObjectsCollection>{};
    this.world = new World(
      this.player,
      this.zones[zone].config,
      this.objects[zone],
    );
    this.world.activeZone = zone;
  }

  public update(): void {
    this.world.update();
  }
}
