import { ISerializable } from "./ISerializable";

export interface IModel extends ISerializable {
    clone: () => IModel;
}
