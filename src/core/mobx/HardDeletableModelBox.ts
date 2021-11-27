import { action, computed, IObservableValue, observable } from "mobx";
import { IModel } from "../IModel";
import { createInstanceofPredicate } from "../utils";
import { IModelBox } from "./IModelBox";

export interface IHardDeletableModelBox<T extends IModel> {
    get(): T;
    isDeleted: boolean;
}

export interface IHardDeletableModelBoxInternal<T extends IModel> extends IModelBox<T> {
    get(): T;
    set(value: T): void;
    setIsDeleted(flag: boolean): void;
}

export class HardDeletableModelBox<T extends IModel> implements IHardDeletableModelBoxInternal<T> {
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
    public setIsDeleted(value: boolean): void {
        return this.observableDeletedFlag.set(value);
    }
}

export const isHardDeletableModelBox = createInstanceofPredicate("HardDeletableModelBox", HardDeletableModelBox) as (x: any) => x is HardDeletableModelBox<any>