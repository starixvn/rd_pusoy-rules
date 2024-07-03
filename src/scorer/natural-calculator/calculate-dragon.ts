import { NaturalScore } from "../../types";
import { isStraight } from "../hands";

export const calculateDragon = (
    sortedRank: number[],
    cards: number[],
): Partial<NaturalScore> | undefined => {
    if (isStraight(sortedRank) && sortedRank.length === cards.length) {
        return {
            rank: Math.max(...cards),
            suit: 0,
        };
    }

    return undefined;
};
