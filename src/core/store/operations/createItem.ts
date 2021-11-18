import { observable } from "mobx";
import { IObservableValue } from "mobx/dist/internal";
import { IModel } from "../../IModel";
import { ViewModelDeep } from "../../mobx/ViewModelDeep";
import { IDataStoreAccessor } from "../IDataStoreAccessor";

export type CreateSingleRequest<TModel extends IModel> = (view: ViewModelDeep<TModel>) => Promise<TModel>;

export async function createItem<TModel extends IModel>(props: {
    view: ViewModelDeep<TModel>,
    accessor: IDataStoreAccessor<TModel>,
    creater: CreateSingleRequest<TModel>,
}): Promise<IObservableValue<TModel>> {
    const created = await props.creater(props.view);
    const createdId = props.accessor.getId(created);
    props.accessor.set(createdId, observable.box(created));
    return props.accessor.get(createdId)!;
}
