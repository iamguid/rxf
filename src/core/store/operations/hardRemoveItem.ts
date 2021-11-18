import { IModel } from "../../IModel";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export type HardSingleRemoveRequest = (id: string) => Promise<void>;

export async function hardRemoveItem<TModel extends IModel>(props: {
    id: string,
    accessor: IDataStoreAccessor<TModel>,
    remover: HardSingleRemoveRequest,
}): Promise<void> {
    await props.remover(props.id);
}
