import { IModel } from "../../IModel";
import { IPrivateModelBox, IPublicModelBox } from "../../mobx/IModelBox";
import { ViewModelDeep } from "../../mobx/ViewModelDeep";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export type CreateRequest<TModel extends IModel> = (view: ViewModelDeep<TModel>) => Promise<TModel>;

export async function createItem<TModel extends IModel, TReturn extends IPublicModelBox<TModel>>(props: {
    view: ViewModelDeep<TModel>,
    accessor: IDataStoreAccessor<TModel>,
    request: CreateRequest<TModel>,
}): Promise<TReturn> {
    const existing = props.view.model as IPrivateModelBox<TModel>;
    const created = await props.request(props.view);
    const createdId = props.accessor.getId(created);
    existing.set(created);
    props.accessor.set(createdId, existing);
    return props.accessor.get(createdId)! as any;
}
