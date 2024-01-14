import {Card} from "../src/models";

import {
    kinds,
    suits,

    nothing,
    onePair,
    twoPair,
    threeOfAKind,
    straight,
    flush,
    fullHouse,
    fourOfAKind,
    straightFlush,
    royalFlush
} from '../src/poker';

// Sample cards for testing
// Nothing
const nothingCards: Card[] = [
    { suit: suits.club, kind: kinds.ace },
    { suit: suits.spade, kind: kinds.two },
    { suit: suits.heart, kind: kinds.four },
    { suit: suits.diamond, kind: kinds.seven },
    { suit: suits.diamond, kind: kinds.ten },
    // Add more cards as needed
];

// One Pair
const onePairCards: Card[] = [
    { suit: suits.club, kind: kinds.ace },
    { suit: suits.spade, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.ten },
    { suit: suits.diamond, kind: kinds.two },
    { suit: suits.diamond, kind: kinds.six },
    // Add more cards as needed
];

// Two Pair
const twoPairCards: Card[] = [
    { suit: suits.club, kind: kinds.ace },
    { suit: suits.spade, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.ten },
    { suit: suits.diamond, kind: kinds.ten },
    { suit: suits.diamond, kind: kinds.six },
    // Add more cards as needed
];

// Three of a Kind
const threeOfAKindCards: Card[] = [
    { suit: suits.club, kind: kinds.ace },
    { suit: suits.spade, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.ace },
    { suit: suits.diamond, kind: kinds.two },
    { suit: suits.heart, kind: kinds.six },
    // Add more cards as needed
];

// Straight
const straightCards: Card[] = [
    { suit: suits.club, kind: kinds.ace },
    { suit: suits.spade, kind: kinds.two },
    { suit: suits.heart, kind: kinds.three },
    { suit: suits.diamond, kind: kinds.four },
    { suit: suits.diamond, kind: kinds.five },
    // Add more cards as needed
];

// Flush
const flushCards: Card[] = [
    { suit: suits.club, kind: kinds.ace },
    { suit: suits.club, kind: kinds.five },
    { suit: suits.club, kind: kinds.seven },
    { suit: suits.club, kind: kinds.nine },
    { suit: suits.club, kind: kinds.king },
    // Add more cards as needed
];

// Full House
const fullHouseCards: Card[] = [
    { suit: suits.club, kind: kinds.ace },
    { suit: suits.spade, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.ace },
    { suit: suits.diamond, kind: kinds.ten },
    { suit: suits.spade, kind: kinds.ten },
    // Add more cards as needed
];

// Four of a Kind
const fourOfAKindCards: Card[] = [
    { suit: suits.club, kind: kinds.ace },
    { suit: suits.spade, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.ace },
    { suit: suits.diamond, kind: kinds.ace },
    { suit: suits.diamond, kind: kinds.six },
    // Add more cards as needed
];

// Straight Flush
const straightFlushCards: Card[] = [
    { suit: suits.club, kind: kinds.ace },
    { suit: suits.club, kind: kinds.two },
    { suit: suits.club, kind: kinds.three },
    { suit: suits.club, kind: kinds.four },
    { suit: suits.club, kind: kinds.five },
    // Add more cards as needed
];

// Royal Flush
const royalFlushCards: Card[] = [
    { suit: suits.heart, kind: kinds.ten },
    { suit: suits.heart, kind: kinds.jack },
    { suit: suits.heart, kind: kinds.queen },
    { suit: suits.heart, kind: kinds.king },
    { suit: suits.heart, kind: kinds.ace },
    // Add more cards as needed
];

// More Full Houses
const multipleThreeOfAKinds: Card[] = [
    { suit: suits.heart, kind: kinds.ten },
    { suit: suits.heart, kind: kinds.ten },
    { suit: suits.heart, kind: kinds.ten },
    { suit: suits.heart, kind: kinds.king },
    { suit: suits.heart, kind: kinds.king },
    { suit: suits.heart, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.ace }
];

const replacePairWithTwoFromThreeOfAKind: Card[] = [
    { suit: suits.heart, kind: kinds.king },
    { suit: suits.heart, kind: kinds.king },
    { suit: suits.heart, kind: kinds.king },
    { suit: suits.heart, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.ace }
];


