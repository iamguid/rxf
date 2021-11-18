import { injectable } from "tsyringe";
import instance from "tsyringe/dist/typings/dependency-container";
import { constructor } from "tsyringe/dist/typings/types";

export default function defineService<T>(): (target: constructor<T>) => void {
    return function(target: constructor<T>): void {
        injectable()(target);
        instance.registerSingleton(target);
    };
}
