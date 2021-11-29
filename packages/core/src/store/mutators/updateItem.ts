import { ViewModelDeep } from "../../mobx/ViewModelDeep";
import { IModel } from "../../IModel";
import { IModelBox } from "../../mobx/IModelBox";

export function updateItem<TModel extends IModel, TModelBox extends IModelBox<TModel>>(props: {
    queryResult: TModel;
    data: Map<string, WeakRef<TModelBox>>;
    modelIdGetter: (mode: TModel) => string;
}): TModelBox {
    const id = props.modelIdGetter(props.queryResult);
    const existing = props.data.get(id)?.deref();

    if (!existing) {
        throw new Error(`Record with id ${id} is not exist`);
    }

    existing.set(props.queryResult);

    return existing;
}
