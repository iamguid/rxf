import { IModel } from "../../IModel";
import { IPublicModelBox } from "../../mobx/IModelBox";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export const updateModels = <TModel extends IModel>(
    models: TModel[], 
    accessor: IDataStoreAccessor<TModel>
): IPublicModelBox<TModel>[] => {
    const result: IPublicModelBox<TModel>[] = [];

    for (const model of models) {
        const id = accessor.getId(model);
        const existing = accessor.get(id);

        if (existing) {
            existing.set(model);
        } else {
            accessor.set(id, accessor.wrap(model));
        }

        result.push(accessor.get(id)!);
    }

    return result;
}