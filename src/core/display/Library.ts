import AssetsManager from '../display/AssetsManager';
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
import { promiseAllProgress, get } from '../../util';

export default class Library implements Library {
  public font: AssetsManager;
  public spriteSheet: AssetsManager;
  public popup: AssetsManager;
  private cloudsBack: AssetsManager;
  private cloudsFront: AssetsManager;
  private bgBack: AssetsManager;
  private bgFront: AssetsManager;
  private defaultTileSet: AssetsManager;
  private sunnyLandTileSet: AssetsManager;
  private defaultImages: AssetsManager;
  private defaultImagesMap: SpriteMap;
  private zoneA0: GameMap;
  private zoneA1: GameMap;
  private zoneB0: GameMap;
  private zoneB1: GameMap;
  private zoneB2: GameMap;
  private zoneB3: GameMap;
  public loadingProgress: number = 0;

  constructor(buffer: WebGLRenderingContext) {
    this.cloudsBack = new AssetsManager(buffer);
    this.cloudsFront = new AssetsManager(buffer);
    this.bgBack = new AssetsManager(buffer);
    this.bgFront = new AssetsManager(buffer);
    this.defaultTileSet = new AssetsManager(buffer);
    this.sunnyLandTileSet = new AssetsManager(buffer);
    this.defaultImages = new AssetsManager(buffer);
    this.spriteSheet = new AssetsManager(buffer);
    this.popup = new AssetsManager(buffer);
    this.font = new AssetsManager(buffer);
    this.defaultImagesMap = defaultImagesMap;
  }

  public async initAssets(): Promise<void[]> {
    const promises: Promise<void>[] = [
      this.cloudsBack.loadAsset(cloudsBack),
      this.cloudsFront.loadAsset(cloudsFront),
      this.bgBack.loadAsset(bgBack),
      this.bgFront.loadAsset(bgFront),
      this.defaultTileSet.loadAsset(defaultTileSet),
      this.sunnyLandTileSet.loadAsset(sunnyLandTileSet),
      this.defaultImages.loadAsset(defaultImages),
      this.spriteSheet.loadAsset(spriteSheet, true),
      this.popup.loadAsset(popup),
      this.font.loadAsset(font),
      get(`${ASSETS_URL}/levels/zoneA0.json`).then(r => this.zoneA0 = r),
      get(`${ASSETS_URL}/levels/zoneA1.json`).then(r => this.zoneA1 = r),
      get(`${ASSETS_URL}/levels/zoneB0.json`).then(r => this.zoneB0 = r),
      get(`${ASSETS_URL}/levels/zoneB1.json`).then(r => this.zoneB1 = r),
      get(`${ASSETS_URL}/levels/zoneB2.json`).then(r => this.zoneB2 = r),
      get(`${ASSETS_URL}/levels/zoneB3.json`).then(r => this.zoneB3 = r),
    ];

    return promiseAllProgress(promises, progress => {
      this.loadingProgress = progress;
    });
  }

  public get zones(): Zones {
    return {
      'zoneA0': {
        config: this.zoneA0,
        tileset: this.defaultTileSet,
        backgrounds: [
          this.cloudsBack,
          this.cloudsFront,
          this.bgBack,
          this.bgFront,
        ],
        images: {
          spriteSheet: this.defaultImages,
          spriteMap: this.defaultImagesMap,
        }
      },
      'zoneA1': {
        config: this.zoneA1,
        tileset: this.defaultTileSet,
        backgrounds: [
          this.cloudsBack,
          this.cloudsFront,
        ],
        images: {
          spriteSheet: this.defaultImages,
          spriteMap: this.defaultImagesMap,
        }
      },
      'zoneB0': {
        config: this.zoneB0,
        tileset: this.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
      'zoneB1': {
        config: this.zoneB1,
        tileset: this.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
      'zoneB2': {
        config: this.zoneB2,
        tileset: this.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
      'zoneB3': {
        config: this.zoneB3,
        tileset: this.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
    };
  }
}
