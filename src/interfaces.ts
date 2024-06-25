export interface IScorer<CardType, ResultType> {
    calculateSegmentScore: (cards: CardType) => ResultType;
}
