import {Card, HandRanking, Hand} from "./models";
import { writeFile } from 'fs';

/** *************************************************************** **/
/** *************************************************************** **/
/** ************************* CONSTANTS *************************** **/
/** *************************************************************** **/
/** *************************************************************** **/

const that: any = this;

const kinds: any = {
    two: 1,
    three: 2,
    four: 3,
    five: 4,
    six: 5,
    seven: 6,
    eight: 7,
    nine: 8,
    ten: 9,
    jack: 10,
    queen: 11,
    king: 12,
    ace: 13
};

const suits: any = {
    spade: 1,
    club: 2,
    diamond: 3,
    heart: 4
}

const deck: Array<Card> = [
    {suit: suits.spade, kind: kinds.two},
    {suit: suits.spade, kind: kinds.three},
    {suit: suits.spade, kind: kinds.four},
    {suit: suits.spade, kind: kinds.five},
    {suit: suits.spade, kind: kinds.six},
    {suit: suits.spade, kind: kinds.seven},
    {suit: suits.spade, kind: kinds.eight},
    {suit: suits.spade, kind: kinds.nine},
    {suit: suits.spade, kind: kinds.ten},
    {suit: suits.spade, kind: kinds.jack},
    {suit: suits.spade, kind: kinds.queen},
    {suit: suits.spade, kind: kinds.king},
    {suit: suits.spade, kind: kinds.ace},
    {suit: suits.club, kind: kinds.two},
    {suit: suits.club, kind: kinds.three},
    {suit: suits.club, kind: kinds.four},
    {suit: suits.club, kind: kinds.five},
    {suit: suits.club, kind: kinds.six},
    {suit: suits.club, kind: kinds.seven},
    {suit: suits.club, kind: kinds.eight},
    {suit: suits.club, kind: kinds.nine},
    {suit: suits.club, kind: kinds.ten},
    {suit: suits.club, kind: kinds.jack},
    {suit: suits.club, kind: kinds.queen},
    {suit: suits.club, kind: kinds.king},
    {suit: suits.club, kind: kinds.ace},
    {suit: suits.diamond, kind: kinds.two},
    {suit: suits.diamond, kind: kinds.three},
    {suit: suits.diamond, kind: kinds.four},
    {suit: suits.diamond, kind: kinds.five},
    {suit: suits.diamond, kind: kinds.six},
    {suit: suits.diamond, kind: kinds.seven},
    {suit: suits.diamond, kind: kinds.eight},
    {suit: suits.diamond, kind: kinds.nine},
    {suit: suits.diamond, kind: kinds.ten},
    {suit: suits.diamond, kind: kinds.jack},
    {suit: suits.diamond, kind: kinds.queen},
    {suit: suits.diamond, kind: kinds.king},
    {suit: suits.diamond, kind: kinds.ace},
    {suit: suits.heart, kind: kinds.two},
    {suit: suits.heart, kind: kinds.three},
    {suit: suits.heart, kind: kinds.four},
    {suit: suits.heart, kind: kinds.five},
    {suit: suits.heart, kind: kinds.six},
    {suit: suits.heart, kind: kinds.seven},
    {suit: suits.heart, kind: kinds.eight},
    {suit: suits.heart, kind: kinds.nine},
    {suit: suits.heart, kind: kinds.ten},
    {suit: suits.heart, kind: kinds.jack},
    {suit: suits.heart, kind: kinds.queen},
    {suit: suits.heart, kind: kinds.king},
    {suit: suits.heart, kind: kinds.ace}
];

const handRankings: Array<HandRanking> = [
    {name: "ROYAL FLUSH", rank: 1, check: royalFlush},
    {name: "STRAIGHT FLUSH", rank: 2, check: straightFlush},
    {name: "FOUR OF A KIND", rank: 3, check: fourOfAKind},
    {name: "FULL HOUSE", rank: 4, check: fullHouse},
    {name: "FLUSH", rank: 5, check: flush},
    {name: "STRAIGHT", rank: 6, check: straight},
    {name: "THREE OF A KIND", rank: 7, check: threeOfAKind},
    {name: "TWO PAIR", rank: 8, check: twoPair},
    {name: "ONE PAIR", rank: 9, check: onePair},
    {name: "NOTHING", rank: 10, check: nothing},
];

/** *************************************************************** **/
/** *************************************************************** **/
/** ************************** CLASSES **************************** **/
/** *************************************************************** **/
/** *************************************************************** **/

