import { container } from "../../di";
import { IBaseEvent } from "../../IBaseEvent";
import { IModel } from "../../IModel";
import { StoresEventEmitter } from "../StoresEventEmitter";

export async function mutator<TModel extends IModel>(props: {
    query: () => Promise<TModel>,
    event: IBaseEvent<any, any>,
    mutation: () => void,
}): Promise<void> {
    const storesEventEmittor = container.resolve(StoresEventEmitter);
    await props.query()
    storesEventEmittor.emit(props.event.type, props.event.payload);
    props.mutation()
}
