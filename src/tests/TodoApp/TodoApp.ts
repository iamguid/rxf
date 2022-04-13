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
        const newTodo = this.todoStore.buildNewTodo({
            caption: "Todo #1",
            description: "First todo",
            deleted: false,
        });

        autorun(() => {
            console.log("newTodo isDeleted: ", newTodo.model.get().deleted);
        })

        const createTodoResult = await this.todoStore.createTodo(newTodo);

        console.log("createTodoResult is equals to newTodo.model", createTodoResult === newTodo.model)

        autorun(() => {
            console.log("createTodoResult isDeleted: ", createTodoResult.get().deleted);
        })

        await this.todoStore.softDeleteTodo(createTodoResult.get().id!);
        await this.todoStore.undeleteTodo(createTodoResult.get().id!);
    }
}