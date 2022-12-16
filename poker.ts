import {Card, Dealer, HandRanking, Player} from "./models";

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

const suits = {
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
    for(i = 0; i < handRankings.length; i++){
        if(handRankings[i].check.call(that, cards)) return handRankings[i];
    }
    return handRankings[handRankings.length];
}

function compareHands(players: Array<Player>){
    for(const index in players){
        players[index].handRanking = rankHand(players[index].hand);
    }

    return players.sort((a: Player, b: Player) => a.handRanking.ranking > b.handRanking.ranking ? 1 : -1 );
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

    console.log(negativeDeck);
    console.log(dealersDeck.length);
}

/** *************************************************************** **/
/** *************************************************************** **/
/** ******************** HAND CHECKS HELPERS ********************** **/
/** *************************************************************** **/
/** *************************************************************** **/

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
        switch(card.suit){
            case suits.spade: groups.spade.push(card); break;
            case suits.club: groups.club.push(card); break;
            case suits.diamond: groups.diamond.push(card); break;
            case suits.heart: groups.heart.push(card); break;
        }
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
    let score: { [key: string]: number } = {
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0,
        seven: 0,
        eight: 0,
        nine: 0,
        ten: 0,
        jack: 0,
        queen: 0,
        king: 0,
        ace: 0
    };

    cards.forEach(card => {
        switch(card.kind){
            case kinds.two: score.two++; break;
            case kinds.three: score.three++; break;
            case kinds.four: score.four++; break;
            case kinds.five: score.five++; break;
            case kinds.six: score.six++; break;
            case kinds.seven: score.seven++; break;
            case kinds.eight: score.eight++; break;
            case kinds.nine: score.nine++; break;
            case kinds.ten: score.ten++; break;
            case kinds.jack: score.jack++; break;
            case kinds.queen: score.queen++; break;
            case kinds.king: score.king++; break;
            case kinds.ace: score.ace++; break;
        }
    });

    return score;
}

function xOfAnyKind(x: number, cards: Array<Card>){
    let scores: { [key: string]: number } = numOfEachKind(cards);

    for(const key in scores){
        if(scores[ key ] >= x) return true;
    }

    return false;
}

function numOfEachSuit(cards: Array<Card>){
    let score: { [key: string]: number } = {
        spade: 0,
        club: 0,
        diamond: 0,
        heart: 0
    };

    cards.forEach(card => {
        switch(card.suit){
            case suits.spade: score.spade++; break;
            case suits.club: score.club++; break;
            case suits.diamond: score.diamond++; break;
            case suits.heart: score.heart++; break;
        }
    });

    return score;
}

function xOfAnySuit(x: number, cards: Array<Card>){
    let scores: { [key: string]: number } = numOfEachSuit(cards);

    for(const key in scores){
        if(scores[ key ] >= x) return true;
    }

    return false;
}

function continuityCheck(a: Card, b: Card) {
    return (Math.abs(a.kind - b.kind) == 1 || Math.abs(a.kind % kinds.ace - b.kind % kinds.ace) == 1);
}

function longestConsecutiveSuitChainLength(cards: Array<Card>, sortCards: boolean = true){
    if(sortCards) cards = sortByRank(cards);
    let maxChainLength: number = 0;
    let currChainLength: number = 0; // either gets incremented or set to 1 in the first loop iteration
    let prevCard: Card = cards[0];
    let i: number;

    for(i = 1; i < cards.length; i++) {
        if(continuityCheck(prevCard, cards[i])) currChainLength++;
        else currChainLength = 1;
        if(currChainLength > maxChainLength) maxChainLength = currChainLength;
        prevCard = cards[i];
    }

    return maxChainLength;
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
    let scores: { [key: string]: number } = numOfEachKind(cards);
    let numPairs: number = 0;

    for(const key in scores){
        if(scores[ key ] >= 2) numPairs++;
    }

    return numPairs >= 2;
}

function threeOfAKind(cards: Array<Card>){
    return xOfAnyKind(3, cards);
}

function straight(cards: Array<Card>){
    if(longestConsecutiveSuitChainLength(cards) >= 5) return true;
    return longestConsecutiveSuitChainLength(sortByRank(cards, false), false) >= 5;
}

function flush(cards: Array<Card>){
    return xOfAnySuit(5, cards);
}

function fullHouse(cards: Array<Card>){
    let scores: { [key: string]: number } = numOfEachKind(cards);
    let pair: boolean = false;
    let threeOfAKind: boolean = false;

    for(const key in scores){
        if(scores[ key ] == 2) pair = true;
        if(scores[ key ] == 3) threeOfAKind = true;
    }

    return pair && threeOfAKind;
}

function fourOfAKind(cards: Array<Card>){
    return xOfAnyKind(4, cards);
}

function straightFlush(cards: Array<Card>){
    cards = groupBySuitSortByRank(cards);
    let maxChainLength: number = 0;
    let currChainLength: number = 0; // either gets incremented or set to 1 in the first loop iteration
    let prevCard: Card = cards[0];
    let i: number;

    for(i = 1; i < cards.length; i++) {
        if(prevCard.suit == cards[i].suit && continuityCheck(prevCard, cards[i])) currChainLength++;
        else currChainLength = 1;
        if(currChainLength > maxChainLength) maxChainLength = currChainLength;
        prevCard = cards[i];
    }

    return maxChainLength >= 5;
}

function royalFlush(cards: Array<Card>){
    cards = groupBySuitSortByRank(cards);
    let currChainLength: number = 0; // either gets incremented or set to 1 in the first loop iteration
    let prevCard: Card = cards[0];
    let aceSuit: number = prevCard.kind == kinds.ace ? prevCard.suit : 0;
    let i: number;

    for(i = 1; i < cards.length; i++) {
        if(prevCard.suit == cards[i].suit && aceSuit == cards[i].suit && continuityCheck(prevCard, cards[i])) {
            currChainLength++;
        }
        else {
            currChainLength = (cards[i].kind == kinds.ace ? 1 : 0);
            aceSuit = cards[i].suit;
        }

        if(currChainLength >= 5) return true;

        prevCard = cards[i];
    }

    return false;
}

let p1: Player = {
    id: 1,
    name: "Chris",
    hand: [
        {suit: suits.spade, kind: kinds.ace},
        {suit: suits.club, kind: kinds.ace},
    ],
    probabilityOfWinning: -1,
    handRanking: handRankings[handRankings.length -1],
    rank: -1
};

let p2: Player = {
    id: 2,
    name: "Brodie",
    hand: [
        {suit: suits.heart, kind: kinds.eight},
        {suit: suits.heart, kind: kinds.nine},
    ],
    probabilityOfWinning: -1,
    handRanking: handRankings[handRankings.length -1],
    rank: -1
};

let dealer: Dealer = {
    deck: deck,
    negative: [],
    all: [],
    flop: [],
    river: {suit: -1, kind: -1},
    turn: {suit: -1, kind: -1}
}

probability([p1,p2], dealer);
