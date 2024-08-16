export const sortIncrease = <T extends number>(origin: T[]): T[] => {
    const newArray = [...origin];

    return newArray.sort((a, b) => a - b);
};
