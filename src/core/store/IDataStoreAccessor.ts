import { IModel } from "../IModel";
import { IPrivateModelBox } from "../mobx/IModelBox";

export type IdGetter<TModel extends IModel> = (model: TModel) => string;
export type Setter<TModel extends IModel> = (id: string, value: IPrivateModelBox<TModel>) => void;
export type Getter<TModel extends IModel> = (id: string) => IPrivateModelBox<TModel> | undefined;
export type Wrapper<TModel extends IModel> = (model: TModel) => IPrivateModelBox<TModel>;

export type IDataStoreAccessor<TModel extends IModel> = {
    getId: IdGetter<TModel>;
    get: Getter<TModel>;
    set: Setter<TModel>;
    wrap: Wrapper<TModel>;
}
