import { CardCollectionScore } from "../types";

export const isLarger = <T>(
    a: CardCollectionScore<T>,
    b: CardCollectionScore<T>,
): boolean => {
    if (a.type > b.type) {
        return true;
    }
    if (a.type === b.type && a.rank > b.rank) {
        return true;
    }
    if (a.type === b.type && a.rank === b.rank) {
        return a.suit > b.suit;
    }

    return false;
};
