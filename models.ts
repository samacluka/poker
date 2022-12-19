export interface Card {
    suit: number,
    kind: number
}

export interface HandRanking {
    name: string,
    rank: number,
    check: any
}

export interface Hand {
    cards: Array<Card>,
    best: Array<Card> | null,
    ranking: HandRanking | null
}