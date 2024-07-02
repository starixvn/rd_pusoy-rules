import { NaturalDisplay, initSettlement } from "../const";
import { isLarger } from "../helper/card-helpers";
import { subtractValue, sumOrInsertValueByKey } from "../helper/object-helpers";
import { NaturalScore, ScoreConfig, Settlement } from "../types";

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
        natural: sumOrInsertValueByKey(oldResult!.natural, naturalResult1),
    });

    return newResult;
};
