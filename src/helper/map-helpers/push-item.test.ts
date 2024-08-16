import { pushItem } from "./push-item";

describe(pushItem.name, () => {
    test.each([
        [
            new Map([
                [1, [2, 3]],
                [2, [3, 4]],
            ]),
            1,
            5,
            new Map([
                [1, [2, 3, 5]],
                [2, [3, 4]],
            ]),
        ],
        [
            new Map([
                [1, [2, 3]],
                [2, [3, 4]],
            ]),
            3,
            5,
            new Map([
                [1, [2, 3]],
                [2, [3, 4]],
                [3, [5]],
            ]),
        ],
    ])("%o should return %o", (origin, itemKey, item, expected) => {
        const actual = pushItem(origin, itemKey, item);

        expect(actual).toStrictEqual(expected);
    });
});
