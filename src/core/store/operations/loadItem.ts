import { observable } from "mobx";
import { IObservableValue } from "mobx/dist/internal";
import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export type FetchSingleRequest<TModel extends IModel> = (id: string) => Promise<TModel>;

export async function loadItem<TModel extends IModel>(props: {
    id: string,
    invalidate: boolean
    accessor: IDataStoreAccessor<TModel>,
    fetcher: FetchSingleRequest<TModel>,
}): Promise<IObservableValue<TModel>> {
    const existing = props.accessor.get(props.id);

    if (props.invalidate) {
        const fetched = await this.accessor.fetchSingleRequest(props.id);

        if (existing) {
            existing.set(fetched)
        } else {
            this.accessor.setter(props.id, observable.box(fetched))
        }
    } else {
        if (!existing) {
            const fetched = await this.accessor.fetchSingleRequest(props.id);
            this.accessor.setter(props.id, observable.box(fetched));
        }
    }

    return this.accessor.getter(props.id)!;
}