import defineService from "../../core/di/defineService";
import { TodoClient } from "./TodoClient";
import { TodoModel } from "./TodoModel";

@defineService()
export class TodoService {
    constructor(private client: TodoClient) {}

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

    public addTodo = async (todo: TodoModel): Promise<TodoModel> => {
        return this.client.addTodo(todo);
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
}
