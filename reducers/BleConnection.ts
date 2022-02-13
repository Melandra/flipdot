export type BleConnectionState = {
  connecting: boolean;
  error: Error | null;
};

export enum BleConnectionTypes {
  CONNECTING = 'connecting',
  ERROR = 'error',
}

export type BleConnectionAction =
  | {type: BleConnectionTypes.CONNECTING; payload: boolean}
  | {type: BleConnectionTypes.ERROR; payload: Error | null};

export const bleConnectionReducer = (
  state: BleConnectionState,
  action: BleConnectionAction,
): BleConnectionState => {
  switch (action.type) {
    case BleConnectionTypes.CONNECTING:
      return {...state, connecting: action.payload};
    case BleConnectionTypes.ERROR:
      return {...state, error: action.payload};
  }
};

export const bleConnectionInitialState: BleConnectionState = {
    connecting: false,
    error: null,
  };
