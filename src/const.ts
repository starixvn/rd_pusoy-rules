import {
    Hand,
    NaturalScore,
    ScoreConfig,
    SegmentScore,
    Settlement,
} from "./types";

export enum HandTypeRank {
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

export enum HandType {
    HighCard = "highCard",
    OnePair = "onePair",
    TwoPairs = "twoPairs",
    ThreeOfAKind = "threeOfAKind",
    Straight = "straight",
    Flush = "flush",
    FullHouse = "fullHouse",
    FourOfAKind = "fourOfAKind",
    StraightFlush = "straightFlush",
    RoyalFlush = "royalFlush",
    Unknown = "",
}

export const HandTypeMap = {
    [HandTypeRank.HighCard]: HandType.HighCard,
    [HandTypeRank.OnePair]: HandType.OnePair,
    [HandTypeRank.TwoPairs]: HandType.TwoPairs,
    [HandTypeRank.ThreeOfAKind]: HandType.ThreeOfAKind,
    [HandTypeRank.Straight]: HandType.Straight,
    [HandTypeRank.Flush]: HandType.Flush,
    [HandTypeRank.FullHouse]: HandType.FullHouse,
    [HandTypeRank.FourOfAKind]: HandType.FourOfAKind,
    [HandTypeRank.StraightFlush]: HandType.StraightFlush,
    [HandTypeRank.RoyalFlush]: HandType.RoyalFlush,
    [HandTypeRank.Unknown]: HandType.Unknown,
};

export enum Natural {
    Unknown = "",
    ThreeStraights = "threeStraights",
    ThreeFlushes = "threeFlushes",
    SixPairs = "sixPairs",
    Dragon = "dragon",
}

export enum HandPosition {
    Front = "front",
    Middle = "middle",
    Back = "back",
}

export const ROYAL_STRAIGHT = "8,9,10,11,12";

export const initSettlement: Settlement = {
    crack: {
        isCrack: false,
        units: 0,
    },
    natural: {
        name: Natural.Unknown,
        units: 0,
    },
    normal: {
        front: 0,
        middle: 0,
        back: 0,
    },
    pusoy: {
        full: 0,
        mini: {},
    },
    royalty: {
        front: {
            name: HandType.Unknown,
            units: 0,
        },
        middle: {
            name: HandType.Unknown,
            units: 0,
        },
        back: {
            name: HandType.Unknown,
            units: 0,
        },
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
        mini: 0,
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
