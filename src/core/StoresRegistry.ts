// import { IDataStore } from "./store/IDataStore";
// import { IModel } from "./IModel";
// import { IStateStore } from "./store/IStateStore";

// export class StoresRegistry {
//     private dataStores: Record<string, IDataStore> = {};
//     private stateStores: Record<string, IStateStore> = {};

//     public addDataStore(store: IDataStore) {
//         if (this.dataStores[store.name]) {
//             throw new Error(`Data store ${store.name} already exists`);
//         }

//         this.dataStores[store.name] = store;
//     }

//     public getDataStore(name: string): IDataStore {
//         if (!this.dataStores[name]) {
//             throw new Error(`Data store ${name} not found`);
//         }

//         return this.dataStores[name];
//     }

//     public addStateStore(store: IStateStore) {
//         if (this.stateStores[store.name]) {
//             throw new Error(`State store ${store.name} already exists`);
//         }

//         this.stateStores[store.name] = store;
//     }

//     public getStateStore(name: string): IStateStore {
//         if (!this.stateStores[name]) {
//             throw new Error(`State store ${name} not found`);
//         }

//         return this.stateStores[name];
//     }

//     public toObject(): Object {
//         return {}
//     }
// }