function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector('#displayText').style.display = 'flex';
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 wins';
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 wins';
  }
  document.querySelector('#playagainbtn').style.display = '';
}

let timer = 90;
let countdown = 3;
let timerId;
let countdownId;

function decreaseTimer() {
  if (timer > 0) {
    if (timer === 90 && countdown >= 0) {
      if (countdown === 0) {
        document.querySelector('#displayText').innerHTML = 'FIGHT!!!';
        countdownId = setTimeout(decreaseTimer, 1000);
        countdown--;
        return;
      }
      document.querySelector('#displayText').style.display = 'flex';
      document.querySelector('#displayText').innerHTML = countdown;
      countdownId = setTimeout(decreaseTimer, 1000);
      countdown--;
      return;
    }

    clearTimeout(countdownId);
    document.querySelector('#displayText').innerHTML = '';
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }

  if (timer === 0) {
    document.querySelector('#displayText').style.display = 'flex';
    determineWinner({ player, enemy, timerId });
  }
}

// Function for audio btn
const audio = document.querySelector('#audio');
audio.volume = 0.4;
function volUp() {
  audio.volume += 0.1;
}
function volDown() {
  audio.volume -= 0.1;
}

let isAudioPlaying = true;

function ppAudio() {
  if (isAudioPlaying) {
    document.querySelector('#audio').pause();
    document.querySelector('#audiobutton').innerHTML = 'play_arrow';
    isAudioPlaying = !isAudioPlaying;
  } else {
    document.querySelector('#audio').play();
    document.querySelector('#audiobutton').innerHTML = 'pause';
    isAudioPlaying = !isAudioPlaying;
  }
}

function playAgain() {
  document.querySelector('#tomain').click();
}

function actionButton() {
  document.querySelector('#mainpage').style.display = 'none';
  document.querySelector('#pickplayer').style.display = '';
}

let isKingPicked = false;
let isGhostPicked = false;

function pickKing() {
  document.querySelector('#kingBtn').style.display = 'none';
  isKingPicked = !isKingPicked;
  if (isKingPicked && isGhostPicked) {
    document.querySelector('#ready').style.display = '';
  }
}

function pickGhost() {
  document.querySelector('#ghostBtn').style.display = 'none';
  isGhostPicked = !isGhostPicked;
  if (isKingPicked && isGhostPicked) {
    document.querySelector('#ready').style.display = '';
  }
}

function fightReady() {
  document.querySelector('#pickplayer').style.display = 'none';
  document.querySelector('#gameplay').style.display = 'inline-block';
  document.querySelector('#tm').style.display = '';
  document.querySelector('#audio').play();
}

let rc;
function handlesubmit() {
  rc = document.getElementById('joinInput').value;
  document.querySelector('#mainpage').style.display = 'none';
  document.querySelector('#pickplayer').style.display = '';
}
