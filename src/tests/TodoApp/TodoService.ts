import defineService from "../../core/di/defineService";
import inject from "../../core/di/inject";
import { ISerializable } from "../../core/ISerializable";
import { ViewModelDeep } from "../../core/mobx/ViewModelDeep";
import { TodoClient, TodoClientKey } from "./TodoClient";
import { TodoModel } from "./TodoModel";

export const TodoServiceKey = Symbol("TodoService");

@defineService(TodoServiceKey)
export class TodoService implements ISerializable {
    constructor(@inject(TodoClientKey) private client: TodoClient) {}

    public fetchTodoById = async (id: string): Promise<TodoModel> => {
        return this.client.fetchTodoById(id);
    }

    public fetchTodosByIds = async (ids: Set<string>): Promise<TodoModel[]> => {
        return this.client.fetchTodosByIds(ids);
    }

    public async *fetchTodoPaginatableList(ids?: Set<string>, pageSize = 10): AsyncIterableIterator<TodoModel[]> {
        let token = null;
    
        while (true) {
            const { nextPageToken, todos } = await this.client.fetchNextPage(ids, token, pageSize) as any;
        
            if (nextPageToken) {
                token = nextPageToken;
            } else {
                yield todos;
                return;
            }
        
            yield todos;
        }
    }

    public addTodo = async (todo: ViewModelDeep<TodoModel>): Promise<TodoModel> => {
        return this.client.addTodo(new TodoModel(todo));
    }

    public softDeleteTodo = async (id: string): Promise<TodoModel> => {
        return this.client.softDeleteTodo(id);
    }

    public undeleteTodo = async (id: string): Promise<TodoModel> => {
        return this.client.undeleteTodo(id);
    }

    public hardDeleteTodo = async (id: string): Promise<void> => {
        return this.client.hardDeleteTodo(id);
    }

    public updateTodo = async (todo: TodoModel): Promise<TodoModel> => {
        return this.client.updateTodo(todo);
    }

    public toObject(): Object {
        return {}
    }
}
