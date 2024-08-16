import { pushItem } from "./push-item";

export const accumulateFromOtherMap = function <K, V>(
    origin: Map<K, V[]>,
    otherMap: Map<K, V[]>,
): Map<K, V[]> {
    let newMap = new Map(origin);
    otherMap.forEach((value, key) => {
        value.forEach((v) => (newMap = pushItem(newMap, key, v)));
    });

    return newMap;
};
