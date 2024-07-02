import { PlayerData, ScoreConfig } from "../types";
import { settle } from "./settle";

export const createPusoyRules = (scoreConfig: ScoreConfig) => {
    return {
        /**
         * Calculates the settlement for each player based on the given score configuration.
         *
         * @param {PlayerData[]} playerData - an array of player data to settle
         * @return {Settlement[]} An array of settlements for each player
         */
        settle: (playerData: PlayerData[]) => {
            return settle(playerData, scoreConfig);
        },
    };
};
