import { IObservableValue, observable } from "mobx";
import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export type SoftRemoveSingleRequest<TModel extends IModel> = (id: string) => Promise<TModel>;

export async function softRemoveItem<TModel extends IModel>(props: {
    id: string,
    accessor: IDataStoreAccessor<TModel>,
    remover: SoftRemoveSingleRequest<TModel>,
}): Promise<IObservableValue<TModel>> {
    const existing = this.accessor.getter(props.id);
    const updated = await props.remover(props.id);

    if (existing) {
        existing.set(updated);
    } else {
        props.accessor.set(props.id, observable.box(updated))
    }

    return props.accessor.get(props.id)!;
}
