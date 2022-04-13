import { IModel } from "../IModel";

export interface IPublicModelBox<TModel extends IModel> {
    get(): TModel
}

export interface IPrivateModelBox<TModel extends IModel> extends IPublicModelBox<TModel> {
    set(value: TModel): void;
}