class Player {
    id: number;
    name: string;
    hand: Hand | null;
    probabilityOfWinning: number | null;
    rank: number | null;
    outs: any

    constructor(id: number = 0, name: string = "", hand: Hand | null = null, probabilityOfWinning: number | null = null, rank: number | null = null, outs: Array<Card> = []) {
        this.id = id;
        this.name = name;
        this.hand = {
            cards: [],
            best: [],
            ranking: null
        };
        this.probabilityOfWinning = probabilityOfWinning;
        this.rank = rank;
        this.outs = outs;
    }

    displayDealtCards(){
        return displayCards(this.hand?.cards ?? []);
    }

    displayBestHand(){
        return displayCards(this.hand?.best ?? []);
    }

}

class Dealer {
    deck: Array<Card>;
    negative: Array<Card>;
    all: Array<Card>;
    flop: Array<Card>;
    turn: Card | null;
    river: Card | null;

    constructor(deck: Array<Card> = [], negative: Array<Card> = [], all: Array<Card> = [], flop: Array<Card> = [], turn: Card | null = null, river: Card | null = null) {
        this.deck = deck;
        this.negative = negative;
        this.all = all;
        this.flop = flop;
        this.turn = turn;
        this.river = river;
    }

    shuffle(n: number = 1): any {
        if(n <= 0) return this;

        for (var i = this.deck.length - 1; i > 0; i--) {

            // Generate random number
            var j = Math.floor(Math.random() * (i + 1));

            var temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }

        return this.shuffle(n - 1);
    }

    drawTopCard(){
        if(!this.deck[0]) throw new Error("EMPTY DECK"); // Only possible if A LOT of players
        let card: Card = this.deck[0];
        this.negative.push(card);
        this.deck.splice(0,1);
        return card;
    }

    deal(players: Array<Player> = []){
        for (var i = 0; i < (players.length * 2); i++) {
            players[i % players.length].hand?.cards.push( this.drawTopCard() );
        }
        return players;
    }

    burn(cards: Card | Array<Card>){
        if(!Array.isArray(cards)) cards = [cards];

        let tree = buildIndexTree(this.deck);
        for(let i = 0; i < cards.length; i++) {
            let index = getTreeIndex(tree, cards[i]);
            if (!!index) {
                this.negative.push(cards[i]);
                this.deck.splice(index, 1);
            }
        }

        return this;
    }

    displayAll(){
        return `${this.displayFlop()} | ${this.displayTurn()} | ${this.displayRiver()}`;
    }

    displayFlop(){
        return displayCards(this.flop);
    }

    displayTurn(){
        return displayCard(this.turn);
    }

    displayRiver(){
        return displayCard(this.river);
    }

    executeAll(){
        let loops = (!this.flop || !this.flop.length ? 1 : 0)
                    + (!this.turn ? 1 : 0)
                    + (!this.river ? 1 : 0);

        for(let i = 0; i < loops; i++) this.executeNext();

        return this;
    }

    executeNext(){
        if(!this.flop || !this.flop.length) this.executeFlop();
        else if(!this.turn) this.executeTurn();
        else if(!this.river) this.executeRiver();
        else throw new Error("#123456789 BAD LOGIC");
        return this;
    }

    executeFlop(){
        // discard three
        this.drawTopCard();
        this.drawTopCard();
        this.drawTopCard();

        // draw three
        this.flop = [
            this.drawTopCard(),
            this.drawTopCard(),
            this.drawTopCard()
        ];

        this.flop.forEach(c => this.all.push(c));

        return this;
    }

    executeTurn(){
        // flop && river must be first
        if(!this.flop || !this.flop.length) return this; // silent exit

        this.drawTopCard(); // discard one
        this.turn = this.drawTopCard();
        this.all.push(this.turn);
        return this;
    }

    executeRiver(){
        // flop must be first
        if(!this.flop || !this.flop.length || !this.turn) return this; // silent exit

        this.drawTopCard(); // discard one
        this.river = this.drawTopCard();
        this.all.push(this.river);
        return this;
    }


}

/** *************************************************************** **/
/** *************************************************************** **/
/** *********************** ORCHESTRATORS ************************* **/
/** *************************************************************** **/
/** *************************************************************** **/

function rankHand(cards: Array<Card>, communal: Array<Card>){
    let res: Array<Card> | boolean;
    for(var i = 0; i < handRankings.length; i++){
        res = handRankings[i].check.call(that, cards.concat(communal));
        if(!!res || i == (handRankings.length - 1)) {
            return <Hand>{
                cards: cards,
                best: res,
                ranking: handRankings[i]
            };
        }
    }

    // should be unreachable
    return <Hand>{
        cards: cards,
        best: [],
        ranking: handRankings[handRankings.length - 1]
    };
}

