import { observable } from "mobx";
import { IModel } from "../../IModel";
import { BoxedModel, IDataStoreAccessor } from "../IDataStoreAccessor";

export const updateModels = <TModel extends IModel>(
    models: TModel[], 
    accessor: IDataStoreAccessor<TModel>
): BoxedModel<TModel>[] => {
    const result: BoxedModel<TModel>[] = [];

    for (const model of models) {
        const id = accessor.getId(model);
        const existing = accessor.get(id);

        if (existing) {
            existing.set(model);
        } else {
            accessor.set(id, accessor.create(model));
        }

        result.push(accessor.get(id)!);
    }

    return result;
}