const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 0.2;

canvas.width = 1024;
canvas.height = 576;

const socket = io();

const dataTickRate = 80;
let didPick = false;
let isKing = false;
let isGhost = false;

const actionBtn = document.querySelector('#actionbtn');
const playAgainBtn = document.querySelector('#playagainbtn');
const kingBtn = document.querySelector('#kingBtn');
const ghostBtn = document.querySelector('#ghostBtn');
const readyBtn = document.querySelector('#ready');
const submitBtn = document.querySelector('#submitBtn');

actionBtn.addEventListener('click', () => {
  socket.emit('startGame');
});

submitBtn.addEventListener('click', () => {
  socket.emit('joinGame', { rc });
});

playAgainBtn.addEventListener('click', () => {
  socket.emit('replay');
});

kingBtn.addEventListener('click', () => {
  if (!didPick) {
    socket.emit('kingSelect');
    didPick = !didPick;
    isKing = !isKing;
  }
});

ghostBtn.addEventListener('click', () => {
  if (!didPick) {
    socket.emit('ghostSelect');
    didPick = !didPick;
    isGhost = !isGhost;
  }
});

readyBtn.addEventListener('click', () => {
  socket.emit('ready');
});

socket.on('startGame', (roomName) => {
  document.querySelector('#roomName').innerHTML = roomName;
  actionButton();
});

socket.on('joinGame', (roomName) => {
  document.querySelector('#roomName').innerHTML = roomName;
});

socket.on('kingSelect', () => {
  pickKing();
});

socket.on('ghostSelect', () => {
  pickGhost();
});

socket.on('ready', () => {
  fightReady();
  decreaseTimer();
  setInterval(function () {
    socket.emit('animate', {
      player,
      enemy,
    });
  }, 1000 / dataTickRate);
});

socket.on('animate', () => {
  animate();
});

socket.on('replay', () => {
  playAgain();
});

//create background
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/castleBackground.png',
});

//create player
let playerObj = {
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
    blockLeft: {
      imageSrc: './img/king/ShieldingLeft.png',
      framesMax: 8,
    },
    blockRight: {
      imageSrc: './img/king/ShieldingRight.png',
      framesMax: 8,
    },
  },
  attackBox: {
    offset: {
      x: 50,
      y: 50,
    },
    width: 190,
    height: 50,
  },
};
let player = new Fighter(playerObj);

