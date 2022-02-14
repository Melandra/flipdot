type CheckedState = {
  value1: boolean;
  value2: boolean;
  value3: boolean;
};

export enum CheckedType {
  'V1' = 'value1',
  'V2' = 'value2',
  'V3' = 'value3',
}

type CheckedAction = {
  type: CheckedType;
  payload: boolean;
};

export const checkedReducer = (state: CheckedState, action: CheckedAction) => {
  switch (action.type) {
    case CheckedType.V1:
      return {...state, value1: action.payload};
    case CheckedType.V2:
      return {...state, value2: action.payload};
    case CheckedType.V3:
      return {...state, value3: action.payload};
  }
};
export const initialCheckedState = {
  value1: false,
  value2: false,
  value3: false,
};
