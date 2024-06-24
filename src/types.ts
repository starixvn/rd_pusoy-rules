import { isCrack } from "./card-checker/crack-checker";
import { HandType, NaturalType } from "./const";

export type CardCollectionScore<T> = {
    type: T;
    rank: number;
    suit: number;
};

export type SegmentScore = CardCollectionScore<HandType>;

export type NaturalScore = CardCollectionScore<NaturalType>;

export type Hand<DataType> = {
    front: DataType;
    middle: DataType;
    back: DataType;
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

export type ScoreConfig = {
    crack: number;
    normal: number;
    royalty: Hand<Record<string, number>>;
    natural: {
        [key: string]: number;
    };
    pusoy: {
        partial: number;
        full: number;
    };
};
