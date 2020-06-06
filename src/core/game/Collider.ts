// The class is responsible for processing all the possible collisions
export default class {
  processNarrowPhase(
    character: Character,
    collision: Entity,
  ): void {
    character.isStuck = false;
    switch (collision.type) {
      case 'top':
        this.collideFromTop(character, collision);
        break;
      case 'right':
        this.collideFromRight(character, collision);
        break;
      case 'bottom':
        this.collideFromBottom(character, collision);
        break;
      case 'left':
        this.collideFromLeft(character, collision);
        break;
      case 'top-left':
        if (this.collideFromTop(character, collision)) return;
        this.collideFromLeft(character, collision);
        break;
      case 'top-right':
        if (this.collideFromTop(character, collision)) return;
        this.collideFromRight(character, collision);
        break;
      case 'bottom-right':
        if (this.collideFromRight(character, collision)) return;
        this.collideFromBottom(character, collision);
        break;
      case 'bottom-left':
        if (this.collideFromLeft(character, collision)) return;
        this.collideFromBottom(character, collision);
        break;
      case 'full':
        if (this.collideFromTop(character, collision)) return;
        if (this.collideFromLeft(character, collision)) return;
        if (this.collideFromRight(character, collision)) return;
        if (this.collideFromBottom(character, collision)) return;
        character.isStuck = true;
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

            e1.isColliding = true;
            e2.isColliding = true;
          } else {
            e1.isColliding = false;
            e2.isColliding = false;
          }
        }
      }
    }

    return collisions;
  }

  // Checks if objects are overlapping
  broadPhaseComparator(e1: Entity, e2: Entity): boolean {
    // Skips all checks not related to the character in order to save resources
    if (e1.group !== 'characters' && e2.group !== 'characters') {
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
    if (e1.group === 'characters' && e2.group === 'collisions') {
      this.processNarrowPhase(e1, e2);
    } else if (e2.group  === 'characters' && e1.group === 'collisions') {
      this.processNarrowPhase(e2, e1);
    }
  }

  // These are specific methods for handling various cases of collisions.
  collideFromTop(
    character: Character,
    collision: Entity,
  ): boolean {
    if (character.getBottom() > collision.getTop() && character.getOldBottom() <= collision.getTop()) {
      character.setBottom(collision.getTop() - 0.01);
      character.velocityY = 0;
      character.isJumping = false;
      character.isFalling = false;
      // specifying collision direction
      character.collisionYDirection = 'bottom';
      collision.collisionYDirection = 'top';
      return true;
    }
    return false;
  }

  collideFromRight(
    character: Character,
    collision: Entity,
  ): boolean {
    if (character.getLeft() < collision.getRight() && character.getOldLeft() >= collision.getRight()) {
      character.setLeft(collision.x + collision.width);
      character.velocityX = 0;
      // specifying collision direction
      character.collisionXDirection = 'left';
      collision.collisionXDirection = 'right';
      return true;
    }
    return false;
  }

  collideFromBottom(
    character: Character,
    collision: Entity,
  ): boolean {
    if (character.getTop() < collision.getBottom() && character.getOldTop() >= collision.getBottom()) {
      character.setTop(collision.y + collision.height);
      character.velocityY = 0;
      character.isJumping = false;
      character.isFalling = true;
      // specifying collision direction
      character.collisionYDirection = 'top';
      collision.collisionYDirection = 'bottom';
      return true;
    }
    return false;
  }

  collideFromLeft(
    character: Character,
    collision: Entity,
  ): boolean {
    if (character.getRight() > collision.getLeft() && character.getOldRight() <= collision.getLeft()) {
      character.setRight(collision.getLeft() - 0.01);
      character.velocityX = 0;
      // specifying collision direction
      character.collisionXDirection = 'right';
      collision.collisionXDirection = 'left';
      return true;
    }
    return false;
  }
}
