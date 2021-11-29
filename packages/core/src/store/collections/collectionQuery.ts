import { container } from "../../di";
import { diff } from "../../diff/diff";
import { IModel } from "../../IModel";
import { AsyncIteratorBox } from "../../mobx/AsyncIteratorBox";
import { IModelBox } from "../../mobx/IModelBox";
import { StoresEventEmitter } from "../StoresEventEmitter";

const storesEventEmitter = container.resolve(StoresEventEmitter);

const finalizationRegistry = new FinalizationRegistry((props: { events: symbol[], eventsHandler: () => void}) => {
    props.events.forEach(event => {
        storesEventEmitter.unsubscribe(event, props.eventsHandler)
    });
});

export function collectionQuery<TModel extends IModel, TModelBox extends IModelBox<TModel>>(props: {
    storeKey: symbol;
    ids: Set<string>;
    query: () => AsyncIterableIterator<TModel>;
    data: Map<string, WeakRef<TModelBox>>;
    dataCtor: (model: TModel) => TModelBox;
    modelIdGetter: (model: TModel) => string;
    events?: symbol[];
}): AsyncIteratorBox<TModelBox> {

    async function *boxedItemsIterator() {
        const sourceIterator = props.query()

        for await (const item of sourceIterator) {
            const id = props.modelIdGetter(item);
            const existing = props.data.get(id)?.deref();

            if (existing) {
                const patch = diff(existing.get().toObject(), item.toObject())

                if (patch.length > 0) {
                    existing.set(item);
                }
            } else {
                props.data.set(id, new WeakRef(props.dataCtor(item)));
            }

            yield props.data.get(id)!.deref()!;
        }
    }

    const iteratorBox = new AsyncIteratorBox(boxedItemsIterator());

    const eventsHandler = () => {
        iteratorBox.set(boxedItemsIterator());
    }

    if (props.events && props.events.length > 0) {
        props.events.forEach(event => {
            storesEventEmitter.on(event, eventsHandler)
        });

        finalizationRegistry.register(iteratorBox, { events: props.events, eventsHandler });
    }

    return iteratorBox;
}
