import { IModel } from "../../IModel";
import { IPublicModelBox } from "../../mobx/IModelBox";
import { IDataStoreAccessor } from "../IDataStoreAccessor";
import { updateModels } from "./updateModels";

export type FetchBatchRequest<TModel extends IModel> = (ids: Set<string>) => Promise<TModel[]>;

export async function loadBatch<TModel extends IModel, TReturn extends IPublicModelBox<TModel>>(props: {
    ids: Set<string>,
    accessor: IDataStoreAccessor<TModel>,
    request: FetchBatchRequest<TModel>
}): Promise<TReturn[]> {
    return updateModels(await props.request(props.ids), props.accessor) as any;
}
