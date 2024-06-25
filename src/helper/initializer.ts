import { Hand, SegmentScore, Settlement } from "../types";

export const initSettlement: Settlement = {
    crack: {
        isCrack: false,
        score: 0,
    },
    natural: {},
    normal: {
        front: 0,
        middle: 0,
        back: 0,
    },
    pusoy: {
        full: 0,
        partial: {},
    },
    royalty: {
        front: {},
        middle: {},
        back: {},
    },
    sum: 0,
};

export const initHandScore: Hand<SegmentScore> = {
    front: {
        rank: 0,
        suit: 0,
        type: 0,
    },
    middle: {
        rank: 0,
        suit: 0,
        type: 0,
    },
    back: {
        rank: 0,
        suit: 0,
        type: 0,
    },
};

export const initNormalScore = {
    front: 0,
    middle: 0,
    back: 0,
};

export const initRoyaltyScore = {
    front: {},
    middle: {},
    back: {},
};
