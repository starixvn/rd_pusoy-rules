import {
    HandType,
    HandTypeDisplay,
    NaturalDisplay,
    NaturalType,
} from "./const";
import { isCrack } from "./card-checker/crack-checker";
import { checkNatural } from "./card-checker/natural-checker";
import { calculateSegmentScore } from "./scorer";
import {
    CardCollectionScore,
    Hand,
    NaturalScore,
    ScoreConfig,
    SegmentScore,
    Settlement,
} from "./types";
import { isLarger } from "./helper/card-collection-score";

const initSettlement: Settlement = {
    crack: {
        isCrack: false,
        score: 0,
    },
    natural: {},
    normal: {
        front: 0,
        middle: 0,
        back: 0,
    },
    pusoy: {
        full: 0,
        partial: {},
    },
    royalty: {
        front: {},
        middle: {},
        back: {},
    },
    sum: 0,
};

const initHandScore: Hand<SegmentScore> = {
    front: {
        rank: 0,
        suit: 0,
        type: 0,
    },
    middle: {
        rank: 0,
        suit: 0,
        type: 0,
    },
    back: {
        rank: 0,
        suit: 0,
        type: 0,
    },
};

const initNormalScore = {
    front: 0,
    middle: 0,
    back: 0,
};

const initRoyaltyScore = {
    front: {},
    middle: {},
    back: {},
};

export const settle = (
    players: Hand<number[]>[],
    scoreConfig: ScoreConfig,
): Map<number, Settlement> => {
    let result: Map<number, Settlement> = new Map();
    const crackPlayers: Set<number> = new Set();
    let naturalPlayers: Map<number, NaturalScore> = new Map();
    const compareHandPlayers: Map<number, Hand<SegmentScore>> = new Map();
    for (let i = 0; i < players.length; i++) {
        const handScore: Hand<SegmentScore> = {
            front: calculateSegmentScore(players[i].front),
            middle: calculateSegmentScore(players[i].middle),
            back: calculateSegmentScore(players[i].back),
        };

        if (isCrack(handScore)) {
            crackPlayers.add(i);

            continue;
        }

        const { isNatural, naturalScore } = checkNatural(
            players[i],
            handScore,
            scoreConfig.natural,
        );
        if (isNatural) {
            naturalPlayers.set(i, naturalScore);

            continue;
        }

        compareHandPlayers.set(i, handScore);
    }

    if (compareHandPlayers.size < 2 && compareHandPlayers.size > 0) {
        const remainPlayer = compareHandPlayers.entries().next();
        result.set(remainPlayer.value[0], {
            ...initSettlement,
        });
    }

    let pusoyMap: Map<number, number[]> = new Map();
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
            pusoyMap = pusoyMap.extend(pusoyMapTemp);

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

    for (const [key, value] of pusoyMap) {
        if (value.length > 1 && value.length === players.length - 1) {
            const oldResult = result.get(key);
            result.set(key, {
                ...oldResult!,
                pusoy: {
                    partial: {},
                    full: scoreConfig.pusoy.full * value.length,
                },
            });

            for (const other of value) {
                const oldResult = result.get(other);
                result.set(other, {
                    ...oldResult!,
                    pusoy: {
                        partial: {
                            ...oldResult!.pusoy.partial,
                            [key]: 0,
                        },
                        full: -scoreConfig.pusoy.full,
                    },
                });
            }
        }
    }

    for (let i = 0; i < players.length - 1; i++) {
        for (let j = i + 1; j < players.length; j++) {
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
            result = updateOrInsertSettleResult(
                result,
                oldResult1,
                i,
                crackPlayers,
                scoreConfig,
                naturalResult1,
            );

            result = updateOrInsertSettleResult(
                result,
                oldResult2,
                j,
                crackPlayers,
                scoreConfig,
                naturalResult2,
            );
        }
    }

    for (const [key, value] of result) {
        result.set(key, {
            ...value,
            sum:
                value.crack.score +
                value.pusoy.full +
                Object.values(value.normal).reduce((a, b) => a + b, 0) +
                Object.values(value.natural).reduce(
                    (a, b) => a + b * (players.length - 1),
                    0,
                ) +
                Object.values(value.pusoy.partial).reduce((a, b) => a + b, 0) +
                Object.values(value.royalty.front).reduce((a, b) => a + b, 0) +
                Object.values(value.royalty.middle).reduce((a, b) => a + b, 0) +
                Object.values(value.royalty.back).reduce((a, b) => a + b, 0),
        });
    }

    return result;
};

const subtractValue = (object: Record<string, number>) => {
    const newObject: Record<string, number> = {};
    for (const key in object) {
        newObject[key] = -object[key];
    }

    return newObject;
};

function updateOrInsertSettleResult(
    resultMap: Map<number, Settlement>,
    oldResult: Settlement | undefined,
    i: number,
    crackPlayers: Set<number>,
    scoreConfig: ScoreConfig,
    naturalResult1: Record<string, number>,
) {
    const newResult = { ...resultMap };
    if (!oldResult) {
        newResult.set(i, {
            ...initSettlement,
            crack: {
                isCrack: crackPlayers.has(i),
                score: crackPlayers.has(i) ? scoreConfig.crack : 0,
            },
            natural: naturalResult1,
        });
    }
    newResult.set(i, {
        ...oldResult!,
        crack: {
            ...oldResult!.crack,
            score:
                oldResult!.crack!.score +
                (oldResult!.crack!.isCrack ? scoreConfig.crack : 0),
        },
        natural: {
            ...oldResult!.natural,
            ...naturalResult1,
        },
    });

    return newResult;
}

