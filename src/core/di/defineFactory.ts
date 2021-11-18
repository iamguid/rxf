import { container, DependencyContainer } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";

export default function defineFactory<TFactory, TClass>(
    key: symbol,
    factory: (container: DependencyContainer) => TFactory
): (target: constructor<TClass>) => void {
    return function (target: constructor<TClass>) {
        container.register(key, { useFactory: factory });
    };
}
