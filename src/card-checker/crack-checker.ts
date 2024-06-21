import { isLarger } from "../scorer";
import { Hand, SegmentScore } from "../types";

export const isCrack = (handScore: Hand<SegmentScore>): boolean => {
    if (isLarger(handScore.front, handScore.back)) {
        return true;
    }
    if (isLarger(handScore.middle, handScore.back)) {
        return true;
    }

    return false;
};
