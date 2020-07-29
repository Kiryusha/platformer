import AssetsManager from '../display/AssetsManager';
import zoneA0 from '../../assets/levels/zoneA0.json';
import zoneA1 from '../../assets/levels/zoneA1.json';
import zoneB0 from '../../assets/levels/zoneB0.json';
import zoneB1 from '../../assets/levels/zoneB1.json';
import zoneB2 from '../../assets/levels/zoneB2.json';
import zoneB3 from '../../assets/levels/zoneB3.json';
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

export default class Library implements Library {
  public cloudsBack: AssetsManager;
  public cloudsFront: AssetsManager;
  public bgBack: AssetsManager;
  public bgFront: AssetsManager;
  public defaultTileSet: AssetsManager;
  public sunnyLandTileSet: AssetsManager;
  public defaultImages: AssetsManager;
  public defaultImagesMap: SpriteMap;
  public spriteSheet: AssetsManager;
  public popup: AssetsManager;
  public font: AssetsManager;

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

  public async initAssets(): Promise<void> {
    this.cloudsBack.loadAsset(cloudsBack);
    this.cloudsFront.loadAsset(cloudsFront);
    this.bgBack.loadAsset(bgBack);
    this.bgFront.loadAsset(bgFront);
    this.defaultTileSet.loadAsset(defaultTileSet);
    this.sunnyLandTileSet.loadAsset(sunnyLandTileSet);
    this.defaultImages.loadAsset(defaultImages);
    this.spriteSheet.loadAsset(spriteSheet, true);
    this.popup.loadAsset(popup);
    this.font.loadAsset(font);
  }

  public get zones(): Zones {
    return {
      'zoneA0': {
        config: zoneA0,
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
        config: zoneA1,
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
        config: zoneB0,
        tileset: this.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
      'zoneB1': {
        config: zoneB1,
        tileset: this.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
      'zoneB2': {
        config: zoneB2,
        tileset: this.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
      'zoneB3': {
        config: zoneB3,
        tileset: this.sunnyLandTileSet,
        backgrounds: [],
        images: {},
      },
    };
  }
}