function sortPlayersByProbability(players: Array<Player>){
    return players.sort((a: Player, b: Player) =>
        (a.probabilityOfWinning ?? 0) > (b.probabilityOfWinning ?? 0) ? -1 : 1
    );
}

function sortPlayersByHand(players: Array<Player>){
    return players.sort((a: Player, b: Player) =>
        (a.hand?.ranking?.rank ?? 0) > (b.hand?.ranking?.rank ?? 0) ? 1 : (
            (a.hand?.ranking?.rank ?? 0) < (b.hand?.ranking?.rank ?? 0) ? -1 : (
                compareHighCards(a.hand?.best ?? [], b.hand?.best ?? [])
            )
        )
    );
}

function compareHands(players: Array<Player>, communal: Array<Card>){
    for(const index in players){
        players[index].hand = rankHand(players[index].hand?.cards ?? [], communal);
    }

    return sortPlayersByHand(players);
}

function groupBy(cards: Array<Card>, groupBySuits: boolean = true){
    let retObj: any = {};
    let i: number;

    if(groupBySuits) {
        for(const j of Object.keys(suits)) retObj[suits[j]] = [];
        for(i = 0; i < cards.length; i++) retObj[cards[i].suit].push(cards[i]);
    }
    else {
        for(const j of Object.keys(kinds)) retObj[kinds[j]] = [];
        for(i = 0; i < cards.length; i++) retObj[cards[i].kind].push(cards[i]);
    }

    return retObj;
}

function buildIndexTree(cards: Array<Card>, groupBySuits: boolean = true){
    let retObj: any = {};
    let i: number;

    if(groupBySuits) {
        for(const j of Object.keys(suits)) retObj[suits[j]] = {};
        for(i = 0; i < cards.length; i++) retObj[cards[i].suit][cards[i].kind] = i;
    }
    else {
        for(const j of Object.keys(kinds)) retObj[kinds[j]] = {};
        for(i = 0; i < cards.length; i++) retObj[cards[i].kind][cards[i].suit] = i;
    }

    return retObj;
}

function getTreeIndex(tree: any, card: Card){
    if(Object.keys(tree).length == 4) return tree[ card.suit ][ card.kind ] ?? undefined;
    else return tree[ card.kind ][ card.suit ] ?? undefined;
}

function probability(players: Array<Player>, dealer: Dealer){
    let loops: number = 0;
    players.forEach(p => p.outs = []); // clear all previous calculations

    if(dealer.river){ // if the turn has been shown
        players = compareHands(players, dealer.all);
        players.forEach((p, i) => p.probabilityOfWinning = (i == 0 ? 1 : 0)); // top player has won
    }
    else {
        let i: number;
        let j: number;

        // simulate
        if(!dealer.turn){
            for(i = 0; i < dealer.deck.length; i++){

                // j starts at i because we are looking for combinations not permutation (order is irrelevant)
                // drawing the (jack of clubs) then the (queen of hearts) is the same as drawing the (queen of hearts) then the (jack of clubs)
                // then the + 1 because i can never equal j. that would mean we're drawing the same card twice
                // So, instead of the # loops being equal to i * j
                // it will be equal to (i**2 + i)/2 (which is the sum equivalent of a factorial (!i))

                for(j = (i + 1); j < dealer.deck.length; j++){
                    players = compareHands(players, dealer.all.concat(dealer.deck[i], dealer.deck[j]));
                    players[0].outs.push([dealer.deck[i], dealer.deck[j]]);
                    loops++;
                }
            }
        }
        else {
            for(i = 0; i < dealer.deck.length; i++){
                players = compareHands(players, dealer.all.concat(dealer.deck[i]));
                players[0].outs.push(dealer.deck[i]);
                loops++;
            }
        }

        players.forEach(p => {
            p.probabilityOfWinning = p.outs.length / loops;
        });

        // set best hands to actually dealt values
        // otherwise player.hand will be of hypothetical
        // values from the simulations
        // but in this function we are only concerned with the probabilities
        players = compareHands(players, dealer.all);
    }

    return sortPlayersByProbability(players);
}

/** *************************************************************** **/
/** *************************************************************** **/
/** ******************** HAND CHECKS HELPERS ********************** **/
/** *************************************************************** **/
/** *************************************************************** **/

