import { isContinuous } from "./hand-type-checker";
import { countSameRank, statisticCard } from "./statistic-card";

export const checkNatural = (cards: number[]) => {
    const { rankMap, suitSet } = statisticCard(cards);
    const sameRankCounter = countSameRank(rankMap);
    return cards.length === 5 && cards.every((card) => card % 4 === 0);
};

const isDragon = (cards: number[]) => {
    const { rankMap } = statisticCard(cards);

    return isContinuous(Array.from(rankMap.keys()));
};
