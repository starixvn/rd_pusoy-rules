import { Hand } from "./types";

export interface IScorer<CardType, ResultType, NaturalCheckResult> {
    calculateSegmentScore: (cards: CardType) => ResultType;
    isCrack: (handScore: Hand<ResultType>) => boolean;
    checkNatural: (
        hand: Hand<CardType>,
        handScore: Hand<ResultType>,
        naturalConfig: Record<string, number>,
    ) => NaturalCheckResult;
}

export interface INaturalChecker<CardType, ResultType> {
    calculateSegmentScore: (cards: CardType) => ResultType;
}
