import { IModel } from "../../core/IModel";

export interface ITodoModel {
    id?: string;
    caption: string;
    description: string;
    deleted: boolean;
}

export class TodoModel implements ITodoModel, IModel {
    public id?: string;
    public caption: string;
    public description: string;
    public deleted: boolean;

    public constructor(obj?: ITodoModel) {
        if (obj) {
            this.id = obj.id;
            this.caption = obj.caption;
            this.description = obj.description;
            this.deleted = obj.deleted;
        }
    }

    public clone() {
        return new TodoModel(this.toObject())
    }

    public toObject(): ITodoModel {
        return {
            id: this.id,
            caption: this.caption,
            description: this.description,
            deleted: this.deleted
        }
    }
}
