import { autorun } from "mobx";
import { singleton } from "tsyringe";
import inject from "../../core/di/inject";
import { TodoStore, TodoStoreKey } from "./TodoDataStore";

@singleton()
export class TodoApp {
    private todoStore: TodoStore;

    constructor(@inject(TodoStoreKey) todoStore: TodoStore) {
        this.todoStore = todoStore
    }

    public async run() {
        const newTodo = this.todoStore.buildNewTodo();
        newTodo.caption = "Todo #1";
        newTodo.description = "First todo";

        const createTodoResult = await this.todoStore.createTodo(newTodo);

        console.log("createTodoResult is equals to newTodo.model", createTodoResult === newTodo.model)

        autorun(() => {
            console.log("isDeleted: ", createTodoResult.isDeleted);
        })

        await this.todoStore.softDeleteTodo(createTodoResult.get().id!);
        await this.todoStore.undeleteTodo(createTodoResult.get().id!);
    }
}