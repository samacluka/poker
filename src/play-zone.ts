import {Hand, Card} from "../src/models";

import {
    deck,

    Player,
    Dealer,

    decipherHand,
    probability,

    displayCards,
    rankHand,
    toCSV
} from '../src/poker';

/** *************************************************************** **/
/** *************************************************************** **/
/** ************************* PLAY ZONE *************************** **/
/** *************************************************************** **/
/** *************************************************************** **/

/**
 *
 * Simulate one round of texas holdem with 6 players
 *
 */

// let p1: Player = new Player(1, "p1");
// let p2: Player = new Player(2, "p2");
// let p3: Player = new Player(3, "p3");
// let p4: Player = new Player(4, "p4");
// let p5: Player = new Player(5, "p5");
// let p6: Player = new Player(6, "p6");
// let d: Dealer = new Dealer(deck);
// let players: Array<Player> = [p1, p2, p3, p4, p5, p6];
// players = d.shuffle( Math.floor(Math.random() * 10) ).deal(players);

// var i = 0;
// for(var j = 0; j < 3; j++){
//     console.log("");
//     if(j == 0) console.log("=============== FLOP =================");
//     else if(j == 1) console.log("=============== TURN =================");
//     else if(j == 2) console.log("=============== RIVER =================");

//     d.executeNext();
//     players = probability(players, d);
//     console.log(d.displayAll());
//     for(i = 0; i < players.length; i++){
//         console.log(players[i].name, players[i].displayDealtCards(), players[i].displayBestHand(), players[i].hand?.ranking?.name, `${(players[i].probabilityOfWinning ?? 0)*100}%`);
//     }
// }

/**
 *
 * simulate numSimulationsPerHand for every possible two card combination
 * and dump to a csv file
 *
 */

let hands: any = {};
let hand: Array<Card>; // = decipherHand("AS, 6C");
let dealer: Dealer;
let communal: Array<Card>; // = decipherHand("4D, 2C, 6H, jh, 6d");
let ranking: Hand;
let numSimulationsPerHand: number = 10000;

// sum-equivalent of a factorial
console.log(`Running ${ ((deck.length * deck.length + deck.length)/2) * numSimulationsPerHand } simulations...`);

for(let i = 0; i < deck.length; i++){
    for(let j = (i + 1); j < deck.length; j++){
        hand = [deck[i], deck[j]];
        let h = displayCards(hand);
        if(!hands[h]) hands[h] = {'1':{name:"ROYAL FLUSH", score:0, perc:0},'2':{name:"STRAIGHT FLUSH", score:0, perc:0},'3':{name:"FOUR OF A KIND", score:0, perc:0},'4':{name:"FULL HOUSE", score:0, perc:0},'5':{name:"FLUSH", score:0, perc:0},'6':{name:"STRAIGHT", score:0, perc:0},'7':{name:"THREE OF A KIND", score:0, perc:0},'8':{name:"TWO PAIR", score:0, perc:0},'9':{name:"ONE PAIR", score:0, perc:0},'10':{name:"NOTHING", score:0, perc:0}};
        for(let k = 0; k < numSimulationsPerHand; k++){
            dealer = new Dealer(deck.slice());
            communal = dealer.burn(hand).shuffle().executeAll().all;
            ranking = rankHand(hand, communal);
            if(ranking?.ranking?.rank) {
                hands[h][`${<any>ranking?.ranking?.rank}`].score++;
                hands[h][`${<any>ranking?.ranking?.rank}`].perc = hands[h][`${<any>ranking?.ranking?.rank}`].score / numSimulationsPerHand * 100;
            }
        }
    }
}
toCSV(hands);

// console.log("===========================================================================");
// console.log("----------------------------- SITUATION TEST ------------------------------");
// console.log("===========================================================================");
//
// let ch1: Hand = {cards: decipherHand("AC, AD"), best: [], ranking: null};
// let ch2: Hand = {cards: decipherHand("KH, AH"), best: [], ranking: null};
// let cp1: Player = new Player(1, "p1", ch1);
// let cp2: Player = new Player(2, "p2", ch2);
// let cd: Dealer = (new Dealer(deck)).shuffle().burn(ch1.cards).burn(ch2.cards).setFlop(decipherHand("QH, JH, AS"));
// let cplayers: Array<Player> = [cp1, cp2];
// cplayers = probability(cplayers, cd);
// console.log(cd.displayAll());
// for(const cplayer of cplayers) {
//     console.log(cplayer.name, cplayer.displayDealtCards(), cplayer.displayBestHand(), cplayer.hand?.ranking?.name, `${(cplayer.probabilityOfWinning ?? 0)*100}%`);
// }
