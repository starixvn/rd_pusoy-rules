import { CardCollectionScore } from "../../types";

export const isLarger = <T>(
    a: CardCollectionScore<T>,
    b: CardCollectionScore<T>,
): boolean => {
    if (a.type === b.type && a.rank === b.rank) {
        return a.suit > b.suit;
    }
    if (a.type === b.type) {
        return a.rank > b.rank;
    }

    return a.type > b.type;
};
