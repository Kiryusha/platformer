// The class is responsible for processing all the possible collisions
export default class {
  // this router separates collisions of a character with a collision entity
  private routeNarrowPhaseCharacterVsCollision(
    character: Character,
    collision: Entity,
  ): void {
    character.isStuck = false;
    switch (collision.type) {
      case 'top':
        if (this.isCollidingFromTop(character, collision)) {
          this.collideCharacterVsCollisionFromTop(character, collision);
        }
        break;
      case 'right':
        if (this.isCollidingFromRight(character, collision)) {
          this.collideCharacterVsCollisionFromRight(character, collision);
        }
        break;
      case 'bottom':
        if (this.isCollidingFromBottom(character, collision)) {
          this.collideCharacterVsCollisionFromBottom(character, collision);
        }
        break;
      case 'left':
        if (this.isCollidingFromLeft(character, collision)) {
          this.collideCharacterVsCollisionFromLeft(character, collision);
        }
        break;
      case 'top-left':
        if (this.isCollidingFromTop(character, collision)) {
          this.collideCharacterVsCollisionFromTop(character, collision);
          return;
        } else if (this.isCollidingFromLeft(character, collision)) {
          this.collideCharacterVsCollisionFromLeft(character, collision);
        }
        break;
      case 'top-right':
        if (this.isCollidingFromTop(character, collision)) {
          this.collideCharacterVsCollisionFromTop(character, collision);
          return;
        } else if (this.isCollidingFromRight(character, collision)) {
          this.collideCharacterVsCollisionFromRight(character, collision);
        }
        break;
      case 'bottom-right':
        if (this.isCollidingFromRight(character, collision)) {
          this.collideCharacterVsCollisionFromRight(character, collision);
          return;
        } else if (this.isCollidingFromBottom(character, collision)) {
          this.collideCharacterVsCollisionFromBottom(character, collision);
        }
        break;
      case 'bottom-left':
        if (this.isCollidingFromLeft(character, collision)) {
          this.collideCharacterVsCollisionFromLeft(character, collision);
          return;
        } else if (this.isCollidingFromBottom(character, collision)) {
          this.collideCharacterVsCollisionFromBottom(character, collision);
        }
        break;
      case 'full':
        if (this.isCollidingFromTop(character, collision)) {
          this.collideCharacterVsCollisionFromTop(character, collision);
          return;
        } else if (this.isCollidingFromLeft(character, collision)) {
          this.collideCharacterVsCollisionFromLeft(character, collision);
          return;
        } else if (this.isCollidingFromRight(character, collision)) {
          this.collideCharacterVsCollisionFromRight(character, collision);
          return;
        } else if (this.isCollidingFromBottom(character, collision)) {
          this.collideCharacterVsCollisionFromBottom(character, collision);
        }
        character.isStuck = true;
        break;
    }
  }

  // this router separates collisions of a player with an enemy
  routeNarrowPhasePlayerVsEnemy(
    player: Character,
    enemy: Character,
  ): void {
    if (
      this.isCollidingFromTop(player, enemy)
      || this.isCollidingFromBottom(enemy, player)
    ) {
      console.log('Player damaged enemy. Hoorah!');
      return;
    } else if (
      this.isCollidingFromLeft(player, enemy)
      || this.isCollidingFromRight(player, enemy)
      || this.isCollidingFromBottom(player, enemy)
      || this.isCollidingFromTop(enemy, player)
      || this.isCollidingFromLeft(enemy, player)
      || this.isCollidingFromRight(enemy, player)
    ) {
      console.log('Enemy damaged player. Ouch!');
    }
  }

  routeNarrowPhaseCharacterVsDoor(character: Character, door: Entity): void {
    const isVertical = door.height > door.width;

    switch (character.type) {
      case 'player':
          if (isVertical) {
            if (this.isCollidingFromLeft(character, door)) {
              character.x = 0;
            } else {
              character.x = character.width;
            }
          } else {
            if (this.isCollidingFromTop(character, door)) {
              character.y = 0;
            } else {
              character.y = character.height;
            }
          }
          character.zoneToGo = door.type;
        break;
    }
  }

  // these methods determine the presence of a one-way collision of e1 with e2
  private isCollidingFromTop(e1: Entity, e2: Entity): boolean {
    return e1.getBottom() > e2.getTop() && e1.getOldBottom() <= e2.getTop();
  }

  private isCollidingFromRight(e1: Entity, e2: Entity): boolean {
    return e1.getLeft() < e2.getRight() && e1.getOldLeft() >= e2.getRight();
  }

  private isCollidingFromBottom(e1: Entity, e2: Entity): boolean {
    return e1.getTop() < e2.getBottom() && e1.getOldTop() >= e2.getBottom();
  }

  private isCollidingFromLeft(e1: Entity, e2: Entity): boolean {
    return e1.getRight() > e2.getLeft() && e1.getOldRight() <= e2.getLeft();
  }

  // This method exists for the future possible separation of various methods of cycling objects:
  // quad tree, spatial hash etc. For now it is just brute forcing all of them.
  public processBroadPhase(entities: Entity[]): any[] {
    return this.bruteForce(entities);
  }

  private bruteForce(entities: Entity[]): any[] {
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
  private broadPhaseComparator(e1: Entity, e2: Entity): boolean {
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

  // Resolves which router use for the collision
  private broadPhaseResolver(
    e1: any,
    e2: any,
  ): void {
    if (e1.group === 'characters' && e2.group === 'collisions') {
      this.routeNarrowPhaseCharacterVsCollision(e1, e2);
    } else if (e2.group  === 'characters' && e1.group === 'collisions') {
      this.routeNarrowPhaseCharacterVsCollision(e2, e1);
    } else if (e1.group === 'characters' && e2.group === 'characters') {
      this.routeNarrowPhasePlayerVsEnemy(
        e1.type === 'player' ? e1 : e2,
        e2.type === 'player' ? e1 : e2,
      );
    } else if (
      (e1.group === 'characters' && e2.group === 'doors')
      || (e2.group === 'characters' && e1.group === 'doors')
    ) {
      this.routeNarrowPhaseCharacterVsDoor(
        e1.group === 'characters' ? e1 : e2,
        e2.group === 'characters' ? e1 : e2,
      );
    }
  }

  // These are specific methods for handling various cases of collisions.
  private collideCharacterVsCollisionFromTop(
    character: Character,
    collision: Entity,
  ): void {
    character.setBottom(collision.getTop() - 0.01);
    character.velocityY = 0;
    character.isJumping = false;
    character.isFalling = false;
    // specifying collision direction
    character.collisionYDirection = 'bottom';
    collision.collisionYDirection = 'top';
  }

  private collideCharacterVsCollisionFromRight(
    character: Character,
    collision: Entity,
  ): void {
    character.setLeft(collision.x + collision.width);
    character.velocityX = 0;
    // specifying collision direction
    character.collisionXDirection = 'left';
    collision.collisionXDirection = 'right';
  }

  private collideCharacterVsCollisionFromBottom(
    character: Character,
    collision: Entity,
  ): void {
    character.setTop(collision.y + collision.height);
    character.velocityY = 0;
    character.isJumping = false;
    character.isFalling = true;
    // specifying collision direction
    character.collisionYDirection = 'top';
    collision.collisionYDirection = 'bottom';
  }

  private collideCharacterVsCollisionFromLeft(
    character: Character,
    collision: Entity,
  ): void {
    character.setRight(collision.getLeft() - 0.01);
    character.velocityX = 0;
    // specifying collision direction
    character.collisionXDirection = 'right';
    collision.collisionXDirection = 'left';
  }
}
