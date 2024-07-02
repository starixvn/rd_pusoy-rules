import { subtractValue } from "./subtract-value";
describe(subtractValue.name, () => {
    test.each([
        [
            {
                a: 1,
                b: 2,
                c: 3,
            },
            {
                a: -1,
                b: -2,
                c: -3,
            },
        ],
        [
            {
                a: -1,
                b: 0,
                c: 3,
            },
            {
                a: 1,
                b: -0,
                c: -3,
            },
        ],
    ])("%o after subtract value should be %o", (object, expected) => {
        const actual = subtractValue(object);

        for (const key in expected) {
            expect(actual[key]).toBe(expected[key]);
        }
    });
});
