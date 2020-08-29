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
import landOgg from '../../assets/sounds/land.ogg';
import hitOgg from '../../assets/sounds/hit.ogg';
import carrotOgg from '../../assets/sounds/carrot.ogg';
import starOgg from '../../assets/sounds/star.ogg';
import hurtOgg from '../../assets/sounds/hurt.ogg';
import confiantMp3 from '../../assets/sounds/confiant.mp3';
import soliditeNaturelleMp3 from '../../assets/sounds/soliditeNaturelle.mp3';
import { promiseAllProgress, get } from '../../util';

export default class Library implements Library {
  public loadingProgress: number = 0;
  public contextWebGL: WebGLRenderingContext;
  public context2D: CanvasRenderingContext2D;
  public contextAudio: AudioContext;
  public images: ImagesCollection = {};
  public sounds: SoundsCollection = {};
  public gameMaps: GameMapsCollection = {};
  private defaultImagesMap: SpriteMap;

  constructor(canvas: HTMLCanvasElement) {
    this.context2D = canvas.getContext('2d');
    this.contextWebGL = document.createElement('canvas').getContext('webgl');
    this.contextAudio = new AudioContext();

    this.images = {
      cloudsBack: new ImageManager(this.contextWebGL),
      cloudsFront: new ImageManager(this.contextWebGL),
      bgBack: new ImageManager(this.contextWebGL),
      bgFront: new ImageManager(this.contextWebGL),
      defaultTileSet: new ImageManager(this.contextWebGL),
      sunnyLandTileSet: new ImageManager(this.contextWebGL),
      defaultImages: new ImageManager(this.contextWebGL),
      spriteSheet: new ImageManager(this.contextWebGL),
      popup: new ImageManager(this.contextWebGL),
      font: new ImageManager(this.contextWebGL),
    };

    this.sounds = {
      jump: new AudioManager(this.contextAudio, 0.1),
      land: new AudioManager(this.contextAudio, 0.1),
      hit: new AudioManager(this.contextAudio, 0.3),
      carrot: new AudioManager(this.contextAudio, 0.5),
      star: new AudioManager(this.contextAudio, 0.3),
      hurt: new AudioManager(this.contextAudio, 0.3),
      confiant: new AudioManager(this.contextAudio, 1),
      soliditeNaturelle: new AudioManager(this.contextAudio, 1),
    };

    this.defaultImagesMap = defaultImagesMap;
  }

  public async initAssets(): Promise<void[]> {
    const promises: Promise<void>[] = [
      this.images.font.loadAsset(font),
      this.images.cloudsBack.loadAsset(cloudsBack),
      this.images.cloudsFront.loadAsset(cloudsFront),
      this.images.bgBack.loadAsset(bgBack),
      this.images.bgFront.loadAsset(bgFront),
      this.images.defaultTileSet.loadAsset(defaultTileSet),
      this.images.sunnyLandTileSet.loadAsset(sunnyLandTileSet),
      this.images.defaultImages.loadAsset(defaultImages),
      this.images.spriteSheet.loadAsset(spriteSheet, true),
      this.images.popup.loadAsset(popup),
      get(`${ASSETS_URL}/levels/zoneA0.json`).then(r => this.gameMaps.zoneA0 = r),
      get(`${ASSETS_URL}/levels/zoneA1.json`).then(r => this.gameMaps.zoneA1 = r),
      get(`${ASSETS_URL}/levels/zoneA2.json`).then(r => this.gameMaps.zoneA2 = r),
      get(`${ASSETS_URL}/levels/zoneB0.json`).then(r => this.gameMaps.zoneB0 = r),
      get(`${ASSETS_URL}/levels/zoneB1.json`).then(r => this.gameMaps.zoneB1 = r),
      get(`${ASSETS_URL}/levels/zoneB2.json`).then(r => this.gameMaps.zoneB2 = r),
      get(`${ASSETS_URL}/levels/zoneB3.json`).then(r => this.gameMaps.zoneB3 = r),
      this.sounds.jump.loadAsset(jumpOgg),
      this.sounds.hit.loadAsset(hitOgg),
      this.sounds.carrot.loadAsset(carrotOgg),
      this.sounds.star.loadAsset(starOgg),
      this.sounds.hurt.loadAsset(hurtOgg),
      this.sounds.land.loadAsset(landOgg),
      this.sounds.confiant.loadAsset(confiantMp3),
      this.sounds.soliditeNaturelle.loadAsset(soliditeNaturelleMp3),
    ];

    return promiseAllProgress(promises, progress => {
      this.loadingProgress = progress;
    });
  }

  public get zones(): Zones {
    return {
      'zoneA0': {
        title: 'GrassHills',
        group: 'zoneA',
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
        },
        audio: {
          bgm: this.sounds.confiant,
        },
      },
      'zoneA1': {
        title: 'GrassHills',
        group: 'zoneA',
        config: this.gameMaps.zoneA1,
        tileset: this.images.defaultTileSet,
        backgrounds: [
          this.images.cloudsBack,
          this.images.cloudsFront,
        ],
        images: {
          spriteSheet: this.images.defaultImages,
          spriteMap: this.defaultImagesMap,
        },
        audio: {
          bgm: this.sounds.confiant,
        },
      },
      'zoneA2': {
        title: 'GrassHills',
        group: 'zoneA',
        config: this.gameMaps.zoneA2,
        tileset: this.images.defaultTileSet,
        backgrounds: [
          this.images.cloudsBack,
          this.images.cloudsFront,
        ],
        images: {
          spriteSheet: this.images.defaultImages,
          spriteMap: this.defaultImagesMap,
        },
        audio: {
          bgm: this.sounds.confiant,
        },
      },
      'zoneB0': {
        title: 'Caverns',
        group: 'zoneB',
        config: this.gameMaps.zoneB0,
        tileset: this.images.sunnyLandTileSet,
        backgrounds: [],
        images: {},
        audio: {
          bgm: this.sounds.soliditeNaturelle,
        },
      },
      'zoneB1': {
        title: 'Caverns',
        group: 'zoneB',
        config: this.gameMaps.zoneB1,
        tileset: this.images.sunnyLandTileSet,
        backgrounds: [],
        images: {},
        audio: {
          bgm: this.sounds.soliditeNaturelle,
        },
      },
      'zoneB2': {
        title: 'Caverns',
        group: 'zoneB',
        config: this.gameMaps.zoneB2,
        tileset: this.images.sunnyLandTileSet,
        backgrounds: [],
        images: {},
        audio: {
          bgm: this.sounds.soliditeNaturelle,
        },
      },
      'zoneB3': {
        title: 'Caverns',
        group: 'zoneB',
        config: this.gameMaps.zoneB3,
        tileset: this.images.sunnyLandTileSet,
        backgrounds: [],
        images: {},
        audio: {
          bgm: this.sounds.soliditeNaturelle,
        },
      },
    };
  }
}
