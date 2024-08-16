import { HandTypeRank } from "../../const";
import { statisticCard } from "../../helper/card-helpers";
import { Hand, NaturalScore, SegmentScore } from "../../types";

export const calculateThreeFlushes = (
    hand: Hand<number[]>,
    handScore: Hand<SegmentScore>,
): Partial<NaturalScore> | undefined => {
    const { suitSet: frontSuitSet } = statisticCard(hand.front);
    if (
        (handScore.back.type === HandTypeRank.Flush ||
            handScore.back.type === HandTypeRank.StraightFlush ||
            handScore.back.type === HandTypeRank.RoyalFlush) &&
        (handScore.middle.type === HandTypeRank.Flush ||
            handScore.middle.type === HandTypeRank.StraightFlush ||
            handScore.middle.type === HandTypeRank.RoyalFlush) &&
        frontSuitSet.size === 1
    ) {
        return {
            rank: handScore.back.rank,
            suit: Math.max(...hand.back) % 4,
        };
    }

    return undefined;
};
