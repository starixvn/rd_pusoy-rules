declare global {
    interface Map<K, V> {
        pushItem<V>(this: Map<K, V[]>, itemKey: K, item: V): Map<K, V[]>;
        accumulateFromOtherMap<V>(
            this: Map<K, V[]>,
            otherMap: Map<K, V[]>,
        ): Map<K, V[]>;
        getSortedIncreaseKeys(this: Map<number, V>): number[];
    }
}

Map.prototype.pushItem = function<K, V>(
    this: Map<K, V[]>,
    itemKey: K,
    item: V,
) {
    if (!this.has(itemKey)) {
        this.set(itemKey, [item]);
    } else {
        this.get(itemKey)?.push(item);
    }

    return this;
};

Map.prototype.accumulateFromOtherMap = function<K, V>(
    this: Map<K, V[]>,
    otherMap: Map<K, V[]>,
): Map<K, V[]> {
    otherMap.forEach((value, key) => {
        value.forEach((v) => this.pushItem(key, v));
    });

    return this;
};

Map.prototype.getSortedIncreaseKeys = function<V>(
    this: Map<number, V>,
): number[] {
    return Array.from(this.keys()).sort((a, b) => a - b);
};

export {};
