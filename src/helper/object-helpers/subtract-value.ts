export const subtractValue = (object: Record<string, number>) => {
    const newObject: Record<string, number> = {};
    for (const key in object) {
        newObject[key] = -object[key];
    }

    return newObject;
};
