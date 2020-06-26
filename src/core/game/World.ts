// The class is responsible for keeping and processing the game world
import Entity from './Entity';
import Character from './Character';
import Collider from './Collider';
import Brain from './Brain';
// Characters
import spriteMap from '../../assets/sprite-maps/sprites.json';
import slugStats from '../../assets/configs/slug.json';

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
  player: Player;

  constructor (
    map: GameMap,
    player: Player,
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
                result[layer.name] = layer.objects.map((object: MapObject) => new Entity({
                  x: object.x,
                  y: object.y,
                  width: object.width,
                  height: object.height,
                  group: 'doors',
                  type: object.type,
                  name: 'door',
                  properties: object.properties.reduce((obj, prop) => {
                    obj[prop.name] = prop.value;
                    return obj;
                  }, {}),
                }));
                break;
              case 'collisions':
                result[layer.name] = layer.objects.map((object: MapObject) => new Entity({
                  x: object.x,
                  y: object.y,
                  width: object.width,
                  height: object.height,
                  group: 'collisions',
                  type: object.type,
                  name: 'block',
                }));
                break;
              case 'characters':
                result[layer.name] = layer.objects.map((object: MapObject) => {
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
                          slugStats.entity.x = object.x;
                          slugStats.entity.y = object.y;
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
    if (this.rawLayers['middle-background']) {
      this.middleBackgroundMap = [...this.rawLayers['middle-background']];
    }
    this.middleMap = [...this.rawLayers.middle];
    if (this.rawLayers['middle-front']) {
      this.middleFrontMap = [...this.rawLayers['middle-front']];
    }
    this.frontMap = [...this.rawLayers.front];
    this.collisions = [...this.rawLayers.collisions];
    this.characters = [...this.rawLayers.characters];
    this.doors = [...this.rawLayers.doors];
    this.collisionDebugMap = [];
  }

  processBoundariesCollision (object: Character): void {
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

  update (): void {
    // TODO: Fix condition, as last frame of jumping is taken for falling
    this.characters.forEach(character => {
      if (character.isDead) {
        return;
      }
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
