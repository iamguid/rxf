import { IObservableValue, makeAutoObservable } from "mobx";
import diff from "../diff/diff";
import { IModel } from "../IModel";

export type ViewModelDeep<TModel extends IModel> = TModel & IViewModelDeepClass<TModel>;

export interface IViewModelDeepClass<TModel extends IModel> {
    model: TModel;
    reset(): void;
    isDirty: boolean;
}

export class ViewModelDeepClass<TModel extends IModel> implements IViewModelDeepClass<TModel> {
    public readonly model: TModel;
    private copyObj: IModel;

    constructor(model: TModel) {
        this.model = model;
        const copyObj = this.model.clone().toObject();
        this.copyObj = makeAutoObservable(copyObj) as IModel;
    }

    public reset = () => {
        this.copyObj = this.model.clone() as IModel;
    };

    public get isDirty() {
      const modelObj = this.model.toObject();
      const cloneModelObj = this.copyObj.toObject();
      const patch = diff(modelObj, cloneModelObj);
      return patch.length > 0;
    }
}

export function createViewModelDeep<T extends IModel>(model: T): ViewModelDeep<T> {
  const clazz = new ViewModelDeepClass(model) as any;

  return new Proxy(clazz, {
    get(target: any, p: PropertyKey): any {
      if (p in clazz) {
        return clazz[p];
      } else {
        return clazz.copyObj[p];
      }
    },
    set(target: any, p: PropertyKey, value: any): boolean {
      clazz.copyObj[p] = value;
      return true;
    },
  });
}
