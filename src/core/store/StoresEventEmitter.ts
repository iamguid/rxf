import EventEmitter = require("events");
import { singleton } from "tsyringe";
export const StoresEventEmitterKey = Symbol("StoresEventEmitter");

@singleton()
export default class StoresEventEmitter extends EventEmitter {}
