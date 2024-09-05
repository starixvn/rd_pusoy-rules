import { Natural, initSettlement } from "../const";
import { sortIncrease } from "../helper/array-helpers";
import { calculateNaturalScore, calculateSegmentScore, isCrack } from "../scorer";
import { Hand, InGameSettings, NaturalScore, ScoreConfig, SegmentScore, Settlement } from "../types";
import { calculateNaturalAndCrack } from "./calculate-natural-and-crack";
import { compareHands } from "./compare-hands";

export const settle = (
    playerData: Hand<number[]>[],
    scoreConfig: ScoreConfig,
    inGameSettings: InGameSettings = { handsRejectNatural: [] }
): Settlement[] => {
    let result: Map<number, Settlement> = new Map();
    const classifyPlayersResult = classifyPlayers(playerData, scoreConfig, inGameSettings);

    const preProcessPlayerData = {
        ...classifyPlayersResult,
        numberOfPlayer: playerData.length,
        scoreConfig,
    };

    result = calculateNaturalAndCrack(result, preProcessPlayerData);

    result = compareHands(result, preProcessPlayerData);

    result = summaryScore(result);

    const settlements: Settlement[] = sortIncrease(Array.from(result.keys())).map((key) => {
        return {
            ...initSettlement,
            ...result.get(key),
        };
    });

    return settlements;
};

const classifyPlayers = (playerData: Hand<number[]>[], scoreConfig: ScoreConfig, inGameSettings: InGameSettings) => {
    const crackPlayers: Set<number> = new Set();
    const naturalPlayers: Map<number, NaturalScore> = new Map();
    const compareHandPlayers: Map<number, Hand<SegmentScore>> = new Map();
    for (let i = 0; i < playerData.length; i++) {
        const handScore: Hand<SegmentScore> = {
            front: calculateSegmentScore(playerData[i].front),
            middle: calculateSegmentScore(playerData[i].middle),
            back: calculateSegmentScore(playerData[i].back),
        };

        if (isCrack(handScore)) {
            crackPlayers.add(i);

            continue;
        }

        const naturalScore = calculateNaturalScore(playerData[i], handScore, scoreConfig.natural);
        if (naturalScore.name !== Natural.Unknown && !inGameSettings.handsRejectNatural.includes(i)) {
            naturalPlayers.set(i, naturalScore);

            continue;
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
                value.crack.units +
                value.pusoy.full +
                Object.values(value.normal).reduce((a, b) => a + b, 0) +
                value.natural.units +
                Object.values(value.pusoy.mini).reduce((a, b) => a + b, 0) +
                Object.values(value.royalty).reduce((a, b) => a + b.units, 0),
        });
    }

    return result;
};
