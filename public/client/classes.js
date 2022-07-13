class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 15;
    this.offset = offset;
  }
  draw() {
    // shows images based on frames and width of png
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }
  animateFrames() {
    //increments and moves where the image is looking and being displayed
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
  update() {
    //rerenders
    this.draw();
    this.animateFrames();
  }
}
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.isBlocking = false;
    this.isSpecialAttacking;
    this.health = 100;
    this.charge = 0;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.sprites = sprites;
    this.dead = false;
    this.attackToggle = true;
    //makes fighters current movement his approprite sprite png
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }
  update() {
    this.draw();
    //cant change animation when dead
    if (!this.dead) {
      this.animateFrames();
    }
    //animates attack box depending on the fighters position
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    //hit boxes and attack boxes for fighters
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    //implements gravity, and makes the players not fall through the floor
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }
    //player cant go through the left side of the screen
    if (this.position.x <= 0) {
      this.velocity.x = 0;
      this.position.x = 0;
    }
    //player cant go through the right side of the screen
    if (this.position.x + this.width >= canvas.width) {
      this.velocity.x = 0;
      this.position.x = canvas.width - this.width;
    }
  }
  attack() {
    //makes hitbox do damage
    this.isAttacking = true;
    if (this.isSpecialAttacking === true) {
      if (this.lastKey === 'd' || this.lastKey === 'arrowright') {
        this.switchSprite('attackRight3');
      } else {
        this.switchSprite('attackLeft3');
      }
      return;
    }
    if (this.attackToggle) {
      if (this.lastKey === 'd' || this.lastKey === 'arrowright') {
        this.switchSprite('attackRight1');
      } else {
        this.switchSprite('attackLeft1');
      }
      this.attackToggle = !this.attackToggle;
    } else if (this.attackToggle === false) {
      if (this.lastKey === 'd' || this.lastKey === 'arrowright') {
        this.switchSprite('attackRight2');
      } else {
        this.switchSprite('attackLeft2');
      }
      this.attackToggle = !this.attackToggle;
    }
    if (this.lastKey === 'd' || this.lastKey === 'arrowright') {
      this.switchSprite('attackRight1');
    } else {
      this.switchSprite('attackLeft1');
    }
  }
  specialAttack() {
    this.isSpecialAttacking = true;
    if (this.lastKey === 'd' || this.lastKey === 'arrowright') {
      this.switchSprite('attackRight3');
    } else {
      this.switchSprite('attackLeft3');
    }
    return;
  }
  block() {
    //shield appears and prevents damage
    this.isBlocking = true;
    this.switchSprite('block');
  }
  takeHit(damage) {
    //damage per regular hit
    if (this.isBlocking == true) {
      // this.switchSprite('block')
      this.health -= 0;
    } else {
      this.health -= damage;
      this.charge += 15;
      if (this.health <= 0) {
        this.switchSprite('death');
      } else {
        if (this.lastKey === 'd' || this.lastKey === 'arrowright') {
          this.switchSprite('takeHitRight');
        } else {
          this.switchSprite('takeHitLeft');
        }
        return;
      }
    }
  }
  switchSprite(sprite) {
    //death sprite > all others so it comes first
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.dead = true;
      }
      return;
    }
    if (
      this.image === this.sprites.attackLeft1.image &&
      this.framesCurrent < this.sprites.attackLeft1.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.attackLeft2.image &&
      this.framesCurrent < this.sprites.attackLeft2.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.attackLeft3.image &&
      this.framesCurrent < this.sprites.attackLeft3.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.attackRight1.image &&
      this.framesCurrent < this.sprites.attackRight1.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.attackRight2.image &&
      this.framesCurrent < this.sprites.attackRight2.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.attackRight3.image &&
      this.framesCurrent < this.sprites.attackRight3.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.takeHitLeft.image &&
      this.framesCurrent < this.sprites.takeHitLeft.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.takeHitRight.image &&
      this.framesCurrent < this.sprites.takeHitRight.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.block.image &&
      this.framesCurrent < this.sprites.block.framesMax - 1
    )
      return;
    //switches between sprites, and makes sure the action starts at the right frame, and shows all of it
    switch (sprite) {
      case 'idleLeft':
        if (this.image !== this.sprites.idleLeft.image) {
          this.image = this.sprites.idleLeft.image;
          this.framesMax = this.sprites.idleLeft.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'idleRight':
        if (this.image !== this.sprites.idleRight.image) {
          this.image = this.sprites.idleRight.image;
          this.framesMax = this.sprites.idleRight.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'runback':
        if (this.image !== this.sprites.runback.image) {
          this.image = this.sprites.runback.image;
          this.framesMax = this.sprites.runback.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'moveBack':
        if (this.image !== this.sprites.moveBack.image) {
          this.image = this.sprites.moveBack.image;
          this.framesMax = this.sprites.moveBack.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'jumpback':
        if (this.image !== this.sprites.jumpback.image) {
          this.image = this.sprites.jumpback.image;
          this.framesMax = this.sprites.jumpback.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'fallback':
        if (this.image !== this.sprites.fallback.image) {
          this.image = this.sprites.fallback.image;
          this.framesMax = this.sprites.fallback.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attackLeft1':
        if (this.image !== this.sprites.attackLeft1.image) {
          this.image = this.sprites.attackLeft1.image;
          this.framesMax = this.sprites.attackLeft1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attackLeft2':
        if (this.image !== this.sprites.attackLeft2.image) {
          this.image = this.sprites.attackLeft2.image;
          this.framesMax = this.sprites.attackLeft2.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attackLeft3':
        if (this.image !== this.sprites.attackLeft3.image) {
          this.image = this.sprites.attackLeft3.image;
          this.framesMax = this.sprites.attackLeft3.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attackRight1':
        if (this.image !== this.sprites.attackRight1.image) {
          this.image = this.sprites.attackRight1.image;
          this.framesMax = this.sprites.attackRight1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attackRight2':
        if (this.image !== this.sprites.attackRight2.image) {
          this.image = this.sprites.attackRight2.image;
          this.framesMax = this.sprites.attackRight2.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attackRight3':
        if (this.image !== this.sprites.attackRight3.image) {
          this.image = this.sprites.attackRight3.image;
          this.framesMax = this.sprites.attackRight3.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'takeHitLeft':
        if (this.image !== this.sprites.takeHitLeft.image) {
          this.image = this.sprites.takeHitLeft.image;
          this.framesMax = this.sprites.takeHitLeft.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'takeHitRight':
        if (this.image !== this.sprites.takeHitRight.image) {
          this.image = this.sprites.takeHitRight.image;
          this.framesMax = this.sprites.takeHitRight.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'block':
        if (this.image !== this.sprites.block.image) {
          this.image = this.sprites.block.image;
          this.framesMax = this.sprites.block.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
