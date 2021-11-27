import defineSingletone from "../../core/di/defineSingletone";
import { ITodoModel, TodoModel } from "./TodoModel";

export const TodoClientKey = Symbol("TodoClient");

@defineSingletone(TodoClientKey)
export class TodoClient {
    private todos: Map<string, TodoModel> = new Map();
    private lastId: number = 0;

    public async fetchTodoById(id: string): Promise<TodoModel> {
        const todo = this.todos.get(id)!;
        const todoCopy = new TodoModel(todo.toObject());

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(todoCopy);
            }, 1000);
        });
    }

    public async fetchTodosByIds(ids: Set<string>): Promise<TodoModel[]> {
        const result = Array.from(ids.values())
            .map(id => this.todos.get(id)!)
            .map(todo => new TodoModel(todo.toObject()))

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(result);
            }, 1000);
        });
    }

    public async fetchNextPage(ids?: Set<string>, pageToken?: string, pageSize = 2): Promise<{ nextPageToken?: string, todos: TodoModel[] }> {
        const offset = pageToken ? Number.parseInt(pageToken, 10) : 0;
        const array = Array.from(this.todos.values())
            .filter(todo => ids ? ids.has(todo.id!) : true)
            .map(todo => new TodoModel(todo.toObject()));

        const resultArray = array.slice(offset, offset + pageSize);

        let nextPageToken = offset + pageSize < array.length 
            ? `${(pageToken ? Number.parseInt(pageToken, 10) : 0) + pageSize}`
            : undefined;

        const result = {
            nextPageToken,
            todos: resultArray
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(result);
            }, 1000);
        });
    }

    public async addTodo(todo: ITodoModel): Promise<TodoModel> {
        const id = (this.lastId++).toString();
        const newTodo: TodoModel = new TodoModel(todo);
        newTodo.id = id;
        this.todos.set(id, newTodo);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(newTodo);
            }, 1000);
        });
    }

    public async softDeleteTodo(id: string): Promise<TodoModel> {
        const deletedTodo = this.todos.get(id)!;
        deletedTodo.deleted = true;
        const deletedTodoCopy = new TodoModel(deletedTodo.toObject());

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(deletedTodoCopy);
            }, 1000);
        });
    }

    public async undeleteTodo(id: string): Promise<TodoModel> {
        const deletedTodo = this.todos.get(id)!;
        deletedTodo.deleted = false;
        const deletedTodoCopy = new TodoModel(deletedTodo.toObject());

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(deletedTodoCopy);
            }, 1000);
        });
    }

    public async hardDeleteTodo(id: string): Promise<void> {
        this.todos.delete(id);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    public async updateTodo(todo: TodoModel): Promise<TodoModel> {
        const copy = new TodoModel(todo);
        this.todos.set(todo.id!, copy)!

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(copy);
            }, 1000);
        });
    }
}
