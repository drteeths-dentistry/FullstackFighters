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

    c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    );
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

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
    if (this.attackToggle) {
      this.switchSprite('attack1');
      this.attackToggle = !this.attackToggle;
    } else if (this.attackToggle === false) {
      this.switchSprite('attack2');
      this.attackToggle = !this.attackToggle;
    }
    if (this.specialAttack === true) {
      this.switchSprite('attack3');
      return;
    }
    this.switchSprite('attack1');
  }
  specialAttack() {
    this.isSpecialAttacking = true;
    this.switchSprite('attack3');
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
        this.switchSprite('takeHit');
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
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    if (
      this.image === this.sprites.attack2.image &&
      this.framesCurrent < this.sprites.attack2.framesMax - 1
    )
      return;

    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    if (
      this.image === this.sprites.block.image &&
      this.framesCurrent < this.sprites.block.framesMax - 1
    )
      return;

    //switches between sprites, and makes sure the action starts at the right frame, and shows all of it
    switch (sprite) {
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
      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attack2':
        if (this.image !== this.sprites.attack2.image) {
          this.image = this.sprites.attack2.image;
          this.framesMax = this.sprites.attack2.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attack3':
        if (this.image !== this.sprites.attack3.image) {
          this.image = this.sprites.attack3.image;
          this.framesMax = this.sprites.attack3.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
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
