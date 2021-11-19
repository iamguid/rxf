import "reflect-metadata";
import { autorun } from "mobx";
import { SoftDeletableModelBox } from "./core/mobx/SoftDeletableModelBox";
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
    const boxedNewTodo = new SoftDeletableModelBox(newTodo);
    const viewNewTodo = createViewModelDeep(boxedNewTodo);

    viewNewTodo.caption = "Todo #1";
    viewNewTodo.description = "First todo";

    const createTodoResult = await todoStore.createTodo(viewNewTodo);

    console.log(createTodoResult === viewNewTodo.model)

    autorun(() => {
        console.log("isDeleted: ", (viewNewTodo.model as SoftDeletableModelBox<TodoModel>).isDeleted);
    })

    const deleteTodoResult = await todoStore.softDeleteTodo(createTodoResult.get().id!);
    const undeleteTodoResult = await todoStore.undeleteTodo(createTodoResult.get().id!);
}

createTodos(10);