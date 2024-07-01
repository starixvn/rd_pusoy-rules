export const pushItem = function <K, V>(
    origin: Map<K, V[]>,
    itemKey: K,
    item: V,
) {
    const newMap = new Map(origin);

    if (!newMap.has(itemKey)) {
        newMap.set(itemKey, [item]);
    } else {
        newMap.get(itemKey)?.push(item);
    }

    return newMap;
};
