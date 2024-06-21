export type SegmentScore = {
    typeScore: number;
    rankScore: number;
    suitScore: number;
};

export type Hand<DataType> = {
    front: DataType;
    middle: DataType;
    back: DataType;
};

export type Settlement = {
    crackScore: number;
    naturalScore: {
        [key: string]: number;
    };
    royaltyScore: {
        [key: string]: number;
    };
    normalScore: Hand<number>;
    pusoyScore: {
        [key: string]: number;
    };
    fullPusoyScore: number;
    sumScore: number;
};

export type ScoreConfig = {
    crackScore: number;
    normalScore: number;
    royaltyScore: {
        [key: string]: number;
    };
    naturalScore: {
        [key: string]: number;
    };
    pusoyScore: number;
    fullPusoyScore: number;
};
