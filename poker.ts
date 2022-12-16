import {Card, Dealer, HandRanking, Player, KindScore, SuitScore} from "./models";

/** *************************************************************** **/
/** *************************************************************** **/
/** ************************* CONSTANTS *************************** **/
/** *************************************************************** **/
/** *************************************************************** **/

const that: any = this;

const kinds = {
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

const kindsInv = {
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

const suits = {
    spade: 1,
    club: 2,
    diamond: 3,
    heart: 4
}

const suitsInv = {
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
    {name: "ROYAL FLUSH", ranking: 1, check: royalFlush},
    {name: "STRAIGHT FLUSH", ranking: 2, check: straightFlush},
    {name: "FOUR OF A KIND", ranking: 3, check: fourOfAKind},
    {name: "FULL HOUSE", ranking: 4, check: fullHouse},
    {name: "FLUSH", ranking: 5, check: flush},
    {name: "STRAIGHT", ranking: 6, check: straight},
    {name: "THREE OF A KIND", ranking: 7, check: threeOfAKind},
    {name: "TWO PAIR", ranking: 8, check: twoPair},
    {name: "ONE PAIR", ranking: 9, check: onePair},
    // {name: "HIGH CARD", ranking: 10, check: highCard}
    {name: "NOTHING", ranking: -1, check: null},
];

/** *************************************************************** **/
/** *************************************************************** **/
/** *********************** ORCHESTRATORS ************************* **/
/** *************************************************************** **/
/** *************************************************************** **/

function rankHand(cards: Array<Card>){
    let i: number;
    let res: Array<Card> | boolean;
    for(i = 0; i < handRankings.length; i++){
        res = handRankings[i].check.call(that, cards);
        if(!!res) return handRankings[i];
    }
    return handRankings[handRankings.length];
}

function compareHands(players: Array<Player>){
    for(const index in players){
        players[index].hand.ranking = rankHand(players[index].hand.cards);
    }

    return players.sort((a: Player, b: Player) => a.hand.ranking > b.hand.ranking ? 1 : -1 );
}

function buildIndexTree(deck: Array<Card>){
    let retObj: { [key: number]: { [key: number]: number } } = {};
    retObj[suits.spade] = {};
    retObj[suits.club] = {};
    retObj[suits.diamond] = {};
    retObj[suits.heart] = {};

    for(const i in deck){
        retObj[deck[i].suit][deck[i].kind] = parseInt(i);
    }

    return retObj;
}

function probability(players: Array<Player>, dealer: Dealer){
    let dealersDeck: Array<Card> = dealer.deck;
    let negativeDeck: Array<Card> = dealer.negative;
    let tree = buildIndexTree(dealersDeck);
    let cardIndexesToRemoveFromDeck = [];
    let cp: Player;
    let p: Player;
    let c: Card;
    let i: number;

    // build probabilities for each player
    for(const cpi in players){
        // init
        dealersDeck = dealer.deck;
        negativeDeck = dealer.negative;
        cp = players[cpi];

        // build negative deck
        for(const pi in players){
            p = players[pi]
            for(const ci in p.hand){
                c = p.hand[ci];
                i = tree[c.suit][c.kind];
                if(cardIndexesToRemoveFromDeck.indexOf(i) != -1) continue;
                negativeDeck.push(dealersDeck[i]);
                cardIndexesToRemoveFromDeck.push(i);
            }
        }

        for(const ci in dealer.all){
            c = dealer.all[ci];
            i = tree[c.suit][c.kind];
            if(cardIndexesToRemoveFromDeck.indexOf(i) != -1) continue;
            negativeDeck.push(dealersDeck[i]);
            cardIndexesToRemoveFromDeck.push(i);
        }
    }

    cardIndexesToRemoveFromDeck.sort((a,b) => a > b ? 1 : -1);
    for(const j in cardIndexesToRemoveFromDeck) dealersDeck.splice(parseInt(j), 1);

}

/** *************************************************************** **/
/** *************************************************************** **/
/** ******************** HAND CHECKS HELPERS ********************** **/
/** *************************************************************** **/
/** *************************************************************** **/

function continuityCheck(a: Card, b: Card) {
    return (Math.abs(a.kind - b.kind) == 1 || Math.abs(a.kind % kinds.ace - b.kind % kinds.ace) == 1);
}

function sortByRank(cards: Array<Card>, aceIsHigh: boolean = true){
    if(aceIsHigh) return cards.sort((a: Card, b: Card) => a.kind < b.kind ? 1 : -1);
    else return cards.sort((a: Card, b: Card) => (a.kind % kinds.ace) < (b.kind % kinds.ace) ? 1 : -1);
}

function groupBySuitSortByRank(cards: Array<Card>, aceIsHigh: boolean = true){
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
            sortByRank(groups[key], aceIsHigh)
        );
    }
    return retVal;
}