//create enemy
let enemyObj = {
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
    blockLeft: {
      imageSrc: './img/ghost/ShieldingLeft.png',
      framesMax: 10,
    },
    blockRight: {
      imageSrc: './img/ghost/ShieldingRight.png',
      framesMax: 10,
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
};
let enemy = new Fighter(enemyObj);

//helps to tell what keys are being pressed
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  j: {
    pressed: false,
  },
  n: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

const kingsTensorFlowToKeyBoard = {
  'Left' : 'a',
  'Right' : 'd',
  'Jump' : 'w',
  'Attack' : ' ',
  'SpecialAttack' : 'x',
  'Block' : 'j',
}

const ghostsTensorFlowToKeyBoard = {
  'Left' : 'arrowleft',
  'Right' : 'arrowright',
  'Jump' : 'arrowup',
  'Attack' : 'arrowdown',
  'SpecialAttack' : 'm',
  'Block' : 'n',
}

//self explanatory
// decreaseTimer();

// Tensor Flow Variables
let attackCounter = 0;
let enemyAttackCounter = 0;
let checkBlock = true;

let jDown = false;
let nDown = false;

async function animate() {
  background.update();
  player.update();
  enemy.update();

  // Getting the top move from tensorFLow
  let tfTopMove = document.getElementById('topMove').innerHTML;

  if((tfTopMove !== '') && isKing) {
    socket.emit('keydown', {
      key: kingsTensorFlowToKeyBoard[tfTopMove],
    });
    console.log(kingsTensorFlowToKeyBoard[tfTopMove])
    // socket.emit('keyup', {
    //   key: kingsTensorFlowToKeyBoard[tfTopMove],
    // });
  }
  if((tfTopMove !== '') && isGhost) {
    socket.emit('keydown', {
      key: ghostsTensorFlowToKeyBoard[tfTopMove],
    });
    console.log(ghostsTensorFlowToKeyBoard[tfTopMove])
    // socket.emit('keyup', {
    //   key: ghostsTensorFlowToKeyBoard[tfTopMove],
    // });
  }

  //lays a faint white background infront of our png, so it can make the players look more vibrant
  c.fillStyle = 'rgba(255,255,255,0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  //players start off not moving
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //key inputs and logic for player1, the if statements usually check that the countdown hasnt finished and the player isnt dead
  if (
    (keys.a.pressed &&
      player.lastKey === 'a' &&
      player.health > 0 &&
      countdown < 0)
  ) {
    player.velocity.x = -3.5;
    player.switchSprite('runback');
    player.attackBox.offset.x = -190;
  } else if (
    (keys.d.pressed &&
      player.lastKey === 'd' &&
      player.health > 0 &&
      countdown < 0)
  ) {
    player.velocity.x = 3.5;
    player.switchSprite('run');
    player.attackBox.offset.x = 50;
  } else {
    if (player.isBlocking) {
      if (player.lastKey === 'a') {
        player.switchSprite('blockLeft');
      } else player.switchSprite('blockRight');
    }
    if (player.lastKey === 'a') {
      player.switchSprite('idleLeft');
    } else player.switchSprite('idleRight');
  }
  if (
    // (player.velocity.y === 0 && player.health > 0 && countdown < 0) ||
    (player.velocity.y === 0 &&
      player.health > 0 &&
      countdown < 0 &&
      player.velocity.x >= 0 &&
      player.lastKey === 'w')
  ) {
    player.velocity.y = -9;
    player.switchSprite('jump');
  } else if (
    player.velocity.y > 0 &&
    player.health > 0 &&
    countdown < 0 &&
    player.velocity.x >= 0 &&
    player.lastKey === 'd'
  ) {
    player.switchSprite('fall');
  }
  if (
    player.velocity.y < 0 &&
    player.health > 0 &&
    countdown < 0 &&
    player.velocity.x <= 0 &&
    player.lastKey === 'a'
  ) {
    player.switchSprite('jumpback');
  } else if (
    player.velocity.y > 0 &&
    player.health > 0 &&
    countdown < 0 &&
    player.velocity.x <= 0 &&
    player.lastKey === 'a'
  ) {
    player.switchSprite('fallback');
  }
  if (
    keys.j.pressed &&
    player.lastKey === 'j' &&
    player.health > 0 &&
    countdown < 0
  ) {
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.switchSprite('block');
  }

  //Tensor Flow - Regular Attack - Player
  if (tfTopMove === 'Attack') {
    attackCounter++;
    if (attackCounter < 2) {
      player.isAttacking = true;
      player.attack();
      player.framesCurrent = 2;
    }
    // If we need to attack more decrease number below
    if (attackCounter > 35) {
      attackCounter = 0;
    }
  }
  // Tensor Flow - Special Attack - Player
  if (
    player.health > 0 &&
    countdown < 0 &&
    player.charge >= 100 &&
    tfTopMove === 'SpecialAttack'
  ) {
    player.isSpecialAttacking = true;
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

  // Tensor Flow Blocking - Player -----------------------------------------------BLOCKING--------------->
  if (
    tfTopMove === 'Block' &&
    checkBlock === true &&
    player.velocity.y === 0 &&
    player.velocity.x === 0
  ) {
    player.block();
    checkBlock = false;

    setTimeout(() => {
      player.isBlocking = !player.isBlocking;
      player.switchSprite('idle');
    }, 4000);

    setTimeout(() => {
      checkBlock = true;
    }, 8000);
  }

  //key inputs and logic for player2, the if statements usually check that the countdown hasnt finished and the player isnt dead
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === 'arrowleft' &&
    enemy.health > 0 &&
    countdown < 0
    // tfTopMove === 'Left'
  ) {
    enemy.velocity.x = -3.5;
    enemy.switchSprite('run');
    enemy.attackBox.offset.x = -175;
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === 'arrowright' &&
    enemy.health > 0 &&
    countdown < 0
    // tfTopMove === 'Right'
  ) {
    enemy.velocity.x = 3.5;
    enemy.switchSprite('moveBack');
    enemy.attackBox.offset.x = 50;
  } else {
    if (enemy.isBlocking) {
      if (enemy.lastKey === 'arrowright') {
        enemy.switchSprite('blockRight');
      } else enemy.switchSprite('blockLeft');
    } else {
      if (enemy.lastKey === 'arrowright') {
        enemy.switchSprite('idleRight');
      } else enemy.switchSprite('idleLeft');
    }
  }
  if (
    enemy.velocity.y < 0 &&
    enemy.health > 0 &&
    countdown < 0 &&
    enemy.velocity.x >= 0 &&
    enemy.lastKey === 'arrowright'
  ) {
    enemy.switchSprite('jumpback');
  } else if (
    enemy.velocity.y > 0 &&
    enemy.health > 0 &&
    countdown < 0 &&
    enemy.velocity.x >= 0 &&
    enemy.lastKey === 'arrowright'
  ) {
    enemy.switchSprite('fallback');
  }

  if (
    keys.n.pressed &&
    enemy.lastKey === 'n' &&
    enemy.health > 0 &&
    countdown < 0
    // tfTopMove === 'Block'
  ) {
    enemy.velocity.x = 0;
    enemy.velocity.y = 0;
    enemy.switchSprite('block');
  }

  if (
    enemy.velocity.y < 0 &&
    enemy.health > 0 &&
    countdown < 0 &&
    enemy.velocity.x <= 0 &&
    enemy.lastKey === 'arrowup'
    // (tfTopMove === 'Jump' &&
    //   enemy.velocity.y === 0 &&
    //   enemy.health > 0 &&
    //   countdown < 0 &&
    //   enemy.velocity.x >= 0)
  ) {
    enemy.velocity.y = -9;
    enemy.switchSprite('jump');
  } else if (
    enemy.velocity.y > 0 &&
    enemy.health > 0 &&
    countdown < 0 &&
    enemy.velocity.x <= 0 &&
    enemy.lastKey === 'arrowleft'
  ) {
    enemy.switchSprite('fall');
  }

  // //Tensor Flow - Regular Attack -Enemy
  // if (tfTopMove === 'Attack') {
  //   enemyAttackCounter++;
  //   if (enemyAttackCounter < 2) {
  //     console.log('ENEMY ATTACK');
  //     enemy.isAttacking = true;
  //     enemy.attack();
  //     enemy.framesCurrent = 2;
  //   }
  //   // If we need to attack more decrease number below
  //   if (enemyAttackCounter > 35) {
  //     enemyAttackCounter = 0;
  //   }
  // }
  // // Tensor Flow - Special Attack -Enemy
  // if (
  //   enemy.health > 0 &&
  //   countdown < 0 &&
  //   enemy.charge >= 100 &&
  //   tfTopMove === 'SpecialAttack'
  // ) {
  //   enemy.isSpecialAttacking = true;
  //   enemy.specialAttack();
  //   if (rectangularCollision({ rectangle1: enemy, rectangle2: player })) {
  //     if (enemy.isSpecialAttacking === true) {
  //       player.takeHit(22);
  //       enemy.attack();
  //     }
  //   }
  //   enemy.charge = 0;
  //   enemy.isSpecialAttacking = false;
  //   gsap.to('#enemySABar', {
  //     width: '0%',
  //   });
  // }

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

// all event listeners for pressing a button, can also check the last button pressed, if needed, usually updates the current key pressed
// let jDown = false;
// let nDown = false;

window.addEventListener('keydown', (event) => {
  socket.emit('keydown', {
    key: event.key,
  });
});

socket.on('keydown', (data) => {
  keyDown(data);
});

window.addEventListener('keyup', (event) => {
  socket.emit('keyup', {
    key: event.key,
  });
});

socket.on('keyup', (data) => {
  keyUp(data);
});

function keyDown(event) {
  if(event.key === undefined){
    return
  }
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
      if (player.health > 0 && countdown < 0) {
        player.attack();
      }
      break;

    case 'j':
      if (
        player.velocity.y === 0 &&
        player.velocity.x === 0 &&
        player.health > 0 &&
        countdown < 0
      ) {
        player.block();
        jDown = true;
        setTimeout(() => {
          player.isBlocking = !player.isBlocking;
        }, 3000);
        jDown = false;
        if (jDown == true) {
          return;
        }
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
  }
  switch (event.key.toLowerCase()) {
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
      if (
        enemy.velocity.y === 0 &&
        enemy.velocity.x === 0 &&
        enemy.health > 0 &&
        countdown < 0
      ) {
        enemy.block();
        nDown = true;
        setTimeout(() => {
          enemy.isBlocking = !enemy.isBlocking;
        }, 3000);
        nDown = false;
        if (nDown == true) {
          return;
        }
      }
      break;
  }
}

function keyUp(event) {
  if(event.key === undefined){
    return
  }
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
      keys.j.pressed = false;
      break;
    case 'n':
      keys.n.pressed = false;
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
}

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = '../my-pose-model/';
let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // Note: the pose library adds a tmPose object to your window (window.tmPose)
  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const size = 200;
  const flip = true; // whether to flip the webcam
  webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append/get elements to the DOM
  const canvas = document.getElementById('canvas');
  canvas.width = size;
  canvas.height = size;
  ctx = canvas.getContext('2d');
  labelContainer = document.getElementById('label-container');
  topMoveContainer = document.getElementById('topMove');
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement('div'));
  }
}

async function loop(timestamp) {
  webcam.update(); // update the webcam frame
  await predict();

  window.requestAnimationFrame(loop);
}

let test;

async function predict() {
  // Prediction #1: run input through posenet
  // estimatePose can take in an image, video or canvas html element
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  // Prediction 2: run input through teachable machine classification model
  const prediction = await model.predict(posenetOutput);

  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }

  topMove = prediction.filter((move) => {
    return move.probability > 0.95;
  });

  // console.log(test[0] !== undefined ? test[0].className : 'Idle');
  topMoveContainer.innerHTML =
    topMove[0] !== undefined ? topMove[0].className : 'Idle';

  // console.log('FLAG1', test[0]);

  drawPose(pose);
}
// console.log('flaggg', test);

function drawPose(pose) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
    // draw the keypoints and skeleton
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
  }
}