describe('Poker Hand Tests', () => {
    test('Nothing', () => {
        expect(nothing(nothingCards)).toEqual(expect.any(Array));
        expect(nothing(onePairCards)).toEqual(expect.any(Array));
        expect(nothing(twoPairCards)).toEqual(expect.any(Array));
        expect(nothing(threeOfAKindCards)).toEqual(expect.any(Array));
        expect(nothing(straightCards)).toEqual(expect.any(Array));
        expect(nothing(flushCards)).toEqual(expect.any(Array));
        expect(nothing(fullHouseCards)).toEqual(expect.any(Array));
        expect(nothing(fourOfAKindCards)).toEqual(expect.any(Array));
        expect(nothing(straightFlushCards)).toEqual(expect.any(Array));
        expect(nothing(royalFlushCards)).toEqual(expect.any(Array));
    });

    test('One Pair', () => {
        expect(onePair(nothingCards)).toEqual(false);
        expect(onePair(onePairCards)).toEqual(expect.any(Array));
        expect(onePair(twoPairCards)).toEqual(expect.any(Array));
        expect(onePair(threeOfAKindCards)).toEqual(expect.any(Array));
        expect(onePair(straightCards)).toEqual(false);
        expect(onePair(flushCards)).toEqual(false);
        expect(onePair(fullHouseCards)).toEqual(expect.any(Array));
        expect(onePair(fourOfAKindCards)).toEqual(expect.any(Array));
        expect(onePair(straightFlushCards)).toEqual(false);
        expect(onePair(royalFlushCards)).toEqual(false);
    });

    test('Two Pair', () => {
        expect(twoPair(nothingCards)).toEqual(false);
        expect(twoPair(onePairCards)).toEqual(false);
        expect(twoPair(twoPairCards)).toEqual(expect.any(Array));
        expect(twoPair(threeOfAKindCards)).toEqual(false);
        expect(twoPair(straightCards)).toEqual(false);
        expect(twoPair(flushCards)).toEqual(false);
        expect(twoPair(fullHouseCards)).toEqual(false);
        expect(twoPair(fourOfAKindCards)).toEqual(false);
        expect(twoPair(straightFlushCards)).toEqual(false);
        expect(twoPair(royalFlushCards)).toEqual(false);
    });

    test('Three of a Kind', () => {
        expect(threeOfAKind(nothingCards)).toEqual(false);
        expect(threeOfAKind(onePairCards)).toEqual(false);
        expect(threeOfAKind(twoPairCards)).toEqual(false);
        expect(threeOfAKind(threeOfAKindCards)).toEqual(expect.any(Array));
        expect(threeOfAKind(straightCards)).toEqual(false);
        expect(threeOfAKind(flushCards)).toEqual(false);
        expect(threeOfAKind(fullHouseCards)).toEqual(expect.any(Array));
        expect(threeOfAKind(fourOfAKindCards)).toEqual(expect.any(Array));
        expect(threeOfAKind(straightFlushCards)).toEqual(false);
        expect(threeOfAKind(royalFlushCards)).toEqual(false);
    });

    test('Straight', () => {
        expect(straight(nothingCards)).toEqual(false);
        expect(straight(onePairCards)).toEqual(false);
        expect(straight(twoPairCards)).toEqual(false);
        expect(straight(threeOfAKindCards)).toEqual(false);
        expect(straight(straightCards)).toEqual(expect.any(Array));
        expect(straight(flushCards)).toEqual(false);
        expect(straight(fullHouseCards)).toEqual(false);
        expect(straight(fourOfAKindCards)).toEqual(false);
        expect(straight(straightFlushCards)).toEqual(expect.any(Array));
        expect(straight(royalFlushCards)).toEqual(expect.any(Array));
    });

    test('Flush', () => {
        expect(flush(nothingCards)).toEqual(false);
        expect(flush(onePairCards)).toEqual(false);
        expect(flush(twoPairCards)).toEqual(false);
        expect(flush(threeOfAKindCards)).toEqual(false);
        expect(flush(straightCards)).toEqual(false);
        expect(flush(flushCards)).toEqual(expect.any(Array));
        expect(flush(fullHouseCards)).toEqual(false);
        expect(flush(fourOfAKindCards)).toEqual(false);
        expect(flush(straightFlushCards)).toEqual(expect.any(Array));
        expect(flush(royalFlushCards)).toEqual(expect.any(Array));
    });

    test('Full House', () => {
        expect(fullHouse(nothingCards)).toEqual(false);
        expect(fullHouse(onePairCards)).toEqual(false);
        expect(fullHouse(twoPairCards)).toEqual(false);
        expect(fullHouse(threeOfAKindCards)).toEqual(false);
        expect(fullHouse(straightCards)).toEqual(false);
        expect(fullHouse(flushCards)).toEqual(false);
        expect(fullHouse(fullHouseCards)).toEqual(expect.any(Array));
        expect(fullHouse(fourOfAKindCards)).toEqual(false);
        expect(fullHouse(straightFlushCards)).toEqual(false);
        expect(fullHouse(royalFlushCards)).toEqual(false);

        expect(fullHouse(multipleThreeOfAKinds)).toEqual([
            { suit: suits.heart, kind: kinds.king },
            { suit: suits.heart, kind: kinds.king },
            { suit: suits.heart, kind: kinds.ace },
            { suit: suits.heart, kind: kinds.ace },
            { suit: suits.heart, kind: kinds.ace }
        ]);
        expect(fullHouse(replacePairWithTwoFromThreeOfAKind)).toEqual([
            { suit: suits.heart, kind: kinds.king },
            { suit: suits.heart, kind: kinds.king },
            { suit: suits.heart, kind: kinds.ace },
            { suit: suits.heart, kind: kinds.ace },
            { suit: suits.heart, kind: kinds.ace }
        ]);
    });

    test('Four of a Kind', () => {
        expect(fourOfAKind(nothingCards)).toEqual(false);
        expect(fourOfAKind(onePairCards)).toEqual(false);
        expect(fourOfAKind(twoPairCards)).toEqual(false);
        expect(fourOfAKind(threeOfAKindCards)).toEqual(false);
        expect(fourOfAKind(straightCards)).toEqual(false);
        expect(fourOfAKind(flushCards)).toEqual(false);
        expect(fourOfAKind(fullHouseCards)).toEqual(false);
        expect(fourOfAKind(fourOfAKindCards)).toEqual(expect.any(Array));
        expect(fourOfAKind(straightFlushCards)).toEqual(false);
        expect(fourOfAKind(royalFlushCards)).toEqual(false);
    });

    test('Straight Flush', () => {
        expect(straightFlush(nothingCards)).toEqual(false);
        expect(straightFlush(onePairCards)).toEqual(false);
        expect(straightFlush(twoPairCards)).toEqual(false);
        expect(straightFlush(threeOfAKindCards)).toEqual(false);
        expect(straightFlush(straightCards)).toEqual(false);
        expect(straightFlush(flushCards)).toEqual(false);
        expect(straightFlush(fullHouseCards)).toEqual(false);
        expect(straightFlush(fourOfAKindCards)).toEqual(false);
        expect(straightFlush(straightFlushCards)).toEqual(expect.any(Array));
        expect(straightFlush(royalFlushCards)).toEqual(expect.any(Array));
    });

    test('Royal Flush', () => {
        expect(royalFlush(nothingCards)).toEqual(false);
        expect(royalFlush(onePairCards)).toEqual(false);
        expect(royalFlush(twoPairCards)).toEqual(false);
        expect(royalFlush(threeOfAKindCards)).toEqual(false);
        expect(royalFlush(straightCards)).toEqual(false);
        expect(royalFlush(flushCards)).toEqual(false);
        expect(royalFlush(fullHouseCards)).toEqual(false);
        expect(royalFlush(fourOfAKindCards)).toEqual(false);
        expect(royalFlush(straightFlushCards)).toEqual(false);
        expect(royalFlush(royalFlushCards)).toEqual(expect.any(Array));
    });
});
