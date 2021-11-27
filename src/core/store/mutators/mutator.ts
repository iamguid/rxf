import { container } from "../../di";
import { IBaseEvent } from "../../IBaseEvent";
import { IModel } from "../../IModel";
import { StoresEventEmitter } from "../StoresEventEmitter";

export async function mutator<TModel extends IModel, TResult>(props: {
    query: () => Promise<TModel>,
    event: IBaseEvent<any, any>,
    mutation: (queryResult: TModel) => TResult,
}): Promise<TResult> {
    const storesEventEmittor = container.resolve(StoresEventEmitter);
    const queryResult = await props.query()
    storesEventEmittor.emit(props.event.type, props.event.payload);
    return props.mutation(queryResult)
}
