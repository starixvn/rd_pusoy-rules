import { HandType, HandTypeRank, Natural } from "./const";

export type CardCollectionScore<T> = {
    type: T;
    rank: number;
    suit: number;
};

export type SegmentScore = CardCollectionScore<HandTypeRank>;

export type NaturalScore = CardCollectionScore<number> & NaturalUnit;

export type PusoyGameUnit<T> = {
    units: number;
    name: T;
};

export type NaturalUnit = PusoyGameUnit<Natural>;

export type RoyaltyUnit = PusoyGameUnit<HandType>;

export type NaturalCheckResult = {
    isNatural: boolean;
    naturalScore: NaturalScore;
};

export type Hand<DataType> = {
    front: DataType;
    middle: DataType;
    back: DataType;
};

export type Settlement = {
    crack: {
        isCrack: boolean;
        units: number;
    };
    natural: NaturalUnit;
    royalty: Hand<RoyaltyUnit>;
    normal: Hand<number>;
    pusoy: {
        mini: {
            [key: string]: number;
        };
        full: number;
    };
    sum: number;
};

export type ScoreConfig = {
    crack: number;
    normal: number;
    royalty: Hand<Record<string, number>>;
    natural: NaturalUnit[];
    pusoy: {
        mini: number;
        full: {
            isWinnerTakeAll: boolean;
            units: number;
        };
    };
};
