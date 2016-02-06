import clear from 'cli-clear'
import prompt from 'prompt'

import { configureStore } from '../lib/store.js'
import { attack, initBoard } from '../lib/actions.js'
import { isVictory } from '../lib/utils.js'
import { printPlayerStatus } from './cli-views.js'

prompt.colors = false
prompt.start()

var store = configureStore()

function promptForBoard (player = 1) {
  prompt.get([{
    name: 'board',
    description: 'Hello Player ' + player + '! Enter your board, e.g. 0 1 2 1 0'
  }], function (err, result) {
    if (err) return
    try {
      var board = result.board.split(' ').map((i) => parseInt(i, 10))
      initBoard(store, player, board)
      if (player === 1) {
        promptForBoard(2)
      } else {
        playGame()
      }
    } catch (e) {
      console.log(e)
      return
    }
  })
}

promptForBoard()

function playGame () {
  if (isVictory(store.playerOne.board, store.playerTwo.attacks) ||
      isVictory(store.playerTwo.board, store.playerOne.attacks)) {
    console.log('GAME OVER')
    return
  } else {
    clear()
    printPlayerStatus(store)
    prompt.get([{
      name: 'attack',
      description: 'Hello Player ' + store.meta.currentPlayer + '! Enter your attack, e.g. 1 1: '
    }], function (err, result) {
      if (err) return
      try {
        var attackCoords = result.attack.split(' ')
        if (attack(store, attackCoords)) {
          setTimeout(() => {
            clear()
            console.log('SWITCHING PLAYERS IN 2 SECONDS')
            setTimeout(playGame, 2000)
          }, 1000)
        }
      } catch (e) {
        console.log(e)
        return
      }
    })
  }
}
