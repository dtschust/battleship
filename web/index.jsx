import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
require('./index.less')

import { configureStore } from '../lib/store.js'
import { attack, initBoard, addShip, HIT, MISS } from '../lib/actions.js'

var BOARD = 'BOARD'
var ATTACKS = 'ATTACKS'
var SETUP = 'SETUP'

var render = function () {
  ReactDOM.render(<Battleship store={store}/>, document.getElementById('root'))
}

var store = configureStore()

// Hack to allow actions to force a rerender
store.render = render

// Initialize the board to empty
initBoard(store, 1, [])
initBoard(store, 2, [])

var Battleship = React.createClass({
  displayName: 'Battleship',
  propTypes: {
    store: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      playerOneReady: false,
      playerTwoReady: false
    }
  },
  componentWillReceiveProps: function (nextProps) {
    var { store } = nextProps
    if (!this.setupComplete()) {
      if (!this.state.playerOneReady && store.meta.shipsPlaced[1] === 3) {
        this.setState({playerOneReady: true})
      }
      if (!this.state.playerTwoReady && store.meta.shipsPlaced[2] === 3) {
        this.setState({playerTwoReady: true})
      }
    }
  },
  setupComplete: function () {
    return (this.state.playerOneReady && this.state.playerTwoReady)
  },
  handleSetup: function (player) {
    return (coordinates) => {
      var isReady = player === 1 ? this.state.playerOneReady : this.state.playerTwoReady
      if (isReady) {
        return
      }
      addShip(this.props.store, player, coordinates)
    }
  },
  handleAttack: function (player) {
    return (coordinates) => {
      var { store } = this.props
      if (!this.setupComplete() || store.meta.gameOver) {
        return
      }
      attack(this.props.store, coordinates)
    }
  },
  renderInfo: function (player) {
    var {store} = this.props
    if (store.meta.gameOver) {
      return (
        <div style={{textAlign: 'center', fontSize: '30px'}}>
          <div>Game Over! Player {store.meta.victor} wins!</div>
        </div>
      )
    }
    return (
      <div style={{textAlign: 'center', fontSize: '30px'}}>
        <div>{store.meta.currentPlayer === player ? 'Your turn!' : 'Not your turn!'}</div>
      </div>
    )
  },
  renderMessage: function (message) {
    if (message) {
      return (
        <div className='message-container'>
          <div className='message'>{message}</div>
        </div>
      )
    }
  },
  renderGame: function () {
    var { store } = this.props
    return (
      <div className='battleship'>
        <div className='player-one'>
          {this.renderMessage(store.meta.message1)}
          {this.renderInfo(1)}
          <Board type={ATTACKS} board={store.playerTwo.board} attacks={store.playerOne.attacks} clickCallback={this.handleAttack(1)} currentPlayer={store.meta.currentPlayer === 1}/>
          <Board type={BOARD} board={store.playerOne.board} attacks={store.playerTwo.attacks} currentPlayer={store.meta.currentPlayer === 1}/>
        </div>
        <div className='player-two'>
          {this.renderMessage(store.meta.message2)}
          {this.renderInfo(2)}
          <Board type={ATTACKS} board={store.playerOne.board} attacks={store.playerTwo.attacks} clickCallback={this.handleAttack(2)} currentPlayer={store.meta.currentPlayer === 2}/>
          <Board type={BOARD} board={store.playerTwo.board} attacks={store.playerOne.attacks} currentPlayer={store.meta.currentPlayer === 2}/>
        </div>
      </div>
    )
  },
  renderSetup: function () {
    var { store } = this.props
    return (
      <div className='battleship'>
        <div className='player-one'>
          <h1 style={{textAlign: 'center'}} >{this.state.playerOneReady ? 'Waiting on Player 2' : 'Please place three ships'}</h1>
          <Board type={SETUP} board={store.playerOne.board} clickCallback={this.handleSetup(1)}/>
        </div>
        <div className='player-two'>
          <h1 style={{textAlign: 'center'}} >{this.state.playerTwoReady ? 'Waiting on Player 1' : 'Please place three ships'}</h1>
          <Board type={SETUP} board={store.playerTwo.board} clickCallback={this.handleSetup(2)}/>
        </div>
      </div>
    )
  },
  render: function () {
    if (this.setupComplete()) {
      return this.renderGame()
    } else {
      return this.renderSetup()
    }
  }
})

var Board = React.createClass({
  displayName: 'Board',
  propTypes: {
    board: React.PropTypes.array,
    attacks: React.PropTypes.array,
    currentPlayer: React.PropTypes.bool,
    clickCallback: React.PropTypes.func,
    type: React.PropTypes.oneOf([BOARD, ATTACKS, SETUP])
  },
  handleClick: function (row, col) {
    return () => {
      var { type } = this.props
      if (type === SETUP) {
        this.props.clickCallback([row, col])
      } else if (type === BOARD || !this.props.currentPlayer) {
        return
      }
      this.props.clickCallback([row, col])
    }
  },
  render: function () {
    var {board, attacks, type} = this.props
    return (
      <div>
        <table className={classnames({attacks: type === ATTACKS, board: type === BOARD, 'current-player': this.props.currentPlayer})}>
          <tbody>
            {board.map((boardRow, row) => {
              return (
                <tr key={'tr-' + row}>
                  {boardRow.map((cell, col) => {
                    var classes
                    if (type === SETUP) {
                      classes = classnames('setup', {
                        ship: board[row][col]
                      })
                    } else {
                      classes = classnames({
                        attacks: type === ATTACKS,
                        board: type === BOARD,
                        hit: attacks[row][col] === HIT,
                        miss: attacks[row][col] === MISS,
                        ship: type === BOARD && board[row][col]
                      })
                    }
                    return (
                      <td key={'cell-' + row + col} className={classes} onClick={this.handleClick(row, col)}>
                        <span className='circle'></span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
})

render()
