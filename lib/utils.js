import { HIT } from './actions.js'
export const isVictory = function isVictory (board, attacks) {
  return board.every((row, i) => {
    return row.every((cell, j) => {
      return (!cell || attacks[i][j] === HIT)
    })
  })
}
