import { IModel } from "../../IModel";
import { IPublicModelBox } from "../../mobx/IModelBox";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export type FetchRequest<TModel extends IModel> = (id: string) => Promise<TModel>;

export async function loadItem<TModel extends IModel, TReturn extends IPublicModelBox<TModel>>(props: {
    id: string,
    invalidate: boolean
    accessor: IDataStoreAccessor<TModel>,
    request: FetchRequest<TModel>,
}): Promise<TReturn> {
    const existing = props.accessor.get(props.id);

    if (props.invalidate) {
        const fetched = await props.request(props.id);

        if (existing) {
            existing.set(fetched)
        } else {
            props.accessor.set(props.id, props.accessor.wrap(fetched))
        }
    } else {
        if (!existing) {
            const fetched = await this.accessor.fetchSingleRequest(props.id);
            props.accessor.set(props.id, props.accessor.wrap(fetched));
        }
    }

    return props.accessor.get(props.id)! as any;
}