function decipherHand(original: string){
    let strCards = original.split(",");
    let cards: Array<Card> = [];
    for(let i = 0; i < strCards.length; i++) cards.push( decipherCard(strCards[i]) );
    return cards;
}

function decipherCard(original: string){
    let suit: number = 0;
    let kind: number = 0;

    let text = original.toUpperCase();

    const _suits: any = {
        "S": suits.spade,
        "C": suits.club,
        "D": suits.diamond,
        "H": suits.heart
    }

    const _kinds: any = {
        "2": kinds.two,
        "3": kinds.three,
        "4": kinds.four,
        "5": kinds.five,
        "6": kinds.six,
        "7": kinds.seven,
        "8": kinds.eight,
        "9": kinds.nine,
        "10": kinds.ten,
        "J": kinds.jack,
        "Q": kinds.queen,
        "K": kinds.king,
        "A": kinds.ace
    };

    let suitKey: string = "";
    let suitKeys = Object.keys(_suits);
    for(let i = 0; i < suitKeys.length; i++){
        suitKey = suitKeys[i];
        if(text.indexOf(suitKey) != -1){
            suit = _suits[suitKey];
            break;
        }
    }

    if(suit == 0) throw new Error("BAD USER INPUT");

    text = text.replace(suitKey, "").trim();
    if(Object.keys(_kinds).indexOf(text) != -1) kind = _kinds[text];
    else throw new Error("BAD USER INPUT");

    return {suit: suit, kind: kind} as Card;
}

function displayCard(card: Card | null | undefined = null){
    if(!card) return "";

    const _suits: any = {
        1: "♠",
        2: "♣",
        3: "♦",
        4: "♥"
    }

    const _kinds: any = {
        1: "2",
        2: "3",
        3: "4",
        4: "5",
        5: "6",
        6: "7",
        7: "8",
        8: "9",
        9: "10",
        10: "J",
        11: "Q",
        12: "K",
        13: "A"
    };

    return `[${ _kinds[ card.kind ] }${ _suits[ card.suit ] }]`;
}

function displayCards(cards: Array<Card> = []){
    let retStr: string = "";
    for(var i = 0; i < cards.length; i++){
        retStr += displayCard( cards[i] );
    }
    return retStr;
}

function continuityCheck(a: Card, b: Card) {
    return (Math.abs(a.kind - b.kind) == 1 || Math.abs(a.kind % kinds.ace - b.kind % kinds.ace) == 1);
}

function sortByKind(cards: Array<Card>, aceIsHigh: boolean = true){
    if(aceIsHigh) return cards.sort((a: Card, b: Card) => a.kind < b.kind ? 1 : -1);
    else return cards.sort((a: Card, b: Card) => (a.kind % kinds.ace) < (b.kind % kinds.ace) ? 1 : -1);
}

function groupBySuitSortByKind(cards: Array<Card>, aceIsHigh: boolean = true){
    let groups = groupBy(cards);
    let retVal: Array<Card> = [];
    for(const key in groups) retVal = retVal.concat( sortByKind(groups[key], aceIsHigh) );
    return retVal;
}

function fillRestOfHand(best: Array<Card>, allCards: Array<Card>){
    if(best.length >= 5) {
        best = sortByKind(best);
    }
    else {

        allCards = sortByKind(allCards);
        let tree = buildIndexTree(best); // tree of best cards

        for (var i = 0; i < allCards.length; i++) {
            if (typeof getTreeIndex(tree, allCards[i]) == 'undefined') {
                best.push(allCards[i]);
                if (best.length >= 5) break;
            }
        }

    }

    return best.slice(0, 5);
}

/**
 *
 * Returns -1 if a is stronger than b
 * Returns 1 if b is stronger than a
 * Returns 0 if they are the same
 *
 * */
function compareHighCards(a: Array<Card>, b: Array<Card>){
    a = sortByKind(a);
    b = sortByKind(b);

    for(var i = 0; i < Math.max(a.length, b.length); i++){
        if(!a[i]) return 1; // b.length > a.length
        if(!b[i]) return -1; // a.length > b.length
        if(a[i].kind == b[i].kind) continue; // same kind so we skip

        return a[i].kind > b[i].kind ? -1 : 1;
    }

    return 0;
}

function numOfEachKind(cards: Array<Card>){
    let scores: any = {};
    for(const i in kinds) scores[ kinds[i] ] = {score: 0, cards: []};

    cards.forEach(card => {
        scores[ card.kind ].score++;
        scores[ card.kind ].cards.push(card);
    });

    return scores;
}

