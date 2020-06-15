import Controller from './core/controller/Controller';
import Display from './core/display/Display';
import Game from './core/game/Game';
import Engine from './core/engine/Engine';
import AssetsManager from './core/display/AssetsManager';
import spriteSheet from './assets/images/sprites.png';
// default zone set
import zoneA0 from './assets/levels/zoneA0.json';
import zoneA1 from './assets/levels/zoneA1.json';
import cloudsBack from './assets/images/default/background/clouds-back.png';
import cloudsFront from './assets/images/default/background/clouds-front.png';
import bgBack from './assets/images/default/background/bg-back.png';
import bgFront from './assets/images/default/background/bg-front.png';
import defaultTileSet from './assets/images/default/tileset.png';
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

  const zones = {
    'A0': {
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
    'A1': {
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
  };
  const activeZone = 'A1';

  const handleKeyEvent = (event: { type: string; keyCode: number; }) => {
    controller.handleKeyEvent(event.type, event.keyCode);
  };

  const resize = () => {
    display.resize(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
      aspectRatio,
    );
    display.render(player, game.world.width, game.world.height);
  };
  const render = () => {
    display.renderer.clear();
    display.drawBackgrounds();
    display.drawMap(game.world.backgroundMap, game.world.columns);
    if (game.world.middleBackgroundMap.length) {
      display.drawMap(game.world.middleBackgroundMap, game.world.columns);
    }
    display.drawMap(game.world.middleMap, game.world.columns);
    if (game.world.middleFrontMap.length) {
      display.drawMap(game.world.middleFrontMap, game.world.columns);
    }

    game.world.characters.forEach(character => {
      let frame;

      if (character.isFacingLeft) {
        frame =
          character.animator.flippedSpriteMap.frames[character.animator.frameValue].frame;
      } else {
        frame =
          character.animator.spriteMap.frames[character.animator.frameValue].frame;
      }

      display.drawObject(
        character.isFacingLeft,
        display.spriteSheet,
        frame.x,
        frame.y,
        character.x + Math.floor(character.width * 0.5 - frame.w * 0.5),
        character.y - Math.floor(frame.h - character.height),
        frame.w,
        frame.h
      );
    });

    display.drawMap(game.world.frontMap, game.world.columns);

    // Collisions debugging tool: to visualise collisions type window.SHOW_COLLISIONS = true
    // in browser console
    if (window.SHOW_COLLISIONS) {
      display.drawCollisionDebugMap(game.world.collisionDebugMap);
    }
    display.render(player, game.world.width, game.world.height);
  };

  const update = () => {
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

    if (controller.up.isActive && !controller.up.isHold) {
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

    game.update();
  };

  const controller = new Controller();
  const display = new Display(
    document.getElementById('game') as HTMLCanvasElement,
    zones[activeZone].config.tilesets,
    256,
    144,
  );
  const game = new Game(zones[activeZone].config);
  const [player] = game.world.characters.filter(character => character.type === 'player');
  const engine = new Engine(fps, render, update);

  // Synchronize display buffer size with the world size
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;


  window.addEventListener('keydown', handleKeyEvent);
  window.addEventListener('keyup', handleKeyEvent);
  window.addEventListener('resize', resize);

  const backgrounds: backgrounds = zones[activeZone].backgrounds;

  Object.keys(backgrounds).forEach(() => {
    display.backgrounds.push(new AssetsManager(display.buffer));
  });

  await Promise.all([
    display.mapTileset.loadAsset(
      zones[activeZone].tileset,
      false,
      zones[activeZone].config.tilesets[0].tilewidth,
      zones[activeZone].config.tilesets[0].columns,
    ),
    display.images.loadAsset(zones[activeZone].images.spriteSheet),
    display.spriteSheet.loadAsset(spriteSheet, true),
    ...Object.keys(backgrounds)
      .map((background: keyof backgrounds, i) =>
        display.backgrounds[i]
          .loadAsset(backgrounds[background])),
  ]);

  display.imagesMap = zones[activeZone].images.spriteMap;

  resize();
  engine.start();
});
