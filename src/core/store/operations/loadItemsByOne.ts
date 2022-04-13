import { IModel } from "../../IModel";
import { IPublicModelBox } from "../../mobx/IModelBox";
import { IDataStoreAccessor } from "../IDataStoreAccessor";
import { FetchRequest, loadItem } from "./loadItem";

export async function loadItemsByOne<TModel extends IModel, TReturn extends IPublicModelBox<TModel>>(props: {
    ids: Set<string>, 
    invalidate: boolean
    accessor: IDataStoreAccessor<TModel>,
    request: FetchRequest<TModel>,
}): Promise<TReturn[]> {
    const result: IPublicModelBox<TModel>[] = [];

    for (const id of props.ids) {
        result.push(await loadItem({
            id,
            invalidate: props.invalidate,
            accessor: props.accessor,
            request: props.request,
        }))
    }

    return result as any;
}
