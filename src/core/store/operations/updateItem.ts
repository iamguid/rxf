import { ViewModelDeep } from "../../mobx/ViewModelDeep";
import { IPublicModelBox } from "../../mobx/IModelBox";
import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export type UpdateSingleRequest<TModel extends IModel> = (model: TModel) => Promise<TModel>;

export async function updateItem<TModel extends IModel, TReturn extends IPublicModelBox<TModel>>(props: {
    view: ViewModelDeep<TModel>,
    accessor: IDataStoreAccessor<TModel>,
    request: UpdateSingleRequest<TModel>,
}): Promise<TReturn> {
    const id = props.accessor.getId(props.view);
    const existing = props.accessor.get(id);

    if (!existing) {
        throw new Error(`Record with id ${id} is not exist in the store`);
    }

    if (!props.view.isDirty) {
        return existing as any;
    }

    const updated = await props.request(props.view);

    existing.set(updated);

    return existing as any;
}
