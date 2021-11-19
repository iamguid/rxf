import defineDataStore from "../../core/di/defineDataStore";
import { ViewModelDeep } from "../../core/mobx/ViewModelDeep";
import { IDataStoreAccessor } from "../../core/store/IDataStoreAccessor";
import { loadItem, loadItemsByOne, loadBatch, loadPaginator, softDeleteItem as softDeleteItem, undeleteItem, hardDeleteItem, updateItem, createItem } from "../../core/store/operations";
import { TodoModel } from "./TodoModel";
import { TodoService } from "./TodoService";
import { ISerializable } from "../../core/ISerializable";
import { SoftDeletableBox } from "../../core/mobx/SoftDeletableBox";

@defineDataStore()
export class TodoStore implements ISerializable {
    private data: Map<string, WeakRef<SoftDeletableBox<TodoModel>>> = new Map();

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

    public loadTodosByOne(ids: Set<string>, invalidate: boolean): Promise<SoftDeletableBox<TodoModel>[]> {
        return loadItemsByOne({
            ids,
            invalidate,
            accessor: this.accessor,
            fetcher: this.service.fetchTodoById
        }) as Promise<SoftDeletableBox<TodoModel>[]>
    }

    public loadTodosBatch(ids: Set<string>): Promise<SoftDeletableBox<TodoModel>[]> {
        return loadBatch({
            ids, 
            accessor: this.accessor,
            fetcher: this.service.fetchTodosByIds
        }) as Promise<SoftDeletableBox<TodoModel>[]>
    }

    public async *makeTodosPaginator(ids?: Set<string>): AsyncIterableIterator<SoftDeletableBox<TodoModel>[]> {
        return loadPaginator({
            ids,
            accessor: this.accessor,
            makeIterator: this.service.fetchTodoPaginatableList
        }) as AsyncIterableIterator<SoftDeletableBox<TodoModel>[]>
    }

    public async createTodo(view: ViewModelDeep<TodoModel>): Promise<SoftDeletableBox<TodoModel>> {
        return createItem({
            view,
            accessor: this.accessor,
            creater: this.service.addTodo
        }) as Promise<SoftDeletableBox<TodoModel>>
    }

    public async softDeleteTodo(id: string): Promise<SoftDeletableBox<TodoModel>> {
        return softDeleteItem({
            id,
            accessor: this.accessor,
            remover: this.service.softDeleteTodo
        }) as Promise<SoftDeletableBox<TodoModel>>
    }

    public async undeleteTodo(id: string): Promise<SoftDeletableBox<TodoModel>> {
        return undeleteItem({
            id,
            accessor: this.accessor,
            undeleter: this.service.undeleteTodo
        }) as Promise<SoftDeletableBox<TodoModel>>
    }

    public async updateTodo(view: ViewModelDeep<TodoModel>): Promise<SoftDeletableBox<TodoModel>> {
        return updateItem({
            view,
            accessor: this.accessor,
            updater: this.service.updateTodo
        }) as Promise<SoftDeletableBox<TodoModel>>
    }

    public toObject() {
        return {}
    }

    private getter = (id: string) => {
        return this.data.get(id)?.deref();
    }

    private setter = (id: string, value: TodoModel) => {
        return this.data.set(id, new WeakRef(new SoftDeletableBox(value)));
    }

    private idGetter = (model: TodoModel) => {
        return model.id!
    }
}
