declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        sortIncrease<T extends number>(this: T[]): T[];
    }
}

Array.prototype.sortIncrease = function<T extends number>(this: T[]): T[] {
    return this.sort((a, b) => a - b);
};

export {};
