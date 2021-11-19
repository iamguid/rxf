import { IObservableValue } from "mobx";
import { IModel } from "../../IModel";
import { BoxedModel, IDataStoreAccessor } from "../IDataStoreAccessor";
import { updateModels } from "./updateModels";

export type PaginatorIteratorFactory<TModel extends IModel> = (ids?: Set<string>) => AsyncIterableIterator<TModel[]>;

export async function *loadPaginator<TModel extends IModel>(props: {
    ids?: Set<string>,
    accessor: IDataStoreAccessor<TModel>,
    makeIterator: PaginatorIteratorFactory<TModel>
}): AsyncIterableIterator<BoxedModel<TModel>[]> {
    const iterator = props.makeIterator(props.ids);

    for await (const page of iterator) {
        yield updateModels(page, this.accessor);
    }
}
