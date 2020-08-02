import ImageManager from './ImageManager';
import AudioManager from './AudioManager';
import cloudsBack from '../../assets/images/default/background/clouds-back.png';
import cloudsFront from '../../assets/images/default/background/clouds-front.png';
import bgBack from '../../assets/images/default/background/bg-back.png';
import bgFront from '../../assets/images/default/background/bg-front.png';
import defaultTileSet from '../../assets/images/default/default-tileset.png';
import sunnyLandTileSet from '../../assets/images/sunny-land/sunny-land-tileset.png';
import defaultImages from '../../assets/images/default/images.png';
import defaultImagesMap from '../../assets/sprite-maps/default/images.json';
import spriteSheet from '../../assets/images/sprites.png';
import popup from '../../assets/images/popup.png';
import font from '../../assets/images/font.png';
import jumpOgg from '../../assets/sounds/jump.ogg';
import { promiseAllProgress, get } from '../../util';

export default class Library implements Library {
  public loadingProgress: number = 0;
  public buffer: WebGLRenderingContext;
  public context: CanvasRenderingContext2D;
  public images: ImagesCollection = {};
  public sounds: SoundsCollection = {};
  public gameMaps: GameMapsCollection = {};
  private defaultImagesMap: SpriteMap;

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d');
    this.buffer = document.createElement('canvas').getContext('webgl');

    this.images = {
      cloudsBack: new ImageManager(this.buffer),
      cloudsFront: new ImageManager(this.buffer),
      bgBack: new ImageManager(this.buffer),
      bgFront: new ImageManager(this.buffer),
      defaultTileSet: new ImageManager(this.buffer),
      sunnyLandTileSet: new ImageManager(this.buffer),
      defaultImages: new ImageManager(this.buffer),
      spriteSheet: new ImageManager(this.buffer),
      popup: new ImageManager(this.buffer),
      font: new ImageManager(this.buffer),
    };

    this.sounds = {
      jump: new AudioManager(),
    };

    this.defaultImagesMap = defaultImagesMap;
  }

  public async initAssets(): Promise<void[]> {
    const promises: Promise<void>[] = [
      this.images.cloudsBack.loadAsset(cloudsBack),
      this.images.cloudsFront.loadAsset(cloudsFront),
      this.images.bgBack.loadAsset(bgBack),
      this.images.bgFront.loadAsset(bgFront),
      this.images.defaultTileSet.loadAsset(defaultTileSet),
      this.images.sunnyLandTileSet.loadAsset(sunnyLandTileSet),
      this.images.defaultImages.loadAsset(defaultImages),
      this.images.spriteSheet.loadAsset(spriteSheet, true),
      this.images.popup.loadAsset(popup),
      this.images.font.loadAsset(font),
      get(`${ASSETS_URL}/levels/zoneA0.json`).then(r => this.gameMaps.zoneA0 = r),
      get(`${ASSETS_URL}/levels/zoneA1.json`).then(r => this.gameMaps.zoneA1 = r),
      get(`${ASSETS_URL}/levels/zoneB0.json`).then(r => this.gameMaps.zoneB0 = r),
      get(`${ASSETS_URL}/levels/zoneB1.json`).then(r => this.gameMaps.zoneB1 = r),
      get(`${ASSETS_URL}/levels/zoneB2.json`).then(r => this.gameMaps.zoneB2 = r),
      get(`${ASSETS_URL}/levels/zoneB3.json`).then(r => this.gameMaps.zoneB3 = r),
      this.sounds.jump.loadAsset(jumpOgg),
    ];

    return promiseAllProgress(promises, progress => {
      this.loadingProgress = progress;
    });
  }

  public get zones(): Zones {
    return {
      'zoneA0': {
        config: this.gameMaps.zoneA0,
        tileset: this.images.defaultTileSet,
        backgrounds: [
          this.images.cloudsBack,
          this.images.cloudsFront,
          this.images.bgBack,
          this.images.bgFront,
        ],
        images: {
          spriteSheet: this.images.defaultImages,
          spriteMap: this.defaultImagesMap,
        }
      },
      'zoneA1': {
        config: this.gameMaps.zoneA1,
        tileset: this.images.defaultTileSet,
        backgrounds: [
          this.images.cloudsBack,
          this.images.cloudsFront,
        ],
        images: {
          spriteSheet: this.images.defaultImages,
          spriteMap: this.defaultImagesMap,
        }
      },
      'zoneB0': {
        config: this.gameMaps.zoneB0,
        tileset: this.images.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
      'zoneB1': {
        config: this.gameMaps.zoneB1,
        tileset: this.images.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
      'zoneB2': {
        config: this.gameMaps.zoneB2,
        tileset: this.images.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
      'zoneB3': {
        config: this.gameMaps.zoneB3,
        tileset: this.images.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
    };
  }
}
