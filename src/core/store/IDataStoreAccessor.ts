import { IObservableValue } from "mobx";
import { IModel } from "../IModel";
import { IHardDeletableBox } from "../mobx/HardDeletableBox";
import { SoftDeletableBox } from "../mobx/SoftDeletableBox";

export type BoxedModel<TModel extends IModel> = IObservableValue<TModel> | IHardDeletableBox<TModel> | SoftDeletableBox<TModel>;
export type IdGetter<TModel extends IModel> = (model: TModel) => string;
export type Setter<TModel extends IModel> = (id: string, value: TModel) => void;
export type Getter<TModel extends IModel> = (id: string) => BoxedModel<TModel> | undefined;

export type IDataStoreAccessor<TModel extends IModel> = {
    getId: IdGetter<TModel>;
    get: Getter<TModel>;
    set: Setter<TModel>;
}
