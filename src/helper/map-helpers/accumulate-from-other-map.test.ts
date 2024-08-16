import { accumulateFromOtherMap } from "./accumulate-from-other-map";

describe(accumulateFromOtherMap.name, () => {
    test.each([
        [
            new Map([
                ["a", [1, 2, 3]],
                ["b", [4, 5]],
            ]),
            new Map([
                ["a", [4, 5]],
                ["b", [10, 11]],
            ]),
            new Map([
                ["a", [1, 2, 3, 4, 5]],
                ["b", [4, 5, 10, 11]],
            ]),
        ],
        [
            new Map([
                ["a", [1, 2, 3]],
                ["b", [4, 5]],
                ["c", [6, 7]],
            ]),
            new Map([
                ["a", [4, 5]],
                ["b", [10, 11]],
            ]),
            new Map([
                ["a", [1, 2, 3, 4, 5]],
                ["b", [4, 5, 10, 11]],
                ["c", [6, 7]],
            ]),
        ],
    ])("", (map1, map2, expected) => {
        const actual = accumulateFromOtherMap(map1, map2);

        expect(actual).toStrictEqual(expected);
    });
});
