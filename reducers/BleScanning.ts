import {Device} from 'react-native-ble-plx';

export type BleScanningState = {
  scanning: boolean;
  devices: Map<string, Device>;
  error: Error | null;
};

export enum BleScanningTypes {
  SCANNING = 'scanning',
  DEVICES = 'devices',
  ERROR = 'error',
}

export type BleScanningAction =
  | {type: BleScanningTypes.SCANNING; payload: boolean}
  | {type: BleScanningTypes.DEVICES; payload: Map<string, Device>}
  | {type: BleScanningTypes.ERROR; payload: Error | null};

export const bleScanningReducer = (
  state: BleScanningState,
  action: BleScanningAction,
): BleScanningState => {
  switch (action.type) {
    case BleScanningTypes.SCANNING:
      return {...state, scanning: action.payload};
    case BleScanningTypes.DEVICES:
      return {...state, devices: action.payload};
    case BleScanningTypes.ERROR:
      return {...state, error: action.payload};
  }
};

export const bleScanningInitialState: BleScanningState = {
  scanning: false,
  devices: new Map<string, Device>(),
  error: null,
};
