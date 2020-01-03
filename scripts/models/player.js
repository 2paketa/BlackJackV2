import {Bet} from "./bet.js";
export class Player{
    constructor (name, chips){
        this.name = name;
        this._chips = 0;
        this.playerArea = this.createPlayerArea();
        this.setChips(chips);
        this.cards = [];
        this.bet = null;
        this.RoundWon;
        this.tiedWithDealer;
        this.bust = false;
        this.faceDownImage = document.createElement('img');
        this.faceDownImage.src = 'images/back-maroon.png';
        this.faceDownImage.classList.add('card-image');
        this.faceDownCards = [this.faceDownImage, this.faceDownImage.cloneNode()];
        Object.defineProperty(this, 'nameArea', 
        {
            set: function(value){
                if (this.playerArea[3]){
                    this.playerArea[3].querySelector('.player-name').textContent = `${this.name} ${value}`;
                }
            }
        });
        Object.defineProperty(this, 'areaColor', {
            set: function(value){
                if (this.playerArea[3]){
                    this.playerArea[3].querySelector('.player-name').style.background = value;
                }
            }
        });
    }

    setChips(value){
        this._chips += value;
        this.playerArea[0].querySelector(`#${this.name}-current-chips`).textContent = `Chips: ${this._chips}`;
    }

    getChips(){
        return this._chips;
    }

    getScore(){
        if (this.cards.length === 0)
        { 
            return;
        }
        let _score = 0;
        let hasAce = false;
        for (let i = 0; i < this.cards.length; i++){
            let card = this.cards[i];
            _score += card.numericValue;
            if (card.value === 'Ace'){
            hasAce = true;
            }
        }
        if (hasAce && _score + 10 <= 21){
            return _score + 10;
        }
        return _score;
    }

    takeCards(...cards){
        cards.forEach(card => {
        this.cards.push(card);
        this.appendCardImages(card);
        });
        // let textArea = document.getElementById(`${this.name}-score`);
        
        this.printScore();
    }

    printScore(){
        this.playerArea[0].querySelector(`#${this.name}-score`).textContent = `Score: ${this.getScore() || ''}`;
    }

    showCardBack(){
        this.faceDownCards.forEach(f => this.playerArea[1].appendChild(f));
    }

    removeCardBack(){
        this.playerArea[1].innerHTML = '';
    }

    collect(multiplier){
        this.setChips(this.bet.giveAmount() * multiplier);
    }

    giveBetAmount(){
        return this.bet.giveAmount();
    }

    clearBet(){
        this.bet.clear();
        document.querySelector(`#${this.name}-bet`).textContent = 'Bet: ';
    }

    createPlayerArea(){
        let playerArea = document.createElement("div");
        let itemArray = [this.createTextArea(), this.createImageArea(), this.createInputBetArea()];

        let playerName = document.createElement('strong');
        playerName.classList.add('player-name');
        playerName.textContent = `${this.name}`;


        playerArea.id = `player-${this.name}`;

        playerArea.appendChild(playerName);
        let textArea = playerArea.appendChild(itemArray[0]);
        let imageArea = playerArea.appendChild(itemArray[1]);
        let betArea = playerArea.appendChild(itemArray[2]);
        let playersArea = document.getElementById("players-area").appendChild(playerArea);

        return [textArea, imageArea, betArea, playersArea];
    }

    createTextArea(){
        let textArea = document.createElement('div');
        let playerScore = document.createElement('strong');
        let playerCurrentChips = document.createElement('strong');
        playerScore.id = `${this.name}-score`;
        playerScore.textContent = `Score: `;
        playerCurrentChips.id = `${this.name}-current-chips`;
        textArea.appendChild(playerScore);
        textArea.appendChild(playerCurrentChips);

        textArea.id = `${this.name}-text-area`;
        textArea.classList.add("text-area");

        return textArea;
    }

    createImageArea(){
        let imageArea = document.createElement('div');
        imageArea.id = `${this.name}-image-area`;
        imageArea.classList.add('image-area');
        return imageArea;
    }

    createInputBetArea(){
        let betArea = document.createElement("div");
        let betArray = [document.createElement('strong'), document.createElement("button"), document.createElement("input")];       
        let instance = this;

        betArea.id = `${this.name}-bet-area`;
        betArray[0].id = `${this.name}-bet`;
        betArray[0].style.display = 'block';
        betArray[0].textContent = 'Bet: ';
        betArray[1].id = `${this.name}-bet-button`;
        betArray[1].classList.add('to-hide');
        betArray[2].id = `${this.name}-bet-amount`;
        betArray[2].classList.add('to-hide');
        betArray[1].textContent = 'Place bet';
        betArray[2].textContent = 'Place amount';
        betArray[2].style.width = '140px';
        betArray[1].addEventListener('click', function() {
            let input = document.getElementById(betArray[2].id);
            instance.insertBetAmount(input.value);
            input.value = '';
        });

        betArea.appendChild(betArray[0]);
        betArea.appendChild(betArray[1]);
        betArea.appendChild(betArray[2]);

        return betArea;
    }

    insertBetAmount(input){
        let value = parseInt(input);
        if (this.bet !== null){
            alert('You can only bet once per turn');
            return;
        }
        if (value > this.getChips()){
            alert(`Please select an amount lower than your current chips (${this.getChips()})`);
            return;
        }
        if (value > 0 && value !== ''){
            // this.playerArea[0].appendChild(line);
            this.playerArea[2].querySelector(`#${this.name}-bet`).textContent += `${value}c`;
            this.bet = new Bet(value);
            this.setChips(-value);
            this.playerArea[2].querySelectorAll('.to-hide').forEach(elem => elem.style.display = 'none');
        }
        // console.log(this.Bet.amount);
    }

    appendCardImages(...cards){
        cards.forEach(card => {
            this.playerArea[1].appendChild(card.Image);
        });
    }

    resetState(){
        this.playerArea[1].innerHTML = '';
        if (!!this.playerArea[2]){
            this.playerArea[2].querySelectorAll('.to-hide').forEach(elem => elem.style.display = 'inline');
        }
        this.nameArea = '';
        this.cards = [];
        this.printScore();
        this.RoundWon = null;
        this.tiedWithDealer = null;
        this.bust = null;
        this.bet = null;
    }

    hide(){
        document.querySelector(`#player-${this.name}`).style.display = 'none';
    }

    show(){
        document.querySelector(`#player-${this.name}`).style.display = 'block';
    }

    removeDisplayArea(){
        this.playerArea[3].remove();
    }

}