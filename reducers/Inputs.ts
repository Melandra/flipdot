export type InputsState = {
  oldPassword: string;
  newPassword: string;
  value1: string;
  value2: string;
  value3: string;
};

export enum InputsTypes {
  OLD_PASSWORD = 'oldPassword',
  NEW_PASSWORD = 'newPassword',
  VALUE1 = 'value1',
  VALUE2 = 'value2',
  VALUE3 = 'value3',
}

export type InputsAction = {type: InputsTypes; payload: string};

export const inputsReducer = (
  state: InputsState,
  action: InputsAction,
): InputsState => {
  switch (action.type) {
    case InputsTypes.OLD_PASSWORD:
      return {...state, oldPassword: action.payload};
    case InputsTypes.NEW_PASSWORD:
      return {...state, newPassword: action.payload};
    case InputsTypes.VALUE1:
      return {...state, value1: action.payload};
    case InputsTypes.VALUE2:
      return {...state, value2: action.payload};
    case InputsTypes.VALUE3:
      return {...state, value3: action.payload};
  }
};

export const inputsInitialState: InputsState = {
  oldPassword: '',
  newPassword: '',
  value1: '',
  value2: '',
  value3: '',
};
