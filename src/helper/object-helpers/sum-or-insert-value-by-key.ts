export const sumOrInsertValueByKey = (
    a: Record<string, number>,
    b: Record<string, number>,
): Record<string, number> => {
    const aKeys: Set<string> = new Set(Object.keys(a));
    const bKeys: Set<string> = new Set(Object.keys(b));
    let result: Record<string, number> = {};

    aKeys.forEach((key) => {
        if (bKeys.has(key)) {
            result = { ...result, [key]: a[key] + b[key] };
        } else {
            result = { ...result, [key]: a[key] };
        }
    });

    bKeys.forEach((key) => {
        if (!aKeys.has(key)) {
            result = { ...result, [key]: b[key] };
        }
    });

    return result;
};
