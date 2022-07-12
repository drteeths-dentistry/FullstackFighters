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
  imageSrc: './img/king/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: './img/king/Idle.png',
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
    attack1: {
      imageSrc: './img/king/Attack1.png',
      framesMax: 4,
    },
    attack2: {
      imageSrc: './img/king/Attack2.png',
      framesMax: 4,
    },
    attack3: {
      imageSrc: './img/king/Attack3.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './img/king/Take Hit.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './img/king/Death.png',
      framesMax: 6,
    },
    block: {
      imageSrc: './img/king/Shielding.png',
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
  // imageSrc: './img/ghost/Idle.png',
  // framesMax: 10,
  scale: 2.25,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: './img/ghost/Idle.png',
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
    attack1: {
      imageSrc: './img/ghost/Attack1.png',
      framesMax: 4,
    },
    attack2: {
      imageSrc: './img/ghost/Attack2.png',
      framesMax: 4,
    },
    attack3: {
      imageSrc: './img/ghost/Attack3.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './img/ghost/Take Hit.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './img/ghost/Death.png',
      framesMax: 16,
    },
    block: {
      imageSrc: './img/ghost/Shielding.png',
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

//self explanatory
decreaseTimer();

let attackCounter = 0;

async function animate() {
  window.requestAnimationFrame(animate);
  background.update();

  //Gets tensorFlow top move
  let tfTopMove = document.getElementById('topMove').innerHTML;

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
    (keys.a.pressed &&
      player.lastKey === 'a' &&
      player.health > 0 &&
      countdown < 0) ||
    tfTopMove === 'Left'
  ) {
    player.velocity.x = -3.5;
    player.switchSprite('runback');
  } else if (
    (keys.d.pressed &&
      player.lastKey === 'd' &&
      player.health > 0 &&
      countdown < 0) ||
    tfTopMove === 'Right'
  ) {
    player.velocity.x = 3.5;
    player.switchSprite('run');
  } else {
    if (player.isBlocking) {
      player.switchSprite('blocking');
    } else {
      player.switchSprite('idle');
    }
  }
  //TensorFlow -
  if (
    // (player.velocity.y === 0 && player.health > 0 && countdown < 0) ||
    player.velocity.y === 0 &&
    player.health > 0 &&
    countdown < 0 &&
    tfTopMove === 'Jump'
  ) {
    player.velocity.y = -9;
    player.switchSprite('jump');
  } else if (
    player.velocity.y > 0 &&
    player.health > 0 &&
    countdown < 0 &&
    player.velocity.x >= 0
  ) {
    // console.log('falling');
    player.switchSprite('fall');
  }
  if (
    player.velocity.y < 0 &&
    player.health > 0 &&
    countdown < 0 &&
    player.velocity.x < 0
  ) {
    player.switchSprite('jumpback');
  } else if (
    player.velocity.y > 0 &&
    player.health > 0 &&
    countdown < 0 &&
    player.velocity.x < 0
  ) {
    console.log('fallingback');
    player.switchSprite('fallback');
  }

  if (
    (keys.j.pressed &&
      player.lastKey === 'j' &&
      player.health > 0 &&
      countdown < 0) ||
    tfTopMove === 'Block'
  ) {
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.switchSprite('block');
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
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === 'arrowright' &&
    enemy.health > 0 &&
    countdown < 0
  ) {
    enemy.velocity.x = 3.5;
    enemy.switchSprite('moveBack');
  } else {
    if (enemy.isBlocking) {
      enemy.switchSprite('blocking');
    } else {
      enemy.switchSprite('idle');
    }
  }

  if (
    enemy.velocity.y < 0 &&
    enemy.health > 0 &&
    countdown < 0 &&
    enemy.velocity.x > 0
  ) {
    enemy.switchSprite('jumpback');
  } else if (
    enemy.velocity.y > 0 &&
    enemy.health > 0 &&
    countdown < 0 &&
    enemy.velocity.x > 0
  ) {
    console.log('falling');
    enemy.switchSprite('fallback');
  }
  if (
    enemy.velocity.y < 0 &&
    enemy.health > 0 &&
    countdown < 0 &&
    enemy.velocity.x <= 0
  ) {
    enemy.switchSprite('jump');
  } else if (
    enemy.velocity.y > 0 &&
    enemy.health > 0 &&
    countdown < 0 &&
    enemy.velocity.x <= 0
  ) {
    console.log('fallingback');
    enemy.switchSprite('fall');
  }

  //Tensor Flow - Regular Attack
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
  // Tensor Flow - Special Attack
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

animate();

// all event listeners for pressing a button, can also check the last button pressed, if needed, usually updates the current key pressed
let counter = 0;
let jDown = false;
let nDown = false;

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
        counter += 1;
        console.log(counter);
        player.block();
        jDown = true;
        setTimeout(() => {
          player.isBlocking = !player.isBlocking;
        }, 2000);
        jDown = false;
        if (jDown == true) {
          return;
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
        console.log(counter);
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
      if (
        enemy.velocity.y === 0 &&
        enemy.velocity.x === 0 &&
        enemy.health > 0 &&
        countdown < 0
      ) {
        counter += 1;
        console.log(counter);
        enemy.block();
        nDown = true;
        setTimeout(() => {
          enemy.isBlocking = !enemy.isBlocking;
        }, 3000);
        nDown = false;
        if (nDown == true) {
          return;
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
});

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = './my-pose-model/';
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
