export interface Card {
    suit: number,
    kind: number
}

export interface HandRanking {
    name: string,
    ranking: number,
    check: any
}

export interface Hand {
    cards: Array<Card>,
    ranking: HandRanking | null
}

export interface Player {
    id: number,
    name: string,
    hand: Hand,
    probabilityOfWinning: number | null,
    rank: number | null
}

export interface Dealer {
    deck: Array<Card>,
    negative: Array<Card>,
    all: Array<Card>,
    flop: Array<Card>,
    river: Card | null,
    turn: Card | null
}

export interface KindScore {
    two: {score: number, cards: Array<Card>},
    three: {score: number, cards: Array<Card>},
    four: {score: number, cards: Array<Card>},
    five: {score: number, cards: Array<Card>},
    six: {score: number, cards: Array<Card>},
    seven: {score: number, cards: Array<Card>},
    eight: {score: number, cards: Array<Card>},
    nine: {score: number, cards: Array<Card>},
    ten: {score: number, cards: Array<Card>},
    jack: {score: number, cards: Array<Card>},
    queen: {score: number, cards: Array<Card>},
    king: {score: number, cards: Array<Card>},
    ace: {score: number, cards: Array<Card>}
}

export interface SuitScore {
    spade: {score: number, cards: Array<Card>},
    club: {score: number, cards: Array<Card>},
    diamond: {score: number, cards: Array<Card>},
    heart: {score: number, cards: Array<Card>}
}