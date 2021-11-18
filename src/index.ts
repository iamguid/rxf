import { observable } from "mobx";
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
    const boxedTodo = observable.box(newTodo);
    const view = createViewModelDeep(boxedTodo);

    view.caption = "Todo #1";
    view.description = "First todo";

    const result = await todoStore.createTodo(view);

    result.get();

    console.log(result)
}

createTodos(10);