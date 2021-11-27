import { action, computed, IObservableValue, observable } from "mobx";

export interface IAsyncIteratorBox<T> {
    get(): AsyncIterableIterator<T>
}

export interface IAsyncIteratorBoxInternal<T> {
    get(): AsyncIterableIterator<T>
    set(value: AsyncIterableIterator<T>): void;
}

export class AsyncIteratorBox<T> implements IAsyncIteratorBoxInternal<T> {
    private observableIterator: IObservableValue<AsyncIterableIterator<T>>;

    constructor(value: AsyncIterableIterator<T>) {
        this.observableIterator = observable.box(value);
    }

    @computed
    public get(): AsyncIterableIterator<T> {
        return this.observableIterator.get();
    }

    @action
    public set(value: AsyncIterableIterator<T>): void {
        return this.observableIterator.set(value);
    }
}
