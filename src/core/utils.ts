export type constructor<T> = {
    new (...args: any[]): T;
};

export function createInstanceofPredicate<T>(
    name: string,
    clazz: new (...args: any[]) => T
): (x: any) => x is T {
    const propName = "__is" + name
    clazz.prototype[propName] = true
    return function (x: any) {
        return isObject(x) && x[propName] === true
    } as any
}

export function isObject(value: any): value is Object {
    return value !== null && typeof value === "object"
}
