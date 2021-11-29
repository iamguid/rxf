import { singleton } from "tsyringe";
import { EventEmitter } from "../EventEmitter";

@singleton()
export class StoresEventEmitter extends EventEmitter {}
