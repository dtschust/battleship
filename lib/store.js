export const configureStore = function configureStore () {
  return {
    playerOne: {
      board: [],
      attacks: [0, 1, 2, 3, 4].map(() => {
        return [false, false, false, false, false]
      })
    },
    playerTwo: {
      board: [],
      attacks: [0, 1, 2, 3, 4].map(() => {
        return [false, false, false, false, false]
      })
    },
    meta: {
      currentPlayer: 1,
      gameOver: false,
      victor: undefined,
      shipsPlaced: {
        1: 0,
        2: 0
      },
      message1: undefined,
      message2: undefined
    }
  }
}
