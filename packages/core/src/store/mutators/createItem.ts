import { IModel } from "../../IModel";
import { IModelBox } from "../../mobx/IModelBox";

export function createItem<TModel extends IModel, TModelBox extends IModelBox<TModel>>(props: {
    queryResult: TModel;
    data: Map<string, WeakRef<TModelBox>>;
    modelIdGetter: (model: TModel) => string;
    dataCtor: (model: TModel) => TModelBox;
}): TModelBox {
    const modelId = props.modelIdGetter(props.queryResult);
    props.data.set(modelId, new WeakRef(props.dataCtor(props.queryResult)));
    return props.data.get(modelId)!.deref()!;
}
