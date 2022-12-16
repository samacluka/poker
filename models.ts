export interface Card {
    suit: number,
    kind: number
}

export interface HandRanking {
    name: string,
    ranking: number,
    check: any
}

export interface Player {
    id: number,
    name: string,
    hand: Array<Card>,
    probabilityOfWinning: number,
    handRanking: HandRanking,
    rank: number
}

export interface Dealer {
    deck: Array<Card>,
    negative: Array<Card>,
    all: Array<Card>,
    flop: Array<Card>,
    river: Card,
    turn: Card
}