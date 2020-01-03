import {Game} from './models/game.js';
import {Player} from "./models/player.js";

function Main(){
  let newGameButton = document.getElementById('new-game-button');
  newGameButton.addEventListener('click', function(){

    let players = userInput();
    if (players !== undefined || null){
      this.style.display = 'none';
      new Game(players);
    }
  });
  

  
  function userInput(){
    let  playersNames = document.querySelector('#players-names');
    if (playersNames.value === ''){
      alert('Please insert player names separated by comma');
      return;
    }
    let nameArray = playersNames.value.split(',');
    let playerArray = [];
    nameArray.forEach(name =>{
      playerArray.push(new Player(name.trim(), 500));
    });
    // newArray = [new Player('Manos', 500), new Player('Giorgos', 500)];
    playersNames.style.display = 'none';
    return playerArray;
  }
  
}

Main();




