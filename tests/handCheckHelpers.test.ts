import {Card} from "../src/models";

import {
    kinds,
    suits,

    continuityCheck, groupBySuitSortByKind
} from '../src/poker';

const cards1: Card[] = [
    { suit: suits.heart, kind: kinds.ten },
    { suit: suits.diamond, kind: kinds.jack },
    { suit: suits.heart, kind: kinds.queen },
    { suit: suits.spade, kind: kinds.king },
    { suit: suits.club, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.two },
    { suit: suits.spade, kind: kinds.queen }
];

const cards1GroupsAndSortedAceIsHigh: Card[] = [
    { suit: suits.spade, kind: kinds.king },
    { suit: suits.spade, kind: kinds.queen },

    { suit: suits.club, kind: kinds.ace },

    { suit: suits.diamond, kind: kinds.jack },

    { suit: suits.heart, kind: kinds.ace },
    { suit: suits.heart, kind: kinds.queen },
    { suit: suits.heart, kind: kinds.ten },
    { suit: suits.heart, kind: kinds.two }
];

const cards1GroupsAndSortedAceIsLow: Card[] = [
    { suit: suits.spade, kind: kinds.king },
    { suit: suits.spade, kind: kinds.queen },

    { suit: suits.club, kind: kinds.ace },

    { suit: suits.diamond, kind: kinds.jack },

    { suit: suits.heart, kind: kinds.queen },
    { suit: suits.heart, kind: kinds.ten },
    { suit: suits.heart, kind: kinds.two },
    { suit: suits.heart, kind: kinds.ace }
];

describe('Hand Check Helpers', () => {
    test('Continuity Check', () => {
        expect(continuityCheck({suit: suits.heart, kind: kinds.two}, {suit: suits.heart, kind: kinds.three})).toEqual(true);
        expect(continuityCheck({suit: suits.spade, kind: kinds.two}, {suit: suits.club, kind: kinds.four})).toEqual(false);
        expect(continuityCheck({suit: suits.spade, kind: kinds.ace}, {suit: suits.diamond, kind: kinds.king})).toEqual(true);
        expect(continuityCheck({suit: suits.diamond, kind: kinds.ace}, {suit: suits.club, kind: kinds.two})).toEqual(true);
        expect(continuityCheck({suit: suits.diamond, kind: kinds.ace}, {suit: suits.club, kind: kinds.three})).toEqual(false);
    });

    test('Group By Suit Sort by Kind', () => {
        expect(groupBySuitSortByKind(cards1)).toEqual(cards1GroupsAndSortedAceIsHigh);
        expect(groupBySuitSortByKind(cards1, false)).toEqual(cards1GroupsAndSortedAceIsLow);
    });
});
