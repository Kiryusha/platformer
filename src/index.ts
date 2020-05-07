import Controller from './controller/Controller';
import Display from './display/Display';
import Game from './game/Game';
import Engine from './engine/Engine';
import store from './store';
import tileSet from './assets/images/tileset.png';
// import playerSprite from './assets/images/skip.png';

declare global {
  interface Window {
    SHOW_COLLISIONS: boolean;
    SHOW_VELOCITY: boolean;
  }
}

window.addEventListener('DOMContentLoaded', () => {
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
    display.drawObject(
      game.world.player,
      game.world.player.color1,
    );
    display.drawMap(game.world.frontMap, game.world.columns);

    if (window.SHOW_COLLISIONS) {
      display.drawCollisionDebugMap(
        game.world.collisionDebugMap,
        game.world.columns,
        game.world.tileSize,
      );
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
      game.world.player.jump();
      controller.up.isActive = false;
    }

    game.update();
  };

  const controller = new Controller();
  const display = new Display(document.getElementById('game') as HTMLCanvasElement);
  const game = new Game();
  const engine = new Engine(fps, render, update);

  // Synchronize display buffer size with the world size
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;


  window.addEventListener('keydown', handleKeyEvent);
  window.addEventListener('keyup', handleKeyEvent);
  window.addEventListener('resize', resize);

  display.assetsManager.loadAsset(tileSet, () => {
    resize();
    engine.start();
  });

  if (process.env.NODE_ENV !== 'production') {
    setInterval(() => {
      store.dispatch({
        type: 'updateState',
        payload: {
          game,
          controller,
        },
      });
    }, 500);
  }
});
