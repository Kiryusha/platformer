// The class is responsible for processing all the possible collisions
import Player from './Player';

export default class {
  processNarrowPhase(
    player: Player,
    collision: Entity,
  ): void {
    switch (collision.name) {
      case 'top':
        this.collideFromTop(player, collision);
        break;
      case 'right':
        this.collideFromRight(player, collision);
        break;
      case 'bottom':
        this.collideFromBottom(player, collision);
        break;
      case 'left':
        this.collideFromLeft(player, collision);
        break;
      case 'top-left':
        if (this.collideFromTop(player, collision)) return;
        this.collideFromLeft(player, collision);
        break;
      case 'top-right':
        if (this.collideFromTop(player, collision)) return;
        this.collideFromRight(player, collision);
        break;
      case 'bottom-right':
        if (this.collideFromRight(player, collision)) return;
        this.collideFromBottom(player, collision);
        break;
      case 'bottom-left':
        if (this.collideFromLeft(player, collision)) return;
        this.collideFromBottom(player, collision);
        break;
      case 'full':
        if (this.collideFromTop(player, collision)) return;
        if (this.collideFromLeft(player, collision)) return;
        if (this.collideFromRight(player, collision)) return;
        this.collideFromBottom(player, collision);
        break;
    }
  }

  // This method exists for the future possible separation of various methods of cycling objects:
  // quad tree, spatial hash etc. For now it is just brute forcing all of them.
  processBroadPhase(entities: Entity[]): void {
    this.bruteForce(entities);
  }

  bruteForce(entities: Entity[]): void {
    const length = entities.length;

    if (length > 1) {
      for (let i = 0; i < length; i += 1) {
        let e1 = entities[i];

        for (let k = i + 1; k < length; k += 1) {
          let e2 = entities[k];

          if (this.broadPhaseComparator(e1, e2)) {
            this.broadPhaseResolver(e1, e2)
          }
        }
      }
    }
  }

  // Checks if objects are overlapping
  broadPhaseComparator(e1: Entity, e2: Entity): boolean {
    // Skips all checks not related to the player in order to save resources
    if (e1.type !== 'player' && e2.type !== 'player') {
      return false;
    }

    // TODO: develop to complete Separating Axis Theorem
    if (
      e1.x < (e2.x + e2.width) &&
      e2.x < (e1.x + e1.width) &&
      e1.y < (e2.y + e2.height) &&
      e2.y < (e1.y + e1.height)
    ) {
      return true;
    }

    return false;
  }

  // Prepares argument order for narrow phase
  broadPhaseResolver(
    e1: any,
    e2: any,
  ): void {
    if (e1.type === 'player' && e2.type === 'collision') {
      this.processNarrowPhase(e1, e2);
    } else if (e2.type  === 'player' && e1.type === 'collision') {
      this.processNarrowPhase(e2, e1);
    }
  }

  // These are specific methods for handling various cases of collisions.
  collideFromTop(
    player: Player,
    collision: Entity,
  ): boolean {
    if (player.getBottom() > collision.y && player.getOldBottom() <= collision.y) {
      player.setBottom(collision.y - 0.01);
      player.velocityY = 0;
      player.isJumping = false;
      player.isFalling = false;
      player.isOnTop = true;
      return true;
    }
    player.isOnTop = false;
    return false;
  }

  collideFromRight(
    player: Player,
    collision: Entity,
  ): boolean {
    if (player.getLeft() < (collision.x + collision.width) && player.getOldLeft() >= (collision.x + collision.width)) {
      player.setLeft(collision.x + collision.width);
      player.velocityX = 0;
      return true;
    }
    return false;
  }

  collideFromBottom(
    player: Player,
    collision: Entity,
  ): boolean {
    if (player.getTop() < (collision.y + collision.height) && player.getOldTop() >= (collision.y + collision.height)) {
      player.setTop(collision.y + collision.height);
      player.velocityY = 0;
      player.isJumping = false;
      player.isFalling = true;
      return true;
    }
    return false;
  }

  collideFromLeft(
    player: Player,
    collision: Entity,
  ): boolean {
    if (player.getRight() > collision.x && player.getOldRight() <= collision.x) {
      player.setRight(collision.x - 0.01);
      player.velocityX = 0;
      return true;
    }
    return false;
  }
}
