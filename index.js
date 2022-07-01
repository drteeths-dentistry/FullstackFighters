const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gravity = 0.2

canvas.width = 1024
canvas.height = 576

//create background
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png'
})
//create shop
const shop = new Sprite({
  position: {
    x: 628,
    y: 128,
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
})

//create player
const player = new Fighter({
  position: {
    x: 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 5
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6
    },
    block: {
      imageSrc: './img/blueShield.png',
      framesMax: 1
    }
  },
  attackBox: {
    offset: {
      x: 50,
      y: 50
    },
    width: 210,
    height: 50
  }
})
//create enemy
const enemy = new Fighter({
  position: {
    x: 874,
    y: 0
  },
  velocity: {
    x: 0,
    y: 5
  },
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take Hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    },
    block: {
      imageSrc: './img/redShield.png',
      framesMax: 1
    }
  },
  attackBox: {
    offset: {
      x: -173,
      y: 50
    },
    width: 173,
    height: 50
  }
})

//helps to tell what keys are being pressed
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  j: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

//self explanatory
decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  background.update()
  shop.update()
  //lays a faint white background infront of our png, so it can make the players look more vibrant
  c.fillStyle = 'rgba(255,255,255,0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  //players start off not moving
  player.velocity.x = 0
  enemy.velocity.x = 0

  //key inputs and logic for player1, the if statements usually check that the countdown hasnt finished and the player isnt dead
  if (keys.a.pressed && player.lastKey === 'a' && player.health > 0 && countdown < 0) {
    player.velocity.x = -5
    player.switchSprite('run')
  }
  else if (keys.d.pressed && player.lastKey === 'd' && player.health > 0 && countdown < 0) {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  if (player.velocity.y < 0 && player.health > 0 && countdown < 0) {
    player.switchSprite('jump')
  }else if (player.velocity.y > 0 && player.health > 0 && countdown < 0) {
    player.switchSprite('fall')
  }
  if (keys.j.pressed && player.lastKey === 'j' && player.health > 0 && countdown < 0) {
    player.velocity.x = 0
    player.velocity.y = 0
    player.switchSprite('block')
  }

  //key inputs and logic for player2, the if statements usually check that the countdown hasnt finished and the player isnt dead
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.health > 0 && countdown < 0) {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  }
  else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.health > 0 && countdown < 0) {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  if (enemy.velocity.y < 0 && enemy.health > 0 && countdown < 0) {
    enemy.switchSprite('jump')
  }else if (enemy.velocity.y > 0 && enemy.health > 0 && countdown < 0) {
    enemy.switchSprite('fall')
  }

  //attackbox detection for player1, activates the attackbox, player2 gets staggered, and health is taken
  if (rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking && player.framesCurrent === 4) {

    enemy.takeHit()
    player.isAttacking = false
    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }
  //resets attackbox to none damaging for player1
  if(player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  //attackbox detection for player2, activates the attackbox, player1 gets staggered, and health is taken
  if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) {
    // console.log('enemy attacking',enemy.isAttacking)
    // console.log('pre-block', player.isBlocking)
    // if(player.isBlocking == true){
    //   player.isBlocking == false
    //   console.log('post-block', player.isBlocking)
    //   gsap.to('#playerHealth', {
    //   })

    // }

    // else{
    player.takeHit()
    console.log('enemy attacking',enemy.isAttacking)
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
    // }
  }
  //resets attackbox to none damaging for player 2
  if(enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  //displays text, if one player dies
  if(enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerId})
  }
}

animate()

// all event listeners for pressing a button, can also check the last button pressed, if needed, usually updates the current key pressed
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break;
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break;
    case 'w':
      if(player.velocity.y === 0 && player.health > 0 && countdown < 0) {
        player.velocity.y = -10
      }
      break;
    case ' ':
      if(player.health > 0 && countdown < 0) {
        player.attack()

      }
      break;
    case 'j':
      if (player.velocity.y === 0 && player.velocity.x === 0 && player.health > 0 && countdown < 0){
        player.block()
        if (rectangularCollision({rectangle1: enemy, rectangle2: player})){
          console.log('player pre-block', player.isBlocking)
          if(player.isBlocking){
            setTimeout(() => {gsap.to('#playerHealth', {
              }),10000})
             player.isBlocking = !player.isBlocking

            console.log('player post-block', player.isBlocking)
          }
        }
      }
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break;
    case 'ArrowUp':
      if(enemy.velocity.y === 0 && enemy.health > 0 && countdown < 0) {
        enemy.velocity.y = -10
      }
      break;
    case 'ArrowDown':
      if(enemy.health > 0 && countdown < 0) {
        enemy.attack()
      }
      break;
      case '0':
        if (enemy.velocity.y === 0 && enemy.velocity.x === 0 && enemy.health > 0 && countdown < 0){
          enemy.block()
        }
        break;
  }
})

// all event listeners for letting go of a button, usually updates the current key pressed
window.addEventListener('keyup', (event) => {
  if(this.dead) {
    return
  }
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break;
    case 'a':
      keys.a.pressed = false
      break;
    case 'j':
      keys.j.pressed = false
      break;
    }
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break;
    }
})


