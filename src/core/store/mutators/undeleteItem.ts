import { IModel } from "../../IModel";
import { IModelBox } from "../../mobx/IModelBox";
import { isSoftDeletableModelBox } from "../../mobx/SoftDeletableModelBox";

export function undeleteItem<TModel extends IModel, TModelBox extends IModelBox<TModel>>(props: {
    id: string,
    queryResult: TModel,
    data: Map<string, WeakRef<TModelBox>>,
    dataCtor: (model: TModel) => TModelBox;
}): TModelBox {
    const existing = props.data.get(props.id)?.deref();

    if (existing) {
        existing.set(props.queryResult);
    } else {
        props.data.set(props.id, new WeakRef(props.dataCtor(props.queryResult)));
    }

    const result = props.data.get(props.id)?.deref();

    if (!isSoftDeletableModelBox(result)) {
        throw new Error(`Existing model ${props.id} is not SoftDeletableBox type`)
    }

    result.setIsDeleted(false);

    return result;
}
