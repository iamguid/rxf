import { IModel } from "../../IModel";
import { isHardDeletableModelBox } from "../../mobx/HardDeletableModelBox";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export type HardSingleDeleteRequest = (id: string) => Promise<void>;

export async function hardDeleteItem<TModel extends IModel>(props: {
    id: string,
    accessor: IDataStoreAccessor<TModel>,
    remover: HardSingleDeleteRequest,
}): Promise<void> {
    await props.remover(props.id);

    const existing = props.accessor.get(props.id);

    if (existing) {
        if (!isHardDeletableModelBox(existing)) {
            throw new Error(`Existing model ${props.id} is not HardDeletableBox type`)
        }

        existing.delete();
    }
}
