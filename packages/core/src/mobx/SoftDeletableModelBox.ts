import { observable, IObservableValue, computed, action } from "mobx";
import { IModel } from "../IModel";
import { createInstanceofPredicate } from "../utils";
import { IModelBox } from "./IModelBox";

export interface ISoftDeletableModelBox<T extends IModel> {
    get(): T;
    isLoading: boolean;
    isDeleted: boolean;
}

export interface ISoftDeletableModelBoxInternal<T extends IModel> extends IModelBox<T> {
    get(): T;
    set(value: T): void;
    isLoading: boolean;
    isDeleted: boolean;
    setIsDeleted(flag: boolean): void;
    setIsLoading(flag: boolean): void;
}

export class SoftDeletableModelBox<T extends IModel> implements ISoftDeletableModelBoxInternal<T> {
    private observableValue: IObservableValue<T>;
    private observableDeletedFlag: IObservableValue<boolean>;
    private observableIsLoading: IObservableValue<boolean>;

    constructor(value: T) {
        this.observableValue = observable.box(value);
        this.observableDeletedFlag = observable.box(false);
        this.observableIsLoading = observable.box(true);
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

    @computed
    public get isLoading(): boolean {
        return this.observableIsLoading.get();
    }

    @action
    public setIsDeleted(flag: boolean): void {
        return this.observableDeletedFlag.set(flag);
    }

    @action
    public setIsLoading(flag: boolean): void {
        return this.observableIsLoading.set(flag);
    }
}

export const isSoftDeletableModelBox = createInstanceofPredicate("SoftDeletableModelBox", SoftDeletableModelBox) as (x: any) => x is SoftDeletableModelBox<any>
