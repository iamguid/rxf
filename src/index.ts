import "reflect-metadata";
import { autorun } from "mobx";
import { SoftDeletableBox } from "./core/mobx/SoftDeletableBox";
import { createViewModelDeep } from "./core/mobx/ViewModelDeep";
import { TodoClient } from "./tests/TodoApp/TodoClient";
import { TodoStore } from "./tests/TodoApp/TodoDataStore";
import { TodoModel } from "./tests/TodoApp/TodoModel";
import { TodoService } from "./tests/TodoApp/TodoService";

const todoClient = new TodoClient();
const todoService = new TodoService(todoClient);
const todoStore = new TodoStore(todoService);

async function createTodos(count: number) {
    const newTodo = new TodoModel();
    const boxedTodo = new SoftDeletableBox(newTodo);
    const view = createViewModelDeep(boxedTodo);

    autorun(() => {
        console.log("isDeleted: ", (view.model as SoftDeletableBox<TodoModel>).isDeleted);
    })

    view.caption = "Todo #1";
    view.description = "First todo";

    const result = await todoStore.createTodo(view);

    (view.model as any).delete();
    (view.model as any).undelete();
}

createTodos(10);