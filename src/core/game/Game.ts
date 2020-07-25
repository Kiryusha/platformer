// The class is responsible for keeping and processing the game state
import World from './World';
import Player from './Player';
import spriteMap from '../../assets/sprite-maps/sprites.json';
import playerConfig from '../../assets/configs/player.json';

export default class {
  public objects: ZoneObjectsCollections = {};
  public player: Player;
  public spriteMap: SpriteMap;
  public world: World;
  // TODO: some way to get this amount
  private maximumStars: number = 14;
  private zones: Zones;

  constructor(private bus: Bus, zones: Zones, startingZone: keyof Zones) {
    this.spriteMap = spriteMap;
    this.zones = zones;
    this.player = this.createPlayer();
    this.loadZone(startingZone);
  }

  private createPlayer(): Player {
    return new Player(this.bus, playerConfig, this.spriteMap, this.maximumStars);
  }

  public loadZone(zone: keyof Zones | keyof ZoneObjectsCollections): void {
    this.objects[zone] = this.objects[zone] || <ZoneObjectsCollection>{};
    this.world = new World(
      this.bus,
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
