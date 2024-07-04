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
import { Hand, ScoreConfig, Settler } from "pusoy-rules";

const scoreConfig: ScoreConfig = {
    normal: 1,
    natural: {
        threeStraights: 3,
        threeFlushes: 3,
        sixPairs: 6,
        dragon: 12,
    },
    crack: 6,
    pusoy: {
        mini: 3,
        full: 6,
    },
    royalty: {
        front: {
            threeOfAKind: 3,
        },
        middle: {
            fullHouse: 2,
            fourOfAKind: 8,
            straightFlush: 10,
            royalFlush: 20,
        },
        back: {
            fourOfAKind: 4,
            straightFlush: 5,
            royalFlush: 10,
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

const pusoy = createPusoyRules(scoreConfig);

const result = pusoy.settle([player1, player2, player3]);
```

## API documentation

`settle(playerData) ⇒ Settlement[]`

Calculates the settlement for each player based on the given score configuration.

-   **Parameters**:

    -   `playerData`: An array of player data to settle (type: `Hand<number[]>[]`).

-   **Return Value**: An array of settlements for each player (type: `Settlement[]`).
