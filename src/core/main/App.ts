// The class responsible for working with all major classes of the game.
import Controller from '../controller/Controller';
import Display from '../display/Display';
import Game from '../game/Game';
import Engine from '../engine/Engine';
import AssetsManager from '../display/AssetsManager';
import spriteSheet from '../../assets/images/sprites.png';
import popup from '../../assets/images/popup.png';
import font from '../../assets/images/font.png';
import zones from './zones';

declare global {
  interface Window {
    SHOW_COLLISIONS: boolean;
  }
}

export default class {
  aspectRatio: number = 9 / 16;
  fps: number = 1000 / 30;
  zones: Zones = zones;
  startingZone: string = 'zoneA1';
  controller: Controller;
  game: Game;
  display: Display;
  engine: Engine;
  isPopupVisible: boolean = false;
  popupText: string = '';

  constructor() {
    this.init();
  }

  public async init(): Promise<any> {
    this.controller = new Controller();
    this.game = new Game(this.zones, this.startingZone);
    this.display = new Display(
      document.getElementById('game') as HTMLCanvasElement,
      256,
      144,
    );
    this.engine = new Engine(this.fps, this.render.bind(this), this.update.bind(this));

    // Synchronize display buffer size with the world size
    this.display.buffer.canvas.height = this.game.world.height;
    this.display.buffer.canvas.width = this.game.world.width;

    window.addEventListener('keydown', this.handleKeyEvent.bind(this));
    window.addEventListener('keyup', this.handleKeyEvent.bind(this));
    window.addEventListener('resize', this.resize.bind(this));

    await Promise.all([
      // characters sprites are always the same
      this.display.spriteSheet.loadAsset(spriteSheet, true),
      this.display.popup.loadAsset(popup, true),
      this.display.font.loadAsset(font, true),

      // initial asset setup
      this.updateZoneAssets(),
    ]);

    this.resize();
    this.engine.start();

    this.showPopup('Find some stars! Eat lots of carrots! Find some stars!|Eat lots of carrots! Eat lots of carrots! Eat lots of|carrots! Eat lots of carrots! Eat lots of carrots! Eat|lots of carrots! Eat lots of carrots!');
  }

  private showPopup(text: string): void {
    this.isPopupVisible = true;
    this.popupText = text;
  }

  private hidePopup(): void {
    this.isPopupVisible = false;
    this.popupText = '';
  }

  private handleKeyEvent(event: { type: string; keyCode: number; }): void {
    this.controller.handleKeyEvent(event.type, event.keyCode);
    this.hidePopup();
  }

  private adjustMovingControls(): void {
    if (this.controller.left.isActive) {
      this.game.player.startMovingLeft();
    } else if (this.game.player.isMovingLeft) {
      this.game.player.stopMovingLeft();
    }

    if (this.controller.right.isActive) {
      this.game.player.startMovingRight();
    } else if (this.game.player.isMovingRight) {
      this.game.player.stopMovingRight();
    }

    if (this.controller.jump.isActive && !this.controller.jump.isHold) {
      this.game.player.startJumping();
    } else if (this.game.player.isJumpTriggered) {
      this.game.player.stopJumping();
    }

    if (this.controller.shift.isActive) {
      this.game.player.startSprinting();
    } else if (this.game.player.isSprinting) {
      this.game.player.stopSprinting();
    }

    if (this.controller.down.isActive) {
      this.game.player.startDucking();
    } else if (this.game.player.isDucking)  {
      this.game.player.stopDucking();
    }
  }

  private adjustClimbingControls(): void {
    if (
      !this.controller.up.isActive
      && !this.controller.right.isActive
      && !this.controller.down.isActive
      && !this.controller.left.isActive
    ) {
      this.game.player.stopClimbingAndMoving();
    }

    if (this.controller.left.isActive) {
      this.game.player.startClimbingAndMoving('left');
    }

    if (this.controller.right.isActive) {
      this.game.player.startClimbingAndMoving('right');
    }

    if (this.controller.down.isActive) {
      this.game.player.startClimbingAndMoving('down');
    }

    if (this.controller.up.isActive) {
      this.game.player.startClimbingAndMoving('up');
    }

    if (
      this.controller.jump.isActive
      && !this.controller.jump.isHold
      && !this.game.player.climbingDirection
    ) {
      this.game.player.startJumping();
    } else if (this.game.player.isJumpTriggered) {
      this.game.player.stopJumping();
    }
  }

  private resize(): void {
    this.display.resize(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
      this.aspectRatio,
    );
    this.display.render();
    this.display.camera.adjustCamera(
      this.game.player,
      this.game.world.width,
      this.game.world.height
    );
  }

