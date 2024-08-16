import { pushItem } from "../map-helpers";

export const statisticCard = (cards: number[]) => {
    let rankMap: Map<number, number[]> = new Map();
    const suitSet: Set<number> = new Set();

    cards.forEach((card) => {
        const rank = Math.floor(card / 4);
        const suit = card % 4;
        rankMap = pushItem(rankMap, rank, suit);
        suitSet.add(suit);
    });

    return { rankMap, suitSet };
};
