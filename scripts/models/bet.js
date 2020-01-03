export class Bet{
    constructor(amount){
        this.amount = this.placeBet(amount);
    }

    placeBet(amount){
        if (amount === 0){
            alert('You must bet an amount higher than 0');
        }
        else{ 
            return amount;
        }
    }

    giveAmount(){
        return this.amount;
    }

    clear(){
        this.amount = 0;
    }
}