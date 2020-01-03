import {CardRepo} from "./cardRepo.js";

export class Deck{
    constructor(){
        this.cardRepo = new CardRepo();
        this.cards = this.cardRepo.getCards();
        this.shuffleDeck();
    }

    shuffleDeck(){
        for (let i = 0; i < this.cards.length; i++){
          let swapIdx = Math.trunc(Math.random() * this.cards.length);
          let tmp = this.cards[swapIdx];
          this.cards[swapIdx] = this.cards[i];
          this.cards[i] = tmp;
        }
      }

    giveNextCard(){
        if (this.cards.length <= 0){
          this.cards = this.cardRepo.getCards();
        }
        return this.cards.shift();
    }

}