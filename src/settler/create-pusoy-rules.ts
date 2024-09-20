import { Hand, ScoreConfig, Settlement, InGameSettings } from "../types";
import { settle } from "./settle";

export const createPusoyRules = (scoreConfig: ScoreConfig) => {
    return {
        /**
         * Calculates the settlement for each player based on the given score configuration.
         *
         * @param {Hand<number[]>[]} playerData - an array of player data to settle
         * @param {InGameSettings} inGameSettings - in-game settings
         * @return {Settlement[]} An array of settlements for each player
         */
        settle: (playerData: Hand<number[]>[], inGameSettings?: InGameSettings): Settlement[] => {
            return settle(playerData, scoreConfig, inGameSettings);
        },
    };
};
