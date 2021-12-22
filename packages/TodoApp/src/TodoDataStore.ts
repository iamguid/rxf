import { inject, collectionQuery, createItem, defineDataStore, IAsyncIteratorBox, IBaseEvent, ISerializable, ISoftDeletableModelBox, mutator, singleQuery, SoftDeletableModelBox, softDeleteItem, undeleteItem, updateItem, ViewModelDeep } from "@rxf/core";
import { TodoClient, TodoClientKey } from "./TodoClient";
import { TodoModel } from "./TodoModel";

const TODO_CREATED_EVENT = Symbol('TODO_CREATED_EVENT');
const TODO_SOFT_DELETED_EVENT = Symbol('TODO_SOFT_DELETED_EVENT');
const TODO_SOFT_UNDELETED_EVENT = Symbol('TODO_SOFT_UNDELETED_EVENT');
const TODO_UPDATED_EVENT = Symbol('TODO_UPDATED_EVENT');

type TodoCreatedEvent = IBaseEvent<typeof TODO_CREATED_EVENT, { todo: TodoModel }>;
type TodoUpdatedEvent = IBaseEvent<typeof TODO_UPDATED_EVENT, { todo: TodoModel }>;
type TodoSoftDeletedEvent = IBaseEvent<typeof TODO_SOFT_DELETED_EVENT, { todoId: string }>;
type TodoSoftUndeletedEvent = IBaseEvent<typeof TODO_SOFT_UNDELETED_EVENT, { todoId: string }>;

export const TodoStoreKey = Symbol("TodoStore");

@defineDataStore(TodoStoreKey)
export class TodoDataStore implements ISerializable {
    private client: TodoClient;
    private data: Map<string, WeakRef<SoftDeletableModelBox<TodoModel>>> = new Map();

    constructor(@inject(TodoClientKey) client: TodoClient) {
        this.client = client;
    }

    public async loadTodo(id: string): Promise<ISoftDeletableModelBox<TodoModel>> {
        const self = this;

        async function query() {
            return await self.client.fetchTodoById(id);
        }

        return await singleQuery({
            query,
            id,
            data: this.data,
            dataCtor: (model) => new SoftDeletableModelBox(new TodoModel(model)),
        })
    }

    public loadTodosByOne(ids: Set<string>): IAsyncIteratorBox<ISoftDeletableModelBox<TodoModel>> {
        const self = this;

        async function *query() {
            for (let id of ids) {
                yield await self.client.fetchTodoById(id);
            }
        }

        return collectionQuery({
            query,
            ids,
            events: [],
            data: this.data,
            dataCtor: (model) => new SoftDeletableModelBox(new TodoModel(model)),
            modelIdGetter: (model) => model.id!
        })
    }

    public loadTodosBatch(ids: Set<string>): IAsyncIteratorBox<ISoftDeletableModelBox<TodoModel>> {
        const self = this;

        async function *query() {
            const result = await self.client.fetchTodosByIds(ids);

            for (const item of result) {
                yield item;
            }
        }

        return collectionQuery({
            ids: new Set(),
            query,
            events: [],
            data: this.data,
            dataCtor: (model) => new SoftDeletableModelBox(new TodoModel(model)),
            modelIdGetter: (model) => model.id!
        })
    }
    
    public loadTodosAll() {
        const self = this;

        async function *query() {
            let token = null;
        
            while (true) {
                const { nextPageToken, todos } = await self.client.fetchNextPage(undefined, token, 100) as any;

                for (const todo of todos) {
                    yield todo;
                }
            
                if (nextPageToken) {
                    token = nextPageToken;
                } else {
                    return;
                }
            }
        }

        return collectionQuery({
            query,
            ids: new Set(),
            events: [TODO_SOFT_DELETED_EVENT, TODO_SOFT_UNDELETED_EVENT],
            data: this.data,
            dataCtor: (model) => new SoftDeletableModelBox(new TodoModel(model)),
            modelIdGetter: (model) => model.id!
        })
    }

    public loadTodosByIds(ids: Set<string>): IAsyncIteratorBox<ISoftDeletableModelBox<TodoModel>> {
        const self = this;

        async function *query() {
            let token = null;
        
            while (true) {
                const { nextPageToken, todos } = await self.client.fetchNextPage(ids, token, 100) as any;

                for (const todo of todos) {
                    yield todo;
                }
            
                if (nextPageToken) {
                    token = nextPageToken;
                } else {
                    return;
                }
            }
        }

        return collectionQuery({
            query,
            ids,
            events: [],
            data: this.data,
            dataCtor: (model) => new SoftDeletableModelBox(new TodoModel(model)),
            modelIdGetter: (model) => model.id!,
        })
    }

    public async createTodo(view: ViewModelDeep<TodoModel>): Promise<ISoftDeletableModelBox<TodoModel>> {
        const self = this;

        async function query() {
            return await self.client.addTodo(view);
        }

        const event: TodoCreatedEvent = {
            type: TODO_CREATED_EVENT,
            payload: { todo: view }
        }

        const mutation = (queryResult: TodoModel) => {
            return createItem({
                queryResult,
                data: this.data,
                dataCtor: (model) => new SoftDeletableModelBox(new TodoModel(model)),
                modelIdGetter: (model) => model.id!,
            })
        }

        return await mutator({
            query,
            event,
            mutation,
        })
    }

    public async softDeleteTodo(id: string): Promise<ISoftDeletableModelBox<TodoModel>> {
        const self = this;

        async function query() {
            return await self.client.softDeleteTodo(id);
        }

        const event: TodoSoftDeletedEvent = {
            type: TODO_SOFT_DELETED_EVENT,
            payload: { todoId: id }
        }

        const mutation = (queryResult: TodoModel) => {
            return softDeleteItem({
                id,
                queryResult,
                data: this.data,
            })
        }

        return await mutator({
            query,
            event,
            mutation,
        })
    }

    public undeleteTodo(id: string): Promise<ISoftDeletableModelBox<TodoModel>> {
        const self = this;

        async function query() {
            return await self.client.undeleteTodo(id);
        }

        const event: TodoSoftUndeletedEvent = {
            type: TODO_SOFT_UNDELETED_EVENT,
            payload: { todoId: id }
        }

        const mutation = (queryResult: TodoModel) => {
            return undeleteItem({
                id,
                queryResult,
                data: this.data,
                dataCtor: (model) => new SoftDeletableModelBox(new TodoModel(model)),
            })
        }

        return mutator({
            query,
            event,
            mutation,
        })
    }

    public updateTodo(view: ViewModelDeep<TodoModel>): Promise<ISoftDeletableModelBox<TodoModel>> {
        const self = this;

        async function query() {
            return await self.client.updateTodo(view);
        }

        const event: TodoUpdatedEvent = {
            type: TODO_UPDATED_EVENT,
            payload: { todo: view }
        }

        const mutation = (queryResult: TodoModel) => {
            return updateItem({
                queryResult,
                data: this.data,
                modelIdGetter: (model) => model.id!
            })
        }

        return mutator({
            query,
            event,
            mutation,
        })
    }

    public toObject() {
        return {}
    }
}
