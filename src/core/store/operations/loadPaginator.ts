import { IObservableValue } from "mobx";
import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";
import { updateModels } from "./updateModels";

export type PaginatorIteratorFactory<TModel extends IModel> = (ids?: Set<string>) => AsyncIterableIterator<TModel[]>;

export async function *loadPaginator<TModel extends IModel>(props: {
    ids?: Set<string>,
    accessor: IDataStoreAccessor<TModel>,
    makeIterator: PaginatorIteratorFactory<TModel>
}): AsyncIterableIterator<IObservableValue<TModel>[]> {
    const iterator = this.makeIterator(props.ids);

    for await (const page of iterator) {
        yield updateModels(page, this.accessor);
    }
}
