// The class is responsible for keeping and processing the game world
import Entity from './Entity';
import Character from './Character';
import Collider from './Collider';
import Brain from './Brain';
// Characters
import spriteMap from '../../assets/sprite-maps/sprites.json';
import slugStats from '../../assets/stats/slug.json';

export default class {
  gravity: number;
  height: number;
  width: number;
  backgroundMap: number[];
  middleBackgroundMap: any[];
  middleFrontMap: any[];
  middleMap: number[];
  frontMap: number[];
  collisionDebugMap: (number | string)[];
  columns: number;
  rows: number;
  tileSize: number;
  collider: Collider;
  map: GameMap;
  rawLayers: any;
  collisions: Entity[];
  characters: Character[];
  brain: Brain;
  activeZone: keyof zones;
  doors: Entity[];
  player: Character;

  constructor (
    map: GameMap,
    player: Character,
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

    this.processMap(map);

    this.collider = new Collider();
  }

  processMap(map: GameMap) {
    this.rawLayers = map.layers.reduce((result, group) => {
      switch (group.name) {
        case 'tiles':
          group.layers.forEach((layer: GameLayer) => result[layer.name] = layer.data);
          break;
        case 'objects':
          group.layers.forEach((layer: GameLayer) => {
            switch (layer.name) {
              case 'doors':
                result[layer.name] = layer.objects.map((object: MapObject) => new Entity(
                  object.x,
                  object.y,
                  object.width,
                  object.height,
                  'doors',
                  object.type,
                  'door',
                  object.properties.reduce((obj, prop) => {
                    obj[prop.name] = prop.value;
                    return obj;
                  }, {}),
                ));
                break;
              case 'collisions':
                result[layer.name] = layer.objects.map((object: MapObject) => new Entity(
                  object.x,
                  object.y,
                  object.width,
                  object.height,
                  'collisions',
                  object.type,
                  'block',
                ));
                break;
              case 'characters':
                result[layer.name] = layer.objects.map((object: MapObject) => {
                  switch (object.type) {
                    case 'player':
                      if (!this.player.zoneToGo) {
                        this.player.x = object.x;
                        this.player.y = object.y;
                      }

                      return this.player;
                    case 'enemy':
                      switch (object.name) {
                        case 'slug':
                          slugStats.x = object.x;
                          slugStats.y = object.y;
                          const character = new Character(slugStats, spriteMap);
                          this.brain.bindCharacter(character);
                          return character;
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
    this.middleBackgroundMap = [...this.rawLayers['middle-background']];
    this.middleMap = [...this.rawLayers.middle];
    this.middleFrontMap = [...this.rawLayers['middle-front']];
    this.frontMap = [...this.rawLayers.front];
    this.collisions = [...this.rawLayers.collisions];
    this.characters = [...this.rawLayers.characters];
    this.doors = [...this.rawLayers.doors];
    this.collisionDebugMap = [];
  }

  processBoundariesCollision (object: Character): void {
    // collisions with the world boundaries
    // left
    if (object.x < 0) {
      object.x = 0;
      object.velocityX = 0;
    }

    // right
    if (object.x + object.width > this.width) {
      object.x = this.width - object.width;
      object.velocityX = 0;
    }

    // top
    if (object.y < 0) {
      object.y = 0;
      object.velocityY = 0;
    }

    // bottom
    if (object.y + object.height > this.height) {
      object.isJumping = false;
      object.y = this.height - object.height;
      object.velocityY = 0;
    }
  }

  update (): void {
    // TODO: Fix condition, as last frame of jumping is taken for falling
    this.characters.forEach(character => {
      character.update(this.gravity);
      this.processBoundariesCollision(character);
    });
    const collisions = this.collider.processBroadPhase([
      ...this.characters,
      ...this.collisions,
      ...this.doors,
    ]);
    this.collisionDebugMap = collisions;
    this.brain.update();
  }
}
