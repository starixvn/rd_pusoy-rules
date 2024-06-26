export const pushItem = function <K, V>(
    originMap: Map<K, V[]>,
    itemKey: K,
    item: V,
) {
    const newMap = new Map(originMap);
    if (!newMap.has(itemKey)) {
        newMap.set(itemKey, [item]);
    } else {
        newMap.get(itemKey)?.push(item);
    }

    return newMap;
};

export const extend = function <K, V>(
    originMap: Map<K, V>,
    extendMap: Map<K, V>,
) {
    const newMap = new Map(originMap);
    extendMap.forEach((value, key) => {
        newMap.set(key, value);
    });

    return newMap;
};

export const getSortedKey = function <V>(
    originMap: Map<number, V>,
    increase = true,
): number[] {
    const newMap = new Map(originMap);
    return Array.from(newMap.keys()).sort(
        (a, b) => (a - b) * (increase ? 1 : -1),
    );
};
