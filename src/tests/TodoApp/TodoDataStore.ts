import defineDataStore from "../../core/di/defineDataStore";
import { ViewModelDeep } from "../../core/mobx/ViewModelDeep";
import { IDataStoreAccessor } from "../../core/store/IDataStoreAccessor";
import { loadItem, loadItemsByOne, loadBatch, loadPaginator, softDeleteItem as softDeleteItem, undeleteItem, hardDeleteItem, updateItem, createItem } from "../../core/store/operations";
import { TodoModel } from "./TodoModel";
import { TodoService } from "./TodoService";
import { ISerializable } from "../../core/ISerializable";
import { SoftDeletableModelBox } from "../../core/mobx/SoftDeletableModelBox";

export const TodoStoreKey = Symbol("TodoStore");

@defineDataStore(TodoStoreKey)
export class TodoStore implements ISerializable {
    private data: Map<string, WeakRef<SoftDeletableModelBox<TodoModel>>> = new Map();

    private service: TodoService;
    private accessor: IDataStoreAccessor<TodoModel>;

    constructor(service: TodoService) {
        this.service = service;

        this.accessor = {
            getId: this.idGetter,
            get: this.getter,
            set: this.setter,
            create: this.creator
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

    public loadTodosByOne(ids: Set<string>, invalidate: boolean): Promise<SoftDeletableModelBox<TodoModel>[]> {
        return loadItemsByOne({
            ids,
            invalidate,
            accessor: this.accessor,
            fetcher: this.service.fetchTodoById
        }) as Promise<SoftDeletableModelBox<TodoModel>[]>
    }

    public loadTodosBatch(ids: Set<string>): Promise<SoftDeletableModelBox<TodoModel>[]> {
        return loadBatch({
            ids, 
            accessor: this.accessor,
            fetcher: this.service.fetchTodosByIds
        }) as Promise<SoftDeletableModelBox<TodoModel>[]>
    }

    public async *makeTodosPaginator(ids?: Set<string>): AsyncIterableIterator<SoftDeletableModelBox<TodoModel>[]> {
        return loadPaginator({
            ids,
            accessor: this.accessor,
            makeIterator: this.service.fetchTodoPaginatableList
        }) as AsyncIterableIterator<SoftDeletableModelBox<TodoModel>[]>
    }

    public async createTodo(view: ViewModelDeep<TodoModel>): Promise<SoftDeletableModelBox<TodoModel>> {
        return createItem({
            view,
            accessor: this.accessor,
            creater: this.service.addTodo
        }) as Promise<SoftDeletableModelBox<TodoModel>>
    }

    public async softDeleteTodo(id: string): Promise<SoftDeletableModelBox<TodoModel>> {
        return softDeleteItem({
            id,
            accessor: this.accessor,
            remover: this.service.softDeleteTodo
        }) as Promise<SoftDeletableModelBox<TodoModel>>
    }

    public async undeleteTodo(id: string): Promise<SoftDeletableModelBox<TodoModel>> {
        return undeleteItem({
            id,
            accessor: this.accessor,
            undeleter: this.service.undeleteTodo
        }) as Promise<SoftDeletableModelBox<TodoModel>>
    }

    public async updateTodo(view: ViewModelDeep<TodoModel>): Promise<SoftDeletableModelBox<TodoModel>> {
        return updateItem({
            view,
            accessor: this.accessor,
            updater: this.service.updateTodo
        }) as Promise<SoftDeletableModelBox<TodoModel>>
    }

    public toObject() {
        return {}
    }

    private getter = (id: string) => {
        return this.data.get(id)?.deref();
    }

    private setter = (id: string, value: SoftDeletableModelBox<TodoModel>) => {
        return this.data.set(id, new WeakRef(value));
    }

    private creator = (value: TodoModel) => {
        return new SoftDeletableModelBox(value)
    }

    private idGetter = (model: TodoModel) => {
        return model.id!
    }
}
