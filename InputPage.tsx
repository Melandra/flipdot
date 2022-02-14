import React, {
  useEffect,
  useReducer,
  useCallback,
  Dispatch,
  useState,
} from 'react';
import {Device} from 'react-native-ble-plx';
import styled from 'styled-components/native';
import {Buffer} from 'buffer';
import {Input} from './Components/Input';
import {Button} from 'react-native';
import {
  bleConnectionReducer,
  bleConnectionInitialState,
  BleConnectionTypes,
} from './reducers/BleConnection';
import {ErrorToast} from './Components/ErrorToast';
import {Loader} from './Components/Loader';
import {InputsAction, InputsState, InputsTypes} from './reducers/Inputs';
import {
  checkedReducer,
  CheckedType,
  initialCheckedState,
} from './reducers/Checked';

const SERVICE_ID = '49d0ea01-5b80-4056-aee7-a23ea1d1bec6';
const CHARACTERISTIC_ID = '49d0ea02-5b80-4056-aee7-a23ea1d1bec6';

const StyledContainer = styled.View`
  height: 100%;
  display: flex;
`;

const ButtonContainer = styled.TouchableOpacity`
  width: 70%;
  margin-top: 26px;
  border-radius: 10px;
  align-self: center;
  overflow: hidden;
`;

type Props = {
  inputsState: InputsState;
  dispatchInputs: Dispatch<InputsAction>;
  device?: Device;
};
export const InputPage: React.VFC<Props> = ({
  inputsState,
  dispatchInputs,
  device,
}: Props) => {
  const [bleConnection, dispatchBleConnection] = useReducer(
    bleConnectionReducer,
    bleConnectionInitialState,
  );
  const [checked, dispatchChecked] = useReducer(
    checkedReducer,
    initialCheckedState,
  );
  const [sendError, setSendError] = useState<Error | null>(null);

  const connectToDevice = useCallback((dev: Device) => {
    dev
      .isConnected()
      .then((isConnected: boolean) => {
        if (!isConnected) {
          dispatchBleConnection({
            type: BleConnectionTypes.CONNECTING,
            payload: true,
          });
          dev
            .connect({requestMTU: 187})
            .then(() => {
              dispatchBleConnection({
                type: BleConnectionTypes.CONNECTING,
                payload: false,
              });
            })
            .catch(exception => {
              dispatchBleConnection({
                type: BleConnectionTypes.CONNECTING,
                payload: false,
              });
              dispatchBleConnection({
                type: BleConnectionTypes.ERROR,
                payload: new Error(exception.toString()),
              });
            });
        } else {
          dispatchBleConnection({
            type: BleConnectionTypes.CONNECTING,
            payload: false,
          });
        }
      })
      .catch(exception => {
        dispatchBleConnection({
          type: BleConnectionTypes.ERROR,
          payload: new Error(exception.toString()),
        });
      });
  }, []);

  useEffect(() => {
    if (device) {
      connectToDevice(device);
    }
    return () => {
      device?.cancelConnection();
    };
  }, [connectToDevice, device]);

  const writeToDeviceCharacteristic = (
    message: string,
    total: number,
    index: number,
  ) => {
    if (device) {
      const payload = Buffer.from(
        `0${inputsState.oldPassword}${inputsState.newPassword}${total}${index}0${message}`,
      ).toString('base64');
      device
        .discoverAllServicesAndCharacteristics()
        .then(deviceWithServices => {
          deviceWithServices.writeCharacteristicWithResponseForService(
            SERVICE_ID,
            CHARACTERISTIC_ID,
            payload,
          );
        })
        .catch(exception => {
          setSendError(new Error(exception.toString()));
        });
    }
  };

  const send = () => {
    const messages = [];
    for (const [key, value] of Object.entries(checked)) {
      if (value) {
        switch (key) {
          case 'value1':
            messages.push(inputsState.value1);
            break;
          case 'value2':
            messages.push(inputsState.value2);
            break;
          case 'value3':
            messages.push(inputsState.value3);
            break;
        }
      }
    }

    const nrOfMessages = messages.length;
    messages.forEach((message: string, index: number) => {
      writeToDeviceCharacteristic(message, nrOfMessages, index + 1);
    });
  };

  /*  if (!device) {
    return null;
  } */

  return (
    <StyledContainer>
      {bleConnection.connecting && <Loader />}
      {bleConnection.error && (
        <ErrorToast message={bleConnection.error.message} />
      )}
      {sendError && <ErrorToast message={sendError.message} />}
      <Input
        label="Alter Pin (4 Buchstaben)"
        value={inputsState.oldPassword}
        setValue={(value: string) => {
          dispatchInputs({type: InputsTypes.OLD_PASSWORD, payload: value});
        }}
        showCheckbox={false}
      />
      <Input
        label="Neuer Pin (4 Buchstaben)"
        value={inputsState.newPassword}
        setValue={(value: string) => {
          dispatchInputs({type: InputsTypes.NEW_PASSWORD, payload: value});
        }}
        showCheckbox={false}
      />
      <Input
        label="Eingabe 1"
        value={inputsState.value1}
        setValue={(value: string) => {
          dispatchInputs({type: InputsTypes.VALUE1, payload: value});
        }}
        showCheckbox={true}
        checkboxValue={checked.value1}
        onCheckChange={() => {
          dispatchChecked({
            type: CheckedType.V1,
            payload: !checked.value1,
          });
        }}
      />
      <Input
        label="Eingabe 2"
        value={inputsState.value2}
        setValue={(value: string) => {
          dispatchInputs({type: InputsTypes.VALUE2, payload: value});
        }}
        showCheckbox={true}
        checkboxValue={checked.value2}
        onCheckChange={() => {
          dispatchChecked({
            type: CheckedType.V2,
            payload: !checked.value2,
          });
        }}
      />
      <Input
        label="Eingabe 3"
        value={inputsState.value3}
        setValue={(value: string) => {
          dispatchInputs({type: InputsTypes.VALUE3, payload: value});
        }}
        showCheckbox={true}
        checkboxValue={checked.value3}
        onCheckChange={() => {
          dispatchChecked({
            type: CheckedType.V3,
            payload: !checked.value3,
          });
        }}
      />
      <ButtonContainer>
        <Button title="Senden" onPress={send} />
      </ButtonContainer>
    </StyledContainer>
  );
};
