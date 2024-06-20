import { isCrack } from "./crack-checker";
import { calculateSegmentScore } from "./scorer";
import { Hand, ScoreConfig, SegmentScore, Settlement } from "./types";

const initSettlement: Settlement = {
    crackScore: 0,
    fullPusoyScore: 0,
    naturalScore: {},
    normalScore: {
        front: 0,
        middle: 0,
        back: 0,
    },
    pusoyScore: 0,
    royaltyScore: {},
    sumScore: 0,
};

export const settle = (
    input: Hand<number[]>[],
    scoreConfig: ScoreConfig
): Settlement => {
    const tempResult: Map<number, Settlement> = new Map();
    for (let i = 0; i < input.length; i++) {
        const handScore: Hand<SegmentScore> = {
            front: calculateSegmentScore(input[i].front),
            middle: calculateSegmentScore(input[i].middle),
            back: calculateSegmentScore(input[i].back),
        };

        if (isCrack(handScore)) {
            tempResult.set(i, {
                ...initSettlement,
                crackScore: scoreConfig.crackScore,
            });

            continue;
        }
    }
    return {} as Settlement;
};
