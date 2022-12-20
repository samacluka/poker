import {Card, HandRanking, Hand} from "./models";

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

const kindsInv: any = {
    1: "two",
    2: "three",
    3: "four",
    4: "five",
    5: "six",
    6: "seven",
    7: "eight",
    8: "nine",
    9: "ten",
    10: "jack",
    11: "queen",
    12: "king",
    13: "ace"
};

const suits: any = {
    spade: 1,
    club: 2,
    diamond: 3,
    heart: 4
}

const suitsInv: any = {
    1: "spade",
    2: "club",
    3: "diamond",
    4: "heart"
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

let handRankings: Array<HandRanking> = [
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
    river: Card | null;
    turn: Card | null;

    constructor(deck: Array<Card> = [], negative: Array<Card> = [], all: Array<Card> = [], flop: Array<Card> = [], river: Card | null = null, turn: Card | null = null) {
        this.deck = deck;
        this.negative = negative;
        this.all = all;
        this.flop = flop;
        this.river = river;
        this.turn = turn;
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

    displayAll(){
        return `${this.displayFlop()} | ${this.displayRiver()} | ${this.displayTurn()}`;
    }

    displayFlop(){
        return displayCards(this.flop);
    }

    displayRiver(){
        return displayCard(this.river);
    }

    displayTurn(){
        return displayCard(this.turn);
    }

    executeNext(){
        if(!this.flop.length) this.executeFlop();
        else if(!this.river) this.executeRiver();
        else if(!this.turn) this.executeTurn();
        else throw new Error("#123456789 BAD LOGIC");
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

    executeRiver(){
        // flop must be first
        if(!this.flop) return this; // silent exit

        this.drawTopCard(); // discard one
        this.river = this.drawTopCard();
        this.all.push(this.river);
        return this;
    }

    executeTurn(){
        // flop && river must be first
        if(!this.flop.length || !this.river) return this; // silent exit

        this.drawTopCard(); // discard one
        this.turn = this.drawTopCard();
        this.all.push(this.turn);
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

function buildIndexTree(cards: Array<Card>){
    let retObj: any = {};
    retObj[suits.spade] = {};
    retObj[suits.club] = {};
    retObj[suits.diamond] = {};
    retObj[suits.heart] = {};

    for(var i = 0; i < cards.length; i++){
        retObj[ cards[i].suit ][ cards[i].kind ] = i;
    }

    return retObj;
}

function getTreeIndex(tree: any, card: Card){
    return tree[ card.suit ][ card.kind ] ?? undefined;
}

function probability(players: Array<Player>, dealer: Dealer){
    let loops: number = 0;
    players.forEach(p => p.outs = []); // clear all previous calculations

    if(dealer.turn){ // if the turn has been shown
        players = compareHands(players, dealer.all);
        players.forEach((p, i) => p.probabilityOfWinning = (i == 0 ? 1 : 0)); // top player has won
    }
    else {
        // simulate
        for(var i = 0; i < dealer.deck.length; i++){
            if(!dealer.river){
                // j starts at i because we are looking for combinations not permutation
                // that is, order is irrelevant
                // drawing the (jack of clubs) then the (queen of hearts) is the same as drawing the (queen of hearts) then the (jack of clubs)
                // then the + 1 because i can never equal j. that would mean we're drawing the same card twice
                // So, instead of the # loops being equal to i * j
                // it will be equal to (i**2 + i)/2
                for(var j = (i + 1); j < dealer.deck.length; j++){
                    players = compareHands(players, dealer.all.concat(dealer.deck[i], dealer.deck[j]));
                    // if(players[0].outs.indexOf([dealer.deck[i], dealer.deck[j]]) == -1) {
                        players[0].outs.push([dealer.deck[i], dealer.deck[j]]);
                        loops++;
                    // }
                }
            }
            else {
                players = compareHands(players, dealer.all.concat(dealer.deck[i]));
                // if(players[0].outs.indexOf(dealer.deck[i]) == -1) {
                    players[0].outs.push(dealer.deck[i]);
                    loops++;
                // }
            }
        }

        players.forEach(p => {
            p.probabilityOfWinning = p.outs.length / loops;
        });
    }

    return sortPlayersByProbability(players);
}

/** *************************************************************** **/
/** *************************************************************** **/
/** ******************** HAND CHECKS HELPERS ********************** **/
/** *************************************************************** **/
/** *************************************************************** **/

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
    let groups: { [key: string]: Array<Card> } = {
        spade: [],
        club: [],
        diamond: [],
        heart: []
    };

    cards.forEach(card => {
        groups[ suitsInv[ card.suit ] ].push(card);
    });

    let retVal: Array<Card> = [];
    for(const key in groups){
        retVal = retVal.concat(
            sortByKind(groups[key], aceIsHigh)
        );
    }
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

function compareHighCards(a: Array<Card>, b: Array<Card>){
    a = sortByKind(a);
    b = sortByKind(b);

    for(var i = 0; i < Math.max(a.length, b.length); i++){
        if(!a[i]) return -1; // b.length > a.length
        if(!b[i]) return 1; // a.length > b.length
        if(a[i].kind == b[i].kind) continue; // same kind so we skip

        return a[i].kind > b[i].kind ? -1 : 1;
    }

    return 0;
}

function numOfEachKind(cards: Array<Card>){
    let scores: any = {
        ace: {score: 0, cards: []},
        king: {score: 0, cards: []},
        queen: {score: 0, cards: []},
        jack: {score: 0, cards: []},
        ten: {score: 0, cards: []},
        nine: {score: 0, cards: []},
        eight: {score: 0, cards: []},
        seven: {score: 0, cards: []},
        six: {score: 0, cards: []},
        five: {score: 0, cards: []},
        four: {score: 0, cards: []},
        three: {score: 0, cards: []},
        two: {score: 0, cards: []},
    };

    cards.forEach(card => {
        scores[ kindsInv[ card.kind ] ].score++;
        scores[ kindsInv[ card.kind ] ].cards.push(card);
    });

    return scores;
}

function xOfAnyKind(x: number, cards: Array<Card>){
    let scores: any = numOfEachKind(cards);

    // best scores starts with aces
    // we can assume the first x of a kind we hit is the best x of a kind
    for(const key in scores){
        if(scores[ key ].score >= x) {
            return fillRestOfHand(scores[ key ].cards, cards);
        }
    }

    return false;
}

function numOfEachSuit(cards: Array<Card>){
    let scores: any = {
        spade: {score: 0, cards: []},
        club: {score: 0, cards: []},
        diamond: {score: 0, cards: []},
        heart: {score: 0, cards: []}
    };

    cards.forEach(card => {
        scores[ suitsInv[ card.suit ] ].score++;
        scores[ suitsInv[ card.suit ] ].cards.push(card);
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

function longestConsecutiveKindChain(cards: Array<Card>){
    let prevCard: Card = cards[0];
    let currChain: Array<Card> = [ prevCard ];
    let longestChain: Array<Card> = [ prevCard ];

    for(var i = 1; i < cards.length; i++) {
        if(continuityCheck(prevCard, cards[i])) {
            currChain.push( cards[i] );
        }
        else {
            currChain = [ cards[i] ];
        }

        if(currChain.length > longestChain.length) longestChain = currChain;

        prevCard = cards[i];
    }

    return longestChain;
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

    for(const key in scores){
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
    cards = sortByKind(cards);
    let chain: Array<Card> | boolean = longestConsecutiveKindChain(cards);
    if(!!chain && chain.length >= 5) return chain;

    cards = sortByKind(cards, false);
    chain = longestConsecutiveKindChain(cards);
    if(!!chain && chain.length >= 5) return chain;

    return false;
}

function flush(cards: Array<Card>){
    return xOfAnySuit(5, cards);
}

function fullHouse(cards: Array<Card>){
    let scores: any = numOfEachKind(cards);
    let pair: Array<Card> = [];
    let threeOfAKind: Array<Card> = [];

    // we use the compareHighCards function in case of multiple pairs / threeOfAKind to get the best one
    for(const key in scores){
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
    let currChain: Array<Card> = [];
    let prevCard: Card = cards[0];

    for(var i = 1; i < cards.length; i++) {
        if(prevCard.suit == cards[i].suit && continuityCheck(prevCard, cards[i])) {
            currChain.push( cards[i] );
        }
        else {
            currChain = [ cards[i] ];
        }

        if(currChain.length > 5) return currChain;

        prevCard = cards[i];
    }

    return false;
}

function royalFlush(cards: Array<Card>){
    cards = groupBySuitSortByKind(cards);
    let currChain: Array<Card> = [];
    let prevCard: Card = cards[0];
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
/** ************************* PLAY ZONE *************************** **/
/** *************************************************************** **/
/** *************************************************************** **/


let p1: Player = new Player(1, "p1");
let p2: Player = new Player(2, "p2");
let p3: Player = new Player(3, "p3");
let p4: Player = new Player(4, "p4");
let p5: Player = new Player(5, "p5");
let p6: Player = new Player(6, "p6");
let d: Dealer = new Dealer(deck);
// let players: Array<Player> = [p1, p2];
let players: Array<Player> = [p1, p2, p3, p4, p5, p6];
players = d.shuffle( Math.floor(Math.random() * 10) ).deal(players);

var i = 0;
for(var j = 0; j < 3; j++){
    console.log("");
    if(j == 0) console.log("=============== FLOP =================");
    else if(j == 1) console.log("=============== RIVER =================");
    else if(j == 2) console.log("=============== TURN =================");

    d.executeNext();
    players = probability(players, d);
    console.log(d.displayAll());
    for(i = 0; i < players.length; i++){
        console.log(players[i].name, players[i].displayDealtCards(), players[i].displayBestHand(), players[i].hand?.ranking?.name, `${(players[i].probabilityOfWinning ?? 0)*100}%`);
    }
}

/// TESTING TESTING

// let cards: Array<Card> = [
//     {suit: suits.diamond, kind: kinds.five},
//     {suit: suits.club, kind: kinds.four},
// ];
// let communal: Array<Card> = [
//     {suit: suits.diamond, kind: kinds.ten},
//     {suit: suits.club, kind: kinds.six},
//     {suit: suits.spade, kind: kinds.king},
//     {suit: suits.diamond, kind: kinds.king},
// ];
//
// console.log(rankHand(cards, communal));