function xOfAnyKind(x: number, cards: Array<Card>){
    let scores: any = numOfEachKind(cards);

    // best scores starts with aces
    // we can assume the first x of a kind we hit is the best x of a kind
    let keys = Object.keys(scores).sort((a,b) => parseInt(a) > parseInt(b) ? 1 : -1).reverse();
    for(const key of keys){
        if(scores[ key ].score >= x) {
            return fillRestOfHand(scores[ key ].cards, cards);
        }
    }

    return false;
}

function numOfEachSuit(cards: Array<Card>){
    let scores: any = {};
    for(const i in suits) scores[ suits[i] ] = {score: 0, cards: []};

    cards.forEach(card => {
        scores[ card.suit ].score++;
        scores[ card.suit ].cards.push(card);
    });

    return scores;
}

function xOfAnySuit(x: number, cards: Array<Card>){
    let scores: any = numOfEachSuit(cards);

    for(const key in scores){
        if(scores[ key ].score >= x) {
            return fillRestOfHand(scores[ key ].cards, cards);
        }
    }

    return false;
}

/** *************************************************************** **/
/** *************************************************************** **/
/** ************************ HAND CHECKS ************************** **/
/** *************************************************************** **/
/** *************************************************************** **/

function nothing(cards: Array<Card>){
    return sortByKind(cards).slice(0, 5);
}

function onePair(cards: Array<Card>){
    return xOfAnyKind(2, cards);
}

function twoPair(cards: Array<Card>){
    let scores: any = numOfEachKind(cards);
    let best: Array<Card> = [];

    let keys = Object.keys(scores).sort((a,b) => parseInt(a) > parseInt(b) ? 1 : -1).reverse();
    for(const key of keys){
        if(scores[ key ].score == 2){
            best = best.concat(scores[key].cards);
            if ((best.length / 2) >= 2) {
                return fillRestOfHand(best, cards);
            }
        }
    }

    return false;
}

function threeOfAKind(cards: Array<Card>){
    return xOfAnyKind(3, cards);
}

function straight(cards: Array<Card>){
    let groupByKind = groupBy(cards, false);
    groupByKind[0] = groupByKind[ kinds.ace ]; // also put aces at the start for potential wheel
    let currChain: Array<Card> = groupByKind[ kinds.ace ].length ? [ groupByKind[ kinds.ace ][0] ] : [];

    // start at kings and decrement i because aces should be accounted for above
    for(var i = kinds.king; i > 0; i--){
        if(groupByKind[i-1].length && groupByKind[i].length) {
            currChain.push( groupByKind[i][0] );
        }
        else if(groupByKind[i].length){
            currChain = [ groupByKind[i][0] ];
        }
        else {
            currChain = [];
        }

        if(currChain.length >= 5) return currChain;
    }

    return false;
}

function flush(cards: Array<Card>){
    return xOfAnySuit(5, cards);
}

function fullHouse(cards: Array<Card>){
    let scores: any = numOfEachKind(cards);
    let pair: Array<Card> = [];
    let threeOfAKind: Array<Card> = [];

    // reverse order of scores so that we iterate from aces to twos
    let keys = Object.keys(scores).sort((a,b) => parseInt(a) > parseInt(b) ? 1 : -1).reverse();
    // we use the compareHighCards function in case of multiple pairs / threeOfAKind to get the best one
    for(const key of keys){
        if(
            scores[ key ].score == 3 // don't have to worry about >= 3 bc then it would be four of a kind (which is a better hand)
            && compareHighCards(threeOfAKind, scores[ key ].cards) == 1 // check to see if its worth replacing - in the case of multiple three of a kinds
        ){
            // if the threeOfAKind variable was already populated (there are multiple three of a kinds in this hand)
            // check to see if its worth putting in the pair variable
            if(!!threeOfAKind && compareHighCards(threeOfAKind, pair) == -1){
                pair = threeOfAKind.slice(0, 2);
            }
            threeOfAKind = scores[ key ].cards;
        }

        if(
            scores[ key ].score == 2
            && compareHighCards(pair, scores[ key ].cards) == 1 // double check its worth replacing with the current pair
        ){
            pair = scores[key].cards;
        }
    }

    // return hand
    return pair.length && threeOfAKind.length ? pair.concat(threeOfAKind) : false;
}

function fourOfAKind(cards: Array<Card>){
    return xOfAnyKind(4, cards);
}

