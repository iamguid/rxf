import { IObservableValue, observable } from "mobx";
import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export const updateModels = <TModel extends IModel>(
    models: TModel[], 
    accessor: IDataStoreAccessor<TModel>
): IObservableValue<TModel>[] => {
    const result: IObservableValue<TModel>[] = [];

    for (const model of models) {
        const id = accessor.getId(model);
        const existing = accessor.get(id);

        if (existing) {
            existing.set(model);
        } else {
            accessor.set(id, observable.box(model));
        }

        result.push(accessor.get(id)!);
    }

    return result;
}