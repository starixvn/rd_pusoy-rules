import { sumOrInsertValueByKey } from "./sum-or-insert-value-by-key";
describe(sumOrInsertValueByKey.name, () => {
    test.each([
        [
            {
                a: 1,
                b: 2,
                c: 3,
            },
            {
                a: 1,
                b: 2,
                c: 3,
                d: 4,
            },
            {
                a: 2,
                b: 4,
                c: 6,
                d: 4,
            },
        ],
        [
            {
                a: 1,
                b: 2,
            },
            {
                c: 3,
                d: 4,
            },
            {
                a: 1,
                b: 2,
                c: 3,
                d: 4,
            },
        ],
    ])("sumOrInsertValueByKey", (object1, object2, expected) => {
        const actual = sumOrInsertValueByKey(object1, object2);

        expect(actual).toStrictEqual(expected);
    });
});
