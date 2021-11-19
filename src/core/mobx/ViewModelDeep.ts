import { IObservableValue, makeAutoObservable } from "mobx";
import diff from "../diff/diff";
import { IModel } from "../IModel";
import { BoxedModel } from "../store/IDataStoreAccessor";

export type ViewModelDeep<TModel extends IModel> = TModel & IViewModelDeepClass<TModel>;

export interface IViewModelDeepClass<TModel extends IModel> {
    model: BoxedModel<TModel>;
    reset(): void;
    isDirty: boolean;
}

export class ViewModelDeepClass<TModel extends IModel> implements IViewModelDeepClass<TModel> {
    public readonly model: BoxedModel<TModel>;
    private copyObj: TModel;

    constructor(model: BoxedModel<TModel>) {
        this.model = model;
        const copyObj = this.model.get().clone().toObject();
        this.copyObj = makeAutoObservable(copyObj) as TModel;
    }

    public reset = () => {
        this.copyObj = this.model.get().clone() as TModel;
    };

    public get isDirty() {
      const modelObj = this.model.get().toObject();
      const cloneModelObj = this.copyObj.toObject();
      const patch = diff(modelObj, cloneModelObj);
      return patch.length > 0;
    }
}

export function createViewModelDeep<T extends IModel>(model: BoxedModel<T>): ViewModelDeep<T> {
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
