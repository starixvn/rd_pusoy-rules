# pusoy-rules

[![Quality Gate Status](https://sonarqube.lumigame.com/api/project_badges/measure?project=pusoy-rules&metric=alert_status&token=sqb_13a8ea8806009aa830201deeb2557449a6d80e08)](https://sonarqube.lumigame.com/dashboard?id=pusoy-rules)

pusoy-rules is a TypeScript library for supporting settle Pusoy Game.

## Installation

Use npm to install pusoy-rules.

```bash
npm install pusoy-rules
```

## Usage

```typescript
import { Hand, ScoreConfig, Scorer, settle } from "pusoy-rules";

const scoreConfig: ScoreConfig = {
    normal: 1,
    natural: {
        ThreeFlushes: 3,
        SixPairs: 6,
        Dragon: 12,
    },
    crack: 6,
    pusoy: {
        partial: 3,
        full: 6,
    },
    royalty: {
        front: {
            ThreeOfAKind: 3,
        },
        middle: {
            FullHouse: 2,
            FourOfAKind: 8,
            StraightFlush: 10,
            RoyalFlush: 20,
        },
        back: {
            FourOfAKind: 4,
            StraightFlush: 5,
            RoyalFlush: 10,
        },
    },
};

const player1: Hand<number[]> = {
    front: [0, 2, 25],
    middle: [44, 43, 24, 31, 29],
    back: [51, 50, 15, 13, 47],
};
const player2: Hand<number[]> = {
    front: [16, 18, 19],
    middle: [21, 10, 8, 9, 11],
    back: [17, 6, 7, 4, 5],
};
const player3: Hand<number[]> = {
    front: [40, 1, 48],
    middle: [3, 35, 14, 34, 30],
    back: [45, 41, 36, 49, 33],
};

const result = settle(
    [player1, player2, player3],
    [true, false, true],
    scoreConfig,
    Scorer,
);
```

## API documentation

<!-- INSERT GENERATED DOCS START -->

### `settle` (function)

Calculates the settlement for each player based on the given players, alert for natural, score configuration, and scorer.

**Parameters:**

-   players (`Hand<number[]>[]`) - The array of player's hands.
-   isAlertNatural (`boolean[]`) - The array indicating if player alerts for natural.
-   scoreConfig (`ScoreConfig`) - The configuration for scoring.
-   scorer (`IScorer<number[], SegmentScore, NaturalCheckResult>`) - The scorer for calculating scores.

<!-- INSERT GENERATED DOCS END -->

## Cards Convention
