import { NaturalType } from "../../const";
import { NaturalScore } from "../../types";
import { isContinuous } from "../hand-type-checker";

export const calculateDragon = (
    sortedRank: number[],
    cards: number[],
): NaturalScore | undefined => {
    if (isContinuous(sortedRank) && sortedRank.length === cards.length) {
        return {
            type: NaturalType.Dragon,
            rank: Math.max(...cards),
            suit: 0,
        };
    }

    return undefined;
};
