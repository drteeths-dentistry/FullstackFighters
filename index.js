const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 0.2;

canvas.width = 1024;
canvas.height = 576;

//create background
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
});
//create shop
const shop = new Sprite({
  position: {
    x: 628,
    y: 128,
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6,
});

//create player
const player = new Fighter({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 5,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6,
    },
    attack2: {
      imageSrc: './img/samuraiMack/Attack2.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 50,
      y: 50,
    },
    width: 210,
    height: 50,
  },
});
//create enemy
const enemy = new Fighter({
  position: {
    x: 874,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 5,
  },
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4,
    },
    attack2: {
      imageSrc: './img/kenji/Attack2.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './img/kenji/Take Hit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -173,
      y: 50,
    },
    width: 173,
    height: 50,
  },
});

//helps to tell what keys are being pressed
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

//self explanatory
decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  background.update();
  shop.update();
  //lays a faint white background infront of our png, so it can make the players look more vibrant
  c.fillStyle = 'rgba(255,255,255,0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //players start off not moving
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //key inputs and logic for player1, the if statements usually check that the countdown hasnt finished and the player isnt dead
  if (
    keys.a.pressed &&
    player.lastKey === 'a' &&
    player.health > 0 &&
    countdown < 0
  ) {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (
    keys.d.pressed &&
    player.lastKey === 'd' &&
    player.health > 0 &&
    countdown < 0
  ) {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  if (player.velocity.y < 0 && player.health > 0 && countdown < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0 && player.health > 0 && countdown < 0) {
    player.switchSprite('fall');
  }

  //key inputs and logic for player2, the if statements usually check that the countdown hasnt finished and the player isnt dead
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === 'arrowleft' &&
    enemy.health > 0 &&
    countdown < 0
  ) {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === 'arrowright' &&
    enemy.health > 0 &&
    countdown < 0
  ) {
    enemy.velocity.x = 5;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  if (enemy.velocity.y < 0 && enemy.health > 0 && countdown < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0 && enemy.health > 0 && countdown < 0) {
    enemy.switchSprite('fall');
  }

  //attackbox detection for player1, activates the attackbox, player2 gets staggered, and health is taken
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    if (player.isAttacking === true) {
      if (player.velocity.y !== 0) {
        enemy.takeHit(8);
      } else {
        enemy.takeHit(3);
      }
      player.isAttacking = false;

      gsap.to('#enemySABar', {
        width: enemy.charge + '%',
      });
    }
    gsap.to('#enemyHealth', {
      width: enemy.health + '%',
    });
  }
  //resets attackbox to none damaging for player1
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //attackbox detection for player2, activates the attackbox, player1 gets staggered, and health is taken
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    if (enemy.isAttacking === true) {
      if (enemy.velocity.y !== 0) {
        player.takeHit(8);
      } else {
        player.takeHit(3);
      }
      enemy.isAttacking = false;
      gsap.to('#playerSABar', {
        width: player.charge + '%',
      });
    }
    gsap.to('#playerHealth', {
      width: player.health + '%',
    });
  }
  //resets attackbox to none damaging for player 2
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  //displays text, if one player dies
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

// all event listeners for pressing a button, can also check the last button pressed, if needed, usually updates the current key pressed
window.addEventListener('keydown', (event) => {
  switch (event.key.toLowerCase()) {
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true; 
      player.lastKey = 'a';
      break;
    case 'w':
      if (player.velocity.y === 0 && player.health > 0 && countdown < 0) {
        player.velocity.y = -10;
      }
      break;
    case ' ':
      if (player.health > 0 && countdown < 0) {
        player.attack();
      }
      break;
    case 'x':
      if (player.health > 0 && countdown < 0 && player.charge >= 100) {
        player.specialAttack();
        if (rectangularCollision({ rectangle1: player, rectangle2: enemy })) {
          if (player.isSpecialAttacking === true) {
            enemy.takeHit(22);
            player.attack();
          }
        }
        player.charge = 0;
        player.isSpecialAttacking = false;
        gsap.to('#playerSABar', {
          width: '0%',
        });
      }
      break;
    case 'arrowright':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'arrowright';
      break;
    case 'arrowleft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'arrowleft';
      break;
    case 'arrowup':
      if (enemy.velocity.y === 0 && enemy.health > 0 && countdown < 0) {
        enemy.velocity.y = -10;
      }
      break;
    case 'arrowdown':
      if (enemy.health > 0 && countdown < 0) {
        enemy.attack();
      }
      break;
    case 'm':
      if (enemy.health > 0 && countdown < 0 && enemy.charge >= 100) {
        enemy.specialAttack();
        if (rectangularCollision({ rectangle1: enemy, rectangle2: player })) {
          if (enemy.isSpecialAttacking === true) {
            player.takeHit(22);
            enemy.attack();
          }
        }
        enemy.charge = 0;
        enemy.isSpecialAttacking = false;
        gsap.to('#enemySABar', {
          width: '0%',
        });
      }
      break;
  }
});

// all event listeners for letting go of a button, usually updates the current key pressed
window.addEventListener('keyup', (event) => {
  if (this.dead) {
    return;
  }
  switch (event.key.toLowerCase()) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }
  switch (event.key.toLowerCase()) {
    case 'arrowright':
      keys.ArrowRight.pressed = false;
      break;
    case 'arrowleft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});