  private render(): void {
    const imagesTilesData = this.zones[this.game.world.activeZone].config.tilesets
      .filter(tileset => tileset.name === 'images')[0];

    this.display.renderer.clear();

    this.display.drawBackgrounds();
    this.display.drawMap(
      this.game.world.backgroundMap,
      this.game.world.columns,
      imagesTilesData
    );
    if (this.game.world.middleBackgroundMap) {
      this.display.drawMap(
        this.game.world.middleBackgroundMap,
        this.game.world.columns,
        imagesTilesData
      );
    }
    this.display.drawMap(
      this.game.world.middleMap,
      this.game.world.columns,
      imagesTilesData
    );
    if (this.game.world.middleFrontMap) {
      this.display.drawMap(
        this.game.world.middleFrontMap,
        this.game.world.columns,
        imagesTilesData
      );
    }
    this.display.drawCharacters(this.game.objects[this.game.world.activeZone].characters);
    this.display.drawCollectables(this.game.objects[this.game.world.activeZone].collectables);
    this.display.drawMap(
      this.game.world.frontMap,
      this.game.world.columns,
      imagesTilesData
    );

    // Collisions debugging tool: to visualise collisions type window.SHOW_COLLISIONS = true
    // in browser console
    if (window.SHOW_COLLISIONS) {
      this.display.drawCollisionDebugMap(this.game.world.collisionDebugMap);
    }
    this.display.drawHud(this.game.player, this.game.spriteMap);
    if (this.isPopupVisible) {
      this.display.drawPopup(this.popupText);
    }
    this.display.render();
    this.display.camera.adjustCamera(
      this.game.player,
      this.game.world.width,
      this.game.world.height
    );
  }

  private async update(): Promise<any> {
    this.game.player.isJumpActive = this.controller.jump.isActive;
    this.game.player.isUpActive = this.controller.up.isActive;

    if (this.game.player.isClimbing) {
      this.adjustClimbingControls();
    } else {
      this.adjustMovingControls();
    }

    // The zone changes only if the player collided with the door and the collider recorded data
    // about the new zone in the corresponding property of the player's character.
    if (this.game.player.destination.name.length) {
      // We should stop the engine, as loading new assets may take some time
      this.engine.stop();
      // load new zone schemes
      this.game.loadZone(this.game.player.destination.name);
      // position the camera in advance to prevent one frame flicking since it has not yet had
      // time to position itself in the new zone
      this.display.camera.adjustCamera(
        this.game.player,
        this.game.world.width,
        this.game.world.height
      );
      this.game.player.destination.name = '';
      // update only assets that are not yet loaded by comparing urls
      await this.updateZoneAssets();
      // now we can start engine again
      this.engine.start();
    }

    this.game.update();
  }

  private async updateZoneAssets(): Promise<any> {
    const promises = [];
    const backgrounds: Backgrounds = this.zones[this.game.world.activeZone].backgrounds;

    // check if new backgrounds are among already processed backgrounds
    const areNewBackgroundsAmongOld = Object.keys(backgrounds).every(url =>
      this.display.backgrounds.some(asset => asset.url === url));

    // check if the same assets is used in new zone
    if (this.display.mapTileset.url !== this.zones[this.game.world.activeZone].tileset) {
      promises.push(
        this.display.mapTileset.loadAsset(
          this.zones[this.game.world.activeZone].tileset,
          false,
          this.zones[this.game.world.activeZone].config.tilesets[0].tilewidth,
          this.zones[this.game.world.activeZone].config.tilesets[0].columns,
        ),
      );
    }

    if (
      this.zones[this.game.world.activeZone].images.spriteSheet &&
      (this.display.images.url !== this.zones[this.game.world.activeZone].images)
    ) {
      promises.push(
        this.display.images.loadAsset(this.zones[this.game.world.activeZone].images.spriteSheet)
      );
    }

    if (!areNewBackgroundsAmongOld) {
      this.display.backgrounds = [];

      Object.keys(backgrounds).forEach(() => {
        this.display.backgrounds.push(new AssetsManager(this.display.buffer));
      });

      promises.push(
        ...Object.keys(backgrounds)
          .map((background: keyof Backgrounds, i) =>
            this.display.backgrounds[i]
              .loadAsset(backgrounds[background])),
      );
    }

    await Promise.all(promises);

    this.display.imagesMap = this.zones[this.game.world.activeZone].images.spriteMap;
    // By default, the size of the buffer canvas is equal to the size of the first zone, so we need
    // to update it when changing the zone, so its size may not be enough for the new zone
    this.display.adjustBufferCanvasSize(this.game.world.width, this.game.world.height);
  }
}
