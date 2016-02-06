import { isVictory } from './utils.js'
export const HIT = 'HIT'
export const MISS = 'MISS'
var ALREADY_TAKEN = 'ALREADY_TAKEN'
var SUNK = 'SUNK'
var VICTORY = 'VICTORY'

function isSunk (attacks, column) {
  var hitCount = 0
  attacks.forEach((row) => {
    if (row[column] === HIT) {
      hitCount++
    }
  })
  return hitCount === 3
}

function togglePlayer (store) {
  store.meta.currentPlayer = store.meta.currentPlayer === 1 ? 2 : 1
}

function message (store, message, universal) {
  var currentPlayer = store.meta.currentPlayer
  if (universal) {
    store.meta.message1 = message
    store.meta.message2 = message
  } else {
    store.meta['message' + currentPlayer] = message
  }
  setTimeout(() => {
    if (universal) {
      store.meta.message1 = undefined
      store.meta.message2 = undefined
    } else {
      store.meta['message' + currentPlayer] = undefined
    }
    store.render && store.render()
  }, 1000)
}

export const attack = function attack (store, coordinates) {
  var currentPlayer = store.meta.currentPlayer
  var board = currentPlayer === 1 ? store.playerTwo.board : store.playerOne.board
  var attacks = currentPlayer === 1 ? store.playerOne.attacks : store.playerTwo.attacks
  var [row, col] = coordinates
  if (attacks[row][col]) {
    console.log(ALREADY_TAKEN)
    message(store, 'Already taken, please choose another')
    store.render && store.render()
    return false
  } else if (board[row][col]) {
    attacks[row][col] = HIT
    if (isSunk(attacks, col)) {
      if (isVictory(board, attacks)) {
        console.log(VICTORY, 'Player', currentPlayer, 'is the winner!')
        message(store, 'Victory! Player ' + currentPlayer + ' wins!', true)
        store.meta.gameOver = true
        store.meta.victor = currentPlayer
      } else {
        console.log(SUNK)
        message(store, 'Player ' + currentPlayer + ' sunk a ship!', true)
      }
    } else {
      console.log(HIT)
      message(store, 'Hit!')
    }
  } else {
    attacks[row][col] = MISS
    console.log(MISS)
    message(store, 'Miss!')
  }
  togglePlayer(store)
  store.render && store.render()
  return true
}

export const addShip = function addShip (store, player, coordinates) {
  var [row, col] = coordinates
  var board = player === 1 ? store.playerOne.board : store.playerTwo.board
  if (!board.every((boardRow) => {
    return !boardRow[col]
  })) {
    return
  }
  if (row + 2 >= board.length) {
    return
  }
  board[row][col] = true
  board[row + 1][col] = true
  board[row + 2][col] = true
  store.meta.shipsPlaced[player]++
  store.render && store.render()
}
export const initBoard = function initBoard (store, player, input) {
  var board = [0, 1, 2, 3, 4].map(() => {
    return [false, false, false, false, false]
  })
  for (var col = 0; col < input.length; col++) {
    var topRowOfShip = input[col]
    if (topRowOfShip < 0) continue
    board[topRowOfShip][col] = true
    board[topRowOfShip + 1][col] = true
    board[topRowOfShip + 2][col] = true
  }
  if (player === 1) {
    store.playerOne.board = board
  } else {
    store.playerTwo.board = board
  }
}
