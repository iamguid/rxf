import { IObservableValue } from "mobx";
import { IModel } from "../IModel";
import { IHardDeletableModelBox } from "../mobx/HardDeletableModelBox";
import { SoftDeletableModelBox } from "../mobx/SoftDeletableModelBox";

export type BoxedModel<TModel extends IModel> = IObservableValue<TModel> | IHardDeletableModelBox<TModel> | SoftDeletableModelBox<TModel>;
export type IdGetter<TModel extends IModel> = (model: TModel) => string;
export type Setter<TModel extends IModel> = (id: string, value: BoxedModel<TModel>) => void;
export type Getter<TModel extends IModel> = (id: string) => BoxedModel<TModel> | undefined;
export type Creator<TModel extends IModel> = (mode: TModel) => BoxedModel<TModel>;

export type IDataStoreAccessor<TModel extends IModel> = {
    getId: IdGetter<TModel>;
    get: Getter<TModel>;
    set: Setter<TModel>;
    create: Creator<TModel>
}
