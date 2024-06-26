import { IScorer } from "../interfaces";
import { NaturalCheckResult, SegmentScore } from "../types";
import { isCrack } from "./crack-checker";
import { checkNatural } from "./natural-checker";
import { calculateSegmentScore } from "./scorer";

export const Scorer: IScorer<number[], SegmentScore, NaturalCheckResult> = {
    calculateSegmentScore,
    isCrack,
    checkNatural,
};
