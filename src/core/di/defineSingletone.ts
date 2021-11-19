import { container, injectable } from ".";
import { constructor } from "../utils";

export default function defineSingletone<T>(token: symbol): (target: constructor<T>) => void {
    return function(target: constructor<T>): void {
        injectable()(target);
        container.registerSingleton(token, target);
    };
}
