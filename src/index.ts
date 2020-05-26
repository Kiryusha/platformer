import Controller from './core/controller/Controller';
import Display from './core/display/Display';
import Game from './core/game/Game';
import Engine from './core/engine/Engine';
import map from './assets/levels/map.json';
import tileSet from './assets/images/tileset.png';
import playerSprite from './assets/images/player.png';

declare global {
  interface Window {
    SHOW_COLLISIONS: boolean;
    SHOW_VELOCITY: boolean;
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const margin = 32;
  const fps = 1000 / 30;

  const handleKeyEvent = (event: { type: string; keyCode: number; }) => {
    controller.handleKeyEvent(event.type, event.keyCode);
  };

  const resize = () => {
    display.resize(
      document.documentElement.clientWidth - margin,
      document.documentElement.clientHeight - margin,
      game.world.height / game.world.width,
    );
    display.render();
  };
  const render = () => {
    display.drawMap(game.world.backgroundMap, game.world.columns);
    display.drawMap(game.world.middleMap, game.world.columns);
    let frame;

    if (game.world.player.isFacingLeft) {
      frame =
        game.world.player.animator.flippedSpriteMap.frames[game.world.player.animator.frameValue].frame;
    } else {
      frame =
        game.world.player.animator.spriteMap.frames[game.world.player.animator.frameValue].frame;
    }

    // console.log(frame);

    display.drawObject(
      game.world.player.isFacingLeft ? display.playerSprite.flippedImage : display.playerSprite.image,
      frame.x,
      frame.y,
      game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.w * 0.5),
      game.world.player.y - Math.floor(frame.h - game.world.player.height),
      frame.w,
      frame.h
    );
    display.drawMap(game.world.frontMap, game.world.columns);

    // Collisions debugging tool: to visualise collisions type window.SHOW_COLLISIONS = true
    // in browser console
    if (window.SHOW_COLLISIONS) {
      display.drawCollisionDebugMap(game.world.collisionDebugMap);
    }
    display.render();
  };

  const update = () => {
    if (controller.left.isActive) {
      game.world.player.startMovingLeft();
    } else if (game.world.player.isMovingLeft) {
      game.world.player.stopMovingLeft();
    }

    if (controller.right.isActive) {
      game.world.player.startMovingRight();
    } else if (game.world.player.isMovingRight) {
      game.world.player.stopMovingRight();
    }

    if (controller.up.isActive) {
      game.world.player.jump(controller.up.isActive);
    } else if (game.world.player.isJumpTriggered) {
      game.world.player.jump(false);
    }

    if (controller.shift.isActive) {
      game.world.player.startSprinting();
    } else if (game.world.player.isSprinting) {
      game.world.player.stopSprinting();
    }

    game.update();
  };

  const controller = new Controller();
  const display = new Display(document.getElementById('game') as HTMLCanvasElement);
  const game = new Game(map);
  const engine = new Engine(fps, render, update);

  // Synchronize display buffer size with the world size
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;


  window.addEventListener('keydown', handleKeyEvent);
  window.addEventListener('keyup', handleKeyEvent);
  window.addEventListener('resize', resize);

  await display.mapTileset.loadAsset(tileSet);
  await display.playerSprite.loadAsset(playerSprite, true);

  resize();
  engine.start();
});
