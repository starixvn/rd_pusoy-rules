import {
    HandType,
    initNormalScore,
    initSettlement,
    HandTypeMap,
} from "../const";
import { isLarger } from "../helper/card-helpers";
import { accumulateFromOtherMap, pushItem } from "../helper/map-helpers";
import {
    Hand,
    RoyaltyUnit,
    ScoreConfig,
    SegmentScore,
    Settlement,
} from "../types";

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
            const player1 = compareHandPlayers.get(compareHandPlayerIds[i])!;
            const player2 = compareHandPlayers.get(compareHandPlayerIds[j])!;

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

            const royalty1 = getRoyalty(player1, scoreConfig.royalty);
            const royalty2 = getRoyalty(player2, scoreConfig.royalty);
            const { royaltyScore1, royaltyScore2 } = settleRoyalty(
                front,
                middle,
                back,
                royalty1,
                royalty2,
            );

            const updateSegmentScore: Record<string, number> = {};
            [royalty1, royalty2].forEach((royalty) => {
                Object.entries(royalty).forEach(([key, value]) => {
                    if (value.name !== HandType.Unknown) {
                        updateSegmentScore[key] = 0;
                    }
                });
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
    if (scoreConfig.pusoy.full.units > 0) {
        result = calculateFullPusoy(
            result,
            pusoyPlayers,
            numberOfPlayer,
            scoreConfig,
        );
    }

    return result;
};

const updateResultByCompareSegment = (
    result: Map<number, Settlement>,
    compareHandPlayerIds: number[],
    position: number,
    pusoyScore: Record<string, number>,
    royaltyScore: Hand<RoyaltyUnit>,
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
            mini: {
                ...oldValue?.pusoy?.mini,
                ...pusoyScore,
            },
            full: 0,
        },
        royalty: {
            front: {
                name: royaltyScore.front.name,
                units:
                    royaltyScore.front.units +
                    (oldValue?.royalty?.front?.units || 0),
            },
            middle: {
                name: royaltyScore.middle.name,
                units:
                    royaltyScore.middle.units +
                    (oldValue?.royalty?.middle?.units || 0),
            },
            back: {
                name: royaltyScore.back.name,
                units:
                    royaltyScore.back.units +
                    (oldValue?.royalty?.back?.units || 0),
            },
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
        const score = Math.floor(sum / Math.abs(sum)) * scoreConfig.pusoy.mini;

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

const settleRoyalty = (
    frontScore: number,
    middleScore: number,
    backScore: number,
    royalty1: Hand<RoyaltyUnit>,
    royalty2: Hand<RoyaltyUnit>,
) => {
    const royaltyFront =
        frontScore > 0 ? royalty1.front.units : -royalty2.front.units;
    const royaltyMiddle =
        middleScore > 0 ? royalty1.middle.units : -royalty2.middle.units;
    const royaltyBack =
        backScore > 0 ? royalty1.back.units : -royalty2.back.units;

    const royaltyScore1 = {
        front: { ...royalty1.front, units: royaltyFront },
        middle: { ...royalty1.middle, units: royaltyMiddle },
        back: { ...royalty1.back, units: royaltyBack },
    };

    const royaltyScore2 = {
        front: { ...royalty2.front, units: -royaltyFront },
        middle: { ...royalty2.middle, units: -royaltyMiddle },
        back: { ...royalty2.back, units: -royaltyBack },
    };

    return {
        royaltyScore1,
        royaltyScore2,
    };
};

const calculateFullPusoy = (
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
                    mini: {},
                    full: scoreConfig.pusoy.full.units * value.length,
                },
            });

            for (const other of value) {
                const oldResult = result.get(other);
                const fullPusoyScore = scoreConfig.pusoy.full.isWinnerTakeAll
                    ? -scoreConfig.pusoy.full.units +
                      Object.entries(oldResult!.pusoy.mini)
                          .filter(([k]) => k !== key.toString())
                          .map(([, v]) => v)
                          .reduce((a, b) => a + b, 0)
                    : -scoreConfig.pusoy.full.units;
                result.set(other, {
                    ...initSettlement,
                    ...oldResult,
                    pusoy: {
                        mini: {
                            ...oldResult!.pusoy.mini,
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

const getRoyalty = (
    handScore1: Hand<SegmentScore>,
    royalty: Hand<Record<string, number>>,
): Hand<RoyaltyUnit> => {
    const frontUnits = royalty.front[HandTypeMap[handScore1.front.type]] || 0;
    const middleUnits =
        royalty.middle[HandTypeMap[handScore1.middle.type]] || 0;
    const backUnits = royalty.back[HandTypeMap[handScore1.back.type]] || 0;

    return {
        front: {
            name:
                frontUnits > 0
                    ? HandTypeMap[handScore1.front.type]
                    : HandType.Unknown,
            units: frontUnits,
        },
        middle: {
            name:
                middleUnits > 0
                    ? HandTypeMap[handScore1.middle.type]
                    : HandType.Unknown,
            units: middleUnits,
        },
        back: {
            name:
                backUnits > 0
                    ? HandTypeMap[handScore1.back.type]
                    : HandType.Unknown,
            units: backUnits,
        },
    };
};
