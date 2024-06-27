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

export enum NaturalType {
    Unknown = 0,
    ThreeStraights = 1,
    ThreeFlushes = 2,
    SixPairs = 3,
    Dragon = 4,
}

export const NaturalDisplay = {
    [NaturalType.ThreeStraights]: "threeStraights",
    [NaturalType.ThreeFlushes]: "threeFlushes",
    [NaturalType.Dragon]: "dragon",
    [NaturalType.SixPairs]: "sixPairs",
    [NaturalType.Unknown]: "unknown",
};

export enum HandPosition {
    Front = "front",
    Middle = "middle",
    Back = "back",
}

export const ROYAL_STRAIGHT = "8,9,10,11,12";
