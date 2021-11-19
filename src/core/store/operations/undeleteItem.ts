import { IObservableValue, observable } from "mobx";
import { IModel } from "../../IModel";
import { isSoftDeletableBox } from "../../mobx/SoftDeletableBox";
import { BoxedModel, IDataStoreAccessor } from "../IDataStoreAccessor";

export type UndeleteRequest<TModel extends IModel> = (id: string) => Promise<TModel>;

export async function undeleteItem<TModel extends IModel>(props: {
    id: string,
    accessor: IDataStoreAccessor<TModel>,
    undeleter: UndeleteRequest<TModel>,
}): Promise<BoxedModel<TModel>> {
    const existing = props.accessor.get(props.id);
    const updated = await props.undeleter(props.id)

    if (existing) {
        existing.set(updated);
    } else {
        props.accessor.set(props.id, updated)
    }

    const result = props.accessor.get(props.id)!;

    if (!isSoftDeletableBox(result)) {
        throw new Error(`Existing model ${props.id} is not SoftDeletableBox type`)
    }

    result.undelete();

    return result;
}
