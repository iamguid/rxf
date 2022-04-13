import { IModel } from "../../IModel";
import { IPublicModelBox } from "../../mobx/IModelBox";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export type DeleteRequest<TModel extends IModel> = (id: string) => Promise<TModel>;

export async function deleteItem<TModel extends IModel, TReturn extends IPublicModelBox<TModel>>(props: {
    id: string,
    accessor: IDataStoreAccessor<TModel>,
    request: DeleteRequest<TModel>,
}): Promise<TReturn> {
    const existing = props.accessor.get(props.id);
    const updated = await props.request(props.id);

    if (existing) {
        existing.set(updated);
    } else {
        props.accessor.set(props.id, props.accessor.wrap(updated))
    }

    return props.accessor.get(props.id)! as any;
}
