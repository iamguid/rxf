import { ViewModelDeep } from "../../mobx/ViewModelDeep";
import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";
import { IObservableValue } from "mobx";
import { updateItem, UpdateSingleRequest } from "./updateItem";

export async function updateItemsByOne<TModel extends IModel>(props: {
    viewModels: ViewModelDeep<TModel>[],
    accessor: IDataStoreAccessor<TModel>,
    updater: UpdateSingleRequest<TModel>,
}): Promise<IObservableValue<TModel>[]> {
    const result: IObservableValue<TModel>[] = [];

    for (const viewModel of props.viewModels) {
        result.push(await updateItem({
            view: viewModel,
            accessor: props.accessor,
            updater: props.updater,
        }))
    }

    return result;
}