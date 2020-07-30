// The class responsible for working with all major classes of the game.
import Controller from '../controller/Controller';
import Display from '../display/Display';
import Game from '../game/Game';
import Engine from '../engine/Engine';
import Bus from '../main/Bus';

declare global {
  interface Window {
    SHOW_COLLISIONS: boolean;
  }
}

export default class {
  aspectRatio = 9 / 16;
  fps: number = 1000 / 30;
  startingZone: string = 'zoneA1';
  controller: Controller;
  game: Game;
  display: Display;
  engine: Engine;
  bus: Bus;
  areControlsDisabled: boolean = false;

  constructor() {
    this.init();
  }

  public restart(): void {
    this.game = new Game(this.bus, this.display.library.zones, this.startingZone);
    this.updateZoneAssets();
  }

  public async init(): Promise<any> {
    this.bus = new Bus();
    this.controller = new Controller();
    this.display = new Display(
      this.bus,
      document.getElementById('game') as HTMLCanvasElement,
      256,
      144,
    );
    this.game = new Game(this.bus, this.display.library.zones, this.startingZone);
    this.engine = new Engine(this.fps, this.render.bind(this), this.update.bind(this));

    // Synchronize display buffer size with the world size
    this.display.buffer.canvas.height = this.game.world.height;
    this.display.buffer.canvas.width = this.game.world.width;

    this.subscribeToEvents();

    await this.display.library.initAssets();

    this.updateZoneAssets();

    this.resize();
    this.engine.start();

    setTimeout(async () => {
      this.bus.publish(
        this.bus.SHOW_POPUP,
        'Welcome!|Movement: arrow buttons. Jump: Z. Sprint: Shift.|Find some stars! Eat lots of carrots!'
      );
    }, 300);
  }

  private subscribeToEvents(): void {
    window.addEventListener('keydown', this.handleKeyEvent.bind(this));
    window.addEventListener('keyup', this.handleKeyEvent.bind(this));
    window.addEventListener('resize', this.resize.bind(this));

    this.bus.subscribe(this.bus.DISABLE_CONTROLS, this.disableControls.bind(this));
    this.bus.subscribe(this.bus.ENABLE_CONTROLS, this.enableControls.bind(this));
    this.bus.subscribe(this.bus.LOAD_ZONE, this.loadZone.bind(this));
    this.bus.subscribe(this.bus.APP_RESTART, this.restart.bind(this));
  }

  private disableControls() {
    this.areControlsDisabled = true;
  }

  private enableControls() {
    this.areControlsDisabled = false;
  }

  private handleKeyEvent(event: { type: string; keyCode: number; }): void {
    this.controller.handleKeyEvent(event.type, event.keyCode);
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
    const imagesTilesData = this.display.library.zones[this.game.world.activeZone].config.tilesets
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
    this.display.drawPopup();
    this.display.render();
    this.display.camera.adjustCamera(
      this.game.player,
      this.game.world.width,
      this.game.world.height
    );
  }

  private update(): void {
    this.game.player.isJumpActive = this.controller.jump.isActive;
    this.game.player.isUpActive = this.controller.up.isActive;

    if (!this.areControlsDisabled) {
      if (this.controller.isAnyKeyIsActive) {
        this.bus.publish(this.bus.HIDE_POPUP);
      }
      if (this.game.player.isClimbing) {
        this.adjustClimbingControls();
      } else {
        this.adjustMovingControls();
      }
    }

    this.game.update();
  }

  private loadZone(payload: ZonePayload): void {
    // We should stop the engine, as loading new assets may take some time
    this.engine.stop();
    // Set the player's destination params - they will be used during the new zone data parsing
    this.game.player.destination.x = payload.x;
    this.game.player.destination.y = payload.y;
    this.game.player.destination.name = payload.name;
    // load new zone schemes
    this.game.loadZone(payload.name);
    // position the camera in advance to prevent one frame flicking since it has not yet had
    // time to position itself in the new zone
    this.display.camera.adjustCamera(
      this.game.player,
      this.game.world.width,
      this.game.world.height
    );
    // update only assets that are not yet loaded by comparing urls
    this.updateZoneAssets();
    // now we can start engine again
    this.engine.start();
  }

  private updateZoneAssets(): void {
    this.display.backgrounds = this.display.library.zones[this.game.world.activeZone].backgrounds;
    this.display.mapTileset = this.display.library.zones[this.game.world.activeZone].tileset;
    this.display.mapTileset.tileSize = this.display.library.zones[this.game.world.activeZone].config.tilesets[0].tilewidth;
    this.display.mapTileset.columns = this.display.library.zones[this.game.world.activeZone].config.tilesets[0].columns;
    this.display.images = this.display.library.zones[this.game.world.activeZone].images.spriteSheet;
    this.display.imagesMap = this.display.library.zones[this.game.world.activeZone].images.spriteMap;
    // By default, the size of the buffer canvas is equal to the size of the first zone, so we need
    // to update it when changing the zone, so its size may not be enough for the new zone
    this.display.adjustBufferCanvasSize(this.game.world.width, this.game.world.height);
  }
}