function updateResultByCompareSegment(
    result: Map<number, Settlement>,
    compareHandPlayerIds: number[],
    i: number,
    pusoyScore: {},
    royaltyScore: Hand<Record<string, number>>,
    handScore: { front: number; middle: number; back: number },
    updateSegmentScore: Record<string, number>,
) {
    const newResult = { ...result };
    const oldValue: Settlement | undefined = newResult.get(
        compareHandPlayerIds[i],
    );
    newResult.set(compareHandPlayerIds[i], {
        ...initSettlement,
        pusoy: {
            partial: {
                ...oldValue?.pusoy?.partial,
                ...pusoyScore,
            },
            full: 0,
        },
        royalty: {
            front: {
                ...oldValue?.royalty?.front,
                ...royaltyScore.front,
            },
            middle: {
                ...oldValue?.royalty?.middle,
                ...royaltyScore.middle,
            },
            back: {
                ...oldValue?.royalty?.back,
                ...royaltyScore.back,
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
}

function calculatePusoy(
    front: number,
    middle: number,
    back: number,
    scoreConfig: ScoreConfig,
    compareHandPlayerIds: number[],
    player1Position: number,
    player2Position: number,
) {
    const pusoyScore1 = {};
    const pusoyScore2 = {};
    let pusoyMap: Map<number, number[]> = new Map();
    const sum = front + middle + back;
    if (Math.abs(sum) === 3) {
        const score =
            Math.floor(sum / Math.abs(sum)) * scoreConfig.pusoy.partial;

        if (sum > 0) {
            pusoyMap = pusoyMap.pushItem(
                compareHandPlayerIds[player1Position],
                compareHandPlayerIds[player2Position],
            );
        } else {
            pusoyMap = pusoyMap.pushItem(
                compareHandPlayerIds[player2Position],
                compareHandPlayerIds[player1Position],
            );
        }

        pusoyScore1[player2Position] = score;
        pusoyScore2[player1Position] = -score;
    }

    return { pusoyScore1, pusoyScore2, pusoyMap };
}

function calculateRoyalty(
    front: number,
    middle: number,
    back: number,
    player1: Hand<SegmentScore>,
    player2: Hand<SegmentScore>,
    scoreConfig: ScoreConfig,
) {
    const royaltyScore1: Hand<Record<string, number>> = { ...initRoyaltyScore };
    const royaltyScore2: Hand<Record<string, number>> = { ...initRoyaltyScore };

    royaltyScore1.front = getRoyaltyScore(
        scoreConfig.royalty.front,
        player1.front.type,
        player2.front.type,
        front,
    );
    royaltyScore2.front = subtractValue(royaltyScore1.front);

    royaltyScore1.middle = getRoyaltyScore(
        scoreConfig.royalty.middle,
        player1.middle.type,
        player2.middle.type,
        middle,
    );
    royaltyScore2.middle = subtractValue(royaltyScore1.middle);

    royaltyScore1.back = getRoyaltyScore(
        scoreConfig.royalty.back,
        player1.back.type,
        player2.back.type,
        back,
    );
    royaltyScore2.back = subtractValue(royaltyScore1.back);

    return {
        royaltyScore1,
        royaltyScore2,
    };
}

const getRoyaltyScore = (
    royaltySegmentConfig: Record<string, number>,
    player1: HandType,
    player2: HandType,
    segmentScore: number,
): Record<string, number> => {
    let royaltyScore: number | undefined = undefined;
    let sign = 1;
    let key = NaturalDisplay[player1];

    if (segmentScore < 0) {
        key = NaturalDisplay[player2];
        sign = -1;
    }

    royaltyScore = royaltySegmentConfig[key];

    return royaltyScore ? { key: royaltyScore * sign } : {};
};
function addNormalScore(
    a: { front: number; middle: number; back: number },
    b: { front: number; middle: number; back: number },
): Hand<number> {
    return {
        front: a.front + b.front,
        middle: a.middle + b.middle,
        back: a.back + b.back,
    };
}

const settleNatural = (
    naturalScoreConfig: Record<string, number>,
    player1: NaturalScore | undefined,
    player2: NaturalScore | undefined,
): {
    player1Result: Record<string, number>;
    player2Result: Record<string, number>;
} => {
    let player1Result = {};

    if (!player1 && !player2) {
        player1Result = isLarger(player1!, player2!)
            ? {
                  [NaturalDisplay[player1!.type]]:
                      naturalScoreConfig[player1!.type],
              }
            : {
                  [NaturalDisplay[player2!.type]]:
                      naturalScoreConfig[player2!.type],
              };
    } else if (!player1) {
        player1Result = {
            [NaturalDisplay[player1!.type]]: naturalScoreConfig[player1!.type],
        };
    } else if (!player2) {
        player1Result = {
            [NaturalDisplay[player2!.type]]: naturalScoreConfig[player2!.type],
        };
    }

    return {
        player1Result,

        player2Result: subtractValue(player1Result),
    };
};
