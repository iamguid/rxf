import { action, computed, IObservableValue, observable } from "mobx";
import { IModel } from "../IModel";
import { createInstanceofPredicate } from "../utils";

export interface IHardDeletableModelBox<T extends IModel> {
    get(): T;
    set(value: T): void;
    isDeleted: boolean;
    delete(): void;
}

export class HardDeletableModelBox<T extends IModel> implements IHardDeletableModelBox<T> {
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

export const isHardDeletableModelBox = createInstanceofPredicate("HardDeletableModelBox", HardDeletableModelBox) as (x: any) => x is HardDeletableModelBox<any>