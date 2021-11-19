import { container, injectable } from "tsyringe";
import { constructor } from "../utils";

export default function defineStateStore<T>(): (target: constructor<T>) => void {
    return function(target: constructor<T>): void {
        injectable()(target);
        container.registerSingleton(target);
    };
}
