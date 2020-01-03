import {CardRepo} from "./cardRepo.js";

export class Card{
    constructor(suit, value){
        this.suit = suit;
        this.value = value;
        let cardRepo = new CardRepo();
        let shortValue = cardRepo.getCardShortValue(value);
        this.numericValue = shortValue;
        if (!Number.isSafeInteger(this.numericValue)){
            this.numericValue = 10;
        }
        this.Image = cardRepo.getCardImage(this.suit, shortValue);
    }
}

