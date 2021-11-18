import { IObservableValue, runInAction } from "mobx";
import { ViewModelDeep } from "../../mobx/ViewModelDeep";
import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export type UpdateSingleRequest<TModel extends IModel> = (model: TModel) => Promise<TModel>;

export async function updateItem<TModel extends IModel>(props: {
    view: ViewModelDeep<TModel>,
    accessor: IDataStoreAccessor<TModel>,
    updater: UpdateSingleRequest<TModel>,
}): Promise<IObservableValue<TModel>> {
    const id = this.accessor.idGetter(props.view);
    const existing = this.accessor.getter(id);

    if (!existing) {
        throw new Error(`Record with id ${id} is not exist in the store`);
    }

    if (!props.view.isDirty) {
        return existing;
    }

    const updated = await props.updater(props.view);

    existing.set(updated);

    return existing;
}
