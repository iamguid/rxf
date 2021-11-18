import { IObservableValue } from "mobx";
import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";
import { FetchSingleRequest, loadItem } from "./loadItem";

export async function loadItemsByOne<TModel extends IModel>(props: {
    ids: Set<string>, 
    invalidate: boolean
    accessor: IDataStoreAccessor<TModel>,
    fetcher: FetchSingleRequest<TModel>,
}): Promise<IObservableValue<TModel>[]> {
    const result: IObservableValue<TModel>[] = [];

    for (const id of props.ids) {
        result.push(await loadItem({
            id,
            invalidate: props.invalidate,
            accessor: props.accessor,
            fetcher: props.fetcher,
        }))
    }

    return result;
}
