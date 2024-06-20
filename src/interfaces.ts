export interface IConverter<CardType, ResultType> {
    convert: (cards: CardType) => ResultType;
}

export interface ISettle<CardType, ResultType> {
    settle: (cards: CardType[][]) => ResultType;
}

export interface Score {
    value: number;
    handType: number;
}
