import { IObservableValue } from "mobx";
import { IModel } from "../IModel";

export type IdGetter<TModel extends IModel> = (model: TModel) => string;
export type Setter<TModel extends IModel> = (id: string, value: IObservableValue<TModel>) => void;
export type Getter<TModel extends IModel> = (id: string) => IObservableValue<TModel> | undefined;

export type IDataStoreAccessor<TModel extends IModel> = {
    getId: IdGetter<TModel>;
    get: Getter<TModel>;
    set: Setter<TModel>;
}
