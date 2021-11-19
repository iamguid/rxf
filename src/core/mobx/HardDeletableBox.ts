import { IObservableValue, observable } from "mobx";
import { createInstanceofPredicate } from "../utils";

export interface IHardDeletableBox<T> {
    get(): T;
    set(value: T): void;
    isDeleted(): boolean;
    delete(): void;
}

export class HardDeletableBox<T> implements IHardDeletableBox<T> {
    private observableValue: IObservableValue<T>;
    private observableDeletedFlag: IObservableValue<boolean>;

    constructor(value: T) {
        this.observableValue = observable.box(value);
        this.observableDeletedFlag = observable.box(false);
    }

    public get(): T {
        return this.observableValue.get();
    }

    public set(value: T): void {
        return this.observableValue.set(value);
    }

    public isDeleted(): boolean {
        return this.observableDeletedFlag.get();
    }

    public delete(): void {
        return this.observableDeletedFlag.set(true);
    }
}

export const isHardDeletableBox = createInstanceofPredicate("HardDeletableBox", HardDeletableBox) as (x: any) => x is HardDeletableBox<any>