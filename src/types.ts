import { HandType, Natural } from "./const";

export type CardCollectionScore<T> = {
    type: T;
    rank: number;
    suit: number;
};

export type SegmentScore = CardCollectionScore<HandType>;

export type NaturalScore = CardCollectionScore<number> & {
    units: number;
    name: string;
};

export type NaturalCheckResult = {
    isNatural: boolean;
    naturalScore: NaturalScore;
};

export type Hand<DataType> = {
    front: DataType;
    middle: DataType;
    back: DataType;
};

export type PlayerData = {
    hand: Hand<number[]>;
    isAlertNatural: boolean;
};

export type Settlement = {
    crack: {
        isCrack: boolean;
        score: number;
    };
    natural: {
        [key: string]: number;
    };
    royalty: Hand<Record<string, number>>;
    normal: Hand<number>;
    pusoy: {
        partial: {
            [key: string]: number;
        };
        full: number;
    };
    sum: number;
};

export type NaturalConfig = {
    name: string;
    units: number;
};

export type ScoreConfig = {
    crack: number;
    normal: number;
    royalty: Hand<Record<string, number>>;
    natural: NaturalConfig[];
    pusoy: {
        partial: number;
        full: {
            isWinnerTakeAll: boolean;
            units: number;
        };
    };
};
