import { HandType } from "../../const";
import { sortIncrease } from "../../helper/array-helpers";
import { Hand, NaturalScore, SegmentScore } from "../../types";
import { isStraight, isLowStraight } from "../hands";

export const calculateThreeStraights = (
    hand: Hand<number[]>,
    handScore: Hand<SegmentScore>,
): Partial<NaturalScore> | undefined => {
    const sortedRankAtFront = sortIncrease(
        hand.front.map((c) => Math.floor(c / 4)),
    );
    if (
        handScore.back.type === HandType.Straight &&
        handScore.middle.type === HandType.Straight &&
        isStraight(sortedRankAtFront, true)
    ) {
        return {
            rank: handScore.back.rank,
            suit: Math.max(...hand.back) % 4,
        };
    }

    return undefined;
};
