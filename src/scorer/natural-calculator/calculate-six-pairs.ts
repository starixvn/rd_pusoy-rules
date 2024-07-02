import { NaturalType } from "../../const";
import { NaturalScore } from "../../types";

export const calculateSixPairs = (
    sameRankCounter: Map<number, number[]>,
    rankMap: Map<number, number[]>,
): NaturalScore | undefined => {
    if (
        sameRankCounter.get(2)?.length === 6 ||
        (sameRankCounter.get(3)?.length === 1 &&
            sameRankCounter.get(2)?.length === 5) ||
        (sameRankCounter.get(4)?.length ?? 0) * 4 +
            (sameRankCounter.get(2)?.length ?? 0) * 2 ===
            12
    ) {
        const maxCard = Math.max(
            ...(sameRankCounter.get(2) ?? []),
            ...(sameRankCounter.get(3) ?? []),
            ...(sameRankCounter.get(4) ?? []),
        );
        const maxSuit = Math.max(...rankMap.get(maxCard)!);
        return {
            type: NaturalType.SixPairs,
            rank: maxCard,
            suit: maxSuit,
        };
    }

    return undefined;
};
