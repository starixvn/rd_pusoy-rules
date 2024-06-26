declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Map<K, V> {
        pushItem<V>(this: Map<K, V[]>, itemKey: K, item: V): Map<K, V[]>;
        extend<K, V>(this: Map<K, V>, other: Map<K, V>): Map<K, V>;
        getSortedKey<V>(this: Map<number, V>, increase: boolean): number[];
    }
}

Map.prototype.pushItem = function <K, V>(
    this: Map<K, V[]>,
    itemKey: K,
    item: V,
) {
    const newMap = new Map(this);
    if (!newMap.has(itemKey)) {
        newMap.set(itemKey, [item]);
    } else {
        newMap.get(itemKey)?.push(item);
    }

    return newMap;
};

Map.prototype.extend = function <K, V>(this: Map<K, V>, other: Map<K, V>) {
    const newMap = new Map(this);
    other.forEach((value, key) => {
        newMap.set(key, value);
    });

    return newMap;
};

Map.prototype.getSortedKey = function <V>(
    this: Map<number, V>,
    increase = true,
): number[] {
    const newMap = new Map(this);
    return Array.from(newMap.keys()).sort(
        (a, b) => (a - b) * (increase ? 1 : -1),
    );
};

export {};
