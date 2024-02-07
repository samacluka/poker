export interface Card {
    suit: number,
    kind: number
}

export interface HandRanking {
    name: string,
    rank: number,
    check: Function
}

export interface Hand {
    cards: Array<Card>,
    best: Array<Card>,
    ranking: HandRanking | null
}