import { HandPosition } from "./consts";
import { isCrack } from "./card-checker/crack-checker";
import { accumulateItems, extendMap } from "./helper/map-helpers";
import { checkNatural } from "./card-checker/natural-checker";
import { calculateSegmentScore, isLarger } from "./scorer";
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
    pusoyScore: {},
    royaltyScore: {},
    sumScore: 0,
};

const initHandScore: Hand<SegmentScore> = {
    front: {
        rankScore: 0,
        suitScore: 0,
        typeScore: 0,
    },
    middle: {
        rankScore: 0,
        suitScore: 0,
        typeScore: 0,
    },
    back: {
        rankScore: 0,
        suitScore: 0,
        typeScore: 0,
    },
};

const initNormalScore = {
    front: 0,
    middle: 0,
    back: 0,
};

export const settle = (
    players: Hand<number[]>[],
    scoreConfig: ScoreConfig
): Map<number, Settlement> => {
    const result: Map<number, Settlement> = new Map();
    const compareHandPlayers: Map<number, Hand<SegmentScore>> = new Map();
    for (let i = 0; i < players.length; i++) {
        const handScore: Hand<SegmentScore> = {
            front: calculateSegmentScore(players[i].front),
            middle: calculateSegmentScore(players[i].middle),
            back: calculateSegmentScore(players[i].back),
        };

        if (isCrack(handScore)) {
            result.set(i, {
                ...initSettlement,
                crackScore: -scoreConfig.crackScore * (players.length - 1),
            });

            continue;
        }

        const naturalCheckResult = checkNatural(
            players[i],
            handScore,
            scoreConfig.naturalScore
        );

        if (Object.keys(naturalCheckResult).length > 0) {
            result.set(i, {
                ...initSettlement,
                naturalScore: naturalCheckResult as Record<string, number>,
            });

            continue;
        }

        compareHandPlayers.set(i, handScore);
    }

    if (compareHandPlayers.size < 2) {
        const remainPlayer = compareHandPlayers.entries().next();
        result.set(remainPlayer.value[0], {
            ...initSettlement,
        });
    }

    const pusoyMap: Map<number, number[]> = new Map();
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
                j
            );
            extendMap(pusoyMap, pusoyMapTemp);

            const { royaltyScore1, royaltyScore2, updateSegmentScore } =
                calculateRoyalty(
                    front,
                    middle,
                    back,
                    player1,
                    player2,
                    scoreConfig
                );

            const handScore1 = {
                front: front * scoreConfig.normalScore,
                middle: middle * scoreConfig.normalScore,
                back: back * scoreConfig.normalScore,
            };

            const handScore2 = {
                front: -front * scoreConfig.normalScore,
                middle: -middle * scoreConfig.normalScore,
                back: -back * scoreConfig.normalScore,
            };

            updateTempResult(
                result,
                compareHandPlayerIds,
                i,
                pusoyScore1,
                royaltyScore1,
                handScore1,
                updateSegmentScore
            );

            updateTempResult(
                result,
                compareHandPlayerIds,
                j,
                pusoyScore2,
                royaltyScore2,
                handScore2,
                updateSegmentScore
            );
        }
    }

    for (const [key, value] of pusoyMap) {
        if (value.length > 1 && value.length === players.length - 1) {
            result[key].fullPusoyScore =
                scoreConfig.fullPusoyScore * value.length;

            for (const other of value) {
                result[other].fullPusoyScore = -scoreConfig.fullPusoyScore;
                result[other].pusoyScore = {
                    ...result[other].pusoyScore,
                    [key]: 0,
                };
            }
        }
    }

    for (let i = 0; i < players.length - 1; i++) {
        for (let j = i + 1; j < players.length; j++) {
            result.set(i, {
                ...(result.get(i) || initSettlement),
                crackScore:
                    result.get(i)?.crackScore ||
                    0 +
                        (result.get(j)?.crackScore || 0 < 0
                            ? scoreConfig.crackScore
                            : 0),
                naturalScore: {
                    ...result.get(i)?.naturalScore,
                    ...subtractValue(result.get(j)?.naturalScore || {}),
                },
            });

            result.set(j, {
                ...(result.get(j) || initSettlement),
                crackScore:
                    result.get(j)?.crackScore ||
                    0 +
                        (result.get(i)?.crackScore || 0 < 0
                            ? scoreConfig.crackScore
                            : 0),
                naturalScore: {
                    ...result.get(j)?.naturalScore,
                    ...subtractValue(result.get(i)?.naturalScore || {}),
                },
            });
        }
    }

    for (const [key, value] of result) {
        result.set(key, {
            ...value,
            sumScore:
                value.crackScore +
                value.fullPusoyScore +
                Object.values(value.normalScore).reduce((a, b) => a + b, 0) +
                Object.values(value.naturalScore).reduce(
                    (a, b) => a + b * (players.length - 1),
                    0
                ) +
                Object.values(value.pusoyScore).reduce((a, b) => a + b, 0) +
                Object.values(value.royaltyScore).reduce((a, b) => a + b, 0),
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

const getRoyaltyScore = (
    royaltyConfig: Record<string, number>,
    position: HandPosition,
    typeScore: number
) => {
    return royaltyConfig[`${position}.${typeScore}`] || undefined;
};

function updateTempResult(
    tempResult: Map<number, Settlement>,
    compareHandPlayerIds: number[],
    i: number,
    pusoyScore: {},
    royaltyScore: Record<string, number>,
    handScore: { front: number; middle: number; back: number },
    updateSegmentScore: Record<string, number>
) {
    tempResult.set(compareHandPlayerIds[i], {
        ...initSettlement,
        pusoyScore: {
            ...tempResult.get(compareHandPlayerIds[i])?.pusoyScore,
            ...pusoyScore,
        },
        royaltyScore: {
            ...tempResult.get(compareHandPlayerIds[i])?.royaltyScore,
            ...royaltyScore,
        },
        normalScore: addNormalScore(
            {
                ...initNormalScore,
                ...tempResult.get(compareHandPlayerIds[i])?.normalScore,
            },
            {
                ...handScore,
                ...updateSegmentScore,
            }
        ),
    });
}

function calculatePusoy(
    front: number,
    middle: number,
    back: number,
    scoreConfig: ScoreConfig,
    compareHandPlayerIds: number[],
    player1Position: number,
    player2Position: number
) {
    const pusoyScore1 = {};
    const pusoyScore2 = {};
    const pusoyMap: Map<number, number[]> = new Map();
    const sum = front + middle + back;
    if (Math.abs(sum) === 3) {
        const score = Math.floor(sum / Math.abs(sum)) * scoreConfig.pusoyScore;

        if (sum > 0) {
            accumulateItems(
                pusoyMap,
                compareHandPlayerIds[player1Position],
                compareHandPlayerIds[player2Position]
            );
        } else {
            accumulateItems(
                pusoyMap,
                compareHandPlayerIds[player2Position],
                compareHandPlayerIds[player1Position]
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
    scoreConfig: ScoreConfig
) {
    const updateSegmentScore: Record<string, number> = {};
    const royaltyScore1: Record<string, number> = {};
    const royaltyScore2: Record<string, number> = {};

    [
        {
            segmentScore: front,
            position: HandPosition.Front,
            player1Score: player1.front,
            player2Score: player2.front,
        },
        {
            segmentScore: middle,
            position: HandPosition.Middle,
            player1Score: player1.middle,
            player2Score: player2.middle,
        },
        {
            segmentScore: back,
            position: HandPosition.Back,
            player1Score: player1.back,
            player2Score: player2.back,
        },
    ].forEach(({ segmentScore, position, player1Score, player2Score }) => {
        if (segmentScore > 0) {
            const royaltyScore = getRoyaltyScore(
                scoreConfig.royaltyScore,
                position,
                player1Score.typeScore
            );
            if (royaltyScore !== undefined) {
                royaltyScore1[`${royaltyScore}.${position}`] = royaltyScore;
                royaltyScore2[`${royaltyScore}.${position}`] = -royaltyScore;
                updateSegmentScore[position] = 0;
            }
        } else if (segmentScore < 0) {
            const royaltyScore = getRoyaltyScore(
                scoreConfig.royaltyScore,
                position,
                player2Score.typeScore
            );
            if (royaltyScore !== undefined) {
                royaltyScore1[`${royaltyScore}.${position}`] = -royaltyScore;
                royaltyScore2[`${royaltyScore}.${position}`] = royaltyScore;
                updateSegmentScore[position] = 0;
            }
        }
    });

    return {
        royaltyScore1,
        royaltyScore2,
        updateSegmentScore,
    };
}
function addNormalScore(
    a: { front: number; middle: number; back: number },
    b: { front: number; middle: number; back: number }
): Hand<number> {
    return {
        front: a.front + b.front,
        middle: a.middle + b.middle,
        back: a.back + b.back,
    };
}
