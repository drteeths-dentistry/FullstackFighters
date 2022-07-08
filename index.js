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
  imageSrc: './img/castleBackground.png',
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
  imageSrc: './img/king/IdleRight.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  sprites: {
    idleLeft: {
      imageSrc: './img/king/IdleLeft.png',
      framesMax: 8,
    },
    idleRight: {
      imageSrc: './img/king/IdleRight.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './img/king/Run.png',
      framesMax: 8,
    },
    runback: {
      imageSrc: './img/king/runback.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/king/Jump.png',
      framesMax: 2,
    },
    jumpback: {
      imageSrc: './img/king/jumpback.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/king/Fall.png',
      framesMax: 2,
    },
    fallback: {
      imageSrc: './img/king/fallback.png',
      framesMax: 2,
    },
    attackLeft1: {
      imageSrc: './img/king/AttackLeft1.png',
      framesMax: 4,
    },
    attackLeft2: {
      imageSrc: './img/king/AttackLeft2.png',
      framesMax: 4,
    },
    attackLeft3: {
      imageSrc: './img/king/AttackLeft3.png',
      framesMax: 4,
    },
    attackRight1: {
      imageSrc: './img/king/AttackRight1.png',
      framesMax: 4,
    },
    attackRight2: {
      imageSrc: './img/king/AttackRight2.png',
      framesMax: 4,
    },
    attackRight3: {
      imageSrc: './img/king/AttackRight3.png',
      framesMax: 4,
    },
    takeHitLeft: {
      imageSrc: './img/king/Take Hit Left.png',
      framesMax: 4,
    },
    takeHitRight: {
      imageSrc: './img/king/Take Hit Right.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './img/king/Death.png',
      framesMax: 6,
    },
    block: {
      imageSrc: './img/king/Shielding.png',
      framesMax: 8
    }
  },
  attackBox: {
    offset: {
      x: 50,
      y: 50,
    },
    width: 190,
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
  imageSrc: './img/ghost/IdleLeft.png',
  framesMax: 10,
  scale: 2.25,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idleLeft: {
      imageSrc: './img/ghost/IdleLeft.png',
      framesMax: 10,
    },
    idleRight: {
      imageSrc: './img/ghost/IdleRight.png',
      framesMax: 10,
    },
    run: {
      imageSrc: './img/ghost/Move.png',
      framesMax: 8,
    },
    moveBack: {
      imageSrc: './img/ghost/MoveBack.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/ghost/Move.png',
      framesMax: 8,
    },
    jumpback: {
      imageSrc: './img/ghost/MoveBack.png',
      framesMax: 8,
    },
    fall: {
      imageSrc: './img/ghost/Move.png',
      framesMax: 8,
    },
    fallback: {
      imageSrc: './img/ghost/MoveBack.png',
      framesMax: 8,
    },
    attackLeft1: {
      imageSrc: './img/ghost/AttackLeft1.png',
      framesMax: 4,
    },
    attackLeft2: {
      imageSrc: './img/ghost/AttackLeft2.png',
      framesMax: 4,
    },
    attackLeft3: {
      imageSrc: './img/ghost/AttackLeft3.png',
      framesMax: 6,
    },
    attackRight1: {
      imageSrc: './img/ghost/AttackRight1.png',
      framesMax: 4,
    },
    attackRight2: {
      imageSrc: './img/ghost/AttackRight2.png',
      framesMax: 4,
    },
    attackRight3: {
      imageSrc: './img/ghost/AttackRight3.png',
      framesMax: 6,
    },
    takeHitLeft: {
      imageSrc: './img/ghost/Take Hit Left.png',
      framesMax: 4,
    },
    takeHitRight: {
      imageSrc: './img/ghost/Take Hit Right.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './img/ghost/Death.png',
      framesMax: 16,
    },
    block: {
      imageSrc: './img/ghost/Shielding.png',
      framesMax: 10
    }
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
  j: {
    pressed: false
  },
  n: {
    pressed: false
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
  // shop.update();
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
    player.velocity.x = -3.5;
    player.switchSprite('runback');
    player.attackBox.offset.x = -190
  } else if (
    keys.d.pressed &&
    player.lastKey === 'd' &&
    player.health > 0 &&
    countdown < 0
  ) {
    player.velocity.x = 3.5;
    player.switchSprite('run');
    player.attackBox.offset.x = 50
  } else {
    if(player.isBlocking){
      player.switchSprite('blocking')
    }
    else{
      if(player.lastKey === 'a'){
        player.switchSprite('idleLeft');
      }
      else(
        player.switchSprite('idleRight')
      )
    }
  }

  if (player.velocity.y < 0 && player.health > 0 && countdown < 0 && player.velocity.x >= 0 && player.lastKey === 'd') {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0 && player.health > 0 && countdown < 0 && player.velocity.x >= 0 && player.lastKey === 'd') {
    console.log('falling')
    player.switchSprite('fall');
  }
  if (player.velocity.y < 0 && player.health > 0 && countdown < 0 && player.velocity.x <= 0 && player.lastKey === 'a') {
    player.switchSprite('jumpback')
  } else if (player.velocity.y > 0 && player.health > 0 && countdown < 0 && player.velocity.x <= 0 && player.lastKey === 'a') {
    console.log('fallingback')
    player.switchSprite('fallback');
  }


  if (keys.j.pressed && player.lastKey === 'j' && player.health > 0 && countdown < 0) {
    player.velocity.x = 0
    player.velocity.y = 0
    player.switchSprite('block')
  }

  //key inputs and logic for player2, the if statements usually check that the countdown hasnt finished and the player isnt dead
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === 'arrowleft' &&
    enemy.health > 0 &&
    countdown < 0
  ) {
    enemy.velocity.x = -3.5;
    enemy.switchSprite('run');
    enemy.attackBox.offset.x = -175
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === 'arrowright' &&
    enemy.health > 0 &&
    countdown < 0
  ) {
    enemy.velocity.x = 3.5;
    enemy.switchSprite('moveBack');
    enemy.attackBox.offset.x = 50
  } else {
    if(enemy.isBlocking){
      enemy.switchSprite('blocking')
    }
    else{
      if(enemy.lastKey === 'arrowright'){
        enemy.switchSprite('idleRight');
      }
      else(
        enemy.switchSprite('idleLeft')
      )
    }
  }

  if (enemy.velocity.y < 0 && enemy.health > 0 && countdown < 0 && enemy.velocity.x >= 0 && enemy.lastKey === 'arrowright') {
    enemy.switchSprite('jumpback');
  } else if (enemy.velocity.y > 0 && enemy.health > 0 && countdown < 0 && enemy.velocity.x >= 0 && enemy.lastKey === 'arrowright') {
    console.log('falling')
    enemy.switchSprite('fallback');
  }
  if (enemy.velocity.y < 0 && enemy.health > 0 && countdown < 0 && enemy.velocity.x <= 0 && enemy.lastKey === 'arrowleft') {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0 && enemy.health > 0 && countdown < 0 && enemy.velocity.x <= 0 && enemy.lastKey === 'arrowleft') {
    console.log('fallingback')
    enemy.switchSprite('fall');
  }

  //attackbox detection for player1, activates the attackbox, player2 gets staggered, and health is taken
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 2
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

  if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking && enemy.framesCurrent === 2) {
    if(enemy.isAttacking === true){
      if(enemy.velocity.y !== 0){
        player.takeHit(8)
      }else{
        player.takeHit(3)
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
let counter = 0
let jDown = false
let nDown = false
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
        player.velocity.y = -9;
      }
      break;
    case ' ':
      if(player.health > 0 && countdown < 0) {
        player.attack()

      }
      break;

    case 'j':
      if (player.velocity.y === 0 && player.velocity.x === 0 && player.health > 0 && countdown < 0){
        counter += 1
        console.log(counter)
        player.block()
        jDown = true
        setTimeout(() => {
        player.isBlocking = !player.isBlocking
        },2000)
        jDown = false
        if(jDown == true){
          return
        }

        // if (rectangularCollision({rectangle1: enemy, rectangle2: player})){
        //   if(player.isBlocking && enemy.isAttacking){
        //     player.isBlocking = !player.isBlocking
        //     }
            // counter += 1
        //     // console.log('player pre-block',player.isBlocking )
        //     setTimeout(() => {player.isBlocking = !player.isBlocking},2000)
        //   }
        // }
        console.log(counter)

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
        enemy.velocity.y = -9;
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
      case 'n':
      if (enemy.velocity.y === 0 && enemy.velocity.x === 0 && enemy.health > 0 && countdown < 0){
        counter += 1
        console.log(counter)
        enemy.block()
        nDown = true
        setTimeout(() => {
        enemy.isBlocking = !enemy.isBlocking
        },3000)
        nDown = false
        if(nDown == true){
          return
        }


        // if (rectangularCollision({rectangle1: player, rectangle2: enemy})){
        //   if(enemy.isBlocking){
        //      setTimeout(() => {enemy.isBlocking = !enemy.isBlocking},3000)
        //   }
        // }
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
    case 'j':
      keys.j.pressed = false
      break;
    case 'n':
      keys.n.pressed = false
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
})

function handleInit(msg) {
  console.log(msg)
}
