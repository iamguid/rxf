export interface IBaseEvent<TType, TPayload = null> {
    type: TType;
    payload: TPayload;
}
