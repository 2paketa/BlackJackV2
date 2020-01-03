import {Deck} from "./deck.js";
import {Dealer} from "./dealer.js";

export class Game{
  constructor(playersArray){
    this.playersArray = playersArray;
    this.deck = new Deck();
    this.startGameButton = document.getElementById('start-game-button');
    this.hitButton = document.getElementById('hit-button');
    this.stayButton = document.getElementById('stay-button');
    this.textArea = document.getElementById('game-text-area');
    this.gameArea = document.querySelector('#game-area');
    this.newRoundButton = document.getElementById('new-round-button');
    this.secondsPassed = 3;
    this.currentPlayer;
    this.currentPlayersNumber = 0;
    this.gameOver;
    this.dealer = new Dealer('Dealer', 30000);
    this.sound = document.createElement("audio");
    this.InitializeNewRound();
    let instance = this;

    this.startGameButton.addEventListener('click', function(){
      instance.startGame();
    });
    
    this.hitButton.addEventListener('click', function(){
      instance.currentPlayer.takeCards(instance.deck.giveNextCard());
      instance.checkPlayerBust();
    });
    
    this.stayButton.addEventListener('click', function(){
      instance.nextTurn();
    });
    
    this.newRoundButton.addEventListener('click', function(){
      instance.InitializeNewRound();
    });

  }


  startGame(){
    if (this.betsPlaced()){
        this.deal();
        this.nextTurn();
        this.startGameButton.style.display = 'none';
    }
    else{
        this.textArea.textContent = `All players must place bets before the game starts`;
    }
}

deal(){
  this.dealer.removeCardBack();
  this.dealer.takeCards(this.deck.giveNextCard());
  this.dealer.takeFaceDownCard(this.deck.giveNextCard());
  this.playersArray.forEach(p => {
    p.removeCardBack();
    p.takeCards(this.deck.giveNextCard(), this.deck.giveNextCard());
  });
}

InitializeNewRound(){
      this.resetBoard();
      
      this.playersArray.forEach(p => p.showCardBack());
      this.dealer.showCardBack();
      this.newRoundButton.style.display = 'none';
      this.startGameButton.style.display = 'inline';
      this.gameArea.style.display = 'flex';
      this.textArea.textContent = `Press ${this.startGameButton.textContent} when ready!`;
  }
  
  removePlayersWithoutChips(){
    let playersToRemove = [];
    this.playersArray.forEach((player, index) => {
      if(player.getChips() <= 0){
        playersToRemove.push(index);
        player.removeDisplayArea();
      }
    });
    playersToRemove.forEach(idx => this.playersArray.splice(idx));
  }
  
  betsPlaced(){
      let allBetsPlaced = true;
      this.playersArray.forEach(player => {
        if (player.bet === null){
          allBetsPlaced = false;
        }
      });
      return allBetsPlaced;
  }
  
  resetBoard(){
    this.removePlayersWithoutChips();
    this.playersArray.forEach(player => { 
      player.resetState();
      });
    this.dealer.resetState();
    this.currentPlayersNumber = 0;
    this.gameOver = false;
  }
  
  addGameButtons(){
    let gameButtons = document.createElement('div');
    gameButtons.classList.add('game-buttons');
    gameButtons.appendChild(this.hitButton);
    gameButtons.appendChild(this.stayButton);
    return gameButtons;
  }

  
  nextTurn(){
      if (this.dealer.hiddenScore() === 21){
        this.gameOver = true;
        this.dealer.showFaceDownCard();
        this.checkWinConditions();
        return;
      }
      if (this.currentPlayersNumber > 0){
        let previousPlayerArea = this.playersArray[this.currentPlayersNumber - 1].playerArea[3];
        previousPlayerArea.removeChild(previousPlayerArea.lastChild);
      }
      if (this.currentPlayersNumber >= this.playersArray.length){
        this.dealersTurn();
        this.checkWinConditions();
        this.currentPlayersNumber = 0;
      }
      else{
        this.currentPlayer = this.playersArray[this.currentPlayersNumber];
        this.currentPlayer.playerArea[3].appendChild(this.addGameButtons());
        this.startTimer();
      }
      this.currentPlayersNumber++;
  }
  
  startTimer(){
    this.hitButton.style.display = 'none';
    this.stayButton.style.display = 'none';
    let that = this;
    let countdown = setInterval(countdownTimer, 1);

    function countdownTimer(){
      that.textArea.textContent = `${that.currentPlayer.name}'s turn will start in ${that.secondsPassed} seconds..`;
        if (that.secondsPassed === 0){
          that.textArea.textContent = `${that.currentPlayer.name}, it's your turn!`;
          that.hitButton.style.display = 'inline';
          that.stayButton.style.display = 'inline';
          that.secondsPassed = 3;
          clearInterval(countdown);
          return;
        }
        that.secondsPassed--;
    }; 
  }

  checkPlayerBust(){
    if (this.currentPlayer.getScore() > 21){
      this.currentPlayer.RoundWon = false;
      this.currentPlayer.bust = true;
      this.textArea.textContent = this.playerRoundOutcome(this.currentPlayer);
      this.playerRoundOutcome(this.currentPlayer);
      this.nextTurn();
    }
  }

  checkWinConditions(){
      this.playersArray
        .forEach(player => {
          {
            if (player.bust === true){
              return;
            }
            if (player.getScore() === this.dealer.getScore()){
              player.tiedWithDealer = true;
            }
            else if (this.dealer.getScore() > 21 || player.getScore() > this.dealer.getScore()){
              player.RoundWon = true;
            }
            else{
              player.RoundWon = false;
            }
            this.playerRoundOutcome(player);
          }
      });
      this.newRoundButton.style.display = 'inline';
      this.hitButton.style.display = 'none';
      this.stayButton.style.display = 'none';
    }
  
  playerRoundOutcome(player){
    if(player.tiedWithDealer){
      player.nameArea = `tied with the dealer!`;
      player.collect(1);
    }
    else if (player.RoundWon){
      player.nameArea =  `Wins!`;
      this.dealer.setChips(-player.giveBetAmount());
      player.collect(2);
    }
    else {
      let textForLoss = 'Lost';
      if (player.bust){
        textForLoss =  `Bust`;
      }
      if (player.getChips() <= 0){
        textForLoss += ` (out of chips)`;
      }
      player.nameArea = textForLoss + '!';
      this.dealer.setChips(player.giveBetAmount());
    }

    player.clearBet();
    this.textArea.textContent = `Press ${this.newRoundButton.textContent} if you want to continue!`;
  }
  
   dealersTurn(){
      let scores = [];
      this.dealer.showFaceDownCard();
      this.playersArray.forEach(p => {
        if (p.getScore() <= 21){
          scores.push(p.getScore());
        }
      } );
      while (this.dealer.getScore() < Math.max(...scores)
          && Math.max(...scores) <= 21
          && this.dealer.getScore() <= 17
          && this.dealer.cards.length < 5){
            let card = this.deck.giveNextCard();
            this.dealer.takeCards(card);
          }
      this.gameOver = true;
  }
}
