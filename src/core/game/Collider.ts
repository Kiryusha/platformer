// The class is responsible for processing all the possible collisions
export default class {
  processNarrowPhase(
    player: Character,
    collision: Entity,
  ): void {
    player.isStuck = false;
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
        if (this.collideFromBottom(player, collision)) return;
        player.isStuck = true;
        break;
    }
  }

  // This method exists for the future possible separation of various methods of cycling objects:
  // quad tree, spatial hash etc. For now it is just brute forcing all of them.
  processBroadPhase(entities: Entity[]): any[] {
    return this.bruteForce(entities);
  }

  bruteForce(entities: Entity[]): any[] {
    // based on https://github.com/reu/broadphase.js/blob/master/src/brute-force.js
    const length = entities.length;
    const collisions = [];

    if (length > 1) {
      for (let i = 0; i < length; i += 1) {
        let e1 = entities[i];

        for (let k = i + 1; k < length; k += 1) {
          let e2 = entities[k];

          if (this.broadPhaseComparator(e1, e2)) {
            this.broadPhaseResolver(e1, e2);
            collisions.push([e1, e2]);
          }
        }
      }
    }

    return collisions;
  }

  // Checks if objects are overlapping
  broadPhaseComparator(e1: Entity, e2: Entity): boolean {
    // Skips all checks not related to the player in order to save resources
    if (e1.type !== 'character' && e2.type !== 'character') {
      return false;
    }

    // TODO: develop to complete Separating Axis Theorem
    if (
      e1.getLeft() < e2.getRight() &&
      e2.getLeft() < e1.getRight() &&
      e1.getTop() < e2.getBottom() &&
      e2.getTop() < e1.getBottom()
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
    if (e1.type === 'character' && e2.type === 'collision') {
      this.processNarrowPhase(e1, e2);
    } else if (e2.type  === 'character' && e1.type === 'collision') {
      this.processNarrowPhase(e2, e1);
    }
  }

  // These are specific methods for handling various cases of collisions.
  collideFromTop(
    player: Character,
    collision: Entity,
  ): boolean {
    if (player.getBottom() > collision.getTop() && player.getOldBottom() <= collision.getTop()) {
      player.setBottom(collision.getTop() - 0.01);
      player.velocityY = 0;
      player.isJumping = false;
      player.isFalling = false;
      return true;
    }
    return false;
  }

  collideFromRight(
    player: Character,
    collision: Entity,
  ): boolean {
    if (player.getLeft() < collision.getRight() && player.getOldLeft() >= collision.getRight()) {
      player.setLeft(collision.x + collision.width);
      player.velocityX = 0;
      return true;
    }
    return false;
  }

  collideFromBottom(
    player: Character,
    collision: Entity,
  ): boolean {
    if (player.getTop() < collision.getBottom() && player.getOldTop() >= collision.getBottom()) {
      player.setTop(collision.y + collision.height);
      player.velocityY = 0;
      player.isJumping = false;
      player.isFalling = true;
      return true;
    }
    return false;
  }

  collideFromLeft(
    player: Character,
    collision: Entity,
  ): boolean {
    if (player.getRight() > collision.getLeft() && player.getOldRight() <= collision.getLeft()) {
      player.setRight(collision.getLeft() - 0.01);
      player.velocityX = 0;
      return true;
    }
    return false;
  }
}
