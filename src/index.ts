import { settle } from "./settler";
import { ScoreConfig } from "./types";

const scoreConfig: ScoreConfig = {
    normalScore: 1,
    naturalScore: {
        three_flushes: 3,
        six_pairs: 6,
        dragon: 12,
    },
    crackScore: 6,
    fullPusoyScore: 6,
    pusoyScore: 3,
    royaltyScore: {
        "front.4": 3,
        "middle.7": 2,
        "middle.8": 8,
        "middle.9": 10,
        "middle.10": 20,
        "back.8": 4,
        "back.9": 5,
        "back.10": 10,
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
