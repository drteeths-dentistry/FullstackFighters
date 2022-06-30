function rectangularCollision({rectangle1, rectangle2}) {
  return(
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner({player, enemy, timerId}) {
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'
  if(player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 wins'
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 wins'
  }
}

let timer = 90
let countdown = 3
let timerId
let countdownId

function decreaseTimer() {
  if(timer > 0) {
    if(timer === 90 && countdown >= 0) {
      if(countdown === 0) {
        document.querySelector('#displayText').innerHTML = 'FIGHT!!!'
        countdownId = setTimeout(decreaseTimer, 1000)
        countdown--
        return
      }
      document.querySelector('#displayText').style.display = 'flex'
      document.querySelector('#displayText').innerHTML = countdown
      countdownId = setTimeout(decreaseTimer, 1000)
      countdown--
      return
    }

    clearTimeout(countdownId)
    document.querySelector('#displayText').innerHTML = ''
    timerId = setTimeout(decreaseTimer,1000);
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if(timer === 0) {
    document.querySelector('#displayText').style.display  = 'flex'
    determineWinner({player,enemy,timerId})
  }
}
