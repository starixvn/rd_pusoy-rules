import { Natural, initSettlement } from "../const";
import { isLarger } from "../helper/card-helpers";
import { NaturalScore, NaturalUnit, ScoreConfig, Settlement } from "../types";

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
                naturalPlayers.get(i),
                crackPlayers.has(i),
                naturalPlayers.get(j),
                crackPlayers.has(j),
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
    naturalScore1: NaturalScore | undefined,
    player1Crack: boolean,
    naturalScore2: NaturalScore | undefined,
    player2Crack: boolean,
): {
    player1Result: NaturalUnit;
    player2Result: NaturalUnit;
} => {
    const player1Result: NaturalUnit = {
        name: naturalScore1?.name || Natural.Unknown,
        units: 0,
    };
    const player2Result: NaturalUnit = {
        name: naturalScore2?.name || Natural.Unknown,
        units: 0,
    };

    if (naturalScore1 && naturalScore2) {
        player1Result.units = isLarger(naturalScore1, naturalScore2)
            ? naturalScore1.units
            : -naturalScore2.units;
    } else if (naturalScore1) {
        player1Result.units = player2Crack ? 0 : naturalScore1.units;
    } else if (naturalScore2) {
        player1Result.units = player1Crack ? 0 : -naturalScore2.units;
    }

    player2Result.units = -player1Result.units;

    return {
        player1Result,
        player2Result,
    };
};

const updateOrInsertSettleResultByNaturalAndCrack = (
    resultMap: Map<number, Settlement>,
    oldResult: Settlement | undefined,
    position: number,
    opponentPosition: number,
    crackPlayers: Set<number>,
    scoreConfig: ScoreConfig,
    naturalResult: NaturalUnit,
) => {
    const newResult = new Map(resultMap);

    const crackScore =
        (crackPlayers.has(position) ? -scoreConfig.crack : 0) +
        (crackPlayers.has(opponentPosition) ? scoreConfig.crack : 0) +
        (oldResult?.crack?.units || 0);

    if (!oldResult) {
        newResult.set(position, {
            ...initSettlement,
            crack: {
                isCrack: crackPlayers.has(position),
                units: crackScore,
            },
            natural: naturalResult,
        });

        return newResult;
    }
    newResult.set(position, {
        ...oldResult,
        crack: {
            ...oldResult.crack,
            units: crackScore,
        },
        natural: {
            name: naturalResult.name,
            units: oldResult.natural.units + naturalResult.units,
        },
    });

    return newResult;
};
