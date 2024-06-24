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
    [HandType.HighCard]: "HighCard",
    [HandType.OnePair]: "OnePair",
    [HandType.TwoPairs]: "TwoPairs",
    [HandType.ThreeOfAKind]: "ThreeOfAKind",
    [HandType.Straight]: "Straight",
    [HandType.Flush]: "Flush",
    [HandType.FullHouse]: "FullHouse",
    [HandType.FourOfAKind]: "FourOfAKind",
    [HandType.StraightFlush]: "StraightFlush",
    [HandType.RoyalFlush]: "RoyalFlush",
};

export enum NaturalType {
    Unknown = 0,
    ThreeStraights = 1,
    ThreeFlushes = 2,
    SixPairs = 3,
    Dragon = 4,
}

export const NaturalDisplay = {
    [NaturalType.ThreeStraights]: "ThreeStraights",
    [NaturalType.ThreeFlushes]: "ThreeFlushes",
    [NaturalType.Dragon]: "Dragon",
    [NaturalType.SixPairs]: "SixPairs",
};

export enum HandPosition {
    Front = "front",
    Middle = "middle",
    Back = "back",
}

export const ROYAL_STRAIGHT = "8,9,10,11,12";
