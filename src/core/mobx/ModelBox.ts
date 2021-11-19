import { IModel } from "../IModel";

export interface IModelBox<TModel extends IModel> {
    get(): TModel
}
