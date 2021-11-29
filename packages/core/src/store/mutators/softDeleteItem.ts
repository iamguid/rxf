import { IModel } from "../../IModel";
import { IModelBox } from "../../mobx/IModelBox";
import { isSoftDeletableModelBox } from "../../mobx/SoftDeletableModelBox";

export type SoftDeleSingleRequest<TModel extends IModel> = (id: string) => Promise<TModel>;

export function softDeleteItem<TModel extends IModel, TModelBox extends IModelBox<TModel>>(props: {
    id: string,
    queryResult: TModel,
    data: Map<string, WeakRef<TModelBox>>,
}): TModelBox {
    const existing = props.data.get(props.id)?.deref();

    if (existing) {
        if (!isSoftDeletableModelBox(existing)) {
            throw new Error(`Existing model ${props.id} is not SoftDeletableModelBox type`)
        }

        existing.set(props.queryResult);
        existing.setIsDeleted(true);
    }

    return existing!;
}
