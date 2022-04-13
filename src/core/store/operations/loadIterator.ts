import { IModel } from "../../IModel";
import { IPublicModelBox } from "../../mobx/IModelBox";
import { IDataStoreAccessor } from "../IDataStoreAccessor";
import { updateModels } from "./updateModels";

export type PaginatorIteratorFactory<TModel extends IModel> = (ids?: Set<string>) => AsyncIterableIterator<TModel[]>;

export async function *loadIterator<TModel extends IModel, TReturn extends IPublicModelBox<TModel>>(props: {
    ids?: Set<string>,
    accessor: IDataStoreAccessor<TModel>,
    makeIterator: PaginatorIteratorFactory<TModel>
}): AsyncIterableIterator<TReturn[]> {
    const iterator = props.makeIterator(props.ids);

    for await (const page of iterator) {
        yield updateModels(page, this.accessor) as any;
    }
}
