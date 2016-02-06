import { HIT, MISS } from '../lib/actions.js'

export const printPlayerStatus = function printPlayerStatus (store) {
  printAttacks(store)
  printBoard(store)
}
function printAttacks (store) {
  var attacks = store.meta.currentPlayer === 1 ? store.playerOne.attacks : store.playerTwo.attacks
  console.log('   Player', store.meta.currentPlayer, 'Attacks:')
  var hr = '   --------------------'
  var str = ''
  console.log('   | 0 | 1 | 2 | 3 | 4 |')
  console.log(hr)
  attacks.forEach((row, i) => {
    str = i + ': '
    row.forEach((col, j) => {
      if (attacks[i][j] === HIT) {
        str += '| 🔴 '
      } else if (attacks[i][j] === MISS) {
        str += '| ⚪️ '
      } else {
        str += '| 💧 '
      }
    })
    str += '|'
    console.log(str)
    console.log(hr)
  })
}
function printBoard (store) {
  var board = store.meta.currentPlayer === 1 ? store.playerOne.board : store.playerTwo.board
  var attacks = store.meta.currentPlayer === 1 ? store.playerTwo.attacks : store.playerOne.attacks
  console.log('   Player', store.meta.currentPlayer, 'Board:')
  var hr = '   --------------------'
  var str = ''
  console.log('   | 0 | 1 | 2 | 3 | 4 |')
  console.log(hr)
  board.forEach((row, i) => {
    str = i + ': '
    row.forEach((col, j) => {
      // if ship exists
      if (board[i][j]) {
        if (attacks[i][j]) {
          str += '| 🔴 '
        } else {
          str += '| ❇️ '
        }
      } else {
        if (attacks[i][j]) {
          str += '| ⚪️ '
        } else {
          str += '| 💧 '
        }
      }
    })
    str += '|'
    console.log(str)
    console.log(hr)
  })
}
