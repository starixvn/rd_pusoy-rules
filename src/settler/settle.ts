import { NaturalType, initSettlement } from "../const";
import { sortIncrease } from "../helper/array-helpers";
import {
    calculateNaturalScore,
    calculateSegmentScore,
    isCrack,
} from "../scorer";
import {
    Hand,
    NaturalScore,
    PlayerData,
    ScoreConfig,
    SegmentScore,
    Settlement,
} from "../types";
import { calculateNaturalAndCrack } from "./calculate-natural-and-crack";
import { compareHands } from "./compare-hands";

export const settle = (
    playerData: PlayerData[],
    scoreConfig: ScoreConfig,
): Settlement[] => {
    let result: Map<number, Settlement> = new Map();
    const classifyPlayersResult = classifyPlayers(playerData, scoreConfig);

    const preProcessPlayerData = {
        ...classifyPlayersResult,
        numberOfPlayer: playerData.length,
        scoreConfig,
    };

    result = calculateNaturalAndCrack(result, preProcessPlayerData);

    result = compareHands(result, preProcessPlayerData);

    result = summaryScore(result);

    const settlements: Settlement[] = sortIncrease(
        Array.from(result.keys()),
    ).map((key) => {
        return {
            ...initSettlement,
            ...result.get(key),
        };
    });

    return settlements;
};

const classifyPlayers = (
    playerData: PlayerData[],
    scoreConfig: ScoreConfig,
) => {
    const crackPlayers: Set<number> = new Set();
    const naturalPlayers: Map<number, NaturalScore> = new Map();
    const compareHandPlayers: Map<number, Hand<SegmentScore>> = new Map();
    for (let i = 0; i < playerData.length; i++) {
        const handScore: Hand<SegmentScore> = {
            front: calculateSegmentScore(playerData[i].hand.front),
            middle: calculateSegmentScore(playerData[i].hand.middle),
            back: calculateSegmentScore(playerData[i].hand.back),
        };

        if (isCrack(handScore)) {
            crackPlayers.add(i);

            continue;
        }

        if (playerData[i].isAlertNatural) {
            const naturalScore = calculateNaturalScore(
                playerData[i].hand,
                handScore,
                scoreConfig.natural,
            );
            if (naturalScore.type !== NaturalType.Unknown) {
                naturalPlayers.set(i, naturalScore);

                continue;
            }
        }

        compareHandPlayers.set(i, handScore);
    }
    return { compareHandPlayers, naturalPlayers, crackPlayers };
};

const summaryScore = (tempResult: Map<number, Settlement>) => {
    const result = new Map(tempResult);
    for (const [key, value] of result) {
        result.set(key, {
            ...value,
            sum:
                value.crack.score +
                value.pusoy.full +
                Object.values(value.normal).reduce((a, b) => a + b, 0) +
                Object.values(value.natural).reduce((a, b) => a + b, 0) +
                Object.values(value.pusoy.partial).reduce((a, b) => a + b, 0) +
                Object.values(value.royalty.front).reduce((a, b) => a + b, 0) +
                Object.values(value.royalty.middle).reduce((a, b) => a + b, 0) +
                Object.values(value.royalty.back).reduce((a, b) => a + b, 0),
        });
    }

    return result;
};
