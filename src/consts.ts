export enum HandType {
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

export enum Natural {
    ThreeStraights = "three_straight",
    ThreeFlushes = "three_flushes",
    Dragon = "dragon",
    SuperDragon = "super_dragon",
    SixPairs = "six_pairs",
}

export enum HandPosition {
    Front = "front",
    Middle = "middle",
    Back = "back",
}

export const ROYAL_STRAIGHT = "8,9,10,11,12";
