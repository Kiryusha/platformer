import Controller from './core/controller/Controller';
import Display from './core/display/Display';
import Game from './core/game/Game';
import Engine from './core/engine/Engine';
import AssetsManager from './core/display/AssetsManager';
import spriteSheet from './assets/images/sprites.png';
// default zone set
import zoneA0 from './assets/levels/zoneA0.json';
import zoneA1 from './assets/levels/zoneA1.json';
import zoneB0 from './assets/levels/zoneB0.json';
import zoneB1 from './assets/levels/zoneB1.json';
import zoneB2 from './assets/levels/zoneB2.json';
import cloudsBack from './assets/images/default/background/clouds-back.png';
import cloudsFront from './assets/images/default/background/clouds-front.png';
import bgBack from './assets/images/default/background/bg-back.png';
import bgFront from './assets/images/default/background/bg-front.png';
import defaultTileSet from './assets/images/default/default-tileset.png';
import sunnyLandTileSet from './assets/images/sunny-land/sunny-land-tileset.png';
import defaultImages from './assets/images/default/images.png';
import defaultImagesMap from './assets/sprite-maps/default/images.json';

declare global {
  interface Window {
    SHOW_COLLISIONS: boolean;
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const aspectRatio = 9 / 16;
  const fps = 1000 / 30;

  const zones: zones = {
    'zoneA0': {
      config: zoneA0,
      tileset: defaultTileSet,
      backgrounds: {
        cloudsBack,
        cloudsFront,
        bgBack,
        bgFront,
      },
      images: {
        spriteSheet: defaultImages,
        spriteMap: defaultImagesMap,
      }
    },
    'zoneA1': {
      config: zoneA1,
      tileset: defaultTileSet,
      backgrounds: {
        cloudsBack,
        cloudsFront,
      },
      images: {
        spriteSheet: defaultImages,
        spriteMap: defaultImagesMap,
      }
    },
    'zoneB0': {
      config: zoneB0,
      tileset: sunnyLandTileSet,
      backgrounds: {},
      images: {},
    },
    'zoneB1': {
      config: zoneB1,
      tileset: sunnyLandTileSet,
      backgrounds: {},
      images: {},
    },
    'zoneB2': {
      config: zoneB2,
      tileset: sunnyLandTileSet,
      backgrounds: {},
      images: {},
    },
  };

  const startingZone: string = 'zoneA1';

  const handleKeyEvent = (event: { type: string; keyCode: number; }) => {
    controller.handleKeyEvent(event.type, event.keyCode);
  };

  const resize = () => {
    display.resize(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
      aspectRatio,
    );
    display.render();
    display.camera.adjustCamera(player, game.world.width, game.world.height);
  };
  const render = () => {
    const imagesTilesData =
      zones[game.world.activeZone].config.tilesets.filter(tileset => tileset.name === 'images')[0];

    display.renderer.clear();

    display.drawBackgrounds();
    display.drawMap(game.world.backgroundMap, game.world.columns, imagesTilesData);
    if (game.world.middleBackgroundMap) {
      display.drawMap(game.world.middleBackgroundMap, game.world.columns, imagesTilesData);
    }
    display.drawMap(game.world.middleMap, game.world.columns, imagesTilesData);
    if (game.world.middleFrontMap) {
      display.drawMap(game.world.middleFrontMap, game.world.columns, imagesTilesData);
    }
    display.drawCharacters(game.objects[game.world.activeZone].characters);
    display.drawCollectables(game.objects[game.world.activeZone].collectables);
    display.drawMap(game.world.frontMap, game.world.columns, imagesTilesData);

    // Collisions debugging tool: to visualise collisions type window.SHOW_COLLISIONS = true
    // in browser console
    if (window.SHOW_COLLISIONS) {
      display.drawCollisionDebugMap(game.world.collisionDebugMap);
    }
    display.drawHud(player, game.spriteMap);
    display.render();
    display.camera.adjustCamera(player, game.world.width, game.world.height);
  };

  const update = async () => {
    if (controller.left.isActive) {
      player.startMovingLeft();
    } else if (player.isMovingLeft) {
      player.stopMovingLeft();
    }

    if (controller.right.isActive) {
      player.startMovingRight();
    } else if (player.isMovingRight) {
      player.stopMovingRight();
    }

    player.isUpActive = controller.up.isActive;

    if (controller.jump.isActive && !controller.jump.isHold) {
      player.startJumping();
    } else if (player.isJumpTriggered) {
      player.stopJumping();
    }

    if (controller.shift.isActive) {
      player.startSprinting();
    } else if (player.isSprinting) {
      player.stopSprinting();
    }

    if (controller.down.isActive) {
      player.startDucking();
    } else if (player.isDucking) {
      player.stopDucking();
    }

    // The zone changes only if the player collided with the door and the collider recorded data
    // about the new zone in the corresponding property of the player's character.
    if (player.destination.name.length) {
      // We should stop the engine, as loading new assets may take some time
      engine.stop();
      // load new zone schemes
      game.loadZone(player.destination.name);
      // position the camera in advance to prevent one frame flicking since it has not yet had
      // time to position itself in the new zone
      display.camera.adjustCamera(player, game.world.width, game.world.height);
      player.destination.name = '';
      // update only assets that are not yet loaded by comparing urls
      await updateZoneAssets();
      // now we can start engine again
      engine.start();
    }

    game.update();
  };

  const controller = new Controller();
  const game = new Game(zones, startingZone);
  const display = new Display(
    document.getElementById('game') as HTMLCanvasElement,
    256,
    144,
  );
  const player: Player = game.player;
  const engine = new Engine(fps, render, update);

  // Synchronize display buffer size with the world size
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;


  window.addEventListener('keydown', handleKeyEvent);
  window.addEventListener('keyup', handleKeyEvent);
  window.addEventListener('resize', resize);

  const updateZoneAssets = async () => {
    const promises = [];
    const backgrounds: backgrounds = zones[game.world.activeZone].backgrounds;

    // check if new backgrounds are among already processed backgrounds
    const areNewBackgroundsAmongOld = Object.keys(backgrounds).every(url =>
      display.backgrounds.some(asset => asset.url === url));

    // check if the same assets is used in new zone
    if (display.mapTileset.url !== zones[game.world.activeZone].tileset) {
      promises.push(
        display.mapTileset.loadAsset(
          zones[game.world.activeZone].tileset,
          false,
          zones[game.world.activeZone].config.tilesets[0].tilewidth,
          zones[game.world.activeZone].config.tilesets[0].columns,
        ),
      );
    }

    if (
      zones[game.world.activeZone].images.spriteSheet &&
      (display.images.url !== zones[game.world.activeZone].images)
    ) {
      promises.push(
        display.images.loadAsset(zones[game.world.activeZone].images.spriteSheet)
      );
    }

    if (!areNewBackgroundsAmongOld) {
      display.backgrounds = [];

      Object.keys(backgrounds).forEach(() => {
        display.backgrounds.push(new AssetsManager(display.buffer));
      });

      promises.push(
        ...Object.keys(backgrounds)
          .map((background: keyof backgrounds, i) =>
            display.backgrounds[i]
              .loadAsset(backgrounds[background])),
      );
    }

    await Promise.all(promises);

    display.imagesMap = zones[game.world.activeZone].images.spriteMap;
    // By default, the size of the buffer canvas is equal to the size of the first zone, so we need
    // to update it when changing the zone, so its size may not be enough for the new zone
    display.adjustBufferCanvasSize(game.world.width, game.world.height);
  };

  await Promise.all([
    // characters sprites are always the same
    display.spriteSheet.loadAsset(spriteSheet, true),

    // initial asset setup
    updateZoneAssets(),
  ]);

  resize();
  engine.start();
});
