import { HandType, NaturalType } from "../../const";
import { sortIncrease } from "../../helper/array-helpers";
import { Hand, NaturalScore, SegmentScore } from "../../types";
import { isContinuous, isLowStraight } from "../hand-type-checker";

export const calculateThreeStraights = (
    hand: Hand<number[]>,
    handScore: Hand<SegmentScore>,
): NaturalScore | undefined => {
    const sortedRankAtFront = sortIncrease(
        hand.front.map((c) => Math.floor(c / 4)),
    );
    if (
        handScore.back.type === HandType.Straight &&
        handScore.middle.type === HandType.Straight &&
        (isContinuous(sortedRankAtFront) || isLowStraight(sortedRankAtFront))
    ) {
        return {
            type: NaturalType.ThreeStraights,
            rank: handScore.back.rank,
            suit: Math.max(...hand.back) % 4,
        };
    }

    return undefined;
};
