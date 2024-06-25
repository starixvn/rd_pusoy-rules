import { IScorer } from "../interfaces";
import { NaturalCheckResult, SegmentScore } from "../types";
import { isCrack } from "./crack-checker";
import { checkNatural } from "./natural-checker";
import { calculateSegmentScore } from "./scorer";

const Scorer: IScorer<number[], SegmentScore, NaturalCheckResult> = {
    calculateSegmentScore,
    isCrack,
    checkNatural,
};

export default Scorer;
