const router = require('express').Router();
module.exports = router;

let gamesDb = {};

var Game = function(gameId){
  this.id = gameId;
  this.board = [
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
  ];
  this.winner = '';
  this.turn = 'X';
  this.valid_subgames = [0,1,2,3,4,5,6,7,8];
}

let testId = 222;
let testGame = new Game(testId);

gamesDb[testId] = testGame

router.get('/', (req,res) => {
  res.send('hits API')
})

router.get('/game', (req,res) => {
  res.send(gamesDb[req.query.id])
})

router.post('/game', (req,res) => {
  const id = Math.floor(Math.random() * (1000 - 1) + 1);
  const game = new Game(id);
  gamesDb[game.id] = game;
  res.send(gamesDb[game.id])
})

router.post('/move', (req,res) => {
  let {id, cell} = req.body;
  let subgame = Number.parseInt(req.body.subgame)

  let game = gamesDb[id];

  if (!game.valid_subgames.includes(subgame)) {
    console.log('Invalid subgame');
  }
  else {
    // game.valid_subgames = [4 + (4 - subgame)]
    game.valid_subgames = [cell];
  }

  if(game.board[subgame][cell] !== '') {
    console.log('Cell occupied');
  }
  else {
    game.board[subgame][cell] = game.turn;

    if (checkIfWinner(game.board)) {
      game.winner = game.turn;
    }
    if (game.turn == 'O') {
      game.turn = 'X'
    }
    else if (game.turn == 'X') {
      game.turn = 'O'
    }
  }

  gamesDb[id] = game;

  res.send(game)
})

function checkOverall(board) {
    for (let i = 0; i < 9; i += 3) {
      if (checkIfWinner(board[i]) && checkIfWinner(board[i + 1]) && checkIfWinner(board[i + 2])) {
        return true;
      }
    }
    if (checkIfWinner(board[0]) && checkIfWinner(board[4]) && checkIfWinner(board[8])) {
      return true;
    }
    if (checkIfWinner(board[2]) && checkIfWinner(board[4]) && checkIfWinner(board[6])) {
      return true;
    }

    for (let i = 0; i < 3; ++i) {
      if(checkIfWinner(board[i]) && checkIfWinner(board[i + 3]) && checkIfWinner(board[i + 6])) {
        return true;
      }
    }
    return false;
}

function checkIfWinner(board) {
  for (let i = 0; i < 9; i += 3) {
    if (board[i] !== '' && board[i] == board[i + 1] && board[i] == board[i + 2]) {
      return true;
    }
  }
  if (board[0] !== '' && board[0] == board[4] && board[0] == board[8]) {
    return true;
  }
  if (board[2] !== '' && board[0] == board[4] && board[2] == board[6]) {
    return true;
  }

  for (let i = 0; i < 3; ++i) {
    if(board[i] !== '' && board[i] == board[i + 3] && board[i] == board[i + 6]) {
      return true;
    }
  }
  return false;
}

/*
curl http://localhost:8080/move -d id=222 -d subgame=3 -d cell=8
*/

// curl http://localhost:8080/game?id=222

//TODOS
//check if subgame is valid
//check if cell is valid(not taken)
//[0,1,2
// 3,4,5
// 6,7,8]
//if cell 8 is taken, invalid move
//8 elements in array

//check if winner
//target row where cell is in
//winning combos:

//0,1,2
//3,4,5
//6,7,8

//0,4,8
//2,4,6

//0,3,6
//1,4,7
//2,5,8
