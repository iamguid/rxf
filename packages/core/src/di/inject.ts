import { inject as tsyringeInject } from "tsyringe";

export function inject(token: symbol): (
    target: any, 
    propertyKey: string | symbol, 
    parameterIndex: number
) => any {
    return tsyringeInject(token);
}
