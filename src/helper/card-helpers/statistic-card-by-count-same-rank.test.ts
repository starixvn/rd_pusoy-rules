import { statisticCardByCountSameRank } from "./statistic-card-by-count-same-rank";

describe(statisticCardByCountSameRank.name, () => {
    test.each([
        [
            [33, 34, 23, 24, 30],
            new Map([
                [2, [33, 34]],
                [1, [23, 24, 30]],
            ]),
        ],
        [[2, 22, 31, 37, 41], new Map([[1, [2, 22, 31, 37, 41]]])],
    ])("Cards %j should return %o", (cards, expected) => {
        const actual = statisticCardByCountSameRank(cards);

        expect(actual).toStrictEqual(expected);
    });
});
