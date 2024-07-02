import { NaturalDisplay, NaturalType } from "../../const";
import { calculateDragon } from "./calculate-dragon";
import { calculateNaturalScore } from "./calculate-natural-score";
import { calculateSegmentScore } from "../calculate-segment-score";

const calculateDragonMock = calculateDragon as jest.Mock;
const calculateSixPairsMock = jest.fn() as jest.Mock;
const calculateThreeFlushesMock = jest.fn() as jest.Mock;
const calculateThreeStraightsMock = jest.fn() as jest.Mock;

jest.mock("./calculate-dragon");
jest.mock("./calculate-six-pairs");
jest.mock("./calculate-three-flushes");
jest.mock("./calculate-three-straights");

describe(calculateNaturalScore.name, () => {
    describe("when cards is not natural", () => {
        it("should return type is unknown", () => {
            calculateDragonMock.mockReturnValue(undefined);
            calculateSixPairsMock.mockReturnValue(undefined);
            calculateThreeFlushesMock.mockReturnValue(undefined);
            calculateThreeStraightsMock.mockReturnValue(undefined);
            const naturalConfig = {
                [NaturalDisplay[NaturalType.Dragon]]: 1,
                [NaturalDisplay[NaturalType.SixPairs]]: 2,
                [NaturalDisplay[NaturalType.ThreeFlushes]]: 3,
                [NaturalDisplay[NaturalType.ThreeStraights]]: 4,
                sameColor: 5,
            };
            const hand = {
                front: [0, 1, 2],
                middle: [5, 6, 7, 8, 9],
                back: [10, 11, 12, 13, 14],
            };
            const handScore = {
                front: calculateSegmentScore(hand.front),
                middle: calculateSegmentScore(hand.middle),
                back: calculateSegmentScore(hand.back),
            };

            const actual = calculateNaturalScore(
                hand,
                handScore,
                naturalConfig,
            );

            expect(actual.type).toBe(NaturalType.Unknown);
        });
    });
    describe("when cards is natural but config for natural is not exist", () => {
        it("should return type is unknown", () => {
            calculateDragonMock.mockReturnValue({
                type: NaturalType.Dragon,
                rank: 10,
                suit: 0,
            });
            calculateSixPairsMock.mockReturnValue(undefined);
            calculateThreeFlushesMock.mockReturnValue(undefined);
            calculateThreeStraightsMock.mockReturnValue(undefined);
            const naturalConfig = {
                [NaturalDisplay[NaturalType.SixPairs]]: 2,
                [NaturalDisplay[NaturalType.ThreeFlushes]]: 3,
                [NaturalDisplay[NaturalType.ThreeStraights]]: 4,
            };
            const hand = {
                front: [44, 36, 41],
                middle: [30, 33, 47, 39, 49],
                back: [24, 28, 32, 18, 21],
            };
            const handScore = {
                front: calculateSegmentScore(hand.front),
                middle: calculateSegmentScore(hand.middle),
                back: calculateSegmentScore(hand.back),
            };

            const actual = calculateNaturalScore(
                hand,
                handScore,
                naturalConfig,
            );

            expect(actual.type).toBe(NaturalType.Unknown);
        });
    });
    describe("when cards is natural and config for natural exist", () => {
        it("should return natural score", () => {
            calculateDragonMock.mockReturnValue({
                type: NaturalType.Dragon,
                rank: 10,
                suit: 0,
            });
            calculateSixPairsMock.mockReturnValue(undefined);
            calculateThreeFlushesMock.mockReturnValue(undefined);
            calculateThreeStraightsMock.mockReturnValue(undefined);
            const naturalConfig = {
                [NaturalDisplay[NaturalType.Dragon]]: 1,
                [NaturalDisplay[NaturalType.SixPairs]]: 2,
                [NaturalDisplay[NaturalType.ThreeFlushes]]: 3,
                [NaturalDisplay[NaturalType.ThreeStraights]]: 4,
            };
            const hand = {
                front: [44, 36, 41],
                middle: [30, 33, 47, 39, 49],
                back: [24, 28, 32, 18, 21],
            };
            const handScore = {
                front: calculateSegmentScore(hand.front),
                middle: calculateSegmentScore(hand.middle),
                back: calculateSegmentScore(hand.back),
            };

            const actual = calculateNaturalScore(
                hand,
                handScore,
                naturalConfig,
            );

            expect(actual.type).toBe(NaturalType.Dragon);
        });
    });
});
