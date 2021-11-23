import { IObservableValue, observable } from "mobx";
import { IModel } from "../../IModel";
import { isSoftDeletableModelBox } from "../../mobx/SoftDeletableModelBox";
import { BoxedModel, IDataStoreAccessor } from "../IDataStoreAccessor";

export type SoftDeleSingleRequest<TModel extends IModel> = (id: string) => Promise<TModel>;

export async function softDeleteItem<TModel extends IModel>(props: {
    id: string,
    accessor: IDataStoreAccessor<TModel>,
    remover: SoftDeleSingleRequest<TModel>,
}): Promise<BoxedModel<TModel>> {
    const existing = props.accessor.get(props.id);
    const updated = await props.remover(props.id);

    if (existing) {
        existing.set(updated);
    } else {
        props.accessor.set(props.id, props.accessor.create(updated))
    }

    const result = props.accessor.get(props.id)!;

    if (!isSoftDeletableModelBox(result)) {
        throw new Error(`Existing model ${props.id} is not SoftDeletableModelBox type`)
    }

    result.delete();

    return result;
}
