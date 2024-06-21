export const countItems = (map: Map<number, number>, item: number) => {
    if (!map.has(item)) {
        map.set(item, 1);
    } else {
        map.set(item, (map.get(item) as number) + 1);
    }
};

export const accumulateItems = (
    map: Map<number, number[]>,
    key: number,
    value: number
) => {
    if (!map.has(key)) {
        map.set(key, [value]);
    } else {
        map.get(key)?.push(value);
    }
};

export const extendMap = <K, V>(origin: Map<K, V>, other: Map<K, V>) => {
    other.forEach((value, key) => {
        origin.set(key, value);
    });
};
