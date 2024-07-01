import {
    HandType,
    HandTypeDisplay,
    NaturalDisplay,
    NaturalType,
} from "./const";
import {
    Hand,
    NaturalScore,
    PlayerData,
    ScoreConfig,
    SegmentScore,
    Settlement,
} from "./types";
import { isLarger } from "./helper/card-helpers";
import {
    initHandScore,
    initNormalScore,
    initRoyaltyScore,
    initSettlement,
} from "./helper/initializer";
import { calculateSegmentScore, isCrack } from "./scorer";
import { sortIncrease } from "./helper/array-helpers";
import { accumulateFromOtherMap, pushItem } from "./helper/map-helpers";
import { calculateNaturalScore } from "./scorer/natural-calculator/calculate-natural-score";

export const createPusoyRules = (scoreConfig: ScoreConfig) => {
    return {
        settle: (playerData: PlayerData[]) => {
            return settle(playerData, scoreConfig);
        },
    };
};

/**
 * Calculates the settlement for each player based on the given players, alert for natural.
 *
 * @param {Hand<number[]>[]} players - The array of player's hands.
 * @param {boolean[]} isAlertNatural - The array indicating if player alerts for natural.
 * @return {Settlement[]} The array of settlements for each player.
 */
const settle = (
    playerData: PlayerData[],
    scoreConfig: ScoreConfig,
): Settlement[] => {
    let result: Map<number, Settlement> = new Map();
    const classifyPlayersResult = classifyPlayers(playerData, scoreConfig);

    const preProcessDataPlayer = {
        ...classifyPlayersResult,
        numberOfPlayer: playerData.length,
        scoreConfig,
    };

    result = calculateNaturalAndCrack(result, preProcessDataPlayer);

    result = compareHands(result, preProcessDataPlayer);

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

const subtractValue = (object: Record<string, number>) => {
    const newObject: Record<string, number> = {};
    for (const key in object) {
        newObject[key] = -object[key];
    }

    return newObject;
};

export const compareHands = (
    currentResult: Map<number, Settlement>,
    {
        compareHandPlayers,
        scoreConfig,
        numberOfPlayer,
    }: {
        compareHandPlayers: Map<number, Hand<SegmentScore>>;
        scoreConfig: ScoreConfig;
        numberOfPlayer: number;
    },
) => {
    if (compareHandPlayers.size < 2) {
        return currentResult;
    }

    let pusoyPlayers: Map<number, number[]> = new Map();
    let result: Map<number, Settlement> = new Map(currentResult);
    const compareHandPlayerIds = Array.from(compareHandPlayers.keys());
    for (let i = 0; i < compareHandPlayerIds.length - 1; i++) {
        for (let j = i + 1; j < compareHandPlayerIds.length; j++) {
            const player1 =
                compareHandPlayers.get(compareHandPlayerIds[i]) ||
                initHandScore;
            const player2 =
                compareHandPlayers.get(compareHandPlayerIds[j]) ||
                initHandScore;

            const front = isLarger(player1.front, player2.front) ? 1 : -1;
            const middle = isLarger(player1.middle, player2.middle) ? 1 : -1;
            const back = isLarger(player1.back, player2.back) ? 1 : -1;

            const {
                pusoyScore1,
                pusoyScore2,
                pusoyMap: pusoyMapTemp,
            } = calculatePusoy(
                front,
                middle,
                back,
                scoreConfig,
                compareHandPlayerIds,
                i,
                j,
            );
            pusoyPlayers = accumulateFromOtherMap(pusoyPlayers, pusoyMapTemp);

            const { royaltyScore1, royaltyScore2 } = calculateRoyalty(
                front,
                middle,
                back,
                player1,
                player2,
                scoreConfig,
            );

            const updateSegmentScore: Record<string, number> = {};
            Object.entries(royaltyScore1).forEach(([key, value]) => {
                if (Object.keys(value).length > 0) {
                    updateSegmentScore[key] = 0;
                }
            });

            const handScore1 = {
                front: front * scoreConfig.normal,
                middle: middle * scoreConfig.normal,
                back: back * scoreConfig.normal,
            };

            const handScore2 = {
                front: -front * scoreConfig.normal,
                middle: -middle * scoreConfig.normal,
                back: -back * scoreConfig.normal,
            };

            result = updateResultByCompareSegment(
                result,
                compareHandPlayerIds,
                i,
                pusoyScore1,
                royaltyScore1,
                handScore1,
                updateSegmentScore,
            );

            result = updateResultByCompareSegment(
                result,
                compareHandPlayerIds,
                j,
                pusoyScore2,
                royaltyScore2,
                handScore2,
                updateSegmentScore,
            );
        }
    }
    result = calculateFullPusoy(
        result,
        pusoyPlayers,
        numberOfPlayer,
        scoreConfig,
    );

    return result;
};

export const calculateNaturalAndCrack = (
    tempResult: Map<number, Settlement>,
    {
        naturalPlayers,
        crackPlayers,
        numberOfPlayer,
        scoreConfig,
    }: {
        naturalPlayers: Map<number, NaturalScore>;
        crackPlayers: Set<number>;
        numberOfPlayer: number;
        scoreConfig: ScoreConfig;
    },
) => {
    let result = new Map(tempResult);
    for (let i = 0; i < numberOfPlayer - 1; i++) {
        for (let j = i + 1; j < numberOfPlayer; j++) {
            const oldResult1: Settlement | undefined =
                result.get(i) || undefined;
            const oldResult2: Settlement | undefined =
                result.get(j) || undefined;
            const {
                player1Result: naturalResult1,
                player2Result: naturalResult2,
            } = settleNatural(
                scoreConfig.natural,
                naturalPlayers.get(i),
                naturalPlayers.get(j),
            );
            result = updateOrInsertSettleResultByNaturalAndCrack(
                result,
                oldResult1,
                i,
                j,
                crackPlayers,
                scoreConfig,
                naturalResult1,
            );

            result = updateOrInsertSettleResultByNaturalAndCrack(
                result,
                oldResult2,
                j,
                i,
                crackPlayers,
                scoreConfig,
                naturalResult2,
            );
        }
    }

    return result;
};

export const classifyPlayers = (
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

export const calculateFullPusoy = (
    currentResult: Map<number, Settlement>,
    pusoyPlayers: Map<number, number[]>,
    numberOfPlayers: number,
    scoreConfig: ScoreConfig,
) => {
    const result = new Map(currentResult);
    for (const [key, value] of pusoyPlayers) {
        if (value.length > 1 && value.length === numberOfPlayers - 1) {
            const oldResult = result.get(key);
            result.set(key, {
                ...initSettlement,
                ...oldResult,
                pusoy: {
                    partial: {},
                    full: scoreConfig.pusoy.full * value.length,
                },
            });

            for (const other of value) {
                const oldResult = result.get(other);
                const fullPusoyScore =
                    -scoreConfig.pusoy.full +
                    Object.entries(oldResult!.pusoy.partial)
                        .filter(([k]) => k !== key.toString())
                        .map(([, v]) => v)
                        .reduce((a, b) => a + b, 0);
                result.set(other, {
                    ...initSettlement,
                    ...oldResult,
                    pusoy: {
                        partial: {
                            ...oldResult!.pusoy.partial,
                            [key]: 0,
                        },
                        full: fullPusoyScore,
                    },
                });
            }
        }
    }

    return result;
};

const updateOrInsertSettleResultByNaturalAndCrack = (
    resultMap: Map<number, Settlement>,
    oldResult: Settlement | undefined,
    position: number,
    opponentPosition: number,
    crackPlayers: Set<number>,
    scoreConfig: ScoreConfig,
    naturalResult1: Record<string, number>,
) => {
    const newResult = new Map(resultMap);

    const crackScore =
        (crackPlayers.has(position) ? -scoreConfig.crack : 0) +
        (crackPlayers.has(opponentPosition) ? scoreConfig.crack : 0) +
        (oldResult?.crack?.score || 0);

    if (!oldResult) {
        newResult.set(position, {
            ...initSettlement,
            crack: {
                isCrack: crackPlayers.has(position),
                score: crackScore,
            },
            natural: naturalResult1,
        });

        return newResult;
    }
    newResult.set(position, {
        ...oldResult!,
        crack: {
            ...oldResult!.crack,
            score: crackScore,
        },
        natural: sumValueByKey(oldResult!.natural, naturalResult1),
    });

    return newResult;
};

const updateResultByCompareSegment = (
    result: Map<number, Settlement>,
    compareHandPlayerIds: number[],
    position: number,
    pusoyScore: Record<string, number>,
    royaltyScore: Hand<Record<string, number>>,
    handScore: { front: number; middle: number; back: number },
    updateSegmentScore: Record<string, number>,
) => {
    const newResult = new Map(result);
    const oldValue: Settlement | undefined = newResult.get(
        compareHandPlayerIds[position],
    );
    newResult.set(compareHandPlayerIds[position], {
        ...initSettlement,
        ...oldValue,
        pusoy: {
            partial: {
                ...oldValue?.pusoy?.partial,
                ...pusoyScore,
            },
            full: 0,
        },
        royalty: {
            front: sumValueByKey(
                oldValue?.royalty?.front || {},
                royaltyScore.front,
            ),
            middle: sumValueByKey(
                oldValue?.royalty?.middle || {},
                royaltyScore.middle,
            ),
            back: sumValueByKey(
                oldValue?.royalty?.back || {},
                royaltyScore.back,
            ),
        },
        normal: addNormalScore(
            {
                ...initNormalScore,
                ...oldValue?.normal,
            },
            {
                ...handScore,
                ...updateSegmentScore,
            },
        ),
    });

    return newResult;
};

const calculatePusoy = (
    frontScore: number,
    middleScore: number,
    backScore: number,
    scoreConfig: ScoreConfig,
    compareHandPlayerIds: number[],
    player1Position: number,
    player2Position: number,
) => {
    const pusoyScore1: Record<string, number> = {};
    const pusoyScore2: Record<string, number> = {};
    let pusoyMap: Map<number, number[]> = new Map();
    const sum = frontScore + middleScore + backScore;
    if (Math.abs(sum) === 3) {
        const score =
            Math.floor(sum / Math.abs(sum)) * scoreConfig.pusoy.partial;

        if (sum > 0) {
            pusoyMap = pushItem(
                pusoyMap,
                compareHandPlayerIds[player1Position],
                compareHandPlayerIds[player2Position],
            );
        } else {
            pusoyMap = pushItem(
                pusoyMap,
                compareHandPlayerIds[player2Position],
                compareHandPlayerIds[player1Position],
            );
        }

        pusoyScore1[player2Position] = score;
        pusoyScore2[player1Position] = -score;
    }

    return { pusoyScore1, pusoyScore2, pusoyMap };
};

const calculateRoyalty = (
    frontScore: number,
    middleScore: number,
    backScore: number,
    handScore1: Hand<SegmentScore>,
    handScore2: Hand<SegmentScore>,
    scoreConfig: ScoreConfig,
) => {
    const royaltyScore1: Hand<Record<string, number>> = { ...initRoyaltyScore };
    const royaltyScore2: Hand<Record<string, number>> = { ...initRoyaltyScore };

    royaltyScore1.front = getRoyaltyScore(
        scoreConfig.royalty.front,
        handScore1.front.type,
        handScore2.front.type,
        frontScore,
    );
    royaltyScore2.front = subtractValue(royaltyScore1.front);

    royaltyScore1.middle = getRoyaltyScore(
        scoreConfig.royalty.middle,
        handScore1.middle.type,
        handScore2.middle.type,
        middleScore,
    );
    royaltyScore2.middle = subtractValue(royaltyScore1.middle);

    royaltyScore1.back = getRoyaltyScore(
        scoreConfig.royalty.back,
        handScore1.back.type,
        handScore2.back.type,
        backScore,
    );
    royaltyScore2.back = subtractValue(royaltyScore1.back);

    return {
        royaltyScore1,
        royaltyScore2,
    };
};

const getRoyaltyScore = (
    royaltySegmentConfig: Record<string, number>,
    handType1: HandType,
    handType2: HandType,
    segmentScore: number,
): Record<string, number> => {
    let royaltyScore: number | undefined = undefined;
    let sign = 1;
    let key = HandTypeDisplay[handType1];

    if (segmentScore < 0) {
        key = HandTypeDisplay[handType2];
        sign = -1;
    }

    royaltyScore = royaltySegmentConfig[key];

    return royaltyScore ? { [key]: royaltyScore * sign } : {};
};
const addNormalScore = (
    a: { front: number; middle: number; back: number },
    b: { front: number; middle: number; back: number },
): Hand<number> => {
    return {
        front: a.front + b.front,
        middle: a.middle + b.middle,
        back: a.back + b.back,
    };
};

const settleNatural = (
    naturalScoreConfig: Record<string, number>,
    naturalScore1: NaturalScore | undefined,
    naturalScore2: NaturalScore | undefined,
): {
    player1Result: Record<string, number>;
    player2Result: Record<string, number>;
} => {
    let player1Result = {};

    if (naturalScore1 && naturalScore2) {
        const key1 = NaturalDisplay[naturalScore1!.type];
        const key2 = NaturalDisplay[naturalScore2!.type];

        player1Result = isLarger(naturalScore1!, naturalScore2!)
            ? {
                  [key1]: naturalScoreConfig[key1],
              }
            : {
                  [key2]: -naturalScoreConfig[key2],
              };
    } else if (naturalScore1) {
        const key1 = NaturalDisplay[naturalScore1!.type];

        player1Result = {
            [key1]: naturalScoreConfig[key1],
        };
    } else if (naturalScore2) {
        const key2 = NaturalDisplay[naturalScore2!.type];

        player1Result = {
            [key2]: -naturalScoreConfig[key2],
        };
    }

    return {
        player1Result,

        player2Result: subtractValue(player1Result),
    };
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
const sumValueByKey = (
    a: Record<string, number>,
    b: Record<string, number>,
): Record<string, number> => {
    const aKeys: Set<string> = new Set(Object.keys(a));
    const bKeys: Set<string> = new Set(Object.keys(b));
    let result: Record<string, number> = {};

    aKeys.forEach((key) => {
        if (bKeys.has(key)) {
            result = { ...result, [key]: a[key] + b[key] };
        } else {
            result = { ...result, [key]: a[key] };
        }
    });

    bKeys.forEach((key) => {
        if (!aKeys.has(key)) {
            result = { ...result, [key]: b[key] };
        }
    });

    return result;
};
