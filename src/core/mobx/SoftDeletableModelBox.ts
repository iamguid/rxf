import { observable, IObservableValue, computed, action } from "mobx";
import { IModel } from "../IModel";
import { createInstanceofPredicate } from "../utils";

export interface ISoftDeletableModelBox<T extends IModel> {
    get(): T;
    set(value: T): void;
    isDeleted: boolean;
    delete(): void;
    undelete(): void;
}

export class SoftDeletableModelBox<T extends IModel> implements ISoftDeletableModelBox<T> {
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

    @action
    public undelete(): void {
        return this.observableDeletedFlag.set(false);
    }
}

export const isSoftDeletableModelBox = createInstanceofPredicate("SoftDeletableModelBox", SoftDeletableModelBox) as (x: any) => x is SoftDeletableModelBox<any>
