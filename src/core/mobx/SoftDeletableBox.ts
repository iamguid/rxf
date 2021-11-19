import { observable, IObservableValue, computed, action } from "mobx";
import { createInstanceofPredicate } from "../utils";

export interface ISoftDeletableBox<T> {
    get(): T;
    set(value: T): void;
    isDeleted: boolean;
    delete(): void;
    undelete(): void;
}

export class SoftDeletableBox<T> implements ISoftDeletableBox<T> {
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

export const isSoftDeletableBox = createInstanceofPredicate("SoftDeletableBox", SoftDeletableBox) as (x: any) => x is SoftDeletableBox<any>
