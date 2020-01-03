import { Player } from "./player.js";

export class Dealer extends Player{

    constructor(name, chips){
        super(name, chips);
        this.faceDownCard;
        this.faceDownImage = document.createElement('img');
        this.faceDownImage.src = 'images/back-maroon.png';
        this.faceDownImage.classList.add('card-image');

    }

    createPlayerArea(){
        let dealerContainer = document.getElementById('dealers-container');
        let dealerArea = document.createElement('div');
        let itemArray = [this.createTextArea(), this.createImageArea()];
        let playerName = document.createElement('strong');
        
        
        playerName.classList.add('player-name');
        playerName.textContent = `${this.name}`;
        dealerArea.id = 'dealers-area';

        dealerArea.appendChild(playerName);
        let textArea = dealerArea.appendChild(itemArray[0]);
        let imageArea = dealerArea.appendChild(itemArray[1]);
        dealerContainer.appendChild(dealerArea);

        return [textArea, imageArea];
    }

    hiddenScore(){
        let hiddenScore = this.getScore() + this.faceDownCard.numericValue;
        return hiddenScore;
    }

    takeFaceDownCard(card){
        this.faceDownCard = card;
        this.playerArea[1].appendChild(this.faceDownImage);
    }

    showFaceDownCard(){
        this.playerArea[1].removeChild(this.faceDownImage);
        this.takeCards(this.faceDownCard);
        this.faceDownCard = null;
    }

    createBetArea() {
        return;
    }
}