import { autorun } from "mobx";
import { singleton } from "tsyringe";
import inject from "../../core/di/inject";
import { ISoftDeletableModelBox } from "../../core/mobx/SoftDeletableModelBox";
import { createViewModelDeep } from "../../core/mobx/ViewModelDeep";
import { TodoDataStore, TodoStoreKey } from "./TodoDataStore";
import { TodoModel } from "./TodoModel";

@singleton()
export class TodoApp {
    private todoStore: TodoDataStore;

    constructor(@inject(TodoStoreKey) todoStore: TodoDataStore) {
        this.todoStore = todoStore
    }

    public async createTodos(count: number) {
        const promises: Promise<ISoftDeletableModelBox<TodoModel>>[] = [];

        for (let index = 0; index < count; index++) {
            const newTodo = new TodoModel();
            const newTodoView = createViewModelDeep(newTodo);
            newTodoView.caption = `Todo #${index}`;
            newTodoView.description = `Todo description of ${index}`;
            newTodoView.deleted = false;
            promises.push(this.todoStore.createTodo(newTodoView));
        }

        return await Promise.all(promises);
    }

    public async run() {
        // Create 1000 todos
        const todos = await this.createTodos(10);

        // Compare first todos
        {
            const firstTodo = todos[0].get();
            const firstLoadedTodo = await this.todoStore.loadTodo(firstTodo.id!);
            console.log("loaded todo is equals to exists todo", firstTodo === firstLoadedTodo.get())
        }

        // Load multiple todos by one
        {
            const firstTodo = todos[0].get();
            const secondTodo = todos[1].get();
            const thirdTodo = todos[2].get();

            const todosIds = new Set([firstTodo.id!, secondTodo.id!, thirdTodo.id!]);

            const loadedTodos = await this.todoStore.loadTodosByOne(todosIds);
            const iterator = loadedTodos.get();

            const firstLoadedTodo = await iterator.next();
            const secondLoadedTodo = await iterator.next();
            const thirdLoadedTodo = await iterator.next();

            console.log("first loaded todo is equals to first exist todo", firstTodo === firstLoadedTodo.value.get())
            console.log("second loaded todo is equals to second exist todo", secondTodo === secondLoadedTodo.value.get())
            console.log("third loaded todo is equals to third exist todo", thirdTodo === thirdLoadedTodo.value.get())
        }

        // Batch load multiple todos
        {
            const firstTodo = todos[0].get();
            const secondTodo = todos[1].get();
            const thirdTodo = todos[2].get();

            const todosIds = new Set([firstTodo.id!, secondTodo.id!, thirdTodo.id!]);

            const loadedTodos = await this.todoStore.loadTodosBatch(todosIds);
            const iterator = loadedTodos.get();

            const firstLoadedTodo = await iterator.next();
            const secondLoadedTodo = await iterator.next();
            const thirdLoadedTodo = await iterator.next();

            console.log("first loaded todo is equals to first exist todo", firstTodo === firstLoadedTodo.value.get())
            console.log("second loaded todo is equals to second exist todo", secondTodo === secondLoadedTodo.value.get())
            console.log("third loaded todo is equals to third exist todo", thirdTodo === thirdLoadedTodo.value.get())
        }

        // Batch load multiple todos
        {
            const firstTodo = todos[0].get();
            const secondTodo = todos[1].get();
            const thirdTodo = todos[2].get();

            const todosIds = new Set([firstTodo.id!, secondTodo.id!, thirdTodo.id!]);

            const loadedTodos = await this.todoStore.loadTodosBatch(todosIds);
            const iterator = loadedTodos.get();

            const firstLoadedTodo = await iterator.next();
            const secondLoadedTodo = await iterator.next();
            const thirdLoadedTodo = await iterator.next();

            console.log("first loaded todo is equals to first exist todo", firstTodo === firstLoadedTodo.value.get())
            console.log("second loaded todo is equals to second exist todo", secondTodo === secondLoadedTodo.value.get())
            console.log("third loaded todo is equals to third exist todo", thirdTodo === thirdLoadedTodo.value.get())
        }

        // Load all todos
        {
            const iterator = this.todoStore.loadTodosAll().get();

            let index = 0;
            for await (const item of iterator) {
                const todo: TodoModel = item.get();
                console.log(`todo ${todo.id} is equal to ${index} model`, todos[index].get() === todo);
                index++;
            }
        }

        // All todos and soft delete
        {
            const disposer = autorun(async () => {
                const iterator = this.todoStore.loadTodosAll().get();
                const firstItem = (await iterator.next()).value as ISoftDeletableModelBox<TodoModel>;
                console.log(`First todo is ${firstItem.get().caption}, todo is deleted: ${firstItem.isDeleted}`)
            })

            await this.todoStore.softDeleteTodo('0');

            disposer();
        }

        // First todo and update
        {
            const firstTodo = await this.todoStore.loadTodo('0')

            autorun(() => {
                const firstTodoUnwrapped = firstTodo.get();
                console.log(`First todo is ${firstTodoUnwrapped.caption} ${firstTodoUnwrapped.description}`)
            })

            const firstTodoEdited = (await this.todoStore.loadTodo('0')).get();
            const viewFirstTodoEdited = createViewModelDeep(firstTodoEdited);
            viewFirstTodoEdited.description = "some description"

            await this.todoStore.updateTodo(viewFirstTodoEdited);
        }
    }
}