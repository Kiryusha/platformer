// The class is responsible for keeping and processing the game world
import Entity from './Entity';
import AnimatedEntity from './AnimatedEntity';
import Character from './Character';
import Collider from './Collider';
import Brain from './Brain';
// Characters
import spriteMap from '../../assets/sprite-maps/sprites.json';
import slugStats from '../../assets/configs/slug.json';
import carrotStats from '../../assets/configs/carrot.json';
import starStats from '../../assets/configs/star.json';

export default class {
  public height: number;
  public width: number;
  public backgroundMap: number[];
  public middleBackgroundMap: number[];
  public middleFrontMap: number[];
  public middleMap: number[];
  public frontMap: number[];
  public collisionDebugMap: Entity[][];
  public columns: number;
  public rows: number;
  public activeZone: keyof Zones;
  private gravity: number;
  private tileSize: number;
  private collider: Collider;
  private rawLayers: any;
  private doors: Entity[];
  private collisions: Entity[];
  private brain: Brain;
  private ropes: Entity[];

  constructor (
    private bus: Bus,
    private library: Library,
    public player: Player,
    private map: GameMap,
    private collection: ZoneObjectsCollection,
  ) {
    // Physics
    this.gravity = 10;

    // Appearance
    this.columns = map.width;
    this.rows = map.height;
    this.tileSize = map.tilewidth;
    this.width = this.columns * this.tileSize;
    this.height = this.rows * this.tileSize;

    this.player = player;

    this.brain = new Brain();

    this.processMap(this.map);

    this.collider = new Collider(bus, this.library);
  }

  public update(): void {
    // TODO: Fix condition, as last frame of jumping is taken for falling
    this.collection.characters.forEach((character: Character) => {
      if (character.isVanished) {
        return;
      }
      character.update(this.gravity);
      this.processBoundariesCollision(character);
    });
    this.collection.collectables.forEach((collectable: AnimatedEntity) => {
      if (collectable.isVanished) {
        return;
      }
      collectable.update();
    });
    const collisions = this.collider.processBroadPhase([
      ...this.collection.characters,
      ...this.collisions,
      ...this.doors,
      ...this.collection.collectables,
      ...this.ropes,
    ]);
    this.collisionDebugMap = <Entity[][]>collisions;
    this.brain.update();
  }

  private fillMapLayer(layer: GameLayer): Entity[] {
    return layer.objects.map((object: MapObject) => new Entity({
      x: object.x,
      y: object.y,
      width: object.width,
      height: object.height,
      group: layer.name,
      type: object.type,
      properties: !object.properties ? {} : object.properties.reduce((obj, prop) => {
        obj[prop.name] = prop.value;
        return obj;
      }, {}),
    }));
  }

  private processMap(map: GameMap) {
    this.collection.collectables = this.collection.collectables || [];
    this.collection.characters = this.collection.characters || [];

    this.rawLayers = map.layers.reduce((result, group) => {
      let id: string;
      let obj;

      switch (group.name) {
        case 'tiles':
          group.layers.forEach((layer: GameLayer) => result[layer.name] = layer.data);
          break;
        case 'objects':
          group.layers.forEach((layer: GameLayer) => {
            switch (layer.name) {
              case 'collisions':
              case 'doors':
              case 'ropes':
                result[layer.name] = this.fillMapLayer(layer);
                break;
              case 'collectables':
                result[layer.name] = layer.objects.map((object: MapObject, index) => {
                  switch (object.type) {
                    case 'carrot':
                      id = `carrot_${index}`;
                      obj = this.collection.collectables.filter(item => item.id === id)[0];
                      if (!obj) {
                        carrotStats.entity.id = id;
                        carrotStats.entity.x = object.x;
                        carrotStats.entity.y = object.y;
                        return new AnimatedEntity(carrotStats, spriteMap);
                      }
                      return obj;
                    case 'star':
                      id = `star_${index}`;
                      obj = this.collection.collectables.filter(item => item.id === id)[0];
                      if (!obj) {
                        starStats.entity.id = id;
                        starStats.entity.x = object.x;
                        starStats.entity.y = object.y;
                        return new AnimatedEntity(starStats, spriteMap);
                      }
                      return obj;
                  }
                });
                break;
              case 'characters':
                result[layer.name] = layer.objects.map((object: MapObject, index) => {
                  switch (object.type) {
                    case 'player':
                      if (this.player.destination.name.length) {
                        this.player.left = this.player.destination.x;
                        this.player.top = this.player.destination.y;
                      } else {
                        this.player.left = object.x;
                        this.player.top = object.y;
                      }

                      return this.player;
                    case 'enemy':
                      switch (object.name) {
                        case 'slug':
                          id = `slug_${index}`;
                          obj = this.collection.characters.filter(item => item.id === id)[0];
                          if (!obj) {
                            slugStats.entity.id = id;
                            slugStats.entity.x = object.x;
                            slugStats.entity.y = object.y;
                            slugStats.main.movingPattern.startingPoint = {
                              x: object.x,
                              y: object.y,
                            };
                            const character = new Character(this.bus, slugStats, spriteMap);
                            this.brain.bindCharacter(character);
                            return character;
                          }
                          obj.movingPattern.startingPoint = {
                            x: object.x,
                            y: object.y,
                          };
                          this.brain.bindCharacter(obj);
                          return obj;
                      }
                  }
                });
                break;
            }
          });
      }

      return result;
    }, {});

    this.backgroundMap = [...this.rawLayers.background];
    if (this.rawLayers['middle-background']) {
      this.middleBackgroundMap = [...this.rawLayers['middle-background']];
    }
    this.middleMap = [...this.rawLayers.middle];
    if (this.rawLayers['middle-front']) {
      this.middleFrontMap = [...this.rawLayers['middle-front']];
    }
    this.frontMap = [...this.rawLayers.front];
    this.collisions = [...this.rawLayers.collisions];
    this.collection.characters = [...this.rawLayers.characters];
    this.doors = [...this.rawLayers.doors];
    // That objects may not be in the zone.
    this.ropes = this.rawLayers.ropes ? [...this.rawLayers.ropes] : [];
    this.collection.collectables = this.rawLayers.collectables ?
      [...this.rawLayers.collectables] : [];
    this.collisionDebugMap = [];
  }

  // TODO: move this to the Collider
  private processBoundariesCollision(object: Character): void {
    if (object.isDeathTriggered) {
      return;
    }

    // collisions with the world boundaries
    // left
    if (object.left < 0) {
      object.left = 0;
      object.velocityX = 0;
    }

    // right
    if (object.left + object.width > this.width) {
      object.left = this.width - object.width;
      object.velocityX = 0;
    }

    // top
    if (object.top < 0) {
      object.top = 0;
      object.velocityY = 0;
    }

    // bottom
    if (object.top + object.height > this.height) {
      object.isJumping = false;
      object.top = this.height - object.height;
      object.velocityY = 0;
    }
  }
}
