import { Lifecycle, singleton } from "tsyringe";
import { ISerializable } from "./ISerializable";

@singleton()
export class ObjectsRegistry implements ISerializable {
    private registry: Map<symbol, ISerializable> = new Map();

    public set(token: symbol, store: ISerializable) {
        if (this.registry.has(token)) {
            throw new Error(`Object with token ${token.toString()} already exist`);
        }

        this.registry.set(token, store);
    }

    public toObject(): Object {
        return Array.from(this.registry.entries()).reduce((accum: any, [key, store]) => {
            accum[key.toString()] = store.toObject();
            return accum;
        }, {})
    }
}