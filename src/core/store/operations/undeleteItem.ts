import { IObservableValue, observable } from "mobx";
import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export type UndeleteRequest<TModel extends IModel> = (id: string) => Promise<TModel>;

export async function undeleteItem<TModel extends IModel>(props: {
    id: string,
    accessor: IDataStoreAccessor<TModel>,
    undeleter: UndeleteRequest<TModel>,
}): Promise<IObservableValue<TModel>> {
    const existing = props.accessor.get(props.id);
    const updated = await props.undeleter(props.id)

    if (existing) {
        existing.set(updated);
    } else {
        props.accessor.set(props.id, observable.box(updated))
    }

    return props.accessor.get(props.id)!
}
