import Controller from './core/controller/Controller';
import Display from './core/display/Display';
import Game from './core/game/Game';
import Engine from './core/engine/Engine';
import map from './assets/levels/map.json';
import tileSet from './assets/images/tileset.png';
import spriteSheet from './assets/images/sprites.png';

declare global {
  interface Window {
    SHOW_COLLISIONS: boolean;
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const aspectRatio = 9 / 16;
  const fps = 1000 / 30;

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
    display.drawMap(game.world.backgroundMap, game.world.columns);
    display.drawMap(game.world.middleMap, game.world.columns);

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

    if (controller.up.isActive) {
      player.jump(controller.up.isActive);
    } else if (player.isJumpTriggered) {
      player.jump(false);
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
    256,
    144,
  );
  const game = new Game(map);
  const [player] = game.world.characters.filter(character => character.type === 'player');
  const engine = new Engine(fps, render, update);

  // Synchronize display buffer size with the world size
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;


  window.addEventListener('keydown', handleKeyEvent);
  window.addEventListener('keyup', handleKeyEvent);
  window.addEventListener('resize', resize);

  await display.mapTileset.loadAsset(tileSet);
  await display.spriteSheet.loadAsset(spriteSheet, true);

  resize();
  engine.start();
});
