import {
    Hand,
    NaturalScore,
    ScoreConfig,
    SegmentScore,
    Settlement,
} from "./types";

export enum HandType {
    Unknown = 0,
    HighCard = 1,
    OnePair = 2,
    TwoPairs = 3,
    ThreeOfAKind = 4,
    Straight = 5,
    Flush = 6,
    FullHouse = 7,
    FourOfAKind = 8,
    StraightFlush = 9,
    RoyalFlush = 10,
}

export const HandTypeDisplay = {
    [HandType.HighCard]: "highCard",
    [HandType.OnePair]: "onePair",
    [HandType.TwoPairs]: "twoPairs",
    [HandType.ThreeOfAKind]: "threeOfAKind",
    [HandType.Straight]: "straight",
    [HandType.Flush]: "flush",
    [HandType.FullHouse]: "fullHouse",
    [HandType.FourOfAKind]: "fourOfAKind",
    [HandType.StraightFlush]: "straightFlush",
    [HandType.RoyalFlush]: "royalFlush",
    [HandType.Unknown]: "unknown",
};

// export enum NaturalType {
//     Unknown = 0,
//     ThreeStraights = 1,
//     ThreeFlushes = 2,
//     SixPairs = 3,
//     Dragon = 4,
// }

export enum Natural {
    Unknown = "unknown",
    ThreeStraights = "threeStraights",
    ThreeFlushes = "threeFlushes",
    SixPairs = "sixPairs",
    Dragon = "dragon",
}

// export const NaturalDisplay = {
//     [NaturalType.ThreeStraights]: "threeStraights",
//     [NaturalType.ThreeFlushes]: "threeFlushes",
//     [NaturalType.Dragon]: "dragon",
//     [NaturalType.SixPairs]: "sixPairs",
//     [NaturalType.Unknown]: "unknown",
// };

export enum HandPosition {
    Front = "front",
    Middle = "middle",
    Back = "back",
}

export const ROYAL_STRAIGHT = "8,9,10,11,12";

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

export const initScoreConfig: ScoreConfig = {
    normal: 0,
    royalty: initRoyaltyScore,
    pusoy: {
        partial: 0,
        full: {
            isWinnerTakeAll: false,
            units: 0,
        },
    },
    crack: 0,
    natural: [],
};

export const initNaturalScore: NaturalScore = {
    rank: 0,
    suit: 0,
    type: 0,
    units: 0,
    name: Natural.Unknown,
};
