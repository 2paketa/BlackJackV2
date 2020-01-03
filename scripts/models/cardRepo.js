import {Card} from "./card.js";

export class CardRepo{

    constructor(){
    }
    getSuits(){
        let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
        return suits;
    }

    getValues(){
        let values = ['Ace', 'King', 'Queen', 'Jack', 
        'Ten', 'Nine', 'Eight', 'Seven', 'Six',
        'Five', 'Four', 'Three', 'Two'
        ];
        return values;
    }

    getCards(){
        let values = this.getValues();
        let suits = this.getSuits();
        let cardArray = [];

        suits.forEach(suit => values.forEach(
            value => cardArray.push(new Card(suit.toLowerCase(), value))
        ));
        return cardArray;
    }

    getCardShortValue(value) {
        switch(value) {
          case 'Ace':
            return 1;
          case 'Two':
            return 2;
          case 'Three':
            return 3;
          case 'Four':
            return 4;
          case 'Five': 
            return 5;
          case 'Six':
            return 6;
          case 'Seven':
            return 7;
          case 'Eight':
            return 8;
          case 'Nine':
            return 9;
          case "Jack":
            return'j';
          case "Queen":
            return 'q';
          case "King":
            return 'k';
          default:
            return 10;
        }
      }

      getCardImage(suit, value){
        let cardSuit = suit[0];
        let cardValue = value || value[0];
        let folder = suit;
        let path = "images/" + folder + "/" + cardValue + cardSuit + ".svg";
        let embedObject = document.createElement('embed');
        embedObject.type = "image/svg+xml";
        embedObject.classList.add('card-image');
        embedObject.src = path;
        return embedObject;
    }
}