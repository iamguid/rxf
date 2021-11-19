import { container, injectable } from "tsyringe";
import { ISerializable } from "../ISerializable";
import { ObjectsRegistry } from "../ObjectsRegistry";
import { constructor } from "../utils";

export default function defineStateStore<T extends ISerializable>(token: symbol): (target: constructor<T>) => void {
    return function(target: constructor<T>): void {
        injectable()(target);
        container.registerSingleton(token, target);
        container.afterResolution(token, (_, result: ISerializable) => {
            const registry = container.resolve(ObjectsRegistry)
            registry.set(token, result);
        })
    };
}
