import { observable } from "mobx";
import defineDataStore from "../../core/di/defineDataStore";
import { createViewModelDeep, ViewModelDeep } from "../../core/mobx/ViewModelDeep";
import { IDataStoreAccessor } from "../../core/store/IDataStoreAccessor";
import { loadItem, loadItemsByOne, loadBatch, loadIterator, deleteItem, undeleteItem, updateItem, createItem } from "../../core/store/operations";
import { ITodoModel, TodoModel } from "./TodoModel";
import { TodoService, TodoServiceKey } from "./TodoService";
import { ISerializable } from "../../core/ISerializable";
import inject from "../../core/di/inject";
import { IPrivateModelBox, IPublicModelBox } from "../../core/mobx/IModelBox";

export const TodoStoreKey = Symbol("TodoStore");

@defineDataStore(TodoStoreKey)
export class TodoStore implements ISerializable {
    private data: Map<string, WeakRef<IPrivateModelBox<TodoModel>>> = new Map();

    private service: TodoService;
    private accessor: IDataStoreAccessor<TodoModel>;

    constructor(@inject(TodoServiceKey) service: TodoService) {
        this.service = service;

        this.accessor = {
            getId: this.idGetter,
            get: this.getter,
            set: this.setter,
            wrap: this.wrapper,
        };
    }

    public loadTodo(id: string, invalidate: boolean): Promise<IPublicModelBox<TodoModel>> {
        return loadItem({
            id,
            invalidate,
            accessor: this.accessor,
            request: this.service.fetchTodoById
        });
    }

    public loadTodosByOne(ids: Set<string>, invalidate: boolean): Promise<IPublicModelBox<TodoModel>[]> {
        return loadItemsByOne({
            ids,
            invalidate,
            accessor: this.accessor,
            request: this.service.fetchTodoById
        })
    }

    public loadTodosBatch(ids: Set<string>): Promise<IPublicModelBox<TodoModel>[]> {
        return loadBatch({
            ids, 
            accessor: this.accessor,
            request: this.service.fetchTodosByIds
        })
    }

    public async *getTodosIterator(ids?: Set<string>): AsyncIterableIterator<IPublicModelBox<TodoModel>[]> {
        return loadIterator({
            ids,
            accessor: this.accessor,
            makeIterator: this.service.fetchTodoPaginatableList
        })
    }

    public async createTodo(view: ViewModelDeep<TodoModel>): Promise<IPublicModelBox<TodoModel>> {
        return createItem({
            view,
            accessor: this.accessor,
            request: this.service.addTodo
        })
    }

    public async softDeleteTodo(id: string): Promise<IPublicModelBox<TodoModel>> {
        return deleteItem({
            id,
            accessor: this.accessor,
            request: this.service.softDeleteTodo
        })
    }

    public async undeleteTodo(id: string): Promise<IPublicModelBox<TodoModel>> {
        return undeleteItem({
            id,
            accessor: this.accessor,
            request: this.service.undeleteTodo
        })
    }

    public async updateTodo(view: ViewModelDeep<TodoModel>): Promise<IPublicModelBox<TodoModel>> {
        return updateItem({
            view,
            accessor: this.accessor,
            request: this.service.updateTodo
        })
    }

    public toObject() {
        return {}
    }

    public buildNewTodo(base?: ITodoModel): ViewModelDeep<TodoModel> {
        let newTodoModel: TodoModel;

        if (base) {
            newTodoModel = new TodoModel(base);
        } else {
            newTodoModel = new TodoModel();
        }

        const wrapped = this.wrapper(newTodoModel);
        return createViewModelDeep(wrapped);
    }

    private wrapper = (model: TodoModel): IPrivateModelBox<TodoModel> => {
        return observable.box(model);
    }

    private getter = (id: string): IPrivateModelBox<TodoModel> | undefined => {
        return this.data.get(id)?.deref();
    }

    private setter = (id: string, value: IPrivateModelBox<TodoModel>): void => {
        this.data.set(id, new WeakRef(value));
    }

    private idGetter = (model: TodoModel): string => {
        return model.id!
    }
}
