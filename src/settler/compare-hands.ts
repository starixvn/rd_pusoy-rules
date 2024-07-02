import { HandType, HandTypeDisplay } from "../const";
import { isLarger } from "../helper/card-helpers";
import {
    initHandScore,
    initNormalScore,
    initRoyaltyScore,
    initSettlement,
} from "../helper/initializer";
import { accumulateFromOtherMap, pushItem } from "../helper/map-helpers";
import { subtractValue, sumOrInsertValueByKey } from "../helper/object-helpers";
import { Hand, ScoreConfig, SegmentScore, Settlement } from "../types";

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
            front: sumOrInsertValueByKey(
                oldValue?.royalty?.front || {},
                royaltyScore.front,
            ),
            middle: sumOrInsertValueByKey(
                oldValue?.royalty?.middle || {},
                royaltyScore.middle,
            ),
            back: sumOrInsertValueByKey(
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
