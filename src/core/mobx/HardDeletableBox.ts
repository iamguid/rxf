import { action, computed, IObservableValue, observable } from "mobx";
import { createInstanceofPredicate } from "../utils";

export interface IHardDeletableBox<T> {
    get(): T;
    set(value: T): void;
    isDeleted: boolean;
    delete(): void;
}

export class HardDeletableBox<T> implements IHardDeletableBox<T> {
    private observableValue: IObservableValue<T>;
    private observableDeletedFlag: IObservableValue<boolean>;

    constructor(value: T) {
        this.observableValue = observable.box(value);
        this.observableDeletedFlag = observable.box(false);
    }

    @computed
    public get(): T {
        return this.observableValue.get();
    }

    @action
    public set(value: T): void {
        return this.observableValue.set(value);
    }

    @computed
    public get isDeleted(): boolean {
        return this.observableDeletedFlag.get();
    }

    @action
    public delete(): void {
        return this.observableDeletedFlag.set(true);
    }
}

export const isHardDeletableBox = createInstanceofPredicate("HardDeletableBox", HardDeletableBox) as (x: any) => x is HardDeletableBox<any>