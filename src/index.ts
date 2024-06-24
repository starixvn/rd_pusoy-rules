import { settle } from "./settler";
import { ScoreConfig } from "./types";
import "./helper/map-helpers";

const scoreConfig: ScoreConfig = {
    normal: 1,
    natural: {
        ThreeFlushes: 3,
        SixPairs: 6,
        Dragon: 12,
    },
    crack: 6,
    pusoy: {
        partial: 3,
        full: 6,
    },
    royalty: {
        front: {
            FourOfAKind: 3,
        },
        middle: {
            FullHouse: 2,
            FourOfAKind: 8,
            StraightFlush: 10,
            RoyalFlush: 20,
        },
        back: {
            FourOfAKind: 4,
            StraightFlush: 5,
            RoyalFlush: 10,
        },
    },
};

const p1 = {
    front: [20, 33, 46],
    middle: [1, 3, 12, 41, 45],
    back: [4, 5, 6, 7, 29],
};

const p2 = {
    front: [40, 47, 49],
    middle: [10, 14, 34, 37, 38],
    back: [30, 35, 36, 44, 43],
};

const p3 = {
    front: [32, 28, 50],
    middle: [0, 8, 9, 2, 42],
    back: [24, 25, 27, 16, 17],
};

console.log(settle([p1, p2, p3], scoreConfig));
