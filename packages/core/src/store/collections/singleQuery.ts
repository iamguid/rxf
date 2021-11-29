import { container } from "../../di";
import { diff } from "../../diff/diff";
import { IModel } from "../../IModel";
import { IModelBox } from "../../mobx/IModelBox";
import { StoresEventEmitter } from "../StoresEventEmitter";

const storesEventEmitter = container.resolve(StoresEventEmitter);

const finalizationRegistry = new FinalizationRegistry((props: { events: symbol[], eventHandler: () => void}) => {
    props.events.forEach(event => {
        storesEventEmitter.unsubscribe(event, props.eventHandler)
    });
});

export async function singleQuery<TModel extends IModel, TModelBox extends IModelBox<TModel>>(props: {
    query: () => Promise<TModel>;
    id: string;
    data: Map<string, WeakRef<TModelBox>>;
    dataCtor: (model: TModel) => TModelBox;
    events?: symbol[];
}): Promise<TModelBox> {
    const storesEventEmitter = container.resolve(StoresEventEmitter);
    const fetched = await props.query();
    const hasValue = props.data.has(props.id);


    if (!hasValue) {
        const newValue = new WeakRef(props.dataCtor(fetched));
        props.data.set(props.id, newValue);

        const eventHandler = async () => {
            const fetched = await props.query();
            const deref = newValue.deref();

            if (deref) {
                const patch = diff(fetched.toObject(), deref.get().toObject())

                if (patch.length > 0) {
                    deref.set(fetched);
                }
            }
        }

        if (props.events && props.events.length > 0) {
            props.events.forEach(event => {
                storesEventEmitter.on(event, eventHandler)
            })

            finalizationRegistry.register(newValue.deref()!, { events: props.events, eventHandler })
        }
    }

    const existingValue = props.data.get(props.id)!.deref()!;

    const patch = diff(existingValue.get().toObject(), fetched.toObject())

    if (patch.length > 0) {
        existingValue.set(fetched);
    }

    return existingValue
}