function numOfEachKind(cards: Array<Card>){
    let scores: KindScore = {
        two: {score: 0, cards: []},
        three: {score: 0, cards: []},
        four: {score: 0, cards: []},
        five: {score: 0, cards: []},
        six: {score: 0, cards: []},
        seven: {score: 0, cards: []},
        eight: {score: 0, cards: []},
        nine: {score: 0, cards: []},
        ten: {score: 0, cards: []},
        jack: {score: 0, cards: []},
        queen: {score: 0, cards: []},
        king: {score: 0, cards: []},
        ace: {score: 0, cards: []}
    };

    cards.forEach(card => {
        scores[ kindsInv[ card.kind ] ].score++;
        scores[ kindsInv[ card.kind ] ].cards.push(card);
        return;
    });

    return scores;
}

function xOfAnyKind(x: number, cards: Array<Card>){
    let scores: KindScore = numOfEachKind(cards);

    for(const key in scores){
        if(scores[ key ].score >= x) return scores[ key ].cards;
    }

    return false;
}

function numOfEachSuit(cards: Array<Card>){
    let scores: SuitScore = {
        spade: {score: 0, cards: []},
        club: {score: 0, cards: []},
        diamond: {score: 0, cards: []},
        heart: {score: 0, cards: []}
    };

    cards.forEach(card => {
        scores[ suitsInv[ card.suit ] ].score++;
        scores[ suitsInv[ card.suit ] ].cards.push(card);
        return;
    });

    return scores;
}

function xOfAnySuit(x: number, cards: Array<Card>){
    let scores: SuitScore = numOfEachSuit(cards);

    for(const key in scores){
        if(scores[ key ].score >= x) return scores[ key ].cards;
    }

    return false;
}

function longestConsecutiveSuitChainLength(cards: Array<Card>){
    let currChain: Array<Card> = [];
    let longestChain: Array<Card> = [];
    let prevCard: Card = cards[0];
    let i: number;

    for(i = 1; i < cards.length; i++) {
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

function onePair(cards: Array<Card>){
    return xOfAnyKind(2, cards);
}

function twoPair(cards: Array<Card>){
    let scores: KindScore = numOfEachKind(cards);
    let numPairs: number = 0;

    for(const key in scores){
        if(scores[ key ].score >= 2) numPairs++;
    }

    return numPairs >= 2;
}

function threeOfAKind(cards: Array<Card>){
    return xOfAnyKind(3, cards);
}

function straight(cards: Array<Card>){
    cards = sortByRank(cards);
    let chain: Array<Card> | boolean = longestConsecutiveSuitChainLength(cards);
    if(!!chain && chain.length >= 5) return chain;

    cards = sortByRank(cards, false);
    chain = longestConsecutiveSuitChainLength(cards);
    if(!!chain && chain.length >= 5) return chain;
}

function flush(cards: Array<Card>){
    return xOfAnySuit(5, cards);
}

function fullHouse(cards: Array<Card>){
    let scores: KindScore = numOfEachKind(cards);
    let pair: boolean = false;
    let threeOfAKind: boolean = false;

    for(const key in scores){
        if(scores[ key ].score == 2) pair = true;
        if(scores[ key ].score == 3) threeOfAKind = true;
    }

    return pair && threeOfAKind;
}

function fourOfAKind(cards: Array<Card>){
    return xOfAnyKind(4, cards);
}

function straightFlush(cards: Array<Card>){
    cards = groupBySuitSortByRank(cards);
    let currChain: Array<Card> = [];
    let prevCard: Card = cards[0];
    let i: number;

    for(i = 1; i < cards.length; i++) {
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
    cards = groupBySuitSortByRank(cards);
    let currChain: Array<Card> = [];
    let prevCard: Card = cards[0];
    let aceSuit: number = prevCard.kind == kinds.ace ? prevCard.suit : 0;
    let i: number;

    for(i = 1; i < cards.length; i++) {
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

let p1: Player = {
    id: 1,
    name: "Chris",
    hand: {
        cards: [
            {suit: suits.spade, kind: kinds.ace},
            {suit: suits.club, kind: kinds.ace},
        ],
        ranking: null
    },
    probabilityOfWinning: null,
    rank: null
};

let p2: Player = {
    id: 2,
    name: "Brodie",
    hand: {
        cards: [
            {suit: suits.heart, kind: kinds.eight},
            {suit: suits.heart, kind: kinds.nine},
        ],
        ranking: null
    },
    probabilityOfWinning: null,
    rank: null
};

let dealer: Dealer = {
    deck: deck,
    negative: [],
    all: [],
    flop: [],
    river: null,
    turn: null
}

probability([p1,p2], dealer);
