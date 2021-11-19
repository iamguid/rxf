import "reflect-metadata";
import { container } from "tsyringe";
import { TodoApp } from "./tests/TodoApp/TodoApp";

const todoApp = container.resolve(TodoApp)
todoApp.run();
