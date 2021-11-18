import { IObservableValue } from "mobx";
import defineDataStore from "../../core/di/defineDataStore";
import { ViewModelDeep } from "../../core/mobx/ViewModelDeep";
import { IDataStoreAccessor } from "../../core/store/IDataStoreAccessor";
import { loadItem, loadItemsByOne, loadBatch, loadPaginator, softRemoveItem, undeleteItem, hardRemoveItem, updateItem, createItem } from "../../core/store/operations";
import { TodoModel } from "./TodoModel";
import { TodoService } from "./TodoService";
import { ISerializable } from "../../core/ISerializable";

@defineDataStore()
export class TodoStore implements ISerializable {
    private data: Map<string, WeakRef<IObservableValue<TodoModel>>> = new Map();
    private deleted: Set<string> = new Set();

    private service: TodoService;
    private accessor: IDataStoreAccessor<TodoModel>;

    constructor(service: TodoService) {
        this.service = service;

        this.accessor = {
            getId: this.idGetter,
            get: this.getter,
            set: this.setter,
        };
    }

    public loadTodo(id: string, invalidate: boolean) {
        return loadItem({
            id,
            invalidate,
            accessor: this.accessor,
            fetcher: this.service.fetchTodoById
        });
    }

    public loadTodosByOne(ids: Set<string>, invalidate: boolean): Promise<IObservableValue<TodoModel>[]> {
        return loadItemsByOne({
            ids,
            invalidate,
            accessor: this.accessor,
            fetcher: this.service.fetchTodoById
        })
    }

    public loadTodosBatch(ids: Set<string>): Promise<IObservableValue<TodoModel>[]> {
        return loadBatch({
            ids, 
            accessor: this.accessor,
            fetcher: this.service.fetchTodosByIds
        });
    }

    public async *makeTodosPaginator(ids?: Set<string>): AsyncIterableIterator<IObservableValue<TodoModel>[]> {
        return loadPaginator({
            ids,
            accessor: this.accessor,
            makeIterator: this.service.fetchTodoPaginatableList
        });
    }

    public async createTodo(view: ViewModelDeep<TodoModel>): Promise<IObservableValue<TodoModel>> {
        return createItem({
            view,
            accessor: this.accessor,
            creater: this.service.addTodo
        })
    }

    public async softRemoveTodo(id: string): Promise<IObservableValue<TodoModel>> {
        return softRemoveItem({
            id,
            accessor: this.accessor,
            remover: this.service.softDeleteTodo
        });
    }

    public async undeleteTodo(id: string): Promise<IObservableValue<TodoModel>> {
        return undeleteItem({
            id,
            accessor: this.accessor,
            undeleter: this.service.undeleteTodo
        })
    }

    public async hardRemoveTodo(id: string): Promise<void> {
        return hardRemoveItem({
            id,
            accessor: this.accessor,
            remover: this.service.hardDeleteTodo
        });
    }

    public async updateTodo(view: ViewModelDeep<TodoModel>): Promise<IObservableValue<TodoModel>> {
        return updateItem({
            view,
            accessor: this.accessor,
            updater: this.service.updateTodo
        })
    }

    public toObject() {
        return {}
    }

    private getter = (id: string) => {
        return this.data.get(id)?.deref();
    }

    private setter = (id: string, value: IObservableValue<TodoModel>) => {
        return this.data.set(id, new WeakRef(value));
    }

    private idGetter = (model: TodoModel) => {
        return model.id!
    }
}
