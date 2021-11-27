import { IModel } from "../../IModel";
import { isHardDeletableModelBox } from "../../mobx/HardDeletableModelBox";
import { IModelBox } from "../../mobx/IModelBox";

export async function hardDeleteItem<TModel extends IModel, TModelBox extends IModelBox<TModel>>(props: {
    id: string,
    data: Map<string, WeakRef<TModelBox>>,
}): Promise<void> {
    const existing = props.data.get(props.id)?.deref();

    if (existing) {
        if (!isHardDeletableModelBox(existing)) {
            throw new Error(`Existing model ${props.id} is not HardDeletableModelBox type`)
        }

        existing.setIsDeleted(true);
    }
}
