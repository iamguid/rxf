import { ViewModelDeep } from "../../mobx/ViewModelDeep";
import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";
import { updateItem, UpdateSingleRequest } from "./updateItem";
import { IPublicModelBox } from "../../mobx/IModelBox";

export async function updateItemsByOne<TModel extends IModel, TReturn extends IPublicModelBox<TModel>>(props: {
    viewModels: ViewModelDeep<TModel>[],
    accessor: IDataStoreAccessor<TModel>,
    request: UpdateSingleRequest<TModel>,
}): Promise<TReturn[]> {
    const result: IPublicModelBox<TModel>[] = [];

    for (const viewModel of props.viewModels) {
        result.push(await updateItem({
            view: viewModel,
            accessor: props.accessor,
            request: props.request,
        }))
    }

    return result as any;
}