import { IObservableValue } from "mobx";
import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";
import { updateModels } from "./updateModels";

export type FetchBatchRequest<TModel extends IModel> = (ids: Set<string>) => Promise<TModel[]>;

export async function loadBatch<TModel extends IModel>(props: {
    ids: Set<string>,
    accessor: IDataStoreAccessor<TModel>,
    fetcher: FetchBatchRequest<TModel>
}): Promise<IObservableValue<TModel>[]> {
    return updateModels(await this.fetcher(props.ids), this.accessor);
}
