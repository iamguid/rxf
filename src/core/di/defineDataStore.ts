import { injectable, container } from "tsyringe";
import { constructor } from "../utils";

export default function defineDataStore<T>(): (target: constructor<T>) => void {
    return function(target: constructor<T>): void {
        injectable()(target);
        container.registerSingleton(target);
    };
}