function straightFlush(cards: Array<Card>){
    cards = groupBySuitSortByKind(cards);
    let prevCard: Card = cards[0];
    let currChain: Array<Card> = [ prevCard ];

    for(var i = 1; i < cards.length; i++) {
        if(prevCard.suit == cards[i].suit && continuityCheck(prevCard, cards[i])) {
            currChain.push( cards[i] );
        }
        else {
            currChain = [ cards[i] ];
        }

        if(currChain.length >= 5) return currChain;

        prevCard = cards[i];
    }

    return false;
}

function royalFlush(cards: Array<Card>){
    cards = groupBySuitSortByKind(cards);
    let prevCard: Card = cards[0];
    let currChain: Array<Card> = prevCard.kind == kinds.ace ? [ prevCard ] : [];
    let aceSuit: number = prevCard.kind == kinds.ace ? prevCard.suit : 0;

    for(var i = 1; i < cards.length; i++) {
        if(prevCard.suit == cards[i].suit && aceSuit == cards[i].suit && continuityCheck(prevCard, cards[i])) {
            currChain.push(cards[i]);
        }
        else if(cards[i].kind == kinds.ace) {
            currChain = [ cards[i] ];
            aceSuit = cards[i].suit;
        }

        if(currChain.length >= 5) return currChain;

        prevCard = cards[i];
    }

    return false;
}

/** *************************************************************** **/
/** *************************************************************** **/
/** ***************************** CSV ***************************** **/
/** *************************************************************** **/
/** *************************************************************** **/

// this should probably be streamed to avoid memory issues - but yolo 
function toCSV(data: any) {
    // Empty array for storing the values
    let csvRows: any = [];

    // Headers is basically a keys of an
    // object which is id, name, and
    // profession
    const headers = Object.keys(handRankings).map((k: any) => handRankings[k].name);

    csvRows.push("HAND," + headers.join(','));
    for(const hand in data){
        csvRows.push(
             `${hand}, ` + Object.keys(data[hand]).map((k: any) => data[hand][k].perc.toFixed(2) ).join(',')
        );
    }

    // Returning the array joining with new line
    let csvStr = csvRows.join('\n');
    // console.log(csvStr);
    writeFile("C:\\temp\\poker.csv", csvStr, 'utf8', (err) => { if(err) console.log(err); });
}

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

let p1: Player = new Player(1, "p1");
let p2: Player = new Player(2, "p2");
let p3: Player = new Player(3, "p3");
let p4: Player = new Player(4, "p4");
let p5: Player = new Player(5, "p5");
let p6: Player = new Player(6, "p6");
let d: Dealer = new Dealer(deck);
let players: Array<Player> = [p1, p2, p3, p4, p5, p6];
players = d.shuffle( Math.floor(Math.random() * 10) ).deal(players);

var i = 0;
for(var j = 0; j < 3; j++){
    console.log("");
    if(j == 0) console.log("=============== FLOP =================");
    else if(j == 1) console.log("=============== TURN =================");
    else if(j == 2) console.log("=============== RIVER =================");

    d.executeNext();
    players = probability(players, d);
    console.log(d.displayAll());
    for(i = 0; i < players.length; i++){
        console.log(players[i].name, players[i].displayDealtCards(), players[i].displayBestHand(), players[i].hand?.ranking?.name, `${(players[i].probabilityOfWinning ?? 0)*100}%`);
    }
}

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
let numSimulationsPerHand: number = 1;

// sum-equivalent of a factorial
console.log(`Running ${ ((deck.length * deck.length + deck.length)/2) * numSimulationsPerHand } simulations...`);

for(var i = 0; i < deck.length; i++){
    for(var j = (i + 1); j < deck.length; j++){
        hand = [deck[i], deck[j]];
        let h = displayCards(hand);
        if(!hands[h]) hands[h] = {'1':{name:"ROYAL FLUSH", score:0, perc:0},'2':{name:"STRAIGHT FLUSH", score:0, perc:0},'3':{name:"FOUR OF A KIND", score:0, perc:0},'4':{name:"FULL HOUSE", score:0, perc:0},'5':{name:"FLUSH", score:0, perc:0},'6':{name:"STRAIGHT", score:0, perc:0},'7':{name:"THREE OF A KIND", score:0, perc:0},'8':{name:"TWO PAIR", score:0, perc:0},'9':{name:"ONE PAIR", score:0, perc:0},'10':{name:"NOTHING", score:0, perc:0}};
        for(var k = 0; k < numSimulationsPerHand; k++){
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
// toCSV(hands);