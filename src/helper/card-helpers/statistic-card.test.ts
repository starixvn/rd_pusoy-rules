import { statisticCard } from "./statistic-card";

describe(statisticCard.name, () => {
    test.each([
        [
            [6, 24, 25, 46, 50],
            {
                rankMap: new Map([
                    [1, [2]],
                    [6, [0, 1]],
                    [11, [2]],
                    [12, [2]],
                ]),
                suitSet: new Set([0, 1, 2]),
            },
        ],
        [
            [40, 41, 42, 16, 19],
            {
                rankMap: new Map([
                    [10, [0, 1, 2]],
                    [4, [0, 3]],
                ]),
                suitSet: new Set([0, 1, 2, 3]),
            },
        ],
    ])("Cards %j should return %o", (cards, expected) => {
        const actual = statisticCard(cards);

        expect(actual).toStrictEqual(expected);
    });
});
